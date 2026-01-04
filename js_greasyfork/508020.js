// ==UserScript==
// @name         Trakt.tv Universal Search (Anime and Non-Anime) - Improved v2.2
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Enhanced version with better season/part matching, season subtitle support, and improved episode finding
// @author       konvar
// @match        https://trakt.tv/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      hianime.to
// @connect      1flix.to
// @downloadURL https://update.greasyfork.org/scripts/508020/Trakttv%20Universal%20Search%20%28Anime%20and%20Non-Anime%29%20-%20Improved%20v22.user.js
// @updateURL https://update.greasyfork.org/scripts/508020/Trakttv%20Universal%20Search%20%28Anime%20and%20Non-Anime%29%20-%20Improved%20v22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration Object
    const CONFIG = {
        DEBUG: true,
        DEBOUNCE_DELAY: 300,
        TOP_RESULTS: 10,
        SIMILARITY_THRESHOLD: 0.1,
        EPISODE_TITLE_SIMILARITY_THRESHOLD: 0.8,
        MAX_SEARCH_PAGES: 1,
        CACHE_EXPIRATION_MS: 3600000, // 1 hour
        HIANIME_BASE_URL: 'https://hianime.to',
        FLIX_BASE_URL: 'https://1flix.to'
    };

    // Logging function
    function log(message) {
        if (CONFIG.DEBUG) {
            console.log(`[Trakt.tv Universal Search] ${message}`);
        }
    }

    // Debounce helper
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Helper: parse HTML string into a document
    function parseHTML(htmlString) {
        return new DOMParser().parseFromString(htmlString, 'text/html');
    }

    // Optimized Levenshtein Distance implementation using a two-row approach
    function optimizedLevenshtein(a, b) {
        if (a === b) return 0;
        const alen = a.length;
        const blen = b.length;
        if (alen === 0) return blen;
        if (blen === 0) return alen;

        let prevRow = new Array(blen + 1);
        let currRow = new Array(blen + 1);

        for (let j = 0; j <= blen; j++) {
            prevRow[j] = j;
        }

        for (let i = 1; i <= alen; i++) {
            currRow[0] = i;
            for (let j = 1; j <= blen; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                currRow[j] = Math.min(
                    currRow[j - 1] + 1, // Insertion
                    prevRow[j] + 1, // Deletion
                    prevRow[j - 1] + cost // Substitution
                );
            }
            [prevRow, currRow] = [currRow, prevRow];
        }

        return prevRow[blen];
    }

    // Calculate similarity based on optimized Levenshtein distance
    function calculateSimilarity(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        const distance = optimizedLevenshtein(a, b);
        return 1 - distance / Math.max(a.length, b.length);
    }

    // Cache for similarity computations to avoid duplicate calculations
    const similarityCache = new Map();
    function getCachedSimilarity(a, b) {
        const key = `${a}:${b}`;
        if (similarityCache.has(key)) {
            return similarityCache.get(key);
        }
        const similarity = calculateSimilarity(a, b);
        similarityCache.set(key, similarity);
        return similarity;
    }

    // Cache with expiration mechanism for HTTP requests
    const requestCache = new Map();
    function cachedRequest(url) {
        const now = Date.now();
        if (requestCache.has(url)) {
            const cached = requestCache.get(url);
            if (now - cached.timestamp < CONFIG.CACHE_EXPIRATION_MS) {
                log(`Cache hit for ${url}`);
                return cached.promise;
            } else {
                log(`Cache expired for ${url}`);
                requestCache.delete(url);
            }
        }
        const promise = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response);
                    } else {
                        reject(new Error(`Failed to fetch content: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
        requestCache.set(url, { promise: promise, timestamp: now });
        return promise;
    }

    // Helper: extract movieId from URL using regex
    function extractMovieId(url) {
        // Expect URL format like "https://hianime.to/bleach-806?ref=search"
        let match = url.match(/-(\d+)(?:\?|$)/);
        if (match) {
            return match[1];
        }
        return null;
    }

    // Add custom CSS for the search button
    GM_addStyle(`
        .trakt-universal-search-button {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
        }
        .trakt-universal-search-button:hover {
            box-shadow: none;
        }
        .trakt-universal-search-button img {
            max-height: 30px;
            width: auto;
        }
    `);

    // Class to store content details extracted from the DOM
    class ContentInfo {
        constructor(title, year, isAnime, season, episode, episodeTitle, alternativeTitles, contentType, absoluteEpisode, seasonSubtitle) {
            this.title = title;
            this.year = year;
            this.isAnime = isAnime;
            this.season = season;
            this.episode = episode;
            this.episodeTitle = episodeTitle;
            this.alternativeTitles = alternativeTitles;
            this.contentType = contentType;
            this.absoluteEpisode = absoluteEpisode;
            this.seasonSubtitle = seasonSubtitle;
        }

        // Extract content info from the current Trakt.tv page
        static fromDOM() {
            log('Extracting content info from DOM...');
            let titleElement = null, yearElement = null, seasonSubtitle = null;
            
            // Check for mobile title with season subtitle
            const mobileTitleElement = document.querySelector('.mobile-title h2 a:not(#level-up-link)');
            const seasonSubtitleElement = document.querySelector('.mobile-title h2 a#level-up-link');
            
            if (mobileTitleElement) {
                titleElement = mobileTitleElement;
                yearElement = document.querySelector('.mobile-title h1 .year');
                if (seasonSubtitleElement) {
                    seasonSubtitle = seasonSubtitleElement.textContent.trim();
                }
            } else if (window.location.pathname.startsWith('/movies/')) {
                const movieTitleElement = document.querySelector('h1');
                if (movieTitleElement) {
                    titleElement = movieTitleElement.childNodes[0];
                    yearElement = movieTitleElement.querySelector('.year');
                }
            } else {
                titleElement = document.querySelector('h2 a[data-safe="true"]');
            }

            const episodeElement = document.querySelector('h1.episode .main-title-sxe');
            const episodeTitleElement = document.querySelector('h1.episode .main-title');
            const episodeAbsElement = document.querySelector('h1.episode .main-title-abs');

            const genreElements = document.querySelectorAll('span[itemprop="genre"]');
            const additionalStats = document.querySelector('ul.additional-stats');
            const alternativeTitleElement = document.querySelector('.additional-stats .meta-data[data-type="alternative_titles"]');

            if (titleElement) {
                const title = titleElement.textContent.trim().replace(/[:.,!?]+$/, '');
                const episodeInfo = episodeElement ? episodeElement.textContent.trim().split('x') : null;
                const season = episodeInfo ? parseInt(episodeInfo[0]) : null;
                const episode = episodeInfo ? parseInt(episodeInfo[1]) : null;
                const episodeTitle = episodeTitleElement ? episodeTitleElement.textContent.trim() : null;
                const absoluteEpisode = episodeAbsElement ? parseInt(episodeAbsElement.textContent.trim().replace(/[\(\)]/g, '')) : null;

                const genres = Array.from(genreElements).map(el => el.textContent.trim().toLowerCase());
                const isAnime = genres.includes('anime') ||
                                (additionalStats && additionalStats.textContent.toLowerCase().includes('anime')) ||
                                document.querySelector('.poster img[src*="anime"]') !== null;

                let year = null;
                if (yearElement && yearElement.textContent.trim() !== "") {
                    year = yearElement.textContent.trim();
                } else {
                    const metaFirstAired = document.querySelector('#meta-first-aired');
                    if (metaFirstAired) {
                        const date = new Date(metaFirstAired.value);
                        if (!isNaN(date)) {
                            year = date.getFullYear().toString();
                        }
                    } else if (additionalStats) {
                        const yearMatch = additionalStats.textContent.match(/(\d{4})/);
                        year = yearMatch ? yearMatch[1] : null;
                    }
                }

                const alternativeTitles = alternativeTitleElement
                    ? alternativeTitleElement.textContent.split(',').map(t => t.trim())
                    : [];

                const contentType = window.location.pathname.startsWith('/movies/') ? 'movie' : 'tv';

                log(`Title: ${title}`);
                log(`Year: ${year}`);
                log(`Is Anime: ${isAnime}`);
                log(`Season: ${season}`);
                log(`Season Subtitle: ${seasonSubtitle}`);
                log(`Episode: ${episode}`);
                log(`Episode Title: ${episodeTitle}`);
                log(`Alternative Titles: ${alternativeTitles}`);
                log(`Content Type: ${contentType}`);
                log(`Absolute Episode: ${absoluteEpisode}`);

                return new ContentInfo(title, year, isAnime, season, episode, episodeTitle, alternativeTitles, contentType, absoluteEpisode, seasonSubtitle);
            }
            log('Failed to extract content info.');
            return null;
        }
    }

    // Class to create and manage the search button
    class SearchButton {
        constructor(contentInfo) {
            this.contentInfo = contentInfo;
            this.button = this.createButton();
        }

        createButton() {
            log('Creating search button...');
            const button = document.createElement('button');
            button.className = 'btn btn-block btn-summary trakt-universal-search-button';
            button.style.display = 'none';
            const icon = document.createElement('img');
            icon.style.width = 'auto';
            icon.style.height = '50px';

            if (this.contentInfo.isAnime) {
                icon.src = `${CONFIG.HIANIME_BASE_URL}/images/logo.png`;
                icon.alt = 'Hianime Logo';
            } else {
                icon.src = 'https://img.1flix.to/xxrz/400x400/100/e4/ca/e4ca1fc10cda9cf762f7b51876dc917b/e4ca1fc10cda9cf762f7b51876dc917b.png';
                icon.alt = '1flix Logo';
            }
            button.appendChild(icon);
            return button;
        }

        addToDOM() {
            log('Adding search button to DOM...');
            const container = document.querySelector('.col-lg-4.col-md-5.action-buttons');
            if (container && !document.querySelector('.trakt-universal-search-button')) {
                container.insertBefore(this.button, container.firstChild);
                log('Search button added to DOM.');
                return true;
            }
            log('Failed to add search button to DOM.');
            return false;
        }

        updateWithContentLink(url) {
            log('Updating search button with content link...');
            this.button.addEventListener('click', () => window.open(url, '_blank'));
            this.button.style.display = 'flex';
            log('Search button updated and displayed.');
        }

        updateButtonText(text) {
            log('Updating search button text...');
            const textNode = document.createTextNode(` ${text}`);
            this.button.appendChild(textNode);
            log('Search button text updated.');
        }
    }

    // Class to search external sites for content and find the correct URL
    class ContentSearcher {
        constructor(contentInfo) {
            this.contentInfo = contentInfo;
        }

        generateSearchUrl() {
            log('Generating search URL...');
            if (this.contentInfo.isAnime) {
                // Include season subtitle in search if available
                let searchQuery = this.contentInfo.title;
                if (this.contentInfo.seasonSubtitle) {
                    searchQuery = `${this.contentInfo.title} ${this.contentInfo.seasonSubtitle}`;
                }
                
                return this.contentInfo.contentType === 'movie' ?
                    `${CONFIG.HIANIME_BASE_URL}/search?keyword=${encodeURIComponent(searchQuery)}&type=1` :
                    `${CONFIG.HIANIME_BASE_URL}/search?keyword=${encodeURIComponent(searchQuery)}&type=2`;
            } else {
                const searchTerm = this.contentInfo.contentType === 'movie' ?
                    `${this.contentInfo.title} ${this.contentInfo.year}` :
                    this.contentInfo.title;
                return `${CONFIG.FLIX_BASE_URL}/search/${searchTerm.replace(/\s+/g, '-')}`;
            }
        }

        async search() {
            log('Searching for content concurrently...');
            const searchUrl = this.generateSearchUrl();
            const pageRequests = [];
            for (let page = 1; page <= CONFIG.MAX_SEARCH_PAGES; page++) {
                const separator = this.contentInfo.isAnime ? '&' : '?';
                const pageUrl = `${searchUrl}${separator}page=${page}`;
                log(`Queuing search URL: ${pageUrl}`);
                pageRequests.push(cachedRequest(pageUrl));
            }
            let allMatches = [];
            try {
                const responses = await Promise.all(pageRequests);
                responses.forEach((response, index) => {
                    const doc = parseHTML(response.responseText);
                    const pageMatches = this.findTopMatches(doc);
                    log(`Matches on page ${index + 1}: ${JSON.stringify(pageMatches)}`);
                    allMatches = allMatches.concat(pageMatches);
                });
            } catch (error) {
                log(`Error during concurrent page requests: ${error}`);
            }
            log(`All matches: ${JSON.stringify(allMatches)}`);

            // Loop through top candidates and return the first valid content URL
            for (const match of allMatches.slice(0, CONFIG.TOP_RESULTS)) {
                try {
                    const contentUrl = await this.findContentUrl(match.url);
                    if (contentUrl) {
                        log(`Content found: ${contentUrl}`);
                        return contentUrl;
                    } else {
                        log(`No content URL found for candidate: ${match.url}`);
                    }
                } catch (error) {
                    log(`Error processing candidate ${match.url}: ${error}`);
                    continue;
                }
            }
            log(`Content not found in the top ${CONFIG.TOP_RESULTS} results`);
            this.showMessage(`Content not found. Click the button to search manually.`);
            return searchUrl;
        }

        findTopMatches(doc) {
            log('Finding top matches on search results page...');
            const contentItems = doc.querySelectorAll('.flw-item');
            log(`Found ${contentItems.length} items in search results`);
            
            // Build list of titles to check, including season subtitle combinations
            let searchTitles = [this.contentInfo.title, ...this.contentInfo.alternativeTitles];
            
            // If we have a season subtitle, add combinations
            if (this.contentInfo.seasonSubtitle) {
                searchTitles.push(`${this.contentInfo.title}: ${this.contentInfo.seasonSubtitle}`);
                searchTitles.push(`${this.contentInfo.title} ${this.contentInfo.seasonSubtitle}`);
                
                // Handle "Part 2" scenarios
                if (this.contentInfo.season && this.contentInfo.season > 1) {
                    searchTitles.push(`${this.contentInfo.title}: ${this.contentInfo.seasonSubtitle} Part 2`);
                    searchTitles.push(`${this.contentInfo.title} ${this.contentInfo.seasonSubtitle} Part 2`);
                }
            }
            
            const matches = Array.from(contentItems)
                .map(item => {
                    const titleElement = item.querySelector('.film-name a');
                    const posterElement = item.querySelector('.film-poster-img');
                    const infoElement = item.querySelector('.fd-infor');
                    if (titleElement && infoElement) {
                        const itemTitle = titleElement.textContent.trim();
                        const normalizedItemTitle = this.normalizeTitle(itemTitle);
                        
                        // Calculate best score across all search titles
                        const bestScore = Math.max(...searchTitles.map(title =>
                            getCachedSimilarity(this.normalizeTitle(title), normalizedItemTitle)
                        ));
                        
                        // Bonus for exact season/part matches
                        let seasonBonus = 0;
                        if (this.contentInfo.season) {
                            const seasonRegex = new RegExp(`(season|part)\\s*${this.contentInfo.season}`, 'i');
                            if (seasonRegex.test(itemTitle)) {
                                seasonBonus = 0.2;
                            }
                            
                            // Check for "Part 2" when we're in season 4
                            if (this.contentInfo.season === 4 && /part\s*2/i.test(itemTitle)) {
                                seasonBonus = 0.3;
                            }
                        }
                        
                        const href = titleElement.getAttribute('href');
                        const url = `${this.contentInfo.isAnime ? CONFIG.HIANIME_BASE_URL : CONFIG.FLIX_BASE_URL}${href}`;
                        let itemType, year, duration;
                        const itemTypeElement = infoElement.querySelector('.fdi-item');
                        const itemTypeText = itemTypeElement ? itemTypeElement.textContent.trim().toLowerCase() : '';
                        const seasonMatch = itemTypeText.match(/^ss (\d+)$/);
                        if (seasonMatch) {
                            itemType = 'tv';
                        } else {
                            const yearRegex = /^\d{4}$/;
                            if (yearRegex.test(itemTypeText)) {
                                year = itemTypeText;
                                itemType = 'movie';
                            } else {
                                itemType = itemTypeText;
                                year = null;
                            }
                        }
                        const durationElement = infoElement.querySelector('.fdi-duration');
                        duration = durationElement ? durationElement.textContent.trim() : null;
                        const posterUrl = posterElement ? posterElement.getAttribute('data-src') : null;
                        
                        const finalScore = Math.min(bestScore + seasonBonus, 1.0);
                        
                        log(`Item: "${itemTitle}", Score: ${bestScore}, Season Bonus: ${seasonBonus}, Final Score: ${finalScore}, Type: ${itemType}, Year: ${year}, Duration: ${duration}`);
                        
                        const isCorrectType = (
                            (this.contentInfo.contentType === 'movie' && itemType === 'movie') ||
                            (this.contentInfo.contentType === 'tv' && itemType === 'tv')
                        );
                        return {
                            title: itemTitle,
                            score: finalScore,
                            url: url,
                            type: itemType,
                            year: year,
                            duration: duration,
                            posterUrl: posterUrl,
                            isCorrectType: isCorrectType
                        };
                    }
                    return null;
                })
                .filter(match => match !== null && match.score >= CONFIG.SIMILARITY_THRESHOLD && match.isCorrectType)
                .sort((a, b) => b.score - a.score);
            log(`Filtered matches: ${JSON.stringify(matches)}`);
            return matches;
        }

        async findContentUrl(contentUrl) {
            log(`Fetching content from URL: ${contentUrl}`);
            try {
                const response = await cachedRequest(contentUrl);
                const doc = parseHTML(response.responseText);
                if (this.contentInfo.isAnime) {
                    if (this.contentInfo.contentType === 'movie') {
                        return await this.findAnimeMovieContentUrl(doc);
                    } else {
                        return await this.findAnimeSeriesContentUrl(doc, contentUrl);
                    }
                } else {
                    return await this.findNonAnimeContentUrl(doc, contentUrl);
                }
            } catch (error) {
                log(`Error fetching content: ${error}`);
                throw error;
            }
        }

        // Handle Anime Movie
        async findAnimeMovieContentUrl(doc) {
            log('Processing Anime Movie content...');
            const syncDataScript = doc.querySelector('#syncData');
            if (syncDataScript) {
                try {
                    const syncData = JSON.parse(syncDataScript.textContent);
                    if (syncData && syncData.series_url) {
                        const seriesUrl = syncData.series_url;
                        const movieId = seriesUrl.split('-').pop();
                        const watchUrl = `${CONFIG.HIANIME_BASE_URL}/watch/${seriesUrl.slice(seriesUrl.lastIndexOf('/') + 1)}?ep=${movieId}`;
                        log(`Match found: ${watchUrl}`);
                        return watchUrl;
                    } else {
                        log('Series URL not found in syncData');
                    }
                } catch (e) {
                    log("Error parsing syncData JSON: " + e);
                }
            } else {
                log('syncData script not found on the movie page');
            }
            return null;
        }

        // Handle Anime Series (TV) - Enhanced episode finding
        async findAnimeSeriesContentUrl(doc, contentUrl) {
            log('Processing Anime Series content...');
            const movieId = extractMovieId(contentUrl);
            if (!movieId) {
                log("Could not extract movieId from contentUrl");
                return null;
            }
            const apiUrl = `${CONFIG.HIANIME_BASE_URL}/ajax/v2/episode/list/${movieId}`;
            log(`Fetching episode data from API: ${apiUrl}`);
            try {
                const episodeDataResponse = await cachedRequest(apiUrl);
                const episodeData = JSON.parse(episodeDataResponse.responseText);
                log('Episode data fetched:');
                log(`Total episodes: ${episodeData ? episodeData.totalItems : 'unknown'}`);
                if (episodeData && episodeData.status && episodeData.html) {
                    const episodeDoc = parseHTML(episodeData.html);
                    const episodeLinks = episodeDoc.querySelectorAll('.ssl-item.ep-item');
                    log(`Number of episode links found: ${episodeLinks.length}`);
                    
                    const normalizedSearchTitle = this.normalizeTitle(this.contentInfo.episodeTitle || '');
                    let bestMatch = null;
                    let bestMatchScore = 0;
                    let targetEpisodeNumber = null;
                    
                    // For series with multiple parts/seasons, calculate the actual episode number
                    if (contentUrl.includes('part-2') || contentUrl.includes('2nd-season')) {
                        // This might be a continuation, try to find the actual episode
                        targetEpisodeNumber = this.contentInfo.episode;
                    } else {
                        targetEpisodeNumber = this.contentInfo.episode;
                    }
                    
                    // First pass: look for exact episode number match
                    for (let link of episodeLinks) {
                        const episodeNumber = parseInt(link.getAttribute('data-number'));
                        const episodeTitle = link.querySelector('.ep-name')?.textContent.trim() || '';
                        log(`Episode ${episodeNumber}: "${episodeTitle}"`);
                        
                        if (episodeNumber === targetEpisodeNumber) {
                            // Found exact episode number match
                            const titleMatchScore = getCachedSimilarity(normalizedSearchTitle, this.normalizeTitle(episodeTitle));
                            log(`Episode ${episodeNumber} matches target episode number. Title match score: ${titleMatchScore}`);
                            
                            // If we have an episode title, check similarity
                            if (this.contentInfo.episodeTitle) {
                                if (titleMatchScore >= 0.3) {
                                    log(`Found matching episode by number and title`);
                                    return `${CONFIG.HIANIME_BASE_URL}${link.getAttribute('href')}`;
                                }
                            } else {
                                // No episode title to match, just use episode number
                                log(`Found matching episode by number only`);
                                return `${CONFIG.HIANIME_BASE_URL}${link.getAttribute('href')}`;
                            }
                        }
                        
                        // Track best title match regardless of episode number
                        const titleMatchScore = getCachedSimilarity(normalizedSearchTitle, this.normalizeTitle(episodeTitle));
                        if (titleMatchScore > bestMatchScore) {
                            bestMatch = link;
                            bestMatchScore = titleMatchScore;
                        }
                    }
                    
                    // Second pass: if we have a strong title match, use it
                    if (bestMatch && bestMatchScore >= CONFIG.EPISODE_TITLE_SIMILARITY_THRESHOLD) {
                        log(`Using best title match with score ${bestMatchScore}`);
                        return `${CONFIG.HIANIME_BASE_URL}${bestMatch.getAttribute('href')}`;
                    }
                    
                    // Third pass: For Part 2 series, try adjusted episode numbering
                    if (contentUrl.includes('part-2') && this.contentInfo.episode) {
                        // In Part 2, episode 14 might be episode 1
                        const adjustedEpisode = this.contentInfo.episode - 13; // Assuming Part 1 had 13 episodes
                        log(`Trying adjusted episode number for Part 2: ${adjustedEpisode}`);
                        
                        for (let link of episodeLinks) {
                            const episodeNumber = parseInt(link.getAttribute('data-number'));
                            if (episodeNumber === adjustedEpisode) {
                                log(`Found episode using adjusted numbering`);
                                return `${CONFIG.HIANIME_BASE_URL}${link.getAttribute('href')}`;
                            }
                        }
                    }
                    
                    log('No matching episode found with current criteria');
                } else {
                    log('Failed to fetch episode data from API');
                }
            } catch (error) {
                log(`Error processing anime series: ${error}`);
            }
            return null;
        }

        // Handle Non-Anime content
        async findNonAnimeContentUrl(doc, originalUrl) {
            log('Processing Non-Anime content...');
            const detailPageWatch = doc.querySelector('.detail_page-watch');
            if (!detailPageWatch) {
                log('Detail page watch element not found');
                return null;
            }
            const movieId = detailPageWatch.getAttribute('data-id');
            const movieType = detailPageWatch.getAttribute('data-type');
            if (!movieId || !movieType) {
                log('Movie ID or type not found');
                return null;
            }
            log(`Movie ID: ${movieId}, Movie Type: ${movieType}`);
            if (this.contentInfo.contentType === 'movie') {
                return await this.findNonAnimeMovieContentUrl(movieId, originalUrl);
            } else {
                return await this.findNonAnimeTvContentUrl(movieId, originalUrl);
            }
        }

        // Non-Anime Movie
        async findNonAnimeMovieContentUrl(movieId, contentUrl) {
            log('Processing Non-Anime Movie content...');
            const episodeListUrl = `${CONFIG.FLIX_BASE_URL}/ajax/episode/list/${movieId}`;
            log(`Fetching episode list from: ${episodeListUrl}`);
            try {
                const episodeListResponse = await cachedRequest(episodeListUrl);
                const episodeListContent = episodeListResponse.responseText;
                log('Episode list content fetched.');
                const episodeListDoc = parseHTML(episodeListContent);
                const serverItem = episodeListDoc.querySelector('.link-item');
                if (serverItem) {
                    const serverId = serverItem.getAttribute('data-linkid');
                    const watchUrl = contentUrl.replace(/\/movie\//, '/watch-movie/') + `.${serverId}`;
                    log(`Match found: ${watchUrl}`);
                    return watchUrl;
                } else {
                    log('No server found for this movie');
                }
            } catch (error) {
                log(`Error processing Non-Anime Movie: ${error}`);
            }
            return null;
        }

        // Non-Anime TV
        async findNonAnimeTvContentUrl(movieId, contentUrl) {
            log('Processing Non-Anime TV content...');
            const seasonListUrl = `${CONFIG.FLIX_BASE_URL}/ajax/season/list/${movieId}`;
            log(`Fetching season list from: ${seasonListUrl}`);
            try {
                const seasonListResponse = await cachedRequest(seasonListUrl);
                const seasonListContent = seasonListResponse.responseText;
                log('Season list content fetched.');
                const seasonListDoc = parseHTML(seasonListContent);
                const seasonItems = seasonListDoc.querySelectorAll('.ss-item');
                for (let seasonItem of seasonItems) {
                    const seasonNumberText = seasonItem.textContent.trim();
                    const seasonNumber = parseInt(seasonNumberText.split(' ')[1]);
                    const seasonId = seasonItem.getAttribute('data-id');
                    log(`Checking Season ${seasonNumber}`);
                    if (seasonNumber === this.contentInfo.season) {
                        const episodeListUrl = `${CONFIG.FLIX_BASE_URL}/ajax/season/episodes/${seasonId}`;
                        log(`Fetching episode list from: ${episodeListUrl}`);
                        const episodeListResponse = await cachedRequest(episodeListUrl);
                        const episodeListContent = episodeListResponse.responseText;
                        log('Episode list content fetched.');
                        const episodeListDoc = parseHTML(episodeListContent);
                        const episodeItems = episodeListDoc.querySelectorAll('.eps-item');
                        for (let episodeItem of episodeItems) {
                            const titleAttr = episodeItem.getAttribute('title');
                            if (!titleAttr) continue;
                            const parts = titleAttr.split(':');
                            if (parts.length < 2) continue;
                            const episodeNumber = parseInt(parts[0].replace('Eps', '').trim());
                            const episodeTitle = parts[1].trim();
                            log(`Checking Season ${seasonNumber}, Episode ${episodeNumber}: "${episodeTitle}"`);
                            if (episodeNumber === this.contentInfo.episode) {
                                const episodeId = episodeItem.getAttribute('data-id');
                                const serverListUrl = `${CONFIG.FLIX_BASE_URL}/ajax/episode/servers/${episodeId}`;
                                log(`Fetching server list from: ${serverListUrl}`);
                                const serverListResponse = await cachedRequest(serverListUrl);
                                const serverListContent = serverListResponse.responseText;
                                log('Server list content fetched.');
                                const serverListDoc = parseHTML(serverListContent);
                                const serverItem = serverListDoc.querySelector('.link-item');
                                if (serverItem) {
                                    const serverId = serverItem.getAttribute('data-id');
                                    const watchUrl = contentUrl.replace(/\/tv\//, '/watch-tv/') + `.${serverId}`;
                                    log(`Match found: ${watchUrl}`);
                                    return watchUrl;
                                } else {
                                    log('No server found for this episode');
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                log(`Error processing Non-Anime TV: ${error}`);
            }
            log('No matching episode found');
            return null;
        }

        normalizeTitle(title) {
            return title.toLowerCase()
                .replace(/[:.,!?'`]+/g, '')
                .replace(/\s+/g, ' ')
                .replace(/[^\w\s]/g, '')
                .trim();
        }

        showMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = message;
            messageDiv.style.cssText = "position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background-color: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; z-index: 9999;";
            document.body.appendChild(messageDiv);
            setTimeout(() => messageDiv.remove(), 5000);
        }
    }

    // Class to manage initialization on Trakt.tv pages
    class TraktTvHandler {
        constructor() {
            this.isInitialized = false;
            this.observer = null;
        }

        async init() {
            log('Initializing script...');
            if (this.isInitialized) {
                log("Script already initialized, skipping...");
                return;
            }
            const contentInfo = ContentInfo.fromDOM();
            if (contentInfo) {
                const searchButton = new SearchButton(contentInfo);
                if (searchButton.addToDOM()) {
                    this.isInitialized = true;
                    log("Script initialization complete.");
                    const contentSearcher = new ContentSearcher(contentInfo);
                    const result = await contentSearcher.search();
                    if (result) {
                        searchButton.updateWithContentLink(result);
                        if (result === contentSearcher.generateSearchUrl()) {
                            searchButton.updateButtonText("Search Manually");
                        }
                    }
                    if (this.observer) {
                        this.observer.disconnect();
                        log('DOM observer disconnected.');
                    }
                } else {
                    log("Failed to add search button to DOM. Retrying in 1 second...");
                    setTimeout(() => this.init(), 1000);
                }
            } else {
                log("Content info not found. Retrying in 1 second...");
                setTimeout(() => this.init(), 1000);
            }
        }

        setupObserver() {
            log('Setting up DOM observer...');
            const debouncedInit = debounce(() => {
                log("DOM mutation detected, attempting to initialize...");
                this.init();
            }, CONFIG.DEBOUNCE_DELAY);
            this.observer = new MutationObserver(() => {
                if (!this.isInitialized) {
                    debouncedInit();
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
            log('DOM observer set up.');
        }
    }

    // Initialize only on Trakt.tv show or movie pages
    if (window.location.hostname === 'trakt.tv') {
        if (window.location.pathname.startsWith('/shows/') || window.location.pathname.startsWith('/movies/')) {
            log('Running on a Trakt.tv show or movie page.');
            setTimeout(() => {
                const traktHandler = new TraktTvHandler();
                traktHandler.init();
                traktHandler.setupObserver();
                log("Script setup complete on Trakt.tv");
            }, 1000);
        } else {
            log("Not on a show or movie page, script not initialized.");
        }
    }
})();