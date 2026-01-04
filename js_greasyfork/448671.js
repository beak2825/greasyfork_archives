// ==UserScript==
// @name         Terraria wiki.gg redirect
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Redirects you from fandom to wiki gg
// @author       Chromeno, based on youtube shorts redirect by Fuim
// @match        *://*.fandom.com/*
// @icon         https://terraria.gamepedia.com/media/6/64/Favicon.ico
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/448671/Terraria%20wikigg%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/448671/Terraria%20wikigg%20redirect.meta.js
// ==/UserScript==
var oldHref = document.location.href;
if (window.location.href.indexOf('terraria.fandom.com') > -1) {
    window.location.replace(window.location.toString().replace('fandom.com', 'wiki.gg'));
}