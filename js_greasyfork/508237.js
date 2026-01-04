// ==UserScript==
// @name         IMDB Movie or TV Show
// @namespace    http://tampermonkey.net/
// @version      2024-09-15
// @description  Adds an embedded video for streaming on any IMDB movie or TV show page with multiple mirrors.
// @author       FlinCode
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508237/IMDB%20Movie%20or%20TV%20Show.user.js
// @updateURL https://update.greasyfork.org/scripts/508237/IMDB%20Movie%20or%20TV%20Show.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // updated for TV shows by https://www.reddit.com/user/n0_sp00n/

    function getIframe(url) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '600';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        return iframe;
    }

    const currentUrl = window.location.href;
    const idMatch = currentUrl.match(/title\/(tt\d+)\//);
    const imdbId = idMatch ? idMatch[1] : null;

    if (!imdbId) { return }

    // Fetch the meta property "og:type" to check if it's a movie or a TV show
    const ogTypeMeta = document.querySelector('meta[property="og:type"]');
    const ogType = ogTypeMeta ? ogTypeMeta.getAttribute('content') : null;

    if (!ogType) { return }

    let embedUrl = '';

    // Determine if it's a movie or TV show based on the og:type content
    if (ogType === 'video.movie') {
        embedUrl = `https://2embed.cc/embed/${imdbId}`;
    } else if (ogType === 'video.tv_show') {
        embedUrl = `https://2embed.cc/embedtvfull/${imdbId}`;
    }

    if (embedUrl) {
        const result = document.evaluate(
            '//*[@id="__next"]/main/div/section[1]/section/div[3]/section/section/div[2]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );

        const topDiv = result.singleNodeValue;
        if (topDiv) {
            const iframe = getIframe(embedUrl);
            topDiv.insertAdjacentElement("afterend", iframe);
        }
    }
})();
