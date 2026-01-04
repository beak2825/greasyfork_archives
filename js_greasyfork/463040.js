// ==UserScript==
// @name         Greasy Fork by-site-searching URL autoextract
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically extract the domain name from an input URL.
// @author       shiquda
// @match        https://greasyfork.org/*/scripts/by-site
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463040/Greasy%20Fork%20by-site-searching%20URL%20autoextract.user.js
// @updateURL https://update.greasyfork.org/scripts/463040/Greasy%20Fork%20by-site-searching%20URL%20autoextract.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tab = document.querySelector("body > div.width-constraint > section > form > input[type=search]:nth-child(2)")
    tab.addEventListener("input",change)
    function change(){
        var text = tab.value
        var change = text.match(/^https?:\/\/(?:www\.)?([^/?#]+)/i)[1]
        tab.value = change
    }
    // Your code here...
})();
