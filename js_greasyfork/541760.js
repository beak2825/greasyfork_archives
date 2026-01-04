// ==UserScript==
// @name         Blur Sensitive Data on Speedtest.net
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Blur IPs, host info, sponsor links/names, survey params on speedtest.com
// @match        https://www.speedtest.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541760/Blur%20Sensitive%20Data%20on%20Speedtestnet.user.js
// @updateURL https://update.greasyfork.org/scripts/541760/Blur%20Sensitive%20Data%20on%20Speedtestnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ipRegex = /\b\d{1,3}(?:\.\d{1,3}){3}\b/;
    const blurStyle = 'filter: blur(12px) !important; user-select: none !important; pointer-events: none !important;';

    function blurSensitive() {
        // blur IPs and labels
        document.querySelectorAll('.result-data').forEach(el => {
            if (ipRegex.test(el.textContent)) {
                [el.previousElementSibling, el].forEach(e => {
                    if (e) e.style.cssText += blurStyle;
                });
            }
        });
        // blur server-host blocks
        document.querySelectorAll('.result-item-host').forEach(host => {
            host.style.cssText += blurStyle;
        });
        // blur sponsor link text
        document.querySelectorAll('a.js-data-sponsor').forEach(a => {
            a.style.cssText += blurStyle;
        });
        // blur sponsor name divs
        document.querySelectorAll('div.result-data.js-sponsor-name').forEach(div => {
            div.style.cssText += blurStyle;
        });
        // blur survey parameter
        document.querySelectorAll('p.audience-survey-parameter').forEach(p => {
            p.style.cssText += blurStyle;
        });
    }

    blurSensitive();
    new MutationObserver(blurSensitive).observe(document.body, { childList: true, subtree: true });
})();
