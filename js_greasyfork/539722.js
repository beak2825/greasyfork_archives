// ==UserScript==
// @name         Force Magnet Link Redirect to Parallels
// @namespace    https://tampermonkey.net
// @version      1.1
// @description  Rewrites all magnet: links to openmagnet:// URLs for handling via a custom macOS Automator or Parallels app
// @author       sharmanhall
// @match        *://*/*
// @run-at       document-start
// @license      MIT
// @homepage     https://greasyfork.org/en/users/866731-sharmanhall
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539722/Force%20Magnet%20Link%20Redirect%20to%20Parallels.user.js
// @updateURL https://update.greasyfork.org/scripts/539722/Force%20Magnet%20Link%20Redirect%20to%20Parallels.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const interceptMagnet = (el) => {
        if (el.tagName === 'A' && el.href && el.href.startsWith('magnet:')) {
            const originalHref = el.href;
            const magnet = encodeURIComponent(originalHref);
            el.href = `openmagnet://?url=${magnet}`;
            el.target = '_self'; // Prevents popup blocker interference
            
            // Add a visual indicator (optional - can be removed if not desired)
            if (!el.hasAttribute('data-magnet-redirected')) {
                el.setAttribute('data-magnet-redirected', 'true');
                el.title = `Redirected magnet link: ${originalHref.substring(0, 50)}...`;
            }
            
            console.log('✅ Magnet link rewritten to openmagnet:', el.href);
        }
    };

    const processExistingLinks = () => {
        const magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
        magnetLinks.forEach(interceptMagnet);
        
        if (magnetLinks.length > 0) {
            console.log(`🔗 Processed ${magnetLinks.length} existing magnet link(s)`);
        }
    };

    const processNewNodes = (nodes) => {
        for (const node of nodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'A') {
                    interceptMagnet(node);
                } else if (node.querySelectorAll) {
                    const magnetLinks = node.querySelectorAll('a[href^="magnet:"]');
                    magnetLinks.forEach(interceptMagnet);
                }
            }
        }
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processExistingLinks);
    } else {
        // DOM is already ready
        processExistingLinks();
    }

    // Set up MutationObserver to handle dynamically added content
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                processNewNodes(mutation.addedNodes);
            }
        }
    });

    // Start observing when body is available
    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('🔍 MutationObserver started for magnet link detection');
        } else {
            // Body not ready yet, try again
            setTimeout(startObserver, 10);
        }
    };

    startObserver();

})();