// ==UserScript==
// @name         PolyModLoader
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  description
// @author       You
// @match        https://app-polytrack.kodub.com/0.5.0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kodub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532371/PolyModLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/532371/PolyModLoader.meta.js
// ==/UserScript==

let url = "https://pml.orangy.cfd/0rangy/PolyModLoader/0.5.0/main.bundle.web.js";

async function tamper() {
    try {
        document.open();
        document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="manifest" href="manifest.json" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
                </head>
                <body>
                    <canvas id="screen"></canvas>
                    <div id="ui"></div>
                    <div id="transition-layer"></div>
                    <script type="module" src="${url}"></script>
                </body>
            </html>
        `);
        document.close();
    } catch (e) {
        console.error("Tampering failed:", e);
    }
}

console.log("Tampering...");
tamper();