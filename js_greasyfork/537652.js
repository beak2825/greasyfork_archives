// ==UserScript==
// @name         YouTube Shorts to Video Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects YouTube Shorts URLs to the standard video format
// @author       OpenAI
// @match        *://www.youtube.com/shorts/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537652/YouTube%20Shorts%20to%20Video%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/537652/YouTube%20Shorts%20to%20Video%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const shortsMatch = location.pathname.match(/^\/shorts\/([^/?#]+)/);
    if (shortsMatch && shortsMatch[1]) {
        const videoId = shortsMatch[1];
        const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
        location.replace(newUrl);
    }
})();
