// ==UserScript==
// @name         Discogs/Release/Big Images
// @namespace    https://greasyfork.org/en/scripts/422494-discogs-release-big-images
// @version      1.2
// @description  bigass pics
// @author       denlekke
// @match        https://www.discogs.com/*release/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422494/DiscogsReleaseBig%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/422494/DiscogsReleaseBig%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var images = document.getElementsByClassName('image_gallery image_gallery_large')[0];

    console.log(images);
    console.log(images.attributes[1].value);
    var parsed = JSON.parse(images.attributes[1].value);

    for (var i = 0;i<parsed.length;i++){
        var og_link = parsed[i].full
        parsed[i].full = "https://www.discogs.com/image/"+og_link.split("/discogs-images/")[1].split(".jpg")[0]
        console.log(parsed[i].full);
    }
    var new_version = JSON.stringify(parsed);
    images.attributes[1].value = new_version;
    console.log(images.attributes[1].value);
})();