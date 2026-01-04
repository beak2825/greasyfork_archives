// ==UserScript==
// @name         Vimeo Set Quality to 1080p
// @namespace    https://greasyfork.org/en/users/1330666
// @author       A2L
// @version      0.3
// @description  Set Vimeo video quality to 1080p automatically and close the menu
// @match        https://vimeo.com/*
// @match        https://player.vimeo.com/*
// @grant        none
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://vimeo.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/500088/Vimeo%20Set%20Quality%20to%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/500088/Vimeo%20Set%20Quality%20to%201080p.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForElement = (selector, timeout = 10000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const intervalId = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(intervalId);
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                }
            }, 100);
        });
    };

    const setQualityTo1080p = async () => {
        try {
            console.log('Attempting to set quality to 1080p');
            const player = await waitForElement('.vp-player-ui-container');
            console.log('Player found');

            const settingsButton = await waitForElement('button[aria-label="Settings"], .vp-prefs');
            console.log('Settings button found');
            settingsButton.click();
            console.log('Settings button clicked');

            await waitForElement('.vp-menu');
            console.log('Menu appeared');

            const menuItems = document.querySelectorAll('.vp-menu li, .vp-menu [role="menuitemradio"]');
            console.log(`Found ${menuItems.length} menu items`);

            for (let item of menuItems) {
                if (item.textContent.includes('Quality') || item.textContent.includes('1080p')) {
                    console.log(`Clicking on: ${item.textContent}`);
                    item.click();

                    if (item.textContent.includes('Quality')) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        const subMenuItems = document.querySelectorAll('.vp-menu li, .vp-menu [role="menuitemradio"]');
                        for (let subItem of subMenuItems) {
                            if (subItem.textContent.includes('1080p')) {
                                console.log('1080p option found and clicked');
                                subItem.click();
                                break;
                            }
                        }
                    } else {
                        console.log('1080p option directly selected');
                    }

                    // Close the menu
                    await new Promise(resolve => setTimeout(resolve, 500));
                    settingsButton.click();
                    console.log('Settings menu closed');
                    return;
                }
            }

            console.log('1080p option not found');
        } catch (error) {
            console.error('Error setting quality:', error);
        }
    };

    // Run the script after a short delay to ensure the player has loaded
    setTimeout(setQualityTo1080p, 2000);

    // Also run when URL changes (for single-page applications)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed, re-running script');
            setTimeout(setQualityTo1080p, 2000);
        }
    }).observe(document, { subtree: true, childList: true });

    console.log('Vimeo Set Quality to 1080p script loaded');
})();
