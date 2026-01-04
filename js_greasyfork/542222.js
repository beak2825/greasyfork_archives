// ==UserScript==
// @name         OpenAI Playground Config Panel Toggle
// @namespace    https://github.com/NoahTheGinger/
// @version      3.2
// @description  Toggle the configuration panel in OpenAI Playground with a sleek arrow button
// @author       NoahTheGinger
// @match        https://platform.openai.com/chat
// @match        https://platform.openai.com/chat/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542222/OpenAI%20Playground%20Config%20Panel%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/542222/OpenAI%20Playground%20Config%20Panel%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let configPanel = null;
    let chatContainer = null;
    let toggleButton = null;
    let isPanelHidden = false;
    let parentContainer = null;

    // Function to find the configuration panel
    function findConfigPanel() {
        // Look for the panel containing Model, Variables, Tools sections
        const panels = document.querySelectorAll('div[class*="neIqM"], div[class*="_0-y9H"]');
        for (const panel of panels) {
            const text = panel.innerText || '';
            if (text.includes('Model') && text.includes('Variables') && text.includes('Tools')) {
                return panel.closest('div[class*="_0-y9H"]') || panel;
            }
        }
        return null;
    }

    // Function to find the chat container and parent
    function findContainers() {
        // Find the config panel first
        const config = findConfigPanel();
        if (!config) return { config: null, chat: null, parent: null };

        // Find the parent that contains both config and chat
        let parent = config.parentElement;
        while (parent) {
            // Look for a flex container that has both panels
            if (parent.style.display === 'flex' || 
                (parent.classList && Array.from(parent.classList).some(c => c.includes('flex')))) {
                
                const children = Array.from(parent.children);
                if (children.length >= 2) {
                    // Find the chat container (should be after config panel)
                    const chatIndex = children.indexOf(config) + 1;
                    if (chatIndex < children.length) {
                        return {
                            config: config,
                            chat: children[chatIndex],
                            parent: parent
                        };
                    }
                }
            }
            parent = parent.parentElement;
        }
        
        return { config: config, chat: null, parent: null };
    }

    // Function to create the toggle button
    function createToggleButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M7.5 3L4.5 6L7.5 9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        button.style.cssText = `
            position: absolute;
            right: -16px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            background: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            padding: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: #666;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#f7f7f7';
            button.style.borderColor = '#d5d5d5';
            button.style.color = '#333';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#ffffff';
            button.style.borderColor = '#e5e5e5';
            button.style.color = '#666';
        });

        button.addEventListener('click', togglePanel);
        
        return button;
    }

    // Function to update button position
    function updateButtonPosition() {
        if (!toggleButton || !configPanel) return;

        if (isPanelHidden) {
            // When hidden, attach to chat container's left edge but with proper offset
            if (chatContainer) {
                chatContainer.style.position = 'relative';
                toggleButton.style.position = 'absolute';
                toggleButton.style.right = 'auto';
                toggleButton.style.left = '8px'; // Changed from -16px to 8px to stay visible
                
                if (toggleButton.parentElement !== chatContainer) {
                    chatContainer.appendChild(toggleButton);
                }
            }
        } else {
            // When visible, attach to config panel's right edge
            configPanel.style.position = 'relative';
            toggleButton.style.position = 'absolute';
            toggleButton.style.left = 'auto';
            toggleButton.style.right = '-16px';
            
            if (toggleButton.parentElement !== configPanel) {
                configPanel.appendChild(toggleButton);
            }
        }
    }

    // Function to toggle the panel
    function togglePanel() {
        if (!configPanel || !chatContainer) {
            // Try to find containers again
            const containers = findContainers();
            configPanel = containers.config;
            chatContainer = containers.chat;
            parentContainer = containers.parent;
        }

        if (!configPanel || !chatContainer) return;

        isPanelHidden = !isPanelHidden;

        if (isPanelHidden) {
            // Store original values
            configPanel.dataset.originalWidth = configPanel.style.width || '';
            configPanel.dataset.originalFlex = configPanel.style.flex || '';
            chatContainer.dataset.originalFlex = chatContainer.style.flex || '';
            
            // Hide the config panel
            configPanel.style.transition = 'all 0.3s ease';
            configPanel.style.width = '0';
            configPanel.style.minWidth = '0';
            configPanel.style.overflow = 'hidden';
            configPanel.style.opacity = '0';
            configPanel.style.flex = '0 0 0';
            configPanel.style.padding = '0';
            configPanel.style.margin = '0';
            
            // Expand the chat container
            chatContainer.style.transition = 'all 0.3s ease';
            chatContainer.style.flex = '1 1 100%';
            chatContainer.style.width = '100%';
            chatContainer.style.maxWidth = '100%';
            
            // Update button icon (right arrow)
            toggleButton.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            // Move button after a delay
            setTimeout(() => {
                updateButtonPosition();
            }, 150);
        } else {
            // First move the button back
            updateButtonPosition();
            
            // Then restore the config panel
            setTimeout(() => {
                configPanel.style.transition = 'all 0.3s ease';
                configPanel.style.width = configPanel.dataset.originalWidth || '';
                configPanel.style.minWidth = '';
                configPanel.style.overflow = '';
                configPanel.style.opacity = '1';
                configPanel.style.flex = configPanel.dataset.originalFlex || '';
                configPanel.style.padding = '';
                configPanel.style.margin = '';
                
                // Restore chat container
                chatContainer.style.transition = 'all 0.3s ease';
                chatContainer.style.flex = chatContainer.dataset.originalFlex || '';
                chatContainer.style.width = '';
                chatContainer.style.maxWidth = '';
                
                // Update button icon (left arrow)
                toggleButton.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M7.5 3L4.5 6L7.5 9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }, 50);
        }
    }

    // Function to initialize the script
    function init() {
        // Find the containers
        const containers = findContainers();
        configPanel = containers.config;
        chatContainer = containers.chat;
        parentContainer = containers.parent;

        if (configPanel && chatContainer && !toggleButton) {
            // Create and add the toggle button
            toggleButton = createToggleButton();
            configPanel.style.position = 'relative';
            configPanel.appendChild(toggleButton);
            
            console.log('OpenAI Playground Toggle initialized');
        }
    }

    // Wait for the page to load and initialize
    function waitForLoad() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(init, 1000);
        } else {
            document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
        }
    }

    waitForLoad();

    // Re-initialize on navigation changes (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    // Also watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
        if (!configPanel || !chatContainer) {
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();