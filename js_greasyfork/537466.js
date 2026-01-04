// ==UserScript==
// @name         Gartic Translator
// @namespace    https://greasyfork.org/en/users/1353946-stragon-x
// @version      1.1
// @license      none
// @description  Translator of sent and received messages Gartic
// @author       STRAGON
// @match        *://gartic.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_log
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      translate.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://biaupload.com/do.php?imgf=org-0ae7c8b0bcad1.jpg
// @downloadURL https://update.greasyfork.org/scripts/537466/Gartic%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/537466/Gartic%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        targetLang: 'fa',
        maxMessages: 5,
        messageQueue: [],
        panelVisible: false,
        translationPanelVisible: false,
        currentGlobalId: ''
    };

    const languages = [
        {code: 'fa', name: 'Persian', flag: '🇮🇷'},
        {code: 'en', name: 'English', flag: '🇬🇧'},
        {code: 'tr', name: 'Turkish', flag: '🇹🇷'},
        {code: 'zh', name: 'Chinese', flag: '🇨🇳'},
        {code: 'es', name: 'Spanish', flag: '🇪🇸'},
        {code: 'ar', name: 'Arabic', flag: '🇸🇦'},
        {code: 'fr', name: 'French', flag: '🇫🇷'},
        {code: 'ru', name: 'Russian', flag: '🇷🇺'},
        {code: 'hi', name: 'Hindi', flag: '🇮🇳'},
        {code: 'pt', name: 'Portuguese', flag: '🇵🇹'},
        {code: 'bn', name: 'Bengali', flag: '🇧🇩'},
        {code: 'de', name: 'German', flag: '🇩🇪'},
        {code: 'ja', name: 'Japanese', flag: '🇯🇵'},
        {code: 'ko', name: 'Korean', flag: '🇰🇷'},
        {code: 'vi', name: 'Vietnamese', flag: '🇻🇳'},
        {code: 'it', name: 'Italian', flag: '🇮🇹'},
    ];

    createToggleButton();

    createMainPanel();

    createTranslationPanel();

    function createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'translator-toggle-btn';
        Object.assign(toggleButton.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '99999',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#FD0031',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        toggleButton.textContent = 'FA';
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener('click', toggleMainPanel);
    }

    function createMainPanel() {
        const panel = document.createElement('div');
        panel.id = 'translator-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: '99998',
            width: '350px',
            background: '#111111',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden',
            display: 'none'
        });

        const header = document.createElement('div');
        header.id = 'translator-panel-header';
        Object.assign(header.style, {
            background: '#FD0031',
            color: 'white',
            padding: '10px 15px',
            cursor: 'move',
            position: 'relative',
            zIndex: '1'
        });
        header.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-weight:bold">Gartic Translator</span>
                <div>
                    <select id="lang-select" style="padding:3px;border-radius:3px;margin-right:10px;background:#fff;color:#000">
                        ${languages.map(lang =>
                            `<option value="${lang.code}" ${lang.code === config.targetLang ? 'selected' : ''}>
                                ${lang.flag} ${lang.name}
                            </option>`
                        ).join('')}
                    </select>
                    <button id="send-message-btn" style="padding:3px 8px;border-radius:3px;border:none;cursor:pointer;background:#fff">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FD0031" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        panel.appendChild(header);

        const body = document.createElement('div');
        body.id = 'translator-panel-body';
        Object.assign(body.style, {
            padding: '15px',
            position: 'relative',
            zIndex: '1'
        });

        const messagesPanel = document.createElement('div');
        messagesPanel.id = 'messages-panel';
        Object.assign(messagesPanel.style, {
            maxHeight: '300px',
            overflowY: 'auto',
            marginTop: '10px',
            position: 'relative'
        });
        messagesPanel.innerHTML = '<div style="color:#fff;text-align:center;padding:10px">Waiting for messages...</div>';

        const statusDiv = document.createElement('div');
        statusDiv.id = 'translator-status';
        Object.assign(statusDiv.style, {
            fontSize: '12px',
            color: '#FD0031',
            marginTop: '10px',
            textAlign: 'center',
            position: 'relative'
        });
        statusDiv.textContent = 'Active';

        body.appendChild(messagesPanel);
        body.appendChild(statusDiv);
        panel.appendChild(body);
        document.body.appendChild(panel);

        document.getElementById('lang-select').addEventListener('change', (e) => {
            config.targetLang = e.target.value;
            GM_setValue('targetLang', e.target.value);
        });

        document.getElementById('send-message-btn').addEventListener('click', toggleTranslationPanel);

        makeDraggable(panel, header);
    }

    function createTranslationPanel() {
        const panel = document.createElement('div');
        panel.id = 'translation-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '80px',
            right: '390px',
            zIndex: '99998',
            width: '300px',
            background: '#111111',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontFamily: 'Arial, sans-serif',
            overflow: 'hidden',
            display: 'none',
            padding: '15px'
        });

        panel.innerHTML = `
            <div style="margin-bottom:10px">
                <textarea id="translation-input" style="width:100%;height:80px;padding:8px;border-radius:5px;border:1px solid #444;background:#222;color:#fff" placeholder="Enter text to translate"></textarea>
            </div>
            <div style="margin-bottom:10px">
                <select id="target-lang-select" style="width:100%;padding:8px;border-radius:5px;border:1px solid #444;background:#222;color:#fff">
                    ${languages.map(lang =>
                        `<option value="${lang.code}">${lang.flag} ${lang.name}</option>`
                    ).join('')}
                </select>
            </div>
            <button id="translate-btn" style="width:100%;padding:8px;background:#FD0031;color:white;border:none;border-radius:5px;cursor:pointer">
                Translate
            </button>
            <div id="translation-result-container" style="margin-top:10px;">
                <div id="translation-result" style="padding:10px;background:#222;border-radius:5px;color:#fff;display:none;cursor:pointer;border:1px solid #444"></div>
                <div id="copy-notification" style="display:none;font-size:12px;color:#FD0031;text-align:center;margin-top:5px;">Copied to clipboard!</div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('translate-btn').addEventListener('click', handleTranslation);

        document.getElementById('translation-result').addEventListener('click', copyTranslationToClipboard);
    }

    function showStatus(message, type) {
        const statusDiv = document.getElementById('translator-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.color = type === 'error' ? '#FD0031' :
                                  type === 'success' ? '#FD0031' : '#FD0031';
        }
    }

    async function translateText(text, targetLang) {
        return new Promise((resolve, reject) => {
            const encodedText = encodeURIComponent(text);
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=${targetLang}&q=${encodedText}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        let translatedText = '';
                        if (data && data[0]) {
                            data[0].forEach(item => {
                                if (item[0]) translatedText += item[0];
                            });
                            resolve(translatedText);
                        } else {
                            reject(new Error('Invalid response from translation server'));
                        }
                    } catch (e) {
                        reject(new Error('خطا در پردازش پاسخ ترجمه'));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Time out'))
            });
        });
    }

    function displayMessage(original, translated) {
        config.messageQueue.unshift({original, translated});

        if (config.messageQueue.length > config.maxMessages) {
            config.messageQueue.pop();
        }

        const messagesPanel = document.getElementById('messages-panel');
        if (!messagesPanel) return;

        messagesPanel.innerHTML = '';
        const container = document.createElement('div');

        config.messageQueue.forEach(msg => {
            const msgDiv = document.createElement('div');
            Object.assign(msgDiv.style, {
                marginBottom: '15px',
                padding: '10px',
                border: '1px solid #444',
                borderRadius: '10px',
                background: '#0F0F0F'
            });

            msgDiv.innerHTML = `
                <div style="margin-bottom:8px">
                    <span style="font-weight:bold;color:#FD0031">Original:</span>
                    <div style="margin-top:4px;padding:5px;background:#0F0F0F;border-radius:3px;color:#fff">${msg.original}</div>
                </div>
                <div>
                    <span style="font-weight:bold;color:#FD0031">Translated:</span>
                    <div style="margin-top:4px;padding:5px;background:#0F0F0F;border-radius:3px;color:#fff">${msg.translated}</div>
                </div>
            `;

            container.appendChild(msgDiv);
        });

        messagesPanel.appendChild(container);
    }

    function toggleMainPanel() {
        config.panelVisible = !config.panelVisible;
        const panel = document.getElementById('translator-panel');
        if (panel) {
            panel.style.display = config.panelVisible ? 'block' : 'none';
        }
    }

    function toggleTranslationPanel() {
        config.translationPanelVisible = !config.translationPanelVisible;
        const panel = document.getElementById('translation-panel');
        if (panel) {
            panel.style.display = config.translationPanelVisible ? 'block' : 'none';
        }
    }

    function copyTranslationToClipboard() {
        const resultDiv = document.getElementById('translation-result');
        const notification = document.getElementById('copy-notification');

        if (!resultDiv || !notification) return;

        const textarea = document.createElement('textarea');
        textarea.value = resultDiv.textContent;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                notification.style.display = 'block';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }

        document.body.removeChild(textarea);
    }

    async function handleTranslation() {
        const text = document.getElementById('translation-input')?.value.trim();
        const targetLang = document.getElementById('target-lang-select')?.value;
        const resultDiv = document.getElementById('translation-result');
        const notification = document.getElementById('copy-notification');

        if (!text || !targetLang || !resultDiv) {
            return;
        }

        if (!text) {
            resultDiv.textContent = 'Please enter text to translate';
            resultDiv.style.display = 'block';
            resultDiv.style.color = '#FD0031';
            return;
        }

        try {
            resultDiv.textContent = 'Translating...';
            resultDiv.style.display = 'block';
            resultDiv.style.color = '#fff';
            if (notification) notification.style.display = 'none';

            const translated = await translateText(text, targetLang);
            resultDiv.textContent = translated;

            const currentGlobalId = config.currentGlobalId;



                console.log('Message sent:', {
                    original: text,
                    translated: translated,
                    targetLang: languages.find(l => l.code === targetLang).name,
                    globalId: currentGlobalId
                });

                showStatus('Message sent successfully', 'success');

        } catch (error) {
            if (resultDiv) {
                resultDiv.textContent = `Error: ${error.message}`;
                resultDiv.style.color = '#FD0031';
            }
            showStatus('Failed to send message', 'error');
        }
    }

    function makeDraggable(panel, header) {
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    function setupWebSocketInterceptor() {
        const originalSend = WebSocket.prototype.send;
        let wsInstance = null;

        WebSocket.prototype.send = function(data) {
            originalSend.apply(this, arguments);

            if (!wsInstance) {
                wsInstance = this;
                setupWebSocketListener(this);
            }
        };
    }

    function setupWebSocketListener(ws) {
        ws.addEventListener("message", async (msg) => {
            try {
                window.wsObj = window.wsObj || {};
                window.wsObj.send = ws.send.bind(ws);

                if (msg.data.includes('42["11"')) {
                    const data = JSON.parse(msg.data.slice(2));

                    if (data.length > 2) {
                        const originalMessage = data[2];
                        showStatus('Translating...', 'info');

                        try {
                            const translated = await translateText(originalMessage, config.targetLang);
                            displayMessage(originalMessage, translated);
                            showStatus('Message translated', 'success');
                        } catch (error) {
                            displayMessage(originalMessage, `Translation error: ${error.message}`);
                            showStatus('Translation error', 'error');
                        }
                    }
                } else if (msg.data.startsWith('42[5,')) {
                    const data = JSON.parse(msg.data.slice(2));
                    if (data[0] == 5) {
                        window.wsObj = window.wsObj || {};
                        window.wsObj.lengthID = data[1];
                        config.currentGlobalId = data[2];
                        window.wsObj.roomCode = data[3];
                        window.wsObj.uders = data[5];

                        console.log('Updated globalId:', data[2]);
                    }
                }
            } catch (err) {
                console.error("Error processing message:", err);
                showStatus('Error processing message', 'error');
            }
        });
    }

    setupWebSocketInterceptor();

    const savedLang = GM_getValue('targetLang', 'fa');
    config.targetLang = savedLang;
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = savedLang;
    }
})();