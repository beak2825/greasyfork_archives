// ==UserScript==
// @name         Auto Best Resolution
// @namespace    http://github.com/
// @version      2.2.2
// @description  Automatically select the highest resolution
// @author       Loidauk
// @match        https://*.megacloud.blog/*
// @match        https://*.bunniescdn.online/*
// @match        https://krussdomi.com/*
// @match        https://megaup.live/*
// @match        https://4spromax.site/*
// @icon         https://raw.githubusercontent.com/Loidauk/Auto-Best-Resolution/refs/heads/main/Images/Icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487541/Auto%20Best%20Resolution.user.js
// @updateURL https://update.greasyfork.org/scripts/487541/Auto%20Best%20Resolution.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    function waitForElement(selector, baseElement = document.body) {
        return new Promise(resolve => {
            if (baseElement.querySelector(selector)) {
                return resolve(baseElement.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (baseElement.querySelector(selector)) {
                    resolve(baseElement.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(baseElement, {
                childList: true,
                subtree: true
            });
        });
    }

    // Once the settings button is loaded, we know the player is loaded
    const settingsButtonSelector = 'div.jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-settings.jw-settings-submenu-button';
    await waitForElement(settingsButtonSelector);

    // Debugging: Check if the settings button is found
    console.log('Settings button found');

    // Set the quality to the highest for all players with the jwplayer api
    const players = document.querySelectorAll('div.jwplayer');
    console.log(`Found ${players.length} player(s)`); // Debugging line

    players.forEach(playerElement => {
        const player = jwplayer(playerElement);
        console.log(`Player instance:`, player); // Debugging line

        player.on('ready', () => {
            console.log('Player ready event triggered'); // Debugging line
            player.on('levelsChanged', () => {
                console.log('Levels changed event triggered'); // Debugging line
                const levels = player.getQualityLevels();
                console.log('Available quality levels:', levels); // Debugging line
                const highestQualityIndex = levels.reduce((maxIndex, level, index, levels) => {
                    return (level.bitrate && level.bitrate > levels[maxIndex].bitrate) ? index : maxIndex;
                }, 1); // Start from index 1 to skip "Auto"
                console.log('Setting quality to index:', highestQualityIndex); // Debugging line
                player.setCurrentQuality(highestQualityIndex);
            });
        });

        player.on('firstFrame', () => {
            console.log('First frame event triggered'); // Debugging line
            const levels = player.getQualityLevels();
            console.log('Available quality levels:', levels); // Debugging line
            const highestQualityIndex = levels.reduce((maxIndex, level, index, levels) => {
                return (level.bitrate && level.bitrate > levels[maxIndex].bitrate) ? index : maxIndex;
            }, 1); // Start from index 1 to skip "Auto"
            console.log('Setting quality to index:', highestQualityIndex); // Debugging line
            player.setCurrentQuality(highestQualityIndex);
        });
    });
})();
