// ==UserScript==
// @name         No YouTube Shorts in Search
// @version      0.2
// @description  Remove YouTube Shorts from Search Results
// @author       Doomnik
// @match        https://www.youtube.com/results?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/478648/No%20YouTube%20Shorts%20in%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/478648/No%20YouTube%20Shorts%20in%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const removeShorts = () => {
        var contents = document.getElementById('contents');
        if (!contents) return;
        for (var item of contents.getElementsByTagName('ytd-reel-shelf-renderer')) {
            item.remove();
        }

        for (var short of contents.getElementsByTagName('ytd-video-renderer')) {
            const anchor = short.children[0]?.children[0]?.children[0];
            if (anchor && anchor.href.includes('shorts')) short.remove();
        }
    }

    addEventListener('DOMNodeInserted', () => { removeShorts(); });
})();