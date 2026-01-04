// ==UserScript==
// @name         Block Tags
// @namespace    http://your.namespace.com
// @version      1.1
// @description  Block tag images in search results
// @author       Your Name
// @license      MIT
// @match        https://aryion.com/g4/tags.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484644/Block%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/484644/Block%20Tags.meta.js
// ==/UserScript==

var blTags = ["Pokemon"]; // edit tags here

$(document).ready(function() {
    $(".gallery-item").each(function() {
        var tags = $(this).attr("title");
        if (containsBlockedTag(tags, blTags)) {
            $(this).hide(); // or do something to prevent the image from loading
        }
    });
});

function containsBlockedTag(tags, blTags) {
    var tagArray = tags.split(',').map(tag => tag.trim());
    return tagArray.some(tag => blTags.includes(tag));
}
