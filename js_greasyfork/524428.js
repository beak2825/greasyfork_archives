// ==UserScript==
// @name         IP Masker
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Simply Hides your IP Address!
// @match        https://www.myedio.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @license      CC BY-NC
// @author       Unknown Hacker
// @downloadURL https://update.greasyfork.org/scripts/524428/IP%20Masker.user.js
// @updateURL https://update.greasyfork.org/scripts/524428/IP%20Masker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ipRegex = /\b((?:\d{1,3}\.){3}\d{1,3}|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b)\b/g;

    function processElements() {
        const elements = document.querySelectorAll('p');

        elements.forEach(async function(el, index) {
            if (el.dataset.processed) {
                return;
            }

            const text = el.textContent.trim();

            if (ipRegex.test(text)) {
                const key = `ip_${index}`;
                await GM.setValue(key, text);

                el.textContent = 'Click to view IP';
                el.style.cursor = 'pointer';
                el.style.color = 'blue';
                el.style.textDecoration = 'underline';

                el.dataset.processed = 'true';

                el.addEventListener('click', async function() {
                    if (el.textContent !== 'Click to view IP') {
                        return;
                    }

                    const ip = await GM.getValue(key);
                    el.textContent = ip;

                    await GM.deleteValue(key);

                    el.style.color = '';
                    el.style.textDecoration = '';
                    el.style.cursor = '';
                });
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            processElements();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    processElements();
})();