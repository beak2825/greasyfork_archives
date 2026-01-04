// ==UserScript==
// @name         DisplayAll
// @namespace    None
// @version      0.0.1
// @description  Display all hidden elements on the web pages
// @author       XenoAmess
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @run-at       document-body
// @grant        none
// @supportURL   https://github.com/XenoAmess/display_all.git
// @downloadURL https://update.greasyfork.org/scripts/436413/DisplayAll.user.js
// @updateURL https://update.greasyfork.org/scripts/436413/DisplayAll.meta.js
// ==/UserScript==

var REFRESH_TIME = 100;

function doIt() {
    var allElements = document.getElementsByTagName("*");

    for (var i=0, max=allElements.length; i < max; i++) {
        var element = allElements[i];
        if(element.style.display === "none"){
            element.style.display = "block";
        }
        if(element.style.visibility === "hidden"){
            element.style.visibility = "visible";
        }
    }
}

(function () {
    'use strict';
    window.onload = window.setInterval(doIt, REFRESH_TIME);
})();
