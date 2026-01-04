// ==UserScript==
// @name         调整预览图亮度
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  Replace class in the specified domain
// @author       夜露死苦
// @match        https://fc2ppvdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2ppvdb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522650/%E8%B0%83%E6%95%B4%E9%A2%84%E8%A7%88%E5%9B%BE%E4%BA%AE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/522650/%E8%B0%83%E6%95%B4%E9%A2%84%E8%A7%88%E5%9B%BE%E4%BA%AE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define class names as variables for easy adjustment
    const imgOldClass = 'brightness-50';
    const imgNewClass = 'brightness-100';
    const divOldClass = 'brightness-50';
    const divNewClass = 'brightness-100';

    // Function to replace class names
    function replaceClass() {
        // Replace class for img elements
        const images = document.querySelectorAll(`img.object-contain.object-center.w-full.max-h-80.rounded-lg.bg-gray-800.${imgOldClass}`);
        images.forEach(img => {
            img.classList.remove(imgOldClass);
            img.classList.add(imgNewClass);
        });

        // Replace class for div elements
        const divs = document.querySelectorAll(`div.relative.${divOldClass}`);
        divs.forEach(div => {
            div.classList.remove(divOldClass);
            div.classList.add(divNewClass);
        });
    }

    // Run the replaceClass function after the DOM is fully loaded
    window.addEventListener('load', replaceClass);
})();