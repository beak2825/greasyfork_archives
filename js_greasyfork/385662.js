// ==UserScript==
// @name         Opponent's Field Grid Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove opponent's field grid
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385662/Opponent%27s%20Field%20Grid%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385662/Opponent%27s%20Field%20Grid%20Script.meta.js
// ==/UserScript==


/**************************
Opponent's Field Grid Script        
**************************/

var customStyle=document.createElement("style");
customStyle.innerHTML='.players .bgLayer{display:none;}';
document.body.appendChild(customStyle);