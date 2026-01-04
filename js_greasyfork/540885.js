// ==UserScript==
// @name         Talkomatic Useful Data
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show useful socket information under signin options
// @author       zackiboiz
// @match        *://classic.talkomatic.co/
// @match        *://classic.talkomatic.co/index.html
// @match        *://dev.talkomatic.co/
// @match        *://dev.talkomatic.co/index.html
// @icon         https://icons.duckduckgo.com/ip2/talkomatic.co.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540885/Talkomatic%20Useful%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/540885/Talkomatic%20Useful%20Data.meta.js
// ==/UserScript==

(async () => {
    switch (window.location.hostname) {
        case "classic.talkomatic.co":
        case "dev.talkomatic.co": {
            const css = `
                div#useful-data {
                    margin-top: 0.75em;
                    padding: 0.5em 1em;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background: #f9f9f9;
                    font-family: sans-serif;
                    font-size: 0.9em;
                    line-height: 1.4;
                    max-width: 300px;
                }
                div#useful-data.transparent {
                    opacity: 0.5;
                }
                #useful-data div {
                    margin-bottom: 0.4em;
                    word-break: break-all;
                }
                #useful-data div span.label {
                    font-weight: bold;
                    color: #333;
                }
                #useful-data div span.value {
                    color: #555;
                }
            `;
            const styleEl = document.createElement('style');
            styleEl.textContent = css;
            document.head.appendChild(styleEl);

            const html = `
                <div id="useful-data" class="transparent">
                    <div><span class="label">Socket ID:</span> <span class="value" id="ud-socket">...</span></div>
                    <div><span class="label">User ID:</span> <span class="value" id="ud-user">...</span></div>
                    <div><span class="label">Username:</span> <span class="value" id="ud-username">...</span></div>
                    <div><span class="label">Location:</span> <span class="value" id="ud-location">...</span></div>
                </div>
            `;

            const form = document.querySelector('#logform form');
            const inputs = form.querySelectorAll('input');
            const locationInput = inputs[1] || inputs[0];
            locationInput.parentElement.insertAdjacentHTML('afterend', html);

            socket.emit('check signin status');
            socket.on('signin status', (info) => {
                document.getElementById('ud-socket').textContent = socket.id || "???";
                document.getElementById('ud-user').textContent = info.userId || "???";
                document.getElementById('ud-username').textContent = info.username || "???";
                document.getElementById('ud-location').textContent = info.location || "???";

                // if not signed in, gray it out
                if (info.isSignedIn) {
                    document.getElementById('useful-data').classList.remove("transparent");
                } else {
                    document.getElementById('useful-data').classList.add("transparent");
                }
            });

            break;
        }
    }
})();