// ==UserScript==
// @name         Nimo TV Better Theater Mode
// @namespace    http://tampermonkey.net/
// @version      v0.1-alpha
// @description  Automatically toggle theater mode on Nimo TV
// @author       You
// @match        https://www.nimo.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nimo.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514058/Nimo%20TV%20Better%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/514058/Nimo%20TV%20Better%20Theater%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideSidebar() {
        const sidebar = document.querySelector(".nimo-room__main__sider");
        if (sidebar) {
            sidebar.style.display = "none";
            console.log("Sidebar hidden.");
        } else {
            console.log("Sidebar not found, retrying...");
        }
    }

     function betterTheaterMode() {
        const sidebar = document.querySelector(".nimo-room__theater-section");
        if (sidebar) {
            sidebar.style.width = "100%";
            console.log("Maximize Theater mode on");
        } else {
            console.log("Script failse, retry.....");
        }
    }

    function toggleTheaterMode() {
        const TheaterModeQueries = document.querySelector("div.theater-control");
        if (TheaterModeQueries) {
            const theaterButton = TheaterModeQueries.getElementsByClassName("nimo-icon nimo-icon-web-theater-off");
            if (theaterButton.length > 0) {
                theaterButton[0].click();
                hideSidebar();
                betterTheaterMode();
            } else {
                console.log("Already in Theater Mode");
            }
        } else {
            console.log("Theater mode control not found, retrying...");
        }
    }

    // Check for the theater mode button every second until it is found and clicked
    const checkInterval = setInterval(() => {
        toggleTheaterMode();
    }, 1000);

    // Stop checking once theater mode is toggled
    setTimeout(() => clearInterval(checkInterval), 10000); // Stop trying after 10 seconds
})();
