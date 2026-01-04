// ==UserScript==
// @name         Reddit Layout Optimizer
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      1.0
// @description  A janky replacement for the Reddit Multi Column userscript until the author gets around to fixing it.
// @author       Stu Saddler
// @license      MIT
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523528/Reddit%20Layout%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/523528/Reddit%20Layout%20Optimizer.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    const MIN_WIDTH = 400;
    const COLUMNS = 4;
    let columns = COLUMNS;
    let cleanup = null;
    let parent = null;
    let postMap = new Map();

    let rafId = null;

    // Cache frequently accessed elements
    let cachedLeftSidebar = null;
    let cachedMainContent = null;
    let cachedRightSidebar = null;

    const cardIcon = () => document?.querySelector('shreddit-sort-dropdown[header-text="View"]')?.shadowRoot?.querySelector('svg');

    const shouldClean = (icon) => icon?.getAttribute('icon-name') !== "view-card-outline";

    const indexOfSmallest = (a) => a.reduce((lowest, value, index) => value < a[lowest] ? index : lowest, 0);

    const updateCachedSelectors = () => {
        // Update or initialize cached selectors
        cachedLeftSidebar = document.querySelector('reddit-sidebar-nav') || { offsetWidth: 271 };
        cachedMainContent = document.querySelector('main[id="main-content"]') ||
                            document.querySelector('div[data-testid="content"]');
        cachedRightSidebar = document.getElementById("right-sidebar-container");
    };

    const makeLayout = () => {
        if (cleanup || !parent) return;

        try {
            // Update cached selectors each layout cycle in case DOM structure changes
            updateCachedSelectors();

            const leftSidebarWidth = cachedLeftSidebar.offsetWidth || 271;
            const availableWidth = window.innerWidth - leftSidebarWidth - 50;
            const effectiveWidth = Math.max(availableWidth, MIN_WIDTH * COLUMNS);

            if (cachedMainContent) {
                cachedMainContent.style.maxWidth = '100%';
                cachedMainContent.style.marginLeft = `${leftSidebarWidth}px`;
            }

            document.querySelector("div.subgrid-container")?.classList.remove("m:w-[1120px]");
            if (cachedRightSidebar) {
                cachedRightSidebar.style.display = "none";
            }

            parent.style.position = "relative";

            const cols = Math.max(Math.floor(effectiveWidth / MIN_WIDTH), COLUMNS);
            columns = cols;
            const WIDTH = Math.floor((effectiveWidth / cols) - 20);

            const nodes = [...parent.querySelectorAll("article, faceplate-partial")];
            nodes.forEach(article => {
                const key = article.ariaLabel;
                if (!key) return;

                if (postMap.has(key)) {
                    const post = postMap.get(key);
                    if (post.height !== article.offsetHeight) {
                        post.height = article.offsetHeight;
                    }
                } else {
                    postMap.set(key, {height: article.offsetHeight, col: 0, top: 0});
                }
            });

            let tops = Array(columns).fill(0);
            postMap.forEach(post => {
                post.col = indexOfSmallest(tops);
                post.top = tops[post.col];
                tops[post.col] += post.height;
            });

            parent.style.height = Math.max(...tops) + 500 + "px";

            nodes.forEach(article => {
                const key = article.ariaLabel;
                const {col, top} = postMap.get(key) || {col: 0, top: 0};

                article.style.cssText = cleanup ? "" :
                    `position:absolute; width:${WIDTH}px; top:${top}px; left:${col * (WIDTH + 20)}px`;
            });

        } catch (error) {
            console.error('Layout Error:', error);
        }
    };

    const requestLayout = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(makeLayout);
    };

    const setLayout = () => {
        const c = shouldClean(cardIcon());
        if (c !== cleanup) {
            cleanup = c;
            window.requestAnimationFrame(makeLayout);
        }
    };

    const pageChange = new MutationObserver(requestLayout);
    window.addEventListener('resize', requestLayout);
    window.addEventListener('scrollend', requestLayout);
    const layoutSwitch = new MutationObserver(setLayout);

    const watch = () => {
        postMap = new Map();
        parent = document.querySelector("article + hr + faceplate-partial")?.parentNode;
        if (!parent) return;

        pageChange.observe(parent, {childList: true});
        const timeout = setTimeout(() => {
            const icon = cardIcon();
            if (icon) {
                clearTimeout(timeout);
                layoutSwitch.observe(icon, {attributes: true});
            }
        });
        requestLayout();
    };

    const apply = new MutationObserver(watch);
    const app = document.querySelector("shreddit-app");
    if (app) {
        apply.observe(app, {attributes: true});
    }
    watch();
})();
