// ==UserScript==
// @name         Redirect Reddit to New Reddit
// @namespace    http://your.website.com
// @version      1.0
// @description  Redirects Reddit to New Reddit including sublinks
// @author       dpi0
// @match        https://www.reddit.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/490765/Redirect%20Reddit%20to%20New%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/490765/Redirect%20Reddit%20to%20New%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.hostname = 'new.reddit.com';
})();
