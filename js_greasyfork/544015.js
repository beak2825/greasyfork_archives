// ==UserScript==
// @name         Nyaa Search
// @namespace    http://tampermonkey.net/
// @version      2.28
// @license MIT
// @description  Adds individual Nyaa search buttons to Anilist, Anime-Planet, Kitsu, MyAnimeList, Anidb.net, Anichart.net, and Livechart.me pages. Made with Gemini Flash
// @author       Mahakali
// @match        https://anilist.co/*
// @exclude      https://anilist.co/manga/*
// @match        https://www.anime-planet.com/*
// @exclude      https://www.anime-planet.com/characters/*
// @match        https://kitsu.app/*
// @match        https://myanimelist.net/*
// @exclude      https://myanimelist.net/character/*
// @match        https://anidb.net/*
// @match        https://anidb.net/anime/season/*
// @match        https://anichart.net/*
// @match        https://www.livechart.me/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/544015/Nyaa%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/544015/Nyaa%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to sanitize the anime title
    function sanitizeTitle(title, hostname) {
        // First, trim any leading/trailing whitespace from the original title
        let cleanedTitle = title.trim();

        // Specific stripping for Anidb.net: remove "Anime:" case-insensitively
        // This must happen BEFORE general punctuation stripping if the punctuation is part of the prefix
        if (hostname.includes('anidb.net')) { // Use includes for both detail and season pages
            cleanedTitle = cleanedTitle.replace(/^Anime:\s*/i, '').trim(); // Added 'i' flag for case-insensitive
        }

        // Remove colons, exclamation marks, and question marks globally
        cleanedTitle = cleanedTitle.replace(/[?!:]/g, '').trim();

        return cleanedTitle;
    }

    // Function to find the target title element for detail pages based on hostname
    // Returns null if on Anilist homepage or Anime-Planet watching page, as those are handled by separate functions
    function findTargetTitleElementForDetailPage() {
        let targetElement = null;
        let selectorInfo = '';

        if (window.location.hostname === 'anilist.co') {
            // If on Anilist homepage, this function should NOT find a single target element.
            // The homepage card logic will handle it.
            if (window.location.pathname === '/' || window.location.pathname.startsWith('/home')) {
                return null;
            }
            // --- CHANGE MADE HERE ---
            // Now using two XPaths with an OR '|' operator to provide a fallback
            // for different page layouts on Anilist.
            const targetXPath = "/html/body/div[2]/div[3]/div/div[1]/div[2]/div/div[2]/h1 | /html/body/div[2]/div[3]/div/div[1]/div/div/div[2]/h1";
            const result = document.evaluate(targetXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            targetElement = result.singleNodeValue;
            selectorInfo = 'Strict XPath (Anilist Detail Page)';
        } else if (window.location.hostname === 'www.anime-planet.com') {
            // Exclude the main page (root path '/')
            if (window.location.pathname === '/') {
                console.log("[Nyaa Search] On Anime-Planet main page. Skipping element search for detail page.");
                return null; // Do not search for elements on the main page
            }
            // If on Anime-Planet watching page, this function should NOT find a single target element.
            // The watching page card logic will handle it.
            if (window.location.pathname.startsWith('/users/') && window.location.pathname.includes('/anime/watching')) {
                return null;
            }

            // Strictly use the new CSS selector for Anime-Planet detail pages
            targetElement = document.querySelector('html.mulifont.darkmode body.desktop div#siteContainer h1');
            selectorInfo = 'Strict CSS Selector (Anime-Planet Detail Page)';

        } else if (window.location.hostname === 'kitsu.app') {
            // Using a more general CSS selector for Kitsu to avoid dynamic IDs
            targetElement = document.querySelector('section.media--title h3');
            selectorInfo = 'General CSS Selector (Kitsu)';

        } else if (window.location.hostname === 'myanimelist.net') {
            // Exclude the season page as it's handled by a separate function
            if (window.location.pathname.startsWith('/anime/season')) {
                return null;
            }
            // Using a more general CSS selector for MyAnimeList to avoid appearance-specific classes
            targetElement = document.querySelector('h1.title-name strong');
            selectorInfo = 'General CSS Selector (MyAnimeList)';
        } else if (window.location.hostname === 'anidb.net') {
            // Exclude the season page as it's handled by a separate function
            if (window.location.pathname.startsWith('/anime/season')) {
                return null;
            }
            // Using a more concise CSS selector for Anidb.net
            targetElement = document.querySelector('h1.anime');
            selectorInfo = 'Concise CSS Selector (Anidb.net)';
        }

        if (targetElement) {
            console.log(`[Nyaa Search] Found target element for detail page using ${selectorInfo}:`, targetElement.textContent.trim().substring(0, 50) + '...'); // Log first 50 chars
        } else {
            console.log(`[Nyaa Search] Could not find target element for detail page using ${selectorInfo}.`);
        }
        return targetElement;
    }

    // Function to add a single Nyaa Search button to each anime preview card on Anilist homepage
    function addButtonsToAnilistHomepageCards() {
        // Select cards only within the first and second list-preview-wrap sections
        const previewCards = document.querySelectorAll(
            'html body.site-theme-dark div#app div.page-content div.container div.home.full-width div.list-previews div.list-preview-wrap:nth-child(1) .media-preview-card, ' +
            'html body.site-theme-dark div#app div.page-content div.container div.full-width div.list-previews div.list-preview-wrap:nth-child(2) .media-preview-card'
        );
        console.log(`[Nyaa Search] Found ${previewCards.length} potential anime preview cards on Anilist homepage within specific list-preview-wrap sections.`);

        previewCards.forEach(card => {
            // Check if a button already exists in this card to prevent duplicates
            if (card.querySelector('.nyaa-card-button')) {
                return; // Skip if button already added
            }

            // Find the title element within the card. Try common selectors.
            let titleElement = card.querySelector('.media-card-title') || card.querySelector('a.title') || card.querySelector('h3');

            const animeTitle = titleElement ? sanitizeTitle(titleElement.textContent, window.location.hostname) : null;

            if (animeTitle) {
                const button = document.createElement('button');
                button.textContent = 'Nyaa Search'; // A single button for simplicity on cards
                button.classList.add('nyaa-card-button'); // Add a class for identification
                button.title = `Search Nyaa for "${animeTitle}"`; // Add tooltip

                button.style.cssText = `
                    background-color: rgba(0, 123, 255, 0.8); /* Slightly transparent blue */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    white-space: nowrap;
                    position: absolute; /* Position over the card */
                    top: 5px; /* Changed from bottom to top */
                    left: 50%;
                    transform: translateX(-50%); /* Center horizontally */
                    z-index: 10; /* Ensure it's above other elements */
                `;

                // Add hover effects
                button.onmouseover = function() {
                    this.style.backgroundColor = 'rgba(0, 86, 179, 0.9)'; // Darker blue on hover
                    this.style.transform = 'translateX(-50%) scale(1.05)';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = 'rgba(0, 123, 255, 0.8)'; // Original blue
                    this.style.transform = 'translateX(-50%) scale(1)';
                };

                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent navigating to the anime page
                    event.stopPropagation(); // Stop event bubbling to prevent card click
                    const encodedTitle = encodeURIComponent(animeTitle);
                    // Modified default search for homepage cards as requested
                    const nyaaUrl = `https://nyaa.si/?f=0&c=0_0&q=${encodedTitle}+1080%20multi`;
                    console.log(`[Nyaa Search] Opening Nyaa URL (Homepage Card - Default):`, nyaaUrl);
                    GM_openInTab(nyaaUrl, { active: true, insert: true });
                });

                // Ensure the card has position: relative for absolute positioning of the button to work correctly
                card.style.position = 'relative';
                card.appendChild(button);
                console.log(`[Nyaa Search] Added button to card: ${animeTitle}`);
            } else {
                console.log(`[Nyaa Search] Could not find title for a card. Skipping button add.`);
            }
        });
        console.log("[Nyaa Search] Finished attempting to add buttons to Anilist homepage cards.");
    }

    // Function to add a single Nyaa Search button to each anime card on Anime-Planet watching page
    function addButtonsToAnimePlanetWatchingCards() {
        const previewCards = document.querySelectorAll('li.card');
        console.log(`[Nyaa Search] Found ${previewCards.length} anime cards on Anime-Planet watching page.`);

        previewCards.forEach(card => {
            // Check if a button already exists in this card to prevent duplicates
            if (card.querySelector('.nyaa-card-button')) {
                return; // Skip if button already added
            }

            // Find the title element within the card
            const titleElement = card.querySelector('h3.cardName');
            const animeTitle = titleElement ? sanitizeTitle(titleElement.textContent, window.location.hostname) : null;

            if (animeTitle) {
                const button = document.createElement('button');
                button.textContent = 'Nyaa Search'; // A single button for simplicity on cards
                button.classList.add('nyaa-card-button'); // Add a class for identification
                button.title = `Search Nyaa for "${animeTitle}"`; // Add tooltip

                button.style.cssText = `
                    background-color: rgba(0, 123, 255, 0.8); /* Slightly transparent blue */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    white-space: nowrap;
                    position: absolute; /* Position over the card */
                    top: 5px; /* Position at the top of the card */
                    left: 50%;
                    transform: translateX(-50%); /* Center horizontally */
                    z-index: 10; /* Ensure it's above other elements */
                `;

                // Add hover effects
                button.onmouseover = function() {
                    this.style.backgroundColor = 'rgba(0, 86, 179, 0.9)'; // Darker blue on hover
                    this.style.transform = 'translateX(-50%) scale(1.05)';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = 'rgba(0, 123, 255, 0.8)'; // Original blue
                    this.style.transform = 'translateX(-50%) scale(1)';
                };

                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent navigating
                    event.stopPropagation(); // Stop event bubbling
                    const encodedTitle = encodeURIComponent(animeTitle);
                    // Modified default search for watching page cards as requested
                    const nyaaUrl = `https://nyaa.si/?f=0&c=0_0&q=${encodedTitle}+1080%20multi`;
                    console.log(`[Nyaa Search] Opening Nyaa URL (Anime-Planet Watching Card - Default):`, nyaaUrl);
                    GM_openInTab(nyaaUrl, { active: true, insert: true });
                });

                // Ensure the card has position: relative for absolute positioning of the button to work correctly
                card.style.position = 'relative';
                card.appendChild(button);
                console.log(`[Nyaa Search] Added button to Anime-Planet watching card: ${animeTitle}`);
            } else {
                console.log(`[Nyaa Search] Could not find title for an Anime-Planet watching card. Skipping button add.`);
            }
        });
        console.log("[Nyaa Search] Finished attempting to add buttons to Anime-Planet watching cards.");
    }

    // Function to add a single Nyaa Search button to each anime card on MyAnimeList season page
    function addButtonsToMyAnimeListSeasonPage() {
        // Select all seasonal anime cards
        const previewCards = document.querySelectorAll('div.seasonal-anime-list .js-anime-category-producer.seasonal-anime');
        console.log(`[Nyaa Search] Found ${previewCards.length} anime cards on MyAnimeList season page.`);

        previewCards.forEach(card => {
            // Check if a button already exists in this card to prevent duplicates
            if (card.querySelector('.nyaa-card-button')) {
                return; // Skip if button already added
            }

            // Find the title element within the card
            // Using a more robust selector for the title within the card
            const titleElement = card.querySelector('div.title-text h2.h2_anime_title a.link-title');
            const animeTitle = titleElement ? sanitizeTitle(titleElement.textContent, window.location.hostname) : null;

            if (animeTitle) {
                const button = document.createElement('button');
                button.textContent = 'Nyaa Search'; // A single button for simplicity on cards
                button.classList.add('nyaa-card-button'); // Add a class for identification
                button.title = `Search Nyaa for "${animeTitle}"`; // Add tooltip

                button.style.cssText = `
                    background-color: rgba(0, 123, 255, 0.8); /* Slightly transparent blue */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    white-space: nowrap;
                    position: absolute; /* Position over the card */
                    top: 40px; /* Position at the bottom of the card */
                    left: 50%;
                    transform: translateX(-50%); /* Center horizontally */
                    z-index: 10; /* Ensure it's above other elements */
                `;

                // Add hover effects
                button.onmouseover = function() {
                    this.style.backgroundColor = 'rgba(0, 86, 179, 0.9)'; // Darker blue on hover
                    this.style.transform = 'translateX(-50%) scale(1.05)';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = 'rgba(0, 123, 255, 0.8)'; // Original blue
                    this.style.transform = 'translateX(-50%) scale(1)';
                };

                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent navigating
                    event.stopPropagation(); // Stop event bubbling
                    const encodedTitle = encodeURIComponent(animeTitle);
                    // Default search for MyAnimeList season page cards
                    const nyaaUrl = `https://nyaa.si/?f=0&c=0_0&q=${encodedTitle}+1080%20multi`;
                    console.log(`[Nyaa Search] Opening Nyaa URL (MyAnimeList Season Card - Default):`, nyaaUrl);
                    GM_openInTab(nyaaUrl, { active: true, insert: true });
                });

                // Ensure the card has position: relative for absolute positioning of the button to work correctly
                card.style.position = 'relative';
                card.appendChild(button);
                console.log(`[Nyaa Search] Added button to MyAnimeList season card: ${animeTitle}`);
            } else {
                console.log(`[Nyaa Search] Could not find title for a MyAnimeList season card. Skipping button add.`);
            }
        });
        console.log("[Nyaa Search] Finished attempting to add buttons to MyAnimeList season page cards.");
    }

    // Function to add a single Nyaa Search button to each anime entry on Anidb.net season page
    function addButtonsToAnidbSeasonPage() {
        // Select all anime entries within the specified container
        // The user specified "div.g_bubblewrap:nth-child(2)" and "every div inside"
        const previewCards = document.querySelectorAll('div.g_bubblewrap:nth-child(2) > div');
        console.log(`[Nyaa Search] Found ${previewCards.length} anime entries on Anidb.net season page.`);

        previewCards.forEach(card => {
            // Check if a button already exists in this card to prevent duplicates
            if (card.querySelector('.nyaa-card-button')) {
                return; // Skip if button already added
            }

            // Find the title element within the card
            const titleElement = card.querySelector('div.wrap.name a.name-colored');
            const animeTitle = titleElement ? sanitizeTitle(titleElement.textContent, window.location.hostname) : null;

            if (animeTitle) {
                const button = document.createElement('button');
                button.textContent = 'Nyaa Search'; // A single button for simplicity on cards
                button.classList.add('nyaa-card-button'); // Add a class for identification
                button.title = `Search Nyaa for "${animeTitle}"`; // Add tooltip

                button.style.cssText = `
                    background-color: rgba(0, 123, 255, 0.8); /* Slightly transparent blue */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    white-space: nowrap;
                    position: absolute; /* Position over the card */
                    bottom: 5px; /* Position at the bottom of the card */
                    left: 50%;
                    transform: translateX(-50%); /* Center horizontally */
                    z-index: 10; /* Ensure it's above other elements */
                `;

                // Add hover effects
                button.onmouseover = function() {
                    this.style.backgroundColor = 'rgba(0, 86, 179, 0.9)'; // Darker blue on hover
                    this.style.transform = 'translateX(-50%) scale(1.05)';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = 'rgba(0, 123, 255, 0.8)'; // Original blue
                    this.style.transform = 'translateX(-50%) scale(1)';
                };

                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent navigating
                    event.stopPropagation(); // Stop event bubbling
                    const encodedTitle = encodeURIComponent(animeTitle);
                    // Default search for Anidb.net season page cards
                    const nyaaUrl = `https://nyaa.si/?f=0&c=0_0&q=${encodedTitle}+1080%20multi`;
                    console.log(`[Nyaa Search] Opening Nyaa URL (Anidb.net Season Card - Default):`, nyaaUrl);
                    GM_openInTab(nyaaUrl, { active: true, insert: true });
                });

                // Ensure the card has position: relative for absolute positioning of the button to work correctly
                card.style.position = 'relative';
                card.appendChild(button);
                console.log(`[Nyaa Search] Added button to Anidb.net season card: ${animeTitle}`);
            } else {
                console.log(`[Nyaa Search] Could not find title for an Anidb.net season card. Skipping button add.`);
            }
        });
        console.log("[Nyaa Search] Finished attempting to add buttons to Anidb.net season page cards.");
    }

    // Function to add a single Nyaa Search button to each anime card on Anichart.net
    function addButtonsToAnichartPage() {
        const mediaCards = document.querySelectorAll('div.card-list div.media-card');
        console.log(`[Nyaa Search] Found ${mediaCards.length} media cards on Anichart.net.`);

        mediaCards.forEach(card => {
            // Check if a button already exists in this card to prevent duplicates
            if (card.querySelector('.nyaa-card-button')) {
                return; // Skip if button already added
            }

            // Find the title element within the current card
            const titleElement = card.querySelector('div.overlay a.title');
            const animeTitle = titleElement ? sanitizeTitle(titleElement.textContent, window.location.hostname) : null;

            // Find the footer element within the current card
            const footerElement = card.querySelector('div.footer');

            if (animeTitle && footerElement) {
                const button = document.createElement('button');
                button.textContent = 'Nyaa Search'; // Same name as Anilist homepage button
                button.classList.add('nyaa-card-button'); // Add a class for identification
                button.title = `Search Nyaa for "${animeTitle}"`; // Add tooltip

                // Apply similar styling to Anilist homepage button, adjusted for card context
                button.style.cssText = `
                    background-color: rgba(0, 123, 255, 0.8); /* Slightly transparent blue */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    white-space: nowrap;
                    margin: 5px auto 0 auto; /* Top margin, auto left/right for centering */
                    display: block; /* Make it a block element to take full width or stack */
                    width: fit-content; /* Adjust width to content */
                `;

                // Add hover effects
                button.onmouseover = function() {
                    this.style.backgroundColor = 'rgba(0, 86, 179, 0.9)'; // Darker blue on hover
                    this.style.transform = 'scale(1.05)';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = 'rgba(0, 123, 255, 0.8)'; // Original blue
                    this.style.transform = 'scale(1)';
                };

                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default link behavior if any
                    event.stopPropagation(); // Stop event bubbling
                    const encodedTitle = encodeURIComponent(animeTitle);
                    // Redirect just as the same as on Anilist homepage
                    const nyaaUrl = `https://nyaa.si/?f=0&c=0_0&q=${encodedTitle}+1080%20multi`;
                    console.log(`[Nyaa Search] Opening Nyaa URL (Anichart.net Card):`, nyaaUrl);
                    GM_openInTab(nyaaUrl, { active: true, insert: true });
                });

                // Append the button to the footer of the current card
                footerElement.appendChild(button);
                console.log(`[Nyaa Search] Added button to Anichart.net card for: ${animeTitle}`);
            } else {
                console.log(`[Nyaa Search] Could not find anime title or footer for an Anichart.net card. Skipping button add.`);
            }
        });
        console.log("[Nyaa Search] Finished attempting to add buttons to Anichart.net cards.");
    }

    // Function to add a single Nyaa Search button to each anime card on Livechart.me
    function addButtonsToLivechartPage() {
        const animeCards = document.querySelectorAll('div.anime-card');
        console.log(`[Nyaa Search] Found ${animeCards.length} anime cards on Livechart.me.`);

        animeCards.forEach(card => {
            // Check if a button already exists in this card to prevent duplicates
            if (card.querySelector('.nyaa-card-button')) {
                return; // Skip if button already added
            }

            // Find the title element within the current card
            const titleElement = card.querySelector('h3.main-title a');
            const animeTitle = titleElement ? sanitizeTitle(titleElement.textContent, window.location.hostname) : null;

            // Find the target element to append the button to (h3.main-title)
            const targetElement = card.querySelector('h3.main-title');

            if (animeTitle && targetElement) {
                const button = document.createElement('button');
                button.textContent = 'Nyaa Search'; // Same name as Anilist homepage button
                button.classList.add('nyaa-card-button'); // Add a class for identification
                button.title = `Search Nyaa for "${animeTitle}"`; // Add tooltip

                // Apply styling for center bottom positioning
                button.style.cssText = `
                    background-color: rgba(0, 123, 255, 0.8); /* Slightly transparent blue */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    white-space: nowrap;
                    position: absolute; /* Position over the card */
                    bottom: 0; /* Align to the bottom of the parent */
                    left: 50%;
                    transform: translateX(-50%); /* Center horizontally */
                    z-index: 10; /* Ensure it's above other elements */
                `;

                // Ensure the target element has position: relative for absolute positioning of the button to work correctly
                targetElement.style.position = 'relative';
                targetElement.style.paddingBottom = '30px'; // Add padding to make space for the button

                // Add hover effects
                button.onmouseover = function() {
                    this.style.backgroundColor = 'rgba(0, 86, 179, 0.9)'; // Darker blue on hover
                    this.style.transform = 'translateX(-50%) scale(1.05)';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = 'rgba(0, 123, 255, 0.8)'; // Original blue
                    this.style.transform = 'translateX(-50%) scale(1)';
                };

                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default link behavior if any
                    event.stopPropagation(); // Stop event bubbling
                    const encodedTitle = encodeURIComponent(animeTitle);
                    // Redirect just as the same as on Anilist homepage
                    const nyaaUrl = `https://nyaa.si/?f=0&c=0_0&q=${encodedTitle}+1080%20multi`;
                    console.log(`[Nyaa Search] Opening Nyaa URL (Livechart.me Card):`, nyaaUrl);
                    GM_openInTab(nyaaUrl, { active: true, insert: true });
                });

                // Append the button to the target element
                targetElement.appendChild(button);
                console.log(`[Nyaa Search] Added button to Livechart.me card for: ${animeTitle}`);
            } else {
                console.log(`[Nyaa Search] Could not find anime title or target element for a Livechart.me card. Skipping button add.`);
            }
        });
        console.log("[Nyaa Search] Finished attempting to add buttons to Livechart.me cards.");
    }


    // Main function to dispatch button adding based on hostname and page type
    function addNyaaSearchButtons() {
        if (window.location.hostname === 'anilist.co' && (window.location.pathname === '/' || window.location.pathname.startsWith('/home'))) {
            addButtonsToAnilistHomepageCards();
        } else if (window.location.hostname === 'www.anime-planet.com' && window.location.pathname.startsWith('/users/') && window.location.pathname.includes('/anime/watching')) {
            addButtonsToAnimePlanetWatchingCards();
        } else if (window.location.hostname === 'myanimelist.net' && window.location.pathname.startsWith('/anime/season')) {
            addButtonsToMyAnimeListSeasonPage();
        } else if (window.location.hostname === 'anidb.net' && window.location.pathname.startsWith('/anime/season')) {
            addButtonsToAnidbSeasonPage();
        } else if (window.location.hostname === 'anichart.net') {
            addButtonsToAnichartPage();
        } else if (window.location.hostname === 'www.livechart.me') {
            addButtonsToLivechartPage();
        }
        else {
            // Logic for detail pages (Anilist detail, Anime-Planet detail, Kitsu, MyAnimeList detail, Anidb.net detail)
            // Check if detail page buttons container already exists
            if (document.getElementById('nyaaButtonsContainer')) {
                console.log("[Nyaa Search] Detail page buttons container already exists, skipping re-creation.");
                return;
            }

            const targetElement = findTargetTitleElementForDetailPage(); // This will return null for homepage/watching/season pages

            if (targetElement) {
                console.log(`[Nyaa Search] Adding buttons to ${window.location.hostname} detail page.`);

                // Create a container for all the new buttons
                const buttonsContainer = document.createElement('div');
                buttonsContainer.id = 'nyaaButtonsContainer';
                buttonsContainer.style.cssText = `
                    display: flex;
                    flex-wrap: wrap; /* Allow buttons to wrap to next line if space is limited */
                    gap: 8px; /* Space between buttons */
                    margin-top: 10px; /* Default space below the target element */
                    align-items: center;
                `;

                // Specific style adjustment for Anidb.net to prevent overlap
                if (window.location.hostname === 'anidb.net') {
                    buttonsContainer.style.marginTop = '20px'; // Increase margin for Anidb.net
                    buttonsContainer.style.marginBottom = '10px'; // Add some bottom margin too
                }

                // Function to create and append a search button (for detail pages)
                function createSearchButton(buttonText, querySuffix) {
                    const button = document.createElement('button');
                    button.textContent = buttonText;
                    button.style.cssText = `
                        background-color: #007bff; /* Blue background */
                        color: white;
                        border: none;
                        border-radius: 6px; /* Slightly rounded corners */
                        padding: 8px 15px;
                        cursor: pointer;
                        font-family: 'Inter', sans-serif;
                        font-size: 14px;
                        font-weight: 500;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        transition: background-color 0.2s ease, transform 0.2s ease;
                        white-space: nowrap; /* Prevent text wrapping */
                        display: flex; /* Use flexbox for centering */
                        align-items: center; /* Vertically center content */
                        justify-content: center; /* Horizontally center content */
                    `;

                    // Add hover effects
                    button.onmouseover = function() {
                        this.style.backgroundColor = '#0056b3'; // Darker blue on hover
                        this.style.transform = 'scale(1.05)';
                    };
                    button.onmouseout = function() {
                        this.style.backgroundColor = '#007bff'; // Original blue
                        this.style.transform = 'scale(1)';
                    };

                    button.addEventListener('click', function() {
                        const animeTitle = targetElement.textContent.trim();
                        if (animeTitle) {
                            const sanitizedAnimeTitle = sanitizeTitle(animeTitle, window.location.hostname);
                            const encodedTitle = encodeURIComponent(sanitizedAnimeTitle);
                            const nyaaUrl = `https://nyaa.si/?f=0&c=0_0&q=${encodedTitle}+${querySuffix}`;
                            console.log(`[Nyaa Search] Opening Nyaa URL (${buttonText}):`, nyaaUrl);
                            GM_openInTab(nyaaUrl, { active: true, insert: true });
                        } else {
                                console.warn(`[Nyaa Search] Could not retrieve anime title for ${buttonText} search.`);
                        }
                    });
                    buttonsContainer.appendChild(button);
                }

                // Create and append all the desired buttons for detail pages
                createSearchButton('All', '1080%20multi');
                createSearchButton('Erai-Raws', 'erai-raws');
                createSearchButton('Erai-Raws HEVC', 'multi+erai-raws+hevc');
                createSearchButton('DKB', 'dkb+multi');
                createSearchButton('VARYG', 'varyg+multi');
                createSearchButton('JUDAS', 'judas+multi');

                targetElement.parentNode.insertBefore(buttonsContainer, targetElement.nextSibling);
                console.log("[Nyaa Search] Detail page buttons successfully added.");
            } else {
                console.log(`[Nyaa Search] Target element not found for detail page on ${window.location.hostname} or buttons already exist. Waiting for page changes...`);
            }
        }
    };

    // Use a MutationObserver to wait for elements to be available on any supported site
    const observer = new MutationObserver((mutations, obs) => {
        // Simply call the main function. It will handle the site-specific logic and prevent duplicates.
        addNyaaSearchButtons();
    });

    // Start observing the document body for child list changes and subtree changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also try to add the buttons immediately in case the elements are already present on initial load
    // Adding a small delay here can sometimes help with SPAs that render content slightly after initial script execution
    setTimeout(addNyaaSearchButtons, 500); // Try after 500ms
    console.log("[Nyaa Search] Script initialized. Observing DOM changes and attempting initial button add.");

})();
