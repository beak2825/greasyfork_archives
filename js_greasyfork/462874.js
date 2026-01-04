// ==UserScript==
// @name         Amazon Live Double Previously Live Playback Speed
// @namespace    http://www.amazon.com
// @version      0.1
// @description  On finding a video on Amazon.com/live, double the playback rate if there is a previously live badge
// @author       charlwen,
// @include      https://www.amazon.com/live/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant          GM_registerMenuCommand
// @grant          unsafeWindow
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462874/Amazon%20Live%20Double%20Previously%20Live%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/462874/Amazon%20Live%20Double%20Previously%20Live%20Playback%20Speed.meta.js
// ==/UserScript==

// modify this if you want another default speed
const defaultPlaybackSpeed = 2;

// brute force check if there is a previously live badge
const previouslyLive = 'Previously Live';
const checkPreviouslyLive = () => {
    let isPreviouslyLive = false;
    document.querySelectorAll('span').forEach((span) => {
        isPreviouslyLive = isPreviouslyLive || span.textContent === previouslyLive;
    });
    return isPreviouslyLive;
};

// update all videos in the document to play at the desired speed
const updatePlaybackSpeed = (speed) => {
    console.log("Setting playback to ", speed);
    document.querySelectorAll('video').forEach((video) => {
        video.playbackRate = speed;
    });
}

// check if you need to update the speed
// note: if update playback is not run, the default playback speed of 1 is used
const updateCallback = (speed) => {
    if (checkPreviouslyLive()) {
        updatePlaybackSpeed(speed);
    }
};

// check for new video nodes every 3 seconds
let updateLoop = setInterval(updateCallback, 3000, defaultPlaybackSpeed);

// add an option to choose a different speed in the scripts menu
GM_registerMenuCommand("Choose a different playback speed", () => {
    // prompt user for new speed (fallback to default if user cancels)
    const overrideSpeed = prompt(
        'Set a new playback speed', 2
    ) || defaultPlaybackSpeed;
    console.log("Overrided playback speed to ", overrideSpeed);

    // call the update now and update the looped check
    clearInterval(updateLoop);
    updateCallback(overrideSpeed);
    updateLoop = setInterval(updateCallback, 3000, overrideSpeed);
});

console.log("sanity");