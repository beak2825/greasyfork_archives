// ==UserScript==
// @name         Donotban
// @namespace    averybigant.github.io
// @version      0.1
// @description  Bypass the ban on unverified overseas douban users
// @author       averybigant
// @match        https://*.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @license      GNU GPLv3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446843/Donotban.user.js
// @updateURL https://update.greasyfork.org/scripts/446843/Donotban.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.info("Donotban v0.1 Enabled");

    // 很暴力！但有用阿！
    function blockScript(e) {
        //console.debug(e.target.attributes['src']);
        if (e.target.src && e.target.src.includes("abnormal_account.js")) {
            e.preventDefault();
            console.info("abnormal_account.js blocked");
        }
    }
    document.addEventListener("beforescriptexecute", blockScript, true);

    function applyPhonyObjects() {
        if (window._USER_ABNORMAL) {
            window._USER_ABNORMAL = undefined;
        }
        Object.defineProperty(window, "show_abnormal", {get: () => {return () => {console.warn("show_abnormal called")};},
                                                        set: (v) => {console.warn("assignment for show_abnormal ignored");}}
                             );
    }
    document.addEventListener("DOMContentLoaded", applyPhonyObjects);
})();
