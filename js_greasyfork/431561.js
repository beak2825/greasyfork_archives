// ==UserScript==
// @name         Quicker 旧时光
// @namespace    https://github.com/isPoto
// @version      0.1
// @description  追忆缅怀曾经的 Quicker
// @author       Poto
// @match        https://getquicker.net/Help/Versions/*
// @icon         https://www.google.com/s2/favicons?domain=https://getquicker.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431561/Quicker%20%E6%97%A7%E6%97%B6%E5%85%89.user.js
// @updateURL https://update.greasyfork.org/scripts/431561/Quicker%20%E6%97%A7%E6%97%B6%E5%85%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //const pos = document.querySelector("")
    var pos = document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[2]/a", document).iterateNext();
    pos.childNodes[2].nodeValue = " X64 ";

    var pos = document.evaluate("/html/body/div[1]/div/div[2]/div[2]/div/div[3]/a", document).iterateNext();
    pos.childNodes[2].nodeValue = " X86 ";
    // Your code here...
})();