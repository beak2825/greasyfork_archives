// ==UserScript==
// @name         Drawaria Enhancer (English UI)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improves Drawaria: forces English, shows word hint & timer highlight
// @author       belen
// @match        https://drawaria.online/*
// @icon         https://drawaria.online/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541653/Drawaria%20Enhancer%20%28English%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541653/Drawaria%20Enhancer%20%28English%20UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForElement = (selector, callback) => {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Force language to English
    localStorage.setItem('lang', 'en');

    // Highlight the drawing timer
    waitForElement('.round-timer', (timer) => {
        timer.style.fontSize = '24px';
        timer.style.color = 'red';
        timer.style.fontWeight = 'bold';
    });

    // Show your drawing word on screen clearly
    const observer = new MutationObserver(() => {
        const hint = document.querySelector('.drawer-word');
        if (hint && !document.querySelector('#wordDisplay')) {
            const wordDiv = document.createElement('div');
            wordDiv.id = 'wordDisplay';
            wordDiv.textContent = 'Draw: ' + hint.textContent;
            wordDiv.style.position = 'absolute';
            wordDiv.style.top = '80px';
            wordDiv.style.left = '10px';
            wordDiv.style.fontSize = '28px';
            wordDiv.style.fontWeight = 'bold';
            wordDiv.style.color = '#00ccff';
            wordDiv.style.zIndex = 9999;
            document.body.appendChild(wordDiv);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
