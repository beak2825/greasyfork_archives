// ==UserScript==
// @name         Hide watched videos on YouTube
// @version      1.6
// @description  Adds an ability to hide thumbnails of videos you've already watched.
// @author       yojc
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.com
// @downloadURL https://update.greasyfork.org/scripts/456376/Hide%20watched%20videos%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/456376/Hide%20watched%20videos%20on%20YouTube.meta.js
// ==/UserScript==

(function() {

    const debugMode = false;
    const debugModeInterval = false;
    const debugModeErrorOnly = false;

    let lastUrl = "";
    let lastCheck = 0;
    let debugFiredTimes = 0;

    const checkInterval = 100;
    const bodyClassName = "hide-watched-videos";
    const buttonId = "toggleHideButton";
    const buttonClass = "toggle-hide-button";
    const buttonHideText = "Hide watched";
    const buttonShowText = "Show watched";
    const thumbProcessedClass = "thumb-processed";
    const thumbWatchedClass = "thumb-watched";
    const thumbTags = ["ytd-grid-video-renderer", "ytd-rich-item-renderer", "ytd-compact-video-renderer", "ytd-compact-radio-renderer", "yt-lockup-view-model"];
    const thumbWatchedCheckSelectors = ["ytd-thumbnail-overlay-resume-playback-renderer", "ytd-thumbnail-overlay-bottom-panel-renderer", "yt-thumbnail-bottom-overlay-view-model", ".ytd-thumbnail-overlay-time-status-renderer[aria-label=Upcoming]"];

    function debugLog(msg) {
        if (debugMode && !debugModeErrorOnly) {
            console.log(msg);
        }
    }
    function debugLogInterval(msg) {
        if (debugMode && debugModeInterval && !debugModeErrorOnly) {
            console.log(msg);
        }
    }
    function debugErr(msg) {
        if (debugMode) {
            console.error(msg);
        }
    }
    function debugErrInterval(msg) {
        if (debugMode && debugModeInterval) {
            console.error(msg);
        }
    }

    const greyedOutThumbnails = `
    .${thumbWatchedClass} #thumbnail > yt-image,
    .${thumbWatchedClass} #details,
    .${thumbWatchedClass} .details,
    .${thumbWatchedClass} ytd-thumbnail-overlay-resume-playback-renderer,
    .${thumbWatchedClass} .yt-thumbnail-view-model,
    .${thumbWatchedClass} yt-thumbnail-view-model,
    .${thumbWatchedClass} yt-lockup-metadata-view-model {
        opacity: 0.5;
        filter: grayscale(0.75);
    }
    `;

    const stylesheet = `
    .${buttonClass} {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        min-height: var(--paper-item-min-height,48px);
        padding: 0 2rem;
        background-color: #3f3f3f;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        color: rgb(241, 241, 241);
        font-family: "Roboto","Arial",sans-serif;
        font-size: 1.4rem;
        line-height: 2rem;
        font-weight: 500;
        transition: all 0.5s;
        z-index: 999;
    }

    .${buttonClass}:hover {
        background: #272727;
        transition: all 0.5s;
    }
/*
    .${thumbWatchedClass} ytd-thumbnail {
        pointer-events: none;
    }
*/
    ${localStorage.getItem("dontGreyOutWatchedThumbnails") === "true" ? "" : greyedOutThumbnails}

    .${bodyClassName} .${thumbWatchedClass} {
        display: none !important;
    }

    @media all and (display-mode: fullscreen) {
        .${buttonClass} {
            display: none;
        }
    }
    `;

/*
    .${thumbWatchedClass} #thumbnail::before {
        content: "Watched";
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 2rem;
        text-transform: uppercase;
        font-family: monospace;
        background: #000;
        z-index: 3;
        opacity: 0.75;
    }
 */

    function appendStylesheet(stylesheet) {
        debugLog("Appending stylesheet");

        let head = document.getElementsByTagName("head")[0];
        let s = document.createElement("style");
        s.setAttribute("type", "text/css");
        s.appendChild(document.createTextNode(stylesheet));
        head.appendChild(s);
    }

    function appendButton() {
        debugLog("Appending toggle button");

        let actionButton = document.createElement("button");
        actionButton.id = buttonId;
        actionButton.classList.add(buttonClass);
        actionButton.textContent = buttonHideText;
        actionButton.addEventListener("click",() => toggleHide());
        document.body.appendChild(actionButton);
    }

    function toggleHide() {
        debugLog("Toggling hide");

        if (document.body.classList.contains(bodyClassName)) {
            document.getElementById(buttonId).textContent = buttonHideText;
            document.body.classList.remove(bodyClassName);
        }
        else {
            document.getElementById(buttonId).textContent = buttonShowText;
            document.body.classList.add(bodyClassName);
        }
    }

    function checkIfWatched() {
        let thumbSelector;

        if (lastUrl === window.location.href) {
            thumbSelector = thumbTags.join(`, `);
        }
        else {
            thumbSelector = thumbTags.join(`:not(.${thumbWatchedClass}), `) + `:not(.${thumbWatchedClass})`;
        }

        for (const thumb of document.querySelectorAll(thumbSelector)) {
            debugLogInterval("Processing thumb");
            debugLogInterval(thumb);
            //thumb.classList.add(thumbProcessedClass);

            if (thumb.querySelector(thumbWatchedCheckSelectors.join(", "))) {
                debugLogInterval("This video was watched");
                debugLogInterval(thumb);

                for (const selector of thumbWatchedCheckSelectors) {
                   debugLogInterval(selector);
                   debugLogInterval(thumb.querySelector(selector));
                }

                thumb.classList.add(thumbWatchedClass);
            }
            else if (thumb.matches(":hover")) {
                debugLogInterval("Not clearing class - mouse on hover");
                debugLogInterval(thumb);
            }
            else {
                thumb.classList.remove(thumbWatchedClass);
            }
        }

        lastUrl = window.location.href;
    }

    if (window.top===window.self) {
        appendStylesheet(stylesheet);

        appendButton();

        const observer = new MutationObserver(function(mutations) {
            if (Date.now() - lastCheck > checkInterval) {
                lastCheck = Date.now();
                if (debugMode) {
                    debugFiredTimes++
                    console.log(`Observer fired for the ${debugFiredTimes} time`);
                }
                checkIfWatched();
            }
        });

        observer.observe(document.querySelector("body"), {
            childList: true,
            subtree: true
        });
    }
})();
