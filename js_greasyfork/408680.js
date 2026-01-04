// ==UserScript==
// @name         YouTube Ad Remover
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Skip and remove YouTube ads without click
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/408680/YouTube%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/408680/YouTube%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function clickButton(selector){
        let elm = document.getElementsByClassName(selector)[0];
        if (elm){ elm.click(); }
    }

    function addStyleHide(cssSelector){
        var D = document;
        var newNode = D.createElement('style');
        newNode.textContent = cssSelector + "{display:none !important;}";
        var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild (newNode);
    }

    function tick(){
        clickButton('ytp-ad-text ytp-ad-preview-text');
        clickButton('ytp-ad-skip-button ytp-button');
    }

    // main

    const hideSelectors = [
        ".GoogleActiveViewElement",
        ".masthead-ad",
        ".ytd-companion-slot-renderer",
        ".ytd-video-masthead-ad-v3-renderer",
        ".ytm-promoted-sparkles-text-search-renderer",
        ".ytm-promoted-sparkles-web-renderer",
        ".ytp-ad-image-overlay",
        ".ytp-ad-message-container",
        ".ytp-ad-player-overlay-flyout-cta",
        ".ytp-paid-content-overlay-text",
        "div.ytp-ad-overlay-slot",
        "ytd-display-ad-renderer"
        // "div:has(> ytd-display-ad-renderer)"
    ];

    for (var i = 0; i < hideSelectors.length; i++) {
        addStyleHide(hideSelectors[i]);
    }

    setInterval(tick, 10);
}());