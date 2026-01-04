// ==UserScript==
// @name        Pstream.org Netflix UI
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Transforms pstream.org's UI to resemble Netflix.
// @author      Your Name
// @match       https://pstream.org/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539332/Pstreamorg%20Netflix%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/539332/Pstreamorg%20Netflix%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject Tailwind CSS for easier styling and responsiveness
    // Note: This loads Tailwind from CDN, make sure it doesn't conflict with existing styles.
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    // --- NETFLIX-LIKE CSS STYLES ---
    // This section applies the visual theme.
    // YOU WILL NEED TO ADJUST SELECTORS HERE to match pstream.org's HTML structure.
    GM_addStyle(`
        /* Global Netflix-like Theme */
        :root {
            --netflix-red: #e50914;
            --netflix-dark: #141414;
            --netflix-light-dark: #222222;
            --netflix-text-light: #f0f0f0;
            --netflix-text-grey: #a0a0a0;
            --netflix-border-radius: 6px;
        }

        body {
            background-color: var(--netflix-dark) !important;
            color: var(--netflix-text-light) !important;
            font-family: "Inter", sans-serif !important;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Prevent horizontal scroll */
        }

        /* Adjusting scrollbar for dark theme */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--netflix-dark);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--netflix-light-dark);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        /* --- Header / Navigation Bar --- */
        /* Find your header element and style it */
        /* Example: .header, #navbar, .top-menu */
        .header, #navbar, .top-menu {
            background-color: rgba(20, 20, 20, 0.9) !important; /* Semi-transparent dark */
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
            padding: 1rem 2rem !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }

        /* Branding/Logo */
        .header .logo img, #navbar .logo img {
            height: 35px; /* Adjust as needed */
            filter: brightness(1.2); /* Make logos pop */
        }
        .header .logo h1, #navbar .logo h1 {
            color: var(--netflix-red) !important;
            font-size: 1.8rem !important;
            font-weight: bold !important;
        }

        /* Navigation Links */
        .nav-links a, .header-menu a { /* Find your navigation links */
            color: var(--netflix-text-light) !important;
            text-decoration: none !important;
            margin-left: 20px !important;
            font-size: 1.05rem !important;
            transition: color 0.3s ease !important;
        }
        .nav-links a:hover, .header-menu a:hover {
            color: var(--netflix-red) !important;
        }

        /* Search Bar */
        .search-bar input, .search-form input[type="text"] { /* Find your search input */
            background-color: var(--netflix-light-dark) !important;
            border: 1px solid #333 !important;
            border-radius: var(--netflix-border-radius) !important;
            padding: 0.5rem 1rem !important;
            color: var(--netflix-text-light) !important;
            font-size: 0.95rem !important;
            transition: all 0.3s ease !important;
        }
        .search-bar input:focus, .search-form input[type="text"]:focus {
            border-color: var(--netflix-red) !important;
            box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.3) !important;
            outline: none !important;
        }
        .search-bar button, .search-form button { /* Find your search button */
            background-color: var(--netflix-red) !important;
            color: white !important;
            border: none !important;
            border-radius: var(--netflix-border-radius) !important;
            padding: 0.5rem 1rem !important;
            margin-left: 10px !important;
            cursor: pointer !important;
            transition: background-color 0.3s ease !important;
        }
        .search-bar button:hover, .search-form button:hover {
            background-color: #f40612 !important;
        }


        /* --- Main Content Area --- */
        /* Adjust the main content container if any */
        .main-content, .content-wrapper, #main-container {
            padding: 30px 2rem !important;
            max-width: 100vw; /* Ensure it's fluid */
            margin: 0 auto;
        }

        /* --- Movie/TV Show Cards (Thumbnails + Info) --- */
        /* This is the most critical part. Identify the container for each movie/show item. */
        /* Common examples: .movie-item, .film-card, .poster-box */
        .movie-item, .film-card, .poster-box {
            background-color: var(--netflix-light-dark) !important;
            border-radius: var(--netflix-border-radius) !important;
            overflow: hidden !important;
            position: relative !important;
            cursor: pointer !important;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
            display: flex; /* For basic flex grid */
            flex-direction: column;
            width: 100%; /* For responsiveness within grid */
        }

        /* Hover effect for cards */
        .movie-item:hover, .film-card:hover, .poster-box:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6) !important;
            z-index: 5; /* Bring hovered item to front */
        }

        /* Image within the card */
        .movie-item img, .film-card img, .poster-box img {
            width: 100% !important;
            height: auto !important; /* Ensure image scales correctly */
            display: block !important;
            border-radius: var(--netflix-border-radius) var(--netflix-border-radius) 0 0 !important;
            object-fit: cover; /* Cover the area, cropping if needed */
        }

        /* Info section within the card */
        .movie-item .info, .film-card .details, .poster-box .caption {
            padding: 10px !important;
            text-align: left !important;
            flex-grow: 1; /* Allow info section to take available height */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* Title within the card */
        .movie-item .title, .film-card .title, .poster-box .title {
            font-size: 1.1rem !important;
            font-weight: bold !important;
            color: var(--netflix-text-light) !important;
            margin-bottom: 5px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Any other text/metadata within the card (e.g., year, genre) */
        .movie-item .meta, .film-card .year, .poster-box .genre {
            font-size: 0.9rem !important;
            color: var(--netflix-text-grey) !important;
        }

        /* --- Grid Layout for Cards --- */
        /* Find the container that holds all your movie/show items (e.g., .movies-grid, #content-list) */
        .movies-grid, #content-list, .grid-container {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important; /* Responsive grid */
            gap: 15px !important; /* Space between cards */
            justify-items: center; /* Center items in their grid cells */
            padding: 20px 0;
        }

        /* --- Detail Page Styling (for specific movie/show pages) --- */
        /* If pstream.org has dedicated detail pages, apply Netflix-like styling */
        /* Example: .movie-detail-page, #single-film-view */
        .movie-detail-page, #single-film-view {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding: 40px 2rem !important;
            background: linear-gradient(to bottom, var(--netflix-light-dark), var(--netflix-dark)) !important;
        }

        .movie-detail-page .poster, #single-film-view .poster {
            width: 250px !important;
            height: auto !important;
            border-radius: var(--netflix-border-radius) !important;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
            margin-bottom: 30px !important;
        }

        .movie-detail-page .title, #single-film-view .title {
            font-size: 3rem !important;
            font-weight: bold !important;
            color: var(--netflix-text-light) !important;
            text-align: center !important;
            margin-bottom: 15px !important;
        }

        .movie-detail-page .overview, #single-film-view .description {
            max-width: 800px !important;
            font-size: 1.1rem !important;
            color: var(--netflix-text-grey) !important;
            text-align: center !important;
            margin-bottom: 30px !important;
        }

        .movie-detail-page .watch-button, #single-film-view .play-button {
            background-color: var(--netflix-red) !important;
            color: white !important;
            padding: 15px 30px !important;
            font-size: 1.2rem !important;
            font-weight: bold !important;
            border-radius: var(--netflix-border-radius) !important;
            text-decoration: none !important;
            transition: background-color 0.3s ease !important;
            border: none;
            cursor: pointer;
        }
        .movie-detail-page .watch-button:hover, #single-film-view .play-button:hover {
            background-color: #f40612 !important;
        }

        /* --- Footer --- */
        /* Find your footer element */
        footer {
            background-color: var(--netflix-light-dark) !important;
            color: var(--netflix-text-grey) !important;
            padding: 2rem !important;
            text-align: center !important;
            margin-top: 50px !important;
        }

        /* --- General Overrides & Cleanup --- */
        /* Hide any unwanted elements or fix visual glitches */
        /* For example, if there's an intrusive banner or ad div */
        /* .ad-banner, #promo-strip { display: none !important; } */

        /* Ensure all links and buttons get basic styling */
        a, button {
            color: inherit; /* Inherit from parent */
            text-decoration: none;
            transition: all 0.2s ease-in-out;
        }
        button {
            background-color: var(--netflix-light-dark);
            border: 1px solid #333;
            padding: 8px 15px;
            border-radius: var(--netflix-border-radius);
            cursor: pointer;
            color: var(--netflix-text-light);
        }
        button:hover {
            background-color: #333;
        }

        /* Utility classes from Tailwind for responsive behavior that might not be overridden */
        @media (max-width: 768px) {
            .header, #navbar, .top-menu {
                padding: 1rem 1rem !important;
                flex-direction: column;
                gap: 10px;
            }
            .nav-links a, .header-menu a {
                margin: 0 10px !important;
            }
            .main-content, .content-wrapper, #main-container {
                padding: 20px 1rem !important;
            }
            .movies-grid, #content-list, .grid-container {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
            }
            .movie-detail-page .title, #single-film-view .title {
                font-size: 2rem !important;
            }
            .movie-detail-page .overview, #single-film-view .description {
                font-size: 1rem !important;
            }
        }
    `);

    // --- JavaScript for Dynamic Elements (if content loads after initial page load) ---
    // This uses MutationObserver to detect when new elements are added to the DOM
    // and then apply the Netflix-like styles to them.

    // Function to apply styling to specific elements
    function applyStylesToElements(targetNode) {
        // Example: Apply styles to all movie/TV show cards within the targetNode
        // You might need to refine these selectors
        targetNode.querySelectorAll('.movie-item, .film-card, .poster-box').forEach(card => {
            if (!card.classList.contains('netflix-styled')) {
                card.classList.add('netflix-styled'); // Mark as styled to prevent re-styling
                // Apply Tailwind classes or directly set styles for dynamic elements
                // Example: card.style.backgroundColor = 'var(--netflix-light-dark)';
                // More complex styling is done via GM_addStyle.
                // This part is more for ensuring a class is added for CSS to target.
            }
        });

        // Example: Apply styles to new buttons
        targetNode.querySelectorAll('button').forEach(button => {
            if (!button.classList.contains('netflix-styled-button')) {
                button.classList.add('netflix-styled-button');
                // You can add Tailwind classes directly if needed
                // button.classList.add('bg-red-600', 'text-white', 'px-4', 'py-2', 'rounded-md', 'hover:bg-red-700');
            }
        });

        // Apply styles to any specific sections that load dynamically
        targetNode.querySelectorAll('.latest-releases, .trending-section').forEach(section => {
            if (!section.classList.contains('netflix-styled-section')) {
                section.classList.add('netflix-styled-section');
                // section.style.padding = '20px';
                // section.style.backgroundColor = 'var(--netflix-dark)';
            }
        });
    }

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        applyStylesToElements(node);
                    }
                });
            }
        });
    });

    // Start observing the entire body for configured mutations
    observer.observe(document.body, { childList: true, subtree: true });

    // Apply styles to elements already present on initial load
    window.addEventListener('load', () => {
        applyStylesToElements(document.body);
        console.log('Pstream.org Netflix UI Script: Initial styling applied.');
    });

})();
