// ==UserScript==
// @name         NewAddblock For all sites and browsers
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  Blocks block-adblock
// @match        *://**/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/434507/NewAddblock%20For%20all%20sites%20and%20browsers.user.js
// @updateURL https://update.greasyfork.org/scripts/434507/NewAddblock%20For%20all%20sites%20and%20browsers.meta.js
// ==/UserScript==

(() => {
    const originalEval = window.eval;
    const keywords = ['advertising', 'ad', 'blocker', 'disabled', 'understand', 'site', 'income', 'okay', 'http://blockadblock.com', ''];

    window.eval = str => {

        // Check for keywords
        const matches = keywords.filter(v => str.includes(v));
        if (matches.length / keywords.length > 0.85) {
            console.log(`[ABBB] Probability of being ad-related: ${(matches.length / keywords.length) * 100}%`);

            // Check if it contains the base64 charset in a variable
            if (str.match(/[A-Za-z]+='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'/)) {
                console.log(` >> It contains the base64 charset`);

                // Check if it will clear the body element
                if (str.includes(`document.body.innerHTML=''`)) {
                    console.log(` >> It'll clear your dom. Blocked.`);
                    return;
                }
            }
        }

        return originalEval(str);
    };
})();