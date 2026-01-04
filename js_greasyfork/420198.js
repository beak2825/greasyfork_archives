// ==UserScript==
// @name         BGB=Bô_goânbûn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mài hiánsī goânbûn, khah bē tī chhiòⁿkoa ê sîchūn hō͘ kanliáu.
// @author       THÔ͘TĀU
// @match        https://kuasu.tgb.org.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420198/BGB%3DB%C3%B4_go%C3%A2nb%C3%BBn.user.js
// @updateURL https://update.greasyfork.org/scripts/420198/BGB%3DB%C3%B4_go%C3%A2nb%C3%BBn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var original = document.querySelectorAll("p.show-original")
    for(var item of original) {
      item.innerText = " "
    }
})();