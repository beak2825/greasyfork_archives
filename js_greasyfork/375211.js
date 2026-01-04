// ==UserScript==
// @name        Prevent Skimfeed Redirect
// @description Rewrite skimfeed redirect links as actual target website link
// @namespace   https://github.com/hanxue
// @author      hanxue
// @update      https://github.com/hanxue/prevent-skimfeed-redirect/raw/master/prevent-skimfeed-redirect.user.js
// @version     0.1
// @grant       none
// skimfeed
// @match       *://skimfeed.com/*
// @match       *://*.skimfeed.com/*

// @downloadURL https://update.greasyfork.org/scripts/375211/Prevent%20Skimfeed%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/375211/Prevent%20Skimfeed%20Redirect.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var links = document.links;
    for (var i = 0; i < links.length; i++) {
        var referer = links[i].href.indexOf('&u=');
        links[i].href = decodeURIComponent(links[i].href.substr(referer + 3));
    }

})();
