// ==UserScript==
// @name         AliExpress Anti-Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent unwanted redirects on AliExpress
// @match        *://*.aliexpress.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521258/AliExpress%20Anti-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/521258/AliExpress%20Anti-Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let blockTimeout = null;

    // Function to mark blocked attempt
    const markBlocked = () => {
        if (!document.title.includes('🛡️')) {
            const originalTitle = document.title;
            document.title = '🛡️ ' + originalTitle;
            
            // Clear any existing timeout
            if (blockTimeout) {
                clearTimeout(blockTimeout);
            }
            
            // Set new timeout to remove the shield
            blockTimeout = setTimeout(() => {
                document.title = originalTitle;
            }, 1000);
        }
    };
    
    // Override history manipulation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
        if (!arguments[2]?.includes('wextap.com')) {
            return originalPushState.apply(this, arguments);
        }
        markBlocked();
    };
    
    history.replaceState = function() {
        if (!arguments[2]?.includes('wextap.com')) {
            return originalReplaceState.apply(this, arguments);
        }
        markBlocked();
    };

    // Block visibility detection
    Object.defineProperty(Document.prototype, 'hidden', {
        get: function() { 
            markBlocked();
            return false; 
        }
    });
    Object.defineProperty(Document.prototype, 'visibilityState', {
        get: function() { 
            markBlocked();
            return 'visible'; 
        }
    });

    // Prevent beforeunload events
    window.addEventListener('beforeunload', function(e) {
        markBlocked();
        e.preventDefault();
        e.stopPropagation();
    }, true);
})();