// ==UserScript==
// @name         Remove ad div element
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove ad div element from the webpage
// @match        http://www.htmanga3.top/*
// @match        *://www.htmanga3.top/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464868/Remove%20ad%20div%20element.user.js
// @updateURL https://update.greasyfork.org/scripts/464868/Remove%20ad%20div%20element.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.querySelectorAll('div > script[src*="561245.xyz"]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.remove();
    }
})();
