// ==UserScript==
// @name         Neopets Bank Dynamic/Auto Collect
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automates daily interest collection at the Neopets bank and persists state between sessions.
// @author       ShiroMaō Studios
// @match        *://www.neopets.com/bank.phtml
// @include       /https?://www\.neopets\.com//?bank\.phtml/
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526224/Neopets%20Bank%20DynamicAuto%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/526224/Neopets%20Bank%20DynamicAuto%20Collect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Neopets Bank Automation Script Loaded - Version 2.1');

    // Insert CSS for integration
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

    // Locate the existing bank-interest section
    let bankInterestSection = document.querySelector('.bank-interest');

    if (bankInterestSection) {
        let bankCollector = document.createElement('div');
        bankCollector.className = 'bank-section-container';
        bankCollector.id = 'bankInterestCollector';
        bankCollector.innerHTML = `
            <div class="bank-backing-header bank-backing-t4">
                <h2>-Bank Interest Auto-Collector-</h2>
            </div>
            <div class="bank-backing-marble" style="margin-bottom:10px;text-align:center">
                <p style="margin:0;width:unset"></p>
                <br>
                <input id="bankInterestCollectorStartStop" type="button" class="button-default__2020 button-yellow__2020" value="Start">
                <div id="script-status" style="margin-top:10px; background-color:rgba(0, 0, 0, 0.7); color:white; padding:5px 10px; border-radius:5px; font-size:12px; display:inline-block;">Script Loaded</div>
            </div>
        `;

        bankInterestSection.parentNode.insertBefore(bankCollector, bankInterestSection);
    }

    // Persistent state handling
    let scriptRunning = localStorage.getItem('scriptRunning') === 'true';

    function updateStatus(message) {
        let statusIndicator = document.getElementById('script-status');
        if (statusIndicator) {
            statusIndicator.innerText = message;
        }
        console.log(message);
    }

    function collectInterest() {
        let collectButton = document.querySelector('input[type="submit"][value="Collect Interest"]');
        if (collectButton) {
            updateStatus('Collecting interest...');
            collectButton.click();
        } else {
            updateStatus('Interest already collected. Come back tomorrow.');
        }
    }

    function startScript() {
        updateStatus('Auto-collecting interest...');
        localStorage.setItem('scriptRunning', 'true');
        document.getElementById('bankInterestCollectorStartStop').value = "Stop";
        collectInterest(); // Run collection
    }

    function stopScript() {
        updateStatus('Script Stopped');
        localStorage.setItem('scriptRunning', 'false');
        document.getElementById('bankInterestCollectorStartStop').value = "Start";
    }

    function toggleScript() {
        scriptRunning = !scriptRunning;
        scriptRunning ? startScript() : stopScript();
    }

    document.getElementById('bankInterestCollectorStartStop').addEventListener('click', toggleScript);

    // **Ensure Auto-Start if Script was Previously Running**
    if (scriptRunning) {
        console.log("Resuming Interest Auto-Collection from last session.");
        startScript();
    }

})();
