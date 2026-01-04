// ==UserScript==
// @name        Reboot Tube But Nice
// @namespace   Violentmonkey Scripts
// @match       https://reboot.tube/x/*
// @grant       none
// @version     1.0
// @license     GPLv3
// @author      Chopper1337
// @description 7/21/2022, 7:35:45 AM
// @downloadURL https://update.greasyfork.org/scripts/448211/Reboot%20Tube%20But%20Nice.user.js
// @updateURL https://update.greasyfork.org/scripts/448211/Reboot%20Tube%20But%20Nice.meta.js
// ==/UserScript==
 
// Player Size
document.getElementById("videowrap").style.width = "85%"
 
// Chat visibility
document.getElementById("chatwrap").style.display = "none"
 
// Empty footer visibilty
document.getElementById("footer").style.display = "none"
 
// Padding on the left of the player to center it
document.getElementById("videowrap").style.paddingLeft = "15%"
 
// Set control width to 100% so the rightmost controls are on the right of the screen
document.getElementById("rightcontrols").style.width = "100%" 