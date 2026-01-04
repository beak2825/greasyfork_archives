// ==UserScript==
// @name         Genius Auto Old Song Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When it detects that you are on a lyrics page, it reloads the page with the old interface.
// @author       Yelo
// @include      https://genius.com/*
// @match        https://genius.com/*
// @icon         https://assets.genius.com/images/apple-touch-icon.png?1659714721
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449176/Genius%20Auto%20Old%20Song%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/449176/Genius%20Auto%20Old%20Song%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = document.URL.split("-");
    const lastArg = url[url.length - 1];
    if(lastArg === "lyrics" || lastArg === "annotated") {
        window.location.href = `${document.URL}?bagon=1`;
    }
})();