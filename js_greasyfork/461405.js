// ==UserScript==
// @name            AniList Status Filter
// @namespace       https://github.com/SlashNephy
// @version         0.1.2
// @author          SlashNephy
// @description     Filter anime by your status on AniList search page.
// @description:ja  AniListの作品検索ページ内で自分の視聴ステータスでフィルターできるようにします。
// @homepage        https://scrapbox.io/slashnephy/AniList_%E3%81%A7%E8%87%AA%E5%88%86%E3%81%AE%E8%A6%96%E8%81%B4%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%81%AB%E5%BF%9C%E3%81%98%E3%81%A6%E4%BD%9C%E5%93%81%E3%82%92%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AniList_%E3%81%A7%E8%87%AA%E5%88%86%E3%81%AE%E8%A6%96%E8%81%B4%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%81%AB%E5%BF%9C%E3%81%98%E3%81%A6%E4%BD%9C%E5%93%81%E3%82%92%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC%E3%81%99%E3%82%8B_UserScript
// @icon            https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://anilist.co/*
// @grant           none
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/461405/AniList%20Status%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/461405/AniList%20Status%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    document.head.appendChild(style);
    const hiddenStatuses = {
        Watching: false,
        Reading: false,
        Completed: false,
        Planning: false,
        Paused: false,
        Dropped: false,
    };
    const renderCheckbox = (title, onClick) => {
        const box = document.createElement('div');
        box.classList.add('filter', 'checkbox-wrap');
        box.toggleAttribute('data-v-acf5fe42');
        {
            const wrapper = document.createElement('div');
            wrapper.classList.add('checkbox-wrap');
            wrapper.toggleAttribute('data-v-acf5fe42');
            wrapper.toggleAttribute('data-v-32107ecb');
            wrapper.addEventListener('click', onClick);
            box.appendChild(wrapper);
            {
                const checkbox = document.createElement('div');
                checkbox.classList.add('checkbox');
                checkbox.toggleAttribute('data-v-32107ecb');
                wrapper.appendChild(checkbox);
                {
                    const check = document.createElement('div');
                    check.classList.add('check');
                    check.toggleAttribute('data-v-32107ecb');
                    checkbox.appendChild(check);
                }
            }
            {
                const label = document.createElement('div');
                label.classList.add('label');
                label.toggleAttribute('data-v-32107ecb');
                label.textContent = title;
                wrapper.appendChild(label);
            }
        }
        return box;
    };
    const renderCss = () => {
        const statuses = Object.entries(hiddenStatuses)
            .filter(([_, hide]) => hide)
            .map(([key, _]) => key);
        if (statuses.length === 0) {
            return '';
        }
        const selectors = statuses.map((s) => `.media-card:has(> a div[status="${s}"])`).join(',');
        return `${selectors} { display: none; }`;
    };
    const renderFilters = (children) => {
        const filters = document.createElement('div');
        {
            const name = document.createElement('div');
            name.classList.add('name');
            name.toggleAttribute('data-v-84c4e64c');
            name.textContent = 'my status';
            filters.appendChild(name);
        }
        {
            const wrapper = document.createElement('div');
            wrapper.classList.add('filters-wrap', 'checkbox');
            wrapper.toggleAttribute('data-v-acf5fe42');
            wrapper.append(...children);
            filters.appendChild(wrapper);
        }
        return filters;
    };
    const toggleCheckbox = (e, key) => {
        hiddenStatuses[key] = !hiddenStatuses[key];
        style.textContent = renderCss();
        const element = e.currentTarget;
        const check = element?.querySelector('.check');
        if (check === null || check === undefined) {
            return;
        }
        check.style.display = hiddenStatuses[key] ? 'none' : 'initial';
    };
    const detectCategory = () => {
        if (window.location.pathname.startsWith('/search/anime')) {
            return 'anime';
        }
        if (window.location.pathname.startsWith('/search/manga')) {
            return 'manga';
        }
        return null;
    };
    const attach = () => {
        const category = detectCategory();
        if (category === null) {
            return;
        }
        const extraFiltersWrap = document.querySelector('.extra-filters-wrap');
        const attribute = 'anilist-status-filter-attached';
        if (extraFiltersWrap === null || extraFiltersWrap.hasAttribute(attribute)) {
            return;
        }
        extraFiltersWrap.insertAdjacentElement('afterend', renderFilters([
            renderCheckbox(category === 'anime' ? 'Watching' : 'Reading', (e) => {
                switch (detectCategory()) {
                    case 'anime':
                        toggleCheckbox(e, 'Watching');
                        return;
                    case 'manga':
                        toggleCheckbox(e, 'Reading');
                }
            }),
            renderCheckbox('Completed', (e) => {
                toggleCheckbox(e, 'Completed');
            }),
            renderCheckbox('Planning', (e) => {
                toggleCheckbox(e, 'Planning');
            }),
            renderCheckbox('Paused', (e) => {
                toggleCheckbox(e, 'Paused');
            }),
            renderCheckbox('Dropped', (e) => {
                toggleCheckbox(e, 'Dropped');
            }),
        ]));
        extraFiltersWrap.toggleAttribute(attribute);
    };
    window.addEventListener('load', attach);
    window.addEventListener('click', attach);

})();
