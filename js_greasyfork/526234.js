// ==UserScript==
// @name                Hide the next video button that is not a playlist
// @namespace           https://greasyfork.org/users/821661
// @match               https://www.youtube.com/*
// @grant               none
// @version             1.0
// @author              hdyzen
// @description         https://www.reddit.com/r/userscripts/comments/1ik0gx2/how_to_hide_youtube_suggestedrecommended_video/
// @downloadURL https://update.greasyfork.org/scripts/526234/Hide%20the%20next%20video%20button%20that%20is%20not%20a%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/526234/Hide%20the%20next%20video%20button%20that%20is%20not%20a%20playlist.meta.js
// ==/UserScript==

document.addEventListener("yt-renderidom-finished", () => {
    const isPlaylist = document.querySelector("ytd-watch-flexy[playlist]");

    if (isPlaylist) {
        document.querySelector(".ytp-next-button")?.removeAttribute("hidden");
    } else {
        document.querySelector(".ytp-next-button")?.setAttribute("hidden", "");
    }
});
