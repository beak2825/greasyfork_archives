// ==UserScript==
// @name         NSFW Content Blocker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Block NSFW content on the internet.
// @author       Narada K
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490889/NSFW%20Content%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/490889/NSFW%20Content%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // NSFW content detection logic
    function isNSFW(url) {
        const nsfwKeywords = ['porn', 'xxx', 'adult', 'explicit', 'nudity', 'sex', 'erotic', 'hardcore', 'fetish', 'bondage' , 'bdsm' , 'anal' , 'threesome' , 'ganbang' , 'lesbian' , 'gay' , 'bisexual' , 'shemale' , 'milf' , 'cougar' , 'incest' , 'bestiality' , 'rape' , 'pedophilia' , 'child porn' , 'hentai' , 'webcam porn' , 'live cam' , 'cowgirl' , 'camboy' , 'webcam show' , 'masturbation' , 'vibrator' , 'ass' , 'dildo' , 'spank' , 'cumshot' , 'cum' , 'cumshot' , 'voyeur' , 'upskirt' , 'lingerie' , 'nude model' , 'adult film' , 'adult content' , '18+']; // Updated NSFW keywords
        const nsfwUrls = ['pornhub.com', 'xvideos.com', 'youporn.com' , 'xnxx.com']; // Updated NSFW URLs
        const allowedDomains = ['google.com', 'youtube.com', 'twitter.com', 'facebook.com', 'instagram.com']; // Allowed domains

        // Check if the URL is from allowed domains
        for (const domain of allowedDomains) {
            if (url.toLowerCase().includes(domain)) {
                return false;
            }
        }

        // Check if the URL contains NSFW keywords or matches NSFW URLs
        for (const keyword of nsfwKeywords) {
            if (url.toLowerCase().includes(keyword)) {
                return true;
            }
        }

        for (const nsfwUrl of nsfwUrls) {
            if (url.toLowerCase().includes(nsfwUrl)) {
                return true;
            }
        }

        return false;
    }

    // Block NSFW content and display a gray overlay
    function blockNSFW() {
        if (isNSFW(window.location.href)) {
            document.documentElement.innerHTML = ''; // Clear the page content
            document.documentElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Gray overlay
        }
    }

    blockNSFW(); // Call the function to block NSFW content
})();
