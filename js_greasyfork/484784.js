// ==UserScript==
// @name         Ultimate Guitar Formatter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Fixes Formatting so you don't have to scroll as much when playing
// @author       You
// @match        *://tabs.ultimate-guitar.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484784/Ultimate%20Guitar%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/484784/Ultimate%20Guitar%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout(function(){
        document.getElementsByTagName('main')[0].children[0].style.display = 'none';
        document.getElementsByTagName('main')[0].parentElement.style.maxWidth='999999999px';
        document.getElementsByTagName('pre')[0].style.columnCount=3;
        document.querySelectorAll("span[data-name]").forEach(el => {el.style.lineHeight = 1;}); //fixes hidden chords
    },1000);
})();