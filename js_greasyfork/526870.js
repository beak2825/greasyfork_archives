// ==UserScript==
// @name         Coursera Transcript to AI: Video Summarizer 🎬📝
// @namespace    thecolourofmadness
// @version      2.3
// @description  Adds buttons to copy transcripts and easily summarize videos with the most popular AI platforms on Coursera and Datacamp.
// @author       nucleargengar
// @match        https://www.coursera.org/*
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://chat.deepseek.com/*
// @match        https://chat.qwen.ai/*
// @match        https://grok.com/*
// @match        https://campus.datacamp.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://www.coursera.org/favicon.ico
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/526870/Coursera%20Transcript%20to%20AI%3A%20Video%20Summarizer%20%F0%9F%8E%AC%F0%9F%93%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/526870/Coursera%20Transcript%20to%20AI%3A%20Video%20Summarizer%20%F0%9F%8E%AC%F0%9F%93%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global variable: auto-send feature
    const autoSendKey = "autoSendEnabled";
    let autoSendEnabled = GM_getValue(autoSendKey, false);

    // Default prompt values
    const defaultBriefPrompt = "Here, a transcript of a lecture given by an educator to their students is provided. Summarize the content concisely while maintaining key points. Keep the readability high and, if necessary, use tables for clarity.";
    const defaultInDepthPrompt = "Here, a transcript of a lecture given by an educator to their students is provided. Summarize this content comprehensively and explain it in detail. Divide it into sections and keep its readability high. If necessary, support it with tables.";

    // Function to return full language name using Intl.DisplayNames API
    function getFullLanguageName() {
        const rawLanguage = navigator.language || navigator.userLanguage;
        const languageCode = rawLanguage.split('-')[0];
        let fullLanguage;
        try {
            const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
            fullLanguage = displayNames.of(languageCode);
        } catch (error) {
            fullLanguage = languageCode;
        }
        return fullLanguage;
    }

    // getPrefixText: Text to be sent to the AI platforms (the "Present it in" part will not be shown in the UI)
    function getPrefixText() {
        const summaryPreference = GM_getValue("summaryPreference", "in-depth");
        const fullLanguageName = getFullLanguageName();
        if (summaryPreference === "brief") {
            return GM_getValue("briefPrompt", defaultBriefPrompt) + " Present it in " + fullLanguageName + " language.\n\n";
        } else if (summaryPreference === "in-depth") {
            return GM_getValue("inDepthPrompt", defaultInDepthPrompt) + " Present it in " + fullLanguageName + " language.\n\n";
        } else if (summaryPreference === "customize") {
            return GM_getValue("customPrompt", "") + "\n\n";
        } else {
            return GM_getValue("inDepthPrompt", defaultInDepthPrompt) + " Present it in " + fullLanguageName + " language.\n\n";
        }
    }

    // Global queue: actions triggered with the ctrl key
    let ctrlActionQueue = [];

    // Wrapper to handle clicks with the ctrl key
    function handleCtrlClick(event, action) {
        if (event.ctrlKey) {
            ctrlActionQueue.push(action);
            console.log("Queued action for AI platform");
        } else {
            action();
        }
    }

    // Executes queued actions when ctrl key is released
    window.addEventListener('keyup', function(e) {
        if (e.key === "Control") {
            if (ctrlActionQueue.length > 0) {
                ctrlActionQueue.forEach(fn => fn());
                ctrlActionQueue = [];
            }
        }
    });

    // UI and functionality for coursera.org pages
    if (window.location.hostname.includes("coursera.org")) {

        GM_addStyle(`
            /* Common UI styles for buttons */
            #copyTranscriptButton, #chatGPTButton, #geminiButton, #deepseekButton, #qwenButton, #grokButton {
                position: fixed;
                background-color: #f5f5f5;
                border: none;
                color: #0056d2;
                width: 40px;
                height: 40px;
                font-size: 18px;
                cursor: pointer;
                z-index: 9999;
                border-radius: 50%;
                transition: background-color 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #copyTranscriptButton:hover, #chatGPTButton:hover, #geminiButton:hover, #deepseekButton:hover, #qwenButton:hover, #grokButton:hover {
                background-color: #eee;
            }
            /* Initial left positioning; bottom will be set dynamically */
            #copyTranscriptButton, #chatGPTButton, #geminiButton, #deepseekButton, #qwenButton, #grokButton {
                left: 20px;
            }
            /* Message box style */
            #messageBox {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10000;
                display: none;
            }
        `);

        // Function to display messages
        function displayMessage(message) {
            const messageBox = document.getElementById('messageBox');
            if (!messageBox) return;
            messageBox.textContent = message;
            messageBox.style.display = 'block';
            setTimeout(() => messageBox.style.display = 'none', 3000);
        }

        // Fetch transcript and copy to clipboard from URL (for Coursera)
        function fetchAndCopyTranscript(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        GM_setClipboard(response.responseText, "text");
                        console.log("Transcript copied to clipboard!");
                        displayMessage("Transcript copied to clipboard!");
                    } else {
                        console.error("Error fetching transcript:", response.status, response.statusText);
                        displayMessage("Error copying transcript: " + response.statusText);
                    }
                },
                onerror: error => {
                    console.error("Request error:", error);
                    displayMessage("Error copying transcript: " + error);
                }
            });
        }

        // Fetch transcript and send for ChatGPT
        function fetchAndSendTranscriptForChatGPT(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        const prefixText = getPrefixText();
                        const combinedText = prefixText + response.responseText;
                        GM_setValue("chatgptTranscript", combinedText);
                        console.log("Transcript prepared for ChatGPT!");
                        displayMessage("Transcript prepared for ChatGPT!");
                        window.open("https://chatgpt.com", "_blank");
                    } else {
                        console.error("Error fetching transcript:", response.status, response.statusText);
                        displayMessage("Error sending transcript: " + response.statusText);
                    }
                },
                onerror: error => {
                    console.error("Request error:", error);
                    displayMessage("Error sending transcript: " + error);
                }
            });
        }

        // Fetch transcript and send for Gemini
        function fetchAndSendTranscriptForGemini(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        const prefixText = getPrefixText();
                        const combinedText = prefixText + response.responseText;
                        GM_setValue("geminiTranscript", combinedText);
                        console.log("Transcript prepared for Gemini!");
                        displayMessage("Transcript prepared for Gemini!");
                        window.open("https://gemini.google.com", "_blank");
                    } else {
                        console.error("Error fetching transcript:", response.status, response.statusText);
                        displayMessage("Error sending transcript: " + response.statusText);
                    }
                },
                onerror: error => {
                    console.error("Request error:", error);
                    displayMessage("Error sending transcript: " + error);
                }
            });
        }

        // Fetch transcript and send for DeepSeek
        function fetchAndSendTranscriptForDeepSeek(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        const prefixText = getPrefixText();
                        const combinedText = prefixText + response.responseText;
                        GM_setValue("deepseekTranscript", combinedText);
                        console.log("Transcript prepared for DeepSeek!");
                        displayMessage("Transcript prepared for DeepSeek!");
                        window.open("https://chat.deepseek.com", "_blank");
                    } else {
                        console.error("Error fetching transcript:", response.status, response.statusText);
                        displayMessage("Error sending transcript: " + response.statusText);
                    }
                },
                onerror: error => {
                    console.error("Request error:", error);
                    displayMessage("Error sending transcript: " + error);
                }
            });
        }

        // Fetch transcript and send for Qwen
        function fetchAndSendTranscriptForQwen(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        const prefixText = getPrefixText();
                        const combinedText = prefixText + response.responseText;
                        GM_setValue("qwenTranscript", combinedText);
                        console.log("Transcript prepared for Qwen!");
                        displayMessage("Transcript prepared for Qwen!");
                        window.open("https://chat.qwen.ai", "_blank");
                    } else {
                        console.error("Error fetching transcript:", response.status, response.statusText);
                        displayMessage("Error sending transcript: " + response.statusText);
                    }
                },
                onerror: error => {
                    console.error("Request error:", error);
                    displayMessage("Error sending transcript: " + error);
                }
            });
        }

        // Fetch transcript and send for grok
        function fetchAndSendTranscriptForGrok(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => {
                    if (response.status === 200) {
                        const prefixText = getPrefixText();
                        const combinedText = prefixText + response.responseText;
                        GM_setValue("grokTranscript", combinedText);
                        console.log("Transcript prepared for grok!");
                        displayMessage("Transcript prepared for grok!");
                        window.open("https://grok.com", "_blank");
                    } else {
                        console.error("Error fetching transcript:", response.status, response.statusText);
                        displayMessage("Error sending transcript: " + response.statusText);
                    }
                },
                onerror: error => {
                    console.error("Request error:", error);
                    displayMessage("Error sending transcript: " + error);
                }
            });
        }

        function sendTranscriptToChatGPT() {
            let transcriptLink = getTranscriptUrl();
            if (transcriptLink) {
                fetchAndSendTranscriptForChatGPT(transcriptLink.href);
            } else {
                displayMessage("Transcript link not found. Clicking Downloads tab.");
                clickDownloadsTab();
                const pollInterval = setInterval(() => {
                    transcriptLink = getTranscriptUrl();
                    if (transcriptLink) {
                        clearInterval(pollInterval);
                        fetchAndSendTranscriptForChatGPT(transcriptLink.href);
                    }
                }, 500);
            }
        }

        function sendTranscriptToGemini() {
            let transcriptLink = getTranscriptUrl();
            if (transcriptLink) {
                fetchAndSendTranscriptForGemini(transcriptLink.href);
            } else {
                displayMessage("Transcript link not found. Clicking Downloads tab.");
                clickDownloadsTab();
                const pollInterval = setInterval(() => {
                    transcriptLink = getTranscriptUrl();
                    if (transcriptLink) {
                        clearInterval(pollInterval);
                        fetchAndSendTranscriptForGemini(transcriptLink.href);
                    }
                }, 500);
            }
        }

        function sendTranscriptToDeepSeek() {
            let transcriptLink = getTranscriptUrl();
            if (transcriptLink) {
                fetchAndSendTranscriptForDeepSeek(transcriptLink.href);
            } else {
                displayMessage("Transcript link not found. Clicking Downloads tab.");
                clickDownloadsTab();
                const pollInterval = setInterval(() => {
                    transcriptLink = getTranscriptUrl();
                    if (transcriptLink) {
                        clearInterval(pollInterval);
                        fetchAndSendTranscriptForDeepSeek(transcriptLink.href);
                    }
                }, 500);
            }
        }

        function sendTranscriptToQwen() {
            let transcriptLink = getTranscriptUrl();
            if (transcriptLink) {
                fetchAndSendTranscriptForQwen(transcriptLink.href);
            } else {
                displayMessage("Transcript link not found. Clicking Downloads tab.");
                clickDownloadsTab();
                const pollInterval = setInterval(() => {
                    transcriptLink = getTranscriptUrl();
                    if (transcriptLink) {
                        clearInterval(pollInterval);
                        fetchAndSendTranscriptForQwen(transcriptLink.href);
                    }
                }, 500);
            }
        }

        function sendTranscriptToGrok() {
            let transcriptLink = getTranscriptUrl();
            if (transcriptLink) {
                fetchAndSendTranscriptForGrok(transcriptLink.href);
            } else {
                displayMessage("Transcript link not found. Clicking Downloads tab.");
                clickDownloadsTab();
                const pollInterval = setInterval(() => {
                    transcriptLink = getTranscriptUrl();
                    if (transcriptLink) {
                        clearInterval(pollInterval);
                        fetchAndSendTranscriptForGrok(transcriptLink.href);
                    }
                }, 500);
            }
        }

        // Get transcript link using XPath for Coursera pages
        function getTranscriptUrl() {
            const xpath = "//li[@class='css-ap6dbz']/a[contains(@href, '/api/subtitleAssetProxy.v1/') and contains(@download, 'transcript.txt')]";
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        // Copy transcript process for Coursera pages
        function copyTranscript() {
            let transcriptLink = getTranscriptUrl();
            if (transcriptLink) {
                fetchAndCopyTranscript(transcriptLink.href);
            } else {
                displayMessage("Transcript link not found. Clicking Downloads tab.");
                clickDownloadsTab();
                const pollInterval = setInterval(() => {
                    transcriptLink = getTranscriptUrl();
                    if (transcriptLink) {
                        clearInterval(pollInterval);
                        fetchAndCopyTranscript(transcriptLink.href);
                    }
                }, 500);
            }
        }

        // Add UI elements for Coursera pages
        function addUI() {
            if (!document.getElementById('copyTranscriptButton')) {
                const btnCopy = document.createElement('button');
                btnCopy.id = 'copyTranscriptButton';
                btnCopy.innerHTML = '📋';
                btnCopy.title = 'Copy Transcript to Clipboard';
                btnCopy.addEventListener('click', copyTranscript);
                document.body.appendChild(btnCopy);
            }
            if (!document.getElementById('chatGPTButton')) {
                const btnChatGPT = document.createElement('button');
                btnChatGPT.id = 'chatGPTButton';
                btnChatGPT.innerHTML = '<img src="https://chatgpt.com/favicon.ico" alt="ChatGPT" style="width:24px;height:24px;">';
                btnChatGPT.title = 'Send Transcript to ChatGPT';
                btnChatGPT.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToChatGPT);
                });
                document.body.appendChild(btnChatGPT);
            }
            if (!document.getElementById('geminiButton')) {
                const btnGemini = document.createElement('button');
                btnGemini.id = 'geminiButton';
                btnGemini.innerHTML = '<img src="https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png" alt="Gemini" style="width:24px;height:24px;">';
                btnGemini.title = 'Send Transcript to Gemini';
                btnGemini.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToGemini);
                });
                document.body.appendChild(btnGemini);
            }
            if (!document.getElementById('qwenButton')) {
                const btnQwen = document.createElement('button');
                btnQwen.id = 'qwenButton';
                btnQwen.innerHTML = '<img src="https://i.imgur.com/HopZ9o1.png" alt="Qwen" style="width:24px;height:24px;">';
                btnQwen.title = 'Send Transcript to Qwen';
                btnQwen.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToQwen);
                });
                document.body.appendChild(btnQwen);
            }
            if (!document.getElementById('grokButton')) {
                const btnGrok = document.createElement('button');
                btnGrok.id = 'grokButton';
                btnGrok.innerHTML = '<img src="https://x.ai/favicon.ico" alt="grok" style="width:24px;height:24px;">';
                btnGrok.title = 'Send Transcript to grok';
                btnGrok.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToGrok);
                });
                document.body.appendChild(btnGrok);
            }
            if (!document.getElementById('deepseekButton')) {
                const btnDeepSeek = document.createElement('button');
                btnDeepSeek.id = 'deepseekButton';
                btnDeepSeek.innerHTML = '<img src="https://i.imgur.com/KQW7Nbc.png" alt="DeepSeek" style="width:24px;height:24px;">';
                btnDeepSeek.title = 'Send Transcript to DeepSeek';
                btnDeepSeek.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToDeepSeek);
                });
                document.body.appendChild(btnDeepSeek);
            }
            if (!document.getElementById('messageBox')) {
                const messageBox = document.createElement('div');
                messageBox.id = 'messageBox';
                document.body.appendChild(messageBox);
            }
        }

        // Remove UI elements for Coursera pages
        function removeUI() {
            document.getElementById('copyTranscriptButton')?.remove();
            document.getElementById('chatGPTButton')?.remove();
            document.getElementById('geminiButton')?.remove();
            document.getElementById('qwenButton')?.remove();
            document.getElementById('grokButton')?.remove();
            document.getElementById('deepseekButton')?.remove();
            document.getElementById('messageBox')?.remove();
        }

        // Update icon visibility based on saved settings for Coursera pages
        function updateIconVisibility() {
            const showCopy = GM_getValue("showCopyButton", true);
            const showChatGPT = GM_getValue("showChatGPTButton", true);
            const showGemini = GM_getValue("showGeminiButton", true);
            const showDeepSeek = GM_getValue("showDeepSeekButton", true);
            const showQwen = GM_getValue("showQwenButton", true);
            const showGrok = GM_getValue("showGrokButton", true);
            const btnCopy = document.getElementById('copyTranscriptButton');
            if (btnCopy) {
                btnCopy.style.display = showCopy ? 'flex' : 'none';
            }
            const btnChatGPT = document.getElementById('chatGPTButton');
            if (btnChatGPT) {
                btnChatGPT.style.display = showChatGPT ? 'flex' : 'none';
            }
            const btnGemini = document.getElementById('geminiButton');
            if (btnGemini) {
                btnGemini.style.display = showGemini ? 'flex' : 'none';
            }
            const btnDeepSeek = document.getElementById('deepseekButton');
            if (btnDeepSeek) {
                btnDeepSeek.style.display = showDeepSeek ? 'flex' : 'none';
            }
            const btnQwen = document.getElementById('qwenButton');
            if (btnQwen) {
                btnQwen.style.display = showQwen ? 'flex' : 'none';
            }
            const btnGrok = document.getElementById('grokButton');
            if (btnGrok) {
                btnGrok.style.display = showGrok ? 'flex' : 'none';
            }
            // Reposition visible icons
            const iconOrder = [
                'copyTranscriptButton',
                'chatGPTButton',
                'geminiButton',
                'qwenButton',
                'grokButton',
                'deepseekButton'
            ];
            const spacing = 50; // space between icons
            const baseBottom = 20; // starting bottom position
            let visibleCount = 0;
            iconOrder.forEach(id => {
                const btn = document.getElementById(id);
                if (btn && btn.style.display !== 'none') {
                    btn.style.bottom = (baseBottom + visibleCount * spacing) + 'px';
                    visibleCount++;
                }
            });
        }

        // Update UI for Coursera pages
        function updateUI() {
            const isLecturePage = /^https:\/\/www\.coursera\.org\/learn\/[^\/]+\/lecture\/.+/.test(window.location.href);
            if (isLecturePage) {
                addUI();
                updateIconVisibility();
                clickDownloadsTab();
            } else {
                removeUI();
            }
        }

        // Trigger updateUI when browser navigation changes (for Coursera)
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            const result = originalPushState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            const result = originalReplaceState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', updateUI);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateUI);
        } else {
            updateUI();
        }

        // Click Downloads tab for Coursera pages
        function clickDownloadsTab() {
            let tab = document.querySelector("button[data-testid='lecture-downloads-tab']");
            if (tab) {
                tab.click();
                console.log("Downloads tab clicked.");
            } else {
                console.log("Downloads tab not found, retrying.");
                setTimeout(clickDownloadsTab, 1000);
            }
        }
        window.addEventListener('load', clickDownloadsTab);

        // Update UI when settings change without reloading (for Coursera)
        GM_addValueChangeListener("autoSendEnabled", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showCopyButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showChatGPTButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showGeminiButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showDeepSeekButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showQwenButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showGrokButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
    }
    // UI and functionality for campus.datacamp.com pages
    else if (window.location.hostname.includes("campus.datacamp.com")) {

        GM_addStyle(`
            /* Common UI styles for buttons */
            #copyTranscriptButton, #chatGPTButton, #geminiButton, #deepseekButton, #qwenButton, #grokButton {
                position: fixed;
                background-color: #f5f5f5;
                border: none;
                color: #0056d2;
                width: 40px;
                height: 40px;
                font-size: 18px;
                cursor: pointer;
                z-index: 9999;
                border-radius: 50%;
                transition: background-color 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #copyTranscriptButton:hover, #chatGPTButton:hover, #geminiButton:hover, #deepseekButton:hover, #qwenButton:hover, #grokButton:hover {
                background-color: #eee;
            }
            /* Initial left positioning; bottom will be set dynamically */
            #copyTranscriptButton, #chatGPTButton, #geminiButton, #deepseekButton, #qwenButton, #grokButton {
                left: 20px;
            }
            /* Message box style */
            #messageBox {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10000;
                display: none;
            }
        `);

        // Function to display messages (for DataCamp)
        function displayMessage(message) {
            const messageBox = document.getElementById('messageBox');
            if (!messageBox) return;
            messageBox.textContent = message;
            messageBox.style.display = 'block';
            setTimeout(() => messageBox.style.display = 'none', 3000);
        }

        // Get transcript text from the transcript container on DataCamp
        function getTranscriptText() {
            const transcriptContainer = document.querySelector("div.side-panel-body");
            if (!transcriptContainer) return "";
            const transcriptSlides = transcriptContainer.querySelectorAll("div[data-trackid='transcript-slide'] p.css-rp7i7u");
            let transcriptText = "";
            transcriptSlides.forEach(el => {
                transcriptText += el.innerText + "\n";
            });
            return transcriptText.trim();
        }

        // Copy transcript process for DataCamp
        function copyTranscript() {
            const transcriptText = getTranscriptText();
            if (transcriptText) {
                GM_setClipboard(transcriptText, "text");
                console.log("Transcript copied to clipboard!");
                displayMessage("Transcript copied to clipboard!");
            } else {
                displayMessage("Transcript text not found.");
            }
        }

        // Send transcript to ChatGPT for DataCamp
        function sendTranscriptToChatGPT() {
            const transcriptText = getTranscriptText();
            if (transcriptText) {
                const prefixText = getPrefixText();
                const combinedText = prefixText + transcriptText;
                GM_setValue("chatgptTranscript", combinedText);
                console.log("Transcript prepared for ChatGPT!");
                displayMessage("Transcript prepared for ChatGPT!");
                window.open("https://chatgpt.com", "_blank");
            } else {
                displayMessage("Transcript text not found.");
            }
        }

        // Send transcript to Gemini for DataCamp
        function sendTranscriptToGemini() {
            const transcriptText = getTranscriptText();
            if (transcriptText) {
                const prefixText = getPrefixText();
                const combinedText = prefixText + transcriptText;
                GM_setValue("geminiTranscript", combinedText);
                console.log("Transcript prepared for Gemini!");
                displayMessage("Transcript prepared for Gemini!");
                window.open("https://gemini.google.com", "_blank");
            } else {
                displayMessage("Transcript text not found.");
            }
        }

        // Send transcript to DeepSeek for DataCamp
        function sendTranscriptToDeepSeek() {
            const transcriptText = getTranscriptText();
            if (transcriptText) {
                const prefixText = getPrefixText();
                const combinedText = prefixText + transcriptText;
                GM_setValue("deepseekTranscript", combinedText);
                console.log("Transcript prepared for DeepSeek!");
                displayMessage("Transcript prepared for DeepSeek!");
                window.open("https://chat.deepseek.com", "_blank");
            } else {
                displayMessage("Transcript text not found.");
            }
        }

        // Send transcript to Qwen for DataCamp
        function sendTranscriptToQwen() {
            const transcriptText = getTranscriptText();
            if (transcriptText) {
                const prefixText = getPrefixText();
                const combinedText = prefixText + transcriptText;
                GM_setValue("qwenTranscript", combinedText);
                console.log("Transcript prepared for Qwen!");
                displayMessage("Transcript prepared for Qwen!");
                window.open("https://chat.qwen.ai", "_blank");
            } else {
                displayMessage("Transcript text not found.");
            }
        }

        // Send transcript to grok for DataCamp
        function sendTranscriptToGrok() {
            const transcriptText = getTranscriptText();
            if (transcriptText) {
                const prefixText = getPrefixText();
                const combinedText = prefixText + transcriptText;
                GM_setValue("grokTranscript", combinedText);
                console.log("Transcript prepared for grok!");
                displayMessage("Transcript prepared for grok!");
                window.open("https://grok.com", "_blank");
            } else {
                displayMessage("Transcript text not found.");
            }
        }

        // Add UI elements for DataCamp
        function addUI() {
            if (!document.getElementById('copyTranscriptButton')) {
                const btnCopy = document.createElement('button');
                btnCopy.id = 'copyTranscriptButton';
                btnCopy.innerHTML = '📋';
                btnCopy.title = 'Copy Transcript to Clipboard';
                btnCopy.addEventListener('click', copyTranscript);
                document.body.appendChild(btnCopy);
            }
            if (!document.getElementById('chatGPTButton')) {
                const btnChatGPT = document.createElement('button');
                btnChatGPT.id = 'chatGPTButton';
                btnChatGPT.innerHTML = '<img src="https://chatgpt.com/favicon.ico" alt="ChatGPT" style="width:24px;height:24px;">';
                btnChatGPT.title = 'Send Transcript to ChatGPT';
                btnChatGPT.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToChatGPT);
                });
                document.body.appendChild(btnChatGPT);
            }
            if (!document.getElementById('geminiButton')) {
                const btnGemini = document.createElement('button');
                btnGemini.id = 'geminiButton';
                btnGemini.innerHTML = '<img src="https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png" alt="Gemini" style="width:24px;height:24px;">';
                btnGemini.title = 'Send Transcript to Gemini';
                btnGemini.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToGemini);
                });
                document.body.appendChild(btnGemini);
            }
            if (!document.getElementById('qwenButton')) {
                const btnQwen = document.createElement('button');
                btnQwen.id = 'qwenButton';
                btnQwen.innerHTML = '<img src="https://i.imgur.com/HopZ9o1.png" alt="Qwen" style="width:24px;height:24px;">';
                btnQwen.title = 'Send Transcript to Qwen';
                btnQwen.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToQwen);
                });
                document.body.appendChild(btnQwen);
            }
            if (!document.getElementById('grokButton')) {
                const btnGrok = document.createElement('button');
                btnGrok.id = 'grokButton';
                btnGrok.innerHTML = '<img src="https://x.ai/favicon.ico" alt="grok" style="width:24px;height:24px;">';
                btnGrok.title = 'Send Transcript to grok';
                btnGrok.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToGrok);
                });
                document.body.appendChild(btnGrok);
            }
            if (!document.getElementById('deepseekButton')) {
                const btnDeepSeek = document.createElement('button');
                btnDeepSeek.id = 'deepseekButton';
                btnDeepSeek.innerHTML = '<img src="https://i.imgur.com/KQW7Nbc.png" alt="DeepSeek" style="width:24px;height:24px;">';
                btnDeepSeek.title = 'Send Transcript to DeepSeek';
                btnDeepSeek.addEventListener('click', function(e) {
                    handleCtrlClick(e, sendTranscriptToDeepSeek);
                });
                document.body.appendChild(btnDeepSeek);
            }
            if (!document.getElementById('messageBox')) {
                const messageBox = document.createElement('div');
                messageBox.id = 'messageBox';
                document.body.appendChild(messageBox);
            }
        }

        // Remove UI elements for DataCamp
        function removeUI() {
            document.getElementById('copyTranscriptButton')?.remove();
            document.getElementById('chatGPTButton')?.remove();
            document.getElementById('geminiButton')?.remove();
            document.getElementById('qwenButton')?.remove();
            document.getElementById('grokButton')?.remove();
            document.getElementById('deepseekButton')?.remove();
            document.getElementById('messageBox')?.remove();
        }

        // Update icon visibility based on saved settings for DataCamp
        function updateIconVisibility() {
            const showCopy = GM_getValue("showCopyButton", true);
            const showChatGPT = GM_getValue("showChatGPTButton", true);
            const showGemini = GM_getValue("showGeminiButton", true);
            const showDeepSeek = GM_getValue("showDeepSeekButton", true);
            const showQwen = GM_getValue("showQwenButton", true);
            const showGrok = GM_getValue("showGrokButton", true);
            const btnCopy = document.getElementById('copyTranscriptButton');
            if (btnCopy) {
                btnCopy.style.display = showCopy ? 'flex' : 'none';
            }
            const btnChatGPT = document.getElementById('chatGPTButton');
            if (btnChatGPT) {
                btnChatGPT.style.display = showChatGPT ? 'flex' : 'none';
            }
            const btnGemini = document.getElementById('geminiButton');
            if (btnGemini) {
                btnGemini.style.display = showGemini ? 'flex' : 'none';
            }
            const btnDeepSeek = document.getElementById('deepseekButton');
            if (btnDeepSeek) {
                btnDeepSeek.style.display = showDeepSeek ? 'flex' : 'none';
            }
            const btnQwen = document.getElementById('qwenButton');
            if (btnQwen) {
                btnQwen.style.display = showQwen ? 'flex' : 'none';
            }
            const btnGrok = document.getElementById('grokButton');
            if (btnGrok) {
                btnGrok.style.display = showGrok ? 'flex' : 'none';
            }
            // Reposition visible icons
            const iconOrder = [
                'copyTranscriptButton',
                'chatGPTButton',
                'geminiButton',
                'qwenButton',
                'grokButton',
                'deepseekButton'
            ];
            const spacing = 50; // space between icons
            const baseBottom = 20; // starting bottom position
            let visibleCount = 0;
            iconOrder.forEach(id => {
                const btn = document.getElementById(id);
                if (btn && btn.style.display !== 'none') {
                    btn.style.bottom = (baseBottom + visibleCount * spacing) + 'px';
                    visibleCount++;
                }
            });
        }

        // Update UI for DataCamp pages
        function updateUI() {
            // On DataCamp, simply add the UI elements to the page
            addUI();
            updateIconVisibility();
        }

        // Trigger updateUI on page load for DataCamp pages
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateUI);
        } else {
            updateUI();
        }

        // Update UI when settings change without reloading (for DataCamp)
        GM_addValueChangeListener("autoSendEnabled", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showCopyButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showChatGPTButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showGeminiButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showDeepSeekButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showQwenButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
        GM_addValueChangeListener("showGrokButton", function(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            }
        });
    }
    // ChatGPT page: Automatically paste transcript
    else if (window.location.hostname.includes("chatgpt.com")) {
        function autoPasteTranscriptForChatGPT() {
            const transcript = GM_getValue("chatgptTranscript", "");
            if (!transcript) return;
            console.log("Transcript found for ChatGPT, starting auto-paste.");
            const intervalId = setInterval(() => {
                const promptArea = document.getElementById("prompt-textarea");
                if (promptArea) {
                    promptArea.textContent = transcript;
                    promptArea.dispatchEvent(new Event("input", { bubbles: true }));
                    promptArea.focus();
                    clearInterval(intervalId);
                    console.log("Transcript pasted in ChatGPT.");
                    GM_setValue("chatgptTranscript", "");
                    if (autoSendEnabled) {
                        const sendInterval = setInterval(() => {
                            const sendButton = document.querySelector('button[data-testid="send-button"]');
                            if (sendButton) {
                                sendButton.click();
                                console.log("Auto-send triggered for ChatGPT.");
                                clearInterval(sendInterval);
                            }
                        }, 500);
                    }
                }
            }, 500);
        }
        window.addEventListener("load", () => {
            setTimeout(autoPasteTranscriptForChatGPT, 1000);
        });
    }
    // Gemini page: Automatically paste transcript
    else if (window.location.hostname.includes("gemini.google.com")) {
        function autoPasteTranscriptForGemini() {
            const transcript = GM_getValue("geminiTranscript", "");
            if (!transcript) return;
            console.log("Transcript found for Gemini, starting auto-paste.");
            const intervalId = setInterval(() => {
                const promptArea = document.querySelector("div.ql-editor.ql-blank.textarea.new-input-ui");
                if (promptArea) {
                    promptArea.textContent = transcript;
                    promptArea.dispatchEvent(new Event("input", { bubbles: true }));
                    promptArea.focus();
                    clearInterval(intervalId);
                    console.log("Transcript pasted in Gemini.");
                    GM_setValue("geminiTranscript", "");
                    if (autoSendEnabled) {
                        const sendInterval = setInterval(() => {
                            const sendButton = document.querySelector('button[aria-label="Send message"]');
                            if (sendButton) {
                                sendButton.click();
                                console.log("Auto-send triggered for Gemini.");
                                clearInterval(sendInterval);
                            }
                        }, 500);
                    }
                }
            }, 500);
        }
        window.addEventListener("load", () => {
            setTimeout(autoPasteTranscriptForGemini, 1000);
        });
    }
    // DeepSeek page: Automatically paste transcript
    else if (window.location.hostname.includes("chat.deepseek.com")) {
        function autoPasteTranscriptForDeepSeek() {
            const transcript = GM_getValue("deepseekTranscript", "");
            if (!transcript) return;
            console.log("Transcript found for DeepSeek, starting auto-paste.");
            const intervalId = setInterval(() => {
                const promptArea = document.getElementById("chat-input");
                if (promptArea) {
                    promptArea.textContent = transcript;
                    promptArea.dispatchEvent(new Event("input", { bubbles: true }));
                    promptArea.focus();
                    clearInterval(intervalId);
                    console.log("Transcript pasted in DeepSeek.");
                    GM_setValue("deepseekTranscript", "");
                    if (autoSendEnabled) {
                        const sendInterval = setInterval(() => {
                            const sendButton = document.querySelector('div[role="button"]._7436101');
                            if (sendButton) {
                                sendButton.click();
                                console.log("Auto-send triggered for DeepSeek.");
                                clearInterval(sendInterval);
                            }
                        }, 500);
                    }
                }
            }, 500);
        }
        window.addEventListener("load", () => {
            setTimeout(autoPasteTranscriptForDeepSeek, 1000);
        });
    }
    // Qwen page: Automatically paste transcript
    else if (window.location.hostname.includes("chat.qwen.ai")) {
        function autoPasteTranscriptForQwen() {
            const transcript = GM_getValue("qwenTranscript", "");
            if (!transcript) return;
            console.log("Transcript found for Qwen, starting auto-paste.");
            const intervalId = setInterval(() => {
                const promptArea = document.getElementById("chat-input");
                if (promptArea) {
                    promptArea.value = transcript;
                    promptArea.dispatchEvent(new Event("input", { bubbles: true }));
                    promptArea.focus();
                    clearInterval(intervalId);
                    console.log("Transcript pasted in Qwen.");
                    GM_setValue("qwenTranscript", "");
                    if (autoSendEnabled) {
                        const sendInterval = setInterval(() => {
                            const sendButton = document.getElementById("send-message-button");
                            if (sendButton) {
                                sendButton.click();
                                console.log("Auto-send triggered for Qwen.");
                                clearInterval(sendInterval);
                            }
                        }, 500);
                    }
                }
            }, 500);
        }
        window.addEventListener("load", () => {
            setTimeout(autoPasteTranscriptForQwen, 1000);
        });
    }
    // grok.com page: Automatically paste transcript using value and native setter
    else if (window.location.hostname.includes("grok.com")) {
        function autoPasteTranscriptForGrok() {
            const transcript = GM_getValue("grokTranscript", "");
            if (!transcript) return;
            console.log("Transcript found for grok, starting auto-paste.");
            const intervalId = setInterval(() => {
                const promptArea = document.querySelector("div.relative.z-10 textarea");
                if (promptArea) {
                    // Set value using native property setter to trigger internal listeners
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                    nativeInputValueSetter.call(promptArea, transcript);
                    promptArea.dispatchEvent(new Event("input", { bubbles: true }));
                    promptArea.dispatchEvent(new Event("change", { bubbles: true }));
                    promptArea.focus();
                    clearInterval(intervalId);
                    console.log("Transcript pasted in grok.");
                    GM_setValue("grokTranscript", "");
                    if (autoSendEnabled) {
                        const sendInterval = setInterval(() => {
                            const sendButton = document.querySelector("div.h-9.aspect-square");
                            if (sendButton) {
                                sendButton.click();
                                console.log("Auto-send triggered for grok.");
                                clearInterval(sendInterval);
                            }
                        }, 500);
                    }
                }
            }, 500);
        }
        window.addEventListener("load", () => {
            setTimeout(autoPasteTranscriptForGrok, 1000);
        });
    }

    /* -----------------------------------------------------------------------
       Settings Panel
       -----------------------------------------------------------------------
       This panel is opened via the "Settings" command.
       The panel is organized as a rectangular window with two columns:
         - Left column (Buttons): lists the current buttons.
         - Right column (Summary Customizations): contains options for Brief, In‑Depth, and Customize.
           For Brief and In‑Depth, a reset icon is placed immediately to the left of the toggle to restore the default prompt.
           These prompts are sent to the AI platforms with a couple of newlines separating the prompt from the transcript.
           The prompt entered in the Customize option is displayed on a separate line and edited in the same manner as the Brief/In‑Depth text.
           The Customize prompt field uses the same modern, elegant scrollbar as the other fields.
         - Below these, in the Functions section, there is an Auto-Send control.
         - Clicking the × button in the top right closes the settings panel without saving.
         - Clicking the Save button saves the settings and applies them immediately without reloading the page.
    */

    GM_addStyle(`
        #videoSummarizerSettings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #102a43;
            color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            z-index: 100000;
            width: 600px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        #videoSummarizerSettings h2 {
            margin-top: 0;
            text-align: center;
            position: relative;
        }
        #settingsCloseButton {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
        }
        #videoSummarizerSettings h3 {
            margin-bottom: 10px;
            border-bottom: 1px solid #ffffff;
            padding-bottom: 5px;
            text-align: center;
        }
        #videoSummarizerSettings .section {
            margin-bottom: 15px;
        }
        .toggle-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .toggle-container {
            display: flex;
            align-items: center;
        }
        /* Toggle Switch Styles */
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 20px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #2196F3;
        }
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        /* Prompt preview/input styling with scrollbar */
        .prompt-editable {
            font-size: 12px;
            color: #ccc;
            margin-left: 10px;
            padding: 5px;
            background-color: #102a43;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: text;
            max-height: 80px;
            overflow-y: auto;
        }
        .prompt-editable::-webkit-scrollbar {
            width: 8px;
            cursor: default;
        }
        .prompt-editable::-webkit-scrollbar-track {
            background: #102a43;
        }
        .prompt-editable::-webkit-scrollbar-thumb {
            background: #2196F3;
            border-radius: 4px;
        }
        /* Reset icon styling */
        .reset-icon {
            color: rgba(255,255,255,0.6);
            font-size: 14px;
            cursor: pointer;
            margin-right: 5px;
        }
        .reset-icon:hover {
            color: rgba(255,255,255,0.9);
        }
        /* Save button hover styling */
        #settingsDoneButton {
            width: 100%;
            padding: 10px;
            background-color: #2196F3;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        #settingsDoneButton:hover {
            background-color: #1976D2;
        }
    `);

    function addSettingsPanel() {
        // Create the settings panel container (with close button)
        const panel = document.createElement('div');
        panel.id = 'videoSummarizerSettings';
        panel.innerHTML = `
            <h2>Settings <span id="settingsCloseButton">×</span></h2>
            <div id="settingsColumns" style="display: flex; justify-content: space-between;">
                <div id="leftColumn" style="flex: 1; margin-right: 10px;">
                    <h3>Buttons</h3>
                    <div class="section">
                        <label class="toggle-label">Copy Only
                            <label class="switch">
                                <input type="checkbox" id="copyOnlyToggle">
                                <span class="slider"></span>
                            </label>
                        </label>
                        <label class="toggle-label">ChatGPT
                            <label class="switch">
                                <input type="checkbox" id="chatGPTToggle">
                                <span class="slider"></span>
                            </label>
                        </label>
                        <label class="toggle-label">Gemini
                            <label class="switch">
                                <input type="checkbox" id="geminiToggle">
                                <span class="slider"></span>
                            </label>
                        </label>
                        <label class="toggle-label">DeepSeek
                            <label class="switch">
                                <input type="checkbox" id="deepseekToggle">
                                <span class="slider"></span>
                            </label>
                        </label>
                        <label class="toggle-label">Qwen
                            <label class="switch">
                                <input type="checkbox" id="qwenToggle">
                                <span class="slider"></span>
                            </label>
                        </label>
                        <label class="toggle-label">Grok
                            <label class="switch">
                                <input type="checkbox" id="grokToggle">
                                <span class="slider"></span>
                            </label>
                        </label>
                    </div>
                </div>
                <div id="rightColumn" style="flex: 1; margin-left: 10px;">
                    <h3>Customizations</h3>
                    <div class="section">
                        <label class="toggle-label">
                            Brief
                            <div class="toggle-container">
                                <span id="resetBrief" class="reset-icon" title="Reset to default">⟲</span>
                                <label class="switch">
                                    <input type="checkbox" id="briefToggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </label>
                        <div id="briefPreview" class="prompt-editable" style="display: none;"></div>
                        <label class="toggle-label">
                            In-Depth
                            <div class="toggle-container">
                                <span id="resetInDepth" class="reset-icon" title="Reset to default">⟲</span>
                                <label class="switch">
                                    <input type="checkbox" id="inDepthToggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </label>
                        <div id="inDepthPreview" class="prompt-editable" style="display: none;"></div>
                        <label class="toggle-label">
                            Customize
                            <div class="toggle-container">
                                <label class="switch">
                                    <input type="checkbox" id="customizeToggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </label>
                        <div id="customizeInputContainer" style="display: none;">
                            <div id="customPromptInput" class="prompt-editable" contenteditable="true"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="functionsSection" style="margin-top: 20px;">
                <h3>Functions</h3>
                <div class="section">
                    <label class="toggle-label">Auto-Send <span style="color: #ccc;">(The transcript is automatically sent upon pasting.)</span>
                        <label class="switch">
                            <input type="checkbox" id="autoSendToggle">
                            <span class="slider"></span>
                        </label>
                    </label>
                </div>
            </div>
            <button id="settingsDoneButton">Save</button>
        `;
        document.body.appendChild(panel);

        // When the close button is clicked, close the settings panel without saving
        document.getElementById('settingsCloseButton').addEventListener('click', function() {
            panel.remove();
        });

        // Set initial values for toggles
        document.getElementById('copyOnlyToggle').checked = GM_getValue("showCopyButton", true);
        document.getElementById('chatGPTToggle').checked = GM_getValue("showChatGPTButton", true);
        document.getElementById('geminiToggle').checked = GM_getValue("showGeminiButton", true);
        document.getElementById('deepseekToggle').checked = GM_getValue("showDeepSeekButton", true);
        document.getElementById('qwenToggle').checked = GM_getValue("showQwenButton", true);
        document.getElementById('grokToggle').checked = GM_getValue("showGrokButton", true);
        document.getElementById('autoSendToggle').checked = GM_getValue("autoSendEnabled", false);

        // Set preview texts using stored values or defaults (without the "Present it in" part)
        document.getElementById('briefPreview').textContent = GM_getValue("briefPrompt", defaultBriefPrompt);
        document.getElementById('inDepthPreview').textContent = GM_getValue("inDepthPrompt", defaultInDepthPrompt);
        document.getElementById('customPromptInput').textContent = GM_getValue("customPrompt", "Enter custom prompt");

        // Reset icon event listeners: when clicked, reset the corresponding prompt field to its default value
        document.getElementById('resetBrief').addEventListener('click', function() {
            document.getElementById('briefPreview').textContent = defaultBriefPrompt;
        });
        document.getElementById('resetInDepth').addEventListener('click', function() {
            document.getElementById('inDepthPreview').textContent = defaultInDepthPrompt;
        });

        // Enforce mutual exclusivity for Summary Customizations and enable prompt editing (fields become editable on click)
        function updateSummaryPreferenceToggles(selectedId) {
            const briefToggle = document.getElementById('briefToggle');
            const inDepthToggle = document.getElementById('inDepthToggle');
            const customizeToggle = document.getElementById('customizeToggle');

            if (selectedId === 'briefToggle') {
                briefToggle.checked = true;
                inDepthToggle.checked = false;
                customizeToggle.checked = false;
                document.getElementById('briefPreview').style.display = 'block';
                document.getElementById('inDepthPreview').style.display = 'none';
                document.getElementById('customizeInputContainer').style.display = 'none';
            } else if (selectedId === 'inDepthToggle') {
                briefToggle.checked = false;
                inDepthToggle.checked = true;
                customizeToggle.checked = false;
                document.getElementById('briefPreview').style.display = 'none';
                document.getElementById('inDepthPreview').style.display = 'block';
                document.getElementById('customizeInputContainer').style.display = 'none';
            } else if (selectedId === 'customizeToggle') {
                briefToggle.checked = false;
                inDepthToggle.checked = false;
                customizeToggle.checked = true;
                document.getElementById('briefPreview').style.display = 'none';
                document.getElementById('inDepthPreview').style.display = 'none';
                document.getElementById('customizeInputContainer').style.display = 'block';
            }
        }

        // Default to In-Depth active
        const summaryPreference = GM_getValue("summaryPreference", "in-depth");
        if(summaryPreference === "brief") {
            updateSummaryPreferenceToggles('briefToggle');
        } else if(summaryPreference === "customize") {
            updateSummaryPreferenceToggles('customizeToggle');
        } else {
            updateSummaryPreferenceToggles('inDepthToggle');
        }

        // Make each prompt field editable: clicking makes it contenteditable; pressing Enter ends editing.
        function makeEditable(id) {
            const el = document.getElementById(id);
            el.addEventListener('click', function() {
                this.contentEditable = true;
                this.style.backgroundColor = '#102a43';
                this.focus();
            });
            el.addEventListener('keydown', function(e) {
                if(e.key === "Enter") {
                    e.preventDefault();
                    this.contentEditable = false;
                    this.blur();
                }
            });
        }
        makeEditable('briefPreview');
        makeEditable('inDepthPreview');
        makeEditable('customPromptInput');

        // Toggle event listeners
        document.getElementById('briefToggle').addEventListener('change', function() {
            if(this.checked) {
                updateSummaryPreferenceToggles('briefToggle');
            } else {
                this.checked = true;
            }
        });
        document.getElementById('inDepthToggle').addEventListener('change', function() {
            if(this.checked) {
                updateSummaryPreferenceToggles('inDepthToggle');
            } else {
                this.checked = true;
            }
        });
        document.getElementById('customizeToggle').addEventListener('change', function() {
            if(this.checked) {
                updateSummaryPreferenceToggles('customizeToggle');
            } else {
                this.checked = true;
            }
        });

        // When the Save button is clicked, save settings and apply them immediately without reloading the page
        document.getElementById('settingsDoneButton').addEventListener('click', () => {
            // Save button settings
            GM_setValue("showCopyButton", document.getElementById('copyOnlyToggle').checked);
            GM_setValue("showChatGPTButton", document.getElementById('chatGPTToggle').checked);
            GM_setValue("showGeminiButton", document.getElementById('geminiToggle').checked);
            GM_setValue("showDeepSeekButton", document.getElementById('deepseekToggle').checked);
            GM_setValue("showQwenButton", document.getElementById('qwenToggle').checked);
            GM_setValue("showGrokButton", document.getElementById('grokToggle').checked);
            GM_setValue("autoSendEnabled", document.getElementById('autoSendToggle').checked);
            // Save Summary Customizations based on the active option
            let selectedPreference;
            if(document.getElementById('briefToggle').checked) {
                selectedPreference = "brief";
                GM_setValue("briefPrompt", document.getElementById('briefPreview').textContent);
            } else if(document.getElementById('inDepthToggle').checked) {
                selectedPreference = "in-depth";
                GM_setValue("inDepthPrompt", document.getElementById('inDepthPreview').textContent);
            } else if(document.getElementById('customizeToggle').checked) {
                selectedPreference = "customize";
                GM_setValue("customPrompt", document.getElementById('customPromptInput').textContent);
            }
            GM_setValue("summaryPreference", selectedPreference);
            if (typeof updateIconVisibility === 'function') { updateIconVisibility(); }
            panel.remove();
        });
    }

    // Keep the Settings menu command as in the original.
    GM_registerMenuCommand("Settings", addSettingsPanel);

})();