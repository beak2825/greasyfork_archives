// ==UserScript==
// @name         [LOLZ] Delete Mamonts
// @namespace    Delete Mamonts
// @version      2024-01-01
// @description  Delete Mamonts
// @author       el9in
// @license      el9in
// @match        https://lzt.market/*
// @match        https://lzt.market
// @match        https://lolz.market
// @match        https://lolz.market/*
// @match        https://zelenka.guru
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483615/%5BLOLZ%5D%20Delete%20Mamonts.user.js
// @updateURL https://update.greasyfork.org/scripts/483615/%5BLOLZ%5D%20Delete%20Mamonts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const particles = document.querySelector("#particles-js");
    if(particles) particles.remove();
    // Your code here...
})();