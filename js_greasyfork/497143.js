// ==UserScript==
// @name         Nitro Gifter image badge
// @namespace    http://tampermonkey.net/
// @version      69.0
// @description  whatever it says in the name
// @author       Ghost
// @match        *://pixelplace.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497143/Nitro%20Gifter%20image%20badge.user.js
// @updateURL https://update.greasyfork.org/scripts/497143/Nitro%20Gifter%20image%20badge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceNitroImage() {
        var nitroImages = document.querySelectorAll('img[src="/img/badges/nitro.png"]');
        nitroImages.forEach(function(img) {
            img.src = 'https://cdn.discordapp.com/attachments/683339565687504962/1247947223300575344/5ry6.png?ex=6661e0eb&is=66608f6b&hm=f8846bd6d4032d343ce744aca63eae93ef09460c044630c62908549a1920799a&';
        });
    }

    window.addEventListener('load', replaceNitroImage);
    setInterval(replaceNitroImage, 3000);
})();
