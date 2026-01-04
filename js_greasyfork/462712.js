// ==UserScript==
// @name         Wanikani Auto Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically displays item info whenever an incorrect answer is given during Wanikani lessons.
// @author       jwilson232
// @match        https://www.wanikani.com/subjects/review
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462712/Wanikani%20Auto%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/462712/Wanikani%20Auto%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("didAnswerQuestion", function(e){
        if (!e.detail.results.passed) {
            document.querySelector('[title="Item Info"]').click();
        }
    });
})();