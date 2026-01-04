// ==UserScript==
// @name         Pitchfork Reddit Comments
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Load and display Reddit comments from r/indieheads and r/popheads on Pitchfork album review pages.
// @author       TA
// @license      MIT
// @match        https://pitchfork.com/reviews/albums/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/534038/Pitchfork%20Reddit%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/534038/Pitchfork%20Reddit%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug flag - set to true to enable console logging
    const DEBUG = false;

    // --- Utility Functions (developed in previous steps) ---

    /**
     * Extracts the Album Name from the Pitchfork page.
     * @returns {string|null} The album name or null if not found.
     */
    function extractAlbumName() {
        let albumElement = document.querySelector('h1[data-testid="ContentHeaderHed"]');
        if (DEBUG) console.log(`Album element found: ${albumElement ? 'YES' : 'NO'}`);
        
        // Fallback selector if the main one doesn't work
        if (!albumElement) {
            albumElement = document.querySelector('h1[class*="SplitScreenContentHeaderHed"]');
            if (DEBUG) console.log(`Fallback album element found: ${albumElement ? 'YES' : 'NO'}`);
        }
        
        // Another fallback - any h1 with MultiReviewContentHeaderHed class (for multi-album reviews)
        if (!albumElement) {
            albumElement = document.querySelector('h1[class*="MultiReviewContentHeaderHed"]');
            if (DEBUG) console.log(`Multi-review album element found: ${albumElement ? 'YES' : 'NO'}`);
        }
        
        // Another fallback - any h1 with em tag
        if (!albumElement) {
            albumElement = document.querySelector('h1 em');
            if (albumElement) {
                albumElement = albumElement.closest('h1');
                if (DEBUG) console.log(`Second fallback album element found: ${albumElement ? 'YES' : 'NO'}`);
            }
        }
        
        if (!albumElement) {
            return null;
        }
        
        if (DEBUG) console.log(`Album element HTML: ${albumElement.innerHTML}`);
        
        // Check if album name is wrapped in <em> tags (common for album titles)
        const emElement = albumElement.querySelector('em');
        if (emElement) {
            const albumName = emElement.textContent.trim();
            if (DEBUG) console.log(`Album name from <em> tag: "${albumName}"`);
            return albumName;
        }
        
        // For multi-album reviews, get the first span's text (before the slash separator)
        const firstSpan = albumElement.querySelector('span:first-child');
        if (firstSpan) {
            // Clone the span to avoid modifying the DOM
            const clonedSpan = firstSpan.cloneNode(true);
            // Remove any nested spans (like the slash separator)
            const nestedSpans = clonedSpan.querySelectorAll('span');
            nestedSpans.forEach(span => span.remove());
            const albumName = clonedSpan.textContent.trim();
            if (albumName && DEBUG) console.log(`Album name from first span: "${albumName}"`);
            if (albumName) return albumName;
        }
        
        // Fallback to regular text content if no <em> tag or span found
        const albumName = albumElement.textContent.trim();
        if (DEBUG) console.log(`Album name from textContent: "${albumName}"`);
        return albumName;
    }

    /**
     * Extracts the Artist Name(s) from the Pitchfork page.
     * @returns {string|string[]|null} The artist name(s) or null if not found.
     */
    function extractArtistName() {
        // Try multiple selector approaches to handle different class name patterns
        let artistElements = document.querySelectorAll('ul[class*="SplitScreenContentHeaderArtistWrapper"] div[class*="SplitScreenContentHeaderArtist"]');
        
        // Fallback selector if the first one doesn't work
        if (!artistElements.length) {
            artistElements = document.querySelectorAll('ul[class*="ArtistWrapper"] div[class*="Artist"]');
        }
        
        // Another fallback - look for any div inside ul that contains artist link
        if (!artistElements.length) {
            artistElements = document.querySelectorAll('ul a[href*="/artists/"] div');
        }
        
        // For multi-album reviews, look for div immediately after h1 with MultiReviewContentHeaderHed
        if (!artistElements.length) {
            const multiReviewH1 = document.querySelector('h1[class*="MultiReviewContentHeaderHed"]');
            if (multiReviewH1) {
                // Get the next sibling div which should contain the artist
                const artistDiv = multiReviewH1.nextElementSibling;
                if (artistDiv && artistDiv.tagName === 'DIV') {
                    const artistLink = artistDiv.querySelector('a[href*="/artists/"]');
                    if (artistLink) {
                        artistElements = [artistLink];
                        if (DEBUG) console.log(`Found artist in multi-review div after h1`);
                    }
                }
            }
        }
        
        if (DEBUG) console.log(`Artist elements found: ${artistElements.length}`);
        if (!artistElements.length) {
            return null;
        }
        const artists = Array.from(artistElements).map(el => {
            const artistName = el.textContent.trim();
            if (DEBUG) console.log(`Found artist element: "${artistName}"`);
            return artistName;
        });
        if (DEBUG) console.log(`All artists found: ${JSON.stringify(artists)}`);
        // Return a single string if only one artist, array if multiple
        const result = artists.length === 1 ? artists[0] : artists;
        if (DEBUG) console.log(`Final artist result: ${JSON.stringify(result)}`);
        return result;
    }

    /**
     * Formats artist and album names into Reddit search query strings.
     * Returns separate queries for FRESH ALBUM and ALBUM DISCUSSION threads.
     *
     * @param {string|string[]} artistName The name of the artist(s).
     * @param {string} albumName The name of the album.
     * @returns {Object} Object with freshAlbumQuery and albumDiscussionQuery properties.
     */
    function formatAlbumSearchQueries(artistName, albumName) {
        // If artistName is an array, join with ' & ' for the query
        const formattedArtist = Array.isArray(artistName) ? artistName.join(' & ') : artistName;

        // Create simpler queries that are more likely to match
        // Remove quotes and brackets which can cause search issues
        const freshAlbumQuery = `FRESH ALBUM ${formattedArtist} ${albumName}`;
        const albumDiscussionQuery = `ALBUM DISCUSSION ${formattedArtist} ${albumName}`;

        // Return both queries separately
        return {
            freshAlbumQuery,
            albumDiscussionQuery
        };
    }

    /**
     * Constructs a Reddit search URL for a subreddit's JSON API endpoint.
     * Cleans the query by removing problematic characters like slashes and ampersands.
     *
     * @param {string} subreddit The subreddit name (without "r/").
     * @param {string} query The search query string.
     * @returns {string} The constructed Reddit search JSON API URL.
     */
    function buildSubredditSearchJsonUrl(subreddit, query) {
        // Clean the query by removing slashes, ampersands, percent signs, and plus signs with spaces
        // that might interfere with the search functionality
        const cleanedQuery = query
            .replace(/[\/&%+]/g, ' ') // Replace slashes, ampersands, percent signs, and plus signs with spaces
            .replace(/\s+/g, ' ')     // Replace multiple spaces with a single space
            .trim();                  // Remove leading/trailing spaces
    
        const encodedQuery = encodeURIComponent(cleanedQuery);
        const searchUrl = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodedQuery}&restrict_sr=on&sort=relevance&t=all`;
        return searchUrl;
    }

    /**
     * Extracts a human-readable flair text from a Reddit post's link_flair_richtext (used by r/popheads).
     *
     * @param {Object} postData The Reddit post data object (item.data).
     * @returns {string|null} The flair text (e.g., "[FRESH]") or null if none found.
     */
    function getPopheadsFlairText(postData) {
        if (!postData || !Array.isArray(postData.link_flair_richtext)) {
            return null;
        }
    
        // Concatenate all text fragments, but in practice there's usually just one
        const texts = postData.link_flair_richtext
            .filter(part => part && part.e === 'text' && typeof part.t === 'string')
            .map(part => part.t.trim())
            .filter(Boolean);
    
        if (!texts.length) {
            return null;
        }
    
        // Join with space in case there are multiple parts; keep original casing/brackets
        return texts.join(' ');
    }
    
    /**
     * Identifies relevant Reddit thread URLs from search results based on title patterns and flairs.
     * Processes FRESH ALBUM and ALBUM DISCUSSION (or DISCUSSION) results separately.
     * Ensures no duplicate threads are added.
     *
     * @param {Array<Object>} freshAlbumResults The results from the FRESH ALBUM search.
     * @param {Array<Object>} albumDiscussionResults The results from the ALBUM DISCUSSION search.
     * @param {string|string[]} artist The name of the artist(s).
     * @param {string} albumName The name of the album.
     * @param {string} subreddit The subreddit name (e.g., "indieheads", "popheads").
     * @returns {Array<Object>} An array of objects
     *   {title: string, url: string, subreddit: string, flairText?: string, threadType?: string}
     *   for all matching threads.
     */
    function identifyRelevantThreads(freshAlbumResults, albumDiscussionResults, artist, albumName, subreddit) {
        const relevantThreads = [];
        // Track URLs to avoid duplicates
        const addedUrls = new Set();
        
        // Normalize artist name for comparison (handle both string and array)
        const normalizedArtist = Array.isArray(artist) ? artist.join(' & ') : artist;
        const isSelfTitled = normalizedArtist.toLowerCase() === albumName.toLowerCase();
        
        // Fuzzy matching function for artist names to handle spelling variations
        function fuzzyMatchArtist(title, artistName) {
            // Exact match
            if (title.includes(artistName)) {
                return true;
            }
            
            // Handle common variations and spelling differences
            const artistLower = artistName.toLowerCase();
            const titleLower = title.toLowerCase();
            
            // Remove common suffixes/prefixes for comparison
            const cleanArtist = artistLower.replace(/^(the |a |an )/i, '');
            const cleanTitle = titleLower.replace(/^(the |a |an )/i, '');
            
            // Check if artist name is contained within title or vice versa
            if (cleanTitle.includes(cleanArtist) || cleanArtist.includes(cleanTitle)) {
                return true;
            }
            
            // Enhanced fuzzy matching with multiple strategies
            
            // Strategy 1: Handle character substitutions and common misspellings
            const substitutions = {
                'c': ['ch', 'k'],
                'k': ['c', 'ch'],
                's': ['z', 'x'],
                'z': ['s'],
                'x': ['s', 'z']
            };
            
            // Try character substitutions
            for (const [char, replacements] of Object.entries(substitutions)) {
                for (const replacement of replacements) {
                    const substitutedArtist = artistLower.replace(new RegExp(char, 'g'), replacement);
                    if (cleanTitle.includes(substitutedArtist)) {
                        if (DEBUG) console.log(`Fuzzy matched "${artistName}" to "${substitutedArtist}" in title: "${title}"`);
                        return true;
                    }
                }
            }
            
            // Strategy 2: Handle missing letters (e.g., "Daghters" → "Daughters")
            function matchWithMissingLetters(text, pattern) {
                // Split both into words for word-by-word comparison
                const textWords = text.split(/\s+/);
                const patternWords = pattern.split(/\s+/);
                
                // If different number of words, try matching the whole strings
                if (textWords.length !== patternWords.length) {
                    return matchSingleWordMissingLetters(text, pattern);
                }
                
                // Match each word pair
                for (let i = 0; i < textWords.length; i++) {
                    if (!matchSingleWordMissingLetters(textWords[i], patternWords[i])) {
                        return false;
                    }
                }
                return true;
            }
            
            function matchSingleWordMissingLetters(text, pattern) {
                // Allow up to 2 missing letters per word
                const maxMissing = Math.min(2, Math.floor(pattern.length * 0.3));
                
                let textIndex = 0;
                let patternIndex = 0;
                let missingCount = 0;
                
                while (textIndex < text.length && patternIndex < pattern.length) {
                    if (text[textIndex] === pattern[patternIndex]) {
                        textIndex++;
                        patternIndex++;
                    } else {
                        // Try skipping a character in the pattern (missing letter)
                        if (missingCount < maxMissing && patternIndex + 1 < pattern.length &&
                            text[textIndex] === pattern[patternIndex + 1]) {
                            patternIndex += 2; // Skip the missing letter in pattern
                            textIndex++;
                            missingCount++;
                        } else {
                            return false;
                        }
                    }
                }
                
                // Check if we've matched most of both strings
                const remainingPattern = pattern.length - patternIndex;
                return remainingPattern <= maxMissing && textIndex === text.length;
            }
            
            // Strategy 3: Handle double letter variations (e.g., "begining" → "beginning")
            function matchWithDoubleLetters(text, pattern) {
                // Split both into words for word-by-word comparison
                const textWords = text.split(/\s+/);
                const patternWords = pattern.split(/\s+/);
                
                // If different number of words, try matching the whole strings
                if (textWords.length !== patternWords.length) {
                    return matchSingleWordDoubleLetters(text, pattern);
                }
                
                // Match each word pair
                for (let i = 0; i < textWords.length; i++) {
                    if (!matchSingleWordDoubleLetters(textWords[i], patternWords[i])) {
                        return false;
                    }
                }
                return true;
            }
            
            function matchSingleWordDoubleLetters(text, pattern) {
                // Normalize double letters: convert consecutive identical letters to single
                function normalizeDoubleLetters(str) {
                    return str.replace(/(.)\1+/g, '$1');
                }
                
                const normalizedText = normalizeDoubleLetters(text);
                const normalizedPattern = normalizeDoubleLetters(pattern);
                
                // Check if normalized versions match
                if (normalizedText === normalizedPattern) {
                    return true;
                }
                
                // Also try with one version having double letters and other single
                // This handles cases like "begining" vs "beginning"
                const textWithPotentialDoubles = text.replace(/([bcdfghjklmnpqrstvwxyz])/g, '$1$1');
                const patternWithPotentialDoubles = pattern.replace(/([bcdfghjklmnpqrstvwxyz])/g, '$1$1');
                
                return normalizedText === normalizeDoubleLetters(patternWithPotentialDoubles) || normalizeDoubleLetters(textWithPotentialDoubles) === normalizedPattern;
            }
            
            // Apply enhanced fuzzy matching strategies
            // Check if title contains artist with missing letters
            if (matchWithMissingLetters(cleanTitle, cleanArtist)) {
                if (DEBUG) console.log(`Fuzzy matched "${artistName}" with missing letters in title: "${title}"`);
                return true;
            }
            
            // Check if title contains artist with double letter variations
            if (matchWithDoubleLetters(cleanTitle, cleanArtist)) {
                if (DEBUG) console.log(`Fuzzy matched "${artistName}" with double letter variations in title: "${title}"`);
                return true;
            }
            
            // Try the reverse: check if artist contains title variations
            if (matchWithMissingLetters(cleanArtist, cleanTitle)) {
                if (DEBUG) console.log(`Fuzzy matched "${artistName}" (reverse missing letters) in title: "${title}"`);
                return true;
            }
            
            if (matchWithDoubleLetters(cleanArtist, cleanTitle)) {
                if (DEBUG) console.log(`Fuzzy matched "${artistName}" (reverse double letters) in title: "${title}"`);
                return true;
            }
            
            return false;
        }
        
        // Helper function to check whether a flair matches a given logical type
        function flairMatchesType(flairText, logicalType) {
            if (!flairText) return false;
            const ft = flairText.toLowerCase();

            if (logicalType === 'FRESH ALBUM') {
                // Treat [FRESH] and [FRESH ALBUM] as fresh-type
                return ft.includes('[fresh]') || ft.includes('[fresh album]');
            }
            if (logicalType === 'ALBUM DISCUSSION') {
                // r/popheads tends to use [DISCUSSION]
                return ft.includes('[discussion]') || ft.includes('[album discussion]');
            }
            return false;
        }

        // Helper function to find the best thread from search results
        const findBestThread = (results, threadType) => {
            if (!results || !Array.isArray(results) || results.length === 0) {
                if (DEBUG) console.log(`No ${threadType} search results found.`);
                return null;
            }

            if (DEBUG) console.log(`Processing ${results.length} ${threadType} search results.`);
            
            // Debug: Log all thread titles for this search type
            if (DEBUG) {
                console.log(`All ${threadType} search results:`);
                results.forEach((item, index) => {
                    if (item.kind === "t3" && item.data && item.data.title) {
                        console.log(`  ${index + 1}. "${item.data.title}"`);
                    }
                });
            }

            // Look for an exact match first
            for (const item of results) {
                if (item.kind === "t3" && item.data && item.data.title && item.data.permalink) {
                    const title = item.data.title;
                    const url = "https://www.reddit.com" + item.data.permalink;

                    // Skip if we've already added this URL
                    if (addedUrls.has(url)) {
                        if (DEBUG) console.log(`Skipping duplicate thread: "${title}"`);
                        continue;
                    }

                    const titleLower = title.toLowerCase();
                    const threadTypeLower = threadType.toLowerCase();
                    const albumNameLower = albumName.toLowerCase();
                    const artistLower = normalizedArtist.toLowerCase();

                    // Determine flair (used for r/popheads)
                    const flairText = subreddit === 'popheads' ? getPopheadsFlairText(item.data) : null;

                    // Check if this is the right type of thread
                    let isCorrectThreadType = false;

                    if (subreddit === 'popheads') {
                        // For popheads, rely primarily on flair
                        isCorrectThreadType = flairMatchesType(flairText, threadType);
                    } else {
                        // For indieheads (and others), rely on title content
                        // Accept both FRESH ALBUM and ALBUM DISCUSSION types since Reddit search
                        // sometimes returns both types in a single search query
                        const relevantTypes = ['FRESH ALBUM', 'ALBUM DISCUSSION', 'DISCUSSION'];
                        isCorrectThreadType = relevantTypes.some(type => {
                            const typeLower = type.toLowerCase();
                            return titleLower.includes(typeLower) ||
                                   titleLower.includes(typeLower.replace(' ', '')) ||
                                   titleLower.includes(`[${typeLower}]`) ||
                                   titleLower.includes(`${typeLower}]`);
                        });
                    }
                    
                    if (isCorrectThreadType) {
                        // For self-titled albums, ensure we're not matching just the artist name
                        if (isSelfTitled) {
                            // Look for patterns that indicate this is about the album, not just the artist
                            const albumIndicators = ['album', 'record', 'lp', 'release', 'debut', 'sophomore', 'self-titled'];
                            const hasAlbumIndicator = albumIndicators.some(indicator => titleLower.includes(indicator));
                            
                            if (titleLower.includes(albumNameLower) &&
                                (hasAlbumIndicator || titleLower.includes(`${artistLower} - ${albumNameLower}`))) {
                                if (DEBUG) console.log(`Found ${threadType} thread (self-titled album): "${title}" in r/${subreddit}`);
                                return { title, url, subreddit, flairText, threadType };
                            }
                        } else {
                            // For non-self-titled albums, require BOTH artist and album name to be present
                            // Use fuzzy matching for artist name to handle spelling variations
                            const artistMatches = fuzzyMatchArtist(titleLower, artistLower);
                            if (titleLower.includes(albumNameLower) && artistMatches) {
                                if (DEBUG) console.log(`Found ${threadType} thread: "${title}" in r/${subreddit}`);
                                return { title, url, subreddit, flairText, threadType };
                            }
                        }
                    }
                }
            }

            // If no exact match, take the first result that contains both album and artist
            for (const item of results) {
                if (item.kind === "t3" && item.data && item.data.title && item.data.permalink) {
                    const title = item.data.title;
                    const url = "https://www.reddit.com" + item.data.permalink;

                    // Skip if we've already added this URL
                    if (addedUrls.has(url)) {
                        if (DEBUG) console.log(`Skipping duplicate thread: "${title}"`);
                        continue;
                    }

                    const titleLower = title.toLowerCase();
                    const albumNameLower = albumName.toLowerCase();
                    const artistLower = normalizedArtist.toLowerCase();
                    const flairText = subreddit === 'popheads' ? getPopheadsFlairText(item.data) : null;

                    // For popheads, still require the flair to roughly match the logical type
                    const flairOk = subreddit === 'popheads' ? flairMatchesType(flairText, threadType) : true;

                    // Use fuzzy artist matching even in the fallback branch
                    const artistMatchesFallback = fuzzyMatchArtist(titleLower, artistLower);

                    // Require BOTH album name and artist match to avoid collisions like
                    // "Daughters" (band) vs "Jennifer Walton – Daughters"
                    if (flairOk && titleLower.includes(albumNameLower) && artistMatchesFallback) {
                        if (DEBUG) console.log(`Using fallback ${threadType} thread (strict match): "${title}" in r/${subreddit}`);
                        return { title, url, subreddit, flairText, threadType };
                    }
                }
            }

            if (DEBUG) console.log(`No matching ${threadType} thread found.`);
            return null;
        };

        // Find the best thread for each type
        const freshAlbumThread = findBestThread(freshAlbumResults, "FRESH ALBUM");

        // Add FRESH ALBUM thread if found
        if (freshAlbumThread) {
            relevantThreads.push(freshAlbumThread);
            addedUrls.add(freshAlbumThread.url); // Track the URL to avoid duplicates
            if (DEBUG) console.log(`Added FRESH ALBUM thread: "${freshAlbumThread.title}" from r/${subreddit}`);
        }

        // Find ALBUM DISCUSSION / DISCUSSION thread
        const albumDiscussionThread = findBestThread(albumDiscussionResults, "ALBUM DISCUSSION");

        // Add ALBUM DISCUSSION thread if found and not a duplicate
        if (albumDiscussionThread && !addedUrls.has(albumDiscussionThread.url)) {
            relevantThreads.push(albumDiscussionThread);
            addedUrls.add(albumDiscussionThread.url);
            if (DEBUG) console.log(`Added ALBUM DISCUSSION thread: "${albumDiscussionThread.title}" from r/${subreddit}`);
        } else if (albumDiscussionThread) {
            if (DEBUG) console.log(`Skipping duplicate ALBUM DISCUSSION thread: "${albumDiscussionThread.title}" from r/${subreddit}`);
        }

        if (DEBUG) console.log(`Found ${relevantThreads.length} unique relevant threads for r/${subreddit}`);
        return relevantThreads;
    }

    /**
     * Fetches comments from a given Reddit thread URL using the .json endpoint.
     * Note: This uses GM_xmlhttpRequest for cross-origin requests in Userscripts.
     *
     * @param {string} threadUrl The URL of the Reddit thread.
     * @returns {Promise<Array<Object>|null>} A promise that resolves with an array of comment data or null on error.
     */
    function fetchRedditComments(threadUrl) {
        if (DEBUG) console.log(`[fetchRedditComments] Attempting to fetch comments for: ${threadUrl}`);
        return new Promise((resolve, reject) => {
            // Append .json to the thread URL to get the JSON data
            const jsonUrl = threadUrl.endsWith('.json') ? threadUrl : threadUrl + '.json';

            if (DEBUG) console.log(`[fetchRedditComments] Requesting URL: ${jsonUrl}`);

            // Use GM_xmlhttpRequest for cross-origin requests
            GM_xmlhttpRequest({
                method: "GET",
                url: jsonUrl,
                onload: function(response) {
                    if (DEBUG) console.log(`[fetchRedditComments] Received response for ${jsonUrl}. Status: ${response.status}`);
                    try {
                        if (response.status === 200) {
                            if (DEBUG) console.log(`[fetchRedditComments] Response Text for ${jsonUrl}: ${response.responseText.substring(0, 500)}...`); // Log beginning of response
                            const data = JSON.parse(response.responseText);
                            if (DEBUG) console.log("[fetchRedditComments] Successfully parsed JSON response.");
                            // The JSON response for a thread includes two arrays: [submission, comments]
                            // We need the comments array (index 1)
                            if (data && data.length === 2 && data[1] && data[1].data && data[1].data.children) {
                                if (DEBUG) console.log(`[fetchRedditComments] Found comment data. Number of top-level items: ${data[1].data.children.length}`);
                                // Process the raw comment data to extract relevant info and handle replies
                                const comments = processComments(data[1].data.children);
                                if (DEBUG) console.log(`[fetchRedditComments] Processed comments. Total processed: ${comments.length}`);
                                resolve(comments);
                            } else {
                                console.error("[fetchRedditComments] Unexpected Reddit JSON structure:", data);
                                resolve(null); // Resolve with null for unexpected structure
                            }
                        } else {
                            console.error("[fetchRedditComments] Error fetching Reddit comments:", response.status, response.statusText);
                            resolve(null); // Resolve with null on HTTP error
                        }
                    } catch (e) {
                        console.error("[fetchRedditComments] Error parsing Reddit comments JSON:", e);
                        resolve(null); // Resolve with null on parsing error
                    }
                },
                onerror: function(error) {
                    console.error("[fetchRedditComments] GM_xmlhttpRequest error fetching Reddit comments:", error);
                    resolve(null); // Resolve with null on request error
                }
            });
        });
    }

    /**
     * Recursively processes raw Reddit comment data to extract relevant info and handle replies.
     * Filters out 'more' comments placeholders.
     *
     * @param {Array<Object>} rawComments The raw comment children array from Reddit API.
     * @returns {Array<Object>} An array of processed comment objects.
     */
    function processComments(rawComments) {
        const processed = [];
        if (!rawComments || !Array.isArray(rawComments)) {
            return processed;
        }

        for (const item of rawComments) {
            // Skip 'more' comments placeholders
            if (item.kind === 'more') {
                continue;
            }

            // Ensure it's a comment and has the necessary data
            if (item.kind === 't1' && item.data) {
                const commentData = item.data;
                const processedComment = {
                    author: commentData.author,
                    text: commentData.body,
                    score: commentData.score,
                    created_utc: commentData.created_utc,
                    replies: [] // Initialize replies array
                };

                // Recursively process replies if they exist
                if (commentData.replies && commentData.replies.data && commentData.replies.data.children) {
                    processedComment.replies = processComments(commentData.replies.data.children);
                }

                processed.push(processedComment);
            }
        }
        return processed;
    }

    // --- HTML Structures and Injection ---

    const REDDIT_COMMENTS_SECTION_HTML = `
            <div class="reddit-comments-section">
                <h3>Reddit Comments from r/indieheads and r/popheads</h3>
            <div class="reddit-comments-tabs">
                <!-- Tab buttons will be added here -->
            </div>
            <div class="reddit-comments-content">
                <!-- Comment content areas will be added here -->
                <!-- Each area will have a data-thread-id or similar to link to the tab -->
            </div>
        </div>
    `;

    /**
     * Injects HTML content after the last <hr> tag in the article and removes the <hr> tag.
     * If no <hr> tag is found, injects before div.disclaimer.
     * @param {string|HTMLElement} content The HTML string or HTMLElement to inject.
     */
    function injectAfterLastParagraph(content) {
        // Find the article element
        const article = document.querySelector('article');
        if (!article) {
            if (DEBUG) console.error('Article element not found for injection');
            return;
        }

        // Find all <hr> tags within the article
        const hrElements = Array.from(article.querySelectorAll('hr'));

        if (hrElements.length > 0) {
            // Get the last <hr> tag
            const lastHr = hrElements[hrElements.length - 1];

            // Insert content after the last <hr> tag
            if (typeof content === 'string') {
                lastHr.insertAdjacentHTML('afterend', content);
            } else {
                lastHr.insertAdjacentElement('afterend', content);
            }

            // Remove the <hr> tag after injecting our content
            lastHr.remove();
        } else {
            // Fallback: find div.disclaimer and inject before it
            const disclaimerDiv = article.querySelector('div.disclaimer');
            if (disclaimerDiv) {
                if (DEBUG) console.log('No <hr> found, injecting before div.disclaimer');
                // Insert content before the disclaimer div
                if (typeof content === 'string') {
                    disclaimerDiv.insertAdjacentHTML('beforebegin', content);
                } else {
                    disclaimerDiv.insertAdjacentElement('beforebegin', content);
                }
            } else {
                // Second fallback: find the last GridWrapper within ArticlePageChunks
                const articlePageChunks = document.querySelector('[class*="ArticlePageChunks"]');
                if (articlePageChunks) {
                    const gridWrappers = Array.from(articlePageChunks.querySelectorAll('[class*="GridWrapper"]'));
                    if (gridWrappers.length > 0) {
                        const lastGridWrapper = gridWrappers[gridWrappers.length - 1];
                        const bodyInnerContainer = lastGridWrapper.querySelector('[class*="grid-layout__content"] [class*="article__body"] [class*="body__inner-container"]');
                        
                        if (bodyInnerContainer) {
                            if (DEBUG) console.log('No <hr> or div.disclaimer found, injecting after body__inner-container in last GridWrapper within ArticlePageChunks');
                            // Insert content after the body__inner-container
                            if (typeof content === 'string') {
                                bodyInnerContainer.insertAdjacentHTML('afterend', content);
                            } else {
                                bodyInnerContainer.insertAdjacentElement('afterend', content);
                            }
                            return;
                        }
                    }
                }
                
                // Third fallback: find all GridWrappers and use the last one
                let gridWrappers = Array.from(document.querySelectorAll('[class*="GridWrapper"]'));
                if (gridWrappers.length > 0) {
                    const lastGridWrapper = gridWrappers[gridWrappers.length - 1];
                    const bodyInnerContainer = lastGridWrapper.querySelector('[class*="grid-layout__content"] [class*="article__body"] [class*="body__inner-container"]');
                    
                    if (bodyInnerContainer) {
                        if (DEBUG) console.log('No <hr> or div.disclaimer found, injecting after body__inner-container in last GridWrapper');
                        // Insert content after the body__inner-container
                        if (typeof content === 'string') {
                            bodyInnerContainer.insertAdjacentHTML('afterend', content);
                        } else {
                            bodyInnerContainer.insertAdjacentElement('afterend', content);
                        }
                        return;
                    }
                }
                
                // Fourth fallback: find article with data-testid="ReviewPageArticle" and inject as last child
                const reviewArticle = document.querySelector('article[data-testid="ReviewPageArticle"] div[class^="GridWrapper"]:last-child div.grid-layout__content div.article__body > div > p:last-child');
                if (reviewArticle) {
                    if (DEBUG) console.log('No <hr> or div.disclaimer found, injecting as last child of ReviewPageArticle');
                    // Insert content as the last child of the review article
                    if (typeof content === 'string') {
                        reviewArticle.insertAdjacentHTML('beforeend', content);
                    } else {
                        reviewArticle.appendChild(content);
                    }
                } else {
                    if (DEBUG) console.error('No <hr> tags, div.disclaimer, ArticlePageChunks GridWrapper, or article[data-testid="ReviewPageArticle"] found for injection');
                }
            }
        }
    }

    // Function to render comments to HTML (basic structure)
    function renderCommentsHtml(comments, level = 0) {
        let html = `<ul class="reddit-comment-list level-${level}">`;
        if (!comments || comments.length === 0) {
            html += '<li>No comments found for this thread.</li>';
        } else {
            // Filter out deleted comments
            const validComments = comments.filter(comment => 
                comment.author !== "[deleted]" && comment.text !== "[deleted]"
            );

            if (validComments.length === 0) {
                html += '<li>No valid comments found for this thread.</li>';
            } else {
                validComments.forEach(comment => {
                    html += `<li class="reddit-comment">`;
                    
                    // Add collapse button for top-level comments
                    if (level === 0) {
                        html += `<div class="comment-meta">
                            <b>${comment.author}</b> (${comment.score} points)
                            <button class="comment-collapse-button">[−]</button>
                        </div>`;
                    } else {
                        html += `<div class="comment-meta"><b>${comment.author}</b> (${comment.score} points)</div>`;
                    }
                    
                    // Process comment text for special content
                    let processedText = comment.text;
                    
                    // Process Giphy embeds first
                    processedText = processedText.replace(/!\[gif\]\(giphy\|([a-zA-Z0-9]+)(?:\|downsized)?\)/g, (match, giphyId) => {
                        return `
                            <div class="giphy-embed-container">
                                <iframe src="https://giphy.com/embed/${giphyId}" 
                                    width="480" height="270" frameBorder="0" 
                                    class="giphy-embed" allowFullScreen></iframe>
                            </div>
                        `;
                    });
                    
                    // Process Reddit image links
                    processedText = processedText.replace(/(https:\/\/preview\.redd\.it\/[a-zA-Z0-9]+\.(jpeg|jpg|png|gif)\?[^\s)]+)/g, (match, imageUrl) => {
                        return `
                            <div class="reddit-image-container">
                                <img src="${imageUrl}" alt="Reddit Image" class="reddit-inline-image" />
                            </div>
                        `;
                    });
                    
                    // Process Markdown image syntax for Reddit images
                    processedText = processedText.replace(/!\[.*?\]\((https:\/\/preview\.redd\.it\/[a-zA-Z0-9]+\.(jpeg|jpg|png|gif)\?[^\s)]+)\)/g, (match, imageUrl) => {
                        return `
                            <div class="reddit-image-container">
                                <img src="${imageUrl}" alt="Reddit Image" class="reddit-inline-image" />
                            </div>
                        `;
                    });
                    
                    // Process basic Markdown formatting
                    
                    // Bold text
                    processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
                    
                    // Italic text
                    processedText = processedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');
                    
                    // Block quotes - simple implementation
                    processedText = processedText.replace(/^(>|>)\s*(.*?)$/gm, '<blockquote>$2</blockquote>');
                    
                    // Parse Markdown links
                    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
                        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
                    });
                    
                    // Parse plain URLs
                    processedText = processedText.replace(/(?<!["\'])(https?:\/\/[^\s<>[\]()'"]+)(?![^<]*>)/g, (match, url) => {
                        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
                    });
                    
                    // Handle line breaks - simple approach
                    processedText = processedText.replace(/\n\n+/g, '</p><p>');
                    processedText = processedText.replace(/\n/g, '<br>');
                    
                    // Wrap in paragraph tags if not already
                    if (!processedText.startsWith('<p>') && 
                        !processedText.startsWith('<div') && 
                        !processedText.startsWith('<blockquote') &&
                        !processedText.includes('<div class="giphy-embed-container">') &&
                        !processedText.includes('<div class="reddit-image-container">')) {
                        processedText = `<p>${processedText}</p>`;
                    }
                    
                    html += `<div class="comment-body">${processedText}</div>`;
                    if (comment.replies && comment.replies.length > 0) {
                        html += renderCommentsHtml(comment.replies, level + 1);
                    }
                    html += `</li>`;
                });
            }
        }
        html += `</ul>`;
        return html;
    }

    function setupCommentCollapse(container) {
        // If no container specified, set up for all visible content
        const targetContainer = container || document.querySelector('.reddit-tab-content[style*="display: block"]');
        if (!targetContainer) return;
        
        // Remove any existing listeners by cloning and replacing buttons
        targetContainer.querySelectorAll('.comment-collapse-button').forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add fresh event listener to the new button
            newButton.addEventListener('click', function() {
                const commentLi = this.closest('.reddit-comment');
                commentLi.classList.toggle('collapsed');
                
                // Update button text
                if (commentLi.classList.contains('collapsed')) {
                    this.textContent = '[+]';
                } else {
                    this.textContent = '[−]';
                }
            });
        });
    }

    // --- CSS Styles ---
    function injectStyles() {
        const styles = `
            @media (min-width: 2400px) {
                #main-content div[class^="GridWrapper"] {
                    max-width: 2000px;
                }
            }
            .reddit-comments-section {
                margin-top: 30px;
                padding: 0;
                border-top: 1px solid #ddd;
                font-family: inherit;
            }
            .reddit-comments-tabs {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 15px;
            }
            .reddit-tab-button {
                padding: 6px 8px 6px 12px;
                margin-right: 5px;
                margin-bottom: 5px;
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                letter-spacing: 0;
            }
            .reddit-tab-button:not(.active):hover {
                background: #f8f8f8;
            }
            .reddit-tab-button:hover, .reddit-tab-button:active, .reddit-tab-button:focus {
                text-decoration: none;
            }
            .reddit-tab-button.active {
                background: #e0e0e0;
                border-color: #aaa;
                font-weight: bold;
            }
            .reddit-comment-list {
                list-style-type: none;
                padding-left: 0;
            }
            .reddit-comment-list.level-0 {
                padding-left: 0;
                margin-left: 0;
            }
            .reddit-comment-list.level-1 {
                padding-left: 10px;
                border-left: 2px solid #eee;
            }
            .reddit-comment-list.level-2,
            .reddit-comment-list.level-3,
            .reddit-comment-list.level-4,
            .reddit-comment-list.level-5 {
                padding-left: 10px;
                border-left: 2px solid #f5f5f5;
            }
            .reddit-comment {
                margin-bottom: 15px;
            }
            .reddit-image-container {
                margin-top: 10px;
            }
            .comment-meta {
                font-size: .9em;
                margin-bottom: 5px;
                color: #666;
            }
            .comment-body {
                line-height: 1.5;
            }
            div.comment-body > p {
                padding: 0;
                margin: 0 0 1.125rem !important;
            }
            /* Markdown formatting styles */
            .comment-body strong {
                font-weight: 700;
            }
            .comment-body em {
                font-style: italic;
            }
            .comment-body blockquote {
                border-left: 3px solid #c5c1ad;
                margin: 8px 0;
                padding: 0 8px 0 12px;
                color: #646464;
                background-color: #f8f9fa;
            }
            /* Paragraph styling */
            .comment-body p {
                margin: .8em 0;
            }

            .comment-body p:first-child {
                margin-top: 0;
            }
            .comment-body p:last-child {
                margin-bottom: 0;
            }
            .comment-body blockquote p {
                margin: .4em 0;
            }
            .reddit-comment.collapsed .comment-body,
            .reddit-comment.collapsed .reddit-comment-list {
                display: none;
            }
            .reddit-comment.collapsed {
                opacity: 0.7;
            }
            .comment-collapse-button {
                background: none;
                border: none;
                color: #0079d3;
                cursor: pointer;
                font-size: 12px;
                margin-left: 5px;
                padding: 0;
            }
            .comment-collapse-button:hover {
                text-decoration: underline;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }


    // --- Main Execution Logic ---

    async function init() {
        if (DEBUG) console.log("Pitchfork Reddit Comments Userscript started.");

        // Inject CSS styles
        injectStyles();

        const artist = extractArtistName();
        const album = extractAlbumName();

        if (DEBUG) console.log(`Extracted Artist: ${JSON.stringify(artist)}`);
        if (DEBUG) console.log(`Extracted Album: ${JSON.stringify(album)}`);

        if (!artist || !album) {
            if (DEBUG) console.log("Could not extract artist or album name. Exiting.");
            return;
        }

        if (DEBUG) console.log(`Found Artist: ${artist}, Album: ${album}`);

        const queries = formatAlbumSearchQueries(artist, album);
        if (DEBUG) console.log(`Search queries:`, queries);

        // Make separate search requests for each query type and subreddit
        const freshAlbumUrlIH = buildSubredditSearchJsonUrl('indieheads', queries.freshAlbumQuery);
        const albumDiscussionUrlIH = buildSubredditSearchJsonUrl('indieheads', queries.albumDiscussionQuery);
        const freshAlbumUrlPH = buildSubredditSearchJsonUrl('popheads', queries.freshAlbumQuery);
        const albumDiscussionUrlPH = buildSubredditSearchJsonUrl('popheads', queries.albumDiscussionQuery);

        if (DEBUG) console.log(`Fresh Album Search URL (r/indieheads): ${freshAlbumUrlIH}`);
        if (DEBUG) console.log(`Album Discussion Search URL (r/indieheads): ${albumDiscussionUrlIH}`);
        if (DEBUG) console.log(`Fresh Album Search URL (r/popheads): ${freshAlbumUrlPH}`);
        if (DEBUG) console.log(`Album Discussion Search URL (r/popheads): ${albumDiscussionUrlPH}`);

        // Function to perform a search request
        const performSearch = (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        try {
                            if (DEBUG) console.log(`[Search Request] Received response. Status: ${response.status}`);
                            if (response.status === 200) {
                                const searchData = JSON.parse(response.responseText);
                                if (DEBUG) console.log("[Search Request] Successfully parsed JSON response.");
                                if (searchData && searchData.data && searchData.data.children) {
                                    resolve(searchData.data.children);
                                } else {
                                    console.error("[Search Request] Unexpected Reddit search JSON structure:", searchData);
                                    resolve([]);
                                }
                            } else {
                                console.error("[Search Request] Error fetching Reddit search results:", response.status, response.statusText);
                                resolve([]);
                            }
                        } catch (e) {
                            console.error("[Search Request] Error parsing Reddit search JSON:", e);
                            resolve([]);
                        }
                    },
                    onerror: function(error) {
                        console.error("[Search Request] GM_xmlhttpRequest error fetching Reddit search results:", error);
                        resolve([]);
                    }
                });
            });
        };

        try {
            // Perform all searches in parallel
            const [
                freshAlbumResultsIH,
                albumDiscussionResultsIH,
                freshAlbumResultsPH,
                albumDiscussionResultsPH
            ] = await Promise.all([
                performSearch(freshAlbumUrlIH),
                performSearch(albumDiscussionUrlIH),
                performSearch(freshAlbumUrlPH),
                performSearch(albumDiscussionUrlPH)
            ]);

            const normalizedArtist = typeof artist === 'string' ? artist : artist.join(' & ');

            // Identify relevant threads from both subreddits
            const relevantThreadsIH = identifyRelevantThreads(
                freshAlbumResultsIH,
                albumDiscussionResultsIH,
                normalizedArtist,
                album,
                'indieheads'
            );

            const relevantThreadsPH = identifyRelevantThreads(
                freshAlbumResultsPH,
                albumDiscussionResultsPH,
                normalizedArtist,
                album,
                'popheads'
            );

            // Merge results and dedupe by URL across subreddits
            const allThreadsCombined = [...relevantThreadsIH, ...relevantThreadsPH];
            const seenUrls = new Set();
            const relevantThreads = [];

            for (const thread of allThreadsCombined) {
                if (!thread || !thread.url) continue;
                if (seenUrls.has(thread.url)) continue;
                seenUrls.add(thread.url);
                relevantThreads.push(thread);
            }

            if (relevantThreads.length === 0) {
                if (DEBUG) console.log("No relevant Reddit threads found.");
                const noThreadsMessage = document.createElement('p');
                noThreadsMessage.textContent = 'No relevant Reddit threads found for this review.';
                noThreadsMessage.style.fontStyle = 'italic';
                noThreadsMessage.style.marginTop = '20px'; // Add some spacing
                injectAfterLastParagraph(noThreadsMessage);
                return;
            }

            if (DEBUG) console.log(`Found ${relevantThreads.length} relevant thread(s) across all subreddits:`, relevantThreads);

            // Inject the main comments section container
            injectAfterLastParagraph(REDDIT_COMMENTS_SECTION_HTML);

            const commentsSection = document.querySelector('.reddit-comments-section');
            const tabsArea = commentsSection.querySelector('.reddit-comments-tabs');
            const contentArea = commentsSection.querySelector('.reddit-comments-content');

            // Fetch comments and build tabs/content
            for (let i = 0; i < relevantThreads.length; i++) {
                const thread = relevantThreads[i];
                if (DEBUG) console.log(`Fetching comments for thread: ${thread.title} (${thread.url})`);
                const comments = await fetchRedditComments(thread.url);

                // Generate tab button
                const tabButton = document.createElement('button');
                tabButton.classList.add('reddit-tab-button');

                // Build prefix like: "(r/indieheads) [FRESH ALBUM] "
                const metaParts = [];

                if (thread.subreddit) {
                    metaParts.push(`(r/${thread.subreddit})`);
                }

                // Prefer flair text from Reddit if available, otherwise fall back to our logical threadType label
                const displayFlair = thread.flairText || thread.threadType;
                if (displayFlair) {
                    metaParts.push(displayFlair);
                }

                const metaPrefix = metaParts.length ? metaParts.join(' ') + ' ' : '';

                // Clean the original title to remove the flair/type text it might contain
                let cleanedTitle = thread.title;
                if (displayFlair) {
                    // Escape special regex characters from the flair text (like brackets)
                    const escapedFlair = displayFlair.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                    // Build a regex that matches the flair at the start of the string,
                    // accounting for it being with or without brackets.
                    const pattern = `^\\[?${escapedFlair}\\]?\\s*`;
                    const cleaningRegex = new RegExp(pattern, 'i');
                    cleanedTitle = cleanedTitle.replace(cleaningRegex, '');
                }

                // Final label examples:
                // "(r/indieheads) FRESH ALBUM FKA twigs - EUSEXUA"
                // "(r/popheads) [FRESH ALBUM] FKA twigs - Eusexua"
                tabButton.textContent = metaPrefix + cleanedTitle.trim() + ' ';
                tabButton.setAttribute('data-thread-index', i);

                // Add a direct link icon that opens the Reddit thread in a new tab
                const linkIcon = document.createElement('a');
                linkIcon.href = thread.url;
                linkIcon.target = '_blank';
                linkIcon.rel = 'noopener noreferrer'; // Security best practice for target="_blank"
                linkIcon.innerHTML = '🔗';
                linkIcon.title = 'Open Reddit thread in new tab';
                linkIcon.style.fontSize = '0.8em';
                linkIcon.style.opacity = '0.7';
                linkIcon.style.textDecoration = 'none'; // Remove underline
                linkIcon.style.marginLeft = '5px';

                tabButton.appendChild(linkIcon);
                tabsArea.appendChild(tabButton);

                // Generate comment content area
                const threadContent = document.createElement('div');
                threadContent.classList.add('reddit-tab-content');
                threadContent.setAttribute('data-thread-index', i);
                threadContent.style.display = 'none'; // Hide by default

                if (comments) {
                    threadContent.innerHTML = renderCommentsHtml(comments);
                    // Set up collapse functionality for this tab's comments
                    setupCommentCollapse(threadContent);
                } else {
                    threadContent.innerHTML = '<p>Could not load comments for this thread.</p>';
                }
                contentArea.appendChild(threadContent);

                // Activate the first tab and content by default
                if (i === 0) {
                    tabButton.classList.add('active');
                    threadContent.style.display = 'block';
                }
            }

            // Add event listeners for tab switching
            const tabButtons = tabsArea.querySelectorAll('.reddit-tab-button');
            const tabContents = contentArea.querySelectorAll('.reddit-tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const threadIndex = button.getAttribute('data-thread-index');

                    // Deactivate all tabs and hide all content
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.style.display = 'none');

                    // Activate the clicked tab and show corresponding content
                    button.classList.add('active');
                    const activeContent = document.querySelector(`.reddit-tab-content[data-thread-index="${threadIndex}"]`);
                    activeContent.style.display = 'block';

                    // Re-initialize collapse functionality for the newly displayed tab
                    setupCommentCollapse(activeContent);
                });
            });

        } catch (error) {
            console.error("Error during search process:", error);
        }
    }

    // Run the initialization function
    init();

})();