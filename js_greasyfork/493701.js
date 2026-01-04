// ==UserScript==
// @name         JAV Library Sukebei Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A a link to search on Sukebei from a JAV Library video.
// @author       ReaperUnreal
// @match        https://*.javlibrary.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493701/JAV%20Library%20Sukebei%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/493701/JAV%20Library%20Sukebei%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const movieId = document.title.split(' ')[0];
    if (movieId.match(/\w{2,7}-\d{2,5}/).length < 1) {
        console.warn(`Movie '${movieId}' is not in appropriate format.`);
        return;
    }

    const searchUrl = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${movieId.toLocaleLowerCase()}`;

    const videoInfoSection = document.getElementById('video_info');

    const linkSection = document.createElement('div');
    videoInfoSection.appendChild(linkSection);

    const link = document.createElement('a');
    linkSection.appendChild(link);

    link.href = searchUrl;
    link.innerText = 'Sukebei Link';
    link.style.paddingLeft = '2em';
    link.style.paddingTop = '1em';
})();