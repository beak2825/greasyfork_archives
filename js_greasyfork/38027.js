// ==UserScript==
// @name           Flickr: Enable image download (Chrome Compatible)
// @namespace      https://rix.li/
// @description    Removes the div in front of the image and the full size zoom pictures for easy and fast download.
// @match          *://www.flickr.com/photos/*
// @match          *://flickr.com/photos/*
// @version 	   0.0.2
// @downloadURL https://update.greasyfork.org/scripts/38027/Flickr%3A%20Enable%20image%20download%20%28Chrome%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38027/Flickr%3A%20Enable%20image%20download%20%28Chrome%20Compatible%29.meta.js
// ==/UserScript==


[].forEach.call(document.querySelectorAll('.spaceball'), function(d) {
    d.remove();
});

document.body.addEventListener('DOMSubtreeModified', function () {
    [].forEach.call(document.querySelectorAll('.facade-of-protection-zoom, .facade-of-protection-neue, .photo-notes-scrappy-view'), function(d) {
        d.remove();
    });
}, false);
