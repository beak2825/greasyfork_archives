// ==UserScript==
// @name         Remove Watermark
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  清除
// @author       Wy
// @match        *://quantum.37wan.com/*
// @match        *://yilan.37wan.com/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/491452/Remove%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/491452/Remove%20Watermark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hasBackgroundImage(element) {
        const style = window.getComputedStyle(element);
        return style.backgroundImage !== 'none';
    }

    function removeElementsWithBackgroundImage() {
        const elementsWithBackgroundImage = Array.from(document.querySelectorAll('*')).filter(hasBackgroundImage);
        console.log(elementsWithBackgroundImage);
        elementsWithBackgroundImage.forEach(element => element.remove());
    }

    window.addEventListener('load', () => {
        setTimeout(removeElementsWithBackgroundImage, 0);
    });

    window.addEventListener('load', function() {
        var intervalID = setInterval(removeElementsWithBackgroundImage, 40000);
    });
})();