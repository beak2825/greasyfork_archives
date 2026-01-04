// ==UserScript==
// @name         Netflix Episode title and description Extractor
// @namespace    https://greasyfork.org/en/scripts/521575-netflix-episode-title-and-description-extractor
// @version      3.1
// @description  Extract episode number, title, and description from Netflix and save to file, with cookie handling
// @author       Abu3safeer
// @match        https://www.netflix.com/*/title/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_cookie
// @connect      web.prod.cloud.netflix.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521575/Netflix%20Episode%20title%20and%20description%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/521575/Netflix%20Episode%20title%20and%20description%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the button
    const button = document.createElement('button');
    button.innerText = 'Fetch Show Info';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background-color: #e50914;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: Netflix Sans,Helvetica Neue,Segoe UI,Roboto,Ubuntu,sans-serif;
    `;

    // Add hover effect
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#f40612';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#e50914';
    });

    // Function to extract show ID from URL
    function getShowIdFromUrl() {
        const match = window.location.pathname.match(/\/title\/(\d+)/);
        return match ? match[1] : null;
    }

    async function fetchShowInfo(showId) {
        console.log('Starting fetch for show ID:', showId);
        
        // Get locale from Netflix cookies
        let locale = 'en-US'; // default fallback
        
        await new Promise((resolve) => {
            GM_cookie.list({ domain: '.netflix.com' }, (cookies) => {
                const localeCookie = cookies.find(c => c.name === 'locale');
                if (localeCookie) {
                    locale = localeCookie.value;
                    console.log('Found Netflix locale:', locale);
                }
                resolve();
            });
        });

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Origin": "https://www.netflix.com",
            "Referer": "https://www.netflix.com/",
            "Accept-Language": locale,
            "x-netflix-user-locale": locale
        };

        // Update season payload with locale
        const payloadSeasons = {
            "operationName": "PreviewModalEpisodeSelector",
            "variables": {
                "seasonCount": 100,
                "showId": showId,
                "locale": locale
            },
            "extensions": {
                "persistedQuery": {
                    "id": "b1213a1e-19d0-42e6-aeed-7a29d855346c",
                    "version": 102
                }
            }
        };

        // Update the episode payload creation to include locale
        const createEpisodePayload = (seasonId) => ({
            "operationName": "PreviewModalEpisodeSelectorSeasonEpisodes",
            "variables": {
                "seasonId": seasonId,
                "count": 100,
                "opaqueImageFormat": "JPG",
                "artworkContext": {},
                "locale": locale
            },
            "extensions": {
                "persistedQuery": {
                    "id": "314df063-5a11-4b60-87d5-765ea6e3fc91",
                    "version": 102
                }
            }
        });

        // Helper function for downloading JSON files
        function downloadJSON(filename, data) {
            console.log(`Preparing to download ${filename}`, data);
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            
            GM_download({
                url: url,
                name: filename,
                onload: () => {
                    console.log(`Successfully downloaded ${filename}`);
                    URL.revokeObjectURL(url);
                },
                onerror: (error) => {
                    console.error(`Failed to download ${filename}:`, error);
                }
            });
        }

        // Helper function to make GM_xmlhttpRequest return a Promise
        function makeRequest(url, payload) {
            console.log('Making request to:', url);
            console.log('With payload:', payload);
            
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url,
                    headers: headers,
                    data: JSON.stringify(payload),
                    withCredentials: true,
                    anonymous: false,
                    responseType: 'json',
                    onload: function(response) {
                        console.log('Received response:', response);
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('Parsed response data:', data);
                            if (response.status === 200) {
                                resolve(data);
                            } else {
                                console.error('Request failed with status:', response.status);
                                reject(new Error(`HTTP ${response.status}: ${data.message || 'Unknown error'}`));
                            }
                        } catch (e) {
                            console.error('Failed to parse response:', e);
                            console.log('Raw response:', response.responseText);
                            reject(new Error('Failed to parse response'));
                        }
                    },
                    onerror: function(error) {
                        console.error('Request failed:', error);
                        reject(new Error('Network error occurred'));
                    },
                    ontimeout: function() {
                        console.error('Request timed out');
                        reject(new Error('Request timed out'));
                    }
                });
            });
        }

        try {
            // First request to get show details and seasons
            console.log('Fetching seasons data...');
            const data = await makeRequest("https://web.prod.cloud.netflix.com/graphql", payloadSeasons);
            console.log('Received seasons data:', data);

            if (!data.data?.videos?.[0]) {
                console.error('No video data found in response');
                throw new Error("Could not fetch show data");
            }

            const videoData = data.data.videos[0];
            const showData = {
                show_id: showId,
                seasons: []
            };

            if (!videoData.seasons?.edges) {
                throw new Error("No seasons found");
            }

            // Process each season
            for (const season of videoData.seasons.edges) {
                console.log('Processing season:', season);
                if (!season.node) continue;

                const seasonNode = season.node;
                const seasonInfo = {
                    season_name: seasonNode.title || "Unknown Season",
                    episodes: []
                };

                // Get episodes for each season
                const payloadEpisodes = createEpisodePayload(seasonNode.videoId);

                console.log('Fetching episodes for season:', seasonInfo.season_name);
                const episodeData = await makeRequest("https://web.prod.cloud.netflix.com/graphql", payloadEpisodes);
                console.log('Received episode data:', episodeData);

                // Update the episodes path
                const episodes = episodeData.data?.videos?.[0]?.episodes?.edges || [];
                console.log('Found episodes:', episodes.length);

                for (const episode of episodes) {
                    if (!episode.node) continue;
                    console.log('Processing episode:', episode.node);

                    const episodeNode = episode.node;
                    const episodeInfo = {
                        episode_name: episodeNode.title || "Unknown Title",
                        episode_number: episodeNode.number || 0,
                        episode_description: episodeNode.contextualSynopsis?.text || "No description available"
                    };
                    console.log('Created episode info:', episodeInfo);
                    seasonInfo.episodes.push(episodeInfo);
                }

                showData.seasons.push(seasonInfo);

                console.log('Creating simplified season data');
                // Create simplified season data
                const simpleEpisodes = seasonInfo.episodes.map(ep => ({
                    episodeNumber: String(ep.episode_number),
                    episodeTitle: ep.episode_name,
                    description: ep.episode_description
                }));
                console.log('Simplified episodes:', simpleEpisodes);

                const seasonFilename = `${showId}_${seasonInfo.season_name.replace(/ /g, '_')}.json`;
                console.log(`Saving season data to ${seasonFilename}`);
                downloadJSON(seasonFilename, simpleEpisodes);
            }

            console.log('Saving complete show data');
            downloadJSON(`netflix_show_${showId}.json`, showData);

            return true;
        } catch (error) {
            console.error('Error in fetchShowInfo:', error);
            alert(`Error fetching show data: ${error.message}`);
            return false;
        }
    }

    // Click handler
    button.addEventListener('click', async () => {
        const showId = getShowIdFromUrl();
        if (!showId) {
            alert('Could not find show ID in URL');
            return;
        }

        button.disabled = true;
        button.innerText = 'Fetching...';

        const success = await fetchShowInfo(showId);
        
        button.disabled = false;
        button.innerText = 'Fetch Show Info';

        if (success) {
            alert('Show information has been saved!');
        }
    });

    // Add button to page
    document.body.appendChild(button);
})();