// ==UserScript==
// @name         Redirect Google Images & Videos to DuckDuckGo
// @namespace    http://example.com
// @version      1.0
// @description  Redirects Google Images and Videos links to DuckDuckGo Images and Videos
// @match        https://www.google.com/*
// @license      MIT
// @icon         https://blog.animonlive.com/wp-content/uploads/2016/12/duckduckgo1600.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471020/Redirect%20Google%20Images%20%20Videos%20to%20DuckDuckGo.user.js
// @updateURL https://update.greasyfork.org/scripts/471020/Redirect%20Google%20Images%20%20Videos%20to%20DuckDuckGo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    if (currentUrl.includes('google.com')) {
        const searchParams = new URLSearchParams(window.location.search);
        const query = searchParams.get('q');
        const pathName = window.location.pathname;

        if (pathName === '/search' && searchParams.get('tbm') === 'vid') {
            const duckDuckGoVideosUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iar=videos&iax=videos&ia=videos';
            window.location.href = duckDuckGoVideosUrl;
        } else if (pathName === '/search' && searchParams.get('tbm') === 'isch') {
            const duckDuckGoImagesUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images';
            window.location.href = duckDuckGoImagesUrl;
        }
    }
})();