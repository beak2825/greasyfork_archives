// ==UserScript==
// @name         Opponent's Field Background Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add background to opponent's field grid
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394743/Opponent%27s%20Field%20Background%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/394743/Opponent%27s%20Field%20Background%20Script.meta.js
// ==/UserScript==


/**************************
Opponent's Field Background Script
**************************/

colorName = "black"
opacity = 0.5

var customStyle=document.createElement("style");
customStyle.innerHTML='.players .bgLayer{background-color:'+colorName+';opacity:'+opacity+';}';
document.body.appendChild(customStyle);