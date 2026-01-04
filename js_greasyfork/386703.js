// ==UserScript==
// @name         OpenMM doc eye protection
// @namespace    https://www.zhaiyusci.net/
// @version      0.1
// @description  Change the fonts and background color of OpenMM documentation pages.
// @author       Yu Zhai
// @match        http://docs.openmm.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386703/OpenMM%20doc%20eye%20protection.user.js
// @updateURL https://update.greasyfork.org/scripts/386703/OpenMM%20doc%20eye%20protection.meta.js
// ==/UserScript==

(function() {
    var css1 = "p { font-family: Georgia, 'bell mt', serif }";
    var css2 = "body {background-color: #ffe}";
    var css3 = "div.body {background-color: #ffe}";
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css1));
    style.appendChild(document.createTextNode(css2));
    style.appendChild(document.createTextNode(css3));
document.head.appendChild(style);
})();