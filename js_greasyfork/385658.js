// ==UserScript==
// @name         Opponent's Color Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change color of opponent usernames
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385658/Opponent%27s%20Color%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385658/Opponent%27s%20Color%20Script.meta.js
// ==/UserScript==

/**************************
  Opponent's Color Script           
**************************/

var customStyle2=document.createElement("style");
customStyle2.innerHTML='.slot span a {color:red;} .slot span {color:green;}';
document.body.appendChild(customStyle2);
