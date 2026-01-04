// ==UserScript==
// @name         Webpage Scroll Progress Bar
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add an animated smooth webpage scroll progress bar and remove footers
// @match        *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483231/Webpage%20Scroll%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/483231/Webpage%20Scroll%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the progress bar element and style it
    const progressBar = document.createElement("div");
    progressBar.style.position = "fixed";
    progressBar.style.bottom = "0";
    progressBar.style.left = "0";
    progressBar.style.width = "0";
    progressBar.style.zIndex = "9999";
    progressBar.style.height = "3px";
    progressBar.style.backgroundColor = "red";
    progressBar.style.transition = "width 0.1s ease-out";
    progressBar.style.borderRadius = "10px"; // Rounded corners

    document.body.appendChild(progressBar);

    // Update progress bar on scroll
    window.addEventListener("scroll", () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollableHeight) * 100;
        progressBar.style.width = scrollProgress + "%";

        // Change color based on scroll progress
        const color = `rgb(${250 - scrollProgress * 2.55}, 0, ${scrollProgress * 9.55})`;
        progressBar.style.backgroundColor = color;
    });

    // Function to remove footers
    function removeFooters() {
        const footers = document.querySelectorAll('footer'); // Adjust selector as needed
        footers.forEach(footer => {
            footer.remove(); // Remove the footer element
        });
    }

    // Call removeFooters function when the document is ready
    document.addEventListener('DOMContentLoaded', removeFooters);
})();
