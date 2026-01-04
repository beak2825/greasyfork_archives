// ==UserScript==
// @name         HTML5 Steam Trailers
// @namespace    http://pyroglyph.co.uk/
// @version      1.1
// @description  Replaces Steam's own video controls with dark HTML5 controls.
// @author       Pyroglyph
// @match        http://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30742/HTML5%20Steam%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/30742/HTML5%20Steam%20Trailers.meta.js
// ==/UserScript==

// Run on page load
(function() {
    'use strict';
    convertVideoToHTML5();
})();
// Also run on click because not all videos are visible on page load
onclick = function() { convertVideoToHTML5(); };

function convertVideoToHTML5() {
    // Can't find a better way to remove them ¯\_(ツ)_/¯
    var oldControls = document.querySelector('.html5_video_overlay');
    if (oldControls !== null && typeof oldControls !== 'undefined') {
        oldControls.parentNode.removeChild(oldControls);
    }

    var videos = document.getElementsByTagName('video');
    if (videos !== null && typeof videos !== 'undefined' && videos.length !== 0) {
        for (var i = 0; i < videos.length; i++) {
            videos[i].setAttributeNode(document.createAttribute('controls'));
        }
    }

    var style = document.createElement('style');
    var node = document.createTextNode('video::-webkit-media-controls { filter: grayscale(1) brightness(0.9) invert(1); }');
    style.appendChild(node);
    document.head.appendChild(style);
}