// ==UserScript==
// @name         Video Element Rate Controller Re-dux
// @namespace    https://github.com/mirnhoj/video-element-playbackrate-setter
// @version      2.5
// @description  Add keyboard shortcuts that will increase/decrease the playback rate for video elements.
// @include      http*://*.youtube.com/*
// @include      http*://*.gfycat.com/*
// @include      http*://*.vimeo.com/*
// @include      https://www.facebook.com/video.php*
// @include      https://www.facebook.com/*/videos/*
// @include      https://www.kickstarter.com/*
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/370897/Video%20Element%20Rate%20Controller%20Re-dux.user.js
// @updateURL https://update.greasyfork.org/scripts/370897/Video%20Element%20Rate%20Controller%20Re-dux.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
//
// if you want to extend the functionality of this script to other sites
// besides youtube, add additional @include keys to the metadata block or to
// the "User includes" or "User matches" sections in the Settings.
//
// if you want to change the default playback rate from 1x, change the line
// "var currentPlaybackRate = 1;" to equal something other than 1, like 1.3 to
// have all videos start playing at an increased speed, or 0.7 to have all
// videos start playing at a decreased speed.
//
// if you want change the granularity of the playback rate adjustment, change
// the line "var speedStep = 0.1;" to equal something other than 0.1, like 0.01
// for more granular adjustments, or 0.25 for less granular adjustments.

// These values are the default values for initialization
const defaults = {
    speedStep: 0.1,
    displayTimeMilliSec: 1500
};

// script variables
let timeoutID = null;
let showValuesOnVideo = true; // true to show new value on the video
let keyIncreaseSpeed = ']';
let keyReduceSpeed = '[';
let keyResetSpeed = '\\';
const infoboxId = 'playbackrate-indicator';

function getVal(variable) {
    let value;
    let storage = (localStorage || (sessionStorage ||
        (window.content.localStorage ? window.content.localStorage : null)));
    try {
        switch (variable) {
            case 'speedStep':
                value = storage.getItem('VERCRspeedStep');
                return Number(value);
            case 'displayTimeMilliSec':
                value = storage.getItem('VERCRdisplayTimeMS');
                return Number(value);
            case 'keyIncreaseSpeed':
                return value;
            case 'keyReduceSpeed':
                return value;
            case 'keyResetSpeed':
                return value;
            default:
                return null;
        }
    } catch (e) {
        if (e.name === 'NS_ERROR_FILE_CORRUPTED') {
            storage = sessionStorage || null; // set the new storage if fails
            storage.setItem('VERCRspeedStep', defaults.speedStep);
            storage.setItem('VERCRdisplayTimeMS', defaults.displayTimeMilliSec);
        }
    }
}

function setVal(variable, value) {
    let storage = (localStorage || (sessionStorage ||
        (window.content.localStorage ? window.content.localStorage : null)));
    try {
        switch (variable) {
        case 'speedStep':
            storage.setItem('VERCRspeedStep', Number(value));
            return value;
        case 'displayTimeMilliSec':
            storage.setItem('VERCRdisplayTimeMS', Number(value));
            return value;
        default:
            return null;
        }
    } catch (e) {
        if (e.name === 'NS_ERROR_FILE_CORRUPTED') {
            storage = sessionStorage || null; // set the new storage if fails
            storage.setItem('VERCRspeedStep', defaults.speedStep);
            storage.setItem('VERCRdisplayTimeMS', defaults.displayTimeMilliSec);
        }
    }
}

function GMsetup() {
    if (GM_registerMenuCommand) {
        GM_registerMenuCommand('Set adjustment rate', () => {
            const curEntry = getVal('speedStep');
            let speedStep = prompt('New adjustment rate:\n(e.g., 0.1 = 10% faster)', curEntry);
            if (speedStep !== null) {
                while (isNaN(speedStep)) {
                    speedStep = prompt('Please input a valid number!\n\nNew adjustment rate:\n(e.g., 0.1 = 10% faster)', curEntry);
                }
                setVal('speedStep', speedStep);
            }
        });
        // GM_registerMenuCommand('Video Rate Re-dux: Set keyboard shortcuts', () => {
        //     const curEntry = `${getVal('keyIncreaseSpeed')}, ${getVal('keyReduceSpeed')}, ${getVal('keyResetSpeed')}`;
        //     // W.I.P.
        // });
        GM_registerMenuCommand('Set display timeout', () => {
            const curEntry = getVal('displayTimeMilliSec');
            let displayTimeMilliSec = prompt('New display timeout length (in milliseconds):', curEntry);
            if (displayTimeMilliSec !== null) {
                while (isNaN(displayTimeMilliSec)) {
                    displayTimeMilliSec = prompt('Please input a valid number!\n\nNew display timeout length (in milliseconds):', curEntry);
                }
                setVal('displayTimeMilliSec', displayTimeMilliSec);
            }
        });
    }
}

function init() {
    let VERCRspeedStep = localStorage.getItem('VERCRspeedStep');
    let VERCRdisplayTimeMS = localStorage.getItem('VERCRdisplayTimeMS');
    if (!VERCRspeedStep) {
        VERCRspeedStep = defaults.speedStep;
        localStorage.setItem('VERCRspeedStep', Number(VERCRspeedStep));
    }
    if (!VERCRdisplayTimeMS) {
        VERCRdisplayTimeMS = defaults.displayTimeMilliSec;
        localStorage.setItem('VERCRdisplayTimeMS', Number(VERCRdisplayTimeMS));
    }
}

function getInfobox(videoElement) {
    if (!videoElement) return;
    let infoboxEl = document.getElementById(infoboxId);
    if (!infoboxEl) {
        // create and add infobox to dom if it doesn't already exist.
        infoboxEl = document.createElement('h1');
        infoboxEl.setAttribute('id', infoboxId);
        infoboxEl.style.position = 'absolute';
        infoboxEl.style.top = '10%';
        infoboxEl.style.right = '10%';
        infoboxEl.style.color = 'rgba(255, 0, 0, 1)';
        infoboxEl.style.zIndex = '99999'; // ensures that it shows above other elements.
        infoboxEl.style.visibility = 'hidden';
        infoboxEl.style.marginTop = '3%';
    }
    if (videoElement.parentElement !== infoboxEl.parentElement)
        videoElement.parentElement.appendChild(infoboxEl);
    return infoboxEl;
}

// update rate indicator.
function showInfobox(videoElement, rate) {
    const infobox = getInfobox(videoElement);
    infobox.innerHTML = `${rate}x`;
    // show infobox
    infobox.style.visibility = 'visible';
    // clear out any previous timers and have the infobox hide after the pre-set time period
    window.clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => {
        infobox.style.visibility = 'hidden';
    }, getVal('displayTimeMilliSec'));
}

function setPlaybackRate(videoElement, rate, shouldShowInfobox) {
    // grab the video elements and set their playback rate.
    if (!videoElement) return;
    videoElement.playbackRate = rate;
    if (shouldShowInfobox) showInfobox(videoElement, rate);
}

// mimic vlc keyboard shortcuts
function addKeyListener() {
    window.addEventListener('keydown', (event) => {
        let videoElement, modification = 0;
        switch (event.key) {
            case keyReduceSpeed:
                modification = -1;
                break;
            case keyIncreaseSpeed:
                modification = 1;
                break;
            case keyResetSpeed:
                videoElement = document.getElementsByTagName('video')[0];
                setPlaybackRate(videoElement, 1, showValuesOnVideo);
                return;
            default:
                return;
        }
        videoElement = document.getElementsByTagName('video')[0];
        if (!videoElement) return;
        const currentPlaybackRate = videoElement.playbackRate;
        const speedStep = getVal('speedStep');
        const newPlaybackRate = parseFloat((currentPlaybackRate + (speedStep * modification)).toFixed(3));
        // console.log(`Raising "playbackRate" from ${currentPlaybackRate} to ${newPlaybackRate}`);
        setPlaybackRate(videoElement, newPlaybackRate, showValuesOnVideo);
    });
}

function onReady() { addKeyListener(); }

function main() {
    init();
    GMsetup();
    if (document.readyState !== 'loading') {
        onReady(); // Or setTimeout(onReady, 0); if you want it consistently async
    } else {
        document.addEventListener('DOMContentLoaded', onReady);
    }
}

main();
