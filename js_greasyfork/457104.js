// ==UserScript==
// @name         Change Youtube Favicon
// @namespace    https://churro.net
// @version      0.1
// @description  Using this script you can change the favicon or icon of any webpage.
// @author       Churro
// @match        https://www.youtube.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457104/Change%20Youtube%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/457104/Change%20Youtube%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Change @match and add another site to change that sites favicon example:
    // @match        https://stackoverflow.com

    const favicon = document.querySelector("link[rel='shortcut icon']");
    [favicon, ...document.querySelectorAll("link[rel='icon']")].forEach(favicon => {
        favicon.remove();
    })
    console.log("Favicon Removed");

    const clone = favicon.cloneNode();
    //Change link to whatever image you want to change the favicon to that image.
    clone.href = "https://imgv3.fotor.com/images/homepage-feature-card/adjust-image.jpg";
    document.head.appendChild(clone);
})();