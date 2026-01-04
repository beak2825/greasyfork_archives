// ==UserScript==
// @name         Weird YT Thumbnail
// @namespace    ytweirdthumbnail.infinitesoul.me
// @version      0.1
// @description  Changes all youtube thumbnails to https://i.imgur.com/qcyswX5.jpg
// @author       InfiniteSoul
// @include      https://www.youtube.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372356/Weird%20YT%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/372356/Weird%20YT%20Thumbnail.meta.js
// ==/UserScript==

function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.appendChild(document.createTextNode(css));
    head.appendChild(s);
}

(function() {
    'use strict';

    addcss("img.yt-img-shadow {content: url(https://i.imgur.com/qcyswX5.jpg);}");
})();