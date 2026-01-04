// ==UserScript==
// @name         YouTube Auto-Player
// @namespace    https://www.youtube.com/
// @version      1.0
// @description  Auto plays a video at given timestamp.
// @author       SaberSpeed77
// @match        https://www.youtube.com/*
// @icon         https://w7.pngwing.com/pngs/566/248/png-transparent-computer-icons-youtube-play-button-button-angle-text-triangle.png
// @downloadURL https://update.greasyfork.org/scripts/453567/YouTube%20Auto-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/453567/YouTube%20Auto-Player.meta.js
// ==/UserScript==

function autoPlay() {
    const min = 1; // change to whatever (other than 0 because it bugs out; if using just sec, replace lines 15-16 with: `#t=${sec}s`
    const sec = 30; // change to whatever

    if (window.location.href.includes(`#t=${min}m${sec}s`)) {return;}
    const url = window.location.href + `#t=${min}m${sec}s`;
    const curTime = parseFloat(document.getElementsByClassName("ytp-time-current")[0].innerHTML);
    if (curTime < min) {
        window.location.href = url;
        document.getElementsByClassName("ytp-play-button ytp-button")[0].click();
    }
}
window.addEventListener("yt-navigate", () => {autoPlay();});
window.addEventListener("yt-navigate-start", () => {autoPlay();});
window.addEventListener("yt-navigate-finish", () => {autoPlay();});

