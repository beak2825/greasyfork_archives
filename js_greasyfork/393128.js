// ==UserScript==
// @name        Discord Theme Color
// @namespace   Violentmonkey Scripts
// @match       https://discordapp.com/*
// @match       https://discord.com/*
// @grant       none
// @version     1.01
// @author      Akaza
// @description Sets the Discord theme color to allow better title bar looking in PWA mode
// @downloadURL https://update.greasyfork.org/scripts/393128/Discord%20Theme%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/393128/Discord%20Theme%20Color.meta.js
// ==/UserScript==

var metaTag=document.createElement('meta');
metaTag.name = "theme-color"
metaTag.content = "#202225"
document.getElementsByTagName('head')[0].appendChild(metaTag);