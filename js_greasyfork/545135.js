// ==UserScript==
// @name         Discord Remove APP Bot Tag
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove APP bot tags from Discord messages
// @author       You
// @match        https://discord.com/channels/*
// @match        https://discordapp.com/channels/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545135/Discord%20Remove%20APP%20Bot%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/545135/Discord%20Remove%20APP%20Bot%20Tag.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to hide bot tags
    function hideBotTags() {
        // Target the bot tag elements
        const botTags = document.querySelectorAll('.botTagCozy_c19a55, .botTag_c19a55, .botTagRegular__82f07, .botTag__82f07');
        
        botTags.forEach(tag => {
            if (tag.textContent.includes('APP') || tag.textContent.includes('BOT')) {
                tag.style.display = 'none';
            }
        });
    }
    
    // Run initially
    setTimeout(hideBotTags, 1000);
    
    // Create observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                hideBotTags();
            }
        });
    });
    
    // Start observing when page loads
    window.addEventListener('load', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        hideBotTags();
    });
    
    // Also run periodically as a fallback
    setInterval(hideBotTags, 2000);
})();