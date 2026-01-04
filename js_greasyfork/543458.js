// ==UserScript==
// @name         Keno Heatmap
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Tracks Keno random numbers and displays a heat map with light gray to dark red gradient
// @author       Allenone[2033011]
// @match        https://www.torn.com/page.php?sid=keno
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543458/Keno%20Heatmap.user.js
// @updateURL https://update.greasyfork.org/scripts/543458/Keno%20Heatmap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const win = (unsafeWindow || window);
    const TARGET_URL_BASE = "torn.com/page.php";

    // Initialize frequency cache for numbers 1-80
    function initializeFrequencyCache() {
        let frequency = GM_getValue('kenoNumberFrequency', null);
        if (!frequency) {
            frequency = {};
            for (let i = 1; i <= 80; i++) {
                frequency[i] = 0;
            }
            GM_setValue('kenoNumberFrequency', frequency);
        }
        return frequency;
    }

    // Update frequency cache with new random numbers
    function updateFrequencyCache(randomNumbers) {
        let frequency = initializeFrequencyCache();
        randomNumbers.forEach(num => {
            if (num >= 1 && num <= 80) {
                frequency[num] = (frequency[num] || 0) + 1;
            }
        });
        GM_setValue('kenoNumberFrequency', frequency);
        updateHotspotMap(frequency);
    }

    // Interpolate between two RGB colors
    function interpolateColor(startColor, endColor, factor) {
        const result = startColor.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(startColor[i] + (endColor[i] - startColor[i]) * factor);
        }
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    }

    // Update the hotspot map with color gradient from light gray to dark red
    function updateHotspotMap(frequency) {
        const startColor = [211, 211, 211]; // Light gray (#D3D3D3)
        const endColor = [139, 0, 0]; // Dark red (#8B0000)
        const maxFrequency = Math.max(...Object.values(frequency), 1); // Avoid division by 0

        const style = document.createElement('style');
        style.textContent = `
            #boardContainer span {
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
                transition: background-color 0.3s;
            }
        `;
        document.head.appendChild(style);

        for (let i = 1; i <= 80; i++) {
            const element = document.getElementById(`keno_item_${i}`);
            if (element) {
                const freq = frequency[i] || 0;
                const factor = freq / maxFrequency; // Normalize frequency
                const color = interpolateColor(startColor, endColor, factor);
                element.style.backgroundColor = color;
                element.style.color = 'black';
            }
        }
    }

    // Observe DOM for boardContainer and initialize hotspot map
    function initializeHotspotOnBoardLoad() {
        const targetNode = document.body;
        const observer = new MutationObserver((mutations, obs) => {
            const boardContainer = document.getElementById('boardContainer');
            if (boardContainer) {
                updateHotspotMap(initializeFrequencyCache());
                obs.disconnect(); // Stop observing once board is found
            }
        });
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // Start observing for boardContainer
    initializeHotspotOnBoardLoad();

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const isTargetUrl = this._url && this._url.includes(TARGET_URL_BASE);
        if (isTargetUrl) {
            const xhr = this;

            const handleResponse = function(event) {
                if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText) {
                    try {
                        const json = JSON.parse(xhr.responseText);
                        if (json.matches !== undefined && json.winnings !== undefined) {
                            //console.log(JSON.stringify(json, null, 2));
                            if (json.randomNumbers && Array.isArray(json.randomNumbers)) {
                                updateFrequencyCache(json.randomNumbers);
                            }
                        }
                    } catch (err) {
                    }
                }
            };

            xhr.addEventListener('load', handleResponse);
        }
        return originalSend.apply(this, arguments);
    };
})();