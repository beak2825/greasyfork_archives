// ==UserScript==
// @name         Hide Members Only Filter and whitelist for youtube
// @namespace    http://tampermonkey.net/
// @version      2.91
// @description  Auto-hide "Members only" and "Members first" videos from untrusted channels on YouTube with a toggle to re-show/hide them. Optionally leave layout gap with config flag (handles sidebar safely too). Includes fallback logic for non-existent parent elements. Updated to handle change in YouTube sidebar. Added loop prevention with stable parent check and hiding attempts counter.
// @author       Aonnymous
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533290/Hide%20Members%20Only%20Filter%20and%20whitelist%20for%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/533290/Hide%20Members%20Only%20Filter%20and%20whitelist%20for%20youtube.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Config ===
    const WHITELIST = [
        'Linus Tech Tips',
        'Some Channel',
        'Trusted Creator'
    ];

    /**
     * LEAVE_BLANK_SPACE_WHEN_HIDDEN:
     * For channel page video/live tab
     * - true  => hides only video element (layout gap)
     * - false => tries to hide parent container (no layout gap),
     *            but still hides video if parent is unavailable
     */
    const LEAVE_BLANK_SPACE_WHEN_HIDDEN = true;

    const SCAN_INTERVAL_FAST = 2000;              // Every 2s for first minute
    const FAST_SCAN_DURATION = 60000;             // Fast mode for 1 minute
    const MAX_RUNS_PER_MINUTE = 4;                // Slow mode limit
    const DEBUG_BORDER_STYLE = '';   // no border on hidden
    const AUTO_ENABLE_DELAY_MS = 4500;            // Auto-start 4.5s in
    
    // === Loop Prevention Settings ===
    const STABLE_PARENT_DELAY_MS = 1500;          // Parent must exist for 1.5s before hiding
    const MAX_HIDE_ATTEMPTS = 4;                  // Max times to try hiding same element

    // === State ===
    let scanInterval = null;
    let filteringEnabled = false;
    let scanStartTime = null;
    let lastRunTimestamp = 0;
    let runsThisMinute = 0;
    let throttleLoggedThisMinute = false;         // Track if throttle log was shown

    // === Utilities ===

    const CLEANED_WHITELIST = WHITELIST.map(name => name.trim().toLowerCase());

    function log(...args) {
        console.log('[YT-MembersFilter]', ...args);
    }

    function isWhitelisted(name) {
        const lc = name.trim().toLowerCase();
        return CLEANED_WHITELIST.some(w => lc.indexOf(w) !== -1);
    }

    function getTopLevelVideoElements() {
        const sidebarVideos = Array.from(document.querySelectorAll('ytd-compact-video-renderer'))
            .filter(el => el.closest('ytd-compact-video-renderer') === el);

        const richItems = Array.from(document.querySelectorAll('div#content.style-scope.ytd-rich-item-renderer'));

        // New layout: yt-lockup-view-model elements
        const newLayoutItems = Array.from(document.querySelectorAll('yt-lockup-view-model'));

        return [...sidebarVideos, ...richItems, ...newLayoutItems];
    }

    function getChannelNameFromElement(vid) {
        // Try old layout first
        const oldLayoutChannel = vid.querySelector('.ytd-channel-name');
        if (oldLayoutChannel?.textContent?.trim()) {
            return oldLayoutChannel.textContent.trim();
        }

        // Try new layout with yt-content-metadata-view-model
        const newLayoutChannel = vid.querySelector('.yt-content-metadata-view-model__metadata-text');
        if (newLayoutChannel?.textContent?.trim()) {
            return newLayoutChannel.textContent.trim();
        }

        // Fallback: search for any text that looks like a channel name
        const text = vid.textContent || '';
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length > 1) {
            return lines[1]; // Channel name is often second line
        }

        return '';
    }

    function hasMembersOnlyBadge(vid) {
        // Check for "Members only" or "Members first" text anywhere in the element
        const textContent = vid.textContent || '';
        if (textContent.includes('Members only') || textContent.includes('Members first')) {
            return true;
        }

        // Check for new layout badge specifically
        const badgeTexts = vid.querySelectorAll('.yt-badge-shape__text');
        for (const badge of badgeTexts) {
            const badgeText = badge.textContent?.trim();
            if (badgeText === 'Members only' || badgeText === 'Members first') {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if an element's parent has been stable long enough to process.
     * This prevents hiding elements that are still loading/rendering.
     */
    function isParentStable(element) {
        const parent = element.parentElement;
        if (!parent) return false;

        const now = Date.now();
        const firstSeen = parseInt(parent.dataset._ytFirstSeen || '0');
        
        if (!firstSeen) {
            // First time seeing this parent - mark it and return false (not stable yet)
            parent.dataset._ytFirstSeen = now.toString();
            return false;
        }
        
        return (now - firstSeen) > STABLE_PARENT_DELAY_MS;
    }

    /**
     * Checks if we've attempted to hide this element too many times.
     * Prevents infinite loops with re-rendering elements.
     */
    function hasExceededHideAttempts(element) {
        const attempts = parseInt(element.dataset._ytHideAttempts || '0');
        const exceeded = attempts >= MAX_HIDE_ATTEMPTS;
        
        // Log only the first time this element hits the limit
        if (exceeded && attempts === MAX_HIDE_ATTEMPTS) {
            log(`Hide attempts limit reached for element (${MAX_HIDE_ATTEMPTS} attempts), will skip future attempts`);
        }
        
        return exceeded;
    }

    /**
     * Increments the hide attempts counter for an element.
     */
    function incrementHideAttempts(element) {
        const current = parseInt(element.dataset._ytHideAttempts || '0');
        element.dataset._ytHideAttempts = (current + 1).toString();
    }

    /**
     * Resets all loop prevention state (first-seen timestamps and hide attempts).
     * Called when filtering is disabled or page navigation is detected.
     */
    function resetLoopPreventionState() {
        // Clear first-seen timestamps
        document.querySelectorAll('[data-_yt-first-seen]').forEach(el => {
            delete el.dataset._ytFirstSeen;
        });
        
        // Clear hide attempts counters
        document.querySelectorAll('[data-_yt-hide-attempts]').forEach(el => {
            delete el.dataset._ytHideAttempts;
        });
        
        log('Loop prevention state reset.');
    }

    function scanAndHide() {
        const now = Date.now();
        const inFastMode = now - scanStartTime < FAST_SCAN_DURATION;

        if (!inFastMode) {
            // Reset throttle logging when minute rolls over
            if (now - lastRunTimestamp > 60000) {
                runsThisMinute = 0;
                lastRunTimestamp = now;
                throttleLoggedThisMinute = false; // Reset throttle log flag for new minute
            }

            if (runsThisMinute >= MAX_RUNS_PER_MINUTE) {
                // Log only once per minute when throttle limit is hit
                if (!throttleLoggedThisMinute) {
                    log(`Throttled: reached max scans this minute (${MAX_RUNS_PER_MINUTE}). Resuming in next minute.`);
                    throttleLoggedThisMinute = true;
                }
                return;
            }

            runsThisMinute++;
        }

        const videos = getTopLevelVideoElements();

        if (!videos.length) {
            log('No video elements found.');
            return;
        }

        let hiddenCount = 0;

        videos.forEach(vid => {
            // Skip if already hidden by this script
            if (vid.dataset._ytMembersFiltered === 'true') return;

            // Loop prevention: skip if we've tried to hide this too many times
            if (hasExceededHideAttempts(vid)) {
                return;
            }

            // Loop prevention: skip if parent isn't stable yet
            if (!isParentStable(vid)) {
                return;
            }

            if (!hasMembersOnlyBadge(vid)) return;

            const channelName = getChannelNameFromElement(vid);

            if (!isWhitelisted(channelName)) {
                // Increment hide attempts counter
                incrementHideAttempts(vid);

                // Always hide the video element
                vid.style.display = 'none';
                vid.style.border = DEBUG_BORDER_STYLE;
                vid.dataset._ytMembersFiltered = 'true';

                if (!LEAVE_BLANK_SPACE_WHEN_HIDDEN) {
                    // Try to hide the parent (to leave blank space), but catch any errors
                    try {
                        const parentRenderer = vid.closest('ytd-rich-item-renderer, yt-lockup-view-model');
                        if (parentRenderer) {
                            parentRenderer.hidden = true;
                            parentRenderer.style.border = DEBUG_BORDER_STYLE;
                            parentRenderer.dataset._ytMembersFiltered = 'true';
                        }
                    } catch (err) {
                        log('Could not hide parent element:', err);
                    }
                }

                hiddenCount++;
                log(`Hid video from: "${channelName}" (attempt ${vid.dataset._ytHideAttempts})`);
            } else {
                log(`Whitelisted video from: "${channelName}"`);
            }
        });

        if (hiddenCount) {
            log(`Hidden videos this scan: ${hiddenCount}`);
        }
    }

    function startScanning() {
        if (scanInterval) clearInterval(scanInterval);
        scanStartTime = Date.now();
        runsThisMinute = 0;
        lastRunTimestamp = 0;
        throttleLoggedThisMinute = false; // Reset throttle logging state

        scanInterval = setInterval(scanAndHide, SCAN_INTERVAL_FAST);
        log('Started scanning every 2s for 1 minute...');

        setTimeout(() => {
            if (scanInterval) clearInterval(scanInterval);
            log('Fast scan finished. Throttled scanning active.');
            scanInterval = setInterval(scanAndHide, 15000);
        }, FAST_SCAN_DURATION);
    }

    function stopScanningAndShowAll() {
        if (scanInterval) clearInterval(scanInterval);
        scanInterval = null;

        const hiddenEls = document.querySelectorAll('[data-_yt-members-filtered="true"]');
        hiddenEls.forEach(el => {
            el.style.display = '';
            el.style.border = '';
            el.hidden = false;
            delete el.dataset._ytMembersFiltered;
        });

        // Reset loop prevention state when manually disabled
        resetLoopPreventionState();
        
        log('Stopped scanning and revealed previously hidden videos.');
    }

    function toggleFiltering() {
        filteringEnabled = !filteringEnabled;

        if (filteringEnabled) {
            log('Filtering ENABLED.');
            startScanning();
        } else {
            log('Filtering DISABLED.');
            stopScanningAndShowAll();
        }
    }

    // === Navigation Detection ===
    // Reset loop prevention state on page navigation to handle new content
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            resetLoopPreventionState();
            log('Page navigation detected, reset loop prevention state.');
        }
    }).observe(document, {subtree: true, childList: true});

    // === Tampermonkey Menu ===
    GM_registerMenuCommand('Toggle Member Filter On/Off', toggleFiltering);

    // === Auto Start After Delay ===
    setTimeout(() => {
        if (!filteringEnabled) {
            filteringEnabled = true;
            log('Auto-starting filtering after delay...');
            startScanning();
        }
    }, AUTO_ENABLE_DELAY_MS);

    log('YouTube Member Filter script loaded. Will auto-start in ~4.5s. Toggle anytime via Tampermonkey menu.');
})();