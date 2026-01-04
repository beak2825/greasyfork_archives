// ==UserScript==
// @name         Wanikani Auto Info (Fixed)
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Automatically displays item info whenever an incorrect answer is given during Wanikani lessons.
// @author       adamjsturge
// @match        https://www.wanikani.com/subjects/review
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479036/Wanikani%20Auto%20Info%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479036/Wanikani%20Auto%20Info%20%28Fixed%29.meta.js
// ==/UserScript==sss

setTimeout((function() {
    'use strict';
    console.log(2)
    window.addEventListener("didAnswerQuestion", function(e){
        if (!e.detail.results.passed) {
            document.querySelector('[title="Item Info"]').click();
        }
    });
}), 1000)