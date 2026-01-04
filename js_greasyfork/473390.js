// ==UserScript==
// @name         MuskBlock
// @namespace    https://crinfarr.io
// @version      0.1
// @description  "Blocking is such a useless 'feature'" - elongated muskrat
// @author       Crinfarr
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473390/MuskBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/473390/MuskBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.onscroll = () => {
        const tweets = document.querySelectorAll("article:has(a[href='/elonmusk'][role='link'])");
        tweets.forEach((tweet) => {
            tweet.style.display = 'none';
            console.log('deleted tweet');
        });
    }
})();