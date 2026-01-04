

    // ==UserScript==
    // @name        i Reddit Redirector
    // @description	Redirects to i.reddit.com instead of neo reddit (C) TheNH813 2018. License WTFPLV2
    // @version		1.0
    // @match       *://*.reddit.com/*
    // @run-at      document-start
    // @grant       none
    // @namespace https://greasyfork.org/users/29660
// @downloadURL https://update.greasyfork.org/scripts/428739/i%20Reddit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/428739/i%20Reddit%20Redirector.meta.js
    // ==/UserScript==
     
    if ( window.location.host != "i.reddit.com" ) {
        var iReddit = window.location.protocol + "//" + "i.reddit.com" + window.location.pathname + window.location.search + window.location.hash;
        window.location.replace (iReddit);
    }

