// ==UserScript==
// @name         GPT4Free Page Summarizer
// @version      1.9.4
// @description  Summarize webpage, selected text or YouTube transcript via local API
// @author       SH3LL
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/532414/GPT4Free%20Page%20Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/532414/GPT4Free%20Page%20Summarizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Globals ===
    let loading = false;
    let ytTranscript = null;
    let isSidebarVisible = false;
    let isTextSelected = false;
    let hoverTimeout;
    const isYouTubeVideoPage = window.location.hostname.includes("youtube.com") && window.location.pathname === "/watch";
    const browserLanguage = navigator.language;
    const selectedLanguage = getDisplayLanguage(browserLanguage);
    const modelProviderPairs = [
        { label: 'PollinationsAI / gpt-5-mini', model: 'gpt-5-mini', provider: 'PollinationsAI' },
        { label: 'OIVSCodeSer2 / gpt-4o-mini', model: 'gpt-4o-mini', provider: 'OIVSCodeSer2' },
        { label: 'OIVSCodeSer0501 / gpt-4o-mini', model: 'gpt-4o-mini', provider: 'OIVSCodeSer0501' },
        { label: 'DeepInfra / openai/gpt-oss-120b', model: 'openai/gpt-oss-120b', provider: 'DeepInfra' },
    ];
    let selectedModel = modelProviderPairs[0].model;
    let selectedProvider = modelProviderPairs[0].provider;


    // === Init DOM UI ===
    const { shadowRoot, sidebar, toggleButton, summarizeButton, statusDisplay, summaryContainer } = createSidebarUI();
    document.body.appendChild(shadowRoot.host);
    setTimeout(() => {
        toggleButton.style.opacity = '0.3';
    }, 2000);

    // === Start transcript load if on YouTube ===
    if (isYouTubeVideoPage) {
        triggerTranscriptLoad();
    }

    function triggerTranscriptLoad() {
        loadYouTubeTranscript().then(transcript => {
            ytTranscript = transcript;
            console.log("YOUTUBE Transcript:", transcript);
            updateButtonText();
        }).catch(err => {
            console.warn("Transcript not found:", err);
            ytTranscript = null;
            updateButtonText();

            // Mostra messaggio arancione nel contenitore dei summary
            summaryContainer.style.display = 'block';
            summaryContainer.textContent = '⚠️ The video has no subtitles';
            summaryContainer.style.color = 'orange';
        });
    }



    // === Add Event Listeners ===
    document.addEventListener('mouseup', updateButtonText);
    document.addEventListener('mousedown', () => setTimeout(updateButtonText, 100));
    toggleButton.addEventListener('click', toggleSidebar);
    toggleButton.addEventListener('mouseover', () => {
        clearTimeout(hoverTimeout);
        toggleButton.style.opacity = '1';
    });

    toggleButton.addEventListener('mouseout', () => {
        hoverTimeout = setTimeout(() => {
            if (!isSidebarVisible) toggleButton.style.opacity = '0.3';
        }, 3000);
    });
    summarizeButton.addEventListener('click', handleSummarizeClick);

    // === Initial button text ===
    updateButtonText();
    updateStatusDisplay('Idle', '#888888');

    // === Language Utility ===
    function getDisplayLanguage(langCode) {
        try {
            const name = new Intl.DisplayNames([langCode], { type: 'language' }).of(langCode);
            return name || langCode;
        } catch {
            return langCode;
        }
    }

    // === Summarize Request ===
    function summarizePage(text, lang) {
        return new Promise((resolve, reject) => {
            const prompt = `Summarize the following text in ${lang}. The summary is organised in blocks of topics.
                            Return the result in a json list composed of dictionaries with fields "title" (the title starts with a contextual modern/colored emoji) and "text".
                            Don't add any other sentence like "Here is the summary".
                            Don't add any coding formatting/header like \"\`\`\`json\".
                            Don't add any formatting to title or text, no formatting at all".
                            Exclude from the summary any advertisement, collaboration, promotion or sponsorization.
                            Here is the text: ${text}`;

            const payload = {
                messages: [{ role: 'user', content: prompt }],
                model: selectedModel,
                provider: selectedProvider
            };


            GM.xmlHttpRequest({
                method: 'POST',
                url: 'http://localhost:1337/v1/chat/completions',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(payload),
                onload: response => {
                    const color = (response.status >= 200 && response.status < 300) ? '#00ff00' : '#ffcc00';
                    console.log(response.responseText);
                    resolve({ status: response.status, responseText: response.responseText.replaceAll("```json\\n", "").replaceAll("```\\n", "").replaceAll("```", ""), color });
                },
                onerror: err => reject({ message: 'Network error', color: '#ff4444' })
            });
        });
    }

    // === YouTube Transcript Extraction ===
    function loadYouTubeTranscript() {
        return new Promise((resolve, reject) => {
            const waitForCaptions = setInterval(() => {
                const response = window.ytInitialPlayerResponse;
                const tracks = response?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
                if (tracks.length) {
                    clearInterval(waitForCaptions);
                    const track = tracks.find(t => t.kind !== 'asr') || tracks[0];
                    fetch(track.baseUrl)
                        .then(res => res.text())
                        .then(xml => {
                        const doc = new DOMParser().parseFromString(xml, "text/xml");
                        const texts = [...doc.getElementsByTagName("text")].map(t => t.textContent.trim());
                        resolve(texts.join(" "));
                    })
                        .catch(err => reject("Errore nel fetch: " + err));
                }
            }, 300);

            setTimeout(() => {
                clearInterval(waitForCaptions);
                reject("Timeout: nessun sottotitolo trovato.");
            }, 8000);
        });
    }

    // === Sidebar Toggle ===
    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
        sidebar.style.right = isSidebarVisible ? '0' : '-300px';
        toggleButton.style.right = isSidebarVisible ? '300px' : '0';

        setTimeout(() => {
            toggleButton.style.opacity = isSidebarVisible ? '1' : '0.3';
        }, 1000);
    }

    // === UI Updates ===
    function updateButtonText() {
        if (loading) {
            summarizeButton.textContent = 'Loading..';
            return;
        }

        const selectedText = window.getSelection().toString();
        if (selectedText) {
            summarizeButton.textContent = `Summary [${selectedText.substring(0, 2).trim()}..]`;
            isTextSelected = true;
        } else if (isYouTubeVideoPage) {
            if (ytTranscript && ytTranscript.trim().length > 0) {
                summarizeButton.textContent = 'Summary 📹️';
            } else {
                summarizeButton.textContent = 'Summary';
            }
            isTextSelected = false;
        } else {
            summarizeButton.textContent = 'Summary';
            isTextSelected = false;
        }
    }


    function updateStatusDisplay(text, color) {
        while (statusDisplay.firstChild) {
            statusDisplay.removeChild(statusDisplay.firstChild);
        }
        const statusLabel = document.createElement('span');
        statusLabel.textContent = 'Status: ';
        const statusText = document.createElement('span');
        statusText.textContent = text;
        statusText.style.color = color;
        const langLabel = document.createElement('span');
        langLabel.textContent = ' | Lang: ';
        const langText = document.createElement('span');
        langText.textContent = selectedLanguage;
        langText.style.color = '#00bfff';

        statusDisplay.appendChild(statusLabel);
        statusDisplay.appendChild(statusText);
        statusDisplay.appendChild(langLabel);
        statusDisplay.appendChild(langText);
    }

    function craftJson(jsonData) {
        const container = document.createElement('div');

        JSON.parse(jsonData).forEach(block => {
            const title = document.createElement('strong');
            title.textContent = block.title;

            const text = document.createElement('div');
            text.textContent = block.text;

            container.appendChild(title);
            container.appendChild(text);
            container.appendChild(document.createElement('br'));
        });

        return container;
    }

    function handleSummarizeClick() {
        if (loading) return;

        updateButtonText();
        updateStatusDisplay('Requesting..', '#888888');
        summaryContainer.style.display = 'none';

        let content = '';
        if (isYouTubeVideoPage && ytTranscript && isTextSelected!=true) {
            content = ytTranscript;
        } else if (isTextSelected) {
            content = window.getSelection().toString();
        } else {
            content = document.body.innerText;
        }

        loading = true;
        summarizeButton.disabled = true;

        summarizePage(content, selectedLanguage)
            .then(({ status, responseText, color }) => {
                try {
                    const json = JSON.parse(responseText);
                    summaryContainer.textContent = ``;
                    summaryContainer.append(craftJson(json.choices[0].message.content));
                    summaryContainer.style.color = '#ffffff';
                    updateStatusDisplay(`Success (${status})`, color);
                } catch (err) {
                    if (JSON.parse(responseText).error.message) {
                        summaryContainer.textContent = 'Error: ' + JSON.parse(responseText).error.message;
                    }else{
                        summaryContainer.textContent = `Error: ${err}`;
                    }
                    summaryContainer.style.color = '#ff4444';
                    updateStatusDisplay(`Failed (${status})`, '#ff4444');
                }
            })
            .catch(err => {
                summaryContainer.textContent = `Error: ${err.message}`;
                summaryContainer.style.color = '#ff4444';
                updateStatusDisplay('Failed', err.color);
            })
            .finally(() => {
                loading = false;
                summarizeButton.disabled = false;
                updateButtonText();
                summaryContainer.style.display = 'block';
            });
    }

    // === UI Construction ===
    function createSidebarUI() {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });

        const sidebar = document.createElement('div');
        Object.assign(sidebar.style, {
            position: 'fixed',
            right: '-300px',
            top: '0',
            width: '300px',
            height: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            padding: '20px',
            zIndex: '999999',
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxSizing: 'border-box',
            transition: 'right 0.3s ease',
            borderLeft: '1px solid #cccccc',
            borderTopLeftRadius: '5px',
            borderBottomLeftRadius: '5px'
        });

        const toggleBtn = document.createElement('button');
        Object.assign(toggleBtn.style, {
            position: 'fixed',
            right: '3px',
            top: '20px',
            width: '40px',
            height: '40px',
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #cccccc',
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            zIndex: '1000000',
            fontSize: '18px',
            transition: 'right 0.3s ease, opacity 0.3s ease, background-color 0.3s ease',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: '0.9'
        });



        const iconSpan = document.createElement('span');
        iconSpan.textContent = '✨';
        iconSpan.style.marginLeft = '5px';
        toggleBtn.appendChild(iconSpan);


        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
        });

        const modelSelect = document.createElement('select');
        modelSelect.style.padding = '6px';
        modelSelect.style.fontSize = '14px';
        modelSelect.style.borderRadius = '4px';
        modelSelect.style.border = '1px solid #ccc';
        modelSelect.style.backgroundColor = '#222';
        modelSelect.style.color = '#fff';

        modelProviderPairs.forEach((pair, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = pair.label;
            modelSelect.appendChild(option);
        });

        modelSelect.addEventListener('change', (e) => {
            const selected = modelProviderPairs[e.target.value];
            selectedModel = selected.model;
            selectedProvider = selected.provider;
        });

        const summarizeBtn = document.createElement('button');
        Object.assign(summarizeBtn.style, {
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #cccccc',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            flex: '1',
            transition: 'background-color 0.3s'
        });

        summarizeBtn.onmouseover = () => summarizeBtn.style.backgroundColor = '#4d4d4d';
        summarizeBtn.onmouseout = () => summarizeBtn.style.backgroundColor = '#333';

        const status = document.createElement('div');
        status.style.fontSize = '12px';



        const summary = document.createElement('div');
        Object.assign(summary.style, {
            fontSize: '14px',
            lineHeight: '1.5',
            display: 'none',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 130px)',
            whiteSpace: 'pre-line'
        });

        container.appendChild(summarizeBtn);
        sidebar.appendChild(modelSelect);
        sidebar.appendChild(container);
        sidebar.appendChild(status);
        sidebar.appendChild(summary);
        root.appendChild(sidebar);
        root.appendChild(toggleBtn);

        return {
            shadowRoot: root,
            sidebar,
            toggleButton: toggleBtn,
            summarizeButton: summarizeBtn,
            statusDisplay: status,
            summaryContainer: summary
        };
    }
})();
