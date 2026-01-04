// ==UserScript==
// @name                [Youtube Music] Pause video/music with Alt+K on any page
// @namespace           https://greasyfork.org/users/821661
// @match               https://*/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_addValueChangeListener
// @version             1.1
// @author              hdyzen
// @description         Pause youTube video/music with Alt+K on any page
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/531610/%5BYoutube%20Music%5D%20Pause%20videomusic%20with%20Alt%2BK%20on%20any%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/531610/%5BYoutube%20Music%5D%20Pause%20videomusic%20with%20Alt%2BK%20on%20any%20page.meta.js
// ==/UserScript==

function init() {
    const domain = window.location.hostname;

    if (domain === "music.youtube.com") {
        onYoutubeMusic();
    }

    onEveryPage();
}
init();

function onEveryPage() {
    window.addEventListener("keydown", handlerKey);
}

function onYoutubeMusic() {
    const callback = () => {
        const video = document.querySelector(".video-stream");

        video.paused ? video.play() : video.pause();
    };

    GM_addValueChangeListener("toggleVideo", callback);
}

function handlerKey(ev) {
    const isAltKPressed = ev.altKey && ev.code === "KeyK";

    if (!isAltKPressed) {
        return;
    }

    GM_setValue("toggleVideo", !GM_getValue("toggleVideo"));
}
