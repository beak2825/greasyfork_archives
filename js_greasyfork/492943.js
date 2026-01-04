// ==UserScript==
// @name         LinkedIn Job Navigator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Navigate LinkedIn jobs and pages using arrow keys (up and down to navigate jobs, left and right to navigate pages), and apply to jobs with 'S' key press.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @match        *://www.linkedin.com/jobs/*
// @match        *://*.linkedin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492943/LinkedIn%20Job%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/492943/LinkedIn%20Job%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentIndex = 0;

    document.addEventListener('keydown', function(event) {
        // Navigate job listings on LinkedIn Jobs page
        if (window.location.href.includes('www.linkedin.com/jobs/')) {
            let jobLists = document.querySelectorAll(".job-card-container");

            if (!jobLists.length) return;

            switch(event.key) {
                case "ArrowDown":
                    if (currentIndex < jobLists.length - 1) {
                        currentIndex++;
                        jobLists[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        jobLists[currentIndex].click(); // Simulate click to select the job.
                    }
                    break;
                case "ArrowUp":
                    if (currentIndex > 0) {
                        currentIndex--;
                        jobLists[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        jobLists[currentIndex].click(); // Simulate click to select the job.
                    }
                    break;
                case "s":
                    // Simulate click to apply for the selected job
                    let applyButton = document.querySelector(".jobs-apply-button");
                    if (applyButton) {
                        applyButton.click();
                    } else {
                        alert("Apply button not found. Please select a job first.");
                    }
                    break;
            }
        }

        // Navigate LinkedIn pages
        if (window.location.href.includes('linkedin.com/')) {
            if (event.key === "ArrowRight") {
                // Logic for moving to the next page
                const nextPageElement = document.querySelector('.active').nextElementSibling;
                if (nextPageElement) {
                    nextPageElement.querySelector('button').click();
                }
            } else if (event.key === "ArrowLeft") {
                // Logic for moving to the previous page
                const previousPageElement = document.querySelector('.active').previousElementSibling;
                if (previousPageElement) {
                    previousPageElement.querySelector('button').click();
                }
            }
        }
    });
})();
