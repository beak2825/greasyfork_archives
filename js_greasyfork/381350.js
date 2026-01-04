// ==UserScript==
// @name         Goatlings: Flutter Snap Auto-Player
// @version      0.2
// @description  It'll play 50 rounds of Flutter Snap real quick for you.
// @author       twitter.com/RotomDex
// @match        http://www.goatlings.com/rps*
// @namespace    https://greasyfork.org/users/248719
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381350/Goatlings%3A%20Flutter%20Snap%20Auto-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/381350/Goatlings%3A%20Flutter%20Snap%20Auto-Player.meta.js
// ==/UserScript==

var delayMin = 200;
var delayMax = 600;
var random = Math.floor(Math.random()*(3 - 1 + 1) + 1);
var content = document.body.textContent || document.body.innerText;
var flutter = content.indexOf("Flutter Snap")!==-1;

if (flutter){
    setTimeout ( function () { location.href = "http://www.goatlings.com/rps/play/"+random;}, (Math.round(Math.random() * (delayMax - delayMin)) + delayMin) );}