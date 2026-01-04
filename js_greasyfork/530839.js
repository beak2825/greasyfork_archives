// ==UserScript==
// @name         Reddit Multi-Column BETA
// @description  Creates a multi-column layout for Reddit.com and removes promoted posts
// @version      2.0
// @icon         https://i.ibb.co/8LcPH83W/reddit.png
// @author       Stuart Saddler
// @match        *://*reddit.com/*
// @exclude      *://*reddit.com/user/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/567951
// @downloadURL https://update.greasyfork.org/scripts/530839/Reddit%20Multi-Column%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/530839/Reddit%20Multi-Column%20BETA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------
    // Performance Optimization Cache
    // -------------------------------
    const cachedElements = new Map();

    function getCachedElement(selector) {
        if (!cachedElements.has(selector)) {
            cachedElements.set(selector, document.querySelector(selector));
        }
        return cachedElements.get(selector);
    }

    function clearElementCache() {
        cachedElements.clear();
    }

    // -------------------------------
    // Promoted Post Removal Functions
    // -------------------------------
    function removeChild(target) {
        try {
            var node = target;
            while (node != null && !node.matches("[data-testid=post-container],[data-scroller-first],[role=presentation]") && document !== node.parentNode) {
                node = node.parentNode;
            }
            if (node) {
                if (node.style.display != "none") {
                    node.style.display = "none";
                }
            }
        } catch (error) {
            console.error('Error in removeChild:', error);
        }
    }

    function removePromoted() {
        try {
            Array.prototype
                .filter.call(document.getElementsByTagName("span"),
                             (x => x.textContent == "promoted" && x.style.color !== undefined))
                .forEach(x => removeChild(x));
            Array.prototype.forEach.call(document.getElementsByTagName("shreddit-ad-post"), x => x.parentNode?.removeChild(x));
            Array.prototype.forEach.call(document.getElementsByTagName("shreddit-comments-page-ad"), x => x.parentNode?.removeChild(x));
            Array.prototype.forEach.call(document.getElementsByTagName("shreddit-sidebar-ad"), x => x.parentNode?.removeChild(x));
            Array.prototype.forEach.call(document.getElementsByTagName("embed-snippet-share-button"), x => { x.style.display = 'none'; });
        } catch (error) {
            console.error('Error in removePromoted:', error);
        }
    }

    // Initial removal call and observer for dynamic changes.
    removePromoted();
    const promotedConfig = { attributes: true, childList: true, subtree: true };
    const promotedCallback = (mutationList, observer) => {
        try {
            removePromoted();
        } catch (error) {
            console.error('Error in promotedCallback:', error);
        }
    };
    const promotedObserver = new MutationObserver(promotedCallback);
    promotedObserver.observe(document, promotedConfig);

    // -----------------------------------------
    // Exit early on user profile and comments page
    // -----------------------------------------
    if (window.location.pathname.startsWith("/user/")) {
        return;
    }
    const isCommentsPage = () => /\/r\/[^\/]+\/comments\//.test(window.location.href);
    if (isCommentsPage()) return;

    // ======================
    // Configuration Settings
    // ======================
    const CONFIG = {
        MIN_POST_WIDTH: 300,
        MAX_COLUMNS: 5,
        THROTTLE_DELAY: 100,
        WATCH_DELAY: 300,
        URL_CHECK_DELAY: 1000
    };

    // ==================
    // DOM Selectors Used
    // ==================
    const SELECTORS = {
        RIGHT_SIDEBAR: "#right-sidebar-container",
        SUBGRID: "#subgrid-container, div.subgrid-container",
        FEED_CONTAINER: 'shreddit-feed',
        MAIN_ELEMENT: 'main.main.w-full.min-w-0',
        VIEW_DROPDOWN: 'shreddit-sort-dropdown[header-text="View"]',
        EMPTY_BORDERS: "hr.border-0.border-b-sm.border-solid.border-b-neutral-border-weak",
        GRID_CONTAINER: 'div.main-container.fixed-sidebar, div.main-container.flex-sidebar'
    };

    // ====================================
    // Utility Functions for Element Access
    // ====================================
    function getElement(selector) {
        return getCachedElement(selector);
    }

    function getAllElements(selector) {
        return document.querySelectorAll(selector);
    }

    // =======================
    // Layout Adjustment Functions
    // =======================
    function adjustSubgrid() {
        try {
            const subgrid = getElement(SELECTORS.SUBGRID);
            if (subgrid) {
                subgrid.style.width = '100%';
                subgrid.style.maxWidth = '100%';
                subgrid.classList.remove('m:w-[1120px]');
                subgrid.style.margin = "0 auto";
            }
            const gridContainer = getElement(SELECTORS.GRID_CONTAINER);
            if (gridContainer) {
                gridContainer.style.gridTemplateColumns = '1fr auto';
                gridContainer.style.gap = '0px';
            }
        } catch (error) {
            console.error('Error in adjustSubgrid:', error);
        }
    }

    function adjustMain() {
        try {
            const mainEl = getElement(SELECTORS.MAIN_ELEMENT);
            if (mainEl) {
                mainEl.style.gridColumn = '1 / span 2';
                mainEl.style.width = 'auto';
                mainEl.style.maxWidth = 'none';
                mainEl.style.flexGrow = '1';
                mainEl.style.marginLeft = '0';
                mainEl.style.marginRight = '0';
            }
        } catch (error) {
            console.error('Error in adjustMain:', error);
        }
    }

    function hideRightSidebar() {
        try {
            const rightSidebar = getElement(SELECTORS.RIGHT_SIDEBAR);
            if (rightSidebar) {
                rightSidebar.style.display = "none";
            }
        } catch (error) {
            console.error('Error in hideRightSidebar:', error);
        }
    }

    function adjustLayout() {
        try {
            adjustSubgrid();
            adjustMain();
            hideRightSidebar();
        } catch (error) {
            console.error('Error in adjustLayout:', error);
        }
    }

    // ====================================
    // Variables and Helper Functions for Layout
    // ====================================
    let columns = CONFIG.MAX_COLUMNS;
    let cleanup = null;
    let postMap = new Map();

    // Throttle helper to reduce the rate of layout recalculations.
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Modified getParentContainer: try the usual containers, then fallback to the parent of the first post.
    function getParentContainer() {
        try {
            let container = getElement(SELECTORS.FEED_CONTAINER) || getElement(SELECTORS.SUBGRID);
            if (!container) {
                const firstArticle = document.querySelector("article");
                if (firstArticle && firstArticle.parentElement) {
                    container = firstArticle.parentElement;
                }
            }
            return container;
        } catch (error) {
            console.error('Error in getParentContainer:', error);
            return null;
        }
    }

    function calculateColumns(parent) {
        try {
            if (!parent) return CONFIG.MAX_COLUMNS;
            const containerWidth = parent.offsetWidth;
            const numColumns = Math.floor(containerWidth / CONFIG.MIN_POST_WIDTH);
            return Math.max(1, Math.min(CONFIG.MAX_COLUMNS, numColumns));
        } catch (error) {
            console.error('Error in calculateColumns:', error);
            return CONFIG.MAX_COLUMNS;
        }
    }

    // =====================================
    // Functions for Checking Layout Mode
    // =====================================
    const cardIcon = () => {
        try {
            const dropdown = getElement(SELECTORS.VIEW_DROPDOWN);
            if (dropdown && dropdown.shadowRoot) {
                return dropdown.shadowRoot.querySelector('svg');
            }
            return null;
        } catch (error) {
            console.error('Error in cardIcon:', error);
            return null;
        }
    };

    // We force multi-column layout so cleanup is always false.
    const shouldClean = (icon) =>
        icon ? icon.getAttribute('icon-name') !== "view-card-outline" : false;

    function indexOfSmallest(arr) {
        let lowest = 0;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[lowest]) {
                lowest = i;
            }
        }
        return lowest;
    }

    // =====================================
    // Layout Request and Rendering Functions
    // =====================================
    let layoutScheduled = false;
    const requestLayout = () => {
        if (window.location.pathname.startsWith("/user/")) return;
        if (isCommentsPage()) return;
        if (!layoutScheduled) {
            layoutScheduled = true;
            window.requestAnimationFrame(() => {
                safeMakeLayout();
                layoutScheduled = false;
            });
        }
    };

    function safeMakeLayout() {
        try {
            makeLayout();
        } catch (error) {
            console.error('Error in makeLayout:', error);
            // Optionally implement recovery logic
        }
    }

    function makeLayout() {
        if (isCommentsPage()) return;

        // Remove promoted posts before laying out content.
        removePromoted();

        // Force multi-column layout by bypassing the view check.
        cleanup = false;

        const parent = getParentContainer();
        if (!parent) return;

        adjustLayout();

        parent.style.width = '100%';
        parent.style.position = 'relative';
        parent.style.maxWidth = 'none';

        columns = calculateColumns(parent);
        const WIDTH = Math.floor((100 - columns) / columns);
        const tops = Array(columns).fill(0);

        const nodes = Array.from(parent.querySelectorAll("article, faceplate-partial"));

        // Use ariaLabel as a unique key; if missing, use a fallback.
        nodes.forEach((article, index) => {
            const key = article.ariaLabel || `mc_${index}`;
            if (postMap.has(key)) {
                let post = postMap.get(key);
                if (post.height !== article.offsetHeight) {
                    post.height = article.offsetHeight;
                }
            } else {
                postMap.set(key, { height: article.offsetHeight, col: 0, top: 0 });
            }
        });

        for (const post of postMap.values()) {
            post.col = indexOfSmallest(tops);
            post.top = tops[post.col];
            tops[post.col] += post.height;
        }

        const height = Math.max(...tops);
        if (height) {
            parent.style.height = (height + 500) + "px";
        }

        nodes.forEach((article, index) => {
            const key = article.ariaLabel || `mc_${index}`;
            const { col, top } = postMap.get(key) || { col: 0, top: tops[0] };
            article.setAttribute("style",
                cleanup ? "" : `position:absolute; width:${WIDTH}%; top:${top}px; left:${col * (WIDTH + 1)}%`);
        });

        getAllElements(SELECTORS.EMPTY_BORDERS).forEach(hr => {
            hr.style.display = "none";
        });

        // Remove any newly added promoted posts.
        removePromoted();
    }

    // -------------------------------------
    // Mutation Observer Callbacks
    // -------------------------------------
    const setLayout = (changes, observer) => {
        try {
            const c = shouldClean(cardIcon());
            if (c !== cleanup) {
                cleanup = c;
                requestLayout();
            }
        } catch (error) {
            console.error('Error in setLayout:', error);
        }
    };

    const pageChange = new MutationObserver(requestLayout);
    window.addEventListener('resize', throttle(requestLayout, CONFIG.THROTTLE_DELAY));
    window.addEventListener('scroll', throttle(requestLayout, CONFIG.THROTTLE_DELAY));
    const layoutSwitch = new MutationObserver(setLayout);

    window.addEventListener('hashchange', () => {
        postMap.clear();
        clearElementCache();
        watch();
    });

    window.addEventListener('popstate', () => {
        postMap.clear();
        clearElementCache();
        watch();
    });

    const dynamicObserver = new MutationObserver(() => {
        postMap.clear();
        clearElementCache();
        watch();
    });
    dynamicObserver.observe(document.body, { childList: true, subtree: true });

    // -------------------------------------
    // Initialize and Observe Layout Changes
    // -------------------------------------
    const watch = () => {
        if (window.location.pathname.startsWith("/user/")) return;
        if (isCommentsPage()) return;

        postMap = new Map();
        const parent = getParentContainer();
        if (!parent) return;

        pageChange.observe(parent, { childList: true, subtree: true });
        setTimeout(() => {
            const icon = cardIcon();
            if (icon !== null) {
                layoutSwitch.observe(icon, { attributes: true });
            }
        }, CONFIG.WATCH_DELAY);
        requestLayout();
    };

    watch();
    window.addEventListener('DOMContentLoaded', watch);

    const observer = new MutationObserver((mutations, obs) => {
        try {
            const parent = getParentContainer();
            if (parent) {
                adjustLayout();
                watch();
                obs.disconnect();
            }
        } catch (error) {
            console.error('Error in observer callback:', error);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        try {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(() => {
                    postMap.clear();
                    clearElementCache();
                    watch();
                }, CONFIG.URL_CHECK_DELAY);
            }
        } catch (error) {
            console.error('Error in urlObserver:', error);
        }
    });
    urlObserver.observe(document.body, { childList: true, subtree: true });
})();