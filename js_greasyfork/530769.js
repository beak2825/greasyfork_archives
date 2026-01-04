// ==UserScript==
// @name        Quick porn search
// @description Adds a dropdown on many porn sites to search various sites either using data found in the html or simply pulling it from the url.
// @namespace   quickpornsearch
// @author      GoAwayLoveStrike
// @license Creative Commons Attribution Non Commercial Share Alike 4.0 International (CC BY-NC-SA 4.0)
// @version 4.2
// @include https://bangbros.com/*
// @include https://www.pervmom.com/*
// @include https://pornpros.com/*
// @include https://www.mofos.com/*
// @include https://www.teamskeet.com/*
// @include https://www.brazzers.com/*
// @include https://tour.nympho.com/*
// @include https://tour.trueanal.com/*
// @include https://tour.analonly.com/*
// @include https://tour.allanal.com/*
// @include https://www.mylf.com/*
// @include https://teamskeet.com/*
// @include https://tiny4k.com/*
// @include https://lubed.com/*
// @include https://cum4k.com/*
// @include https://exotic4k.com/*
// @include https://nubiles-porn.com/*
// @include https://www.realitykings.com/*
// @include https://povd.com/*
// @include https://www.milfed.com/*
// @include https://momlover.com/*
// @include https://www.sislovesme.com/*
// @include https://www.dadcrush.com/*
// @include https://povd.com/*
// @include https://theporndb.net/*
// @include https://www.manyvids.com/Video/*
// @include https://www.adultdvdempire.com/*
// @include https://gloryholeswallow.com/tour/trailers/*
// @include https://www.gloryholesecrets.com/en/video/gloryholesecrets*
// @include https://dirtyauditions.com/*
// @include https://www.bang.com/*
// @include https://jayspov.net/*
// @include https://holed.com/*
// @include https://anal4k.com/*
// @include https://www.naughtyamerica.com/*
// @include https://www.mrluckypov.com/*
// @include https://www.porndupe.net/*
// @include https://inserted.com/*
// @include https://pervcity.com/*
// @include https://www.tushyraw.com/*
// @include https://girlcum.com/*
// @include https://www.propertysex.com/*
// @include https://www.vixen.com/*
// @include https://bang.com/*
// @include https://bangpremium.com/*
// @include https://stashdb.org/*
// @include https://fansdb.cc/*
// @include https://www.mormongirlz.com/*
// @include https://www.bangadventures.com/*
// @include https://www.bangpremium.com/*
// @include https://www.wifey.com/*
// @include https://www.lookathernow.com/*
// @downloadURL https://update.greasyfork.org/scripts/530769/Quick%20porn%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/530769/Quick%20porn%20search.meta.js
// ==/UserScript==

// Search button configuration - Edit these to add/remove/modify search options
const searchButtons = [
    { 
        name: '1337x',
        url: 'https://1337x.to/sort-search/{query}/time/desc/1/'
    },
    {
        name: 'PornoLabs',
        url: 'https://pornolab.net/forum/tracker.php?max=1&nm={query}'
    },
    {
        name: 'Yandex',
        url: 'https://yandex.com/search/?text={query}'
    },
    {
        name: 'Custom Google',
        url: 'https://cse.google.com/cse?cx=4158a1b0ef111426d#gsc.tab=0&gsc.q={query}'
    },
    { 
        name: 'Full Porn', 
        url: 'https://www.fullporn.xxx/search/{query}/',
        queryTransform: (query) => query.replace(/\s+/g, '-') //This replaces all spaces with dashes in the url which is required for some sites.
    },
    { 
        name: 'WatchPorn.to', 
        url: 'https://watchporn.to/search/{query}/',
        queryTransform: (query) => query.replace(/\s+/g, '-')
    },
    { 
        name: 'Porn Horder', 
        url: 'https://w15.pornhoarder.tv/search/?search={query}&sort=0&date=0&servers%5B%5D=47&servers%5B%5D=21&servers%5B%5D=40&servers%5B%5D=45&servers%5B%5D=12&servers%5B%5D=35&servers%5B%5D=25&servers%5B%5D=41&servers%5B%5D=44&servers%5B%5D=42&servers%5B%5D=43&servers%5B%5D=29&author=0&page=1'
    }
];

(function() {
    'use strict';

    var movieId = null;
    let initAttempts = 0;
    const MAX_ATTEMPTS = 30; // Changed from 10 to 30

    // Add this function to check if we're on a PornDB page that should be excluded
    function shouldSkipCurrentPage() {
        const currentDomain = window.location.hostname.toLowerCase();
        const currentPath = window.location.pathname.toLowerCase();
        
        if (currentDomain.includes('theporndb.net')) {
            // Only show on scene and movie pages
            const isScenePage = currentPath.startsWith('/scenes/');
            const isMoviePage = currentPath.startsWith('/movies/');
            
            // Skip (return true) if we're NOT on a scene or movie page
            return !(isScenePage || isMoviePage);
        }
        return false;
    }

    // Add this new function to remove buttons
    function clearSearchButtons() {
        document.querySelectorAll('.search-button-container').forEach(el => el.remove());
    }

    // Initialize with retry mechanism
    console.log('DOM ready state:', document.readyState);
    console.log('Current URL:', window.location.href);
    console.log('Attempt number:', initAttempts + 1, 'of', MAX_ATTEMPTS);

    function initialize() {
        if (shouldSkipCurrentPage()) {
            console.log('Skipping page due to exclusion rules');
            clearSearchButtons();
            return;
        }

        if (initAttempts >= MAX_ATTEMPTS) {
            console.log('Failed to initialize after maximum attempts');
            return;
        }

        initAttempts++;
        updateSearchButtons();

        // Only retry if buttons weren't created AND we haven't hit max attempts
        if (!document.querySelector('.search-button-container') && initAttempts < MAX_ATTEMPTS) {
            const delay = window.location.hostname.includes('realitykings.com') ? 2000 : 1000;
            setTimeout(initialize, delay);
        }
    }

    function showTestMessage(siteName) {
        console.log(`TEST UPDATE - ${siteName} DETECTED - V2`);
        
        const testDiv = document.createElement('div');
        testDiv.innerHTML = `🔥 Script V2 - ${siteName} 🔥`;
        testDiv.style.position = 'fixed';
        testDiv.style.top = '5px';
        testDiv.style.right = '5px';
        testDiv.style.background = 'blue';
        testDiv.style.color = 'white';
        testDiv.style.padding = '5px';
        testDiv.style.zIndex = '9999';
        document.body.appendChild(testDiv);
    }

    function getMovieId() {
        const hostname = window.location.hostname;
        const path = window.location.pathname;
        
        let title = null;
        let performers = [];
        let site = null;
        
        movieId = null;
        
        if (!path || path === '/' || path.includes('/categories/') || 
            path.includes('/search') || path.includes('/models/') || 
            path.includes('/channels/') || path.includes('/tags/')) {
            return;
        }

        switch (hostname) {
            case 'www.brazzers.com':
            case 'brazzers.com':
                showTestMessage('BRAZZERS');
                title = document.querySelector('.sc-1b6bgon-3')?.textContent.trim();
                performers = [...new Set(Array.from(document.querySelectorAll('a[href^="/pornstar/"]'))
                    .map(p => p.textContent.trim()))];
                site = 'Brazzers';
                break;

            case 'www.naughtyamerica.com':
                showTestMessage('NAUGHTY AMERICA');
                title = document.querySelector('h1.scene-title.grey-text')?.textContent.trim();
                performers = Array.from(document.querySelectorAll('.performer-list .scene-title.grey-text.link'))
                    .map(performer => performer.textContent.trim());
                site = document.querySelector('.site-title.grey-text.link')?.textContent.trim()
                break;

            case 'theporndb.net':
                showTestMessage('ThePornDB');
                console.log('Debugging ThePornDB selectors...');
                
                title = document.querySelector('h2.text-3xl')?.textContent.trim();
                performers = Array.from(document.querySelectorAll('div.px-3.py-1.text-center h2.text-xl a[title]'))
                    .map(performer => performer.getAttribute('title').trim()
                        .replace(/\s*\([^)]*\)/g, '') // Remove anything in parentheses including the parentheses
                        .trim());
                
                const porndbSiteElement = document.querySelector('a[href^="/sites/"]');
                site = porndbSiteElement?.textContent.trim();
                
                console.log('Found site:', site);
                break;

            case 'www.realitykings.com':
            case 'www.mofos.com':
                showTestMessage('REALITY KINGS');
                title = document.querySelector('.sc-1b6bgon-3')?.textContent.trim();
                performers = Array.from(document.querySelectorAll('.sc-1b6bgon-4 a'))
                    .map(performer => performer.textContent.trim())
                    .filter((name, index, self) => name && self.indexOf(name) === index);
                site = document.querySelector('.sc-vdkjux-5')?.textContent.trim();
                break;

            // case 'www.lookathernow.com':
            //     showTestMessage('SUB RKS');
            //     title = document.querySelector('')?.textContent.trim();
            //     performers = Array.from(document.querySelectorAll('a[href*="/pornstar/"], .sc-1b6bgon-4 a, [class*="model-name"] a'))
            //         .map(performer => performer.textContent.trim())
            //         .filter((name, index, self) => name && self.indexOf(name) === index);
            //     site = hostname.split('.')[1].toLowerCase();
            //     break;

            // case 'www.mofos.com':
            //     showTestMessage('MOFOS');
            //     title = document.querySelector('.sc-1b6bgon-3')?.textContent.trim();
            //     performers = Array.from(document.querySelectorAll('a[href*="/model/"]'))
            //         .map(performer => performer.textContent.trim());
            //     site = 'Mofos';
            //     break;

            case 'www.teamskeet.com':
            case 'www.mylf.com':
            case 'www.bffs.com':
            case 'www.dadcrush.com':
            case 'www.daughterswap.com':
            case 'www.familystrokes.com':
            case 'www.freakyfembots.com':
            case 'www.dadcrush.com':
            case 'www.fostertapes.com':
            case 'www.freeusefantasy.com':
            case 'www.hijabhookup.com':
            case 'www.littleasians.com':
            case 'www.mormongirlz.com':
            case 'www.notmygrandpa.com':
            case 'www.pervdoctor.com':
            case 'www.pervtherapy.com':
            case 'www.sisswap.com':
            case 'www.sislovesme.com':
            case 'www.swappz.com':showTestMessage('TEAMSKEET');
                console.log('Debugging TeamSkeet/MYLF selectors...');
                
                title = document.querySelector('.sceneTitle')?.textContent.trim();
                console.log('Found title:', title);
                
                site = document.querySelector('a[href*="/movies/"]')?.textContent.trim()
                    .replace(/\s+/g, '') || 'TeamSkeet';
                console.log('Found site:', site);
                
                performers = Array.from(document.querySelectorAll('.model-name-link'))
                    .map(link => link.textContent.trim())
                    .filter(name => name && name.length > 0);
                console.log('Found performers:', performers);
                break;

            case 'www.vixen.com':
            case 'www.blacked.com':
            case 'www.blackedraw.com':
            case 'www.tushy.com':
            case 'www.tushyraw.com':
            case 'www.deeper.com':
            case 'www.slayed.com':
            case 'www.milfy.com':
            case 'www.wifey.com':
                showTestMessage('VIXEN/BLACKED/ETC');
                title = document.querySelector('[data-test-component="VideoTitle"]')?.textContent.trim();
                performers = Array.from(document.querySelector('[data-test-component="VideoModels"]')
                    ?.querySelectorAll('.ModelLinks__StyledLink-bycjqw-0') || [])
                    .map(performer => performer.textContent.trim());
                site = hostname.split('.')[1].toLowerCase();
                break;

            case 'www.bang.com':
            case 'www.bangpremium.com':
            case 'www.bangadventures.com':
                showTestMessage('BANG');
                title = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
                performers = Array.from(document.querySelectorAll('p.capitalize a[href^="/pornstar/"]'))
                    .map(performer => performer.textContent.trim());
                site = 'Bang!';
                break;

            case 'pornpros.com':
            case 'exotic4k.com':
            case 'baeb.com':
            case 'tiny4k.com':
            case 'povd.com':
                showTestMessage('PORN PROS');
                title = document.querySelector('h1.text-2xl')?.textContent.trim();
                performers = Array.from(document.querySelectorAll('.link-list-with-commas a.font-semibold'))
                    .map(performer => performer.textContent.trim())
                    .filter((name, index, self) => name && self.indexOf(name) === index);
                site = hostname.split('.')[0];
                break;

            case 'stashdb.org':
                showTestMessage('STASHDB');
                console.log('Debugging StashDB selectors...');
                
                title = document.querySelector('.card-header h3 span')?.textContent.trim();
                performers = Array.from(document.querySelectorAll('.scene-performer span'))
                    .map(performer => performer.textContent.trim()
                        .replace(/\s*\([^)]*\)/g, '') // Remove anything in parentheses including the parentheses
                        .trim());
                
                const stashdbSiteElement = document.querySelector('a[href^="/studios/"]');
                site = stashdbSiteElement?.textContent;
                
                console.log('Found site:', site);
                break;

            case 'fansdb.cc':
                showTestMessage('FANSDB');
                console.log('Debugging StashDB selectors...');
                
                title = document.querySelector('.card-header h3 span')?.textContent.trim();
                performers = Array.from(document.querySelectorAll('.scene-performer span'))
                    .map(performer => performer.textContent.trim()
                        .replace(/\s*\([^)]*\)/g, '') // Remove anything in parentheses including the parentheses
                        .trim());
                
                // const fansdbSiteElement = document.querySelector('a[href^="/studios/"]');
                // site = fansdbSiteElement?.textContent.replace(/[^\w-]|[\s]/g, '');
                site = ''
                console.log('Found site:', site);
                break;

            default:
                showTestMessage('DEFAULT SITE');
                const segments = path.split('/').filter(segment => segment.length > 0);
                if (segments.length > 0) {
                    title = segments[segments.length - 1].replace(/-/gi, ' ');
                    performers = [];
                    site = hostname.split('.')[1].toLowerCase();
                }
                break;
        }

        // Construct movieId at the end using the collected information
        if (title) {
            // Clean up site name by removing spaces
            site = site?.replace(/[\s']+/g, '');
            
            movieId = `${performers.join(' ')} ${title} ${site}`.trim()
                .replace(/[^\w\s-.!&']/g, ' ')  // Added apostrophe to allowed characters
                .replace(/\s+/g, ' ');
            console.log(`Final movieId for ${hostname}:`, movieId);
        }
    }

    function updateSearchButtons() {
        getMovieId();

        // Remove existing buttons
        document.querySelectorAll('.search-button-container').forEach(el => el.remove());  // Fixed typo here

        // Only create dropdown if we have a valid movieId
        if (movieId && movieId.length > 0) {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'search-button-container';
            dropdownContainer.style.cssText = `
                position: fixed !important;
                left: 20px !important;
                top: 80px !important;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;

            // Create the dropdown button
            const dropdownButton = document.createElement('button');
            dropdownButton.textContent = '🔍 Search';
            dropdownButton.style.cssText = `
                background: #ffffff !important;
                color: #000000 !important;
                font-family: Arial, sans-serif !important;
                font-weight: bold !important;
                padding: 10px 15px !important;
                border: 2px solid #000000 !important;
                border-radius: 7px !important;
                font-size: 18px !important;
                cursor: pointer !important;
                min-width: 140px !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
            `;

            // Create the dropdown content
            const dropdownContent = document.createElement('div');
            dropdownContent.style.cssText = `
                display: none;
                position: absolute !important; 
                background-color: #ffffff !important;
                min-width: 140px !important;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
                border-radius: 7px !important;
                margin-top: 5px !important;
                border: 2px solid #000000 !important;
                overflow: hidden !important;
            `;

            searchButtons.forEach(button => {
                const link = document.createElement('a');
                link.id = button.name;
                
                // Create favicon image
                const favicon = document.createElement('img');
                const urlObj = new URL(button.url);
                // Get the domain without subdomain
                const domain = urlObj.hostname.split('.').slice(-2).join('.');
                favicon.src = `${urlObj.protocol}//${domain}/favicon.ico`;
                favicon.style.cssText = `
                    width: 16px !important;
                    height: 16px !important;
                    margin-right: 8px !important;
                    vertical-align: middle !important;
                    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2)) !important;
                `;
                
                // Create text span with bold text
                const textSpan = document.createElement('span');
                textSpan.textContent = button.name;
                textSpan.style.cssText = `
                    vertical-align: middle !important;
                    font-weight: bold !important;
                    color: #000000 !important;
                    font-size: 14px !important;
                    font-family: Arial, sans-serif !important;
                    line-height: normal !important;
                `;
                
                const query = button.queryTransform ? 
                    button.queryTransform(movieId) : 
                    encodeURIComponent(movieId);
                link.href = button.url.replace('{query}', query);
                link.target = '_blank';
                link.style.cssText = `
                    color: #000000 !important;
                    background: white !important;
                    padding: 10px 10px !important;
                    text-decoration: none !important;
                    display: flex !important;
                    align-items: center !important;
                    text-align: left !important;
                    font-size: 14px !important;
                    cursor: pointer !important;
                    border-bottom: 1px solid #eee !important;
                    font-family: Arial, sans-serif !important;
                    line-height: normal !important;
                    width: auto !important;
                    height: auto !important;
                `;

                textSpan.style.cssText = `
                    vertical-align: middle !important;
                    font-weight: bold !important;
                    color: #000000 !important;
                    font-size: 15px !important;
                    line-height: normal !important;
                `;

                // Add specific styles for the container
                const container = document.createElement('div');
                container.className = 'search-button-container';
                container.style.cssText = `
                    position: fixed !important;
                    top: 10px !important;
                    right: 10px !important;
                    background: white !important;
                    border: 1px solid #ddd !important;
                    border-radius: 4px !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                    z-index: 9999999 !important;
                    width: auto !important;
                    min-width: 200px !important;
                `;

                link.onmouseover = function() {
                    this.style.backgroundColor = '#f1f1f1 !important';
                };
                link.onmouseout = function() {
                    this.style.backgroundColor = '#ffffff !important';
                };

                link.appendChild(favicon);
                link.appendChild(textSpan);
                dropdownContent.appendChild(link);
            });

            // Toggle dropdown on click
            dropdownButton.onclick = function(e) {
                e.stopPropagation();
                dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
            };

            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                dropdownContent.style.display = 'none';
            });

            dropdownContainer.appendChild(dropdownButton);
            dropdownContainer.appendChild(dropdownContent);

            // Ensure the container is added to the document
            if (document.body) {
                document.body.appendChild(dropdownContainer);
                console.log('Dropdown created with movieId:', movieId);
            }
        }
    }

    // Start initialization
    initialize();

    // Watch for URL changes and content changes
    let lastUrl = location.href;
    const observer = new MutationObserver((mutations) => {
        // Check for URL changes
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            initAttempts = 0;
            if (shouldSkipCurrentPage()) {
                clearSearchButtons();
            } else {
                setTimeout(initialize, 1000);
            }
            return;
        }

        // For ThePornDB, only watch for specific content changes if we don't already have buttons
        if (window.location.hostname === 'theporndb.net' && !document.querySelector('.search-button-container')) {
            const titleChanged = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.querySelector && (
                        node.querySelector('h2.text-3xl') ||
                        node.querySelector('div.px-3.py-1.text-center h2.text-xl a[title]')
                    )
                )
            );

            if (titleChanged) {
                initAttempts = 0;
                setTimeout(initialize, 1000);
            }
        }
    });

    // Be more specific about what we observe
    observer.observe(document.body || document, {
        subtree: true,
        childList: true
    });
})();