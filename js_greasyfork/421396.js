// ==UserScript==
/*
    Resizes the YouTube player to different sizes.
    Copyright (C) 2026 John Burt

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>
*/
// @name          YouTube Sizer
// @author        John Burt
// @namespace     namespace_runio
// @version       2.03
// @description   Resizes the YouTube player to different sizes
// @match         https://www.youtube.com/*
// @match         https://www.youtu.be/*
// @exclude       https://www.youtube.com/tv*
// @exclude       https://www.youtube.com/embed/*
// @exclude       https://www.youtube.com/live_chat*
// @exclude       https://www.youtube.com/shorts/*
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @supportURL    https://greasyfork.org/scripts/421396-youtube-sizer
// @icon          https://i.imgur.com/9haPE5X.png
// @license       GPL-3.0+
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/421396/YouTube%20Sizer.user.js
// @updateURL https://update.greasyfork.org/scripts/421396/YouTube%20Sizer.meta.js
// ==/UserScript==
(function() {
    "use strict";
    //==================================================================
    //Local Storage Functions
    if (window.frameElement) {
        throw new Error("Stopped JavaScript.")
    }

    function setPref(preference, new_value) {
        GM_setValue(preference, new_value);
    }

    function getPref(preference) {
        return GM_getValue(preference);
    }

    function initPref(preference, new_value) {
        let value = getPref(preference);
        if (value === null || isNaN(value)) {
            setPref(preference, new_value);
            value = new_value;
        }
        return value;
    }
    //==================================================================
    let policy;
    if (window.trustedTypes) {
        policy = trustedTypes.createPolicy('default', {
            createHTML: (string) => string,
        });
    } else {
        // Fallback if trustedTypes is not supported
        policy = {
            createHTML: (string) => string,
        };
    }
    //==================================================================
    initPref("yt-width", 854);
    initPref("yt-resize", false);
    //==================================================================
    // Global Variables
    var maxWidth = getPref("yt-width"); // Max Width of Video
    var shortcutKey = "r"; // Shortcut Key
    var ytresizeCss = `.ytp-big-mode .ytp-chrome-controls .ytp-resize-button { display:none !important; }`;
    //==================================================================
    window.addEventListener("load", () => {
        const observer = new MutationObserver(checkURL);
        const e = document.querySelector("title");
        if (e) {
            observer.observe(e, {
                attributes: true,
                characterData: true,
                childList: true
            });
        }
    }, {
        once: true
    });
    //==================================================================
    function checkURL() {
        waitElement("#player-container-outer").then((elm) => {
            if (window.location.pathname.includes("watch")) {
                if (!document.getElementById("yt-css")) {
                    startMethods();
                    createResize();
                }
            }
        });
    }
    //==================================================================
    function waitElement(selector) {
        const element = document.querySelector(selector);
        const targetNode = document.body;
        const config = {
            childList: true,
            subtree: true
        };
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                        observer.disconnect();
                        return resolve(element);
                    }
                }
            });
            observer.observe(targetNode, config);
        });
    }
    //==================================================================
    function startMethods() {
        new Promise((resolve) => {
            sizeObserver(); // Size Observer
            resolve();
        }).then(() => {
            if (getPref("yt-resize")) {
                addCss(`#primary.ytd-watch-flexy:not([theater]):not([fullscreen]) { max-width: ${maxWidth}px !important; }`, "small-player");
                addCss(`ytd-watch-flexy[flexy]:not([full-bleed-player][full-bleed-no-max-width-columns]) #columns.ytd-watch-flexy {max-width: 100% !important;}`, "max-player");
            }
            addCss(ytresizeCss, "yt-css");
            controlResize(); // Create Resize Button
            viewObserver(); // Video Container Observer
        });
    }
    //==================================================================
    function isCentered(element1, element2) {
        const box1 = element1.getBoundingClientRect();
        const box2 = element2.getBoundingClientRect();
        const center1 = {
            x: box1.left + box1.width / 2,
            y: box1.top + box1.height / 2
        };
        const center2 = {
            x: box2.left + box2.width / 2,
            y: box2.top + box2.height / 2
        };
        const horizontalDistance = Math.abs(center1.x - center2.x);
        const verticalDistance = Math.abs(center1.y - center2.y);

        return horizontalDistance <= 1 && verticalDistance <= 1;
    }

    function addCss(cssString, id) {
        const css = document.createElement("style");
        css.type = "text/css";
        css.id = id;
        // Use the Trusted Type policy to create trusted HTML
        css.innerHTML = policy.createHTML(cssString);
        document.head.appendChild(css);
    }
    //==================================================================
    /*Resize Video Container*/
    function createResize() {
        const element = document.querySelector("ytd-app");
        element.dispatchEvent(
            new CustomEvent("yt-action", {
                bubbles: !0,
                cancelable: !0,
                composed: !0,
                detail: {
                    actionName: "yt-window-resized",
                    disableBroadcast: false,
                    optionalAction: true,
                    returnValue: []
                }
            })
        );
        return;
    }
    /*Viewport Observer*/
    function viewObserver() {
        let movie_player = document.querySelector(".html5-video-player");
        let video = document.querySelector("video");
        let isCenteredMoviePlayer = isCentered(video, movie_player);
        let resizeObserver = new ResizeObserver((entries) => {
            window.requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) { // Check Animation Frame
                    return;
                }
                for (let entry of entries) {
                    if (!isCenteredMoviePlayer) {
                        if (entry.contentRect.width !== maxWidth) {
                            createResize();
                            console.log("Player Size: " + entry.contentRect.width + " x " + entry.contentRect.height);
                        }
                    }
                }
            });
        });
        // observe the given element for changes
        resizeObserver.observe(video);
    }
    //==================================================================
    /*Saves Size Setting*/
    function sizeObserver() {
        const targetNode = document.head;
        const config = {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        };

        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.removedNodes.length >= 1 && mutation.removedNodes[0].id === "small-player") {
                    setPref("yt-resize", false); // Set Resize To False
                    controlResize(); // Change Button Icon
                    createResize(); // Resize Video Container
                } else if (mutation.addedNodes.length >= 1 && mutation.addedNodes[0].id === "small-player") {
                    setPref("yt-resize", true); // Set Resize To True
                    controlResize(); // Change Button Icon
                    createResize(); // Resize Video Container
                }
                if (mutation.target && mutation.target.id === "small-player") {
                    setPref("yt-width", maxWidth);
                    createResize(); // Resize Video Container
                } else if (mutation.target && mutation.target.parentNode && mutation.target.parentNode.id === "small-player") {
                    setPref("yt-width", maxWidth);
                    createResize(); // Resize Video Container
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    //==================================================================
    function showResizeButtonTooltip(btn, show = true) {
        let tooltipTopOffset = 67; // Height Above The Button For The Tooltip
        const buttonRect = btn.getBoundingClientRect(); // Get Button Position
        const tooltipHorizontalCenter = buttonRect.left + buttonRect.width / 2; // Tooltip Horizontal Center
        const tooltipTop = buttonRect.top + buttonRect.height / 2 - tooltipTopOffset; // Tooltip Top
        const tooltip = document.getElementById("ytd-resize-tt") || createTooltip();
        const tooltipText = tooltip.querySelector("#ytd-resize-tt-text");
        if (show) { // Show
            tooltip.style.top = `${tooltipTop}px`;
            tooltipText.textContent = btn.getAttribute("aria-label");
            tooltip.style.removeProperty("display");
            const tooltipWidth = tooltip.getBoundingClientRect().width;
            tooltip.style.left = `${tooltipHorizontalCenter - tooltipWidth / 2}px`;
            btn.removeAttribute("title");
        } else { // Hide
            tooltip.style.setProperty("display", "none");
            tooltipText.textContent = "";
            btn.setAttribute("title", btn.getAttribute("aria-label"));
        }

        function createTooltip() {
            const htmlPlayer = document.querySelector(".html5-video-player");
            const tooltip = document.createElement("div");
            const tooltipTextWrapper = document.createElement("div");
            const tooltipText = document.createElement("span");
            tooltip.setAttribute("class", "ytp-tooltip ytp-bottom");
            tooltip.setAttribute("id", "ytd-resize-tt");
            tooltip.style.setProperty("position", "fixed");
            tooltipTextWrapper.setAttribute("class", "ytp-tooltip-text-wrapper ytp-tooltip-bottom-text");
            tooltipText.setAttribute("class", "ytp-tooltip-text");
            tooltipText.setAttribute("id", "ytd-resize-tt-text");
            tooltip.appendChild(tooltipTextWrapper);
            tooltipTextWrapper.appendChild(tooltipText);
            htmlPlayer.appendChild(tooltip);
            return tooltip;
        }
    }
    //==================================================================
    /*Resize Button Script*/
    function setButton(btn, path) {
        var pathData = {};
        var ariaLabel = "";
        var title = "";
        if (!getPref("yt-resize")) {
            pathData.d = `M 13 17 L 5 9  L 5 17 Z
                          M 23 19
                          L 23 4.98  C 23 3.88 22.1 3 21 3
                          L 3  3   C 1.9  3  1  3.88  1  4.98
                          L 1  19  C 1  20.1 1.9 21  3  21
                          L 21 21  C 22.1 21 23 20.1 23 19
                          L 23 19 Z
                          M 21 19.02 L 3 19.02 L 3 4.97
                          L 21 4.97 L 21 19.02 L 21 19.02 Z`;
            ariaLabel = `Resize mode (${shortcutKey})`;
            title = `Resize mode (${shortcutKey})`;
        } else {
            pathData.d = `M 19 15 L 19 7 L 11 7 Z M 23 19
                          L 23 4.98 C 23 3.88 22.1 3 21 3
                          L 3 3 C 1.9 3 1 3.88 1 4.98
                          L 1 19 C 1 20.1 1.9 21 3 21
                          L 21 21 C 22.1 21 23 20.1 23 19
                          L 23 19 Z M 21 19.02
                          L 3 19.02 L 3 4.97
                          L 21 4.97 L 21 19.02 L 21 19.02 Z`;
            ariaLabel = `Default view (${shortcutKey})`;
            title = `Default view (${shortcutKey})`;
        }
        path.setAttribute("d", pathData.d);
        btn.setAttribute("aria-label", ariaLabel);
        btn.setAttribute("title", title);
    }

    function createButton() {
        let abtn = document.querySelector(".ytp-right-controls-right");
        let btn = document.createElement("button");
        let path = document.createElement("path");
        let clickEvent = new Event("click", {
            bubbles: false
        });

        /*Start Create SVG*/
        let svg = document.createElement("svg");
        svg.setAttribute("height", "24");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "24");

        setButton(btn, path); // Decide Which Button

        path.setAttribute("fill", "white");
        svg.appendChild(path);

        const btnContent = svg.outerHTML;
        /*Finished Create SVG*/

        btn.innerHTML = btnContent;
        btn.classList.add("ytp-resize-button", "ytp-button");
        btn.setAttribute("id", "ytp-resize-button");
        btn.setAttribute("data-tooltip-target-id", "ytp-resize-button");
        abtn.insertBefore(btn, abtn.lastChild.previousSibling);

        /*Tooltip Event Handlers*/
        const showTooltip = (event) => {
            const isMouseOver = ["mouseover", "focus"].includes(event.type);
            showResizeButtonTooltip(btn, isMouseOver);
        };
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            e.preventDefault();
            buttonScript();
        }, clickEvent);
        btn.addEventListener("mouseover", showTooltip);
        btn.addEventListener("mouseout", showTooltip);
        btn.addEventListener("focus", showTooltip);
        btn.addEventListener("blur", showTooltip);
    }

    function toggleStyle(id, cssTemplate) {
        const styleElement = document.getElementById(id);
        if (styleElement && document.head.contains(styleElement)) {
            document.head.removeChild(styleElement);
        } else {
            addCss(cssTemplate, id);
        }
    }

    function buttonScript() {
        toggleStyle(
            "max-player",
            `ytd-watch-flexy[flexy]:not([full-bleed-player][full-bleed-no-max-width-columns])
        #columns.ytd-watch-flexy { max-width: 100% !important; }`
        );

        toggleStyle(
            "small-player",
            `#primary.ytd-watch-flexy:not([theater]):not([fullscreen]) {
        max-width: ${maxWidth}px !important; }`
        );
    }


    function shortScript() {
        let splayer = document.getElementById("small-player");
        if (document.head.contains(splayer)) {
            splayer.innerHTML = `#primary.ytd-watch-flexy:not([theater]):not([fullscreen]) { max-width: ${maxWidth}px !important; }`;
        } else {
            addCss(smallerCss, "small-player");
        }
        return;
    }
    /*Create Resize Button*/
    function controlResize() {
        let buttonExists = document.getElementById("ytp-resize-button");
        if (!buttonExists) {
            createButton();
            document.addEventListener("keydown", function(e) {
                let splayer = document.getElementById("small-player");
                // Common checks for all keys
                if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
                if (/^(?:input|textarea|select|button)$/i.test(e.target.tagName)) return;
                if (/(?:contenteditable-root)/i.test(e.target.id)) return;
                // Check for shortcutKey
                if (e.key == shortcutKey.toLowerCase() || e.key == shortcutKey.toUpperCase()) {
                    e.stopPropagation();
                    e.preventDefault();
                    buttonScript();
                    return;
                }
                // Check for "x" and "z" if "small-player" is in the document head
                if (document.head.contains(splayer)) {
                    if (e.key == "z") {
                        e.stopPropagation();
                        e.preventDefault();
                        maxWidth -= 20;
                        if (maxWidth <= 854) maxWidth = 854; // min-width
                        shortScript();
                    } else if (e.key == "x") {
                        e.stopPropagation();
                        e.preventDefault();
                        maxWidth += 20;
                        if (maxWidth >= window.innerWidth) maxWidth = window.innerWidth; // max-width
                        shortScript();
                    }
                }
            });
            document.addEventListener("wheel", function(e) {
                let splayer = document.getElementById("small-player");
                let player = document.getElementById("primary-inner");
                if (document.head.contains(splayer)) {
                    if (e.altKey || e.ctrlKey || e.metaKey) return;
                    if (/^(?:input|textarea|select|button)$/i.test(e.target.tagName)) return;
                    if (/(?:contenteditable-root)/i.test(e.target.id)) return;
                    if (e.shiftKey) {
                        e.stopPropagation();
                        if (e.deltaY < 0) { // Scroll Up
                            maxWidth += 20;
                            if (maxWidth >= window.innerWidth) maxWidth = window.innerWidth; // max-width
                        } else if (e.deltaY > 0) { // Scroll Down
                            maxWidth -= 20;
                            if (maxWidth <= 854) maxWidth = 854; // min-width
                        }
                        shortScript();
                    }
                }
            });
        } else {
            setButton(buttonExists, buttonExists.querySelector("path"));
        }
    }
    //==================================================================
})();