// ==UserScript==
// @name         GeoGuessr Hide UI
// @namespace    https://greasyfork.org/en/users/1501889
// @version      1312161.1312
// @description  lets you hide ui in several ways
// @author       Clemens
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545244/GeoGuessr%20Hide%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/545244/GeoGuessr%20Hide%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const localStorageKeyViewMode = 'geoguessr_view_mode_v3';
    const localStorageKeyPreviousViewMode = 'geoguessr_previous_view_mode_v3';
    const localStorageKeyMapHidden = 'geoguessr_map_hidden_v3';
    const localStorageKeyHealthbarsHidden = 'geoguessr_healthbars_hidden_v3';

    const mapSelector = 'div[data-qa="guess-map"]';
    const compassSelector = '.panorama-compass_compassContainer__VAYam';
    const timerSelector = '#timernode';
    const scoreAndRoundSelector = '.game_status___YFni .status_inner__eAJp4:not(#timernode)';
    const mainStatusContainerSelector = '.game_status___YFni';
    const healthbarSelector = '.hud-2_healthbar__ut7QO, .health-bar_container__04NhD, .hud_healthbar__dpSHY';
    const bullseyeControlsSelector = '.game-panorama_controls__Bi3lQ';
    const bullseyeOverviewSelector = '.game-panorama_gameOverviewItems__Xf2qP';
    const liveChallengeControlsSelector = 'aside.game-panorama_controls__QiTp0';
    const liveChallengeOverviewSelector1 = 'div.map-status_status__I5Z6p';
    const liveChallengeOverviewSelector2 = 'div.guess-status_guessStatus__AGJUD';
    const gameLogoSelector = 'div.game_logos__XclXP';
    const clockSelector = 'div.clock_clock__pnvie';
    const partyGameDuelsControlsSelector = 'aside.duels-panorama_controls___OEib';
    const keyboardShortcutsSelector = 'div[style*="display: inline-flex; position: absolute; right: 0px; bottom: 0px;"]';

    const nonMapOverlays = [
        '.game_controls__xgq6p',
        '.game_inGameLogos__T9d3L',
        'img[alt="Google Maps Logo"]',
        bullseyeControlsSelector,
        bullseyeOverviewSelector,
        liveChallengeControlsSelector,
        liveChallengeOverviewSelector1,
        liveChallengeOverviewSelector2,
        gameLogoSelector,
        partyGameDuelsControlsSelector,
        scoreAndRoundSelector,
        timerSelector,
        clockSelector,
        keyboardShortcutsSelector
    ];

    const allUIElements = nonMapOverlays.concat([
        mapSelector,
        compassSelector,
        mainStatusContainerSelector
    ]);

    const setViewMode = (mode) => {
        const currentMode = localStorage.getItem(localStorageKeyViewMode) || 'default';
        if (currentMode !== mode) {
            localStorage.setItem(localStorageKeyPreviousViewMode, currentMode);
        }
        localStorage.setItem(localStorageKeyViewMode, mode);
        applySavedPreference();
    };

    const resetToDefault = () => {
        localStorage.setItem(localStorageKeyViewMode, 'default');
        localStorage.setItem(localStorageKeyMapHidden, 'false');
        localStorage.setItem(localStorageKeyHealthbarsHidden, 'false');
        applySavedPreference();
    };

    const applySavedPreference = () => {
        const viewMode = localStorage.getItem(localStorageKeyViewMode) || 'default';
        const isMapHidden = localStorage.getItem(localStorageKeyMapHidden) === 'true';
        const isHealthbarsHidden = localStorage.getItem(localStorageKeyHealthbarsHidden) === 'true';

        const elements = {};
        allUIElements.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                elements[selector] = el;
            }
        });

        Object.values(elements).forEach(el => { el.style.display = 'none'; });
        document.querySelectorAll(healthbarSelector).forEach(el => { el.style.display = 'none'; });

        const selectorsToShow = new Set();
        switch (viewMode) {
            case 'default':
                allUIElements.forEach(selector => selectorsToShow.add(selector));
                break;
            case 'minimal':
                selectorsToShow.add(mapSelector);
                selectorsToShow.add(compassSelector);
                selectorsToShow.add(clockSelector);
                break;
            case 'focused-timer':
                selectorsToShow.add(mapSelector);
                selectorsToShow.add(compassSelector);
                selectorsToShow.add(mainStatusContainerSelector);
                selectorsToShow.add(timerSelector);
                selectorsToShow.add(clockSelector);
                break;
            case 'focused-all-status':
                selectorsToShow.add(mapSelector);
                selectorsToShow.add(compassSelector);
                selectorsToShow.add(mainStatusContainerSelector);
                selectorsToShow.add(scoreAndRoundSelector);
                selectorsToShow.add(timerSelector);
                selectorsToShow.add(bullseyeOverviewSelector);
                selectorsToShow.add(liveChallengeOverviewSelector1);
                selectorsToShow.add(liveChallengeOverviewSelector2);
                selectorsToShow.add(clockSelector);
                break;
            case 'map-only':
                selectorsToShow.add(mapSelector);
                break;
            case 'all-hidden':
                break;
        }

        allUIElements.forEach(selector => {
            if (elements[selector]) {
                elements[selector].style.display = selectorsToShow.has(selector) ? '' : 'none';
            }
        });

        if (isMapHidden && elements[mapSelector]) {
            elements[mapSelector].style.display = 'none';
        }

        if (!isHealthbarsHidden) {
            document.querySelectorAll(healthbarSelector).forEach(el => { el.style.display = ''; });
        }
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && document.querySelector(mapSelector)) {
                applySavedPreference();
                break;
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        const target = event.target;
        const isEditable = target.isContentEditable ||
                           target.tagName === 'INPUT' ||
                           target.tagName === 'TEXTAREA' ||
                           target.tagName === 'SELECT' ||
                           (target.hasAttribute('role') && target.getAttribute('role') === 'textbox');

        if (isEditable) {
            return;
        }

        const currentViewMode = localStorage.getItem(localStorageKeyViewMode);
        const hotkeys = ['z', 'u', 'h', 'j', 'k', 'i', 'o'];

        if (hotkeys.includes(event.key)) {
            event.preventDefault();
        }

        if (event.key === 'z') {
            if (currentViewMode === 'all-hidden') {
                setViewMode('map-only');
            } else if (currentViewMode === 'map-only') {
                setViewMode('all-hidden');
            } else {
                const isMapHidden = localStorage.getItem(localStorageKeyMapHidden) === 'true';
                localStorage.setItem(localStorageKeyMapHidden, (!isMapHidden).toString());
                applySavedPreference();
            }
        }

        if (event.key === 'u') {
            setViewMode('all-hidden');
        }

        if (event.key === 'h') {
            localStorage.setItem(localStorageKeyMapHidden, 'false');
            if (currentViewMode === 'minimal') {
                setViewMode(localStorage.getItem(localStorageKeyPreviousViewMode) || 'default');
            } else {
                setViewMode('minimal');
            }
        }

        if (event.key === 'j') {
            localStorage.setItem(localStorageKeyMapHidden, 'false');
            if (currentViewMode === 'focused-timer') {
                setViewMode(localStorage.getItem(localStorageKeyPreviousViewMode) || 'default');
            } else {
                setViewMode('focused-timer');
            }
        }

        if (event.key === 'k') {
            localStorage.setItem(localStorageKeyMapHidden, 'false');
            if (currentViewMode === 'focused-all-status') {
                setViewMode(localStorage.getItem(localStorageKeyPreviousViewMode) || 'default');
            } else {
                setViewMode('focused-all-status');
            }
        }

        if (event.key === 'o') {
            const isHealthbarsHidden = localStorage.getItem(localStorageKeyHealthbarsHidden) === 'true';
            localStorage.setItem(localStorageKeyHealthbarsHidden, (!isHealthbarsHidden).toString());
            applySavedPreference();
        }

        if (event.key === 'i') {
            resetToDefault();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    applySavedPreference();
})();