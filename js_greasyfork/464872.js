// ==UserScript==
// @name         头部
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove ad div element from the webpage
// @match        http://www.htmanga3.top/*
// @match        *://www.htmanga3.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464872/%E5%A4%B4%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/464872/%E5%A4%B4%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.querySelectorAll('script[type="text/javascript"][src=""][innerHTML*="img4.561245.xyz"]');
    for (var i = 0; i < elements.length; i++) {
        var scriptParent = elements[i].parentNode;
        scriptParent.remove();
    }
})();
