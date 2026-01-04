// ==UserScript==
// @name         Instagram Sample Bot (Adaptive Scroll, Sample & Like)
// @namespace    http://tampermonkey.net/
// @version      1.43
// @description  Automates Instagram scrolling: fluid in foreground, jumpy in background. Detects and filters sample offers by popular beauty brands, and auto-likes relevant posts. Includes customizable settings and improved UI. Now with in-app Help and Update options in settings, improved modal visibility, fluid UI panel animations, intelligent loading detection, and draggable UI confined to viewport.
// @author       dprits419
// @match        https://www.instagram.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538055/Instagram%20Sample%20Bot%20%28Adaptive%20Scroll%2C%20Sample%20%20Like%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538055/Instagram%20Sample%20Bot%20%28Adaptive%20Scroll%2C%20Sample%20%20Like%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // IMPORTANT: Make sure this version matches the @version in the header!
    const SCRIPT_VERSION = "1.43";

    // --- IMPORTANT: CONFIGURE THESE URLs IF YOU HOST YOUR SCRIPT ---
    // This is the URL where your raw .user.js script is hosted.
    // When the "Update Userscript" button is clicked, it opens this URL.
    // Tampermonkey will detect the .user.js file and prompt for update if a newer version is available.
    const SCRIPT_INSTALL_URL = 'https://update.greasyfork.org/scripts/538055/Instagram%20Sample%20Bot%20%28Adaptive%20Scroll%2C%20Sample%20%20Like%29.user.js'; // EXAMPLE: Replace with your actual GitHub Gist raw URL or Greasy Fork URL

    // This is the URL for a help page or README for your script.
    // NOTE: This URL is now primarily for reference, as help is shown in-app.
    const SCRIPT_HELP_URL = 'https://update.greasyfork.org/scripts/538055/Instagram%20Sample%20Bot%20%28Adaptive%20Scroll%2C%20Sample%20%20Like%29.user.js'; // EXAMPLE: Replace with your actual help/documentation URL
    // --- END CONFIGURATION ---

    // Processing parameters (these are not customizable via UI for now)
    const processPostsInterval = 2500; // How often to process posts (liking, sample detection)
    const endOfFeedConfirmDelay = 1500; // Milliseconds to confirm end of feed after hitting bottom

    console.log(`Instagram Bot script loaded! (Version ${SCRIPT_VERSION} - fixed issues, have fun ;))`);

    // Global settings object with defaults
    let settings = {
        pixelsPerFrame: 4,           // For fluid scrolling (foreground)
        jumpyScrollInterval: 1000,   // How often to jump in jumpy mode (background)
        enableLiking: true,          // Toggle auto-liking
        enableSampleDetection: true, // Toggle sample offer detection
        minConfidenceThreshold: 1.5, // Confidence required for sample detection
        acceptOnlyPopularBrands: false, // Filter sample offers by popular brands
    };


    // Global state for bot activity
    let scrolling = false;

    // References to the two types of scrolling mechanisms
    let fluidAnimationFrameId = null; // For requestAnimationFrame
    let jumpyScrollIntervalId = null; // For setInterval (background)
    let processPostsIntervalId = null; // Separate interval for processing posts

    // Track last known scroll positions for end-of-feed detection
    let lastScrollY = 0;
    let lastScrollHeight = 0;

    // --- Variables for Stuck/Loading Detection ---
    let stuckDetectionIntervalId = null; // For hard refresh
    let lastEffectiveScrollTime = Date.now(); // Timestamp of last *effective* scroll change (for hard stuck detection)
    const STUCK_TIMEOUT_MS = 30 * 1000; // 30 seconds without *any* scroll progress before full refresh
    const AUTO_START_FLAG = 'instagramBotAutoStartAfterReload'; // Flag for localStorage

    let noScrollProgressTimeout = null; // Timeout for initial detection of no scroll progress
    const NO_SCROLL_PROGRESS_WARN_DELAY = 3 * 1000; // 3 seconds without scroll progress to warn/slow down initially

    let isTemporarilyStuckLoading = false; // Flag to indicate if we're in the slow-down state

    let originalPixelsPerFrame = settings.pixelsPerFrame; // Store original for restoration
    let originalJumpyScrollInterval = settings.jumpyScrollInterval; // Store original for restoration
    const SLOW_SCROLL_FACTOR_FLUID = 0.5; // Reduce fluid speed to 50%
    const SLOW_SCROLL_FACTOR_JUMPY = 2.0; // Double jumpy interval (half speed)


    // Keywords for Sample Detection
    // General sample-related keywords (will be used with negative phrases for context)
    const sampleKeywords = ['free', 'sample', 'samples', 'offer', 'deal', 'giveaway', 'trial', 'complimentary', 'discount', 'coupon', 'win', 'contest', 'promo', 'gift'];

    // Phrases that strongly indicate an offer (higher confidence)
    const strongOfferPhrases = [
        'get your free', 'claim your free', 'win a free', 'enter to win',
        'get your sample', 'claim your sample', 'free product', 'free gift',
        'limited time offer', 'exclusive offer', 'sign up for free', 'redeem your', 'grab your'
    ];

    const sampleActionTexts = ['sign up', 'learn more', 'shop now', 'claim here', 'get sample', 'redeem', 'click here', 'get offer', 'apply now'];

    // Negative keywords/phrases to reduce false positives by penalizing confidence
    // These are very specific non-offer contexts for 'free' or 'sample'.
    const negativeSamplePhrases = [
        'cruelty-free', 'free from', 'gluten-free', 'sugar-free', 'dairy-free', 'ad-free',
        'sample size', 'sample of work', 'free to use', 'free to download', 'free trial',
        'sample chapter', 'sample lesson', 'sample video', 'sample audio', 'sample data',
        'sample image', 'sample text', 'free consultation', 'free estimate'
    ];

    // Keywords for Auto-Liking
    const cologneKeywords = ['cologne', 'fragrance', 'perfume', 'scent', 'eau de parfum', 'eau de toilette'];
    const beautyKeywords = [
        'skincare', 'makeup', 'cosmetics', 'beauty', 'haircare',
        'dior', 'chanel', 'sephora', 'ulta', 'fenty', 'kylie cosmetics', 'nars', 'mac cosmetics',
        'glossier', 'rare beauty', 'lancome', 'este lauder', 'clinique', 'shiseido',
        'hourglass', 'charlotte tilly', 'tatcha', 'kiehl\'s', 'cerave', 'la roche-posay',
        'olaplex', 'sol de janeiro', 'lip gloss', 'mascara', 'eyeshadow', 'blush', 'foundation', 'concealer',
        'serum', 'moisturizer', 'cleanser', 'sunscreen'
    ];

    // List of popular beauty brands for filtering
    const popularBeautyBrands = [
        'sephora', 'ulta', 'dior', 'chanel', 'fenty beauty', 'kylie cosmetics', 'nars', 'mac cosmetics',
        'glossier', 'rare beauty', 'lancome', 'este lauder', 'clinique', 'shiseido', 'hourglass',
        'charlotte tilly', 'tatcha', 'kiehl\'s', 'cerave', 'la roche-posay', 'olaplex', 'sol de janeiro',
        'anastasia beverly hills', 'too faced', 'urban decay', 'benefit cosmetics', 'tarte', 'it cosmetics',
        'fresh', 'sunday riley', 'drunk elephant', 'summer fridays', 'glow recipe', 'paula\'s choice',
        'the ordinary', 'skinfix', 'dr. jart+', 'biossance', 'supergoop', 'milk makeup', 'kosas', 'saie',
        'tower 28', 'innisfree', 'laneige', 'dr. brandt', 'peter thomas roth', 'first aid beauty', 'farmacy',
        'youth to the people', 'herbivore botanicals', 'origins', 'clarins', 'guerlain', 'sisley', 'la mer',
        'skinceuticals', 'obagi', 'elizabeth arden', 'aveeno', 'neutrogena', 'cetaphil', 'vichy', 'laroche-posay'
    ];

    let statusBarElement; // Reference to the status bar element

    // --- Settings Management ---

    function loadSettings() {
        try {
            const savedSettings = JSON.parse(localStorage.getItem('instagramBotSettings'));
            if (savedSettings) {
                // Merge saved settings with defaults to ensure new settings are added but old ones persist
                settings = { ...settings, ...savedSettings };
            }
            // Update original values based on loaded settings
            originalPixelsPerFrame = settings.pixelsPerFrame;
            originalJumpyScrollInterval = settings.jumpyScrollInterval;

            console.log("Settings loaded:", settings);
        } catch (e) {
            console.error("Error loading settings from localStorage:", e);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem('instagramBotSettings', JSON.stringify(settings));
            updateStatus("Settings saved!", 'var(--primary-color)');
            console.log("Settings saved:", settings);
            // Also update original values if settings are saved
            originalPixelsPerFrame = settings.pixelsPerFrame;
            originalJumpyScrollInterval = settings.jumpyScrollInterval;
        } catch (e) {
            console.error("Error saving settings to localStorage:", e);
            updateStatus("Failed to save settings!", 'var(--danger-color)');
        }
    }

    // --- Utility Functions ---

    // Helper to update the status bar
    function updateStatus(message, color = 'var(--text-color, #333)') {
        if (statusBarElement) {
            statusBarElement.innerText = message;
            statusBarElement.style.color = color;
        }
        console.log("STATUS: " + message);
    }

    // Helper for delays
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helper to detect if a post is sponsored
    function isPostSponsored(postElement) {
        const sponsoredIndicator = postElement.querySelector('span[aria-label="Sponsored"], div[aria-label="Sponsored"], [data-testid="sponsored-label"], span:-webkit-any(span, div)[tabindex="-1"][role="button"]');
        if (sponsoredIndicator && (sponsoredIndicator.innerText.toLowerCase().includes('sponsored') || sponsoredIndicator.getAttribute('aria-label') === 'Sponsored')) {
            return true;
        }
        return false;
    }

    // --- Liking Logic ---
    async function likePost(postElement) {
        // Check if already liked
        const unlikeButton = postElement.querySelector('svg[aria-label="Unlike"]')?.closest('button');
        if (unlikeButton) {
            console.log("[LikePost] Post already liked, skipping.");
            return false; // Already liked
        }

        let likeButton = null;

        // Attempt 1: Look for a button with aria-label="Like" directly
        likeButton = postElement.querySelector('button[aria-label="Like"]');
        if (likeButton) {
            console.log("[LikePost] Found like button using button[aria-label='Like'].");
        }

        // Attempt 2: Look for a div with role="button" and aria-label="Like"
        if (!likeButton) {
            likeButton = postElement.querySelector('div[role="button"][aria-label="Like"]');
            if (likeButton) {
                console.log("[LikePost] Found like button using div[role='button'][aria-label='Like'].");
            }
        }

        // Attempt 3: Look for an element with role="img" and aria-label="Like" (as per user feedback)
        if (!likeButton) {
            likeButton = postElement.querySelector('[role="img"][aria-label="Like"]');
            if (likeButton) {
                // If it's an image role, we need to find its clickable parent (usually a button or div[role="button"])
                const clickableParent = likeButton.closest('button, div[role="button"]');
                if (clickableParent) {
                    likeButton = clickableParent;
                    console.log("[LikePost] Found like button using role='img' and aria-label, then its clickable parent.");
                } else {
                    // If no clickable parent, the image itself might be clickable (less common but possible)
                    console.log("[LikePost] Found like button using role='img' and aria-label, but no explicit clickable parent. Clicking image directly.");
                }
            }
        }

        // Attempt 4: Look for a button containing an SVG with aria-label="Like"
        if (!likeButton) {
            likeButton = postElement.querySelector('svg[aria-label="Like"]')?.closest('button');
            if (likeButton) {
                console.log("[LikePost] Found like button using svg[aria-label='Like'] and closest('button').");
            }
        }

        // Attempt 5: Look for a button with a specific data-testid that might indicate a like button
        if (!likeButton) {
            likeButton = postElement.querySelector('button[data-testid="like-button"]');
            if (likeButton) {
                console.log("[LikePost] Found like button using button[data-testid='like-button'].");
            }
        }

        // Attempt 6: More robust: Find the action bar (usually a div/footer containing interaction buttons)
        // Then look for the like button within that specific bar.
        if (!likeButton) {
            const actionBarSelectors = [
                'div[role="group"][aria-label*="actions"]',
                'footer',
                'div[role="group"]',
                'div[class*="Post__actions"]',
                'div[class*="Engagement__actions"]',
                'div[class*="Reactions__container"]',
                'div:has(button[aria-label="Like"], button[aria-label="Comment"], button[aria-label="Share"])',
                'div:has(div[role="button"][aria-label="Like"], div[role="button"][aria-label="Comment"], div[role="button"][aria-label="Share"])',
                'div:has([role="img"][aria-label="Like"], [role="img"][aria-label="Comment"], [role="img"][aria-label="Share"])', // New: check for image roles in action bar
                'div[style*="flex-direction: row"]'
            ];

            let actionBar = null;
            for (const selector of actionBarSelectors) {
                actionBar = postElement.querySelector(selector);
                if (actionBar) {
                    console.log(`[LikePost] Found potential action bar using selector: ${selector}`);
                    break;
                }
            }

            if (actionBar) {
                // Within the action bar, try to find the like button using its common attributes
                likeButton = actionBar.querySelector('button[aria-label="Like"]') ||
                             actionBar.querySelector('div[role="button"][aria-label="Like"]') ||
                             actionBar.querySelector('svg[aria-label="Like"]')?.closest('button') ||
                             actionBar.querySelector('button[data-testid="like-button"]') ||
                             actionBar.querySelector('[role="img"][aria-label="Like"]')?.closest('button, div[role="button"]'); // New: find image role within action bar and its parent
                if (likeButton) {
                    console.log("[LikePost] Found like button within action bar.");
                } else {
                    console.log("[LikePost] Like button not found within the identified action bar.");
                }
            } else {
                console.log("[LikePost] Action bar not found for this post after all attempts.");
            }
        }


        if (likeButton) {
            console.log("[LikePost] Final check: Like button found, attempting to click.");
            likeButton.click();
            return true; // Successfully clicked like button
        }
        console.log("[LikePost] Like button not found for this post after all attempts.");
        return false; // Like button not found
    }

    // --- Scrolling Mode Management ---

    // Starts continuous, fluid scrolling using requestAnimationFrame
    function startFluidScrolling() {
        if (fluidAnimationFrameId) return; // Already fluid scrolling

        // Ensure jumpy scrolling is stopped
        if (jumpyScrollIntervalId) {
            clearInterval(jumpyScrollIntervalId);
            jumpyScrollIntervalId = null;
        }

        function animateScroll() {
            if (!scrolling) return; // Stop if scrolling is cancelled

            const currentScrollY = window.scrollY;
            const currentScrollHeight = document.documentElement.scrollHeight;

            if (currentScrollY === lastScrollY && currentScrollHeight === lastScrollHeight) {
                // No scroll progress
                if (!noScrollProgressTimeout) {
                    // Start a timeout to detect prolonged lack of scroll progress
                    noScrollProgressTimeout = setTimeout(() => {
                        if (window.scrollY === lastScrollY && document.documentElement.scrollHeight === lastScrollHeight) {
                            // Still no scroll progress after initial delay, slow down
                            isTemporarilyStuckLoading = true;
                            settings.pixelsPerFrame = Math.max(1, Math.round(originalPixelsPerFrame * SLOW_SCROLL_FACTOR_FLUID));
                            updateStatus(`Slowing for loading (${settings.pixelsPerFrame}px/frame)...`, 'orange');
                        }
                        noScrollProgressTimeout = null; // Clear this timeout regardless if it triggered slow down or not
                    }, NO_SCROLL_PROGRESS_WARN_DELAY);
                }
                // If we are in a slowed-down state, or just detected no scroll progress, don't scroll further yet.
                // We wait for scrollHeight to change or the stuck detection to trigger a refresh.
                if (isTemporarilyStuckLoading) {
                     fluidAnimationFrameId = requestAnimationFrame(animateScroll); // Keep animation loop alive but don't scroll
                     return;
                }
            } else {
                // Scroll progress made
                clearTimeout(noScrollProgressTimeout);
                noScrollProgressTimeout = null;

                // If we were temporarily stuck, reset to original speed
                if (isTemporarilyStuckLoading) {
                    isTemporarilyStuckLoading = false;
                    settings.pixelsPerFrame = originalPixelsPerFrame;
                    updateStatus("Resuming normal scroll speed...", 'var(--primary-color, #4CAF50)');
                }
            }

            // Only scroll if not in a temporarily stuck loading state
            if (!isTemporarilyStuckLoading) {
                window.scrollBy(0, settings.pixelsPerFrame); // Use current (potentially modified) setting
            }


            lastScrollY = currentScrollY;
            lastScrollHeight = currentScrollHeight;

            fluidAnimationFrameId = requestAnimationFrame(animateScroll);
        }
        fluidAnimationFrameId = requestAnimationFrame(animateScroll);
        updateStatus("Scrolling feed fluidly...", 'var(--primary-color, #4CAF50)');
    }

    // Stops fluid scrolling
    function stopFluidScrolling() {
        if (fluidAnimationFrameId) {
            cancelAnimationFrame(fluidAnimationFrameId);
            fluidAnimationFrameId = null;
        }
        clearTimeout(noScrollProgressTimeout); // Clear loading timeout if stopping
        noScrollProgressTimeout = null;
        if (isTemporarilyStuckLoading) { // Reset speed if it was slowed down
            settings.pixelsPerFrame = originalPixelsPerFrame;
            isTemporarilyStuckLoading = false;
        }
    }

    // Starts jumpy scrolling using setInterval (for background tabs)
    function startJumpyScrolling() {
        if (jumpyScrollIntervalId) return; // Already jumpy scrolling

        // Ensure fluid scrolling is stopped
        if (fluidAnimationFrameId) {
            cancelAnimationFrame(fluidAnimationFrameId);
            fluidAnimationFrameId = null;
        }

        jumpyScrollIntervalId = setInterval(() => {
            if (!scrolling) {
                clearInterval(jumpyScrollIntervalId);
                jumpyScrollIntervalId = null;
                return;
            }

            const currentScrollHeight = document.documentElement.scrollHeight;

            if (currentScrollHeight === lastScrollHeight) {
                // No scroll progress
                if (!noScrollProgressTimeout) {
                    noScrollProgressTimeout = setTimeout(() => {
                        if (document.documentElement.scrollHeight === lastScrollHeight) {
                            isTemporarilyStuckLoading = true;
                            settings.jumpyScrollInterval = Math.round(originalJumpyScrollInterval * SLOW_SCROLL_FACTOR_JUMPY);
                            updateStatus(`Slowing for loading (${settings.jumpyScrollInterval}ms interval)...`, 'orange');
                            // To apply new interval, restart the interval
                            clearInterval(jumpyScrollIntervalId);
                            jumpyScrollIntervalId = null;
                            startJumpyScrolling(); // Call itself to restart with new interval
                        }
                        noScrollProgressTimeout = null;
                    }, NO_SCROLL_PROGRESS_WARN_DELAY);
                }
                // If we are in a slowed-down state, or just detected no scroll progress, don't jump further yet.
                if (isTemporarilyStuckLoading) {
                    // Do nothing, the interval will just keep firing at the new (slower) rate, waiting for scrollHeight to change.
                    return;
                }
            } else {
                // Scroll progress made
                clearTimeout(noScrollProgressTimeout);
                noScrollProgressTimeout = null;

                // If we were temporarily stuck, reset to original speed
                if (isTemporarilyStuckLoading) {
                    isTemporarilyStuckLoading = false;
                    settings.jumpyScrollInterval = originalJumpyScrollInterval;
                    updateStatus("Resuming normal scroll speed...", 'var(--primary-color, #4CAF50)');
                    // To apply new interval, restart the interval
                    clearInterval(jumpyScrollIntervalId);
                    jumpyScrollIntervalId = null;
                    startJumpyScrolling(); // Call itself to restart with original interval
                }
            }

            // Only scroll if not in a temporarily stuck loading state
            if (!isTemporarilyStuckLoading) {
                window.scrollTo({ top: currentScrollHeight, behavior: 'instant' });
            }

            lastScrollHeight = currentScrollHeight;

        }, settings.jumpyScrollInterval); // Use current (potentially modified) setting
        updateStatus("Scrolling feed (jumpy in background)...", 'var(--primary-color, #4CAF50)');
    }

    // Stops jumpy scrolling
    function stopJumpyScrolling() {
        if (jumpyScrollIntervalId) {
            clearInterval(jumpyScrollIntervalId);
            jumpyScrollIntervalId = null;
        }
        clearTimeout(noScrollProgressTimeout); // Clear loading timeout if stopping
        noScrollProgressTimeout = null;
        if (isTemporarilyStuckLoading) { // Reset speed if it was slowed down
            settings.jumpyScrollInterval = originalJumpyScrollInterval;
            isTemporarilyStuckLoading = false;
        }
    }

    // --- Stuck Detection Logic (for full page refresh - ultimate fallback) ---
    let lastKnownScrollYForStuckDetection = 0;
    let lastKnownScrollHeightForStuckDetection = 0;

    function startStuckDetection() {
        if (stuckDetectionIntervalId) clearInterval(stuckDetectionIntervalId); // Clear any existing interval

        // Initialize last known scroll positions and time when detection starts
        lastKnownScrollYForStuckDetection = window.scrollY;
        lastKnownScrollHeightForStuckDetection = document.documentElement.scrollHeight;
        lastEffectiveScrollTime = Date.now(); // Reset time when detection starts

        stuckDetectionIntervalId = setInterval(() => {
            if (!scrolling) { // Only check if the bot is actively running
                clearInterval(stuckDetectionIntervalId);
                stuckDetectionIntervalId = null;
                return;
            }

            const currentScrollY = window.scrollY;
            const currentScrollHeight = document.documentElement.scrollHeight;

            // Check if *any* scroll progress has been made since the last check by THIS interval
            if (currentScrollY !== lastKnownScrollYForStuckDetection || currentScrollHeight !== lastKnownScrollHeightForStuckDetection) {
                lastEffectiveScrollTime = Date.now(); // Scroll position has changed, reset the "stuck" timer
            }

            // If no effective scroll progress for STUCK_TIMEOUT_MS, consider it truly stuck and reload
            if (Date.now() - lastEffectiveScrollTime > STUCK_TIMEOUT_MS) {
                console.warn(`[Instagram Bot] Bot appears truly stuck (no scroll progress for ${STUCK_TIMEOUT_MS / 1000}s). Initiating page refresh.`);
                updateStatus("Bot stuck! Refreshing page...", 'red'); // Use red for critical error/refresh
                stopBot(); // Stop cleanly before forcing a reload
                localStorage.setItem(AUTO_START_FLAG, 'true'); // Set flag to auto-start after reload
                location.reload(); // Reload the page
            }

            // Update for the next check by this interval
            lastKnownScrollYForStuckDetection = currentScrollY;
            lastKnownScrollHeightForStuckDetection = currentScrollHeight;

        }, 5000); // Check every 5 seconds for stuck state
    }

    // Main function to start the bot
    function startBot() {
        if (scrolling) return; // Bot is already active
        scrolling = true;

        // Ensure original speeds are correct before starting
        originalPixelsPerFrame = settings.pixelsPerFrame;
        originalJumpyScrollInterval = settings.jumpyScrollInterval;
        isTemporarilyStuckLoading = false; // Reset loading state

        // Start the post processing interval, which runs regardless of scroll mode
        if (!processPostsIntervalId) {
            processPostsIntervalId = setInterval(async () => {
                await processPostsBatch();
            }, processPostsInterval);
        }

        // Determine initial scrolling mode based on visibility
        if (document.visibilityState === 'visible') {
            startFluidScrolling();
        } else {
            startJumpyScrolling();
        }

        // Start monitoring for stuck state when the bot starts
        startStuckDetection();
    }

    // Main function to stop the bot
    function stopBot() {
        if (!scrolling) return; // Bot is already stopped
        scrolling = false;

        stopFluidScrolling(); // Stop fluid scrolling if active
        stopJumpyScrolling(); // Stop jumpy scrolling if active

        // Stop the post processing interval
        if (processPostsIntervalId) { // Check if it's active before clearing
            clearInterval(processPostsIntervalId);
            processPostsIntervalId = null;
        }

        // Stop the stuck detection interval
        if (stuckDetectionIntervalId) {
            clearInterval(stuckDetectionIntervalId);
            stuckDetectionIntervalId = null;
        }

        clearTimeout(noScrollProgressTimeout); // Clear any pending no-scroll checks
        noScrollProgressTimeout = null;
        updateStatus("Stopped.", 'var(--warning-color, #f44336)');
    }

    // --- Event Listener for Tab Visibility Change ---
    document.addEventListener('visibilitychange', () => {
        if (scrolling) { // Only change mode if bot is currently active
            // Stop current scrolling mode cleanly
            stopFluidScrolling();
            stopJumpyScrolling();

            // Restart scrolling in the appropriate new mode
            if (document.visibilityState === 'visible') {
                startFluidScrolling();
            } else {
                startJumpyScrolling();
            }
            // The stuck detection interval continues running, as it monitors overall scroll progress
        }
    });

    // Button styling templates for modals (moved to global scope)
    const modalButtonStyle = {
        padding: '12px 25px', borderRadius: '10px', border: 'none',
        fontWeight: 'bold', cursor: 'pointer', fontSize: '15px',
        transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    };
    const modalPrimaryButtonStyle = {
        backgroundColor: '#66B3FF', color: 'white',
        onmouseover: (btn) => { btn.style.backgroundColor = '#4DA8FF'; btn.style.boxShadow = '0 6px 15px rgba(77, 168, 255, 0.4)'; },
        onmouseout: (btn) => { btn.style.backgroundColor = '#66B3FF'; btn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; },
        onmousedown: (btn) => btn.style.transform = 'translateY(2px)',
        onmouseup: (btn) => btn.style.transform = 'translateY(0)',
    };
    const modalSecondaryButtonStyle = {
        border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent', color: '#E0E0E0',
        onmouseover: (btn) => { btn.style.backgroundColor = 'rgba(255,255,255,0.1)'; btn.style.color = '#FFFFFF'; btn.style.boxShadow = '0 6px 15px rgba(255,255,255,0.15)'; },
        onmouseout: (btn) => { btn.style.backgroundColor = 'transparent'; btn.style.color = '#E0E0E0'; btn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; },
        onmousedown: (btn) => btn.style.transform = 'translateY(2px)',
        onmouseup: (btn) => btn.style.transform = 'translateY(0)',
    };

    // --- Custom Confirmation Modal Function ---
    function showCustomConfirmation(postElement, postSnippet, isSponsored, targetLinkHref) {
        console.log("Attempting to show custom confirmation modal.");
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'tm-custom-modal-overlay';
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
                zIndex: '100000', display: 'flex',
                justifyContent: 'center', alignItems: 'center', opacity: '0',
                transition: 'opacity 0.3s ease-in-out',
            });

            const modal = document.createElement('div');
            modal.id = 'tm-custom-modal';
            Object.assign(modal.style, {
                backgroundColor: '#1A1A1A', // Darker modal background
                color: '#E0E0E0', // Lighter text
                borderRadius: '12px', padding: '30px', // Increased padding
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', // Stronger shadow
                maxWidth: '480px', width: '90%', // Slightly wider
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                display: 'flex', flexDirection: 'column', gap: '20px', // Increased gap
                transform: 'scale(0.9)', transition: 'transform 0.3s ease-in-out', // Initial state for animation
            });

            const header = document.createElement('div');
            Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '15px', marginBottom: '15px' }); // Bolder border
            const title = document.createElement('h3');
            title.innerText = 'Potential Offer Found!';
            Object.assign(title.style, { margin: '0', fontSize: '22px', fontWeight: 'bold', color: '#66B3FF' }); // Bolder, slightly larger title
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '✕';
            Object.assign(closeBtn.style, { background: 'none', border: 'none', color: '#E0E0E0', fontSize: '24px', cursor: 'pointer', padding: '5px', lineHeight: '1', transition: 'color 0.2s ease' }); // Larger close button
            closeBtn.onmouseover = () => closeBtn.style.color = '#FF4D4D'; // Red hover
            closeBtn.onmouseout = () => closeBtn.style.color = '#E0E0E0';
            closeBtn.onclick = () => { document.removeEventListener('keydown', handleEscape); document.body.removeChild(overlay); resolve(false); };
            header.appendChild(title); header.appendChild(closeBtn); modal.appendChild(header);

            const body = document.createElement('div');
            Object.assign(body.style, { fontSize: '16px', lineHeight: '1.7', color: '#D0D0D0' }); // Slightly larger font, lighter color
            const infoText = document.createElement('p');
            infoText.innerHTML = `An offer has been detected based on your criteria.` + (isSponsored ? ` <span style="font-weight: bold; color: #FFEB3B;">(Sponsored Post)</span>` : '');
            Object.assign(infoText.style, { margin: '0 0 15px 0' });
            const snippetHeader = document.createElement('p');
            snippetHeader.innerText = 'Post Snippet:';
            Object.assign(snippetHeader.style, { margin: '0', fontWeight: 'bold', color: '#B3B3FF' });
            const snippetContent = document.createElement('code');
            snippetContent.innerText = postSnippet;
            Object.assign(snippetContent.style, {
                display: 'block', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '15px', // Darker code block
                fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '120px', // Increased height
                overflowY: 'auto', marginTop: '10px', marginBottom: '15px', color: '#A0A0A0'
            });
            body.appendChild(infoText); body.appendChild(snippetHeader); body.appendChild(snippetContent);

            if (targetLinkHref) {
                const linkP = document.createElement('p');
                linkP.innerText = 'Detected Link:';
                Object.assign(linkP.style, { margin: '0', fontWeight: 'bold', color: '#B3B3FF' });
                const linkElement = document.createElement('a');
                linkElement.href = targetLinkHref; linkElement.target = '_blank';
                linkElement.innerText = targetLinkHref.length > 60 ? targetLinkHref.substring(0, 57) + '...' : targetLinkHref;
                Object.assign(linkElement.style, { display: 'block', marginTop: '8px', color: '#66B3FF', wordBreak: 'break-all', textDecoration: 'underline', fontSize: '14px' });
                body.appendChild(linkP); body.appendChild(linkElement);
            } else {
                 const noLinkP = document.createElement('p');
                 noLinkP.innerText = "No direct link found. You'll need to manually inspect this post.";
                 Object.assign(noLinkP.style, { margin: '0', fontStyle: 'italic', color: '#808080' });
                 body.appendChild(noLinkP);
            }
            modal.appendChild(body);

            const footer = document.createElement('div');
            Object.assign(footer.style, { display: 'flex', justifyContent: 'flex-end', gap: '15px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '15px' }); // Increased gap and padding


            // "Open Link" button (if targetLinkHref exists)
            if (targetLinkHref) {
                const openLinkBtn = document.createElement('button');
                openLinkBtn.innerText = 'Open Link';
                Object.assign(openLinkBtn.style, modalButtonStyle, modalPrimaryButtonStyle);
                openLinkBtn.onmouseover = () => modalPrimaryButtonStyle.onmouseover(openLinkBtn);
                openLinkBtn.onmouseout = () => modalPrimaryButtonStyle.onmouseout(openLinkBtn);
                openLinkBtn.onmousedown = () => modalPrimaryButtonStyle.onmousedown(openLinkBtn);
                openLinkBtn.onmouseup = () => modalPrimaryButtonStyle.onmouseup(openLinkBtn);
                openLinkBtn.onclick = () => {
                    document.removeEventListener('keydown', handleEscape);
                    document.body.removeChild(overlay);
                    resolve('open_link'); // Resolve with 'open_link'
                };
                footer.appendChild(openLinkBtn);
            }

            // "Jump to Post" button (always available, but style changes)
            const jumpToPostBtn = document.createElement('button');
            jumpToPostBtn.innerText = 'Jump to Post';
            // If there's a direct link, Jump to Post becomes a secondary action. Otherwise, it's primary.
            const jumpBtnStyle = targetLinkHref ? modalSecondaryButtonStyle : modalPrimaryButtonStyle;
            Object.assign(jumpToPostBtn.style, modalButtonStyle, jumpBtnStyle);
            jumpToPostBtn.onmouseover = () => jumpBtnStyle.onmouseover(jumpToPostBtn);
            jumpToPostBtn.onmouseout = () => jumpBtnStyle.onmouseout(jumpToPostBtn);
            jumpToPostBtn.onmousedown = () => jumpBtnStyle.onmousedown(jumpToPostBtn);
            jumpToPostBtn.onmouseup = () => jumpBtnStyle.onmouseup(jumpToPostBtn);
            jumpToPostBtn.onclick = () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.removeChild(overlay);
                if (postElement) {
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    console.log("Attempted to scroll to post.");
                }
                resolve('jump'); // Resolve with 'jump'
            };
            footer.appendChild(jumpToPostBtn);

            // "Dismiss & Resume" button (always available)
            const dismissBtn = document.createElement('button');
            dismissBtn.innerText = 'Dismiss & Resume';
            Object.assign(dismissBtn.style, modalButtonStyle, modalSecondaryButtonStyle);
            dismissBtn.onmouseover = () => modalSecondaryButtonStyle.onmouseover(dismissBtn);
            dismissBtn.onmouseout = () => modalSecondaryButtonStyle.onmouseout(dismissBtn);
            dismissBtn.onmousedown = () => modalSecondaryButtonStyle.onmousedown(dismissBtn);
            dismissBtn.onmouseup = () => modalSecondaryButtonStyle.onmouseup(dismissBtn);
            dismissBtn.onclick = () => { document.removeEventListener('keydown', handleEscape); document.body.removeChild(overlay); resolve('dismiss'); }; // Resolve with 'dismiss'
            footer.appendChild(dismissBtn);

            modal.appendChild(footer); overlay.appendChild(modal); document.body.appendChild(overlay);

            // Animate modal entry
            setTimeout(() => { overlay.style.opacity = '1'; modal.style.transform = 'scale(1)'; }, 10);

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleEscape);
                    document.body.removeChild(overlay);
                    resolve('dismiss'); // Escape key also dismisses and resumes
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }

    // --- Help Modal Function ---
    async function showHelpModal() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'tm-help-overlay';
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: '100001', display: 'flex',
                justifyContent: 'center', alignItems: 'center', opacity: '0', transition: 'opacity 0.3s ease-in-out'
            });

            const modal = document.createElement('div');
            modal.id = 'tm-help-modal';
            Object.assign(modal.style, {
                backgroundColor: '#1A1A1A', color: '#E0E0E0', borderRadius: '12px', padding: '30px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', maxWidth: '480px', width: '90%',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                display: 'flex', flexDirection: 'column', gap: '20px', transform: 'scale(0.9)', transition: 'transform 0.3s ease-in-out'
            });

            const header = document.createElement('div');
            Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '15px', marginBottom: '15px' });
            const title = document.createElement('h3');
            title.innerText = 'Bot Help & Troubleshooting';
            Object.assign(title.style, { margin: '0', fontSize: '22px', fontWeight: 'bold', color: '#66B3FF' });
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '✕';
            Object.assign(closeBtn.style, { background: 'none', border: 'none', color: '#E0E0E0', fontSize: '24px', cursor: 'pointer', padding: '5px', lineHeight: '1', transition: 'color 0.2s ease' });
            closeBtn.onmouseover = () => closeBtn.style.color = '#FF4D4D';
            closeBtn.onmouseout = () => closeBtn.style.color = '#E0E0E0';
            closeBtn.onclick = () => { document.removeEventListener('keydown', handleEscape); document.body.removeChild(overlay); resolve(false); };
            header.appendChild(title); header.appendChild(closeBtn); modal.appendChild(header);

            const content = document.createElement('div');
            Object.assign(content.style, { fontSize: '16px', lineHeight: '1.7', color: '#D0D0D0', maxHeight: '300px', overflowY: 'auto' });
            content.innerHTML = `
                <p>If the Instagram Bot isn't working as expected, try these steps:</p>
                <ul>
                    <li><strong>Ensure Tampermonkey is active:</strong> Check your browser's Tampermonkey extension icon; it should be enabled.</li>
                    <li><strong>Script Enabled:</strong> In the Tampermonkey dashboard, make sure 'Instagram Sample Bot' is toggled ON.</li>
                    <li><strong>Disable Ad Blockers:</strong> Ad blockers (e.g., uBlock Origin, AdBlock Plus) or privacy extensions can interfere. Try disabling them for instagram.com.</li>
                    <li><strong>Refresh Page:</strong> A simple page refresh (F5 or Ctrl+R / Cmd+R) can often resolve minor issues.</li>
                    <li><strong>Restart Bot:</strong> If the bot stops, try clicking the 'Start Bot' button in the UI.</li>
                    <li><strong>Check Console for Errors:</strong> Open your browser's developer tools (F12 or Ctrl+Shift+I / Cmd+Option+I), go to the 'Console' tab, and look for any red error messages. Report them if you need further help.</li>
                    <li><strong>Update Script:</strong> Click 'Update Userscript' in the settings to check for the latest version.</li>
                    <li><strong>Clear Cache/Cookies:</strong> As a last resort, clearing browser cache and cookies for instagram.com can sometimes fix persistent issues (note: this will log you out).</li>
                </ul>
                <p>If you still face problems, please contact the script developer with details!</p>
            `;
            modal.appendChild(content);

            const footer = document.createElement('div');
            Object.assign(footer.style, { display: 'flex', justifyContent: 'flex-end', gap: '15px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '15px' });

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            Object.assign(closeButton.style, {
                padding: '12px 25px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)',
                backgroundColor: 'transparent', color: '#E0E0E0', fontWeight: 'bold', cursor: 'pointer',
                transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            });
            closeButton.onmouseover = () => { closeButton.style.backgroundColor = 'rgba(255,255,255,0.1)'; closeButton.style.color = '#FFFFFF'; closeButton.style.boxShadow = '0 6px 15px rgba(255,255,255,0.15)'; };
            closeButton.onmouseout = () => { closeButton.style.backgroundColor = 'transparent'; closeButton.style.color = '#E0E0E0'; closeButton.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; };
            closeButton.onmousedown = () => closeButton.style.transform = 'translateY(2px)';
            closeButton.onmouseup = () => closeButton.style.transform = 'translateY(0)';
            closeButton.onclick = () => { document.removeEventListener('keydown', handleEscape); document.body.removeChild(overlay); resolve(false); };
            footer.appendChild(closeButton);

            modal.appendChild(footer); overlay.appendChild(modal); document.body.appendChild(overlay);

            setTimeout(() => { overlay.style.opacity = '1'; modal.style.transform = 'scale(1)'; }, 10);

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleEscape);
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }


    // --- Settings Modal Function ---
    async function showSettingsModal() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'tm-settings-overlay';
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: '100001', display: 'flex',
                justifyContent: 'center', alignItems: 'center', opacity: '0', transition: 'opacity 0.3s ease-in-out'
            });

            const modal = document.createElement('div');
            modal.id = 'tm-settings-modal';
            Object.assign(modal.style, {
                backgroundColor: '#1A1A1A', color: '#E0E0E0', borderRadius: '12px', padding: '30px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)', maxWidth: '480px', width: '90%',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                display: 'flex', flexDirection: 'column', gap: '20px', transform: 'scale(0.9)', transition: 'transform 0.3s ease-in-out'
            });

            const header = document.createElement('div');
            Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '15px', marginBottom: '15px' });
            const title = document.createElement('h3');
            title.innerText = 'Bot Settings';
            Object.assign(title.style, { margin: '0', fontSize: '22px', fontWeight: 'bold', color: '#66B3FF' });
            const closeBtn = document.createElement('button');
            closeBtn.innerText = '✕';
            Object.assign(closeBtn.style, { background: 'none', border: 'none', color: '#E0E0E0', fontSize: '24px', cursor: 'pointer', padding: '5px', lineHeight: '1', transition: 'color 0.2s ease' });
            closeBtn.onmouseover = () => closeBtn.style.color = '#FF4D4D';
            closeBtn.onmouseout = () => closeBtn.style.color = '#E0E0E0';
            closeBtn.onclick = () => { document.removeEventListener('keydown', handleEscape); document.body.removeChild(overlay); resolve(false); };
            header.appendChild(title); header.appendChild(closeBtn); modal.appendChild(header);

            const settingsForm = document.createElement('div');
            Object.assign(settingsForm.style, { display: 'flex', flexDirection: 'column', gap: '15px' }); // Increased gap

            // Helper to create a setting row
            const createSettingRow = (labelText, inputElement) => {
                const row = document.createElement('div');
                Object.assign(row.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }); // Added padding
                const label = document.createElement('label');
                label.innerText = labelText;
                Object.assign(label.style, { flexShrink: '0', marginRight: '15px', fontSize: '16px', color: '#D0D0D0' }); // Larger font, lighter color
                row.appendChild(label);
                row.appendChild(inputElement);
                return row;
            };

            // Input field styling for settings
            const inputStyle = {
                width: '90px', padding: '10px', borderRadius: '8px', border: '1px solid #555',
                backgroundColor: '#333', color: '#F0F0F0', fontSize: '15px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)', // Inner shadow
            };

            // Checkbox styling for settings
            const checkboxStyle = {
                width: '24px', height: '24px', cursor: 'pointer',
                accentColor: '#66B3FF', // Highlight color for checkbox
            };

            // Scrolling Speed (Fluid)
            const fluidSpeedInput = document.createElement('input');
            fluidSpeedInput.type = 'number';
            fluidSpeedInput.min = '1'; fluidSpeedInput.max = '20'; fluidSpeedInput.step = '1';
            fluidSpeedInput.value = settings.pixelsPerFrame;
            Object.assign(fluidSpeedInput.style, inputStyle);
            settingsForm.appendChild(createSettingRow('Fluid Scroll Speed (px/frame):', fluidSpeedInput));

            // Scrolling Interval (Jumpy)
            const jumpyIntervalInput = document.createElement('input');
            jumpyIntervalInput.type = 'number';
            jumpyIntervalInput.min = '100'; jumpyIntervalInput.max = '5000'; jumpyIntervalInput.step = '100';
            jumpyIntervalInput.value = settings.jumpyScrollInterval;
            Object.assign(jumpyIntervalInput.style, inputStyle);
            settingsForm.appendChild(createSettingRow('Jumpy Scroll Interval (ms):', jumpyIntervalInput));

            // Auto-Liking Toggle
            const autoLikeToggle = document.createElement('input');
            autoLikeToggle.type = 'checkbox';
            autoLikeToggle.checked = settings.enableLiking;
            Object.assign(autoLikeToggle.style, checkboxStyle);
            settingsForm.appendChild(createSettingRow('Enable Specific Auto-Liking:', autoLikeToggle));

            // Sample Detection Toggle
            const sampleDetectToggle = document.createElement('input');
            sampleDetectToggle.type = 'checkbox';
            sampleDetectToggle.checked = settings.enableSampleDetection;
            Object.assign(sampleDetectToggle.style, checkboxStyle);
            settingsForm.appendChild(createSettingRow('Enable Sample Detection:', sampleDetectToggle));

            // Confidence Threshold for Sample Detection
            const confidenceThresholdInput = document.createElement('input');
            confidenceThresholdInput.type = 'number';
            confidenceThresholdInput.min = '0.0'; confidenceThresholdInput.max = '5.0'; confidenceThresholdInput.step = '0.1'; // Max increased to accommodate new scoring
            confidenceThresholdInput.value = settings.minConfidenceThreshold;
            Object.assign(confidenceThresholdInput.style, inputStyle);
            settingsForm.appendChild(createSettingRow('Sample Confidence Threshold:', confidenceThresholdInput));

            // Accept Only Popular Brands Toggle
            const popularBrandsToggle = document.createElement('input');
            popularBrandsToggle.type = 'checkbox';
            popularBrandsToggle.checked = settings.acceptOnlyPopularBrands;
            Object.assign(popularBrandsToggle.style, checkboxStyle);
            settingsForm.appendChild(createSettingRow('Only Popular Beauty Brands:', popularBrandsToggle));


            modal.appendChild(settingsForm);

            const footer = document.createElement('div');
            Object.assign(footer.style, { display: 'flex', justifyContent: 'flex-end', gap: '15px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '15px', flexWrap: 'wrap' }); // Added flexWrap

            // Buttons in settings modal use the same modal button styles
            const helpBtn = document.createElement('button');
            helpBtn.innerText = 'Help';
            Object.assign(helpBtn.style, modalButtonStyle, {
                border: '1px solid rgba(102, 179, 255, 0.5)',
                backgroundColor: 'transparent', color: '#66B3FF',
            });
            helpBtn.onmouseover = () => { helpBtn.style.backgroundColor = 'rgba(102, 179, 255, 0.1)'; helpBtn.style.boxShadow = '0 6px 15px rgba(102, 179, 255, 0.2)'; };
            helpBtn.onmouseout = () => { helpBtn.style.backgroundColor = 'transparent'; helpBtn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; };
            helpBtn.onmousedown = () => helpBtn.style.transform = 'translateY(2px)';
            helpBtn.onmouseup = () => helpBtn.style.transform = 'translateY(0)';
            helpBtn.onclick = async () => {
                console.log("Help button clicked from settings modal.");
                try {
                    await showHelpModal();
                } catch (e) {
                    console.error("Error executing showHelpModal from settings:", e);
                    updateStatus("Error opening help!", 'red');
                }
            };
            footer.appendChild(helpBtn);

            const updateBtn = document.createElement('button');
            updateBtn.innerText = 'Update Userscript';
            Object.assign(updateBtn.style, modalButtonStyle, {
                border: '1px solid rgba(144, 238, 144, 0.5)',
                backgroundColor: 'transparent', color: '#90EE90',
            });
            updateBtn.onmouseover = () => { updateBtn.style.backgroundColor = 'rgba(144, 238, 144, 0.1)'; updateBtn.style.boxShadow = '0 6px 15px rgba(144, 238, 144, 0.2)'; };
            updateBtn.onmouseout = () => { updateBtn.style.backgroundColor = 'transparent'; updateBtn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'; };
            updateBtn.onmousedown = () => updateBtn.style.transform = 'translateY(2px)';
            updateBtn.onmouseup = () => updateBtn.style.transform = 'translateY(0)';
            updateBtn.onclick = () => {
                window.open(SCRIPT_INSTALL_URL, '_blank');
            };
            footer.appendChild(updateBtn);


            const saveBtn = document.createElement('button');
            saveBtn.innerText = 'Save Settings';
            Object.assign(saveBtn.style, modalButtonStyle, modalPrimaryButtonStyle);
            saveBtn.onmouseover = () => modalPrimaryButtonStyle.onmouseover(saveBtn);
            saveBtn.onmouseout = () => modalPrimaryButtonStyle.onmouseout(saveBtn);
            saveBtn.onmousedown = () => modalPrimaryButtonStyle.onmousedown(saveBtn);
            saveBtn.onmouseup = () => modalPrimaryButtonStyle.onmouseup(saveBtn);
            saveBtn.onclick = () => {
                settings.pixelsPerFrame = parseInt(fluidSpeedInput.value);
                settings.jumpyScrollInterval = parseInt(jumpyIntervalInput.value);
                settings.enableLiking = autoLikeToggle.checked;
                settings.enableSampleDetection = sampleDetectToggle.checked;
                settings.minConfidenceThreshold = parseFloat(confidenceThresholdInput.value);
                settings.acceptOnlyPopularBrands = popularBrandsToggle.checked;
                saveSettings();
                document.removeEventListener('keydown', handleEscape);
                document.body.removeChild(overlay);
                resolve(true); // Indicate settings were saved
            };
            footer.appendChild(saveBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.innerText = 'Cancel';
            Object.assign(cancelBtn.style, modalButtonStyle, modalSecondaryButtonStyle);
            cancelBtn.onmouseover = () => modalSecondaryButtonStyle.onmouseover(cancelBtn);
            cancelBtn.onmouseout = () => modalSecondaryButtonStyle.onmouseout(cancelBtn);
            cancelBtn.onmousedown = () => modalSecondaryButtonStyle.onmousedown(cancelBtn);
            cancelBtn.onmouseup = () => modalSecondaryButtonStyle.onmouseup(cancelBtn);
            cancelBtn.onclick = () => { document.removeEventListener('keydown', handleEscape); document.body.removeChild(overlay); resolve(false); };
            footer.appendChild(cancelBtn);

            modal.appendChild(footer); overlay.appendChild(modal); document.body.appendChild(overlay);

            setTimeout(() => { overlay.style.opacity = '1'; modal.style.transform = 'scale(1)'; }, 10);

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', handleEscape);
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    }


    async function processPostsBatch() {
        // IMPORTANT: Add this check at the very beginning to ensure bot stops all processing immediately
        if (!scrolling) {
            console.log("[processPostsBatch] Bot is stopped, exiting batch processing.");
            return;
        }

        const posts = document.querySelectorAll('article');

        for (const post of posts) {
            const postText = post.innerText.toLowerCase();

            // --- LIKING LOGIC ---
            // Only process liking if the bot is actively scrolling (and thus processing)
            if (scrolling && settings.enableLiking && !post.dataset.likedChecked) {
                post.dataset.likedChecked = 'true'; // Mark as checked to prevent re-processing

                const shouldLike = cologneKeywords.some(kw => postText.includes(kw)) ||
                                   beautyKeywords.some(kw => postText.includes(kw));

                if (shouldLike) {
                    console.log(`[Liking Check] Post contains relevant keywords for liking. Post snippet: ${postText.substring(0, 100)}...`);
                    const likedSuccessfully = await likePost(post);
                    if (likedSuccessfully) {
                        updateStatus("Liked a post!", 'var(--primary-color)');
                        await delay(1000 + Math.random() * 1000); // Wait 1-2 seconds after liking
                    } else {
                        console.log("[Liking Check] Failed to like post or it was already liked.");
                    }
                } else {
                    console.log("[Liking Check] Post does not contain relevant keywords for liking.");
                }
            }

            // --- SAMPLE DETECTION LOGIC ---
            // Ensure bot is still active before proceeding with sample detection
            if (!scrolling || !settings.enableSampleDetection || post.dataset.sampleChecked) {
                continue;
            }

            // Filter by popular brands if setting is enabled
            if (settings.acceptOnlyPopularBrands) {
                const foundPopularBrand = popularBeautyBrands.some(brand => postText.includes(brand.toLowerCase()));
                if (!foundPopularBrand) {
                    continue; // Skip this post if it's not from a popular brand
                }
            }

            let confidence = 0;
            let targetLinkHref = null; // Changed to store href directly

            const isSponsored = isPostSponsored(post);
            let hasAnySampleKeyword = false;
            let hasNegativePhrase = false;


            // 1. Boost for strong offer phrases (highest priority)
            for (const phrase of strongOfferPhrases) {
                if (postText.includes(phrase)) {
                    confidence += 3.0; // High boost for direct offer phrases
                }
            }

            // 2. Boost for action texts (strong indicator of an interactive offer)
            const buttonsAndLinks = post.querySelectorAll('a, button');
            for (const element of buttonsAndLinks) {
                const elementText = element.innerText.toLowerCase();
                if (sampleActionTexts.some(action => elementText.includes(action))) {
                    if (element.tagName === 'A' && element.href && element.href !== '#' && !element.href.startsWith('javascript:')) {
                        // Prioritize action-associated links if found, or if no direct text link yet
                        if (!targetLinkHref || element.href.includes('bit.ly') || element.href.includes('tinyurl')) { // Prioritize short links or if no other link
                            targetLinkHref = element.href;
                        }
                    }
                    confidence += 2.0; // Strong boost for action buttons/links
                    break; // Only need to find one action text
                }
            }

            // NEW: Extract direct links from post text (more robust URL detection)
            const urlRegex = /(https?:\/\/[^\s]+)/g; // Basic URL regex
            const matches = postText.match(urlRegex);
            if (matches && matches.length > 0) {
                // If we found a direct URL in the text, use it if targetLinkHref isn't already set by an action button
                if (!targetLinkHref) {
                    targetLinkHref = matches[0]; // Take the first URL found
                }
                confidence += 1.0; // Add confidence for finding a direct link
            }


            // 3. Boost for sponsored posts
            if (isSponsored) {
                confidence += 1.0; // Bonus for sponsored posts
            }

            // Identify presence of any generic sample keyword
            for (const keyword of sampleKeywords) {
                if (postText.includes(keyword)) {
                    hasAnySampleKeyword = true;
                    break;
                }
            }

            // Identify presence of any negative sample phrase
            for (const negPhrase of negativeSamplePhrases) {
                if (postText.includes(negPhrase)) {
                    hasNegativePhrase = true;
                    break;
                }
            }

            // 4. Conditional boost/penalty for general sample keywords based on negative context
            if (hasAnySampleKeyword) {
                if (!hasNegativePhrase) {
                    confidence += 1.5; // Significant boost if general keyword is clean
                } else {
                    confidence -= 2.5; // Strong penalty if a negative context is present
                }
            }


            // Ensure confidence doesn't go below zero after penalties
            confidence = Math.max(0, confidence);


            if (confidence >= settings.minConfidenceThreshold) {
                updateStatus("Potential offer found! Waiting for your decision...", 'var(--highlight-color, #FFD700)');

                // Stop all bot activity (scrolling and processing)
                stopBot();

                post.dataset.sampleChecked = 'true';

                const postSnippet = postText.substring(0, Math.min(postText.length, 300));
                // targetLinkHref is already determined above

                // Pass the actual post element to the confirmation modal
                const userChoice = await showCustomConfirmation(post, postSnippet, isSponsored, targetLinkHref);

                if (userChoice === 'open_link') { // User chose to open the link
                    if (targetLinkHref) { // Double check link exists before opening
                        window.open(targetLinkHref, '_blank');
                        updateStatus("Opened link. Resuming bot...", 'var(--primary-color, #4CAF50)');
                    } else {
                        updateStatus("No link to open. Resuming bot...", 'var(--warning-color, #FFA500)');
                    }
                    // Automatically restart the bot after user interaction
                    setTimeout(() => {
                        startBot();
                    }, 0);
                } else if (userChoice === 'jump') { // User chose to jump to the post
                    updateStatus("Jumped to post. Bot stopped for inspection.", 'var(--warning-color, #FFA500)');
                    // The bot remains stopped here. No startBot() call.
                } else { // userChoice === 'dismiss' (User chose to dismiss and resume)
                    updateStatus("User chose to dismiss. Resuming bot...", 'var(--primary-color, #4CAF50)');
                    // Automatically restart the bot after user interaction
                    setTimeout(() => {
                        startBot();
                    }, 0);
                }
                return; // Stop processing other posts in this batch to avoid immediate re-trigger
            }
        }
    }

    // --- UI Creation ---
    function createUI() {
        const rootStyle = document.documentElement.style;
        // Define a cleaner, darker color palette
        rootStyle.setProperty('--primary-color', '#4CAF50'); // Green for success/start
        rootStyle.setProperty('--danger-color', '#E53935'); // Red for stop/danger
        rootStyle.setProperty('--text-color', '#E0E0E0'); // Light grey for general text
        rootStyle.setProperty('--bg-color', 'rgba(26, 26, 26, 0.9)'); // Dark, slightly transparent background
        rootStyle.setProperty('--border-color', 'rgba(60, 60, 60, 0.7)'); // Darker border
        rootStyle.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.4)'); // Stronger shadow
        rootStyle.setProperty('--highlight-color', '#FFC107'); // Amber for highlights/warnings
        rootStyle.setProperty('--warning-color', '#FF9800'); // Orange for warnings
        rootStyle.setProperty('--settings-icon-color', '#64B5F6'); // Light blue for settings icon

        const uiContainer = document.createElement('div');
        Object.assign(uiContainer.style, {
            position: 'fixed', top: '20px', left: '20px',
            backgroundColor: 'var(--bg-color)',
            backdropFilter: 'blur(10px)', // Slightly more blur
            padding: '20px', // Increased padding
            border: '1px solid var(--border-color)',
            borderRadius: '16px', // More rounded
            boxShadow: '0 8px 20px var(--shadow-color)', // Stronger shadow
            zIndex: '99999',
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif', // Added Inter
            display: 'flex', flexDirection: 'column', gap: '20px', // Increased gap
            alignItems: 'center', justifyContent: 'center', minWidth: '260px', // Slightly wider
            // Initial state for fluid entry
            opacity: '0',
            transform: 'translateY(-30px)', // Larger initial translateY
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out', // Slower, smoother animation
            // Draggable styles
            cursor: 'grab',
            userSelect: 'none',
        });

        // --- Draggable UI Logic ---
        let isDragging = false;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Load saved position if available
        const savedPosition = JSON.parse(localStorage.getItem('instagramBotUIPosition'));
        if (savedPosition) {
            xOffset = savedPosition.x;
            yOffset = savedPosition.y;
            uiContainer.style.left = xOffset + 'px';
            uiContainer.style.top = yOffset + 'px';
        } else {
            // Set initial position if no saved position
            uiContainer.style.left = '20px';
            uiContainer.style.top = '20px';
        }


        uiContainer.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        function dragStart(e) {
            const targetTagName = e.target.tagName;
            if (targetTagName === 'BUTTON' || targetTagName === 'INPUT' || targetTagName === 'LABEL' || e.target.closest('.tm-custom-modal-overlay')) {
                return;
            }

            initialX = e.clientX - uiContainer.getBoundingClientRect().left;
            initialY = e.clientY - uiContainer.getBoundingClientRect().top;

            isDragging = true;
            uiContainer.style.cursor = 'grabbing';
        }

        function dragEnd(e) {
            isDragging = false;
            uiContainer.style.cursor = 'grab';
            localStorage.setItem('instagramBotUIPosition', JSON.stringify({ x: xOffset, y: yOffset }));
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                let newX = e.clientX - initialX;
                let newY = e.clientY - initialY;

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                const uiWidth = uiContainer.offsetWidth;
                const uiHeight = uiContainer.offsetHeight;

                newX = Math.max(0, Math.min(newX, viewportWidth - uiWidth));
                newY = Math.max(0, Math.min(newY, viewportHeight - uiHeight));

                uiContainer.style.left = newX + "px";
                uiContainer.style.top = newY + "px";

                xOffset = newX;
                yOffset = newY;
            }
        }
        // --- End Draggable UI Logic ---


        const headerRow = document.createElement('div');
        Object.assign(headerRow.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
            marginBottom: '10px', // Added margin below header
        });
        uiContainer.appendChild(headerRow);

        const titleElement = document.createElement('h3');
        titleElement.innerText = `Instagram Bot v${SCRIPT_VERSION}`;
        Object.assign(titleElement.style, {
            margin: '0', color: 'var(--text-color)', fontSize: '24px', // Larger font
            fontWeight: '900', // Extra bold
            flexGrow: '1', textAlign: 'center',
            letterSpacing: '0.5px', // Added letter spacing
        });
        headerRow.appendChild(titleElement);

        // Settings Button
        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙️';
        Object.assign(settingsButton.style, {
            background: 'none', border: 'none', fontSize: '32px', // Larger icon
            cursor: 'pointer', color: 'var(--settings-icon-color)',
            padding: '0',
            lineHeight: '1',
            transition: 'transform 0.2s ease, color 0.2s ease', // Smoother transition
        });
        settingsButton.onmouseover = () => settingsButton.style.transform = 'rotate(30deg) scale(1.1)'; // More pronounced hover
        settingsButton.onmouseout = () => settingsButton.style.transform = 'rotate(0deg) scale(1)';
        settingsButton.onclick = async () => {
            console.log("Settings button clicked.");
            try {
                await showSettingsModal();
            } catch (e) {
                console.error("Error executing showSettingsModal:", e);
                updateStatus("Error opening settings!", 'red');
            }
        };
        headerRow.appendChild(settingsButton);


        const buttonsContainer = document.createElement('div');
        Object.assign(buttonsContainer.style, {
            display: 'flex', gap: '15px', width: '100%', justifyContent: 'center', // Increased gap
        });
        uiContainer.appendChild(buttonsContainer);

        const buttonStyle = {
            padding: '12px 22px', // Increased padding
            border: 'none',
            borderRadius: '10px', // More rounded
            fontSize: '16px', // Larger font
            fontWeight: '700', // Bolder font
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease', // Added box-shadow transition
            boxShadow: '0 4px 10px var(--shadow-color)', // Initial shadow
            flexGrow: '1',
            letterSpacing: '0.3px', // Added letter spacing
        };

        const startButton = document.createElement('button');
        startButton.innerText = 'Start Bot';
        Object.assign(startButton.style, buttonStyle, {
            backgroundColor: 'var(--primary-color)', color: 'white',
            backgroundImage: 'linear-gradient(145deg, #4CAF50, #388E3C)', // Subtle gradient
        });
        startButton.onmouseover = () => { startButton.style.backgroundColor = '#45a049'; startButton.style.boxShadow = '0 6px 15px rgba(76, 175, 80, 0.4)'; }; // Stronger hover shadow
        startButton.onmouseout = () => { startButton.style.backgroundColor = 'var(--primary-color)'; startButton.style.boxShadow = '0 4px 10px var(--shadow-color)'; };
        startButton.onmousedown = () => startButton.style.transform = 'translateY(2px)';
        startButton.onmouseup = () => startButton.style.transform = 'translateY(0)';
        startButton.onclick = () => {
            console.log("Start Bot button clicked.");
            try {
                startBot();
            } catch (e) {
                console.error("Error executing startBot:", e);
                updateStatus("Error starting bot!", 'red');
            }
        };
        buttonsContainer.appendChild(startButton);

        const stopButton = document.createElement('button');
        stopButton.innerText = 'Stop Bot';
        Object.assign(stopButton.style, buttonStyle, {
            backgroundColor: 'var(--danger-color)', color: 'white',
            backgroundImage: 'linear-gradient(145deg, #E53935, #C62828)', // Subtle gradient
        });
        stopButton.onmouseover = () => { stopButton.style.backgroundColor = '#da190b'; stopButton.style.boxShadow = '0 6px 15px rgba(229, 57, 53, 0.4)'; };
        stopButton.onmouseout = () => { stopButton.style.backgroundColor = 'var(--danger-color)'; stopButton.style.boxShadow = '0 4px 10px var(--shadow-color)'; };
        stopButton.onmousedown = () => stopButton.style.transform = 'translateY(2px)';
        stopButton.onmouseup = () => stopButton.style.transform = 'translateY(0)';
        stopButton.onclick = () => {
            console.log("Stop Bot button clicked.");
            try {
                stopBot();
            } catch (e) {
                console.error("Error executing stopBot:", e);
                updateStatus("Error stopping bot!", 'red');
            }
        };
        buttonsContainer.appendChild(stopButton);

        statusBarElement = document.createElement('div');
        Object.assign(statusBarElement.style, {
            marginTop: '10px', // Increased margin
            fontSize: '15px', // Slightly larger font
            fontWeight: 'bold', // Bolder text
            color: 'var(--text-color)',
            textAlign: 'center', width: '100%', paddingTop: '0px',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)', // Subtle text shadow for pop
        });
        uiContainer.appendChild(statusBarElement);

        document.body.appendChild(uiContainer);

        // Animate the UI container into view
        requestAnimationFrame(() => {
            uiContainer.style.opacity = '1';
            uiContainer.style.transform = 'translateY(0)';
        });

        updateStatus("Ready for use. Click 'Start Bot'!", 'var(--text-color)');
    }

    // --- Initialization ---
    window.addEventListener('load', () => {
        loadSettings(); // Load settings first
        createUI();     // Then create the UI

        // Check if we should auto-start the bot after a previous forced reload (due to being stuck)
        if (localStorage.getItem(AUTO_START_FLAG) === 'true') {
            localStorage.removeItem(AUTO_START_FLAG); // Clear the flag immediately
            updateStatus("Restarting after recovery refresh...", 'green'); // Inform user
            // Give the page a moment to fully render before restarting the bot
            setTimeout(() => {
                startBot();
            }, 2000); // 2-second delay before auto-starting
        }
    });

})();
