// ==UserScript==
// @name        Reddit to Redlib Redirector (Improved)
// @namespace   https://farside.link/
// @version     1.1
// @description Redirects Reddit URLs to Redlib via farside.link (fast and reliable)
// @author      You
// @match       *://*.reddit.com/*
// @run-at      document-start
// @grant       window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/527402/Reddit%20to%20Redlib%20Redirector%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527402/Reddit%20to%20Redlib%20Redirector%20%28Improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to perform the redirect
    function redirectToRedlib() {
        // Prevent infinite redirects by checking if this is a redirect loop
        const redirectAttemptKey = 'redlib_redirect_attempt';
        const redirectAttempt = sessionStorage.getItem(redirectAttemptKey);
        const currentTime = Date.now();
        
        // If we've attempted a redirect in the last 2 seconds, abort to prevent loops
        if (redirectAttempt && (currentTime - parseInt(redirectAttempt)) < 2000) {
            console.log('Prevented redirect loop');
            return;
        }
        
        // Mark this redirect attempt
        sessionStorage.setItem(redirectAttemptKey, currentTime.toString());
        
        // Get current URL
        const currentUrl = window.location.href;
        
        // Define Reddit regex pattern
        const Redlib = /reddit\.com(\/?.*)/;
        
        // Test if current URL matches Reddit pattern
        if (Redlib.test(currentUrl)) {
            // Extract the path part from the URL
            const path = Redlib.exec(currentUrl)[1];
            
            // Use location.replace for a cleaner redirect (doesn't add to browser history)
            window.stop(); // Stop the current page load immediately
            window.location.replace('https://farside.link/redlib' + path);
        }
    }
    
    // Execute redirect immediately when script runs
    redirectToRedlib();
    
    // Also handle SPA (Single Page Application) navigation
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', redirectToRedlib);
    }
    
    // Fallback for browsers that don't fully support the above
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        redirectToRedlib();
    };
    
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        redirectToRedlib();
    };
    
    // One final attempt to catch any other navigation methods
    window.addEventListener('popstate', redirectToRedlib);
})();