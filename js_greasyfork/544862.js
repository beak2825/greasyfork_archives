// ==UserScript==
// @name         Human Auto Typer
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Works anywhere! Type like a pro with "start-now" trigger, stylish UI, manual controls & Shift x3 to stop. Try it!
// @author       Koolkars (Felix)
// @match        *://*/*
// @grant        none
// @icon         https://static.vecteezy.com/system/resources/previews/010/750/505/original/typing-icon-design-free-vector.jpg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544862/Human%20Auto%20Typer.user.js
// @updateURL https://update.greasyfork.org/scripts/544862/Human%20Auto%20Typer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let typingInterval = 300;
    let typingText = '';
    let typingTarget = null;
    let typingInProgress = false;
    let typingTimeoutId = null;
    let shiftPressTimes = [];

    // Create toggle icon
    const toggleIcon = document.createElement('div');
    toggleIcon.id = 'typingToggleIcon';
    toggleIcon.title = 'Simulated Typing Panel';
    toggleIcon.style.position = 'fixed';
    toggleIcon.style.top = '50%';
    toggleIcon.style.right = '0';
    toggleIcon.style.transform = 'translateY(-50%)';
    toggleIcon.style.width = '40px';
    toggleIcon.style.height = '40px';
    toggleIcon.style.background = 'linear-gradient(135deg, #6ab7ff, #4285f4)';
    toggleIcon.style.borderTopLeftRadius = '20px';
    toggleIcon.style.borderBottomLeftRadius = '20px';
    toggleIcon.style.cursor = 'pointer';
    toggleIcon.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    toggleIcon.style.display = 'flex';
    toggleIcon.style.alignItems = 'center';
    toggleIcon.style.justifyContent = 'center';
    toggleIcon.style.zIndex = '999999';
    toggleIcon.style.userSelect = 'none';


    toggleIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0L14.13 4.94l3.75 3.75 2.83-2.83z"/>
        </svg>`;

    document.body.appendChild(toggleIcon);

    const ui = document.createElement('div');
    ui.id = 'typingUI';
    ui.style.position = 'fixed';
    ui.style.top = '50%';
    ui.style.right = '-360px';
    ui.style.transform = 'translateY(-50%)';
    ui.style.width = '350px';
    ui.style.background = 'white';
    ui.style.borderRadius = '20px 0 0 20px';
    ui.style.boxShadow = '0 8px 24px rgba(66, 133, 244, 0.3)';
    ui.style.padding = '20px 25px 25px 25px';
    ui.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    ui.style.color = '#1a1a1a';
    ui.style.zIndex = '999998';
    ui.style.transition = 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    ui.style.userSelect = 'none';
    ui.style.display = 'flex';
    ui.style.flexDirection = 'column';
    ui.style.gap = '15px';

    ui.innerHTML = `
        <h2 style="margin:0; font-weight: 600; color: #4285f4;">Human Auto Typer</h2>

        <label for="pasteArea" style="font-weight: 500;">Paste Text:</label>
        <textarea id="pasteArea" rows="6" placeholder="Paste text here..." style="width: 100%; font-size: 14px; padding: 10px; border: 1.8px solid #ddd; border-radius: 10px; resize: vertical; outline-offset: 2px; outline-color: #4285f4;"></textarea>

        <label for="wpmInput" style="font-weight: 500;">Words Per Minute (WPM):</label>
        <input id="wpmInput" type="number" min="1" value="40" style="width: 70px; padding: 6px 8px; font-size: 14px; border-radius: 8px; border: 1.5px solid #ddd; outline-offset: 2px; outline-color: #4285f4;">

        <div style="display: flex; justify-content: flex-start; gap: 12px; margin-top: 10px;">
            <button id="startTypingBtn" style="background: #4285f4; border: none; color: white; padding: 10px 18px; border-radius: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(66, 133, 244, 0.5); transition: background 0.3s ease;">
                Start
            </button>
            <button id="stopTypingBtn" style="background: #f44336; border: none; color: white; padding: 10px 18px; border-radius: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(244, 67, 54, 0.5); transition: background 0.3s ease;">
                Stop
            </button>
        </div>

        <small style="color: #666;">Type <code>start-now</code> in an input or editable field to trigger typing.<br>Press <b>Shift</b> 3 times quickly to stop typing.</small>

        <div style="font-size: 10px; color: #999; text-align: right; margin-top: 10px;">made by koolkars</div>
    `;

    document.body.appendChild(ui);

    let panelOpen = false;
    toggleIcon.addEventListener('click', () => {
        panelOpen = !panelOpen;
        ui.style.right = panelOpen ? '0' : '-360px';
        toggleIcon.style.background = panelOpen
            ? 'linear-gradient(135deg, #2a6dfd, #1a4ed8)'
            : 'linear-gradient(135deg, #6ab7ff, #4285f4)';
    });

    function getIntervalFromWPM(wpm) {
        const charsPerMinute = wpm * 5;
        return 60000 / charsPerMinute;
    }

    function simulateTyping(text, element, interval) {
        let i = 0;
        typingInProgress = true;

        function typeNextChar() {
            if (!typingInProgress) return;
            if (i >= text.length) {
                typingInProgress = false;
                typingTimeoutId = null;
                return;
            }

            const char = text[i++];
            if (element.isContentEditable) {
                const sel = window.getSelection();
                if (!sel.rangeCount) {
                    typingInProgress = false;
                    typingTimeoutId = null;
                    return;
                }
                const range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(char));
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            } else {
                const start = element.selectionStart;
                const end = element.selectionEnd;
                const before = element.value.slice(0, start);
                const after = element.value.slice(end);
                element.value = before + char + after;
                element.selectionStart = element.selectionEnd = start + 1;
            }

            typingTimeoutId = setTimeout(typeNextChar, interval);
        }

        typeNextChar();
    }

    function stopTyping() {
        if (typingInProgress) {
            typingInProgress = false;
            if (typingTimeoutId) {
                clearTimeout(typingTimeoutId);
                typingTimeoutId = null;
            }
            console.log('Typing stopped.');
        }
    }

    document.getElementById('startTypingBtn').addEventListener('click', () => {
        if (typingInProgress) {
            alert('Typing already in progress!');
            return;
        }

        const text = document.getElementById('pasteArea').value.trim();
        if (!text) {
            alert('Please paste some text first!');
            return;
        }

        const wpm = parseInt(document.getElementById('wpmInput').value);
        if (isNaN(wpm) || wpm < 1) {
            alert('Please enter a valid WPM (1 or more).');
            return;
        }

        const interval = getIntervalFromWPM(wpm);
        const activeEl = document.activeElement;
        if (!activeEl ||
            (!activeEl.isContentEditable &&
                activeEl.tagName !== 'TEXTAREA' &&
                !(activeEl.tagName === 'INPUT' && ['text', 'search', 'email', 'url', 'tel', 'password'].includes(activeEl.type)))) {
            alert('Please focus a text input, textarea, or editable element to start typing.');
            return;
        }

        typingText = text;
        typingInterval = interval;
        typingTarget = activeEl;
        simulateTyping(typingText, typingTarget, typingInterval);
    });

    document.getElementById('stopTypingBtn').addEventListener('click', () => {
        stopTyping();
    });

    const triggerPhrase = 'start-now';
    const triggerLength = triggerPhrase.length;

    function attachInputListener(el) {
        if (!el || el._hasTypingListener) return;
        el._hasTypingListener = true;

        el.addEventListener('input', () => {
            if (typingInProgress) return;
            let content = el.isContentEditable ? el.textContent || '' : el.value || '';
            if (content.length < triggerLength) return;

            if (content.slice(-triggerLength) === triggerPhrase) {
                if (el.isContentEditable) {
                    el.textContent = content.slice(0, -triggerLength);
                    const sel = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else {
                    el.value = content.slice(0, -triggerLength);
                    el.selectionStart = el.selectionEnd = el.value.length;
                }

                const text = document.getElementById('pasteArea').value.trim();
                if (!text) return alert('Please paste some text in the panel first!');
                const wpm = parseInt(document.getElementById('wpmInput').value);
                if (isNaN(wpm) || wpm < 1) return alert('Please enter a valid WPM (1 or more) in the panel.');

                typingText = text;
                typingInterval = getIntervalFromWPM(wpm);
                typingTarget = el;
                simulateTyping(typingText, typingTarget, typingInterval);
            }
        });
    }

    function attachListenersToAllInputs() {
        const inputs = [...document.querySelectorAll('input[type=text], input[type=search], input[type=email], input[type=url], input[type=tel], input[type=password], textarea')];
        inputs.forEach(attachInputListener);
        const editables = [...document.querySelectorAll('[contenteditable="true"], [contenteditable=""]')];
        editables.forEach(attachInputListener);
    }

    attachListenersToAllInputs();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;
                    if (node.matches('input[type=text], input[type=search], input[type=email], input[type=url], input[type=tel], input[type=password], textarea')) {
                        attachInputListener(node);
                    }
                    if (node.isContentEditable) attachInputListener(node);
                    node.querySelectorAll('input[type=text], input[type=search], input[type=email], input[type=url], input[type=tel], input[type=password], textarea').forEach(attachInputListener);
                    node.querySelectorAll('[contenteditable="true"], [contenteditable=""]').forEach(attachInputListener);
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            const now = Date.now();
            shiftPressTimes = shiftPressTimes.filter(t => now - t < 1000);
            shiftPressTimes.push(now);
            if (shiftPressTimes.length >= 3) {
                stopTyping();
                shiftPressTimes = [];
            }
        }
    });

})();
