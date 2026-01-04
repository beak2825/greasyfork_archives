// ==UserScript==
// @name         Autoclick Reddit Home
// @namespace    Reddit Home clicker
// @version      0.2
// @description  Autoclick Home
// @match        https://new.reddit.com/user/YOURUSERNAME/followers
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/508588/Autoclick%20Reddit%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/508588/Autoclick%20Reddit%20Home.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to click the element
    function clickElement() {
        const element = document.querySelector('.WPSTJCepGLEWZl2fETrUM._2iuoyPiKHN3kfOoeIQalDT._10BQ7pjWbeYP63SAPNS8Ts.HNozj_dKjQZ59ZsfEegz8');
        if (element) {
            element.click();
        }
    }
 
    window.addEventListener('load', clickElement);
})();