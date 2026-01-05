// ==UserScript==
// @name         Open MAL links in new tabs
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Opens links from anime/manga lists in new tabs
// @author       Doomcat55
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/mangalist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19779/Open%20MAL%20links%20in%20new%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/19779/Open%20MAL%20links%20in%20new%20tabs.meta.js
// ==/UserScript==

function makeLinksMagical() {
    const animeTitles = [].slice.call(document.querySelectorAll('.data.title .link.sort'))
    animeTitles.forEach(function(link) {
        link.setAttribute('target', '_blank')
    })
}

// Only run on modern design
if (document.getElementById('list-container')) makeLinksMagical()
