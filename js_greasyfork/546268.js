// ==UserScript==
// @name         Letterboxd DMM Integration
// @namespace    letterboxd-dmm
// @version      1.1
// @description  Add Debrid Media Manager buttons to Letterboxd movie pages
// @author       You
// @match        https://letterboxd.com/film/*
// @match        https://www.letterboxd.com/film/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546268/Letterboxd%20DMM%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/546268/Letterboxd%20DMM%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Letterboxd DMM script loaded');

    // Configuration - Update these URLs to match your DMM setup
    const DMM_BASE_URL = 'https://debridmediamanager.com';
    
    // Function to extract movie information from Letterboxd page
    function getMovieInfo() {
        console.log('Attempting to extract movie info...');
        
        // First, try to find IMDb ID from page links
        let imdbId = '';
        
        // Method 1: Look for IMDb link in the page
        const imdbLink = document.querySelector('a[href*="imdb.com/title/"]');
        if (imdbLink) {
            const imdbMatch = imdbLink.href.match(/\/title\/(tt\d+)/);
            if (imdbMatch) {
                imdbId = imdbMatch[1];
                console.log(`Found IMDb ID from link: ${imdbId}`);
            }
        }
        
        // Method 2: Check for IMDb link in the film details/external links section
        if (!imdbId) {
            const detailsLinks = document.querySelectorAll('a[href*="imdb.com"]');
            for (const link of detailsLinks) {
                const imdbMatch = link.href.match(/\/title\/(tt\d+)/);
                if (imdbMatch) {
                    imdbId = imdbMatch[1];
                    console.log(`Found IMDb ID from details: ${imdbId}`);
                    break;
                }
            }
        }
        
        // Method 3: Check meta tags for IMDb ID
        if (!imdbId) {
            const imdbMeta = document.querySelector('meta[property*="imdb"]');
            if (imdbMeta && imdbMeta.content) {
                const imdbMatch = imdbMeta.content.match(/(tt\d+)/);
                if (imdbMatch) {
                    imdbId = imdbMatch[1];
                    console.log(`Found IMDb ID from meta: ${imdbId}`);
                }
            }
        }
        
        // Get movie title - try multiple selectors
        const titleSelectors = [
            'h1.headline-1.primaryname',  // Updated based on debug output
            'h1.headline-1.filmtitle',
            'h1.filmtitle', 
            'h1.headline-1',
            'h1.js-widont',
            'h1.prettify',
            '.film-title h1',
            'section.film-header h1',
            'h1',  // Last resort - any h1
            '[data-film-name]'  // In case they use data attributes
        ];
        
        let titleElement = null;
        let title = '';
        
        // Debug: Log all h1 elements found
        const allH1s = document.querySelectorAll('h1');
        console.log(`Found ${allH1s.length} h1 elements on page:`);
        allH1s.forEach((h1, index) => {
            console.log(`H1 ${index}: class="${h1.className}", text="${h1.textContent.trim()}"`);
        });
        
        for (const selector of titleSelectors) {
            titleElement = document.querySelector(selector);
            if (titleElement) {
                title = titleElement.textContent.trim();
                console.log(`Found title with selector "${selector}": ${title}`);
                break;
            }
        }
        
        if (!title) {
            console.log('Could not find movie title');
            return null;
        }
        
        // Get year from the URL or page
        const urlMatch = window.location.pathname.match(/\/film\/([^\/]+)/);
        const movieSlug = urlMatch ? urlMatch[1] : '';
        
        // Try to extract year from various sources
        let year = '';
        
        // Method 1: From the release year link
        const yearSelectors = [
            '.releaseyear a',
            '.film-title .releaseyear',
            'small.number a',
            '.film-poster img'
        ];
        
        for (const selector of yearSelectors) {
            const yearElement = document.querySelector(selector);
            if (yearElement) {
                if (selector === '.film-poster img') {
                    // Extract from alt text
                    const altText = yearElement.alt;
                    const yearMatch = altText.match(/\((\d{4})\)/);
                    if (yearMatch) {
                        year = yearMatch[1];
                        console.log(`Found year from poster alt: ${year}`);
                        break;
                    }
                } else {
                    year = yearElement.textContent.trim();
                    console.log(`Found year with selector "${selector}": ${year}`);
                    break;
                }
            }
        }
        
        // Method 2: From meta tags
        if (!year) {
            const metaYear = document.querySelector('meta[property="video:release_date"]');
            if (metaYear) {
                year = new Date(metaYear.content).getFullYear().toString();
                console.log(`Found year from meta: ${year}`);
            }
        }
        
        // Method 3: Extract from page title
        if (!year) {
            const pageTitle = document.title;
            const yearMatch = pageTitle.match(/\((\d{4})\)/);
            if (yearMatch) {
                year = yearMatch[1];
                console.log(`Found year from page title: ${year}`);
            }
        }
        
        console.log(`Extracted movie info: Title="${title}", Year="${year}", Slug="${movieSlug}", IMDb ID="${imdbId}"`);
        return { title, year, slug: movieSlug, imdbId: imdbId };
    }
    
    // Function to create DMM button
    function createDMMButton(movieInfo) {
        const button = document.createElement('a');
        
        // Use IMDb ID format if available, otherwise fall back to title search
        if (movieInfo.imdbId) {
            button.href = `${DMM_BASE_URL}/movie/${movieInfo.imdbId}`;
            button.textContent = '📁 Add to DMM';
        } else {
            // Fallback to hash search if no IMDb ID found
            button.href = `${DMM_BASE_URL}/hash/${encodeURIComponent(movieInfo.title + (movieInfo.year ? ' ' + movieInfo.year : ''))}`;
            button.textContent = '📁 Search DMM';
        }
        
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'dmm-button';
        
        // Style the button to match Letterboxd's design
        button.style.cssText = `
            display: inline-block;
            background: #00c030;
            color: white !important;
            padding: 8px 12px;
            border-radius: 3px;
            text-decoration: none !important;
            font-weight: 600;
            font-size: 11px;
            margin: 4px 4px 4px 0;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#00a028';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#00c030';
        });
        
        return button;
    }
    
    // Function to create search DMM button
    function createSearchDMMButton(movieInfo) {
        const button = document.createElement('a');
        
        // Use the correct DMM search URL format
        button.href = `${DMM_BASE_URL}/search?query=${encodeURIComponent(movieInfo.title + (movieInfo.year ? ' ' + movieInfo.year : ''))}`;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'dmm-search-button';
        button.textContent = '🔍 Search DMM';
        
        // Style the button
        button.style.cssText = `
            display: inline-block;
            background: #0078d4;
            color: white !important;
            padding: 8px 12px;
            border-radius: 3px;
            text-decoration: none !important;
            font-weight: 600;
            font-size: 11px;
            margin: 4px 4px 4px 0;
            transition: background-color 0.2s;
            border: none;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;
        
        // Add hover effect
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#106ebe';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#0078d4';
        });
        
        return button;
    }
    
    // Function to insert DMM buttons
    function insertDMMButtons() {
        console.log('insertDMMButtons called');
        
        // Check if buttons already exist
        if (document.querySelector('.dmm-button')) {
            console.log('DMM buttons already exist, skipping');
            return;
        }
        
        const movieInfo = getMovieInfo();
        if (!movieInfo) {
            console.log('Could not extract movie info from Letterboxd page');
            return;
        }
        
        // Find a good location to insert the buttons
        const possibleContainers = [
            'section.film-header',
            '.film-header-group',
            '.film-header',
            '.film-title-wrapper',
            'h1.headline-1.primaryname',  // Updated based on debug output
            'h1.headline-1.filmtitle',
            'h1.filmtitle',
            '.film-title',
            '.primarytext'
        ];
        
        let container = null;
        for (const selector of possibleContainers) {
            container = document.querySelector(selector);
            if (container) {
                console.log(`Found container with selector: ${selector}`);
                break;
            }
        }
        
        if (!container) {
            console.log('Could not find suitable container, trying to insert after title');
            const titleElement = document.querySelector('h1.headline-1.primaryname, h1.headline-1.filmtitle, h1.filmtitle, h1.headline-1');
            if (titleElement) {
                container = titleElement.parentElement;
                console.log('Using title parent as container:', container.tagName, container.className);
            }
        }
        
        if (!container) {
            console.log('Could not find any suitable container for DMM buttons');
            console.log('Available sections:', Array.from(document.querySelectorAll('section')).map(s => s.className));
            console.log('Available divs with classes:', Array.from(document.querySelectorAll('div[class]')).slice(0, 10).map(d => d.className));
            return;
        }
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'dmm-buttons-container';
        buttonContainer.style.cssText = `
            margin: 12px 0 8px 0;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 4px;
        `;
        
        // Create buttons
        const addButton = createDMMButton(movieInfo);
        const searchButton = createSearchDMMButton(movieInfo);
        
        // Add buttons to container
        buttonContainer.appendChild(addButton);
        buttonContainer.appendChild(searchButton);
        
        // Insert the button container
        if (container.tagName === 'H1') {
            container.parentNode.insertBefore(buttonContainer, container.nextSibling);
        } else if (container.tagName === 'SECTION') {
            // For section containers, append at the end
            container.appendChild(buttonContainer);
        } else {
            // For other containers, try to insert after the title
            const titleInContainer = container.querySelector('h1');
            if (titleInContainer) {
                titleInContainer.parentNode.insertBefore(buttonContainer, titleInContainer.nextSibling);
            } else {
                container.appendChild(buttonContainer);
            }
        }
        
        console.log('DMM buttons added successfully');
    }
    
    // Function to wait for elements and then insert buttons
    function waitAndInsert() {
        let attempts = 0;
        const maxAttempts = 30;
        
        function tryInsert() {
            attempts++;
            console.log(`Attempt ${attempts} to insert DMM buttons`);
            
            // Check for multiple possible title elements
            const possibleTitles = [
                document.querySelector('h1.headline-1.filmtitle'),
                document.querySelector('h1.filmtitle'),
                document.querySelector('h1.headline-1'),
                document.querySelector('h1.js-widont'),
                document.querySelector('h1.prettify'),
                document.querySelector('h1'),
                document.querySelector('[data-film-name]'),
                document.querySelector('.film-title h1')
            ].filter(Boolean);
            
            console.log(`Found ${possibleTitles.length} potential title elements`);
            
            // Also check if the page has loaded enough content
            const hasContent = document.querySelector('.film-poster') || 
                             document.querySelector('.film-header') ||
                             document.querySelector('section') ||
                             document.querySelector('.col-17');
            
            if (possibleTitles.length > 0 && hasContent) {
                console.log('Page appears to be loaded, attempting to insert buttons');
                insertDMMButtons();
            } else if (attempts < maxAttempts) {
                console.log(`Not ready yet (titles: ${possibleTitles.length}, content: ${!!hasContent}), retrying...`);
                setTimeout(tryInsert, 800);
            } else {
                console.log('Max attempts reached. Final debug info:');
                console.log('Page HTML snippet:', document.body.innerHTML.substring(0, 500));
                console.log('All H1 elements:', Array.from(document.querySelectorAll('h1')).map(h1 => ({
                    text: h1.textContent.trim(),
                    class: h1.className,
                    id: h1.id
                })));
            }
        }
        
        tryInsert();
    }
    
    // Initialize the script
    function init() {
        console.log('Initializing DMM script');
        console.log('Current URL:', window.location.href);
        
        // Check if we're on a movie page
        if (!window.location.pathname.startsWith('/film/')) {
            console.log('Not on a film page, skipping');
            return;
        }
        
        // Wait for page to load and try to insert buttons
        waitAndInsert();
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also run on URL changes (for single page app navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed to:', url);
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();