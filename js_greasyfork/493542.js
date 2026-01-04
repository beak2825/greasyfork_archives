// ==UserScript==
// @name        Adblock Warning - emoji.gg
// @namespace   https://emoji.gg/
// @version     1.0
// @description Remove Adblock Warning - emoji.gg
// @author      Youky
// @match       https://emoji.gg/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493542/Adblock%20Warning%20-%20emojigg.user.js
// @updateURL https://update.greasyfork.org/scripts/493542/Adblock%20Warning%20-%20emojigg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const adblockWarning = document.getElementById("yousuck");
    if (adblockWarning) {
        adblockWarning.remove();
    }
})();
