// ==UserScript==
// @name         Trades logger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script saving info about trade offers to json
// @match        https://www.supremacy1914.pl/*
// @grant        none
// @license CC BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/516493/Trades%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/516493/Trades%20logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        const url = args[0];

        if (url.includes("https://www.supremacy1914.pl/game.php")) {
            const responseClone = response.clone();
            responseClone.json().then(data => {
                if (data.result?.states?.["4"]?.["@c"] === "ultshared.UltResourceState") {
                    const resourceStateData = data.result.states["4"];

                    console.log('Founded ultshared.UltResourceState:', resourceStateData);

                    localStorage.setItem('UltResourceStateData', JSON.stringify(resourceStateData));

                    downloadJSON(resourceStateData, 'UltResourceStateData.json');
                }
            });
        }
        return response;
    };

    function downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
})();