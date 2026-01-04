// ==UserScript==
// @name                Youtube Auto Stable Volume
// @icon                https://www.youtube.com/img/favicon_48.png
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_auto_stable_volume_namespace
// @version             0.1.1
// @match               *://www.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @exclude             *://www.youtube.com/live_chat*
// @license             MIT
// @description         Automatically enables Stable Volume (DRC) if it detects you are playing on some kind of speakers, disable it otherwise.
// @downloadURL https://update.greasyfork.org/scripts/530734/Youtube%20Auto%20Stable%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/530734/Youtube%20Auto%20Stable%20Volume.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    "use strict";

    let moviePlayer = null;

    async function updateDrcStatus() {
        console.log('Updating DRC status...');
        try {
            if (!moviePlayer) throw "Movie player not found.";
            if (!moviePlayer.hasDrcAudioTrack()) throw "Video does not have DRC.";
            const currentAudioOutputDevice = await getCurrentAudioOutputDevice();
            const shouldEnableDrc = currentAudioOutputDevice && currentAudioOutputDevice.toLowerCase().includes("speaker");
            if (typeof shouldEnableDrc === "undefined") throw "Failed to determine audio device type.";
            moviePlayer.setDrcUserPreference(shouldEnableDrc ? 1 : 0);
        } catch (error) {
            console.error("Failed to update DRC status: " + error);
        }
    }

    async function getCurrentAudioOutputDevice() {
        try {
            const audioDevices = await navigator.mediaDevices.enumerateDevices();
            const defaultOutputDevice = audioDevices.find(device =>
                device.kind === 'audiooutput' && device.deviceId === 'default'
            );
            return defaultOutputDevice?.label;
        } catch (error) {
            console.error('Error enumerating devices: ', error);
            return null;
        }
    }

    function processVideoLoad(event = null) {
        moviePlayer = event?.target?.player_ ?? document.querySelector('#movie_player');
        updateDrcStatus();
    }

    function initialize() {
        navigator.mediaDevices.addEventListener("devicechange", () => {
            console.log("Audio outputs changed. Checking if DRC state should be updated.");
            updateDrcStatus();
        }, true);

        window.addEventListener('pageshow', processVideoLoad, true);
        if (window.self === window.top) {
            window.addEventListener('yt-player-updated', processVideoLoad, true);
        }
    }

    initialize();
})();