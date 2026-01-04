// ==UserScript==
// @name         8chan Spoiler Thumbnail Enhancer
// @namespace    nipah-scripts-8chan
// @version      2.5.0
// @description  Pre-sizes spoiler images, shows thumbnail (original on hover, or blurred/unblurred on hover), with dynamic settings updates via SettingsTabManager.
// @author       nipah, Gemini
// @license      MIT
// @match        https://8chan.moe/*
// @match        https://8chan.se/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533302/8chan%20Spoiler%20Thumbnail%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/533302/8chan%20Spoiler%20Thumbnail%20Enhancer.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_ID = 'SpoilerEnh'; // Unique ID for settings, attributes, classes
    const SCRIPT_VERSION = '2.2.0';
    const DEBUG_MODE = false; // Set to true for more verbose logging

    // --- Constants ---
    const DEFAULT_SETTINGS = Object.freeze({
        thumbnailMode: 'spoiler', // 'spoiler' or 'blurred'
        blurAmount: 5,            // Pixels for blur effect
        disableHoverWhenBlurred: false, // Prevent unblurring on hover in blurred mode
    });
    const GM_SETTINGS_KEY = `${SCRIPT_ID}_Settings`;

    // --- Data Attributes ---
    // Tracks the overall processing state of an image link
    const ATTR_PROCESSED_STATE = `data-${SCRIPT_ID.toLowerCase()}-processed`;
    // Tracks the state of fetching spoiler dimensions from its thumbnail
    const ATTR_DIMENSION_STATE = `data-${SCRIPT_ID.toLowerCase()}-dims-state`;
    // Stores the calculated thumbnail URL directly on the link element
    const ATTR_THUMBNAIL_URL = `data-${SCRIPT_ID.toLowerCase()}-thumb-url`;
    // Tracks if event listeners have been attached to avoid duplicates
    const ATTR_LISTENERS_ATTACHED = `data-${SCRIPT_ID.toLowerCase()}-listeners`;

    // --- CSS Classes ---
    const CLASS_REVEAL_THUMBNAIL = `${SCRIPT_ID}-revealThumbnail`; // Temporary thumbnail shown on hover (spoiler mode) or blurred preview
    const CLASS_BLUR_WRAPPER = `${SCRIPT_ID}-blurWrapper`;       // Wrapper for the blurred thumbnail to handle sizing and overflow

    // --- Selectors ---
    const SELECTORS = Object.freeze({
        // Matches standard 8chan spoiler images and common custom spoiler names
        SPOILER_IMG: `img[src="/spoiler.png"], img[src$="/custom.spoiler"]`,
        // The anchor tag wrapping the spoiler image
        IMG_LINK: 'a.imgLink',
        // Selector for the dynamically created blur wrapper div
        BLUR_WRAPPER: `.${CLASS_BLUR_WRAPPER}`,
        // Selector for the thumbnail image (used in both modes, potentially temporarily)
        REVEAL_THUMBNAIL: `img.${CLASS_REVEAL_THUMBNAIL}`, // More specific selector using tag + class
    });

    // --- Global State ---
    let scriptSettings = { ...DEFAULT_SETTINGS };

    // --- Utility Functions ---
    const log = (...args) => console.log(`[${SCRIPT_ID}]`, ...args);
    const debugLog = (...args) => DEBUG_MODE && console.log(`[${SCRIPT_ID} Debug]`, ...args);
    const warn = (...args) => console.warn(`[${SCRIPT_ID}]`, ...args);
    const error = (...args) => console.error(`[${SCRIPT_ID}]`, ...args);

    /**
     * Extracts the image hash from a full image URL.
     * @param {string | null} imageUrl The full URL of the image.
     * @returns {string | null} The extracted hash or null if parsing fails.
     */
    function getHashFromImageUrl(imageUrl) {
        if (!imageUrl) return null;
        try {
            // Prefer URL parsing for robustness
            const url = new URL(imageUrl);
            const filename = url.pathname.split('/').pop();
            if (!filename) return null;
            // Hash is typically the part before the first dot
            const hash = filename.split('.')[0];
            return hash || null;
        } catch (e) {
            // Fallback for potentially invalid URLs or non-standard paths
            warn("Could not parse image URL with URL API, falling back:", imageUrl, e);
            const parts = imageUrl.split('/');
            const filename = parts.pop();
            if (!filename) return null;
            const hash = filename.split('.')[0];
            return hash || null;
        }
    }

    /**
     * Constructs the thumbnail URL based on the full image URL and hash.
     * Assumes 8chan's '/path/to/image/HASH.ext' and '/path/to/image/t_HASH' structure.
     * @param {string | null} fullImageUrl The full URL of the image.
     * @param {string | null} hash The image hash.
     * @returns {string | null} The constructed thumbnail URL or null.
     */
    function getThumbnailUrl(fullImageUrl, hash) {
        if (!fullImageUrl || !hash) return null;
        try {
            // Prefer URL parsing
            const url = new URL(fullImageUrl);
            const pathParts = url.pathname.split('/');
            pathParts.pop(); // Remove filename
            const basePath = pathParts.join('/') + '/';
            // Construct new URL relative to the origin
            return new URL(basePath + 't_' + hash, url.origin).toString();
        } catch (e) {
            // Fallback for potentially invalid URLs
            warn("Could not construct thumbnail URL with URL API, falling back:", fullImageUrl, hash, e);
            const parts = fullImageUrl.split('/');
            parts.pop(); // Remove filename
            const basePath = parts.join('/') + '/';
            // Basic string concatenation fallback (might lack origin if relative)
            return basePath + 't_' + hash;
        }
    }

    /**
     * Validates raw settings data against defaults, ensuring correct types and ranges.
     * @param {object} settingsToValidate - The raw settings object (e.g., from GM.getValue).
     * @returns {object} A validated settings object.
     */
    function validateSettings(settingsToValidate) {
        const validated = {};
        const source = { ...DEFAULT_SETTINGS, ...settingsToValidate }; // Merge with defaults first

        validated.thumbnailMode = (source.thumbnailMode === 'spoiler' || source.thumbnailMode === 'blurred')
            ? source.thumbnailMode
            : DEFAULT_SETTINGS.thumbnailMode;

        validated.blurAmount = (typeof source.blurAmount === 'number' && source.blurAmount >= 0 && source.blurAmount <= 50) // Increased max blur slightly
            ? source.blurAmount
            : DEFAULT_SETTINGS.blurAmount;

        validated.disableHoverWhenBlurred = (typeof source.disableHoverWhenBlurred === 'boolean')
            ? source.disableHoverWhenBlurred
            : DEFAULT_SETTINGS.disableHoverWhenBlurred;

        return validated;
    }


    // --- Settings Module ---
    // Manages loading, saving, and accessing script settings.
    const Settings = {
        /** Loads settings from storage, validates them, and updates the global state. */
        async load() {
            try {
                const storedSettings = await GM.getValue(GM_SETTINGS_KEY, {});
                scriptSettings = validateSettings(storedSettings);
                log('Settings loaded:', scriptSettings);
            } catch (e) {
                warn('Failed to load settings, using defaults.', e);
                scriptSettings = { ...DEFAULT_SETTINGS }; // Reset to defaults on error
            }
        },

        /** Saves the current global settings state to storage after validation. */
        async save() {
            try {
                // Always validate before saving
                const settingsToSave = validateSettings(scriptSettings);
                await GM.setValue(GM_SETTINGS_KEY, settingsToSave);
                log('Settings saved.');
            } catch (e) {
                error('Failed to save settings.', e);
                // Consider notifying the user here if appropriate
                throw e; // Re-throw for the caller (e.g., save button handler)
            }
        },

        // --- Getters for accessing current settings ---
        getThumbnailMode: () => scriptSettings.thumbnailMode,
        getBlurAmount: () => scriptSettings.blurAmount,
        getDisableHoverWhenBlurred: () => scriptSettings.disableHoverWhenBlurred,

        // --- Setters for updating global settings state (used by UI before saving) ---
        setThumbnailMode: (mode) => { scriptSettings.thumbnailMode = mode; },
        setBlurAmount: (amount) => { scriptSettings.blurAmount = amount; },
        setDisableHoverWhenBlurred: (isDisabled) => { scriptSettings.disableHoverWhenBlurred = isDisabled; },
    };


    // --- Image Style Manipulation ---

    /**
     * Applies the current blur setting to an element.
     * @param {HTMLElement} element - The element to blur.
     */
    function applyBlur(element) {
         const blurAmount = Settings.getBlurAmount();
         element.style.filter = `blur(${blurAmount}px)`;
         element.style.willChange = 'filter'; // Hint for performance
         debugLog('Applied blur:', blurAmount, element);
    }

    /**
     * Removes blur from an element.
     * @param {HTMLElement} element - The element to unblur.
     */
    function removeBlur(element) {
         element.style.filter = 'none';
         element.style.willChange = 'auto';
         debugLog('Removed blur:', element);
    }


    // --- Image Structure Management ---

    /**
     * Fetches thumbnail dimensions and applies them to the spoiler image.
     * Avoids layout shifts by pre-sizing the spoiler placeholder.
     * @param {HTMLImageElement} spoilerImg - The original spoiler image element.
     * @param {string} thumbnailUrl - The URL of the corresponding thumbnail.
     */
    function setSpoilerDimensionsFromThumbnail(spoilerImg, thumbnailUrl) {
        // Use a more descriptive attribute name if possible, but keep current for compatibility
        const currentState = spoilerImg.getAttribute(ATTR_DIMENSION_STATE);
        if (!spoilerImg || currentState === 'success' || currentState === 'pending') {
            debugLog('Skipping dimension setting (already done or pending):', spoilerImg);
            return; // Avoid redundant work or race conditions
        }

        if (!thumbnailUrl) {
            spoilerImg.setAttribute(ATTR_DIMENSION_STATE, 'failed-no-thumb-url');
            warn('Cannot set dimensions: no thumbnail URL provided for spoiler:', spoilerImg.closest('a')?.href);
            return;
        }

        spoilerImg.setAttribute(ATTR_DIMENSION_STATE, 'pending');
        debugLog('Attempting to set dimensions from thumbnail:', thumbnailUrl);

        const tempImg = new Image();

        const cleanup = () => {
            tempImg.removeEventListener('load', loadHandler);
            tempImg.removeEventListener('error', errorHandler);
        };

        const loadHandler = () => {
             if (tempImg.naturalWidth > 0 && tempImg.naturalHeight > 0) {
                 spoilerImg.width = tempImg.naturalWidth;  // Set explicit dimensions
                 spoilerImg.height = tempImg.naturalHeight;
                 spoilerImg.setAttribute(ATTR_DIMENSION_STATE, 'success');
                 log('Spoiler dimensions set from thumbnail:', spoilerImg.width, 'x', spoilerImg.height);
             } else {
                 warn(`Thumbnail loaded with zero dimensions: ${thumbnailUrl}`);
                 spoilerImg.setAttribute(ATTR_DIMENSION_STATE, 'failed-zero-dim');
             }
             cleanup();
        };

        const errorHandler = (errEvent) => {
             warn(`Failed to load thumbnail for dimension setting: ${thumbnailUrl}`, errEvent);
             spoilerImg.setAttribute(ATTR_DIMENSION_STATE, 'failed-load-error');
             cleanup();
        };

        tempImg.addEventListener('load', loadHandler);
        tempImg.addEventListener('error', errorHandler);

        try {
            // Set src to start loading
            tempImg.src = thumbnailUrl;
        } catch (e) {
            error("Error assigning src for dimension check:", thumbnailUrl, e);
            spoilerImg.setAttribute(ATTR_DIMENSION_STATE, 'failed-src-assign');
            cleanup(); // Ensure cleanup even if src assignment fails
        }
    }

    /**
     * Creates or updates the necessary DOM structure for the 'blurred' mode.
     * Hides the original spoiler and shows a blurred thumbnail.
     * @param {HTMLAnchorElement} imgLink - The parent anchor element.
     * @param {HTMLImageElement} spoilerImg - The original spoiler image.
     * @param {string} thumbnailUrl - The thumbnail URL.
     */
    function ensureBlurredStructure(imgLink, spoilerImg, thumbnailUrl) {
        let blurWrapper = imgLink.querySelector(SELECTORS.BLUR_WRAPPER);
        let revealThumbnail = imgLink.querySelector(SELECTORS.REVEAL_THUMBNAIL);

        // --- Structure Check and Cleanup ---
        // If elements exist but aren't nested correctly, remove them to rebuild
        if (revealThumbnail && (!blurWrapper || !blurWrapper.contains(revealThumbnail))) {
            debugLog('Incorrect blurred structure found, removing orphan thumbnail.');
            revealThumbnail.remove();
            revealThumbnail = null; // Reset variable
        }
        if (blurWrapper && !revealThumbnail) { // Wrapper exists but no image inside? Rebuild.
             debugLog('Incorrect blurred structure found, removing empty wrapper.');
             blurWrapper.remove();
             blurWrapper = null; // Reset variable
        }

        // --- Create or Update Structure ---
        if (!blurWrapper) {
            debugLog('Creating blur wrapper and thumbnail for:', imgLink.href);
            blurWrapper = document.createElement('div');
            blurWrapper.className = CLASS_BLUR_WRAPPER;
            blurWrapper.style.overflow = 'hidden';
            blurWrapper.style.display = 'inline-block'; // Match image display
            blurWrapper.style.lineHeight = '0';         // Prevent extra space below image
            blurWrapper.style.visibility = 'hidden';    // Hide until loaded and sized

            revealThumbnail = document.createElement('img');
            revealThumbnail.className = CLASS_REVEAL_THUMBNAIL;
            revealThumbnail.style.display = 'block'; // Ensure it fills wrapper correctly

            const cleanup = () => {
                 revealThumbnail.removeEventListener('load', loadHandler);
                 revealThumbnail.removeEventListener('error', errorHandler);
            };

            const loadHandler = () => {
                if (revealThumbnail.naturalWidth > 0 && revealThumbnail.naturalHeight > 0) {
                    const w = revealThumbnail.naturalWidth;
                    const h = revealThumbnail.naturalHeight;

                    // Set size on wrapper and image
                    blurWrapper.style.width = `${w}px`;
                    blurWrapper.style.height = `${h}px`;
                    revealThumbnail.width = w;
                    revealThumbnail.height = h;

                    applyBlur(revealThumbnail); // Apply blur *after* loading and sizing

                    blurWrapper.style.visibility = 'visible'; // Show it now
                    spoilerImg.style.display = 'none';       // Hide original spoiler
                    imgLink.setAttribute(ATTR_PROCESSED_STATE, 'processed-blurred');
                    debugLog('Blurred thumbnail structure created successfully.');
                } else {
                    warn('Blurred thumbnail loaded with zero dimensions:', thumbnailUrl);
                    blurWrapper.remove();                  // Clean up failed elements
                    spoilerImg.style.display = '';         // Show spoiler again
                    imgLink.setAttribute(ATTR_PROCESSED_STATE, 'failed-blurred-zero-dims');
                }
                cleanup();
            };

            const errorHandler = () => {
                warn(`Failed to load blurred thumbnail: ${thumbnailUrl}`);
                blurWrapper.remove();                      // Clean up failed elements
                spoilerImg.style.display = '';             // Show spoiler again
                imgLink.setAttribute(ATTR_PROCESSED_STATE, 'failed-blurred-thumb-load');
                cleanup();
            };

            revealThumbnail.addEventListener('load', loadHandler);
            revealThumbnail.addEventListener('error', errorHandler);

            blurWrapper.appendChild(revealThumbnail);
            // Insert the wrapper before the original spoiler image
            imgLink.insertBefore(blurWrapper, spoilerImg);

            try {
                revealThumbnail.src = thumbnailUrl;
            } catch (e) {
                 error("Error assigning src to blurred thumbnail:", thumbnailUrl, e);
                 errorHandler(); // Trigger error handling manually
            }

        } else {
            // Structure exists, just ensure blur is correct and elements are visible
            debugLog('Blurred structure already exists, ensuring blur and visibility.');
            if (revealThumbnail) applyBlur(revealThumbnail); // Re-apply current blur amount
            spoilerImg.style.display = 'none';
            blurWrapper.style.display = 'inline-block';
            // Ensure state attribute reflects current mode
            imgLink.setAttribute(ATTR_PROCESSED_STATE, 'processed-blurred');
        }
    }

    /**
     * Ensures the 'spoiler' mode structure is active.
     * Removes any blurred elements and ensures the original spoiler image is visible.
     * Also triggers dimension setting if needed.
     * @param {HTMLAnchorElement} imgLink - The parent anchor element.
     * @param {HTMLImageElement} spoilerImg - The original spoiler image.
     * @param {string} thumbnailUrl - The thumbnail URL (needed for dimension setting).
     */
    function ensureSpoilerStructure(imgLink, spoilerImg, thumbnailUrl) {
        const blurWrapper = imgLink.querySelector(SELECTORS.BLUR_WRAPPER);
        if (blurWrapper) {
            debugLog('Removing blurred structure for:', imgLink.href);
            blurWrapper.remove(); // Removes wrapper and its contents (revealThumbnail)
        }

        // Ensure the original spoiler image is visible
        spoilerImg.style.display = ''; // Reset to default display

        // Ensure dimensions are set (might switch before initial dimension setting completed)
        // This function has internal checks to prevent redundant work.
        setSpoilerDimensionsFromThumbnail(spoilerImg, thumbnailUrl);

        imgLink.setAttribute(ATTR_PROCESSED_STATE, 'processed-spoiler');
        debugLog('Ensured spoiler structure for:', imgLink.href);
    }

    /**
     * Dynamically updates the visual appearance of a single image link
     * based on the current script settings (mode, blur amount).
     * This is called during initial processing and when settings change.
     * @param {HTMLAnchorElement} imgLink - The image link element to update.
     */
    function updateImageAppearance(imgLink) {
        if (!imgLink || !imgLink.matches(SELECTORS.IMG_LINK)) return;

        const spoilerImg = imgLink.querySelector(SELECTORS.SPOILER_IMG);
        if (!spoilerImg) {
            // This link doesn't have a spoiler, state should reflect this
            if (!imgLink.hasAttribute(ATTR_PROCESSED_STATE)) {
                imgLink.setAttribute(ATTR_PROCESSED_STATE, 'skipped-no-spoiler');
            }
            return;
        }

        const thumbnailUrl = imgLink.getAttribute(ATTR_THUMBNAIL_URL);
        if (!thumbnailUrl) {
            // This is unexpected if processing reached this point, but handle defensively
            warn("Cannot update appearance, missing thumbnail URL attribute on:", imgLink.href);
            // Mark as failed if not already processed otherwise
             if (!imgLink.hasAttribute(ATTR_PROCESSED_STATE) || imgLink.getAttribute(ATTR_PROCESSED_STATE) === 'processing') {
                 imgLink.setAttribute(ATTR_PROCESSED_STATE, 'failed-missing-thumb-attr');
             }
            return;
        }

        const currentMode = Settings.getThumbnailMode();
        debugLog(`Updating appearance for ${imgLink.href} to mode: ${currentMode}`);

        if (currentMode === 'blurred') {
            ensureBlurredStructure(imgLink, spoilerImg, thumbnailUrl);
        } else { // mode === 'spoiler'
            ensureSpoilerStructure(imgLink, spoilerImg, thumbnailUrl);
        }

        // If switching TO blurred mode OR blur amount changed while blurred, ensure blur is applied.
        // The ensureBlurredStructure function already calls applyBlur, so this check might be slightly redundant,
        // but it catches cases where the user is hovering WHILE changing settings.
        const revealThumbnail = imgLink.querySelector(SELECTORS.REVEAL_THUMBNAIL);
        if (currentMode === 'blurred' && revealThumbnail) {
            // Re-apply blur in case it was removed by a hover event that hasn't triggered mouseleave yet
            applyBlur(revealThumbnail);
        }
    }


    // --- Event Handlers ---

    /** Checks if the image link's container is in an expanded state. */
    function isImageExpanded(imgLink) {
        // Find the closest ancestor figure element
        const figure = imgLink.closest('figure.uploadCell');
        // Check if the figure exists and has the 'expandedCell' class
        const isExpanded = figure && figure.classList.contains('expandedCell');
        if (isExpanded) {
             debugLog(`Image container for ${imgLink.href} is expanded.`);
        }
        return isExpanded;
    }


    /** Handles mouse entering the image link area. */
    function handleLinkMouseEnter(event) {
        const imgLink = event.currentTarget;

        // *** ADD THIS CHECK ***
        // If the image is already expanded by 8chan's logic, do nothing.
        if (isImageExpanded(imgLink)) {
            return;
        }
        // *** END CHECK ***

        const mode = Settings.getThumbnailMode();
        const thumbnailUrl = imgLink.getAttribute(ATTR_THUMBNAIL_URL);
        const spoilerImg = imgLink.querySelector(SELECTORS.SPOILER_IMG);

        // Essential elements must exist
        if (!thumbnailUrl || !spoilerImg) return;

        debugLog('Mouse Enter (Non-Expanded):', imgLink.href, 'Mode:', mode);

        if (mode === 'spoiler') {
            // Show original thumbnail temporarily
            if (imgLink.querySelector(SELECTORS.REVEAL_THUMBNAIL)) return; // Avoid duplicates

            const revealThumbnail = document.createElement('img');
            revealThumbnail.src = thumbnailUrl;
            revealThumbnail.className = CLASS_REVEAL_THUMBNAIL;
            revealThumbnail.style.display = 'block';

            if (spoilerImg.width > 0 && spoilerImg.getAttribute(ATTR_DIMENSION_STATE) === 'success') {
                 revealThumbnail.width = spoilerImg.width;
                 revealThumbnail.height = spoilerImg.height;
                 debugLog('Applying spoiler dims to hover thumb:', spoilerImg.width, spoilerImg.height);
             } else if (spoilerImg.offsetWidth > 0) {
                 revealThumbnail.style.width = `${spoilerImg.offsetWidth}px`;
                 revealThumbnail.style.height = `${spoilerImg.offsetHeight}px`;
                 debugLog('Applying spoiler offset dims to hover thumb:', spoilerImg.offsetWidth, spoilerImg.offsetHeight);
             }

            imgLink.insertBefore(revealThumbnail, spoilerImg);
            // *** IMPORTANT: Set display to none ***
            spoilerImg.style.display = 'none';

        } else if (mode === 'blurred') {
            if (Settings.getDisableHoverWhenBlurred()) return;
            const revealThumbnail = imgLink.querySelector(SELECTORS.REVEAL_THUMBNAIL);
            if (revealThumbnail) {
                removeBlur(revealThumbnail);
            }
        }
    }

    /** Handles mouse leaving the image link area. */
    function handleLinkMouseLeave(event) {
        const imgLink = event.currentTarget;

        // *** ADD THIS CHECK ***
        // If the image is already expanded by 8chan's logic, do nothing.
        // The expansion logic handles visibility, we should not interfere.
        if (isImageExpanded(imgLink)) {
            return;
        }
        // *** END CHECK ***


        const mode = Settings.getThumbnailMode();
        debugLog('Mouse Leave (Non-Expanded):', imgLink.href, 'Mode:', mode);

        if (mode === 'spoiler') {
            // Find the temporary hover thumbnail
            const revealThumbnail = imgLink.querySelector(`img.${CLASS_REVEAL_THUMBNAIL}`);

            // Only perform cleanup if the hover thumbnail exists (meaning mouseenter completed)
            if (revealThumbnail) {
                revealThumbnail.remove();

                const spoilerImg = imgLink.querySelector(SELECTORS.SPOILER_IMG);
                if (spoilerImg) {
                    // Restore spoiler visibility *only if* it's currently hidden by our script
                    if (spoilerImg.style.display === 'none') {
                        debugLog('Restoring spoilerImg visibility after hover (non-expanded).');
                        spoilerImg.style.display = ''; // Reset display
                    } else {
                        debugLog('SpoilerImg display was not "none" during non-expanded mouseleave cleanup.');
                    }
                }
            }
            // If revealThumbnail wasn't found (e.g., rapid mouse out before enter completed fully),
            // we don't need to do anything, as the spoiler should still be visible.

        } else if (mode === 'blurred') {
            // Re-apply blur
            const blurredThumbnail = imgLink.querySelector(SELECTORS.BLUR_WRAPPER + ' .' + CLASS_REVEAL_THUMBNAIL);
            if (blurredThumbnail) {
                applyBlur(blurredThumbnail);
            }
        }
    }

    // --- Content Processing & Observation ---

    /**
     * Processes a single image link element if it hasn't been processed yet.
     * Fetches metadata, attaches listeners, and sets initial appearance.
     * @param {HTMLAnchorElement} imgLink - The image link element.
     */
    function processImgLink(imgLink) {
        // Check if already processed or currently processing
        if (!imgLink || imgLink.hasAttribute(ATTR_PROCESSED_STATE)) {
             // Allow re-running updateImageAppearance even if processed
             if (imgLink?.getAttribute(ATTR_PROCESSED_STATE)?.startsWith('processed-')) {
                 debugLog('Link already processed, potentially re-applying appearance:', imgLink.href);
                 updateImageAppearance(imgLink); // Ensure appearance matches current settings
             }
             return;
        }

        const spoilerImg = imgLink.querySelector(SELECTORS.SPOILER_IMG);
        if (!spoilerImg) {
            // Mark as skipped only if it wasn't processed before
            imgLink.setAttribute(ATTR_PROCESSED_STATE, 'skipped-no-spoiler');
            return;
        }

        // Mark as processing to prevent duplicate runs from observer/initial scan
        imgLink.setAttribute(ATTR_PROCESSED_STATE, 'processing');
        debugLog('Processing link:', imgLink.href);

        // --- Metadata Acquisition (Done only once) ---
        const fullImageUrl = imgLink.href;
        const hash = getHashFromImageUrl(fullImageUrl);
        if (!hash) {
            warn('Failed to get hash for:', fullImageUrl);
            imgLink.setAttribute(ATTR_PROCESSED_STATE, 'failed-no-hash');
            return;
        }

        const thumbnailUrl = getThumbnailUrl(fullImageUrl, hash);
        if (!thumbnailUrl) {
            warn('Failed to get thumbnail URL for:', fullImageUrl, hash);
            imgLink.setAttribute(ATTR_PROCESSED_STATE, 'failed-no-thumb-url');
            return;
        }

        // Store the thumbnail URL on the element for easy access later
        imgLink.setAttribute(ATTR_THUMBNAIL_URL, thumbnailUrl);
        debugLog(`Stored thumb URL: ${thumbnailUrl}`);

        // --- Attach Event Listeners (Done only once) ---
        if (!imgLink.hasAttribute(ATTR_LISTENERS_ATTACHED)) {
            imgLink.addEventListener('mouseenter', handleLinkMouseEnter);
            imgLink.addEventListener('mouseleave', handleLinkMouseLeave);
            imgLink.setAttribute(ATTR_LISTENERS_ATTACHED, 'true');
            debugLog('Attached event listeners.');
        }

        // --- Set Initial Appearance based on current settings ---
        // This function also sets the final 'processed-*' state attribute
        updateImageAppearance(imgLink);

        // Dimension setting is triggered within updateImageAppearance -> ensureSpoilerStructure if needed
    }

    /**
     * Scans a container element for unprocessed spoiler image links and processes them.
     * @param {Node} container - The DOM node (usually an Element) to scan within.
     */
    function processContainer(container) {
        if (!container || typeof container.querySelectorAll !== 'function') return;

        // Select links that contain a spoiler image and are *not yet processed*
        // This selector is more specific upfront.
        const imgLinks = container.querySelectorAll(
            `${SELECTORS.IMG_LINK}:not([${ATTR_PROCESSED_STATE}]) ${SELECTORS.SPOILER_IMG}`
        );

        if (imgLinks.length > 0) {
            debugLog(`Found ${imgLinks.length} potential new spoilers in container:`, container.nodeName);
            // Get the parent link element for each found spoiler image
            imgLinks.forEach(spoiler => {
                const link = spoiler.closest(SELECTORS.IMG_LINK);
                if (link) {
                    processImgLink(link);
                } else {
                    warn("Found spoiler image without parent imgLink:", spoiler);
                }
            });
        }
         // Additionally, check links that might have failed processing previously and could be retried
         // (Example: maybe a network error prevented thumb loading before) - This might be too aggressive.
         // For now, stick to processing only newly added/unprocessed links.
    }

    // --- Settings Panel UI (STM Integration) ---

    // Cache for panel DOM elements to avoid repeated queries
    let panelElementsCache = {};

    // Unique IDs for elements within the settings panel
    const PANEL_IDS = Object.freeze({
        MODE_SPOILER: `${SCRIPT_ID}-mode-spoiler`,
        MODE_BLURRED: `${SCRIPT_ID}-mode-blurred`,
        BLUR_OPTIONS: `${SCRIPT_ID}-blur-options`,
        BLUR_AMOUNT_LABEL: `${SCRIPT_ID}-blur-amount-label`,
        BLUR_SLIDER: `${SCRIPT_ID}-blur-amount`,
        BLUR_VALUE: `${SCRIPT_ID}-blur-value`,
        DISABLE_HOVER_CHECKBOX: `${SCRIPT_ID}-disable-hover`,
        DISABLE_HOVER_LABEL: `${SCRIPT_ID}-disable-hover-label`,
        SAVE_BUTTON: `${SCRIPT_ID}-save-settings`,
        SAVE_STATUS: `${SCRIPT_ID}-save-status`,
    });

    // CSS for the settings panel (scoped via STM panel ID)
    function getSettingsPanelCSS(stmPanelId) {
        return `
        #${stmPanelId} > div { margin-bottom: 12px; }
        #${stmPanelId} label { display: inline-block; margin-right: 10px; vertical-align: middle; cursor: pointer; }
        #${stmPanelId} input[type="radio"], #${stmPanelId} input[type="checkbox"] { vertical-align: middle; margin-right: 3px; cursor: pointer; }
        #${stmPanelId} input[type="range"] { vertical-align: middle; width: 180px; margin-left: 5px; cursor: pointer; }
        #${stmPanelId} .${PANEL_IDS.BLUR_OPTIONS} { /* Use class selector for options div */
            margin-left: 20px; padding-left: 15px; border-left: 1px solid #ccc;
            margin-top: 8px; transition: opacity 0.3s ease, filter 0.3s ease;
        }
        #${stmPanelId} .${PANEL_IDS.BLUR_OPTIONS}.disabled { opacity: 0.5; filter: grayscale(50%); pointer-events: none; }
        #${stmPanelId} .${PANEL_IDS.BLUR_OPTIONS} > div { margin-bottom: 8px; }
        #${stmPanelId} #${PANEL_IDS.BLUR_VALUE} { display: inline-block; min-width: 25px; text-align: right; margin-left: 5px; font-family: monospace; font-weight: bold; }
        #${stmPanelId} button { margin-top: 15px; padding: 5px 10px; cursor: pointer; }
        #${stmPanelId} #${PANEL_IDS.SAVE_STATUS} { margin-left: 10px; font-size: 0.9em; font-style: italic; }
        #${stmPanelId} #${PANEL_IDS.SAVE_STATUS}.success { color: green; }
        #${stmPanelId} #${PANEL_IDS.SAVE_STATUS}.error { color: red; }
        #${stmPanelId} #${PANEL_IDS.SAVE_STATUS}.info { color: #555; }
    `;
    }

    // HTML structure for the settings panel
    const settingsPanelHTML = `
        <div>
            <strong>Thumbnail Mode:</strong><br>
            <input type="radio" id="${PANEL_IDS.MODE_SPOILER}" name="${SCRIPT_ID}-mode" value="spoiler">
            <label for="${PANEL_IDS.MODE_SPOILER}">Show Original Thumbnail on Hover</label><br>
            <input type="radio" id="${PANEL_IDS.MODE_BLURRED}" name="${SCRIPT_ID}-mode" value="blurred">
            <label for="${PANEL_IDS.MODE_BLURRED}">Show Blurred Thumbnail</label>
        </div>
        <div class="${PANEL_IDS.BLUR_OPTIONS}" id="${PANEL_IDS.BLUR_OPTIONS}"> <!-- Use class and ID -->
            <div>
                <label for="${PANEL_IDS.BLUR_SLIDER}" id="${PANEL_IDS.BLUR_AMOUNT_LABEL}">Blur Amount:</label>
                <input type="range" id="${PANEL_IDS.BLUR_SLIDER}" min="1" max="50" step="1"> <!-- Max 50 -->
                <span id="${PANEL_IDS.BLUR_VALUE}"></span>px
            </div>
            <div>
                <input type="checkbox" id="${PANEL_IDS.DISABLE_HOVER_CHECKBOX}">
                <label for="${PANEL_IDS.DISABLE_HOVER_CHECKBOX}" id="${PANEL_IDS.DISABLE_HOVER_LABEL}">Disable Unblur on Hover</label>
            </div>
        </div>
        <hr>
        <div>
            <button id="${PANEL_IDS.SAVE_BUTTON}">Save & Apply Settings</button>
            <span id="${PANEL_IDS.SAVE_STATUS}"></span>
        </div>`;

    /** Caches references to panel elements for quick access. */
    function cachePanelElements(panelElement) {
        panelElementsCache = { // Store references in the scoped cache
            panel: panelElement,
            modeSpoilerRadio: panelElement.querySelector(`#${PANEL_IDS.MODE_SPOILER}`),
            modeBlurredRadio: panelElement.querySelector(`#${PANEL_IDS.MODE_BLURRED}`),
            blurOptionsDiv: panelElement.querySelector(`#${PANEL_IDS.BLUR_OPTIONS}`), // Query by ID is fine here
            blurSlider: panelElement.querySelector(`#${PANEL_IDS.BLUR_SLIDER}`),
            blurValueSpan: panelElement.querySelector(`#${PANEL_IDS.BLUR_VALUE}`),
            disableHoverCheckbox: panelElement.querySelector(`#${PANEL_IDS.DISABLE_HOVER_CHECKBOX}`),
            saveButton: panelElement.querySelector(`#${PANEL_IDS.SAVE_BUTTON}`),
            saveStatusSpan: panelElement.querySelector(`#${PANEL_IDS.SAVE_STATUS}`),
        };
        // Basic check for essential elements
        if (!panelElementsCache.modeSpoilerRadio || !panelElementsCache.saveButton || !panelElementsCache.blurOptionsDiv) {
            error("Failed to cache essential panel elements. UI may not function correctly.");
            return false;
        }
        debugLog("Panel elements cached.");
        return true;
    }

    /** Updates the enabled/disabled state and appearance of blur options based on mode selection. */
    function updateBlurOptionsStateUI() {
        const elements = panelElementsCache; // Use cached elements
        if (!elements.blurOptionsDiv) return;

        const isBlurredMode = elements.modeBlurredRadio?.checked;
        const isDisabled = !isBlurredMode;

        // Toggle visual state class
        elements.blurOptionsDiv.classList.toggle('disabled', isDisabled);

        // Toggle disabled attribute for form elements
        if (elements.blurSlider) elements.blurSlider.disabled = isDisabled;
        if (elements.disableHoverCheckbox) elements.disableHoverCheckbox.disabled = isDisabled;

        debugLog("Blur options UI state updated. Disabled:", isDisabled);
    }

    /** Populates the settings controls with current values from the Settings module. */
    function populateControlsUI() {
        const elements = panelElementsCache;
        if (!elements.panel) {
             warn("Cannot populate controls, panel elements not cached/ready.");
             return;
        }

        try {
            const mode = Settings.getThumbnailMode();
            if (elements.modeSpoilerRadio) elements.modeSpoilerRadio.checked = (mode === 'spoiler');
            if (elements.modeBlurredRadio) elements.modeBlurredRadio.checked = (mode === 'blurred');

            const blurAmount = Settings.getBlurAmount();
            if (elements.blurSlider) elements.blurSlider.value = blurAmount;
            if (elements.blurValueSpan) elements.blurValueSpan.textContent = blurAmount;

            if (elements.disableHoverCheckbox) {
                elements.disableHoverCheckbox.checked = Settings.getDisableHoverWhenBlurred();
            }

            updateBlurOptionsStateUI(); // Ensure blur options state is correct on population
            debugLog("Settings panel UI populated with current settings.");

        } catch (err) {
             error("Error populating settings controls:", err);
        }
    }

    /** Sets the status message in the settings panel. */
    function setStatusMessage(message, type = 'info', duration = 3000) {
        const statusSpan = panelElementsCache.saveStatusSpan;
        if (!statusSpan) return;

        statusSpan.textContent = message;
        statusSpan.className = type; // Add class for styling (success, error, info)

        // Clear message after duration (if duration > 0)
        if (duration > 0) {
            setTimeout(() => {
                if (statusSpan.textContent === message) { // Avoid clearing newer messages
                    statusSpan.textContent = '';
                    statusSpan.className = '';
                }
            }, duration);
        }
    }

    /** Handles the click on the 'Save Settings' button in the panel. */
    async function handleSaveClickUI() {
        const elements = panelElementsCache;
        if (!elements.saveButton || !elements.modeSpoilerRadio) return;

        setStatusMessage('Saving...', 'info', 0); // Indicate saving (no timeout)

        try {
            // --- 1. Read new values from UI ---
            const newMode = elements.modeSpoilerRadio.checked ? 'spoiler' : 'blurred';
            const newBlurAmount = parseInt(elements.blurSlider.value, 10);
            const newDisableHover = elements.disableHoverCheckbox.checked;

            // Client-side validation (redundant with Settings.validate, but good UX)
            if (isNaN(newBlurAmount) || newBlurAmount < 1 || newBlurAmount > 50) {
                throw new Error(`Invalid blur amount: ${newBlurAmount}. Must be between 1 and 50.`);
            }

            // --- 2. Update settings in the Settings module ---
            // This updates the global `scriptSettings` object
            Settings.setThumbnailMode(newMode);
            Settings.setBlurAmount(newBlurAmount);
            Settings.setDisableHoverWhenBlurred(newDisableHover);

            // --- 3. Save persistently ---
            await Settings.save(); // This also validates internally

            // --- 4. Apply changes dynamically to existing elements ---
            setStatusMessage('Applying changes...', 'info', 0);
            log(`Applying settings dynamically: Mode=${newMode}, Blur=${newBlurAmount}, DisableHover=${newDisableHover}`);

            // Select all links that have been successfully processed previously
            const processedLinks = document.querySelectorAll(`a.imgLink[${ATTR_PROCESSED_STATE}^="processed-"]`);
            log(`Found ${processedLinks.length} elements to update dynamically.`);

            processedLinks.forEach(link => {
                try {
                    // This function handles switching between modes or updating blur amount
                    updateImageAppearance(link);
                } catch (updateErr) {
                    // Log error for specific link but continue with others
                    error(`Error updating appearance for ${link.href}:`, updateErr);
                }
            });

            // --- 5. Final status update ---
            setStatusMessage('Saved & Applied!', 'success', 3000);
            log('Settings saved and changes applied dynamically.');

        } catch (err) {
            error('Failed to save or apply settings:', err);
            setStatusMessage(`Error: ${err.message || 'Could not save/apply.'}`, 'error', 5000);
        }
    }

    /** Attaches event listeners to the controls *within* the settings panel. */
    function addPanelEventListeners() {
        const elements = panelElementsCache;
        if (!elements.panel) {
            error("Cannot add panel listeners, panel elements not cached.");
            return;
        }

        // Debounce function to prevent rapid firing during slider drag
        let debounceTimer;
        const debounce = (func, delay = 50) => {
            return (...args) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => { func.apply(this, args); }, delay);
            };
        };

        // Save Button
        elements.saveButton?.addEventListener('click', handleSaveClickUI);

        // Mode Radio Buttons (update blur options enable/disable state)
        const modeChangeHandler = () => updateBlurOptionsStateUI();
        elements.modeSpoilerRadio?.addEventListener('change', modeChangeHandler);
        elements.modeBlurredRadio?.addEventListener('change', modeChangeHandler);

        // Blur Slider Input (update value display in real-time)
        elements.blurSlider?.addEventListener('input', (event) => {
            if (elements.blurValueSpan) {
                elements.blurValueSpan.textContent = event.target.value;
            }
            // Optional: Apply blur change dynamically while dragging (might be slow)
            // const applyLiveBlur = debounce(() => {
            //     if (elements.modeBlurredRadio?.checked) {
            //         Settings.setBlurAmount(parseInt(event.target.value, 10));
            //         document.querySelectorAll(`a.imgLink[${ATTR_PROCESSED_STATE}="processed-blurred"] ${SELECTORS.REVEAL_THUMBNAIL}`)
            //             .forEach(thumb => applyBlur(thumb));
            //     }
            // });
            // applyLiveBlur();
        });

        log("Settings panel event listeners added.");
    }

    // --- STM Integration Callbacks ---

    /** `onInit` callback for SettingsTabManager. Called once when the panel is first created. */
    function initializeSettingsPanel(panelElement, tabElement) {
        log(`STM initializing panel: #${panelElement.id}`);
        try {
            // Inject CSS scoped to this panel
            GM_addStyle(getSettingsPanelCSS(panelElement.id));

            // Set panel HTML content
            panelElement.innerHTML = settingsPanelHTML;

            // Cache DOM elements within the panel
            if (!cachePanelElements(panelElement)) {
                throw new Error("Failed to cache panel elements after creation.");
            }

            // Populate UI with current settings (Settings.load should have run already)
            populateControlsUI();

            // Add event listeners to the UI controls
            addPanelEventListeners();

            log('Settings panel initialized successfully.');

        } catch (err) {
             error("Error during settings panel initialization:", err);
             // Display error message within the panel itself
             panelElement.innerHTML = `<p style="color: red; border: 1px solid red; padding: 10px;">
                 Error initializing ${SCRIPT_ID} settings panel. Please check the browser console (F12) for details.
                 <br>Error: ${err.message || 'Unknown error'}
             </p>`;
        }
    }

    /** `onActivate` callback for SettingsTabManager. Called every time the tab is clicked. */
    function onSettingsTabActivate(panelElement, tabElement) {
        log(`${SCRIPT_ID} settings tab activated.`);
        // Ensure UI reflects the latest settings (in case they were changed programmatically - unlikely)
        populateControlsUI();
        // Clear any previous status messages
        setStatusMessage('', 'info', 0); // Clear immediately
    }

    // --- Main Initialization ---

    /** Sets up the script: Loads settings, registers with STM (with timeout), starts observer, processes initial content. */
    async function initialize() {
        log(`Initializing ${SCRIPT_ID} v${SCRIPT_VERSION}...`);

        // 1. Load settings first
        await Settings.load();

        // 2. Register settings panel with SettingsTabManager (with waiting logic and timeout)
        let stmAttempts = 0;
        const MAX_STM_ATTEMPTS = 20; // e.g., 20 attempts
        const STM_RETRY_DELAY_MS = 250; // Retry every 250ms
        const MAX_WAIT_TIME_MS = MAX_STM_ATTEMPTS * STM_RETRY_DELAY_MS; // ~5 seconds total wait

        function attemptStmRegistration() {
            stmAttempts++;
            debugLog(`STM check attempt ${stmAttempts}/${MAX_STM_ATTEMPTS}...`);

            // *** Check unsafeWindow directly ***
            if (typeof unsafeWindow !== 'undefined' // Ensure unsafeWindow exists
                && typeof unsafeWindow.SettingsTabManager !== 'undefined'
                && typeof unsafeWindow.SettingsTabManager.ready !== 'undefined')
            {
                log('Found SettingsTabManager on unsafeWindow. Proceeding with registration...');
                // Found it, call the async registration function, but don't wait for it here.
                // Let the rest of the script initialization continue.
                registerWithStm().catch(err => {
                     error("Async registration with STM failed after finding it:", err);
                     // Even if registration fails *after* finding STM, we proceed without the panel.
                });
                // STM found (or at least its .ready property), stop polling.
                return; // Exit the polling function
            }

            // STM not found/ready yet, check if we should give up
            if (stmAttempts >= MAX_STM_ATTEMPTS) {
                warn(`SettingsTabManager not found or not ready after ${MAX_STM_ATTEMPTS} attempts (${(MAX_WAIT_TIME_MS / 1000).toFixed(1)} seconds). Proceeding without settings panel.`);
                // Give up polling, DO NOT call setTimeout again.
                return; // Exit the polling function
            }

            // STM not found, limit not reached, schedule next attempt
            if (typeof unsafeWindow !== 'undefined' && typeof unsafeWindow.SettingsTabManager !== 'undefined') {
                 debugLog('Found SettingsTabManager on unsafeWindow, but .ready property is missing. Waiting...');
            } else {
                 debugLog('SettingsTabManager not found on unsafeWindow or not ready yet. Waiting...');
            }
            setTimeout(attemptStmRegistration, STM_RETRY_DELAY_MS); // Retry after a delay
        }

        async function registerWithStm() {
            // This function now only runs if STM.ready was detected
            try {
                // *** Access via unsafeWindow ***
                 if (typeof unsafeWindow?.SettingsTabManager?.ready === 'undefined') {
                     // Should not happen if called correctly, but check defensively
                     error('SettingsTabManager.ready disappeared before registration could complete.');
                     return; // Cannot register
                 }
                const stm = await unsafeWindow.SettingsTabManager.ready;
                // *** End Access via unsafeWindow ***

                // Now register the tab using the resolved stm object
                const registrationSuccess = stm.registerTab({
                     scriptId: SCRIPT_ID,
                     tabTitle: 'Spoilers',
                     order: 30,
                     onInit: initializeSettingsPanel,
                     onActivate: onSettingsTabActivate
                });
                if (registrationSuccess) {
                    log('Successfully registered settings tab with STM.');
                } else {
                    warn('STM registration returned false (tab might already exist or other registration issue).');
                }
            } catch (err) {
                // Catch errors during the await SettingsTabManager.ready or stm.registerTab
                error('Failed to register settings tab via SettingsTabManager:', err);
                // No need to retry here, just log the failure.
            }
        }

        // Start the check/wait process *asynchronously*.
        // We don't await this; the rest of the script continues immediately.
        attemptStmRegistration();

        // 3. Set up MutationObserver (Runs regardless of STM status)
        const observerOptions = {
            childList: true,
            subtree: true
        };
        const contentObserver = new MutationObserver((mutations) => {
            const linksToProcess = new Set();
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches(SELECTORS.IMG_LINK) && node.querySelector(SELECTORS.SPOILER_IMG)) {
                                linksToProcess.add(node);
                            } else {
                                node.querySelectorAll(`${SELECTORS.IMG_LINK} ${SELECTORS.SPOILER_IMG}`)
                                    .forEach(spoiler => {
                                        const link = spoiler.closest(SELECTORS.IMG_LINK);
                                        if (link) linksToProcess.add(link);
                                    });
                            }
                        }
                    });
                }
            });
            if (linksToProcess.size > 0) {
                 debugLog(`MutationObserver found ${linksToProcess.size} new potential links.`);
                 linksToProcess.forEach(link => processImgLink(link));
            }
        });
        contentObserver.observe(document.body, observerOptions);
        log('Mutation observer started.');

        // 4. Process initial content (Runs regardless of STM status)
        log('Performing initial content scan...');
        processContainer(document.body);

        log('Script initialization logic finished (STM check running in background).');
    }

    // --- Run Initialization ---
    // Use .catch here for errors during the initial synchronous part of initialize()
    // or the Settings.load() promise. Errors within async STM polling/registration
    // are handled by their respective try/catch blocks.
    initialize().catch(err => {
        error("Critical error during script initialization startup:", err);
    });

})();