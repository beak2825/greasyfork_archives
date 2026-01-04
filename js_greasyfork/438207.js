// ==UserScript==
// @name         Fanfiction.net: URL Cleaner
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.6
// @license      MIT
// @description  Clean Fanfiction.net URL by deleting Cloudflare Security query string.
// @author       Vannius
// @match        https://www.fanfiction.net/*
// @downloadURL https://update.greasyfork.org/scripts/438207/Fanfictionnet%3A%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/438207/Fanfictionnet%3A%20URL%20Cleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);
    url.searchParams.delete('__cf_chl_jschl_tk__');
    url.searchParams.delete('__cf_chl_tk');
    window.history.replaceState(null, '', url.href)
})();
