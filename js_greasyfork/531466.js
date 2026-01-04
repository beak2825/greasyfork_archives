// ==UserScript==
// @name         LeetCode
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  set leetcode img opacity
// @author       You
// @match        https://leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531466/LeetCode.user.js
// @updateURL https://update.greasyfork.org/scripts/531466/LeetCode.meta.js
// ==/UserScript==

(function() {
    'use strict';

       // Add CSS to make images semi-transparent and restore opacity on hover
    const style = document.createElement('style');
    style.textContent = `
        img {
            opacity: 0.7; /* Set semi-transparency */
            transition: opacity 0.1s ease; /* Smooth transition */
            filter: invert(100%);
        }

        img:hover {
            opacity: 1; /* Full opacity on hover */
            filter: invert(100%);
        }
    `;

    // Append the style to the document head
    document.head.appendChild(style);

    //刪掉premium的按鈕
    const premiumSpan = Array.from(document.querySelectorAll("span"))
  .find(span => span.textContent.trim() === "Premium");

const targetDiv = premiumSpan?.closest("div.ml-0");

if (targetDiv) {
  targetDiv.style = "display:none";
}


})();