// ==UserScript==
// @name         Elethor Tools Data Bridge
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Fetches Elethor game data for TomatoShadow's Elethor Tools
// @match        http://localhost:5173/*
// @match        https://elethor.tomato.ninja/*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @connect      elethor.com
// @downloadURL https://update.greasyfork.org/scripts/541875/Elethor%20Tools%20Data%20Bridge.user.js
// @updateURL https://update.greasyfork.org/scripts/541875/Elethor%20Tools%20Data%20Bridge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Elethor Tools Data Bridge loaded');

    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'ELETHOR_SYNC_REQUEST') {
            console.log('Received sync request');

            const endpoints = {
                renown: 'https://elethor.com/game/renown',
                buffs: 'https://elethor.com/game/buffs',
                companions: 'https://elethor.com/game/companions',
                gearset: 'https://elethor.com/game/gearset',
                user: 'https://elethor.com/game/user',
                spire0: 'https://elethor.com/game/neo-spire/0',
                spire1000: 'https://elethor.com/game/neo-spire/1000',
                modifiers: 'https://elethor.com/game/neo-spire/modifiers',
                spireView: 'https://elethor.com/game/views/neo-spire',
                marketVoids: 'https://elethor.com/game/market/listings?itemId=385',
                marketPlat: 'https://elethor.com/game/market/listings?itemId=180',
                marketOmnium: 'https://elethor.com/game/market/listings?itemId=297',
                // Mining endpoints
                lasers: 'https://elethor.com/game/laser',
                gather: 'https://elethor.com/game/views/gather',
                gatherStats: 'https://elethor.com/game/gather/stats',
                skillTree: 'https://elethor.com/game/skill/tree',
            };

            const results = {};
            let count = 0;
            const total = Object.keys(endpoints).length;

            Object.entries(endpoints).forEach(([key, url]) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            try {
                                const data = response.responseText ? JSON.parse(response.responseText) : null;
                                results[key] = data;
                            } catch (e) {
                                console.error(`Failed to parse JSON for ${key}:`, e);
                                results[key] = { error: 'Failed to parse JSON' };
                            }
                        } else {
                            console.error(`HTTP error for ${key}:`, response.status, response.statusText);
                            results[key] = { error: `HTTP ${response.status}: ${response.statusText}` };
                        }

                        count++;
                        if (count === total) {
                            console.log('Elethor data sync completed');
                            window.postMessage({ type: 'ELETHOR_SYNC_RESPONSE', payload: results }, '*');
                        }
                    },
                    onerror: function(error) {
                        console.error(`Network error for ${key}:`, error);
                        results[key] = { error: 'Network error' };
                        count++;
                        if (count === total) {
                            console.log('Elethor data sync completed (with errors)');
                            window.postMessage({ type: 'ELETHOR_SYNC_RESPONSE', payload: results }, '*');
                        }
                    },
                    ontimeout: function() {
                        console.error(`Timeout for ${key}`);
                        results[key] = { error: 'Request timeout' };
                        count++;
                        if (count === total) {
                            console.log('Elethor data sync completed (with timeouts)');
                            window.postMessage({ type: 'ELETHOR_SYNC_RESPONSE', payload: results }, '*');
                        }
                    },
                    timeout: 10000 // 10 second timeout
                });
            });
        }
    }, false);

    // Test if userscript is working
    window.postMessage({ type: 'ELETHOR_USERSCRIPT_READY' }, '*');
})();
