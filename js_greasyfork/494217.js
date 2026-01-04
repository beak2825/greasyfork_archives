// ==UserScript==
// @name         Save Exhentai's reading status
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button that saves Exhentai's reading status and a button to open galleries in the background.
// @author       megu10
// @match        https://exhentai.org/
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/494217/Save%20Exhentai%27s%20reading%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/494217/Save%20Exhentai%27s%20reading%20status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- State Variable ---
    // To hold the ID of the setInterval so we can stop it.
    let scrollIntervalId = null;

    // --- 1. UI Setup ---
    const topPane = document.getElementById("toppane");
    if (!topPane) {
        console.error("Save Progress Script: Could not find the '#toppane' element.");
        return;
    }
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.left = "30px";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "15px";

    // "Save Progress" Button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Progress";
    Object.assign(saveButton.style, {
        backgroundColor: "#34353b",
        color: "#f1f1f1",
        fontWeight: 'bold',
        borderColor: "transparent",
        fontFamily: "Arial",
        cursor: "pointer",
        padding: "5px 10px"
    });

    // "Scroll to Last" Button
    const scrollButton = document.createElement("button");
    scrollButton.textContent = "Scroll to Last";
    Object.assign(scrollButton.style, {
        backgroundColor: "#555",
        color: "#f1f1f1",
        fontWeight: 'bold',
        borderColor: "transparent",
        fontFamily: "Arial",
        cursor: "pointer",
        padding: "5px 10px"
    });

    const timeText = document.createElement("div");
    timeText.textContent = "No saved time";
    Object.assign(timeText.style, {
        fontSize: "20px",
        fontFamily: "Arial"
    });

    container.appendChild(saveButton);
    container.appendChild(scrollButton);
    container.appendChild(timeText);
    topPane.appendChild(container);


    // --- 2. Core Functions ---

    function getFormattedUTCTime() {
        const now = new Date();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    }

    function highlightLastViewed() {
        const savedTimeStr = localStorage.getItem('saved_time_text');
        if (!savedTimeStr) return null;

        const oldMarker = document.querySelector('.last-viewed-marker');
        if (oldMarker) {
            oldMarker.classList.remove('last-viewed-marker');
            oldMarker.style.backgroundColor = '';
        }

        const galleries = document.querySelectorAll('.gl1t');
        if (galleries.length === 0) return null;

        const currentYear = new Date().getUTCFullYear();
        const savedDateTime = new Date(`${currentYear}-${savedTimeStr}Z`);

        for (const gallery of galleries) {
            const timeElement = gallery.querySelector('.gl5t div div[id^="posted_"]');
            if (timeElement) {
                const galleryTime = new Date(timeElement.textContent + 'Z');
                if (galleryTime < savedDateTime) {
                    gallery.style.backgroundColor = '#8e3424';
                    gallery.classList.add('last-viewed-marker');
                    return gallery;
                }
            }
        }
        return null;
    }

    function scrollToMarker(markerElement) {
        if (!markerElement) return;
        markerElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    function stopScrollingSearch() {
        if (scrollIntervalId) {
            clearInterval(scrollIntervalId);
            scrollIntervalId = null;
            scrollButton.textContent = "Scroll to Last";
            scrollButton.disabled = false;
            console.log("Scrolling search stopped.");
            window.removeEventListener('wheel', stopScrollingSearch);
            window.removeEventListener('touchstart', stopScrollingSearch);
        }
    }

    function startScrollingSearch() {
        if (scrollIntervalId) return;

        scrollButton.textContent = "Searching... (Scroll to Stop)";
        scrollButton.disabled = true;

        window.addEventListener('wheel', stopScrollingSearch, { once: true });
        window.addEventListener('touchstart', stopScrollingSearch, { once: true });

        scrollIntervalId = setInterval(() => {
            const marker = highlightLastViewed();
            if (marker) {
                console.log("Marker found. Scrolling into view.");
                scrollToMarker(marker);
                stopScrollingSearch();
            } else {
                window.scrollBy(0, window.innerHeight * 0.8);
            }
        }, 500);
    }

    // --- NEW FUNCTIONALITY START (REVISED) ---

    /**
     * Creates and adds an "Open in BG" button to a single gallery element.
     * @param {HTMLElement} galleryElement The .gl1t element for a gallery.
     */
    function addOpenInBackgroundButton(galleryElement) {
        // Prevent adding a button if it already exists
        if (galleryElement.querySelector('.open-in-bg-container')) {
            return;
        }

        const galleryLink = galleryElement.querySelector('a');
        if (!galleryLink) {
            return;
        }
        const galleryUrl = galleryLink.href;

        // Create the button
        const bgButton = document.createElement('button');
        bgButton.textContent = 'Open in BG';
        Object.assign(bgButton.style, {
            backgroundColor: '#555',
            color: '#f1f1f1',
            border: '1px solid #777',
            cursor: 'pointer',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            borderRadius: '3px'
        });

        // --- CORRECTED LOGIC (FOCUS) ---
        // Use the special GM_openInTab function which is designed for this.
        // The { active: false } option is crucial for opening it in the background.
        bgButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            GM_openInTab(galleryUrl, { active: false, setParent: true });
        });

        // --- CORRECTED LOGIC (PLACEMENT) ---
        // Create a new, separate container for the button
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('open-in-bg-container');
        Object.assign(buttonContainer.style, {
            textAlign: 'right', // Align button to the right
            padding: '4px',     // Give it some space
        });

        // Add the button to our new container
        buttonContainer.appendChild(bgButton);

        // Add the container to the main gallery element. This places it at the bottom.
        galleryElement.appendChild(buttonContainer);
    }

    /**
     * Finds all gallery elements on the page and adds the "Open in BG" button to them.
     */
    function processGalleriesForNewButton() {
        const allGalleries = document.querySelectorAll('.gl1t');
        allGalleries.forEach(addOpenInBackgroundButton);
    }

    // --- NEW FUNCTIONALITY END ---


    // --- 3. Event Handlers and Initialization ---

    const savedTime = localStorage.getItem('saved_time_text');
    if (savedTime) {
        timeText.textContent = savedTime;
        scrollButton.disabled = false;
    } else {
        scrollButton.disabled = true;
        scrollButton.style.cursor = 'not-allowed';
    }

    highlightLastViewed();

    saveButton.addEventListener("click", function() {
        const newTime = getFormattedUTCTime();
        localStorage.setItem('saved_time_text', newTime);
        timeText.textContent = newTime;
        highlightLastViewed();
        scrollButton.disabled = false;
        scrollButton.style.cursor = 'pointer';
    });

    scrollButton.addEventListener("click", startScrollingSearch);

    const observer = new MutationObserver(function() {
        highlightLastViewed();
        processGalleriesForNewButton(); // <-- Add buttons to newly loaded galleries
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // --- Final Initialization ---
    processGalleriesForNewButton(); // <-- Run once for galleries on initial load

})();