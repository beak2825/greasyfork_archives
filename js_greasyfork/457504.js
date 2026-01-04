// ==UserScript==
// @name        Jell Machine Logo
// @namespace   Violentmonkey Scripts
// @match       https://play.jell-machine.com/
// @grant       none
// @version     1.0
// @author      happy bob007
// @description This takes the Jell Machine Discord server icon and puts it for the favicon.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457504/Jell%20Machine%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/457504/Jell%20Machine%20Logo.meta.js
// ==/UserScript==
var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
}
link.href = 'https://cdn.discordapp.com/icons/866382264430362656/c52f7db24c3327dc85cb68d503602a8f.webp?size=96';