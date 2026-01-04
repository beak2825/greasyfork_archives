// ==UserScript==
// @name         Zoho Desk - Default to Starred Views
// @namespace    https://github.com/jake-greygoose
// @version      1.0.0
// @description  Automatically collapses "All Views" and opens "Starred Views" in Zoho Desk
// @author       Jake-Greygoose
// @match        https://desk.zoho.eu/agent/*
// @match        https://desk.zoho.com/agent/*
// @match        https://desk.zoho.in/agent/*
// @match        https://desk.zoho.com.au/agent/*
// @homepageURL  https://github.com/jake-greygoose/Zoho-Desk-Userscript
// @supportURL   https://github.com/jake-greygoose/Zoho-Desk-Userscript/issues
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531109/Zoho%20Desk%20-%20Default%20to%20Starred%20Views.user.js
// @updateURL https://update.greasyfork.org/scripts/531109/Zoho%20Desk%20-%20Default%20to%20Starred%20Views.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const DEBUG = false;
    
    function log(...args) {
        if (DEBUG) {
            console.log("[Zoho Desk Views]", ...args);
        }
    }
    
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(`Timeout waiting for element: ${selector}`);
            }, timeout);
        });
    }
    
    function safeClick(element, maxRetries = 3) {
        let retries = 0;
        
        function attemptClick() {
            try {
                element.click();
                log(`Element clicked successfully`);
                return true;
            } catch (error) {
                retries++;
                log(`Click error (attempt ${retries}):`, error);
                
                if (retries < maxRetries) {
                    log(`Retrying click in 300ms...`);
                    setTimeout(attemptClick, 300);
                } else {
                    log(`Failed to click element after ${maxRetries} attempts`);
                    return false;
                }
            }
        }
        
        return attemptClick();
    }
    
    async function toggleViews() {
        try {
            log("Starting view toggle operation");
            
            const allViewsButton = await waitForElement('button[data-id="all_views"]');
            const starredViewsButton = await waitForElement('button[data-id="starred_views"]');
            
            log("Found both view buttons");
            
            const allViewsExpanded = allViewsButton.getAttribute('aria-expanded') === 'true';
            const starredViewsExpanded = starredViewsButton.getAttribute('aria-expanded') === 'true';
            
            log(`Current states - All Views expanded: ${allViewsExpanded}, Starred Views expanded: ${starredViewsExpanded}`);
            
            if (allViewsExpanded || !starredViewsExpanded) {
                if (allViewsExpanded) {
                    log("Collapsing All Views...");
                    safeClick(allViewsButton);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                if (!starredViewsExpanded) {
                    log("Expanding Starred Views...");
                    safeClick(starredViewsButton);
                }
                
                log("Toggle operation completed successfully");
            } else {
                log("Views already in desired state, no action needed");
            }
            
        } catch (error) {
            console.error("[Zoho Desk Views] Error:", error);
        }
    }
    
    setTimeout(toggleViews, 1000);
})();