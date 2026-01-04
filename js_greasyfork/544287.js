// ==UserScript==
// @name         eBay Hide Price Range Items
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Hide eBay listings that have price ranges. Based on https://greasyfork.org/en/scripts/28968-pricerangeitemhider by Lars Simonsen, fixed with Claude.ai for 2025 ebay updated code.
// @author       Claude
// @match        https://www.ebay.co.uk/*
// @match        https://www.ebay.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544287/eBay%20Hide%20Price%20Range%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/544287/eBay%20Hide%20Price%20Range%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('eBay Price Range Hider: Script loaded');
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .hiddenRangeItem { background-color: #eee; }
        .showHiddenRangeItem { 
            cursor: pointer; 
            background-color: #eee; 
            border: 1px solid #ddd; 
            margin: 1em; 
            padding: 0.25em; 
            text-align: center; 
        }
        .showHiddenRangeItem.showing { color: white; background-color: black; }
        .showHiddenRangeItem.hiding .hideIt, 
        .showHiddenRangeItem.showing .showIt { display: none; }
    `;
    document.head.appendChild(style);
    
    function hideRangeItem(element) {
        if (element.classList.contains('hiddenRangeItem')) return;
        
        element.classList.add('hiddenRangeItem');
        element.style.display = 'none';
        
        const toggleButton = document.createElement('div');
        toggleButton.className = 'showHiddenRangeItem hiding';
        toggleButton.innerHTML = '<span class="showIt">Show</span><span class="hideIt">Hide</span> price range item';
        
        toggleButton.addEventListener('click', function() {
            this.classList.toggle('showing');
            this.classList.toggle('hiding');
            const hiddenItem = this.nextElementSibling;
            if (hiddenItem.style.display === 'none') {
                hiddenItem.style.display = '';
            } else {
                hiddenItem.style.display = 'none';
            }
        });
        
        element.parentNode.insertBefore(toggleButton, element);
    }
    
    function hideRangeItems() {
        let foundCount = 0;
        let hiddenCount = 0;
        
        // Find all price attribute rows
        const priceRows = document.querySelectorAll('.s-card__attribute-row');
        
        priceRows.forEach(row => {
            const priceSpans = row.querySelectorAll('.s-card__price');
            
            // Check if this row has multiple price spans
            if (priceSpans.length > 1) {
                // Check if any span contains " to " text
                let hasToText = false;
                priceSpans.forEach(span => {
                    const text = span.textContent.trim();
                    if (text === 'to' || text === ' to ' || text.toLowerCase() === 'to') {
                        hasToText = true;
                    }
                });
                
                if (hasToText) {
                    foundCount++;
                    // Find the parent li element
                    const listItem = row.closest('li.s-card');
                    if (listItem && !listItem.classList.contains('hiddenRangeItem')) {
                        const title = listItem.querySelector('.s-card__title');
                        console.log('Hiding price range item:', title ? title.textContent.trim().substring(0, 50) : 'Unknown');
                        hideRangeItem(listItem);
                        hiddenCount++;
                    }
                }
            }
        });
        
        if (foundCount > 0) {
            console.log(`eBay Price Range Hider: Found ${foundCount} price range items, hidden ${hiddenCount} new items`);
        }
    }
    
    // Wait for page to load
    function init() {
        if (typeof jQuery === 'undefined') {
            console.log('eBay Price Range Hider: jQuery not found, using vanilla JS');
        }
        
        console.log('eBay Price Range Hider: Initializing...');
        hideRangeItems();
        
        // Run periodically for dynamically loaded content
        setInterval(hideRangeItems, 2000);
        
        // Watch for new content being added
        const observer = new MutationObserver(function(mutations) {
            let shouldRun = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    shouldRun = true;
                }
            });
            if (shouldRun) {
                setTimeout(hideRangeItems, 500);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('eBay Price Range Hider: Initialization complete');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();