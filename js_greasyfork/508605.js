// ==UserScript==
// @name        Webtoon scroll-no-more
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Naver_Line_Webtoon_logo.png/128px-Naver_Line_Webtoon_logo.png
// @description Quality of life improvements for webtoons.com
// @match       https://www.webtoons.com/en/*
// @version     1.1
// @grant       none
// @esversion   11
// @license     MIT
// @namespace https://greasyfork.org/users/1368219
// @downloadURL https://update.greasyfork.org/scripts/508605/Webtoon%20scroll-no-more.user.js
// @updateURL https://update.greasyfork.org/scripts/508605/Webtoon%20scroll-no-more.meta.js
// ==/UserScript==

// Fill horizontal space with comics
document.getElementById("_viewerBox")?.style.setProperty("width", 'auto');

// Add borders to images so reading order is clear (they sometimes don't exactly line up with actual panels)
Array.from(document.getElementsByClassName("_images")).forEach(function(element) {
    element.style.border = '1px solid grey';
});

// Remove gaps between images
document.getElementById("_imageList")?.style.setProperty('font-size', '0');

Array.from(document.getElementsByClassName('_images')).forEach(function(element) {
    // Load all images immediately
    element.src = element.dataset.url;
    // Slight vertical gap between images
    element.style.marginBottom = '20px';
});

// left and right arrows for navigation
document.onkeydown = function(e) {
    if (e.keyCode == '37') {
        var elements = document.querySelector("._prevEpisode")?.click();
    } else if (e.keyCode == '39') {
        var elements = document.querySelector("._nextEpisode")?.click();
    }
};
