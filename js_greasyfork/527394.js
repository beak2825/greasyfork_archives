// ==UserScript==
// @name         Scratch Wiper & Redirector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wipes the Scratch front page and changes the username to "666". Redirects other Scratch pages to a specific URL.
// @author       You
// @match        *://scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527394/Scratch%20Wiper%20%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/527394/Scratch%20Wiper%20%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if on the Scratch homepage
    if (window.location.pathname === "/") {
        // Wipe the whole front page
        document.body.innerHTML = "";

        // Create a fake username display
        let username = document.createElement("div");
        username.textContent = "Logged in as: 666";
        username.style.position = "fixed";
        username.style.top = "10px";
        username.style.left = "10px";
        username.style.background = "black";
        username.style.color = "red";
        username.style.padding = "10px";
        username.style.fontSize = "20px";
        username.style.fontWeight = "bold";
        document.body.appendChild(username);
    } else {
        // Redirect any other page to the specified URL
        window.location.href = "https://scratch.mit.edu/666";
    }
})();
