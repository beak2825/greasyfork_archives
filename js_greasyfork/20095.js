// ==UserScript==
// @name         FXP Like Script
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  FXP Like Script.
// @author       Mystikal
// @match        https://www.fxp.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20095/FXP%20Like%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/20095/FXP%20Like%20Script.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
})();
var object =  document.getElementsByClassName('addlike');
var i = 0;
while (i < object.length)
{
    object[i].click();
    i++;
}