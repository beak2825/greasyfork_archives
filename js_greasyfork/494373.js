// ==UserScript==
// @name         lolcast_redirect
// @namespace    lolcast_redirect
// @version      0.2
// @description  직링 리디렉션기능
// @author       You
// @match        https://insagirl-toto.appspot.com/chatting/lgic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494373/lolcast_redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/494373/lolcast_redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the href of YouTube links
    var changeLinks = function() {
        var anchors = document.getElementsByTagName('a');

        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];

            if (anchor.href.includes('https://youtu.be/')) {
                var videoId = anchor.href.split('https://youtu.be/')[1];
                anchor.href = 'https://lolcast.kr/#/player/youtube/' + videoId;
            } else if (anchor.href.includes('https://www.youtube.com/watch?v=')) {
                var videoId = anchor.href.split('https://www.youtube.com/watch?v=')[1];
                // Remove any additional parameters after '&'
                videoId = videoId.split('&')[0];
                anchor.href = 'https://lolcast.kr/#/player/youtube/' + videoId;
            }
        }
    };

    // Create a MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                changeLinks();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();