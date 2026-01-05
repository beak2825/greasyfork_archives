// ==UserScript==
// @name         Auto swap karnage
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Auto swaps weapons
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26888/Auto%20swap%20karnage.user.js
// @updateURL https://update.greasyfork.org/scripts/26888/Auto%20swap%20karnage.meta.js
// ==/UserScript==

setInterval(function(){ 
if(inWindow || player.alive)
    incWeapon(-1);
}, 10);