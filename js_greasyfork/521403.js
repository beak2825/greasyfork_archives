// ==UserScript==
// @name         修复3dm论坛图片遮挡bug
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏 bbs.3dmgame.com 网页上的class为pct的div内的img元素
// @author       You
// @match        *://bbs.3dmgame.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521403/%E4%BF%AE%E5%A4%8D3dm%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E9%81%AE%E6%8C%A1bug.user.js
// @updateURL https://update.greasyfork.org/scripts/521403/%E4%BF%AE%E5%A4%8D3dm%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E9%81%AE%E6%8C%A1bug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove img elements inside divs with class "pct"
    function hideImagesInPctDivs() {
        // Select all div elements with the class "pct"
        var pctDivs = document.querySelectorAll('div.pct');

        // Iterate over the NodeList of divs and remove img child elements
        pctDivs.forEach(function(div) {
            // Select all img elements that are children of the current div
            var images = div.querySelectorAll('img');
            // Convert NodeList to Array and remove each img element
            Array.from(images).forEach(function(img) {
                img.remove();
            });
        });
    }

    // Run the function once when the script loads
    hideImagesInPctDivs();

    // Optionally, if you want to handle dynamic content loaded after page load,
    // you can set up a MutationObserver or use events like DOMSubtreeModified.
})();