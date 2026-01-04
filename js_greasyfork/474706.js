// ==UserScript==
// @name         </> Ad Blocker, Anti Cloudflare Block.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block ADS in ZOMBS.io, Anti Cloudflare Block.
// @author       Serplent
// @match        *://zombs.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474706/%3C%3E%20Ad%20Blocker%2C%20Anti%20Cloudflare%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/474706/%3C%3E%20Ad%20Blocker%2C%20Anti%20Cloudflare%20Block.meta.js
// ==/UserScript==

// If an element with the id "cf-wrapper" exists on the page, refresh the page.
if (document.getElementById("cf-wrapper")) {
    // Reload the current page URL
    location.href = location.href;
}

// Remove elements with specified classes
const elementsToRemove = [
    '.ad-unit',
];

elementsToRemove.forEach((className) => {
  document.querySelectorAll(className).forEach((el) => el.remove());
});
