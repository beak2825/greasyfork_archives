// ==UserScript==
// @name         Dreamwidth New Comment Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlight new comments in a Dreamwidth comment thread
// @author       conroicht
// @match        *://*.dreamwidth.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425997/Dreamwidth%20New%20Comment%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/425997/Dreamwidth%20New%20Comment%20Highlighter.meta.js
// ==/UserScript==

/* jshint esversion:8 */

(function() {
    'use strict';

    const DEFAULT_HIGHLIGHT_BG = 'green';
    const DEFAULT_HIGHLIGHT_TEXT = 'white';

    const BG_KEY_NAME = 'hightlight_bg';
    const TEXT_KEY_NAME = 'hightlight_text';

    const BASE_KEY_NAME = 'commentHighlighter';
    const STAMP_LIFE_IN_DAYS = 3;

    const SEARCH_KEYS = ['page', 'thread', 'view'];


    GM_registerMenuCommand('Set background color', async () => {
        const colour = prompt('Set the highlight background color');
        if (colour) {
            await GM.setValue(BG_KEY_NAME, colour);
        }
    });

    GM_registerMenuCommand('Set text color', async () => {
        const colour = prompt('Set highlight text color');
        if (colour) {
            await GM.setValue(TEXT_KEY_NAME, colour);
        }
    });

    async function setColorDefaults() {
        const background = await GM.getValue(BG_KEY_NAME);
        const text = await GM.getValue(TEXT_KEY_NAME);

        if (!background) {
            await GM.setValue(BG_KEY_NAME, DEFAULT_HIGHLIGHT_BG);
        }

        if (!text) {
            await GM.setValue(TEXT_KEY_NAME, DEFAULT_HIGHLIGHT_TEXT);
        }
    }

    async function clearOldStamps() {
        const msInOneDay = 86400000;
        const oldestAllowableDate = new Date() - (STAMP_LIFE_IN_DAYS * msInOneDay);

        const currentStoredKeys = await GM.listValues();
        const stampKeys = currentStoredKeys.filter(key => key.includes(BASE_KEY_NAME));

        return Promise.all(stampKeys.map(async (keyName) => {
            const timestamp = await GM.getValue(keyName);
            const date = new Date(timestamp);
            if (date < oldestAllowableDate) {
                await GM.deleteValue(keyName);
            }
        }));
    }

    function getMilitaryTime(time, period) {
        const [hours, minutes] = time.split(':');
        const hoursAsInteger = Number.parseInt(hours, 10);
        if (period === 'pm' && hoursAsInteger !== 12) return `${hoursAsInteger + 12}:${minutes}`;
        if (period === 'am' && hoursAsInteger == 12) return `00:${minutes}`;
        return time;
    }

    function parseDateFromTimestamp(stamp) {
        const [date, time, period] = stamp.split(' ');
        return new Date(`${date}T${getMilitaryTime(time, period)}Z`);
    }

    function getTimestamps(rootNode = document) {
        return Array.from(rootNode.querySelectorAll('.comment .datetime'))
            .map((element) => ({ element, date: parseDateFromTimestamp(element.lastElementChild.textContent) }));
    }

    function getUrlSearchAsObject(search) {
        return search.replace('?', '').split('&').reduce((searches, searchString) => {
            const [key, value] = searchString.split('=');
            searches[key] = value;
            return searches;
        }, Object.create(null));
    }

    function getThreadKey() {
        const { pathname, search } = window.location;
        const searchKeyPairs = getUrlSearchAsObject(search === '?page=1' ? '' : search);

        const searchStringForThreadKey = SEARCH_KEYS.reduce((keyString, key) => {
            if (searchKeyPairs[key]) {
                return `${keyString}&${key}=${searchKeyPairs[key]}`;
            }
            return keyString;
        }, '');

        return `${BASE_KEY_NAME}${pathname}${searchStringForThreadKey}`;
    }

    function saveLastRefresh() {
        const now = new Date();
        return GM.setValue(getThreadKey(), now.toISOString());
    }

    async function getLastRefresh() {
        const lastRefreshTime = await GM.getValue(getThreadKey());
        return lastRefreshTime ? new Date(lastRefreshTime) : null;
    }

    async function highlightComments(lastRefresh, rootNode = document) {
        const color = await GM.getValue(TEXT_KEY_NAME);
        const background = await GM.getValue(BG_KEY_NAME);
        getTimestamps(rootNode).forEach(({ element, date }) => {
            if (date > lastRefresh) {
                element.setAttribute('style', `color:${color};background:${background};`);
                element.textContent += ' NEW';
            }
        });
    }

    (async function run() {
        await setColorDefaults();
        const lastRefresh = await getLastRefresh();

        if (lastRefresh) {
            await highlightComments(lastRefresh);
            const observer = new MutationObserver((records) => {
                records.forEach((record) => {
                    record.addedNodes.forEach(async (node) => {
                        if (node.querySelector) {
                            await highlightComments(lastRefresh, node);
                        }
                    });
                });
            });
            observer.observe(document.querySelector('#comments'), { subtree: true, childList: true });
        }
        await clearOldStamps();
        await saveLastRefresh();
    })();
})();