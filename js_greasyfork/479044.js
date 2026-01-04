// ==UserScript==
// @name         UoM Blackboard: Video keyboard shortcuts
// @namespace    http://tampermonkey.net/
// @version      20240201.01.01
// @description  An optional accompanying script for https://github.com/adil192/BlackboardTheme, which adds keyboard shortcuts for video playback on Blackboard.
// @author       adil192
// @match        https://video.manchester.ac.uk/embedded/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manchester.ac.uk
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/479044/UoM%20Blackboard%3A%20Video%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/479044/UoM%20Blackboard%3A%20Video%20keyboard%20shortcuts.meta.js
// ==/UserScript==

// @ts-check

/**
 * The video element.
 * @type {HTMLVideoElement | null}
 */
let videoElem;
/**
 * The div#video element, which contains `videoElem`.
 * @type {HTMLDivElement | null}
 */
let videoDiv;
/**
 * The captions options, which are usually "Off" and "English".
 * @type {HTMLLIElement[]}
 */
let captionsOptions = [];

/**
 * Whether `findElements()` has been run successfully.
 * @type {boolean}
 */
let foundElements = false;

/**
 * Finds the html elements.
 * @returns {Promise} Resolves when the elements are found.
 */
async function findElements() {
    if (foundElements) return true;

    let attemptsRemaining = 10;
    while (!foundElements && attemptsRemaining > 0) {
        attemptsRemaining--;

        if (!videoElem) videoElem = document.querySelector("video");
        if (!videoDiv) videoDiv = document.querySelector("div#video");
    
        if (!captionsOptions.length) {
            let captionsButton = document.querySelector(".vjs-captions-button");
            if (captionsButton) {
                captionsOptions = Array.from(captionsButton.querySelectorAll("li.vjs-menu-item"))
                    // Filter out the "captions settings" option
                    .filter(e => !e.classList.contains("vjs-texttrack-settings"))
                    // Convert to an array of HTMLLIElement
                    .map(e => /** @type {HTMLLIElement} */ (e));
            }
            if (captionsOptions.length < 2 && attemptsRemaining > 0) {
                console.log("findElements: captionsOptions.length < 2:", { captionsOptions });
                captionsOptions = [];
            }
        }

        foundElements = !!videoElem && !!videoDiv && !!captionsOptions.length;
    }

    onFoundElements();
}

/**
 * Called when `findElements()` finds the elements.
 * Inserts a button into the control bar to open the video in a new tab.
 * @returns {void}
 */
function onFoundElements() {
    if (!foundElements) {
        console.error("onFoundElements: called before elements were found.");
        return;
    }
    console.log("onFoundElements: found elements:", { videoElem, videoDiv, captionsOptions });

    // since the other elements have been found, it's safe to assume that all the other elements exist

    /** @type {HTMLDivElement | null} */
    const captionsButton = document.querySelector(".vjs-captions-button");
    if (!captionsButton) return;
    const controlBar = captionsButton.parentElement;
    if (!controlBar) return;

    const newTabButton = document.createElement("button");
    newTabButton.className = "vjs-new-tab-control vjs-control vjs-button";
    newTabButton.type = "button";
    newTabButton.title = "Open in new tab";
    newTabButton.onclick = () => {
        // open this iframe's url in a new tab
        window.open(window.location.href, "_blank");
    };

    const newTabButtonSpan = document.createElement("span");
    newTabButtonSpan.className = "vjs-control-text";
    newTabButtonSpan.innerText = "Open in new tab";
    newTabButton.appendChild(newTabButtonSpan);

    // insert the button before the captions button
    controlBar.insertBefore(newTabButton, captionsButton);
}

/**
 * @param {KeyboardEvent} e 
 */
function handleKeydown(e) {
    console.log("handleKeydown", e.key, { e });

    if (!foundElements) {
        console.log("handleKeydown: Some elements not found:", { videoElem, videoDiv, captionsOptions });
        return;
    }
    if (!videoElem || !videoDiv) { // This should never happen
        console.log("Unexpected error: videoElem or videoDiv is null.")
        return;
    }

    switch (e.key) {
        case "ArrowLeft":
            videoElem.currentTime -= 10;
            break;
        case "ArrowRight":
            videoElem.currentTime += 10;
            break;
        case "ArrowUp":
            videoElem.volume = Math.min(1, videoElem.volume + 0.1);
            break;
        case "ArrowDown":
            videoElem.volume = Math.max(0, videoElem.volume - 0.1);
            break;
        case " ":
            if (videoElem.paused) {
                videoElem.play();
            } else {
                videoElem.pause();
            }
            break;
        case "f":
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoDiv.requestFullscreen();
            }
            break;
        case "c":
            if (captionsOptions.length) {
                let unselectedOption = captionsOptions.find(e => !e.classList.contains("vjs-selected"));
                if (unselectedOption) {
                    unselectedOption.click();
                } else {
                    console.log("handleKeydown: No unselected captions option found:", { captionsOptions });
                    captionsOptions[0].click();
                }
            }
            break;
        default:
            // unknown key, return early
            return;
    }

    e.preventDefault();
    e.stopPropagation();
}

(function () {
    'use strict';

    console.log("UoM Blackboard: Video keyboard shortcuts");
    findElements();
    document.addEventListener("keydown", handleKeydown);
})();
