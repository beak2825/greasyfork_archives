// ==UserScript==
// @name         RefreshDKB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto refresh the dkb website, because you get logged out after 5 minutes.
// @author       https://github.com/F-Wer/
// @grant        none
// @include     https://www.dkb.de/*
// @downloadURL https://update.greasyfork.org/scripts/418739/RefreshDKB.user.js
// @updateURL https://update.greasyfork.org/scripts/418739/RefreshDKB.meta.js
// ==/UserScript==
var Button = document.getElementById('sessionInfoCountdown');
if (typeof(Button) !== 'undefined' && Button != null) {
    randomfunccall();
}

function refreshButton() {
    'use strict';
Button.click();
}

function randomfunccall() {
    window.setInterval(function(){
       refreshButton();
}, Math.random()*270000);
}