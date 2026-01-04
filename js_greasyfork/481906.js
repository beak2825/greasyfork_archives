// ==UserScript==
// @name         Remove paywall for Study.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes study.com's transcript paywall.
// @author       tacohitbox
// @match        https://study.com/academy/lesson/*
// @icon         https://study.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481906/Remove%20paywall%20for%20Studycom.user.js
// @updateURL https://update.greasyfork.org/scripts/481906/Remove%20paywall%20for%20Studycom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#transcriptMain .hidden").style = "display:block !important; visibility: visible !important";
    document.querySelector("#transcriptMain .faded-content").style = "position: inherit !important";
    document.querySelector(".article-cutoff-div").remove();
})();