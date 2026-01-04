// ==UserScript==
// @name         Geoguessr Location Finder
// @namespace    http://tampermonkey.net/
// @version      2.11
// @description  Displays GeoGuessr location in a dragable infobox. Press '1' to toggle the info, '2' to switch views. For educational use.
// @author       WannabeLynx
// @match        https://www.geoguessr.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543255/Geoguessr%20Location%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/543255/Geoguessr%20Location%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SHOW_ON_START = true;
    let currentCoordinates = { lat: null, lng: null };

    let countryInfo = { name: null, code: null };
    let displayMode = 'coords';

    const style = `
        #location-finder-container {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            display: none; /* Initially hidden */
            cursor: move;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            min-width: 250px;
        }
        #location-finder-container h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        }
        #location-finder-container p {
            margin: 8px 0;
            min-height: 22px; /* Prevent layout shift while loading country */
        }
        #location-finder-container img {
             height: 20px;
             border: 1px solid #555;
             border-radius: 3px;
        }
        #location-finder-container a {
            color: #4da6ff;
            text-decoration: none;
            display: block;
            text-align: center;
            margin-top: 10px;
            background-color: #333;
            padding: 8px 12px;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        #location-finder-container a:hover {
            background-color: #555;
        }
    `;

    let infoContainer;

    function createUI() {
        if (document.getElementById('location-finder-container')) return;

        const styleSheet = document.createElement("style");
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);

        infoContainer = document.createElement('div');
        infoContainer.id = 'location-finder-container';
        infoContainer.innerHTML = '<h3>Location Finder</h3><p>Waiting for a new round...</p>';
        document.body.appendChild(infoContainer);

        makeDraggable(infoContainer);
    }

    async function fetchCountryInfo(lat, lng) {
        if (!lat || !lng) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`);
            const data = await response.json();
            if (data && data.address) {
                countryInfo = {
                    name: data.address.country,
                    code: data.address.country_code
                };
                console.log('Location Finder: Found country info', countryInfo);
                if (displayMode === 'country') {
                    updateInfoBox();
                }
            } else {
                 throw new Error("No address data in response.");
            }
        } catch (error) {
            console.error('Location Finder: Error fetching country info:', error);
            countryInfo = { name: 'Could not retrieve country', code: null };
        }
    }

    function updateInfoBox() {
        if (!infoContainer || !currentCoordinates.lat) return;

        const { lat, lng } = currentCoordinates;
        const mapsLink = `https://www.google.com/maps/@${lat},${lng},4z?entry=ttu`;
        let contentHTML = '';

        if (displayMode === 'coords') {
            contentHTML = `
                <p><strong>Latitude:</strong> ${lat.toFixed(6)}</p>
                <p><strong>Longitude:</strong> ${lng.toFixed(6)}</p>
            `;
        } else {
            if (countryInfo.name && countryInfo.code) {
                const flagUrl = `https://flagcdn.com/w40/${countryInfo.code}.png`;
                contentHTML = `
                    <p style="display: flex; align-items: center; gap: 10px;">
                        <img src="${flagUrl}" alt="${countryInfo.name} Flag">
                        <strong>${countryInfo.name}</strong>
                    </p>
                `;
            } else {
                contentHTML = `<p>${countryInfo.name || 'Loading country...'}</p>`;
            }
        }

        infoContainer.innerHTML = `
            <h3>Location Finder</h3>
            ${contentHTML}
            <a href="${mapsLink}" target="_blank">Open in Google Maps</a>
        `;
    }

    function handleCompetitiveMode() {
        if (!infoContainer) createUI();
        infoContainer.innerHTML = `
            <h3>Location Finder</h3>
            <p style="color: #ff6b6b; font-weight: bold;">Competitive mode detected!</p>
            <p>Script is disabled to prevent cheating. Play fair.</p>
        `;
        infoContainer.style.display = 'block';
    }

    function isCompetitiveMode() {
        const url = window.location.href;
        const competitivePaths = ['/duels', '/battle-royale', '/competitive', '/multiplayer'];
        return competitivePaths.some(path => url.includes(path));
    }

    function toggleInfoBox() {
        if (!infoContainer) return;
        infoContainer.style.display = (infoContainer.style.display === 'none') ? 'block' : 'none';
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function parseGameData(data) {
        if (!data) return null;
        let roundData = null;
        if (data.rounds && (data.round || data.roundNumber)) {
            roundData = data.rounds[(data.round || data.roundNumber) - 1];
        } else if (data.player && data.player.currentRound) {
            roundData = data.player.currentRound;
        }
        if (roundData) {
            if (roundData.lat && roundData.lng) return { lat: roundData.lat, lng: roundData.lng };
            if (roundData.panorama?.lat && roundData.panorama?.lng) return { lat: roundData.panorama.lat, lng: roundData.panorama.lng };
        }
        return null;
    }

    function setupKeyListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === '1') {
                e.stopImmediatePropagation();
                toggleInfoBox();
            } else if (e.key === '2') {
                if (currentCoordinates.lat !== null && !isCompetitiveMode()) {
                    e.stopImmediatePropagation();
                    displayMode = displayMode === 'coords' ? 'country' : 'coords';
                    updateInfoBox();
                }
            }
        }, true);
    }

    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            const url = typeof input === 'string' ? input : input.url;

            if (typeof url === 'string' && url.includes('/api/v3/games/')) {
                return originalFetch.apply(this, arguments).then(response => {
                    const clonedResponse = response.clone();
                    clonedResponse.json().then(data => {
                        if (isCompetitiveMode()) {
                            handleCompetitiveMode();
                            return;
                        }
                        const coords = parseGameData(data);
                        if (coords && (coords.lat !== currentCoordinates.lat || coords.lng !== currentCoordinates.lng)) {
                            console.log('Location Finder (fetch): Found new coordinates', coords);
                            currentCoordinates = coords;
                            countryInfo = { name: null, code: null };
                            displayMode = 'coords';

                            updateInfoBox();
                            fetchCountryInfo(coords.lat, coords.lng);

                            if (SHOW_ON_START) {
                                infoContainer.style.display = 'block';
                            }
                        }
                    }).catch(err => {
                        // ignore
                    });
                    return response;
                });
            }
            return originalFetch.apply(this, arguments);
        };
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    setupKeyListeners();
    interceptFetch();

})();