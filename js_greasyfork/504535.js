// ==UserScript==
// @name         Reddit Search Tab on Google
// @version      1.0
// @description  Adds a Reddit tab on Google search pages with various settings options for site and keyword search.
// @namespace    https://github.com/JrdnRgrs/reddit-search-tab-on-google
// @author       Jordan Rogers
// @match        *://*.google.com/search*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504535/Reddit%20Search%20Tab%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/504535/Reddit%20Search%20Tab%20on%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings: Change these to configure the script behavior
    const tabOnly = false; // Set to true if you want only the tab that adds "site:reddit.com"
    const tabDropdown = true; // Set to true if you want the settings displayed as a basic dropdown when the Reddit tab is clicked
    const caretDropdown = false; // Set to true if you want the settings displayed when the caret is clicked
    const iconDropdown = false; // Set to true if you want the settings displayed when the settings icon is clicked

    function addRedditTab() {
        const searchTabsContainer = document.querySelectorAll('[role="list"]');

        if (searchTabsContainer.length > 0) {
            const searchTabs = searchTabsContainer[0];

            // Create the Reddit tab container
            const redditTabContainer = document.createElement('div');
            redditTabContainer.setAttribute('role', 'listitem');
            redditTabContainer.style.position = 'relative';
            redditTabContainer.style.display = 'flex';
            redditTabContainer.style.alignItems = 'center';

            // Create Reddit button
            const redditButton = document.createElement('a');
            redditButton.href = '#';
            redditButton.className = 'nPDzT T3FoJb';
            redditButton.role = 'link';
            redditButton.innerHTML = `
                <div class="YmvwI">
                    <img src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png" alt="Reddit" style="height:16px;margin-right:5px;">
                    Reddit
                </div>
            `;
            redditTabContainer.appendChild(redditButton);

            if (tabOnly) {
                // Add click event to the Reddit button to perform the search with "site:reddit.com"
                redditButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const currentUrl = new URL(window.location.href);
                    const queryParams = currentUrl.searchParams;
                    const currentQuery = queryParams.get('q');

                    if (!currentQuery.includes('site:reddit.com')) {
                        queryParams.set('q', `${currentQuery} site:reddit.com`);
                    }
                    currentUrl.search = queryParams.toString();
                    window.location.href = currentUrl.toString();
                });
            }

            if (tabDropdown) {
                // Create the dropdown container
                const redditDropdown = document.createElement('div');
                redditDropdown.className = 'SF7xd';
                redditDropdown.setAttribute('role', 'listitem');
                redditDropdown.innerHTML = `
                    <g-popup jsname="V68bde" class="CzKhHb" jscontroller="DPreE" jsaction="A05xBd:IYtByb;EOZ57e:WFrRFb;">
                        <div jsname="oYxtQd" class="CcNe6e" aria-expanded="false" aria-haspopup="true" role="button" tabindex="0" jsaction="WFrRFb;keydown:uYT2Vb" style="display: inline-flex; align-items: center; padding: 0 10px; cursor: pointer;">
                            <div class="Lu57id" style="display: inline-flex; align-items: center;">
                                <span style="height:16px;line-height:16px;width:16px;margin-right:5px;" class="z1asCe SaPW2b">
                                    <img src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png" alt="Reddit" style="height:16px;">
                                </span>
                                Reddit
                            </div>
                        </div>
                        <div jsname="V68bde" class="UjBGL iRQHZe" style="z-index: 200; display: none; position: absolute; top: 35px;">
                            <div jsname="xl07Ob" class="CybWFf" tabindex="-1">
                                <div class="LtmTod">
                                    <div role="listitem" data-hveid="CD8QAA">
                                        <a href="#" class="LatpMc d4DFfb nPDzT T3FoJb" role="link">
                                            <div class="eJWNqc YmvwI" jsname="bVqjv">Site</div>
                                        </a>
                                    </div>
                                </div>
                                <div class="LtmTod">
                                    <div role="listitem" data-hveid="CEEQAA">
                                        <a href="#" class="LatpMc d4DFfb nPDzT T3FoJb" role="link">
                                            <div class="eJWNqc YmvwI" jsname="bVqjv">Keyword</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </g-popup>
                `;

                // Add event listeners for the dropdown toggle
                const dropdownButton = redditDropdown.querySelector('[aria-haspopup="true"]');
                const dropdownMenu = redditDropdown.querySelector('.UjBGL');

                dropdownButton.addEventListener('click', function() {
                    const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';
                    dropdownButton.setAttribute('aria-expanded', !isExpanded);
                    dropdownMenu.style.display = !isExpanded ? 'block' : 'none';
                });

                // Add event listeners for the dropdown items
                const siteLink = redditDropdown.querySelector('.LtmTod:first-child a');
                const keywordLink = redditDropdown.querySelector('.LtmTod:last-child a');

                siteLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    const currentUrl = new URL(window.location.href);
                    const queryParams = currentUrl.searchParams;
                    const currentQuery = queryParams.get('q');

                    if (!currentQuery.includes('site:reddit.com')) {
                        queryParams.set('q', `${currentQuery} site:reddit.com`);
                        currentUrl.search = queryParams.toString();
                        window.location.href = currentUrl.toString();
                    }
                });

                keywordLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    const currentUrl = new URL(window.location.href);
                    const queryParams = currentUrl.searchParams;
                    const currentQuery = queryParams.get('q');

                    if (!currentQuery.includes('reddit')) {
                        queryParams.set('q', `${currentQuery} reddit`);
                        currentUrl.search = queryParams.toString();
                        window.location.href = currentUrl.toString();
                    }
                });

                // Append the Reddit dropdown to the search tabs container
                searchTabs.appendChild(redditDropdown);
            }

            if (caretDropdown) {
                // Create caret icon
                const caretIcon = document.createElement('span');
                caretIcon.textContent = '▼';
                caretIcon.style.marginLeft = '5px';
                caretIcon.style.cursor = 'pointer';
                redditTabContainer.appendChild(caretIcon);

                // Create dropdown for the caret
                const settingsDropdown = document.createElement('div');
                settingsDropdown.style.position = 'absolute';
                settingsDropdown.style.backgroundColor = 'var(--gZl0ff, #303134)';
                settingsDropdown.style.color = '#e8eaed';
                settingsDropdown.style.border = '1px solid var(--p9J9c, #5f6368)';
                settingsDropdown.style.padding = '5px 10px';
                settingsDropdown.style.display = 'none';
                settingsDropdown.style.zIndex = '300';
                settingsDropdown.style.top = '100%';
                settingsDropdown.style.left = '0';
                settingsDropdown.innerHTML = `
                    <label>
                        <input type="radio" name="reddit-search-mode" value="site" ${GM_getValue('searchMode', 'site') === 'site' ? 'checked' : ''}>
                        Use site:reddit.com
                    </label><br>
                    <label>
                        <input type="radio" name="reddit-search-mode" value="keyword" ${GM_getValue('searchMode', 'site') === 'keyword' ? 'checked' : ''}>
                        Use keyword "reddit"
                    </label>
                `;
                redditTabContainer.appendChild(settingsDropdown);

                // Toggle dropdown on caret icon click
                caretIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    settingsDropdown.style.display = settingsDropdown.style.display === 'none' ? 'block' : 'none';
                });

                // Save selected option and update the Reddit tab click behavior
                settingsDropdown.querySelectorAll('input[name="reddit-search-mode"]').forEach(radio => {
                    radio.addEventListener('change', function() {
                        GM_setValue('searchMode', this.value);
                        settingsDropdown.style.display = 'none';
                    });
                });

                // Close dropdown if clicking outside
                document.addEventListener('click', function(e) {
                    if (!redditTabContainer.contains(e.target)) {
                        settingsDropdown.style.display = 'none';
                    }
                });
            }

            if (iconDropdown) {
                // Add settings icon next to the Reddit tab
                const settingsButton = document.createElement('span');
                settingsButton.innerHTML = '⚙️';
                settingsButton.style.cursor = 'pointer';
                settingsButton.style.marginLeft = '10px';
                redditTabContainer.appendChild(settingsButton);

                // Create settings popup
                const settingsPopup = document.createElement('div');
                settingsPopup.style.position = 'absolute';
                settingsPopup.style.backgroundColor = 'var(--gZl0ff, #303134)';
                settingsPopup.style.color = '#e8eaed';
                settingsPopup.style.border = '1px solid var(--p9J9c, #5f6368)';
                settingsPopup.style.padding = '10px';
                settingsPopup.style.display = 'none';
                settingsPopup.style.zIndex = '300';
                settingsPopup.innerHTML = `
                    <label>
                        <input type="radio" name="reddit-search-mode" value="site" ${GM_getValue('searchMode', 'site') === 'site' ? 'checked' : ''}>
                        Use site:reddit.com
                    </label><br>
                    <label>
                        <input type="radio" name="reddit-search-mode" value="keyword" ${GM_getValue('searchMode', 'site') === 'keyword' ? 'checked' : ''}>
                        Use keyword "reddit"
                    </label>
                `;

                // Toggle settings popup on icon click
                settingsButton.addEventListener('click', function() {
                    settingsPopup.style.display = settingsPopup.style.display === 'none' ? 'block' : 'none';
                });

                // Save selected option and update the Reddit tab click behavior
                settingsPopup.querySelectorAll('input[name="reddit-search-mode"]').forEach(radio => {
                    radio.addEventListener('change', function() {
                        GM_setValue('searchMode', this.value);
                        settingsPopup.style.display = 'none';
                    });
                });

                // Position the popup correctly
                settingsButton.addEventListener('click', function() {
                    const rect = settingsButton.getBoundingClientRect();
                    settingsPopup.style.left = `${rect.left}px`;
                    settingsPopup.style.top = `${rect.bottom + window.scrollY}px`;
                });

                // Append settings popup to body
                document.body.appendChild(settingsPopup);
            }
            if (tabOnly || caretDropdown || iconDropdown) {

                // Add click event to the Reddit tab to perform the search based on the selected mode
                redditButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const searchMode = GM_getValue('searchMode', 'site');
                    const currentUrl = new URL(window.location.href);
                    const queryParams = currentUrl.searchParams;
                    const currentQuery = queryParams.get('q');

                    if (searchMode === 'site') {
                        if (!currentQuery.includes('site:reddit.com')) {
                            queryParams.set('q', `${currentQuery} site:reddit.com`);
                        }
                    } else {
                        if (!currentQuery.includes('reddit')) {
                            queryParams.set('q', `${currentQuery} reddit`);
                        }
                    }
                    currentUrl.search = queryParams.toString();
                    window.location.href = currentUrl.toString();
                });

                searchTabs.appendChild(redditTabContainer);
            }
        }
    }

    // Run the function to add the Reddit tab
    addRedditTab();
})();
