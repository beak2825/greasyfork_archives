// ==UserScript==
// @name         Grok Feature Flags OLD DEPRICATED
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle feature flags on grok.com to test out new features
// @author       Blankspeaker
// @match        https://grok.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536218/Grok%20Feature%20Flags%20OLD%20DEPRICATED.user.js
// @updateURL https://update.greasyfork.org/scripts/536218/Grok%20Feature%20Flags%20OLD%20DEPRICATED.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    try {
        // Function to find and fetch the JavaScript file containing local_feature_flags
        async function findFlagsFile() {
            const scripts = Array.from(document.getElementsByTagName('script')).map(script => script.src).filter(src => src);
            for (const src of scripts) {
                if (src.includes('.js') && !src.includes('polyfill')) {
                    try {
                        const response = await fetch(src);
                        const text = await response.text();
                        if (text.includes('"local_feature_flags"')) {
                            console.log("Found flags file:", src);
                            return { src, text };
                        }
                    } catch (error) {
                        console.warn("Failed to fetch script:", src, error);
                    }
                }
            }
            console.error("No JavaScript file found containing local_feature_flags.");
            return null;
        }

        // Function to scrape flags from the JavaScript file
        function scrapeFlags(fileContent) {
            // Match flag definitions like SHOW_FAVORITE_BUTTON: e("show_favorite_button")
            const regex = /\b([A-Z_]+)\s*:\s*e\s*\(\s*"([a-z_]+)"\s*\)/g;
            const flags = {};
            let match;
            while ((match = regex.exec(fileContent)) !== null) {
                const upperKey = match[1]; // e.g., SHOW_FAVORITE_BUTTON
                const lowerKey = match[2]; // e.g., show_favorite_button
                flags[lowerKey] = false;
                flags[upperKey] = false;
            }
            // Handle non-boolean flags (preserve if present)
            const nonBooleanRegex = /\b([A-Z_]+)\s*:\s*t\s*\(\s*"([a-z_]+)"\s*\)/g;
            while ((match = nonBooleanRegex.exec(fileContent)) !== null) {
                const upperKey = match[1];
                const lowerKey = match[2];
                // Only include if already in localStorage (to avoid UI issues)
                if (currentFlags[upperKey] !== undefined) flags[upperKey] = currentFlags[upperKey];
                if (currentFlags[lowerKey] !== undefined) flags[lowerKey] = currentFlags[lowerKey];
            }
            return flags;
        }

        // Check localStorage availability (for incognito mode)
        let localStorageAvailable = true;
        try {
            localStorage.setItem("test", "test");
            localStorage.removeItem("test");
        } catch (error) {
            localStorageAvailable = false;
            console.warn("localStorage is restricted (e.g., incognito mode):", error);
        }

        // Read current flags from localStorage
        let rawFlags = localStorageAvailable ? localStorage.getItem("local_feature_flags") : null;
        console.log("Raw local_feature_flags:", rawFlags);
        let currentFlags = rawFlags ? JSON.parse(rawFlags) : {};

        // If localStorage is empty or unavailable, scrape flags from source
        if (Object.keys(currentFlags).length === 0) {
            console.log("No flags in localStorage. Attempting to scrape from source...");
            const flagsFile = await findFlagsFile();
            if (flagsFile) {
                const scrapedFlags = scrapeFlags(flagsFile.text);
                if (Object.keys(scrapedFlags).length > 0) {
                    currentFlags = { ...scrapedFlags };
                    if (localStorageAvailable) {
                        localStorage.setItem("local_feature_flags", JSON.stringify(currentFlags));
                        console.log("Scraped and initialized flags:", Object.keys(currentFlags));
                    } else {
                        console.warn("Using scraped flags in memory due to localStorage restrictions.");
                    }
                } else {
                    console.error("No flags scraped from source.");
                }
            } else {
                console.error("Unable to initialize flags: No source file found.");
            }
        }

        // Group flags by uppercase name to avoid duplicate display
        let flagGroups = {};
        Object.keys(currentFlags).forEach(flag => {
            const normalized = flag.toUpperCase();
            if (!flagGroups[normalized]) {
                flagGroups[normalized] = [];
            }
            flagGroups[normalized].push(flag);
        });
        let displayFlags = Object.keys(flagGroups);

        // Log flag counts
        console.log("Total flags:", Object.keys(currentFlags).length, "Unique flags (after normalization):", displayFlags.length);

        // Create UI element for flag picker
        let ui = document.createElement("div");
        ui.id = "feature-flags-ui";
        ui.style.display = "none"; // Initially hidden
        ui.innerHTML = `
            <div class="title-bar">
                <span>Feature Flags</span>
                <button id="minimize-btn">_</button>
                <button id="close-btn">X</button>
            </div>
            <div class="content">
                <div class="flag-list">
                    ${displayFlags.length > 0 ? displayFlags.map(normalizedFlag => {
                        // Use the first original key for checkbox state
                        const originalKeys = flagGroups[normalizedFlag];
                        const primaryKey = originalKeys[0];
                        return `
                            <label>
                                <input type="checkbox" data-flag="${normalizedFlag}" ${typeof currentFlags[primaryKey] === 'boolean' && currentFlags[primaryKey] ? 'checked' : ''}>
                                ${normalizedFlag}
                            </label>
                        `;
                    }).join("") : '<p>No feature flags available. Try opening the settings menu to populate flags.</p>'}
                </div>
                <button id="save-btn">Save</button>
            </div>
        `;

        // Append UI to body
        document.body.appendChild(ui);

        // Load saved UI state
        let uiState = localStorageAvailable ? JSON.parse(localStorage.getItem("feature_flags_ui_state") || "{}") : {};
        if (uiState.left && uiState.top) {
            ui.style.left = uiState.left + "px";
            ui.style.top = uiState.top + "px";
        }
        if (uiState.minimized) {
            ui.classList.add("minimized");
        }
        if (uiState.visible) {
            ui.style.display = "block";
        }

        // Add CSS for styling, dragging, and fixed save button
        let style = document.createElement("style");
        style.textContent = `
        #feature-flags-ui {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 400px; /* Wider UI to prevent text wrapping */
            background: #333333; /* Dark gray background */
            color: #ffffff; /* White text */
            border: 1px solid #555555;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
            z-index: 10000; /* Ensure UI is above other elements */
        }

        #feature-flags-ui .title-bar {
            background: #555555; /* Slightly lighter gray for title bar */
            color: #ffffff;
            padding: 5px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #feature-flags-ui .title-bar span {
            flex-grow: 1;
        }

        #feature-flags-ui .content {
            padding: 10px;
            display: flex;
            flex-direction: column;
            max-height: 400px;
        }

        #feature-flags-ui .flag-list {
            flex: 1;
            overflow-y: auto;
            padding-bottom: 10px;
        }

        #feature-flags-ui.minimized .content {
            display: none;
        }

        #feature-flags-ui label {
            display: flex; /* Keep checkbox and text inline */
            align-items: center;
            margin-bottom: 5px;
            color: #ffffff; /* White text for labels */
        }

        #feature-flags-ui label input {
            margin-right: 8px; /* Space between checkbox and text */
        }

        #feature-flags-ui button {
            color: #ffffff;
            background: #555555;
            border: 1px solid #777777;
        }

        #feature-flags-ui #save-btn {
            position: sticky;
            bottom: 0;
            margin-top: 10px;
            padding: 5px;
            width: 100%;
            box-sizing: border-box;
        }

        #feature-flags-ui p {
            color: #ffffff;
            margin: 0;
        }
        `;
        document.head.appendChild(style);

        // Add menu item for Feature Flags
        const manageSubscriptionItem = document.querySelector('div[role="menuitem"] svg path[d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"]');
        if (manageSubscriptionItem) {
            const menuItem = document.createElement("div");
            menuItem.setAttribute("role", "menuitem");
            menuItem.className = "relative flex select-none items-center cursor-pointer px-3 py-2 rounded-xl text-sm outline-none focus:bg-button-ghost-hover";
            menuItem.setAttribute("tabindex", "-1");
            menuItem.setAttribute("data-orientation", "vertical");
            menuItem.setAttribute("data-radix-collection-item", "");
            menuItem.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2] text-neutral-400 mr-2" stroke-width="2">
                    <path d="M10 4V4C8.13623 4 7.20435 4 6.46927 4.30448C5.48915 4.71046 4.71046 5.48915 4.30448 6.46927C4 7.20435 4 8.13623 4 10V13.6C4 15.8402 4 16.9603 4.43597 17.816C4.81947 18.5686 5.43139 19.1805 6.18404 19.564C7.03968 20 8.15979 20 10.4 20H14C15.8638 20 16.7956 20 17.5307 19.6955C18.5108 19.2895 19.2895 18.5108 19.6955 17.5307C20 16.7956 20 15.8638 20 14V14" stroke="currentColor" stroke-linecap="square"></path>
                    <path d="M12.4393 14.5607L19.5 7.5C20.3284 6.67157 20.3284 5.32843 19.5 4.5C18.6716 3.67157 17.3284 3.67157 16.5 4.5L9.43934 11.5607C9.15804 11.842 9 12.2235 9 12.6213V15H11.3787C11.7765 15 12.158 14.842 12.4393 14.5607Z" stroke="currentColor" stroke-linecap="square"></path>
                </svg>
                Feature Flags
            `;
            manageSubscriptionItem.parentElement.insertAdjacentElement("afterend", menuItem);

            // Toggle flag picker visibility on menu item click
            menuItem.addEventListener("click", () => {
                ui.style.display = ui.style.display === "none" ? "block" : "none";
                uiState.visible = ui.style.display === "block";
                if (localStorageAvailable) {
                    localStorage.setItem("feature_flags_ui_state", JSON.stringify(uiState));
                }
            });
        } else {
            console.warn("Manage Subscription menu item not found. Flag picker will be shown by default.");
            ui.style.display = "block"; // Fallback to visible if menu item not found
        }

        // Make UI draggable and save position
        let titleBar = ui.querySelector(".title-bar");
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - ui.offsetLeft;
            offsetY = e.clientY - ui.offsetTop;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                ui.style.left = (e.clientX - offsetX) + "px";
                ui.style.top = (e.clientY - offsetY) + "px";
                // Update saved position
                uiState.left = e.clientX - offsetX;
                uiState.top = e.clientY - offsetY;
                if (localStorageAvailable) {
                    localStorage.setItem("feature_flags_ui_state", JSON.stringify(uiState));
                }
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        // Minimize button and save state
        ui.querySelector("#minimize-btn").addEventListener("click", () => {
            ui.classList.toggle("minimized");
            uiState.minimized = ui.classList.contains("minimized");
            if (localStorageAvailable) {
                localStorage.setItem("feature_flags_ui_state", JSON.stringify(uiState));
            }
        });

        // Close button
        ui.querySelector("#close-btn").addEventListener("click", () => {
            ui.style.display = "none";
            uiState.visible = false;
            if (localStorageAvailable) {
                localStorage.setItem("feature_flags_ui_state", JSON.stringify(uiState));
            }
        });

        // Save button with auto-refresh
        ui.querySelector("#save-btn").addEventListener("click", () => {
            let modifiedFlags = { ...currentFlags };
            displayFlags.forEach(normalizedFlag => {
                let checkbox = ui.querySelector(`input[data-flag="${normalizedFlag}"]`);
                if (checkbox) {
                    // Update all original keys for this normalized flag
                    flagGroups[normalizedFlag].forEach(originalKey => {
                        modifiedFlags[originalKey] = checkbox.checked;
                    });
                }
            });
            if (localStorageAvailable) {
                localStorage.setItem("local_feature_flags", JSON.stringify(modifiedFlags));
            }
            console.log("Flags saved. Reloading page...");
            currentFlags = modifiedFlags; // Update in-memory flags for incognito
            location.reload(); // Auto-refresh the page
        });

        console.log("Grok Feature Flags Toggler loaded successfully with", displayFlags.length, "unique flags.");
    } catch (error) {
        console.error("Error in Grok Feature Flags Toggler:", error);
    }
})();