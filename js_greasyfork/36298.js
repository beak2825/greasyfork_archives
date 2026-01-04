// ==UserScript==
// @name         YouTube Subs List Filter
// @namespace    http://ejew.in/
// @version      0.3
// @description  Hide your subs that have no uploads, no more hunting! Also links you directly to the videos page. Also cuts out polymer videos that you have already watched or watch-latered.
// @author       EntranceJew
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36298/YouTube%20Subs%20List%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/36298/YouTube%20Subs%20List%20Filter.meta.js
// ==/UserScript==

(function() {
    var checkExist = setInterval(function() {
        var i = 0;
        var subsContainer = document.querySelector('a.yt-simple-endpoint[href="/feed/channels"]');
        if( subsContainer ){
            var ourSubs = subsContainer.parentElement.parentElement.nextElementSibling;
            // hide things we don't care about
            var subs = ourSubs.querySelectorAll(".guide-entry-count[hidden]");

            if( subs.length ){
                for (i = 0; i < subs.length; ++i) {
                    subs[i].parentNode.parentNode.hidden = true;
                }
            }

            var links = ourSubs.querySelectorAll('ytd-guide-entry-renderer>a[href^="/channel/"]:not([name$="/videos"])');

            if( links.length ){
                for (i = 0; i < links.length; ++i) {
                    links[i].href += "/videos";
                }
            }
        }

        var videos = document.querySelectorAll('.ytd-shelf-renderer ytd-thumbnail-overlay-resume-playback-renderer .ytd-thumbnail-overlay-resume-playback-renderer[style="width: 100%;"]');

        if( videos.length ){
            for (i = 0; i < videos.length; ++i) {
                videos[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.hidden = true;
            }
        }

        var added = document.querySelectorAll('.ytd-shelf-renderer ytd-thumbnail-overlay-toggle-button-renderer[aria-label="Added"]');

        if( added.length ){
            for(i = 0; i < added.length; ++i) {
                added[i].parentNode.parentNode.parentNode.parentNode.parentNode.hidden = true;
            }
        }
    }, 100); // check every 100ms
})();