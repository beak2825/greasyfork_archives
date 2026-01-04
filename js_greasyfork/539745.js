// ==UserScript==
// @name         Microsoft Login - Auto Select Security Key Flow (Precise)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Precisely clicks Sign-in options and Security Key login on Microsoft login page (based on actual HTML structure).
// @author       GuyShaibi
// @match        https://login.microsoftonline.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539745/Microsoft%20Login%20-%20Auto%20Select%20Security%20Key%20Flow%20%28Precise%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539745/Microsoft%20Login%20-%20Auto%20Select%20Security%20Key%20Flow%20%28Precise%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = true;

    function log(msg) {
        if (DEBUG) console.log(`[Tampermonkey][SecurityKey] ${msg}`);
    }

    function findSignInOptionsButton() {
        const elements = document.querySelectorAll('*');
        for (let element of elements) {
            const text = element.textContent.trim().toLowerCase();
            if (text.includes('sign-in options')) {
                log(`Found text element: "${element.textContent.trim()}"`);
                // Climb up to clickable container
                let parent = element;
                while (parent && parent !== document.body) {
                    if (parent.getAttribute('role') === 'button') {
                        log(`Found clickable parent: ${parent.outerHTML.substring(0, 150)}...`);
                        return parent;
                    }
                    parent = parent.parentElement;
                }
            }
        }
        return null;
    }

    async function runAutomation() {
        log('Starting automation...');

        const maxAttempts = 30;
        let attempt = 0;
        let button = null;

        while (attempt < maxAttempts) {
            button = findSignInOptionsButton();
            if (button) {
                log('Clicking Sign-in options button');
                button.click();
                break;
            }
            attempt++;
            log(`Waiting for Sign-in options... attempt ${attempt}`);
            await new Promise(res => setTimeout(res, 500));
        }

        if (!button) {
            log('Failed to find Sign-in options button');
            return;
        }

        async function clickSecurityKeyOption() {
            const maxAttempts = 30;
            let attempt = 0;

            function findSecurityKeyButton() {
                const elements = document.querySelectorAll('*');
                for (let element of elements) {
                    const text = element.textContent.trim().toLowerCase();
                    if (text.includes('face, fingerprint') || text.includes('security key')) {
                        // Climb up to clickable ancestor with role="button"
                        let parent = element;
                        while (parent && parent !== document.body) {
                            if (parent.getAttribute('role') === 'button') {
                                return parent;
                            }
                            parent = parent.parentElement;
                        }
                    }
                }
                return null;
            }

            while (attempt < maxAttempts) {
                const button = findSecurityKeyButton();
                if (button) {
                    console.log('[Tampermonkey][SecurityKey] Clicking Security Key option');
                    button.click();
                    return true;
                }
                attempt++;
                console.log(`[Tampermonkey][SecurityKey] Waiting for Security Key option... attempt ${attempt}`);
                await new Promise(res => setTimeout(res, 500));
            }

            console.log('[Tampermonkey][SecurityKey] Failed to find Security Key option');
            return false;
        }

        clickSecurityKeyOption();
    }

    setTimeout(runAutomation, 500);
})();
