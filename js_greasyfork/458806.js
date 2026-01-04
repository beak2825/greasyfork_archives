// ==UserScript==
// @name        DNOME Theme Discord
// @icon        https://github.com/GeopJr/DNOME/raw/main/logo.svg
// @namespace   Dev380
// @match       http*://discord.com/*
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @version     1.0
// @author      me
// @description Adds the DNOME theme https://github.com/GeopJr/DNOME to the discord website. DNOME is copyright Evangelos "GeopJr" Paterakis, under the BSD 2-clause
// @resource dnome_stylesheet https://raw.githubusercontent.com/GeopJr/DNOME/main/dist/DNOME.css
// @license BSD-2-Clause
// @downloadURL https://update.greasyfork.org/scripts/458806/DNOME%20Theme%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/458806/DNOME%20Theme%20Discord.meta.js
// ==/UserScript==

let styleSheet = GM_addStyle(GM_getResourceText("dnome_stylesheet"));
//document.head.appendChild(styleSheet)