// ==UserScript==
// @name         Youtube Shorts Text Removal
// @namespace    Violentmonkey Scripts
// @match        *://www.youtube.com/*
// @grant        none
// @version      1.0
// @description  Toggles text visible that is overlaying the Youtube Short(e.g captions, channel name)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526948/Youtube%20Shorts%20Text%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/526948/Youtube%20Shorts%20Text%20Removal.meta.js
// ==/UserScript==

(function () {
    let isTextHidden = false; // Default: text is visible
    let defaultHidden = false; // Default setting for new reels
    let buttonsContainer = null; // Holds the buttons
    let observer = null;

    function addButtons() {
        if (buttonsContainer) return; // Prevent duplicate buttons

        buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 5px;
            opacity: 0.2;
            transition: opacity 0.3s ease;
        `;

        // Add hover effect to container
        buttonsContainer.addEventListener('mouseenter', () => {
            buttonsContainer.style.opacity = '0.9';
        });

        buttonsContainer.addEventListener('mouseleave', () => {
            buttonsContainer.style.opacity = '0.2';
        });

        // Toggle text button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Text';
        toggleButton.style.cssText = `
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        toggleButton.addEventListener('click', () => toggleTextVisibility());

        // Add hover effect to button
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.background = 'rgba(0, 0, 0, 0.9)';
        });

        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.background = 'rgba(0, 0, 0, 0.7)';
        });

        // Default mode button
        const modeButton = document.createElement('button');
        modeButton.textContent = 'Default: Visible';
        modeButton.style.cssText = `
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        modeButton.addEventListener('click', () => {
            defaultHidden = !defaultHidden;
            modeButton.textContent = defaultHidden ? 'Default: Hidden' : 'Default: Visible';
        });

        // Add hover effect to button
        modeButton.addEventListener('mouseenter', () => {
            modeButton.style.background = 'rgba(0, 0, 0, 0.9)';
        });

        modeButton.addEventListener('mouseleave', () => {
            modeButton.style.background = 'rgba(0, 0, 0, 0.7)';
        });

        buttonsContainer.appendChild(toggleButton);
        buttonsContainer.appendChild(modeButton);
        document.body.appendChild(buttonsContainer);
    }

    function removeButtons() {
        if (buttonsContainer) {
            buttonsContainer.remove();
            buttonsContainer = null;
        }
    }

    function toggleTextVisibility(forceState = null) {
        const textElements = document.querySelectorAll('.ytShortsTitleText, .metadata-container');
        const hideText = forceState !== null ? forceState : !isTextHidden;

        textElements.forEach(element => {
            element.style.display = hideText ? 'none' : '';
        });

        isTextHidden = hideText;
    }

    function applyDefaultTextVisibility() {
        setTimeout(() => {
            toggleTextVisibility(defaultHidden);
        }, 100);
    }

    function fixButtonPositions() {
        const actionContainers = document.querySelectorAll('.action-container.style-scope.ytd-reel-player-overlay-renderer');
        actionContainers.forEach(actionContainer => {
            if (actionContainer) {
                actionContainer.style.cssText = `
                    margin-right: 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 8px !important;
                    position: absolute !important;
                    right: 12px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    z-index: 2000 !important;
                `;
            }
        });

        const buttons = document.querySelectorAll('.button-container');
        buttons.forEach(button => {
            button.style.display = 'flex';
            button.style.visibility = 'visible';
            button.style.opacity = '1';
        });
    }

    function setupObserver() {
        if (observer) observer.disconnect(); // Clear old observer

        observer = new MutationObserver(() => {
            fixButtonPositions();
            applyDefaultTextVisibility();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function checkPage() {
        if (location.pathname.startsWith("/shorts/")) {
            addButtons();
            fixButtonPositions();
            applyDefaultTextVisibility();
            setupObserver();
        } else {
            removeButtons(); // Remove buttons when leaving Shorts
        }
    }

    // Detect SPA (YouTube false navigation)
    const ytNavigationObserver = new MutationObserver(() => {
        checkPage();
    });

    ytNavigationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    checkPage(); // Initial check on load
})();