// ==UserScript==
// @name        YoutubeDisableFocusVolume
// @namespace   YoutubeDisableFocusVolume
// @description:ru Если фокусировка на громкости - позволяет перематывать видео клавишей.
// @description:en If focusing on the volume - allows you to rewind the video with the key.
// @author Ratmir Aitov
// @license MIT
// @include     https://www.youtube.com/*
// @match       https://www.youtube.com/*
// @exclude     https://www.youtube.com
// @version     0.2
// @grant       none
// @homepageURL https://greasyfork.org/ru/scripts/445540
// @description Если фокусировка на громкости - позволяет перематывать видео клавишей.
// @downloadURL https://update.greasyfork.org/scripts/445540/YoutubeDisableFocusVolume.user.js
// @updateURL https://update.greasyfork.org/scripts/445540/YoutubeDisableFocusVolume.meta.js
// ==/UserScript==

window.addEventListener('keydown', function(event) {
    if (event.target.classList.contains('ytp-volume-panel')) {
        const player = document.getElementById('movie_player');
        player.focus();
        player.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight', bubbles: true, code:"ArrowRight", keyCode:39 }));
    }
})