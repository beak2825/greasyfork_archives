// ==UserScript==
// @name         Old Curseforge Please!
// @version      1.0
// @description  Converts curseforge.com links to legacy.curseforge.com links
// @namespace    hrudyplayz.com
// @license      MIT
// @author       HRudyPlayZ
// @match        *://www.curseforge.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.curseforge.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/464782/Old%20Curseforge%20Please%21.user.js
// @updateURL https://update.greasyfork.org/scripts/464782/Old%20Curseforge%20Please%21.meta.js
// ==/UserScript==

// Adapted from Ksir's Old Reddit Please! https://greasyfork.org/fr/scripts/40897-old-reddit-please

function test(url) {
    return url.match(/^(|http(s?):\/\/)(|www\.)curseforge\.com(\/.*|$)/gim);
}

function getNewPagePlease(url) {
    return 'https://legacy.curseforge.com' + url.split('curseforge.com').pop();
}

function fixCurseforgeStuff() {
    var links = Array.prototype.slice.call(document.links, 0);

    links.filter(function(link) {
        if(test(link.href)) {
            var newLink = getNewPagePlease(link.href);
            link.setAttribute('href', newLink);
        }
    });
}

if (test(window.location.href)) window.location.assign(getNewPagePlease(window.location.href));

window.onload = fixCurseforgeStuff;
setInterval(fixCurseforgeStuff, 50);