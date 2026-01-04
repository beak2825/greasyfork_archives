// ==UserScript==
// @name         Optifine download links cleaner
// @namespace    http://tampermonkey.net/
// @version      2024-05-31
// @description  Cleans Optifine download links from ads
// @author       MaxLevs
// @match        https://files.minecraftforge.net
// @match        https://optifine.net/downloads
// @icon         https://www.google.com/s2/favicons?sz=64&domain=optifine.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494677/Optifine%20download%20links%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/494677/Optifine%20download%20links%20cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const linkTags = document.querySelectorAll('a[href*="adfoc"]');

    for(let linkTag of linkTags) {
        const searchParams = new URLSearchParams(linkTag.href);
        const realUrl = searchParams.get('url');

        if (realUrl == null) {
            console.debug('Cannot get real URL for ', linkTag);
            continue;
        }

        linkTag.href = realUrl;
        console.debug('Link cleaned ', realUrl, linkTag);
    }

})();