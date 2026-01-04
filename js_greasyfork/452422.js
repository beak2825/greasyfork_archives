// ==UserScript==
// @name        Redd.Tube Respect Mute
// @description Remember if videos should be muted on Redd.Tube
// @namespace   https://sleazyfork.org/en/users/963844-hibye
// @homepageURL https://sleazyfork.org/en/scripts/452422-redd-tube-respect-mute
// @version     0.7
// @match       https://www.redd.tube/video/*
// @match       https://redd.tube/video/*
// @downloadURL https://update.greasyfork.org/scripts/452422/ReddTube%20Respect%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/452422/ReddTube%20Respect%20Mute.meta.js
// ==/UserScript==

(() => {
    const muteSetting = 'muteVideo';
    const mutedVal = 'mute';
    const unmutedVal = 'unMute';

    const unpauseVideo = function (video) {
        if (video.paused) {
            video.play()
                .catch(err => console.error('Unable to play video', err));
        }
    }

    document.addEventListener('canplay', (evnt) => {
        const video = evnt.target;
        const vidContainsAudio = video.webkitAudioDecodedByteCount > 0 || video.mozHasAudio;

        if (localStorage.getItem(muteSetting) === null) {
            localStorage.setItem(muteSetting, mutedVal);
        }
        const currMuteVal = localStorage.getItem(muteSetting);

        if (vidContainsAudio) {
            if (currMuteVal === unmutedVal && video.muted) {
                video.muted = false;
                unpauseVideo(video);
            }
        }

        video.addEventListener('volumechange', () => {
            const settingVal = video.muted || video.volume === 0 ? mutedVal : unmutedVal;
            localStorage.setItem(muteSetting, settingVal);
        });

    }, { capture: true, once: true });

    document.addEventListener('click', () => {
        const video = document.querySelector('video');

        if (video.paused) {
            unpauseVideo(video);
        }
    }, { once: true });
})();
