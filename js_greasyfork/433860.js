// ==UserScript==
// @name         YT Feed Sorter
// @namespace    YTFeedSorter
// @version      0.7.5
// @description  Sorts the YouTube feed so that all scheduled streams and premieres come before archived videos.
// @match        *://*.youtube.com/*
// @grant        none
// @author       KFP
// @downloadURL https://update.greasyfork.org/scripts/433860/YT%20Feed%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/433860/YT%20Feed%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const interceptFeedUpdate = () => {
        const {fetch: origFetch} = window;
        window.fetch = async (...args) => {
            const url = args[0].url
            const response = await origFetch(...args);
            response.clone().json().then(data => {
                if (url.match('/browse?')) {
                    if (data.contents?.twoColumnBrowseResultsRenderer) {
                        if (!ytInitialData.contents) ytInitialData.contents = {};
                        ytInitialData.contents.twoColumnBrowseResultsRenderer = data.contents.twoColumnBrowseResultsRenderer;
                    } else if (data.onResponseReceivedActions?.[0]?.appendContinuationItemsAction?.continuationItems) {
                        const added = data.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems;
                        const exists = ytInitialData.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content;
                        if (exists?.richGridRenderer) {
                            exists.richGridRenderer.contents = exists.richGridRenderer.contents.concat(added);
                        } else if (exists?.sectionListRenderer) {
                            exists.sectionListRenderer.contents = exists.sectionListRenderer.contents.concat(added);
                        }
                    }
                }
            }).catch(e => console.error(e));
            return response;
        };
    };

    const getItemsData = isList => {
        try {
            const data = {};
            if (isList) {
                const allItemsData = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;
                allItemsData.forEach(i => {
                    const itemData = i.itemSectionRenderer?.contents[0].shelfRenderer?.content.expandedShelfContentsRenderer.items[0].videoRenderer;
                    if (itemData) data[itemData.videoId] = itemData;
                });
            } else {
                const allItemsData = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.contents.filter(i => !!i.richItemRenderer);
                allItemsData.forEach(i => {
                    const itemData = i.richItemRenderer?.content.videoRenderer;
                    if (itemData) data[itemData.videoId] = itemData
                });
            }
            return data;
        } catch(e) {
            return null;
        }
    };

    const isSorted = isList => {
        const itemSelector = isList ? 'ytd-browse[role="main"] ytd-section-list-renderer ytd-item-section-renderer' : 'ytd-browse[role="main"] ytd-rich-item-renderer';
        const soonSelector = isList ? ' ytd-expanded-shelf-contents-renderer yt-touch-feedback-shape' : ' yt-touch-feedback-shape';
        const soonCounter = document.querySelectorAll(itemSelector + soonSelector).length;
        const allItems = document.querySelectorAll(itemSelector);
        let lastType = 0;
        let soonFound = 0;
        for (let item of allItems) {
            const notItem = item.querySelector('#title-container.style-scope.ytd-reel-shelf-renderer');
            const isShort = item.closest('ytd-rich-section-renderer');
            if (notItem || isShort) continue;
            const live = item.querySelector('.badge-style-type-live-now-alternate');
            const soon = item.querySelector('yt-touch-feedback-shape');
            const type = live ? 0 : soon ? 1 : 2;
            if (type >= lastType) lastType = type;
            else return false;
            if (soon) {
                if (++soonFound >= soonCounter) break;
            }
        }
        return true;
    };

    const sortOrder = (a, b, itemsData) => {
        const aLive = a.querySelector('.badge-style-type-live-now-alternate');
        const aSoon = a.querySelector('yt-touch-feedback-shape');
        const bLive = b.querySelector('.badge-style-type-live-now-alternate');
        const bSoon = b.querySelector('yt-touch-feedback-shape');
        if (itemsData && aSoon && bSoon) {
            const aId = a.querySelector('A#thumbnail').href.match(/[A-Za-z0-9_\-]{11}/gi);
            const bId = b.querySelector('A#thumbnail').href.match(/[A-Za-z0-9_\-]{11}/gi);
            if (!itemsData[aId]?.upcomingEventData || !itemsData[bId]?.upcomingEventData) return 0;
            const aTime = itemsData[aId].upcomingEventData.startTime + aId;
            const bTime = itemsData[bId].upcomingEventData.startTime + bId;
            return (aTime > bTime) ? 1 : -1;
        } else {
            const ai = aLive ? 0 : aSoon ? 1 : 2;
            const bi = bLive ? 0 : bSoon ? 1 : 2;
            return (ai < bi) ? -1 : (ai > bi) ? 1 : 0;
        }
    };

    const sortFeed = (feed, isList) => {
        const itemsData = getItemsData(isList);
        try {
            if (isList) {
                const firtsHeader = feed.children[0].querySelector('#title-container')
                const manageBtn = firtsHeader.querySelector('#subscribe-button');
                const layoutBtn = firtsHeader.querySelector('#menu');
                [...feed.children].sort((a, b) => {
                    const aNotItem = (a.tagName.toLowerCase() !== 'ytd-item-section-renderer') || a.querySelector('#title-container.style-scope.ytd-reel-shelf-renderer');
                    const bNotItem = (b.tagName.toLowerCase() !== 'ytd-item-section-renderer') || b.querySelector('#title-container.style-scope.ytd-reel-shelf-renderer');
                    if (aNotItem || bNotItem) return aNotItem ? 1 : -1;
                    else return sortOrder(a, b, itemsData);
                }).forEach(item => feed.appendChild(item));
                const newFirtsHeader = feed.children[0].querySelector('#title-container')
                const newManageBtn = newFirtsHeader.querySelector('#subscribe-button');
                const newLayoutBtn = newFirtsHeader.querySelector('#menu');
                newFirtsHeader.appendChild(manageBtn);
                newFirtsHeader.appendChild(layoutBtn);
                firtsHeader.appendChild(newManageBtn);
                firtsHeader.appendChild(newLayoutBtn);
            } else {
                let itemWpappers = feed.querySelectorAll('ytd-rich-item-renderer');
                let items = feed.querySelectorAll('ytd-rich-item-renderer > #content');
                itemWpappers = [...itemWpappers].filter(el => !el.closest('ytd-rich-section-renderer'));
                items = [...items].filter(el => !el.closest('ytd-rich-section-renderer'));
                items.sort((a, b) => sortOrder(a, b, itemsData)).forEach((item, i) => {
                    itemWpappers[i].appendChild(item);
                });
            }
        } catch(e) {
            console.log('YTFS sortFeed error', e);
        }
    };

    let inProcess = false;
    const checkFeed = () => {
        if (inProcess) return;
        let isList = false;
        let feed = document.querySelector('ytd-browse[page-subtype="subscriptions"][role="main"] #contents.ytd-rich-grid-renderer');
        if (!feed) {
            feed = document.querySelector('ytd-browse[page-subtype="subscriptions"][role="main"] #contents.ytd-section-list-renderer');
            if (feed) isList = true;
        }
        if (feed) {
            const sorted = isSorted(isList);
            if (!sorted) {
                inProcess = true;
                sortFeed(feed, isList);
                inProcess = false;
            }
        }
    };

    interceptFeedUpdate();
    setInterval(checkFeed, 500);
    checkFeed();
})();