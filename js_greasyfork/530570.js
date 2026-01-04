// ==UserScript==
// @name         Youtube Shorts Remover
// @namespace    Violentmonkey Scripts
// @version      1.3
// @description  Removes Youtube Shorts from search results and watch page
// @author       kayleighember
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530570/Youtube%20Shorts%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/530570/Youtube%20Shorts%20Remover.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    // Configuration variables with default values
    var config = {
        c_removeFromStartPage: true,
        c_removeFromSubscriptionFeed: true,
        c_removeFromAllFeeds: true, // except SubscriptionFeed
        c_removeFromFollowUp: true,
        c_removeFromChannel: true,
        c_removeSidebar: true,
        c_disableShortPage: true,
        c_disableShortPageScrolling: true,
        c_removeFromSearch: true,
        c_consoleColor: '#33bd52',
    };
    
    // Detect if we're on mobile
    const isMobile = window.location.href.includes('m.youtube.com');
    
    function log(...args) {
        const message = args.map(arg => String(arg)).join(' ');
        console.log('%c[ShortsRemover] ' + message, 'color: ' + config.c_consoleColor);
    }
    
    log("Running YouTube Shorts Remover on " + (isMobile ? "Mobile" : "Desktop") + " site");
    
    // URL pattern definitions
    var youtubeStartPagePattern = /^https?:\/\/(www\.|m\.)?youtube\.com\/?$/;
    var youtubeFeedPagePattern = /^https?:\/\/(www\.|m\.)?youtube\.com\/((feed)|(gaming))(?!\/subscriptions.*).*$/;
    var youtubeSubscriptionsPagePattern = /^https?:\/\/(www\.|m\.)?youtube\.com\/feed\/subscriptions\/?$/;
    var youtubeWatchPagePattern = /^https?:\/\/(www\.|m\.)?youtube\.com\/watch\/?.*$/;
    var youtubeShortPagePattern = /^https?:\/\/(www\.|m\.)?youtube\.com\/shorts.*$/;
    var youtubeSearchPagePattern = /^https?:\/\/(www\.|m\.)?youtube\.com\/results.*$/;
    var youtubeChannelPagePattern = /^https?:\/\/(www\.|m\.)?youtube\.com\/(?!feed.*)(?!watch.*)(?!short.*)(?!playlist.*)(?!podcasts.*)(?!gaming.*)(?!results.*).+$/;
    
    if (config.c_disableShortPageScrolling) {
        // Function to handle the custom scroll event
        const handleScroll = function(event) {
            if (youtubeShortPagePattern.test(window.location.href)) {
                log("Scrolling is disabled on Shorts page.");
                sendToHome();
                event.preventDefault();
            }
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('wheel', handleScroll);
    }
    
    function removeShorts() {
        // Get the current URL
        var currentURL = window.location.href;
        
        if (config.c_removeSidebar) {
            removeSidebarElement();
        }
        
        // Check if the current URL matches the YouTube short page URL pattern
        if (youtubeShortPagePattern.test(currentURL) && config.c_disableShortPage) {
            // URL & config matches
            sendToHome();
            log("Shorts page detected - redirecting to home.");
        }
        
        // Check if the current URL matches the YouTube start page URL pattern
        if (youtubeStartPagePattern.test(currentURL) && config.c_removeFromStartPage) {
            // URL & config matches
            removeFromVideoOverview();
            log("Shorts removed from Start page.");
        }
        
        // Check if the current URL matches the YouTube feed page URL pattern
        if (youtubeFeedPagePattern.test(currentURL) && config.c_removeFromAllFeeds) {
            // URL & config matches
            removeReelShelfRenderer();
            removeFromVideoOverview();
            log("Shorts removed from Feed.");
        }
        
        // Check if the current URL matches the YouTube subscriptions feed page URL pattern
        if (youtubeSubscriptionsPagePattern.test(currentURL) && config.c_removeFromSubscriptionFeed) {
            // URL & config matches
            removeFromVideoOverview();
            log("Shorts removed from subscriptions.");
        }
        
        // Check if the current URL matches the YouTube watch page URL pattern
        if (youtubeWatchPagePattern.test(currentURL) && config.c_removeFromFollowUp) {
            // URL & config matches
            removeReelShelfRenderer();
            log("Shorts removed from watch page followup videos.");
        }
        
        if (youtubeChannelPagePattern.test(currentURL) && config.c_removeFromChannel) {
            // URL & config matches
            removeReelShelfRenderer();
            removeFromVideoOverview();
            
            // Select all elements with tab-title Shorts (desktop)
            if (!isMobile) {
                var elementsToRemove = document.querySelectorAll('[tab-title="Shorts"]');
                
                // Loop through each selected element and remove it
                elementsToRemove.forEach(function(element) {
                    element.parentNode.removeChild(element);
                });
            }
            log("Shorts removed from channel.");
        }
        
        if (youtubeSearchPagePattern.test(currentURL) && config.c_removeFromSearch) {
            // URL & config matches
            removeReelShelfRenderer();
            removeFromVideoOverview();
            removeByUrl();
            log("Shorts removed from search results.");
        }
    }
    
    // Mobile-specific removal functions
    function removeShortsFromMobile() {
        // Remove shorts section on mobile YouTube homepage
        const shortsSections = document.querySelectorAll('ytm-rich-section-renderer');
        shortsSections.forEach(section => {
            // Look for sections with a header that contains "Shorts"
            const header = section.querySelector('h2');
            if (header && header.textContent.includes('Shorts')) {
                section.remove();
                log("Removed Shorts section from mobile");
            }
        });
        
        // Remove individual shorts items that might be mixed in
        const shortsItems = document.querySelectorAll('ytm-shorts-lockup-view-model, ytm-chip-cloud-chip-renderer');
        shortsItems.forEach(item => {
            const itemText = item.textContent || '';
            if (itemText.includes('Shorts') || item.querySelector('a[href*="/shorts/"]')) {
                item.closest('.ytm-rich-item-renderer, ytm-chip-cloud-chip-renderer') || item.remove();
                log("Removed individual Shorts item");
            }
        });
        
        // Remove Shorts chip from filter bar
        const shortsChip = document.querySelector('.chip-container[aria-label="Shorts"]');
        if (shortsChip) {
            const chipRenderer = shortsChip.closest('ytm-chip-cloud-chip-renderer');
            if (chipRenderer) {
                chipRenderer.remove();
                log("Removed Shorts chip from filter bar");
            }
        }
    }
    
    // Remove shorts on videoOverview
    function removeFromVideoOverview() {
        if (isMobile) {
            removeShortsFromMobile();
            return;
        }
        
        // Desktop removal logic
        // Select all elements with a specific attribute
        var elementsToRemove = document.querySelectorAll('[is-shorts],[is-reel-item-style-avatar-circle],ytd-reel-item-renderer');
        
        // Loop through each selected element and remove it
        elementsToRemove.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }
    
    // Remove Sidebar Element Shorts
    function removeSidebarElement() {
        if (isMobile) {
            // Instead of removing the element (which YouTube just re-creates),
            // we'll use CSS to permanently hide it
            
            // Create a style element if it doesn't exist yet
            if (!document.getElementById('youtube-shorts-remover-styles')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'youtube-shorts-remover-styles';
                styleEl.innerHTML = `
                    /* Hide bottom navigation bar */
                    ytm-pivot-bar-renderer {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        height: 0 !important;
                        overflow: hidden !important;
                        pointer-events: none !important;
                    }
                    
                    /* Fix any spacing issues that might occur */
                    .page-container {
                        padding-bottom: 0 !important;
                    }
                    
                    /* Make sure the player isn't affected by the sticky pivot bar */
                    ytm-app.sticky-player {
                        --ytm-pivot-bar-height: 0px !important;
                    }
                `;
                document.head.appendChild(styleEl);
                log("Added permanent CSS to hide bottom navigation bar");
            }
            
            return;
        }
        
        // Desktop removal logic
        // Select all elements with a title Shorts and specific class names
        var elementsToRemove = document.querySelectorAll('.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer[title="Shorts"]');
        
        // Loop through each selected element and remove the parent
        elementsToRemove.forEach(function(element) {
            element.parentNode.parentNode.removeChild(element.parentNode);
        });
    }
    
    // Remove shorts from video recommendations of a video
    function removeReelShelfRenderer() {
        if (isMobile) {
            // On mobile we need to handle this differently
            const shortsSections = document.querySelectorAll('ytm-rich-section-renderer');
            shortsSections.forEach(section => {
                if (section.textContent.includes('Shorts')) {
                    section.remove();
                }
            });
            return;
        }
        
        // Desktop removal logic
        // Select all "ytd-reel-shelf-renderer" elements
        var elementsToRemove = document.querySelectorAll('ytd-reel-shelf-renderer');
        
        // Loop through each selected element and remove it
        elementsToRemove.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }
    
    function removeByUrl() {
        if (isMobile) {
            // For mobile, find items with links containing /shorts/
            const shortsLinks = document.querySelectorAll('a[href*="/shorts/"]');
            shortsLinks.forEach(link => {
                const listItem = link.closest('ytm-video-with-context-renderer, ytm-compact-video-renderer');
                if (listItem) {
                    listItem.remove();
                    log("Removed shorts item by URL from mobile");
                }
            });
            return;
        }
        
        // Desktop removal logic
        // Select all "ytd-reel-shelf-renderer" elements
        var elementsToRemove = document.querySelectorAll('ytd-video-renderer:has([href*="/shorts/"])');
        
        // Loop through each selected element and remove it
        elementsToRemove.forEach(function(element) {
            element.parentNode.removeChild(element);
        });
    }
    
    function sendToHome() {
        window.location.href = "https://www.youtube.com/";
    }
    
    // Create a proper observer setup that works for both mobile and desktop
    function setupObserver() {
        let timeoutId;
        const observer = new MutationObserver(function(mutations) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                removeShorts();
                
                // Specifically look for the shorts section each time content loads
                if (isMobile) {
                    const shortsSections = document.querySelectorAll('ytm-rich-section-renderer');
                    shortsSections.forEach(section => {
                        const header = section.querySelector('h2');
                        if (header && header.textContent.includes('Shorts')) {
                            section.remove();
                            log("Removed dynamically loaded Shorts section");
                        }
                    });
                }
                
                log("All Shorts removed after DOM changes");
            }, 300); // Reduced timeout for faster response
        });
        
        // Configuration for the observer
        const config = { childList: true, subtree: true };
        
        // Select a proper target that exists in both mobile and desktop
        let targetNode;
        
        if (isMobile) {
            // For mobile YouTube, observe the content area specifically
            targetNode = document.querySelector('.page-container') || 
                         document.querySelector('ytm-app') ||
                         document.body;
        } else {
            // For desktop YouTube
            targetNode = document.querySelector('#content') || document.body;
        }
        
        if (targetNode) {
            observer.observe(targetNode, config);
            log("Observer attached to " + (isMobile ? "mobile" : "desktop") + " YouTube DOM");
        } else {
            log("Could not find target node for observer, falling back to document.body");
            observer.observe(document.body, config);
        }
        
        // Add a special observer just for handling newly added pivot bars
        if (isMobile) {
            const bodyObserver = new MutationObserver(function(mutations) {
                for (const mutation of mutations) {
                    if (mutation.addedNodes) {
                        for (const node of mutation.addedNodes) {
                            // If YouTube adds a new pivot bar, make sure our CSS still applies to it
                            if (node.nodeName === 'YTM-PIVOT-BAR-RENDERER') {
                                log("YouTube attempted to re-add the pivot bar");
                                // Refresh our CSS (just in case)
                                removeSidebarElement();
                            }
                        }
                    }
                }
            });
            
            bodyObserver.observe(document.body, { childList: true, subtree: true });
            log("Added dedicated observer for pivot bar changes");
        }
        
        return observer;
    }
    
    // Initial run
    removeShorts();
    
    // Set up the observer
    const mainObserver = setupObserver();
    
    // Run removal again when the page is fully loaded
    window.addEventListener('load', () => {
        removeShorts();
        log("Shorts removal ran on page load");
    });
    
    // Handle the document content becoming available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeShorts();
            log("Shorts removal ran on DOMContentLoaded");
        });
    }
})();
