// ==UserScript==
// @name         Play YouTube videos on new tab only on click
// @namespace    Easy YouTube click to play
// @version      0.1
// @description  Now you can click to play,no more video autoplay on newtab.
// @author       Nguyên
// @match        https://m.youtube.com/watch?v=*
// @match        https://m.youtube.com/watch?v=*&list=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485460/Play%20YouTube%20videos%20on%20new%20tab%20only%20on%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/485460/Play%20YouTube%20videos%20on%20new%20tab%20only%20on%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var video = document.querySelector('video');
    video.pause();

    var playButton = document.querySelector('button.ytp-large-play-button.ytp-button');
    playButton.addEventListener('click', function() {
        video.play();
    });
})();
