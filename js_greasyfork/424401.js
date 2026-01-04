// ==UserScript==
// @name         OWOP Random Color Fixed
// @namespace    *.ourworldofpixels.com/*
// @version      0.2.5
// @description  LSD xd
// @author       Armağan
// @match        *.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424401/OWOP%20Random%20Color%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/424401/OWOP%20Random%20Color%20Fixed.meta.js
// ==/UserScript==

var interval = window.prompt("interval? (MS)", "50")

setInterval(function(){

var R = Math.floor((Math.random() * 255) + 1)
var G = Math.floor((Math.random() * 255) + 1)
var B = Math.floor((Math.random() * 255) + 1)

WorldOfPixels.player.selectedColor = [R, G, B]

},interval);