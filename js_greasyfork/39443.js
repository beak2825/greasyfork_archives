// ==UserScript==
// @name         Force Justify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  In modern times there really is no reason not to use justified text alignment always!
// @author       YStanislav Stankovic
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39443/Force%20Justify.user.js
// @updateURL https://update.greasyfork.org/scripts/39443/Force%20Justify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x = document.querySelectorAll("p");
    for (var i = 0; i < x.length; i++) {
        x[i].style.textAlign = "justify";
    }
    // Your code here...
})();