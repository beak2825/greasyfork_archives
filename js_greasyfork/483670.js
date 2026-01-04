// ==UserScript==
// @name         Open YouTube Links in App
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect YouTube links to open in the YouTube app
// @author       Andreika_MD
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483670/Open%20YouTube%20Links%20in%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/483670/Open%20YouTube%20Links%20in%20App.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var youtubeLinks = document.querySelectorAll('a[href*="youtube.com"]');

 
    youtubeLinks.forEach(function(link) {
        var videoId = link.href.match(/[?&]v=([^&]+)/);
        if (videoId) {
            var intentLink = 'intent://m.youtube.com/watch?v=' + videoId[1] +
                '&feature=mweb_c3_open_app_11268432&itc_campaign=mweb_c3_open_app_11268432&redirect_app_store_ios=1&app=desktop#Intent;package=com.google.android.youtube;scheme=vnd.youtube;launchFlags=268435456;end';
            link.href = intentLink;
        }
    });
})();
