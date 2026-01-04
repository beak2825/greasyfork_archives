// ==UserScript==
// @name         YouTube View Count in Google Search Results
// @namespace    https://github.com/Haris00911/GoogleSearchViewCounter/
// @version      1.0.0
// @description  Displays YouTube video view counts directly in Google search results
// @author       Haris00911
// @match        https://www.google.com/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @homepage     https://github.com/Haris00911/GoogleSearchViewCounter/
// @downloadURL https://update.greasyfork.org/scripts/509093/YouTube%20View%20Count%20in%20Google%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/509093/YouTube%20View%20Count%20in%20Google%20Search%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue('youtubeApiKey');

    if (!apiKey) {
        apiKey = prompt('Please enter your YouTube Data API key:');
        if (apiKey) {
            GM_setValue('youtubeApiKey', apiKey);
        } else {
            alert('You need to provide an API key for the script to work.');
            return;
        }
    }

    GM_registerMenuCommand('Change YouTube API Key', function() {
        const newKey = prompt('Please enter your YouTube Data API key:', apiKey);
        if (newKey) {
            GM_setValue('youtubeApiKey', newKey);
            apiKey = newKey;
            alert('API key updated. Please reload the page.');
        }
    });

    const processedVideoIDs = new Set();
    const videoIDToLinks = {};

    function getYouTubeVideoID(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.substr(1);
            } else if (urlObj.hostname.includes('youtube.com')) {
                return urlObj.searchParams.get('v');
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    function formatViewCount(viewCount) {
        const count = parseInt(viewCount, 10);
        if (count >= 1e9) {
            return (count / 1e9).toFixed(1) + 'B';
        } else if (count >= 1e6) {
            return (count / 1e6).toFixed(1) + 'M';
        } else if (count >= 1e3) {
            return (count / 1e3).toFixed(1) + 'K';
        } else {
            return count.toString();
        }
    }

    function insertViewCount(link, viewCount) {
        const formattedViewCount = formatViewCount(viewCount);
        const span = document.createElement('span');
        span.style.color = '#555';
        span.style.marginLeft = '5px';
        span.textContent = `(${formattedViewCount} views)`;

        // Insert the span after the link
        link.parentNode.insertBefore(span, link.nextSibling);
    }

    function fetchVideoStatistics(videoIDs) {
        const apiURL = 'https://www.googleapis.com/youtube/v3/videos';
        const params = new URLSearchParams();
        params.append('part', 'statistics');
        params.append('id', videoIDs.join(','));
        params.append('key', apiKey);

        const url = `${apiURL}?${params.toString()}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.items) {
                        data.items.forEach(function(item) {
                            const videoID = item.id;
                            const viewCount = item.statistics.viewCount;
                            const links = videoIDToLinks[videoID];
                            if (links) {
                                links.forEach(function(link) {
                                    insertViewCount(link, viewCount);
                                });
                            }
                        });
                    }
                } else {
                    console.error('Failed to fetch video statistics', response);
                }
            },
            onerror: function(error) {
                console.error('Error fetching video statistics', error);
            }
        });
    }

    function processPage() {
        const searchResults = document.getElementById('search');
        if (!searchResults) return;

        const youtubeLinks = searchResults.querySelectorAll('a[href*="youtube.com/watch?v="], a[href*="youtu.be/"]');

        const videoIDs = new Set();
        youtubeLinks.forEach(function(link) {
            const videoID = getYouTubeVideoID(link.href);
            if (videoID && !processedVideoIDs.has(videoID)) {
                videoIDs.add(videoID);
                processedVideoIDs.add(videoID);
                if (!videoIDToLinks[videoID]) {
                    videoIDToLinks[videoID] = [];
                }
                videoIDToLinks[videoID].push(link);
            }
        });

        const videoIDArray = Array.from(videoIDs);
        if (videoIDArray.length === 0) return;

        const batches = [];
        const batchSize = 50;
        for (let i = 0; i < videoIDArray.length; i += batchSize) {
            batches.push(videoIDArray.slice(i, i + batchSize));
        }

        batches.forEach(function(batch) {
            fetchVideoStatistics(batch);
        });
    }

    processPage();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.closest('#search')) {
                        processPage();
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
