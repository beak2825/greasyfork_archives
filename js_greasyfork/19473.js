// ==UserScript==
// @name         Humanatic Contador
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Contador
// @author       Jose Enrique ayala Villegas
// @match        https://www.humanatic.com/pages/review.cfm
// @match        https://www.humanatic.com/pages/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/19473/Humanatic%20Contador.user.js
// @updateURL https://update.greasyfork.org/scripts/19473/Humanatic%20Contador.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';
timeTitle(0,document.title);
function timeTitle(time,title){
    document.title = title + ": " + time;
setTimeout(function(){timeTitle(time+1,title);},1000);
}