// ==UserScript==
// @include       /https?://www\.neopets\.com//?bank\.phtml/
// @name         Neopets Bank Convenience Collect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a manual "Collect Interest" button for convenience while adhering to userscript rules.
// @author       ShiroMaō Studios
// @match        *://www.neopets.com/bank.phtml
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526225/Neopets%20Bank%20Convenience%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/526225/Neopets%20Bank%20Convenience%20Collect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Neopets Bank Automation Script Loaded - Version 1.7');

    // Insert buffer and styles
    let styleTag = document.createElement('style');
    styleTag.innerHTML = `
        #bankInterestCollector input[type=button] {
            margin: 0 auto;
            min-width: 100px;
            width: auto !important;
        }
        #bankInterestCollector {
            margin-bottom: 0px !important;
            width: 80%;
        }
    `;
    document.head.appendChild(styleTag);

    // Locate the existing bank-interest section to integrate seamlessly
    let bankInterestSection = document.querySelector('.bank-interest');

    if (bankInterestSection) {
        // Create Bank Interest Auto-Collector section with status indicator
        let bankCollector = document.createElement('div');
        bankCollector.className = 'bank-section-container';
        bankCollector.id = 'bankInterestCollector';
        bankCollector.innerHTML = `
            <div class="bank-backing-header bank-backing-t4">
                <h2>-Bank Interest Collector-</h2>
            </div>
            <div class="bank-backing-marble" style="margin-bottom:10px;text-align:center">
                <p style="margin:0;width:unset"></p>
                <br>
                <input id="bankInterestCollectorCollect" type="button" class="button-default__2020 button-yellow__2020" value="Collect Interest">
                <div id="script-status" style="margin-top:10px; background-color:rgba(0, 0, 0, 0.7); color:white; padding:5px 10px; border-radius:5px; font-size:12px; display:inline-block;">Script Loaded</div>
            </div>
        `;

        // Insert right above bank-interest section for seamless integration
        bankInterestSection.parentNode.insertBefore(bankCollector, bankInterestSection);
    }

    function updateStatus(message) {
        let statusIndicator = document.getElementById('script-status');
        if (statusIndicator) {
            statusIndicator.innerText = message;
        }
        console.log(message);
    }

    document.getElementById('bankInterestCollectorCollect').addEventListener('click', function() {
        let collectButton = document.querySelector('input[type="submit"][value="Collect Interest"]');
        if (collectButton) {
            updateStatus('Collecting interest...');
            collectButton.click();
        } else {
            updateStatus('Interest already collected or unavailable');
        }
    });
})();
