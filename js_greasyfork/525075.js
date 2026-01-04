// ==UserScript==
// @name         Edio Hotkeys TESTING
// @namespace    http://tampermonkey.net/
// @version      Release-1
// @icon         https://raw.githubusercontent.com/MineverseTutorials/Userscripts/refs/heads/main/images/Hotkeys-Icon-big_enhanced.png
// @description  Adds shortcuts to get across the site faster
// @author       Unknown Hacker
// @license      CC BY-NC
// @run-at       document-start
// @match        https://www.myedio.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookieSet
// @grant        GM_cookieDelete
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/525075/Edio%20Hotkeys%20TESTING.user.js
// @updateURL https://update.greasyfork.org/scripts/525075/Edio%20Hotkeys%20TESTING.meta.js
// ==/UserScript==

/*
  _    _       _   _                        _____
 | |  | |     | | | |                     _|  __ \
 | |__| | ___ | |_| | _____ _   _ ___    (_) |  | |
 |  __  |/ _ \| __| |/ / _ \ | | / __|     | |  | |
 | |  | | (_) | |_|   <  __/ |_| \__ \    _| |__| |
 |_|  |_|\___/ \__|_|\_\___|\__, |___/   (_)_____/
                             __/ |
                            |___/
*/


    // === User Configurable Settings ===


// Set this to true to enable console logging, or false to disable it.
const isLoggingEnabled = true;

    // === End Of Configurable Settings ===

(function() {
    'use strict';
    // DO NOT CHANGE THIS
    var version = "1.0";

// Setup

const GM = window.GM || {};

function showSetupMenu() {
    if (GM_getValue('setupComplete', false)) return;


    const validPages = [
        "https://www.myedio.com/dashboard",
        "https://www.myedio.com/directory/users/"
    ];

    const currentURL = window.location.href;
    const isValidPage = validPages.some(page => currentURL.includes(page));

    if (!isValidPage) {
        alert("You must be on the dashboard or the user directory page to start setup.");
        return;
    }


    if (currentURL === "https://www.myedio.com/login/") return;

    const setupOverlay = document.createElement('div');
    setupOverlay.classList.add('setup-overlay');

    setupOverlay.innerHTML = `
        <div class="setup-content">
            <h2>Welcome to Edio Hotkeys!</h2>
            <p>Let's quickly set up your hotkeys to enhance your experience.</p>
            <button id="highlight-button" class="setup-highlight">Get Started</button>
            <p id="setup-instruction">Click "Get Started" to begin!</p>
        </div>
    `;

    document.body.appendChild(setupOverlay);


    blockRestrictedInteractions();

    const style = document.createElement('style');
    style.innerHTML = `
        .setup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.5s ease;
            pointer-events: auto;
        }
        .setup-content {
            background: #fff;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            pointer-events: auto;
        }
        .setup-highlight {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 12px 24px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }
        .setup-highlight:hover {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(style);

    document.getElementById('highlight-button').addEventListener('click', () => {
        moveOverlayToButton();
    });
}


function blockRestrictedInteractions() {

    const restrictedElements = document.querySelectorAll('.c-navigation__item, .c-kop-logo, .Edio_Hotkeys');
    restrictedElements.forEach(element => {
        element.style.pointerEvents = 'none';
    });
}

function moveOverlayToButton() {
    const setupOverlay = document.querySelector('.setup-overlay');
    const targetButton = document.querySelector('.c-button.-icon.-text');

    if (!targetButton) {
        alert("Could not find the button to highlight. Please check the site.");
        return;
    }

    setupOverlay.style.zIndex = '2';
    setupOverlay.style.pointerEvents = 'none';

    targetButton.style.outline = "3px solid red";
    targetButton.style.outlineOffset = "5px";

    const instruction = document.getElementById('setup-instruction');
    instruction.textContent = "Click the highlighted button to continue.";

    targetButton.addEventListener('click', () => {
        targetButton.style.outline = "";
        highlightProfileButton();
    }, { once: true });
}

function highlightProfileButton() {
    const setupOverlay = document.querySelector('.setup-overlay');
    setupOverlay.style.zIndex = '2';
    setupOverlay.style.pointerEvents = '';
    setupOverlay.style.background = 'rgba(0, 0, 0, 0.75)';

    const setupContent = document.querySelector('.setup-content');
    setupContent.innerHTML = `
        <h2>One More Step!</h2>
        <p>We need you to click a user directory link. Please click on the highlighted link below.</p>
    `;

    waitForElementWithHref('/directory/users/');
}

function waitForElementWithHref(hrefSubstring) {
    const interval = setInterval(() => {
        const userLink = Array.from(document.querySelectorAll('a'))
            .find(link => link.href.includes(hrefSubstring));

        if (userLink) {
            clearInterval(interval);

            userLink.style.outline = "3px solid red";
            userLink.style.outlineOffset = "5px";

            const setupContent = document.querySelector('.setup-content');
            setupContent.innerHTML = `
                <h2>Click the Highlighted Link</h2>
                <p>Click the highlighted link to complete the setup.</p>
            `;

            userLink.addEventListener('click', () => {
                userLink.style.outline = "";
                saveLinkAndCompleteSetup(userLink.href);
            }, { once: true });
        }
    }, 500);
}

function saveLinkAndCompleteSetup(link) {
    const userId = link.match(/\/directory\/users\/(\d+)/);
    if (userId && userId[1]) {
        GM_setValue('userId', userId[1]);
    }

    GM_setValue('setupComplete', true);

    const setupOverlay = document.querySelector('.setup-overlay');
    if (setupOverlay) {
        setupOverlay.remove();
    }

    showCompletionMessage();
}

function showCompletionMessage() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList" && document.querySelector('.dashboard-content')) {
                observer.disconnect();

                if (!GM_getValue('successMessageShown', false)) {
                    const setupOverlay = document.createElement('div');
                    setupOverlay.classList.add('setup-overlay');

                    setupOverlay.innerHTML = `
                        <div class="setup-content">
                            <h2>Setup Complete!</h2>
                            <p>You have successfully set up your Edio Hotkeys!</p>
                            <button id="ok-button" class="setup-highlight">OK</button>
                        </div>
                    `;

                    document.body.appendChild(setupOverlay);

                    const style = document.createElement('style');
                    style.innerHTML = `
                        .setup-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.75);
                            z-index: 1000;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            transition: all 0.5s ease;
                        }
                        .setup-content {
                            background: #fff;
                            padding: 25px;
                            border-radius: 10px;
                            text-align: center;
                            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
                            max-width: 400px;
                            width: 90%;
                        }
                        .setup-highlight {
                            background-color: #007bff;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            padding: 12px 24px;
                            font-size: 16px;
                            cursor: pointer;
                            margin-top: 20px;
                            transition: background-color 0.3s ease;
                        }
                        .setup-highlight:hover {
                            background-color: #0056b3;
                        }
                    `;
                    document.head.appendChild(style);

                    document.getElementById('ok-button').addEventListener('click', () => {
                        GM_setValue('successMessageShown', true);
                        window.location.href = "https://www.myedio.com/dashboard";
                    });
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

window.addEventListener('load', showSetupMenu);

// End of Setup

    function logMessage(message) {
        if (isLoggingEnabled) {
            console.log(message);
        }
    }

function observeUrlChanges() {
    let previousUrl = window.location.href;

    const observer = new MutationObserver(() => {
        if (window.location.href !== previousUrl) {
            previousUrl = window.location.href;
            logMessage(`URL changed to: ${previousUrl}`);
            saveLinkIfMatches();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('load', () => {
    observeUrlChanges();
    saveLinkIfMatches();
});

function saveLinkIfMatches() {
    const link = window.location.href;
    const matchPatterns = [
        "https://www.myedio.com/learning/courses/",
        "/lessons/",
        "/summary/",
        "/take/",
        "/days/",
        "/variants/"
    ];

    const matches = matchPatterns.some(pattern => link.includes(pattern));

    if (matches) {
        try {
            GM_setValue('siteLink', link);
            logMessage(`Link saved using GM_setValue: ${link}`);
        } catch (e) {
            logMessage("Error saving with GM_setValue, falling back to cookies...");
            showErrorPopup(101, e.message);
            document.cookie = `siteLink=${link}; path=/; expires=${new Date(Date.now() + 86400000).toUTCString()}`;
            logMessage("Link saved to cookie: " + link);
        }
    } else {
        logMessage("Link does not match any pattern, not saved.");
    }
}

function getSavedLink() {
    return new Promise((resolve, reject) => {
        const gmLink = GM_getValue('siteLink', null);
        if (gmLink) {
            resolve(gmLink);
        } else {
            const cookieMatch = document.cookie.match(/siteLink=([^;]*)/);
            if (cookieMatch) {
                resolve(cookieMatch[1]);
            } else {
                showErrorPopup(102, "No site link found, or it was never saved.");
                reject("No site link found, or it was never saved.");
            }
        }
    });
}


async function handleHotkeys(event) {
    if (event.altKey) {
        const key = event.key.toLowerCase();
        switch (key) {
            case 'r':
                event.preventDefault();
                try {
                    const savedLink = await getSavedLink();
                    window.location.href = savedLink;
                } catch (e) {
                    showErrorPopup(103, "Error redirecting to saved link.");
                }
                break;
            case 'c':
                event.preventDefault();
                window.location.href = "https://www.myedio.com/calendar/day/";
                break;
            case 'q':
                event.preventDefault();
                window.location.href = "https://www.myedio.com/login/?sessionExpired=true";
                break;
            case 'd':
                event.preventDefault();
                window.location.href = "https://www.myedio.com/dashboard/";
                break;
            case 'l':
                event.preventDefault();
                try {
                    const userId = GM_getValue('userId', null);
                    if (userId) {
                        window.location.href = `https://www.myedio.com/directory/users/${userId}/`;
                    } else {
                        showErrorPopup(104, "User ID not found. Please complete the setup first.");
                    }
                } catch (e) {
                    showErrorPopup(105, "Error fetching user ID.");
                }
                break;
            case 'f':
                event.preventDefault();
                const videoElement = document.querySelector('video');
                if (videoElement) {
                    if (!document.fullscreenElement) {
                        videoElement.requestFullscreen().catch(err => {
                            showErrorPopup(201, `Error enabling fullscreen on video: ${err.message}`);
                        });
                    } else {
                        document.exitFullscreen().catch(err => {
                            showErrorPopup(202, `Error exiting fullscreen mode: ${err.message}`);
                        });
                    }
                } else {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(err => {
                            showErrorPopup(201, `Error enabling fullscreen mode: ${err.message}`);
                        });
                    } else {
                        document.exitFullscreen().catch(err => {
                            showErrorPopup(202, `Error exiting fullscreen mode: ${err.message}`);
                        });
                    }
                }
                break;
            case 'm':
                event.preventDefault();
                const mediaElements = document.querySelectorAll('audio, video');
                if (mediaElements.length > 0) {
                    const isMuted = Array.from(mediaElements).every(el => el.muted);
                    mediaElements.forEach(el => (el.muted = !isMuted));
                } else {
                    showErrorPopup(302, "No audio or video elements found on the page to mute/unmute.");
                }
                break;
        }
    }
}


    function showErrorPopup(errorNumber, errorMessage) {
        if (document.querySelector('.error-overlay')) return;

        const overlay = document.createElement('div');
        overlay.classList.add('error-overlay');
        const overlayContent = document.createElement('div');
        overlayContent.classList.add('error-overlay-content');

        overlayContent.innerHTML = `
            <h2>Error ${errorNumber}</h2>
            <p>${errorMessage}</p>
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = 'Close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(overlayBackground);
            document.body.style.overflow = '';
            document.body.style.userSelect = '';
        });

        overlayContent.appendChild(closeButton);
        overlay.appendChild(overlayContent);
        document.body.appendChild(overlay);

        const overlayBackground = document.createElement('div');
        overlayBackground.classList.add('error-overlay-background');
        document.body.appendChild(overlayBackground);

        document.body.style.overflow = 'hidden';
        document.body.style.userSelect = 'none';
    }

function addHotkeysElement() {
    if (document.querySelector('.c-navigation__item.hotkeys-item')) return;

    const newElement = document.createElement('li');
    newElement.classList.add('c-navigation__item', 'hotkeys-item');
    newElement.innerHTML = `
        <a class="Edio_Hotkeys" target="" title="Hotkeys">
            <span class="hotkeys-text">Hotkeys</span>
            <img class="hotkeys-icon" src="https://raw.githubusercontent.com/MineverseTutorials/Userscripts/refs/heads/main/images/Hotkeys-Icon.png" alt="Hotkeys Icon" style="width: 20px; height: 20px; display: none;">
        </a>
    `;

    const navigationElement = document.querySelector('.c-navigation');
    if (navigationElement) navigationElement.appendChild(newElement);

    newElement.addEventListener('click', showHotkeysOverlay);

    observeSidebarToggle(newElement);
}

function observeSidebarToggle(hotkeysElement) {
    const toggleButton = document.querySelector('.c-button.-icon.c-sidebar__toggle');
    if (toggleButton) {
        const observer = new MutationObserver(() => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            const textElement = hotkeysElement.querySelector('.hotkeys-text');
            const iconElement = hotkeysElement.querySelector('.hotkeys-icon');

            if (isExpanded) {
                textElement.style.display = 'block';
                iconElement.style.display = 'none';
            } else {
                textElement.style.display = 'none';
                iconElement.style.display = 'block';
            }
        });

        observer.observe(toggleButton, { attributes: true, attributeFilter: ['aria-expanded'] });
    }
}


    function showHotkeysOverlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('hotkeys-overlay');
        const overlayContent = document.createElement('div');
        overlayContent.classList.add('hotkeys-overlay-content');

        const userNameElement = document.querySelector('.c-avatar__name');
        let userName = userNameElement ? userNameElement.textContent.trim() : "User";

        function toTitleCase(str) {
            return str.replace(/\b\w/g, char => char.toUpperCase());
        }

        userName = toTitleCase(userName);

overlayContent.innerHTML = `
    <p style="color: gray; font-size: 12px;">Alpha-v4</p>
    <h2>List of Hotkeys</h2>
    <p><strong>Logout:</strong> Alt + Q</p>
    <p><strong>Calendar:</strong> Alt + C</p>
    <p><strong>Dashboard:</strong> Alt + D</p>
    <p><strong>Return to Course Link:</strong> Alt + R</p>
    <p><strong>Profile:</strong> Alt + L</p>
    <p><strong>Full Screen:</strong> Alt + F</p>
    <p><strong>Mute/Unmute All Sound:</strong> Alt + M</p>
    <p>Hello ${userName}! You are running a stable version of <strong>Edio Hotkeys</strong>.</p>
`;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = 'Close';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(overlayBackground);
            document.body.style.overflow = '';
            document.body.style.userSelect = '';
        });

        overlayContent.appendChild(closeButton);
        overlay.appendChild(overlayContent);
        document.body.appendChild(overlay);

        const overlayBackground = document.createElement('div');
        overlayBackground.classList.add('hotkeys-overlay-background');
        document.body.appendChild(overlayBackground);

        document.body.style.overflow = 'hidden';
        document.body.style.userSelect = 'none';

        displayCustomHotkeys();
        document.getElementById('add-custom-hotkey').addEventListener('click', addCustomHotkey);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .c-navigation__item.hotkeys-item a {
            display: flex;
            align-items: center;
            color: #333;
            font-size: 16px;
            text-decoration: none;
            padding: 10px;
            border-radius: 4px;
            transition: background-color 0.2s ease, transform 0.2s ease;
            cursor: pointer;
        }

        .c-navigation__item.hotkeys-item a:hover {
            background-color: #f4f4f4;
            transform: translateX(5px);
            cursor: pointer;
        }

        .hotkeys-overlay-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            pointer-events: none;
        }

        .hotkeys-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1001;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        }

        .hotkeys-overlay-content {
            background: #ffffff;
            padding: 30px 25px;
            border-radius: 12px;
            width: 500px;
            text-align: center;
            animation: slideUp 0.3s ease-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1002;
        }

        .hotkeys-overlay h2 {
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: 600;
            color: #333;
        }

        .hotkeys-overlay p {
            font-size: 16px;
            margin: 10px 0;
            color: #666;
        }

        .hotkeys-overlay button {
            margin-top: 25px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        .hotkeys-overlay button:hover {
            background-color: #0056b3;
            cursor: pointer;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { transform: translateY(30px); }
            to { transform: translateY(0); }
        }

        .error-overlay-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            pointer-events: none;
        }

        .error-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1001;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            animation: fadeIn 0.3s forwards;
        }

        .error-overlay-content {
            background: #ffffff;
            padding: 30px 25px;
            border-radius: 12px;
            width: 320px;
            text-align: center;
            animation: slideUp 0.3s ease-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1002;
        }

        .error-overlay h2 {
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: 600;
            color: #333;
        }

        .error-overlay p {
            font-size: 16px;
            margin: 10px 0;
            color: #666;
        }

        .error-overlay button {
            margin-top: 25px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }

        .error-overlay button:hover {
            background-color: #0056b3;
            cursor: pointer;
        }
    `;

    document.head.appendChild(style);

  // Update Checker

const userJsUrl = "https://update.greasyfork.org/scripts/525075/Edio%20Hotkeys%20TESTING.user.js";  // User.js URL
const updatePageUrl = "https://greasyfork.org/en/scripts/525075-edio-hotkeys-testing"; // Update page URL
const directDownloadUrl = "https://update.greasyfork.org/scripts/525075/Edio%20Hotkeys%20TESTING.user.js"; // Direct download URL

const overlayBackground = document.createElement('div');
const overlay = document.createElement('div');
const overlayContent = document.createElement('div');
const overlayMessage = document.createElement('h2');
const overlayText = document.createElement('p');
const updateButton = document.createElement('button');
const downloadButton = document.createElement('button');

overlayBackground.classList.add('hotkeys-overlay-background');
overlay.classList.add('hotkeys-overlay');
overlayContent.classList.add('hotkeys-overlay-content');
overlayMessage.classList.add('hotkeys-overlay-message');
overlayText.classList.add('hotkeys-overlay-text');
updateButton.classList.add('hotkeys-overlay-button');
downloadButton.classList.add('hotkeys-overlay-button');

overlayMessage.innerText = "Update Available!";
overlayText.innerText = "A new update is available for this script. Choose an option below.";
updateButton.innerText = "Go to Update Page";
downloadButton.innerText = "Download Script Directly";

overlayContent.appendChild(overlayMessage);
overlayContent.appendChild(overlayText);
overlayContent.appendChild(updateButton);
overlayContent.appendChild(downloadButton);
overlay.appendChild(overlayContent);
overlayBackground.appendChild(overlay);

document.body.appendChild(overlayBackground);
document.body.appendChild(overlay);

updateButton.addEventListener('click', function() {
    GM_openInTab(updatePageUrl, { active: true });
    closeOverlay();
});

downloadButton.addEventListener('click', function() {
    window.location.href = directDownloadUrl;
    closeOverlay();
});

function closeOverlay() {
    overlayBackground.style.display = 'none';
    overlay.style.display = 'none';
}

function compareVersions(version1, version2) {
    const isNumeric1 = /^\d+(\.\d+)+$/.test(version1);
    const isNumeric2 = /^\d+(\.\d+)+$/.test(version2);

    if (isNumeric1 && isNumeric2) {
        const v1 = version1.split('.').map(Number);
        const v2 = version2.split('.').map(Number);
        
        const len = Math.max(v1.length, v2.length);
        
        for (let i = 0; i < len; i++) {
            if ((v1[i] || 0) > (v2[i] || 0)) return 1;
            if ((v1[i] || 0) < (v2[i] || 0)) return -1;
        }
        return 0;
    }

    return version1 < version2 ? -1 : 1;
}

async function checkForUpdates() {
    const currentVersion = GM_info.script.version;

    try {
        // Fetch the user.js file to get the version
        const response = await fetch(userJsUrl);
        const userJsContent = await response.text();

        const versionMatch = userJsContent.match(/var\s+version\s*=\s*"([\d\.a-zA-Z\-]+)";/);

        if (versionMatch) {
            const latestVersion = versionMatch[1];

            if (compareVersions(latestVersion, currentVersion) > 0) {
                console.log(`Update available! New version: ${latestVersion}`);
                overlayText.innerText = `A new update (v${latestVersion}) is available for this script. Choose an option below.`;
                overlayBackground.style.display = 'block';
                overlay.style.display = 'flex';
            } else {
                console.log("You are using the latest version!");
                closeOverlay();
            }
        } else {
            console.error("Could not find version information in the user.js file.");
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    }
}

function observeUrlChanges2() {
    let previousUrl = window.location.href;

    const observer = new MutationObserver(() => {
        if (window.location.href !== previousUrl) {
            previousUrl = window.location.href;
            checkForUpdates();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

observeUrlChanges2();

const overlayStyle = document.createElement('style');
overlayStyle.textContent = `
    .hotkeys-overlay-button {
        margin: 10px; /* Add margin between buttons */
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    .hotkeys-overlay-button:hover {
        background-color: #0056b3;
        cursor: pointer;
    }
`;
document.head.appendChild(overlayStyle);


// End Of Update Checker

    saveLinkIfMatches();
    window.addEventListener('keydown', handleHotkeys);
    setInterval(() => {
        addHotkeysElement();
    }, 10);

})();
