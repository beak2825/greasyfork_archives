// ==UserScript==
// @name        Politics and War - Modern UI (Condensed) - Tabbed Nation Page v2
// @namespace   https://politicsandwar.com/
// @version     1.6.0 // Major revision for robust tab functionality
// @description A comprehensive userscript to modernize the UI of Politics and War with a tabbed nation page.
// @author      YourNameHere
// @match       https://politicsandwar.com/*
// @grant       GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/543272/Politics%20and%20War%20-%20Modern%20UI%20%28Condensed%29%20-%20Tabbed%20Nation%20Page%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/543272/Politics%20and%20War%20-%20Modern%20UI%20%28Condensed%29%20-%20Tabbed%20Nation%20Page%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- JavaScript to Load Font Awesome (Applies globally) ---
    function loadFontAwesome() {
        if (!document.querySelector('link[href*="fontawesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
            link.crossOrigin = 'anonymous';
            link.referrerPolicy = 'no-referrer';
            document.head.appendChild(link);
        }
    }

    // --- JavaScript to Insert Sidebar Icon Tags and &nbsp; (Applies where sidebar is present) ---
    function addSidebarIcons() {
        const sidebarLinks = document.querySelectorAll('#leftcolumn ul.sidebar > a > li');

        sidebarLinks.forEach(li => {
            if (li.querySelector('i.fa')) return; // Already has icon

            const linkText = li.textContent.trim().toLowerCase();
            let iconClass = '';

            // Assign icons based on link text (customize these as needed!)
            if (linkText.includes('home')) iconClass = 'fas fa-home';
            else if (linkText.includes('messages')) iconClass = 'fas fa-envelope';
            else if (linkText.includes('notifications')) iconClass = 'fas fa-bell';
            else if (linkText.includes('account')) iconClass = 'fas fa-user-circle';
            else if (linkText.includes('referrals')) iconClass = 'fas fa-users';
            else if (linkText.includes('changelog')) iconClass = 'fas fa-history';
            else if (linkText.includes('donate')) iconClass = 'fas fa-hand-holding-usd';
            else if (linkText.includes('tutorial')) iconClass = 'fas fa-book';
            else if (linkText.includes('pwpedia')) iconClass = 'fas fa-atlas';
            else if (linkText.includes('dossier')) iconClass = 'fas fa-address-card';
            else if (linkText.includes('logout')) iconClass = 'fas fa-sign-out-alt';
            else if (linkText.includes('view') && li.closest('ul').previousElementSibling && li.closest('ul').previousElementSibling.textContent.includes('Nation')) iconClass = 'fas fa-eye';
            else if (linkText.includes('edit')) iconClass = 'fas fa-edit';
            else if (linkText.includes('policies')) iconClass = 'fas fa-gavel';
            else if (linkText.includes('cities')) iconClass = 'fas fa-city';
            else if (linkText.includes('projects')) iconClass = 'fas fa-lightbulb';
            else if (linkText.includes('revenue')) iconClass = 'fas fa-coins';
            else if (linkText.includes('trade')) iconClass = 'fas fa-exchange-alt';
            else if (linkText.includes('military')) iconClass = 'fas fa-shield-alt';
            else if (linkText.includes('wars')) iconClass = 'fas fa-skull-crossbones';
            else if (linkText.includes('alliance')) iconClass = 'fas fa-handshake';
            else if (linkText.includes('baseball')) iconClass = 'fas fa-baseball-ball';
            else if (linkText.includes('keno')) iconClass = 'fas fa-dice';
            else if (linkText.includes('your templates')) iconClass = 'fas fa-file-alt';
            else if (linkText.includes('nations') && li.closest('ul').previousElementSibling && li.closest('ul').previousElementSibling.textContent.includes('World')) iconClass = 'fas fa-globe-americas';
            else if (linkText.includes('alliances') && li.closest('ul').previousElementSibling && li.closest('ul').previousElementSibling.textContent.includes('World')) iconClass = 'fas fa-users-cog';
            else if (linkText.includes('world news')) iconClass = 'fas fa-newspaper';
            else if (linkText.includes('leaderboards')) iconClass = 'fas fa-trophy';
            else if (linkText.includes('achievements')) iconClass = 'fas fa-award';
            else if (linkText.includes('treaty web')) iconClass = 'fas fa-sitemap';
            else if (linkText.includes('conflicts')) iconClass = 'fas fa-exclamation-triangle';
            else if (linkText.includes('bounties')) iconClass = 'fas fa-crosshairs';
            else if (linkText.includes('embargoes')) iconClass = 'fas fa-ban';
            else if (linkText.includes('radiation')) iconClass = 'fas fa-radiation';
            else if (linkText.includes('advertisements')) iconClass = 'fas fa-ad';
            else if (linkText.includes('data visualization')) iconClass = 'fas fa-chart-bar';
            else if (linkText.includes('world map')) iconClass = 'fas fa-map';
            else if (linkText.includes('templates') && li.closest('ul').previousElementSibling && li.closest('ul').previousElementSibling.textContent.includes('World')) iconClass = 'fas fa-file-invoice';
            else if (linkText.includes('forum')) iconClass = 'fas fa-comments';
            else if (linkText.includes('discord')) iconClass = 'fab fa-discord';
            else if (linkText.includes('helpful tools')) iconClass = 'fas fa-tools';
            else if (linkText.includes('wiki')) iconClass = 'fas fa-book-open';
            else if (linkText.includes('reddit')) iconClass = 'fab fa-reddit-alien';

            if (!iconClass) iconClass = 'fas fa-circle';

            const iconElement = document.createElement('i');
            iconElement.className = iconClass;
            li.insertBefore(iconElement, li.firstChild);
            li.insertBefore(document.createTextNode('\u00A0'), iconElement.nextSibling); // Add &nbsp;
        });
    }

    loadFontAwesome();
    setTimeout(addSidebarIcons, 500);

    let cssToInject = `
        /* === GLOBAL STYLES === */
        .informationbar.col-xs-12 {
            display:flex; justify-content:flex-end; align-items:center;
            padding:3px 15px;
            background-color:#282883;
            border-bottom:none; border-radius:15px;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            position:sticky; top:5px; z-index:1000;
            max-width:fit-content; margin:5px auto 0;
            left:0; right:0; height:fit-content; box-sizing:border-box;
        }
        .informationbar.col-xs-12 > span {
            display:flex; align-items:center; gap:10px;
            float:none !important; width:auto;
        }
        .informationbar.col-xs-12 > span > a {
            display:flex; align-items:center;
            color:#fff; text-decoration:none; font-size:13px; white-space:nowrap;
        }
        .informationbar.col-xs-12 > span img {
            margin-right:3px; width:18px !important; height:18px !important;
            vertical-align:middle;
        }
        .informationbar.col-xs-12 > span > a > b {
            color:#28d020 !important; margin-right:1px; font-weight:bold;
        }
        .informationbar.col-xs-12 > span > span { color:#fff; font-size:13px; }
        @media (max-width:768px) {
            .informationbar.col-xs-12 { padding:3px 10px; border-radius:10px; }
            .informationbar.col-xs-12 > span { flex-wrap:wrap; justify-content:center; gap:8px; }
            .informationbar.col-xs-12 > span > a, .informationbar.col-xs-12 > span > span { font-size:12px; }
            .informationbar.col-xs-12 > span img { width:16px !important; height:16px !important; }
        }

        /* === Sidebar Styles === */
        #leftcolumn {
            background-color:#f8f8f8; border-radius:10px;
            box-shadow:0 4px 10px rgba(0,0,0,0.1);
            padding:15px; margin-top:15px !important;
            height:fit-content; box-sizing:border-box; display:block !important;
        }
        ul.sidebar, div.sidebar { list-style:none; padding:0; margin-bottom:20px; }
        ul.sidebar > span, div.sidebar > span.bold {
            display:block; font-size:1.15em; font-weight:bold;
            color:#fff; background-color:#282883;
            padding:8px 15px; margin-bottom:10px; border-radius:5px;
            text-transform:uppercase; letter-spacing:0.5px;
        }
        ul.sidebar > a > li {
            list-style:none; padding:10px 15px; margin:0;
            color:#333; border-bottom:1px solid #eee;
            transition:background-color 0.2s ease, color 0.2s ease;
            font-size:15px; cursor:pointer; display:flex; align-items:center;
        }
        ul.sidebar > a > li::before { content:none; }
        ul.sidebar > a > li > i.fa, ul.sidebar > a > li > i.fab {
            margin-right:8px; color:#555; font-size:1.1em; transition:color 0.2s ease;
        }
        ul.sidebar > a:hover > li > i.fa, ul.sidebar > a:hover > li > i.fab { color:#282883; }
        ul.sidebar > a:last-of-type > li { border-bottom:none; }
        ul.sidebar > a:hover > li { background-color:#e6f0ff; color:#282883; }
        .msg_new_counter, .ntf_new_counter, .trd_new_counter {
            display:inline-block !important; float:right;
            color:#282883; font-weight:bold; font-size:0.9em;
            padding:0 4px; line-height:1; vertical-align:middle; margin-left:8px;
        }
        div.sidebar {
            padding:12px 15px; color:#555; font-size:14px; line-height:1.5;
        }
        div.sidebar br { line-height:0.5em; }
        div.sidebar .bold { font-weight:bold; }
    `;

    // --- CONDITIONAL CSS (apply ONLY to nation pages) ---
    if (window.location.pathname.startsWith('/nation/id=')) {
        cssToInject += `
            /* === Nation Page - General Layout === */
            .nation-main-content-wrapper { /* A new wrapper for all tabbed content */
                margin-top: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                overflow: hidden; /* Contains children, especially border-radius */
                padding-bottom: 20px; /* Add padding at the bottom of the tabbed area */
            }

            /* === Tabbed Interface Styles === */
            .pnw-tabs {
                width: 100%;
                margin-bottom: 0px; /* No margin here, as wrapper has it */
                background-color: #fff;
                border-radius: 0; /* Handled by parent wrapper */
                box-shadow: none; /* Handled by parent wrapper */
                overflow: hidden;
            }

            .pnw-tab-buttons {
                display: flex;
                border-bottom: 1px solid #eee;
                background-color: #f8f8f8;
                overflow-x: auto; /* Enable horizontal scrolling for many tabs */
                -webkit-overflow-scrolling: touch; /* For smoother scrolling on iOS */
            }

            .pnw-tab-button {
                flex-shrink: 0; /* Prevent buttons from shrinking */
                padding: 12px 20px;
                cursor: pointer;
                font-weight: bold;
                color: #555;
                text-decoration: none;
                transition: background-color 0.2s ease, color 0.2s ease;
                border-right: 1px solid #eee; /* Separator between tabs */
                white-space: nowrap; /* Keep tab text on one line */
            }

            .pnw-tab-button:last-child {
                border-right: none;
            }

            .pnw-tab-button:hover {
                background-color: #e6f0ff;
                color: #282883;
            }

            .pnw-tab-button.active {
                background-color: #282883;
                color: #fff;
                border-bottom: 3px solid #28d020; /* Highlight active tab */
                padding-bottom: 9px; /* Adjust padding for border */
            }

            .pnw-tab-content {
                padding: 20px; /* Padding for the content inside each tab */
                background-color: #fff;
            }

            .pnw-tab-pane {
                display: none;
            }

            .pnw-tab-pane.active {
                display: block;
            }

            /* Adjustments for elements that will be moved within tabs */
            .pnw-tab-pane table.nationtable,
            .pnw-tab-pane div[id$="-over-time"],
            .pnw-tab-pane div#score_pie,
            .pnw-tab-pane div#nation-map,
            .pnw-tab-pane .nation-activity,
            .pnw-tab-pane form { /* Added form as some interactions are forms */
                display: block !important; /* Make them visible once in a pane */
                margin-bottom: 20px !important; /* Add spacing between elements within a pane */
            }
            .pnw-tab-pane *:last-child { /* Targets the last element inside any pane */
                margin-bottom: 0 !important; /* No extra margin after the last element in a pane */
            }

            /* General styling for nation tables, whether in or out of tabs */
            table.nationtable {
                width:100% !important; border-collapse:collapse !important; border-spacing:0 !important;
                background-color:#fff !important;
                border-radius:8px !important;
                box-shadow:0 4px 10px rgba=0,0,0,0.1 !important;
                overflow:hidden !important;
                float:none !important;
                border:1px solid #ddd !important;
            }
            table.nationtable th[colspan="2"] {
                background-color:#282883 !important; color:#fff !important;
                padding:10px 15px !important; font-size:1.2em !important;
                font-weight:bold !important; text-transform:uppercase !important;
                letter-spacing:0.5px !important; text-align:left !important;
                border-bottom:1px solid #1a1a5a !important; margin-bottom:0 !important;
                box-sizing:border-box; vertical-align:middle !important;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            table.nationtable th[colspan="2"] i.fa {
                margin-right:8px; font-size:1.1em; vertical-align:middle; color:#fff;
            }
            table.nationtable th:not([colspan="2"]) {
                background-color:#f0f0f0 !important; padding:10px 15px !important;
                text-align:left !important; border-bottom:1px solid #ddd !important;
                font-weight:bold !important; color:#444 !important;
                vertical-align:top !important; box-sizing:border-box;
            }
            table.nationtable td {
                padding:10px 15px !important; border-bottom:1px solid #eee !important;
                color:#333 !important; vertical-align:top !important;
                line-height:1.4 !important; word-wrap:break-word; box-sizing:border-box;
            }
            table.nationtable tr:last-child td { border-bottom:none !important; }
            table.nationtable tbody tr:nth-child(even) { background-color:transparent !important; }
            table.nationtable tbody tr:hover { background-color:#f9f9f9 !important; transition:background-color 0.2s ease; }
            table.nationtable td i.fa-info-circle {
                color:#777 !important; font-size:0.9em !important;
                margin-left:5px !important; vertical-align:middle !important;
            }
            table.nationtable td i.fa-info-circle:hover { color:#282883 !important; }
            table.nationtable button i.fa-clone { color:#282883 !important; font-size:1.1em !important; }
            table.nationtable button {
                background:none !important; border:none !important;
                padding:0 5px !important; cursor:pointer; vertical-align:middle;
                transition:color 0.2s ease;
            }
            table.nationtable button:hover { color:#1a1a5a !important; }
            table.nationtable td img { margin-right:5px !important; vertical-align:middle !important; }
            table.nationtable tr.bold td:last-child { color:#333 !important; font-weight:bold !important; }

            .nation-activity td img[src*="bullet_blue.png"] { display:none !important; }
            .nation-activity td { padding-left:15px !important; }
            .nation-activity a { color:#282883 !important; text-decoration:none !important; }
            .nation-activity a:hover { text-decoration:underline !important; }

            /* Reset chart/map specific styling within tables */
            div[id$="-over-time"].js-plotly-plot,
            div#score_pie.js-plotly-plot,
            div#nation-map {
                background-color:transparent !important; padding:0 !important;
                border-radius:0 !important; box-shadow:none !important;
                margin:0 !important; border:none !important;
            }
            .js-plotly-plot .svg-container { background-color:transparent !important; }

            /* Ensure main content is full width on large screens and not affected by floats */
            #maincontent {
                width: auto !important;
                float: none !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                padding: 0 !important;
            }

            /* Adjustments for default P&W layout that uses col-md-9 */
            .container > .row {
                display: flex;
                flex-wrap: wrap;
                justify-content: center; /* Center content horizontally if space allows */
                align-items: flex-start; /* Align items to the top */
            }

            .container > .row > .col-md-9 {
                width: 100%; /* Take full width within the row */
                flex: 1 1 auto; /* Allow it to grow and shrink */
                max-width: 99%; /* Keep a tiny margin */
                margin-left: 0 !important;
                margin-right: 0 !important;
            }

            .container > .row > .col-md-3 {
                flex: 0 0 250px; /* Fixed width for sidebar */
                max-width: 250px;
                order: -1; /* Place sidebar first on larger screens */
            }

            @media (max-width: 991px) { /* Bootstrap's MD breakpoint */
                .container > .row > .col-md-3,
                .container > .row > .col-md-9 {
                    width: 100%;
                    max-width: 100%;
                    flex: 1 1 100%; /* Stack on small screens */
                    margin: 0 !important;
                    padding: 0 15px; /* Add some padding to edges */
                }
                #leftcolumn {
                    margin-top: 5px !important; /* Reduce top margin on small screens */
                    margin-bottom: 20px !important; /* Add bottom margin to separate from main content */
                }
            }
        `;

        // --- JavaScript for Tabbed Interface Logic ---
        function applyTabbedInterface() {
            const mainContent = document.querySelector('#maincontent');
            if (!mainContent) return;

            // Define the tab structure and content assignment logic
            const tabDefinitions = {
                'basic-info': {
                    title: 'Basic Info',
                    icon: 'fas fa-info-circle',
                    elements: [],
                    keywords: ['nation information', 'awards', 'general statistics', 'score/rank breakdown', 'pollution and radiation', 'alliance info']
                },
                'international-relations': {
                    title: 'International Relations',
                    icon: 'fas fa-handshake',
                    elements: [],
                    keywords: ['treaties', 'active wars', 'bounties', 'embargoes']
                },
                'military-economy': {
                    title: 'Military & Economy',
                    icon: 'fas fa-coins',
                    elements: [],
                    keywords: ['military information', 'military statistics', 'economic statistics', 'resources', 'daily revenue']
                },
                'cities-projects': {
                    title: 'Cities & Projects',
                    icon: 'fas fa-city',
                    elements: [],
                    keywords: ['cities', 'projects']
                },
                'charts-map': {
                    title: 'Charts & Map',
                    icon: 'fas fa-chart-bar',
                    elements: [],
                    keywords: ['-over-time', 'score_pie', 'nation-map'] // IDs for charts/map
                },
                'activity': {
                    title: 'Activity',
                    icon: 'fas fa-history',
                    elements: [],
                    keywords: ['nation activity'] // Look for a class or header
                },
                'other': {
                    title: 'Other',
                    icon: 'fas fa-question-circle',
                    elements: [],
                    keywords: [] // Catch-all for anything not matched
                }
            };

            // Create a wrapper for all tabbed content
            const nationContentWrapper = document.createElement('div');
            nationContentWrapper.className = 'nation-main-content-wrapper';

            // Find elements that should stay at the top (e.g., nation name, top summary)
            const topElementsToKeep = [];
            const elementsToMove = []; // Collect all elements that will go into tabs

            // Iterate through children of #maincontent to decide where each goes
            let foundNationInformation = false; // Flag to stop collecting top elements
            Array.from(mainContent.children).forEach(element => {
                // If it's a specific element we want to keep at the very top (like the main H1 or p.text-center)
                if (element.matches('h1.text-center, p.text-center')) {
                    topElementsToKeep.push(element);
                }
                // Once we hit the first nationtable, assume everything else should be tabbed content
                else if (element.tagName === 'TABLE' && element.classList.contains('nationtable')) {
                    foundNationInformation = true;
                    elementsToMove.push(element);
                }
                // Also capture other known main content blocks
                else if (element.id && (element.id.endsWith('-over-time') || element.id === 'score_pie' || element.id === 'nation-map')) {
                     foundNationInformation = true;
                     elementsToMove.push(element);
                }
                else if (element.classList.contains('nation-activity') || element.tagName === 'FORM') { // Capture activity and forms
                     foundNationInformation = true;
                     elementsToMove.push(element);
                }
                // Any other block-level elements after the initial top ones that aren't specifically excluded
                else if (foundNationInformation && element.nodeType === 1 && element.offsetParent !== null && element.textContent.trim() !== '' && !element.matches('br')) {
                    elementsToMove.push(element);
                }
            });

            // Re-append top elements
            mainContent.innerHTML = ''; // Clear maincontent
            topElementsToKeep.forEach(el => mainContent.appendChild(el));
            mainContent.appendChild(nationContentWrapper); // Add the tab wrapper

            // Create tab buttons and panes containers
            const tabButtonsContainer = document.createElement('div');
            tabButtonsContainer.className = 'pnw-tab-buttons';
            nationContentWrapper.appendChild(tabButtonsContainer);

            const tabContentContainer = document.createElement('div');
            tabContentContainer.className = 'pnw-tab-content';
            nationContentWrapper.appendChild(tabContentContainer);

            // Create actual tab panes and append elements
            const createdPanes = {}; // To store the pane DOM elements

            // Create panes for all defined tabs first
            for (const tabId in tabDefinitions) {
                const pane = document.createElement('div');
                pane.id = `pnw-tab-${tabId}`;
                pane.className = 'pnw-tab-pane';
                tabContentContainer.appendChild(pane);
                createdPanes[tabId] = pane;
            }

            // Now, distribute the elements into the appropriate panes
            elementsToMove.forEach(element => {
                let assigned = false;

                // Try to match tables by their main header (th[colspan="2"])
                if (element.tagName === 'TABLE' && element.classList.contains('nationtable')) {
                    const header = element.querySelector('th[colspan="2"]');
                    if (header) {
                        const headerText = header.textContent.trim().toLowerCase();
                        for (const tabId in tabDefinitions) {
                            if (tabDefinitions[tabId].keywords.some(keyword => headerText.includes(keyword))) {
                                createdPanes[tabId].appendChild(element);
                                assigned = true;
                                break;
                            }
                        }
                    }
                }
                // Match chart divs by ID
                else if (element.tagName === 'DIV' && element.id && tabDefinitions['charts-map'].keywords.some(keyword => element.id.includes(keyword))) {
                    createdPanes['charts-map'].appendChild(element);
                    assigned = true;
                }
                // Match nation activity by class
                else if (element.classList.contains('nation-activity') || (element.tagName === 'TABLE' && element.querySelector('th[colspan="2"]') && element.querySelector('th[colspan="2"]').textContent.trim().toLowerCase().includes('nation activity'))) {
                     createdPanes['activity'].appendChild(element);
                     assigned = true;
                }
                // Match forms (e.g., Report Nation button form)
                else if (element.tagName === 'FORM') {
                    // Check if the form contains the "Report This Nation" button
                    if (element.querySelector('input[type="submit"][value="Report This Nation"]')) {
                        // Place this in "Other" or create a specific "Actions" tab if more forms appear
                        createdPanes['other'].appendChild(element);
                        assigned = true;
                    }
                }

                // If not assigned to any specific tab, put it in 'other'
                if (!assigned) {
                    createdPanes['other'].appendChild(element);
                }
            });

            // Now create buttons only for tabs that actually received content
            for (const tabId in tabDefinitions) {
                const config = tabDefinitions[tabId];
                const pane = createdPanes[tabId];

                if (pane.children.length > 0) { // Check if the pane has any content
                    const button = document.createElement('a');
                    button.href = `#${tabId}`;
                    button.className = 'pnw-tab-button';
                    button.innerHTML = `<i class="${config.icon}"></i> ${config.title}`;
                    tabButtonsContainer.appendChild(button);

                    // Add click listener
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Remove active from all buttons and panes
                        document.querySelectorAll('.pnw-tab-button').forEach(btn => btn.classList.remove('active'));
                        document.querySelectorAll('.pnw-tab-pane').forEach(p => p.classList.remove('active'));

                        // Add active to clicked button and its corresponding pane
                        button.classList.add('active');
                        pane.classList.add('active');
                    });
                } else {
                    // If a pane is empty, remove it (and its corresponding button won't be created)
                    pane.remove();
                }
            }

            // Activate the first created tab by default
            const firstButton = tabButtonsContainer.querySelector('.pnw-tab-button');
            if (firstButton) {
                firstButton.click();
            }

            // Remove any leftover `br` tags that might cause spacing issues
            mainContent.querySelectorAll('br').forEach(br => {
                // Remove if it's not directly inside a tab pane (which handles its own spacing)
                // and if it's just a redundant line break (e.g. multiple <br> tags in a row)
                if (!br.closest('.pnw-tab-pane') && (br.nextSibling && br.nextSibling.nodeName === 'BR' || br.previousSibling && br.previousSibling.nodeName === 'BR')) {
                    br.remove();
                }
            });
        }

        // Run the tabbed interface function after a short delay to ensure DOM is ready
        setTimeout(applyTabbedInterface, 1000); // Keep delay for robustness
    }

    GM_addStyle(cssToInject);

})();