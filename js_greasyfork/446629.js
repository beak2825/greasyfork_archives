// ==UserScript==
// @name         Path of Exile Trade Tab Titles
// @namespace    http://brosmike.com/
// @version      0.1
// @description  Retitle Path of Exile trade search tabs according to what the search is for. Use with searches bookmarked in Better PathOfExile Trade for best results.
// @author       brosmike
// @license      Apache-2.0
// @match        https://www.pathofexile.com/trade/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446629/Path%20of%20Exile%20Trade%20Tab%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/446629/Path%20of%20Exile%20Trade%20Tab%20Titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(updateTitle, 1000);
    console.log('Path of Exile Trade Tab Titles initialized!')

    function updateTitle() {
        const slug = inferSlug();
        const prefix = isLiveSearch() ? '*' : '';
        document.title = prefix + slug;
    }

    function isLiveSearch() {
        return document.URL.endsWith('/live');
    }

    function inferSlug() {
        const betterTradingLinkHref = document.URL.replace(/\/live$/, '');
        const betterTradingLink = document.querySelector(`a[href="${betterTradingLinkHref}"]`);
        const betterTradingSlug = betterTradingLink?.innerText;

        const searchBarValue = document.querySelector('.search-left input').value;
        return betterTradingSlug ?? searchBarValue ?? 'Path of Exile Trade';
    }
})();