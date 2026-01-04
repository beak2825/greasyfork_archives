// ==UserScript==
// @name        DuckDuckGo URL Collector (Rewritten)
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Collects URLs from DuckDuckGo with optional site: filtering and rate limiting, updated for modern DuckDuckGo
// @author      Ghosty-Tongue
// @match       *://duckduckgo.com/*
// @grant       GM_notification
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/525255/DuckDuckGo%20URL%20Collector%20%28Rewritten%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525255/DuckDuckGo%20URL%20Collector%20%28Rewritten%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const collectedUrls = new Set();
    let isProcessing = false;
    let startTime, timerInterval;
    let targetSite = null;

    // Attempt to get the search input value more robustly
    // Check for both 'search_form_input' and a more general input within the search form area
    const searchFormInput = document.getElementById('search_form_input') ||
                            document.querySelector('form[data-testid="search-form"] input[type="text"]');

    if (searchFormInput && searchFormInput.value.includes('site:')) {
        const match = searchFormInput.value.match(/site:([^\s]+)/);
        if (match) {
            targetSite = match[1].toLowerCase();
        }
    }

    // --- UI Elements ---
    const banner = document.createElement('div');
    Object.assign(banner.style, {
        position: 'fixed',
        top: '90px',
        right: '10px',
        zIndex: '10001',
        backgroundColor: 'rgba(255, 165, 0, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        display: 'none'
    });
    document.body.appendChild(banner);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rgbFlow {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        .ddg-url-collector-btn.processing {
            /* Add any specific styles for when processing, e.g., pulsating effect */
            animation: rgbFlow 1s linear infinite alternate; /* Faster, alternating glow */
        }
    `;
    document.head.appendChild(style);

    const timerDisplay = document.createElement('div');
    Object.assign(timerDisplay.style, {
        position: 'fixed',
        top: '50px',
        right: '10px',
        zIndex: '10000',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '5px 10px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px'
    });
    document.body.appendChild(timerDisplay);

    // --- Timer Functions ---
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        timerDisplay.textContent = '0s';
    }

    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `${elapsed}s`;
    }

    function stopTimer() {
        clearInterval(timerInterval);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `${elapsed}s (stopped)`;
    }

    // --- URL Extraction ---
    function extractUrls() {
        // More general selector for results. DuckDuckGo uses <article> for results.
        const results = document.querySelectorAll('article[data-testid="result"]');
        let newUrlsCount = 0;
        results.forEach(result => {
            // Look for the main link within the result, which often has a data-testid or a specific class
            // Prioritize data-testid if available, otherwise look for a common link structure
            const link = result.querySelector('a[data-testid="result-title-a"]') ||
                         result.querySelector('a[data-testid="result-extras-url-link"]'); // Fallback to the 'extras' link

            if (link && link.href) {
                const url = link.href;
                try {
                    const urlDomain = new URL(url).hostname.toLowerCase();
                    if (targetSite) {
                        if (!urlDomain.includes(targetSite)) return;
                    }
                    if (!collectedUrls.has(url)) {
                        collectedUrls.add(url);
                        newUrlsCount++;
                    }
                } catch (e) {
                    console.warn('DuckDuckGo URL Collector: Invalid URL found:', url, e);
                }
            }
        });
        return newUrlsCount;
    }

    // --- Automation Logic ---
    async function clickMoreResults() {
        isProcessing = true;
        btn.classList.add('processing');
        let batchCount = 0;
        let moreResultsButton;

        do {
            if (!isProcessing) break;

            // Find the "More results" button. It often has the ID 'more-results' or contains specific text.
            moreResultsButton = document.getElementById('more-results') ||
                                document.querySelector('button[type="button"]#more-results') ||
                                Array.from(document.querySelectorAll('button, a')).find(el =>
                                    el.textContent.includes('More results') && el.offsetHeight > 0 // Ensure visible
                                );

            if (moreResultsButton) {
                // Scroll the button into view if it's not visible, to ensure clicks register.
                moreResultsButton.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Wait a moment for scrolling to complete if needed.
                await new Promise(resolve => setTimeout(resolve, 500));

                moreResultsButton.click();
                // Increased delay to account for potential slower loading or rate limiting
                await new Promise(resolve => setTimeout(resolve, 3000));
                batchCount += extractUrls();

                // Display current status
                banner.textContent = `Collecting... Found ${collectedUrls.size} URLs so far.`;
                banner.style.display = 'block';

                // Implement a more dynamic rate limiting if necessary,
                // or just stick to a fixed pause for every X pages.
                // The original script used 420, let's keep it but monitor if it's too aggressive.
                if (batchCount >= 420) { // Reset batch count after a pause
                    banner.textContent = 'Taking 15s break to avoid limits...';
                    await new Promise(resolve => setTimeout(resolve, 15000));
                    banner.textContent = `Resuming collection. Found ${collectedUrls.size} URLs.`;
                    batchCount = 0; // Reset batch count after the break
                }

            } else {
                // If no more results button is found, collection is complete
                break;
            }
        } while (moreResultsButton && isProcessing); // Continue only if button exists and processing is active

        isProcessing = false;
        btn.classList.remove('processing');
        banner.style.display = 'none'; // Hide banner when done or stopped

        GM_notification({
            title: 'DuckDuckGo URL Collector',
            text: `Collection ${isProcessing ? 'interrupted' : 'complete'}. Saved ${collectedUrls.size} URLs.`,
            timeout: 5000
        });
        saveUrls();
    }

    // --- Save Function ---
    function saveUrls() {
        const blob = new Blob([Array.from(collectedUrls).join('\n')], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `duckduckgo_urls_${new Date().toISOString().slice(0,10)}.txt`; // More descriptive filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        stopTimer();
    }

    // --- Control Button ---
    const btn = document.createElement('button');
    btn.textContent = '🦆';
    btn.classList.add('ddg-url-collector-btn'); // Add a class for specific styling
    Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '10000',
        padding: '12px 24px',
        background: 'linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000)',
        backgroundSize: '300% 100%',
        animation: 'rgbFlow 5s linear infinite',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    });

    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
    });

    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });

    btn.addEventListener('click', () => {
        if (!isProcessing) {
            collectedUrls.clear(); // Clear previous URLs before starting a new collection
            startTimer();
            clickMoreResults();
        } else {
            // If processing, clicking the button stops it
            isProcessing = false;
            btn.classList.remove('processing');
            banner.style.display = 'none';
            stopTimer();
            // Optional: Save URLs immediately on stop, or wait for the "Collection complete" notification
            saveUrls();
        }
    });

    document.body.appendChild(btn);

    // Initial extraction in case there are results on the first page already
    extractUrls();
})();