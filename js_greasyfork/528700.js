// ==UserScript==
// @name         YouTube no shorts player
// @description  Redirects YouTube shorts videos to proper YouTube player.
// @author       Can Kurt
// @namespace    http://tampermonkey.net/
// @version      0.2
// @match        *://www.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528700/YouTube%20no%20shorts%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/528700/YouTube%20no%20shorts%20player.meta.js
// ==/UserScript==


function matchShorts(url) {
    const pattern = /^(.*)\/shorts\/([^/?#]+)([/?#].*)?$/;
    return url.match(pattern);
}

function overrideUrl(url) {
    const match = matchShorts(url)
    if (match) {
        const base = 'https://www.youtube.com';
        const id = match[2];
        const tail = match[3] || '';
        return `${base}/watch?v=${id}${tail}`;
    }
    return url;
}

let isRedirecting = false;

setInterval(() => {
    if(!isRedirecting && matchShorts(window.location.pathname)) {
        const newUrl = overrideUrl(window.location.pathname);
        isRedirecting = true;
        window.location = newUrl;
    }
}, 300);
