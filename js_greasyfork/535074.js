// ==UserScript==
// @name         GC - Shopkeeper Tab Icons
// @namespace    https://greasyfork.org/en/users/1278031-crystalflame
// @version      1.0
// @description  Sets the tab icon (favicon) to the shopkeeper image
// @match        https://www.grundos.cafe/viewshop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @author       CrystalFlame
// @downloadURL https://update.greasyfork.org/scripts/535074/GC%20-%20Shopkeeper%20Tab%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/535074/GC%20-%20Shopkeeper%20Tab%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const image = document.querySelector('.center img.big-image.mt-1');

    if (image) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = image.src;

        const existingLink = document.querySelector('link[rel="icon"]');
        if (existingLink) {
            existingLink.parentNode.removeChild(existingLink);
        }

        document.head.appendChild(link);
    }
})();