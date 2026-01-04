// ==UserScript==
// @name         1337x fallback proxy when rate limited
// @version      1.0
// @description  Redirect the page if rate limited on 1337x.to
// @author       Rust1667
// @match        https://1337x.to/*
// @run-at       document-end
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1337x.to
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/493117/1337x%20fallback%20proxy%20when%20rate%20limited.user.js
// @updateURL https://update.greasyfork.org/scripts/493117/1337x%20fallback%20proxy%20when%20rate%20limited.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fallbackProxy = '1337x-to.pages.dev';

    function isRateLimited() {
        const titleContainsAccessDenied = document.title.includes('Access denied');
        return titleContainsAccessDenied
    }

    function redirectIfRateLimited() {
        if (isRateLimited()) {
            const currentURL = window.location.href;
            const newURL = currentURL.replace('1337x.to', fallbackProxy);
            window.location.assign(newURL);
        }
    }

    redirectIfRateLimited();

})();
