// ==UserScript==
// @name         MAM Points Per Hour Menu Elements
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display points per hour on MAM with improved performance and features
// @author       MidniteRyder
// @match        https://www.myanonamouse.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509307/MAM%20Points%20Per%20Hour%20Menu%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/509307/MAM%20Points%20Per%20Hour%20Menu%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    // Configuration
    const CONFIG = {
        REFRESH_INTERVAL: 1200000, // 20 minutes in milliseconds
        POINTS_PER_HOUR_REGEX: /worth ([\d.,]+) per hour/, // Matches both . and ,
        DEBUG: false // Set to true to enable debug logging
    };
 
    // Caching DOM elements
    const CACHED_ELEMENTS = {
        userStatDiv: null,
        ratioElement: null
    };
 
    // Styles
    GM_addStyle(`
        .pph-display { color: #4CAF50; }
        .pph-error { color: #f44336; }
        .pph-loading { opacity: 0.5; }
    `);
 
    // Utility functions
    const logger = (message, type = 'log') => {
        if (CONFIG.DEBUG || type === 'error') {
            console[type](`[MAM PPH] ${message}`);
        }
    };
 
    const sanitizeHTML = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };
 
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
 
    // Main functionality
    const getUserId = () => {
        const userMenuLink = document.querySelector('a[href^="/u/"]');
        return userMenuLink ? userMenuLink.getAttribute('href').split('/')[2] : null;
    };
 
    const updateDOMElement = (elementId, content, isError = false, isLoading = false) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
            element.className = isError ? 'pph-error' : 'pph-display';
            element.classList.toggle('pph-loading', isLoading);
        }
    };
 
    const addOrUpdateElement = (parentElement, elementId, content, href = null) => {
        let element = document.getElementById(elementId);
        if (!element) {
            element = document.createElement('a');
            element.id = elementId;
            if (href) element.href = href;
            parentElement.appendChild(element);
        }
        element.textContent = content;
        return element;
    };
 
    const updatePointsPerHourDisplay = (pointsPerHour, userId, isError = false, isLoading = false) => {
        const { displayLocation, homepageOnly, displayFormat } = getStoredData();
        const isHomePage = ['/', '/index.php'].includes(window.location.pathname);
 
        const displayText = displayFormat === 'BP' ? `BP/hr: ${pointsPerHour}` : `Points/hour: ${pointsPerHour}`;
 
        if (!homepageOnly || isHomePage) {
            if (['dropdown', 'both'].includes(displayLocation)) {
                if (!CACHED_ELEMENTS.ratioElement) {
                    CACHED_ELEMENTS.ratioElement = document.getElementById('RatioTD');
                }
                if (CACHED_ELEMENTS.ratioElement && CACHED_ELEMENTS.ratioElement.parentNode) {
                    const pphElement = addOrUpdateElement(
                        CACHED_ELEMENTS.ratioElement.parentNode,
                        'PPHTDValue',
                        displayText,
                        null
                    );
                    pphElement.className = isError ? 'pph-error' : 'pph-display';
                    pphElement.classList.toggle('pph-loading', isLoading);
                }
            }
 
            if (['userStat', 'both'].includes(displayLocation)) {
                if (!CACHED_ELEMENTS.userStatDiv) {
                    CACHED_ELEMENTS.userStatDiv = document.getElementById('userStat');
                }
                if (CACHED_ELEMENTS.userStatDiv) {
                    const element = addOrUpdateElement(
                        CACHED_ELEMENTS.userStatDiv,
                        'tmPPH',
                        displayText,
                        `/u/${userId}`
                    );
                    element.className = isError ? 'pph-error' : 'pph-display';
                    element.classList.toggle('pph-loading', isLoading);
                }
            }
        }
    };
 
    const getStoredData = () => ({
        pointsPerHour: GM_getValue('MAM_PPH', null),
        lastUpdateTime: GM_getValue('MAM_PPH_LAST_UPDATE', 0),
        homepageOnly: GM_getValue('MAM_PPH_HOMEPAGE_ONLY', false),
        displayLocation: GM_getValue('MAM_PPH_DISPLAY_LOCATION', 'both'),
        displayFormat: GM_getValue('MAM_PPH_DISPLAY_FORMAT', 'Points')
    });
 
    const setStoredData = (pointsPerHour) => {
        GM_setValue('MAM_PPH', pointsPerHour);
        GM_setValue('MAM_PPH_LAST_UPDATE', Date.now());
    };
 
    const fetchUserData = async (userId) => {
        try {
            const response = await fetch(`https://www.myanonamouse.net/u/${userId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
 
            const infoElements = doc.querySelectorAll('td.row1[align="left"][width="90%"]');
            const infoElement = Array.from(infoElements).find(el => el.textContent.includes('Last update'));
 
            if (infoElement) {
                const pointsMatch = infoElement.textContent.match(CONFIG.POINTS_PER_HOUR_REGEX);
                if (pointsMatch && pointsMatch[1]) {
                    return pointsMatch[1].trim();
                }
            }
            throw new Error('Failed to parse user data');
        } catch (error) {
            logger(`Error fetching user data: ${error.message}`, 'error');
            return null;
        }
    };
 
    const updatePointsPerHour = async (forceUpdate = false) => {
        const userId = getUserId();
        if (!userId) {
            logger('User ID not found', 'error');
            updatePointsPerHourDisplay('Error', userId, true);
            return;
        }
 
        const { pointsPerHour: storedPointsPerHour, lastUpdateTime } = getStoredData();
        const currentTime = Date.now();
 
        if (!forceUpdate && storedPointsPerHour && lastUpdateTime && (currentTime - lastUpdateTime < CONFIG.REFRESH_INTERVAL)) {
            updatePointsPerHourDisplay(storedPointsPerHour, userId);
            return;
        }
 
        updatePointsPerHourDisplay('Loading...', userId, false, true);
 
        const newPointsPerHour = await fetchUserData(userId);
        if (newPointsPerHour) {
            if (newPointsPerHour !== storedPointsPerHour) {
                setStoredData(newPointsPerHour);
                logger(`Points per hour updated: ${newPointsPerHour}`);
            } else {
                logger('Points per hour unchanged');
            }
            updatePointsPerHourDisplay(newPointsPerHour, userId);
        } else {
            updatePointsPerHourDisplay('Error', userId, true);
        }
    };
 
    // Menu command functions
    const toggleHomepageOnly = () => {
        const currentSetting = GM_getValue('MAM_PPH_HOMEPAGE_ONLY', false);
        const newSetting = !currentSetting;
        GM_setValue('MAM_PPH_HOMEPAGE_ONLY', newSetting);
        alert(`Display: Homepage Only is now ${newSetting ? 'enabled' : 'disabled'}. Please refresh the page for changes to take effect.`);
        updateMenuCommands();
    };
 
    const setDisplayLocation = (location) => {
        GM_setValue('MAM_PPH_DISPLAY_LOCATION', location);
        alert(`Display location set to ${location}. Please refresh the page for changes to take effect.`);
        updateMenuCommands();
    };
 
    const setDisplayFormat = (format) => {
        GM_setValue('MAM_PPH_DISPLAY_FORMAT', format);
        alert(`Display format set to ${format}. Please refresh the page for changes to take effect.`);
        updateMenuCommands();
    };
 
    let menuCommandIds = {};
 
    const updateMenuCommands = () => {
        Object.values(menuCommandIds).forEach(id => GM_unregisterMenuCommand(id));
 
        const { homepageOnly, displayLocation, displayFormat } = getStoredData();
 
        // Display: Homepage Only
        menuCommandIds.homepageOnly = GM_registerMenuCommand(
            `Display: Homepage Only (${homepageOnly ? 'Enabled' : 'Disabled'})`,
            toggleHomepageOnly
        );
 
        // Display: Dropdown Only
        menuCommandIds.dropdown = GM_registerMenuCommand(
            `Display: Dropdown Only ${displayLocation === 'dropdown' ? '(Active)' : ''}`,
            () => setDisplayLocation('dropdown')
        );
 
        // Display: UserStat Menu Only
        menuCommandIds.userStat = GM_registerMenuCommand(
            `Display: UserStat Menu Only ${displayLocation === 'userStat' ? '(Active)' : ''}`,
            () => setDisplayLocation('userStat')
        );
 
        // Display: Both Locations
        menuCommandIds.both = GM_registerMenuCommand(
            `Display: Both Locations ${displayLocation === 'both' ? '(Active)' : ''}`,
            () => setDisplayLocation('both')
        );
 
        // Display Format: Points/Hour
        menuCommandIds.displayFormatPoints = GM_registerMenuCommand(
            `Display Format: Points/Hour ${displayFormat === 'Points' ? '(Active)' : ''}`,
            () => setDisplayFormat('Points')
        );
 
        // Display Format: BP/hr
        menuCommandIds.displayFormatBP = GM_registerMenuCommand(
            `Display Format: BP/hr ${displayFormat === 'BP' ? '(Active)' : ''}`,
            () => setDisplayFormat('BP')
        );
 
        // Toggle Debug Mode
        menuCommandIds.debug = GM_registerMenuCommand(
            `Toggle Debug Mode (${CONFIG.DEBUG ? 'Enabled' : 'Disabled'})`,
            () => {
                CONFIG.DEBUG = !CONFIG.DEBUG;
                alert(`Debug mode is now ${CONFIG.DEBUG ? 'enabled' : 'disabled'}.`);
            }
        );
    };
 
    // Initialization
    const init = () => {
        const userId = getUserId();
        if (!userId) return;
 
        // Check if we're on the "My Info" page
        const isMyInfoPage = window.location.pathname.startsWith('/u/');
 
        if (isMyInfoPage) {
            // Check for updates on the "My Info" page
            const checkAndUpdateIfChanged = async () => {
                const { pointsPerHour: storedPointsPerHour } = getStoredData();
                const newPointsPerHour = await fetchUserData(userId);
                
                if (newPointsPerHour && newPointsPerHour !== storedPointsPerHour) {
                    logger('Points per hour changed on My Info page. Updating...');
                    setStoredData(newPointsPerHour);
                    updatePointsPerHourDisplay(newPointsPerHour, userId);
                } else {
                    logger('Points per hour unchanged on My Info page');
                    if (storedPointsPerHour) {
                        updatePointsPerHourDisplay(storedPointsPerHour, userId);
                    }
                }
            };
            
            checkAndUpdateIfChanged();
        } else {
            const { lastUpdateTime } = getStoredData();
            const currentTime = Date.now();
 
            if (currentTime - lastUpdateTime >= CONFIG.REFRESH_INTERVAL) {
                const debouncedUpdate = debounce(updatePointsPerHour, 250);
                debouncedUpdate();
            } else {
                const { pointsPerHour } = getStoredData();
                if (pointsPerHour) {
                    updatePointsPerHourDisplay(pointsPerHour, userId);
                } else {
                    // If no stored data, fetch new data
                    updatePointsPerHour(true);
                }
            }
        }
    };
 
    // Run the script
    updateMenuCommands();
    init();
 
})();