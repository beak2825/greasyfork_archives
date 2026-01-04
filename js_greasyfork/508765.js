// ==UserScript==
// @name         An Easy World: Tips
// @namespace    https://www.geoguessr.com
// @version      1.0.4
// @description  Display tips on An Easy World, fetched from the database
// @author       54
// @match        https://www.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/508765/An%20Easy%20World%3A%20Tips.user.js
// @updateURL https://update.greasyfork.org/scripts/508765/An%20Easy%20World%3A%20Tips.meta.js
// ==/UserScript==

// URLs for Google Sheets
const locationsSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQclsDyN6aq9eY0SYyKI4X66wXWT1eB5tfMgdBsTIKfI97QE4N9u-GOFY5u9T_tWgp2MvlaIPskmKnJ/pub?gid=0&single=true&output=tsv';
const metasSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQclsDyN6aq9eY0SYyKI4X66wXWT1eB5tfMgdBsTIKfI97QE4N9u-GOFY5u9T_tWgp2MvlaIPskmKnJ/pub?gid=581949462&single=true&output=tsv';
const flagiconsUrl = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css';

// Main logic for the script
function runScript() {

    //// STARTING VARIABLES
    let globalCoordinates = {
        lat: 0,
        lng: 0
    };
    let revealMode = false;
    let countryData = {};
    let errorDisplayed = false; // Global flag to indicate if an error message is displayed

    //// STYLE ELEMENTS
    // Basic UI
    function setupHintsUI() {
        // Create and style the "Hints" button
        const hintsButton = document.createElement('button');
        hintsButton.innerHTML = 'Show Hints';
        hintsButton.style.fontStyle = 'italic';
        hintsButton.style.fontSize = '18px';
        hintsButton.style.color = 'white';
        hintsButton.style.fontWeight = '700';
        hintsButton.style.position = 'absolute';
        hintsButton.style.top = '10px';
        hintsButton.style.left = '10px';
        hintsButton.style.background = 'linear-gradient(180deg, rgba(161,155,217,.6) 0%, rgba(161,155,217,0) 50%, rgba(161,155,217,0) 50%), var(--ds-color-purple-80)';
        hintsButton.style.border = 'none';
        hintsButton.style.padding = '10px';
        hintsButton.style.cursor = 'pointer';
        hintsButton.style.zIndex = '10000';
        hintsButton.style.borderRadius = '8px';
    
        // Create and style the hints container
        const hintsContainer = document.createElement('div');
        hintsContainer.style.position = 'absolute';
        hintsContainer.style.top = '55px'; // Adjust this value to position the container lower
        hintsContainer.style.left = '10px';
        hintsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        hintsContainer.style.color = 'white';
        hintsContainer.style.padding = '10px';
        hintsContainer.style.display = 'none'; // Start hidden
        hintsContainer.style.zIndex = '10000';
        hintsContainer.style.width = '300px'; // Set width to prevent shrinking
        hintsContainer.style.maxHeight = '400px';
        hintsContainer.style.overflowY = 'auto'; // Allow scrolling if content is too large
        hintsContainer.classList.add('slide-up'); // Add initial class for sliding up

        // Create the slider toggle for "Reveal Info"
        const revealInfoContainer = document.createElement('div');
        revealInfoContainer.style.display = 'flex'; // Use flexbox for layout
        revealInfoContainer.style.alignItems = 'center'; // Center items vertically
        revealInfoContainer.style.marginBottom = '10px'; // Add some space below the slider

        const revealInfoText = document.createElement('div');
        revealInfoText.innerHTML = '<b><i>REVEAL INFO</i></b>';
        revealInfoText.style.fontSize = '16px';
        revealInfoText.style.marginRight = '10px';

        const revealInfoLabel = document.createElement('label');
        revealInfoLabel.className = 'switch';

        const revealInfoInput = document.createElement('input');
        revealInfoInput.type = 'checkbox';

        const revealInfoSlider = document.createElement('span');
        revealInfoSlider.className = 'slider';

        revealInfoLabel.appendChild(revealInfoInput);
        revealInfoLabel.appendChild(revealInfoSlider);
        revealInfoContainer.appendChild(revealInfoText);
        revealInfoContainer.appendChild(revealInfoLabel);

        // Append the slider to the hints container
        hintsContainer.appendChild(revealInfoContainer);

        // Create a content section to hold the metas
        const hintsContent = document.createElement('div');
        hintsContent.style.marginTop = '10px'; // Add space for the carousel controls
        hintsContent.style.display = 'flex';
        hintsContent.style.alignItems = 'center';
        hintsContent.style.justifyContent = 'center';
        hintsContent.style.height = '100%'; // Ensure the container takes full height
        hintsContent.style.textAlign = 'center'; // Center text horizontally
        hintsContent.innerHTML = '<b><i>LOADING...</i></b>'; // Initial loading message
        hintsContainer.appendChild(hintsContent); // Append content section to the container

        // Append the button and hints container to the body
        document.body.appendChild(hintsButton);
        document.body.appendChild(hintsContainer);

        // Store references for later use
        window.hintsContainer = hintsContainer;
        window.hintsContent = hintsContent; // Reference for metas content

        // Toggle hints container visibility
        hintsButton.addEventListener('click', () => {
            if (hintsContainer.style.display === 'none') {
                hintsContainer.style.display = 'block';
                hintsContainer.classList.remove('slide-up');
                hintsContainer.classList.add('slide-down');
                hintsButton.textContent = 'Hide Hints';
            } else {
                hintsContainer.classList.remove('slide-down');
                hintsContainer.classList.add('slide-up');
                setTimeout(() => {
                    hintsContainer.style.display = 'none';
                }, 300); // Match the duration of the slide-up animation
                hintsButton.textContent = 'Show Hints';
            }
        });

        // Close the modal if the hints container is clicked
        hintsContainer.addEventListener('click', () => {
            const modal = document.getElementById('imageModal');
            if (modal.style.display === 'flex') {
                modal.style.display = 'none'; // Close the modal if it's open
            }
        });

        // Add CSS styles for the sliding animation
        const style = document.createElement('style');
        style.textContent = `
            .slide-up {
                animation: slide-up 0.3s forwards;
            }
            .slide-down {
                animation: slide-down 0.3s forwards;
            }
            @keyframes slide-up {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(-20px);
                    opacity: 0;
                }
            }
            @keyframes slide-down {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    
        // Toggle the mode when the slider is changed
        revealInfoInput.addEventListener('change', () => {
            // Check if an error message is displayed
            if (errorDisplayed) {
                return; // Skip refreshing metas if an error message is displayed
            }
        
            // Refresh the metas to reflect the new mode
            if (window.currentLevel) {
                showMetasByLevel(window.currentLevel, false); // Pass false to not reset the index
                showMeta(window.currentIndex); // Show the same meta
            } else {
                displayMetas(window.currentMetas);
                showMeta(window.currentIndex); // Show the same meta
            }
        });
    
        // Store the input reference for later use
        window.revealInfoInput = revealInfoInput;
        window.currentIndex = 0; // Initialize the global currentIndex
    }

    // Loading CSS style for flag functionality
    function injectCSS(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        document.head.appendChild(link);

        // Fetch the JSON file
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://przemek54.github.io/an-easy-world/country-data.json',
            onload: function(response) {
                countryData = JSON.parse(response.responseText);
            },
            onerror: function(error) {
                console.error('Error fetching flags.json:', error);
            }
        });
    }

    // Tag colors
    const tagColors = {
        'Signs': '#f6b10f',
        'Road': '#f9f536',
        'Landscape': '#63d754',
        'Poles' : '#b0b0b0',
        'Agriculture' : '#bfbd5d',
        'Vegetation' : '#177620',
        'Language' : '#bf4075',
        'Camera' : '#000000',
        'Miscellaneous' : '#9026de',
        'Plates' : '#ffffff',
        'Shields' : '#b0d0b9',
        'Markers' : '#136ca8',
        'Bollards' : '#da4c14',
        'Guardrails' : '#6fafbe',
        'Stickers' : '#0b4fff',
        'Chevrons' : '#f399e8',
        'Soil' : '#9f7e27',
        'Numbers' : '#bedff6',
        'Flags' : '#792424',
        'Lamps & lights' : '#feffde',
        'Vehicles' : '#570d07',
        'Car' : '#ef1818',
        'Architecture' : '#57351a',
        'Brands' : '#4d2380',
        'People' : '#ffc8aa',
        'Weather' : '#73dcfc',
        'Urbanism' : '#1e3d6b',
        'Trekker' : '#4c5c29',
        'Coverage' : '#50e6c0',
        'Status' : '#ffc3c3',
        'Fences & walls' : '#ffe5a0'        
    };

    // Modal for enlarging images
    function addModal() {
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal';
    
        // Create close button
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close';
        closeBtn.innerHTML = '&times;';
    
        // Create modal image
        const modalImg = document.createElement('img');
        modalImg.className = 'modal-content';
        modalImg.id = 'modalImage';
    
        // Append elements to modal
        modal.appendChild(closeBtn);
        modal.appendChild(modalImg);
    
        // Append modal to body
        document.body.appendChild(modal);
    
        // Add CSS styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: none; /* Hidden by default */
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background-color: rgba(0,0,0,0.9);
            }
            .modal-content {
                transform: scale(0.75); /* Scale the image to 75% of its original size */
                max-width: 100%;
                max-height: 100%;
                margin: auto;
                display: block;
            }
            .close {
                position: absolute;
                top: 15px;
                right: 35px;
                color: #f1f1f1;
                font-size: 40px;
                font-weight: bold;
                transition: 0.3s;
            }
            .close:hover,
            .close:focus {
                color: #bbb;
                text-decoration: none;
                cursor: pointer;
            }
            .switch {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 17px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 13px;
                width: 13px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: #2196F3;
            }

            input:checked + .slider:before {
                transform: translateX(13px);
            }
            .tab {
                padding: 10px;
                cursor: pointer;
                border: 1px solid white;
                border-bottom: none;
            }
            .tab.active {
                border-bottom: none;
            }
            .meta-container {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Checking the map name
    function checkMap() {
        let mapNameElement = document.querySelector('div.status_value__w_Nh0');

        if (mapNameElement) {
            let mapName = mapNameElement.textContent.trim();
            if (mapName === 'An Easy World (alpha)') {
                console.log("Correct map! Running script...");
                setupHintsUI();
                addModal();
            } else {
                console.log("This script only works for the map 'An Easy World (alpha)'.");
            }
        } else {
            console.log("Could not find the map name element. Retrying...");
            setTimeout(checkMap, 1000);
        }
    }

    //// DISTANCE CALCULATION
    // Calculate the distance between two sets of coordinates (Haversine formula)
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }

    // Create a bounding box around the user's location
    function getBoundingBox(lat, lng, distanceKm) {
        const R = 6371; // Radius of the Earth in kilometers

        // Latitude and longitude offsets in degrees
        const latOffset = distanceKm / R * (180 / Math.PI);
        const lngOffset = distanceKm / (R * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);

        return {
            minLat: lat - latOffset,
            maxLat: lat + latOffset,
            minLng: lng - lngOffset,
            maxLng: lng + lngOffset
        };
    }

    // Check if a location is within the bounding box
    function isWithinBoundingBox(lat, lng, boundingBox) {
        return (lat >= boundingBox.minLat && lat <= boundingBox.maxLat &&
                lng >= boundingBox.minLng && lng <= boundingBox.maxLng);
    }

    //// TASK ROUTINE EVERY ROUND
    // Intercept the API call to get coordinates from Google Maps
    function interceptGoogleMapsAPI() {
        var originalOpen = XMLHttpRequest.prototype.open;
        let urlIntercepted = false;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (method.toUpperCase() === 'POST' &&
                (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
                 url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

                urlIntercepted = true; // Mark that the expected URL has been intercepted

                this.addEventListener('load', function () {
                    try {
                        let interceptedResult = this.responseText;
                        const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                        let match = interceptedResult.match(pattern);

                        if (match && match[0]) {
                            let split = match[0].split(",");
                            globalCoordinates.lat = Number.parseFloat(split[0]);
                            globalCoordinates.lng = Number.parseFloat(split[1]);

                            // Check if coordinates are (0, 0)
                            if (globalCoordinates.lat === 0 && globalCoordinates.lng === 0) {
                                displayError("Coordinates are (0, 0), indicating an error in fetching.");
                                return;
                            }

                            // Once the coordinates are intercepted, fetch the location data from the spreadsheet
                            fetchSheetsData(globalCoordinates);
                        } else {
                            throw new Error("Coordinates not found in the intercepted response.");
                        }
                    } catch (error) {
                        console.error("Error fetching coordinates:", error);
                        displayError("Error fetching coordinates.");
                    }
                });
            }
            return originalOpen.apply(this, arguments);
        };

        // Set a timeout to display an error if the expected URL isn't intercepted within 5 seconds
        setTimeout(() => {
            if (!urlIntercepted) {
                displayError("Couldn't get location.");
            }
        }, 5000);
    }

    // Display errors if location can't be found
    function displayError(message) {
        if (window.hintsContent) {
            window.hintsContent.textContent = message;
            errorDisplayed = true; // Set the error flag
        }
    }

    // Find location in the sheet and obtain its data
    function fetchSheetsData(coordinates) {
        const lat = parseFloat(coordinates.lat);
        const lng = parseFloat(coordinates.lng);
        const thresholdDistance = 0.01; // Set threshold distance in kilometers (10m)

        if (isNaN(lat) || isNaN(lng)) {
            displayError("Coordinates are not valid numbers");
            return;
        }

        // Declare timeoutId in the correct scope
        const timeoutId = setTimeout(() => {
            displayError("Location fetching timed out. Please try again.");
        }, 5000); // 5 seconds timeout

        GM_xmlhttpRequest({
            method: 'GET',
            url: locationsSheetUrl,
            onload: function(response) {
                try {
                    let locationsRows = parseTSV(response.responseText);
                    let closestLocation = null;
                    let smallestDistance = Infinity;
                    let matchingLocations = [];

                    // Pre-calculate bounding box based on threshold distance
                    let boundingBox = getBoundingBox(lat, lng, thresholdDistance);

                    // Iterate over the rows and calculate the distance only for locations within the bounding box
                    locationsRows.forEach(row => {
                        const sheetLat = parseFloat(row[1]);
                        const sheetLng = parseFloat(row[2]);

                        if (!isNaN(sheetLat) && !isNaN(sheetLng) && isWithinBoundingBox(sheetLat, sheetLng, boundingBox)) {
                            const distance = calculateDistance(lat, lng, sheetLat, sheetLng);

                            if (distance < thresholdDistance) {
                                matchingLocations.push(row);
                            }

                            if (distance < smallestDistance) {
                                smallestDistance = distance;
                                closestLocation = row;
                            }
                        }
                    });

                    // Clear the timeout if a location is found
                    clearTimeout(timeoutId);

                    if (matchingLocations.length > 1) {
                        displayError("Multiple matching locations found.");
                    } else if (closestLocation) {
                        console.log(`Closest location (${closestLocation[0]}) found at distance: ${smallestDistance} km`);
                        let metaIds = closestLocation[3] ? closestLocation[3].split(", ") : [];
                        if (metaIds.length > 0) {
                            fetchMetas(metaIds);
                        } else {
                            displayError("No meta IDs found for the closest location.");
                        }
                    } else {
                        displayError("No matching location found within the bounding box.");
                    }
                } catch (error) {
                    clearTimeout(timeoutId);
                    displayError('Error processing location data.');
                }
            },
            onerror: function(error) {
                clearTimeout(timeoutId);
                displayError('Error fetching location data.');
            }
        });
    }

    // Fetch metas based on the Meta IDs
    // The meta ID column are: 1) Meta ID, 2) Level, 3) Type, 4) Content, 5) Note, 6) Image (raw), 7) Image, 8) Examples, 9) Number of examples, 10) Country
    function fetchMetas(metaIds) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: metasSheetUrl,
            onload: function(response) {
                let metasRows = parseTSV(response.responseText);
                let metasToDisplay = [];
    
                // Loop through each Meta ID and match it with the rows in the metas sheet
                metaIds.forEach(metaId => {
                    metasRows.forEach(row => {
                        let sheetMetaId = row[0]; // Meta ID
                        if (sheetMetaId === metaId) {
                            metasToDisplay.push({
                                level: row[1],
                                type: row[2],
                                content: row[3],
                                note: row[4],
                                image: row[6],
                                country: row[9], // Add country information
                            });
                        }
                    });
                });
    
                displayMetas(metasToDisplay);
            },
            onerror: function(error) {
                console.error('Error fetching metas:', error);
            }
        });
    }

    // Parse the TSV response into an array of rows
    function parseTSV(tsv) {
        let lines = tsv.split("\n");
        return lines.map(line => line.split("\t"));
    }

    // Detect when the round is over
    function observeRoundChange() {
        let currentRoundText = null; // Store the current round text to detect changes

        const observer = new MutationObserver(() => {
            const roundNumberElement = document.querySelector('div[data-qa="round-number"] .status_value__w_Nh0');

            if (roundNumberElement) {
                const newRoundText = roundNumberElement.textContent;

                if (newRoundText !== currentRoundText) {
                    console.log(`Round changed: ${currentRoundText} -> ${newRoundText}`);
                    currentRoundText = newRoundText; // Update current round
                    resetHintsContent(); // Reset hints content when a new round starts
                    errorDisplayed = false; // Reset the error flag
                }
            }
        });

        // Observe changes in the main container
        observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
    }

    // Reset hints when the round is over
    function resetHintsContent() {
        if (window.hintsContent) {
            changeHintsContainerBackground(null);
            window.hintsContent.style.display = 'block';
            window.hintsContent.style.textAlign = 'center';
            window.hintsContent.style.height = '100%'; // Ensure the container takes full height
            window.hintsContent.innerHTML = `<b><i>LOADING...</i></b>`;
        }
        window.currentIndex = 0; // Reset the global currentIndex
    }

    //// DISPLAY
    // Content formatting
    function formatContent(text, isNote = false) {
        // Replace escaped newline characters with actual newline characters
        text = text.replace(/\\n/g, '\n');
    
        // Split the text into lines
        const lines = text.split('\n');
        let formattedText = '';
    
        lines.forEach((line, index) => {
            // Check if the line starts with an asterisk for bullet points
            if (line.trim().startsWith('*')) {
                // If the previous line was not a list, start a new list
                if (!formattedText.endsWith('</li>')) {
                    formattedText += '<ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 4px;">';
                }
                formattedText += `<li>${line.trim().substring(1).trim()}</li>`;
            } else {
                // If the previous line was a list, close the list
                if (formattedText.endsWith('</li>')) {
                    formattedText += '</ul>';
                }
                // Add the line as a paragraph
                if (isNote && index === 0) {
                    formattedText += `<span style="display: block; margin-bottom: 4px;"><b>NOTE:</b> ${line.trim()}</span>`;
                } else {
                    formattedText += `<span style="display: block; margin-bottom: 4px;">${line.trim()}</span>`;
                }
            }
        });
    
        // Close any open list
        if (formattedText.endsWith('</li>')) {
            formattedText += '</ul>';
        }
    
        return formattedText;
    }

    // Helper functions: tags
    function createTagElements(meta) {
        if (!meta.type) return null;
    
        let tagsContainer = document.createElement('div');
        tagsContainer.style.textAlign = 'center'; // Center the tags
        tagsContainer.style.lineHeight = '1.5'; // Increase line spacing within the tags
    
        let tags = meta.type.split(', ');
        tags.forEach(tag => {
            let tagElement = document.createElement('span');
            tagElement.textContent = tag;
            tagElement.style.display = 'inline-block';
            tagElement.style.padding = '2px 8px';
            tagElement.style.marginRight = '5px';
            tagElement.style.marginBottom = '5px'; // Add space between tags
            tagElement.style.borderRadius = '12px';
            tagElement.style.backgroundColor = `${tagColors[tag] || '#000'}`;
    
            // Set text color based on background
            const darkBackgroundTags = ['Camera', 'Vehicles', 'Architecture', 'Urbanism', 'Trekker', 'Language', 'Miscellaneous', 'Markers', 'Bollards', 'Vegetation', 'Stickers', 'Soil', 'Flags', 'Brands'];
            if (darkBackgroundTags.includes(tag)) {
                tagElement.style.color = 'white';
            } else {
                tagElement.style.color = '#000000';
            }
    
            tagsContainer.appendChild(tagElement);
        });
    
        return tagsContainer;
    }
    
    // Helper functions: content
    function createContentElement(meta) {
        let contentElement = document.createElement('p'); // Use p to contain formatted content
        if (window.revealInfoInput && window.revealInfoInput.checked) {
            // Reveal mode: show original content
            contentElement.innerHTML = formatContent(meta.content.replace(/[\{\}]/g, ''));
        } else {
            // Hide mode: replace text within curly brackets with a single line
            contentElement.innerHTML = formatContent(meta.content.replace(/\{([^}]*)\}/g, match => 
                `<span style="border-bottom: 1.5px solid white; display: inline-block; width: ${6}ch; height: 2px; vertical-align: 0.25px;"></span>`));
        }
        return contentElement;
    }
    
    // Helper functions: notes
    function createNoteElement(meta) {
        if (!meta.note) return null;
    
        let noteElement = document.createElement('p'); // Use p to contain formatted note
        noteElement.style.color = 'lightgray'; // Make Notes golden
        noteElement.style.fontSize = '10px';
        if (window.revealInfoInput && window.revealInfoInput.checked) {
            // Reveal mode: show original note
            noteElement.innerHTML = formatContent(meta.note.replace(/[\{\}]/g, ''), true);
        } else {
            // Hide mode: replace text within curly brackets with a single line
            noteElement.innerHTML = formatContent(meta.note.replace(/\{([^}]*)\}/g, match => 
                `<span style="border-bottom: 1.5px solid lightgray; display: inline-block; width: ${4.5}ch; height: 2px; vertical-align: 0.25px;"></span>`), true);
        }
        return noteElement;
    }
    
    // Helper functions: images
    function createImageElement(meta) {
        if (!meta.image) return null;
    
        let imageElement = document.createElement('img');
        imageElement.src = meta.image;
        imageElement.style.maxWidth = '100%';
        imageElement.style.marginTop = '5px';
        imageElement.style.cursor = 'pointer';
    
        // Add instruction text below the image
        let instructionText = document.createElement('p');
        instructionText.textContent = 'Click on the image to enlarge it';
        instructionText.style.fontSize = '10px';
        instructionText.style.color = 'lightgray';
        instructionText.style.textAlign = 'center';
    
        if (window.revealInfoInput && window.revealInfoInput.checked) {
            // Reveal mode: show images
            imageElement.style.display = 'block';
            instructionText.style.display = 'block';
        } else {
            // Hide mode: hide images
            imageElement.style.display = 'none';
            instructionText.style.display = 'none';
        }
    
        console.log("Adding click event listener to image");
        imageElement.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log("Image clicked, opening modal");
            openModal(meta.image);
        });
    
        return { imageElement, instructionText };
    }
    
    // Helper functions: credits
    function createCreditsElement(meta) {
        if (!meta.country || !window.revealInfoInput || !window.revealInfoInput.checked) return null;
    
        let creditsElement = document.createElement('p');
        creditsElement.style.color = 'white'; // Style for credits
        let countries = meta.country.split(', ');
    
        let creditsContent = 'Learn more about ';
        countries.forEach((country, index) => {
            let countryInfo = countryData[country];
            if (countryInfo) {
                creditsContent += `<font color="#42aaf5"><a href="${countryInfo.url}" target="_blank"><b>${country}</b></a></font>`;
                if (countryInfo.code) {
                    creditsContent += `<span class="fi fi-${countryInfo.code}" style="vertical-align: 0.25px; margin-right: 4px; margin-left: 4px"></span>`;
                }
            } else {
                creditsContent += `<b>${country}</b>`;
            }
            if (index < countries.length - 1) {
                creditsContent += ' and ';
            }
        });
        creditsContent += ' on PlonkIt!';
        creditsElement.innerHTML = `<i>${creditsContent}</i>`;
        return creditsElement;
    }

    // Display an individual meta
    function showMeta(index) {
        window.currentIndex = index; // Update the global currentIndex
        const metasElements = document.querySelectorAll('.meta-container');
        metasElements.forEach((el, i) => el.style.display = (i === index) ? 'block' : 'none');
        const carouselCounter = document.getElementById('carouselCounter');
        if (carouselCounter) {
            carouselCounter.textContent = `${index + 1}/${metasElements.length}`;
        }
    }
    
    // Filter metas into tabs
    function showMetasByLevel(level, resetIndex = true) {
        window.currentLevel = level; // Set the current level
        const metas = window.currentMetas.filter(meta => meta.level === level);
        const metaContent = document.getElementById('meta-content');
        const initialMessage = document.getElementById('initial-message');
        const carouselControls = document.getElementById('carousel-controls');
    
        if (metas.length === 0) {
            metaContent.innerHTML = `<p><i>No tips found at the ${level.toLowerCase()} level.</i></p>`;
            metaContent.style.fontSize = '12px';
            metaContent.style.textAlign = 'center';
            carouselControls.style.display = 'none'; // Hide carousel controls
        } else {
            metaContent.innerHTML = metas.map((meta, index) => {
                let creditsElement = createCreditsElement(meta);
                let imageElements = createImageElement(meta);
                return `
                    <section class="meta-container" style="display: ${index === 0 ? 'block' : 'none'};">
                        <div style="margin-bottom: 10px; font-size: 12px;">
                            ${createTagElements(meta).outerHTML}
                            ${createContentElement(meta).outerHTML}
                            ${meta.note ? createNoteElement(meta).outerHTML : ''}
                            ${imageElements ? imageElements.imageElement.outerHTML + imageElements.instructionText.outerHTML : ''}
                            ${creditsElement ? creditsElement.outerHTML : ''}
                        </div>
                    </section>
                `;
            }).join('');
            metaContent.style.textAlign = 'left';
            carouselControls.style.display = 'block'; // Show carousel controls
        }
    
        initialMessage.style.display = 'none';
        metaContent.style.display = 'block';
    
        // Update tab styles
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`tab-${level.toLowerCase()}`).classList.add('active');
    
        // Reset carousel index when switching tabs, unless specified otherwise
        if (resetIndex) {
            window.currentIndex = 0;
        }
    
        // Show the current meta
        showMeta(window.currentIndex);
    
        // Add carousel functionality to cycle through metas
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        const carouselCounter = document.getElementById('carouselCounter');
    
        if (prevButton && nextButton && carouselCounter) {
            prevButton.onclick = () => {
                window.currentIndex = (window.currentIndex > 0) ? window.currentIndex - 1 : metas.length - 1;
                showMeta(window.currentIndex);
            };
    
            nextButton.onclick = () => {
                window.currentIndex = (window.currentIndex < metas.length - 1) ? window.currentIndex + 1 : 0;
                showMeta(window.currentIndex);
            };
    
            // Update the counter
            carouselCounter.textContent = `${window.currentIndex + 1}/${metas.length}`;
        }
    
        // Reattach event listeners for images
        metas.forEach((meta, index) => {
            let imageElements = createImageElement(meta);
            if (imageElements) {
                let imageElement = document.querySelector(`.meta-container:nth-child(${index + 1}) img`);
                if (imageElement) {
                    imageElement.addEventListener('click', (event) => {
                        event.stopPropagation();
                        console.log("Image clicked, opening modal");
                        openModal(meta.image);
                    });
                }
            }
        });
    }
    
    // Check if the currently active tab is clicked again
    function toggleMetasByLevel(level) {
        if (window.currentLevel === level) {
            // If the current tab is clicked again, show the initial message
            displayMetas(window.currentMetas);
            window.currentLevel = null; // Reset the current level
            changeHintsContainerBackground(null); // Reset background color
        } else {
            showMetasByLevel(level);
            changeHintsContainerBackground(level); // Change background color based on the active tab
        }
    }

    // Displaying the metas
    function displayMetas(metas) {
        if (window.hintsContent) {
            // Check if an error message is displayed
            if (errorDisplayed) {
                return; // Skip refreshing metas if an error message is displayed
            }
            window.hintsContent.innerHTML = ''; // Clear only the content area
        }
    
        window.hintsContent.style.display = 'block'; // Change from flex to block for normal flow
        window.hintsContent.style.textAlign = 'left'; // Align text to the left
    
        // Extract unique tags
        let uniqueTags = new Set();
        metas.forEach(meta => {
            if (meta.type) {
                meta.type.split(', ').forEach(tag => uniqueTags.add(tag));
            }
        });
    
        // Create a temporary meta object to use createTagElements
        let tempMeta = { type: Array.from(uniqueTags).join(', ') };
        let tagsContainer = createTagElements(tempMeta);
    
        // Display initial message
        let initialMessage = `
            <div id="tabs" style="display: flex; justify-content: center; margin-bottom: 10px;">
                <div id="tab-continent" class="tab" style="padding: 10px; cursor: pointer; border: 1px solid white; width: 100px;">Continent</div>
                <div id="tab-country" class="tab" style="padding: 10px; cursor: pointer; border: 1px solid white; width: 100px;">Country</div>
                <div id="tab-region" class="tab" style="padding: 10px; cursor: pointer; border: 1px solid white; width: 100px;">Region</div>
            </div>
            <div id="carousel-controls" style="text-align: center; margin-top: 5px; margin-bottom: 5px; display: none;">
                <button id="prevButton" style="margin-right: 10px; cursor: pointer; background-color: transparent; border: none; color: white;">←</button>
                <span id="carouselCounter" style="color: white; font-size: 11px;"></span>
                <button id="nextButton" style="margin-left: 10px; cursor: pointer; background-color: transparent; border: none; color: white;">→</button>
            </div>
            <div id="initial-message" style="text-align: center; font-size: 12px;">
                <p style="margin-bottom: 10px;">This location contains the following hints:</p>
                <div class="tags-container" style="text-align: center; margin-bottom: 10px;">
                    ${tagsContainer.innerHTML}
                </div>
                <p>To narrow down where you are, click on one of the tabs above.</p>
            </div>
            <div id="meta-content" style="display: none;"></div>
        `;
        window.hintsContent.innerHTML = initialMessage;
    
        // Store the current metas for refreshing
        window.currentMetas = metas;
    
        // Add event listeners to tabs
        document.getElementById('tab-continent').addEventListener('click', () => toggleMetasByLevel('Continent'));
        document.getElementById('tab-country').addEventListener('click', () => toggleMetasByLevel('Country'));
        document.getElementById('tab-region').addEventListener('click', () => toggleMetasByLevel('Region'));
    
        // Add CSS for hover effects and active tab highlighting
        const style = document.createElement('style');
        style.innerHTML = `
            .tab {
                transition: background-color 0.3s, color 0.3s;
                background-color: transparent;
                color: white;
                text-transform: uppercase;
                font-weight: bold;
                font-style: italic;
                width: 100px; /* Set fixed width for tabs */
                text-align: center; /* Center text within tabs */
            }
            .tab:hover {
                background-color:rgb(220, 220, 220); /* Hover color */
                color: white;
            }
            .tab.active {
                background-color:rgb(220, 220, 220); /* Active tab color */
                color: white;
                border-bottom: none;
            }
            #tab-continent.active {
                background-color:rgb(79, 181, 255);
            }
            #tab-country.active {
                background-color: rgb(202, 192, 51);
            }
            #tab-region.active {
                background-color: rgb(239, 63, 63);
            }
            .tags-container span {
                line-height: 1.5; /* Increase line spacing within tags */
                margin-bottom: 5px; /* Add space between tags */
                display: inline-block; /* Ensure tags are inline-block */
            }
        `;
        document.head.appendChild(style);
    }

    // Picture enlargement
    function openModal(imageSrc) {
        console.log("Opening modal with image source:", imageSrc);
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = document.querySelector('.close');
    
        modal.style.display = 'flex'; // Set display to flex when showing the modal
        modalImg.src = imageSrc;
    
        // Add instruction text for closing the modal
        let instructionText = document.getElementById('modalInstructionText');
        if (!instructionText) {
            instructionText = document.createElement('div');
            instructionText.id = 'modalInstructionText';
            instructionText.textContent = 'Click anywhere outside the image or on the "X" to close';
            instructionText.style.position = 'absolute';
            instructionText.style.bottom = '20px';
            instructionText.style.width = '100%';
            instructionText.style.textAlign = 'center';
            instructionText.style.color = 'white';
            instructionText.style.fontSize = '14px';
            modal.appendChild(instructionText);
        }
    
        function closeModal() {
            console.log("Closing modal");
            modal.style.display = 'none';
            if (instructionText) {
                instructionText.remove(); // Remove instruction text when closing
            }
        }
    
        closeBtn.onclick = closeModal;
    
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };
    
        // Close the modal if the hints container is clicked
        window.hintsContainer.addEventListener('click', closeModal);
    }

    // Change the background color of the hints container
    function changeHintsContainerBackground(level) {
        const hintsContainer = window.hintsContainer;
        if (!hintsContainer) return;
    
        switch (level) {
            case 'Continent':
                hintsContainer.style.backgroundColor = 'rgba(8, 24, 35, 0.7)'; // Light blue tinge
                break;
            case 'Country':
                hintsContainer.style.backgroundColor = 'rgba(37, 35, 8, 0.7)'; // Light yellow tinge
                break;
            case 'Region':
                hintsContainer.style.backgroundColor = 'rgba(38, 8, 8, 0.7)'; // Light red tinge
                break;
            default:
                hintsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Default background color
                break;
        }
    }

    //// MISCELLANEOUS
    // Global error handler
    window.onerror = function(message, source, lineno, colno, error) {
        console.error("An error occurred:", message, "at", source, ":", lineno, ":", colno, error);
    };

    //// ACTUAL ACTIONS
    // Obtain first location (must be before map-checking to guarantee functionality after refreshing)
    interceptGoogleMapsAPI();

    // Initialize UI
    checkMap();
    injectCSS(flagiconsUrl);

    // Start observing round changes
    observeRoundChange();
    }

// Run
runScript();