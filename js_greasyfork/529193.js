// ==UserScript==
// @name         Claude Menu Click Blocker with Compact Hidden Controls
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Blocks accidental clicks on Claude menu with space-saving hidden controls
// @author       Nirvash
// @match        https://claude.ai/chat/*
// @match        https://claude.ai/chats
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/529193/Claude%20Menu%20Click%20Blocker%20with%20Compact%20Hidden%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/529193/Claude%20Menu%20Click%20Blocker%20with%20Compact%20Hidden%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let unlockTimer = null;
    const unlockDuration = 10000; // 10 seconds in milliseconds
    const blockerWidth = 250; // Width in pixels of the click-blocking area
    let isBlockerEnabled = true; // Default state is enabled
    let isTemporarilyUnblocked = false; // Track temporary unlock state
    let unlockEndTime = 0;

    function createClickBlocker() {
        console.log('Creating Claude menu click blocker...');

        // Remove existing blocker if any
        const existingBlocker = document.getElementById('claude-click-blocker');
        if (existingBlocker) {
            existingBlocker.remove();
        }

        // Only create if enabled and not temporarily unblocked
        if (!isBlockerEnabled || isTemporarilyUnblocked) {
            return;
        }

        // Create a transparent overlay div
        const blocker = document.createElement('div');
        blocker.id = 'claude-click-blocker';

        // Style the blocker
        blocker.style.position = 'fixed';
        blocker.style.top = '0';
        blocker.style.left = '0';
        blocker.style.width = `${blockerWidth}px`; // Width of the click-blocking area
        blocker.style.height = '100%';
        blocker.style.zIndex = '9999'; // Set z-index below our buttons
        blocker.style.pointerEvents = 'all'; // Capture all pointer events
        blocker.style.cursor = 'default'; // Default cursor to not indicate it's clickable

        // Add click handler
        blocker.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Click blocked on Claude menu edge');
            return false;
        });

        // Add the blocker to the document
        document.body.appendChild(blocker);
        console.log('Claude menu click blocker added to page');
    }

    function createCompactControls() {
        // Remove existing controls if any
        const existingControls = document.getElementById('claude-blocker-controls');
        if (existingControls) {
            existingControls.remove();
        }

        // Create main container
        const container = document.createElement('div');
        container.id = 'claude-blocker-controls';

        // Style the container - initially collapsed
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '0';
        container.style.zIndex = '10001';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        container.style.borderRadius = '0 8px 8px 0';
        container.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
        container.style.transition = 'transform 0.3s ease';
        container.style.transform = 'translateX(-80%)'; // Initially mostly hidden
        container.style.overflow = 'hidden';

        // Status indicator (always visible part)
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'claude-blocker-status';
        statusIndicator.style.width = '30px';
        statusIndicator.style.height = '30px';
        statusIndicator.style.borderRadius = '0 4px 4px 0';
        statusIndicator.style.position = 'absolute';
        statusIndicator.style.right = '0';
        statusIndicator.style.top = '0';
        statusIndicator.style.display = 'flex';
        statusIndicator.style.alignItems = 'center';
        statusIndicator.style.justifyContent = 'center';
        statusIndicator.style.fontWeight = 'bold';
        statusIndicator.style.fontSize = '16px';
        updateStatusIndicator(statusIndicator);

        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.padding = '10px';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexDirection = 'column';
        buttonsContainer.style.gap = '8px';
        buttonsContainer.style.minWidth = '120px'; // Ensure enough width for buttons

        // Create temporary unlock button
        const tempUnlockButton = document.createElement('button');
        tempUnlockButton.id = 'claude-temp-unlock-button';

        // Style the temporary unlock button - more compact
        tempUnlockButton.style.padding = '6px 10px';
        tempUnlockButton.style.color = 'white';
        tempUnlockButton.style.border = 'none';
        tempUnlockButton.style.borderRadius = '4px';
        tempUnlockButton.style.cursor = isBlockerEnabled ? 'pointer' : 'not-allowed';
        tempUnlockButton.style.fontSize = '12px';
        tempUnlockButton.style.fontWeight = 'bold';
        tempUnlockButton.style.width = '100%';
        tempUnlockButton.style.transition = 'background-color 0.2s';

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'claude-toggle-button';

        // Style the toggle button - more compact
        toggleButton.style.padding = '6px 10px';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.width = '100%';
        toggleButton.style.transition = 'background-color 0.2s';

        // Set button states
        updateTempButtonState(tempUnlockButton);
        updateToggleButtonState(toggleButton);

        // Add button functionality
        tempUnlockButton.addEventListener('click', function() {
            toggleTemporaryUnlock();
            updateStatusIndicator(statusIndicator);
        });

        toggleButton.addEventListener('click', function() {
            toggleBlocker();
            updateStatusIndicator(statusIndicator);
        });

        // Add hover expand/collapse functionality
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(0)'; // Fully expand
        });

        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(-80%)'; // Mostly hide
        });

        // Assemble the control elements
        container.appendChild(statusIndicator);
        buttonsContainer.appendChild(tempUnlockButton);
        buttonsContainer.appendChild(toggleButton);
        container.appendChild(buttonsContainer);

        // Add to document
        document.body.appendChild(container);
        console.log('Compact control panel created');
    }

    function updateStatusIndicator(indicator) {
        if (!indicator) {
            indicator = document.getElementById('claude-blocker-status');
            if (!indicator) return;
        }

        // Determine status color and icon
        let color, icon;

        if (!isBlockerEnabled) {
            color = '#2ecc71'; // Green for fully disabled
            icon = '🔓';
        } else if (isTemporarilyUnblocked) {
            color = '#f39c12'; // Orange for temporarily unblocked
            icon = '⏱️';
        } else {
            color = '#e74c3c'; // Red for active blocking
            icon = '🔒';
        }

        indicator.style.backgroundColor = color;
        indicator.textContent = icon;
    }

    function determineButtonColor(buttonType) {
        if (buttonType === 'temp') {
            // If blocker is disabled, temp button is disabled/gray
            if (!isBlockerEnabled) {
                return '#95a5a6'; // Gray for disabled state
            }
            // If temporarily unblocked, show orange
            return isTemporarilyUnblocked ? '#f39c12' : '#4a90e2';
        } else if (buttonType === 'toggle') {
            // Toggle button: red when enabled, green when disabled
            return isBlockerEnabled ? '#e74c3c' : '#2ecc71';
        }
        return '#4a90e2'; // Default blue
    }

    function updateTempButtonState(button) {
        if (!button) {
            button = document.getElementById('claude-temp-unlock-button');
            if (!button) return;
        }

        // Disable appearance if blocker is fully disabled
        if (!isBlockerEnabled) {
            button.textContent = '一時解除 (無効)';
            button.style.backgroundColor = '#95a5a6'; // Gray
            button.style.cursor = 'not-allowed';
            return;
        }

        // Normal state (enabled/unlocked)
        button.style.cursor = 'pointer';

        if (isTemporarilyUnblocked) {
            // Countdown state
            let secondsLeft = Math.ceil((unlockEndTime - Date.now()) / 1000);
            button.textContent = `⏱️ ${secondsLeft}秒後`;
            button.style.backgroundColor = '#f39c12'; // Orange
        } else {
            // Regular state
            button.textContent = '🔓 10秒間解除';
            button.style.backgroundColor = '#4a90e2'; // Blue
        }
    }

    function updateToggleButtonState(button) {
        if (!button) {
            button = document.getElementById('claude-toggle-button');
            if (!button) return;
        }

        button.textContent = isBlockerEnabled ? '🔒 ブロック中' : '🔓 解除中';
        button.style.backgroundColor = determineButtonColor('toggle');
    }

    function toggleBlocker() {
        isBlockerEnabled = !isBlockerEnabled;

        // Save state to localStorage
        localStorage.setItem('claudeBlockerEnabled', isBlockerEnabled.toString());

        // If disabling, cancel any temporary unlock
        if (!isBlockerEnabled) {
            isTemporarilyUnblocked = false;
            if (unlockTimer) {
                clearTimeout(unlockTimer);
                unlockTimer = null;
            }
        }

        // Update the UI
        updateToggleButtonState();
        updateTempButtonState();
        updateStatusIndicator();

        // Update the blocker
        if (isBlockerEnabled && !isTemporarilyUnblocked) {
            createClickBlocker();
        } else {
            const blocker = document.getElementById('claude-click-blocker');
            if (blocker) {
                blocker.remove();
            }
        }

        console.log(`Blocker ${isBlockerEnabled ? 'enabled' : 'disabled'}`);
    }

    function toggleTemporaryUnlock() {
        // If blocker is fully disabled, do nothing on temp button click
        if (!isBlockerEnabled) {
            return;
        }

        if (isTemporarilyUnblocked) {
            // Cancel temporary unlock early
            isTemporarilyUnblocked = false;
            if (unlockTimer) {
                clearTimeout(unlockTimer);
                unlockTimer = null;
            }
            createClickBlocker();
        } else {
            // Start temporary unlock
            isTemporarilyUnblocked = true;
            unlockEndTime = Date.now() + unlockDuration;

            // Remove the blocker
            const blocker = document.getElementById('claude-click-blocker');
            if (blocker) {
                blocker.remove();
            }

            // Clear any existing timer
            if (unlockTimer) {
                clearTimeout(unlockTimer);
            }

            // Start the countdown UI update
            startCountdown();

            // Set a timer to re-enable the blocker
            unlockTimer = setTimeout(() => {
                console.log('Temporary unlock period ended');
                unlockTimer = null;
                isTemporarilyUnblocked = false;
                if (isBlockerEnabled) { // Only recreate if globally enabled
                    createClickBlocker();
                }
                updateTempButtonState();
                updateStatusIndicator();
            }, unlockDuration);
        }

        // Update button states
        updateTempButtonState();
    }

    function startCountdown() {
        // Update every second
        const updateInterval = setInterval(() => {
            if (!isTemporarilyUnblocked || !isBlockerEnabled) {
                clearInterval(updateInterval);
                return;
            }

            const secondsLeft = Math.ceil((unlockEndTime - Date.now()) / 1000);

            if (secondsLeft <= 0) {
                clearInterval(updateInterval);
                return;
            }

            const tempButton = document.getElementById('claude-temp-unlock-button');
            if (tempButton) {
                tempButton.textContent = `⏱️ ${secondsLeft}秒後`;
            }

            updateStatusIndicator();
        }, 1000);
    }

    // Initialize the script
    function initialize() {
        console.log('Initializing Claude menu click blocker with compact controls');

        // Load saved state
        const savedState = localStorage.getItem('claudeBlockerEnabled');
        if (savedState !== null) {
            isBlockerEnabled = savedState === 'true';
        }

        // Reset temporary state on initialization
        isTemporarilyUnblocked = false;

        // Create blocker if enabled
        if (isBlockerEnabled) {
            createClickBlocker();
        }

        // Create control panel
        createCompactControls();
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded, run immediately
        initialize();
    }

    // Also run after a short delay to catch late-loading elements
    setTimeout(initialize, 1000);

    // Re-initialize on URL change (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            setTimeout(initialize, 500);
        }
    }).observe(document, {subtree: true, childList: true});

    // Add a periodic checker to ensure controls are visible and synced
    setInterval(() => {
        const controls = document.getElementById('claude-blocker-controls');
        if (!controls) {
            console.log('Controls missing, recreating...');
            createCompactControls();
        } else {
            // Update button states to ensure they're in sync
            updateTempButtonState();
            updateToggleButtonState();
            updateStatusIndicator();
        }
    }, 5000);
})();