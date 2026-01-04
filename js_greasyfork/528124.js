// ==UserScript==
// @name         Next Spaceflight Countdown
// @description  Adds a countdown timer to upcoming space launches on NextSpaceflight.com (uses MutationObserver and fetches detail pages for reliable timestamps)
// @match        https://nextspaceflight.com/*
// @version 0.0.1.20251012082016
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/528124/Next%20Spaceflight%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/528124/Next%20Spaceflight%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Map of month names to month indices (for parsing textual dates)
    const monthNameToIndex = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };

    // Class name for inserted countdown elements
    const countdownElementClassName = 'nsf-countdown';

    // Mark processed anchors to avoid double-processing
    const processedDataAttributeName = 'data-nsf-countdown-processed';

    // Insert a countdown DOM node into the provided containerElement and return that node
    function createAndAttachCountdownNode(containerElement) {
        const countdownElement = document.createElement('div');
        countdownElement.className = countdownElementClassName;
        countdownElement.style.marginTop = '6px';
        countdownElement.style.padding = '4px 6px';
        countdownElement.style.borderRadius = '6px';
        countdownElement.style.fontSize = '13px';
        countdownElement.style.background = 'rgba(0,0,0,0.35)';
        countdownElement.style.color = 'rgb(209, 205, 199)';
        countdownElement.style.display = 'inline-block';
        countdownElement.textContent = 'Loading countdown...';
        containerElement.appendChild(countdownElement);
        return countdownElement;
    }

    // Given a detail page HTML string, extract an approximate UTC/GMT launch timestamp in milliseconds.
    // Strategy: look for a time (HH:MM or HH:MM:SS) followed nearby by a textual date "Month Day, Year".
    function extractLaunchTimestampFromDetailHtml(detailHtmlText) {
        const textContent = detailHtmlText.replace(/\r/g, ' ').replace(/\n/g, ' ');
        // Regex: time (HH:MM or HH:MM:SS)
        const timeRegex = /([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?/;
        // Regex: textual date like "January 15, 2025" or "October 16, 01:30" (we want Month Day, Year)
        const dateRegex = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+([1-9]|[12]\d|3[01]),\s*(\d{4})\b/;

        const timeMatch = textContent.match(timeRegex);
        const dateMatch = textContent.match(dateRegex);

        // If the details page explicitly labels "Liftoff Time (GMT)" the time/date found are in GMT/UTC; use UTC.
        if (!timeMatch || !dateMatch) {
            return null;
        }

        const hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const second = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

        const monthName = dateMatch[1];
        const dayNumber = parseInt(dateMatch[2], 10);
        const yearNumber = parseInt(dateMatch[3], 10);

        const monthIndex = monthNameToIndex[monthName];

        // Construct a UTC timestamp because the details page shows liftoff in GMT.
        const timestampMilliseconds = Date.UTC(yearNumber, monthIndex, dayNumber, hour, minute, second);
        return timestampMilliseconds;
    }

    // Given a timestamp in ms, format T-/T+ string with days/hours/minutes/seconds
    function formatTimeDeltaToCountdownText(launchTimestampMilliseconds) {
        const nowMilliseconds = Date.now();
        const diffMilliseconds = launchTimestampMilliseconds - nowMilliseconds;
        const prefix = diffMilliseconds < 0 ? 'T+' : 'T-';
        const absoluteDiff = Math.abs(diffMilliseconds);

        const secondsTotal = Math.floor(absoluteDiff / 1000);
        const days = Math.floor(secondsTotal / (24 * 3600));
        const hours = Math.floor((secondsTotal % (24 * 3600)) / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = secondsTotal % 60;

        return `${prefix}${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Update all countdown elements on the page (single centralized updater)
    function updateAllCountdownNodes() {
        const countdownNodes = document.querySelectorAll('.' + countdownElementClassName);
        countdownNodes.forEach(node => {
            const launchTimestampString = node.getAttribute('data-launch-timestamp-ms');
            if (!launchTimestampString) return;
            const launchTimestampMilliseconds = parseInt(launchTimestampString, 10);
            const countdownText = formatTimeDeltaToCountdownText(launchTimestampMilliseconds);
            node.textContent = countdownText;
        });
    }

    // Process a single anchor element pointing to a launch details page
    function processLaunchAnchorElement(anchorElement) {
    // Only process launch detail anchors
    const href = anchorElement.getAttribute('href') || anchorElement.href;
    if (!href || !href.includes('/launches/details/')) return;

    // Avoid re-processing
    if (anchorElement.hasAttribute(processedDataAttributeName)) return;
    anchorElement.setAttribute(processedDataAttributeName, 'true');

    // Skip if this post already includes a countdown timer
    // Detection heuristic: look for any element that includes the text HOURS, MINS, or SECS inside this anchor
    const hasBuiltInCountdown = !!anchorElement.querySelector('p, div, span');
    if (hasBuiltInCountdown) {
        const textContent = anchorElement.textContent.toUpperCase();
        if (textContent.includes('HOURS') || textContent.includes('MINS') || textContent.includes('SECS')) {
            return; // skip adding custom countdown
        }
    }

    // Decide where to put the countdown visually: prefer a container inside the anchor that likely holds the metadata
    let insertionContainer = anchorElement.querySelector('div[class*="p-4"], div[class*="gap-2"], div[class*="pb-4"]');
    if (!insertionContainer) insertionContainer = anchorElement;

    // create node and attach
    const countdownNode = createAndAttachCountdownNode(insertionContainer);

    // Fetch the details page and attempt to extract a reliable timestamp
    const resolvedUrl = anchorElement.href;

    fetch(resolvedUrl, { method: 'GET', credentials: 'same-origin' })
        .then(response => response.text())
        .then(detailHtmlText => {
            const launchTimestampMilliseconds = extractLaunchTimestampFromDetailHtml(detailHtmlText);
            if (!launchTimestampMilliseconds) {
                countdownNode.textContent = 'Countdown unavailable';
                return;
            }
            countdownNode.setAttribute('data-launch-timestamp-ms', String(launchTimestampMilliseconds));
            const formattedText = formatTimeDeltaToCountdownText(launchTimestampMilliseconds);
            countdownNode.textContent = formattedText;
        });
}


    // Find all existing launch anchor elements and process them
    function processAllExistingLaunchAnchors() {
        // Select anchors that link to launch details on the site
        const candidateAnchors = Array.from(document.querySelectorAll('a[href*="/launches/details/"]'));
        candidateAnchors.forEach(anchor => processLaunchAnchorElement(anchor));
    }

    // Observe the DOM for added nodes that may contain new launch anchors (event-driven)
    const mutationObserver = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(record => {
            // Look for newly added nodes (subtree additions) and process any anchor descendants
            record.addedNodes.forEach(addedNode => {
                if (!(addedNode instanceof Element)) return;
                // If the added node itself is a launch anchor
                if (addedNode.matches && addedNode.matches('a[href*="/launches/details/"]')) {
                    processLaunchAnchorElement(addedNode);
                }
                // Or if the added node contains launch anchors deeper in the subtree
                const nestedLaunchAnchors = addedNode.querySelectorAll ? addedNode.querySelectorAll('a[href*="/launches/details/"]') : [];
                nestedLaunchAnchors.forEach(nestedAnchor => processLaunchAnchorElement(nestedAnchor));
            });
        });
    });

    // Start observing document body for additions
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Initial pass for anchors already present on load
    processAllExistingLaunchAnchors();

    // Single shared timer that updates visible countdowns once a second
    // Using a single timer minimizes overhead and satisfies "single centralized updater" style
    // Immediately update countdowns
updateAllCountdownNodes();

// Function to synchronize updates with system time
function scheduleSynchronizedUpdate() {
    // Run the update
    updateAllCountdownNodes();

    // Compute delay until the next full second boundary
    const nowMilliseconds = Date.now();
    const millisecondsUntilNextSecond = 1000 - (nowMilliseconds % 1000);

    // Schedule the next synchronized update
    setTimeout(scheduleSynchronizedUpdate, millisecondsUntilNextSecond);
}

// Align countdown updates precisely with system time
scheduleSynchronizedUpdate();


})();