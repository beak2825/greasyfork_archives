// ==UserScript==
// @name         Hide XXX Section on TorrentGalaxy
// @namespace    http://tampermonkey.net/
// @version      1.0.0.2
// @description  Permenantly hides the XXX section on TorrentGalaxy
// @author       Unbroken
// @match        https://torrentgalaxy.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentgalaxy.to
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/498233/Hide%20XXX%20Section%20on%20TorrentGalaxy.user.js
// @updateURL https://update.greasyfork.org/scripts/498233/Hide%20XXX%20Section%20on%20TorrentGalaxy.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var xxx = document.getElementById('XXX');
    xxx.parentNode.parentNode.style.display = "none";

    // Select all div elements with the class "tgxtablerow txlight"
    const divs = document.querySelectorAll('div.tgxtablerow.txlight');

    divs.forEach(div => {
        // Find child 'a' elements with the class "txlight"
        const links = div.querySelectorAll('a.txlight');

        links.forEach(link => {
            // Check if the link's text includes "xxx" (case insensitive)
            if (link.textContent.toLowerCase().includes('xxx')) {
                // Hide the parent div
                div.style.display = 'none';
            }
        });
    });
})();