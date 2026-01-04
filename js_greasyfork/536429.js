// ==UserScript==
// @name         BLoxd.io Server Capture Console Logs
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Captures console logs in a bloxd.io server and stores them in local storage.
// @author       Nomu
// @match        https://bloxd.io/*
// @grant        none
// @icon         https://www.iconsdb.com/icons/preview/black/console-xxl.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536429/BLoxdio%20Server%20Capture%20Console%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/536429/BLoxdio%20Server%20Capture%20Console%20Logs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create an array to hold logs
    const logs = JSON.parse(localStorage.getItem('capturedLogs')) || [];

    // Override console.log to capture log messages
    const originalConsoleLog = console.log;

    console.log = function(...args) {
        // Create a timestamp
        const timestamp = new Date().toISOString();

        // Construct the log entry
        const logEntry = {
            timestamp: timestamp,
            message: args.join(' ')
        };

        // Push to logs array
        logs.push(logEntry);

        // Save to local storage
        localStorage.setItem('capturedLogs', JSON.stringify(logs));

        // Call the original console.log to maintain functionality
        originalConsoleLog.apply(console, args);
    };

    // Function to download logs as a file
    const downloadLogs = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'capturedLogs.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Add a button to download logs (you can style it as needed)
    const button = document.createElement('button');
    button.textContent = 'Download Logs';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.onclick = downloadLogs;
    document.body.appendChild(button);

})();
