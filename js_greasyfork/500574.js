// ==UserScript==
// @name         Bring Back Discover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  i love shaq
// @author       @fzve
// @match        *://*.roblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500574/Bring%20Back%20Discover.user.js
// @updateURL https://update.greasyfork.org/scripts/500574/Bring%20Back%20Discover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function replaceText() {
        var xpath = "/html/body/div[3]/div/div[1]/div/ul[1]/li[1]/a[2]";
        var element = getElementByXPath(xpath);
        if (element) {
            element.textContent = "Discover";
        }
    }

    window.addEventListener('load', replaceText);
})();
