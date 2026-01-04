// ==UserScript==
// @name        Reddit to SafeReddit Redirector
// @namespace   https://safereddit.com/
// @version     1.0
// @description Redirects Reddit URLs directly to SafeReddit
// @author      You
// @match       *://*.reddit.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/527404/Reddit%20to%20SafeReddit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/527404/Reddit%20to%20SafeReddit%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to perform the redirect
    function redirectToSafeReddit() {
        // Prevent infinite redirects by checking if this is a redirect loop
        const redirectAttemptKey = 'safereddit_redirect_attempt';
        const redirectAttempt = sessionStorage.getItem(redirectAttemptKey);
        const currentTime = Date.now();
        
        // If we've attempted a redirect in the last 2 seconds, abort to prevent loops
        if (redirectAttempt && (currentTime - parseInt(redirectAttempt)) < 2000) {
            console.log('Prevented redirect loop');
            return;
        }
        
        // Mark this redirect attempt
        sessionStorage.setItem(redirectAttemptKey, currentTime.toString());
        
        // Get current URL and extract the path
        const currentUrl = window.location.href;
        const match = /reddit\.com(\/?.*)/i.exec(currentUrl);
        
        if (match) {
            const path = match[1];
            
            // Stop the current page load immediately
            window.stop();
            
            // Create the SafeReddit URL
            const safeRedditUrl = 'https://safereddit.com' + path;
            
            // Redirect using replace (doesn't add to browser history)
            window.location.replace(safeRedditUrl);
        }
    }
    
    // Execute redirect immediately when script runs
    redirectToSafeReddit();
    
    // Handle SPA (Single Page Application) navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        redirectToSafeReddit();
    };
    
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        redirectToSafeReddit();
    };
    
    // Catch any other navigation methods
    window.addEventListener('popstate', redirectToSafeReddit);
})();