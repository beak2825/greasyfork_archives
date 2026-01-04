// ==UserScript==
// @name         Willhaben quick neu veröffentlichen
// @namespace    http://tampermonkey.net/
// @version      2025-01-31
// @description  Puts button for quickly renewing Anzeigen from Willhaben
// @author       Mario Dittrich
// @match        https://www.willhaben.at/iad/myprofile/myadverts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=willhaben.at
// @match        https://www.willhaben.at/iad/anzeigenaufgabe/marktplatz?adId=*
// @match        https://www.willhaben.at/iad/anzeigenaufgabe/marktplatz/versandoptionen?adId=*
// @match        https://www.willhaben.at/iad/anzeigenaufgabe/marktplatz/zusatzprodukte?adId=*
// @match        https://www.willhaben.at/iad/anzeigenaufgabe/fertig?adId=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525467/Willhaben%20quick%20neu%20ver%C3%B6ffentlichen.user.js
// @updateURL https://update.greasyfork.org/scripts/525467/Willhaben%20quick%20neu%20ver%C3%B6ffentlichen.meta.js
// ==/UserScript==

(function() {
    'use strict';

   const currentUrl = window.location.href;

    // Improved function to wait for button and click it
    function clickButton(selector, maxAttempts = 50, interval = 200) {
        let attempts = 0;
        const checkForButton = () => {
            const btn = document.querySelector(selector);
            if (btn) {
                console.log('Clicking button:', selector);
                btn.click();
                return true;
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkForButton, interval);
                return false;
            } else {
                console.log('Button not found:', selector);
                return false;
            }
        };
        checkForButton();
    }

    // Main myadverts page
    if (currentUrl.includes('/myadverts')) {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('[data-testid$="-republish-button"]').forEach(originalButton => {

                const section = originalButton.closest('[data-testid="5"]');
                if (!section) return;

                if (!originalButton.nextElementSibling || !originalButton.nextElementSibling.classList.contains('quick-republish')) {
                    const quickBtn = document.createElement('button');
                    quickBtn.className = 'Button__ButtonContainer-sc-3uaafx-0 clyZmA quick-republish';
                    quickBtn.style.marginLeft = '10px';
                    quickBtn.textContent = 'Quick neu veröffentlichen';

                    quickBtn.addEventListener('click', () => {
                        sessionStorage.setItem('quickRepublish', 'true');
                        originalButton.click();
                    });

                    originalButton.parentNode.insertBefore(quickBtn, originalButton.nextSibling);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    // First step page (marktplatz)
    else if (currentUrl.includes('/marktplatz?adId=')) {
        if (sessionStorage.getItem('quickRepublish') === 'true') {
            clickButton('[data-testid="send-button"]');
        }
    }
    // Second step page (versandoptionen)
    else if (currentUrl.includes('/versandoptionen')) {
        if (sessionStorage.getItem('quickRepublish') === 'true') {
            clickButton('[data-testid="submitButton"]');
        }
    }
    // Third step page (zusatzprodukte)
    else if (currentUrl.includes('/zusatzprodukte')) {
        if (sessionStorage.getItem('quickRepublish') === 'true') {
            clickButton('[data-testid="submit-button"]');
        }
    }
    // Final confirmation page
    else if (currentUrl.includes('/fertig')) {
        if (sessionStorage.getItem('quickRepublish') === 'true') {
            sessionStorage.removeItem('quickRepublish');
            clickButton('a[href="/iad/myprofile/myadverts"]');
        }
    }
})();