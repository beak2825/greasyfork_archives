// ==UserScript==
// @name         YouTube - Hide Live Chat By Default
// @namespace    https://gist.github.com/lbmaian/94824cef728917a53d3c6e6ea885469c
// @version      0.14
// @description  Hide live chat by default on live streams
// @author       lbmaian
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/embed/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459356/YouTube%20-%20Hide%20Live%20Chat%20By%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/459356/YouTube%20-%20Hide%20Live%20Chat%20By%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;

    const logContext = '[YouTube - Hide Live Chat]';

    var debug;
    if (DEBUG) {
        debug = function(...args) {
            console.debug(logContext, ...args);
        }
    } else {
        debug = function(...args) {}
    }

    function log(...args) {
        console.log(logContext, ...args);
    }

    function warn(...args) {
        console.warn(logContext, ...args);
    }

    function error(...args) {
        console.error(logContext, ...args);
    }

    // Note: Following all relies on YT internals.

    function updateChatData(data, collapsed) {
        if (DEBUG) {
            debug('data (before)', window.structuredClone(data));
        }
        const liveChatRenderer = data.liveChatRenderer;
        if (liveChatRenderer) { // if no live chat despite #chat existing, e.g. "Live chat replay is not available for this video."
            const expandedByDefault = liveChatRenderer.initialDisplayState === 'LIVE_CHAT_DISPLAY_STATE_EXPANDED';
            if (expandedByDefault && collapsed) {
                if (collapsed) {
                    log('hiding live chat');
                }
                debug('data.liveChatRenderer.initialDisplayState:', liveChatRenderer.initialDisplayState,
                      '=>', 'LIVE_CHAT_DISPLAY_STATE_COLLAPSED');
                liveChatRenderer.initialDisplayState = 'LIVE_CHAT_DISPLAY_STATE_COLLAPSED';
            }
            const toggleButtonRenderer = liveChatRenderer.showHideButton?.toggleButtonRenderer;
            if (toggleButtonRenderer) {
                if (expandedByDefault) {
                    debug('data.liveChatRenderer.showHideButton.toggleButtonRenderer.defaultText/toggledText swapped');
                    [toggleButtonRenderer.defaultText, toggleButtonRenderer.toggledText] =
                        [toggleButtonRenderer.toggledText, toggleButtonRenderer.defaultText];
                }
                const isToggled = !collapsed;
                if (DEBUG && toggleButtonRenderer.isToggled !== isToggled) {
                    debug('data.liveChatRenderer.showHideButton.toggleButtonRenderer.isToggled', toggleButtonRenderer.isToggled,
                          '=>', isToggled);
                }
                toggleButtonRenderer.isToggled = isToggled;
            }
            if (DEBUG) {
                debug('data (updated)', window.structuredClone(data));
            }
            return expandedByDefault;
        } else {
            return false;
        }
    }

    // Navigating to YouTube watch page can happen via AJAX rather than new page load.
    // We can monitor this with YT's custom yt-page-data-fetched event,
    // which conveniently also fires even for new/refreshed pages.
    // yt-navigate-finish would also work (evt.detail.detail) but yt-page-data-fetched fires earlier.
    document.addEventListener('yt-page-data-fetched', evt => {
        debug('Navigated to', evt.detail.pageData.url);
        debug(evt);
        const conversationBar = evt.detail.pageData.response?.contents?.twoColumnWatchNextResults?.conversationBar;
        debug('yt-page-data-fetched pageData.response contents.twoColumnWatchNextResults.conversationBar (corresponds to #chat.data)',
              conversationBar);
        // If response doesn't include conversationBar, there won't be a #chat element at all.
        if (conversationBar) {
            // If #chat element isn't created yet, default collapsed to true.
            // Else keep current collapsed status between pages.
            // TODO: sometimes for new pages when chat doesn't exist yet, this apparently happens too late?
            // (chat already initialized with old data) and chat thus remains open?
            // Detect & fix this - use chat.parentComponent (ytd-watch-flexy)'s updatePageData_ or ytd-app's onYtPageDataFetched?
            const chat = document.getElementById('chat');
            let collapsed;
            if (chat) {
                collapsed = chat.collapsed;
                log('existing #chat', chat, 'collapsed:', collapsed);
            } else {
                log('no existing #chat, defaulting collapsed: true');
                collapsed = true;
            }
            updateChatData(conversationBar, collapsed);
        }
    });
})();
