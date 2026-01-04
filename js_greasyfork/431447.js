// ==UserScript==
// @name         every links to litteral links
// @namespace    http://tampermonkey.net/
// @version      69.420
// @description  replaces every link's text with the word link on every website
// @author       joe
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431447/every%20links%20to%20litteral%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/431447/every%20links%20to%20litteral%20links.meta.js
// ==/UserScript==
function code() {
    // Your code here...
    var p = document.getElementsByTagName('a');
    for (let i = 0; i<p.length; i++) {
        p[i].textContent = "link";
    }
}

(function() {
   'use strict';
    window.onload = code();
})();