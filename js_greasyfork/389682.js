// ==UserScript==
// @name         rif page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://acorn.utoronto.ca/sws/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/389682/rif%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/389682/rif%20page.meta.js
// ==/UserScript==

(function() {
    // var a = 'Rifaquat <span id=\"last-name-caret\">Nabi</span><span class=\"caret"></span>';
    var a = 'Rifaquat Nabi';
    var content = document.getElementsByClassName("flex-item header-username top-nav-link dropdown-toggle")[0];
    content.innerHTML = a;
})();