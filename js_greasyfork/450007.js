// ==UserScript==
// @name         Youtube to Invidious Redirector
// @namespace    https://github.com/shmup/redirect-userscripts
// @version      1.1
// @description  Redirect youtube to invidious, a free and open source alternative
// @author       shmup
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/450007/Youtube%20to%20Invidious%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/450007/Youtube%20to%20Invidious%20Redirector.meta.js
// ==/UserScript==

/**
 * Privacy focused. Ethically designed. No Accounts. Multilingual. No Ads.
 *
 * https://invidious.io/
 * https://github.com/iv-org/invidious
 **/

(function() {
    'use strict';
    const newURL = new URL(window.location.href);
    newURL.hostname = 'yewtu.be';
    window.location.replace(newURL.toString());
})();
