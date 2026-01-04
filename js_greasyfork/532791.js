// ==UserScript==
// @name         Jupiter's Tools for YouTube
// @namespace    Violentmonkey Scripts
// @license      CC BY-SA
// @version      1.0.2
// @description  Speed control, precise aspect ratio control, nice 'n' accurate looper, volume booster, and more.
// @description  2025-04-17 7:00 PM
// @author       Jupiter Liar
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532791/Jupiter%27s%20Tools%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/532791/Jupiter%27s%20Tools%20for%20YouTube.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let logging = false;

    function log(...args) {
        if (logging) {
            console.log(...args);
        }
    }

    log("YouTube Video Manipulator started...");

    const head = document.head || document.getElementsByTagName("head")[0];

    let video;

    let timeLoopDebug = false;
    let compressorTipDivTesting = false;
    let extraDebugButtons = false;

    let lastChecked = 0;
    let lockRate = null; // Variable to store the locked playback rate
    let playLock = false;
    let pauseLock = false;
    let rawAspectRatio;
    let aspectRatio;
    let savedAspectRatio;
    let aspectRatioSpecified = false;
    let nativeRatio;
    let zoom = 1;
    let isZoomed = false;
    let hideOverlaysVar = false;
    let flipRotateStyle;
    let videoZoomStyle;
    let overrideObjectFitStyle;
    let frameAspectStyle;
    let frameIsRescaled = false;
    let noScaleAndTop = false;
    let zoomInput;
    let buttonRefs = {};
    let playbackRateLocked = false;
    let playbackRateForeverLocked = false;
    let speedLockCheckbox;
    let foreverLockCheckbox;
    let squareCorners = false;
    let squareCornersStyle;
    let noAspect = true;
    let customBlink;
    let startLoopingBlink;
    let resizeDefaultCheckbox;
    let resizeByDefault;
    let topRow;
    let actions;
    let chapters;
    let chapterMoving;
    let chapterPosition;
    let looping = false;
    let loopMode = "forever";
    let lastCustom;
    let lastCustomRepeated = false;
    let lastCustomReset = false;
    let tipAspectStyle;

    let container;
    let containerWidth;
    let containerHeight;
    let containerRatio;

    frameAspectStyle = document.createElement("style");
    frameAspectStyle.id = "frame-aspect-style";
    head.appendChild(frameAspectStyle);

    const innerItemAfterStyles = document.createElement("style");
    innerItemAfterStyles.id = "inner-item-after-styles";
    head.appendChild(innerItemAfterStyles);

    tipAspectStyle = document.createElement("style");
    tipAspectStyle.id = "tip-aspect-style";
    head.appendChild(tipAspectStyle);

    let overlayHiderStyle;
    let controlPanelOuter;
    let controlPanel;
    let additionalStyles = document.createElement("style");

    let videoControlsMasterHolder;
    let videoControlsShowHideMenu;
    let lockControlsOuterDiv;
    let playbackRateOuter;
    let videoSeekControlsOuterDiv;
    let cosmeticCheckboxesOuterDiv;
    let videoLoopControlsOuterDiv;
    let compressorControlsParentDiv;
    let aboutDiv;

    let chapterMoveAttempts = 0;
    let chapterMoveAttemptsMax = 15;

    // Declare an AudioContext &c.
    let audioContext = null;
    let preGain;
    let thresholdGain;
    let compressor;
    let finalGain;
    let source = null;
    let boostLockState = false;

    let establishChaptersAttempts;
    let maxEstablishChaptersAttempts;
    let establishChaptersAttemptsInterval;
    let establishChapters;
    let moveChapters;

    const generalStyles = `
      :root {
          --video-manipulator-button-active: hsl(0, 100%, 85%);
          --video-manipulator-button-just-pressed: hsl(0, 100%, 75%);
      }

      ytd-watch-metadata #top-row #actions {
          margin-left: 8px;
      }

      ytd-watch-metadata #top-row ytd-menu-renderer {
          margin-right: 1em;
      }

      #video-controls-master-holder {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 10px 24px;
      }

      .video-manipulator-outer-div [invisible] {
          opacity: 0;
      }

      .video-manipulator-outer-div, .video-manipulator-outer-div * {
          color: inherit;
          --button-outline-op: .25;
      }

      .video-manipulator-outer-div {
          font-size: 14px;
      }

      .video-manipulator-outer-div * {
          font-size: inherit;
      }

      .video-manipulator-outer-div [hidden] {
          display: none;
      }

      .video-manipulator-outer-div button, .video-manipulator-outer-div input {
          cursor: pointer;
      }

      .video-manipulator-inner-item {
          display: flex;
          flex-wrap: wrap;
          gap: .5em;
          /* margin: auto; */
          align-items: center;
          position: relative;
      }

      .video-manipulator-inner-item:after {
          content: '';
          pointer-events: none;
          position: absolute;
          width: 100%;
          height: 100%;
          padding: 4px;
          left: -4px;
          top: -4px;
          border-radius: 8px;
      }

      .video-manipulator-inner-item:hover:after {
          box-shadow: 0px 0px 0px 2px hsla(240, 100%, 50%, var(--button-outline-op));
      }

      .video-manipulator-sub-item {
          display: flex;
          flex-wrap: wrap;
          gap: .5em;
          align-items: center;
      }

      .video-manipulator-outer-div:hover button, button.video-manipulator-inner-item:hover {
          /* box-shadow: 0px 0px 0px 2px inset hsla(240, 100%, 50%, var(--button-outline-op)); */
      }

      .video-manipulator-outer-div {
          /* margin-top: 12px; */
          display: flex;
          /* margin-right: 1.5em; */
          z-index: 1;
      }

      .video-manipulator-outer-div label, .video-manipulator-outer-div input[type="checkbox"],
      .video-manipulator-outer-div .video-manipulator-divider {
          /* font-size: 1.4rem; */
      }

      #playback-rate-input {
          margin-right: .5em;
      }

      .video-manipulator-outer-div input[type="checkbox"] {
          margin: 0 .25em;
      }

      .video-manipulator-inner-item button, button.video-manipulator-inner-item {
          border-radius: 1em;
          border: unset;
          padding: 0.25em 0.75em;
      }

      .video-manipulator-inner-item button:not(:hover), button.video-manipulator-inner-item:not(:hover) {
          box-shadow: inset 0px 0px 0px 1px hsla(0, 0%, 50%, 0.065);
      }

      .video-manipulator-inner-item button:hover, button.video-manipulator-inner-item:hover {
          box-shadow: 0px 0px 0px 1px inset hsla(0, 0%, 50%, .75);
      }

      #video-display-controls #aspect-custom-input, #video-display-controls #zoom-input {
          width: 4em;
          text-align: center;
      }

      #video-display-controls span {
          /* font-size: 1.5rem; */
          margin-left: .5em;
      }

      #playback-rate-controls input[type="number"] {
          width: 4em;
          text-align: center;
          padding: 0;
          /* border-radius: 1em; */
      }

      .video-manipulator-inner-item label ~ label,
      .video-manipulator-inner-item ~ .video-manipulator-inner-item label {
          margin-left: .25em;
      }

      #playback-rate-controls label {
          padding-left: 0;
      }

      .video-manipulator-outer-div button.active {
          background-color: var(--video-manipulator-button-active);
      }

      @keyframes blink {
          0% {
              background-color: var(--video-manipulator-button-color);
          }
          50% {
              background-color: var(--video-manipulator-button-just-pressed);
          }
          100% {
              background-color: var(--video-manipulator-button-color);
          }
      }

      .video-manipulator-outer-div button.blinking {
          animation: blink 1s infinite;
      }

      .video-manipulator-outer-div button.just-pressed,
      .video-manipulator-outer-div button.active.just-pressed {
          background-color: var(--video-manipulator-button-just-pressed);
      }

      #lock-controls .lock-button .lock-span {
          filter: drop-shadow(0px 0px .4px black)
          drop-shadow(0px 0px 0px black)
          drop-shadow(0px 0px 0px black)
          drop-shadow(0px 0px 0px black)
          drop-shadow(0px 0px 0.25px black)
          drop-shadow(0px 0px 0px black);
      }

      ytd-watch-metadata #top-row {
          display: flex;
          flex-wrap: wrap;
      }

      #compressor-controls-parent-div {
          z-index: 901;
          /* position: fixed; */

          /* font-size: 16px; */

          display: flex;
          flex-direction: column;
          gap: 0 .5em;
          /* display: none; */
          width: 100%;
      }

      .compressor-control-div {
          display: flex;
          align-items: center;
      }

      .compressor-control-div label {
          width: 5.5em;
      }

      .compressor-control-div input {
          margin: 0 .5em;
          text-align: right;
          width: 3.5em;
          cursor: pointer;
      }

      .compressor-control-div .conversion-div {
          margin: 0 0.5em;
          font-size: 0.8em;
      }

      #compressor-controls-group-div,
      #compressor-control-tip-div,
      #compressor-control-tip-div-background {
          padding: 0.75em 1em;
          border-radius: 1em;
      }

      #compressor-control-tip-div {
          background: none;
          border: 3px solid transparent;
      }

      #compressor-controls-group-div,
      #compressor-control-tip-div-background {
          background: var(--yt-spec-base-background);
          border: 3px solid var(--video-manipulator-button-color, gray);
      }

      #compressor-control-tip-div-background {
            position: absolute;
      }

      #compressor-control-tip-div {
          max-width: 21.5em;
          position: absolute;
      }

      #compressor-control-tip-parent {

      }

      #compressor-controls-group-div {
          width: fit-content;
      }

      #compressor-simple-controls-div {
          display: flex;
          gap: .25em;
      }

      #compressor-simple-controls-div #simpleBoost-control-div {
          /* margin-right: 8px; */
      }

      #compressor-advanced-controls-div {
          position: absolute;
      }

      #compressor-advanced-controls-container-div {

      }

      #compressor-controls-group-div, #compressor-control-tip-parent {
          margin-top: 0.25em;
      }

      .empty-spanner {
          width: 100%;
          height: 0;
      }

      .empty-spanner.line {
          margin: 10px 0;
          border-bottom: 1px solid var(--yt-spec-10-percent-layer);
      }

      #compressor-controls-parent-div:not(.active) > *:not(#compressor-simple-controls-div),
      #compressor-controls-parent-div:not(.active) #compressor-simple-controls-div > *:not(#compressor-boost-button),
      #compressor-advanced-controls-container-div:not(.active) {
          display: none;
      }

      #show-full-compressor-controls .down-expand-arrow {
          transition: scale 0.5s;
      }

      #show-full-compressor-controls.active .down-expand-arrow {
          scale: 1 -1;
      }

      #compressor-reset-button {
          position: absolute;
          bottom: 1.25em;
          right: 1.25em;
      }

      #boost-lock-div {
          display: flex;
          align-items: center;
          gap: 0.25em;
      }

      .video-manipulator-divider {
          width: 1px;
          height: 1em;
          background: var(--yt-spec-text-primary);
      }

      #video-seek-controls input[type="number"], #video-seek-controls input[type="text"],
      #video-loop-controls input[type="number"], #video-loop-controls input[type="text"] {
          width: 6.75em;
          text-align: center;
      }

      #video-loop-controls-outer-div {
          /* z-index: 9012; */
          z-index: 2;
      }

      #video-seek-controls .video-manipulator-divider,
      #video-loop-controls .video-manipulator-divider,
      #video-display-controls .video-manipulator-divider {
          margin: 0 .25em;
      }

      #video-display-controls .video-manipulator-divider {

      }

      .video-manipulator-sub-item span {
          /* font-size: 1.4em; */
      }

      #video-loop-controls #loop-times-input, #video-loop-controls #measure-rate-input {
          width: 3em;
          margin: 0 .25em;
      }

      .video-manipulator-inner-item .radio-div {
          display: flex;
          align-items: center;
      }

      .video-manipulator-inner-item .radio-div input[type="radio"] {
          margin-top: 0;
      }

      #looping-buttons-outer-div {
          flex-direction: column;
          position: relative;
      }

      #loop-error-holder-outer {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 0;
          left: 0;
          pointer-events: none;
          /* font-size: 1.4em; */
          transition: opacity 0.5s;
          z-index: 9020;
      }

      #loop-error-holder-inner {
          margin-top: 0.5em;
          position: absolute;
          width: fit-content;
          display: block;
      }

      #loop-error-pre-span {
          background: var(--yt-spec-base-background);
          border: 3px solid var(--video-manipulator-button-color, gray);
          position: absolute;
          padding: 0.25em .5em;
          border-radius: 1em;
          z-index: 1;
          top: -2px;
          left: -2px;
      }

      #loop-error-span {
          /* border: 3px solid transparent; */
          position: relative;
          display: inline;
          top: .25em;
          left: .5em;
          border-radius: 1em;
          z-index: 1;
      }

      #video-controls-show-hide-menu {
          margin-top: 12px;
      }

      #video-controls-show-hide-menu.video-manipulator-outer-div button.inactive:not(.just-pressed) {
          filter: contrast(0);
          box-shadow: inset 0px 0px 0px 1px hsla(0, 0%, 50%, .5);
      }

      #video-controls-show-hide-menu-inner.video-manipulator-inner-item button {
          border-radius: 0.75em;
          border-radius: 0em;
          font-size: .95em;
          padding: 0.2em 1.5em;
          /* border: 1px solid hsla(0, 0%, 0%, .20); */
      }

      #video-controls-show-hide-menu-inner.video-manipulator-inner-item {
          gap: 0.25em;
      }

      #linktree-button {
          all: unset;
          background: #41df5d;
          height: 24px;
          width: 24px;
          border-radius: 20%;
          cursor: pointer;
      }

      #linktree-button svg {
          aspect-ratio: 1;
          padding: 15%;
      }

      #jl-about-div {
          font-size: 14px;
          display: flex;
          align-items: center;
      }

      #jl-about-span {
          margin-right: .5em;
      }

      #jl-about-span a {
          text-decoration: none;
          color: green;
          font-weight: bold;
          letter-spacing: .25px;
      }

      #compressor-control-tip-paragraph {
          display: inline;
      }

      #video-controls-manual {
          font-size: 14px;
      }

      #video-controls-manual h2 {

      }

      #video-controls-manual p {
          margin: 0.5em 1.5em;
      }
      `;

    // Default sections to hide, global variable
    let sectionsToHide = [
        "video-seek-controls-outer-div",
        "video-loop-controls-outer-div",
        "cosmetic-checkboxes-outer-div",
        "compressor-controls-parent-div",
        "video-controls-manual",
        "jl-about-div"
    ];

    // Global stylesheet constant
    let sectionsToHideStyle;

    // Load the saved sections from localStorage
    function loadSectionsState() {
        const storedState = localStorage.getItem("videoSectionsState");
        if (storedState) {
            sectionsToHide = JSON.parse(storedState);
        }
    }

    // Save the sections state to localStorage
    function saveSectionsState() {
        localStorage.setItem("videoSectionsState", JSON.stringify(sectionsToHide));
    }

    // Build the stylesheet based on sectionsToHide
    function buildSectionHiderStylesheet() {
        // Directly use sectionsToHide to create the CSS rules
        const hiddenSections = sectionsToHide
            .map((id) => `#${id}`) // Format the IDs as CSS selectors
            .join(", ");

        // Apply the styles to hide those sections
        sectionsToHideStyle.textContent = `${hiddenSections} { display: none; }`;
    }

    loadSectionsState();

    function createDivider() {
        const divider = document.createElement("div");
        divider.classList.add("video-manipulator-divider");
        return divider;
    }

    function createVideoControlsMasterHolder() {
        videoControlsMasterHolder = document.createElement("div");
        videoControlsMasterHolder.id = "video-controls-master-holder";
        topRow.appendChild(videoControlsMasterHolder);
    }

    function insertAboutDiv() {
        aboutDiv = document.createElement("div");
        aboutDiv.id = "jl-about-div";
        aboutDiv.classList.add("video-manipulator-outer-div");

        const aboutText =
            "This script was created by Jupiter Liar, and is licensed CC-BY-SA. " + "More projects can be found at my ";

        const linkTreeLink = document.createElement("a");
        linkTreeLink.href = "https://linktr.ee/jupiterliar";
        linkTreeLink.textContent = "Linktree";

        const aboutSpan = document.createElement("span");
        aboutSpan.id = "jl-about-span";
        // aboutSpan.textContent = aboutText;

        const aboutTextNode = document.createTextNode(aboutText);
        const periodTextNode = document.createTextNode(".");

        const linktreeButton = document.createElement("button");
        linktreeButton.id = "linktree-button";
        linktreeButton.innerHTML = `
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           viewBox="0 0 80 97.7" style="enable-background:new 0 0 80 97.7;" xml:space="preserve">
     <path d="M0.2,33.1h24.2L7.1,16.7l9.5-9.6L33,23.8V0h14.2v23.8L63.6,7.1l9.5,9.6L55.8,33H80v13.5H55.7l17.3,16.7l-9.5,9.4L40,49.1
        L16.5,72.7L7,63.2l17.3-16.7H0V33.1H0.2z M33.1,65.8h14.2v32H33.1V65.8z">
     </path>
    </svg>
      `;

        linktreeButton.addEventListener("click", () => {
            window.open("https://linktr.ee/jupiterliar", "_blank");
        });

        aboutSpan.appendChild(aboutTextNode);
        aboutSpan.appendChild(linkTreeLink);
        aboutSpan.appendChild(periodTextNode);

        aboutDiv.appendChild(aboutSpan);
        aboutDiv.appendChild(linktreeButton);

        videoControlsMasterHolder.appendChild(aboutDiv);
    }

    function insertVideoControlsShowHideMenu() {
        // Create the video controls show/hide menu
        videoControlsShowHideMenu = document.createElement("div");
        videoControlsShowHideMenu.id = "video-controls-show-hide-menu";
        videoControlsShowHideMenu.classList.add("video-manipulator-outer-div");

        // Append the menu to the body or another container
        topRow.appendChild(videoControlsShowHideMenu);
    }

    // Function to populate the Show/Hide menu
    function populateVideoControlsShowHideMenu() {
        const videoControlsShowHideMenuInner = document.createElement("div");
        videoControlsShowHideMenuInner.id = "video-controls-show-hide-menu-inner";
        videoControlsShowHideMenuInner.classList.add("video-manipulator-inner-item");

        const controlTexts = [
            "Speed Control",
            "Play/Pause Lock",
            "Aspect, Zoom, Flip, & Frame",
            "Jump to Time / Get Current Time",
            "Nice 'n' Accurate Looper",
            "Corners, Overlays, & Chapters",
            "Volume Boost",
            "Manual",
            "About"
        ];

        let dividerNumber = 0;

        // Create buttons for each section
        const sectionIds = [
            "playback-rate-controls-outer",
            "lock-controls-outer",
            "video-display-controls-outer",
            "video-seek-controls-outer-div",
            "video-loop-controls-outer-div",
            "cosmetic-checkboxes-outer-div",
            "compressor-controls-parent-div",
            "video-controls-manual",
            "jl-about-div"
        ];

        sectionIds.forEach((sectionId, index) => {
            const button = document.createElement("button");
            button.textContent = controlTexts[index];

            button.id = sectionId + "-hider-button";
            buttonRefs[button.id] = button;

            // Check if the section is hidden and mark the button as inactive
            if (sectionsToHide.includes(sectionId)) {
                button.classList.add("inactive");
            }

            // Add event listener to toggle visibility of the corresponding section
            button.addEventListener("click", () => {
                if (sectionsToHide.includes(sectionId)) {
                    sectionsToHide = sectionsToHide.filter((id) => id !== sectionId); // Remove from hide list
                    button.classList.remove("inactive"); // Remove inactive class
                } else {
                    sectionsToHide.push(sectionId); // Add to hide list
                    button.classList.add("inactive"); // Add inactive class
                }

                saveSectionsState(); // Save the updated state to localStorage
                buildSectionHiderStylesheet(); // Update the stylesheet
            });

            // Append the button to the menu
            videoControlsShowHideMenuInner.appendChild(button);

            // Divider for visual separation (every 4th button)
            const divider = createDivider();
            dividerNumber += 1;
            divider.id = "divider-number-" + dividerNumber;
            videoControlsShowHideMenuInner.appendChild(divider);
        });

        // Append the final divider style to hide the last divider if needed
        const hideFinalDividerStyle = document.createElement("style");
        hideFinalDividerStyle.textContent = `
        #divider-number-${dividerNumber} {
            display: none;
        }
    `;
        videoControlsShowHideMenuInner.appendChild(hideFinalDividerStyle);
        videoControlsShowHideMenu.appendChild(videoControlsShowHideMenuInner);
    }

    // Default values for the compressor settings, including preGain and finalGain
    const compressorValuesDefault = {
        threshold: 0,
        knee: 3,
        ratio: 20,
        attack: 0, // Fast attack
        release: 0.25,
        preGain: 1, // Default preGain
        finalGain: 1 // Default finalGain
    };

    function findVideo() {
        video = document.querySelector("video");
    }

    let gnrInProgress = false;
    let gnrInQ = false;

    function getNativeRatio() {
        if (gnrInProgress) {
            log("gnrInProgress: " + gnrInProgress);
            gnrInQ = true;
            return;
        } else {
            gnrInProgress = true;
            setTimeout(() => {
                gnrInProgress = false;
            }, 250);
        }
        log("Getting native ratio...");
        findVideo();
        if (!video) {
            setTimeout(() => {
                getNativeRatio();
            }, 1000);
            return;
        }
        try {
            nativeRatio = parseFloat(video.videoWidth / video.videoHeight);
            log("nativeRatio: " + nativeRatio);
        } catch {
            setTimeout(() => {
                getNativeRatio();
            }, 1000);
            return;
        }

        if (gnrInQ) {
            gnrInQ = false;
            setTimeout(() => {
                // gnrInProgress = false;
                getNativeRatio();
            }, 250);
        }
    }

    function findContainerRatio() {
        container = video.closest("#player, #full-bleed-container");
        log("Closest element was:", container);

        containerWidth = container.offsetWidth;
        containerHeight = container.offsetHeight;
        containerRatio = containerWidth / container.offsetHeight;
        // log('Container ratio:', containerRatio);
        log(
            "Container width: " +
                containerWidth +
                "\nContainer height: " +
                containerHeight +
                "\nContainer ratio: " +
                containerRatio
        );
    }

    function parseAspectRatio() {
        log("Parsing aspect ratio:", rawAspectRatio);
        if (!savedAspectRatio) {
            getNativeRatio();
            savedAspectRatio = nativeRatio;
        }
        if (rawAspectRatio === undefined || rawAspectRatio === null) {
            log("Nothing to parse.");
            aspectRatio = savedAspectRatio;
            return;
        }
        if (typeof rawAspectRatio === "string") {
            aspectRatio = rawAspectRatio.includes("/")
                ? parseFloat(rawAspectRatio.split("/")[0]) / parseFloat(rawAspectRatio.split("/")[1])
                : parseFloat(rawAspectRatio);
            log("New aspect ratio:", aspectRatio);
        } else {
            aspectRatio = parseFloat(rawAspectRatio);
        }

        if (isNaN(aspectRatio) || aspectRatio === null || aspectRatio === undefined) {
            console.error("Invalid aspect ratio:", aspectRatio);
            aspectRatio = savedAspectRatio;
            log("Aspect ratio reverted to:", aspectRatio);
            return true;
        }

        log("Parsed aspect ratio: " + aspectRatio);
        savedAspectRatio = aspectRatio;
    }

    // Load the compressor values from localStorage or use the defaults
    let compressorValues = {
        ...compressorValuesDefault
    };

    function loadCompressorValues() {
        // Check if values exist in localStorage
        const savedValues = JSON.parse(localStorage.getItem("compressorValues"));
        log("Saved compressor values: " + savedValues);
        if (savedValues) {
            // Merge saved values with defaults to keep missing ones defaulted
            compressorValues = {
                ...compressorValuesDefault,
                ...savedValues
            };
        } else {
            // If no saved values, use the defaults
            compressorValues = {
                ...compressorValuesDefault
            };
        }
    }

    loadCompressorValues();

    function saveCompressorValues() {
        try {
            // Get the previously saved values from localStorage, or initialize an empty object
            const savedValues = JSON.parse(localStorage.getItem("compressorValues")) || {};

            // Create an object to hold the updated values
            const updatedValues = { ...compressorValues };

            // Compare current values with saved ones and store only the updated ones
            for (const key in compressorValues) {
                if (compressorValues[key] !== savedValues[key]) {
                    updatedValues[key] = compressorValues[key];
                } else {
                    // If no change, ensure the key is still saved
                    if (!savedValues.hasOwnProperty(key)) {
                        updatedValues[key] = compressorValues[key];
                    }
                }
            }

            // If any values were updated, save them to localStorage
            if (Object.keys(updatedValues).length > 0) {
                localStorage.setItem("compressorValues", JSON.stringify(updatedValues));
            }
        } catch (error) {
            console.error("Error saving compressor values to localStorage", error);
        }
    }

    // Example to update compressor values and save
    function updateCompressorSetting(key, value) {
        log("Updating compressor setting: " + key + ", " + value);
        if (compressorValues.hasOwnProperty(key)) {
            log("Saving setting...");
            compressorValues[key] = value;
            saveCompressorValues(); // Save the updated value
        }
    }

    function deleteSavedCompressorValues() {
        try {
            // Remove the compressorValues from localStorage
            localStorage.removeItem("compressorValues");
            log("Compressor values deleted from localStorage.");
        } catch (error) {
            console.error("Error deleting compressor values from localStorage", error);
        }
    }

    // Placeholder function to modify the compressor values
    function modifyCompression(property, value) {
        // log(`Modifying ${property} to ${value}`);
        // Actual logic for modifying the compressor settings goes here
    }

    // Function to create a compressor control
    function createCompressorControl(config, reset) {
        let input;
        let conversionSpan;
        const conversionType = config.conversion;

        // Handle the input population and modification
        let value = compressorValues[config.property ? config.property : config.id] || 0; // Fetch current value

        //     // Apply conversions and modifiers when populating
        //     if (config.conversion) {
        //         value = convertValue(value, config.conversion);
        //     }

        //     if (config.calculationMod) {
        //         value = applyCalculationMod(value, config.calculationMod);
        //     }

        if (config.divideBy1000) {
            value *= 1000; // Multiply by 1000 when populating
        }

        // Function to handle the conversions (dB -> times or dB -> percent)
        function convertValue(value, conversionType) {
            // log('Converting', (config.property ? config.property : config.id),
            // 'with value', value, 'and type', conversionType + '.');
            let calcVal = value;
            const scaleFactor = 1;

            if (conversionType === "times") {
                calcVal = Math.pow(2, value / 6); // dB to multiplier (times)
            } else if (conversionType === "percent") {
                calcVal = Math.pow(2, value / 6) * 100; // dB to percentage representation
            }

            log(config);

            if (config.calculationMod || config.hasOwnProperty("calculationMod")) {
                log("A calculation modification is present.");
                calcVal = applyCalculationMod(calcVal, config.calculationMod); // Apply modifier
            }

            return calcVal; // No conversion if not specified
        }

        function convertToDB(value) {
            return 6 * Math.log2(value);
            // return value; // No conversion if not specified
        }

        // Function to handle calculation modifiers dynamically
        function applyCalculationMod(value, mod) {
            log("Modifying calculations with inputs", value, "and", mod + ".");
            // Assume calculationMod contains simple expressions like '- 100' or any other formula
            const [operator, num] = mod.split(" ");
            if (operator === "-" && num) {
                return value - parseFloat(num);
            }
            log("Modified value equals", value + ".");
            return value; // If no valid modifier is found, return value unchanged
        }

        function getConvertedValue(newValue) {
            if (config.conversion) {
                newValue = convertValue(newValue, config.conversion); // Convert value based on config
            }

            if (config.divideBy1000) {
                newValue = newValue / 1000; // Divide by 1000 when sending back the value
                // modifyCompression((config.property ? config.property : config.id), newValue);
                // // Update the compressor with the modified value
            } else {
                // modifyCompression((config.property ? config.property : config.id), value);
            }

            return newValue;
        }

        function adjustStepSize() {
            log("Handling varying step sizes...");
            const value = parseFloat(input.value);
            let step = config.stepSize;
            let nextValue = value;
            log("Step equals " + step + ".");
            for (let range of JSON.parse(config.stepRanges)) {
                log("Step ranges parsed as" + JSON.stringify(JSON.parse(config.stepRanges)) + ".");
                if (value >= range.range[0] && value < range.range[1]) {
                    step = range.step;
                    log("Step should be " + step + ".");
                    // Adjust the value based on the current step
                    nextValue = Math.round(value / step) * step; // Round to the nearest step increment
                    break;
                }
            }
            // Set the next value programmatically
            // input.value = nextValue;

            input.step = step; // Dynamically adjust the step size for the input
        }

        if (!reset) {
            const controlDiv = document.createElement("div");
            controlDiv.classList.add("compressor-control-div");
            controlDiv.id = `${config.id}-control-div`;

            const label = document.createElement("label");
            label.setAttribute("for", `${config.id}-input`);
            label.textContent = config.label;

            input = document.createElement("input");
            input.type = "number";
            input.id = `${config.id}-input`;
            // input.value = compressorValues[config.id] || 0;
            input.min = config.minValue || 0;
            input.max = config.maxValue || 100;
            input.step = config.stepSize;

            const postLabel = document.createElement("span");
            postLabel.textContent = ` ${config.postLabel}`;

            const conversionDiv = document.createElement("div");
            conversionDiv.classList.add("conversion-div");

            const secondPostLabel = document.createElement("span");
            secondPostLabel.textContent = ` ${config.secondPostLabel || ""}`;

            const openParenthesisSpan = document.createElement("span");
            openParenthesisSpan.textContent = "(";

            conversionSpan = document.createElement("span");
            conversionSpan.classList.add("conversion-span");

            // Populate the input box with the modified value
            if (conversionType === "times") {
                input.value = convertToDB(value);
            } else {
                input.value = value;
            }

            // Handle variable step size logic for ratio, attack, release
            if (config.stepSize === "variable") {
                log("Setting up varying step sizes...");
                adjustStepSize();
                input.addEventListener("input", function () {
                    adjustStepSize();
                });
            }

            // Handle the input change event dynamically
            input.addEventListener("input", function () {
                let newValue = parseFloat(input.value);
                log("New value: " + newValue);
                const minLimit = config.minLim;

                if (minLimit && newValue < minLimit) {
                    newValue = minLimit;
                    input.value = minLimit;
                }

                let retainValue = newValue;

                //                 if (config.divideBy1000) {
                //                     retainValue = retainValue / 1000; // Multiply by 1000 when populating
                //                 }

                conversionSpan.textContent = getConvertedValue(newValue).toFixed(2);

                if (config.link) {
                    const linkedElement = document.getElementById(`${config.link}-input`);
                    linkedElement.value = newValue;
                    const linkedConversion = document.querySelector(
                        `#${config.link}-control-div .conversion-div .conversion-span`
                    );
                    if (linkedConversion) {
                        log("Linked conversion found.");
                        linkedConversion.textContent = getConvertedValue(newValue).toFixed(2);
                    } else {
                        log("No linked conversion found.");
                    }
                }

                let passValue = getConvertedValue(newValue);

                if (config.id === "threshold") {
                    log("Converting threshold...");
                    passValue = Math.pow(2, newValue / 6);
                }

                log("Pass value: " + passValue);

                changeCompressorValue(config.property ? config.property : config.id, passValue, newValue);
                // changeCompressorValue((config.property ? config.property : config.id), passValue, newValue);

                setTimeout(function () {
                    changeCompressorValue(config.property ? config.property : config.id, passValue, newValue);
                    // changeCompressorValue((config.property ? config.property : config.id), passValue, newValue);
                    updateCompressorSetting(config.id, config.saveRaw ? retainValue : passValue);
                }, 0);
            });

            // Tip logic for showing the relevant tip on hover
            controlDiv.addEventListener("mouseover", function () {
                // const tipDiv = document.getElementById("compressor-control-tip-div");
                compressorControlTipParagraph.innerHTML = config.tip;

                compressorControlTipDiv.style.display = "block";
                compressorControlTipDivBG.style.display = "block";

                // Get the bounding rectangle of the paragraph
                const paragraphRect = compressorControlTipParagraph.getBoundingClientRect();

                // Set the width and height of the div background to match the paragraph size
                compressorControlTipDivBG.style.width = `${paragraphRect.width}px`;
                compressorControlTipDivBG.style.height = `${paragraphRect.height}px`;

                log(
                    `Updated size of background div: Width = ${paragraphRect.width}px, ` +
                        `Height = ${paragraphRect.height}px`
                );
            });

            controlDiv.addEventListener("mouseout", function () {
                // const tipDiv = document.getElementById("compressor-control-tip-div");
                if (compressorTipDivTesting) {
                    return;
                }
                compressorControlTipParagraph.innerHTML = "";
                compressorControlTipDiv.style.display = "none";
                compressorControlTipDivBG.style.display = "none";
            });

            if (config.label) {
                controlDiv.appendChild(label);
            }
            controlDiv.appendChild(input);
            controlDiv.appendChild(postLabel);
            if (config.conversion) {
                conversionDiv.appendChild(openParenthesisSpan);
                conversionDiv.appendChild(conversionSpan);
                conversionDiv.appendChild(secondPostLabel);
                controlDiv.appendChild(conversionDiv);
                if (conversionType === "times") {
                    conversionSpan.textContent = value.toFixed(2);
                } else {
                    conversionSpan.textContent = getConvertedValue(value).toFixed(2);
                }
            }
            return controlDiv;
        } else {
            const controlDiv = document.getElementById(`${config.id}-control-div`);
            input = document.getElementById(`${config.id}-input`);

            // Populate the input box with the modified value
            if (conversionType === "times") {
                input.value = convertToDB(value);
            } else {
                input.value = value;
            }

            conversionSpan = controlDiv.querySelector(".conversion-span");
            if (conversionSpan) {
                if (conversionType === "times") {
                    conversionSpan.textContent = value.toFixed(2);
                } else {
                    conversionSpan.textContent = getConvertedValue(value).toFixed(2);
                }
            }

            // Handle variable step size logic for ratio, attack, release
            if (config.stepSize === "variable") {
                log("Setting up varying step sizes...");
                adjustStepSize();
                input.addEventListener("input", function () {
                    adjustStepSize();
                });
            }

            deleteSavedCompressorValues();
        }
    }

    let compressorControlTipDiv;
    let compressorControlTipParagraph;
    let compressorControlTipDivBG;

    // Function to insert all the compressor controls
    function insertCompressorControls() {
        // const emptySpanner = insertEmptySpanner();
        // videoControlsMasterHolder.appendChild(emptySpanner);

        compressorControlsParentDiv = document.createElement("div");
        compressorControlsParentDiv.id = "compressor-controls-parent-div";
        compressorControlsParentDiv.classList.add("video-manipulator-outer-div");

        const compressorSimpleControlsDiv = document.createElement("div");
        compressorSimpleControlsDiv.id = "compressor-simple-controls-div";
        compressorSimpleControlsDiv.classList.add("video-manipulator-inner-item");

        const compressorBoostButton = document.createElement("button");
        compressorBoostButton.id = "compressor-boost-button";
        compressorBoostButton.classList.add("video-manipulator-sub-item");
        compressorBoostButton.textContent = "Boost Volume";
        buttonRefs[compressorBoostButton.id] = compressorBoostButton;

        compressorSimpleControlsDiv.appendChild(compressorBoostButton);

        const simpleControlsConfig = [
            {
                id: "simpleBoost",
                property: "preGain",
                link: "preGain",
                postLabel: "dB",
                conversion: "times",
                secondPostLabel: "x original volume)",
                stepSize: 0.5,
                minValue: -96,
                maxValue: 96,
                tip: `Measured in dB. A conversion is offered for those who can't think in dB.`
            }
        ];

        // Loop through each control configuration and add it to the parent div
        simpleControlsConfig.forEach((config) => {
            const controlDiv = createCompressorControl(config);
            compressorSimpleControlsDiv.appendChild(controlDiv);
        });

        const boostLockDiv = document.createElement("div");
        boostLockDiv.id = "boost-lock-div";

        const boostLockCheckbox = document.createElement("input");
        boostLockCheckbox.id = "boost-lock-checkbox";
        boostLockCheckbox.type = "checkbox";

        const boostLockLabel = document.createElement("label");
        boostLockLabel.textContent = "Boost all videos";
        boostLockLabel.htmlFor = "boost-lock-checkbox";

        boostLockDiv.appendChild(boostLockLabel);
        boostLockDiv.appendChild(boostLockCheckbox);

        // Retrieve the stored value from localStorage and update the checkbox state if it's set
        boostLockState = JSON.parse(localStorage.getItem("boostLockState") || "false");
        if (boostLockState) {
            boostLockCheckbox.checked = true;
        }

        // Add an event listener to save the checkbox state to localStorage when clicked
        boostLockCheckbox.addEventListener("change", function () {
            localStorage.setItem("boostLockState", boostLockCheckbox.checked);
        });

        compressorSimpleControlsDiv.appendChild(boostLockDiv);

        const showFullCompressorControlsButton = document.createElement("button");
        showFullCompressorControlsButton.id = "show-full-compressor-controls";
        showFullCompressorControlsButton.classList.add("video-manipulator-sub-item");
        buttonRefs[showFullCompressorControlsButton.id] = showFullCompressorControlsButton;

        // Create the outer span
        const spanDownArrow = document.createElement("span");
        spanDownArrow.classList.add("down-expand-arrow");
        spanDownArrow.textContent = "▼";

        // Create the text "Expert"
        const textNode = document.createTextNode("Expert");

        // Create the second span
        const spanUpArrow = document.createElement("span");
        spanUpArrow.classList.add("down-expand-arrow");
        spanUpArrow.textContent = "▼";

        // Append all the elements to the button
        showFullCompressorControlsButton.appendChild(spanDownArrow);
        showFullCompressorControlsButton.appendChild(textNode);
        showFullCompressorControlsButton.appendChild(spanUpArrow);

        compressorSimpleControlsDiv.appendChild(showFullCompressorControlsButton);

        compressorControlsParentDiv.appendChild(compressorSimpleControlsDiv);

        const compressorControlsGroupDiv = document.createElement("div");
        compressorControlsGroupDiv.id = "compressor-controls-group-div";

        compressorControlTipDiv = document.createElement("div");
        compressorControlTipDiv.id = "compressor-control-tip-div";
        compressorControlTipDiv.style.display = "none";

        compressorControlTipParagraph = document.createElement("p");
        compressorControlTipParagraph.id = "compressor-control-tip-paragraph";

        compressorControlTipDivBG = document.createElement("div");
        compressorControlTipDivBG.id = "compressor-control-tip-div-background";
        compressorControlTipDivBG.style.display = "none";

        const compressorControlTipParent = document.createElement("div");
        compressorControlTipParent.id = "compressor-control-tip-parent";

        const controlsConfig = [
            {
                id: "preGain",
                label: "Input Boost",
                link: "simpleBoost",
                postLabel: "dB",
                conversion: "times",
                secondPostLabel: "x original volume)",
                stepSize: 0.5,
                minValue: -96,
                maxValue: 96,
                tip: `Measured in dB. A conversion is offered for those who can't think in dB.`
            },
            {
                id: "threshold",
                label: "Threshold",
                postLabel: "dB",
                conversion: "percent",
                secondPostLabel: "% of max volume)",
                stepSize: 0.5,
                maxValue: 0,
                minValue: -100,
                saveRaw: true,
                tip: `Measured in dB. 0 is the ceiling — as loud as the sound can go. Lower values come below the ceiling.<br>
                If you put this too high, the compressor really won't do much. Going above the ceiling is not recommended.<br>
            A conversion is offered for those who can't think in dB.`
            },
            {
                id: "knee",
                label: "Knee",
                postLabel: "dB",
                conversion: "percent",
                secondPostLabel: "% over the threshold)",
                calculationMod: `- 100`,
                stepSize: 1,
                minValue: 0,
                maxValue: 40,
                saveRaw: true,
                tip: `Bigger values are subtler, but if it gets too big, the compressor won't compress much.<br>
            Knee comes before threshold is reached with this compressor.<br>
            A conversion is offered for those who can't think in dB.`
            },
            {
                id: "ratio",
                label: "Ratio",
                postLabel: " : 1",
                stepSize: "variable",
                stepRanges: `
                [
                    { "range": [0, 4], "step": 0.5 },
                    { "range": [4, 8], "step": 1 },
                    { "range": [8, 12], "step": 2 },
                    { "range": [12, 24], "step": 4 }
                ]
            `,
                minValue: 0,
                maxValue: 20,
                minLim: 1,
                tip: `The higher the value, the harder it compresses. A value of 1 does nothing at all. 20 is as high as it can go.`
            },
            {
                id: "attack",
                label: "Attack",
                postLabel: "ms",
                stepSize: "variable",
                stepRanges: `
                [
                    { "range": [0, 1], "step": 0.1 },
                    { "range": [1, 5], "step": 0.5 },
                    { "range": [5, 10], "step": 1 },
                    { "range": [10, 50], "step": 5 },
                    { "range": [50, 100], "step": 10 },
                    { "range": [100, 500], "step": 50 },
                    { "range": [500, 2000], "step": 100 }
                ]
            `,
                minValue: 0,
                maxValue: 1000,
                divideBy1000: true,
                tip: `The lower the value, the faster it lowers the volume. 1000 is as slow as it goes.`
            },
            {
                id: "release",
                label: "Release",
                postLabel: "ms",
                stepSize: "variable",
                stepRanges: `
                [
                    { "range": [0, 100], "step": 10 },
                    { "range": [100, 250], "step": 25 },
                    { "range": [250, 500], "step": 50 },
                    { "range": [500, 2000], "step": 100 }
                ]
            `,
                minValue: 0,
                maxValue: 1000,
                divideBy1000: true,
                tip: `Find a sweet spot. Values below 100 may sound crummy.`
            }
        ];

        // Loop through each control configuration and add it to the parent div
        controlsConfig.forEach((config) => {
            const controlDiv = createCompressorControl(config);
            compressorControlsGroupDiv.appendChild(controlDiv);
        });

        const compressorResetButton = document.createElement("button");
        compressorResetButton.id = "compressor-reset-button";
        compressorResetButton.textContent = "Reset";
        buttonRefs[compressorResetButton.id] = compressorResetButton;

        compressorControlsGroupDiv.appendChild(compressorResetButton);

        compressorResetButton.addEventListener("click", () => {
            compressorValues = {
                ...compressorValuesDefault
            };

            simpleControlsConfig.forEach((config) => {
                const controlDiv = createCompressorControl(config, true);
            });

            controlsConfig.forEach((config) => {
                const controlDiv = createCompressorControl(config, true);
            });

            setCompressorValues();
        });

        const compressorAdvancedControlsDiv = document.createElement("div");
        compressorAdvancedControlsDiv.id = "compressor-advanced-controls-div";

        const compressorAdvancedControlsContainerDiv = document.createElement("div");
        compressorAdvancedControlsContainerDiv.id = "compressor-advanced-controls-container-div";

        compressorAdvancedControlsDiv.appendChild(compressorControlsGroupDiv);
        compressorControlTipDiv.appendChild(compressorControlTipParagraph);
        compressorControlTipParent.appendChild(compressorControlTipDivBG);
        compressorControlTipParent.appendChild(compressorControlTipDiv);
        compressorAdvancedControlsDiv.appendChild(compressorControlTipParent);

        // Declare the observer
        let closeFullCompressorControlsObserver;

        // Function to connect the observer
        function connectCloseFullCompressorControlsObserver() {
            closeFullCompressorControlsObserver = (event) => {
                // Check if the click is outside of the button or the controls container
                if (
                    !showFullCompressorControlsButton.contains(event.target) &&
                    !compressorAdvancedControlsContainerDiv.contains(event.target)
                ) {
                    // Remove the 'active' class to close the controls
                    showFullCompressorControlsButton.classList.remove("active");
                    compressorAdvancedControlsContainerDiv.classList.remove("active");
                    // Disconnect the observer once it's no longer needed
                    document.removeEventListener("click", closeFullCompressorControlsObserver);
                }
            };

            // Add event listener to the document for clicks
            document.addEventListener("click", closeFullCompressorControlsObserver);
        }

        showFullCompressorControlsButton.addEventListener("click", () => {
            if (showFullCompressorControlsButton.classList.contains("active")) {
                showFullCompressorControlsButton.classList.remove("active");
                compressorAdvancedControlsContainerDiv.classList.remove("active");
            } else {
                showFullCompressorControlsButton.classList.add("active");
                compressorAdvancedControlsContainerDiv.classList.add("active");
                connectCloseFullCompressorControlsObserver();
            }
        });

        compressorBoostButton.addEventListener("click", () => {
            if (compressorBoostButton.classList.contains("active")) {
                compressorBoostButton.classList.remove("active");
                compressorControlsParentDiv.classList.remove("active");
                boostLockState = false;
                localStorage.setItem("boostLockState", boostLockState);
                boostLockCheckbox.checked = boostLockState;
                disconnectCompressor();
            } else {
                compressorBoostButton.classList.add("active");
                compressorControlsParentDiv.classList.add("active");
                initiateCompressor();
            }
            recalculateForElement(compressorSimpleControlsDiv);
        });

        if (boostLockState) {
            compressorBoostButton.classList.add("active");
            compressorControlsParentDiv.classList.add("active");
            initiateCompressor();
        }

        compressorAdvancedControlsContainerDiv.appendChild(compressorAdvancedControlsDiv);

        compressorControlsParentDiv.appendChild(compressorAdvancedControlsContainerDiv);

        // Append the controls to the body or another container element

        videoControlsMasterHolder.appendChild(compressorControlsParentDiv);
    }

    function hideOverlays() {
        log("Hiding overlays...");
        overlayHiderStyle.textContent = `
    .ytp-chrome-top-buttons, .ytp-ce-element, .ytp-paid-content-overlay, .videowall-endscreen, .ytp-suggested-action, .annotation {
      display: none  !important;
    }
    `;
        hideOverlaysVar = true;

        localStorage.setItem("hideOverlaysState", "true");
    }

    function showOverlays() {
        log("Showing overlays...");
        overlayHiderStyle.textContent = `
    .ytp-chrome-top-buttons, .ytp-ce-element, .ytp-paid-content-overlay, .videowall-endscreen, .ytp-suggested-action, .annotation {
      /* display: none  !important; */
    }
    `;
        hideOverlaysVar = false;

        localStorage.setItem("hideOverlaysState", "false");
    }

    function insertOverlayHider() {
        overlayHiderStyle = document.createElement("style");
        overlayHiderStyle.id = "overlay-hider-style";

        head.appendChild(overlayHiderStyle);

        const storedState = JSON.parse(localStorage.getItem("hideOverlaysState")) || false;

        if (storedState === true) {
            hideOverlays();
        } else {
            showOverlays();
        }
    }

    insertOverlayHider();

    // Function to create and insert stylesheets
    function insertStylesheets() {
        insertCustomStyles();

        flipRotateStyle = document.createElement("style");
        flipRotateStyle.id = "flip-rotate-style";
        head.appendChild(flipRotateStyle);

        videoZoomStyle = document.createElement("style");
        videoZoomStyle.id = "video-zoom-style";
        head.appendChild(videoZoomStyle);

        overrideObjectFitStyle = document.createElement("style");
        overrideObjectFitStyle.id = "override-object-fit-style";
        head.appendChild(overrideObjectFitStyle);

        additionalStyles.id = "video-display-controls-style";
        additionalStyles.textContent += generalStyles;
        head.appendChild(additionalStyles);

        sectionsToHideStyle = document.createElement("style");
        sectionsToHideStyle.id = "sections-to-hide-style";
        document.head.appendChild(sectionsToHideStyle);
        buildSectionHiderStylesheet();
    }

    // Function to create and insert the control panel
    function insertControlPanel() {
        log("The insertControlPanel function is running.");
        // const existingControls = document.querySelector("#video-display-controls-outer");
        // if (existingControls) {
        //     return;
        // }

        const buttons = [
            {
                id: "aspect-4-3",
                class: "aspect",
                text: "4/3",
                titleText: "Converts the aspect ratio to 4 by 3.",
                onClick: () => handleAspectRatio("4/3", "aspect-4-3")
            },
            {
                id: "aspect-16-9",
                class: "aspect",
                text: "16/9",
                titleText: "Converts the aspect ratio to 16 by 9.",
                onClick: () => handleAspectRatio("16/9", "aspect-16-9")
            },
            {
                id: "aspect-2pt35",
                class: "aspect",
                text: "2.35",
                titleText: "Converts the aspect ratio to 2.35 to 1.",
                onClick: () => handleAspectRatio("2.35", "aspect-2pt35")
            },
            {
                id: "aspect-custom",
                class: "aspect",
                text: "Custom",
                titleText:
                    "Rescale the video to the custom aspect ration in the input box. Must be pressed to apply each time.",
                onClick: () => handleCustomAspect("aspect-custom")
            },
            {
                id: "zoom",
                class: "zoom",
                text: "Zoom",
                titleText: "Zooms the video by a specified amount.",
                onClick: () => handleZoom("zoom")
            },
            {
                id: "mirror",
                class: "orientation",
                text: "Mirror",
                titleText: "Mirrors the video horizontally.",
                onClick: () => handleMirror("mirror")
            },
            {
                id: "flip",
                class: "orientation",
                text: "Flip",
                titleText: "Flips the video vertically.",
                onClick: () => handleFlip("flip")
            },
            {
                id: "rotate-180",
                class: "orientation",
                text: "180°",
                titleText: "Rotates the video 180°.",
                onClick: () => handleRotate180("rotate-180")
            },
            {
                id: "resize-frame",
                class: "frame-resize",
                text: "Resize Frame",
                titleText: "Resize the video container to match the selected aspect ratio. May still have some bugs.",
                onClick: () => handleFrameResize("resize-frame")
            },
            {
                id: "reset",
                class: "reset",
                text: "Reset",
                titleText:
                    "Resets all flips, mirrors, rotations, aspect ratios, and zooms. " +
                    "Leaves the input boxes as they are so values can be easily recalled.",
                onClick: () => handleReset("reset")
            }
        ];

        // Conditionally add debug buttons
        if (extraDebugButtons) {
            buttons.push(
                {
                    id: "scale-and-top",
                    class: "scale-and-top",
                    text: "Scale and Top",
                    titleText: "A debugging button that immediately runs the scaleAndTop function.",
                    onClick: () => scaleAndTop()
                },
                {
                    id: "scale-and-top-direct",
                    class: "scale-and-top-direct",
                    text: "Scale and Top (direct)",
                    titleText: "A debugging button that immediately runs the scaleAndTop function, direct set to true.",
                    onClick: () => scaleAndTop(true)
                },
                {
                    id: "recalculate-after-pseudo-elements",
                    class: "recalculate-after-pseudo-elements",
                    text: "Recalculate After Pseudo Elements",
                    titleText: "Recalculates size for the after pseudo elements.",
                    onClick: () => recalculateAllAfterPseudoElements()
                },
                {
                    id: "test-difference",
                    class: "test-difference",
                    text: "Test Difference",
                    titleText: "A debugging button that runs testDimensionDif.",
                    onClick: () => testDimensionDif()
                }
            );
        }

        controlPanelOuter = document.createElement("div");
        controlPanelOuter.id = "video-display-controls-outer";
        controlPanelOuter.classList.add("video-manipulator-outer-div");

        controlPanel = document.createElement("div");
        controlPanel.id = "video-display-controls";
        controlPanel.classList.add("video-manipulator-inner-item");

        buttons.forEach((button) => {
            const btn = document.createElement("button");
            btn.id = button.id;
            btn.classList.add(button.class);
            btn.textContent = button.text;
            btn.addEventListener("click", button.onClick);
            if (button.titleText) {
                btn.title = button.titleText;
            }

            log("Creating button " + btn.id + "...");

            // Save the button reference to the buttonRefs object
            buttonRefs[button.id] = btn;

            controlPanel.appendChild(btn);

            if (button.id === "aspect-custom") {
                const customContainer = document.createElement("div");
                customContainer.id = "custom-container";
                customContainer.classList.add("video-manipulator-sub-item");

                const customInput = document.createElement("input");
                customInput.type = "text";
                customInput.id = "aspect-custom-input";
                customInput.title =
                    "This value is not reset when the reset button is pressed, to make the value easy to apply again.";
                customInput.placeholder = "e.g., 4/3";

                customContainer.appendChild(btn);
                customContainer.appendChild(customInput);
                controlPanel.appendChild(customContainer);

                const divider = createDivider();
                controlPanel.appendChild(divider);

                // Add event listener to detect changes in input value
                customInput.addEventListener("input", () => {
                    // Add blinking class to button
                    buttonRefs["aspect-custom"].classList.add("blinking");

                    // Optionally, you can remove the class after a certain duration to stop blinking
                    clearTimeout(customBlink);
                    customBlink = setTimeout(() => {
                        buttonRefs["aspect-custom"].classList.remove("blinking");
                    }, 5000); // Adjust duration based on your preference
                });
            }

            if (button.id === "resize-frame") {
                const resizeAutomaticallyText = "Resize the frame automatically when each new video loads.";

                resizeDefaultCheckbox = document.createElement("input");
                resizeDefaultCheckbox.type = "checkbox";
                resizeDefaultCheckbox.id = "resize-by-default-checkbox";
                resizeDefaultCheckbox.title = resizeAutomaticallyText;

                const resizeDefaultLabel = document.createElement("label");
                resizeDefaultLabel.textContent = "Auto Resize";
                resizeDefaultLabel.htmlFor = "resize-by-default-checkbox";
                resizeDefaultLabel.title = resizeAutomaticallyText;

                const resizeContainer = document.createElement("div");
                resizeContainer.classList.add("video-manipulator-sub-item");
                resizeContainer.id = "resize-container";

                resizeContainer.appendChild(btn);
                resizeContainer.appendChild(resizeDefaultLabel);
                resizeContainer.appendChild(resizeDefaultCheckbox);

                controlPanel.appendChild(resizeContainer);

                const divider = createDivider();
                controlPanel.appendChild(divider);

                resizeByDefault = JSON.parse(localStorage.getItem("resizeByDefault")) || false;

                if (resizeByDefault) {
                    setTimeout(() => {
                        // buttonRefs["resize-frame"].classList.add("active");
                        resizeDefaultCheckbox.checked = true;
                        frameIsRescaled = true;
                        handleFrameResize("resize-frame");
                    }, 0);
                }

                // Add event listener to save checkbox state to localStorage
                resizeDefaultCheckbox.addEventListener("change", () => {
                    resizeByDefault = resizeDefaultCheckbox.checked;
                    localStorage.setItem("resizeByDefault", JSON.stringify(resizeByDefault));
                });
            }

            if (button.id === "zoom") {
                const zoomContainer = document.createElement("div");
                zoomContainer.id = "zoom-container";
                zoomContainer.classList.add("video-manipulator-sub-item");

                // Add zoom control
                zoomInput = document.createElement("input");
                zoomInput.type = "number";
                zoomInput.step = 0.01; // Increment step for numeric input
                zoomInput.value = 1; // Default value
                zoomInput.id = "zoom-input"; // Assign an ID for styling or JavaScript access
                zoomInput.title = "Click the Zoom button every time you wish to resize.";

                zoomContainer.appendChild(btn);
                zoomContainer.appendChild(zoomInput);
                controlPanel.appendChild(zoomContainer);

                const divider = createDivider();
                controlPanel.appendChild(divider);

                // Add event listener for zoomInput changes
                zoomInput.addEventListener("input", () => {
                    handleZoom("zoom"); // Call your function with the zoom value
                });
            }

            if (button.id === "rotate-180") {
                const divider = createDivider();
                controlPanel.appendChild(divider);
            }
        });

        controlPanelOuter.appendChild(controlPanel);

        log("controlPanelOuter:", controlPanelOuter);

        videoControlsMasterHolder.appendChild(controlPanelOuter);

        log("Control panel inserted.");
        // Call the function to insert custom styles before inserting the control panel
    }

    function insertEmptySpanner(line) {
        const emptySpanner = document.createElement("div");
        emptySpanner.classList.add("empty-spanner");
        if (line) {
            emptySpanner.classList.add("line");
        }
        return emptySpanner;
    }

    // Function to create and insert the playback rate control panel
    function insertPlaybackRateControls() {
        const existingControls = document.querySelector("#playback-rate-controls-outer");
        if (existingControls) {
            return;
        }

        playbackRateOuter = document.createElement("div");
        playbackRateOuter.id = "playback-rate-controls-outer";
        playbackRateOuter.classList.add("video-manipulator-outer-div");

        const playbackRateControls = document.createElement("div");
        playbackRateControls.id = "playback-rate-controls";
        playbackRateControls.classList.add("video-manipulator-inner-item");

        const label = document.createElement("label");
        label.textContent = "Speed:";

        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.05";
        input.min = "0";
        input.id = "playback-rate-input";
        input.value = "1.00"; // Default value until actual playbackRate is detected
        input.addEventListener("input", handleRateChange);
        input.addEventListener("focus", handleRateChange);

        const playLockTitleText =
            "Prevents speed from being changed, whether by YouTube, an extension, or another script.";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "lock-rate-checkbox";
        checkbox.addEventListener("change", handleLockToggle);
        checkbox.title = playLockTitleText;

        speedLockCheckbox = checkbox;

        const checkboxLabel = document.createElement("label");
        checkboxLabel.htmlFor = "lock-rate-checkbox";
        checkboxLabel.textContent = "Lock now";
        checkboxLabel.title = playLockTitleText;

        const divider = createDivider();

        const foreverLockTitleText = "Automatically sets the speed of videos when they load.";

        const foreverCheckbox = document.createElement("input");
        foreverCheckbox.type = "checkbox";
        foreverCheckbox.id = "lock-forever-checkbox";
        foreverCheckbox.title = foreverLockTitleText;
        foreverCheckbox.addEventListener("change", handleLockToggle);

        const foreverCheckboxLabel = document.createElement("label");
        foreverCheckboxLabel.htmlFor = "lock-forever-checkbox";
        foreverCheckboxLabel.textContent = "Lock forever";
        foreverCheckboxLabel.title = foreverLockTitleText;

        foreverLockCheckbox = foreverCheckbox;

        const savedSpeedLockActive = JSON.parse(localStorage.getItem("savedSpeedLockActive")) || false;
        const savedSpeedLockRate = parseFloat(localStorage.getItem("savedSpeedLockRate")) || 1.0;

        if (savedSpeedLockActive) {
            foreverCheckbox.checked = true;
            checkbox.checked = true;
            playbackRateLocked = true;
            playbackRateForeverLocked = true;
            lockRate = savedSpeedLockRate;
            input.value = lockRate;
            handleRateChange(null, savedSpeedLockRate);
        }

        playbackRateControls.appendChild(label);
        playbackRateControls.appendChild(input);
        playbackRateControls.appendChild(checkboxLabel);
        playbackRateControls.appendChild(checkbox);
        playbackRateControls.appendChild(divider);
        playbackRateControls.appendChild(foreverCheckboxLabel);
        playbackRateControls.appendChild(foreverCheckbox);

        playbackRateOuter.appendChild(playbackRateControls);

        videoControlsMasterHolder.appendChild(playbackRateOuter);

        monitorPlaybackRate();
        log("Playback rate control panel inserted.");
    }

    let monitorPlaybackRateIsRunning = false;
    let rateChanging = false;
    let videoFound = false;

    // Monitor changes in the video playback rate
    function monitorPlaybackRate() {
        if (!monitorPlaybackRateIsRunning) {
            log("monitorPlaybackRate is running...");
            monitorPlaybackRateIsRunning = true;
        }
        const checkPlaybackRate = () => {
            findVideo();
            const input = document.getElementById("playback-rate-input");
            if (!video) {
                log("No video found.");
            } else {
                if (!videoFound) {
                    log("Video found.");
                    videoFound = true;
                }
            }
            if (playbackRateLocked) {
                // Lock is on, force the playback rate to lockRate
                if (video.playbackRate !== lockRate) {
                    log("Oh no you don't! Changing playback rate back...");
                    video.playbackRate = lockRate;
                }
            } else {
                // Update the input value if lock is not active
                if (!rateChanging && document.activeElement !== input) {
                    if (input.value !== video.playbackRate.toFixed(2)) {
                        log("Playback rate measured as " + video.playbackRate.toFixed(2) + ".");
                        input.value = video.playbackRate.toFixed(2);
                    }
                } else if ((rateChanging || document.activeElement == input) && !isNaN(input.value)) {
                    if (parseFloat(input.value) !== parseFloat(video.playbackRate)) {
                        rateChanging = true;
                        log(
                            "Video playback rate: " +
                                video.playbackRate +
                                "\nInput value: " +
                                input.value +
                                "\nDon't change that value while I'm changing it."
                        );
                        video.playbackRate = input.value;
                        // log("Don't change that value while I'm changing it.");
                        rateChanging = false;
                    }
                } else {
                    rateChanging = false;
                }
            }
        };

        // Run the check periodically
        setInterval(checkPlaybackRate, 100);
    }

    function insertLockControls() {
        // const existingControls = document.querySelector("#lock-controls-outer");
        // if (existingControls) {
        //     return;
        // }

        // Create a parent div for the play and pause lock buttons
        lockControlsOuterDiv = document.createElement("div");
        lockControlsOuterDiv.id = "lock-controls-outer";
        lockControlsOuterDiv.classList.add("video-manipulator-outer-div");

        const lockControlsDiv = document.createElement("div");
        lockControlsDiv.id = "lock-controls";
        lockControlsDiv.classList.add("video-manipulator-inner-item");

        // Create the Play Lock button
        const playLockButton = document.createElement("button");
        playLockButton.id = "playLockButton";
        playLockButton.classList.add("lock-button");
        // Create the play triangle span
        const playTriangleSpan = document.createElement("span");
        playTriangleSpan.textContent = "►"; // Unicode for the play triangle

        // Create the lock span
        const lockSpan = document.createElement("span");
        lockSpan.classList.add("lock-span");
        lockSpan.textContent = "🔒"; // Unicode for the lock icon

        // Append both elements to the playLockButton
        playLockButton.appendChild(playTriangleSpan);
        playLockButton.appendChild(lockSpan);

        playLockButton.title = "Play Lock - Prevents the video from getting unintentionally paused.";

        // Create the Pause Lock button
        const pauseLockButton = document.createElement("button");
        pauseLockButton.id = "pauseLockButton";
        pauseLockButton.classList.add("lock-button");
        // Create the pause bars span
        const pauseBarsSpan = document.createElement("span");
        pauseBarsSpan.textContent = "⏸"; // Unicode for pause symbol

        // Create the lock span
        const lockSpan2 = document.createElement("span");
        lockSpan2.classList.add("lock-span");
        lockSpan2.textContent = "🔒"; // Unicode for the lock icon

        // Append both elements to the pauseLockButton
        pauseLockButton.appendChild(pauseBarsSpan);
        pauseLockButton.appendChild(lockSpan2);
        pauseLockButton.title = "Pause Lock - Prevents the video from getting unintentionally unpaused.";

        // Append buttons to the parent div
        lockControlsDiv.appendChild(playLockButton);
        lockControlsDiv.appendChild(pauseLockButton);
        lockControlsOuterDiv.appendChild(lockControlsDiv);

        buttonRefs["play-lock-button"] = playLockButton;
        buttonRefs["pause-lock-button"] = pauseLockButton;

        videoControlsMasterHolder.appendChild(lockControlsOuterDiv);

        actions = topRow.querySelector("#actions");
        log("Lock controls inserted.");
        // Now add the behavior for the lock buttons
        addLockButtonListeners(playLockButton, pauseLockButton);
    }

    let playPauseListenersAdded = false;

    let intervalId = null;

    function addPlayPauseListeners() {
        log("addPlayPauseListeners...");

        function printLockStates() {
            log("playLock:", playLock, ", pauseLock", pauseLock);
        }

        printLockStates();

        // Listen for play and pause events
        findVideo();

        // Function to start or stop the interval
        function manageInterval() {
            // Start interval if either lock is active and interval isn't already running
            if ((playLock || pauseLock) && !intervalId) {
                log("Starting interval check...");
                intervalId = setInterval(() => {
                    if (playLock && video.paused) {
                        log("Interval fallback: Play lock is active, playing video...");
                        video.play();
                    } else if (pauseLock && !video.paused) {
                        log("Interval fallback: Pause lock is active, pausing video...");
                        video.pause();
                    } else if (!playLock && !pauseLock) {
                        // If neither lock is active, stop the interval
                        log("Neither lock is active, stopping interval...");
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }, 1000);
            }

            // Stop the interval if both locks are off and the interval is running
            else if (!playLock && !pauseLock && intervalId) {
                log("Stopping interval as both locks are inactive...");
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        if (video) {
            manageInterval();

            if (playPauseListenersAdded) {
                return;
            }

            playPauseListenersAdded = true;
            log("Adding play/pause event listeners...");

            video.addEventListener("play", () => {
                log("Video playing...");
                printLockStates();
                if (pauseLock) {
                    video.pause(); // Pause the video if pauseLock is active
                }
                log("Video is playing.");
            });

            video.addEventListener("pause", () => {
                log("Video paused...");
                printLockStates();
                if (playLock) {
                    video.play(); // Play the video if playLock is active
                }
                log("Video is paused.");
            });
        }
    }

    function addLockButtonListeners(playLockButton, pauseLockButton) {
        function updateButtonStates() {
            if (playLock) {
                playLockButton.classList.add("active");
                pauseLockButton.classList.remove("active");
            } else if (pauseLock) {
                pauseLockButton.classList.add("active");
                playLockButton.classList.remove("active");
            } else {
                playLockButton.classList.remove("active");
                pauseLockButton.classList.remove("active");
            }
        }

        playLockButton.addEventListener("click", () => {
            findVideo();
            if (!video) {
                log("No video found.");
                return; // Exit if no video
            }
            log("Video found.");

            if (pauseLock) pauseLock = false; // Disable pause lock if active
            playLock = !playLock;
            if (playLock) {
                video.play();
            }
            updateButtonStates();
            addPlayPauseListeners();
        });

        pauseLockButton.addEventListener("click", () => {
            findVideo();
            if (!video) {
                log("No video found.");
                return; // Exit if no video
            }
            log("Video found.");

            if (playLock) playLock = false; // Disable play lock if active
            pauseLock = !pauseLock;
            if (pauseLock) {
                video.pause();
            }
            updateButtonStates();
            addPlayPauseListeners();
        });
    }

    // Event handler for changing the playback rate from the input box
    function handleRateChange(event, newRate) {
        rateChanging = true;

        if (newRate === undefined) {
            newRate = parseFloat(event.target.value);
        }

        if (playbackRateForeverLocked) {
            localStorage.setItem("savedSpeedLockRate", newRate);
        }

        findVideo();
        if (!isNaN(newRate) && video && input.value !== video.playbackRate.toFixed(2)) {
            if (playbackRateLocked) {
                lockRate = newRate;
                video.playbackRate = lockRate;
            } else {
                video.playbackRate = newRate;
            }
            log("Playback rate changed to:", newRate);
        }
    }

    // Event handler for toggling the lock
    function handleLockToggle(event) {
        const input = document.getElementById("playback-rate-input");
        findVideo();
        if (event.target.id === "lock-rate-checkbox") {
            log("Lock rate checkbox toggled");
            if (event.target.checked) {
                playbackRateLocked = true;
                lockRate = parseFloat(input.value);
                log("Playback rate locked at:", lockRate);
            } else {
                playbackRateLocked = false;
                foreverLockCheckbox.checked = false;
                lockRate = null;
                log("Playback rate unlocked");
            }
        } else if (event.target.id === "lock-forever-checkbox") {
            log("Lock forever checkbox toggled");
            if (event.target.checked) {
                playbackRateLocked = true;
                speedLockCheckbox.checked = true;
                localStorage.setItem("savedSpeedLockActive", true);
                lockRate = parseFloat(input.value);
                localStorage.setItem("savedSpeedLockRate", lockRate);
                log("Playback rate locked at:", lockRate);
                playbackRateForeverLocked = true;
            } else {
                localStorage.setItem("savedSpeedLockActive", false);
                playbackRateForeverLocked = false;
            }
        }
    }

    // New function to handle active class toggling
    function handleActiveClass(btn, className, isCustomOrZoom) {
        log("Button: " + btn);

        const clickedButton = buttonRefs[btn];

        log("Clicked button: " + clickedButton);

        let buttonsWithClass;

        // if (className)

        // Get all buttons with the matching class from the buttonRefs object
        buttonsWithClass = Object.values(buttonRefs).filter((button) => button.classList.contains(className));

        // Remove the 'active' class from all buttons except the passed one
        buttonsWithClass.forEach((button) => {
            if (button !== clickedButton && button.classList.contains("active")) {
                button.classList.remove("active");
            }
        });

        if (isCustomOrZoom) {
            if (!clickedButton.classList.contains("active")) {
                clickedButton.classList.add("active");
            } else if (lastCustomRepeated) {
                log("Last custom value was repeated. Making button inactive.");
                // setTimeout(() => {
                lastCustom = undefined;
                // }, 50);
                lastCustomRepeated = false;
                lastCustomReset = true;
                clickedButton.classList.remove("active");
                return true;
            }
            return false;
        }

        // Check if the passed button already has the 'active' class
        if (clickedButton.classList.contains("active")) {
            // If it has the 'active' class, remove it
            clickedButton.classList.remove("active");
            return true;
        } else {
            // Otherwise, add the 'active' class to the passed button
            clickedButton.classList.add("active");
            return false;
        }
    }

    function resetFlipRotate() {
        flipRotateStyle.textContent = "";
    }

    function resetAspect() {
        videoZoomStyle.textContent = "";
        tipAspectStyle.textContent = "";
        rawAspectRatio = undefined;
        aspectRatio = undefined;
        getNativeRatio();
        savedAspectRatio = nativeRatio;
        frameAspectStyle.textContent = "";
        frameIsRescaled = false;
    }

    // Event handler functions
    function handleFlip(btn) {
        const active = handleActiveClass(btn, "orientation");

        if (active) {
            resetFlipRotate();
        } else {
            flipRotateStyle.textContent = `
            video, .ytp-tooltip:not(.ytp-text-detail) .ytp-tooltip-bg {
                transform: scale(1, -1);
            }
        `;
        }
        log("Flip button pressed");
    }

    function handleMirror(btn) {
        const active = handleActiveClass(btn, "orientation");

        if (active) {
            resetFlipRotate();
        } else {
            flipRotateStyle.textContent = `
            video, .ytp-tooltip:not(.ytp-text-detail) .ytp-tooltip-bg {
                transform: scale(-1, 1);
            }
        `;
        }
        log("Mirror button pressed");
    }

    function handleRotate180(btn) {
        const active = handleActiveClass(btn, "orientation");

        if (active) {
            resetFlipRotate();
        } else {
            flipRotateStyle.textContent = `
            video, .ytp-tooltip:not(.ytp-text-detail) .ytp-tooltip-bg {
                rotate: 180deg;
            }
        `;
        }
        log("180° button pressed");
    }

    // let handleRepeat = 0;

    let scaleAndTopInProgress = false;
    let scaleAndTopQueued = false;
    let isStretched;

    function compareRatios() {
        findVideo();
        getNativeRatio();
        if (aspectRatio === nativeRatio || aspectRatio === null) {
            isStretched = false;
        } else {
            isStretched = true;
        }
    }

    function scaleAndTop(direct) {
        if (scaleAndTopInProgress) {
            scaleAndTopQueued = true;
            log("Scale and top already in progress.");
            return;
        } else {
            scaleAndTopInProgress = true;
            setTimeout(() => {
                scaleAndTopInProgress = false;
            }, 250);
        }

        compareRatios();

        if (noScaleAndTop) {
            log("scaleAndTop will not be run.");
            return;
        }

        // if (!scaleAndTopInProgress) {
        //     scaleAndTopInProgress = true;
        //     setTimeout(() => {
        //         scaleAndTopInProgress = false;
        //     }, 225);
        //     // return;
        // } else if (!scaleAndTopQueued) {
        //     scaleAndTopQueued = true;
        //     log("Queuing scaleAndTop.");
        //     return;
        // } else {
        //     log("Stopping scaleAndTop.");
        //     return;
        // }

        log("Running scaleAndTop...");

        let scaleDiff;
        let newWidth;
        let newHeight;
        let newTop;
        let newLeft;
        let isWiderThanContainer;
        let useThisRatio;

        findVideo();

        if (!video) {
            log("scaleAndTop found no video.");
            return;
        }

        if (!aspectRatio) {
            // Get the native aspect ratio of the video
            getNativeRatio();
            useThisRatio = nativeRatio;
            // aspectRatio = nativeRatio;
            // savedAspectRatio = aspectRatio;
        } else {
            useThisRatio = aspectRatio;
        }

        log("useThisRatio:", useThisRatio);
        if (isNaN(useThisRatio) || isNaN(nativeRatio)) {
            setTimeout(() => {
                scaleAndTop();
            }, 250);
            return;
        } else {
            log("useThisRatio, checked again:", useThisRatio);
        }

        findContainerRatio();

        // Determine whether to scale by width or height
        isWiderThanContainer = useThisRatio > containerRatio;
        if (isWiderThanContainer) {
            log("Video will be wider than container.");
            scaleDiff = useThisRatio - containerRatio;
            log("Scale difference:", scaleDiff);

            newWidth = containerWidth;
            newHeight = containerWidth / useThisRatio;
            newTop = (containerHeight - newHeight) / 2;
            newLeft = 0;
        } else {
            log("Video will not be wider than container.");
            newHeight = containerHeight;
            newWidth = containerHeight * useThisRatio;
            log("newHeight: " + newHeight + ", newWidth: " + newWidth);
            newTop = 0;
            newLeft = (containerWidth - newWidth) / 2;
        }

        // newHeight = Math.round(newHeight);
        // newWidth = Math.round(newWidth);

        const scaleX = (aspectRatio / nativeRatio).toFixed(8);

        reportVideoDimensions();

        isStretched = aspectRatio != nativeRatio;

        // if (direct) {
        // setTimeout(() => {
        ignoreChange = true;
        log("scaleAndTop will scale the video directly.");
        video.style.height = newHeight + "px";
        video.style.width = newWidth + "px";
        video.style.top = newTop + "px";
        video.style.left = newLeft + "px";
        if (isStretched) {
            video.style.objectFit = "unset";
        } else {
            video.style.objectFit = "";
        }

        // reportVideoDimensions();
        setTimeout(() => {
            ignoreChange = false;
        }, 250);
        // reportVideoDimensions();

        // }, 250);
        // } else {
        //     videoZoomStyle.textContent = `
        //     video {
        //         width: ${newWidth}px !important;
        //         height: ${newHeight}px !important;
        //         object-fit: unset !important;
        //         top: ${newTop}px !important;
        //         left: ${newLeft}px !important;
        //         scale: ${zoom};
        //     }
        //     `;
        // }

        reportVideoDimensions();

        tipAspectStyle.textContent = `
        .ytp-tooltip:not(.ytp-text-detail) .ytp-tooltip-bg {
            scale: ${isWiderThanContainer ? `${zoom} ${zoom / scaleX}` : `${scaleX * zoom} ${zoom}`};
        }
        `;

        log(`Aspect ratio set to ${aspectRatio}, scaleX: ${scaleX}`);

        if (scaleAndTopQueued) {
            scaleAndTopQueued = false;
            setTimeout(() => {
                scaleAndTop();
            }, 250);
        }
        startTestDifInterval();
    }

    let testDifInterval = null; // Global variable to store the interval ID
    const testDifIntervalTime = 250; // Interval time set to 250ms
    const testDifIntervalMaxIterations = 16;
    let testDifIntervalIterations = 0;

    function testDimensionDif() {
        findContainerRatio();
        const heightDif = Math.abs(parseFloat(video.style.height) - containerHeight);
        const widthDif = Math.abs(parseFloat(video.style.width) - containerWidth);
        const topDif = Math.abs(parseFloat(video.style.top) - (heightDif / 2));
        log("heightDif:", heightDif, "\nwidthDif:", widthDif, "\ntopDif:", topDif);
        if ((heightDif >= 1 && widthDif >= 1) || topDif >= 1) {
            log("Discrepancy detected. Rescaling...");
            scaleAndTop();
        }
        testDifIntervalIterations += 1;
        if (testDifIntervalIterations >= testDifIntervalMaxIterations) {
            stopTestDifInterval();
        }
    }

    function startTestDifInterval() {
        if (testDifInterval === null) {
            // Start the interval only if it's not already running
            testDifInterval = setInterval(testDimensionDif, testDifIntervalTime);
            log("testDifInterval started.");
        } else {
            log("testDifInterval is already running. Resetting iterations;");
            testDifIntervalIterations = 0;
        }
    }

    function stopTestDifInterval() {
        if (testDifInterval !== null) {
            clearInterval(testDifInterval);
            testDifInterval = null;
            testDifIntervalIterations = 0;
            log("testDifInterval stopped");
        }
    }

    function reportVideoDimensions() {
        const videoWidth = video.offsetWidth;
        const videoHeight = video.offsetHeight;
        log(`Video height: ${videoHeight}\nVideo width: ${videoWidth}`);
        log("videoZoomStyle:\n" + videoZoomStyle.textContent);
    }

    let handleAspectActive = false;
    let switchAspectOff = false;
    let ignoreChange = false;

    function handleAspectRatio(value, btn, isCustomOrZoom) {
        if (btn) {
            log("Handling aspect ratio. Button pressed was " + btn + ".");
            if (btn != "aspect-custom") {
                log("Button was not aspect-custom.");
                lastCustom = undefined;
                lastCustomRepeated = false;
            }
        } else {
            log("Handling aspect ration. No button was pressed.");
        }
        reportVideoDimensions();
        let failed;
        if (ignoreChange) {
            log("This change will be ignored.");
            // ignoreChange = false;
            // setTimeout(() => {
            //     ignoreChange = false;
            // }, 250);
            return;
        }
        // if (!frameIsRescaled && aspectRatio === undefined) {
        //     if (handleAspectActive === false) {
        //         log('Nothing to do. Resetting aspect style.');
        //         resetAspect();
        //         return;
        //     } else {
        //         log('Not resetting aspect style yet.');
        //         switchAspectOff = true;
        //     }
        // } else {
        //     handleAspectActive = true;
        //     switchAspectOff = false;
        // }

        findVideo();

        if (!video) {
            return;
        }

        log("zoom:", zoom);

        reportVideoDimensions();

        let active = false;

        // handleRepeat += 1;

        if (btn) {
            noAspect = false;
            if (isCustomOrZoom === "zoom") {
                handleActiveClass(btn, "zoom", true);
            } else {
                active = handleActiveClass(btn, "aspect", isCustomOrZoom);
            }
        }

        getNativeRatio();

        // reportVideoDimensions();

        if (value) {
            log("A value of " + value + " was specified to handleAspectRatio.");
            rawAspectRatio = value;

            log("value:", value);
            failed = parseAspectRatio();

            log("aspectRatio: ", aspectRatio);

            if (isCustomOrZoom === "custom" && aspectRatio === value) {
                handleActiveClass(btn, "aspect");
                noAspect = true;
            }
        } else {
            log("Aspect ratio will be native ratio.");
            aspectRatio = nativeRatio;
            noAspect = true;
            // savedAspectRatio = aspectRatio;
        }

        // reportVideoDimensions();

        // log("Aspect ratio: ", unparsedAspectRatio, "\nParsed:", aspectRatio);

        if (active) {
            log("Button was active. Unsetting aspect ratio...");
            aspectRatio = nativeRatio;
            savedAspectRatio = nativeRatio;
            noAspect = true;
            // scaleAndTop();
            // setTimeout(() => {
            //   scaleAndTop();
            // }, 250);
        }

        if (aspectRatio === nativeRatio) {
            noAspect = true;
        }

        // reportVideoDimensions();

        findContainerRatio();

        log(`Aspect ratio is ${aspectRatio}. Contaner ratio is ${containerRatio}.`);

        rescaleFrame();
        if (active) {
            scaleAndTop();
        }

        // reportVideoDimensions();

        // if (isNaN(zoom)) {
        //     log("Defaulting zoom to 1.");
        //     zoom = 1;
        // }

        // if (!video) {
        //     console.error("Video element not found");
        //     return;
        // }

        // reportVideoDimensions();

        // Get the aspect ratio of the container
        // const container = video.parentElement;
        // findContainerRatio();

        // Get the native aspect ratio of the video
        // getNativeRatio();
        // log("Native ratio:", nativeRatio);

        // reportVideoDimensions();

        // rescaleFrame();

        // reportVideoDimensions();

        if (!isNaN(zoom)) {
            videoZoomStyle.textContent = `
            video {
                scale: ${zoom};
            }

            .ytp-tooltip:not(.ytp-text-detail) .ytp-tooltip-bg {
                /* background-size: ${zoom}; */
            }
            `;
        }

        // Check if aspectRatio is undefined
        if (noAspect) {
            log("No aspect, and so...");
            // findVideo();

            // reportVideoDimensions();

            tipAspectStyle.textContent = "";

            // video {
            //     top: ${adjustedTop}px !important;
            // }

            // reportVideoDimensions();

            //             setTimeout(() => {
            //                 findContainerRatio();

            //                 const videoWidth = video.offsetWidth;
            //                 const videoHeight = video.offsetHeight;

            //                 const adjustedTop = (containerHeight - videoHeight) / 2;

            //                 log(
            //                     "videoHeight: " +
            //                         videoHeight +
            //                         "\ncontainerHeight: " +
            //                         containerHeight +
            //                         "\nadjustedTop: " +
            //                         adjustedTop
            //                 );

            //                 video.style.top = adjustedTop + "px";
            //             }, 0);

            // ignoreChange = true;
            // scaleAndTop(true);
        } else {
            noScaleAndTop = false;
            scaleAndTop();

            if (isCustomOrZoom === "custom" && btn && !failed) {
                handleActiveClass(btn, "aspect", true);
            }
        }

        reportVideoDimensions();

        // rescaleFrame();

        // if (handleRepeat != 2) {
        //   handleAspectRatio(value, btn, isCustomOrZoom);
        // } else {
        //   handleRepeat = 0;
        // }

        // if (switchAspectOff) {
        //     handleAspectActive = false;
        // }
    }

    function handleCustomAspect(btn) {
        const customValue = document.getElementById("aspect-custom-input").value;
        if (lastCustomReset) {
            lastCustom = undefined;
            lastCustomReset = false;
        }
        if (lastCustom === customValue) {
            lastCustomRepeated = true;
        } else {
            lastCustomRepeated = false;
        }
        let buttonItself = document.querySelector(`button#${btn}`);
        buttonItself.classList.remove("blinking");
        log("Custom value:", customValue);
        if (customValue === null || !customValue) {
            return;
        }
        handleAspectRatio(customValue, btn, "custom");
        lastCustom = customValue;
    }

    let zoomDebounceTimeout;

    function handleZoom(btn) {
        // log('Zooming...');
        clearTimeout(zoomDebounceTimeout);
        zoomDebounceTimeout = setTimeout(() => {
            if (zoom !== zoomInput.value) {
                isZoomed = true;
            } else {
                isZoomed = !isZoomed;
            }
            if (isZoomed) {
                zoom = zoomInput.value;
            } else {
                zoom = 1;
            }
            handleAspectRatio(aspectRatio, btn, "zoom");

            if (zoom === 1) {
                buttonRefs[btn].classList.remove("active");
            }
        }, 250);
    }

    function handleReset(btn) {
        resetFlipRotate();
        resetAspect();
        lastCustomRepeated = false;
        lastCustom = undefined;
        lastCustomReset = undefined;

        frameIsRescaled = false;

        const relevantButtons = controlPanel.querySelectorAll("button");

        relevantButtons.forEach((button) => {
            button.classList.remove("active");
        });

        zoom = 1;
        // zoomInput.value = 1;
        setTimeout(() => {
            scaleAndTop(true);
        }, 250);

        // noScaleAndTop = true;

        log("Reset button pressed");
    }

    function handleFrameResize(btn) {
        handleActiveClass(btn, "frame-resize");

        let direct;

        const isActive = buttonRefs[btn].classList.contains("active");
        if (isActive) {
            frameIsRescaled = true;
            rescaleFrame();
            direct = false;
        } else {
            frameIsRescaled = false;
            frameAspectStyle.textContent = "";
            direct = true;
        }
        setTimeout(() => {
            handleAspectRatio(aspectRatio);
            noScaleAndTop = false;
            setTimeout(() => {
                scaleAndTop(true);
            }, 250);
        }, 25);

        setTimeout(() => {
            scaleAndTop();
        }, 500);
    }

    let rescaleInProgress = false;
    let rescaleInQ = false;

    function rescaleFrame() {
        if (rescaleInProgress) {
            rescaleInQ = true;
            log("Rescale already in progress.");
            return;
        } else {
            rescaleInProgress = true;
            setTimeout(() => {
                rescaleInProgress = false;
            }, 250);
        }
        // return;
        log("Rescaling frame...");

        findVideo();

        if (!video) {
            setTimeout(() => {
                rescaleFrame();
            }, 1000);
            return;
        }

        if (!frameIsRescaled) {
            frameAspectStyle.textContent = "";
            log("Frame will not be rescaled.");
            return;
        } else {
            log("Frame will be rescaled.");
        }

        let useThisRatio;

        if (!aspectRatio) {
            getNativeRatio();

            useThisRatio = parseFloat(nativeRatio);
            // frameAspectStyle.textContent = "";
        } else {
            // parseAspectRatio();
            useThisRatio = aspectRatio;
        }

        if (isNaN(useThisRatio)) {
            setTimeout(() => {
                rescaleFrame();
            }, 1000);
            return;
        }

        log("useThisRatio: " + useThisRatio);

        if (frameIsRescaled) {
            frameAspectStyle.textContent = `
        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy,
        ytd-watch-flexy[default-layout] #player,
        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy #container,
        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy #container .html5-video-player
        {
            /* aspect-ratio: ${useThisRatio * 1.0011}; */
            aspect-ratio: ${useThisRatio};
            /* max-height: calc(100vh - 169px); */
            max-height: calc(100vh - 64px);
        }

        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy #ytd-player,
        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy #player-container {
          /* max-height: calc(100vh - 169px) !important; */
        }

        ytd-watch-flexy:not([full-bleed-player]):not([fullscreen]) #player {
          margin: auto;
        }

        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy {
            height: unset;
            /* max-height: unset; */
        }

        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy .html5-video-container {
            height: 100%;
        }

        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy video {
            /* transform-origin: top; */
            /* top: unset !important; */
            /* max-height: 100%; */
            /* max-width: 100%; */
            /* object-fit: unset; */
        }

        ytd-watch-flexy[default-layout] #player #player-container-outer,
        ytd-watch-flexy[default-layout] #player #player-container-outer #player-container-inner,
        ytd-watch-flexy[default-layout] #player #player-container-outer #player-container-inner .html5-video-container {
            width: 100%;
            height: 100%;
            padding-top: 0;
        }

        ytd-watch-flexy[default-layout] #player video {
            /* height: 100% !important; */
            /* width: 100% !important; */
            /* top: unset !important; */
            /* object-fit: contain; */
        }

        ytd-watch-flexy[default-layout] #player .html5-video-container,
        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy .html5-video-container {
            /display: flex;
            /align-items: center;
        }

        ytd-watch-flexy[full-bleed-player]:not([fullscreen]) #full-bleed-container.ytd-watch-flexy video {
            // height: 100% !important;
            // width: auto !important;
            /* position: relative; */
            transform-origin: center;
            /* margin: auto; */
            /* left: unset !important; */
            /* right: unset !important; */
            /* position: relative; */

        }
        `;
        }
        if (rescaleInQ) {
            rescaleInQ = false;
            setTimeout(() => {
                rescaleFrame();
            }, 250);
        }
    }

    let retryTimeout = null;

    // Function to get the most common background color from buttons in #top-row
    function getMostCommonButtonColor() {
        log("Finding most common button color...");

        function findColor() {
            // const buttons = document.querySelectorAll('#top-row button:not(#video-display-controls button)');
            const buttons = topRow.querySelectorAll("#actions button");
            if (buttons.length < 3) {
                // log(`Found ${buttons.length} buttons, retrying in 1 second...`);
                if (!retryTimeout) {
                    retryTimeout = setTimeout(() => {
                        retryTimeout = null;
                        findColor();
                    }, 1000);
                }
                return;
            }

            const colorCount = {};
            let mostCommonColor = "";
            let maxCount = 0;

            buttons.forEach((button) => {
                const color = window.getComputedStyle(button).backgroundColor;
                log("Button background color:", color);
                if (colorCount[color]) {
                    colorCount[color]++;
                } else {
                    colorCount[color] = 1;
                }

                if (colorCount[color] > maxCount) {
                    maxCount = colorCount[color];
                    mostCommonColor = color;
                }
            });

            log("Most common color found:", mostCommonColor);
            applyButtonColor(mostCommonColor);
        }

        findColor();
    }

    // Function to apply the most common color to the custom buttons
    function applyButtonColor(color) {
        const customStyles = additionalStyles;
        if (customStyles) {
            customStyles.textContent += `
            :root {
                --video-manipulator-button-color: ${color};
            }

            .video-manipulator-inner-item button, button.video-manipulator-inner-item {
                background-color: var(--video-manipulator-button-color);
            }
        `;
            log("Applied most common color to custom buttons:", color);
        } else {
            console.warn("video-display-controls stylesheet not found");
        }
    }

    // Function to insert custom styles
    function insertCustomStyles() {
        log("Inserting custom styles...");
        const mostCommonColor = getMostCommonButtonColor();
        const customStyles = additionalStyles;
        if (customStyles) {
            customStyles.textContent += `
                #video-display-controls button {
                    background-color: ${mostCommonColor};
                }
            `;
            log("Custom styles inserted.");
        } else {
            console.warn("video-display-controls stylesheet not found");
        }
    }

    function appendSquareCornersStyle() {
        squareCornersStyle = document.createElement("style");
        squareCornersStyle.id = "square-corners-style";

        head.appendChild(squareCornersStyle);

        log("Appending square corners style...");

        squareCorners = JSON.parse(localStorage.getItem("squareCorners") || false);

        log("squareCorners:", squareCorners);

        makeCornersSquareOrNot();
    }

    appendSquareCornersStyle();

    function makeCornersSquareOrNot() {
        if (squareCorners) {
            squareCornersStyle.textContent = `
            #player-api.round, ytd-player {
              border-radius: unset !important;
            }
            `;
        } else {
            squareCornersStyle.textContent = "";
        }
    }

    let cosmeticCheckboxesDiv;

    function insertCosmeticControls() {
        function insertSquareCornerControl() {
            cosmeticCheckboxesDiv = document.createElement("div");
            cosmeticCheckboxesDiv.id = "cosmetic-checkboxes-div";
            cosmeticCheckboxesDiv.classList.add("video-manipulator-inner-item");

            cosmeticCheckboxesOuterDiv = document.createElement("div");
            cosmeticCheckboxesOuterDiv.id = "cosmetic-checkboxes-outer-div";
            cosmeticCheckboxesOuterDiv.classList.add("video-manipulator-outer-div");

            const squareCornersInnerDiv = document.createElement("div");
            squareCornersInnerDiv.id = "square-corners-inner-div";
            squareCornersInnerDiv.classList.add("video-manipulator-sub-item");
            squareCornersInnerDiv.title = "Give the video normal square corners, because all pixels matter.";

            const squareCornersCheckbox = document.createElement("input");
            squareCornersCheckbox.type = "checkbox";
            squareCornersCheckbox.id = "square-corners-checkbox";

            const squareCornersCheckboxLabel = document.createElement("label");
            squareCornersCheckboxLabel.htmlFor = "square-corners-checkbox";
            squareCornersCheckboxLabel.textContent = "Square Corners";

            squareCornersInnerDiv.appendChild(squareCornersCheckboxLabel);
            squareCornersInnerDiv.appendChild(squareCornersCheckbox);

            cosmeticCheckboxesDiv.appendChild(squareCornersInnerDiv);

            cosmeticCheckboxesOuterDiv.appendChild(cosmeticCheckboxesDiv);

            videoControlsMasterHolder.appendChild(cosmeticCheckboxesOuterDiv);

            squareCorners = JSON.parse(localStorage.getItem("squareCorners") || false);
            log("squareCorners:", squareCorners);
            squareCornersCheckbox.checked = squareCorners;
            makeCornersSquareOrNot();

            squareCornersCheckbox.addEventListener("change", () => {
                squareCorners = squareCornersCheckbox.checked;
                localStorage.setItem("squareCorners", squareCorners);
                makeCornersSquareOrNot();
            });
        }

        function insertOverlayButton() {
            const existingControls = document.querySelector("#overlay-button-outer");
            if (existingControls) {
                return;
            }

            // const overlayButtonDiv = document.createElement("div");
            // overlayButtonDiv.id = "overlay-button-outer";
            // overlayButtonDiv.classList.add("video-manipulator-outer-div");

            // const overlayButton = document.createElement("button");
            // overlayButton.id = "overlay-button";
            // overlayButton.classList.add("video-manipulator-inner-item");
            // overlayButton.textContent = "Show Overlays";
            // overlayButton.title = 'Show or hide all video overlays, depending.'

            const overlayButtonInner = document.createElement("div");
            overlayButtonInner.id = "overlay-button-inner";
            overlayButtonInner.classList.add("video-manipulator-sub-item");
            // overlayButtonInner.textContent = "Show Overlays";
            overlayButtonInner.title = "Show or hide all video overlays, including title cards and links.";

            const overlayCheckbox = document.createElement("input");
            overlayCheckbox.id = "overlay-checkbox";
            overlayCheckbox.type = "checkbox";

            const overlayCheckboxLabel = document.createElement("label");
            overlayCheckboxLabel.htmlFor = "overlay-checkbox";
            overlayCheckboxLabel.textContent = "Hide Overlays";

            overlayButtonInner.appendChild(overlayCheckboxLabel);
            overlayButtonInner.appendChild(overlayCheckbox);

            // log('Attempting to insert overlay button...');
            // overlayButtonDiv.appendChild(overlayButtonInner);

            // if (controlPanelOuter) {
            //     controlPanelOuter.after(overlayButtonDiv);
            //     log("Overlay button inserted.");
            // } else {
            //     console.warn("controlPanelOuter element not found");
            // }

            const divider = createDivider();

            cosmeticCheckboxesDiv.appendChild(divider);

            cosmeticCheckboxesDiv.appendChild(overlayButtonInner);

            log("hideOverlaysVar:", hideOverlaysVar);

            if (hideOverlaysVar) {
                overlayCheckbox.checked = true;
            } else {
                overlayCheckbox.checked = false;
            }

            overlayCheckbox.addEventListener("change", () => {
                hideOverlaysVar = !overlayCheckbox.checked;
                log("Overlay checkbox has been clicked...");
                if (hideOverlaysVar) {
                    showOverlays();
                } else {
                    hideOverlays();
                }
            });
        }

        function insertChapterMover() {
            const chapterMoverInner = document.createElement("div");
            chapterMoverInner.id = "chapter-mover-inner";
            chapterMoverInner.classList.add("video-manipulator-sub-item");
            chapterMoverInner.title =
                "Move the chapter selector from the description to a higher, more accessible location.";

            const moveChapterSelectorLabel = document.createElement("label");
            moveChapterSelectorLabel.htmlFor = "move-chapter-selector-checkbox";
            moveChapterSelectorLabel.textContent = "Move Chapter Selector";

            const moveChapterSelectorCheckbox = document.createElement("input");
            moveChapterSelectorCheckbox.id = "move-chapter-selector-checkbox";
            moveChapterSelectorCheckbox.type = "checkbox";

            const chapterMoverRadios = document.createElement("div");
            chapterMoverRadios.id = "chapter-mover-radios";
            chapterMoverRadios.classList.add("radio-div");

            const moveChaptersLowRadio = document.createElement("input");
            moveChaptersLowRadio.type = "radio";
            moveChaptersLowRadio.name = "move-chapters-group";
            moveChaptersLowRadio.id = "move-chapters-low-radio";
            moveChaptersLowRadio.disabled = true;
            const moveChaptersLowLabel = document.createElement("label");
            moveChaptersLowLabel.htmlFor = "move-chapters-low-radio";
            moveChaptersLowLabel.textContent = "Low";

            const moveChaptersMiddleRadio = document.createElement("input");
            moveChaptersMiddleRadio.type = "radio";
            moveChaptersMiddleRadio.name = "move-chapters-group";
            moveChaptersMiddleRadio.id = "move-chapters-middle-radio";
            moveChaptersMiddleRadio.disabled = true;
            const moveChaptersMiddleLabel = document.createElement("label");
            moveChaptersMiddleLabel.htmlFor = "move-chapters-middle-radio";
            moveChaptersMiddleLabel.textContent = "Middle";

            const moveChaptersHighRadio = document.createElement("input");
            moveChaptersHighRadio.type = "radio";
            moveChaptersHighRadio.name = "move-chapters-group";
            moveChaptersHighRadio.id = "move-chapters-high-radio";
            moveChaptersHighRadio.disabled = true;
            const moveChaptersHighLabel = document.createElement("label");
            moveChaptersHighLabel.htmlFor = "move-chapters-high-radio";
            moveChaptersHighLabel.textContent = "High";

            chapterMoverRadios.appendChild(moveChaptersLowRadio);
            chapterMoverRadios.appendChild(moveChaptersLowLabel);

            chapterMoverRadios.appendChild(moveChaptersMiddleRadio);
            chapterMoverRadios.appendChild(moveChaptersMiddleLabel);

            chapterMoverRadios.appendChild(moveChaptersHighRadio);
            chapterMoverRadios.appendChild(moveChaptersHighLabel);

            chapterMoverInner.appendChild(moveChapterSelectorLabel);
            chapterMoverInner.appendChild(moveChapterSelectorCheckbox);
            chapterMoverInner.appendChild(chapterMoverRadios);

            const divider = createDivider();

            cosmeticCheckboxesDiv.appendChild(divider);

            cosmeticCheckboxesDiv.appendChild(chapterMoverInner);

            // Function to enable or disable chapter radio buttons
            function toggleChapterRadios(arg) {
                const radios = [moveChaptersLowRadio, moveChaptersMiddleRadio, moveChaptersHighRadio];

                // Enable or disable based on the argument
                if (arg === "enable") {
                    radios.forEach((radio) => (radio.disabled = false));
                } else if (arg === "disable") {
                    radios.forEach((radio) => (radio.disabled = true));
                }
            }

            // Retrieve and set values from localStorage
            const savedChapterMoving = localStorage.getItem("chapterMoving");
            const savedChapterPosition = localStorage.getItem("chapterPosition");

            // Set chapterMoving state and update checkbox
            if (savedChapterMoving !== null) {
                chapterMoving = JSON.parse(savedChapterMoving); // Parse as boolean
                moveChapterSelectorCheckbox.checked = chapterMoving; // Set the checkbox
            }

            // Enable/Disable radios based on chapterMoving
            if (chapterMoving) {
                toggleChapterRadios("enable");
            } else {
                toggleChapterRadios("disable");
            }

            // Set chapterPosition and select the corresponding radio
            if (savedChapterPosition) {
                chapterPosition = savedChapterPosition;
            } else {
                chapterPosition = "low"; // Default position
            }

            // Select the correct radio based on saved position
            switch (chapterPosition) {
                case "low":
                    moveChaptersLowRadio.checked = true;
                    break;
                case "middle":
                    moveChaptersMiddleRadio.checked = true;
                    break;
                case "high":
                    moveChaptersHighRadio.checked = true;
                    break;
            }

            // Add event listeners to update saved values
            moveChapterSelectorCheckbox.addEventListener("change", () => {
                chapterMoving = moveChapterSelectorCheckbox.checked;
                localStorage.setItem("chapterMoving", JSON.stringify(chapterMoving));

                // Enable or disable radios based on the checkbox state
                if (chapterMoving) {
                    moveChapters();
                    toggleChapterRadios("enable");
                } else {
                    restoreOriginalChapterPosition();
                    toggleChapterRadios("disable");
                }
            });

            chapterMoverRadios.addEventListener("change", (event) => {
                chapterPosition = event.target.id.replace("move-chapters-", "").replace("-radio", "");
                localStorage.setItem("chapterPosition", chapterPosition);
                moveChapters();
            });

            let originalChapterPosition = {
                parent: null,
                sibling: null
            };

            function storeOriginalChapterPosition() {
                if (chapters) {
                    originalChapterPosition.parent = chapters.parentNode; // Store the parent node
                    originalChapterPosition.sibling = chapters.previousSibling; // Store the sibling before it (if any)
                }
            }

            moveChapters = function () {
                if (!chapters) {
                    if (chapterMoveAttempts < chapterMoveAttemptsMax) {
                        setTimeout(() => {
                            moveChapters();
                        }, 1000);
                        chapterMoveAttempts += 1;
                    } else {
                        log("Chapters element not found. No movement performed.");
                    }
                    return;
                }

                toggleMovedChaptersStyles("on");

                // Check the current value of chapterPosition and move chapters accordingly
                switch (chapterPosition) {
                    case "low":
                        // Move chapters after topRow
                        topRow.parentNode.insertBefore(chapters, topRow.nextSibling);
                        // chapters.style.marginTop = '';
                        break;
                    case "high":
                        // Move chapters before topRow
                        topRow.parentNode.insertBefore(chapters, topRow);
                        // chapters.style.marginTop = '';
                        break;
                    case "middle":
                        // Move chapters after actions
                        // chapters.style.marginTop = '10px';
                        actions.parentNode.insertBefore(chapters, actions.nextSibling);

                        break;
                    default:
                        log("Invalid chapter position.");
                }
            };

            establishChaptersAttempts = 0;
            maxEstablishChaptersAttempts = 60;
            establishChaptersAttemptsInterval = 250;
            let establishChaptersInProgress = false;
            let establishChaptersInQ = false;

            establishChapters = function () {
                if (establishChaptersInProgress) {
                    establishChaptersInQ = true;
                    return;
                } else {
                    establishChaptersInProgress = true;
                    setTimeout(() => {
                        establishChaptersInProgress = false;
                    }, 250);
                }
                const existingChapters = document.querySelector(
                    "#above-the-fold ytd-horizontal-card-list-renderer[modern-chapters]"
                );
                const unmovedChapters = document.querySelector(
                    "#bottom-row ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer[modern-chapters]"
                );

                if (existingChapters && existingChapters != chapters && existingChapters != unmovedChapters) {
                    log("Removing existing chapters from previous video...");
                    existingChapters.remove();
                }

                log("Establishing chapters...");

                chapters = document.querySelector(
                    "#bottom-row ytd-structured-description-content-renderer ytd-horizontal-card-list-renderer[modern-chapters]"
                );

                if (chapters) {
                    storeOriginalChapterPosition();
                    if (chapterMoving) {
                        moveChapters();
                    }
                } else {
                    setTimeout(() => {
                        establishChapters();
                        establishChaptersAttempts += 1;
                        if (establishChaptersAttempts >= maxEstablishChaptersAttempts) {
                            establishChaptersAttemptsInterval = 2500;
                        }
                    }, establishChaptersAttemptsInterval);
                }
                if (establishChaptersInQ) {
                    establishChaptersInQ = false;
                    setTimeout(() => {
                        establishChapters();
                    }, 250);
                }
            };

            establishChapters();

            function toggleMovedChaptersStyles(arg) {
                if (arg === "on") {
                    chapters.style.borderTop = "unset";
                    chapters.style.padding = "0";
                    chapters.style.maxWidth = "100%";
                }

                if (arg === "off") {
                    // chapters.style.marginTop = '';
                    chapters.style.borderTop = "";
                    chapters.style.padding = "";
                    chapters.style.maxWidth = "";
                }
            }

            function restoreOriginalChapterPosition() {
                log("Restoring original chapter selector position...");
                if (chapters && originalChapterPosition.parent) {
                    if (originalChapterPosition.sibling) {
                        originalChapterPosition.parent.insertBefore(chapters, originalChapterPosition.sibling);
                    } else {
                        originalChapterPosition.parent.appendChild(chapters);
                    }

                    toggleMovedChaptersStyles("off");
                }
            }
        }

        insertSquareCornerControl();
        insertOverlayButton();
        insertChapterMover();
    }

    function addPressEffectToButtons() {
        // Iterate over each button in the buttonRefs object
        Object.values(buttonRefs).forEach((btn) => {
            btn.addEventListener("click", () => {
                // Add the 'just-pressed' class to the button
                btn.classList.add("just-pressed");

                // Remove the 'just-pressed' class after 1 second
                setTimeout(() => {
                    btn.classList.remove("just-pressed");
                }, 250);
            });
        });
    }

    // let insertAttempts = 0;

    //     function handleVideoSizeChangeFunction() {
    //         // Add the temporary CSS to set the zoom transition time to 0
    //         video.style.transition = "zoom 0s";

    //         // Wait 25ms to ensure the CSS takes effect before zooming
    //         setTimeout(() => {
    //             handleAspectRatio(aspectRatio, null, "zoom");
    //             log("Video size changed");

    //             setTimeout(() => {
    //                 // Remove the temporary transition style
    //                 video.style.transition = "";
    //             }, 25);
    //         }, 25);
    //     }

    function monitorVideoSize() {
        video = document.querySelector("video.html5-main-video");

        const handleVideoSizeChange = () => {
            // Add the temporary CSS to set the zoom transition time to 0
            video.style.transition = "zoom 0s";

            // Wait 25ms to ensure the CSS takes effect before zooming
            setTimeout(() => {
                handleAspectRatio(aspectRatio, null, "zoom");
                log("Video size changed");

                setTimeout(() => {
                    // Remove the temporary transition style
                    video.style.transition = "";
                }, 25);
            }, 25);
        };

        if (video) {
            const resizeObserver = new ResizeObserver(handleVideoSizeChange);
            const windowResizeObserver = new ResizeObserver(handleVideoSizeChange);
            resizeObserver.observe(video);
            windowResizeObserver.observe(document.body);
        } else {
            console.error("Video element not found");
        }
    }

    function setCompressorValues() {
        log("compressorValues: " + JSON.stringify(compressorValues));

        thresholdGain.gain.setValueAtTime(1 / Math.pow(2, compressorValues.threshold / 6), audioContext.currentTime);
        finalGain.gain.setValueAtTime(Math.pow(2, compressorValues.threshold / 6), audioContext.currentTime);

        //preGain.gain.setValueAtTime(Math.pow(2, compressorValues.preGain / 6), audioContext.currentTime);
        preGain.gain.setValueAtTime(compressorValues.preGain, audioContext.currentTime);

        compressor.threshold.setValueAtTime(compressorValues.knee * -1 - 1, audioContext.currentTime); // Threshold
        compressor.knee.setValueAtTime(compressorValues.knee, audioContext.currentTime); // Soft knee
        compressor.ratio.setValueAtTime(compressorValues.ratio, audioContext.currentTime); // High ratio for limiting
        compressor.attack.setValueAtTime(compressorValues.attack, audioContext.currentTime); // Fast attack
        compressor.release.setValueAtTime(compressorValues.release, audioContext.currentTime); // Release time
    }

    function initiateCompressor() {
        if (!audioContext) {
            // Create an AudioContext
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Add a pre-gain (included in compressor values)
            preGain = audioContext.createGain();

            // Add threshold gain to simulate the threshold
            thresholdGain = audioContext.createGain();

            // Create a DynamicsCompressorNode (limiter with soft knee)
            compressor = audioContext.createDynamicsCompressor();

            // Create a gain node for final output level control (included in compressor values)
            finalGain = audioContext.createGain();

            // finalGain.gain.setValueAtTime(compressorValues.finalGain, audioContext.currentTime); // Default gain is 1 (no change)
        }

        connectCompressor();

        // Set the compressor values using the new function
        setCompressorValues();
    }

    function changeCompressorValue(property, value, rawValue) {
        log("Passed values to change compressor values: ", property, value, rawValue);
        if (property === "preGain") {
            preGain.gain.setValueAtTime(value, audioContext.currentTime);
            log("PreGain value: " + preGain.gain.value);
            // } else if (compressor.hasOwnProperty(property)) {
            //     compressor[property].setValueAtTime(value, audioContext.currentTime);
            // } else {
            //     console.error('Invalid property:', property);
            // }
        } else if (property === "knee") {
            compressor[property].setValueAtTime(value, audioContext.currentTime);
            compressor.threshold.setValueAtTime(value - 1, audioContext.currentTime);
        } else if (property === "threshold") {
            thresholdGain.gain.setValueAtTime(1 / value, audioContext.currentTime);
            // Log the threshold gain value
            log("Threshold Gain value set to:", thresholdGain.gain.value);
            finalGain.gain.setValueAtTime(value, audioContext.currentTime);
            log("Final Gain value set to:", finalGain.gain.value);
        } else {
            compressor[property].setValueAtTime(value, audioContext.currentTime);
        }
    }

    function connectCompressor() {
        findVideo();

        if (video) {
            // Check if there's a video and no source node
            if (source) {
                log("Source found. Disconnecting...");
                source.disconnect(); // Disconnect the previous source (if any)
            } else {
                // Create a MediaElementSourceNode to use the video's audio
                source = audioContext.createMediaElementSource(video);
            }

            // Connect the video audio to the compressor
            source.connect(preGain);

            preGain.connect(thresholdGain);

            thresholdGain.connect(compressor);

            // Connect the compressor to the final gain control
            compressor.connect(finalGain);

            // Connect the final gain control to the audio context's destination (speakers)
            finalGain.connect(audioContext.destination);

            log("Video is being processed with compression and gain control.");
        } else {
            log("No video found or source already connected.");
        }
    }

    function disconnectCompressor() {
        if (source) {
            source.disconnect(); // Disconnect the video audio source
            preGain.disconnect();
            thresholdGain.disconnect();
            compressor.disconnect(); // Disconnect the compressor
            finalGain.disconnect(); // Disconnect the gain node
            source.connect(audioContext.destination);

            log("Compressor and nodes disconnected.");

            // Reset source to null to allow future processing
            // source = null;
        }
    }

    const timeVariables = {
        seekTime: null,
        requestedCurrentTime: null,
        loopStartTime: null,
        loopEndTime: null,
        lastMeasuredTime: null
    };

    const elementConfigMap = {
        "time-seek-input": "seekTime",
        "get-time-input": "requestedCurrentTime",
        "loop-start-input": "loopStartTime",
        "loop-end-input": "loopEndTime",
        "last-measured-time-input": "lastMeasuredTime"
    };

    // Global object to store previous values of inputs
    const previousInputValues = {};

    // Function to handle the time format input
    function formatTimeInput(inputElement) {
        inputElement.placeholder = "HH:MM:SS.mil";

        inputElement.addEventListener("input", (event) => {
            let input = event.target.value;
            let inputId = event.target.id; // Get the input element's ID

            // Store the previous value in the global object if it's the first time we're checking it
            if (!previousInputValues[inputId]) {
                previousInputValues[inputId] = input;
            }

            // Get the previous valid input value from the global object
            let previousInput = previousInputValues[inputId];

            // Check for decimal points and colons in the input string
            let decimalIndexes = [];
            let colonIndexes = [];

            // Loop through the string and collect all indexes of `.` and `:`
            for (let i = 0; i < input.length; i++) {
                if (input[i] === ".") {
                    decimalIndexes.push(i);
                }
                if (input[i] === ":") {
                    colonIndexes.push(i);
                }
            }

            // If there's a decimal point before any colon
            for (let decimalIndex of decimalIndexes) {
                for (let colonIndex of colonIndexes) {
                    if (decimalIndex < colonIndex) {
                        log("Blocked: Decimal comes before Colon");
                        event.preventDefault();
                        event.target.value = previousInput; // Revert to previous valid input
                        return;
                    }
                }
            }

            // If there's a colon after a decimal point
            for (let colonIndex of colonIndexes) {
                for (let decimalIndex of decimalIndexes) {
                    if (colonIndex > decimalIndex) {
                        log("Blocked: Colon comes after Decimal");
                        event.preventDefault();
                        event.target.value = previousInput; // Revert to previous valid input
                        return;
                    }
                }
            }

            // Remove any invalid characters (anything other than digits, colons, or periods)
            input = input.replace(/[^0-9:.]/g, "");

            // Split input based on period and colon
            let groups = input.split(".");

            // Ensure that the colon part is formatted as HH:MM:SS
            let colonGroups = groups[0].split(":");

            // Limit to no more than 3 groups (HH:MM:SS)
            if (colonGroups.length > 3) {
                colonGroups = colonGroups.slice(0, 3);
            }

            // Ensure that each group after the first one (MM, SS) has no more than 2 digits
            if (colonGroups[1] && colonGroups[1].length > 2) {
                colonGroups[1] = colonGroups[1].slice(0, 2);
            }
            if (colonGroups[2] && colonGroups[2].length > 2) {
                colonGroups[2] = colonGroups[2].slice(0, 2);
            }

            // Rebuild the colon-separated time part (HH:MM:SS)
            input = colonGroups.join(":");

            // Handle the decimal part (milliseconds)
            if (groups.length > 1) {
                let decimalGroup = groups[1].slice(0, 3); // Limit to 3 digits
                input += "." + decimalGroup;
            }

            // Update the input field with the valid value
            event.target.value = input;

            // Update the global object with the current valid value
            previousInputValues[inputId] = input;
        });

        // Ensure proper formatting when the user leaves the input field (blur event)
        inputElement.addEventListener("blur", () => {
            let input = inputElement.value;
            let inputId = event.target.id; // Get the input element's ID

            if (!input || input === null) {
                log("No input and nothing to convert.");
                const variableName = elementConfigMap[inputId];
                timeVariables[variableName] = null;
                log(`Updated timeVariables[${variableName}] to ${timeVariables[variableName]}.`);
                return;
            }

            // Split the input into colon-separated parts and decimal part
            let groups = input.split(":");
            let decimalGroup = "";

            // If there's a decimal part, separate it out
            if (groups[groups.length - 1].includes(".")) {
                const lastGroupParts = groups[groups.length - 1].split(".");
                decimalGroup = lastGroupParts[1] || "";
                groups[groups.length - 1] = lastGroupParts[0]; // Keep the part before the decimal
            }

            // Pad empty groups with "00"
            for (let i = 0; i < groups.length; i++) {
                if (groups[i] === "") {
                    groups[i] = "00"; // Fill empty group with "00"
                } else if (i > 0 && groups[i].length < 2) {
                    groups[i] = groups[i].padStart(2, "0"); // Pad with leading zero if needed (except for the first group)
                }
            }

            // Rebuild the string with fixed colon-separated groups
            input = groups.join(":");

            // Handle the decimal part and ensure it's at most 3 digits
            if (decimalGroup) {
                decimalGroup = decimalGroup.slice(0, 3); // Limit to 3 digits after the decimal point
                input += "." + decimalGroup;
            }

            // Update the input field with the final value
            inputElement.value = input;

            // Check if the value is valid and convert accordingly
            if (isValidTimeFormat(input)) {
                // log('The input is valid.');
                const rawSeconds = convertToRawSeconds(input, inputId);
                // You can store rawSeconds in a map or take other actions here
                // Store the rawSeconds in the appropriate variable using the elementConfigMap

                storeTimeVariable(rawSeconds, inputId);

                //         // Get the corresponding variable name from the map
                //         const variableName = elementConfigMap[inputId];

                //         if (variableName && timeVariables.hasOwnProperty(variableName)) {
                //             // Update the actual variable
                //             timeVariables[variableName] = rawSeconds;

                //           log(`Updated timeVariables[${variableName}] to ${input}.`);

                //     } else {
                //         console.error(`No matching entry for inputId ${inputId} in elementConfigMap`);
                //     }
            } else {
                console.error(`Invalid time format for input ${inputId}`);
            }

            if (inputId === "loop-start-input" || inputId === "loop-end-input") {
                let alertTriggered = getLoopLength();
                if (
                    isValidTimeFormat &&
                    !isNaN(loopLength) &&
                    !alertTriggered &&
                    loopStartInput.value != null &&
                    loopEndInput.value != null &&
                    looping
                ) {
                    startLoopingButton.classList.add("blinking");

                    clearTimeout(startLoopingBlink);
                    startLoopingBlink = setTimeout(() => {
                        startLoopingButton.classList.remove("blinking");
                    }, 5000); // Adjust duration based on your preference
                }
            }
        });
    }

    function storeTimeVariable(value, id) {
        // Get the corresponding variable name from the map
        const variableName = elementConfigMap[id];

        if (variableName && timeVariables.hasOwnProperty(variableName)) {
            // Update the actual variable
            timeVariables[variableName] = parseFloat(value);

            log(`Updated timeVariables[${variableName}] to ${timeVariables[variableName]}.`);
        } else {
            console.error(`No matching entry for inputId ${inputId} in elementConfigMap`);
        }
    }

    function convertToRawSeconds(timeString, elementId) {
        log(`Converting time for element ${elementId}: ${timeString}`);

        // Remove any extra whitespace
        timeString = timeString.trim();

        // Split the string by the colon separator
        const parts = timeString.split(":");

        let hours = 0,
            minutes = 0,
            seconds = 0;

        // If there is no colon, it's just seconds
        if (parts.length === 1) {
            // If there's a decimal, we need to split that as well
            const [sec, milli] = parts[0].split(".");
            seconds = parseInt(sec, 10) || 0;
            // Add milliseconds if present
            if (milli) {
                seconds += parseInt(milli, 10) / Math.pow(10, milli.length);
            }
        } else {
            // If there are parts, we process them
            if (parts.length === 2) {
                // Minutes:Seconds
                minutes = parseInt(parts[0], 10) || 0;
                seconds = parseFloat(parts[1]) || 0;
            } else if (parts.length === 3) {
                // Hours:Minutes:Seconds
                hours = parseInt(parts[0], 10) || 0;
                minutes = parseInt(parts[1], 10) || 0;
                seconds = parseFloat(parts[2]) || 0;
            }

            // Handle decimal in the last part (if any)
            if (seconds.toString().includes(".")) {
                const [sec, milli] = seconds.toString().split(".");
                seconds = parseInt(sec, 10) || 0;
                const milliseconds = parseInt(milli, 10) || 0;
                seconds += milliseconds / Math.pow(10, milli.length);
            }
        }

        // Now, calculate the total in raw seconds
        const rawSeconds = hours * 3600 + minutes * 60 + seconds;

        log(`Converted to raw seconds: ${rawSeconds}`);

        // You can store or do other things with rawSeconds here
        return rawSeconds;
    }

    function convertToTimeFormat(rawSeconds, elementId) {
        log(`Converting raw seconds for element ${elementId}: ${rawSeconds}`);

        // Calculate hours, minutes, and seconds (with potential decimal)
        const hours = Math.floor(rawSeconds / 3600);
        const minutes = Math.floor((rawSeconds % 3600) / 60);
        let seconds = rawSeconds % 60; // This could be a floating-point value

        // Format the time components into a string
        let timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        log(`Converted to time format (before modification): ${timeString}`);

        // Split into main part (HH:MM:SS) and decimal part
        let [mainPart, decimalPart] = timeString.split(".");

        // Trim leading zeros and colons from the main part
        while (mainPart.length > 1 && (mainPart.startsWith("0") || mainPart.startsWith(":"))) {
            mainPart = mainPart.slice(1); // Remove the first character (0 or :)
        }

        // If there's no decimal part, set it to an empty string
        if (decimalPart !== undefined) {
            // Prefix "0." to ensure it's a number
            let decimalValue = parseFloat("0." + decimalPart);

            // Round to 3 decimal places (you can change this to any precision you need)
            decimalValue = Math.round(decimalValue * 1000) / 1000;

            // Convert back to string, removing trailing zeros
            decimalPart = decimalValue.toString().split(".")[1] || "";

            // Trim trailing zeros from the decimal part
            while (decimalPart.length > 1 && decimalPart.endsWith("0")) {
                decimalPart = decimalPart.slice(0, -1); // Remove the last character (0)
            }

            // Combine the main part and the decimal part back
            timeString = `${mainPart}.${decimalPart}`;
        } else {
            timeString = `${mainPart}`;
        }

        log(`Final time string: ${timeString}`);

        return timeString;
    }

    function isValidTimeFormat(timeString) {
        log("Raw input value:", timeString); // Log the raw value
        log("Trimmed value:", timeString.trim()); // Log the value after trimming whitespace
        const regex = /^(\d+)(?::(\d{2}))?(?::(\d{2}))?(?:\.(\d+))?$/;
        log(regex.test(timeString));
        log(regex.test(timeString.trim()));
        return regex.test(timeString.trim());
    }

    function getCurrentTime(target) {
        log("Getting current time...");
        // Check if the video element is valid and exists

        const currentTime = video.currentTime; // Get the current time of the video
        if (!currentTime) {
            return;
        }
        log(`Current video time (raw): ${currentTime} seconds`);

        const convertedTime = convertToTimeFormat(currentTime, "get-time-input");
        log(`Current video time (converted): ${convertedTime} seconds`);

        storeTimeVariable(currentTime, "get-time-input");
        target.value = convertedTime;
    }

    let loopLength;

    function getLoopLength(start) {
        log("Loop start:", timeVariables.loopStartTime);
        log("Loop end:", timeVariables.loopEndTime);
        if (timeVariables.loopEndTime == null || timeVariables.loopStartTime == null) {
            log("No loop length to get.");
            return true;
        }
        loopLength = timeVariables.loopEndTime - timeVariables.loopStartTime;
        log("Loop length:", loopLength);

        let alertText;
        let alertTriggered = false;

        if (loopLength < 0) {
            // log('Condition 1.');
            looping = false;
            alertTriggered = true;
            alertText = "The loop length is negative. Looping cannot take place.";
        } else if (loopLength === 0) {
            // log('Condition 2.');
            looping = false;
            alertTriggered = true;
            alertText = "The loop length is 0. Looping cannot take place.";
        } else if (loopLength <= 1 / 30) {
            // log('Condition 3.');
            looping = false;
            alertTriggered = true;
            alertText = "The loop length is too short. Looping cannot take place.";
        } else {
            // log('Condition 4.');
            alertTriggered = false;
        }

        if (alertTriggered) {
            log(alertText);

            if (start) {
                loopErrorSpan.textContent = alertText;
                loopErrorHolderOuter.removeAttribute("invisible");
                if (hideLoopErrorTimeout) {
                    clearTimeout(hideLoopErrorTimeout); // Clear existing timeout
                }

                hideLoopErrorTimeout = setTimeout(() => {
                    loopErrorHolderOuter.setAttribute("invisible", "");
                }, 5000);
                return alertTriggered;
            }
        }
    }

    let hideLoopErrorTimeout;
    let measureRateInput;
    let lastMeasuredTimeInput;
    let loopStartInput;
    let loopEndInput;
    let startLoopingButton;
    let loopErrorSpan;
    let loopErrorPreSpan;
    let loopErrorHolderOuter;

    function insertSeekAndLoopControls() {
        const timeFormattedInputs = []; // Array to store the time-formatted inputs

        // const emptySpanner = insertEmptySpanner();
        // videoControlsMasterHolder.appendChild(emptySpanner);

        const videoSeekControls = document.createElement("div");
        videoSeekControls.id = "video-seek-controls";
        videoSeekControls.classList.add("video-manipulator-inner-item");

        videoSeekControlsOuterDiv = document.createElement("div");
        videoSeekControlsOuterDiv.id = "video-seek-controls-outer-div";
        videoSeekControlsOuterDiv.classList.add("video-manipulator-outer-div");

        const videoLoopControls = document.createElement("div");
        videoLoopControls.id = "video-loop-controls";
        videoLoopControls.classList.add("video-manipulator-inner-item");

        videoLoopControlsOuterDiv = document.createElement("div");
        videoLoopControlsOuterDiv.id = "video-loop-controls-outer-div";
        videoLoopControlsOuterDiv.classList.add("video-manipulator-outer-div");

        // Jump section
        const jumpSection = document.createElement("div");
        jumpSection.id = "jump-section";
        jumpSection.classList.add("video-manipulator-sub-item");

        const timeSeekButton = document.createElement("button");
        timeSeekButton.id = "time-seek-button";
        timeSeekButton.textContent = "Jump to";
        buttonRefs[timeSeekButton.id] = timeSeekButton;

        const timeSeekInput = document.createElement("input");
        timeSeekInput.id = "time-seek-input";
        timeSeekInput.type = "text"; // Only numbers allowed
        timeSeekInput.classList.add("time-formatted");
        timeFormattedInputs.push(timeSeekInput);

        jumpSection.appendChild(timeSeekButton);
        jumpSection.appendChild(timeSeekInput);

        // Divider
        const divider = createDivider();

        // Get time section
        const getTimeSection = document.createElement("div");
        getTimeSection.id = "get-time-section";
        getTimeSection.classList.add("video-manipulator-sub-item");

        const getTimeButton = document.createElement("button");
        getTimeButton.id = "get-time-button";
        getTimeButton.textContent = "Get Current Time";
        getTimeButton.title = "Get the current time for the video, with millisecond precision.";
        buttonRefs[getTimeButton.id] = getTimeButton;

        const getTimeInput = document.createElement("input");
        getTimeInput.id = "get-time-input";
        getTimeInput.type = "text"; // Only numbers allowed
        getTimeInput.readOnly = true;
        getTimeInput.classList.add("time-formatted");
        timeFormattedInputs.push(getTimeInput);

        const getTimeUrlButton = document.createElement("button");
        getTimeUrlButton.id = "get-time-url-button";
        getTimeUrlButton.textContent = "Copy URL at current time";
        getTimeUrlButton.title =
            "Copy the URL of the video at the current time to the clipboard, with millisecond precision.";
        buttonRefs[getTimeUrlButton.id] = getTimeUrlButton;

        getTimeSection.appendChild(getTimeButton);
        getTimeSection.appendChild(getTimeInput);

        // The following is disabled because YouTube just rounds anyway.
        // getTimeSection.appendChild(getTimeUrlButton);

        // Divider
        const divider2 = createDivider();

        // Loop section
        const loopSection = document.createElement("div");
        loopSection.id = "loop-section";
        loopSection.classList.add("video-manipulator-sub-item");

        const loopSpan = document.createElement("span");
        loopSpan.textContent = "Loop";

        loopStartInput = document.createElement("input");
        loopStartInput.id = "loop-start-input";
        loopStartInput.type = "text"; // Only numbers allowed
        loopStartInput.classList.add("time-formatted");
        timeFormattedInputs.push(loopStartInput);

        const loopEndSpan = document.createElement("span");
        loopEndSpan.textContent = "to";

        loopEndInput = document.createElement("input");
        loopEndInput.id = "loop-end-input";
        loopEndInput.type = "text"; // Only numbers allowed
        loopEndInput.classList.add("time-formatted");
        timeFormattedInputs.push(loopEndInput);

        const loopingButtonsOuterDiv = document.createElement("div");
        loopingButtonsOuterDiv.id = "looping-buttons-outer-div";
        loopingButtonsOuterDiv.classList.add("video-manipulator-sub-item");

        const loopingButtonsInnerDiv = document.createElement("div");
        loopingButtonsInnerDiv.id = "looping-buttons-inner-div";
        loopingButtonsInnerDiv.classList.add("video-manipulator-sub-item");

        startLoopingButton = document.createElement("button");
        startLoopingButton.id = "start-looping-button";
        startLoopingButton.textContent = "Start Looping";
        buttonRefs[startLoopingButton.id] = startLoopingButton;

        const stopLoopingButton = document.createElement("button");
        stopLoopingButton.id = "stop-looping-button";
        stopLoopingButton.textContent = "Stop Looping";
        buttonRefs[stopLoopingButton.id] = stopLoopingButton;

        loopErrorHolderOuter = document.createElement("div");
        loopErrorHolderOuter.id = "loop-error-holder-outer";
        loopErrorHolderOuter.setAttribute("invisible", "");

        const loopErrorHolderInner = document.createElement("div");
        loopErrorHolderInner.id = "loop-error-holder-inner";

        loopErrorPreSpan = document.createElement("div");
        loopErrorPreSpan.id = "loop-error-pre-span";

        loopErrorSpan = document.createElement("div");
        loopErrorSpan.id = "loop-error-span";
        loopErrorSpan.textContent =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + "Vivamus lacinia odio vitae vestibulum.";

        loopErrorHolderInner.appendChild(loopErrorPreSpan);
        loopErrorHolderInner.appendChild(loopErrorSpan);
        loopErrorHolderOuter.appendChild(loopErrorHolderInner);

        loopingButtonsInnerDiv.appendChild(startLoopingButton);
        loopingButtonsInnerDiv.appendChild(stopLoopingButton);

        loopingButtonsOuterDiv.appendChild(loopingButtonsInnerDiv);
        loopingButtonsOuterDiv.appendChild(loopErrorHolderOuter);

        const loopForeverRadio = document.createElement("input");
        loopForeverRadio.id = "loop-forever-radio";
        loopForeverRadio.type = "radio";
        loopForeverRadio.name = "loop-type";
        loopForeverRadio.checked = true;
        const loopForeverLabel = document.createElement("label");
        loopForeverLabel.setAttribute("for", "loop-forever-radio");
        loopForeverLabel.textContent = "Loop forever";

        const loopForeverDiv = document.createElement("div");

        loopForeverDiv.appendChild(loopForeverRadio);
        loopForeverDiv.appendChild(loopForeverLabel);
        loopForeverDiv.classList.add("radio-div");

        const loopXTimesRadio = document.createElement("input");
        loopXTimesRadio.id = "loop-x-times-radio";
        loopXTimesRadio.type = "radio";
        loopXTimesRadio.name = "loop-type";
        const loopXTimesLabel = document.createElement("label");
        loopXTimesLabel.setAttribute("for", "loop-x-times-radio");

        // Create the input element
        const loopTimesInput = document.createElement("input");
        loopTimesInput.id = "loop-times-input";
        loopTimesInput.type = "number";
        loopTimesInput.min = 1;

        // Create the label text node
        const labelText = document.createTextNode("Loop ");

        // Clear existing content and append the label text and input element
        loopXTimesLabel.textContent = ""; // Clear any previous content
        loopXTimesLabel.appendChild(labelText);
        loopXTimesLabel.appendChild(loopTimesInput);
        loopXTimesLabel.appendChild(document.createTextNode(" times"));

        const loopTimesDiv = document.createElement("div");

        loopTimesDiv.appendChild(loopXTimesRadio);
        loopTimesDiv.appendChild(loopXTimesLabel);
        loopTimesDiv.classList.add("radio-div");

        loopSection.appendChild(loopSpan);
        loopSection.appendChild(loopStartInput);
        loopSection.appendChild(loopEndSpan);
        loopSection.appendChild(loopEndInput);
        loopSection.appendChild(loopingButtonsOuterDiv);
        loopSection.appendChild(loopForeverDiv);
        loopSection.appendChild(loopTimesDiv);

        // Append all sections to the outer div
        videoSeekControls.appendChild(jumpSection);
        videoSeekControls.appendChild(divider);
        videoSeekControls.appendChild(getTimeSection);
        // videoSeekControls.appendChild(divider2);

        // Append the loop controls separately
        videoLoopControls.appendChild(loopSection);

        // Insert diagnostic section if timeLoopDebug is true
        if (timeLoopDebug) {
            const diagnosticDivider = createDivider();

            const diagnosticDiv = document.createElement("div");
            diagnosticDiv.id = "diagnostic-div";
            diagnosticDiv.classList.add("video-manipulator-sub-item");

            lastMeasuredTimeInput = document.createElement("input");
            lastMeasuredTimeInput.id = "last-measured-time-input";
            lastMeasuredTimeInput.type = "text";
            lastMeasuredTimeInput.readOnly = true; // Cannot be edited
            lastMeasuredTimeInput.classList.add("time-formatted");
            timeFormattedInputs.push(lastMeasuredTimeInput);

            const measuringSpan = document.createElement("span");
            measuringSpan.textContent = "Measuring";

            // Create the measure rate input
            measureRateInput = document.createElement("input");
            measureRateInput.id = "measure-rate-input";
            measureRateInput.type = "number"; // Accepts only numbers
            measureRateInput.min = 1; // Min value 1
            measureRateInput.max = 240; // Max value 240
            measureRateInput.step = "1"; // Only accepts integer steps
            measureRateInput.value = 1; // Default value (could be set to whatever you'd like)

            const timesPerSecondSpan = document.createElement("span");
            timesPerSecondSpan.textContent = "times per second";

            diagnosticDiv.appendChild(lastMeasuredTimeInput);
            diagnosticDiv.appendChild(measuringSpan);
            diagnosticDiv.appendChild(measureRateInput);
            diagnosticDiv.appendChild(timesPerSecondSpan);

            // Append to the videoLoopControlsOuterDiv
            videoLoopControls.appendChild(diagnosticDivider);
            videoLoopControls.appendChild(diagnosticDiv);

            measureRateInput.addEventListener("input", (event) => {
                // Clear the previous timer if there's one
                clearTimeout(debounceCheckTimeIntervalTimer);

                // Set a new timer for debounce (1 second delay)
                debounceCheckTimeIntervalTimer = setTimeout(() => {
                    let timeDivider = measureRateInput.value;
                    // Check if timeDivider is undefined, NaN, or less than or equal to zero
                    if (isNaN(timeDivider) || timeDivider <= 0) {
                        timeDivider = 0.000001; // Set to a small positive value
                    }
                    // Calculate the new interval based on input value
                    checkTimeIntervalTime = 1000 / timeDivider;
                    log(`New rate: ${measureRateInput.value} actions per second.`);
                    // Restart the interval with the new rate
                    startCheckTimeInterval();
                }, 1000); // Debounce by 1 second
            });
        }

        // Finally, append everything to the outer div
        videoSeekControlsOuterDiv.appendChild(videoSeekControls);
        videoLoopControlsOuterDiv.appendChild(videoLoopControls);

        // Append to topRow
        const playbackRateControls = document.querySelector(
            ".video-manipulator-outer-div#playback-rate-controls-outer"
        );
        // the element after which you want to append

        videoControlsMasterHolder.appendChild(videoSeekControlsOuterDiv);
        videoControlsMasterHolder.appendChild(videoLoopControlsOuterDiv);

        // if (playbackRateControls.nextSibling) {
        //     // If there is a next sibling, insert the new element before the next sibling
        //     topRow.insertBefore(videoSeekControlsOuterDiv, playbackRateControls.nextSibling);
        // } else {
        //     // If there is no next sibling, append the new element at the end of the parent
        //     topRow.appendChild(videoSeekControlsOuterDiv);
        // }

        timeFormattedInputs.forEach((input) => {
            formatTimeInput(input); // Apply formatting
        });

        // Add event listener to the button
        getTimeButton.addEventListener("click", function () {
            getCurrentTime(getTimeInput);
        });

        // Disabled because YouTube just rounds it anyway.
        // Add the event listener
        //         getTimeUrlButton.addEventListener("click", () => {
        //             getCurrentTime(getTimeInput);

        //             // Get the current time of the video in seconds, rounded to 3 decimal places
        //             const currentTime = video.currentTime.toFixed(3);

        //             // Get the current URL (from window.location.href)
        //             let currentUrl = window.location.href;

        //             // Remove all query parameters except for 'v' (the video ID)
        //             const urlParams = new URLSearchParams(window.location.search);
        //             // urlParams.delete('t');  // Remove any existing 't' parameter
        //             currentUrl = currentUrl.split("?")[0] + "?" + `v=${urlParams.get("v")}`;
        //             // Retain only the video ID and other relevant parameters

        //             // Add the 't' parameter with the current time
        //             currentUrl += `&t=${currentTime}` + "s";

        //             // Copy the final URL to the clipboard
        //             navigator.clipboard
        //                 .writeText(currentUrl)
        //                 .then(() => {
        //                     log(`Video URL at current time (${currentTime}s): ${currentUrl}`);
        //                     // alert('URL copied to clipboard!');
        //                 })
        //                 .catch((err) => {
        //                     console.error("Error copying to clipboard: ", err);
        //                 });
        //         });

        // Add event listener for the timeSeekButton
        timeSeekButton.addEventListener("click", () => {
            // Check if timeVariables.seekTime has a valid value
            if (timeVariables.seekTime !== undefined) {
                // Set the video time to the value stored in timeVariables.seekTime
                video.currentTime = timeVariables.seekTime;
                log(`Jumping to time: ${timeVariables.seekTime} seconds.`);
            } else {
                console.error(`No valid time found in timeVariables.seekTime.`);
            }
        });

        startLoopingButton.addEventListener("click", () => {
            // if ()
            const dontStart = getLoopLength(true);
            log("dontStart:", dontStart);
            if (dontStart) {
                return;
            }
            looping = true;
            loopIterations = 0;
            startLoopingButton.classList.add("active");
            startLoopingButton.classList.remove("blinking");
            // startCheckTimeInterval();

            log("dontStart:", dontStart);

            loopIntervalStart();
            video.play();
        });

        stopLoopingButton.addEventListener("click", () => {
            looping = false;
            startLoopingButton.classList.remove("active");
            if (checkTimeIntervalId) clearInterval(checkTimeIntervalId);
            loopIntervalEnd();
        });

        loopForeverRadio.addEventListener("click", () => {
            loopMode = "forever";
        });

        loopXTimesRadio.addEventListener("click", () => {
            loopMode = "x-times";
        });

        loopTimesInput.addEventListener("blur", () => {
            loopTimes = Math.round(parseFloat(loopTimesInput.value));
            if (loopTimes != parseFloat(loopTimesInput.value)) {
                loopTimesInput.value = loopTimes;
            }
            loopXTimesRadio.checked = true;
            loopMode = "x-times";
        });

        // Create a MutationObserver to watch for changes in text content
        const loopErrorMutationObserver = new MutationObserver(() => {
            // Log the change in text content
            log("Text content of loopErrorSpan has changed.");

            // Adjust loopErrorPreSpan width and height based on the new content of loopErrorSpan
            loopErrorPreSpan.style.width = `${loopErrorSpan.offsetWidth}px`;
            loopErrorPreSpan.style.height = `${loopErrorSpan.offsetHeight}px`;
        });

        // Configure the observer to watch for text content changes (childList or characterData)
        const config = {
            childList: true, // Watch for additions or removals of child nodes
            characterData: true, // Watch for changes to the text content
            subtree: true // Watch all descendants, not just immediate children
        };

        // Start observing loopErrorSpan for text content changes
        loopErrorMutationObserver.observe(loopErrorSpan, config);

        loopErrorPreSpan.style.width = `${loopErrorSpan.offsetWidth}px`;
        loopErrorPreSpan.style.height = `${loopErrorSpan.offsetHeight}px`;

        getTimeInput.addEventListener("focus", () => {
            getTimeInput.select();
        });
    }

    let loopIntervalTime;
    let loopIntervalId;
    let deCapo = false;
    let tooFar = false;
    let loopTimes = 0;
    let loopIterations = 0;
    let loopInitialInterval;
    let loopStartTime;
    let loopEndTime;

    // Function to evaluate loop time
    function loopTimeEvaluator(timeLength) {
        deCapo = false; // Reset deCapo before starting evaluations
        let intervalLength;
        tooFar = false;

        // Boundary Conditions for Interval Duration
        if (timeLength > 2) {
            intervalLength = 1000; // 1 second
        } else if (timeLength <= 2 && timeLength > 0.25) {
            intervalLength = 250; // 250 ms
        } else if (timeLength <= 0.25) {
            intervalLength = timeLength * 1000; // Set interval to the remaining time
            deCapo = true;
            tooFar = timeLength < 0; // Check if the time goes beyond the end
        }

        return { intervalLength, deCapo, tooFar };
    }

    // Function to evaluate remaining time and adjust interval
    function loopRemainingTimeCalculator(currentTime) {
        log("loopRemainingTimeCalculator...");
        let remainingTime = loopEndTime - currentTime; // Time left in the loop

        // if (remainingTime <= 1/30) {
        //     log('Loop time is too short. Terminating.');
        //     clearInterval(loopIntervalId);
        //     return;
        // }

        let { intervalLength, deCapo, tooFar } = loopTimeEvaluator(remainingTime);

        if (timeLoopDebug) {
            const convertedTime = convertToTimeFormat(remainingTime, "get-time-input");
            lastMeasuredTimeInput.value = convertedTime;
        }

        // // If the video time is past the end, restart the loop
        // if (tooFar) {
        //     video.currentTime = loopStartTime; // Reset video time
        //     loopIterations += 1;
        // }

        // If the interval has changed, reset the interval
        if (loopIntervalTime !== intervalLength) {
            // clearInterval(loopIntervalId);
            // if (tooFar) {
            //     log('tooFar');
            //     loopIntervalTime = loopInitialInterval;
            // } else {
            loopIntervalTime = intervalLength; // Update the interval time
            // }
            clearInterval(loopIntervalId);
            if (looping) {
                loopIntervalId = setInterval(loopInterval, loopIntervalTime);
            }
        }
    }

    // Loop interval function
    function loopInterval() {
        if (loopMode === "x-times" && loopIterations >= loopTimes) {
            log("loopIterations:", +loopIterations);
            loopIntervalEnd();
            return;
        }

        if (!looping) {
            log("Looping is false.");
            clearInterval(loopIntervalId);
            loopIntervalEnd();
            return;
        }

        let currentTime = video.currentTime;

        if (looping) {
            loopRemainingTimeCalculator(currentTime);
        }

        if (deCapo || tooFar) {
            video.currentTime = loopStartTime; // Reset to loop start if deCapo is true
            deCapo = false; // Reset deCapo after looping
            loopIterations += 1;
            log("loopIterations:", +loopIterations);
        }

        if (video.paused) {
            return;
            // clearInterval(loopIntervalId); // Pause the loop interval if video is paused
        }
    }

    // Start loop interval
    function loopIntervalStart() {
        loopStartTime = timeVariables.loopStartTime; // Set start time
        loopEndTime = timeVariables.loopEndTime; // Set end time
        loopIterations = 0; // Reset loop iterations

        let timeLength = loopEndTime - loopStartTime; // Calculate loop length
        let { intervalLength, deCapo, tooFar } = loopTimeEvaluator(timeLength);

        loopInitialInterval = intervalLength; // Store initial interval

        video.currentTime = loopStartTime;

        clearInterval(loopIntervalId);

        loopIntervalId = setInterval(loopInterval, intervalLength); // Start interval
    }

    // End loop interval
    function loopIntervalEnd() {
        clearInterval(loopIntervalId); // Clear the interval when ending
        loopIterations = 0; // Reset loop iteration count
        looping = false;
        video.pause();
        log("Loop ended");
    }

    // Resize observer for individual inner elements (resizes the after pseudoelements)

    // Array to store content widths and conclusions (same or width value)
    const innerItemElements = [];
    const widthConclusions = [];

    // ResizeObserver for monitoring changes
    const innerItemResizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
            const parentElement = entry.target;
            const parentId = parentElement.id || parentElement.className;

            log(`Observed resize for: ${parentId}`);

            // Get the current width of the parent element and its content
            const parentRect = parentElement.getBoundingClientRect();
            const contentWidth = calculateContentWidth(parentElement);

            log(`For ${parentId}:`);
            log(`Container width: ${parentRect.width}`);
            log(`Content width: ${contentWidth}`);

            // Compare the current width of the parent and the content width
            const conclusion = parentRect.width > contentWidth ? contentWidth : "same";

            // Log the conclusion
            log(`Conclusion for ${parentId}: ${conclusion}`);

            // Store the measurement result
            if (!innerItemElements.includes(parentId)) {
                log(`Adding ${parentId} to innerItemElements.`);
                innerItemElements.push(parentId);
            } else {
                log(`${parentId} already in innerItemElements, updating conclusion.`);
            }

            widthConclusions[innerItemElements.indexOf(parentId)] = conclusion;

            // Update the styles after measuring all elements
            applyAfterPseudoCssRules();
        });
    });

    function calculateContentWidth(parent) {
        log(`Calculating content width for ${parent.id || parent.className}`);

        let left = Number.POSITIVE_INFINITY;
        let right = Number.NEGATIVE_INFINITY;

        Array.from(parent.children).forEach((child, index) => {
            // Check if the child element's display property is not 'none'
            if (window.getComputedStyle(child).display !== "none") {
                const childRect = child.getBoundingClientRect();
                // log(`Child ${index}: left: ${childRect.left}, right: ${childRect.right}`);
                left = Math.min(left, childRect.left);
                right = Math.max(right, childRect.right);
            } else {
                // log(`Child ${index} is hidden (display: none), skipping.`);
            }
        });

        const contentWidth = right - left;
        // log(`Content width for ${parent.id || parent.className}: ${contentWidth}`);
        return contentWidth;
    }

    // Function to apply CSS rules dynamically to the stylesheet
    function applyAfterPseudoCssRules() {
        log("Applying CSS rules...");

        let newRules = "";
        innerItemElements.forEach((parentId, index) => {
            const conclusion = widthConclusions[index];
            log(`Processing ${parentId}: Conclusion - ${conclusion}`);

            if (conclusion !== "same") {
                newRules += `#${parentId}:after { content: ""; max-width: ${conclusion}px; }\n`;
                log(`Rule for ${parentId}: max-width: ${conclusion}px`);
            }
        });

        // Apply the new rules to the stylesheet
        innerItemAfterStyles.textContent = newRules;
        log(`CSS rules applied:\n${newRules}`);
    }

    function observeInnerElements() {
        log("Starting to observe elements with the class '.video-manipulator-inner-item'.");

        // Start observing all elements with the class '.video-manipulator-inner-item'
        const videoManipulatorItems = document.querySelectorAll(".video-manipulator-inner-item");
        log(`Found ${videoManipulatorItems.length} elements to observe.`);

        videoManipulatorItems.forEach((item) => {
            log(`Observing: ${item.id || item.className}`);
            innerItemResizeObserver.observe(item);
        });
    }

    function recalculateAllAfterPseudoElements() {
        log("Inner item elements: " + JSON.stringify(innerItemElements));
        innerItemElements.forEach((parentId, index) => {
            // Retrieve the parent element by its ID or class name
            let parentElement = document.querySelector(`#${parentId}`) || document.querySelector(`.${parentId}`);

            if (parentElement) {
                // Get the current width of the parent element and its content
                const parentRect = parentElement.getBoundingClientRect();
                const contentWidth = calculateContentWidth(parentElement);

                log(`For ${parentId}:`);
                log(`Container width: ${parentRect.width}`);
                log(`Content width: ${contentWidth}`);

                // Compare the current width of the parent and the content width
                const conclusion = parentRect.width > contentWidth ? contentWidth : "same";

                // Update the conclusion stored in the array
                widthConclusions[index] = conclusion;

                // Log the result
                log(`Recalculated conclusion for ${parentId}: ${conclusion}`);

                // Update the styles after measuring all elements
                applyAfterPseudoCssRules();
            }
        });
    }

    function recalculateForElement(element) {
        // Ensure the element is valid
        if (!element) {
            log("Invalid element passed.");
            return;
        }

        // Get the element's ID or class name (just like in ResizeObserver)
        const parentId = element.id || element.className;
        log(`Recalculating for: ${parentId}`);

        // Get the current width of the parent element and its content
        const parentRect = element.getBoundingClientRect();
        const contentWidth = calculateContentWidth(element);

        log(`For ${parentId}:`);
        log(`Container width: ${parentRect.width}`);
        log(`Content width: ${contentWidth}`);

        // Compare the current width of the parent and the content width
        const conclusion = parentRect.width > contentWidth ? contentWidth : "same";

        // Update the conclusion in the widthConclusions array for this element
        const index = innerItemElements.indexOf(parentId);
        if (index !== -1) {
            widthConclusions[index] = conclusion;
            log(`Updated conclusion for ${parentId}: ${conclusion}`);
        } else {
            log(`${parentId} is not found in innerItemElements.`);
        }

        // Now, apply the styles after recalculating for this single element
        applyAfterPseudoCssRules();
    }

    // Variable to store the interval time in milliseconds (default 1000 / 60)
    let checkTimeIntervalTime = 100000;

    // Interval ID for later clearing
    let checkTimeIntervalId = null;

    // Function to handle the action we want to perform at intervals
    function checkTimeAtInterval() {
        // log("Action performed at rate of", measureRateInput.value, "per second.");
        // Add whatever action needs to happen here
        if (timeLoopDebug) {
            getCurrentTime(lastMeasuredTimeInput);
        }
    }

    // Start the interval based on the input value
    function startCheckTimeInterval() {
        // Clear any existing interval
        if (checkTimeIntervalId) clearInterval(checkTimeIntervalId);

        // Set the new interval
        checkTimeIntervalId = setInterval(checkTimeAtInterval, checkTimeIntervalTime);
    }

    // Debounced input handling
    let debounceCheckTimeIntervalTimer = null;

    function handleSrcChange() {
        log("Handling video source change...");
        handleReset();
        resizeByDefault = JSON.parse(localStorage.getItem("resizeByDefault")) || false;
        if (resizeByDefault) {
            resizeDefaultCheckbox.checked = true;
            frameIsRescaled = true;
            handleFrameResize("resize-frame");
            rescaleFrame();
            buttonRefs["resize-frame"].classList.add("active");
        }

        // if (chapters) {
        //   chapters.remove();
        // }
    }

    function reEstablishChapters() {
        establishChaptersAttempts = 0;
        establishChaptersAttemptsInterval = 250;

        establishChapters();
    }

    let currentUrl = window.location.href;
    function checkUrl() {
        if (window.location.href !== currentUrl) {
            log("URL changed to (polling):", window.location.href);
            currentUrl = window.location.href;
            reEstablishChapters();
        }
        setTimeout(checkUrl, 250); // Check every 100ms
    }
    checkUrl(); // Start the polling

    // Create the observer for the video element
    function createSrcObserver() {
        findVideo();

        if (!video) {
            log("No video element found.");
            return;
        }

        // Create a mutation observer to detect changes in the video element's src
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "attributes" && mutation.attributeName === "src") {
                    log("Video source has changed.");
                    handleSrcChange();
                }
            }
        });

        // Observe the video element for attribute changes (such as src)
        observer.observe(video, {
            attributes: true, // Observe changes to attributes (e.g., src)
            childList: false, // Do not observe child elements
            subtree: false // Do not observe descendants
        });

        // If the video element is removed, disconnect the observer
        const videoParentObserver = new MutationObserver(() => {
            if (!document.contains(video)) {
                observer.disconnect();
                initialize();
                log("Video element removed from the DOM. Observer disconnected.");
            }
        });

        // Observe the parent node to detect when the video is removed
        videoParentObserver.observe(document.body, {
            childList: true, // Observe additions and removals of child nodes
            subtree: true // Observe the entire DOM tree
        });
    }

    function attachResizeObserverOnVideoPlayer() {
        let html5VideoPlayer = document.querySelector(".html5-video-player");

        // Check if the element exists, if not, retry every 250ms
        const checkInterval = setInterval(() => {
            html5VideoPlayer = document.querySelector(".html5-video-player");

            if (html5VideoPlayer) {
                clearInterval(checkInterval); // Stop checking once we find the element

                // Attach ResizeObserver
                const resizeObserver = new ResizeObserver(() => {
                    // Function to run on resize
                    log("Video player resized!");
                    scaleAndTop();
                });

                // Start observing the element for resizing
                resizeObserver.observe(html5VideoPlayer);

                log("Resize observer attached to .html5-video-player");
            }
        }, 250); // Retry every 250ms until found
    }

    /* Manual */

    function insertManual() {
        const manualDiv = document.createElement("div");
        manualDiv.id = "video-controls-manual";
        manualDiv.innerHTML = `
      <div class="empty-spanner line"></div>

      <h2>Speed Control</h2>

<p>This <b>playback rate controller</b> has a simple number input. It lets you enter the speed
  you want, or use the spinners to move up or down by 5%.</p>

<p>The controls also include a <b>speed lock</b>. Sometimes, after you dial in just the right playback speed,
scripts on YouTube try to change it. When this happens, the speed lock kicks in to put the speed back where
you had it. You can lock the speed just for now, or lock it forever, so that every video you open will play
  at your custom speed.</p>

<p>(<b>Note:</b> Some scripts and extensions may have their own speed locks, which will put them in a deadlock
  with this extension. In these cases, disabling the speed lock for this script is easy enough.)</p>

<h2>Play/Pause Lock</h2>

<p>Sometimes, scripts or extensions may try to play or pause a video when you didn't ask them to. The <b>play
  lock</b> and <b>pause lock</b> are designed to stop this. Because you should decide when your videos play.</p>

<p>(<b>Note:</b> Sometimes, YouTube's native scripts may be so aggressive that the play lock cannot overcome
  them.)</p>

<h2>Aspect, Zoom, Flip, & Frame</h2>

<p>The <b>aspect</b> controls let you correct videos that were thoughtlessly stretched by the uploader. Because
people don't look good when they get stretched out of shape. The input for <b>custom aspect ratios</b> lets
  you set ratios precisely, for when <b>4/3</b> or <b>16/9</b> are not the correct ratio.</p>

<p>(<b>Note</b>: When you input a custom aspect ratio, you have to press the <b>Custom</b> button to apply it,
every time.)</p>

<p>The <b>zoom</b> control can help fix videos that were uploaded with a hard matte, getting rid of pointless
black bars and allowing the video to fill its frame.</p>

<p>The <b>flip, mirror, and 180°</b> buttons let you easily correct videos that have been altered by their
uploader. Was the video flipped horizontally to avoid copyright bots, and does the text look wrong backwards?
You can flip it back using the <b>Mirror</b> button. The <b>Flip</b> button is there just in case a video has
been flipped vertically. And the 180° can help correct videos that were shot in the southern hemisphere,
or Yes's music video for "Leave it".</p>

<p>The <b>Frame Resize</b> button resizes the video frame to match the video it contains, avoiding unnecessary
letterboxing or pillarboxing.</p>

<p>(<b>Note:</b> Implementing frame resize has been challenging, and you may still encounter a few bugs.)</p>

<p>The <b>Reset</b> button puts all of these controls back the way they were. It does not, however, clear the
input boxes, which makes reapplying a custom aspect ratio or zoom easy.</p>

<h2>Jump to Time / Get Current Time</h2>

<p>YouTube has ways of getting to different chapters in a video, but getting to any other specific point is
difficult. Now, you can enter a time value in hours, minutes, seconds, and milliseconds — that's how precise
it is — and press the <b>Jump to</b> button to go directly to any point in the video. Any standard time value
will work: hours, minutes, and seconds, or just minutes and seconds, or just seconds — any of these with or
without milliseconds.</p>

<p>The <b>Get Current Time</b> button will tell you exactly where you are in a video, with millisecond
precision, making it easy to identify points you want to revisit.</p>

<h2>Nice 'n' Accurate Looper</h2>

<p>The time seeking continues with my own version of a <b>looper</b>. There are a number of available loopers
for YouTube, but they tend to limit their accuracy to whole seconds, and sometimes, that just isn't enough.
This looper accepts inputs that include milliseconds, just like the the time seeker in the last section.
This allows you to specify loops right down to the frame. Additional controls let you decide if the video
will loop forever, or just a set number of times.</p>

<p>(<b>Note:</b> If your system is overworked, accuracy may suffer. However, in tests, the results have been
impressive.)</p>

<h2>Corners, Overlays, & Chapters</h2>

<p>This set of cosmetic controls are somewhat miscellaneous, and have been grouped together for convenience.</p>

<p>The <b>Square Corners</b> control undoes YouTube's corner rounding. Because all pixels matter.</p>

<p>The <b>Hide Overlays</b> control gets rid of distracting video overlays, like channel logos, popup links,
and title cards that interrupt the ends of music videos.</p>

<p>The <b>Move Chapter Selector</b> takes the nice chapter selector that YouTube hides away in the video
description, and moves it to a more convenient place. The <b>Low</b> option puts the selector just below
Jupiter's Tools for YouTube. The <b>Middle</b> option puts it just above these tools. And the <b>High</b>
option puts it even higher: right below the video's title.</p>

<h2>Volume Boost</h2>

<p>For videos that are too quiet, this control can <b>boost</b> the gain. You decide the amount of boost.
The input works in decibels, with a helpful conversion to percent for people who can't think in decibels.
To prevent unpleasant clipping, the audio is sent through a limiter. Not using one would be simply
irresponsible.</p>

<p>The following paragraphs will likely only appeal to audio engineering and web coding enthusiasts.</p>

<p>This volume booster uses the <a href="https://webaudio.github.io/web-audio-api/#DynamicsCompressorNode">Web
  Audio API compressor</a>. By default, the ratio is set to 20:1 — as high as it will go — with a slightly
soft knee, instantaneous attack, and a medium release time. For those who want to tinker, the <b>Expert</b>
button opens another control panel that gives you full access to the compressor.</p>

<p>Note: Because Web Audio API ties threshold to makeup gain, and gives the user no control over that makeup
gain, the stock threshold has been replaced with a boost going in and a cut coming out, to make the
compressor easier to control.</p>

<div class="empty-spanner line"></div>
      `;
        videoControlsMasterHolder.appendChild(manualDiv);
    }

    /* INITIALIZE SECTION */

    function insertCombinedControls() {
        const existingControls = topRow.querySelector(".video-manipulator-outer-div");
        if (existingControls) {
            return;
        } else {
            log("Inserting controls...");
        }

        actions = topRow.querySelector("#actions");
        if (!actions) {
            log("Actions element not found.");
            // insertAttempts += 1;
            // if (insertAttempts < 60) {
            setTimeout(() => {
                insertCombinedControls();
            }, 250);
            return;
            // }
        }

        let insertDelayIncrease = 10;
        let insertDelay = insertDelayIncrease;

        setTimeout(() => {
            const emptySpanner = insertEmptySpanner();
            topRow.appendChild(emptySpanner);
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertVideoControlsShowHideMenu();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            const emptySpanner = insertEmptySpanner(true);
            topRow.appendChild(emptySpanner);
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            createVideoControlsMasterHolder();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertPlaybackRateControls();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertLockControls();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            // log('This is where the control panel SHOULD be inserted.');
            insertControlPanel();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertSeekAndLoopControls();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertCosmeticControls();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        // Initialize the compressor controls
        setTimeout(() => {
            insertCompressorControls();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertManual();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertAboutDiv();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            populateVideoControlsShowHideMenu();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            addPressEffectToButtons();
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            monitorVideoSize();
            observeInnerElements();
            createSrcObserver();
            attachResizeObserverOnVideoPlayer();
            // if (timeLoopDebug) {
            //     // startCheckTimeInterval();
            // }
        }, insertDelay);
        insertDelay += insertDelayIncrease;

        setTimeout(() => {
            insertCombinedControls();
        }, 5000);
    }

    let initializeMessageRecent = false;

    // Function to initialize the userscript
    function initialize() {
        if (!initializeMessageRecent) {
            log("The initialize funtion is running.");
            initializeMessageRecent = true;
            setTimeout(() => {
                initializeMessageRecent = false;
            }, 1000);
        }

        findVideo();

        if (!video) {
            setTimeout(() => {
                initialize();
            }, 1000);
            return;
        }

        topRow = document.querySelector("ytd-watch-metadata #top-row");

        if (!topRow) {
            setTimeout(() => {
                initialize();
            }, 1000);
            return;
        }

        insertStylesheets();

        insertCombinedControls();

        //         if (!insertControlPanel()) {
        //             const observer = new MutationObserver((mutations) => {
        //                 const now = Date.now();
        //                 if (now - lastChecked >= 2000) {
        //                     lastChecked = now;
        //                     if (insertControlPanel()) {
        //                         insertCombinedControls();
        //                         observer.disconnect();
        //                     }
        //                 }
        //             });

        //             observer.observe(document, {
        //                 childList: true,
        //                 subtree: true
        //             });
        //         } else {
        //             insertCombinedControls();
        //         }
    }

    // Run the initialize function when the page has fully loaded
    // window.addEventListener('load', initialize);
    initialize();
})();
