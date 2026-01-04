// ==UserScript==
// @name         BilibiliAdTipRemoval
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Bilibili.com adblock-tips.
// @author       Winston Shu
// @match        *://www.bilibili.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457180/BilibiliAdTipRemoval.user.js
// @updateURL https://update.greasyfork.org/scripts/457180/BilibiliAdTipRemoval.meta.js
// ==/UserScript==

(function () {
    "use strict";

    window.onload = () => {
        let tip = document.querySelector(".adblock-tips");
        if (tip) {
            tip.remove();
        }
    };
})();
