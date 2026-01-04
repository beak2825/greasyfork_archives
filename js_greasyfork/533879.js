// ==UserScript==
// @name         Twitter to Nitter Redirector
// @description  Redirect Twitter to Nitter, a free and open source alternative
// @match        https://x.com/*
// @match        https://www.x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://www.twitter.com/*
// @match        *://*/*
// @run-at       document-start
// @version 0.0.1.20251119083206
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/533879/Twitter%20to%20Nitter%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/533879/Twitter%20to%20Nitter%20Redirector.meta.js
// ==/UserScript==

const nitterInstance = "nitter.net";

(function () {
    'use strict';
    const hostname = window.location.hostname;
    const isTwitter =
        hostname === "twitter.com" ||
        hostname === "www.twitter.com" ||
        hostname === "mobile.twitter.com" ||
        hostname === "x.com";

    if (!isTwitter) return;

    const newURL = new URL(window.location.href);
    newURL.hostname = nitterInstance;
    window.location.replace(newURL.toString());
})();