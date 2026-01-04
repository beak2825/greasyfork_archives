// ==UserScript==
// @name         Chin Fast Image Downloader
// @namespace    https://greasyfork.org/en/users/86284-benjababe
// @version      1.04
// @description  One click to download current hovered image/webmeme
// @author       Benjababe

// @match        https://boards.4channel.org/*
// @match        https://arch.b4k.co/*
// @match        https://archived.moe/*
// @match        https://archive.nyafuu.org/*
// @match        https://archive.wakarimasen.moe/*
// @match        https://desuarchive.org/*
// @match        https://warosu.org/*

// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/427057/Chin%20Fast%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/427057/Chin%20Fast%20Image%20Downloader.meta.js
// ==/UserScript==

// jshint esversion: 6

(function () {
    'use strict';

    const HOTKEY = "Pause";

    document.onkeydown = (e) => {
        // key can be whatever you want, I choose pause as it's what I bound my mouse side keys to
        if (e.code === HOTKEY) {
            // get all elements hovered
            let els = document.querySelectorAll(":hover");
            els.forEach((el) => {
                // only download for images
                // for webms, it works only on its thumbnail
                if (el.tagName.toLowerCase() === "img") {
                    // link to original image/webmeme usually is the parent <a> element
                    let parent = el.parentNode,
                        url = parent.href,
                        filename = HDFilenameFromURL(url);
                    GM_download(url, filename);
                }
            });
        }
    }

    // eg. ".../1622014662736s.jpg -> 1622014662736.jpg"
    // this function shouldn't ever need to be called, it's ran just in case
    let HDFilenameFromURL = (url) => {
        let SDFilename = url.split("/").pop(),
            re = /([0-9]{1,})[s]{0,}([.a-zA-Z]{1,})/,
            match = SDFilename.match(re);

        return match[1] + match[2];
    }
})();