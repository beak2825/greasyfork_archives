// ==UserScript==
// @name         HiAnime Auto 1080p
// @namespace    http://tampermonkey.net/
// @version      5.3.2
// @description  Automatically sets your Quality & Speed to your desired values, Auto Fullscreen, Auto Pause/Unpause when switching tabs, Auto Unmute, Auto Focus.
// @icon         https://hianime.to/images/icons-192.png
// @author       Ghoste
// @match        https://megacloud.blog/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506891/HiAnime%20Auto%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/506891/HiAnime%20Auto%201080p.meta.js
// ==/UserScript==


var pauseOnFocusLoss = false
// Set this to true if you want it to pause/unpause based on if you're looking at
// the HiAnime tab or not (minimizing the browser, switching to another tab.)
// Valid Values: true, false.


var autoFocus = true
// If this is true, automatically focuses on the player once it begins playback (for keyboard shortcuts)
// Valid Values: true, false.

var autoUnmute = true
// If this is true, automatically unmutes the player if it starts muted.
// Valid Values: true, false.

var autoFullscreen = false
// Set this to true if you want the video to automatically go fullscreen.
// Valid Values: true, false.

var playbackQuality = "1080"
// Sets the Video Quality.
// Valid Values: 1080, 720, 360.

var playbackRate = 1
// Sets the Playback Speed.
// Valid Values: 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2. (higher might work)






function waitForElement(selector, callback) {
    const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
            observer.disconnect();
            callback(element);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

waitForElement('#megacloud-player', () => {
    const player = jwplayer();
    const qualityMap = { "1080": 1, "720": 2, "360": 3 };


    if (autoFocus) player.getContainer().focus();

    player.on('firstFrame', () => {
        player.setCurrentQuality(qualityMap[playbackQuality]);
        if (autoUnmute) player.setMute(0);
        if (autoFullscreen) player.setFullscreen(1);
        if (playbackRate !== 1) player.setPlaybackRate(playbackRate);
    });
    player.on('visualQuality', function(){
        player.setCurrentQuality(qualityMap[playbackQuality]);
    });
    if (pauseOnFocusLoss) {
        let wasPlaying = false;
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                wasPlaying = player.getState() === 'playing';
                player.pause();
            } else if (wasPlaying) {
                player.play();
            }
        });
    }
});