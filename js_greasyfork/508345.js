// ==UserScript==
// @name         Jason's YouTube Music Improvements
// @namespace    http://tampermonkey.net/
// @version      2024-08-24
// @description  Current Features: Always display control for playback rate, adjust volume slider range & increment, display volume percentage
// @author       Jason
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508345/Jason%27s%20YouTube%20Music%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/508345/Jason%27s%20YouTube%20Music%20Improvements.meta.js
// ==/UserScript==

/* CONFIG ----------------------------------------------------------------------------------------------------------------------------------------------------------- */

const displayPlaybackRateControl = true; // Always display the control for playback rate (only visible for podcasts if set to false)
const maxVolume = 20; // Maximum volume range of the volume slider
const volumeSliderIncrement = 1 // Increment of the volume slider
const displayVolumePercentage = true; // Toggles the volume percentage text next to the slider

/* HELPER FUNCTIONS ------------------------------------------------------------------------------------------------------------------------------------------------- */

const getElementByTagName = (element, tagName) => { // Get the first HTML element of a given tag name under a specified element
    const elements = element.getElementsByTagName(tagName);

    if (elements.length > 0) {
        return elements[0];
    }

    return undefined;
}

const setVolumeRange = (volumeSliderEle) => { // Set the max volume range of a volume slider
    volumeSliderEle.max = Math.min(maxVolume, 100);
    volumeSliderEle.step = Math.min(volumeSliderIncrement, 100);
}

const renderVolumePercentage = (volumeSliderEle) => { // Displays the volume perecntage next to the volume slider
    volumeSliderEle.style.width = "150px";

    const percentageElement = document.createElement("span");
    percentageElement.className = "volume-percentage-text";
    percentageElement.appendChild(document.createTextNode(volumeSliderEle.value));

    const volumeChangeHandler = (e) => {
        const percentageTexts = document.getElementsByClassName("volume-percentage-text");
        for (const percentageText of percentageTexts) {
            if (percentageText.childNodes.length > 0) {
                percentageText.childNodes[0].nodeValue = e.target.value;
            }
        }
    }
    volumeSliderEle.addEventListener("change", volumeChangeHandler);

    volumeSliderEle.appendChild(percentageElement);
}

/* DRIVER CODE ------------------------------------------------------------------------------------------------------------------------------------------------------ */

const playbackRateElement = getElementByTagName(document, "ytmusic-playback-rate-renderer");
if (displayPlaybackRateControl && playbackRateElement) {
    playbackRateElement.hidden = false
}

const volumeSlider = document.getElementById("volume-slider");
const expandingVolumeSlider = document.getElementById("expand-volume-slider");

if (volumeSlider && expandingVolumeSlider) {
    setVolumeRange(volumeSlider);
    setVolumeRange(expandingVolumeSlider);
}

if (displayVolumePercentage) {
    const volumeTextStyles = document.createElement("style");
    volumeTextStyles.appendChild(document.createTextNode(`
        .volume-percentage-text {
            display: inline-block;
            width: 50px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }

        .volume-percentage-text::after {
            content: "%";
        }
    `));
    document.head.appendChild(volumeTextStyles);

    renderVolumePercentage(volumeSlider);
    renderVolumePercentage(expandingVolumeSlider);
}