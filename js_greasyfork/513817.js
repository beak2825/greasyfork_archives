// ==UserScript==
// @name         Torn User ID Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace status icon with checkbox and extract user IDs
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/513817/Torn%20User%20ID%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/513817/Torn%20User%20ID%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cachedIDs = GM_getValue('cachedUserIDs', []);

    const HALLOWEEN_COLORS = {
        orange: '#ff6b1a',
        darkOrange: '#cc4c00',
        purple: '#6b1aff',
        darkPurple: '#4c00cc',
        green: '#1aff6b',
        black: '#333333',
    };

    function addCheckboxes() {
        // Find all status icons and replace them
        const statusIcons = document.querySelectorAll('.iconShow[title*="Offline"], .iconShow[title*="Online"], .iconShow[title*="Idle"]');
        statusIcons.forEach(icon => {
            if (!icon.parentElement.querySelector('.user-checkbox')) {
                // Create checkbox
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.className = 'user-checkbox';
                checkbox.style.cssText = `
                    cursor: pointer;
                    margin: 0;
                    vertical-align: middle;
                `;

                // Replace icon with checkbox
                icon.parentElement.replaceChild(checkbox, icon);
            }
        });
    }

    function extractUserIDs() {
        const userList = document.querySelector('.user-info-list-wrap.bottom-round.cont-gray');
        if (!userList) {
            console.log('User list not found');
            return;
        }

        const userItems = document.querySelectorAll('li[class*="user"]');
        const newIDs = Array.from(userItems)
            .filter(item => {
                const checkbox = item.querySelector('.user-checkbox');
                return checkbox && checkbox.checked;
            })
            .map(item => {
                const match = item.className.match(/user(\d+)/);
                return match ? match[1] : null;
            })
            .filter(id => id !== null);

        // Add new IDs to cache, avoiding duplicates and limiting to 100
        newIDs.forEach(id => {
            if (!cachedIDs.includes(id) && cachedIDs.length < 100) {
                cachedIDs.push(id);
            }
        });

        // Save updated cache
        GM_setValue('cachedUserIDs', cachedIDs);

        // Update counter
        updateCounter();

        // Create a floating message
        showMessage(`${newIDs.length} user IDs extracted. Total cached: ${cachedIDs.length}`);
    }

    function formatAndCopyIDs() {
        const formattedData = {
            target_backup: cachedIDs.slice(0, 100).map(id => ({
                id: parseInt(id),
                notes: "",
                notes_color: ""
            }))
        };

        const jsonString = JSON.stringify(formattedData);
        GM_setClipboard(jsonString);
        console.log('Formatted user data copied to clipboard:', jsonString);

        showMessage(`${formattedData.target_backup.length} user IDs formatted and copied to clipboard!`);
    }

    function showMessage(text) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${HALLOWEEN_COLORS.purple};
            color: black;
            padding: 15px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 0 10px ${HALLOWEEN_COLORS.orange};
            animation: glow 1s ease-in-out infinite alternate;
        `;

        // Add glow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glow {
                from {
                    box-shadow: 0 0 5px ${HALLOWEEN_COLORS.orange},
                               0 0 10px ${HALLOWEEN_COLORS.orange};
                }
                to {
                    box-shadow: 0 0 10px ${HALLOWEEN_COLORS.purple},
                               0 0 20px ${HALLOWEEN_COLORS.purple};
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(message);
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }

    function updateCounter() {
        counterSpan.textContent = `${cachedIDs.length}/100`;
    }

    function clearCache() {
        cachedIDs = [];
        GM_setValue('cachedUserIDs', cachedIDs);
        updateCounter();
        showMessage("Cache cleared!");
    }

    // Create UI elements with consistent width
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
    `;

    const baseButtonStyle = `
        padding: 10px;
        width: 200px;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    const extractButton = document.createElement('button');
    extractButton.textContent = 'Extract Selected User IDs';
    extractButton.style.cssText = `
        ${baseButtonStyle}
        background-color: ${HALLOWEEN_COLORS.orange};
    `;
    extractButton.addEventListener('mouseover', () => {
        extractButton.style.backgroundColor = HALLOWEEN_COLORS.darkOrange;
        extractButton.style.transform = 'translateY(-2px)';
    });
    extractButton.addEventListener('mouseout', () => {
        extractButton.style.backgroundColor = HALLOWEEN_COLORS.orange;
        extractButton.style.transform = 'translateY(0)';
    });
    extractButton.addEventListener('click', extractUserIDs);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Format and Copy IDs';
    copyButton.style.cssText = `
        ${baseButtonStyle}
        background-color: ${HALLOWEEN_COLORS.purple};
    `;
    copyButton.addEventListener('mouseover', () => {
        copyButton.style.backgroundColor = HALLOWEEN_COLORS.darkPurple;
        copyButton.style.transform = 'translateY(-2px)';
    });
    copyButton.addEventListener('mouseout', () => {
        copyButton.style.backgroundColor = HALLOWEEN_COLORS.purple;
        copyButton.style.transform = 'translateY(0)';
    });
    copyButton.addEventListener('click', formatAndCopyIDs);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Cache';
    clearButton.style.cssText = `
        ${baseButtonStyle}
        background-color: ${HALLOWEEN_COLORS.green};
    `;
    clearButton.addEventListener('mouseover', () => {
        clearButton.style.backgroundColor = '#008c45';
        clearButton.style.transform = 'translateY(-2px)';
    });
    clearButton.addEventListener('mouseout', () => {
        clearButton.style.backgroundColor = HALLOWEEN_COLORS.green;
        clearButton.style.transform = 'translateY(0)';
    });
    clearButton.addEventListener('click', clearCache);

    const counterSpan = document.createElement('span');
    counterSpan.style.cssText = `
        width: 180px;
        color: white;
        background-color: ${HALLOWEEN_COLORS.black};
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    updateCounter();

    buttonContainer.appendChild(extractButton);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(counterSpan);
    document.body.appendChild(buttonContainer);

    // Add Halloween style to checkboxes
    const checkboxStyle = document.createElement('style');
    checkboxStyle.textContent = `
        .user-checkbox {
            accent-color: ${HALLOWEEN_COLORS.orange} !important;
            width: 16px;
            height: 16px;
        }
        .user-checkbox:hover {
            transform: scale(1.1);
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(checkboxStyle);

    // Initial setup
    addCheckboxes();

    // Add mutation observer to handle dynamically loaded users
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                addCheckboxes();
            }
        });
    });

    const userList = document.querySelector('.user-info-list-wrap.bottom-round.cont-gray');
    if (userList) {
        observer.observe(userList, { childList: true, subtree: true });
    }
})();