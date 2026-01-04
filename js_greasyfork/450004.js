// ==UserScript==
// @name         Reddit to Teddit Redirector
// @namespace    https://github.com/shmup/redirect-userscripts
// @version      1.1
// @description  Redirect reddit to teddit, a free and open source alternative focused on privacy. Use with something like https://violentmonkey.github.io
// @author       shmup
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/450004/Reddit%20to%20Teddit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/450004/Reddit%20to%20Teddit%20Redirector.meta.js
// ==/UserScript==

/**
 * Teddit is a free and open source alternative Reddit front-end focused on
 * privacy. Teddit doesn't require you to have JavaScript enabled in your browser.
 *
 * https://teddit.net/about
 * https://codeberg.org/teddit/teddit
 **/

(function() {
    'use strict';
    const newURL = new URL(window.location.href);
    newURL.hostname = 'teddit.net';
    window.location.replace(newURL.toString());
})();