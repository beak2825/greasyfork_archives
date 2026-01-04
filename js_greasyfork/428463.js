// ==UserScript==
// @name         Mobile Twitter Redirect
// @namespace    https://diyamund.github.io/
// @version      0.1
// @description  Automatically redirects any mobile Twitter page to the desktop version.
// @author       You
// @match        *://mobile.twitter.com/*
// @icon         https://twitter.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428463/Mobile%20Twitter%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/428463/Mobile%20Twitter%20Redirect.meta.js
// ==/UserScript==

(function() {
    window.location.href = window.location.href.replace(/\bmobile./g, "www.");
})();