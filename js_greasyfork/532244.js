// ==UserScript==
// @name        Force old reddit and no translation
// @description Force old reddit by redirecting to ps.reddit.com and remove translation parameter
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @match       https://reddit.com/*
// @grant       none
// @run-at      document-start
// @version     1.2
// @author      stubborn719
// @license     MIT
// @description 4/9/2025, 2:30:24 AM
// @downloadURL https://update.greasyfork.org/scripts/532244/Force%20old%20reddit%20and%20no%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/532244/Force%20old%20reddit%20and%20no%20translation.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const url = new URL(window.location.href);
    url.searchParams.delete('tl');
    url.hostname = 'old.reddit.com';
    window.location.href = url.href;
})();