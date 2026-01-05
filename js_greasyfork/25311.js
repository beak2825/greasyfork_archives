// ==UserScript==
// @name             Reddit No Participation redirector
// @name:en          Reddit No Participation redirector
// @namespace        https://greasyfork.org/en/scripts/25311-reddit-no-participation-redirector
// @version          0.2
// @description:en   Redirects to normal reddit instead of NP
// @author           Nostras
// @match            https://np.reddit.com/*
// @match            http://np.reddit.com/*
// @grant            none
// @description Redirects to normal reddit instead of NP
// @downloadURL https://update.greasyfork.org/scripts/25311/Reddit%20No%20Participation%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/25311/Reddit%20No%20Participation%20redirector.meta.js
// ==/UserScript==

Verbose = false;

(function() {
    'use strict';
    var url = window.location.href;
    if(Verbose)
        console.log(url);
    var npPos = url.search("np");
    var redirectUrl = url.substring(0, npPos) + url.substring(npPos+3);
    if(Verbose)
        console.log(redirectUrl);
    window.location = redirectUrl;
})();