// ==UserScript==
// @name         520cc.cc Image / Link Fix
// @namespace    520cc-cc
// @version      0.1.0
// @description  修復 520cc.cc 舊帖子圖片/網址失效問題
// @author       PikaTer
// @match        https://*.520cc.cc/*
// @icon         https://www.520cc.cc/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542361/520cccc%20Image%20%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/542361/520cccc%20Image%20%20Link%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /// ---- FUNCTIONS ---- ///

    // Replace Links
    function replaceLinks() {
        document.body.innerHTML = document.body.innerHTML.replace(/520cc\.me/g, "520cc.cc")
    }

    /// ---- MAIN SCRIPT ---- ///

    // Try To Get Target Node Into Observer Watch
    replaceLinks();
})();
