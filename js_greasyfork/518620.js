// ==UserScript==
// @name         YouTube Screenshot
// @namespace    https://github.com/Bit38
// @source       https://github.com/Bit38/user-scrips
// @license      MIT
// @version      1.0.2
// @description  Downloads the current frame of a YouTube video as a png
// @author       Bit38
// @match        https://www.youtube.com/watch*
// @icon         https://raw.githubusercontent.com/Bit38/user-scrips/refs/heads/main/icons/ytscreenshot.png
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518620/YouTube%20Screenshot.user.js
// @updateURL https://update.greasyfork.org/scripts/518620/YouTube%20Screenshot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const screenshot_icon = `<svg width="100%" height="100%" fill="#e8eaed" version="1.1" viewBox="0 0 36 36"><path d="m21.3 23.625h4.4v-4.5h-1.65v2.8125h-2.75zm-11-6.75h1.65v-2.8125h2.75v-1.6875h-4.4zm3.3 10.125h-4.4c-0.605 0-1.1229-0.22031-1.5537-0.66094-0.43083-0.44062-0.64625-0.97031-0.64625-1.5891v-13.5c0-0.61875 0.21542-1.1484 0.64625-1.5891 0.43083-0.44062 0.94875-0.66094 1.5537-0.66094h17.6c0.605 0 1.1229 0.22031 1.5538 0.66094 0.43083 0.44062 0.64625 0.97031 0.64625 1.5891v13.5c0 0.61875-0.21542 1.1484-0.64625 1.5891-0.43083 0.44062-0.94875 0.66094-1.5538 0.66094h-4.4zm-4.4-2.25h17.6v-13.5h-17.6zm0 0v-13.5z" fill="#fff" stroke-width=".027811"/></svg>`
    const htmlPolicy = window.trustedTypes.createPolicy("ytscreenshotPolicy", {
            createHTML: (to_escape) => to_escape
    })

    const sanitize_file_name = (filename) => {
        const validchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-.:;<=>?@[]^_`{|}~ \t";

        return filename.split('').filter((c) => validchars.indexOf(c) !== -1).join('');
    };

    const canvas = document.createElement("canvas");
    const screenshot_func = () => {
        const vid = document.querySelector("video");
        const title = document.querySelector("#title > h1 > yt-formatted-string").innerText;
        const duration = document.querySelector(".ytp-time-current").innerText;

        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
        let dataURL = canvas.toDataURL('image/png');

        var link = document.createElement('a');
        link.download = sanitize_file_name(`${title} ${duration} ${vid.videoWidth}x${vid.videoHeight}.png`);
        link.href = dataURL;
        link.click();
    }

    document.arrive('.ytp-right-controls', () => {
        const right_controls = document.querySelector(".ytp-right-controls");
        const miniplayer_btn = document.querySelector(".ytp-miniplayer-button");
        const screenshot_btn = document.createElement("button");

        screenshot_btn.classList.add("ytp-button");
        screenshot_btn.onclick = screenshot_func;

        screenshot_btn.innerHTML = htmlPolicy.createHTML(screenshot_icon);
        right_controls.insertBefore(screenshot_btn, miniplayer_btn);
    });
})();
