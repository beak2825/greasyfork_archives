// ==UserScript==
// @name         Zed Champions Auction Filter and Sort
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter auctions by star rating and sort by time remaining on Zed Champions
// @author       You
// @match        https://app.zedchampions.com/auctions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zedchampions.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534736/Zed%20Champions%20Auction%20Filter%20and%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/534736/Zed%20Champions%20Auction%20Filter%20and%20Sort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const REFRESH_INTERVAL = 1000; // Check for new auctions every 1 second
    const DEBOUNCE_TIME = 300; // Debounce time in ms for handling multiple rapid changes
    const STATUS_HIDE_DELAY = 2000; // Hide status message after 2 seconds of no changes
    const STYLE = `
        .zed-filter-container {
            position: sticky;
            top: 0;
            background-color: #1A202C;
            padding: 12px 20px;
            z-index: 1000;
            display: flex;
            flex-wrap: wrap;
            gap: 10px 20px;
            border-bottom: 1px solid #2D3748;
            align-items: center;
        }
        .zed-filter-row {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            flex: 1;
            align-items: center;
        }
        .zed-filter-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .zed-filter-group label {
            font-weight: bold;
            color: white;
            font-size: 13px;
            white-space: nowrap;
        }
        .zed-filter-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .zed-filter-btn {
            background-color: #2D3748;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            min-width: 40px;
            text-align: center;
            font-size: 13px;
            transition: background-color 0.2s;
        }
        .zed-filter-btn.active {
            background-color: #4299E1;
        }
        .zed-bloodline-btn {
            min-width: 90px;
        }
        .zed-controls-group {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: flex-end;
            margin-left: auto;
        }
        .zed-controls-group button {
            margin: 0;
        }
        .zed-sort-btn {
            background-color: #2D3748;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            white-space: nowrap;
        }
        .zed-sort-btn.active {
            background-color: #4299E1;
        }
        .zed-reset-btn {
            background-color: #E53E3E;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            white-space: nowrap;
        }
        .zed-card-hidden {
            display: none !important;
        }
        .zed-status-box {
            background-color: rgba(74, 85, 104, 0.9);
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: bold;
            display: none;
            align-self: flex-start;
            min-width: 160px;
            text-align: center;
            animation: fadeIn 0.3s ease;
        }
        .zed-status-container {
            display: flex;
            align-items: center;
            margin-left: auto;
            margin-right: 20px;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;

    // State
    let activeStarFilters = [];
    let activeBloodlineFilters = [];
    let sortByTimeAsc = false;
    let isProcessing = false;
    let debounceTimer = null;
    let processQueue = 0;
    let lastTotalAuctions = 0;
    let statusHideTimer = null;
    let statusElement = null;
    let isScanning = false;

    // Add a debounce function to prevent excessive processing
    function debounce(func, wait) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Core processing logic
    function processAuctionsCore() {
        // Store all cards before we make any changes
        const auctionCards = document.querySelectorAll('.css-4k37cb, [class*="auction-card"]');
        const totalAuctions = auctionCards.length;

        // Check if total auctions has changed
        if (totalAuctions !== lastTotalAuctions) {
            // Show scanning message only when total count changes
            showScanningMessage(totalAuctions);
            lastTotalAuctions = totalAuctions;
            isScanning = true;
        }

        // Store original positions if not already stored
        auctionCards.forEach((card, index) => {
            if (!card.dataset.originalIndex) {
                card.dataset.originalIndex = index;
            }
        });

        // Apply filters
        auctionCards.forEach(card => {
            const starRating = getStarRating(card);
            const bloodline = getBloodline(card);

            // Check if filters are active
            const hasStarFilters = activeStarFilters.length > 0;
            const hasBloodlineFilters = activeBloodlineFilters.length > 0;

            // Star rating filter check
            const matchesStarFilter = !hasStarFilters || activeStarFilters.includes(starRating.toString());

            // Bloodline filter check
            const matchesBloodlineFilter = !hasBloodlineFilters || (bloodline && activeBloodlineFilters.includes(bloodline));

            // Apply combined filters (AND logic)
            card.classList.toggle('zed-card-hidden', !(matchesStarFilter && matchesBloodlineFilter));
        });

        // Apply sorting if enabled
        if (sortByTimeAsc) {
            sortCardsByTimeRemaining();
        }

        // Count visible auctions
        const visibleAuctions = document.querySelectorAll('.css-4k37cb:not(.zed-card-hidden), [class*="auction-card"]:not(.zed-card-hidden)').length;

        // Update status message with count
        updateStatusMessage(`${visibleAuctions} out of ${totalAuctions} auctions`);

        // Reset the hide timer since we've updated the message
        resetStatusHideTimer();
    }

    // Show scanning message
    function showScanningMessage(totalAuctions) {
        if (!statusElement) {
            return;
        }

        statusElement.textContent = `Scanning ${totalAuctions} auctions...`;
        statusElement.style.display = 'block';
    }

    // Show status message
    function showStatusMessage(message) {
        if (!statusElement) {
            return;
        }

        statusElement.textContent = message;
        statusElement.style.display = 'block';
    }

    // Update status message
    function updateStatusMessage(message) {
        if (!statusElement) {
            return;
        }

        statusElement.textContent = message;
        statusElement.style.display = 'block';
    }

    // Reset the timer that hides the status message
    function resetStatusHideTimer() {
        if (statusHideTimer) {
            clearTimeout(statusHideTimer);
        }

        // Only hide the scanning message after delay
        // Keep the auction count visible
        statusHideTimer = setTimeout(() => {
            if (statusElement && isScanning) {
                isScanning = false;

                // Get current counts to display after scanning
                const totalAuctions = document.querySelectorAll('.css-4k37cb, [class*="auction-card"]').length;
                const visibleAuctions = document.querySelectorAll('.css-4k37cb:not(.zed-card-hidden), [class*="auction-card"]:not(.zed-card-hidden)').length;

                // Update the message
                updateStatusMessage(`${visibleAuctions} out of ${totalAuctions} auctions`);
            }
        }, STATUS_HIDE_DELAY);
    }

    // Enhanced process auctions function with debounce
    const debouncedProcessAuctions = debounce(() => {
        // If we're already processing, increment the queue
        if (isProcessing) {
            processQueue++;
            return;
        }

        isProcessing = true;

        try {
            // Actual processing logic
            processAuctionsCore();
        } finally {
            isProcessing = false;

            // If we have queued processing requests, process again
            if (processQueue > 0) {
                processQueue = 0;
                setTimeout(debouncedProcessAuctions, 50);
            }
        }
    }, DEBOUNCE_TIME);

    // Toggle bloodline filter
    function toggleBloodlineFilter(event) {
        const bloodlineValue = event.target.dataset.bloodline;

        if (activeBloodlineFilters.includes(bloodlineValue)) {
            // Remove filter
            activeBloodlineFilters = activeBloodlineFilters.filter(b => b !== bloodlineValue);
            event.target.classList.remove('active');
        } else {
            // Add filter
            activeBloodlineFilters.push(bloodlineValue);
            event.target.classList.add('active');
        }

        debouncedProcessAuctions();
    }

    // Toggle star rating filter
    function toggleStarFilter(event) {
        const starValue = event.target.dataset.stars;

        if (activeStarFilters.includes(starValue)) {
            // Remove filter
            activeStarFilters = activeStarFilters.filter(s => s !== starValue);
            event.target.classList.remove('active');
        } else {
            // Add filter
            activeStarFilters.push(starValue);
            event.target.classList.add('active');
        }

        debouncedProcessAuctions();
    }

    // Toggle time sort
    function toggleTimeSort(event) {
        sortByTimeAsc = !sortByTimeAsc;

        // Update button text
        event.target.textContent = sortByTimeAsc ? 'Sort by Time ↓' : 'Sort by Time ↑';
        event.target.classList.toggle('active', sortByTimeAsc);

        debouncedProcessAuctions();
    }

    // Reset all filters and sorting
    function resetFilters() {
        // Clear star filters
        activeStarFilters = [];
        document.querySelectorAll('.zed-filter-btn[data-stars]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Clear bloodline filters
        activeBloodlineFilters = [];
        document.querySelectorAll('.zed-filter-btn[data-bloodline]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Reset sort
        sortByTimeAsc = false;
        const sortBtn = document.querySelector('.zed-sort-btn');
        if (sortBtn) {
            sortBtn.textContent = 'Sort by Time ↑';
            sortBtn.classList.remove('active');
        }

        // Reset visibility of cards
        document.querySelectorAll('.css-4k37cb').forEach(card => {
            card.classList.remove('zed-card-hidden');
        });

        // Reset sort order
        const auctionContainer = document.querySelector('#auctionlist-container') ||
                                document.querySelector('.css-1v5qfvc') ||
                                document.querySelector('.css-14v29z6') ||
                                document.querySelector('.css-1tvu0bo');

        if (auctionContainer) {
            // Sort back to original order
            const cards = Array.from(auctionContainer.querySelectorAll('.css-4k37cb'));
            cards.sort((a, b) => {
                return parseInt(a.dataset.originalIndex || 0) - parseInt(b.dataset.originalIndex || 0);
            });

            // Re-append in original order
            cards.forEach(card => {
                auctionContainer.appendChild(card);
            });
        }

        // Show message after reset
        const totalAuctions = document.querySelectorAll('.css-4k37cb, [class*="auction-card"]').length;
        updateStatusMessage(`${totalAuctions} out of ${totalAuctions} auctions`);

        // Process auctions to update status
        debouncedProcessAuctions();
    }

    // Create the filter UI
    function createFilterUI() {
        const container = document.createElement('div');
        container.className = 'zed-filter-container';

        // Create a filter row for all filters
        const filterRow = document.createElement('div');
        filterRow.className = 'zed-filter-row';
        container.appendChild(filterRow);

        // Star rating filter group
        const starFilterGroup = document.createElement('div');
        starFilterGroup.className = 'zed-filter-group';

        const starLabel = document.createElement('label');
        starLabel.textContent = 'Filter by Star Rating:';
        starFilterGroup.appendChild(starLabel);

        const starButtons = document.createElement('div');
        starButtons.className = 'zed-filter-buttons';

        // Create buttons for whole and half star ratings from 1 to 5
        for (let i = 1; i <= 5; i++) {
            // Whole number
            const wholeBtn = document.createElement('button');
            wholeBtn.className = 'zed-filter-btn';
            wholeBtn.textContent = i.toString();
            wholeBtn.dataset.stars = i.toString();
            wholeBtn.addEventListener('click', toggleStarFilter);
            starButtons.appendChild(wholeBtn);

            // Half star
            if (i < 5) {
                const halfBtn = document.createElement('button');
                halfBtn.className = 'zed-filter-btn';
                halfBtn.textContent = (i + 0.5).toString();
                halfBtn.dataset.stars = (i + 0.5).toString();
                halfBtn.addEventListener('click', toggleStarFilter);
                starButtons.appendChild(halfBtn);
            }
        }

        starFilterGroup.appendChild(starButtons);
        filterRow.appendChild(starFilterGroup);

        // Bloodline filter group
        const bloodlineFilterGroup = document.createElement('div');
        bloodlineFilterGroup.className = 'zed-filter-group';

        const bloodlineLabel = document.createElement('label');
        bloodlineLabel.textContent = 'Filter by Bloodline:';
        bloodlineFilterGroup.appendChild(bloodlineLabel);

        const bloodlineButtons = document.createElement('div');
        bloodlineButtons.className = 'zed-filter-buttons';

        // Create buttons for each bloodline
        const bloodlines = ['NAKAMOTO', 'SZABO', 'FINNEY', 'BUTERIN'];
        bloodlines.forEach(bloodline => {
            const btn = document.createElement('button');
            btn.className = 'zed-filter-btn zed-bloodline-btn';
            btn.textContent = bloodline;
            btn.dataset.bloodline = bloodline;
            btn.addEventListener('click', toggleBloodlineFilter);
            bloodlineButtons.appendChild(btn);
        });

        bloodlineFilterGroup.appendChild(bloodlineButtons);
        filterRow.appendChild(bloodlineFilterGroup);

        // Status container for better positioning
        const statusContainer = document.createElement('div');
        statusContainer.className = 'zed-status-container';

        // Status message box
        statusElement = document.createElement('div');
        statusElement.className = 'zed-status-box';
        statusElement.textContent = 'Ready';
        statusContainer.appendChild(statusElement);

        // Add status container to filter row
        filterRow.appendChild(statusContainer);

        // Controls group (for sort/reset buttons)
        const controlsGroup = document.createElement('div');
        controlsGroup.className = 'zed-controls-group';

        // Sort by time button
        const sortBtn = document.createElement('button');
        sortBtn.className = 'zed-sort-btn';
        sortBtn.textContent = 'Sort by Time ↑';
        sortBtn.addEventListener('click', toggleTimeSort);
        controlsGroup.appendChild(sortBtn);

        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'zed-reset-btn';
        resetBtn.textContent = 'Reset All';
        resetBtn.addEventListener('click', resetFilters);
        controlsGroup.appendChild(resetBtn);

        container.appendChild(controlsGroup);

        // Insert the filter container at the top of the page
        const targetElement = document.querySelector('main') || document.body;
        targetElement.insertBefore(container, targetElement.firstChild);
    }

    // Function to get the star rating from an auction card
    function getStarRating(card) {
        // Find all star elements in the card
        const starContainer = card.querySelector('.css-k008qs, [class*="star-rating"]');
        if (!starContainer) return 0;

        // First try the new UI format (count filled stars)
        const starElements = starContainer.querySelectorAll('*');
        let rating = 0;

        if (starElements.length > 0) {
            // Try to count filled stars from text content
            const ratingText = starContainer.textContent.trim();
            // Look for patterns like "★★★☆☆" or "3.5" or "★★★½"
            if (ratingText.match(/^[\d\.]+$/)) {
                // If it's a numeric rating (e.g., "3.5")
                rating = parseFloat(ratingText);
            } else if (ratingText.includes('★')) {
                // Count full stars
                rating = (ratingText.match(/★/g) || []).length;
                // Check for half star (½ or ☆)
                if (ratingText.includes('½') || (ratingText.includes('☆') && rating > 0)) {
                    rating += 0.5;
                }
            } else {
                // Fall back to original method for the old UI
                let fullStars = 0;
                let hasHalfStar = false;

                // Look for star containers with css-1o988h9 class
                const oldStarElements = starContainer.querySelectorAll('.css-1o988h9');

                oldStarElements.forEach(starElement => {
                    // If it has a fully filled star (css-1tt5dvj)
                    if (starElement.querySelector('.css-1tt5dvj')) {
                        fullStars++;
                    }
                    // If it has a half-filled star (css-139eomv)
                    else if (starElement.querySelector('.css-139eomv')) {
                        hasHalfStar = true;
                    }
                });

                rating = fullStars + (hasHalfStar ? 0.5 : 0);
            }
        }

        return rating;
    }

    // Function to get the bloodline from an auction card
    function getBloodline(card) {
        // Look for text that might contain a bloodline
        const textElements = card.querySelectorAll('p, div, span');
        const bloodlines = ['NAKAMOTO', 'SZABO', 'FINNEY', 'BUTERIN'];

        for (const element of textElements) {
            const text = element.textContent.trim().toUpperCase();
            for (const bloodline of bloodlines) {
                if (text === bloodline) {
                    return bloodline;
                }
            }
        }

        return null;
    }

    // Function to get time remaining in minutes from an auction card
    function getTimeRemainingInMinutes(card) {
        // Find the time element using multiple possible selectors
        const timeElement = card.querySelector('.css-1baulvz, .css-1fb8s8w span, [class*="time-remaining"], div[class*="Time"] span');
        if (!timeElement) return Infinity;

        const timeText = timeElement.textContent.trim();

        // Parse the time string (format: "1d 3h 5m 30s" or similar)
        let days = 0, hours = 0, minutes = 0, seconds = 0;

        // Check for days
        if (timeText.includes('d')) {
            const dayMatch = timeText.match(/(\d+)d/);
            if (dayMatch && dayMatch[1]) {
                days = parseInt(dayMatch[1]) || 0;
            }
        }

        // Check for hours
        if (timeText.includes('h')) {
            const hourMatch = timeText.match(/(\d+)h/);
            if (hourMatch && hourMatch[1]) {
                hours = parseInt(hourMatch[1]) || 0;
            }
        }

        // Check for minutes
        if (timeText.includes('m')) {
            const minuteMatch = timeText.match(/(\d+)m/);
            if (minuteMatch && minuteMatch[1]) {
                minutes = parseInt(minuteMatch[1]) || 0;
            }
        }

        // Check for seconds
        if (timeText.includes('s')) {
            const secondMatch = timeText.match(/(\d+)s/);
            if (secondMatch && secondMatch[1]) {
                seconds = parseInt(secondMatch[1]) || 0;
            }
        }

        // Convert to total minutes (including a fraction for seconds)
        return (days * 24 * 60) + (hours * 60) + minutes + (seconds / 60);
    }

    // Function to sort cards by time remaining
    function sortCardsByTimeRemaining() {
        // Find auction container
        const auctionContainer = document.querySelector('#auctionlist-container') ||
                                document.querySelector('.css-1v5qfvc') ||
                                document.querySelector('.css-14v29z6') ||
                                document.querySelector('.css-1tvu0bo');

        if (!auctionContainer) {
            console.error('Auction container not found. Unable to sort cards.');
            return;
        }

        // Process sorting with the found container
        processSort(auctionContainer);

        // Function to handle the actual sorting logic
        function processSort(container) {
            const cards = Array.from(container.querySelectorAll('.css-4k37cb'))
                .filter(card => !card.classList.contains('zed-card-hidden'));

            if (cards.length === 0) {
                return; // Don't proceed if no cards
            }

            cards.sort((a, b) => {
                const timeA = getTimeRemainingInMinutes(a);
                const timeB = getTimeRemainingInMinutes(b);
                return timeA - timeB; // Low to high
            });

            // Re-append sorted cards
            cards.forEach(card => {
                container.appendChild(card);
            });
        }
    }

    // Initialize the script
    function init() {
        // Check if we're on the right page
        if (window.location.href !== "https://app.zedchampions.com/auctions") {
            console.log('Not on the auctions page, skipping initialization');
            return;
        }

        // Add styles
        addStyles();

        // Add filter UI
        createFilterUI();

        // Initial processing
        debouncedProcessAuctions();

        // Set up observer for new auctions
        const targetNode = document.body;

        const observer = new MutationObserver(() => {
            debouncedProcessAuctions();
        });

        // Start observing
        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        // Also set up regular refreshes as fallback
        setInterval(debouncedProcessAuctions, REFRESH_INTERVAL);
    }

    // Add styles to the page
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = STYLE;
        document.head.appendChild(styleElement);
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();