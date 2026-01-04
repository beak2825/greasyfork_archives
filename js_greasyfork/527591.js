// ==UserScript==
// @name         Hide UI while Seeking and Seek time changer (Prime Video)
// @namespace    Likheet
// @version      1
// @description  Prevents UI pop-up when seeking with arrow keys and integrates seek time control into Amazon Prime Video's UI.
// @author       You
// @match        *://*.primevideo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527591/Hide%20UI%20while%20Seeking%20and%20Seek%20time%20changer%20%28Prime%20Video%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527591/Hide%20UI%20while%20Seeking%20and%20Seek%20time%20changer%20%28Prime%20Video%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let seekTime = localStorage.getItem("seekTime") ? parseInt(localStorage.getItem("seekTime")) : 10;

    function addSeekTimeControl() {
        let container = document.querySelector(".atvwebplayersdk-timeindicator-text");
        let totalTimeSpan = container ? container.querySelector("span") : null;
        if (!container || !totalTimeSpan) return setTimeout(addSeekTimeControl, 1000);

        if (document.getElementById("custom-seek-time")) return;

        let seekTimeElement = document.createElement("span");
        seekTimeElement.id = "custom-seek-time";
        seekTimeElement.innerText = ` | Seek: ${seekTime}s`;
        seekTimeElement.style.cursor = "pointer";
        seekTimeElement.style.marginLeft = "10px";
        seekTimeElement.style.fontSize = "14px";
        seekTimeElement.style.color = "#ffffff";
        seekTimeElement.style.opacity = "0.7";

        seekTimeElement.addEventListener("click", function() {
            let newTime = prompt("Enter seek time in seconds:", seekTime);
            if (newTime !== null && !isNaN(newTime) && newTime > 0) {
                seekTime = parseInt(newTime);
                localStorage.setItem("seekTime", seekTime);
                seekTimeElement.innerText = ` | Seek: ${seekTime}s`;
            }
        });

        totalTimeSpan.insertAdjacentElement("afterend", seekTimeElement);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.stopPropagation();
            e.preventDefault();
            let video = document.querySelector("video");
            if (video) {
                video.currentTime += (e.key === "ArrowRight" ? seekTime : -seekTime);
            }
        }
    }, true);

    setTimeout(addSeekTimeControl, 3000);
})();
