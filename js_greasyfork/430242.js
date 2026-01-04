// ==UserScript==
// @name         Wikipedia Ad Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Wikipedia ads without click
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://*.wikipedia.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430242/Wikipedia%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/430242/Wikipedia%20Ad%20Remover.meta.js
// ==/UserScript==
 
(function() {
    "use strict";
 
    function addStyleHide(cssSelector){
        var D = document;
        var newNode = D.createElement('style');
        newNode.textContent = cssSelector + "{display:none !important;}";
        var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild (newNode);
    }
 
    // main
 
    const hideSelectors = [
        "div#siteNotice",
        "div#frb-nag"
    ];
 
    for (var i = 0; i < hideSelectors.length; i++) {
        addStyleHide(hideSelectors[i]);
    }
}());