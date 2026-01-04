// ==UserScript==
// @name         Fix BitcoinTalk Imgur images
// @version      0.1
// @description  Loads Imgur images directly instead of through the bitcointalk image proxy
// @author       TryNinja
// @match        https://bitcointalk.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcointalk.org
// @grant        none
// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/466302/Fix%20BitcoinTalk%20Imgur%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/466302/Fix%20BitcoinTalk%20Imgur%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const decodeProxyImages = (link) => {
        const directImgUrl = link
            .replace(/https:\/\/ip\.bitcointalk\.org\/\?u=/, '')
            .replace(/&.*/, '')
        return decodeURIComponent(directImgUrl)
    }

    for (const img of Array.from(document.querySelectorAll('img.userimg'))) {
        const decodedUrl = decodeProxyImages(img.getAttribute('src'))
        if (decodedUrl.match(/i\.imgur\.com/)) {
            img.setAttribute('src', decodedUrl)
        }
    }
})();