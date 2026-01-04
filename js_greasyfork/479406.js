// ==UserScript==
// @name         WW Requests
// @namespace    bpnrzhk.xyz
// @version      0.7
// @description  Send requests to WW discord server
// @author       Kivou [2000607]
// @match        https://www.torn.com/jailview.php*
// @match        https://www.torn.com/preferences.php*
// @icon         https://bpnrzhk.xyz/media/ww.png
// @require      https://greasyfork.org/scripts/477604-kiv-lib/code/kiv-lib.js?version=1277638
// @require      https://greasyfork.org/scripts/479408-kib-key/code/kib-key.js?version=1277647
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/479406/WW%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/479406/WW%20Requests.meta.js
// ==/UserScript==

// Copyright © 2023 Kivou [2000607] <contact@yata.yt>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

console.log("[WW Requests] script loaded");

// ------------- //
// CONFIGURATION //
// ------------- //
const DISCORD = "1033832974979956799";
const API_URL = "https://bpnrzhk.xyz/apiapwxndgrocsgp";
const WS_PORT = "8642";

// ------------- //
// SETUP API KEY //
// ------------- //
storeKey("ww-requests", "WW Requests");

// ----------------- //
// Display bust call //
// ----------------- //
waitFor(document, "div.content-title").then(div => {

    // stop if not preferences
    if (window.location.href.includes("preferences.php")) { return; }

    // get key
    const key = localStorage.getItem(`ww-requests-key`);

    // make html
    let innerHTML = "";
    innerHTML += `<div>`;
    innerHTML += `<b>[WW Requests]</b> Bust request`;
    if (key) {
        innerHTML += ` | <a id="ww-bust-call" class="t-blue" href="#">Call discord server</a>`;
    } else {
        innerHTML += ` | Status <b id="ww-status" style="color: var(--default-red-color); font-weight: bold;">disabled</b>`;
        innerHTML += ` | Go to <a href="/preferences.php#tab=api" class="t-blue">preference page</a> setup your API key`;
    }
    innerHTML += `</div>`;
    innerHTML += `<div class="clear"></div>`;
    innerHTML += `<hr class="page-head-delimiter m-top10">`;

    // display html
    const elm = document.createElement("div");
    elm.innerHTML = innerHTML;
    div.insertAdjacentElement('afterend', elm);

    // --------- //
    // Bust call //
    // --------- //
    document.getElementById("ww-bust-call").addEventListener("click", e => {
        e.preventDefault();

        const responseFormat = (target, message, color) => {
            target.innerHTML = message;
            target.className = "";
            target.style.color = color;
            target.style.fontWeight = "bold";
            target.style.textDecoration = "none";
        };

        let data = {
            type: "bust",
            discord: DISCORD,
            api_key: key,
            player_id: playerIdFromChat().id
        };
        GM.xmlHttpRequest({
            method: 'POST',
            url: API_URL,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Webscoket-Relay-Port": WS_PORT
            },
            onload: (response) => {
                for (let k in data) {
                    console.log(`[gmWS] payload - ${k}: ${data[k]}`);
                }
                if (response.status == '200') {
                    responseFormat(e.target, "Call sent", "var(--default-green-color)");
                    return;
                }

                try {
                    const r = JSON.parse(response.responseText);
                    if (response.status == "300") {
                        alert(`WW Requests: ${r.message}`);
                    }
                    responseFormat(e.target, `Error code ${response.status}: ${r.message}`, "var(--default-red-color)");
                } catch (error) {
                    console.error(error);
                    responseFormat(e.target, `Error code ${response.status}: ${response.statusText}`, "var(--default-red-color)");
                }

            }
        });
    });
});
