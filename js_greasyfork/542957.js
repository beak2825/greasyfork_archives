    // ==UserScript==
    // @name         GeoGuessr Duel Location Exporter
    // @namespace    http://tampermonkey.net/
    // @version      1.3
    // @description  Export all Duel locations to map-making.app format with detailed logging and 300ms delay to avoid rate limiting.
    // @author       You
    // @match        https://www.geoguessr.com/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542957/GeoGuessr%20Duel%20Location%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/542957/GeoGuessr%20Duel%20Location%20Exporter.meta.js
    // ==/UserScript==

    (function () {
        'use strict';

        let paused = false;
        let pauseButton = null;

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function waitIfPaused() {
            while (paused) {
                await sleep(200);
            }
        }

        function injectExportButton() {
            if (document.getElementById('duel-export-btn')) return;

            // Export button
            const button = document.createElement('button');
            button.id = 'duel-export-btn';
            button.textContent = 'Export Duel Locations';
            button.style.position = 'fixed';
            button.style.top = '100px';
            button.style.right = '20px';
            button.style.zIndex = 9999;
            button.style.padding = '10px';
            button.style.backgroundColor = '#00aa88';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            document.body.appendChild(button);

            // Pause/Resume button
            pauseButton = document.createElement('button');
            pauseButton.id = 'pause-export-btn';
            pauseButton.textContent = 'Pause Export';
            pauseButton.style.position = 'fixed';
            pauseButton.style.top = '140px';
            pauseButton.style.right = '20px';
            pauseButton.style.zIndex = 9999;
            pauseButton.style.padding = '10px';
            pauseButton.style.backgroundColor = '#ffaa00';
            pauseButton.style.color = 'white';
            pauseButton.style.border = 'none';
            pauseButton.style.borderRadius = '5px';
            pauseButton.style.cursor = 'pointer';
            document.body.appendChild(pauseButton);

            pauseButton.onclick = () => {
                paused = !paused;
                pauseButton.textContent = paused ? 'Resume Export' : 'Pause Export';
                console.log(`[GeoGuessr Exporter] Export ${paused ? 'paused' : 'resumed'}.`);
            };

            button.onclick = async () => {
                console.log('[GeoGuessr Exporter] Export button clicked. Starting export process...');
                button.textContent = 'Exporting...';

                try {
                    await waitIfPaused();
                    const duelGames = await fetchAllDuels();
                    console.log(`[GeoGuessr Exporter] Fetched ${duelGames.length} duel games.`);

                    if (duelGames.length === 0) {
                        alert('No duel games found to export.');
                        console.warn('[GeoGuessr Exporter] No duel games found.');
                        button.textContent = 'Export Duel Locations';
                        return;
                    }       

                    const allCoordinatesByMap = {};

                    for (const [index, duel] of duelGames.entries()) {
                        await waitIfPaused();
                        const gameId = duel.gameId || duel.gameToken || duel.token;
                        if (!gameId) {
                            console.warn(`[GeoGuessr Exporter] Skipping duel with missing game ID at index ${index}.`);
                            continue;
                        }
                        console.log(`[GeoGuessr Exporter] Processing game ${index + 1}/${duelGames.length} with ID: ${gameId}`);

                        await sleep(300);
                        await waitIfPaused();
                        // Fetch the full game object, not just rounds
                        const gameData = await fetchGameData(gameId);
                        if (!gameData || !gameData.rounds || gameData.rounds.length === 0) {
                            console.warn(`[GeoGuessr Exporter] No rounds found or failed to fetch rounds for game ID: ${gameId}`);
                            continue;
                        }
                        if (!gameData.rounds[0].panorama) {
                            console.warn(`[GeoGuessr Exporter] First round missing panorama data for game ID: ${gameId}`);
                            continue;
                        }

                        // Prefer map name from options.map.name, fallback to duel.map?.name, then "Unknown Map"
                        let mapName = gameData.options?.map?.name || duel.map?.name || 'Unknown Map';
                        console.log(`[GeoGuessr Exporter] Map name: "${mapName}"`);

                        if (!allCoordinatesByMap[mapName]) {
                            allCoordinatesByMap[mapName] = [];
                        }

                        for (const [roundIndex, round] of gameData.rounds.entries()) {
                            await waitIfPaused();
                            const pano = round.panorama;
                            if (!pano) {
                                console.warn(`[GeoGuessr Exporter] Missing panorama in round ${roundIndex} of game ${gameId}`);
                                continue;
                            }
                            const lat = pano.lat;
                            const lng = pano.lng;
                            const panoId = pano.panoId;
                            const heading = pano.heading || 0;
                            const pitch = pano.pitch || 0;
                            const imageDate = pano.imageDate || "";

                            allCoordinatesByMap[mapName].push({
                                lat,
                                lng,
                                panoId,
                                heading,
                                pitch,
                                imageDate,
                                links: [
                                    `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=0,${heading},0,0,0`,
                                    `https://maps.google.com/?q=${lat},${lng}`
                                ]
                            });
                        }
                    }

                    const mapNames = Object.keys(allCoordinatesByMap);
                    console.log(`[GeoGuessr Exporter] Preparing to export data for ${mapNames.length} map(s).`);

                    for (const mapName of mapNames) {
                        await waitIfPaused();
                        const coordinates = allCoordinatesByMap[mapName];
                        if (coordinates.length === 0) {
                            console.warn(`[GeoGuessr Exporter] No coordinates to export for map "${mapName}". Skipping file creation.`);
                            continue;
                        }

                        const safeMapName = mapName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
                        const filename = `customCoordinates_${safeMapName}.json`;

                        console.log(`[GeoGuessr Exporter] Creating file "${filename}" with ${coordinates.length} locations.`);

                        const blob = new Blob([JSON.stringify({ customCoordinates: coordinates }, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        a.click();
                        URL.revokeObjectURL(url);
                    }

                    alert('Export complete! Check your downloads.');
                    console.log('[GeoGuessr Exporter] Export process finished successfully.');
                    button.textContent = 'Export Duel Locations';
                } catch (error) {
                    console.error('[GeoGuessr Exporter] Unexpected error during export:', error);
                    alert('An error occurred during export. Check the console for details.');
                    button.textContent = 'Export Duel Locations';
                }
            };
        }

        async function fetchAllDuels() {
            const allGames = [];
            let token = null;
            const seenGameIds = new Set();
            const seenTokens = new Set();

            console.log('[GeoGuessr Exporter] Starting to fetch duel games from feed...');

            while (true) {
                const url = token
                    ? `https://www.geoguessr.com/api/v4/feed/private?count=26&paginationToken=${token}`
                    : `https://www.geoguessr.com/api/v4/feed/private?count=26`;

                console.log(`[GeoGuessr Exporter] Fetching feed page: ${url}`);

                // Check for repeated pagination token
                if (token && seenTokens.has(token)) {
                    console.warn('[GeoGuessr Exporter] Duplicate pagination token detected, ending feed calls to prevent infinite loop.');
                    break;
                }
                if (token) seenTokens.add(token);

                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        console.error(`[GeoGuessr Exporter] Failed to fetch feed page. Status: ${res.status}`);
                        break;
                    }

                    const data = await res.json();
                    const entries = data.entries || [];
                    console.log(`[GeoGuessr Exporter] Entries on this page: ${entries.length}`);
                    if (entries.length > 0) {
                        console.log('[GeoGuessr Exporter] Sample entry:', entries[0]);
                    }
                    for (const entry of entries) {
                        let payload;
                        try {
                            payload = JSON.parse(entry.payload);
                        } catch (e) {
                            continue;
                        }

                        const payloads = Array.isArray(payload) ? payload : [payload];

                        for (const p of payloads) {
                            const game = p.payload ? p.payload : p;
                            const isDuel =
                                (game.gameMode && (game.gameMode.includes("Duels") || game.gameMode === "Duels")) ||
                                (game.competitiveGameMode && game.competitiveGameMode.includes("Duels"));
                            if (isDuel && game.gameId) {
                                if (seenGameIds.has(game.gameId)) {
                                    console.warn(`[GeoGuessr Exporter] Duplicate gameId ${game.gameId} detected, ending feed calls to prevent infinite loop.`);
                                    return allGames;
                                }
                                seenGameIds.add(game.gameId);
                                allGames.push({
                                    ...game,
                                    map: { name: game.mapName || "Unknown Map" }
                                });
                            }
                        }
                    }

                    if (data.paginationToken) {
                        token = data.paginationToken;
                        console.log(`[GeoGuessr Exporter] Pagination token found, continuing to next page...`);
                        await sleep(300);
                    } else {
                        console.log('[GeoGuessr Exporter] No pagination token, reached end of feed.');
                        break;
                    }
                } catch (error) {
                    console.error('[GeoGuessr Exporter] Error fetching duel feed:', error);
                    break;
                }
            }

            console.log(`[GeoGuessr Exporter] Total duel games fetched: ${allGames.length}`);
            return allGames;
        }

        async function fetchGameData(gameId) {
            try {
                console.log(`[GeoGuessr Exporter] Fetching game data for game ID: ${gameId}`);
                const res = await fetch(`https://game-server.geoguessr.com/api/duels/${gameId}`, {
                    credentials: "include"
                });
                if (!res.ok) {
                    console.error(`[GeoGuessr Exporter] Failed to fetch game data for game ID ${gameId}. Status: ${res.status}`);
                    return null;
                }
                return await res.json();
            } catch (err) {
                console.error('[GeoGuessr Exporter] Error fetching game data:', gameId, err);
                return null;
            }
        }

        // Inject button after full DOM load + delay
        window.addEventListener('load', () => {
            setTimeout(injectExportButton, 1000);
        });
    })();
