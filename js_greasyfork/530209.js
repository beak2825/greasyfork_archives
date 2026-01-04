// ==UserScript==
// @name         kxBypass Shortlinks Bypasser [READ DESCRIPTION]
// @namespace    https://discord.gg/pqEBSTqdxV
// @version      1.5.2
// @description  Bypass annoying shortlinks and get to your destination!
// @author       awaitlol.
// @match        https://bstlar.com/*
// @match        https://rekonise.com/*
// @match        https://mboost.me/*
// @icon         https://i.pinimg.com/736x/aa/2a/e5/aa2ae567da2c40ac6834a44abbb9e9ff.jpg
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530209/kxBypass%20Shortlinks%20Bypasser%20%5BREAD%20DESCRIPTION%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/530209/kxBypass%20Shortlinks%20Bypasser%20%5BREAD%20DESCRIPTION%5D.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const modalHTML = `
        <div id="kxBypass-modal">
            <div id="kxBypass-modal-content">
                <img src="https://i.pinimg.com/736x/aa/2a/e5/aa2ae567da2c40ac6834a44abbb9e9ff.jpg" id="kxBypass-logo">
                <h1>kxBypass Development</h1>
                <p>Bypass Successful! Here is your link:</p>
                <input type="text" id="kxBypass-link" value="" readonly>
                <button id="kxBypass-redirect">Redirect</button>
                <button id="kxBypass-close">✕</button>
            </div>
        </div>
    `;

    const styleCSS = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        #kxBypass-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
        }

        #kxBypass-modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 100%;
            position: relative;
        }

        #kxBypass-logo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-bottom: 10px;
        }

        #kxBypass-modal-content h1 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
        }

        #kxBypass-modal-content p {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }

        #kxBypass-link {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            text-align: center;
            font-size: 14px;
            color: #333;
            margin-bottom: 15px;
        }

        #kxBypass-modal-content button {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.3s ease;
        }

        #kxBypass-redirect {
            background: #3498db;
            color: #fff;
        }

        #kxBypass-redirect:hover {
            background: #2980b9;
        }

        #kxBypass-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            background: rgba(255, 255, 255, 0.95) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 2147483647 !important;
            font-family: 'Poppins', sans-serif !important;
            animation: fadeIn 0.5s ease-in-out !important;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        #kxBypass-content {
            display: flex !important;
            align-items: center !important;
            gap: 15px !important;
            max-width: 80% !important;
            background: white !important;
            padding: 20px !important;
            border-radius: 10px !important;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2) !important;
        }

        #kxBypass-text h1 {
            font-size: 18px !important;
            font-weight: 600 !important;
            margin: 0 !important;
            color: #333 !important;
        }

        #kxBypass-text p {
            font-size: 14px !important;
            margin: 5px 0 !important;
            color: #666 !important;
        }

        #kxBypass-timer {
            margin: 10px 0;
            width: 100%;
        }

        #kxBypass-time-left {
            font-size: 13px;
            color: #555;
            margin-bottom: 5px;
            text-align: center;
        }

        #kxBypass-time-left span {
            font-weight: 600;
            color: #3498db;
        }

        .kxBypass-progress-bar {
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            overflow: hidden;
        }

        .kxBypass-progress {
            height: 100%;
            width: 100%;
            background: #3498db;
            border-radius: 2px;
            transition: width 1s linear;
        }

        #kxBypass-logs {
            max-height: 100px !important;
            overflow-y: auto !important;
            font-size: 12px !important;
            padding: 5px !important;
            background: #f4f4f4 !important;
            border-radius: 5px !important;
            width: 100% !important;
            margin-bottom: 10px !important;
        }

        #kxBypass-overlay #kxBypass-redirect {
            background: #3498db !important;
            color: white !important;
            border: none !important;
            padding: 10px 20px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            transition: background 0.2s ease-in-out !important;
        }

        #kxBypass-overlay #kxBypass-redirect:disabled {
            background: #999 !important;
            cursor: not-allowed !important;
        }

        #kxBypass-overlay #kxBypass-redirect:not(:disabled):hover {
            background: #2980b9 !important;
        }

        .kxBypass-invite {
            font-size: 14px !important;
            color: #3498db !important;
            text-decoration: none !important;
            font-weight: 600 !important;
        }

        .kxBypass-invite:hover {
            text-decoration: underline !important;
        }
    `;

    function showBypassModal(link) {
        const modalContainer = document.createElement("div");
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        const linkInput = document.getElementById("kxBypass-link");
        if (linkInput) linkInput.value = link;

        document.getElementById("kxBypass-redirect").addEventListener("click", () => {
            window.location.href = link;
        });

        document.getElementById("kxBypass-close").addEventListener("click", () => {
            document.getElementById("kxBypass-modal").remove();
        });
    }

    function hasCloudflare() {
        const pageText = document.body.innerText || "";
        const pageHTML = document.documentElement.innerHTML;
        return pageText.includes("Just a moment") || pageHTML.includes("Just a moment");
    }

    function handleBstlar() {
        if (hasCloudflare()) return;

        const path = new URL(window.location.href).pathname.substring(1);

        fetch(`https://bstlar.com/api/link?url=${path}`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "authorization": "null",
                "Referer": window.location.href,
                "Referrer-Policy": "same-origin"
            },
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            if (data.tasks && data.tasks.length > 0) {
                const linkId = data.tasks[0].link_id;
                return fetch("https://bstlar.com/api/link-completed", {
                    headers: {
                        "accept": "application/json, text/plain, */*",
                        "content-type": "application/json;charset=UTF-8",
                        "authorization": "null",
                        "Referer": window.location.href,
                        "Referrer-Policy": "same-origin"
                    },
                    body: JSON.stringify({ link_id: linkId }),
                    method: "POST"
                });
            }
            throw new Error("No tasks found in response!");
        })
        .then(response => response.text())
        .then(finalLink => showBypassModal(finalLink))
        .catch(console.error);
    }

    function handleRekonise() {
        if (hasCloudflare()) return;

        fetch(`https://api.rekonise.com/social-unlocks${location.pathname}/unlock`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                "authorization": "null",
                "Referer": window.location.href,
                "Referrer-Policy": "same-origin"
            },
            method: "GET"
        })
.then(response => response.json())
.then(data => {
    const responseText = JSON.stringify(data);
    const urlMatch = responseText.match(/(https?:\/\/[^\s"]+)/);
    const foundUrl = urlMatch ? urlMatch[0] : null;

    if (foundUrl) {
        showBypassModal(foundUrl);
    } else {
        showBypassModal("Error, please join Discord Server in the Greasyfork script.");
    }
})
.catch(console.error);
    }

    function handleMboost() {

        const pageContent = document.documentElement.outerHTML;
        const targetUrlMatches = [...pageContent.matchAll(/"targeturl\\":\\"(https?:\/\/[^\\"]+)/g)];

        targetUrlMatches.forEach((match, index) => {
            const url = match[1];
            showBypassModal(url);
        });

        if (targetUrlMatches.length === 0) {
            showBypassModal('Could not find destination! Please join our Discord.');
        }

            }

    const style = document.createElement('style');
    style.textContent = styleCSS;
    document.head.appendChild(style);

    if (window.location.href.includes("bstlar.com")) handleBstlar();
    else if (window.location.href.includes("rekonise.com/")) handleRekonise();
    else if (window.location.href.includes("mboost.me/")) handleMboost()
})();