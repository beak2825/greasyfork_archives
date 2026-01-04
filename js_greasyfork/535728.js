// ==UserScript==
// @name         Reddit Corner Buttons (Saved Posts & Messages) + Reddit AD Button Hider
// @namespace    Https://github.com/ctrlcmdshft/
// @version      2.6.1
// @description  Adds buttons to access Saved Posts and Messages (bottom-right corner) and hides the 'Advertise' button/link on Reddit using its ID. Handles SPA navigation and iframe issues.
// @author       CtrlCmdShft
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @noframes     Crucial: Prevents the script from running in iframes, avoiding duplicate runs on pages like Messages.
// @homepageURL  https://github.com/ctrlcmdshft/RedditQuickAccess
// @homepage     https://github.com/ctrlcmdshft/RedditQuickAccess
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start // Run early to set the global flag and inject styles.
// @license      MIT // Example license, feel free to change
// @downloadURL https://update.greasyfork.org/scripts/535728/Reddit%20Corner%20Buttons%20%28Saved%20Posts%20%20Messages%29%20%2B%20Reddit%20AD%20Button%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/535728/Reddit%20Corner%20Buttons%20%28Saved%20Posts%20%20Messages%29%20%2B%20Reddit%20AD%20Button%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* --- Configuration --- */

    // Constants for button IDs and URLs
    const SAVED_URL = 'https://www.reddit.com/user/me/saved';
    const MESSAGES_URL = 'https://www.reddit.com/message/inbox'; // Base URL for messages page check
    const EXPORT_URL = 'https://www.reddit.com/user/me/comments';
    const SAVED_BUTTON_ID = 'userscript-reddit-saved-button';
    const MESSAGES_BUTTON_ID = 'userscript-reddit-messages-button';
    const ADVERTISE_BUTTON_ID = 'advertise-button'; 
    const EXPORT_COMMENTS_BUTTON_ID = 'userscript-reddit-export-comments-button'; // Add this
    const COMMENTS_PER_REQUEST = 100;
    const MAX_RETRIES = 3;

    const EXPORT_FORMATS = {
        txt: 'Text (.txt)',
        json: 'JSON (.json)',
        csv: 'CSV (.csv)'
    };

    // SVG Icons for the buttons
    const BOOKMARK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`;
    const MAIL_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" aria-hidden="true"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>`;
    const EXPORT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`; // Add this

    /* --- Settings Management --- */
    const DEFAULT_SETTINGS = {
        showSavedButton: true,
        showMessagesButton: true,
        showExportButton: true
    };

    function loadSettings() {
        return {
            showSavedButton: GM_getValue('showSavedButton', DEFAULT_SETTINGS.showSavedButton),
            showMessagesButton: GM_getValue('showMessagesButton', DEFAULT_SETTINGS.showMessagesButton),
            showExportButton: GM_getValue('showExportButton', DEFAULT_SETTINGS.showExportButton)
        };
    }

    function saveSettings(settings) {
        GM_setValue('showSavedButton', settings.showSavedButton);
        GM_setValue('showMessagesButton', settings.showMessagesButton);
        GM_setValue('showExportButton', settings.showExportButton);
    }

    function toggleFeature(feature) {
        const settings = loadSettings();
        settings[feature] = !settings[feature];
        saveSettings(settings);
        initializeOrRefreshButtons(); // Refresh buttons to reflect changes
    }

    // Register menu commands
    GM_registerMenuCommand('Toggle Saved Button', () => toggleFeature('showSavedButton'));
    GM_registerMenuCommand('Toggle Messages Button', () => toggleFeature('showMessagesButton'));
    GM_registerMenuCommand('Toggle Export Button', () => toggleFeature('showExportButton'));

    /* --- Initialization Guard (Global Flag) --- */

    const GLOBAL_FLAG_NAME = '__redditCornerButtonsInitialized_v2_5__'; // Use a versioned name
    if (window[GLOBAL_FLAG_NAME]) {
        // console.log(`Reddit Corner Buttons & Ad Hider: Global flag ${GLOBAL_FLAG_NAME} found. Aborting secondary execution.`);
        return;
    }
    window[GLOBAL_FLAG_NAME] = true;
    // console.log(`Reddit Corner Buttons & Ad Hider: Global flag ${GLOBAL_FLAG_NAME} set by this instance.`);


    /* --- Styling --- */

    // CSS styles for the buttons and ad hiding.
    const styles = `
        /* Corner Buttons Base Style */
        .userscript-corner-button {
            position: fixed;
            right: 20px;
            bottom: 20px; /* Default bottom position */
            z-index: 1001;
            width: 40px;
            height: 40px;
            color: #ffffff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease; /* Smooth transition for position changes */
            display: flex !important;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
        .userscript-corner-button svg {
            width: 20px;
            height: 20px;
        }

        /* Saved Posts Button */
        #${SAVED_BUTTON_ID} {
            background-color: #ff4500;
        }
        #${SAVED_BUTTON_ID}:hover {
            background-color: #ff5722;
        }

        /* Messages Button */
        #${MESSAGES_BUTTON_ID} {
            background-color: #0079D3;
        }
        #${MESSAGES_BUTTON_ID}:hover {
            background-color: #1484D7;
        }

        /* Export Comments Button */
        #${EXPORT_COMMENTS_BUTTON_ID} {
            background-color: #1a9131;
        }
        #${EXPORT_COMMENTS_BUTTON_ID}:hover {
            background-color: #23ad3c;
        }

        /* Dynamic positioning when both buttons are present */
        body:has(#${SAVED_BUTTON_ID}):has(#${MESSAGES_BUTTON_ID}) #${MESSAGES_BUTTON_ID} {
            bottom: 70px;
        }
        body:has(#${SAVED_BUTTON_ID}):has(#${MESSAGES_BUTTON_ID}) #${SAVED_BUTTON_ID} {
            bottom: 20px;
        }

        /* Update dynamic positioning for three buttons */
        body:has(#${SAVED_BUTTON_ID}):has(#${MESSAGES_BUTTON_ID}):has(#${EXPORT_COMMENTS_BUTTON_ID}) #${EXPORT_COMMENTS_BUTTON_ID} {
            bottom: 120px;
        }
        body:has(#${SAVED_BUTTON_ID}):has(#${MESSAGES_BUTTON_ID}):has(#${EXPORT_COMMENTS_BUTTON_ID}) #${MESSAGES_BUTTON_ID} {
            bottom: 70px;
        }

        /* --- Hide the 'Advertise' Button using its ID --- */
        #${ADVERTISE_BUTTON_ID} {
            display: none !important;
        }

        /* Export Format Menu */
        .export-format-menu {
            background: #1a9131;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            z-index: 1002;
            min-width: 120px;
            animation: menuFadeIn 0.2s ease;
        }

        .export-format-menu button {
            background: none;
            border: none;
            padding: 8px 16px;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            color: #ffffff;
            font-size: 14px;
            white-space: nowrap;
            transition: background-color 0.2s ease;
        }

        .export-format-menu button:hover {
            background-color: #23ad3c;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .export-format-menu {
                background: #1a9131;
            }
            
            .export-format-menu button {
                color: #ffffff;
            }
            
            .export-format-menu button:hover {
                background-color: #23ad3c;
            }
        }
    `;
    // Inject the styles into the page head.
    try {
        GM_addStyle(styles);
        // console.log("Reddit Corner Buttons & Ad Hider: Styles injected.");
    } catch (e) {
        console.error("Reddit Corner Buttons & Ad Hider: Failed to inject styles using GM_addStyle.", e);
    }


    /* --- Core Functions --- */

    async function fetchComments(after = null, retryCount = 0) {
        try {
            const url = `https://www.reddit.com/user/me/comments.json?limit=${COMMENTS_PER_REQUEST}${after ? '&after=' + after : ''}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data;
        } catch (error) {
            if (retryCount < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                return fetchComments(after, retryCount + 1);
            }
            throw error;
        }
    }

    async function getAllComments() {
        let allComments = [];
        let after = null;
        
        try {
            do {
                const data = await fetchComments(after);
                const comments = data.data.children;
                allComments = allComments.concat(comments);
                after = data.data.after;
            } while (after);
            
            return allComments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }

    function formatCommentsForExport(comments) {
        return comments.map(comment => {
            const date = new Date(comment.data.created_utc * 1000);
            const formattedDate = date.toLocaleString();
            
            // Format the comment body - replace markdown links and clean up newlines
            let body = comment.data.body
                .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)') // Convert markdown links to readable format
                .replace(/\n{3,}/g, '\n\n')                // Replace multiple newlines with double newline
                .trim();

            return {
                subreddit: `r/${comment.data.subreddit}`,
                date: formattedDate,
                score: comment.data.score,
                body: body,
                context: `https://reddit.com${comment.data.permalink}?context=3`,
                post_title: comment.data.link_title || '[Title not available]'
            };
        });
    }

    function downloadComments(comments, format = 'txt') {  // Changed default to 'txt'
        const formattedComments = formatCommentsForExport(comments);
        let content, filename, type;

        if (format === 'txt') {
            // Enhanced text format for better readability
            const header = `Reddit Comments Export\n` +
                          `Generated: ${new Date().toLocaleString()}\n` +
                          `Total Comments: ${formattedComments.length}\n` +
                          `${'='.repeat(60)}\n\n`;

            const commentsContent = formattedComments.map((c, index) => (
                `Comment #${index + 1}\n` +
                `${'='.repeat(30)}\n` +
                `Posted in: ${c.subreddit}\n` +
                `Date: ${c.date}\n` +
                `Score: ${c.score}\n` +
                `Post: ${c.post_title}\n` +
                `\nComment:\n${'~'.repeat(20)}\n${c.body}\n${'~'.repeat(20)}\n` +
                `\nLink: ${c.context}\n` +
                `\n${'='.repeat(60)}\n`
            )).join('\n');

            content = header + commentsContent;
            filename = `reddit-comments-${new Date().toISOString().split('T')[0]}.txt`;
            type = 'text/plain';
        } else if (format === 'json') {
            // Make JSON more readable with better spacing and structure
            content = JSON.stringify({
                export_date: new Date().toLocaleString(),
                total_comments: formattedComments.length,
                comments: formattedComments
            }, null, 2);
            filename = 'reddit-comments.json';
            type = 'application/json';
        } else if (format === 'csv') {
            // Make CSV more readable with proper escaping and formatting
            const headers = ['Subreddit', 'Date', 'Score', 'Post Title', 'Comment', 'Link'];
            const rows = formattedComments.map(c => [
                c.subreddit,
                c.date,
                c.score,
                c.post_title.replace(/"/g, '""'),
                c.body.replace(/"/g, '""').replace(/\n/g, ' '),
                c.context
            ].map(field => `"${field}"`).join(','));
            
            content = [headers.join(','), ...rows].join('\n');
            filename = 'reddit-comments.csv';
            type = 'text/csv';
        }

        const blob = new Blob([content], { type: `${type};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /* --- Update the createFormatMenu function --- */
    function createFormatMenu(button, onSelect) {
        const menu = document.createElement('div');
        menu.className = 'export-format-menu';
        
        // Add format options
        Object.entries(EXPORT_FORMATS).forEach(([format, label]) => {
            const option = document.createElement('button');
            option.textContent = label;
            option.onclick = () => {
                onSelect(format);
                menu.remove();
            };
            menu.appendChild(option);
        });

        // Position menu next to the button with smart placement
        const buttonRect = button.getBoundingClientRect();
        const menuPadding = 10; // Space between button and menu
        
        menu.style.position = 'fixed';
        menu.style.right = `${window.innerWidth - buttonRect.left + menuPadding}px`;
        
        // Append menu to get its dimensions
        document.body.appendChild(menu);
        const menuRect = menu.getBoundingClientRect();
        
        // Check if menu would go off screen at the top
        if (buttonRect.top - menuRect.height < 0) {
            // Position below the button if not enough space above
            menu.style.top = `${buttonRect.bottom + menuPadding}px`;
        } else {
            // Position above the button
            menu.style.top = `${buttonRect.top - menuRect.height - menuPadding}px`;
        }

        // Update styles for the menu
        const styles = `
            /* Update Export Format Menu styles */
            .export-format-menu {
                position: fixed;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                z-index: 1002;
                min-width: 120px;
                animation: menuFadeIn 0.2s ease;
            }

            @keyframes menuFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .export-format-menu button {
                background: none;
                border: none;
                padding: 8px 16px;
                text-align: left;
                cursor: pointer;
                border-radius: 4px;
                color: #1a1a1b;
                font-size: 14px;
                white-space: nowrap;
                transition: background-color 0.2s ease;
            }

            .export-format-menu button:hover {
                background-color: #f6f7f8;
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .export-format-menu {
                    background: #1a1a1b;
                    border: 1px solid #343536;
                }
                
                .export-format-menu button {
                    color: #ffffff;
                }
                
                .export-format-menu button:hover {
                    background-color: #272729;
                }
            }
        `;

        // Add or update styles
        const existingStyle = document.getElementById('export-menu-styles');
        if (!existingStyle) {
            const styleElement = document.createElement('style');
            styleElement.id = 'export-menu-styles';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
        
        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        // Delay adding click listener to prevent immediate closure
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
        
        return menu;
    }

    /**
     * Creates a button element based on provided options.
     * @param {object} options - Button properties (id, title, svgHTML, url).
     * @returns {HTMLButtonElement|null} The created button element or null on error.
     */
    function createButtonElement(options) {
        try {
            const button = document.createElement('button');
            button.id = options.id;
            button.className = 'userscript-corner-button';
            button.title = options.title;
            button.setAttribute('aria-label', options.title);
            button.innerHTML = options.svgHTML;

            if (options.id === EXPORT_COMMENTS_BUTTON_ID) {
                button.onclick = async function() {
                    const existingMenu = document.querySelector('.export-format-menu');
                    if (existingMenu) {
                        existingMenu.remove();
                        return;
                    }

                    createFormatMenu(button, async (format) => {
                        button.style.opacity = '0.5';
                        button.style.cursor = 'wait';
                        try {
                            const comments = await getAllComments();
                            downloadComments(comments, format);
                        } catch (error) {
                            alert('Failed to export comments. Please try again.');
                        } finally {
                            button.style.opacity = '1';
                            button.style.cursor = 'pointer';
                        }
                    });
                };
            } else {
                button.onclick = function() {
                    window.location.href = options.url;
                };
            }
            return button;
        } catch (e) {
            console.error(`Reddit Corner Buttons & Ad Hider: Error creating button element ${options.id}:`, e);
            return null;
        }
    }

    /**
     * Removes existing corner buttons from the DOM.
     */
    function removeExistingButtons() {
        const idsToRemove = [SAVED_BUTTON_ID, MESSAGES_BUTTON_ID, EXPORT_COMMENTS_BUTTON_ID];
        // console.log("Reddit Corner Buttons & Ad Hider: Checking for and removing existing buttons...");
        idsToRemove.forEach(id => {
            const existingButton = document.getElementById(id);
            if (existingButton) {
                // console.log(` - Removing button with ID: ${id}`);
                existingButton.remove();
            }
        });
    }

    /**
     * Ensures corner buttons are present. Removes existing ones and adds new ones.
     */
    function initializeOrRefreshButtons() {
        if (!document.body) {
             console.error("Reddit Corner Buttons & Ad Hider: initializeOrRefreshButtons called but document.body not found!");
             return;
        }

        // Remove potentially lingering buttons
        removeExistingButtons();

        // Load current settings
        const settings = loadSettings();

        // Define button configurations with visibility checks
        const buttonConfigs = [
            settings.showSavedButton && {
                id: SAVED_BUTTON_ID,
                title: 'View Saved Posts',
                svgHTML: BOOKMARK_ICON_SVG,
                url: SAVED_URL
            },
            settings.showMessagesButton && {
                id: MESSAGES_BUTTON_ID,
                title: 'View Messages',
                svgHTML: MAIL_ICON_SVG,
                url: MESSAGES_URL
            },
            settings.showExportButton && {
                id: EXPORT_COMMENTS_BUTTON_ID,
                title: 'Export Comments',
                svgHTML: EXPORT_ICON_SVG,
                url: EXPORT_URL
            }
        ].filter(Boolean); // Remove false values

        // Create and append each button
        buttonConfigs.forEach(config => {
            const buttonElement = createButtonElement(config);
            if (buttonElement) {
                try {
                    document.body.appendChild(buttonElement);
                } catch(e) {
                    console.error(`Reddit Corner Buttons & Ad Hider: Failed to append button ${config.id} to body:`, e);
                }
            }
        });
    }


    /* --- Initialization Trigger --- */

    // Logic for initializing corner buttons (no changes needed here for the ad hiding part)
    const isOnMessagesPageInitially = window.location.href.startsWith(MESSAGES_URL);

    if (isOnMessagesPageInitially) {
        // Special Handling for Messages Page
        // console.log("Reddit Corner Buttons & Ad Hider: On messages page. Waiting for 'load' event.");
        if (document.readyState === 'complete') {
            // console.log("Reddit Corner Buttons & Ad Hider: 'load' event already complete, running initialization now.");
            initializeOrRefreshButtons();
        } else {
            window.addEventListener('load', initializeOrRefreshButtons);
        }
    } else {
        // Standard Handling for Other Pages
        // console.log("Reddit Corner Buttons & Ad Hider: Not on messages page. Waiting for 'DOMContentLoaded'.");
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            // console.log("Reddit Corner Buttons & Ad Hider: 'DOMContentLoaded' already complete, running initialization now.");
            initializeOrRefreshButtons();
        } else {
            window.addEventListener('DOMContentLoaded', initializeOrRefreshButtons);
        }
    }


    /* --- Global Flag Cleanup --- */

    window.addEventListener('beforeunload', () => {
        // console.log(`Reddit Corner Buttons & Ad Hider: Clearing global flag ${GLOBAL_FLAG_NAME} on beforeunload.`);
        delete window[GLOBAL_FLAG_NAME];
    });

})(); // End of UserScript IIFE