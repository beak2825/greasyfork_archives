// ==UserScript==
// @name         Hide YouTube Recommandations In Home Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Time is Precious
// @author       You
// @match        *://www.youtube.com/
// @match        *://www.youtube.com/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444482/Hide%20YouTube%20Recommandations%20In%20Home%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/444482/Hide%20YouTube%20Recommandations%20In%20Home%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newStyle = document.createElement("style")
    newStyle.innerHTML = `
    .ytd-app.style-scope[role='navigation'], #primary.style-scope.ytd-two-column-browse-results-renderer {
        display: none;
    }
    `
    document.head.appendChild(newStyle)
    // Your code here...
})();