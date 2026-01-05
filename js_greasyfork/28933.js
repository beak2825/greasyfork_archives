// ==UserScript==
// @name         Metro_grandprize_draw
// @namespace    
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.metroradio.com.hk/Campaign/gamea/grandprize_draw*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28933/Metro_grandprize_draw.user.js
// @updateURL https://update.greasyfork.org/scripts/28933/Metro_grandprize_draw.meta.js
// ==/UserScript==

(function Choose() {
    'use strict';
        var y = '';
        y = Math.floor((Math.random() * 6) + 1);
        if (y == 1) {document.getElementById("ctl00_ContentPlaceHolder1_ImageButton1").click();} 
        if (y == 2) {document.getElementById("ctl00_ContentPlaceHolder1_ImageButton2").click();}
        if (y == 3) {document.getElementById("ctl00_ContentPlaceHolder1_ImageButton3").click();}
        if (y == 4) {document.getElementById("ctl00_ContentPlaceHolder1_ImageButton4").click();}
        if (y == 5) {document.getElementById("ctl00_ContentPlaceHolder1_ImageButton5").click();}
        if (y == 6) {document.getElementById("ctl00_ContentPlaceHolder1_ImageButton6").click();}
    }
)();