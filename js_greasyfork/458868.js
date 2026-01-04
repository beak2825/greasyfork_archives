// ==UserScript==
// @name         Better Rule34
// @name:fr      Meilleure règle 34
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  A script to improve the use of rule34, now with API key support!
// @description:fr Un script pour améliorer l'utilisation de rule34, maintenant avec le support de la clé API!
// @author       You
// @match        https://rule34.xxx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://unpkg.com/fflate@0.8.2
// @downloadURL https://update.greasyfork.org/scripts/458868/Better%20Rule34.user.js
// @updateURL https://update.greasyfork.org/scripts/458868/Better%20Rule34.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- NEW: API Key Management ---
    const API_KEY_NAME = 'br34_api_key';
    const USER_ID_NAME = 'br34_user_id';

    /**
     * Checks if the API key and User ID are stored. If not, it displays a prompt.
     * This function will "halt" the script by returning a never-resolving promise if keys are missing.
     */
    async function checkApiKey() {
        const apiKey = await GM_getValue(API_KEY_NAME);
        const userId = await GM_getValue(USER_ID_NAME);

        // If on the options page, don't show the prompt; let the page handler do its job.
        if (window.location.href.includes('page=account&s=options')) {
            return true;
        }

        if (!apiKey || !userId) {
            console.log("Better Rule34: API key or User ID not found. Displaying prompt.");
            showApiKeyPrompt();
            // Return a promise that never resolves to halt further script execution until the user provides keys.
            return new Promise(() => {});
        }
        console.log("Better Rule34: API key and User ID found.");
        return true;
    }

    /**
     * Displays a modal dialog prompting the user to generate or enter API credentials.
     */
    function showApiKeyPrompt() {
        GM_addStyle(`
            #br34-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.7); display: flex;
                justify-content: center; align-items: center; z-index: 9999; font-family: sans-serif;
            }
            #br34-modal-content {
                background-color: #1e1e1e; color: #eee; padding: 20px 30px;
                border-radius: 8px; text-align: center; max-width: 400px;
                border: 1px solid #555;
            }
            #br34-modal-content p { margin: 0 0 20px 0; line-height: 1.5; }
            #br34-modal-buttons button, #br34-manual-input button {
                background-color: #333; color: #fff; border: 1px solid #555;
                padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 0 10px;
            }
            #br34-modal-buttons button:hover, #br34-manual-input button:hover { background-color: #555; }
            #br34-manual-input { margin-top: 20px; }
            #br34-manual-input input {
                display: block; width: calc(100% - 20px); margin: 10px auto; padding: 8px;
                background-color: #333; border: 1px solid #555; color: #fff; border-radius: 4px;
            }
        `);

        const overlay = document.createElement('div');
        overlay.id = 'br34-modal-overlay';

        const modal = document.createElement('div');
        modal.id = 'br34-modal-content';
        modal.innerHTML = `
            <p>Due to a recent update, this script needs an API key! Either enter one manually, or generate a new one (recommended)!</p>
            <div id="br34-modal-buttons">
                <button id="br34-manual-btn">Enter Manually</button>
                <button id="br34-generate-btn">Generate New One</button>
            </div>
            <div id="br34-manual-input" style="display: none;">
                <p style="font-size: 0.9em;">Go to the options page, copy the full text from the 'API Access Credentials' box, and paste it here.</p>
                <input type="text" id="br34-credential-input" placeholder="&api_key=...&user_id=...">
                <button id="br34-save-manual-btn">Save</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('br34-generate-btn').addEventListener('click', () => {
            window.location.href = 'https://rule34.xxx/index.php?page=account&s=options';
        });

        document.getElementById('br34-manual-btn').addEventListener('click', () => {
            document.getElementById('br34-modal-buttons').style.display = 'none';
            document.getElementById('br34-manual-input').style.display = 'block';
        });

        document.getElementById('br34-save-manual-btn').addEventListener('click', async () => {
            const credString = document.getElementById('br34-credential-input').value.trim();
            if (credString) {
                try {
                    const params = new URLSearchParams(credString.startsWith('?') ? credString : '?' + credString);
                    const apiKey = params.get('api_key');
                    const userId = params.get('user_id');

                    if (apiKey && userId) {
                        await GM_setValue(API_KEY_NAME, apiKey);
                        await GM_setValue(USER_ID_NAME, userId);
                        alert('API Key and User ID saved! The page will now reload.');
                        location.reload();
                    } else {
                        alert('Invalid format. Please paste the full string, e.g., &api_key=...&user_id=...');
                    }
                } catch (e) {
                    alert('Could not parse the provided string. Please check the format.');
                }
            }
        });
    }

    /**
     * On the account options page, finds the API credentials, saves them, and shows a confirmation banner.
     */
    async function handleOptionsPage() {
        if (!window.location.href.includes('page=account&s=options')) {
            return;
        }

        const textareas = document.querySelectorAll('textarea');
        let credTextarea = null;

        for (const textarea of textareas) {
            if (textarea.value.includes('&api_key=') && textarea.value.includes('&user_id=')) {
                credTextarea = textarea;
                break;
            }
        }

        if (credTextarea) {
            try {
                const credString = credTextarea.value.replace(/&amp;/g, '&');
                const params = new URLSearchParams(credString);
                const apiKey = params.get('api_key');
                const userId = params.get('user_id');

                if (apiKey && userId) {
                    await GM_setValue(API_KEY_NAME, apiKey);
                    await GM_setValue(USER_ID_NAME, userId);

                    // Show confirmation message
                    const banner = document.createElement('div');
                    banner.id = "br34-key-saved-banner";
                    banner.textContent = 'Better Rule34: API Key and User ID found and saved! You can now browse other pages.';
                    banner.style.cssText = `
                        background-color: #4CAF50; color: white; padding: 15px; text-align: center;
                        position: fixed; top: 0; left: 0; width: 100%; z-index: 10000; font-size: 16px;
                    `;
                    document.body.prepend(banner);
                    setTimeout(() => banner.remove(), 5000); // Remove after 5 seconds
                }
            } catch (e) {
                console.error("Better Rule34: Could not parse API credentials.", e);
            }
        } else {
            console.log("Better Rule34: Could not find API credentials textarea on this page.");
        }
    }


    const defaultConfig = {
        imageResizeNotice: "resize", // Changed default to "resize"
        theme: "dark",
        undeletePosts: true,
        clickAnywhereToStart: false, // Renamed to more descriptive "autoPlayVideo"
        htmlVideoPlayer: false,
        dynamicResizing: false,
        scrollPostsIntoView: false,
        downloadFullSizedImages: false,
        fitImageToScreen: false,
        hideAlerts: false,
        imageHover: true
    };

    // Initialize settings with default values if not already set
    function initializeSettings() {
        for (const key in defaultConfig) {
            if (GM_getValue(key) === undefined) {
                GM_setValue(key, defaultConfig[key]);
            }
        }
    }

    // Theme definitions
    const themes = {
        "dark": {
            "primary": "#121212",
            "secondary": "#000011",
            "contrast": "#4a4a4a",
            "complementary": "#666666",
            "tableBackground": "transparent",
            "linkColor": "#00f"
        }
    };

    // Apply dynamic resizing styles if enabled
    function applyDynamicResizing() {
        if (GM_getValue("dynamicResizing", false)) {
            GM_addStyle(`
                div.sidebar { max-width: 30%; }
                div.sidebar li { font-size: 120%; }
                div.content { width: 100%; }
                .thumb { height: 20%; width: auto; }
            `);
        }
    }

    applyDynamicResizing();

    const urlParams = new URLSearchParams(window.location.search);

    // Settings data structure
    const settingsData = {
        "tabs": [
            {
                "name": "General",
                "settings": [
                    {
                        "name": "imageResizeNotice",
                        "description": "Remove the image resize notice",
                        "type": "dropdown",
                        "options": ["resize", "no-resize"]
                    },
                    {
                        "name": "undeletePosts",
                        "description": "Display deleted posts",
                        "type": "checkbox"
                    },
                    {
                        "name": "hideAlerts",
                        "description": "Hide script warnings",
                        "type": "checkbox"
                    }
                ]
            },
            {
                "name": "Theme",
                "settings": [
                    {
                        "name": "theme",
                        "description": "Theme selection",
                        "type": "dropdown",
                        "options": Object.keys(themes), // Dynamically populate with available themes
                        "onChange": setTheme // Apply the theme immediately when changed
                    },
                    {
                        "name": "createNewTheme",
                        "description": "Create New Theme",
                        "type": "custom", // Use a custom type for more control
                        "render": (settingDiv, currentTheme) => {
                            const input = document.createElement('input');
                            input.type = 'text';
                            input.placeholder = 'Enter new theme name';
                            input.style.cssText = `background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border: 1px solid ${currentTheme.contrast}; padding: 3px; margin-right: 5px;`;
                            settingDiv.appendChild(input);

                            const button = document.createElement('button');
                            button.classList.add('settings-button');
                            button.textContent = 'Create';
                            button.style.cssText = `background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border: 1px solid ${currentTheme.contrast}; padding: 5px 10px; cursor: pointer; border-radius: 5px;`;
                            button.addEventListener('click', () => {
                                const newThemeName = input.value.trim();
                                if (newThemeName) {
                                    if (themes[newThemeName]) {
                                        alert('A theme with that name already exists!');
                                        return;
                                    }
                                    themes[newThemeName] = { ...themes.dark }; // Start with a copy of the dark theme
                                    GM_setValue("themes", themes); // Save the updated themes
                                    // Update the theme dropdown options
                                    const themeDropdown = document.querySelector('.settings-tab-content .settings-dropdown'); // Assuming you add a class to the dropdown
                                    if (themeDropdown) {
                                        const optionElement = document.createElement('option');
                                        optionElement.value = newThemeName;
                                        optionElement.textContent = newThemeName;
                                        themeDropdown.appendChild(optionElement);
                                    }
                                    // Refresh the settings panel to show the new theme
                                    openSettings();
                                } else {
                                    alert('Please enter a theme name.');
                                }
                            });
                            settingDiv.appendChild(button);
                        }
                    },
                    {
                        "name": "customizeTheme",
                        "description": "Customize Current Theme",
                        "type": "custom",
                        "render": (settingDiv, currentTheme) => {
                            const currentThemeName = GM_getValue("theme", "dark");
                            const currentThemeData = themes[currentThemeName];

                            const themeSettingsContainer = document.createElement('div');
                            themeSettingsContainer.style.cssText = `padding: 10px; border: 1px solid ${currentTheme.contrast}; margin-top: 10px;`;

                            for (const key in currentThemeData) {
                                const settingItemDiv = document.createElement('div');
                                settingItemDiv.style.marginBottom = '5px';

                                const label = document.createElement('label');
                                label.textContent = key;
                                label.style.cssText = 'display: block; margin-bottom: 2px;';
                                settingItemDiv.appendChild(label);

                                const input = document.createElement('input');
                                input.type = 'color';
                                input.value = currentThemeData[key];
                                input.addEventListener('change', () => {
                                    currentThemeData[key] = input.value;
                                    setTheme(); // Apply changes immediately
                                });
                                settingItemDiv.appendChild(input);

                                themeSettingsContainer.appendChild(settingItemDiv);
                            }

                            const saveButton = document.createElement('button');
                            saveButton.textContent = 'Save Changes';
                            saveButton.style.cssText = `background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border: 1px solid ${currentTheme.contrast}; padding: 5px 10px; cursor: pointer; border-radius: 5px; margin-top: 5px;`;
                            saveButton.addEventListener('click', () => {
                                GM_setValue("themes", themes);
                                alert(`Theme "${currentThemeName}" updated!`);
                            });
                            themeSettingsContainer.appendChild(saveButton);

                            settingDiv.appendChild(themeSettingsContainer);
                        }
                    }
                ]
            },
            {
                "name": "Navigation",
                "settings": [
                    {
                        "name": "autoPlayVideo",
                        "description": "Click anywhere on the page to start the video",
                        "type": "checkbox"
                    },
                    {
                        "name": "scrollPostsIntoView",
                        "description": "Scroll posts into view",
                        "type": "checkbox"
                    }
                ]
            },
            {
                "name": "Posts",
                "settings": [
                    {
                        "name": "htmlVideoPlayer",
                        "description": "Use HTML video player instead of the Fluid Player",
                        "type": "checkbox"
                    },
                    {
                        "name": "dynamicResizing",
                        "description": "Dynamically resize the page for odd aspect ratios or large screens",
                        "type": "checkbox"
                    },
                    {
                        "name": "downloadFullSizedImages",
                        "description": "Download the full resolution image when saving the image",
                        "type": "checkbox"
                    },
                    {
                        "name": "fitImageToScreen",
                        "description": "Fit image to screen (buggy)",
                        "type": "checkbox"
                    },
                    {
                        "name": "imageHover",
                        "description": "Displays images on the search page when hovered",
                        "type": "checkbox"
                    }
                ]
            }
        ]
    };

    // Function to create and display the settings overlay
    function openSettings() {
        // Get the current theme for styling
        const currentTheme = themes[GM_getValue("theme", "dark")];

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 1000; /* Adjust the 0.5 for desired transparency */`;

        // Create settings container
        const settingsContainer = document.createElement('div');
        settingsContainer.style.cssText = `width: 40vw; background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); text-align: left; display: flex; flex-direction: column; align-items: stretch; border-radius: 5px;`;

        // Create tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.style.cssText = 'display: flex; margin-bottom: 15px;';
        settingsContainer.appendChild(tabsContainer);

        settingsData.tabs.forEach(tab => {
            const tabButton = document.createElement('button');
            tabButton.classList.add('settings-tab-button');
            tabButton.textContent = tab.name;
            tabButton.style.cssText = `padding: 8px 15px; margin-right: 5px; background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border: 1px solid ${currentTheme.contrast}; cursor: pointer; border-radius: 5px 5px 0 0;`;
            tabsContainer.appendChild(tabButton);

            const tabContent = document.createElement('div');
            tabContent.classList.add('settings-tab-content');
            tabContent.style.cssText = `display: none; border: 1px solid ${currentTheme.contrast}; padding: 10px; border-radius: 0 0 5px 5px;`;
            settingsContainer.appendChild(tabContent);

            tab.settings.forEach(setting => {
                const settingDiv = document.createElement('div');
                settingDiv.classList.add(`setting-${setting.name}`);
                settingDiv.style.marginBottom = '10px';

                const label = document.createElement('label');
                label.textContent = setting.description;
                label.style.cssText = 'display: block; margin-bottom: 5px; cursor: pointer;';
                settingDiv.appendChild(label);

                if (setting.type === "checkbox") {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = GM_getValue(setting.name, false);
                    checkbox.addEventListener('change', () => GM_setValue(setting.name, checkbox.checked));
                    label.appendChild(checkbox);
                } else if (setting.type === "dropdown") {
                    const dropdown = document.createElement('select');
                    dropdown.classList.add("settings-dropdown")
                    dropdown.style.cssText = `background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border: 1px solid ${currentTheme.contrast}; padding: 3px;`;
                    const currentValue = GM_getValue(setting.name, setting.options[0]);
                    setting.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.textContent = option;
                        optionElement.selected = option === currentValue;
                        dropdown.appendChild(optionElement);
                    });
                    dropdown.addEventListener('change', () => {
                        GM_setValue(setting.name, dropdown.value);
                        if (setting.onChange) {
                            setting.onChange(); // Call the onChange function if it exists
                        }
                    });
                    settingDiv.appendChild(dropdown);
                } else if (setting.type === "button") {
                    const button = document.createElement('button');
                    button.classList.add('settings-button');
                    button.textContent = setting.description;
                    button.style.cssText = `background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border: 1px solid ${currentTheme.contrast}; padding: 5px 10px; cursor: pointer; border-radius: 5px;`;
                    button.addEventListener('click', setting.action);
                    settingDiv.appendChild(button);
                } else if (setting.type === "custom" && setting.render) {
                    setting.render(settingDiv, currentTheme); // Call the custom render function
                }

                tabContent.appendChild(settingDiv);
            });

            tabButton.addEventListener('click', () => {
                // Show the clicked tab content and hide others
                const allTabContents = document.querySelectorAll('.settings-tab-content');
                allTabContents.forEach(content => content.style.display = 'none');
                tabContent.style.display = 'block';

                // Highlight the active tab button
                const allTabButtons = document.querySelectorAll('.settings-tab-button');
                allTabButtons.forEach(button => button.style.backgroundColor = currentTheme.secondary);
                tabButton.style.backgroundColor = currentTheme.complementary;
            });
        });

        // Append to overlay and body
        overlay.appendChild(settingsContainer);
        document.body.appendChild(overlay);

        // Show the first tab by default
        const firstTabButton = document.querySelector('.settings-tab-button');
        if (firstTabButton) {
            firstTabButton.click();
        }

        // Close overlay when clicking outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }


    // Function to set the selected theme
    function setTheme() {
        // Load saved themes from GM storage
        const savedThemes = GM_getValue("themes");

        // Check if saved themes exist and are an object, otherwise use default
        if (typeof savedThemes === 'object' && savedThemes !== null) {
            Object.assign(themes, savedThemes);
        }

        const currentTheme = themes[GM_getValue("theme", "dark")];
        if (currentTheme) {
            const css = `
            table a:link, table a:visited { color: ${currentTheme.linkColor}; }
            body { background-color: ${currentTheme.primary}; }
            .flat-list, div#header ul#subnavbar, .current-page { background-color: ${currentTheme.secondary}; }
            div#header ul#navbar li.current-page { background-image: url(https://imgs.search.brave.com/77L3MmxBu09NuN5WiX4HlbmWjjUe7eAsmBbakS7-DTo/rs:fit:120:120:1/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8wLzAyL1Ry/YW5zcGFyZW50X3Nx/dWFyZS5zdmcvMTIw/cHgtVHJhbnNwYXJl/bnRfc3F1YXJlLnN2/Zy5wbmc); }
            .manual-page-chooser>input[type=text], .manual-page-chooser>input[type=submit], div.tag-search input[type=text], div.tag-search input[type=submit], button { background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; }
            .col2, h6, h5, .tag-count, b, li, ul, table.highlightable td, h2, table.form p, table, label { color: ${currentTheme.contrast}; }
            button { box-sizing: border-box; border: 1px solid; margin-top: 3px; border-color: ${currentTheme.contrast}; }
            table { background-color: ${currentTheme.tableBackground}; }
            div { color: ${currentTheme.contrast}; }
            .settings-tab-button { background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border-color: ${currentTheme.contrast}; }
            .settings-tab-button:hover, .settings-button:hover { background-color: ${currentTheme.complementary}; }
            .settings-tab-content { background-color: ${currentTheme.secondary}; color: ${currentTheme.contrast}; border-color: ${currentTheme.contrast}; }
            input[type="color"] { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-color: transparent; width: 100px; height: 40px; border: none; cursor: pointer; }
            input[type="color"]::-webkit-color-swatch { border: 1px solid ${currentTheme.contrast}; border-radius: 5px; }
            input[type="color"]::-moz-color-swatch { border: 1px solid ${currentTheme.contrast}; border-radius: 5px; }
        `;
            GM_addStyle(css);

            const userIndexElement = document.getElementById("user-index");
            if (userIndexElement) {
                Array.from(userIndexElement.getElementsByTagName("p")).forEach(element => element.style.color = currentTheme.contrast);
            }

            if (GM_getValue("resizePosts", false) && window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=view")) {
                GM_addStyle(".content{max-height: 45%; max-width: 45%; overflow: auto;}");
                const imageElement = document.getElementById("image");
                if (imageElement) {
                    imageElement.style.maxHeight = "50%";
                    imageElement.style.maxWidth = "fit-content";
                    imageElement.style.overflow = "auto";
                }
            }
        }
    }

    // Function to fetch data from Rule34 API
    async function getFromRule34(tags, index, limit, useBlacklist = false) {
        const apiKey = await GM_getValue(API_KEY_NAME);
        const userId = await GM_getValue(USER_ID_NAME);

        tags = tags === "all" ? "" : tags;
        let pid = index;
        if (useBlacklist) {
            const blacklist = decodeURIComponent(getCookie("tag_blacklist")).replaceAll("%20", " -").replaceAll("%2F", "/");
            tags += blacklist ? ` -${blacklist}` : "";
        }
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}&limit=${limit}&pid=${pid}&json=1&api_key=${apiKey}&user_id=${userId}`;

        try {
            const response = await GM.xmlHttpRequest({
                method: 'GET',
                url: url
            });

            if (response.status >= 200 && response.status < 300) {
                return JSON.parse(response.responseText);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching data: ${error}`);
            return []; // Return an empty array on error
        }
    }

    // Function to fetch data for a specific post ID
    async function getFromRule34WithId(id) {
        const apiKey = await GM_getValue(API_KEY_NAME);
        const userId = await GM_getValue(USER_ID_NAME);
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&id=${id}&json=1&api_key=${apiKey}&user_id=${userId}`;

        try {
            const response = await GM.xmlHttpRequest({
                method: 'GET',
                url: url
            });

            if (response.status >= 200 && response.status < 300) {
                const data = JSON.parse(response.responseText);
                return data[0] || null; // Return the post or null if not found
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching post: ${error}`);
            return null;
        }
    }

    // Helper function to get a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // --- SCRIPT'S ORIGINAL FUNCTIONS (UNCHANGED, except where noted) ---
    // (The rest of your original script functions go here, from getTagsFromUrl down to the end)

    // Function to extract tags from the current URL
    function getTagsFromUrl(currentUrl) {
        if (currentUrl.startsWith("https://rule34.xxx/index.php?page=post&s=list&tags=")) {
            return currentUrl.replace("https://rule34.xxx/index.php?page=post&s=list&tags=", "");
        }
        return "";
    }

    // Function to create modified links for post navigation
    function createLinks() {
        try {
            if (window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=list&tags=")) {
                const imageList = document.getElementsByClassName("image-list")[0];
                if (!imageList) throw new Error("Image list not found.");

                const anchors = imageList.getElementsByTagName("a");
                if (anchors.length === 0) throw new Error("No anchor elements found in image list.");

                const urlParams = new URLSearchParams(window.location.search);
                let pageNum = parseInt(urlParams.get("pid")) || 0;

                for (let i = 0; i < anchors.length; i++) {
                    anchors[i].href = `${anchors[i].href}&srchTags=${getTagsFromUrl(window.location.href)}&index=${i + pageNum}`.replace(/[\?&]pid=\d*/g, '');
                }
            } else {
                // This is not an error, just means we are not on the search page.
            }
        } catch (error) {
            console.error(`Error in createLinks: ${error}`);
        }
    }

    let preloadedData;

    // Function to preload data for the next post
    async function preloadNextPost(srchTags, nextIndex, limit) {
        try {
            preloadedData = await getFromRule34(srchTags, nextIndex, limit, true);
        } catch (error) {
            console.error(`Error preloading next post: ${error}`);
        }
    }

    // Function to navigate to the next post
    function navigateToNextPost(srchTags, nextIndex) {
        if (!preloadedData || preloadedData.length === 0) {
            console.log(preloadedData)
            console.error("No preloaded data available.");
            return;
        }

        const nextPostId = preloadedData[0].id;
        const newUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${nextPostId}&srchTags=${encodeURIComponent(srchTags)}&index=${nextIndex}`;
        window.location.href = newUrl;
    }

    // Function to navigate to the previous post
    async function backPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const srchTags = urlParams.get("srchTags");
        const currentIndex = parseInt(urlParams.get("index"));

        if (!srchTags || isNaN(currentIndex) || currentIndex <= 0) {
            console.error("Invalid URL parameters or no previous post.");
            return;
        }

        const nextIndex = currentIndex - 1;
        const limit = 1;

        try {
            const jsonInfo = await getFromRule34(srchTags, nextIndex, limit);
            if (!jsonInfo || jsonInfo.length === 0) {
                console.error("No data received from API.");
                return;
            }

            const nextPostId = jsonInfo[0].id;
            const newUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${nextPostId}&srchTags=${encodeURIComponent(srchTags)}&index=${nextIndex}`;
            window.location.href = newUrl;
        } catch (error) {
            console.error(`Error navigating to previous post: ${error}`);
        }
    }

    // Function to select a random post and navigate to it
    async function randomVideo() {
        const urlParams = new URLSearchParams(window.location.search);
        let srchTags = urlParams.get("tags");

        if (!srchTags) {
            const tagsInput = document.querySelector("input[name='tags']");
            srchTags = tagsInput ? tagsInput.value.replace(/ /g, "+") : "";
        }

        try {
            const posts = await getFromRule34(srchTags, 0, 1000);
            if (posts.length === 0) {
                console.error("No posts found for the given tags.");
                return;
            }

            const randNum = Math.floor(Math.random() * posts.length);
            const postId = posts[randNum].id;
            const newUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${postId}&tags=${encodeURIComponent(srchTags)}&index=${randNum}`;
            window.location.href = newUrl;
        } catch (error) {
            console.error(`Error in randomVideo: ${error}`);
        }
    }

    // Function to download all posts for the current search
    async function downloadAllPostFiles() {
        const urlParams = new URLSearchParams(window.location.search);
        let srchTags = urlParams.get("tags");

        if (!srchTags) {
            const tagsInput = document.querySelector("input[name='tags']");
            srchTags = tagsInput ? tagsInput.value.replace(/ /g, "+") : "";
        }

        try {
            const posts = await getFromRule34(srchTags, 0, 1000);
            if (posts.length === 0) {
                console.error("No posts found for the given tags.");
                return;
            }

            const zipFiles = {};
            const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.flv', '.wmv', '.mpeg'];
            let postsDownloaded = 0;
            const totalPosts = posts.length;

            for (const post of posts) {
                const fileUrl = post.file_url;
                const sampleUrl = post.sample_url;
                const fileExtension = fileUrl.slice(fileUrl.lastIndexOf('.')).toLowerCase();
                const downloadUrl = videoExtensions.includes(fileExtension) ? sampleUrl : fileUrl;
                const fileName = downloadUrl.split("/").pop();

                try {
                    const fileData = await fetchFileAsBlob(downloadUrl);
                    const uint8Array = new Uint8Array(await fileData.arrayBuffer());
                    zipFiles[fileName] = uint8Array;
                    console.log(`Added file ${fileName} to zip`);
                    postsDownloaded++;
                    document.title = `${postsDownloaded}/${totalPosts}`;
                } catch (error) {
                    console.error(`Error fetching file ${downloadUrl}: ${error}`);
                }
            }

            const zipBlob = fflate.zipSync(zipFiles, {
                level: 0,
                mtime: new Date()
            });
            console.log("Zip finished");

            const a = document.createElement("a");
            const zipBlobUrl = URL.createObjectURL(new Blob([zipBlob], {
                type: "application/zip"
            }));
            a.href = zipBlobUrl;
            a.download = `${srchTags.replace(/\+/g, "_")}.zip`;
            a.click();
        } catch (error) {
            console.error(`Error in downloadAllPostFiles: ${error}`);
        }
    }

    // Helper function to fetch a file as a Blob
    async function fetchFileAsBlob(url) {
        try {
            const response = await GM.xmlHttpRequest({
                method: "GET",
                url: url,
                responseType: "blob"
            });

            if (response.status >= 200 && response.status < 300) {
                return response.response;
            } else {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(`Error fetching ${url}: ${error}`);
        }
    }

    // Function to create and append navigation buttons
    function createNavigationButtons() {
        const tagSearch = document.getElementsByClassName("tag-search")[0];
        if (tagSearch) {
            const randomButton = document.createElement("button");
            randomButton.textContent = "Random";
            randomButton.addEventListener("click", randomVideo);
            tagSearch.appendChild(randomButton);

            const downloadAllButton = document.createElement("button");
            downloadAllButton.textContent = "↓";
            downloadAllButton.addEventListener("click", downloadAllPostFiles);
            tagSearch.appendChild(downloadAllButton);
        }

        const imageSublinks = document.getElementsByClassName("image-sublinks")[0];
        if (imageSublinks) {
            const backButton = document.createElement("button");
            backButton.textContent = "Back";
            backButton.addEventListener("click", backPost);
            imageSublinks.appendChild(backButton);

            const nextButton = document.createElement("button");
            nextButton.id = "nextButton";
            nextButton.textContent = "Next";
            nextButton.addEventListener("click", () => {
                const urlParams = new URLSearchParams(window.location.search);
                const srchTags = urlParams.get("srchTags");
                const currentIndex = parseInt(urlParams.get("index"));
                navigateToNextPost(srchTags, currentIndex + 1);
            });
            imageSublinks.appendChild(nextButton);
        }
    }

    // Function to enable dynamic resizing of the search input field
    function enableDynamicInputResizing() {
        const awesompleteElement = document.querySelector(".awesomplete > input");
        if (!awesompleteElement) return;

        awesompleteElement.style.position = "relative";
        awesompleteElement.style.zIndex = "99";

        function resizeInput() {
            this.style.minWidth = "100%";
            this.style.width = `${this.value.length}ch`;
        }

        function restoreNormalSize() {
            this.style.width = "100%";
        }

        awesompleteElement.addEventListener('input', resizeInput);
        awesompleteElement.addEventListener('click', resizeInput);
        awesompleteElement.addEventListener('blur', restoreNormalSize);
    }

    // Add keyboard navigation for posts
    const imageSublinks = document.getElementsByClassName("image-sublinks")[0];
    if (imageSublinks) {
        document.addEventListener("keydown", function(event) {
            if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

            const urlParams = new URLSearchParams(window.location.search);
            const srchTags = urlParams.get("srchTags");
            const currentIndex = parseInt(urlParams.get("index"));

            if (event.key === "ArrowRight") {
                navigateToNextPost(srchTags, currentIndex + 1);
            } else if (event.key === "ArrowLeft") {
                backPost();
            }
        });
    }

    // Function to handle deleted posts
    async function handleDeletedPosts(id) {
        const statusNotices = document.getElementsByClassName("status-notice");
        if (statusNotices.length === 0) return;

        let foundDeletedPost = false;
        for (const statusNotice of statusNotices) {
            if (statusNotice.firstChild.data.startsWith("This post was")) {
                foundDeletedPost = true;
                try {
                    const mediaJson = await getFromRule34WithId(id);
                    if (!mediaJson) throw new Error("Failed to retrieve post data.");

                    const mediaUrl = mediaJson.file_url;
                    const mediaType = mediaUrl.split('.').pop().toLowerCase();
                    const fitToScreen = document.getElementById("fit-to-screen");

                    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "wmv", "flv", "mkv", "3gp", "m4v", "mpg", "mpeg", "swf", "vob", "m2ts"];
                    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "svg", "webp", "heic", "heif", "ico", "raw", "psd", "ai", "eps"];

                    if (videoExtensions.includes(mediaType)) {
                        const video = document.createElement("video");
                        video.src = mediaUrl;
                        video.controls = true;
                        video.style.cssText = "max-height: 70%; max-width: 70%; overflow: auto;";
                        fitToScreen.appendChild(video);
                    } else if (imageExtensions.includes(mediaType)) {
                        const image = document.createElement("img");
                        image.src = mediaUrl;
                        image.style.cssText = "max-height: 70%; max-width: 70%; overflow: auto;";
                        fitToScreen.appendChild(image);
                    }

                    statusNotice.remove();
                } catch (error) {
                    console.error(`Error handling deleted post: ${error}`);
                }
                break;
            }
        }

        if (!foundDeletedPost) {
            console.log("This post is not deleted.");
        }
    }

    // Function to download a file
    async function downloadFile(fileUrl, filename) {
        try {
            const response = await GM.xmlHttpRequest({
                method: 'GET',
                url: fileUrl,
                responseType: 'blob'
            });

            if (response.status >= 200 && response.status < 300) {
                const blob = response.response;
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                URL.revokeObjectURL(link.href);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error downloading file: ${error}`);
        }
    }

    // Helper function to get the last link in a parent element
    function getLastLinkInParent(element) {
        const elements = element.parentNode.querySelectorAll("a");
        return elements[elements.length - 1];
    }

    // Function to handle the image resize popup
    function handleImageResizePopup() {
        try {
            if (GM_getValue("imageResizeNotice", "resize") === "no-resize") {
                const resizedNotice = document.getElementById('resized_notice');
                if (resizedNotice) resizedNotice.style.display = 'none';
            }
            // Removed "original" option as it was causing issues and is not typically necessary
        } catch (error) {
            console.error(`Error handling image resize popup: ${error}`);
        }
    }

    // Function to start the video on the first click
    function autoPlayVideo() {
        if (GM_getValue("autoPlayVideo", false)) {
            let isFirstClick = true;

            document.addEventListener("click", function() {
                if (isFirstClick) {
                    const videoPlayer = document.getElementById("gelcomVideoPlayer");
                    if (videoPlayer) {
                        videoPlayer.autoplay = true;
                        const playButton = document.getElementById("gelcomVideoPlayer_fluid_initial_play");
                        if (playButton) playButton.click();
                    }
                    isFirstClick = false;
                }
            });
        }
    }

    autoPlayVideo()

    // Function to add buttons for adding tags to the search
    function addTagButtons() {
        const tagTypes = ["tag-type-copyright", "tag-type-general", "tag-type-character", "tag-type-artist", "tag-type-metadata"];
        for (const tagType of tagTypes) {
            const elements = document.getElementsByClassName(tagType);
            for (const element of elements) {
                const button = document.createElement("button");
                button.textContent = "+";
                button.addEventListener("click", function() {
                    const tagsInput = document.querySelector("[name='tags']");
                    const tagToAdd = getLastLinkInParent(this).textContent.trim().replaceAll(" ", "_");
                    tagsInput.value += ` ${tagToAdd}`;
                });
                element.insertBefore(button, element.firstChild);
            }
        }
    }

    // Function to make the video/image container resizable
    function makePostResizable(isImage) {
        let div = isImage ? document.getElementById("image") : document.getElementById("fluid_video_wrapper_gelcomVideoPlayer");
        if (!div) return;

        if (isImage) {
            const newDiv = document.createElement("div");
            newDiv.style.position = "relative";
            div.parentNode.insertBefore(newDiv, div);
            newDiv.appendChild(div);
            div = newDiv;
            document.getElementById("image").style.maxHeight = 'none';
        }

        const resizer = document.createElement("div");
        resizer.style.cssText = "width: 10px; height: 10px; background-color: white; position: absolute; bottom: 0; right: 0; cursor: se-resize; z-index: 10;";

        let isResizing = false;
        let currentX, currentY, initialWidth, initialHeight;

        resizer.addEventListener("mousedown", function(e) {
            document.body.style.userSelect = 'none';
            isResizing = true;
            currentX = e.clientX;
            currentY = e.clientY;
            initialWidth = parseFloat(getComputedStyle(div).width);
            initialHeight = parseFloat(getComputedStyle(div).height);
        });

        document.addEventListener("mouseup", () => {
            document.body.style.userSelect = '';
            isResizing = false;
        });

        document.addEventListener("mousemove", function(e) {
            if (!isResizing) return;

            let newWidth = initialWidth + (e.clientX - currentX);
            let newHeight = initialHeight + (e.clientY - currentY);
            if (!e.shiftKey) {
                const ratio = initialWidth / initialHeight;
                newHeight = newWidth / ratio;
            }

            if (isImage) {
                const innerImage = div.querySelector("img");
                innerImage.style.width = `${newWidth}px`;
                innerImage.style.height = `${newHeight}px`;
            }

            div.style.width = `${newWidth}px`;
            div.style.height = `${newHeight}px`;
            div.style.maxHeight = "1000vh";

            const videoPlayer = document.getElementById("gelcomVideoPlayer");
            if (videoPlayer) {
                videoPlayer.style.maxHeight = "1000vh";
                videoPlayer.style.height = "100%";
            }

            const imageElement = document.getElementById("image");
            if (imageElement) {
                imageElement.style.width = `${newWidth}px`;
                imageElement.style.height = `${newHeight}px`;
                imageElement.style.maxHeight = "1000vh";
            }
        });

        div.appendChild(resizer);
    }

    // Add an input box after the tags input field
    function addInputBox() {
        const tagsElement = document.querySelector("[name='tags']");
        if (!tagsElement) return;

        const inputBox = document.createElement("input");
        inputBox.type = "text";
        tagsElement.after(inputBox);
    }

    // Function to set the value of the tags input field
    function setTags(tags) {
        const tagsInput = document.querySelector("[name='tags']");
        if (tagsInput) tagsInput.value = tags;
    }

    // Function to replace the Fluid Player with the native HTML5 video player
    async function replaceWithHtmlVideoPlayer(id) {
        const gelcomVideoContainer = document.getElementById("gelcomVideoContainer");
        if (!gelcomVideoContainer) return;

        try {
            const videoUrlData = await getFromRule34WithId(id);
            if (!videoUrlData) throw new Error("Failed to retrieve video URL.");

            const video = document.createElement("video");
            video.src = videoUrlData.file_url;
            video.controls = true;
            video.style.cssText = "max-height: 70%; max-width: 70%; overflow: auto;";

            gelcomVideoContainer.parentNode.insertBefore(video, gelcomVideoContainer.nextSibling);
            gelcomVideoContainer.remove();

            const statusNotices = document.getElementById("status-notices");
            if (statusNotices) statusNotices.remove();
        } catch (error) {
            console.error(`Error replacing video player: ${error}`);
        }
    }

    // Function to add a close button to status notice elements
    function addCloseButtonToStatusNotices() {
        const statusNoticeElements = document.querySelectorAll('.status-notice');
        statusNoticeElements.forEach(element => {
            const closeButton = document.createElement('button');
            closeButton.textContent = 'x';
            closeButton.style.cssText = 'background: none; border: none; cursor: pointer;';
            closeButton.addEventListener('click', () => element.remove());
            element.appendChild(closeButton);
        });
    }

    // Function to overlay the full-size image on top of the displayed image
    async function overlayFullSizeImage() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) return;

        const postJson = await getFromRule34WithId(id);
        if (!postJson) return;

        const originalImage = document.getElementById("image");
        if (!originalImage) return;

        const newImage = document.createElement("img");
        newImage.src = postJson.file_url;
        newImage.style.cssText = `opacity: 0; width: ${originalImage.width}px; height: ${originalImage.height}px; position: absolute; top: ${originalImage.offsetTop}px; left: ${originalImage.offsetLeft}px; z-index: 1;`;

        originalImage.parentNode.insertBefore(newImage, originalImage);
    }

    // Function to convert the search button to a link
    function convertSearchToLink() {
        const commitButton = document.querySelector("[name='commit']");
        if (!commitButton) return;

        commitButton.innerHTML = `<a href="https://rule34.xxx/index.php?page=post&s=list&tags=all">${commitButton.innerHTML}</a>`;
    }

    // Function to fit the post (image or video) to the screen
    function fitPostToScreen() {
        if (GM_getValue("downloadFullSizedImages", false) && !GM_getValue("hideAlerts", false)) {
            alert(`downloadFullSizedImage and fitImageToScreen often cause bugs when used together. To disable this alert turn hide alerts on in settings.`);
        }

        const postElement = document.getElementById("fluid_video_wrapper_gelcomVideoPlayer") || document.getElementById("image");
        if (!postElement) return;

        postElement.style.maxHeight = "85vh";
        postElement.style.width = "auto";

        const gelcomVideoPlayer = document.getElementById("gelcomVideoPlayer");
        if (gelcomVideoPlayer) {
            gelcomVideoPlayer.style.maxHeight = "85vh";
            gelcomVideoPlayer.style.width = "auto";
        }
    }

    // Function to add download buttons to each post in the search results
    function addDownloadButtonsToPosts() {
        GM_addStyle(`
            .spinner {
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3498db;
                border-radius: 50%;
                width: 12px;
                height: 12px;
                animation: spin 1s linear infinite;
                display: none;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .loading .spinner {
                display: inline-block;
            }
            .loading .button-text {
                display: none;
            }
        `);

        const thumbElements = document.querySelectorAll('.thumb');
        thumbElements.forEach(thumb => {
            const button = document.createElement('button');
            button.style.cssText = 'position: absolute; top: 0; right: 0;';

            const buttonText = document.createElement('span');
            buttonText.classList.add('button-text');
            buttonText.textContent = '↓';
            button.appendChild(buttonText);

            const spinner = document.createElement('div');
            spinner.classList.add('spinner');
            button.appendChild(spinner);

            button.addEventListener('click', async () => {
                button.classList.add('loading');
                try {
                    const aElement = thumb.querySelector('a');
                    if (!aElement) {
                        alert('No <a> element found within this thumb element.');
                        return;
                    }

                    const id = aElement.id.substring(1);
                    const data = await getFromRule34WithId(id);
                    if (!data) return;

                    const fileUrl = data.file_url;
                    const sampleUrl = data.sample_url;
                    const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.flv', '.wmv', '.mpeg'];
                    const fileExtension = fileUrl.split('.').pop().toLowerCase();
                    const downloadUrl = videoExtensions.includes(fileExtension) ? sampleUrl : fileUrl;
                    const filename = downloadUrl.split('/').pop();

                    await downloadFile(downloadUrl, filename);
                } catch (error) {
                    console.error('Error downloading file:', error);
                } finally {
                    button.classList.remove('loading');
                }
            });

            thumb.style.position = 'relative';
            thumb.appendChild(button);
        });
    }

    // Function to display media information on hover
    async function displayMediaData() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) return;

        const postJson = await getFromRule34WithId(id);
        if (!postJson) return;

        let mediaURL = postJson.file_url;
        const mediaType = mediaURL.split('.').pop().toLowerCase();

        const tooltipContent = document.createElement('div');

        const handleImage = async () => {
            const img = new Image();
            img.src = mediaURL;

            img.onload = async () => {
                const width = img.width;
                const height = img.height;

                try {
                    const response = await GM.xmlHttpRequest({
                        method: 'GET',
                        url: mediaURL,
                        responseType: 'blob'
                    });

                    const imageSizeBytes = response.response.size;
                    const imageSizeKB = imageSizeBytes / 1024;
                    const imageSizeMB = imageSizeKB / 1024;
                    const sizeInfo = imageSizeMB >= 1 ? `${imageSizeMB.toFixed(2)} MB` : `${imageSizeKB.toFixed(2)} KB`;

                    tooltipContent.innerHTML = `
                        <div>Media URL: ${mediaURL}</div>
                        <div>Media Type: ${mediaType}</div>
                        <div>Width: ${width}px</div>
                        <div>Height: ${height}px</div>
                        <div>Size: ${sizeInfo}</div>
                    `;
                    appendTooltipToPage(tooltipContent);
                } catch (error) {
                    console.error('Failed to fetch image size:', error);
                }
            };

            img.onerror = (error) => console.error('Failed to load image:', error);
        };

        const handleVideo = async () => {
            const video = document.createElement('video');
            video.src = mediaURL;
            mediaURL = postJson.sample_url;

            video.onloadedmetadata = async () => {
                const width = video.videoWidth;
                const height = video.videoHeight;

                try {
                    const response = await GM.xmlHttpRequest({
                        method: 'GET',
                        url: mediaURL,
                        responseType: 'blob'
                    });

                    const videoSizeBytes = response.response.size;
                    const videoSizeKB = videoSizeBytes / 1024;
                    const videoSizeMB = videoSizeKB / 1024;
                    const sizeInfo = videoSizeMB >= 1 ? `${videoSizeMB.toFixed(2)} MB` : `${videoSizeKB.toFixed(2)} KB`;

                    video.currentTime = 1;
                    video.onseeked = () => {
                        tooltipContent.innerHTML = `
                            <div>Media URL: ${mediaURL}</div>
                            <div>Media Type: ${mediaType}</div>
                            <div>Width: ${width}px</div>
                            <div>Height: ${height}px</div>
                            <div>Size: ${sizeInfo}</div>
                        `;
                        appendTooltipToPage(tooltipContent);
                    };
                } catch (error) {
                    console.error('Failed to fetch video size:', error);
                }
            };

            video.onerror = (error) => console.error('Failed to load video:', error);
        };

        if (['jpg', 'jpeg', 'png', 'gif'].includes(mediaType)) {
            await handleImage();
        } else if (['mp4', 'webm', 'ogg'].includes(mediaType)) {
            await handleVideo();
        } else {
            console.error('Unsupported media type:', mediaType);
        }
    }

    // Helper function to append the tooltip to the page
    function appendTooltipToPage(tooltipContent) {
        const infoIcon = document.createElement('span');
        infoIcon.innerHTML = 'ℹ️';
        infoIcon.style.cssText = 'cursor: pointer; margin-left: 10px;';
        infoIcon.title = 'Media Information';

        const tooltip = document.createElement('div');
        tooltip.appendChild(tooltipContent);
        tooltip.style.cssText = 'position: absolute; background-color: #fff; border: 1px solid #ccc; padding: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); display: none; z-index: 1000;';

        infoIcon.appendChild(tooltip);
        infoIcon.onmouseover = () => tooltip.style.display = 'block';
        infoIcon.onmouseout = () => tooltip.style.display = 'none';

        const imageSublinks = document.querySelector('.image-sublinks');
        if (imageSublinks) imageSublinks.appendChild(infoIcon);
    }

    let activeImageContainer = null;

    // Function to add a hover effect to display full-size images on the search page
    async function addHoverEffect() {
        const thumbImages = document.querySelectorAll('.thumb a[id^="p"]'); // More specific selector

        thumbImages.forEach(thumbLink => {
            const parentThumb = thumbLink.closest('.thumb');
            if (!parentThumb) return;

            parentThumb.addEventListener('mouseenter', async function(event) {
                if (activeImageContainer) {
                    activeImageContainer.remove();
                }

                let id = thumbLink.id.replace(/\D/g, '');
                const postData = await getFromRule34WithId(id);

                if (!postData || !postData.file_url) {
                    console.error(`No file_url found for ID: ${id}`);
                    return;
                }

                const imageContainer = document.createElement('div');
                imageContainer.style.cssText = 'position: absolute; z-index: 1000; border: 2px solid black; padding: 10px; background-color: white;';

                const image = document.createElement('img');
                image.style.maxWidth = '300px';
                image.style.maxHeight = '300px';
                image.src = postData.file_url;

                imageContainer.appendChild(image);
                document.body.appendChild(imageContainer);
                activeImageContainer = imageContainer;

                function moveImageAtCursor(e) {
                    if (parentThumb.matches(':hover')) {
                        imageContainer.style.left = `${e.pageX + 10}px`;
                        imageContainer.style.top = `${e.pageY + 10}px`;
                    } else {
                        imageContainer.remove();
                        document.removeEventListener('mousemove', moveImageAtCursor);
                        activeImageContainer = null;
                    }
                }

                document.addEventListener('mousemove', moveImageAtCursor);

                parentThumb.addEventListener('mouseleave', function() {
                    if (activeImageContainer) {
                        activeImageContainer.remove();
                        activeImageContainer = null;
                    }
                    document.removeEventListener('mousemove', moveImageAtCursor);
                });
            });
        });
    }

    // Function to scroll the post into view
    function scrollPostIntoView() {
        if (GM_getValue("scrollPostsIntoView", false)) {
            const postElement = document.getElementById("image") || document.getElementById("gelcomVideoPlayer");
            if (postElement) {
                setTimeout(() => postElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                }), 250);
            }
        }
    }

    // Register the settings menu command
    GM_registerMenuCommand('Settings', openSettings);

    function executeScript() {
        const urlParams = new URLSearchParams(window.location.search);
        // Call functions based on the current page and settings
        createNavigationButtons();
        createLinks();
        addCloseButtonToStatusNotices();
        setTheme();
        handleImageResizePopup();
        addTagButtons();
        enableDynamicInputResizing();
        scrollPostIntoView();

        try {
            const idParam = urlParams.get("id");
            if (idParam) {
                if (GM_getValue("undeletePosts", false)) {
                    handleDeletedPosts(idParam);
                }
                if (GM_getValue("htmlVideoPlayer", false)) {
                    replaceWithHtmlVideoPlayer(idParam);
                }
            }
        } catch (error) {
            console.error(`Error in script execution: ${error}`);
        }

        if (GM_getValue("downloadFullSizedImages", false)) {
            overlayFullSizeImage();
        }
        if (GM_getValue("fitImageToScreen", false)) {
            fitPostToScreen();
        }
        if (GM_getValue("imageHover", false)) {
            addHoverEffect();
        }

        if (window.location.href.includes('page=post&s=view')) {
            displayMediaData();
        }
        if (window.location.href.includes('page=post&s=list')) {
            addDownloadButtonsToPosts();
        }


        // Set tags based on URL parameters
        if (window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=view")) {
            setTags(urlParams.get("srchTags"));
        } else if (window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=list")) {
            setTags(urlParams.get("tags"));
        }

        // Ensure note boxes are always on top
        const noteBoxes = document.querySelectorAll(".note-box");
        noteBoxes.forEach(noteBox => noteBox.style.zIndex = "999");

        // Call functions to make video/image resizable after a short delay
        setTimeout(() => {
            makePostResizable(false); // For video
            makePostResizable(true); // For image
        }, 300);

        if (document.readyState === "complete" && !window.betterRule34Initialized) {
            const srchTags = urlParams.get("srchTags");
            const currentIndex = parseInt(urlParams.get("index"));

            if (!srchTags || isNaN(currentIndex)) {
                // Not on a post page, which is fine.
                return;
            }

            const nextIndex = currentIndex + 1;
            const limit = 1; // Only need to preload the very next one

            // Preload data for the next post
            preloadNextPost(srchTags, nextIndex, limit);

            // Event listener for when the user tries to navigate to the next post
            const nextButton = document.getElementById("nextButton");
            if (nextButton) {
                nextButton.removeEventListener("click", navigateToNextPost)
                nextButton.addEventListener("click", () => {
                    navigateToNextPost(srchTags, nextIndex);
                });
            }
            window.betterRule34Initialized = true;
        }
    }


    // --- Main Execution ---
    // Initialize settings first, always.
    initializeSettings();

    // Handle the options page immediately if we're on it.
    await handleOptionsPage();

    // Check for API key. This will halt the script with a prompt if the key is missing.
    await checkApiKey();

    // If the key exists, proceed with the rest of the script.
    executeScript();

    // Listen for popstate event to re-run the script when navigating through history
    window.addEventListener('popstate', executeScript);

})().catch(console.error);