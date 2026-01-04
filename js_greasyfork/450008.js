// ==UserScript==
// @name         Twitter to Nitter Redirector
// @namespace    https://github.com/shmup/redirect-userscripts
// @version      1.3
// @description  Redirect Twitter to Nitter, a free and open source alternative
// @author       shmup
// @match        https://www.twitter.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/450008/Twitter%20to%20Nitter%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/450008/Twitter%20to%20Nitter%20Redirector.meta.js
// ==/UserScript==

/**
 * Nitter is a free and open source alternative Twitter front-end focused on privacy and performance.
 *
 * https://nitter.net/about
 * https://github.com/zedeus/nitter
 **/

// NOTE - you may need to udpate the instance:
// https://github.com/zedeus/nitter/wiki/Instances#public

const nitterInstance = "xcancel.com";

(function() {
    'use strict';
    const newURL = new URL(window.location.href);
    newURL.hostname = nitterInstance;
    window.location.replace(newURL.toString());
})();