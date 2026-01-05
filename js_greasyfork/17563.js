// ==UserScript==
// @name         511nj camera timeout disabler
// @namespace    511nj camera timeout disabler
// @version      2016-03-01--1
// @description  Removes inactivity timeout ("click to resume"). No more having to click every ~60 seconds.
// @author       MutationObserver
// @match        http://*.511nj.org/mapwidget/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17563/511nj%20camera%20timeout%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/17563/511nj%20camera%20timeout%20disabler.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

for (var i = 0 ; i < 10000 ; i++) {
    clearTimeout(i); 
    clearInterval(i);
}