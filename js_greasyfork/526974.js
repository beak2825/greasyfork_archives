// ==UserScript==
// @name         Bird Species Image Preview
// @namespace    http://tampermonkey.net/
// @version      3.2.8
// @description  Show Flickr images when hovering over bird species names (IOC nomenclature) on a webpage.
// @author       Isidro Vila Verde
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.flickr.com
// @connect      api.github.com
// @connect      flickr.com
// @connect      live.staticflickr.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526974/Bird%20Species%20Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/526974/Bird%20Species%20Image%20Preview.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // Generate a random postfix for IDs to avoid conflicts
    const randomPostfix = `_${Math.random().toString(36).substring(2, 9)}`; // e.g., "_a1b2c3d"

    // Constants and Configurations
    const FLICKR_API_KEY = 'c161f42fac23abc42328d8abd9f14fc5';
    const GISTID = ['70598ae6bef6da21ade780c12d907452','d31217a5c802d1018893907df29d1d45','01ce512accba1ebd38be9f6b301e437c'];
    const API_CALL_DELAY = 300; // 300 milliseconds delay between API calls
    const DEBOUNCE_DELAY = 300; // Debounce delay for mouseover events
    const highlightColor = GM_getValue('highlightColor', 'yellow')
    let speciesList = GM_getValue('speciesList', []);
    // Default sort order
    let currentSortOrder = GM_getValue('flickrSortOrder', 'interestingness-desc');
    // Default search mode
    let currentSearchMode = GM_getValue('flickrSearchMode', 'tags');


    // State Variables
    let currentIndex = 0;
    let currentImages = [];
    let popupVisible = false;
    let observer;
    let observerActive = false;
    let lastApiCallTime = 0;
    let cursorPosition = { x: 0, y: 0 };
    let isKeydownListenerAdded = false;

    console.log('Script loaded.');

    // Initialize the script
    async function initializeScript() {
        console.log('Initializing script.');

        // Try to load speciesList from GitHub Gists
        if (speciesList.length === 0) {
            let mergedSpeciesList = [];

            for (const gistId of GISTID) { // Iterate over multiple Gist IDs
                console.log(`Get names from gist ${gistId}`);
                const gistUrl = `https://api.github.com/gists/${gistId}`;
                try {
                    const gistData = await gmFetch(gistUrl); // Reuse gmFetch function
                    const speciesSubset = loadAndMergeSpeciesLists(gistData); // Load, merge, sort, and deduplicate
                    mergedSpeciesList.push(...speciesSubset);
                } catch (error) {
                    console.warn(`Failed to load or process species list from Gist ${gistId}:`, error);
                }
            }

            // Remove duplicates and sort
            speciesList = [...new Set(mergedSpeciesList)].sort((a, b) => a.localeCompare(b));
            console.log(`Species list loaded and processed: ${speciesList.length} unique names`);

            // Cache the speciesList
            GM_setValue('speciesList', speciesList);
        }
    }

    // Function to load, merge, sort, and deduplicate species lists from Gist files
    function loadAndMergeSpeciesLists(gistData) {
        const mergedList = [];

        // Iterate over all files in the Gist
        for (const file of Object.values(gistData.files)) {
            // Check if the file name matches 'birdnames'
            if (file.filename.includes('birdnames')) {
                try {
                    // Parse the file content as JSON and add to the merged list
                    const content = JSON.parse(file.content);
                    if (Array.isArray(content)) {
                        mergedList.push(...content);
                    } else {
                        console.warn(`File ${file.filename} does not contain a valid array.`);
                    }
                } catch (error) {
                    console.error(`Error parsing file ${file.filename}:`, error);
                }
            }
        }

        return mergedList;
    }


    // Add style for add-on
    function add_style() {
        console.log('Adding styles.');
        GM_addStyle(`
            .bird-popup {
                position: fixed;
                z-index: 10000;
                background: #121212; /* Dark background */
                border: 1px solid #333; /* Dark border */
                border-radius: 10px;
                padding: 10px;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
                max-width: 80vw;
                display: none;
                text-align: center;
                transition: opacity 0.3s ease;
                resize: both;
                overflow: auto;
                color: #ffffff; /* Light text color */
            }

            /* Ensure all child elements inherit the dark mode styles */
            .bird-popup * {
                color: inherit; /* Inherit light text color */
                background-color: transparent; /* Transparent background for child elements */
                border-color: #555; /* Dark border for child elements */
            }

            /* Style buttons for dark mode */
            .bird-popup button {
                background-color: #333; /* Dark background for buttons */
                color: #ffffff; /* Light text color for buttons */
                border: 1px solid #555; /* Dark border for buttons */
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
            }

            .bird-popup button:hover {
                background-color: #444; /* Slightly lighter background for hovered buttons */
            }

            .bird-popup img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: auto;
            }

            .bird-highlight {
                background-color: ${highlightColor};
                cursor: pointer;
            }

            .bird-popup .nav-button {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 24px;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                padding: 10px;
                cursor: pointer;
                user-select: none;
            }

            .bird-popup .nav-button:hover {
                background: rgba(0, 0, 0, 0.8);
            }

            #prev-button${randomPostfix} { left: 10px; }
            #next-button${randomPostfix} { right: 10px; }

            .dismiss-button {
                display: block;
                margin: 10px auto;
                padding: 5px 10px;
                background-color: red;
                color: white;
                cursor: pointer;
                border: none;
                border-radius: 5px;
            }

            .loading-indicator {
                font-size: 18px;
                color: #333;
                padding: 20px;
            }

            .photo-info {
                margin: 10px 0;
                font-size: 14px;
                color: #555;
            }
        `);
    }

    // Initialize popup element
    function initializePopup() {
        console.log('Initializing popup.');
        const popup = document.createElement('div');
        popup.id = `bird-popup${randomPostfix}`; // Add random postfix to ID
        popup.className = 'bird-popup';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-labelledby', 'popup-title');
        document.body.appendChild(popup);
        return popup;
    }

    // Show popup with images
    function showPopup(e, imageData) {
        if (imageData.length === 0) {
            console.log('No images to display.');
            return;
        }

        currentImages = imageData;
        currentIndex = 0;

        let popup = document.getElementById(`bird-popup${randomPostfix}`); // Add random postfix to ID
        if (!popup) {
            popup = initializePopup();
        }

        popup.innerHTML = `<div class="loading-indicator">Loading...</div>`;
        popup.style.display = 'block';

        pauseObserver();
        popup.innerHTML = `
            <button class="nav-button" id="prev-button${randomPostfix}">&lsaquo;</button>
            <img src="${currentImages[currentIndex].url}" alt="Bird Image" />
            <button class="nav-button" id="next-button${randomPostfix}">&rsaquo;</button>
            <div class="photo-info">
                <strong>${currentImages[currentIndex].title}</strong> by ${currentImages[currentIndex].author || "Loading author..."}
            </div>
            <a href="${currentImages[currentIndex].flickrPage}" target="_blank">View on Flickr</a>
            <button class="dismiss-button" id="dismiss-button${randomPostfix}">Close</button>
        `;
        resumeObserver();

        cursorPosition = { x: e.clientX, y: e.clientY };

        const img = popup.querySelector('img');
        if (img.complete) {
            positionPopup(popup);
        } else {
            img.addEventListener('load', () => positionPopup(popup));
        }

        setupNavigation(popup);
        updateNavigationButtons();
        popupVisible = true;

        window.addEventListener('scroll', () => positionPopup(popup), { passive: true });
        window.addEventListener('resize', () => positionPopup(popup), { passive: true });
    }

    // Position popup relative to viewport with scroll handling
    function positionPopup(popup) {
        console.log('Positioning popup.');
        // const popupWidth = popup.offsetWidth;
        // const popupHeight = popup.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        const cursorX = cursorPosition.x;
        const cursorY = cursorPosition.y + scrollY;

        const spaceBelow = viewportHeight + scrollY - cursorY;
        const spaceAbove = cursorY - scrollY;

        const spaceLeft = cursorX;
        const spaceRigth = viewportWidth - cursorX;

        pauseObserver();
        if (spaceBelow <= spaceAbove) {
            const top = 10;
            popup.style.top = `${top}px`;
            popup.style.removeProperty('bottom');
        } else {
            const bottom = 10;
            popup.style.bottom = `${bottom}px`;
            popup.style.removeProperty('top');
        }

        if (spaceRigth <= spaceLeft) {
            const left = 10;
            popup.style.left = `${left}px`;
            if (popup.style.right) popup.style.removeProperty('right');
        } else {
            const right = 10;
            popup.style.right = `${right}px`;
            popup.style.removeProperty('left');
        }
        resumeObserver();
    }

    // Setup navigation buttons
    function setupNavigation(popup) {
        console.log('Setting up navigation buttons.');

        // Button event listeners
        document.getElementById(`prev-button${randomPostfix}`).addEventListener('click', () => navigate(-1));
        document.getElementById(`next-button${randomPostfix}`).addEventListener('click', () => navigate(1));
        document.getElementById(`dismiss-button${randomPostfix}`).addEventListener('click', hidePopup);

        // Keyboard event listeners
        if (!isKeydownListenerAdded) {
            document.addEventListener('keydown', function (e) {
                if (popupVisible) {
                    if (e.key === 'ArrowLeft') {
                        navigate(-1);
                    } else if (e.key === 'ArrowRight') {
                        navigate(1);
                    } else if (e.key === 'Escape') {
                        hidePopup();
                    }
                }
            });
            isKeydownListenerAdded = true;
        }

        // Touch event listeners for swipe gestures
        popup.addEventListener('touchstart', handleTouchStart, false);
        popup.addEventListener('touchmove', handleTouchMove, false);
        popup.addEventListener('touchend', handleTouchEnd, false);
    }

    // Variables to track touch positions
    let touchStartX = null;
    let touchStartY = null;
    // Handle touch start event
    function handleTouchStart(event) {
        const firstTouch = event.touches[0];
        touchStartX = firstTouch.clientX;
        touchStartY = firstTouch.clientY;
    }

    // Handle touch move event
    function handleTouchMove(event) {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Determine if the movement is primarily horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Prevent vertical scrolling during horizontal swipe
            event.preventDefault();
        }
    }

    // Handle touch end event
    function handleTouchEnd(event) {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Define a threshold for swipe detection (e.g., 50 pixels)
        const swipeThreshold = 50;

        // Check if the swipe is horizontal and exceeds the threshold
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                // Swipe right -> navigate to the previous photo
                navigate(-1);
            } else {
                // Swipe left -> navigate to the next photo
                navigate(1);
            }
        }

        // Reset touch coordinates
        touchStartX = null;
        touchStartY = null;
    }

    // Navigate between images
    function navigate(direction) {
        currentIndex = Math.max(0, Math.min(currentImages.length - 1, currentIndex + direction));
        console.log(`Navigating to image index: ${currentIndex}`);
        updateImage();
        updateNavigationButtons();
    }

    // Update displayed image and info
    function updateImage() {
        console.log('Updating displayed image.');
        const popup = document.getElementById(`bird-popup${randomPostfix}`);
        if (popup) {
            pauseObserver();
            popup.querySelector('img').src = currentImages[currentIndex].url;
            popup.querySelector('.photo-info').innerHTML = `
                <strong>${currentImages[currentIndex].title}</strong> by ${currentImages[currentIndex].author || "Loading author..."}
            `;
            popup.querySelector('a').href = currentImages[currentIndex].flickrPage;
            resumeObserver();
        }
    }

    // Update navigation buttons visibility
    function updateNavigationButtons() {
        console.log('Updating navigation buttons visibility.');
        const prevButton = document.getElementById(`prev-button${randomPostfix}`);
        const nextButton = document.getElementById(`next-button${randomPostfix}`);
        if (prevButton) prevButton.style.display = currentIndex > 0 ? 'block' : 'none';
        if (nextButton) nextButton.style.display = currentIndex < currentImages.length - 1 ? 'block' : 'none';
    }

    // Hide popup
    function hidePopup() {
        console.log('Hiding popup.');
        pauseObserver();
        const popup = document.getElementById(`bird-popup${randomPostfix}`);
        if (popup) {
            popup.style.display = 'none';
            popupVisible = false;
        }
        resumeObserver();
    }

    // --- Core Functionality ---

    // Process species list and highlight species in text
    function processSpecies() {
        console.log('Processing species list.');
        // Find and highlight species in text
        function findSpeciesInText(root) {
            const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            const nodesToReplace = [];

            const speciesSet = new Set(speciesList); // Fast lookup
            const speciesRegex = new RegExp(`\\b(${[...speciesSet].join("|")})\\b`, "gi"); // Single regex

            let node;
            while ((node = treeWalker.nextNode())) {
                let text = node.nodeValue;
                let replacedText = text.replace(speciesRegex, (match) => {
                    console.log(`Found species: ${match}`);
                    return `<span class="bird-highlight">${match}</span>`; // Inline replacement
                });

                if (text !== replacedText) {
                    nodesToReplace.push({ node, replacedText });
                }
            }
            console.log(`Found ${nodesToReplace.length} occurencies`)
            // DOM updates
            pauseObserver();
            nodesToReplace.forEach(({ node, replacedText }) => {
                const wrapper = document.createElement("span");
                wrapper.innerHTML = replacedText;
                node.parentNode.replaceChild(wrapper, node);
            });
            resumeObserver();
        }

        findSpeciesInText(document.body);

        observer = new MutationObserver((mutations) => {
            if (!observerActive) return;

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        findSpeciesInText(node);
                    }
                });
            });
        });

        observerActive = true;
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Pause the observer
    function pauseObserver() {
        if (observer && observerActive) {
            console.log('Pausing observer.');
            observer.disconnect();
            observerActive = false;
        }
    }

    // Resume the observer
    function resumeObserver() {
        if (observer && !observerActive) {
            console.log('Resuming observer.');
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            observerActive = true;
        }
    }

    // Fetch images from Flickr API with rate limiting
    async function fetchFlickrImages(species, callback) {
        const now = Date.now();
        if (now - lastApiCallTime < API_CALL_DELAY) {
            console.log('Rate limiting API calls. Waiting...');
            await new Promise(resolve => setTimeout(resolve, API_CALL_DELAY - (now - lastApiCallTime)));
        }
        lastApiCallTime = Date.now();

        try {
            const searchUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&${currentSearchMode}=${encodeURIComponent(species)}&sort=${currentSortOrder}&format=json&nojsoncallback=1&per_page=10`;

            console.log(`Fetching images for species: ${species}`);
            const searchResponse = await gmFetch(searchUrl);
            if (!searchResponse.photos || searchResponse.photos.photo.length === 0) {
                console.warn(`No images found for species: ${species}`);
                callback([]);
                return;
            }

            const photos = searchResponse.photos.photo.slice(0, 10);
            const images = photos.map(photo => ({
                url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`,
                title: photo.title,
                author: null,
                flickrPage: `https://www.flickr.com/photos/${photo.owner}/${photo.id}`
            }));

            callback(images);

            photos.forEach(async (photo, index) => {
                const ownerName = await fetchOwnerName(photo.owner);
                images[index].author = ownerName;

                if (currentIndex === index) {
                    updateImage();
                }
            });
        } catch (error) {
            console.error(`Error fetching images for ${species}:`, error);
            callback([]);
        }
    }

    // Helper function to fetch data using GM_xmlhttpRequest
    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: { 'Origin': 'null' },
                anonymous: true,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (error) {
                            console.error('Error parsing response:', error);
                            reject(`Error parsing response: ${error}`);
                        }
                    } else {
                        console.error(`API error: ${response.statusText}`);
                        reject(`API error: ${response.statusText}`);
                    }
                },
                onerror: function (error) {
                    console.error('Request failed:', error);
                    reject(`Request failed: ${error}`);
                }
            });
        });
    }

    // Fetch the owner's real name (or username if real name is missing)
    async function fetchOwnerName(ownerId) {
        try {
            const ownerUrl = `https://www.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=${FLICKR_API_KEY}&user_id=${ownerId}&format=json&nojsoncallback=1`;
            console.log(`Fetching owner info for ID: ${ownerId}`);
            const ownerData = await gmFetch(ownerUrl);
            const person = ownerData.person;
            if (person) {
                return (person.realname ? person.realname._content : null)
                    || (person.username ? person.username._content : null)
                    || person.path_alias
                    || "Unknown";
            }
            return "Unknown";
        } catch (error) {
            console.error(`Error fetching owner info:`, error);
            return "Unknown";
        }
    }

    // Function to handle species highlight (for both mouse and touch events)
    function handleSpeciesHighlight(event) {
        let target;
        if (event.type === 'touchstart' || event.type === 'touchend') {
            // For touch events, use the first touch point
            target = event.touches ? event.touches[0].target : event.target;
        } else {
            // For mouse events, use the event target directly
            target = event.target;
        }

        // Check if the target has the 'bird-highlight' class
        if (target.classList.contains('bird-highlight')) {
            const species = target.textContent;
            console.log(`Highlight detected on species: ${species}`);
            fetchFlickrImages(species, (imageData) => showPopup(event, imageData));

            // Prevent default behavior for touchend events on bird-highlight elements
            if (event.type === 'touchend') {
                event.preventDefault();
            }
        }
    }

    // Debounce function to limit the rate of execution
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Attach event listeners for both mouse and touch events
    const debouncedHighlight = debounce(handleSpeciesHighlight, DEBOUNCE_DELAY);

    // Mouse events for desktop
    document.addEventListener('mouseover', debouncedHighlight);

    // Touch events for smartphones and tablets
    let touchStartX2, touchStartY2;

    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX2 = touch.clientX;
        touchStartY2 = touch.clientY;
    });

    document.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX2);
        const deltaY = Math.abs(touch.clientY - touchStartY2);

        // Only trigger if the touch movement is small (e.g., less than 10 pixels)
        if (deltaX < 10 && deltaY < 10) {
            debouncedHighlight(e);
        }
    });

    await initializeScript();
    processSpecies();
    add_style();

    GM_registerMenuCommand('Clear Species List', function () {
        GM_setValue('speciesList', []);
        alert('Species list cleared. You should reload the page now');
    });

    /* ------------------------- This an an extra code to allow a user to configure some parameters ------------------------- */
    /* ------------------------- We can live without the code bellow ------------------------- *

    /* A lot of code just to allow user to pickup a color for hightligths */
    GM_addStyle(`
        #colorPickerContainer${randomPostfix} {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #121212; /* Dark theme */
            border: 1px solid #333;
            border-radius: 10px;
            padding: 15px;
            z-index: 10001;
            display: flex;
            flex-direction: column; /* Column layout for input, button, and text */
            justify-content: center;
            align-items: center;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
            min-width: 35vw;
            min-height: 20vh;
            text-align: center;
        }

        #colorPickerContainer${randomPostfix} * {
            color: #ffffff; /* Light text */
            background-color: transparent;
            border-color: #555;
        }

        #instructionText${randomPostfix} {
            margin-bottom: 10px;
            font-size: 16px;
            color: #dddddd;
            font-weight: normal;
        }

        .picker-row${randomPostfix} {
            display: flex;
            flex-direction: row;
            width: 100%;
            margin: 10px;
        }

        #highlightColorInput${randomPostfix} {
            height: 75px;
            flex-grow: 3;
            border-radius: 5px;
            padding: 5px;
            cursor: pointer;
            box-sizing: border-box;
        }

        .picker-buttons${randomPostfix} {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            margin: 10px;
        }

        #applyHighlightColor${randomPostfix},
        #dismissButton${randomPostfix} {
            padding: 10px 0;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s ease;
        }

        #applyHighlightColor${randomPostfix} {
            background: #333;
            color: #ffffff;
            border: 1px solid #555;
        }

        #applyHighlightColor${randomPostfix}:hover {
            background: #444;
        }

        #dismissButton${randomPostfix} {
            background: #e74c3c;
            color: #ffffff;
            border: 1px solid #555;
            margin-top: 10px;
        }

        #dismissButton${randomPostfix}:hover {
            background: #c0392b;
        }
    `);

    function openColorPicker() {
        if (document.getElementById(`colorPickerContainer${randomPostfix}`)) return;

        const picker = document.createElement('div');
        picker.id = `colorPickerContainer${randomPostfix}`;
        picker.innerHTML = `
            <div id="instructionText${randomPostfix}">
                Select a color to highlight the bird species on the page, then click "Apply".
            </div>
            <div class="picker-row${randomPostfix}">
                <input type='color' id="highlightColorInput${randomPostfix}">
                <div class="picker-buttons${randomPostfix}">
                    <button id="applyHighlightColor${randomPostfix}">Apply</button>
                    <button id="dismissButton${randomPostfix}">Dismiss</button>
                </div>
            </div>
        `;
        document.body.appendChild(picker);

        // Set default color
        const colorInput = document.getElementById(`highlightColorInput${randomPostfix}`);
        colorInput.value = GM_getValue('highlightColor', '#FFFF00');

        // Apply event listener
        document.getElementById(`applyHighlightColor${randomPostfix}`).addEventListener('click', () => {
            GM_setValue('highlightColor', colorInput.value);
            updateHighlightElements(colorInput.value);
            removePicker();
        });

        // Dismiss event listener
        document.getElementById(`dismissButton${randomPostfix}`).addEventListener('click', removePicker);

        // Attach event listeners
        setTimeout(() => {
            document.addEventListener('click', closeOnClickOutside);
            document.addEventListener('keydown', closeOnEscape);
        }, 0);

        function closeOnClickOutside(e) {
            if (!picker.contains(e.target)) {
                removePicker();
            }
        }

        function closeOnEscape(e) {
            if (e.key === 'Escape') {
                removePicker();
            }
        }

        function removePicker() {
            document.removeEventListener('click', closeOnClickOutside);
            document.removeEventListener('keydown', closeOnEscape);
            picker.remove();
        }
    }

    // Function to update all .bird-highlight elements dynamically
    function updateHighlightElements(color) {
        document.querySelectorAll('.bird-highlight').forEach(el => {
            el.style.backgroundColor = color;
        });
    }

    // Add context menu option to open the color picker
    GM_registerMenuCommand('Change Highlight Color', openColorPicker);

    /* Allow user to change of flickr should sort the results */
    // Constants for sorting options
    const SORT_OPTIONS = [
        { value: 'date-posted-asc', label: 'Date Posted (Oldest First)' },
        { value: 'date-posted-desc', label: 'Date Posted (Newest First)' },
        { value: 'date-taken-asc', label: 'Date Taken (Oldest First)' },
        { value: 'date-taken-desc', label: 'Date Taken (Newest First)' },
        { value: 'interestingness-desc', label: 'Interestingness (Most First)' },
        { value: 'interestingness-asc', label: 'Interestingness (Least First)' },
        { value: 'relevance', label: 'Relevance' }
    ];

    // Constants for search modes
    const SEARCH_MODES = [
        { value: 'tags', label: 'Search by Tags' },
        { value: 'text', label: 'Search by Text' }
    ];

    // Function to update sort order menu dynamically
    function updateSortOrderMenu() {
        let currentSortOrder = GM_getValue('flickrSortOrder', 'relevance');

        SORT_OPTIONS.forEach(option => {
            const isSelected = option.value === currentSortOrder;
            const label = `${isSelected ? '✔ ' : ''}${option.label}`;

            // Update the existing menu item or create a new one
            GM_registerMenuCommand(label, () => {
                GM_setValue('flickrSortOrder', option.value);
                location.reload();
            });
        });
    }

    // Function to update search mode menu dynamically
    function updateSearchModeMenu() {
        let currentSearchMode = GM_getValue('flickrSearchMode', 'tags');

        SEARCH_MODES.forEach(mode => {
            const isSelected = mode.value === currentSearchMode;
            const label = `${isSelected ? '✔ ' : ''}${mode.label}`;

            // Update the existing menu item or create a new one
            GM_registerMenuCommand(label, () => {
                GM_setValue('flickrSearchMode', mode.value);
                location.reload();
            });
        });
    }

    // Call the functions to register the menus
    updateSortOrderMenu();
    updateSearchModeMenu();
})();