// ==UserScript==
// @name Gelbooru Lazyload Fix
// @version 1.0.3
// @namespace atribecalledkwest
// @description This script fixes the Gelbooru thumbnails if the thumbnail lazyloader doesn't run (typically due to an Adblocker)
// @include https://gelbooru.com/*
// @include http://gelbooru.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33702/Gelbooru%20Lazyload%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/33702/Gelbooru%20Lazyload%20Fix.meta.js
// ==/UserScript==

(function() {
    var thumbs = document.querySelectorAll("img.lazyload[data-original]");
    for(var i = 0; i < thumbs.length; i++) {
        var img = thumbs[i];
        img.src = img.dataset.original;
    }
})();