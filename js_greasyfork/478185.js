// ==UserScript==
// @name         Remove Blur 
// @namespace    tampermonkey-scripts
// @version      1
// @description  Removes blur
// @match        https://www.kontrolnaya-rabota.ru/*
// @match        http://www.kontrolnaya-rabota.ru/*
// @match        http://*.kontrolnaya-rabota.ru/*
// @match        https://*.kontrolnaya-rabota.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478185/Remove%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/478185/Remove%20Blur.meta.js
// ==/UserScript==

(function() {
    setInterval(function() {
        var blurredBlocks = document.querySelectorAll('.blurred-block');
        blurredBlocks.forEach(block => block.remove());
        var blurredClasses = document.querySelectorAll('[class*="before-blurred"], [class*="krapi-blurred"]');
        blurredClasses.forEach(function(element) {
            element.className = element.className.replace(/blurred/g, '');
        });
    }, 5000);
})();