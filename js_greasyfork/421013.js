// ==UserScript==
// @name         CrunchyRoll - Cinema Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button below the video, which when pressed, places a video in 'Cinema Mode'. Cinema Mode fills the browser window with the video. Exit Cinema Mode by pressing the button at the bottom.
// @author       Anonymous
// @match        https://www.crunchyroll.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421013/CrunchyRoll%20-%20Cinema%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/421013/CrunchyRoll%20-%20Cinema%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    // Utility Functions
    //

    function addGlobalStyle(css) {
        let head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function warn(msg) {
        console.warn("[CINEMA TOGGLE] " + msg);
    }

    //
    // Begin
    //

   // Find the video container
    let domVideoContainer = document.querySelector("#showmedia_video");
    if (domVideoContainer === undefined) {
        warn("Unable to find video container, Cinema Mode is Disabled.");
        return;
    }

    // Find the button container
    let domButtonBox = document.querySelector("#main_content > :first-child");
    if (domButtonBox === undefined) {
        warn("Unable to find button container, Cinema Mode is Disabled.");
        return;
    }

    let exitButton = document.createElement("button");
    exitButton.innerHTML = "Exit Cinema Mode";
    exitButton.classList.add("cinema-exit-button");
    exitButton.classList.add("cinema-hide");
    domVideoContainer.appendChild(exitButton);

    // Function Enters Cinema Mode. The video should be full screen, and a button to exit should appear at the bottom.
    function enter_cinema_mode() {
        domVideoContainer.parentElement.classList.add("cinema-relative");
        domVideoContainer.classList.add("cinema-fullscreen");
        domVideoContainer.querySelector("#showmedia_video_box_wide").classList.add("cinema-fullscreen");

        // Hide Elements that obstruct the video
        document.querySelector("#showmedia").classList.add("cinema-hide");
        document.querySelector("#header_beta").classList.add("cinema-hide");
        document.querySelector("#footer").classList.add("cinema-hide");

        // Show Exit Button
        exitButton.classList.remove("cinema-hide");
    }

    // Function Exits Cinema Mode, which should return the site to normal operation.
    function exit_cinema_mode() {
      domVideoContainer.classList.remove("cinema-fullscreen");
      domVideoContainer.querySelector("#showmedia_video_box_wide").classList.remove("cinema-fullscreen");
      document.querySelector("#showmedia").classList.remove("cinema-hide");
      document.querySelector("#header_beta").classList.remove("cinema-hide");
      document.querySelector("#footer").classList.remove("cinema-hide");
      exitButton.classList.add("cinema-hide");
    }

    exitButton.addEventListener("click", function(event) {
      exit_cinema_mode();
    });

    // Create and add Enter Cinema Mode button to button box.
    let enterButton = document.createElement("button");
    enterButton.innerHTML = "Enter Cinema Mode";
    enterButton.classList.add("cinema-enter-button");
    enterButton.addEventListener("click", function(event) {
        enter_cinema_mode();
    });

    domButtonBox.appendChild(enterButton);

    // CSS STYLE
    addGlobalStyle(".cinema-enter-button {border-radius: 0.25rem; background-color: #f47521; color: white; border: none; outline: none; padding: 0.3em; margin: 2px; font-size: 1em; margin-left: 0.5rem; line-height: 1em; cursor: pointer;}");
    addGlobalStyle(".cinema-exit-button {border: none; background-color: #1a1a1a; color: grey; cursor: pointer;} .cinema-exit-button:hover {background-color: #1b1b1b; color: white;}");
    addGlobalStyle(".cinema-hide {display: none;}");
    addGlobalStyle(".cinema-relative {position: relative; width: 100%; height: 100%;}");
    addGlobalStyle(".cinema-fullscreen {display: flex; flex-direction: column; align-items: center; position: fixed; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; background-color: #1d1d1d;}");


})();