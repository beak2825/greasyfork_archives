// ==UserScript==
// @name         Reddit to Reditr Redirector
// @namespace    https://violentmonkey.github.io/
// @version      0.1
// @description  Automatically redirects www.reddit.com links to reditr.com
// @author       Luvcie
// @match        *://www.reddit.com/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534084/Reddit%20to%20Reditr%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/534084/Reddit%20to%20Reditr%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    if (window.location.hostname === 'www.reddit.com') {
        const newUrl = currentUrl.replace('://www.reddit.com/', '://reditr.com/');

        window.location.replace(newUrl);
    }
})();