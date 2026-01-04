// ==UserScript==
// @name         animepahe anti-spoiler thumbnails
// @version      1.0
// @description  blur episode thumbnails
// @namespace    https://greasyfork.org/en/users/331338-destruuction
// @author       destruuction
// @match        *://animepahe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389227/animepahe%20anti-spoiler%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/389227/animepahe%20anti-spoiler%20thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blurThumbnails() {
        var thumbnails = document.getElementsByClassName("episode-snapshot");
        for (var thumbnail of thumbnails) {
            thumbnail.style.filter="blur(20px)";
        }
    }
    var checkLoaded = setInterval(function() {
        var firstSnapshot = document.getElementsByClassName("episode-snapshot")[0];
        if (firstSnapshot) {
            blurThumbnails();
            clearInterval(checkLoaded);
        }
    }, 100)
})();