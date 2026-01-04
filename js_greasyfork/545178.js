// ==UserScript==
// @name         DSS: Torn Communication Helper (Fallen X)
// @namespace    Dsuttz Scripts
// @version      0.89
// @description  Adds buttons to message page and faction newsletter page to automatically load preconfigured messages.
// @author       Dsuttz [1561637]
// @match        https://www.torn.com/messages.php*
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/545178/DSS%3A%20Torn%20Communication%20Helper%20%28Fallen%20X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545178/DSS%3A%20Torn%20Communication%20Helper%20%28Fallen%20X%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==== CONFIGURATION ====
    // Change these URLs to your own Pastebin raw URLs
    const RECRUITMENT_PASTEBIN_URL = 'https://pastebin.com/raw/fufBfirF';
    const WELCOME_PASTEBIN_URL = 'https://pastebin.com/raw/0FHiHh1z';
    const WAR_PASTEBIN_URL = 'https://pastebin.com/raw/esK4RdZm';
    const OTHER_PASTEBIN_URL = 'https://pastebin.com/raw/BcXXwuEs';

    let TORN_API_KEY = GM_getValue('gm_api_key');

    // ========================

    console.log('=== TAMPERMONKEY SCRIPT LOADED ===');
    console.log('Script starting on:', window.location.href);

    validateApiKey();

    // Check if Tampermonkey is working properly
    if (typeof GM_xmlhttpRequest === 'undefined') {
        console.error('Tampermonkey is not working properly on this device/browser');
        alert('Script cannot run: Tampermonkey API not available.\n\nPlease check:\n1. Tampermonkey is installed and enabled\n2. This script has proper permissions\n3. Your browser supports userscripts');
        return;
    }

    // Prevent multiple instances
    if (window.tornCommHelperLoaded) {
        console.log('Script already loaded, skipping...');
        return;
    }

    window.tornCommHelperLoaded = true;

    function validateApiKey() {
        if (!TORN_API_KEY || TORN_API_KEY === 'undefined' || TORN_API_KEY === '') {
            let text = 'Communication Helper:\n\nPlease enter your API key.\n' +
                'Your key will be saved locally and kept private.\n' +
                'Only limited access is required. Please use a ';
            TORN_API_KEY = prompt(text, "");
            if (TORN_API_KEY) {
                GM_setValue('gm_api_key', TORN_API_KEY);
            }
        }
    }

    // HTML templates (will be loaded from Pastebin)
    let recruitmentHTML = '';
    let welcomeHTML = '';
    let warHTML = '';
    let otherHTML = '';

    // Add CSS animations to the page
    const animationCSS = `
<style>
@keyframes slideInFromRight {
    0% {
        transform: translateX(50px);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeInScale {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.button-animate-slide {
    animation: slideInFromRight 0.4s ease-out;
}

.button-animate-scale {
    animation: fadeInScale 0.3s ease-out;
}


/* Responsive button container */
@media (max-width: 768px) {
    .mobile-button-container {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 5px !important;
        margin: 10px 0 0 10px !important;
        clear: both !important;
        width: calc(100% - 10px) !important;
    }

    .mobile-button-container button {
        flex: 0 0 auto !important;
        margin: 0 !important;
    }
}

@media (min-width: 769px) {
    .desktop-button-container {
        display: inline !important;
    }
}


</style>
`;

    // Add the CSS to the page
    document.head.insertAdjacentHTML('beforeend', animationCSS);

    // Function to fetch recruitment HTML from Pastebin
    function fetchRecruitmentHTML() {
        return new Promise((resolve, reject) => {
            console.log('Fetching recruitment HTML from Pastebin...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: RECRUITMENT_PASTEBIN_URL + '?t=' + Date.now(),
                onload: function(response) {
                    if (response.status === 200) {
                        recruitmentHTML = response.responseText;
                        console.log('Successfully loaded recruitment HTML from Pastebin');
                        resolve(true);
                    } else {
                        console.error('Failed to fetch recruitment HTML from Pastebin:', response.status);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching recruitment HTML:', error);
                    resolve(false);
                },
                ontimeout: function() {
                    console.error('Timeout fetching recruitment HTML');
                    resolve(false);
                }
            });
        });
    }

    // Function to fetch welcome HTML from Pastebin
    function fetchWelcomeHTML() {
        return new Promise((resolve, reject) => {
            console.log('Fetching welcome HTML from Pastebin...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: WELCOME_PASTEBIN_URL + '?t=' + Date.now(),
                onload: function(response) {
                    if (response.status === 200) {
                        welcomeHTML = response.responseText;
                        console.log('Successfully loaded welcome HTML from Pastebin');
                        resolve(true);
                    } else {
                        console.error('Failed to fetch welcome HTML from Pastebin:', response.status);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching welcome HTML:', error);
                    resolve(false);
                },
                ontimeout: function() {
                    console.error('Timeout fetching welcome HTML');
                    resolve(false);
                }
            });
        });
    }

    // Function to fetch war HTML from Pastebin
    function fetchWarHTML() {
        return new Promise((resolve, reject) => {
            console.log('Fetching war HTML from Pastebin...');

            GM_xmlhttpRequest({
                method: 'GET',
               url: WAR_PASTEBIN_URL + '?t=' + Date.now(),
                onload: function(response) {
                    if (response.status === 200) {
                        warHTML = response.responseText;
                        console.log('Successfully loaded war HTML from Pastebin');
                        resolve(true);
                    } else {
                        console.error('Failed to fetch war HTML from Pastebin:', response.status);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching war HTML:', error);
                    resolve(false);
                },
                ontimeout: function() {
                    console.error('Timeout fetching war HTML');
                    resolve(false);
                }
            });
        });
    }

    // Function to fetch fourth HTML from Pastebin
    function fetchOtherHTML() {
        return new Promise((resolve, reject) => {
            console.log('Fetching fourth HTML from Pastebin...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: OTHER_PASTEBIN_URL + '?t=' + Date.now(),
                onload: function(response) {
                    if (response.status === 200) {
                        otherHTML = response.responseText;
                        console.log('Successfully loaded other HTML from Pastebin');
                        resolve(true);
                    } else {
                        console.error('Failed to fetch other HTML from Pastebin:', response.status);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching fourth HTML:', error);
                    resolve(false);
                },
                ontimeout: function() {
                    console.error('Timeout fetching fourth HTML');
                    resolve(false);
                }
            });
        });
    }

    // Enhanced mobile detection and API handling
    function isMobileDevice() {
        const currentWidth = window.innerWidth;

        // More comprehensive mobile detection
        const mobileUserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        const isMobileUA = mobileUserAgents.test(navigator.userAgent);
        const isMobileWidth = currentWidth <= 768;
        const isTouchDevice = 'ontouchstart' in window;

        console.log('Mobile detection:', {
            width: currentWidth,
            isMobileWidth,
            isMobileUA,
            isTouchDevice,
            platform: navigator.platform
        });

        return isMobileWidth || isMobileUA || isTouchDevice;
    }

    // Function to debug container detection
    function debugContainerDetection() {
        const nameInput1 = document.querySelector('input[placeholder="Name"]');
        const nameInput2 = document.querySelector('input[name="sendto"]');
        const formContainer = document.querySelector('div.form-title-input-text:nth-child(1)');
        const anonymousButton = document.querySelector('#anonymousButton');

        console.log('Container detection debug:', {
            nameInputByPlaceholder: !!nameInput1,
            nameInputByName: !!nameInput2,
            formContainer: !!formContainer,
            anonymousButton: !!anonymousButton,
            isMobile: isMobileDevice()
        });

        if (nameInput1 || nameInput2) {
            const nameInput = nameInput1 || nameInput2;
            const nameContainer = nameInput.closest('.form-title-input-text') || nameInput.parentNode;
            console.log('Name container found:', !!nameContainer, nameContainer?.tagName, nameContainer?.className);
        }
    }

    function getWarData() {
        return new Promise((resolve, reject) => {
            if (!TORN_API_KEY) {
                reject('No API key available');
                return;
            }

            console.log('Fetching war data from Torn API...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/v2/faction/wars?key=${TORN_API_KEY}`,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; TornScript/1.0)',

                },
                timeout: 10000,
                onload: function(response) {
                    console.log('War API Response status:', response.status);
                    console.log('War API Response text:', response.responseText);

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);

                            if (data.error) {
                                console.error('API returned error:', data.error);
                                if (data.error.code === 2) {
                                    GM_setValue('gm_api_key', '');
                                    alert('Invalid API key. Please refresh the page and enter a valid key.');
                                } else {
                                    alert('API Error: ' + data.error.error);
                                }
                                resolve(null);
                                return;
                            }

                            console.log('Successfully loaded war data from Torn API');
                            resolve(data);
                        } catch (error) {
                            console.error('Error parsing war data:', error);
                            alert('Error parsing API response: ' + error.message);
                            resolve(null);
                        }
                    } else {
                        console.error('Failed to fetch war data from Torn API:', response.status, response.statusText);
                        alert('Failed to fetch war data: HTTP ' + response.status);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('Error fetching war data:', error);
                    alert('Network error fetching war data. Check your connection.');
                    resolve(null);
                },
                ontimeout: function() {
                    console.error('Timeout fetching war data');
                    alert('Request timed out. Please try again.');
                    resolve(null);
                }
            });
        });
    }
    // Function to format Unix timestamp to readable date
    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

        const dayOfWeek = days[date.getUTCDay()];
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        // Get ordinal suffix for day
        const getOrdinalSuffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        const dayWithSuffix = day + getOrdinalSuffix(day);
        const timeString = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ' TCT';

        return timeString + ' on ' + dayOfWeek + ', ' + dayWithSuffix + ' of ' + month;
    }

    // Function to format date for subject line
    function formatSubjectDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[date.getUTCDay()];
        const day = date.getUTCDate();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();

        // Get ordinal suffix for day
        const getOrdinalSuffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        const dayWithSuffix = day + getOrdinalSuffix(day);
        const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const timeString = hour12 + ':' + minutes.toString().padStart(2, '0') + ' ' + ampm;

        return dayOfWeek + ' ' + dayWithSuffix + ' - ' + timeString + ' TCT';
    }

    // Function to get day of week from timestamp
    function getDayOfWeek(timestamp) {
        const date = new Date(timestamp * 1000);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getUTCDay()];
    }

    // Function to show war details popup
    function showWarDetailsPopup() {
        return new Promise((resolve) => {


            // Create popup HTML with mobile-responsive sizing
            const isMobile = isMobileDevice();
            const popupWidth = isMobile ? 'calc(100vw - 40px)' : '450px';
            const popupMaxWidth = isMobile ? 'calc(100vw - 40px)' : '500px';
            const popupMinWidth = isMobile ? 'auto' : '450px';
            const popupPadding = isMobile ? '15px' : '25px';
            const fontSize = isMobile ? '14px' : '14px';
            const inputFontSize = isMobile ? '16px' : '14px';
            const headerFontSize = isMobile ? '18px' : '20px';
            const buttonPadding = isMobile ? '10px 20px' : '12px 24px';
            const marginBottom = isMobile ? '15px' : '20px';

            const popupHTML = `
    <div id="war-popup" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f8f9fa;
        border: 3px solid #00a1c7;
        border-radius: 12px;
        padding: ${popupPadding};
        z-index: 999999;
        width: ${popupWidth};
        max-width: ${popupMaxWidth};
        min-width: ${popupMinWidth};
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        font-family: Arial, sans-serif;
        box-sizing: border-box;
    ">
        <h3 style="
            margin-top: 0;
            margin-bottom: ${marginBottom};
            color: #00a1c7;
            font-size: ${headerFontSize};
            text-align: center;
            border-bottom: 2px solid #00a1c7;
            padding-bottom: 10px;
        ">
            War Details
        </h3>

        <div style="margin-bottom: ${marginBottom};">
            <label style="
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
                font-size: ${fontSize};
            ">
                Discord Availability Poll URL:
            </label>
            <input type="url" id="poll-url" style="
                width: 100%;
                padding: ${isMobile ? '10px' : '12px'};
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: ${inputFontSize};
                box-sizing: border-box;
            " placeholder="https://discord.com/channels/...">
        </div>

        <div style="margin-bottom: ${marginBottom};">
            <label style="
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
                font-size: ${fontSize};
            ">
                Enemy Stats Details Discord Message URL:
            </label>
            <input type="url" id="stats-url" style="
                width: 100%;
                padding: ${isMobile ? '10px' : '12px'};
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: ${inputFontSize};
                box-sizing: border-box;
            " placeholder="https://discord.com/channels/...">
        </div>

        <div style="margin-bottom: 25px;">
            <label style="
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #333;
                font-size: ${fontSize};
            ">
                Xanax Available Date & Time (TCT):
            </label>
            <input type="datetime-local" id="xanax-datetime" style="
                width: ${isMobile ? '93%' : '100%'};
                padding: ${isMobile ? '10px' : '12px'};
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: ${inputFontSize};
                box-sizing: border-box;
            ">
        </div>

        <div style="
            text-align: right;
            border-top: 2px solid #eee;
            padding-top: ${marginBottom};
        ">
            <button id="popup-cancel" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: ${buttonPadding};
                border-radius: 6px;
                margin-right: ${isMobile ? '10px' : '15px'};
                cursor: pointer;
                font-size: ${fontSize};
                font-weight: bold;
                touch-action: manipulation;
            ">
                Cancel
            </button>
            <button id="popup-ok" style="
                background: #00a1c7;
                color: white;
                border: none;
                padding: ${buttonPadding};
                border-radius: 6px;
                cursor: pointer;
                font-size: ${fontSize};
                font-weight: bold;
                touch-action: manipulation;
            ">
                OK
            </button>
        </div>
    </div>

    <div id="war-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 999998;
    "></div>
`;
            // Add popup to page
            document.body.insertAdjacentHTML('beforeend', popupHTML);

            // Handle buttons
            document.getElementById('popup-ok').onclick = function() {
                const pollUrl = document.getElementById('poll-url').value;
                const statsUrl = document.getElementById('stats-url').value;
                const xanaxDatetime = document.getElementById('xanax-datetime').value;

                if (!pollUrl || !statsUrl || !xanaxDatetime) {
                    alert('Please fill in all fields');
                    return;
                }

                // Remove popup
                document.getElementById('war-popup').remove();
                document.getElementById('war-overlay').remove();

                // Convert datetime to timestamp
                const xanaxTimestamp = new Date(xanaxDatetime + 'Z').getTime() / 1000;

                resolve({
                    pollUrl: pollUrl,
                    statsUrl: statsUrl,
                    xanaxTimestamp: xanaxTimestamp
                });
            };

            document.getElementById('popup-cancel').onclick = function() {
                document.getElementById('war-popup').remove();
                document.getElementById('war-overlay').remove();
                resolve(null);
            };

            // Close on overlay click
            document.getElementById('war-overlay').onclick = function() {
                document.getElementById('war-popup').remove();
                document.getElementById('war-overlay').remove();
                resolve(null);
            };
        });
    }

    // Function to extract username from the input field
    function extractUsername() {
        const userInput = document.querySelector('input[name="sendto"]');
        if (userInput && userInput.value) {
            // Extract just the username part before the ID
            const match = userInput.value.match(/^([^[]+)/);
            return match ? match[1].trim() : userInput.value;
        }
        return null;
    }

    function getCurrentUserData() {
        return new Promise((resolve, reject) => {
            console.log('Getting current user data via API...');

            if (!TORN_API_KEY) {
                reject('Invalid API key');
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://api.torn.com/user/?selections=&key=' + TORN_API_KEY,
                timeout: 10000,
                onload: function(response) {
                    console.log('User API Response:', response.responseText);

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                reject('API Error: ' + data.error.error);
                                return;
                            }
                            if (!data.name) {
                                reject('No username found in API response');
                                return;
                            }
                            if (!data.faction || !data.faction.position) {
                                reject('No faction position found. Are you in a faction?');
                                return;
                            }

                            resolve({
                                name: data.name,
                                role: data.faction.position
                            });
                        } catch (error) {
                            reject('Error parsing API response: ' + error.message);
                        }
                    } else {
                        reject('Failed to fetch user data: HTTP ' + response.status);
                    }
                },
                onerror: function(error) {
                    reject('Network error fetching user data');
                },
                ontimeout: function() {
                    reject('Request timed out');
                }
            });
        });
    }

    function getCurrentFactionData() {
    return new Promise((resolve, reject) => {
        if (!TORN_API_KEY) {
            reject('No API key available');
            return;
        }

        console.log('Fetching current faction data from Torn API...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/v2/faction/basic?key=${TORN_API_KEY}`,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; TornScript/1.0)',
            },
            timeout: 10000,
            onload: function(response) {
                console.log('Faction API Response status:', response.status);
                console.log('Faction API Response text:', response.responseText);

                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            console.error('API returned error:', data.error);
                            if (data.error.code === 2) {
                                GM_setValue('gm_api_key', '');
                                alert('Invalid API key. Please refresh the page and enter a valid key.');
                            } else {
                                alert('API Error: ' + data.error.error);
                            }
                            resolve(null);
                            return;
                        }

                        console.log('Successfully loaded faction data from Torn API');
                        resolve(data.basic);
                    } catch (error) {
                        console.error('Error parsing faction data:', error);
                        alert('Error parsing faction API response: ' + error.message);
                        resolve(null);
                    }
                } else {
                    console.error('Failed to fetch faction data from Torn API:', response.status, response.statusText);
                    alert('Failed to fetch faction data: HTTP ' + response.status);
                    resolve(null);
                }
            },
            onerror: function(error) {
                console.error('Error fetching faction data:', error);
                alert('Network error fetching faction data. Check your connection.');
                resolve(null);
            },
            ontimeout: function() {
                console.error('Timeout fetching faction data');
                alert('Request timed out. Please try again.');
                resolve(null);
            }
        });
    });
}

    // Function to toggle the source editor
    function toggleSourceEditor() {
        // Find the source button (SVG with the specific path)
        const sourceButton = document.querySelector('svg[fill="#00a3d9"]') || document.querySelector('svg path[fill="#00a3d9"]');

        if (sourceButton) {
            // Find the clickable parent element
            let clickableElement = sourceButton;
            while (clickableElement && !clickableElement.onclick && clickableElement.tagName !== 'BUTTON') {
                clickableElement = clickableElement.parentElement;
            }

            if (clickableElement) {
                clickableElement.click();
            }
        }
    }

    // Function to insert content into editor
    function insertContentIntoEditor(content, contentType) {
        contentType = contentType || 'recruitment';

        // Toggle source editor to show textarea
        toggleSourceEditor();

        // Wait for editor to appear and then populate it
        setTimeout(function() {
            // Try to find TinyMCE editor first
            const editorFrame = document.querySelector('iframe[id*="mce"]');
            let editorDoc = null;

            if (editorFrame) {
                editorDoc = editorFrame.contentDocument || editorFrame.contentWindow.document;
            }

            // Try multiple ways to insert content
            if (editorDoc && editorDoc.body) {
                // Insert into TinyMCE iframe
                console.log('Found TinyMCE editor, inserting ' + contentType + ' content...');
                editorDoc.body.innerHTML = content;

                // Trigger change event
                const changeEvent = new Event('input', { bubbles: true });
                editorDoc.body.dispatchEvent(changeEvent);
            } else {
                // Fallback: try to find any contenteditable div
                const editableDiv = document.querySelector('[contenteditable="true"]') ||
                      document.querySelector('.mce-content-body') ||
                      document.querySelector('[data-mce-bogus]').parentElement;

                if (editableDiv) {
                    console.log('Found contenteditable div, inserting ' + contentType + ' content...');
                    editableDiv.innerHTML = content;

                    // Trigger change event
                    const changeEvent = new Event('input', { bubbles: true });
                    editableDiv.dispatchEvent(changeEvent);
                } else {
                    // Last resort: try textarea
                    const textarea = document.querySelector('textarea');
                    if (textarea) {
                        console.log('Found textarea, inserting ' + contentType + ' content...');
                        textarea.value = content;
                        const event = new Event('input', { bubbles: true });
                        textarea.dispatchEvent(event);
                    } else {
                        alert('Could not find any editor to insert content');
                        console.log('Available elements:', {
                            iframes: document.querySelectorAll('iframe').length,
                            contenteditable: document.querySelectorAll('[contenteditable]').length,
                            textareas: document.querySelectorAll('textarea').length,
                            mceBogus: document.querySelectorAll('[data-mce-bogus]').length
                        });
                    }
                }
            }
        }, 0);
    }

    // Function to insert recruitment message
    async function insertRecruitmentMessage() {
        const username = extractUsername();
        if (!username) {
            alert('Could not extract username from the recipient field');
            return;
        }

        // Check if we have the HTML loaded, if not, fetch it
        if (!recruitmentHTML || recruitmentHTML.trim() === '') {
            console.log('Recruitment HTML not loaded, fetching now...');
            const success = await fetchRecruitmentHTML();
            if (!success) {
                alert('Failed to load recruitment message. Please try again.');
                return;
            }
        }

        // Fill subject line
        const subjectInput = document.querySelector('input.subject[name="subject"]');
        if (subjectInput) {
            subjectInput.value = 'Not another faction recruitment message!?';
            console.log('Subject line filled');

            // Trigger change event to ensure it's registered
            const changeEvent = new Event('input', { bubbles: true });
            subjectInput.dispatchEvent(changeEvent);
        } else {
            console.log('Subject input not found');
        }

        // Replace placeholder with actual username
        const personalizedHTML = recruitmentHTML.replace(/\[Insert Name Here\]/g, username);

        // Insert content into editor
        insertContentIntoEditor(personalizedHTML, 'recruitment');
    }

    async function insertWelcomeMessage() {
        try {
            console.log('Starting welcome message insertion...');

            // Show loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'welcome-loading';
            loadingDiv.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 999999;">Loading user data...</div>';
            document.body.appendChild(loadingDiv);

            // Get username from input field
            const username = extractUsername();
            if (!username) {
                const loading = document.getElementById('welcome-loading');
                if (loading) loading.remove();
                alert('Could not extract username from the recipient field');
                return;
            }

            // Get current user data from API
            const userData = await getCurrentUserData();
            const currentUserRole = userData.role;
            const currentUserName = userData.name;

            // Remove loading indicator
            const loading = document.getElementById('welcome-loading');
            if (loading) loading.remove();

            if (!currentUserRole) {
                alert('Could not extract your faction role from API');
                return;
            }

            if (!currentUserName) {
                alert('Could not extract your username from API');
                return;
            }

            // Check if we have the HTML loaded, if not, fetch it
            if (!welcomeHTML || welcomeHTML.trim() === '') {
                console.log('Welcome HTML not loaded, fetching now...');
                const success = await fetchWelcomeHTML();
                if (!success) {
                    alert('Failed to load welcome message. Please try again.');
                    return;
                }
            }

            // Fill subject line
            const subjectInput = document.querySelector('input.subject[name="subject"]');
            if (subjectInput) {
                subjectInput.value = 'Welcome to the family!';
                console.log('Welcome subject line filled');

                // Trigger change event to ensure it's registered
                const changeEvent = new Event('input', { bubbles: true });
                subjectInput.dispatchEvent(changeEvent);
            } else {
                console.log('Subject input not found');
            }

            // Replace placeholders with actual values
            let personalizedHTML = welcomeHTML
            .replace(/\[Insert Name Here\]/g, username)
            .replace(/\[Your Role\]/g, currentUserRole)
            .replace(/\[Your Name\]/g, currentUserName);

            // Insert content into editor
            insertContentIntoEditor(personalizedHTML, 'welcome');

        } catch (error) {
            // Remove loading indicator if still present
            const loading = document.getElementById('welcome-loading');
            if (loading) loading.remove();

            console.error('Error in insertWelcomeMessage:', error);
            alert('Error loading welcome message: ' + error.message);
        }
    }
async function insertWarMessageNewsletter() {
    try {
        // Show loading indicator for user data
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'war-loading-user';
        loadingDiv.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 999999;">Loading user data...</div>';
        document.body.appendChild(loadingDiv);

        // Get current user data from API
        const userData = await getCurrentUserData();
        const currentUserRole = userData.role;
        const currentUserName = userData.name;

        // Remove user data loading indicator
        const userLoading = document.getElementById('war-loading-user');
        if (userLoading) userLoading.remove();

        if (!currentUserRole) {
            alert('Could not extract your faction role from API');
            return;
        }

        if (!currentUserName) {
            alert('Could not extract your username from API');
            return;
        }

        // Show loading indicator for faction data
        const factionLoadingDiv = document.createElement('div');
        factionLoadingDiv.id = 'faction-loading';
        factionLoadingDiv.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 999999;">Loading faction data...</div>';
        document.body.appendChild(factionLoadingDiv);

        // Get current faction data from API
        console.log('Fetching faction data...');
        const factionData = await getCurrentFactionData();

        // Remove faction data loading indicator
        const factionLoading = document.getElementById('faction-loading');
        if (factionLoading) factionLoading.remove();

        if (!factionData) {
            alert('Failed to fetch faction data from API');
            return;
        }

        const myFactionId = factionData.id;
        console.log('My faction ID:', myFactionId);

        // Show loading indicator for war data
        const warLoadingDiv = document.createElement('div');
        warLoadingDiv.id = 'war-loading';
        warLoadingDiv.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 999999;">Loading war data...</div>';
        document.body.appendChild(warLoadingDiv);

        // Get war data from API
        console.log('Fetching war data...');
        const warData = await getWarData();

        // Remove war data loading indicator
        const warLoading = document.getElementById('war-loading');
        if (warLoading) warLoading.remove();

        if (!warData) {
            alert('Failed to fetch war data from API');
            return;
        }

        console.log('War data received:', warData);

        if (!warData.wars || !warData.wars.ranked) {
            alert('No wars found in API response');
            return;
        }

        if (!warData.wars.ranked.factions || !Array.isArray(warData.wars.ranked.factions) || warData.wars.ranked.factions.length === 0) {
            alert('No enemy factions found in ranked wars');
            return;
        }

        // Find the enemy faction (the one that's not yours)
        const enemyFaction = warData.wars.ranked.factions.find(faction => faction.id !== myFactionId);

        if (!enemyFaction) {
            alert('Could not identify enemy faction in war data');
            return;
        }

        console.log('Enemy faction identified:', enemyFaction);

        const warStartTimestamp = warData.wars.ranked.start;

        // Show popup to get additional details
        const warDetails = await showWarDetailsPopup();
        if (!warDetails) {
            return; // User cancelled
        }

        // Check if we have the HTML loaded, if not, fetch it
        if (!warHTML || warHTML.trim() === '') {
            console.log('War HTML not loaded, fetching now...');
            const success = await fetchWarHTML();
            if (!success) {
                alert('Failed to load war message. Please try again.');
                return;
            }
        }

        // Calculate dates
        const startDate = formatDate(warStartTimestamp);
        const xanaxStackStartTimestamp = warStartTimestamp - (32 * 60 * 60); // 32 hours before
        const xanaxStackStart = formatDate(xanaxStackStartTimestamp);
        const xanaxStartDay = getDayOfWeek(warDetails.xanaxTimestamp);
        const xanaxAvailable = formatDate(warDetails.xanaxTimestamp);
        const subjectDate = formatSubjectDate(warStartTimestamp);

        // Fill subject line
        const subjectInput = document.querySelector('input.text-input.titleField___Rtn72');
        if (subjectInput) {
            const newSubject = '[WAR] ' + enemyFaction.name + ' - ' + subjectDate;

            // React-specific way to update the input value
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(subjectInput, newSubject);

            // Trigger React's onChange event
            const reactEvent = new Event('input', { bubbles: true });
            subjectInput.dispatchEvent(reactEvent);

            console.log('War subject line filled on newsletter page:', newSubject);
        } else {
            console.log('Subject input not found on newsletter page');
        }

        // Replace placeholders with actual values
        let personalizedHTML = warHTML
        .replace(/\[Your Role\]/g, currentUserRole)
        .replace(/\[Your Name\]/g, currentUserName)
        .replace(/\[ENEMY FACTION NAME\]/g, '<a href="https://www.torn.com/factions.php?step=profile&ID=' + enemyFaction.id + '" target="_blank">' + enemyFaction.name + '</a>')
        .replace(/\[Start Date\]/g, startDate)
        .replace(/\[Xanax Stack Start\]/g, xanaxStackStart)
        .replace(/\[Xanax Available\]/g, xanaxAvailable)
        .replace(/\[Xanax Start Day]/g, xanaxStartDay);

        // Add hyperlinks
        personalizedHTML = personalizedHTML.replace(/\bpoll\b/g, '<a href="' + warDetails.pollUrl + '" target="_blank">poll</a>');
        personalizedHTML = personalizedHTML.replace(/Enemy Stats Details/g, '<a href="' + warDetails.statsUrl + '" target="_blank">Enemy Stats Details</a>');

        // Toggle source editor
        const sourceButton = document.querySelector('button[aria-label="Toggle Code Editor"]');
        if (sourceButton) {
            sourceButton.click();
        }

        setTimeout(function() {
            // Try multiple selectors to find the editor
            let editorArea = document.querySelector('[contenteditable="true"]') ||
                document.querySelector('.mce-content-body') ||
                document.querySelector('[data-mce-bogus="1"]')?.parentElement ||
                document.querySelector('iframe[id*="mce"]')?.contentDocument?.body;

            if (editorArea) {
                console.log('Found newsletter editor, inserting content...');
                editorArea.innerHTML = personalizedHTML;

                // Trigger change event
                const changeEvent = new Event('input', { bubbles: true });
                editorArea.dispatchEvent(changeEvent);

                // Toggle source editor back to visual mode
                setTimeout(function() {
                    const sourceButton = document.querySelector('button[aria-label="Toggle Code Editor"]');
                    if (sourceButton) {
                        sourceButton.click();
                        console.log('Toggled back to visual mode');
                    }
                }, 50); // Reduced from 1000ms
            } else {
                alert('Could not find newsletter editor');
            }
        }, 50); // Reduced from 500ms

    } catch (error) {

        // Remove loading indicators if still present
        const userLoading = document.getElementById('war-loading-user');
        const factionLoading = document.getElementById('faction-loading');
        const warLoading = document.getElementById('war-loading');
        if (userLoading) userLoading.remove();
        if (factionLoading) factionLoading.remove();
        if (warLoading) warLoading.remove();

        console.error('Error in insertWarMessageNewsletter:', error);
        alert('Error loading war message: ' + error.message);
    }
}

    async function insertOtherMessageNewsletter() {
        try {
            // Show loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'other-loading';
            loadingDiv.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 8px; z-index: 999999;">Loading user data...</div>';
            document.body.appendChild(loadingDiv);

            // Get current user data from API
            const userData = await getCurrentUserData();
            const currentUserRole = userData.role;
            const currentUserName = userData.name;

            // Remove loading indicator
            const loading = document.getElementById('other-loading');
            if (loading) loading.remove();

            if (!currentUserRole) {
                alert('Could not extract your faction role from API');
                return;
            }

            if (!currentUserName) {
                alert('Could not extract your username from API');
                return;
            }

            const subjectInput = document.querySelector('input.text-input.titleField___Rtn72');
            if (subjectInput) {
                const newSubject = 'INSERT YOUR SUBJECT!';

                // React-specific way to update the input value
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(subjectInput, newSubject);

                // Trigger React's onChange event
                const reactEvent = new Event('input', { bubbles: true });
                subjectInput.dispatchEvent(reactEvent);

                console.log('Other subject line filled on newsletter page:', newSubject);
            } else {
                console.log('Subject input not found on newsletter page');
            }

            // Replace placeholders with actual values
            let personalizedHTML = otherHTML
            .replace(/\[Your Role\]/g, currentUserRole)
            .replace(/\[Your Name\]/g, currentUserName);

            // Toggle source editor
            const sourceButton = document.querySelector('button[aria-label="Toggle Code Editor"]');
            if (sourceButton) {
                sourceButton.click();
            }

            setTimeout(function() {
                // Try multiple selectors to find the editor
                let editorArea = document.querySelector('[contenteditable="true"]') ||
                    document.querySelector('.mce-content-body') ||
                    document.querySelector('[data-mce-bogus="1"]')?.parentElement ||
                    document.querySelector('iframe[id*="mce"]')?.contentDocument?.body;

                if (editorArea) {
                    console.log('Found newsletter editor, inserting content...');
                    editorArea.innerHTML = personalizedHTML;

                    // Trigger change event
                    const changeEvent = new Event('input', { bubbles: true });
                    editorArea.dispatchEvent(changeEvent);

                    // Toggle source editor back to visual mode
                    setTimeout(function() {
                        const sourceButton = document.querySelector('button[aria-label="Toggle Code Editor"]');
                        if (sourceButton) {
                            sourceButton.click();
                            console.log('Toggled back to visual mode');
                        }
                    }, 50); // Reduced from 1000ms
                } else {
                    alert('Could not find newsletter editor');
                }
            }, 50); // Reduced from 500ms

        } catch (error) {
            // Remove loading indicator if still present
            const loading = document.getElementById('other-loading');
            if (loading) loading.remove();

            console.error('Error in insertOtherMessageNewsletter:', error);
            alert('Error loading other message: ' + error.message);
        }
    }

    // Function to create and add the recruit button
    function createRecruitButton() {
        // Check if button already exists
        if (document.querySelector('#recruit-button')) {
            console.log('Recruit button already exists');
            return;
        }

        console.log('Creating recruit button...');
        debugContainerDetection(); // Add this line for debugging

        let targetContainer, insertionPoint;
        const isMobile = isMobileDevice();

        if (isMobile) {
            // Mobile: look for the Name input field and insert after its container
            const nameInput = document.querySelector('input[name="sendto"]') || document.querySelector('input[placeholder="Name"]');
            if (nameInput) {
                // Find the parent container of the name input
                let nameContainer = nameInput.closest('.form-title-input-text') ||
                    nameInput.closest('div') ||
                    nameInput.parentNode;

                // Create or find mobile button container
                let mobileContainer = document.querySelector('.mobile-button-container');
                if (!mobileContainer) {
                    mobileContainer = document.createElement('div');
                    mobileContainer.className = 'mobile-button-container';
                    mobileContainer.style.cssText = 'display: flex !important; flex-wrap: wrap !important; gap: 5px !important; margin: 10px 0 0 10px !important; clear: both !important; width: calc(100% - 10px) !important;';
                    // Insert after the name container
                    nameContainer.parentNode.insertBefore(mobileContainer, nameContainer.nextSibling);
                }
                targetContainer = mobileContainer;
                insertionPoint = null; // Append to container
            } else {
                // Fallback to desktop logic if name input not found on mobile
                console.log('Name input not found on mobile, falling back to desktop logic');
                targetContainer = document.querySelector('div.form-title-input-text:nth-child(1)');
                const anonymousButton = document.querySelector('#anonymousButton');
                if (anonymousButton) {
                    insertionPoint = anonymousButton.nextSibling;
                }
            }
        } else {
            // Desktop: use existing logic
            targetContainer = document.querySelector('div.form-title-input-text:nth-child(1)');
            const anonymousButton = document.querySelector('#anonymousButton');
            if (anonymousButton) {
                insertionPoint = anonymousButton.nextSibling;
            }
        }

        if (!targetContainer) {
            console.log('Target container not found, trying alternative selectors...');
            // Try alternative selectors as fallback
            targetContainer = document.querySelector('.form-container') ||
                document.querySelector('form') ||
                document.querySelector('div[class*="form"]');

            if (!targetContainer) {
                console.log('No suitable container found for recruit button');
                return;
            }
        }

        const button = document.createElement('button');
        button.id = 'recruit-button';
        button.textContent = 'Recruit';
        button.type = 'button';

        // Different styling for mobile vs desktop
        if (isMobile) {
            button.style.cssText = 'background-color: #00a1c7 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: bold !important; margin: 0 5px 0 0 !important; display: inline-block !important; transition: background-color 0.2s ease !important; touch-action: manipulation !important; flex: 0 0 auto !important;';
        } else {
            button.style.cssText = 'background-color: #00a1c7 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: bold !important; margin-left: 10px !important; display: inline-block !important; vertical-align: middle !important; transition: background-color 0.2s ease !important;';
        }

        button.classList.add('button-animate-slide');
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Prevent any form submission or navigation
            if (e.target.form) {
                e.target.form.onsubmit = function() { return false; };
            }

            console.log('Recruit button clicked');
            await insertRecruitmentMessage();
        });

        // Add hover effects
        button.addEventListener('mouseenter', function() {
            button.style.backgroundColor = '#008bb3 !important';
        });

        button.addEventListener('mouseleave', function() {
            button.style.backgroundColor = '#00a1c7 !important';
        });

        // Insert the button
        if (insertionPoint) {
            targetContainer.insertBefore(button, insertionPoint);
        } else {
            targetContainer.appendChild(button);
        }

        // Trigger animation with slight delay
        setTimeout(() => {
            button.style.opacity = '1 !important';
            button.style.transform = 'translateX(0) !important';
        }, 50);
        console.log('Recruit button added for', isMobile ? 'mobile' : 'desktop');
    }

    // Function to create and add the welcome button
    function createWelcomeButton() {
        // Check if button already exists
        if (document.querySelector('#welcome-button')) {
            console.log('Welcome button already exists');
            return;
        }

        console.log('Creating welcome button...');

        // Find the recruit button to place welcome button next to it
        const recruitButton = document.querySelector('#recruit-button');
        const mobileContainer = document.querySelector('.mobile-button-container');

        if (!recruitButton) {
            console.log('Recruit button not found, cannot place welcome button');
            return;
        }

        const button = document.createElement('button');
        button.id = 'welcome-button';
        button.textContent = 'Welcome';

        const isMobile = isMobileDevice();

        // Different styling for mobile vs desktop
        if (isMobile) {
            button.style.cssText = 'background-color: #28a745 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: bold !important; margin: 0 !important; display: inline-block !important; transition: background-color 0.2s ease !important; touch-action: manipulation !important; flex: 0 0 auto !important;';
        } else {
            button.style.cssText = 'background-color: #28a745 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 12px !important; font-weight: bold !important; margin-left: 5px !important; display: inline-block !important; vertical-align: middle !important; transition: background-color 0.2s ease !important;';
        }

        button.classList.add('button-animate-slide');
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            // Prevent any form submission
            if (e.target.form) {
                e.target.form.onsubmit = function() { return false; };
            }
            console.log('Welcome button clicked');
            await insertWelcomeMessage();
        });

        // Add hover effects
        button.addEventListener('mouseenter', function() {
            button.style.backgroundColor = '#218838 !important';
        });

        button.addEventListener('mouseleave', function() {
            button.style.backgroundColor = '#28a745 !important';
        });

        if (isMobile && mobileContainer) {
            // On mobile, add to the same container as recruit button
            mobileContainer.appendChild(button);
        } else if (isMobile) {
            // Mobile but no container found - insert after recruit button
            recruitButton.parentNode.insertBefore(button, recruitButton.nextSibling);
        } else {
            // Desktop: insert after recruit button
            recruitButton.parentNode.insertBefore(button, recruitButton.nextSibling);
        }

        // Trigger animation with slight delay
        setTimeout(() => {
            button.style.opacity = '1 !important';
            button.style.transform = 'translateX(0) !important';
        }, 50);
        console.log('Welcome button added for', isMobile ? 'mobile' : 'desktop');
    }

    // Function to create and add the war button on newsletter page
    function createWarButtonNewsletter() {
        // Check if button already exists
        if (document.querySelector('#war-button-newsletter')) {
            console.log('War button already exists on newsletter page');
            return;
        }

        console.log('Creating war button on newsletter page...');

        // Wait for React component to load
        const maxAttempts = 20;
        let attempts = 0;

        const checkForElements = setInterval(function() {
            attempts++;
            console.log('Attempt', attempts, 'to find newsletter elements...');

            // Check again if button was created during our wait
            if (document.querySelector('#war-button-newsletter')) {
                console.log('War button found during creation process, aborting');
                clearInterval(checkForElements);
                return;
            }

            // Try to find the specific target element
            let targetElement = document.querySelector('#react-root-faction-newsletter div.desc');
            if (!targetElement) {
                targetElement = document.querySelector('div.desc');
            }

            const titleField = document.querySelector('input.titleField___Rtn72');

            console.log('Found target element:', !!targetElement);
            console.log('Found title field:', !!titleField);

            if (targetElement && titleField) {
                console.log('Elements found, creating button...');
                clearInterval(checkForElements);

                const button = document.createElement('button');
                button.id = 'war-button-newsletter';
                button.textContent = 'War';
                button.style.cssText = 'background-color: #dc3545 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 6px !important; cursor: pointer !important; font-size: 14px !important; font-weight: bold !important; margin: 15px 0 0 0 !important; display: inline-block !important; transition: background-color 0.2s ease !important;';
                button.classList.add('button-animate-slide');
                button.addEventListener('click', async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('War button clicked on newsletter page');
                    await insertWarMessageNewsletter();
                });

                // Add hover effects
                button.addEventListener('mouseenter', function() {
                    button.style.backgroundColor = '#c82333 !important';
                });

                button.addEventListener('mouseleave', function() {
                    button.style.backgroundColor = '#dc3545 !important';
                });

                // Add button to target element
                targetElement.appendChild(button);
                // Trigger animation with slight delay
                setTimeout(() => {
                    button.style.opacity = '1 !important';
                    button.style.transform = 'translateX(0) !important';
                }, 50);
                console.log('War button added to newsletter page');

                setTimeout(function() {
                    createOtherButtonNewsletter();
                }, 50);

            } else if (attempts >= maxAttempts) {
                console.log('Max attempts reached, elements not found');
                clearInterval(checkForElements);
            }
        }, 500); // Check every 500ms
    }

    // Function to create and add the fourth button on newsletter page
    function createOtherButtonNewsletter() {
        // Check if button already exists
        if (document.querySelector('#other-button-newsletter')) {
            console.log('Other button already exists on newsletter page');
            return;
        }

        console.log('Creating other button on newsletter page...');

        // Wait for the war button to exist first
        const maxAttempts = 20;
        let attempts = 0;

        const checkForWarButton = setInterval(function() {
            attempts++;
            console.log('Attempt', attempts, 'to find war button...');

            // Check again if other button was created during our wait
            if (document.querySelector('#other-button-newsletter')) {
                console.log('Other button found during creation process, aborting');
                clearInterval(checkForWarButton);
                return;
            }

            const warButton = document.querySelector('#war-button-newsletter');

            if (warButton) {
                console.log('War button found, creating other button...');
                clearInterval(checkForWarButton);

                const button = document.createElement('button');
                button.id = 'other-button-newsletter';
                button.textContent = 'Other';
                button.style.cssText = 'background-color: #28a745 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 6px !important; cursor: pointer !important; font-size: 14px !important; font-weight: bold !important; margin: 0 0 0 15px !important; display: inline-block !important; transition: background-color 0.2s ease !important;';
                button.classList.add('button-animate-scale');
                button.addEventListener('click', async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Other button clicked on newsletter page');
                    await insertOtherMessageNewsletter();
                });

                // Add hover effects
                button.addEventListener('mouseenter', function() {
                    button.style.backgroundColor = '#218838 !important';
                });

                button.addEventListener('mouseleave', function() {
                    button.style.backgroundColor = '#28a745 !important';
                });

                // Add button after the war button
                warButton.parentNode.insertBefore(button, warButton.nextSibling);
                // Trigger animation with slight delay
                setTimeout(() => {
                    button.style.opacity = '1 !important';
                    button.style.transform = 'translateX(0) !important';
                }, 50);
                console.log('Other button added to newsletter page');

            } else if (attempts >= maxAttempts) {
                console.log('Max attempts reached, war button not found');
                clearInterval(checkForWarButton);
            }
        }, 50);
    }


    // Initialize the script
    function init() {
        console.log('=== RECRUIT SCRIPT STARTING ===');
        console.log('Current URL:', window.location.href);
        console.log('Current hash:', window.location.hash);
        console.log('Document ready state:', document.readyState);

        // Check if we're on the correct messages page for recruit/welcome buttons
        const isComposePage = window.location.href.includes('messages.php') &&
              (window.location.hash.includes('compose') ||
               window.location.href.includes('compose') ||
               window.location.href.includes('sendto='));

        if (isComposePage) {
            console.log('On messages compose page - attempting to create recruit/welcome buttons...');

            // Wait for page elements to be available
            const waitForElements = () => {
                const nameInput = document.querySelector('input[name="sendto"]') || document.querySelector('input[placeholder*="Name"]');
                const formContainer = document.querySelector('div.form-title-input-text');

                if (nameInput || formContainer) {
                    console.log('Page elements found, creating buttons...');
                    createRecruitButton();
                    setTimeout(function() {
                        createWelcomeButton();
                    }, 100);
                } else {
                    console.log('Page elements not ready, retrying in 500ms...');
                    setTimeout(waitForElements, 500);
                }
            };

            waitForElements();
        }
        // Check if we're on faction newsletter page for war button
        else if (window.location.href.includes('factions.php') &&
                 (window.location.hash.includes('tab=controls&option=newsletter') ||
                  window.location.href.includes('tab=controls&option=newsletter'))) {
            console.log('On faction newsletter page - attempting to create war button...');
            createWarButtonNewsletter();
        } else {
            console.log('Not on supported page');
        }
    }

    // Pre-load all HTML templates when script starts
    fetchRecruitmentHTML();
    fetchWelcomeHTML();
    fetchWarHTML();
    fetchOtherHTML();

    // Run on page load
    console.log('=== TAMPERMONKEY SCRIPT LOADED ===');

    if (document.readyState === 'loading') {
        console.log('Document still loading, adding event listener...');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded fired');
            init();
        });
    } else {
        console.log('Document already loaded, running init...');
        init();
    }

    // Handle hash changes (SPA navigation)
    window.addEventListener('hashchange', function() {
        console.log('Hash changed to:', window.location.hash);
        console.log('Full URL:', window.location.href);

        // Handle compose page navigation
        if (window.location.hash.includes('compose')) {
            setTimeout(function() {
                init();
            }, 1000);
        }
        // Handle faction newsletter navigation
        else if (window.location.hash.includes('tab=controls&option=newsletter')) {
            console.log('Navigated to newsletter page via hash change');

            // Clean up any existing newsletter buttons first
            const existingWarButton = document.querySelector('#war-button-newsletter');
            const existingOtherButton = document.querySelector('#other-button-newsletter');
            if (existingWarButton) {
                console.log('Removing existing war button before creating new one');
                existingWarButton.remove();
            }
            if (existingOtherButton) {
                console.log('Removing existing other button before creating new one');
                existingOtherButton.remove();
            }

            setTimeout(function() {
                init();
            }, 1000);
        }
        // Handle navigation away from newsletter (cleanup)
        else if (window.location.href.includes('factions.php') &&
                 !window.location.hash.includes('tab=controls&option=newsletter')) {
            console.log('Navigated away from newsletter page, cleaning up war buttons');
            const warButton = document.querySelector('#war-button-newsletter');
            const otherButton = document.querySelector('#other-button-newsletter');
            if (warButton) warButton.remove();
            if (otherButton) otherButton.remove();
        }
    });
    // Observe URL changes for SPA navigation (more comprehensive)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            console.log('URL changed from', lastUrl, 'to', url);
            lastUrl = url;

            // Delay to let the page update
            setTimeout(function() {
                init();
            }, 1500);
        }
    }).observe(document, { subtree: true, childList: true });

    // Handle window resize to reposition buttons
    let resizeTimeout;
    let lastWidth = window.innerWidth;

    window.addEventListener('resize', function() {
        // Debounce resize events
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const currentWidth = window.innerWidth;

            // Ignore resize events that are likely from dev tools opening/closing
            // Only respond to actual viewport changes
            if (Math.abs(currentWidth - lastWidth) < 100) {
                console.log('Minor width change detected, ignoring (likely dev tools)');
                return;
            }

            console.log('Significant window resize detected:', lastWidth, '->', currentWidth);
            lastWidth = currentWidth;

            // Only reposition if we're on the correct messages page
            const isComposePage = window.location.href.includes('messages.php') &&
                  (window.location.hash.includes('compose') ||
                   window.location.href.includes('compose') ||
                   window.location.href.includes('sendto='));

            if (isComposePage) {
                const recruitButton = document.querySelector('#recruit-button');
                const welcomeButton = document.querySelector('#welcome-button');

                if (recruitButton || welcomeButton) {
                    console.log('Removing existing buttons to recreate with new layout...');

                    // Remove existing buttons and mobile container
                    if (recruitButton) recruitButton.remove();
                    if (welcomeButton) welcomeButton.remove();
                    const mobileContainer = document.querySelector('.mobile-button-container');
                    if (mobileContainer) mobileContainer.remove();

                    // Recreate buttons with new positioning
                    setTimeout(function() {
                        createRecruitButton();
                        setTimeout(function() {
                            createWelcomeButton();
                        }, 100);
                    }, 200);
                }
            }
        }, 500); // Increased debounce time
    });
})();