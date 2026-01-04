// ==UserScript==
// @name         Enable Ctrl+Click for Legal Reference System (All Functions)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enable Ctrl+click to open legal cases in new tabs for all JavaScript link types
// @match        https://legalref.judiciary.hk/*
// @match        http://legalref.judiciary.hk/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540692/Enable%20Ctrl%2BClick%20for%20Legal%20Reference%20System%20%28All%20Functions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540692/Enable%20Ctrl%2BClick%20for%20Legal%20Reference%20System%20%28All%20Functions%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract URL from various JavaScript function calls
    function extractUrl(jsCode) {
        // Extract URL from matchpop('url', ...) 
        let match = jsCode.match(/matchpop\s*\(\s*['"]([^'"]+)['"]/);
        if (match) {
            return match[1];
        }
        
        // Extract URL from CommonPopup('url', ...)
        match = jsCode.match(/CommonPopup\s*\(\s*['"]([^'"]+)['"]/);
        if (match) {
            return match[1];
        }
        
        // Extract URL from judpop1('url') or judpop('url')
        match = jsCode.match(/judpop1?\s*\(\s*['"]([^'"]+)['"]\s*\)/);
        if (match) {
            return match[1];
        }
        
        // Handle cases where the URL is constructed with variables
        const varMatch = jsCode.match(/judpop1?\s*\(\s*['"]([^'"]+)['"]\s*\+\s*(\w+)\s*\)/);
        if (varMatch) {
            // Try to get the variable value from the script context
            const scriptTags = document.getElementsByTagName('script');
            for (let script of scriptTags) {
                const varPattern = new RegExp(`var\\s+${varMatch[2]}\\s*=\\s*['"]([^'"]+)['"]`);
                const varValueMatch = script.innerHTML.match(varPattern);
                if (varValueMatch) {
                    return varMatch[1] + varValueMatch[1];
                }
            }
        }
        
        return null;
    }

    // Function to handle clicks on links
    function handleLinkClick(e) {
        // Check if Ctrl key (or Cmd key on Mac) is pressed
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            e.stopPropagation();
            
            const link = e.currentTarget;
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('javascript:')) {
                const url = extractUrl(href);
                if (url) {
                    // Construct the full URL if it's relative
                    let fullUrl = url;
                    if (!url.startsWith('http')) {
                        // Handle different types of relative URLs
                        if (url.startsWith('/')) {
                            // Absolute path from root
                            fullUrl = window.location.origin + url;
                        } else if (url.startsWith('../')) {
                            // Relative path going up directories
                            const baseUrl = window.location.origin + window.location.pathname;
                            const pathParts = baseUrl.split('/');
                            pathParts.pop(); // Remove current file
                            
                            let relativeUrl = url;
                            while (relativeUrl.startsWith('../')) {
                                pathParts.pop();
                                relativeUrl = relativeUrl.substring(3);
                            }
                            
                            fullUrl = pathParts.join('/') + '/' + relativeUrl;
                        } else {
                            // Relative path from current directory
                            const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                            fullUrl = baseUrl + url;
                        }
                    }
                    
                    // Open in new tab
                    window.open(fullUrl, '_blank');
                }
            }
        }
    }

    // Function to process all links on the page
    function processLinks() {
        // Find all links that use any of the JavaScript functions
        const links = document.querySelectorAll('a[href^="javascript:"]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            // Check if it's one of the functions we're interested in
            if (href && (href.includes('matchpop') || href.includes('CommonPopup') || href.includes('judpop'))) {
                // Remove any existing event listeners to avoid duplicates
                link.removeEventListener('click', handleLinkClick);
                
                // Add our custom click handler
                link.addEventListener('click', handleLinkClick, true);
                
                // Add visual feedback that Ctrl+click is available
                link.style.cursor = 'pointer';
                if (!link.title.includes('Ctrl+click')) {
                    link.title = (link.title || '') + ' (Ctrl+click to open in new tab)';
                }
            }
        });
    }

    // Process links when the page loads
    processLinks();

    // Also process links that might be added dynamically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                processLinks();
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Override the window functions globally to add Ctrl+click support
    if (typeof window.matchpop === 'function') {
        const originalMatchpop = window.matchpop;
        window.matchpop = function(url, windowName) {
            if (window.event && (window.event.ctrlKey || window.event.metaKey)) {
                const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
                window.open(fullUrl, '_blank');
            } else {
                originalMatchpop(url, windowName);
            }
        };
    }

    if (typeof window.CommonPopup === 'function') {
        const originalCommonPopup = window.CommonPopup;
        window.CommonPopup = function(url) {
            if (window.event && (window.event.ctrlKey || window.event.metaKey)) {
                let fullUrl = url;
                if (!url.startsWith('http')) {
                    if (url.startsWith('/')) {
                        fullUrl = window.location.origin + url;
                    } else {
                        fullUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + url;
                    }
                }
                window.open(fullUrl, '_blank');
            } else {
                originalCommonPopup.apply(this, arguments);
            }
        };
    }

})();