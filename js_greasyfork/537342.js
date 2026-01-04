// ==UserScript==
// @name         tr nq stats
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  nq stats
// @author       aaaaaa
// @match        https://play.typeracer.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537342/tr%20nq%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/537342/tr%20nq%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // basic script settings things like debug mode and animation speed
    const showDebugMessages = true;
    const popupAnimationDuration = 2000; // how long those little numbers fly up
    const statsBoxDefaultRight = '15px';
    const statsBoxRacingRight = '220px'; // how far it's shifting when in a race

    function logMessage(message) {
        if (showDebugMessages) {
            console.log('[TR NQ Stats v11] ' + message);
        }
    }
    // these vars hold all the stats we're tracking like wpm and streak
    let cumulativeWPM = parseFloat(GM_getValue('tr_totalWPM_v11', '0.0'));
    let cumulativeAccuracy = parseFloat(GM_getValue('tr_totalAccuracy_v11', '0.0'));
    let completedRaceCount = parseInt(GM_getValue('tr_racesCompleted_v11', '0'));
    let consecutiveWins = parseInt(GM_getValue('tr_currentStreak_v11', '0'));
    let lowestWPMSpeed = parseFloat(GM_getValue('tr_worstWPM_v11', 'Infinity')); // start high so any race is lower
    let highestWPMSpeed = parseFloat(GM_getValue('tr_bestWPM_v11', '-Infinity')); // start low so any race is higher

    let isPlayerRacing = false; // simple flag are we in a race right now
    let resultsLoggedForCurrentRace = false; // did we already grab stats for this one race
    let trackedMainMenuButton = null; // keep a reference to the main menu button so we only attach the event listener once

    // this is the div element for our stats display box
    const statsDisplayElement = document.createElement('div');
    statsDisplayElement.id = 'tr_nq_stats_blackout_v11';

    // function to update the html inside the stats box with current numbers
    function refreshStatsPanel() {
        const averageWPMToDisplay = completedRaceCount > 0 ? (cumulativeWPM / completedRaceCount).toFixed(1) : '---';
        const averageAccuracyToDisplay = completedRaceCount > 0 ? (cumulativeAccuracy / completedRaceCount).toFixed(1) : '---';
        const worstWPMToDisplay = (completedRaceCount > 0 && lowestWPMSpeed !== Infinity) ? lowestWPMSpeed.toFixed(1) : '---';
        const bestWPMToDisplay = (completedRaceCount > 0 && highestWPMSpeed !== -Infinity) ? highestWPMSpeed.toFixed(1) : '---';

        statsDisplayElement.innerHTML = `
            <div class="nq-item-blackout">
                <span>Avg WPM:</span>
                <span id="nq-value-avg-wpm">${averageWPMToDisplay}</span>
            </div>
            <div class="nq-item-blackout">
                <span>Avg Acc:</span>
                <span id="nq-value-avg-acc">${averageAccuracyToDisplay}%</span>
            </div>
            <div class="nq-item-blackout">
                <span>Streak:</span>
                <span id="nq-value-streak">${consecutiveWins}</span>
            </div>
            <div class="nq-item-blackout nq-separator-blackout"></div>
            <div class="nq-item-blackout">
                <span>Worst:</span>
                <span id="nq-value-worst-wpm">${worstWPMToDisplay}</span>
            </div>
            <div class="nq-item-blackout">
                <span>Best:</span>
                <span id="nq-value-best-wpm">${bestWPMToDisplay}</span>
            </div>
        `;
    }

    // css stuff
    function setupStatsPanel() {
        GM_addStyle(`
            #tr_nq_stats_blackout_v11 {
                position: fixed;
                top: 70px;
                right: ${statsBoxDefaultRight};
                background-color: #0A0A0A;
                color: #AAAAAA;
                padding: 8px 12px;
                border-radius: 4px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                line-height: 1.4;
                z-index: 10010;
                border: 1px solid #222222;
                min-width: 135px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                display: block !important;
                transition: right 0.3s ease-in-out; /* for that smooth slide */
            }
            /* just item styling */
            .nq-item-blackout {
                display: flex; justify-content: space-between; margin-bottom: 3px;
            }
            .nq-item-blackout:last-child { margin-bottom: 0; }
            .nq-item-blackout span:first-child { color: #888888; } /* label color */
            .nq-item-blackout span:last-child { color: #BBBBBB; font-weight: bold; } /* value color */
            .nq-separator-blackout { height: 1px; background-color: #333333; margin-top: 5px; margin-bottom: 5px; }

            /* for the stat change popups */
            .stat-diff-animation {
                position: fixed; font-size: 11px; font-weight: bold; padding: 1px 3px;
                border-radius: 2px; opacity: 0;
                animation: popAndFade ${popupAnimationDuration / 1000}s ease-out forwards;
                pointer-events: none; z-index: 10011; /* needs to be above the stats box */
            }
            @keyframes popAndFade { /* define the actual animation */
                0% { opacity: 0; transform: translateY(5px) scale(0.8); }
                20% { opacity: 1; transform: translateY(-8px) scale(1.1); }
                80% { opacity: 1; transform: translateY(-12px) scale(1); }
                100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
            }
        `);
        document.body.appendChild(statsDisplayElement); // stick it on the page
        statsDisplayElement.style.display = 'block';
        refreshStatsPanel(); // fill it with initial data
        logMessage("Stats display initialized.");
    }

    function createStatPopupAnimation(displayValueElementId, valueDifference, isValuePercentage = false) {
        const animatedElement = document.getElementById(displayValueElementId); // find where the stat number is
        if (!animatedElement || isNaN(valueDifference) || valueDifference === 0) return; // no point if no change or can't find it

        const targetElementRect = animatedElement.getBoundingClientRect(); // get its position
        const animationPopup = document.createElement('span');
        animationPopup.className = 'stat-diff-animation';
        const plusOrMinusSign = valueDifference > 0 ? '+' : '';
        animationPopup.textContent = `${plusOrMinusSign}${valueDifference.toFixed(1)}${isValuePercentage ? '%' : ''}`;

        // color it green for good red for bad
        if (valueDifference > 0) {
            animationPopup.style.color = '#4CAF50'; animationPopup.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        } else {
            animationPopup.style.color = '#F44336'; animationPopup.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        }

        // position it next to the stat
        animationPopup.style.top = `${targetElementRect.top + (targetElementRect.height / 2) - 7}px`;
        animationPopup.style.left = `${targetElementRect.right + 5}px`;

        document.body.appendChild(animationPopup);
        setTimeout(() => { // clean it up after animation
            if (animationPopup.parentNode) animationPopup.parentNode.removeChild(animationPopup);
        }, popupAnimationDuration);
    }

    // writes the current stats to GM_setValue so they persist across sessions
    function saveCurrentStats() {
        GM_setValue('tr_totalWPM_v11', cumulativeWPM.toString());
        GM_setValue('tr_totalAccuracy_v11', cumulativeAccuracy.toString());
        GM_setValue('tr_racesCompleted_v11', completedRaceCount.toString());
        GM_setValue('tr_currentStreak_v11', consecutiveWins.toString());
        GM_setValue('tr_worstWPM_v11', lowestWPMSpeed.toString());
        GM_setValue('tr_bestWPM_v11', highestWPMSpeed.toString());
    }

    // handles what happens if the user bails on a race via the main menu button
    function processMainMenuClick(event) {
        logMessage('Main Menu (leave race) clicked.');
        if (isPlayerRacing) { // only if they were actually in a race
            logMessage('Quit detected: Resetting ALL stats and position.');
            consecutiveWins = 0; cumulativeWPM = 0.0; cumulativeAccuracy = 0.0; completedRaceCount = 0;
            lowestWPMSpeed = Infinity; highestWPMSpeed = -Infinity; // full reset
            isPlayerRacing = false; resultsLoggedForCurrentRace = true; // pretend race ended so it doesnt try to parse again
            statsDisplayElement.style.right = statsBoxDefaultRight; // slide box back
            saveCurrentStats(); refreshStatsPanel();
        }
    }

    // finds the "leave race"  link and makes sure our click handler is on it
    // also makes sure not to add it multiple times if the button object changes
    function setupMainMenuButtonListener() {
        const mainMenuLinkElement = document.querySelector('a.raceLeaveLink'); // the actual typeracer button
        if (mainMenuLinkElement) {
            if (trackedMainMenuButton !== mainMenuLinkElement) { // only if its a new button or first time
                if (trackedMainMenuButton) trackedMainMenuButton.removeEventListener('click', processMainMenuClick); // remove old one if any
                mainMenuLinkElement.addEventListener('click', processMainMenuClick);
                trackedMainMenuButton = mainMenuLinkElement; // remember this button
            }
        } else { // if button disappeared remove listener from old one
             if (trackedMainMenuButton) {
                trackedMainMenuButton.removeEventListener('click', processMainMenuClick);
                trackedMainMenuButton = null;
            }
        }
    }

    // tries to find the wpm and accuracy figures from the page after a race finishes
    function parseAndStoreRaceResults() {
        logMessage('Extracting race results.');
        let wpm, accuracy;
        // these selectors are specific to how typeracer shows your stats post-race
        const raceWpmElement = document.querySelector('div.tblOwnStatsNumber[title*="wpm"]');
        const raceAccuracyElement = Array.from(document.querySelectorAll('div.tblOwnStatsNumber')).find(el => el.textContent.includes('%'));

        if (raceWpmElement) wpm = parseFloat(raceWpmElement.getAttribute('title')) || parseFloat(raceWpmElement.textContent); // try title first then text
        if (raceAccuracyElement) accuracy = parseFloat(raceAccuracyElement.textContent);

        if (!isNaN(wpm) && !isNaN(accuracy)) { // got valid numbers
            let oldAverageWPM = NaN, oldAverageAccuracy = NaN;
            const previousRaceCount = completedRaceCount;
            if (previousRaceCount > 0) { // need this to calculate change in average
                oldAverageWPM = cumulativeWPM / previousRaceCount;
                oldAverageAccuracy = cumulativeAccuracy / previousRaceCount;
            }

            // update records
            if (wpm > highestWPMSpeed) highestWPMSpeed = wpm;
            if (wpm < lowestWPMSpeed) lowestWPMSpeed = wpm;
            cumulativeWPM += wpm; cumulativeAccuracy += accuracy; completedRaceCount++; consecutiveWins++;

            logMessage(`Race recorded: WPM=${wpm.toFixed(1)}, Acc=${accuracy.toFixed(1)}%.`);
            saveCurrentStats(); refreshStatsPanel(); // save and show new numbers

            // animate the changes
            if (previousRaceCount > 0) {
                const newAverageWPM = cumulativeWPM / completedRaceCount;
                const newAverageAccuracy = cumulativeAccuracy / completedRaceCount;
                createStatPopupAnimation('nq-value-avg-wpm', newAverageWPM - oldAverageWPM);
                createStatPopupAnimation('nq-value-avg-acc', newAverageAccuracy - oldAverageAccuracy, true);
            } else if (completedRaceCount === 1) { // special handling for the very first race since there's no old average
                 createStatPopupAnimation('nq-value-avg-wpm', wpm);
                 createStatPopupAnimation('nq-value-avg-acc', accuracy, true);
            }
        } else {
            logMessage(`Error parsing WPM/Accuracy. WPM: ${wpm}, Acc: ${accuracy}`);
            refreshStatsPanel(); // important to refresh the panel even if parsing fails so it doesn't look stuck
        }
    }

    // this is the core logic checks page elements to see if we are in a race or not
    function updateRaceActivityStatus() {
        const statusLabel = document.querySelector('.gameStatusLabel'); // like "Go!" or "The race is on"
        const statusText = statusLabel ? statusLabel.innerText.trim() : '';
        const textInputElement = document.querySelector('input.txtInput');
        // checks if the text input field is actually enabled and visible good indicator of race active
        const isTypingInputActive = textInputElement && !textInputElement.disabled && textInputElement.offsetParent !== null;
        // check if the results table numbers are visible
        const areResultsDisplayed = document.querySelector('div.tblOwnStatsNumber[title*="wpm"]') && Array.from(document.querySelectorAll('div.tblOwnStatsNumber')).find(el => el.textContent.includes('%'));

        let hasRaceJustStarted = false;
        let hasRaceJustEnded = false;

        // race start detection: not racing now but game status says go and input is active
        if (!isPlayerRacing && (statusText === 'Go!' || statusText.startsWith('The race is on'))) {
            if (isTypingInputActive) {
                hasRaceJustStarted = true;
                isPlayerRacing = true; resultsLoggedForCurrentRace = false; // reset for new race
                if (showDebugMessages) logMessage('Race started.');
            }
        } else if (isPlayerRacing) { // if we think we're racing check for end conditions
            // race end detection (option 1): results table is visible and we havent parsed them yet
            if (areResultsDisplayed && !resultsLoggedForCurrentRace) {
                hasRaceJustEnded = true;
                if (showDebugMessages) logMessage('Race finished: Results visible.');
                parseAndStoreRaceResults();
            }
            // race end detection (option 2): input is inactive game status says finished and not parsed yet
            else if (!isTypingInputActive && (statusText.startsWith('You finished') || statusText === 'The race has ended.') && !resultsLoggedForCurrentRace) {
                hasRaceJustEnded = true;
                if (showDebugMessages) logMessage('Race finished: Status label & input inactive.');
                setTimeout(() => { // sometimes the results aren't instantly in the dom so a small delay helps
                    if (document.querySelector('div.tblOwnStatsNumber[title*="wpm"]')) parseAndStoreRaceResults();
                    else { if (showDebugMessages) logMessage('Results not found after delay.'); refreshStatsPanel(); saveCurrentStats(); }
                }, 250);
            }
            // race end detection (option 3): fallback if critical race elements disappear suggesting user left the race page
            else if (!statusLabel && !isTypingInputActive && !resultsLoggedForCurrentRace && !window.location.hash.includes("#!race")) {
                hasRaceJustEnded = true;
                if (showDebugMessages) logMessage('Race likely ended abruptly (navigated away or context lost).');
                refreshStatsPanel(); saveCurrentStats(); // save whatever we had
            }

            if (hasRaceJustEnded) {
                isPlayerRacing = false;
                resultsLoggedForCurrentRace = true; // mark as done for this race
            }
        }

        // logic for shifting the stats box left during a race and back again after
        if (isPlayerRacing && statsDisplayElement.style.right !== statsBoxRacingRight) {
            if (showDebugMessages) logMessage('Shifting stats display left for race.');
            statsDisplayElement.style.right = statsBoxRacingRight;
        } else if (!isPlayerRacing && statsDisplayElement.style.right !== statsBoxDefaultRight) {
             // dont want it snapping back if the user is just looking at post-race stats
             if (!areResultsDisplayed && (!statusLabel || !(statusText.startsWith('You finished') || statusText === 'The race has ended.'))) {
                if (showDebugMessages) logMessage('Resetting stats display to default position.');
                statsDisplayElement.style.right = statsBoxDefaultRight;
             }
        }

        if(hasRaceJustStarted || hasRaceJustEnded) refreshStatsPanel(); // call refreshStatsPanel if the race state changed to show new data
        setupMainMenuButtonListener(); // re-check the main menu button listener just in case it got removed or changed by TR's js
    }

    logMessage('Script starting (NQ Stats Final Tweaks v11).');
    setupStatsPanel(); // call to initialize the stats display when the script loads

    // MutationObserver is pretty handy for reacting to dynamic page updates on typeracer
    const pageChangeObserver = new MutationObserver(updateRaceActivityStatus);
    // watch pretty much everything for changes
    pageChangeObserver.observe(document.documentElement, { childList: true, subtree: true });
    // initial check after page load sometimes stuff isnt ready immediately
    setTimeout(updateRaceActivityStatus, 750);

    // START: Added code for resetting stats on page unload during a race
    window.addEventListener('beforeunload', function (e) {
        if (isPlayerRacing) {
            logMessage('Page is being unloaded (refresh/close) while player is racing. Resetting all stats.');
            // Reset local script variables to their initial states
            cumulativeWPM = 0.0;
            cumulativeAccuracy = 0.0;
            completedRaceCount = 0;
            consecutiveWins = 0;
            lowestWPMSpeed = Infinity;
            highestWPMSpeed = -Infinity;

            // Persist these reset values
            saveCurrentStats();
            // Note: No need to call refreshStatsPanel() as the page is unloading.
        } else {
            logMessage('Page is being unloaded (refresh/close) while player is NOT racing. Stats will be preserved.');
            // Stats are saved after each race, so they should be up-to-date.
        }
    });
    // END: Added code

})();