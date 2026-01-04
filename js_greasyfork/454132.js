// ==UserScript==
// @name         YoutubeVideoRowConverter
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Convert videos to 6 videos per row
// @author       You
// @match        https://www.youtube.com/c/*/videos
// @match        https://www.youtube.com/*/videos
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454132/YoutubeVideoRowConverter.user.js
// @updateURL https://update.greasyfork.org/scripts/454132/YoutubeVideoRowConverter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VIDEOS_PER_ROW = 6;
    document.getElementById("primary").firstChild.style.cssText = document.getElementById("primary").firstChild.style.cssText.replace(4, VIDEOS_PER_ROW)
    const videos = Array.from(document.getElementsByTagName("ytd-rich-item-renderer"))

    const rows = Array.from(document.getElementsByTagName("ytd-rich-grid-row"))
    if (!!rows.length) {

    }
    rows.forEach((row, index) => {
        if (index > videos.length/VIDEOS_PER_ROW) return;

        const contents = row.lastElementChild;
        row.removeChild(contents);

        const newChild = document.createElement("div");
        newChild.id = "contents";
        newChild.class = "style-scope ytd-rich-grid-row";

        const videosToAdd = videos.slice(index * VIDEOS_PER_ROW, (index+1)*VIDEOS_PER_ROW);
        videosToAdd.forEach(videoToAdd => {
            //newChild.appendChild(videoToAdd);
            row.appendChild(videoToAdd);
        })
    });
})();