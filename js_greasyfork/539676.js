// ==UserScript==
// @name         LiveSport Time Zone Converter & MLS Scores
// @namespace    http://tampermonkey.net/
// @version      V3
// @description  Converts match start times on livesport.com to your local time zone and displays mock MLS scores.
// @author       Your Name
// @match        https://www.livesport.com/en/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539676/LiveSport%20Time%20Zone%20Converter%20%20MLS%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/539676/LiveSport%20Time%20Zone%20Converter%20%20MLS%20Scores.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants and Configuration ---
    const TIME_ZONE_SETTINGS_KEY = 'livesport_timezone_converter_enabled';
    const MLS_SCORES_SETTINGS_KEY = 'livesport_mls_scores_enabled';
    const TIME_ELEMENT_SELECTOR = '.event__time'; // Class for time elements on LiveSport

    // --- Helper Functions ---

    /**
     * Converts a 24-hour time string (e.g., "14:30" or "00:00Preview") to a local time string (e.g., "2:30 PM").
     * Handles cases where extra text like "Preview" might be present.
     * Uses a dummy date for conversion, as only time is provided on the website.
     * @param {string} timeString - The raw time string from the element.
     * @returns {string} The time string in the user's local time zone and preferred format, or original if invalid.
     */
    function convertToLocalTime(timeString) {
        if (!timeString || timeString.trim() === '') {
            return '';
        }

        // Use a regular expression to extract only the HH:MM part
        const match = timeString.match(/(\d{1,2}:\d{2})/); // Finds patterns like "1:00" or "14:30"

        if (!match) {
            // If no valid time pattern found, return the original string or empty.
            // This handles cases like "Live" or empty strings gracefully.
            return timeString;
        }

        const cleanTimeString = match[1]; // Get the captured HH:MM string

        const [hours, minutes] = cleanTimeString.split(':').map(Number);

        // Check if hours and minutes are valid numbers
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.warn(`Attempted to convert invalid time: ${cleanTimeString}`);
            return timeString; // Return original if parsing resulted in invalid numbers
        }

        // Create a Date object for today with the specified hours and minutes.
        // This ensures the conversion respects the user's local timezone offset.
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        // Use toLocaleTimeString for user-friendly format, e.g., "2:30 PM" or "14:30"
        // depending on user's locale settings.
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Processes all time elements on the page, converting them if the toggle is enabled.
     * Stores original time in a data attribute for easy toggling.
     */
    function updateLiveSportTimes() {
        const isEnabled = localStorage.getItem(TIME_ZONE_SETTINGS_KEY) === 'true';
        const timeElements = document.querySelectorAll(TIME_ELEMENT_SELECTOR);

        timeElements.forEach(el => {
            // Get the original time from the data attribute if it exists, otherwise from textContent
            // Trim whitespace from the content
            const currentDisplayedTime = el.textContent.trim();
            const originalStoredTime = el.getAttribute('data-original-time');

            // If the element doesn't have an original time stored yet, capture its current textContent
            if (!originalStoredTime) {
                el.setAttribute('data-original-time', currentDisplayedTime);
            }

            // Decide which time to use for conversion/reversion
            const timeToProcess = originalStoredTime || currentDisplayedTime; // Prefer stored original if available

            if (isEnabled) {
                // If already converted, no need to convert again, just display the data-converted-time
                if (el.hasAttribute('data-converted-time')) {
                    el.textContent = el.getAttribute('data-converted-time');
                } else {
                    const localTime = convertToLocalTime(timeToProcess);
                    el.setAttribute('data-converted-time', localTime); // Store converted time
                    el.textContent = localTime;
                }
            } else {
                // Revert to original time if toggle is off and original time exists
                if (originalStoredTime) {
                    el.textContent = originalStoredTime;
                    el.removeAttribute('data-converted-time'); // Clear converted time
                }
            }
        });
    }

    /**
     * Renders mock MLS score data into the MLS scores panel.
     * This function uses static data based on your screenshot.
     */
    function renderMlsScores() {
        const mlsScoresPanel = document.getElementById('mls-scores-panel');
        const isEnabled = localStorage.getItem(MLS_SCORES_SETTINGS_KEY) === 'true';

        if (isEnabled) {
            mlsScoresPanel.classList.add('active');
            // Mock data based on the provided screenshot
            const mockScores = [
                {
                    date: 'Sun 06/15',
                    matches: [
                        {
                            competition: 'FIFA Club World Cup',
                            stage: 'Final',
                            homeTeam: 'Palmeiras', // Using full name for clarity, assumed from logo
                            homeAbbr: 'SEP',
                            homeScore: '0',
                            awayTeam: 'Porto', // Using full name for clarity, assumed from logo
                            awayAbbr: 'POR',
                            awayScore: '0',
                            homeLogo: 'https://placehold.co/20x20/ffffff/000000?text=SEP', // Placeholder, ideally inline SVG
                            awayLogo: 'https://placehold.co/20x20/ffffff/000000?text=POR' // Placeholder, ideally inline SVG
                        },
                        {
                            competition: 'CONCACAF Gold Cup',
                            stage: 'Final',
                            homeTeam: 'Haiti', // Assumed from flag
                            homeAbbr: 'HAI',
                            homeScore: '0',
                            awayTeam: 'Saudi Arabia', // Assumed from flag
                            awayAbbr: 'KSA',
                            awayScore: '1',
                            homeLogo: 'https://placehold.co/20x20/ffffff/000000?text=HAI', // Placeholder, ideally inline SVG
                            awayLogo: 'https://placehold.co/20x20/ffffff/000000?text=KSA' // Placeholder, ideally inline SVG
                        }
                    ]
                }
            ];

            let htmlContent = '';
            mockScores.forEach(day => {
                htmlContent += `<div class="mls-day-header">${day.date}</div>`;
                day.matches.forEach(match => {
                    htmlContent += `
                        <div class="mls-match-card">
                            <div class="mls-match-header">
                                <span class="mls-competition">${match.competition}</span>
                                <span class="mls-stage">${match.stage}</span>
                            </div>
                            <div class="mls-team-row">
                                <img src="${match.homeLogo}" alt="${match.homeAbbr} Logo" class="mls-team-logo"/>
                                <span class="mls-team-abbr">${match.homeAbbr}</span>
                                <span class="mls-score">${match.homeScore}</span>
                            </div>
                            <div class="mls-team-row">
                                <img src="${match.awayLogo}" alt="${match.awayAbbr} Logo" class="mls-team-logo"/>
                                <span class="mls-team-abbr">${match.awayAbbr}</span>
                                <span class="mls-score">${match.awayScore}</span>
                            </div>
                        </div>
                    `;
                });
            });
            mlsScoresPanel.innerHTML = htmlContent;
        } else {
            mlsScoresPanel.classList.remove('active');
            mlsScoresPanel.innerHTML = ''; // Clear content when hidden
        }
    }


    // --- UI Creation ---

    // Inject CSS for the floating buttons and settings panel
    GM_addStyle(`
        /* Common icon styles */
        .floating-icon {
            position: fixed;
            width: 45px;
            height: 45px;
            background-color: #333;
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transition: background-color 0.2s ease, transform 0.2s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            border: 2px solid #555;
        }
        .floating-icon:hover {
            background-color: #555;
            transform: scale(1.05);
        }

        #timezone-settings-icon {
            bottom: 20px;
            right: 20px;
        }

        #mls-scores-icon {
            bottom: 75px; /* Position above settings icon */
            right: 20px;
            font-size: 20px; /* Slightly smaller for soccer ball */
        }

        /* Settings Panel */
        #timezone-settings-panel {
            position: fixed;
            bottom: 130px; /* Position above MLS icon */
            right: 20px;
            background-color: #444;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            padding: 15px;
            z-index: 9999;
            display: none; /* Hidden by default */
            flex-direction: column;
            gap: 10px;
            color: white;
            font-family: 'Inter', sans-serif;
            border: 1px solid #666;
            min-width: 180px; /* Ensure enough width for text */
        }
        #timezone-settings-panel.active {
            display: flex;
        }
        #timezone-settings-panel label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 16px;
            user-select: none;
        }
        #timezone-settings-panel input[type="checkbox"] {
            margin-right: 10px;
            width: 20px;
            height: 20px;
            accent-color: #007bff;
            cursor: pointer;
        }
        #timezone-settings-panel .panel-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 18px;
            border-bottom: 1px solid #666;
            padding-bottom: 5px;
        }

        /* MLS Scores Panel */
        #mls-scores-panel {
            position: fixed;
            bottom: 20px;
            right: 80px; /* Position to the left of the icons */
            background-color: #222;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            padding: 15px;
            z-index: 9998; /* Below settings panel */
            display: none; /* Hidden by default */
            flex-direction: column;
            gap: 10px;
            color: white;
            font-family: 'Inter', sans-serif;
            border: 1px solid #555;
            min-width: 250px; /* Adjust as needed */
            max-height: 80vh; /* Prevent panel from getting too tall */
            overflow-y: auto; /* Enable scrolling if content overflows */
        }
        #mls-scores-panel.active {
            display: flex;
        }
        .mls-day-header {
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #444;
            color: #bbb;
        }
        .mls-match-card {
            background-color: #333;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .mls-match-header {
            font-size: 0.9em;
            color: #ccc;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .mls-match-header .mls-stage {
            font-style: italic;
            font-size: 0.8em;
            color: #aaa;
        }
        .mls-team-row {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        .mls-team-logo {
            width: 24px; /* Adjust size as needed */
            height: 24px;
            border-radius: 50%;
            margin-right: 8px;
            object-fit: contain;
            border: 1px solid #666; /* Small border for visibility */
        }
        .mls-team-abbr {
            flex-grow: 1;
            font-weight: bold;
            font-size: 1.1em;
        }
        .mls-score {
            font-weight: bold;
            font-size: 1.2em;
            color: #eee;
        }
    `);

    // Create the floating settings icon (gear)
    const settingsIcon = document.createElement('div');
    settingsIcon.id = 'timezone-settings-icon';
    settingsIcon.className = 'floating-icon';
    settingsIcon.innerHTML = '⚙️';
    document.body.appendChild(settingsIcon);

    // Create the floating MLS scores icon (soccer ball)
    const mlsScoresIcon = document.createElement('div');
    mlsScoresIcon.id = 'mls-scores-icon';
    mlsScoresIcon.className = 'floating-icon';
    mlsScoresIcon.innerHTML = '⚽️';
    document.body.appendChild(mlsScoresIcon);

    // Create the settings panel
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'timezone-settings-panel';
    settingsPanel.innerHTML = `
        <div class="panel-title">Time Zone Settings</div>
        <label>
            <input type="checkbox" id="timezone-toggle">
            Display Local Time
        </label>
        <label>
            <input type="checkbox" id="mls-scores-toggle">
            Display MLS Scores (Mock)
        </label>
    `;
    document.body.appendChild(settingsPanel);

    // Create the MLS Scores display panel
    const mlsScoresDisplayPanel = document.createElement('div');
    mlsScoresDisplayPanel.id = 'mls-scores-panel';
    document.body.appendChild(mlsScoresDisplayPanel);


    const timezoneToggle = document.getElementById('timezone-toggle');
    const mlsScoresToggle = document.getElementById('mls-scores-toggle');

    // --- Event Listeners ---

    // Toggle settings panel visibility
    settingsIcon.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
        // If MLS panel is open, close it to avoid overlap
        mlsScoresDisplayPanel.classList.remove('active');
    });

    // Toggle MLS scores panel visibility
    mlsScoresIcon.addEventListener('click', () => {
        mlsScoresDisplayPanel.classList.toggle('active');
        // If settings panel is open, close it to avoid overlap
        settingsPanel.classList.remove('active');
        if (mlsScoresDisplayPanel.classList.contains('active')) {
            renderMlsScores(); // Render/re-render when opening
        }
    });

    // Save LiveSport time zone toggle state and update times when checkbox changes
    timezoneToggle.addEventListener('change', () => {
        localStorage.setItem(TIME_ZONE_SETTINGS_KEY, timezoneToggle.checked);
        updateLiveSportTimes();
    });

    // Save MLS scores toggle state and update display when checkbox changes
    mlsScoresToggle.addEventListener('change', () => {
        localStorage.setItem(MLS_SCORES_SETTINGS_KEY, mlsScoresToggle.checked);
        renderMlsScores();
    });

    // --- Initialization ---

    // Set initial toggle states from localStorage
    const isTimeZoneEnabledInitially = localStorage.getItem(TIME_ZONE_SETTINGS_KEY) === 'true';
    timezoneToggle.checked = isTimeZoneEnabledInitially;

    const isMlsScoresEnabledInitially = localStorage.getItem(MLS_SCORES_SETTINGS_KEY) === 'true';
    mlsScoresToggle.checked = isMlsScoresEnabledInitially;

    // Perform initial time conversion for LiveSport times
    updateLiveSportTimes();

    // Render MLS scores if enabled on load
    if (isMlsScoresEnabledInitially) {
        mlsScoresDisplayPanel.classList.add('active'); // Ensure panel is active if enabled
        renderMlsScores();
    }

    // Use MutationObserver to detect new elements being added to the DOM (e.g., infinite scroll) for LiveSport times
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // Check if any added node or its children contain time elements
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector(TIME_ELEMENT_SELECTOR)) {
                        updateLiveSportTimes();
                    }
                });
            }
        });
    });

    // Observe changes in the document body and its descendants
    observer.observe(document.body, { childList: true, subtree: true });

})();
