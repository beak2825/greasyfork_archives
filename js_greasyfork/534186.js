// ==UserScript==
// @name         Google Docs WPM Tracker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  tracks wpm and displays and is draggable
// @author       chatgpt
// @match        https://docs.google.com/document/*
// @grant        none
// @license CC0
// @downloadURL https://update.greasyfork.org/scripts/534186/Google%20Docs%20WPM%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/534186/Google%20Docs%20WPM%20Tracker.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const wpmDisplay = document.createElement('div');
    wpmDisplay.style.position = 'fixed';
    wpmDisplay.style.top = localStorage.getItem('wpmTrackerTop') || '50%';
    wpmDisplay.style.left = localStorage.getItem('wpmTrackerLeft') || '20px';
    wpmDisplay.style.transform = 'translateY(-50%)';
    wpmDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    wpmDisplay.style.color = 'white';
    wpmDisplay.style.padding = '10px 20px';
    wpmDisplay.style.borderRadius = '12px';
    wpmDisplay.style.fontSize = '18px';
    wpmDisplay.style.zIndex = '9999';
    wpmDisplay.style.fontFamily = 'Arial, sans-serif';
    wpmDisplay.textContent = 'WPM: 0';
    document.body.appendChild(wpmDisplay);

    let keyTimestamps = [];
    let lastTypedTime = null;
    let liveWPM = 0;
    let attached = false;

    function cleanOldTimestamps() {
        const now = Date.now();
        keyTimestamps = keyTimestamps.filter(ts => now - ts <= 10000);
    }

    function calculateLiveWPM() {
        cleanOldTimestamps();
        const characters = keyTimestamps.length;
        const elapsedMinutes = 10 / 60;
        return Math.round((characters / 5) / elapsedMinutes);
    }

    function updateDisplay() {
        const now = Date.now();
        if (!lastTypedTime || now - lastTypedTime > 10000) {
            wpmDisplay.style.color = '#aaa';
            wpmDisplay.textContent = `WPM: ${liveWPM}`;
        } else {
            liveWPM = calculateLiveWPM();
            wpmDisplay.textContent = `WPM: ${liveWPM}`;
            wpmDisplay.style.color = 'white';
        }
    }

    function isTypingKey(e) {
        return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    }

    function setupTypingTrackerInIframe() {
        if (attached) return;
        const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');
        if (!iframe) return;

        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.addEventListener('keydown', (e) => {
                if (isTypingKey(e)) {
                    keyTimestamps.push(Date.now());
                    lastTypedTime = Date.now();
                    updateDisplay();
                } else if (e.key === 'Backspace') {
                    keyTimestamps.pop();
                    lastTypedTime = Date.now();
                    updateDisplay();
                }
            }, true);
            attached = true;
        } catch (err) {}
    }

    function setupObserver() {
        const observer = new MutationObserver(setupTypingTrackerInIframe);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    setupObserver();
    setupTypingTrackerInIframe();
    setInterval(updateDisplay, 100);

    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    wpmDisplay.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - wpmDisplay.getBoundingClientRect().left;
        offsetY = e.clientY - wpmDisplay.getBoundingClientRect().top;
        wpmDisplay.style.cursor = 'move';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newLeft = `${e.clientX - offsetX}px`;
            const newTop = `${e.clientY - offsetY}px`;
            wpmDisplay.style.left = newLeft;
            wpmDisplay.style.top = newTop;
            localStorage.setItem('wpmTrackerLeft', newLeft);
            localStorage.setItem('wpmTrackerTop', newTop);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        wpmDisplay.style.cursor = 'default';
    });
})();