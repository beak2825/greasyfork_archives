// ==UserScript==
// @name         Eat the Blocks Pro
// @namespace    eattheblocks
// @version      1.0
// @description  Unlock all Eat the Blocks Pro courses/lessons.
// @author       Your Name
// @match        https://pro.eattheblocks.com/courses/*
// @icon         https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/325/fire_1f525.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464602/Eat%20the%20Blocks%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/464602/Eat%20the%20Blocks%20Pro.meta.js
// ==/UserScript==

setInterval(() => {
    document.querySelectorAll("[free='']").forEach(el => el.setAttribute("free", true)); // set all elements with the attribute free set to '' to true

    if (document.querySelector(".video-access [slot='granted']")) { // replace HOW TO ENROLL to YOU HAVE ACCESS
        document.querySelector(".video-access [slot='denied']").remove();
        document.querySelector(".video-access [slot='granted']").setAttribute("slot", "denied");
    }

    const videoPlayer = document.querySelector("video-player");
    if (!videoPlayer?.shadowRoot?.querySelector(".vid")?.innerHTML) return; // return if no video player

    const vimeoId = document.querySelector("global-data").vimeo; // get id for vimeo video
    const youtubeId = document.querySelector("global-data").youtube; // get id for vimeo video

    if (vimeoId) { // if there is an id,
        videoPlayer.setAttribute("free", true); // set free to true
        videoPlayer.shadowRoot.querySelector(".vid").innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="" title="${location.pathname.split("/")[3]}" width="426" height="240" frameborder="0"></iframe>`; // set video
    }
    if (youtubeId) { // if there is an id,
        videoPlayer.setAttribute("free", true); // set free to true
        videoPlayer.shadowRoot.querySelector(".vid").innerHTML = `<iframe src="https://youtube.com/embed/${youtubeId}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen="" title="${location.pathname.split("/")[3]}" width="426" height="240" frameborder="0"></iframe>`; // set video
    }
}, 100);
