// ==UserScript==
// @name         Audiobookcup Download
// @namespace    http://hermanfassett.me
// @version      0.1
// @description  Replace fake audiobookcup download links with real download links. You must start playing audiobook first so it can load the file src.
// @author       You
// @match        https://www.audiobookcup.com/*
// @icon         https://www.google.com/s2/favicons?domain=audiobookcup.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431871/Audiobookcup%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/431871/Audiobookcup%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace fake download links with actual download
    [...document.querySelectorAll("a[href='https://www.audiobookmax.com']")].forEach((a) => {
        a.onclick = function() {
            const audio = document.querySelector("#fwdeapdiv0 audio");
            const title = document.querySelector("h1.entry-title").innerText || document.title;

            if (audio && audio.src) {
                this.href = audio.src;
                this.download = `${title}.mp3`;
                this.removeAttribute("target");
                this.removeAttribute("rel");
            }
        }
    });
})();