// ==UserScript==
// @name         Kemono Video Linker & Image Loader
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Turns the video name into a clickable link, and automatically loads image previews.
// @author       https://github.com/xskutsu/
// @match        *://kemono.party/*
// @match        *://kemono.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525980/Kemono%20Video%20Linker%20%20Image%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/525980/Kemono%20Video%20Linker%20%20Image%20Loader.meta.js
// ==/UserScript==

(function() {
    "use strict";
    window.addEventListener("load", function () {
        setInterval(function () {
            if (window.location.href.split("/").filter(o => o.length > 1).splice(-2, 1)[0] !== "post") return;
            document.querySelectorAll('.post__video').forEach(videoElement => {
                const summary = videoElement.parentElement.parentElement.children[0];
                const videoSource = videoElement.children[0].src;
                const link = document.createElement('a');
                link.textContent = summary.textContent;
                link.href = videoSource;
                link.target = '_blank';
                link.appendChild(document.createElement('br'));
                summary.parentElement.prepend(link);
                summary.remove();
                videoElement.classList.remove("post__video");
            });
            const thumbnails = document.querySelectorAll('.post__thumbnail');
            thumbnails.forEach((thumbnail, index) => {
                setTimeout(() => {
                    const targetElement = thumbnail.children[0]?.children[0];
                    if (targetElement?.classList.contains('image-link')) {
                        targetElement.children[0]?.click();
                        thumbnail.classList.remove("post__thumbnail");
                    }
                }, index * 800);
            });
        }, 1000);
    });
})();