// ==UserScript==
// @name         Autotrader UK - Battery Lease filter
// @namespace    https://autotrader.co.uk
// @version      1.1
// @description  Adds Battery Lease Include/Exclude filter for all car searches
// @author       Steve Chambers
// @license      MIT
// @match        https://www.autotrader.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autotrader.co.uk
// @downloadURL https://update.greasyfork.org/scripts/543972/Autotrader%20UK%20-%20Battery%20Lease%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/543972/Autotrader%20UK%20-%20Battery%20Lease%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let batteryLeaseFilter = 'include';
    
    function createFilterBox() {
        if (document.getElementById('battery-lease-filter')) return;
        
        const filterBox = document.createElement('div');
        filterBox.id = 'battery-lease-filter';
        filterBox.style.cssText = `
            position: fixed;
            top: 60px;
            left: 10px;
            background: white;
            border: 1px solid #0066cc;
            padding: 8px;
            border-radius: 4px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            max-width: 150px;
        `;
        
        filterBox.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 6px; color: #0066cc;">Battery Lease</div>
            <label style="display: block; margin-bottom: 3px; font-size: 11px;">
                <input type="radio" name="battery-lease" value="include" checked> Include
            </label>
            <label style="display: block; font-size: 11px;">
                <input type="radio" name="battery-lease" value="exclude"> Exclude
            </label>
        `;
        
        filterBox.addEventListener('change', (e) => {
            batteryLeaseFilter = e.target.value;
            filterListings();
        });
        
        document.body.appendChild(filterBox);
    }
    
    function filterListings() {
        document.querySelectorAll('li').forEach(li => {
            if (batteryLeaseFilter === 'exclude') {
                const text = li.textContent.toLowerCase();
                if (text.includes('battery lease')) {
                    li.style.display = 'none';
                    return;
                }
            }
            
            // Restore hidden listings when switching back to include
            if (li.style.display === 'none' && batteryLeaseFilter === 'include') {
                const text = li.textContent.toLowerCase();
                if (text.includes('battery lease')) {
                    li.style.display = '';
                }
            }
        });
    }
    
    function init() {
        createFilterBox();
        filterListings();
    }
    
    init();
    
    const observer = new MutationObserver(() => {
        init();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
