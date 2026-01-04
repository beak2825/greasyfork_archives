// ==UserScript==
// @name         Gartic.io Tokens
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  T
// @author       You
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546665/Garticio%20Tokens.user.js
// @updateURL https://update.greasyfork.org/scripts/546665/Garticio%20Tokens.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOKEN_INTERVAL = 5000;
    const PAGE_REFRESH_INTERVAL = 2 * 60 * 1000;

    function requestToken() {
        try {
            window.turnstile.render("#cf-turnstile", {
                sitekey: "0x4AAAAAABBPKaIbNwnPEfSo",
                callback: function (token) {
                    console.log("Token received:", token);

                    fetch("https://3000-izobkbzlprlynilttp9rk-07928a8a.manusvm.computer/add-token", { // <--- هذا هو رابط السيرفر الخاص بك
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ token: token })
                    })
                    .then(res => res.json())
                    .then(data => console.log("Server Response:", data))
                    .catch(err => console.error("Error sending token:", err));
                }
            });
        } catch (e) {
            console.error("Turnstile error:", e);
        }
    }

    setInterval(requestToken, TOKEN_INTERVAL);
    requestToken();

    setTimeout(() => {
        console.log("Refreshing page to prevent freeze...");
        location.reload();
    }, PAGE_REFRESH_INTERVAL);

})();
