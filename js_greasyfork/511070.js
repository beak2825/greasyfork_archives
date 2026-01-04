// ==UserScript==
// @name          Reddit Thumbnail Adjustment
// @namespace     github.com/openstyles/stylus
// @match         *://old.reddit.com/*
// @description   Moves the Reddit post thumbnail to the right and scales it
// @author        You
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/511070/Reddit%20Thumbnail%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/511070/Reddit%20Thumbnail%20Adjustment.meta.js
// ==/UserScript==
(function() {
    var css = `
    .hidesidebar {
        text-orientation: sideways;
    }
    
    .listing-chooser {
        display: none !important;
    }

    .thumbnail {
        float: right;
        /* or use flexbox/grid to reorder the elements */
        margin-left: 10px;
        /* adds spacing between the thumbnail and the post content */
    }`;

    // Create a new style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    // Append the style element to the head of the document
    document.head.appendChild(style);
})();