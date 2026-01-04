// ==UserScript==
// @name         Yorg.io Optimizations
// @author       BlueLatios
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  Optimizing Yorg
// @match        https://yorg.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yorg.io
// @license      GNU GPLv3
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/473333/Yorgio%20Optimizations.user.js
// @updateURL https://update.greasyfork.org/scripts/473333/Yorgio%20Optimizations.meta.js
// ==/UserScript==

/*
 * Version Checker
 */

const currentVersion = '0.1.8';
const scriptURL = 'https://greasyfork.org/en/scripts/473333/code/yorg-io-optimizations.js';

GM.xmlHttpRequest({
    method: 'GET',
    url: scriptURL,
    onload: function(response) {
        const matches = response.responseText.match(/@version\s+(\d+\.\d+)/);
        if (matches) {
            const latestVersion = matches[1];
            if (latestVersion !== currentVersion) {
                alert('A new version (' + latestVersion + ') of the userscript is available!\nPlease update for the latest features and improvements.');
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const rootPrefix = mouseTracker.onMouseMove._bindings[0].context.root; // This is what's used to inject scripts

    rootPrefix.waveMgr.spawnWave = async function(day) {
        const enemies = this.getWaveEnemies(day);
        const groupSize = Math.floor((day / 6) + 20);
        const delayBetweenGroups = 200;
        const totalGroups = Math.ceil(enemies.length / groupSize);

        for (let i = 0; i < totalGroups; i++) {
            const groupStartIndex = i * groupSize;
            const groupEnemies = enemies.slice(groupStartIndex, groupStartIndex + groupSize);

            // Spawn all enemies in the group concurrently
            await Promise.all(groupEnemies.map(enemy => {
                const {
                    enemyClass,
                    level
                } = enemy;
                return this.root.logic.spawnNewEnemy(enemyClass, level);
            }));

            // If not the last group, delay the next group spawn
            if (i < totalGroups - 1) {
                await this.delay(delayBetweenGroups);
            }
        }
    };
    rootPrefix.waveMgr.delay = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
});