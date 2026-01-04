// ==UserScript==
// @name         Auto Next Youtube Video
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically click Play Now on the autoplay screen
// @author       Shadoweb
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495399/Auto%20Next%20Youtube%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/495399/Auto%20Next%20Youtube%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var detectInterval;

    const header = "%cYOUTUBE AUTO PLAY";
    const headerStyle = "background-color: #FF0000; color: #FFFFFF; font-size: 2em;";

    console.info(header, headerStyle, "Starting Youtube AutoPlay Detector...");

    // ytp-autonav-toggle-button
    // aria-checked = true

    var autoplayButtonContainer;
    var autoplayButton;
    var containers;
    detectInterval = setInterval(() => {
        autoplayButtonContainer = document.querySelector(".ytp-autonav-toggle-button-container");
        autoplayButton = autoplayButtonContainer.querySelector(".ytp-autonav-toggle-button");
        if (autoplayButton.getAttribute("aria-checked")) {
            containers = document.getElementsByClassName("ytp-autonav-endscreen-countdown-container ytp-autonav-endscreen-upnext-no-alternative-header ytp-player-content");
            if (containers.length > 0) {
                var container = containers[0];
                console.info(header, headerStyle, "Found the button, clicking now...");
                var buttons = container.querySelector(".ytp-autonav-endscreen-button-container");
                console.info(header, headerStyle, buttons);
                var playNow = buttons.querySelector("a");
                console.info(header, headerStyle, playNow);
                const clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", true, true);
                playNow.dispatchEvent(clickEvent);
            }
        }
    }, 100);
})();