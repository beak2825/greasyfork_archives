// ==UserScript==
// @name         YouMath cliccabile
// @namespace    https://github.com/tekinosman/
// @version      1.1
// @license      MIT
// @description  Rende cliccabili gli elementi presenti nelle pagine (collegamenti, testo ecc.) di YouMath
// @author       Osman Tekin
// @match        https://www.youmath.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youmath.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454396/YouMath%20cliccabile.user.js
// @updateURL https://update.greasyfork.org/scripts/454396/YouMath%20cliccabile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onselectstart=null;
    document.onmousedown=null;
    document.onclick=null;
    document.querySelectorAll("p").forEach(e => e.style="user-select:text")
})();