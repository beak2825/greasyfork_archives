// ==UserScript==
// @name         Manhuagui helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Improve Manhuagui
// @author       You
// @match        https://www.manhuagui.com/update/*
// @match        https://www.manhuagui.com/comic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhuagui.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448387/Manhuagui%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448387/Manhuagui%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const appState = loadAppState();
    const appStateWatchers = [];
    var appStateIsDirty = false;
    var dirtyAppStateKeys = {};

    var scrollIsDirty = false;

    function loadAppState() {
        try {
            const value = localStorage.getItem('appState');
            return value ? JSON.parse(value) : {};
        } catch (e) {
            console.error(e);
            return {};
        }
    }

    function saveAppState() {
        if (!appStateIsDirty) return;

        localStorage.setItem('appState', JSON.stringify(appState));
        appStateIsDirty = false;
    }

    function getAppState(key) {
        return Array.isArray(key) ? key.map(k => getAppState(k)) : appState[key];
    }

    function setAppState(key, value) {
        if (value !== undefined) {
            appState[key] = value;
        } else {
            delete appState[key];
        }

        appStateIsDirty = true;
        requestAnimationFrame(() => saveAppState());

        dirtyAppStateKeys[key] = true;
        requestAnimationFrame(() => notifyAppStateWatchers());
    }

    function watchAppState(key, callback) {
        appStateWatchers.push({ key, callback });
        callback(getAppState(key));
    }

    function notifyAppStateWatchers() {
        if (!Object.entries(dirtyAppStateKeys).length) return;

        for (const watcher of appStateWatchers) {
            const isDirty = Array.isArray(watcher.key) ? watcher.key.some(k => dirtyAppStateKeys[k]) : dirtyAppStateKeys[watcher.key];
            if (!isDirty) continue;

            watcher.callback(getAppState(watcher.key));
        }

        dirtyAppStateKeys = {};
    }

    function notifyScroll() {
        if (!scrollIsDirty) return;

        window.dispatchEvent(new Event('scroll'));
        scrollIsDirty = false;
    }

    function scheduleNotifyScroll() {
        scrollIsDirty = true;
        requestAnimationFrame(() => notifyScroll());
    }

    function createStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .mhgh-item-menu button {
                padding: 0px 2px;
            }

            .mhgh-global-menu {
                padding: 2px;
                background: #fff;
            }

            .mhgh-global-menu button {
                padding: 0px 2px;
            }
        `;
        document.head.appendChild(style);
    }

    function createShowButton(container, title) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Show';
        button.onclick = () => setAppState(`item.${title}.state`, undefined);
        container.appendChild(button);

        watchAppState(`item.${title}.state`, state => {
            button.style.display = state == 'hidden' ? '' : 'none';
        });
    }

    function createHideButton(container, title) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Hide';
        button.onclick = () => setAppState(`item.${title}.state`, 'hidden');
        container.appendChild(button);

        watchAppState(`item.${title}.state`, state => {
            button.style.display = state === undefined || state == 'like' ? '' : 'none';
        });
    }

    function createLikeButton(container, title) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Like';
        button.onclick = () => setAppState(`item.${title}.state`, 'like');
        container.appendChild(button);

        watchAppState(`item.${title}.state`, state => {
            button.style.display = state != 'like' ? '' : 'none';
        });
    }

    function createItemMenu(container, title) {
        const div = document.createElement('div');
        div.className = 'mhgh-item-menu';
        div.style.position = 'absolute';
        div.style.top = 0;
        div.style.right = '26px';
        div.style.zIndex = 10;
        container.appendChild(div);

        createShowButton(div, title);
        createHideButton(div, title);
        createLikeButton(div, title);
    }

    function createItem(container) {
        const title = container.querySelector('a.cover').getAttribute('title');

        container.style.position = 'relative';

        createItemMenu(container, title);

        watchAppState([`item.${title}.state`, 'showAll'], ([state, showAll]) => {
            const hidden = state == 'hidden';
            const oldDisplay = container.style.display;
            container.style.display = showAll || !hidden ? '' : 'none';
            container.style.opacity = showAll && hidden ? .5 : '';

            if (container.style.display != oldDisplay) {
                scheduleNotifyScroll();
            }
        });
    }

    function createBookCoverItem(container) {
        const title = container.querySelector('img').getAttribute('alt');

        container.style.position = 'relative';

        createItemMenu(container, title);
    }

    function createShowAllButton(container) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Show all';
        button.onclick = () => setAppState(`showAll`, '1');
        container.appendChild(button);

        watchAppState('showAll', showAll => {
            button.style.display = showAll ? 'none' : '';
        });
    }

    function createHideUnwantedButton(container) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Hide unwanted';
        button.onclick = () => setAppState(`showAll`, undefined);
        container.appendChild(button);

        watchAppState('showAll', showAll => {
            button.style.display = showAll ? '' : 'none';
        });
    }

    function createGlobalMenu(container) {
        const div = document.createElement('div');
        div.className = 'mhgh-global-menu';
        div.style.position = 'fixed';
        div.style.bottom = 0;
        div.style.right = '10px';
        div.style.zIndex = 100;
        container.appendChild(div);

        createShowAllButton(div);
        createHideUnwantedButton(div);
    }

    createStyle();

    document.querySelectorAll('.latest-list li').forEach(e => createItem(e));
    document.querySelectorAll('.book-cover.fl').forEach(e => createBookCoverItem(e));
    createGlobalMenu(document.body);
})();