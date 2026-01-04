// ==UserScript==
// @name         xNhau Ad Blocker (Mobile Compatible)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove all ads and popups from xNhau while preserving media playback
// @author       You
// @match        https://xnhau.im/*
// @match        https://*.xnhau.im/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535298/xNhau%20Ad%20Blocker%20%28Mobile%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535298/xNhau%20Ad%20Blocker%20%28Mobile%20Compatible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Create a stylesheet with more precise ad targeting
    const style = document.createElement('style');
    style.textContent = `
        /* Ad containers but preserve main content */
        .spot:not(:has(video.main-video)), 
        .ad-container, 
        [id*="banner"],
        [id*="catfish"], 
        a[href*="utm_campaign"][target="_blank"], 
        a[href*="utm_medium"][target="_blank"], 
        a[target="_blank"][rel="nofollow"],
        div[style*="728px"][style*="90px"]:not(.video-player-container) { 
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            visibility: hidden !important;
        }
        
        /* Preserve video player container styles */
        .video-js, .vjs-poster, video.main-content {
            display: block !important;
            height: auto !important;
            width: auto !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            position: relative !important;
            visibility: visible !important;
        }
    `;
    document.head.appendChild(style);
    
    // Block obfuscated ad scripts that create popunders
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(node) {
        if (node.tagName === 'SCRIPT') {
            const scriptContent = node.textContent || '';
            if (scriptContent.includes('_0x') && 
                (scriptContent.includes('catfish') || 
                 scriptContent.includes('popunder') || 
                 scriptContent.includes('utm_'))) {
                return document.createComment('Blocked ad script');
            }
        }
        return originalAppendChild.call(this, node);
    };
    
    // Block the open window function used by popunders with a safer approach
    const originalOpen = window.open;
    window.open = function(url, name, specs) {
        if (url && (
            url.includes('utm_campaign') || 
            url.includes('utm_medium') || 
            url.includes('utm_source') ||
            url.includes('kbet.com') ||
            url.includes('lu88.com') ||
            url.includes('hit.club') ||
            url.includes('b52.cc')
        )) {
            console.log('Blocked popup:', url);
            return null;
        }
        return originalOpen.call(this, url, name, specs);
    };
    
    // Function to remove ads when DOM is loaded
    function removeAds() {
        // Only remove ad-specific containers
        const adSelectors = [
            '#catfishPcGuest',
            'div.spot:not(:has(video.main-video))',
            'a[target="_blank"][rel="nofollow"]:not(:has(video.main-content))'
        ];
        
        adSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    el.remove();
                });
            } catch(e) {
                // Some selectors might not be supported in all browsers
            }
        });
        
        // More targeted approach for video ads
        document.querySelectorAll('video').forEach(video => {
            // Check if this is an ad video
            const parent = video.parentElement;
            if (parent && parent.tagName === 'A' && 
                parent.getAttribute('rel') === 'nofollow' &&
                (parent.href.includes('utm_') || 
                 parent.href.includes('kbet.com') || 
                 parent.href.includes('lu88.com') || 
                 parent.href.includes('hit.club') || 
                 parent.href.includes('b52.cc'))) {
                parent.remove();
            }
        });
        
        // Remove the obfuscated ad script containers
        document.querySelectorAll('script').forEach(script => {
            const content = script.textContent || '';
            if (content.includes('_0x') && 
                (content.includes('clickCount') || 
                 content.includes('firstClickTime') ||
                 content.includes('popunder'))) {
                script.remove();
            }
        });
        
        // Clean localStorage to prevent ad tracking
        try {
            localStorage.removeItem('firstClickTime');
            localStorage.removeItem('clickCount');
        } catch (e) {}
    }
    
    // Run immediately and after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAds);
    } else {
        removeAds();
    }
    
    // More precise mutation observer to clean dynamically added ads
    const observer = new MutationObserver(mutations => {
        let needsAdRemoval = false;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a known ad container
                        if (node.id === 'catfishPcGuest' || 
                            (node.classList && 
                             (node.classList.contains('spot') || 
                              node.classList.contains('ad-container')))) {
                            
                            // Make sure it's not a legitimate video container
                            if (!node.querySelector('video.main-video, video.main-content')) {
                                node.remove();
                            } else {
                                // If it contains legitimate video content, just remove ad parts
                                needsAdRemoval = true;
                            }
                        } else {
                            needsAdRemoval = true;
                        }
                    }
                });
            }
        });
        
        // Only do a full scan when needed
        if (needsAdRemoval) {
            removeAds();
        }
    });
    
    // Start observing the body for dynamically added content
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
    
    // Override the closeAd function to do nothing
    window.closeAd = function() { return false; };
    
    console.log('xNhau Ad Blocker (Mobile Compatible): Active');
})();