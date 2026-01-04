// ==UserScript==
// @name         YouTube Capture Frame
// @namespace    ycf.smz.k
// @version      1.1
// @description  Adds button to copy current video frame to the clipboard
// @author       Abdelrahman Khalil
// @match        *.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419763/YouTube%20Capture%20Frame.user.js
// @updateURL https://update.greasyfork.org/scripts/419763/YouTube%20Capture%20Frame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function capture() {
        let video = document.querySelector("video")
        let w = video.videoWidth;
        let h = video.videoHeight;
        let canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);

        canvas.toBlob(blob => {
            if(navigator.clipboard && navigator.clipboard.write)
                navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
            else console.warn("Copying images is not supported in your browser")
        })
    }

    let button = document.createElement("button")
    button.classList.add("ytp-button")
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="25px" height="100%"><path d="M0 0h24v24H0V0z" fill="none"/><circle cx="12" cy="12" r="3"/><path d="M20 4h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65H9.88c-.56 0-1.1.24-1.48.65L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>'
    button.style.width = "auto"
    button.addEventListener("click", capture)

    if(document.querySelector(".ytp-right-controls"))
       document.querySelector(".ytp-right-controls").insertBefore(button, document.querySelector(".ytp-settings-button"))

    addEventListener('yt-page-data-updated', () => {
        document.querySelector(".ytp-right-controls").insertBefore(button, document.querySelector(".ytp-settings-button"))
    })
})();