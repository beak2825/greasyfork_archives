// ==UserScript==
// @name     	Reddit Render Compact 2023
// @version  	1.1
// @license     MIT
// @description  a way to render the reddit compact page
// @match    	https://*.reddit.com/*
// @namespace https://greasyfork.org/users/1163486
// @downloadURL https://update.greasyfork.org/scripts/474288/Reddit%20Render%20Compact%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/474288/Reddit%20Render%20Compact%202023.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const href = window.location.href;

    // redirected to old.reddit.com first if not a gallery page or media query
    if (href.startsWith("https://www.reddit.com/") &&
        !href.includes("/gallery") &&
        !href.includes("/media?")) {
        const oldUrl = href.replace("https://www.reddit.com/", "https://old.reddit.com/");
        window.location.href = oldUrl;
    }


})();

