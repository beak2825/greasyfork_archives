// ==UserScript==
// @name         CodePen Header Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the header from specific CodePen full-view pages
// @author       You
// @match        *://codepen.io/BruneCoding/full/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531537/CodePen%20Header%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/531537/CodePen%20Header%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the header element and remove it
        const header = document.querySelector('header#main-header.main-header');
        if (header) {
            header.remove();
            console.log('CodePen header removed');
        }
    });
})();