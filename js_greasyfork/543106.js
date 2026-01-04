// ==UserScript==
// @name         Youtube: Always seek on left/right arrow
// @namespace    https://greasyfork.org/users/61164
// @version      1.0
// @description  This script keeps focus on main video element, so seekeing and volume controls are consistent.
// @author       Last8Exile
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543106/Youtube%3A%20Always%20seek%20on%20leftright%20arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/543106/Youtube%3A%20Always%20seek%20on%20leftright%20arrow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self)
        return;

    var intervalId = null;

    function subsribeToFocusEvent()
    {
        var volumePanel = document.querySelector(".ytp-volume-panel");
        var video = document.querySelector(".html5-video-player");
        var progressBar = document.querySelector(".ytp-progress-bar");
        if (volumePanel === null || video === null || progressBar == null)
            return false;
        if (intervalId !== null)
            clearInterval(intervalId);
        volumePanel.addEventListener("focus", (event) => {
            volumePanel.blur();
            video.focus();
        });
        progressBar.addEventListener("focus", (event) => {
            progressBar.blur();
            video.focus();
        });
        return true;
    }

    if (subsribeToFocusEvent())
        return;

    intervalId = setInterval(subsribeToFocusEvent, 1000);
})();