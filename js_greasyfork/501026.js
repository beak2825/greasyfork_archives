// ==UserScript==
// @name         AppleWare Key Bypasser
// @description  by yours truly, an appleware bypasser :)
// @version      0.2
// @license MIT
// @icon         https://appleware.dev/favicon.png
// @match        https://loot-link.com/*
// @match        https://lootdest.org/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      gforanopportu.info
// @connect      entlysearchin.info
// @run-at       document-end
// @namespace https://greasyfork.org/users/1287532
// @downloadURL https://update.greasyfork.org/scripts/501026/AppleWare%20Key%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/501026/AppleWare%20Key%20Bypasser.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Function to decode the string
    function decodeString(input, length = 5) {
        let result = "";
        let decodedString = atob(input);
        let key = decodedString.substring(0, length);
        let message = decodedString.substring(length);

        for (let i = 0; i < message.length; i++) {
            let charCode = message.charCodeAt(i);
            let keyCharCode = key.charCodeAt(i % key.length);
            let decodedCharCode = charCode ^ keyCharCode;
            result += String.fromCharCode(decodedCharCode);
        }

        return result;
    }

    function waitForScript() {
        return new Promise((resolve, reject) => {
            const observer = new MutationObserver((mutations, observer) => {
                const dataScript = document.querySelector("body > script:nth-child(2)");
                if (dataScript) {
                    observer.disconnect();
                    resolve(dataScript);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }

    async function main() {
        try {
            var dataScript = await waitForScript();
            eval(dataScript.innerText);

            var TID = p.TID;
            var KEY = p.KEY;

            const response = await fetch("https://gforanopportu.info/tc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                },
                body: JSON.stringify({
                    tid: TID,
                    bl: [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                        19,
                    ],
                    session:
                        Math.floor(Math.random() * (0x3b9ac9ff - 0x5f5e100 + 0x1)) +
                        0x5f5e100,
                    max_tasks: 2,
                    design_id: 3,
                    cur_url: window.location.href,
                    doc_ref: document.referrer,
                    cookie_id: (
                        Math.floor(Math.random() * (0x3b9ac9ff - 0x5f5e100 + 0x1)) +
                        0x5f5e100
                    ).toString(),
                    taboola_user_sync: "",
                    fps: 512,
                    gpu: "nvidia",
                    isMobile: true,
                    tier: 1,
                    type: "FALLBACK",
                }),
            });

            const tc = (await response.json())[0];

            const socket = new WebSocket(
                `wss://2.entlysearchin.info/c?uid=${tc.urid}&cat=${tc.task_id}&key=${KEY}`
            );

            socket.onopen = function (event) {
                console.log("WebSocket connection opened:", event);
            };

            socket.onmessage = function (event) {
                console.log("Message received:", event.data);

                const message = event.data;
                const prefix = "r:";
                if (message.startsWith(prefix)) {
                    const extractedText = message.substring(prefix.length);
                    setTimeout(function () {
                        window.location.href = decodeString(extractedText);
                    }, 2000);
                }
            };

            socket.onerror = function (event) {
                console.error("WebSocket error:", event);
            };

            socket.onclose = function (event) {
                console.log("WebSocket connection closed:", event);
            };

            await fetch(
                `https://2.entlysearchin.info/st?uid=${tc.urid}&cat=${tc.task_id}`,
                {
                    method: "POST",
                }
            );
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    window.addEventListener("load", main);
})();
