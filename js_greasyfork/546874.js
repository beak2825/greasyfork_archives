// ==UserScript==
// @name         Redirect Reddit To Original
// @namespace    https://greasyfork.org/users/Mark91127
// @version      1.1
// @description  Automatically replace URLs ending with ?tl=... (like ?tl=zh-hant) with ?show=original
// @author       Mark91127
// @match        *://*.reddit.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546874/Redirect%20Reddit%20To%20Original.user.js
// @updateURL https://update.greasyfork.org/scripts/546874/Redirect%20Reddit%20To%20Original.meta.js
// ==/UserScript==


/*
    Author: Mark91127
    Github: https://github.com/Mark91127/RedirectRedditToOriginal
*/


(function() {
    'use strict';

    // Check if the URL ends with /?tl=xx (xx can include letters and dashes like zh-hant)
    let currentUrl = window.location.href;
    let langRegex = /\/\?tl=[a-z-]+$/i;

    if (langRegex.test(currentUrl)) {
        // Replace ?tl=... with ?show=original
        let newUrl = currentUrl.replace(langRegex, '/?show=original');

        // Redirect to the new URL
        window.location.replace(newUrl);
    }
})();