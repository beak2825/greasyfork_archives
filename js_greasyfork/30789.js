// ==UserScript==
// @name            Imgur: Mobile Cleanup
// @namespace       https://github.com/Zren/
// @description     Cleanup m.imgur.com and always load all images in the album.
// @icon            https://imgur.com/favicon.ico
// @author          Zren
// @version         1
// @include         https://m.imgur.com/*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30789/Imgur%3A%20Mobile%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/30789/Imgur%3A%20Mobile%20Cleanup.meta.js
// ==/UserScript==

var css = ".FloatingOIA-container { display: none; }";
css += ".PostLoader { display: none; }";
css += ".AppBanner { display: none; }";
css += ".Navbar .getTheApp { display: none; }";

if (window.location.pathname.startsWith('/gallery/')) {
    css += ".GalleryHandler-postContainer { display: none; }";
    css += ".GalleryInfiniteScroll > div > div:not(.GalleryHandler-postContainer) + .GalleryHandler-postContainer { display: block !important; }";
    css += '.GalleryInfiniteScroll > div > div:not(.GalleryHandler-postContainer)[style="width: 100%; height: 9000px;"] { display: none; }';
}
GM_addStyle(css);
    

function tick() {
    var loadMoreButton = document.querySelector('.Post-albumSeeMore.Button');
    if (loadMoreButton) {
        loadMoreButton.click();
    } else {
        setTimeout(tick, 400);
    }
}

setTimeout(tick, 400);
