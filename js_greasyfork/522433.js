// ==UserScript==
// @name         Civitai Model Versions Wraparound + Search + Sort
// @version      0.3.1
// @description  Wraps CivitAI versions into multiple rows, adds a search bar, and allows sorting by Date, Alphabetical, Popularity, and Downloads.
// @author       redtvpe
// @match        https://civitai.com/models/*
// @grant        none
// @namespace    https://greasyfork.org/users/1418032
// @downloadURL https://update.greasyfork.org/scripts/522433/Civitai%20Model%20Versions%20Wraparound%20%2B%20Search%20%2B%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/522433/Civitai%20Model%20Versions%20Wraparound%20%2B%20Search%20%2B%20Sort.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1) SELECT THE VERSION CONTAINER ---
    const scrollAreaSelector = '.mantine-ScrollArea-viewport .mantine-Group-root';
    let scrollArea = null;

    // --- 2) PARSE __NEXT_DATA__ FOR MODEL VERSIONS ---
    let dateDict = {};
    let generationDict = {}; // For popularity (generationCountAllTime)
    let downloadDict = {};   // For downloads (downloadCountAllTime)
    try {
        const nextData = JSON.parse(document.getElementById("__NEXT_DATA__").innerText);

        // find the query that contains "model","getById"
        const modelQuery = nextData?.props?.pageProps?.trpcState?.json?.queries
            ?.find(x => x.queryHash.includes('"model","getById"'));

        const modelVersions = modelQuery?.state?.data?.modelVersions ?? [];

        // Build dictionaries using version name as key (lowercase)
        for (const v of modelVersions) {
            const versionName = v.name.trim().toLowerCase();
            dateDict[versionName]       = new Date(v.publishedAt);
            generationDict[versionName] = v.rank?.generationCountAllTime ?? 0;
            downloadDict[versionName]   = v.rank?.downloadCountAllTime ?? 0;
        }
    } catch (err) {
        console.warn("[Civitai] Could not parse modelVersions from __NEXT_DATA__:", err);
    }

    // --- 3) SAVE ORIGINAL ORDER ---
    let originalOrder = [];

    // --- 4) CREATE / UPDATE THE CONTROL PANEL ---
    function injectControls(container) {
        // Prevent duplicate insertion
        if (document.getElementById('civitaiVersionControls')) return;

        const controlPanel = document.createElement('div');
        controlPanel.id = 'civitaiVersionControls';
        controlPanel.style.marginBottom = '10px';
        controlPanel.style.display = 'flex';
        controlPanel.style.flexWrap = 'wrap';
        controlPanel.style.alignItems = 'center';
        controlPanel.style.gap = '10px';

        // Count label for visible versions
        const countLabel = document.createElement('span');
        countLabel.style.fontWeight = 'bold';
        updateCountLabel(countLabel, container);

        // Search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search versions...';
        searchInput.style.padding = '4px';
        searchInput.style.borderRadius = '4px';
        searchInput.style.border = '1px solid #666';
        searchInput.style.backgroundColor = '#2f2f2f';
        searchInput.style.color = '#ddd';

        // Clear button for search
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear';
        styleButton(clearBtn);

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });

        // "Sort by:" label
        const sortLabel = document.createElement('span');
        sortLabel.textContent = 'Sort by:';

        // Sort dropdown (mode)
        const sortSelect = document.createElement('select');
        sortSelect.style.padding = '4px';
        sortSelect.style.borderRadius = '4px';
        sortSelect.style.border = '1px solid #666';
        sortSelect.style.backgroundColor = '#2f2f2f';
        sortSelect.style.color = '#ddd';

        const sortOptions = [
            { value: 'default', text: 'Default' },
            { value: 'date',    text: 'Date' },
            { value: 'alpha',   text: 'Alphabetical' },
            { value: 'pop',     text: 'Popularity' },
            { value: 'down',    text: 'Downloads' },
        ];
        sortOptions.forEach(opt => {
            const optionEl = document.createElement('option');
            optionEl.value = opt.value;
            optionEl.textContent = opt.text;
            sortSelect.appendChild(optionEl);
        });

        // Asc/Desc toggle button
        let sortDirection = 'desc'; // default direction
        const toggleBtn = document.createElement('button');
        styleButton(toggleBtn);

        // Updated mapping for toggle text based on mode and direction:
        // For date: asc => "Oldest First", desc => "Newest First"
        // For alpha: asc => "A–Z", desc => "Z–A"
        // For pop/down: asc => "Most Underrated First", desc => "Most Overrated First"
        const toggleTextMapping = {
            default: { asc: "Default", desc: "Default" },
            date:    { asc: "Oldest First", desc: "Newest First" },
            alpha:   { asc: "A–Z", desc: "Z–A" },
            pop:     { asc: "Most Underrated First", desc: "Most Overrated First" },
            down:    { asc: "Most Underrated First", desc: "Most Overrated First" },
        };

        // Function to update toggle button text based on current sort mode and direction
        function updateToggleText() {
            const mode = sortSelect.value;
            toggleBtn.textContent = toggleTextMapping[mode][sortDirection] || "";
        }

        // Initialize toggle button text
        updateToggleText();

        // Event for toggle button
        toggleBtn.addEventListener('click', () => {
            sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
            updateToggleText();
            applySorting(container, sortSelect.value, sortDirection);
            // Re-run search to maintain hidden items
            searchInput.dispatchEvent(new Event('input'));
        });

        // Append controls
        controlPanel.appendChild(countLabel);
        controlPanel.appendChild(searchInput);
        controlPanel.appendChild(clearBtn);
        controlPanel.appendChild(sortLabel);
        controlPanel.appendChild(sortSelect);
        controlPanel.appendChild(toggleBtn);

        // Insert control panel before the container
        container.parentNode.insertBefore(controlPanel, container);

        // --- Event: Search ---
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const items = [...container.children];
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
            updateCountLabel(countLabel, container);
        });

        // --- Event: Sort dropdown changed ---
        sortSelect.addEventListener('change', () => {
            updateToggleText(); // update toggle text when sort mode changes
            applySorting(container, sortSelect.value, sortDirection);
            // Re-run search filter to maintain hidden items
            searchInput.dispatchEvent(new Event('input'));
        });
    }

    // Helper function to style buttons
    function styleButton(btn) {
        btn.style.padding = '4px 8px';
        btn.style.borderRadius = '4px';
        btn.style.border = '1px solid #666';
        btn.style.backgroundColor = '#444';
        btn.style.color = '#eee';
        btn.style.cursor = 'pointer';
        // Optionally add a hover effect:
        btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = '#555';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = '#444';
        });
    }

    // Helper: Update version count label based on visible buttons
    function updateCountLabel(labelEl, container) {
        const items = [...container.children];
        const visibleCount = items.filter(item => item.style.display !== 'none').length;
        labelEl.textContent = `Total Versions: ${visibleCount}`;
    }

    // --- 5) SORTING LOGIC ---
    function applySorting(container, mode, direction) {
        if (!container) return;

        // Temporarily disconnect the observer
        observer.disconnect();

        // Get current items (use the original order if needed)
        let items = [...container.children];

        // For "default", clear container and re-append original nodes.
        if (mode === 'default') {
            container.innerHTML = '';
            originalOrder.forEach(node => container.appendChild(node));
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        // Use a multiplier: for 'asc' multiplier is 1, for 'desc' it's -1.
        const multiplier = direction === 'asc' ? 1 : -1;

        items.sort((a, b) => {
            const aText = a.textContent.trim().toLowerCase();
            const bText = b.textContent.trim().toLowerCase();

            switch (mode) {
                case 'date': {
                    // For date, we want ascending to be oldest first (i.e. lower date first)
                    const aDate = dateDict[aText] || new Date(0);
                    const bDate = dateDict[bText] || new Date(0);
                    // When ascending, use aDate - bDate; when descending, bDate - aDate.
                    return direction === 'asc' ? aDate - bDate : bDate - aDate;
                }
                case 'alpha': {
                    return multiplier * aText.localeCompare(bText);
                }
                case 'pop': {
                    const aGen = generationDict[aText] || 0;
                    const bGen = generationDict[bText] || 0;
                    // For popularity, when ascending, lower count (underrated) first; descending, higher count (overrated) first.
                    return direction === 'asc' ? aGen - bGen : bGen - aGen;
                }
                case 'down': {
                    const aDown = downloadDict[aText] || 0;
                    const bDown = downloadDict[bText] || 0;
                    return direction === 'asc' ? aDown - bDown : bDown - aDown;
                }
                default:
                    return 0;
            }
        });

        // Clear the container and re-append sorted nodes
        container.innerHTML = '';
        items.forEach(item => container.appendChild(item));

        // Reconnect the observer
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- 6) MAIN LAYOUT ADJUSTMENT FUNCTION ---
    function adjustLayout() {
        scrollArea = document.querySelector(scrollAreaSelector);
        if (!scrollArea) return;

        // Wrap versions into multiple rows
        scrollArea.style.display = 'flex';
        scrollArea.style.flexWrap = 'wrap';
        scrollArea.style.gap = '8px';
        scrollArea.style.overflowX = 'visible';

        // Save original order on first run
        if (originalOrder.length === 0 && scrollArea.children.length > 0) {
            originalOrder = [...scrollArea.children];
        }

        injectControls(scrollArea);
    }

    // --- 7) SETUP MUTATION OBSERVER ---
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                adjustLayout();
            }
        }
    });
    const body = document.querySelector('body');
    if (body) {
        observer.observe(body, { childList: true, subtree: true });
    }

    // --- 8) INITIAL RUN ---
    adjustLayout();
})();
