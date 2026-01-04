// ==UserScript==
// @name         FeestenFixed
// @version      2.2.1
// @author       Vince & Egelman
// @description Laat de steden zien waar je Stadsfeesten en Theaters kan activeren
// @match        https://*.grepolis.com/game/*
// @exclude      forum.*.grepolis.*/*
// @exclude      wiki.*.grepolis.*/*
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/511015/FeestenFixed.user.js
// @updateURL https://update.greasyfork.org/scripts/511015/FeestenFixed.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const WAREHOUSE_SF_LEVEL = 23;

    // wait for page to load
    var sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)

    const draggableStyles = `
        .draggable-box {
            position: fixed; /* Ensure the box stays fixed relative to the viewport */
            bottom: 20px; /* Adjust as needed */
            right: 20px; /* Adjust as needed */
            background-color: rgba(255, 255, 255, 0.8);
            border: 1px solid #ccc;
            padding: 10px;
            max-width: 300px;
            max-height: fit-content;
            overflow: auto;
            z-index: 999;
            cursor: move;
            border-radius: 20px;
            resize: none; /* Disable resizing */
        }

        #triggerButton {
            position: fixed;
            bottom: 20px;
            right: 220px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            font-size: 18px;
            cursor: pointer;
            z-index: 1000; /* Ensure the button is above other elements */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        #triggerButton:hover {
            background-color: #45a049;
            transform: translateY(-2px);
        }

        #triggerButton.active {
            background-color: #f44336; /* Red color when active */
        }

        #masterButton {
            bottom: 20px;
            right: 20px;
            background-color: yellow;
            color: blue;
            position; fixed;
            border: none;
            font-size: 10px;
            cursor: pointer;
        }
    `;

    const draggableStyleElement = document.createElement('style');
    draggableStyleElement.innerHTML = draggableStyles;
    document.head.appendChild(draggableStyleElement);

    // Create the draggable feed box
    const draggableFeedBox = document.createElement('div');
    draggableFeedBox.className = 'draggable-box';
    draggableFeedBox.id = 'draggableFeedBox';
    document.body.appendChild(draggableFeedBox);

    // Make the feed box draggable
    makeElementDraggable(draggableFeedBox);

    function makeElementDraggable(element) {
        let offsetX, offsetY, isDragging = false;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                element.style.left = e.clientX - offsetX + 'px';
                element.style.top = e.clientY - offsetY + 'px';
            }
        });
    }

    function clearFeed() {
        // Clear all child elements (messages) from the feed box
        while (draggableFeedBox.firstChild) {
            draggableFeedBox.removeChild(draggableFeedBox.firstChild);
        }
    }

    function appendToFeed(townId, townName, message) {
        const townLink = generateTownLink(townId, townName);
        const newMessage = document.createElement('div');
        newMessage.innerHTML = `${townLink}: ${message}`;
        newMessage.style.color = 'black';
        newMessage.style.backgroundColor = 'white';
        draggableFeedBox.appendChild(newMessage);
    }

    function generateTownLink(townId, townName) {
        const encodedData = btoa(JSON.stringify({ id: townId, ix: 436, iy: 445, tp: 'town', name: townName }));
        return `<a href="#${encodedData}" class="gp_town_link">${townName}</a>`;
    }

    function addButton() {
        // Button to trigger the method
        const triggerButton = document.createElement('button');
        triggerButton.textContent = 'Show SFs';
        triggerButton.id = 'triggerButton';
        document.body.appendChild(triggerButton);

        let isBoxVisible = false; // Flag to track box visibility
        let refreshInterval; // Interval for content refresh

        triggerButton.onclick = () => {
            if (!isBoxVisible) {
                draggableFeedBox.style.display = 'block'; // Show the box
                isBoxVisible = true;
                triggerButton.classList.add('active'); // Add active class to button

                // Populate feed box initially
                refreshContent();

                // Set interval for content refresh
                refreshInterval = setInterval(refreshContent, 10000);
            } else {
                // If box is visible, hide it
                draggableFeedBox.style.display = 'none';
                isBoxVisible = false;
                triggerButton.classList.remove('active'); // Remove active class from button
                clearFeed(); // Clear the feed when hiding the box
                // Clear the interval
                clearInterval(refreshInterval);
            }
        };
    }

    function addMasterButton() {
        if (document.getElementById('masterButton') == null) {
            const masterButton = document.createElement('button');
            masterButton.textContent = 'FF';
            masterButton.id = 'masterButton';

            masterButton.onclick = () => {
                if (document.getElementById('triggerButton') == null) {
                    addButton();
                    clearInterval(masterinverval);
                }
            }
            try {
            document.querySelector('.dio_cultureBTN_wrapper_right').insertBefore(masterButton, document.querySelector('.dio_cultureBTN_wrapper_right').firstChild);
            } catch (err) {} // culture window not open
        }
    }

    function refreshContent() {
        clearFeed();
        const celebrationsList = MM.getModels().Celebration;
        if (celebrationsList) {
            const celebrationsArray = Object.values(celebrationsList);
            const towns = Object.values(ITowns.getTowns());
            let hasContent = false; // Flag to track if any content was appended
            // Inside your loop
            for (const town of towns) {
                const theaterLevel = town.buildings().attributes.theater;
                const academyLevel = town.buildings().attributes.academy;
                const warehouseLevel = town.buildings().attributes.storage;

                function hasCelebration(townId, celebrationType) {
                    const matchingCelebration = celebrationsArray.find(
                        (celebration) =>
                            celebration.attributes.town_id === townId && celebration.attributes.celebration_type === celebrationType
                    );
                    return Boolean(matchingCelebration);
                }

                const townId = town.getId();
                const townName = town.getName(); // Assuming this is how you get the town name
                const partyActive = hasCelebration(townId, 'party');
                const theaterActive = hasCelebration(townId, 'theater');
                const possibleTheater = typeof theaterLevel !== 'undefined' && theaterLevel === 1;
                const isAcademyLevelSufficient = academyLevel >= 30;
                const isWarehouseLevelSufficient = warehouseLevel >= WAREHOUSE_SF_LEVEL;

                let returnMessage = '';

                if (possibleTheater && !theaterActive) {
                    returnMessage += 'Activate theater ';
                }

                if (!partyActive && isAcademyLevelSufficient && isWarehouseLevelSufficient) {
                    returnMessage += 'Activate SF ';
                }

                if (returnMessage) {
                    hasContent = true; // Set flag to true if content is appended
                    console.log(returnMessage);
                    appendToFeed(townId, townName, returnMessage); // Log to the draggable feed box
                }
            }
            // If no content is appended, show default message
            if (!hasContent) {
                const defaultMessage = document.createElement('div');
                defaultMessage.innerHTML = 'Alle SFs en theaters in gebruik';
                defaultMessage.style.color = 'black';
                defaultMessage.style.backgroundColor = 'white';
                draggableFeedBox.appendChild(defaultMessage);
            }
        }
    }

    addButton()
})();