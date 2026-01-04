// ==UserScript==
// @name        Torn Chats Enhanced [Doesn't Work Anymore]
// @namespace   https://github.com/AmeLooksSus
// @match       *://*torn.com/*
// @grant       none
// @version     1.1
// @author      AmeLooksSus
// @description Enjoy colorful user names for better chat readability.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476892/Torn%20Chats%20Enhanced%20%5BDoesn%27t%20Work%20Anymore%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/476892/Torn%20Chats%20Enhanced%20%5BDoesn%27t%20Work%20Anymore%5D.meta.js
// ==/UserScript==

function extractUserXID(link) {
    if (link && link.includes('/profiles.php?XID=')) {
        const xidMatch = link.match(/XID=([A-Za-z0-9]+)/);
        if (xidMatch && xidMatch[1]) {
            return xidMatch[1];
        }
    }
    return null;
}

function getRandomHexColor(isDarkMode) {
    const minBrightness = isDarkMode ? 70 : 30;
    const maxBrightness = isDarkMode ? 100 : 50;
    const letters = '0123456789ABCDEF';
    let color = '#';

    while (true) {
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        const hex = color.substring(1);
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        if (brightness >= minBrightness && brightness <= maxBrightness) {
            break;
        } else {
            color = '#';
        }
    }

    return color;
}

function styleLinksInsideChatContainers(isDarkMode, myXID) {
    const containers = document.querySelectorAll('body');
    containers.forEach(container => {
        const links = container.querySelectorAll('._overview_1pskg_893 a, ._message_1pskg_509 a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const xid = extractUserXID(href);

            if (href && href.includes('http')) {
                link.style.color = '#66c2ff'; // Blue
                link.style.textDecoration = 'underline';
            } else if (xid) {
                if (xid === myXID) {
                    link.style.color = '#80ff80'; // User Color
                } else {
                    const currentTime = new Date().getTime();
                    let userColor = userColorMap[xid];

                    if (!userColor || (currentTime - userColor.timestamp) >= 600000) {
                        do {
                            userColor = getRandomHexColor(isDarkMode);
                        } while (Object.values(userColorMap).some(existingColor => existingColor.color === userColor));

                        userColorMap[xid] = {
                            color: userColor,
                            timestamp: currentTime
                        };
                    }

                    link.style.color = userColorMap[xid].color;
                }
            } else {
                link.style.color = '#0099FF'; // Blue
                link.style.textDecoration = 'underline';
            }
        });
    });
}

function addMessageDividers() {
    const messageContainers = document.querySelectorAll('._message_1pskg_509');
    messageContainers.forEach(container => {
        container.style.borderTop = '1px solid #666';
        container.style.paddingTop = '5px';
    });
}

function checkForNewMessages(isDarkMode, myXID) {
    styleLinksInsideChatContainers(isDarkMode, myXID);
    addMessageDividers();
}

// Main logic
const darkModeCheckbox = document.getElementById('dark-mode-state');
const isDarkModeEnabled = localStorage.getItem('darkModeState') === 'enabled';

if (darkModeCheckbox) {
    darkModeCheckbox.addEventListener('change', function () {
        if (darkModeCheckbox.checked) {
            localStorage.setItem('darkModeState', 'enabled');
            location.reload();
        } else {
            localStorage.setItem('darkModeState', 'disabled');
            location.reload();
        }
    });

    if (isDarkModeEnabled) {
        darkModeCheckbox.checked = true;
    }
}

const myXID = extractUserXID(window.location.href);
const userColorMap = {};

checkForNewMessages(isDarkModeEnabled, myXID);
setInterval(() => checkForNewMessages(isDarkModeEnabled, myXID), 500);