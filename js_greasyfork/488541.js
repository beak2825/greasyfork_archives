// ==UserScript==
// @name        Minecraft Wiki Redirect
// @description Redirect Fandom and other front ends to minecraft.wiki
// @match       *://*.fandom.com/wiki/*
// @match       *://*.breezewiki.com/minecraft/wiki/*
// @match       *://*.antifandom.com/minecraft/wiki/*
// @grant       none
// @run-at      document-start
// @license     WTFPL
// @version 0.0.1.20240228135822
// @namespace https://greasyfork.org/users/1268060
// @downloadURL https://update.greasyfork.org/scripts/488541/Minecraft%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/488541/Minecraft%20Wiki%20Redirect.meta.js
// ==/UserScript==

let destination = 'minecraft.wiki/w';
let sources = ['minecraft.fandom.com/wiki', 'breezewiki.com/minecraft/wiki', 'antifandom.com/minecraft/wiki'];
let currentURL = window.location.href;

for (let source of sources) {
    if (currentURL.includes(source)) {
        window.location.replace(currentURL.replace(source, destination));
        break;
    }
}