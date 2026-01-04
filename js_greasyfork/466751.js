// ==UserScript==
// @name         Google Classroom Dark Mode
// @description  Enables dark mode for Google Classroom.
// @version      1.0
// @icon         https://www.google.com/favicon.ico
// @author       blank
// @namespace    https://google.com
// @match        https://classroom.google.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466751/Google%20Classroom%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/466751/Google%20Classroom%20Dark%20Mode.meta.js
// ==/UserScript==
(function() {
    "use strict";
 
    const log = console.log;
 
    // Get the dark mode setting.
    const darkModeSetting = localStorage.getItem("darkMode");
 
    // If the dark mode setting is enabled, set the dark mode property of the document to true.
    if (darkModeSetting === "true") {
        document.documentElement.classList.add("dark");
    }
 
    // Listen for the change event on the dark mode setting.
    document.querySelector("#darkMode").addEventListener("change", () => {
 
        // Get the new value of the dark mode setting.
        const newDarkModeSetting = document.querySelector("#darkMode").checked;
 
        // Set the dark mode property of the document to the new value.
        document.documentElement.classList.toggle("dark", newDarkModeSetting);
 
        // Save the new value of the dark mode setting.
        localStorage.setItem("darkMode", newDarkModeSetting);
    });
})();
