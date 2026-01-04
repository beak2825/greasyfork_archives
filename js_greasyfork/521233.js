// ==UserScript==
// @name         Jut Su Premium Features
// @namespace    http://tampermonkey.net/
// @version      2024-11-07
// @license      GNU General Public License v3.0
// @description  premium jutsu features
// @author       v666ad
// @match        https://jut.su/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521233/Jut%20Su%20Premium%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/521233/Jut%20Su%20Premium%20Features.meta.js
// ==/UserScript==

function run(myPlayer, videoElement) {
    videoElement.onerror = () => { setTimeout(() => { window.location.reload() }, 1000)}

    myPlayer.remove()

    document.body.insertBefore(myPlayer, document.body.firstChild);

    videoElement.style.cursor = 'none';
    videoElement.focus();

    var nextEpisodeButton = document.querySelector('.there_is_link_to_next_episode');

    myPlayer.querySelector('.vjs-big-play-button').click();
    var i = setInterval(() => {
        if (!videoElement.paused) {
            clearInterval(i);
            return
        }
        myPlayer.querySelector('.vjs-big-play-button').click();
    }, 1000);

    if (nextEpisodeButton) {
        setInterval( () => {
            if (videoElement.currentTime > videoElement.duration - 1) {
                nextEpisodeButton.click();
            };
        }, 3000)
    }
}

(function() {
    'use strict';
    var i = setInterval(() => {
        var myPlayer = document.querySelector('#my-player');
        if (myPlayer) {
            var videoElement = myPlayer.querySelector('video');
            if (videoElement) {
                clearInterval(i);
                run(myPlayer, videoElement);
            };
        };
    }, 1000);
})();
