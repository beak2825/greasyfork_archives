// ==UserScript==
// @name         ??-?? STEAM FAVICON
// @version      2.7
// @description  Script to change steam favicon to the old icon what I base this off of https://greasyfork.org/en/scripts/481559-use-old-reddit-favicon works perfectly with https://greasyfork.org/en/scripts/496491-2009-to-2017-steam-header
// @author       ...
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @namespace https://store.steampowered.com/
// @downloadURL https://update.greasyfork.org/scripts/496492/-%20STEAM%20FAVICON.user.js
// @updateURL https://update.greasyfork.org/scripts/496492/-%20STEAM%20FAVICON.meta.js
// ==/UserScript==

 
let newfav = `https://i.imgur.com/IyRNcE6.png:`;
 
// "beyond this line" etc etc
 
window.addEventListener('load', () => {
var icon = [...document.querySelectorAll('link[rel~="icon"]')];
var copy = icon[0].cloneNode(true);
copy.href = newfav;
icon.map(x=>x.parentNode.removeChild(x));
document.head.appendChild(copy);
}, false);