// ==UserScript==
// @name         PixAI UI Helpers
// @namespace    http://yourname.tampermonkey.net/
// @version      1.4.2
// @description  Helpers for PixAI: Toggle between 4x1 and 2x2 layouts for the image grid, toggle the visibility of the right and left sidebars, and enable "Ctrl+Enter" for generating images. Remembers layout and Ctrl+Enter settings across refreshes.
// @author       Yada
// @match        https://pixai.art/*
// @icon         https://pixai.art/favicon.ico
// @grant        none
// @license      MIT
// @supportURL   http://yoursupporturl.com/script.js
// @downloadURL https://update.greasyfork.org/scripts/504458/PixAI%20UI%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/504458/PixAI%20UI%20Helpers.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const LAYOUT_MODES = {
        FOUR_BY_ONE: '4x1',
        TWO_BY_TWO: '2x2',
    };

    let layoutMode = localStorage.getItem('pixai-layout') || LAYOUT_MODES.FOUR_BY_ONE;
    let isCtrlEnterEnabled = localStorage.getItem('pixai-ctrl-enter') === 'enabled';
    let isRightBarCollapsed = false;
    let isLeftBarCollapsed = false;
    let buttonsAdded = false;
    let layoutInterval;

    // Function to get the target element for grid layout
    function getGridTargetElement() {
        return document.querySelector('#workbench-layout main > div > div:nth-child(2) > div > div:nth-child(1)');
    }

    // Function to set the layout to 4x1
    function setLayout4x1() {
        const imageContainer = getGridTargetElement();
        if (imageContainer) {
            imageContainer.style.setProperty('--grid-cols', '4');
            imageContainer.style.setProperty('--grid-rows', '1');
            layoutMode = LAYOUT_MODES.FOUR_BY_ONE;
            localStorage.setItem('pixai-layout', LAYOUT_MODES.FOUR_BY_ONE);
        }
    }

    // Function to set the layout to 2x2
    function setLayout2x2() {
        const imageContainer = getGridTargetElement();
        if (imageContainer) {
            imageContainer.style.setProperty('--grid-cols', '2');
            imageContainer.style.setProperty('--grid-rows', '2');
            layoutMode = LAYOUT_MODES.TWO_BY_TWO;
            localStorage.setItem('pixai-layout', LAYOUT_MODES.TWO_BY_TWO);
        }
    }

    // Function to reapply the current layout
    function reapplyLayout() {
        switch (layoutMode) {
            case LAYOUT_MODES.FOUR_BY_ONE:
                setLayout4x1();
                break;
            case LAYOUT_MODES.TWO_BY_TWO:
                setLayout2x2();
                break;
        }
    }

    // Function to toggle between layouts
    function toggleLayout() {
        if (layoutMode === LAYOUT_MODES.FOUR_BY_ONE) {
            setLayout2x2();
        } else {
            setLayout4x1();
        }
        updateLayoutButtonText();
    }

    // Function to update the layout button text to reflect the current mode
    function updateLayoutButtonText() {
        const toggleLayoutButton = document.querySelector('#pixai-toggle-layout-button');
        if (toggleLayoutButton) {
            toggleLayoutButton.textContent = `Layout: ${layoutMode.toUpperCase()}`;
        }
    }

    // Function to set right bar width to zero
    function setRightBarWidthToZero() {
        const workbenchLayout = document.querySelector('#workbench-layout');
        if (workbenchLayout) {
            workbenchLayout.style.gridTemplateColumns = 'min-content 1fr 0px';
            isRightBarCollapsed = true;
        }
    }

    // Function to restore the original width of the right bar
    function restoreRightBarWidth() {
        const workbenchLayout = document.querySelector('#workbench-layout');
        if (workbenchLayout) {
            workbenchLayout.style.gridTemplateColumns = 'min-content 1fr 380px';
            isRightBarCollapsed = false;
        }
    }

    // Function to toggle the right bar's visibility
    function toggleRightBar() {
        if (isRightBarCollapsed) {
            restoreRightBarWidth();
        } else {
            setRightBarWidthToZero();
        }
    }

    // Function to set left bar width to zero
    function setLeftBarWidthToZero() {
        const leftBar = document.querySelector('#workbench-layout > div:nth-child(2) > div');
        if (leftBar) {
            leftBar.style.width = '0px';
            leftBar.style.minWidth = '0px';
            isLeftBarCollapsed = true;
        }
    }

    // Function to restore the original width of the left bar
    function restoreLeftBarWidth() {
        const leftBar = document.querySelector('#workbench-layout > div:nth-child(2) > div');
        if (leftBar) {
            leftBar.style.width = '7rem';
            leftBar.style.minWidth = '7rem';
            isLeftBarCollapsed = false;
        }
    }

    // Function to toggle the left bar's visibility
    function toggleLeftBar() {
        if (isLeftBarCollapsed) {
            restoreLeftBarWidth();
        } else {
            setLeftBarWidthToZero();
        }
    }

    // Function to handle Ctrl+Enter key press for generating images
    function handleCtrlEnter(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            const generateButton = document.querySelector('[data-tutorial-target="generate-button"]');
            if (generateButton) {
                generateButton.click();
            }
        }
    }

    // Function to enable Ctrl+Enter for generating images
    function enableCtrlEnter() {
        if (!isCtrlEnterEnabled) {
            document.addEventListener('keydown', handleCtrlEnter);
            isCtrlEnterEnabled = true;
            localStorage.setItem('pixai-ctrl-enter', 'enabled');
        }
    }

    // Function to disable Ctrl+Enter for generating images
    function disableCtrlEnter() {
        if (isCtrlEnterEnabled) {
            document.removeEventListener('keydown', handleCtrlEnter);
            isCtrlEnterEnabled = false;
            localStorage.setItem('pixai-ctrl-enter', 'disabled');
        }
    }

    // Function to toggle Ctrl+Enter feature
    function toggleCtrlEnter() {
        if (isCtrlEnterEnabled) {
            disableCtrlEnter();
        } else {
            enableCtrlEnter();
        }
    }

    // Function to add the buttons
    function addButtons() {
        if (buttonsAdded) return;

        // Create button container for right side
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'pixai-ui-helpers-buttons';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '0';
        buttonContainer.style.right = '0';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'row';
        buttonContainer.style.gap = '5px';
        buttonContainer.style.paddingTop = '10px';

        // Button styles
        const buttonStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            fontWeight: '500',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        };

        // Create toggle layout button
        const toggleLayoutButton = document.createElement('button');
        toggleLayoutButton.id = 'pixai-toggle-layout-button';
        toggleLayoutButton.textContent = `Layout: ${layoutMode.toUpperCase()}`;
        Object.assign(toggleLayoutButton.style, buttonStyle);
        toggleLayoutButton.onclick = toggleLayout;

        // Create toggle right bar button
        const toggleRightBarButton = document.createElement('button');
        toggleRightBarButton.textContent = 'Toggle Right Bar';
        Object.assign(toggleRightBarButton.style, buttonStyle);
        toggleRightBarButton.onclick = toggleRightBar;

        // Create toggle Ctrl+Enter button
        const toggleCtrlEnterButton = document.createElement('button');
        toggleCtrlEnterButton.textContent = isCtrlEnterEnabled ? 'Disable Ctrl+Enter' : 'Enable Ctrl+Enter';
        Object.assign(toggleCtrlEnterButton.style, buttonStyle);
        toggleCtrlEnterButton.onclick = function() {
            toggleCtrlEnter();
            toggleCtrlEnterButton.textContent = isCtrlEnterEnabled ? 'Disable Ctrl+Enter' : 'Enable Ctrl+Enter';
        };

        // Append buttons to right container
        buttonContainer.appendChild(toggleCtrlEnterButton);
        buttonContainer.appendChild(toggleLayoutButton);
        buttonContainer.appendChild(toggleRightBarButton);


        // Append button container to body
        document.body.appendChild(buttonContainer);

        // Extend the clickable area of the right buttons
        buttonContainer.style.paddingTop = '0';
        buttonContainer.style.height = '40px';
        buttonContainer.style.alignItems = 'center';

        // Create button container for left side
        const leftButtonContainer = document.createElement('div');
        leftButtonContainer.id = 'pixai-ui-helpers-left-buttons';
        leftButtonContainer.style.position = 'fixed';
        leftButtonContainer.style.top = '0';
        leftButtonContainer.style.left = '0';
        leftButtonContainer.style.zIndex = '1000';
        leftButtonContainer.style.display = 'flex';
        leftButtonContainer.style.flexDirection = 'column';
        leftButtonContainer.style.paddingTop = '10px';

        // Create toggle left bar button
        const toggleLeftBarButton = document.createElement('button');
        toggleLeftBarButton.textContent = 'Toggle Left Bar';
        Object.assign(toggleLeftBarButton.style, buttonStyle);
        toggleLeftBarButton.onclick = toggleLeftBar;

        // Append button to left container
        leftButtonContainer.appendChild(toggleLeftBarButton);

        // Extend the clickable area of the left button
        leftButtonContainer.style.paddingTop = '0';
        leftButtonContainer.style.height = '40px';
        leftButtonContainer.style.alignItems = 'center';

        // Append left button container to body
        document.body.appendChild(leftButtonContainer);

        buttonsAdded = true;

        // Start interval to reapply layout every 0.1 seconds
        layoutInterval = setInterval(reapplyLayout, 100);

        // Apply initial settings based on saved preferences
        reapplyLayout();
        if (isCtrlEnterEnabled) {
            enableCtrlEnter();
        }
    }

    // Function to remove the buttons and clear the interval
    function removeButtons() {
        const buttonContainer = document.querySelector('#pixai-ui-helpers-buttons');
        const leftButtonContainer = document.querySelector('#pixai-ui-helpers-left-buttons');
        if (buttonContainer) {
            buttonContainer.remove();
            buttonsAdded = false;
        }
        if (leftButtonContainer) {
            leftButtonContainer.remove();
            buttonsAdded = false;
        }

        if (layoutInterval) {
            clearInterval(layoutInterval);
            layoutInterval = null;
        }
    }

    // Function to monitor URL changes and add/remove buttons accordingly
    function monitorURLChanges() {
        const currentURL = window.location.href;

        if (currentURL.includes('/generator/')) {
            addButtons();
        } else {
            removeButtons();
            disableCtrlEnter();  // Ensure Ctrl+Enter is disabled when leaving the page
        }
    }

    // Monitor for history changes (when navigating between pages using internal links)
    window.addEventListener('popstate', monitorURLChanges);

    // Monitor for pushState changes (when navigating between pages using internal links)
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        monitorURLChanges();
    };

    // Initial check to add/remove buttons based on the current page
    monitorURLChanges();
})();
