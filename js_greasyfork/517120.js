// ==UserScript==
// @name         Youlean Loudness Monitor with Save Option
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Monitor loudness readout on Youlean Online Loudness Meter and allow saving logs
// @author       Theodor
// @match        https://youlean.co/online-loudness-meter/
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/517120/Youlean%20Loudness%20Monitor%20with%20Save%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/517120/Youlean%20Loudness%20Monitor%20with%20Save%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const log = []; // Array to store loudness data

    // Function to save log to a file
    function saveToFile(data, filename = 'loudness_log.txt') {
        const blob = new Blob([data], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`File "${filename}" saved successfully.`);
    }

    // Expose the save function to the Console
    window.save = function() {
        if (log.length === 0) {
            console.warn('No data to save.');
        } else {
            saveToFile(log.join('\n'));
        }
    };

    // Function to monitor the button's text content
    function monitorLoudness() {
        const button = document.getElementById('readout');
        if (button) {
            // Log the initial value
            console.log('Initial Loudness:', button.textContent);
            log.push(`${new Date().toISOString()}: ${button.textContent}`);

            // Create a MutationObserver to watch for text changes
            new MutationObserver(() => {
                const loudness = button.textContent;
                console.log('Updated Loudness:', loudness);
                log.push(`${new Date().toISOString()}: ${loudness}`);
            }).observe(button, { childList: true });
        } else {
            console.error('Button with id "readout" not found.');
        }
    }

    // Wait for the DOM to fully load
    window.addEventListener('load', monitorLoudness);
})();
