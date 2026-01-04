// ==UserScript==
// @name         Programming Advices Enhancer
// @namespace    http://tampermonkey.net/
// @version      2025-01-08
// @description  Extract and show total course lectures and durations.
// @author       Muhannad Elbolaky
// @license      MIT
// @match        https://programmingadvices.com/p/*
// @match        https://programmingadvices.com/courses/enrolled/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=programmingadvices.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527477/Programming%20Advices%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/527477/Programming%20Advices%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Wait for specific elements to load in the DOM and invoke a callback when they are found.
     * @param {string} selector - CSS selector for the target elements.
     * @param {Function} callback - Function to execute once the elements are loaded.
     */
    function waitForElements(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                obs.disconnect(); // Stop observing once the elements are found.
                callback(elements);
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Calculate the total duration from a list of elements containing duration text.
     * @param {NodeList} elements - A NodeList of elements containing the duration text in (HH:MM:SS) or (MM:SS) format.
     * @returns {string} - Formatted total duration (e.g., "2.5 ساعة" or "150 دقيقة").
     */
    function calculateTotalDuration(elements) {
        let totalSeconds = 0;

        elements.forEach((element) => {
            const durationText = element.textContent.trim();
            const match = durationText.match(/\((\d{1,2}):(\d{2})(?::(\d{2}))?\)/); // Match durations like (MM:SS) or (HH:MM:SS)
            if (match) {
                let hours = 0;
                let minutes = parseInt(match[1], 10); // Default to MM
                let seconds = parseInt(match[2], 10); // Always parse SS

                if (match[3]) {
                    hours = minutes; // When there are three parts, MM becomes HH.
                    minutes = parseInt(match[2], 10);
                    seconds = parseInt(match[3], 10);
                }

                totalSeconds += hours * 3600 + minutes * 60 + seconds;
            }
        });

        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = totalMinutes / 60;

        return totalHours >= 1
            ? `${totalHours.toFixed(1)} ساعة`
            : `${totalMinutes} دقيقة`;
    }

    /**
     * Count the number of lectures from the provided elements.
     * @param {NodeList} elements - A NodeList of elements representing lectures.
     * @returns {number} - The total number of lectures.
     */
    function countLectures(elements) {
        return elements.length;
    }

    // /p/*
    function handlePLecturePage() {
        waitForElements(".block__curriculum__section__list__item__lecture-duration", (durationElements) => {
            const formattedDuration = calculateTotalDuration(durationElements);
            const lectureCount = countLectures(durationElements);

            const titleElement = document.querySelector(".block__curriculum__title");
            if (titleElement) {
                const infoElement = document.createElement("div");
                infoElement.innerHTML = `مدة الكورس: ${formattedDuration} <br> عدد المحاضرات: ${lectureCount}`;
                infoElement.style.marginTop = "0.6rem";
                titleElement.prepend(infoElement);
            }
        });
    }

    // /courses/enrolled/*
    function handleEnrolledCoursesPage() {
        waitForElements("p.duration, h1.heading", () => {
            const durationElements = document.querySelectorAll("p.duration");
            const headingElement = document.querySelector("h1.heading");

            if (durationElements.length > 0 && headingElement) {
                const formattedDuration = calculateTotalDuration(durationElements);
                const lectureCount = countLectures(durationElements);

                const newHeadingElement = document.createElement("h3");
                newHeadingElement.innerHTML = `مدة الكورس: ${formattedDuration} <br> عدد المحاضرات: ${lectureCount}`;
                newHeadingElement.style.textAlign = "center";
                newHeadingElement.style.fontSize = "1.75rem";
                newHeadingElement.style.color = "#333";
                newHeadingElement.style.border = "2px solid";
                newHeadingElement.style.padding = "15px";
                newHeadingElement.style.margin = "20px auto";
                newHeadingElement.style.borderRadius = "10px";
                newHeadingElement.style.width = "80%";
                newHeadingElement.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

                headingElement.insertAdjacentElement('afterend', newHeadingElement);
            }
        });
    }

    // Check the current page URL and apply the appropriate enhancements.
    if (window.location.pathname.startsWith("/p/")) {
        handlePLecturePage();
    } else if (window.location.pathname.startsWith("/courses/enrolled/")) {
        handleEnrolledCoursesPage();
    }
})();