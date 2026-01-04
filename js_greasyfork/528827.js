// ==UserScript==
// @name         Disboard Bypass Redirect
// @namespace    https://spin.rip/
// @version      2025-03-04
// @description  Bypasses Disboard's join button redirect, by fetching the Discord invite directly from their API. Only works on the server page, not home page.
// @author       Spinfal
// @match        https://disboard.org/server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=disboard.org
// @grant        none
// @license      AGPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/528827/Disboard%20Bypass%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/528827/Disboard%20Bypass%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.msTimeout = 0;
    window.onload = () => {
        setTimeout(() => {
            const csrfToken = document.querySelector('[name="csrf-token"]')?.content;
            const disboardServerId = location.pathname.split("/").pop();

            if (!csrfToken) {
                window.msTimeout = 2000; // apply a timeout to ensure everything fully loads
                return alert("No CSRF Token was found. Try reloading the page.");
            } else {
                console.log(`CSRF Token found: ${csrfToken}`);
                console.log("Fetching invite now!");
                fetch(`https://disboard.org/site/get-invite/${disboardServerId}`, {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.6",
                        "priority": "u=1, i",
                        "x-csrf-token": csrfToken
                    },
                    "referrer": `https://disboard.org/server/join/${disboardServerId}`,
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(response => response.json()).then(response => {
                    const joinBtn = document.querySelector(`[data-id="${disboardServerId}"]`);
                    joinBtn.href = response;
                    joinBtn.removeAttribute("onclick");
                    joinBtn.innerText = "SKIP THE BULLSHIT";
                }).catch(error => new Error(error));
            }
        }, window.msTimeout);
    }
})();