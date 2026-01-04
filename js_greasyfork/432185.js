// ==UserScript==
// @name         anti_pcbeta_ad-check
// @namespace    https://github.com/Kyouichirou
// @version      1.0
// @description  disable pcbeta ad check and create top ad frame
// @author       Lian
// @match        https://*.pcbeta.com/*
// @compatiable  chrome; just test on chrome 80+
// @noframes
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432185/anti_pcbeta_ad-check.user.js
// @updateURL https://update.greasyfork.org/scripts/432185/anti_pcbeta_ad-check.meta.js
// ==/UserScript==

(() => {
    "use strict";
    document.getElementById = new Proxy(document.getElementById, {
        apply(target, thisArg, args) {
            return args && args.length === 1 && args[0] === "wp"
                ? null
                : target.apply(thisArg, args);
        },
    });
})();