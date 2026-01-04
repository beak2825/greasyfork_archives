// ==UserScript==
// @name         Axiom Pro Ultra v2
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Adds Pro Features to Axiom (Highlight 5% or More Holders, Search Bar for Pulse page)
// @author       nocommas
// @match        https://axiom.trade/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530002/Axiom%20Pro%20Ultra%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/530002/Axiom%20Pro%20Ultra%20v2.meta.js
// ==/UserScript==

/*
//////////////////////////////////////////////////
//                                            //
//        Axiom Pro Ultra by nocommas         //
//        Twitter: twitter.com/n0commas       //
//                                            //
//  Use the link below for FULL FEATURE       //
//  Access and LOWER FEES:                    //
//  https://axiom.trade/@nocommas             //
//                                            //
//////////////////////////////////////////////////
*/

(function() {
    'use strict';

    // Object to store the current search term for each column
    const columnSearchTerms = new Map();
    let cachedParentDivs = null;

    // Throttle function to limit update frequency
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Cache parent divs to reduce DOM queries, with option to force refresh
    function getParentDivs(forceRefresh = false) {
        if (forceRefresh || !cachedParentDivs || cachedParentDivs.length === 0) {
            cachedParentDivs = document.querySelectorAll('.absolute.inset-0.overflow-y-auto.custom-scrollbar');
        }
        return cachedParentDivs;
    }

    function highlightPercentages() {
        // Only run on /meme/* pages
        if (!window.location.pathname.startsWith('/meme')) return;

        requestAnimationFrame(() => {
            const parentDivs = getParentDivs();
            parentDivs.forEach(parentDiv => {
                const rows = parentDiv.querySelectorAll('.flex.flex-row.flex-1.px-\\[16px\\].justify-start.items-center.max-h-\\[48px\\].min-h-\\[48px\\]');
                Array.from(rows).slice(0, 7).forEach(row => {
                    const rowText = row.textContent.toUpperCase();
                    if (rowText.includes('LIQUIDITY POOL') || rowText.includes('RAYDIUM V4')) {
                        if (row.dataset.highlighted !== 'skip') {
                            row.style.backgroundColor = '';
                            row.style.color = '';
                            const children = row.querySelectorAll('*');
                            children.forEach(child => child.style.color = '');
                            row.dataset.highlighted = 'skip';
                        }
                        return;
                    }

                    const remainingDiv = row.querySelector('div:nth-child(5)');
                    if (!remainingDiv) return;

                    const spans = remainingDiv.querySelectorAll('span.text-textSecondary.text-\\[12px\\]');
                    spans.forEach(span => {
                        const text = span.textContent.trim();
                        const percentageMatch = text.match(/(\d+(?:\.\d+)?)%/);
                        if (percentageMatch) {
                            const percentage = parseFloat(percentageMatch[1]);
                            const newState = percentage > 5 ? 'highlight' : 'normal';
                            if (row.dataset.highlighted !== newState) {
                                if (percentage > 5) {
                                    row.style.backgroundColor = '#610000';
                                    row.style.color = '#ffffff';
                                    const children = row.querySelectorAll('*');
                                    children.forEach(child => child.style.color = '#ffffff');
                                } else {
                                    row.style.backgroundColor = '';
                                    row.style.color = '';
                                    const children = row.querySelectorAll('*');
                                    children.forEach(child => child.style.color = '');
                                }
                                row.dataset.highlighted = newState;
                            }
                        }
                    });
                });
            });
        });
    }

    // Function to update Pulse title with retry mechanism that stops on success
    function updatePulseTitle() {
        if (!window.location.pathname.includes('/pulse')) return;

        let isUpdated = false;

        function tryUpdateTitle(attempts = 5, delay = 500) {
            if (isUpdated) return; // Stop if already updated

            const pulseElements = document.querySelectorAll('span[class*="text-textPrimary"][class*="font-medium"]');
            let found = false;

            pulseElements.forEach(element => {
                if (element.textContent.trim() === 'Pulse' && !element.dataset.updated) {
                    element.innerHTML = 'Pulse Ultra <span style="font-size: 14px;">(by <a href="https://x.com/n0commas" target="_blank" style="color: #1DA1F2; text-decoration: none;">x.com/n0commas</a>)</span>';
                    element.dataset.updated = 'true';
                    found = true;
                    isUpdated = true; // Set flag to stop retries
                }
            });

            if (!found && attempts > 0) {
                setTimeout(() => tryUpdateTitle(attempts - 1, delay), delay);
            }
        }

        tryUpdateTitle();
    }

    // Function to apply filtering to a column based on a search term
    function applyFilter(column, searchTerm) {
        const rows = column.querySelectorAll('.bg-backgroundSecondary.border-primaryStroke\\/50.border-b-\\[1px\\]');
        rows.forEach(row => {
            const nameElement = row.querySelector('.text-textPrimary.text-\\[16px\\].font-medium.tracking-\\[-0\\.02em\\].truncate');
            const tickerElement = row.querySelector('.text-inherit.text-\\[16px\\]');
            const name = nameElement ? nameElement.textContent.toLowerCase() : '';
            const ticker = tickerElement ? tickerElement.textContent.toLowerCase() : '';

            row.style.display = (!searchTerm || name.includes(searchTerm) || ticker.includes(searchTerm)) ? '' : 'none';
        });
    }

    // Function to add a search bar to each column on the pulse page
    function addSearchBarToColumns() {
        if (!window.location.pathname.includes('/pulse')) return;

        const columns = document.querySelectorAll('.flex.flex-1.flex-col.h-full.justify-start.items-center.overflow-hidden');
        columns.forEach((column, index) => {
            const header = column.querySelector('.bg-backgroundSecondary.sticky.top-0.z-30.w-full');
            if (!header || header.querySelector('.custom-search-bar')) {
                const searchTerm = columnSearchTerms.get(column);
                if (searchTerm) applyFilter(column, searchTerm);
                return;
            }

            const searchContainer = document.createElement('div');
            searchContainer.className = 'custom-search-bar flex flex-row items-center gap-[8px] w-full px-[12px] py-[8px]';
            searchContainer.style.backgroundColor = '#1a1a1a';
            searchContainer.style.borderBottom = '1px solid #2a2a2a';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search name or ticker...';
            searchInput.className = 'flex-1 bg-backgroundTertiary text-textPrimary text-[14px] font-medium rounded-[4px] px-[8px] py-[4px] outline-none';
            searchInput.style.border = '1px solid #2a2a2a';
            searchInput.style.color = '#ffffff';

            const searchIcon = document.createElement('i');
            searchIcon.className = 'ri-search-line text-textSecondary text-[16px]';
            searchContainer.appendChild(searchIcon);
            searchContainer.appendChild(searchInput);
            header.appendChild(searchContainer);

            const filterColumn = () => {
                const searchTerm = searchInput.value.trim().toLowerCase();
                columnSearchTerms.set(column, searchTerm);
                applyFilter(column, searchTerm);
            };

            searchInput.addEventListener('input', filterColumn);
            columnSearchTerms.set(column, '');
        });
    }

    // Throttled function for dynamic checks (excluding updatePulseTitle)
    const throttledRunDynamicChecks = throttle(() => {
        cachedParentDivs = null; // Clear cache to force refresh on navigation
        highlightPercentages();
        addSearchBarToColumns();
    }, 100); // Update at most every 100ms

    // Function to handle navigation events (including updatePulseTitle)
    function handleNavigation() {
        throttledRunDynamicChecks();
        updatePulseTitle(); // Run non-throttled for title updates on navigation
    }

    // Wait for DOM and set up observers and navigation listeners
    function waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') resolve();
            else document.addEventListener('DOMContentLoaded', resolve);
        });
    }

    waitForDOM().then(() => {
        // Initial run
        throttledRunDynamicChecks();
        updatePulseTitle();

        // Scope observer to a likely container for trading data
        const targetContainer = document.querySelector('.absolute.inset-0.overflow-y-auto.custom-scrollbar') || document.body;
        const observer = new MutationObserver(() => throttledRunDynamicChecks()); // Only throttled checks here
        observer.observe(targetContainer, { childList: true, subtree: true });

        // Listen for full page load
        window.addEventListener('load', handleNavigation);

        // Listen for popstate (browser back/forward)
        window.addEventListener('popstate', handleNavigation);

        // Override History API for SPA navigation
        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
            originalPushState.apply(this, arguments);
            handleNavigation();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(state, title, url) {
            originalReplaceState.apply(this, arguments);
            handleNavigation();
        };
    });
})();