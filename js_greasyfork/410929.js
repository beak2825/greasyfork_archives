// ==UserScript==
// @name         Futaba Ad Remover
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Remove Futabachannel ads
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        *://*.2chan.net/*
// @match        *://*.2chan.net/*/*
// @match        *://*.2chan.net/*/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/410929/Futaba%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/410929/Futaba%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyleHide(cssSelector){
        var D = document;
        var newNode = D.createElement('style');
        newNode.textContent = cssSelector + "{display:none !important;}";
        var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild (newNode);
    }
    const hideSelectors = [
        "body > center > div:nth-child(9)",
        "body > div:nth-child(2)",
        "body > div:nth-child(6) > div",
        "body > div:nth-child(8) > div",
        "body > div.tue",
        "#rightadfloat",
        "#hdp + hr",
        "div[align=\"center\"]",
        "body > div:nth-child(16)",
        "body > div:nth-child(17)",
        "body > div:nth-child(18)",
        "body > div:nth-child(20)",
        "body > div:nth-child(21)",
        "body > div:nth-child(41)",
        "body > div:nth-child(47)"
    ];

    for (var i = 0; i < hideSelectors.length; i++) {
        addStyleHide(hideSelectors[i]);
    }
})();