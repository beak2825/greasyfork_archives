// ==UserScript==
// @name         ClongTitles
// @namespace    clong
// @version      1.0.1
// @description  Replace banner-writer.web.app/image links in YouTube titles with banner writing images.
// @author       DATA_CORRUPTED
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://update.greasyfork.org/scripts/446257/1059316/waitForKeyElements%20utility%20function.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535369/ClongTitles.user.js
// @updateURL https://update.greasyfork.org/scripts/535369/ClongTitles.meta.js
// ==/UserScript==

waitForKeyElements('#title yt-formatted-string.ytd-watch-metadata[title]', replaceTitle);
waitForKeyElements('a#video-title[title],a#video-title-link[title],span#video-title[title]', replaceTitle, false);

const urlRegex = /https:\/\/banner-writer\.web\.app\/image\/[^\s]+\.png/gm;

function replaceTitle(elem) {
    const match = elem.title.match(urlRegex);
    if (!match) return;
    const img = document.createElement('img');
    img.src = match;
    elem.replaceChildren();
    elem.appendChild(img);
}