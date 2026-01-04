// ==UserScript==
// @name         Google Slides URL Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify the URL of Google Slides locally
// @author       ronyuygvhv
// @match        https://www.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529812/Google%20Slides%20URL%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/529812/Google%20Slides%20URL%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Modify this to your desired fake URL
    const fakeURL = 'https://yourcustomurl.com';

    // Replace the browser's address bar URL locally
    window.history.replaceState({}, '', fakeURL);
})();
