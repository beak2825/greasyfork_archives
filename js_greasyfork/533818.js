// ==UserScript==
// @name         Porn Site Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks specific adult websites
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533818/Porn%20Site%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/533818/Porn%20Site%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const redirectUrl = 'https://www.bible.com';
    
    const blockedDomains = [
        'pornhub.com',
        'xvideos.com',
        'xnxx.com',
        'youporn.com',
        'redtube.com',
        'xhamster.com',
        'spankbang.com',
        'tube8.com',
        'brazzers.com',
        'onlyfans.com',
        'chaturbate.com',
        'livejasmin.com',
        'stripchat.com',
        'bongacams.com',
        'cam4.com',
        'myfreecams.com',
        'adultfriendfinder.com',
        'flirt4free.com',
        'pornhd.com',
        'pornmd.com',
        'youjizz.com',
        'thumbzilla.com',
        'eporner.com',
        'beeg.com',
        'porntrex.com',
        'pornone.com',
        'hclips.com',
        'porn.com',
        'tnaflix.com',
        'drtuber.com'
    ];

    const currentDomain = window.location.hostname.toLowerCase();
    
    for (let domain of blockedDomains) {
        if (currentDomain === domain || currentDomain.endsWith('.' + domain)) {
            window.location.replace(redirectUrl);
            break;
        }
    }
})();
