// ==UserScript==
// @name         ShadConnect Prestart Auto-Starter (Simplified Flow)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Opens the site dropdown and waits for manual site selection, then auto-triggers Copy Previous Meeting
// @match        https://employee.shadconnect.com.au/supervisor-resources/site-meetings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532150/ShadConnect%20Prestart%20Auto-Starter%20%28Simplified%20Flow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532150/ShadConnect%20Prestart%20Auto-Starter%20%28Simplified%20Flow%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, timeout = 10000) {
        console.log(`[Prestart] Waiting for: ${selector}`);
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    console.log(`[Prestart] Found: ${selector}`);
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(`[Prestart] Timeout waiting for ${selector}`);
                }
            }, 300);
        });
    }

    function waitForTextContent(selector, matchText, timeout = 10000) {
        console.log(`[Prestart] Waiting for text "${matchText}" in: ${selector}`);
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                for (let el of elements) {
                    if (el.textContent.trim() === matchText.trim()) {
                        console.log(`[Prestart] Found element with text: "${matchText}"`);
                        clearInterval(timer);
                        resolve(el);
                        return;
                    }
                }
                if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(`[Prestart] Timeout waiting for text "${matchText}" in ${selector}`);
                }
            }, 300);
        });
    }

    async function initPrestartFlow() {
        try {
            const addBtn = await waitForElement('app-kick-off-meeting-list > div > div i');
            addBtn.click();

            const kickOffOption = await waitForTextContent('div[role="generic"], div.dx-item-content', 'Kick Off');
            kickOffOption.click();

            await waitForTextContent('.title-popup', 'New Kick Off Meeting');

            const siteDropdown = await waitForElement('[displayexpr="siteName"] .dx-lookup-field');
            siteDropdown.click();
            console.log('[Prestart] Opened site dropdown — waiting for user to select site manually...');

            // After selection, wait for the copy button
            const siteSelected = await new Promise((resolve, reject) => {
                const field = document.querySelector('[displayexpr="siteName"] .dx-lookup-field');
                const start = Date.now();
                const timer = setInterval(() => {
                    const val = field?.textContent?.trim();
                    if (val && val.length > 0 && val !== 'Select...') {
                        clearInterval(timer);
                        console.log(`[Prestart] Detected selected site: ${val}`);
                        resolve(val);
                    }
                    if (Date.now() - start > 20000) {
                        clearInterval(timer);
                        reject('[Prestart] Timeout waiting for site selection');
                    }
                }, 300);
            });

            const copyBtn = await waitForTextContent('dx-button .dx-button-text', 'Copy Previous Meeting', 10000);
            copyBtn.closest('dx-button').click();
            console.log('[Prestart] Clicked "Copy Previous Meeting"');

        } catch (err) {
            console.error('[Prestart Flow] Error:', err);
            alert(`[Prestart Error]\n${err}`);
        }
    }

    window.addEventListener('load', () => {
        console.log('[Prestart] Page loaded, starting simplified flow...');
        initPrestartFlow();
    });
})();
