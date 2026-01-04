// ==UserScript==
// @name         NoBannerPopupYouTube
// @namespace    http://youtube.com/
// @version      0.3
// @match        https://youtube.com/*
// @description  Tired of the nasty banner when there is a special day well im here to save you with this easy script that checks if there is a bp SearchParams and redirects you with no banner on top.
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @include      *youtube.com*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471274/NoBannerPopupYouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/471274/NoBannerPopupYouTube.meta.js
// ==/UserScript==

setInterval(() => {
    const url = new URL(window.location.href);
    const websiteParam = url.searchParams.get("bp");

    if (websiteParam) {
        window.location.replace('https://youtube.com/');
    } else {
        return
    }
}, 200);