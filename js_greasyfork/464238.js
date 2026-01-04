// ==UserScript==
// @name         Remove menu bar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove the menu bar from a web page
// @match        https://cydmyz.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464238/Remove%20menu%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/464238/Remove%20menu%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the menu bar from the DOM
    var menubar = document.querySelector('.m-menubar');
    if (menubar) {
        menubar.parentNode.removeChild(menubar);
    }
})();
