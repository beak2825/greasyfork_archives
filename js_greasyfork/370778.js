// ==UserScript==
// @name         No Annoying Popups
// @namespace    LordBusiness.NAAAP
// @version      1.2
// @description  With this script, you will have no problems with annoying popups of energy and stuff while scrolling.
// @author       LordBusiness [2052465]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370778/No%20Annoying%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/370778/No%20Annoying%20Popups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bars = document.querySelectorAll("#barEnergy, #barHappy, #barNerve, #barLife, #barChain");

    for(let bar of bars) {
        bar.style.pointerEvents = "none";
    }
})();