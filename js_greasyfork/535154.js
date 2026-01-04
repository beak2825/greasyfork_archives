// ==UserScript==
// @name         YouTube Subscriptions Tab Filter - Advanced (with Members Only)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Advanced filter for YouTube Subscriptions with Tabs and filters for Uploads, Live, Upcoming, Shorts, Members Only, and All.
// @author       ChatGPT
// @license      MIT
// @include      *://*.youtube.com/**
// @exclude      *://*.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535154/YouTube%20Subscriptions%20Tab%20Filter%20-%20Advanced%20%28with%20Members%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535154/YouTube%20Subscriptions%20Tab%20Filter%20-%20Advanced%20%28with%20Members%20Only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ALL_TABS = ['Uploads', 'Live', 'Upcoming', 'Shorts', 'Members Only', 'All'];
    let enabledTabs = JSON.parse(localStorage.getItem('yt_sub_filter_tabs_enabled') || JSON.stringify(ALL_TABS));
    let lastTab = 'Uploads'; // Default to "Uploads" tab
    let debounceTimeout;
    let isFiltering = false;

    const waitForGrid = setInterval(() => {
        const grid = document.querySelector('ytd-rich-grid-renderer');
        if (grid && document.querySelectorAll('ytd-rich-item-renderer').length > 0) {
            clearInterval(waitForGrid);
            createConfigBar();
            createTabBar();
            filterVideos(lastTab);
            observeGridChanges();
        }
    }, 500);

    function createTabBar() {
        const container = document.querySelector('ytd-rich-grid-renderer');
        if (!container) return;

        const tabBar = document.createElement('div');
        tabBar.id = 'yt-tab-filter-bar';
        tabBar.style.display = 'flex';
        tabBar.style.gap = '10px';
        tabBar.style.margin = '10px 10px 0 10px';
        tabBar.style.flexWrap = 'wrap';

        enabledTabs.forEach(tabName => {
            const btn = document.createElement('button');
            btn.textContent = tabName;
            btn.style.padding = '5px 10px';
            btn.style.cursor = 'pointer';
            btn.style.border = '1px solid #aaa';
            btn.style.background = '#eee';
            btn.style.borderRadius = '4px';
            btn.style.fontWeight = tabName === lastTab ? 'bold' : 'normal';

            btn.onclick = () => {
                document.querySelectorAll('#yt-tab-filter-bar button').forEach(b => b.style.fontWeight = 'normal');
                btn.style.fontWeight = 'bold';
                lastTab = tabName;
                filterVideos(tabName);
            };

            tabBar.appendChild(btn);
        });

        container.parentElement.insertBefore(tabBar, container);
    }

    function createConfigBar() {
        const container = document.querySelector('ytd-rich-grid-renderer');
        if (!container) return;

        const configBar = document.createElement('div');
        configBar.style.margin = '10px';
        configBar.style.display = 'flex';
        configBar.style.flexWrap = 'wrap';
        configBar.style.gap = '8px';

        const label = document.createElement('span');
        label.textContent = 'Enable Tabs: ';
        configBar.appendChild(label);

        ALL_TABS.forEach(tab => {
            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = enabledTabs.includes(tab);
            toggle.id = `toggle-${tab}`;
            toggle.onchange = () => {
                if (toggle.checked) {
                    if (!enabledTabs.includes(tab)) enabledTabs.push(tab);
                } else {
                    enabledTabs = enabledTabs.filter(t => t !== tab);
                    if (lastTab === tab) lastTab = 'Uploads';
                }
                localStorage.setItem('yt_sub_filter_tabs_enabled', JSON.stringify(enabledTabs));
                document.querySelector('#yt-tab-filter-bar')?.remove();
                createTabBar();
                filterVideos(lastTab);
            };

            const lbl = document.createElement('label');
            lbl.textContent = tab;
            lbl.style.marginRight = '10px';
            lbl.style.userSelect = 'none';
            lbl.htmlFor = toggle.id;

            configBar.appendChild(toggle);
            configBar.appendChild(lbl);
        });

        container.parentElement.insertBefore(configBar, container);
    }

    function filterVideos(filter) {
        if (isFiltering) return;
        isFiltering = true;

        const items = document.querySelectorAll('ytd-rich-item-renderer');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const hasNotify = item.querySelector('span.yt-core-attributed-string--white-space-no-wrap')?.textContent.includes('Notify me');
            const isLive = /\blive\b/.test(text); // Only match 'live' as a whole word
            const isUpcoming = !!hasNotify;
            const isShort = text.includes('#shorts') || isLikelyShort(item);
            const isMembers = text.includes('members only');

            let show = false;

            if (!enabledTabs.includes(filter)) {
                show = true; // If the tab is disabled, show all items
            } else {
                switch (filter) {
                    case 'All':
                        show = true;
                        break;
                    case 'Uploads':
                        show = !isLive && !isUpcoming && !isShort && !isMembers;
                        break;
                    case 'Live':
                        show = isLive;
                        break;
                    case 'Upcoming':
                        show = isUpcoming && !isLive && !isShort && !isMembers;
                        break;
                    case 'Shorts':
                        show = isShort;
                        break;
                    case 'Members Only':
                        show = isMembers;
                        break;
                }
            }

            item.style.display = show ? '' : 'none';
        });

        isFiltering = false;
    }

    function isLikelyShort(item) {
        const durationLabel = item.querySelector('span.ytd-thumbnail-overlay-time-status-renderer');
        if (durationLabel) {
            const duration = durationLabel.textContent.trim();
            const parts = duration.split(':').map(Number);
            let seconds = 0;
            if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
            else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            return seconds > 0 && seconds < 60;
        }
        return false;
    }

    function observeGridChanges() {
        const grid = document.querySelector('ytd-rich-grid-renderer #contents');
        if (!grid) return;

        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                filterVideos(lastTab);
            }, 300); // Delay filtering until scrolling stops
        });

        observer.observe(grid, { childList: true, subtree: true });
    }
})();
