// ==UserScript==
// @name         Watch to Playlist
// @namespace    https://gist.github.com/ammarlakis
// @version      0.1
// @description  aghh, youtube's interface!
// @author       Ammar Lakis
// @match        https://www.youtube.com/user/**
// @match        https://www.youtube.com/channel/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32259/Watch%20to%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/32259/Watch%20to%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hrefWatchToPlaylist = function(str) {
        return str.replace(/watch.+list/, 'playlist?list');
    };

    function changeWatchToPlaylist () {
        var listsLinks = document.getElementsByTagName('ytd-grid-playlist-renderer');
        if (listsLinks) {
            for (var i = 0; i < listsLinks.length; i++) {
                listsLinks[i].children[1].href = hrefWatchToPlaylist(listsLinks[i].children[1].href);
            }
        }
    }

    (function() {
        changeWatchToPlaylist();
    })();
})();