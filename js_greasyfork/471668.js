// ==UserScript==
// @name         TwitterRestore
// @namespace    twitter.com
// @version      0.1
// @description  Replaces X with the twitter logo. Follow me on twitter: @realcoloride
// @author       realcoloride
// @license      MIT
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471668/TwitterRestore.user.js
// @updateURL https://update.greasyfork.org/scripts/471668/TwitterRestore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const twitterLogoPath = `<g><path style="color:rgb(29, 155, 240);" d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g>`;
    const twitterLogoSvg = `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-k200y r-1cvl2hr r-4qtqp9 r-yyyyoo r-5sfk15 r-dnmrzs r-kzbkwu r-bnwqim r-1plcrui r-lrvibr">${twitterLogoPath}</svg>`;
    const twitterFavicon = "https://abs.twimg.com/favicons/twitter.2.ico";

    const twitterFaviconSelector = '[rel="shortcut icon"]';
    const twitterLoadingSelector = "#placeholder > svg";
    const twitterIconSelector = '[aria-label="Twitter"] > div > svg';

    function swapLoadingIcon() {
        document.querySelector(twitterLoadingSelector).innerHTML = twitterLogoSvg;
    }

    function swapFavicon() {
        document.querySelector(twitterFaviconSelector).href = "https://abs.twimg.com/favicons/twitter.2.ico";
    }

    let twitterIconInjected = false;
    function swapTwitterIcon() {
        twitterIconInjected = true;
        document.querySelector(twitterIconSelector).innerHTML = twitterLogoSvg;
    }

    console.log("[TwitterRestore] Loading... // by (real)coloride - 2023");

    swapLoadingIcon();
    swapFavicon();

    let interval;
    interval = setInterval(() => {
        if (document.querySelector(twitterIconSelector) && !twitterIconInjected) {
            swapTwitterIcon();
            clearInterval(interval);
        }
    }, 5);
})();