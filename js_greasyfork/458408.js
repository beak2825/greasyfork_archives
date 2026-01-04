// ==UserScript==
// @name         Clean Chegg
// @description  Formats Chegg pages nicely
// @version      2.7
// @author       bhackel
// @homepageURL  https://github.com/bhackel/cheggbog
// @match        https://*.chegg.com/homework-help/*
// @icon         https://www.google.com/s2/favicons?domain=chegg.com
// @namespace    https://github.com/bhackel/cheggbog
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458408/Clean%20Chegg.user.js
// @updateURL https://update.greasyfork.org/scripts/458408/Clean%20Chegg.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        let elem;

        // Main page formatting
        elem = document.querySelector("#__next > div > div > div");
        if (elem) elem.style.margin = 0; // Removes auto centering of content
        document.querySelector("#chegg-main-content > form")?.remove(); // Removes the search box at the top of the page
        document.querySelector("#__next > div > div > div > header")?.remove(); // Removes the title bar at the top of the page
        document.querySelector("#chegg-main-content > div > div > div:nth-child(2)")?.remove(); // Removes the right sidebar
        document.querySelector("#__next > div > footer")?.remove() // Removes the footer
        document.querySelector("#chegg-main-content > div > div > div > div > div:nth-child(3)")?.remove(); // Removes "Up next in your courses" above footer
        document.querySelector("#chegg-main-content > div > div > div > div > div:nth-child(3)")?.remove(); // Removes "Post a Question" box
        document.querySelector("#__next > div > div > nav")?.remove() // Removes side navigation bar
        // Specific removes for textbook pages (only applies to hw/
        const link = window.location.href;
        if (link.startsWith("https://www.chegg.com/homework-help/questions-and-answers/")) {
            document.querySelector('#chegg-main-content > div > div > div > div > div:nth-child(2)')?.remove() // Removes the lower "Post a Question"
        }

        document.querySelector('#__next > div > div > div > nav')?.remove() // Remove the left sidebar
        document.querySelector('#__next > div > div > div > div > header')?.remove() // Remove the new header
        document.querySelector('#D_B1')?.remove() // Remove the new advertisement at the bottom


        // Details
        elem = document.querySelector("#chegg-main-content > div > div > div > div > div:nth-child(1) > section > div > div > div:nth-child(2) > div");
        if (elem) elem.style.maxWidth = "none"; // Allows question text to be infinitely wide
        elem = document.querySelector("#chegg-main-content");
        if (elem) elem.style.padding = "5px"; // Shrinks main content padding
        elem = document.querySelector("#chegg-main-content > div > div");
        if (elem) elem.style.display = "inline" // Makes content fill entire width of the page (up to a max set below)
        elem = document.querySelector("#chegg-main-content")
        if (elem) elem.style.width = "960px"; // Sets the width of the main content, change this according to the width of the window

        // Makes thumbs up/down more visible
        let thumbsDiv = document.querySelector('#qna-answer-rating-container > div');
        if (thumbsDiv) {
            thumbsDiv.style.fontSize = "75px";
        }

        // Repeatedly search for "All Steps" and click Show all steps once it has loaded
        let stepsInterval = setInterval(function() {
            let button;
            const divs = document.getElementsByTagName("div");
            // Loop through all divs and find the one with text "All steps"
            for (let i = 0; i < divs.length; i++) {
                if (divs[i].textContent === "All steps") {
                    button = divs[i];
                    break;
                }
            }
            // Click button if found
            if (button) {
                button.click();
                clearInterval(stepsInterval); // stop clicking when successful
            }
        }, 1000);

        // Increase size of images when they are small for some reason
        elem = document.querySelector('#chegg-main-content > div > div > div > div > div:nth-child(2) > section')
        if (elem) {
            let ansImgLst = Array.from(elem.querySelectorAll('img')).slice(1); // get all images except some chegg one
            for (let img of ansImgLst) {
                if (parseInt(img.style.width, 10) < 600) {
                    img.style.width = '600px'
                }
            }
        }

    }, 4000) // Increase this delay for slower internet connections and page loading times
})();