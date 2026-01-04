// ==UserScript==
// @name         YouTube Channel Auto-Redirect to Videos Section
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically redirects from a YouTube channel's home page to its videos section
// @author       Claude
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528305/YouTube%20Channel%20Auto-Redirect%20to%20Videos%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/528305/YouTube%20Channel%20Auto-Redirect%20to%20Videos%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to redirect to the videos section
    function redirectToVideos(url) {
        // Check if URL matches a channel's home page pattern
        const isChannelUrl = /youtube\.com\/((@[^\/]+)|channel\/|c\/)[^\/]*$/.test(url);
        
        // If we're on a channel's home page, redirect to videos section
        if (isChannelUrl) {
            const newUrl = url + (url.endsWith('/') ? 'videos' : '/videos');
            window.location.replace(newUrl);
            return true;
        }
        return false;
    }
    
    // Check initial URL
    redirectToVideos(window.location.href);
    
    // Monitor URL changes using History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    // Override pushState method
    history.pushState = function() {
        const result = originalPushState.apply(this, arguments);
        redirectToVideos(window.location.href);
        return result;
    };
    
    // Override replaceState method
    history.replaceState = function() {
        const result = originalReplaceState.apply(this, arguments);
        redirectToVideos(window.location.href);
        return result;
    };
    
    // Additional listener for popstate events (back/forward navigation)
    window.addEventListener('popstate', function() {
        redirectToVideos(window.location.href);
    });
    
    // Additional function to check URL periodically
    function checkUrlPeriodically() {
        redirectToVideos(window.location.href);
        setTimeout(checkUrlPeriodically, 1000); // Check every 1 second
    }
    
    // Start periodic checking
    setTimeout(checkUrlPeriodically, 1000);
})();