// ==UserScript==
// @name         Add blank space below all pages
// @version      0.1
// @description  Allows you to scroll further down on all pages
// @author       jakibaki
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/39402
// @downloadURL https://update.greasyfork.org/scripts/18922/Add%20blank%20space%20below%20all%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/18922/Add%20blank%20space%20below%20all%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var newHTML = document.createElement ('div');
    var w = window.innerHeight;
    newHTML.innerHTML = '<hr style="height:' + w +'pt; visibility:hidden;" />';
    document.body.appendChild (newHTML);
})();