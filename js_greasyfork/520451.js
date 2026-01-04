// ==UserScript==
// @name        YouTube Picture-in-Picture
// @description Add a button to enable Picture-in-Picture mode on YouTube
// @author      dinoosauro
// @license     mit
// @match       *://*.youtube.com/*
// @version     1.0.3
// @namespace   https://github.com/dinoosauro/yt-picture-in-picture-trigger
// @downloadURL https://update.greasyfork.org/scripts/520451/YouTube%20Picture-in-Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/520451/YouTube%20Picture-in-Picture.meta.js
// ==/UserScript==

(() => {
    const isMobile = window.location.hostname.startsWith("m.");
    const selector = isMobile ? ".slim-video-action-bar-actions" : "ytd-watch-metadata ytd-menu-renderer #top-level-buttons-computed";
    /**
     * The main container for the button
     */
    const main = document.createElement(`${isMobile ? "" : "yt-"}button-view-model`);
    isMobile ? main.classList.add("yt-spec-button-view-model", "slim_video_action_bar_renderer_button") : main.classList.add("ytd-menu-renderer");
    main.onclick = () => {
        document.pictureInPictureElement ? document.exitPictureInPicture() : document.querySelector("video").requestPictureInPicture();
    };
    /**
     * Checks if the Picture-in-Picture button has been appended to the div
     */
    const checkIfMainAppended = () => Array.from(document.querySelector(selector)?.children ?? []).includes(main);
    /**
     * Create the Picture-in-Picture button
     */
    const mainFn = (() => {
        if (main.childElementCount === 0) {
            isMainCreated = true;
            const btnView = document.createElement(isMobile ? "yt-button-shape" : "button-view-model");
            isMobile ? btnView.classList.add("yt-spec-button-shape-next__button-shape-wiz-class") : btnView.classList.add("yt-spec-button-view-model", "style-scope", "ytd-menu-renderer");
            const btn = document.createElement("button");
            btn.classList.add("yt-spec-button-shape-next", "yt-spec-button-shape-next--tonal", "yt-spec-button-shape-next--mono", "yt-spec-button-shape-next--size-m", "yt-spec-button-shape-next--icon-leading");

            // The Picture-in-Picture icon, provided from Microsoft's Fluent UI Icons (since Google's Material Design icons are too big)
            const iconContainer = document.createElement("div");
            iconContainer.classList.add("yt-spec-button-shape-next__icon");
            iconContainer.setAttribute("aria-hidden", "true");
            const c3Icon = Object.assign(document.createElement("c3-icon"), { style: "width: 24px; height: 24px;" });
            const shapeSpan = document.createElement("span");
            shapeSpan.classList.add("yt-icon-shape", "yt-spec-icon-shape");
            const shapeDiv = Object.assign(document.createElement("div"), {
                style: "width: 100%; height: 100%; display: block; fill: currentcolor;",
            });

            // Add svg properties for the icon
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            for (const [key, val] of [["enable-background", "new 0 0 24 24"], ["height", "24"], ["viewBox", "0 0 24 24"], ["width", "24"], ["focusable", "false"], ["aria-hidden", "true"], ["style", "pointer-events: none; display: inherit; width: 100%; height: 100%;"]]) svg.setAttribute(key, val);
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M2 6.25C2 4.45507 3.45507 3 5.25 3H18.75C20.5449 3 22 4.45507 22 6.25V12H20.5V6.25C20.5 5.2835 19.7165 4.5 18.75 4.5H5.25C4.2835 4.5 3.5 5.2835 3.5 6.25V15.75C3.5 16.7165 4.2835 17.5 5.25 17.5H11V19H5.25C3.45507 19 2 17.5449 2 15.75V6.25ZM14 13C12.8954 13 12 13.8954 12 15V20C12 21.1046 12.8954 22 14 22H21C22.1046 22 23 21.1046 23 20V15C23 13.8954 22.1046 13 21 13H14Z"); // Icon from Fluent UI System Icons: https://github.com/microsoft/fluentui-system-icons/blob/main/assets/Picture%20In%20Picture/SVG/ic_fluent_picture_in_picture_24_regular.svg
            svg.append(path);
            shapeDiv.append(svg);
            
            shapeSpan.append(shapeDiv);
            c3Icon.append(shapeSpan);
            iconContainer.append(c3Icon);

            // Create the "Picture-in-Picture" text
            const text = Object.assign(document.createElement("div"), { textContent: "Picture-in-Picture" });
            text.classList.add("yt-spec-button-shape-next__button-text-content");


            // Touch annimation div
            const touch = Object.assign(document.createElement("yt-touch-feedback-shape"), { style: "border-radius: inherit;" });
            const touchDiv = document.createElement("div");
            touchDiv.classList.add("yt-spec-touch-feedback-shape", "yt-spec-touch-feedback-shape--touch-response");

            // Append everything to the main div
            touch.append(touchDiv);
            btn.append(iconContainer, text, touchDiv);
            btnView.append(btn);
            main.append(btnView);
        }
        if (!checkIfMainAppended()) {
            document.querySelector(selector).append(main);
            setTimeout(() => {
                window.dispatchEvent(new Event("resize")); // Fix display overflow issues in the button div by simulating a window resize.
            }, 100);
        }
    });


    setInterval(() => {
        // Add again the Picture-in-Picture button if it's no longer there (but there's a valid selector)
        !checkIfMainAppended() && document.querySelector(selector) && mainFn();
    }, 1000);


})()
