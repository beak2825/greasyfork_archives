// ==UserScript==
// @name Twitch Auto Channel Points Claimer Redux
// @version 1.0.0
// @author Jeffenson
// @description Automatically claim channel points with minimal performance impact.
// @match https://www.twitch.tv/*
// @match https://dashboard.twitch.tv/*
// @license MIT
// @grant none
// @namespace https://greasyfork.org/users/983748
// @downloadURL https://update.greasyfork.org/scripts/529984/Twitch%20Auto%20Channel%20Points%20Claimer%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/529984/Twitch%20Auto%20Channel%20Points%20Claimer%20Redux.meta.js
// ==/UserScript==

(function() {
    // Configuration options
    const config = {
        enableLogging: true,
        enableDebug: false,        
        minDelay: 2000,
        maxAdditionalDelay: 1000,
        primaryCheckInterval: 3000,   // Main interval for checking points (ms)
        fastCheckDuration: 10000,     // Duration to use fast checking after page load (ms)
        fastCheckInterval: 1000,      // Fast check interval during initial period (ms)
        observerMode: 'minimal',      // 'none', 'minimal', or 'full'
        observerThrottleTime: 2000,   // Minimum time between observer-triggered checks
        continuousOperation: true     // Keep script running during navigation transitions
    };

    // State variables
    let claiming = false;
    let observer = null;
    let checkInterval = null;
    let fastCheckInterval = null;
    let fastCheckTimeout = null;
    let urlCheckInterval = null;
    let statusInterval = null;
    let lastCheckTime = 0;
    let startTime = new Date();
    let instanceId = Math.random().toString(36).substring(2, 10);

    // Track original history methods
    let originalPushState = null;
    let originalReplaceState = null;

    // Debug statistics
    const stats = {
        intervalChecks: 0,
        observerChecks: 0,
        manualChecks: 0,
        bonusFound: 0,
        claimAttempts: 0,
        successfulClaims: 0,
        errors: 0,
        navigationEvents: 0,
        reinitializations: 0
    };

    // Logging functions
    function log(message) {
        if (config.enableLogging) {
            console.log(`[Channel Points Claimer ${instanceId}] ${message}`);
        }
    }

    function debug(message) {
        if (config.enableDebug) {
            console.debug(`[Channel Points Debug ${instanceId}] ${message}`);
        }
    }

    function logStats() {
        if (config.enableDebug) {
            const runTime = Math.round((new Date() - startTime) / 1000);
            console.group(`Channel Points Claimer ${instanceId} - Debug Statistics`);
            console.log(`Runtime: ${runTime} seconds`);
            console.log(`Interval checks: ${stats.intervalChecks}`);
            console.log(`Observer-triggered checks: ${stats.observerChecks}`);
            console.log(`Manual checks: ${stats.manualChecks}`);
            console.log(`Bonus elements found: ${stats.bonusFound}`);
            console.log(`Claim attempts: ${stats.claimAttempts}`);
            console.log(`Successful claims: ${stats.successfulClaims}`);
            console.log(`Errors: ${stats.errors}`);
            console.log(`Navigation events: ${stats.navigationEvents}`);
            console.log(`Reinitializations: ${stats.reinitializations}`);
            console.log(`Current page: ${window.location.href}`);
            console.log(`Observer mode: ${config.observerMode}`);
            console.log(`Active intervals: ${checkInterval ? 'Main✓' : 'Main✗'} ${fastCheckInterval ? 'Fast✓' : 'Fast✗'} ${urlCheckInterval ? 'URL✓' : 'URL✗'}`);
            console.groupEnd();
        }
    }

    // Check for and claim bonus
    function checkForBonus(source = 'interval') {
        // Track check source
        if (source === 'interval') stats.intervalChecks++;
        else if (source === 'observer') stats.observerChecks++;
        else if (source === 'manual') stats.manualChecks++;

        // Throttle checks
        const now = Date.now();
        if (now - lastCheckTime < 500) { // Minimum 500ms between any checks
            return false;
        }
        lastCheckTime = now;

        try {
            // More specific selector targeting
            const bonusSelectors = [
                '.claimable-bonus__icon',
                '[data-test-selector="community-points-claim"]',
                '.community-points-summary button[aria-label*="Claim"]',
                '.channel-points-reward-button',
                'button[aria-label="Claim Bonus"]',
                'button[data-a-target="chat-claim-bonus-button"]',
                // Add more selectors if Twitch changes their UI
            ];

            let bonus = null;
            for (const selector of bonusSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    // Try to find the most visible/interactive element
                    for (const element of elements) {
                        if (element.offsetParent !== null && !element.disabled && element.style.display !== 'none') {
                            bonus = element;
                            debug(`Found bonus with selector: ${selector} (source: ${source})`);
                            break;
                        }
                    }
                    if (bonus) break;
                }
            }

            if (bonus) {
                stats.bonusFound++;

                if (!claiming) {
                    stats.claimAttempts++;
                    debug(`Attempting to claim bonus (attempt #${stats.claimAttempts})`);

                    try {
                        bonus.click();
                        const date = new Date().toLocaleTimeString();
                        claiming = true;

                        // Random delay before allowing another claim
                        const claimDelay = config.minDelay + (Math.random() * config.maxAdditionalDelay);

                        setTimeout(() => {
                            stats.successfulClaims++;
                            log(`Claimed at ${date} (total: ${stats.successfulClaims})`);
                            claiming = false;

                            // After claiming, do a quick follow-up check in case there are multiple bonuses
                            setTimeout(() => checkForBonus('follow-up'), 500);
                        }, claimDelay);

                        return true;
                    } catch (clickError) {
                        stats.errors++;
                        log(`Error clicking bonus: ${clickError.message}`);
                        claiming = false;
                        return false;
                    }
                } else {
                    debug('Bonus found but still in claiming cooldown');
                }
            }
            return false;
        } catch (error) {
            stats.errors++;
            log(`Error in checkForBonus: ${error.message}`);
            debug(`Stack trace: ${error.stack}`);
            return false;
        }
    }

    // Set up the primary interval-based checking system
    function setupIntervalChecker() {
        debug('Setting up interval checkers');

        // Clear any existing intervals
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
            debug('Cleared existing main interval');
        }

        if (fastCheckInterval) {
            clearInterval(fastCheckInterval);
            fastCheckInterval = null;
            debug('Cleared existing fast interval');
        }

        if (fastCheckTimeout) {
            clearTimeout(fastCheckTimeout);
            fastCheckTimeout = null;
            debug('Cleared existing fast timeout');
        }

        // Set up the main checking interval
        checkInterval = setInterval(() => {
            checkForBonus('interval');
        }, config.primaryCheckInterval);

        debug(`Main interval checker set up with ${config.primaryCheckInterval}ms interval`);

        // Initially use a faster check interval for a short period after page load
        fastCheckInterval = setInterval(() => {
            checkForBonus('fast-interval');
        }, config.fastCheckInterval);

        debug(`Fast checking enabled with ${config.fastCheckInterval}ms interval`);

        fastCheckTimeout = setTimeout(() => {
            if (fastCheckInterval) {
                clearInterval(fastCheckInterval);
                fastCheckInterval = null;
                debug('Fast checking period ended, cleared interval');
            }
        }, config.fastCheckDuration);

        debug(`Fast checking will end after ${config.fastCheckDuration}ms`);
    }

    // Set up a minimal observer that only triggers on very specific changes
    function setupMinimalObserver() {
        if (config.observerMode === 'none') {
            debug('Observer disabled by configuration');
            return;
        }

        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (!MutationObserver) {
            log('MutationObserver not supported in this browser');
            return;
        }

        // Clean up any existing observer
        if (observer) {
            observer.disconnect();
            observer = null;
            debug('Cleared existing points observer');
        }

        observer = new MutationObserver(mutations => {
            // Only process if we see specific bonus-related changes
            const relevantChange = mutations.some(mutation => {
                // Check if this is a relevant element
                if (mutation.target && mutation.target.className &&
                    /claimable|claim-button|bonus|points-reward/i.test(mutation.target.className)) {
                    return true;
                }

                // Check added nodes for bonus elements
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.className &&
                            /claimable|claim-button|bonus|points-reward/i.test(node.className)) {
                            return true;
                        }
                    }
                }

                return false;
            });

            if (relevantChange) {
                debug('Detected relevant DOM change for channel points');
                checkForBonus('observer');
            }
        });

        // Find the most specific target possible
        const pointsContainerSelectors = [
            '.community-points-summary',
            '.channel-points-container',
            '.chat-input__buttons-container',
            '.chat-input',
            '.chat-room'
        ];

        let targetNode = null;
        for (const selector of pointsContainerSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                targetNode = element;
                debug(`Found specific observer target: ${selector}`);
                break;
            }
        }

        if (!targetNode) {
            if (config.observerMode === 'minimal') {
                debug('No specific target found for minimal observer, skipping observer setup');
                return;
            }
            targetNode = document.querySelector('.right-column') || document.body;
            debug(`Using fallback observer target: ${targetNode.tagName}`);
        }

        // Very selective observation configuration
        const observerConfig = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-test-selector', 'aria-label'],
            characterData: false
        };

        observer.observe(targetNode, observerConfig);
        debug(`Observer set up in ${config.observerMode} mode on ${targetNode.tagName}`);
    }

    // Restore original history methods
    function restoreHistoryMethods() {
        if (originalPushState) {
            history.pushState = originalPushState;
            debug('Restored original pushState');
        }

        if (originalReplaceState) {
            history.replaceState = originalReplaceState;
            debug('Restored original replaceState');
        }
    }

    // Complete cleanup function for page navigation
    function cleanup() {
        debug('Running cleanup');

        if (observer) {
            observer.disconnect();
            observer = null;
            debug('Observer disconnected');
        }

        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
            debug('Main interval checker stopped');
        }

        if (fastCheckInterval) {
            clearInterval(fastCheckInterval);
            fastCheckInterval = null;
            debug('Fast interval checker stopped');
        }

        if (fastCheckTimeout) {
            clearTimeout(fastCheckTimeout);
            fastCheckTimeout = null;
            debug('Fast check timeout cleared');
        }

        if (!config.continuousOperation) {
            // Only clear URL check interval if not in continuous mode
            if (urlCheckInterval) {
                clearInterval(urlCheckInterval);
                urlCheckInterval = null;
                debug('URL check interval stopped');
            }

            // Only clear status interval if not in continuous mode
            if (statusInterval) {
                clearInterval(statusInterval);
                statusInterval = null;
                debug('Status interval stopped');
            }

            // Restore original history methods
            restoreHistoryMethods();

            // Remove popstate listener
            window.removeEventListener('popstate', checkForUrlChange);
        }

        logStats();
    }

    // Function to check URL changes
    function checkForUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== window.lastTwitchUrl) {
            stats.navigationEvents++;
            debug(`URL changed from ${window.lastTwitchUrl} to ${currentUrl} (navigation #${stats.navigationEvents})`);
            window.lastTwitchUrl = currentUrl;

            if (config.continuousOperation) {
                // In continuous mode, we keep the URL checker running
                // but reinitialize the points checkers
                if (checkInterval) {
                    clearInterval(checkInterval);
                    checkInterval = null;
                }

                if (fastCheckInterval) {
                    clearInterval(fastCheckInterval);
                    fastCheckInterval = null;
                }

                if (fastCheckTimeout) {
                    clearTimeout(fastCheckTimeout);
                    fastCheckTimeout = null;
                }

                if (observer) {
                    observer.disconnect();
                    observer = null;
                }

                // Do a final check before reinitializing
                checkForBonus('navigation');

                // Reinitialize with delay
                debug('Waiting 1.5 seconds before re-initializing checkers');
                setTimeout(() => {
                    debug('Re-initializing checkers after navigation');
                    stats.reinitializations++;
                    setupIntervalChecker();
                    setupMinimalObserver();
                }, 1500);
            } else {
                // Complete cleanup in non-continuous mode
                cleanup();

                // Reinitialize with delay
                debug('Waiting 1.5 seconds before re-initializing');
                setTimeout(() => {
                    debug('Re-initializing after navigation');
                    stats.reinitializations++;
                    initialize();
                }, 1500);
            }
        }
    }

    // Handle page navigation
    function setupPageListeners() {
        debug('Setting up page navigation listeners');

        // Clean up when leaving the page
        window.addEventListener('beforeunload', () => {
            debug('Page unloading, cleaning up');
            cleanup();
        });

        // Store initial URL in a global variable to avoid closure issues
        window.lastTwitchUrl = location.href;
        debug(`Initial URL: ${window.lastTwitchUrl}`);

        // Clear any existing URL check interval
        if (urlCheckInterval) {
            clearInterval(urlCheckInterval);
            urlCheckInterval = null;
            debug('Cleared existing URL check interval');
        }

        // Set up a dedicated interval for URL checking
        urlCheckInterval = setInterval(checkForUrlChange, 1000);
        debug('URL check interval set up');

        // Store original history methods
        if (!originalPushState) {
            originalPushState = history.pushState;
        }
        if (!originalReplaceState) {
            originalReplaceState = history.replaceState;
        }

        // Override history methods
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            debug('History pushState detected');
            checkForUrlChange();
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            debug('History replaceState detected');
            checkForUrlChange();
        };

        // And listen for popstate events
        window.removeEventListener('popstate', checkForUrlChange); // Remove any existing listener
        window.addEventListener('popstate', checkForUrlChange);
    }

    // Periodic status reporting
    function setupStatusReporting() {
        const REPORT_INTERVAL = 60000; // 1 minute

        if (statusInterval) {
            clearInterval(statusInterval);
            statusInterval = null;
            debug('Cleared existing status interval');
        }

        statusInterval = setInterval(() => {
            debug('Periodic status check:');

            // Check if we're on a channel page
            const onChannelPage = /twitch\.tv\/(?!directory|settings|u|p|user|videos|subscriptions|inventory|wallet)/.test(window.location.href);
            debug(`Current URL: ${window.location.href} (on channel page: ${onChannelPage})`);

            // Check for channel points elements
            const pointsContainer = document.querySelector('.community-points-summary, .channel-points-container');
            debug(`Points container present: ${!!pointsContainer}`);

            // Check if intervals are still running
            debug(`Active intervals: ${checkInterval ? 'Main✓' : 'Main✗'} ${fastCheckInterval ? 'Fast✓' : 'Fast✗'} ${urlCheckInterval ? 'URL✓' : 'URL✗'}`);

            // Log full stats
            logStats();

            // Do a manual check just to be safe
            checkForBonus('periodic');
        }, REPORT_INTERVAL);

        debug('Status reporting set up');
    }

    // Initialize everything
    function initialize() {
        log('Script starting');
        debug(`Version 2.1.0 - Final Release Version`);
        debug(`Instance ID: ${instanceId}`);
        debug(`User agent: ${navigator.userAgent}`);
        debug(`Current URL: ${window.location.href}`);

        startTime = new Date();
        lastCheckTime = 0;

        // First do an immediate check
        setTimeout(() => {
            debug('Running initial check');
            checkForBonus('initial');
        }, 1000);

        // Set up the primary interval-based system
        setupIntervalChecker();

        // Set up the minimal observer if enabled
        setupMinimalObserver();

        // Set up page navigation listeners
        setupPageListeners();

        // Set up status reporting
        setupStatusReporting();
    }

    // Start the script
    initialize();

    // Expose debug controls to console
    window.channelPointsDebug = {
        config: config,
        stats: stats,
        logStats: logStats,
        checkNow: () => {
            const result = checkForBonus('manual');
            return result ? "Bonus found and claimed!" : "No bonus available at this time";
        },
        reinitialize: () => {
            cleanup();
            initialize();
            return "Script reinitialized";
        },
        toggleDebug: () => {
            config.enableDebug = !config.enableDebug;
            log(`Debug mode ${config.enableDebug ? 'enabled' : 'disabled'}`);
            return config.enableDebug;
        },
        setObserverMode: (mode) => {
            if (['none', 'minimal', 'full'].includes(mode)) {
                config.observerMode = mode;
                cleanup();
                initialize();
                return `Observer mode set to ${mode}`;
            }
            return `Invalid mode. Use 'none', 'minimal', or 'full'`;
        },
        toggleContinuousOperation: () => {
            config.continuousOperation = !config.continuousOperation;
            log(`Continuous operation ${config.continuousOperation ? 'enabled' : 'disabled'}`);
            return config.continuousOperation;
        },
        instanceId: instanceId,
        cleanup: () => {
            cleanup();
            return "Manual cleanup completed";
        }
    };

    debug('Debug controls available via window.channelPointsDebug');
})();
