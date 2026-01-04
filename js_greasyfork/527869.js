// ==UserScript==
// @name         RYM Display Track Ratings
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Displays average Track ratings and info directly on rateyourmusic album or any other release pages.
// @author       cariosa
// @match        https://rateyourmusic.com/release/*
// @icon         https://e.snmc.io/2.5/img/sonemic.png
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/527869/RYM%20Display%20Track%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/527869/RYM%20Display%20Track%20Ratings.meta.js
// ==/UserScript==

// --- I. SETTINGS PANEL SETUP ---
GM_config.init({
    'id': 'RYMTrackRatingsConfig',
    'title': 'RYM Track Ratings Settings',
    'fields': {
        'requestDelay': {
            'label': 'Delay between request chunks (ms):',
            'type': 'int',
            'default': 1500,
            'title': 'The pause between fetching each batch of tracks.'
        },
        'cacheDays': {
            'label': 'Cache expiration (days):',
            'type': 'int',
            'default': 7,
            'title': 'How long to store data before fetching it again.'
        }
    }
});

function clearAllCache() {
    GM_setValue('trackDataCache', {});
    alert('RYM Track Ratings: All cached track data has been cleared.');
}

GM_registerMenuCommand('⚙️ Configure Track Ratings', () => GM_config.open());
GM_registerMenuCommand('⚠️ Clear All Cached Data', clearAllCache);


// --- II. MAIN SCRIPT LOGIC ---
function runScript() {
    'use strict';

    // --- A. Script State and Helpers ---
    const CHUNK_SIZE = 4;
    const DEBUG_MODE = false;

    let loadClickCount = 0;
    let trackDataCache = getCache();
    let genreRankingsVisible = GM_getValue('genreRankingsVisible', true);

    const log = (message) => {
        if (DEBUG_MODE) console.log(message);
    };

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.textContent = `Error: ${message}`;
        errorElement.style.cssText = 'color: red; position: fixed; top: 10px; right: 10px; background-color: white; padding: 10px; z-index: 9999; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);';
        document.body.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }

    // --- B. UI Creation and Insertion ---
    function createButton(text, onClick, id = '') {
        const button = document.createElement('button');
        button.textContent = text;
        button.id = id;
        button.style.cssText = `margin-left: 3px; padding: 3px; border: 0; border-radius: 2px; background: #cba6f7; cursor: pointer; font-size: 10px; transition: background-color 0.2s;`;
        button.addEventListener('mouseover', () => {
            if (!button.disabled) button.style.backgroundColor = '#f2cdcd';
        });
        button.addEventListener('mouseout', () => {
            if (!button.disabled) button.style.backgroundColor = '#cba6f7';
        });
        button.addEventListener('click', onClick);
        return button;
    }

    function createButtons(buttonsData) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '10px';
        buttonContainer.classList.add('rym-track-ratings-buttons');
        buttonsData.forEach(({
            text,
            onClick,
            id
        }) => {
            buttonContainer.appendChild(createButton(text, onClick, id));
        });
        return buttonContainer;
    }

    function insertButtons() {
        const trackContainers = [document.getElementById('tracks'), document.getElementById('tracks_mobile')];
        trackContainers.forEach((tracksContainer) => {
            if (tracksContainer && !tracksContainer.previousElementSibling?.classList.contains('rym-track-ratings-buttons')) {
                const buttonContainer = createButtons([{
                    text: 'Load Track Ratings',
                    onClick: (e) => toggleTrackRatings(e.target),
                    id: 'load-ratings-btn'
                }, {
                    text: 'Toggle Genre/Rankings',
                    onClick: toggleGenreRankings
                }, {
                    text: 'Clear Page Cache',
                    onClick: clearPageCache
                }]);
                tracksContainer.parentNode.insertBefore(buttonContainer, tracksContainer);
            }
        });
    }

    // MODIFIED: Fine-tuned spacing values for better visual balance.
    function injectCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Increase the left margin to create more space between the star and the rating value */
            .page_release_section_tracks_track_stats_rating {
                margin-left: 6px;
            }
            /* Further reduce space around the pipe separator for a more compact feel */
            .page_release_section_tracks_track_stats_rating.pipe_separated::after,
            .page_release_section_tracks_track_stats_count.pipe_separated::before {
                padding: 0 0.35em !important;
            }
        `;
        document.head.appendChild(style);
    }

    // --- C. Data Parsing and HTML Injection ---
    function parseTrackRating(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const ratingElement = doc.querySelector('.page_section_main_info_music_rating_value_rating');
        const countElement = doc.querySelector('.page_section_main_info_music_rating_value_number');
        if (!ratingElement || !countElement) return null;
        return {
            rating: ratingElement.textContent.trim().match(/\d+\.\d+/)?.[0],
            count: countElement.textContent.trim().match(/[\d,]+/)?.[0],
            isBold: !!ratingElement.querySelector('img[alt="rating bolded"]')
        };
    }

    function parseTrackInfo(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        let genreHtml = null;
        const genreLinkElement = doc.querySelector('.page_song_header_info_genre_item_primary .genre');
        if (genreLinkElement) {
            // Rebuild the link from its parts to avoid including the problematic "comma_separated" class
            const href = genreLinkElement.getAttribute('href');
            const text = genreLinkElement.textContent;
            genreHtml = `<a class="genre" href="${href}">${text}</a>`;
        }

        return {
            genre: genreHtml,
            rankings: Array.from(doc.querySelectorAll('.page_song_header_info_rest .comma_separated')).map(el => el.outerHTML).join(' ')
        };
    }

    function createRatingHTML(rating, count, isBold) {
        const starClass = isBold ? 'metadata-star-bold' : 'metadata-star';
        return `<span data-tiptip="${rating} from ${count} ratings" class="has_tip page_release_section_tracks_songs_song_stats significant"><span class="page_release_section_tracks_track_stats_scores"><span class="page_release_section_tracks_track_stats_score_star pipe_separated"><img alt="${isBold ? 'bold star' : 'star'}" class="${starClass}"><div class="page_release_section_tracks_track_stats_rating pipe_separated">${rating}</div></span><div class="page_release_section_tracks_track_stats_count pipe_separated">${count}</div></span></span>`;
    }

    function insertTrackRating(trackElement, rating, count, isBold) {
        const existingRatingWrapper = trackElement.querySelector('.page_release_section_tracks_track_stats_scores')?.parentElement;
        if (existingRatingWrapper) {
            existingRatingWrapper.remove();
        }
        const tracklistLine = trackElement.querySelector('.tracklist_line');
        const trackNumber = trackElement.querySelector('.tracklist_num');
        if (tracklistLine && trackNumber) {
            const ratingElement = document.createElement('span');
            ratingElement.innerHTML = createRatingHTML(rating, count, isBold);
            tracklistLine.insertBefore(ratingElement, trackNumber);
        }
    }

    function insertTrackInfo(trackElement, genre, rankings) {
        if (trackElement.querySelector('.rym-userscript-info-container')) return;

        let combinedHtml = '';
        if (genre) {
            combinedHtml += genre;
        }
        if (rankings && rankings.trim().length > 0) {
            if (combinedHtml.length > 0) {
                combinedHtml += ' • '; // Separator between genre and rankings block
            }
            combinedHtml += rankings;
        }

        if (combinedHtml.length > 0) {
            const infoContainer = document.createElement('div');
            infoContainer.className = 'rym-userscript-info-container';
            infoContainer.style.cssText = 'margin-top: 5px; margin-bottom: 5px; margin-left: 34px;';
            infoContainer.innerHTML = combinedHtml;
            infoContainer.style.display = genreRankingsVisible ? 'block' : 'none';
            trackElement.appendChild(infoContainer);
        }
    }

    // --- D. Core Logic: Fetching and Processing ---
    /**
     * Fetches, parses, and caches data for a single track URL. Returns the data object.
     * @param {string} url - The URL of the track page.
     * @returns {Promise<object|null>} A promise resolving to the track's data object or null on failure.
     */
    async function fetchAndCacheTrackData(url) {
        const cacheKey = `rym_track_data_${url}`;
        const cachedData = trackDataCache[cacheKey];
        if (cachedData) {
            return cachedData;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                if (response.status === 429) showError('Rate limit hit! Try increasing the request delay in settings.');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseText = await response.text();
            const trackRating = parseTrackRating(responseText);
            const trackInfo = parseTrackInfo(responseText);

            if (!trackRating || !trackInfo) return null;

            const newData = { ...trackRating,
                ...trackInfo,
                timestamp: Date.now()
            };
            trackDataCache[cacheKey] = newData;
            GM_setValue('trackDataCache', trackDataCache);
            return newData;
        } catch (error) {
            const trackName = url.split('/').pop();
            showError(`Failed to fetch data for "${trackName}".`);
            console.error(`Error processing "${url}":`, error);
            return null;
        }
    }

    /**
     * Updates an array of track <li> elements with the provided rating and info.
     * @param {HTMLElement[]} trackElements - Array of <li> elements for the same track.
     * @param {object} data - The track data object from fetchAndCacheTrackData.
     */
    function updateTrackElements(trackElements, data) {
        if (!data) return;
        trackElements.forEach(trackElement => {
            insertTrackRating(trackElement, data.rating, data.count, data.isBold);
            insertTrackInfo(trackElement, data.genre, data.rankings);
        });
    }

    async function processAllTracks(button) {
        const allButtons = Array.from(document.querySelectorAll('#load-ratings-btn'));
        const allTrackLiElements = Array.from(document.querySelectorAll('#tracks li.track, #tracks_mobile li.track'));

        const tracksMap = new Map();
        allTrackLiElements.forEach(el => {
            const songLink = el.querySelector('a.song');
            if (songLink) {
                const url = songLink.href;
                if (!tracksMap.has(url)) {
                    tracksMap.set(url, []);
                }
                tracksMap.get(url).push(el);
            }
        });

        const tracksToFetch = [];
        for (const [url, elements] of tracksMap.entries()) {
            const cacheKey = `rym_track_data_${url}`;
            if (trackDataCache[cacheKey]) {
                updateTrackElements(elements, trackDataCache[cacheKey]);
            } else {
                tracksToFetch.push({
                    url,
                    elements
                });
            }
        }

        if (tracksToFetch.length === 0) {
            log('All tracks were already in cache.');
            button.textContent = 'Unload Ratings';
            button.disabled = false;
            return;
        }

        log(`Found ${tracksToFetch.length} new tracks to process.`);
        let loadedCount = 0;
        const totalToFetch = tracksToFetch.length;

        allButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'wait';
            btn.textContent = `Loading... 0/${totalToFetch}`;
        });

        for (let i = 0; i < tracksToFetch.length; i += CHUNK_SIZE) {
            const chunk = tracksToFetch.slice(i, i + CHUNK_SIZE);
            log(`Processing chunk of ${chunk.length} tracks starting at index ${i}...`);

            const dataPromises = chunk.map(track => fetchAndCacheTrackData(track.url));
            const results = await Promise.all(dataPromises);

            results.forEach((data, index) => {
                if (data) {
                    const trackElementsToUpdate = chunk[index].elements;
                    updateTrackElements(trackElementsToUpdate, data);
                }
                loadedCount++;
            });

            allButtons.forEach(btn => {
                btn.textContent = `Loading... ${loadedCount}/${totalToFetch}`;
            });

            if (i + CHUNK_SIZE < tracksToFetch.length) {
                const requestDelay = GM_config.get('requestDelay');
                await new Promise(resolve => setTimeout(resolve, requestDelay));
            }
        }

        log('All tracks processed.');
    }

    // --- E. User-Facing Button Actions ---
    async function toggleTrackRatings(button) {
        const allButtons = Array.from(document.querySelectorAll('#load-ratings-btn'));
        const mainButton = button || allButtons[0];

        if (loadClickCount++ % 2 === 0) {
            log('Loading track ratings');
            allButtons.forEach(btn => {
                btn.disabled = true;
                btn.textContent = 'Loading...';
            });
            await processAllTracks(mainButton);
            allButtons.forEach(btn => {
                btn.textContent = 'Unload Ratings';
                btn.disabled = false;
                btn.style.cursor = 'pointer';
            });
        } else {
            log('Unloading track ratings');
            clearTrackRatings();
        }
    }

    function clearTrackRatings() {
        document.querySelectorAll('.page_release_section_tracks_track_stats_scores').forEach(el => el.parentElement.remove());
        document.querySelectorAll('.rym-userscript-info-container').forEach(el => el.remove());
        document.querySelectorAll('#load-ratings-btn').forEach(btn => {
            btn.textContent = 'Load Track Ratings';
            btn.disabled = false;
            btn.style.cursor = 'pointer';
        });
        log('Cleared track ratings and additional info');
    }

    function toggleGenreRankings() {
        genreRankingsVisible = !genreRankingsVisible;
        GM_setValue('genreRankingsVisible', genreRankingsVisible);
        document.querySelectorAll('.rym-userscript-info-container').forEach(container => {
            container.style.display = genreRankingsVisible ? 'block' : 'none';
        });
    }

    // --- F. Cache Management ---
    function clearPageCache() {
        log('Clearing cache for the current page.');
        const allTrackLiElements = Array.from(document.querySelectorAll('#tracks li.track, #tracks_mobile li.track'));
        let clearedCount = 0;

        allTrackLiElements.forEach(el => {
            const songLink = el.querySelector('a.song');
            if (songLink) {
                const cacheKey = `rym_track_data_${songLink.href}`;
                if (trackDataCache[cacheKey]) {
                    delete trackDataCache[cacheKey];
                    clearedCount++;
                }
            }
        });

        if (clearedCount > 0) {
            GM_setValue('trackDataCache', trackDataCache);
            alert(`Cleared ${clearedCount} cached track(s) for this page. Click "Load Track Ratings" to refresh.`);
            clearTrackRatings();
        } else {
            alert('No cached tracks found for this page.');
        }
    }

    function getCache() {
        const cacheDays = GM_config.get('cacheDays');
        const cacheExpiration = cacheDays * 24 * 60 * 60 * 1000;
        const cachedData = GM_getValue('trackDataCache', {});
        const now = Date.now();
        Object.keys(cachedData).forEach(key => {
            if (now - (cachedData[key]?.timestamp || 0) > cacheExpiration) {
                delete cachedData[key];
            }
        });
        return cachedData;
    }

    // --- G. SCRIPT INITIALIZATION ---
    insertButtons();
    injectCustomStyles(); // Call the function to apply custom styles
}

// --- III. SCRIPT EXECUTION TRIGGER ---
window.addEventListener('load', runScript, false);
