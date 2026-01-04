// ==UserScript==
// @name         Block NSFW Websites (Including Known Sites)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block all NSFW websites, including known ones without NSFW keywords in the URL
// @author       slidex
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523054/Block%20NSFW%20Websites%20%28Including%20Known%20Sites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523054/Block%20NSFW%20Websites%20%28Including%20Known%20Sites%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nsfwKeywords = [
        'porn', 'xxx', 'sex', 'adult', 'nsfw', 'fetish', 'hentai', 'erotic', 'cam', 'escort',
        'babe', 'gay', 'lesbian', 'masturbation', 'sexchat', 'nude', 'video', 'naked', 'strip',
        'bdsm', 'tits', 'ass', 'pussy', 'penis', 'cougar', 'sexting', 'dating', 'xxxvideos'
    ];

    const knownNSFWSites = [
        'onlyfans.com', 'baddiehub.com', 'chaturbate.com', 'pornhub.com', 'xvideos.com', 'redtube.com',
        'xhamster.com', 'tubegalore.com', 'femdom.com', 'livejasmin.com', 'sex.com', 'adultfriendfinder.com'
    ];

    const currentUrl = window.location.href.toLowerCase();
    const isNSFWKeyword = nsfwKeywords.some(keyword => currentUrl.includes(keyword));
    const isKnownNSFWSite = knownNSFWSites.some(site => currentUrl.includes(site));

    if (isNSFWKeyword || isKnownNSFWSite) {
        window.location.href = 'https://asdasdasdassdasdasdads.netlify.app/'; 
    }
})();
