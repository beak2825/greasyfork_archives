// ==UserScript==
// @name         Danbooru: Enable tag-based grouping.
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script hacks the tags you searched into Danbooru search link URLs so that you can navigate from individual posts to the next or previous post in the search.
// @author       FPX
// @match        https://danbooru.donmai.us/
// @match        http://danbooru.donmai.us/
// @match        https://danbooru.donmai.us/posts?*
// @match        http://danbooru.donmai.us/posts?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22742/Danbooru%3A%20Enable%20tag-based%20grouping.user.js
// @updateURL https://update.greasyfork.org/scripts/22742/Danbooru%3A%20Enable%20tag-based%20grouping.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var arr = document.location.href.split("tags");
    var tags = arr[1];
    if (tags === undefined) {
        return;
    }
    var image_links = document.getElementsByClassName("post-preview");
    for (var i = 0; i < image_links.length; i++) {
        var link = image_links[i].children[0];
        link.href = link.href + "?tags" + tags;
    }
})();