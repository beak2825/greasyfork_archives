// ==UserScript==
// @name         Amazon Filter: Sold by Amazon.com
// @namespace    https://github.com/sinazadeh/userscripts
// @version      2.2.0
// @description  Enhances Amazon's sidebar by adding direct filters for items sold by Amazon.com and other Amazon-owned sellers.
// @author       TheSina
// @match        *://www.amazon.com/s*
// @match        *://www.amazon.com/*/b/*
// @match        *://www.amazon.com/b/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542041/Amazon%20Filter%3A%20Sold%20by%20Amazoncom.user.js
// @updateURL https://update.greasyfork.org/scripts/542041/Amazon%20Filter%3A%20Sold%20by%20Amazoncom.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function () {
    'use strict';

    // --- Configuration ---
    const ID_MAP = {
        Amazon: 'A2Q1LRYTXHYQ2K',
        'Amazon.com': 'ATVPDKIKX0DER',
        'Amazon Resale': 'A2L77EE7U53NWQ',
        'Amazon.com Services LLC': 'A3ODHND3J0WMC8',
    };

    const REVERSE_ID_MAP = Object.fromEntries(
        Object.entries(ID_MAP).map(([key, value]) => [value, key]),
    );
    const OPTIONS = Object.keys(ID_MAP);

    // --- State Management ---
    const state = {
        selectedFilters: [],
        currentUrl: '',
        observer: null,
        uiInitialized: false,
    };

    // --- Core Logic ---

    function applyFilters() {
        const baseUrl = isOnCategoryPage()
            ? buildSearchUrlFromCategory()
            : location.href;
        const url = new URL(baseUrl);
        const params = url.searchParams;

        const otherRhParams = (params.get('rh') || '')
            .split(',')
            .filter(p => p && !p.startsWith('p_6:'));

        if (state.selectedFilters.length > 0) {
            const sellerIds = state.selectedFilters
                .map(label => ID_MAP[label])
                .join('%7C');
            otherRhParams.push(`p_6:${sellerIds}`);
            params.set('rh', otherRhParams.join(','));
        } else {
            if (otherRhParams.length > 0) {
                params.set('rh', otherRhParams.join(','));
            } else {
                params.delete('rh');
            }
        }

        if (url.href !== location.href) {
            window.location.href = url.href;
        }
    }

    function initializeStateFromURL() {
        const url = new URL(location.href);
        const rh = url.searchParams.get('rh') || '';
        const sellerFilter = rh.split(',').find(p => p.startsWith('p_6:'));

        if (sellerFilter) {
            const sellerIds = sellerFilter.substring(4).split(/\||%7C/);
            state.selectedFilters = sellerIds
                .map(id => REVERSE_ID_MAP[id])
                .filter(Boolean);
        } else {
            state.selectedFilters = [];
        }
        state.currentUrl = location.href;
        state.uiInitialized = false;
    }

    // --- UI Creation ---

    function createUI() {
        if (state.uiInitialized) return;

        const sidebar = findSidebar();
        if (sidebar) {
            const filterContainer =
                sidebar.querySelector('#filter-p_6') || sidebar;
            buildNativeUI(filterContainer);
        } else if (isOnCategoryPage()) {
            createFloatingWidget();
        }
    }

    function buildNativeUI(container) {
        OPTIONS.forEach(label =>
            document.getElementById(`p_6/${ID_MAP[label]}`)?.remove(),
        );

        const fragment = document.createDocumentFragment();
        OPTIONS.slice().forEach(label => {
            fragment.appendChild(createCheckboxListItem(label));
        });
        container.prepend(fragment);

        const sellerBlock = container.closest('div[id*="p_6"]');
        sellerBlock?.parentElement?.prepend(sellerBlock);

        updateCheckboxes();
        state.uiInitialized = true;
    }

    function createFloatingWidget() {
        document.getElementById('amazon-seller-filter-widget')?.remove();

        const widget = document.createElement('div');
        widget.id = 'amazon-seller-filter-widget';
        Object.assign(widget.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '15px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: '1001',
            fontFamily: 'Amazon Ember, Arial, sans-serif',
            fontSize: '14px',
        });

        widget.innerHTML = `<h3 style="margin: 0 0 10px; font-size: 16px; font-weight: bold;">Filter by Seller</h3>`;
        const ul = document.createElement('ul');
        ul.style.cssText = 'list-style: none; padding: 0; margin: 0;';

        OPTIONS.forEach(label =>
            ul.appendChild(createCheckboxListItem(label, true)),
        );

        widget.appendChild(ul);
        document.body.appendChild(widget);
        updateCheckboxes();
        state.uiInitialized = true;
    }

    function createCheckboxListItem(label, isWidget = false) {
        const li = document.createElement('li');
        li.id = `p_6/${ID_MAP[label]}`;

        if (isWidget) {
            li.innerHTML = `
                <label style="display: flex; align-items: center; cursor: pointer; margin: 8px 0;">
                    <input type="checkbox" data-label="${label}" style="margin-right: 8px;">
                    <span>${label}</span>
                </label>`;
        } else {
            li.className = 'a-list-item a-spacing-micro';
            li.innerHTML = `
                <a class="a-link-normal s-navigation-item" href="#">
                    <div class="a-checkbox a-checkbox-fancy s-navigation-checkbox aok-float-left">
                        <label><input type="checkbox" data-label="${label}"><i class="a-icon a-icon-checkbox"></i></label>
                    </div>
                    <span class="a-size-base a-color-base">${label}</span>
                </a>`;
        }

        const checkbox = li.querySelector('input[type=checkbox]');
        const clickableArea =
            li.querySelector('a') || li.querySelector('label');

        const handleChange = e => {
            e.preventDefault();
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            const idx = state.selectedFilters.indexOf(label);

            if (checkbox.checked && idx === -1) {
                state.selectedFilters.push(label);
            } else if (!checkbox.checked && idx !== -1) {
                state.selectedFilters.splice(idx, 1);
            }
            applyFilters();
        };

        clickableArea.addEventListener('click', handleChange);
        return li;
    }

    function updateCheckboxes() {
        OPTIONS.forEach(label => {
            const checkbox = document.querySelector(
                `input[data-label="${label}"]`,
            );
            if (checkbox) {
                checkbox.checked = state.selectedFilters.includes(label);
            }
        });
    }

    // --- Page Data & Helpers ---

    /**
     * Correctly identifies category pages, including path /b and /b/
     */
    const isOnCategoryPage = () =>
        location.pathname === '/b' || location.pathname.startsWith('/b/');

    function findSidebar() {
        const selectors = [
            '#s-refinements',
            '#leftNav',
            '#departments',
            'div[data-csa-c-slot-id="left-nav"]',
        ];
        return (
            selectors.map(s => document.querySelector(s)).find(el => el) || null
        );
    }

    /**
     * Builds a search URL from a category page, now with better data extraction.
     */
    function buildSearchUrlFromCategory() {
        const {node, categoryName, searchAlias} = getCategoryPageData();
        const params = new URLSearchParams();

        // Prefer using the more specific search alias 'i' if found
        if (searchAlias) {
            params.set('i', searchAlias);
        } else {
            // Fallback to keyword 'k' if no alias is available
            params.set('k', categoryName);
        }

        // Always include the node in the 'rh' parameter if it exists
        if (node) {
            params.set('rh', `n:${node}`);
        }

        return `https://www.amazon.com/s?${params.toString()}`;
    }

    /**
     * Extracts page data, now including the search alias (e.g., 'i=tools').
     */
    function getCategoryPageData() {
        const node = new URL(location.href).searchParams.get('node');
        let categoryName = '';
        let searchAlias = '';

        // Attempt to get the specific search-alias from the department dropdown
        const searchDropdown = document.getElementById('searchDropdownBox');
        if (searchDropdown) {
            const selectedOption =
                searchDropdown.querySelector('option[selected]');
            if (selectedOption) {
                const aliasValue = selectedOption.value; // e.g., "search-alias=tools"
                if (aliasValue.startsWith('search-alias=')) {
                    searchAlias = aliasValue.split('=')[1];
                }
            }
        }

        // Fallback logic to get a display name for the category
        const selectors = [
            '.sg-col .a-color-state.a-text-bold',
            '#wayfinding-breadcrumbs_feature_div .a-link-normal:last-of-type',
            'h1, .a-size-large.a-spacing-none.a-color-base',
        ];
        categoryName =
            selectors
                .map(s =>
                    document
                        .querySelector(s)
                        ?.textContent.trim()
                        .replace(/"/g, ''),
                )
                .find(name => name) || '';

        if (!categoryName) {
            const title = document.title;
            if (title.includes('Amazon.com')) {
                categoryName = title
                    .split(' - ')[0]
                    .replace('Amazon.com: ', '')
                    .trim();
            }
        }

        return {node, categoryName: categoryName || 'Category', searchAlias};
    }

    // --- Initialization and Observation ---

    function handleCategoryPageRedirect() {
        // Only redirect on category pages that LACK a standard filter sidebar.
        if (isOnCategoryPage() && !findSidebar()) {
            const searchUrl = buildSearchUrlFromCategory();
            // Use replace to avoid polluting browser history with the redirect.
            window.location.replace(searchUrl);
            return true; // Indicates a redirect has started.
        }
        return false;
    }

    function reinitialize() {
        // If the page is a basic category page, redirect to a search page first.
        if (handleCategoryPageRedirect()) {
            return; // Stop execution to allow the redirect to happen.
        }

        document.getElementById('amazon-seller-filter-widget')?.remove();
        initializeStateFromURL();
        createUI();
    }

    function setupMutationObserver() {
        if (state.observer) state.observer.disconnect();
        const observerTarget =
            document.getElementById('a-page') || document.body;

        state.observer = new MutationObserver(mutations => {
            if (location.href !== state.currentUrl) {
                reinitialize();
                return;
            }
            if (!state.uiInitialized) {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        createUI();
                        if (state.uiInitialized) break;
                    }
                }
            }
        });

        state.observer.observe(observerTarget, {
            childList: true,
            subtree: true,
        });
    }

    // --- Script Entry Point ---

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            reinitialize();
            setupMutationObserver();
        });
    } else {
        reinitialize();
        setupMutationObserver();
    }

    window.addEventListener('popstate', () => setTimeout(reinitialize, 100));
})();
