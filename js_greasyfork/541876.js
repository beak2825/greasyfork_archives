// ==UserScript==
// @name         height resizer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  resize + search
// @author       Titanic_
// @match        https://www.torn.com/forums.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541876/height%20resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/541876/height%20resizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let observer = null;
    let processDebounce = null;

    function addGlobalStyle(css) {
        const head = document.head;
        if (!head) return;
        const styleId = 'forum_resizer_search_styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = styleId;
        style.innerHTML = css;
        head.appendChild(style);
    }

    function applyHeight(panel, index) {
        if (panel.dataset.heightResizerAttached) return;
        panel.dataset.heightResizerAttached = 'true';

        const savedHeight = localStorage.getItem(`panelHeight_${index}`);
        if (savedHeight) {
            panel.style.height = savedHeight;
        } else {
            const initialHeight = window.getComputedStyle(panel).height;
            panel.style.height = initialHeight;
            localStorage.setItem(`panelHeight_${index}`, initialHeight);
        }

        let lastHeight = panel.offsetHeight;
        const intervalId = setInterval(() => {
            if (!document.body.contains(panel)) {
                clearInterval(intervalId);
                return;
            }
            const currentHeight = panel.offsetHeight;
            if (currentHeight !== lastHeight && currentHeight > 0) {
                lastHeight = currentHeight;
                localStorage.setItem(`panelHeight_${index}`, currentHeight + 'px');
            }
        }, 500);
    }

    function filterThreadsInPanel(panel) {
        const searchInput = panel.querySelector('.thread-search-input');
        const counter = panel.querySelector('.thread-filter-counter');
        const list = panel.querySelector('ul.panel.fm-list');

        if (!searchInput || !counter || !list) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        const threads = list.querySelectorAll('li');
        let visibleCount = 0;
        let totalCount = threads.length;

        threads.forEach(li => {
            const title = li.querySelector('a')?.textContent || '';
            const subtext = li.querySelector('.qty')?.textContent || '';
            const searchableText = (title + ' ' + subtext).toLowerCase();
            const isMatch = searchableText.includes(searchTerm);

            if (isMatch) {
                li.classList.remove('is-filtered-out');
                visibleCount++;
            } else {
                li.classList.add('is-filtered-out');
            }
        });

        if (searchTerm) {
            counter.textContent = `Showing ${visibleCount} of ${totalCount}`;
            counter.style.display = 'inline';
        } else {
            counter.style.display = 'none';
        }
    }

    function addSearchFunctionality(panel) {
        if (panel.dataset.searchAttached) return;
        panel.dataset.searchAttached = 'true';

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search threads...';
        searchInput.className = 'thread-search-input';

        const counter = document.createElement('span');
        counter.className = 'thread-filter-counter';
        counter.style.display = 'none';

        searchInput.addEventListener('input', () => filterThreadsInPanel(panel));

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(counter);

        panel.prepend(searchContainer);
    }

    function processAllPanels() {
        const panels = document.querySelectorAll('.d .forums-main-wrap .panel-scrollbar');
        if (panels.length === 0) return;

        panels.forEach((panel, index) => {
            applyHeight(panel, index);
            addSearchFunctionality(panel);
            filterThreadsInPanel(panel);
        });
    }

    function observe() {
        const target = document.querySelector('.d .forums-main-wrap');
        if (!target || observer) return;

        observer = new MutationObserver(() => {
            clearTimeout(processDebounce);
            processDebounce = setTimeout(processAllPanels, 300);
        });
        observer.observe(target, { childList: true, subtree: true });
    }

    function disconnectObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    function isMainPage() {
        const hash = window.location.hash;
        return hash === '#/p=main' || hash === '' || hash === '#';
    }

    function init() {
        disconnectObserver();
        if (!isMainPage()) return;

        setTimeout(() => {
            processAllPanels();
            observe();
        }, 500);
    }

    addGlobalStyle(`
        .d .forums-main-wrap .panel-scrollbar {
            resize: vertical;
            overflow: auto !important;
            max-height: 80vh !important;
            display: flex;
            flex-direction: column;
        }
        .search-container {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            padding: 0 8px;
            border-bottom: 1px solid rgba(127, 127, 127, 0.25);
            background-color: rgba(0, 0, 0, 0.02);
        }
        .thread-search-input {
            flex: 1;
            min-width: 0;
            border: none;
            outline: none;
            background-color: transparent;
            color: inherit;
            font-size: 12px;
            padding: 4px 0;
            height: 3px !important;
        }
        .thread-filter-counter {
            flex-shrink: 0;
            font-size: 11px;
            color: inherit;
            opacity: 0.7;
            padding-left: 8px;
            white-space: nowrap;
        }
        .is-filtered-out {
            display: none !important;
        }
    `);

    window.addEventListener('hashchange', init, { passive: true });
    init();
})();