// ==UserScript==
// @name         AO3 Direct Chapter Index and List Button (Entire Website)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  A solution to add buttons to navigate directly to the Chapter Index on AO3 work pages, chapter pages, user dashboard, bookmarks, and other users' works, styled to match existing buttons, working across the entire AO3 site.
// @author       stroke6
// @license      MIT
// @match        https://archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512966/AO3%20Direct%20Chapter%20Index%20and%20List%20Button%20%28Entire%20Website%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512966/AO3%20Direct%20Chapter%20Index%20and%20List%20Button%20%28Entire%20Website%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the "Go to Chapter Index" button on work pages
    function addButtonOnWorkPage() {
        const navContainer = document.querySelector("#main > ul.work.navigation.actions");
        const workIdMatch = window.location.href.match(/works\/(\d+)/);

        if (navContainer && workIdMatch && workIdMatch[1]) {
            const newButtonItem = document.createElement("li");
            const button = document.createElement("a");

            button.innerHTML = "Go to Chapter Index";
            button.classList.add("button");
            button.style.cursor = "pointer";
            button.href = `https://archiveofourown.org/works/${workIdMatch[1]}/navigate`;

            newButtonItem.appendChild(button);
            navContainer.appendChild(newButtonItem);
        } else {
            console.error('Work ID not found in the URL or navigation container missing.');
        }
    }

    // Function to add the "Go to Chapter Index" button on chapter pages
    function addButtonOnChapterPage() {
        const navContainer = document.querySelector("#main > div.work > ul");
        const workIdMatch = window.location.href.match(/works\/(\d+)/);

        if (navContainer && workIdMatch && workIdMatch[1]) {
            const newButtonItem = document.createElement("li");
            const button = document.createElement("a");

            button.innerHTML = "Go to Chapter Index";
            button.classList.add("button");
            button.style.cursor = "pointer";
            button.href = `https://archiveofourown.org/works/${workIdMatch[1]}/navigate`;

            newButtonItem.appendChild(button);
            navContainer.appendChild(newButtonItem);
        } else {
            console.error('Work ID not found in the URL or navigation container missing.');
        }
    }

    // Function to add a 'Chapter Index' button on the user dashboard
    function addButtonOnDashboard() {
        const workElements = document.querySelectorAll('[id^="work_"] ul.actions');

        workElements.forEach(function(workElement) {
            const workId = workElement.closest('[id^="work_"]').id.replace('work_', '');
            if (workId) {
                const smallButton = document.createElement("a");
                smallButton.innerHTML = "Chapter Index";
                smallButton.classList.add("button");
                smallButton.style.cursor = "pointer";
                smallButton.href = `https://archiveofourown.org/works/${workId}/navigate`;

                workElement.appendChild(smallButton);
            }
        });
    }

    // Function to add "Chapter Index" text link to works or bookmarks
    function addChapterListLinkToWorksOrBookmarks() {
        const bookmarkElements = document.querySelectorAll('[id^="bookmark_"] dl');
        const workElements = document.querySelectorAll('[id^="work_"] dl');

        // For bookmarks
        bookmarkElements.forEach(function(bookmarkElement) {
            const bookmarkId = bookmarkElement.closest('[id^="bookmark_"]').id.replace('bookmark_', '');
            const workId = bookmarkElement.querySelector('a[href*="/works/"]').href.match(/works\/(\d+)/)[1];

            if (workId) {
                const chapterListElement = document.createElement("dd");
                const chapterListLink = document.createElement("a");

                chapterListLink.innerHTML = "Chapter Index";
                chapterListLink.href = `https://archiveofourown.org/works/${workId}/navigate`;
                chapterListLink.style.cursor = "pointer";

                chapterListElement.appendChild(chapterListLink);
                bookmarkElement.appendChild(chapterListElement);
            }
        });

        // For works
        workElements.forEach(function(workElement) {
            const workId = workElement.closest('[id^="work_"]').id.replace('work_', '');

            if (workId) {
                const chapterListElement = document.createElement("dd");
                const chapterListLink = document.createElement("a");

                chapterListLink.innerHTML = "Chapter Index";
                chapterListLink.href = `https://archiveofourown.org/works/${workId}/navigate`;
                chapterListLink.style.cursor = "pointer";

                chapterListElement.appendChild(chapterListLink);
                workElement.appendChild(chapterListElement);
            }
        });
    }

    // Update handlePage function to detect chapter pages and add buttons accordingly
    function handlePage() {
        const currentURL = window.location.href;

        if (currentURL.includes("/works/") && currentURL.includes("/chapters/")) {
            // For chapter pages
            addButtonOnChapterPage();
        }

        else if (currentURL.includes("/works/")) {
            // For work pages
            addButtonOnWorkPage();
            addChapterListLinkToWorksOrBookmarks();
        }

        else if (currentURL.includes("/collections/")) {
            // For collections
            addButtonOnWorkPage();
            addButtonOnDashboard();
            addChapterListLinkToWorksOrBookmarks();
        }

        else if (currentURL.includes("/users/")) {
            // For user-specific pages (dashboard, etc.)
            addButtonOnDashboard();
            addChapterListLinkToWorksOrBookmarks();
        }

        else if (currentURL.includes("/bookmarks/")) {
            // For bookmarks
            addChapterListLinkToWorksOrBookmarks();
        }
        else {
            // For other pages where works might be listed, such as tags
            addChapterListLinkToWorksOrBookmarks();
        }
    }

    // Run the handler when the page loads
    window.onload = function() {
        handlePage();
    };

})();
