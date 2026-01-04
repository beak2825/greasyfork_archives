// ==UserScript==
// @name         Youtube Music Videoplayer Remover
// @namespace    https://gist.github.com/stef1904berg/6fb39fc40f6a3cb0655aa1fb7141c81a
// @license      MIT
// @version      1.5
// @description  Prevents the videoplayer from displaying. This does not stop video playback requests from happening and thus not save you data.
// @author       stef1904berg
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463330/Youtube%20Music%20Videoplayer%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/463330/Youtube%20Music%20Videoplayer%20Remover.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function () {
        document.getElementById("main-panel").remove()
        let playingElement = document.getElementsByClassName("side-panel modular style-scope ytmusic-player-page")[0]
        playingElement.classList.remove("side-panel");
        playingElement.style.width = "100%";
    })
})();