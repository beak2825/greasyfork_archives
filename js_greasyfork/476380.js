// ==UserScript==
// @name         Trulia bigger map
// @namespace    http://sphire.co/
// @version      0.1
// @description  Prefers a bigger map on Trulia.com
// @author       Juan Sanchez <jsanchez@sphire.co>
// @match        https://www.trulia.com/for_sale/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trulia.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476380/Trulia%20bigger%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/476380/Trulia%20bigger%20map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const resultsColumn = document.getElementById('resultsColumn');
    const mapSection = document.querySelector('#main-content > div > section');

    if(resultsColumn && mapSection){
        resultsColumn.style.width = '40%';
        mapSection.style.width = '59%';
    }

    console.log("Listening Trulia", resultsColumn, mapSection);
})();