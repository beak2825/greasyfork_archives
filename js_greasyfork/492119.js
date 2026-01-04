// ==UserScript==
// @name         YouTube All Videos Playlists (YAVP)
// @namespace    c0d3r
// @license      MIT
// @version      0.4
// @description  Adds buttons for various channel playlists: All Uploads, Videos, Shorts, Streams, Members-Only
// @author       c0d3r
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/492119/YouTube%20All%20Videos%20Playlists%20%28YAVP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492119/YouTube%20All%20Videos%20Playlists%20%28YAVP%29.meta.js
// ==/UserScript==

const options = {
    playNext: GM_getValue('playNext', true),
    newTabs: GM_getValue('newTabs', false)
};

const onClass = 'yt-spec-button-shape-next--outline';
const offClass = 'yt-spec-button-shape-next--disabled';

// custom buttons use native classes and tags so both Light and Dark theme is supported
function btnHtml(text, title, href, pos) {
    let html = '';
    let size = '';
    let tagStart = '';
    let tagEnd = '';
    let posClass = '';
    let stateClass = '';

    const target = options.newTabs ? 'target="_blank"' : '';

    if (pos) {
        posClass = `yt-spec-button-shape-next--segmented-${pos}`;
    }

    if (pos !== 'end') {
        html += '<div class="yt-flexible-actions-view-model-wiz__action" style="display: flex;">';
    }

    if (href.startsWith('http')) {
        size = 's';
        tagStart = `<a href="${href}"`;
        tagEnd = '</a>';
    } else {
        size = 'xs';
        tagStart = `<span id="${href}"`;
        tagEnd = '</span>';
        posClass = 'yt-spec-button-shape-next--workaround-icon-no-border-radius';
        stateClass = options[href] ? onClass : offClass;
    }

    html += `
    <button-view-model class="yt-spec-button-view-model" style="align-items: center;">
        ${tagStart} title="${title}" ${target}
        style="cursor: pointer;"
        class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono
        yt-spec-button-shape-next--size-${size} ${posClass} ${stateClass}">${text}${tagEnd}
    </button-view-model>`;

    if (pos !== 'start') {
        html += '</div>';
    }

    return html;
}

// generate URL based on playlist type and channel ID
function listUrl(listType, chanId) {
    const root = 'https://www.youtube.com/playlist?list=';
    let url = `${root}${listType}${chanId}`;

    // "&playnext=1" starts playing the first video right away; required for Popular Uploads
    // not added for Members-Only playlists since it won't work unless you're a paid member
    if ((options.playNext && listType !== 'UUMO') || listType === 'PU') {
        url += '&playnext=1';
    }

    return url;
}

function btnBlock(data, chanId) {
    let html = '<div id="yavp-wrap" style="display: flex; flex: 0.8;">';

    // only add relevant buttons based on available channel tabs
    // for IDs see https://github.com/RobertWesner/YouTube-Play-All/blob/main/documentation/available-lists.md
    // and also    https://wiki.archiveteam.org/index.php/YouTube/Technical_details
    html += btnHtml('All', 'All Uploads', listUrl('UU', chanId), 'start');
    html += btnHtml('Pop', 'Popular Uploads', listUrl('PU', chanId), 'end');

    data.response.contents.twoColumnBrowseResultsRenderer.tabs.forEach(function(tab) {
        if (tab.hasOwnProperty('tabRenderer')) {
            // check for URLs instead of tab titles because languages might be different
            const url = tab.tabRenderer.endpoint.commandMetadata.webCommandMetadata.url;
            if (url.endsWith('/videos')) {
                html += btnHtml('VA', 'All Videos', listUrl('UULF', chanId), 'start');
                html += btnHtml('VP', 'Popular Videos', listUrl('UULP', chanId), 'end');
            } else if (url.endsWith('/shorts')) {
                html += btnHtml('SA', 'All Shorts', listUrl('UUSH', chanId), 'start');
                html += btnHtml('SP', 'Popular Shorts', listUrl('UUPS', chanId), 'end');
            } else if (url.endsWith('/streams')) {
                html += btnHtml('LA', 'All Streams', listUrl('UULV', chanId), 'start');
                html += btnHtml('LP', 'Popular Streams', listUrl('UUPV', chanId), 'end');
            }
        }
    });

    // add Members-Only button only if Join button exists
    let addMemberBtn = false;
    const head = data.response.header;

    // when not logged in
    if (head.hasOwnProperty('c4TabbedHeaderRenderer') &&
        head.c4TabbedHeaderRenderer.hasOwnProperty('sponsorButton')) {
        addMemberBtn = true;
    }

    // when logged in
    if (head.hasOwnProperty('pageHeaderRenderer')) {
        const actionRows = head.pageHeaderRenderer.content.pageHeaderViewModel.actions.flexibleActionsViewModel.actionsRows;
        actionRows.forEach(function(row) {
            row.actions.forEach(function(action) {
                if (action.hasOwnProperty('buttonViewModel')) {
                    addMemberBtn = true;
                }
            });
        });
    }

    if (addMemberBtn) {
        html += btnHtml('Mem', 'Members-Only Videos', listUrl('UUMO', chanId));
    }

    html += btnHtml('AP', 'AutoPlay (PlayNext)', 'playNext', 'start');
    html += btnHtml('NT', 'Open in New Tabs', 'newTabs', 'end');

    html += '</div>';
    return html;
}

// button click action
function addClickEvents(selector) {
    document.querySelector('#' + selector).addEventListener('click', function() {
        if (this.classList.contains(onClass)) {
            this.classList.replace(onClass, offClass);
            options[selector] = false;
            GM_setValue(selector, false);
        } else {
            this.classList.replace(offClass, onClass);
            options[selector] = true;
            GM_setValue(selector, true);
        }
    });
}

(function() {
    'use strict';

    // WORKAROUND: TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.
    if (window.trustedTypes && trustedTypes.createPolicy) {
        if (!trustedTypes.defaultPolicy) {
            const passThroughFn = (x) => x;
            trustedTypes.createPolicy('default', {
                createHTML: passThroughFn,
                createScriptURL: passThroughFn,
                createScript: passThroughFn,
            });
        }
    }

    let oldChanId;

    // native event that fires on each page or tab change
    window.addEventListener('yt-navigate-finish', function() {
        const path = window.location.pathname;
        // run only on channel pages, see https://support.google.com/youtube/answer/6180214
        if (path.startsWith('/channel/') || path.startsWith('/@') ||
            path.startsWith('/c/') || path.startsWith('/user/')) {
            const pageMan = document.querySelector('#page-manager');
            // native function that returns useful data
            const pageData = pageMan.getCurrentData();
            // get channel ID, but remove UC from the start
            const chanId = pageData.response.metadata.channelMetadataRenderer.externalId.substring(2);

            // proceed only if a new channel is opened, don't react to tab changes
            if (oldChanId !== chanId) {
                // remove the wrapper if it exists
                const wrapper = document.querySelector('#yavp-wrap');
                if (wrapper) {
                    wrapper.remove();
                }

                const tabBlock = document.querySelector('#tabsContainer');
                if (tabBlock) {
                    // tabs container might already exist in DOM
                    tabBlock.insertAdjacentHTML('afterEnd', btnBlock(pageData, chanId));
                    addClickEvents('playNext');
                    addClickEvents('newTabs');
                } else {
                    // Chrome needs to wait for this block to be added at first
                    let stopObserve = false;
                    const observer = new MutationObserver(function(mutList) {
                        for (let i = 0; i < mutList.length; i++) {
                            for (let j = 0; j < mutList[i].addedNodes.length; j++) {
                                if (mutList[i].addedNodes[j].tagName === 'TP-YT-APP-HEADER-LAYOUT') {
                                    const tabs = mutList[i].addedNodes[j].querySelector('#tabsContainer');
                                    tabs.insertAdjacentHTML('afterEnd', btnBlock(pageData, chanId));
                                    addClickEvents('playNext');
                                    addClickEvents('newTabs');
                                    observer.disconnect();
                                    stopObserve = true;
                                    break;
                                }
                            }
                            if (stopObserve) {
                                break;
                            }
                        }
                    });

                    observer.observe(pageMan, {
                        subtree: true, childList: true
                    });
                }

                // save channel ID for future checks
                oldChanId = chanId;
            }
        }
    });
})();
