// ==UserScript==
// @name         Holovision
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Historique chat malléable
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @match        https://dreadcast.net/Main*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532962/Holovision.user.js
// @updateURL https://update.greasyfork.org/scripts/532962/Holovision.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HISTORY_DURATION_MS = 48 * 60 * 60 * 1000;
    const STORAGE_PREFIX = 'dreadcastChatHistory_v9_';
    const PINNED_TABS_STORAGE_KEY = `${STORAGE_PREFIX}pinnedTabs_v1`;
    const MAX_MESSAGES_PER_ROOM = 1500;
    const MIN_WINDOW_WIDTH = 350;
    const MIN_WINDOW_HEIGHT = 200;
    let isDragging = false, isResizing = false, isDraggingTab = false, isDraggingMessage = false;
    let dragOffsetX, dragOffsetY, resizeStartX, resizeStartY, initialWidth, initialHeight;
    let historyWindow = null;
    let selectionTabCounter = 0;
    let isMinimized = false;
    let draggedTabInfo = null;
    let draggedMessageInfo = null;
    const TAB_DRAG_TYPE = 'application/x-dreadcast-history-tab';
    const MESSAGE_DRAG_TYPE = 'application/x-dreadcast-history-messages';
    const TIMESTAMP_STATE_FULL = 1;
    const TIMESTAMP_STATE_GAMEONLY = 2;
    const TIMESTAMP_STATE_NONE = 3;
    let currentTimestampState = TIMESTAMP_STATE_FULL;

    function getCurrentRoomId() {
        const selectedTab = $('#onglets_chat ul li.selected');
        if (selectedTab.length) {
            const idAttr = selectedTab.attr('id');
            if (idAttr && idAttr.startsWith('chat_')) return idAttr.substring(5);
        }
        try { if (typeof nav?.getChat?.getRoom === 'function') return nav.getChat().getRoom(); } catch (e) {}
        return null;
    }
    function getRoomNameById(roomId) {
        const tab = $(`#chat_${roomId}`);
        return tab.length ? tab.text() : `Room ${roomId}`;
    }

    function padZero(num) {
        return num.toString().padStart(2, '0');
    }

    function formatTimestampEU(timestamp) {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) { return ''; }
            const day = padZero(date.getDate());
            const month = padZero(date.getMonth() + 1);
            const year = date.getFullYear();
            const hours = padZero(date.getHours());
            const minutes = padZero(date.getMinutes());
            const seconds = padZero(date.getSeconds());
            return `${hours}h${minutes}m${seconds}s ${day}/${month}/${year}`;
        } catch (e) {
            return '';
        }
    }

     function formatSearchDateEU(timestamp) {
         try {
             const date = new Date(timestamp);
             if (isNaN(date.getTime())) { return ''; }
             const day = padZero(date.getDate());
             const month = padZero(date.getMonth() + 1);
             const year = date.getFullYear();
             return `${day}/${month}/${year}`;
         } catch (e) {
             return '';
         }
     }

     function getPinnedTabs() {
        try {
            const data = localStorage.getItem(PINNED_TABS_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            localStorage.removeItem(PINNED_TABS_STORAGE_KEY);
            return [];
        }
    }

    function savePinnedTabs(pinnedTabsArray) {
        try {
            const validTabs = pinnedTabsArray.filter(tab => tab && tab.id && tab.name && typeof tab.html === 'string');
            localStorage.setItem(PINNED_TABS_STORAGE_KEY, JSON.stringify(validTabs));
        } catch (e) {
        }
    }

     function updateSinglePinnedTabHtml(persistentId, newHtml) {
         if (!persistentId) return;
         try {
             let currentPinnedTabs = getPinnedTabs();
             const index = currentPinnedTabs.findIndex(tab => tab.id === persistentId);
             if (index > -1) {
                 const $tempDiv = $('<div>').html(newHtml);
                 $tempDiv.find('.msg-delete-btn').remove();
                 currentPinnedTabs[index].html = $tempDiv.html();
                 savePinnedTabs(currentPinnedTabs);
             }
         } catch (e) {
         }
     }

    function updateButtonPosition() {
        const scriptButton = $('#local-chat-history-float-btn');
        const pageButton = $('span.btnTxt.more:contains("+")').filter(function() {
             return $(this).is(':visible') && $(this).attr('onclick')?.includes('#zone_chat');
        }).first();

        if (scriptButton.length && pageButton.length) {
            const pageButtonOffset = pageButton.offset();
            const pageButtonHeight = pageButton.outerHeight();
            const pageButtonWidth = pageButton.outerWidth();
            const scriptButtonHeight = scriptButton.outerHeight();

            if (pageButtonOffset) {
                const newTop = pageButtonOffset.top + (pageButtonHeight / 2) - (scriptButtonHeight / 2);
                const newLeft = pageButtonOffset.left + pageButtonWidth + 20;

                scriptButton.css({
                    position: 'absolute',
                    top: Math.max(0, newTop) + 'px',
                    left: newLeft + 'px',
                    right: 'auto',
                    bottom: 'auto'
                });
            } else {
                setFallbackButtonPosition(scriptButton);
            }
        } else if (scriptButton.length) {
            setFallbackButtonPosition(scriptButton);
        }
    }

    function setFallbackButtonPosition(scriptButton) {
         if(scriptButton && scriptButton.length) {
              scriptButton.css({
                  position: 'fixed',
                  top: '287px',
                  right: '177px',
                  left: 'auto',
                  bottom: 'auto'
              });
         }
    }

    function addFloatingButton() {
        if ($('#local-chat-history-float-btn').length > 0) return;
        const button = $('<button id="local-chat-history-float-btn" title="Afficher/Cacher l\'historique local">📜</button>');
        $('body').append(button);
        button.on('click', toggleHistoryWindow);
        updateButtonPosition();
    }

    function addWindowStyles() {
        GM_addStyle(`
            #local-chat-history-float-btn {
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 100001 !important; padding: 5px 8px !important; width: 35px; height: 30px;
                cursor: pointer !important; border: 1px solid #555 !important;
                background-color: #2a2a2a !important; color: #ccc !important;
                font-size: 16px !important; border-radius: 4px !important;
                line-height: 1 !important; opacity: 0.85 !important;
                transition: opacity 0.2s ease-in-out, top 0.1s ease-out, left 0.1s ease-out;
            }
            #local-chat-history-float-btn:hover {
                opacity: 1.0 !important; background-color: #3a3a3a !important;
            }

            #chat-history-window {
                 position: absolute; top: 50px; left: 50px; width: 500px; height: 400px;
                 min-width: ${MIN_WINDOW_WIDTH}px; min-height: ${MIN_WINDOW_HEIGHT}px;
                 background-color: #1e1e1e; border: 1px solid #444; box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
                 z-index: 999995 !important; display: flex; flex-direction: column; border-radius: 3px;
                 overflow: hidden; color: #ccc; font-size: 12px; font-family: 'Arial', sans-serif;
             }
             #chat-history-window:not(.minimized) {
                 transition: height 0.2s ease-out;
             }

            .chat-history-header {
                background-color: #333; padding: 4px 8px; cursor: move; user-select: none;
                display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid #555; flex-shrink: 0; gap: 5px;
                height: 25px;
                box-sizing: border-box;
            }
            .chat-history-header-title {
                font-weight: bold; color: #eee; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                flex-shrink: 1; min-width: 50px;
            }
            .chat-history-search-container {
                flex-grow: 1; display: flex; flex-wrap: wrap; align-items: center;
                padding: 2px 5px; background-color: #222;
                border: 1px solid #555; border-radius: 2px;
                min-height: 17px;
                box-sizing: border-box;
                cursor: text;
                gap: 3px;
                overflow: hidden;
            }
            .chat-history-search-tag {
                background-color: #4a4a4a; color: #ddd;
                padding: 1px 5px; border-radius: 3px;
                font-size: 10px; white-space: nowrap;
                display: inline-flex; align-items: center;
                cursor: default;
            }
            .chat-history-search-tag-text {
                 margin-right: 4px;
            }
            .chat-history-search-tag-remove {
                 font-size: 12px; color: #999;
                 cursor: pointer; padding: 0 2px;
                 border-radius: 50%; line-height: 1;
            }
            .chat-history-search-tag-remove:hover {
                 color: #fff; background-color: #777;
            }
            .chat-history-search-input {
                 flex-grow: 1;
                 background-color: transparent; border: none; outline: none;
                 color: #ccc; font-size: 11px; padding: 0; margin: 0;
                 min-width: 50px;
                 height: 15px;
            }
            .chat-history-header-controls {
                display: flex; align-items: center; flex-shrink: 0;
            }
            .timestamp-toggle, .select-all, .copy-tab-content, .chat-history-close {
                cursor: pointer; font-size: 16px; color: #aaa; padding: 0 4px; line-height: 1;
                user-select: none;
            }
            .timestamp-toggle:hover, .select-all:hover, .copy-tab-content:hover, .chat-history-close:hover {
                 color: #fff;
            }
            .select-all { font-size: 16px; }
            .copy-tab-content { font-size: 18px; }
            .chat-history-close { }

            .chat-history-tabs {
                display: flex; flex-wrap: nowrap;
                background-color: #2a2a2a;
                padding: 3px 5px 0 5px; border-bottom: 1px solid #444; flex-shrink: 0;
                overflow-x: auto;
                align-items: flex-end;
                min-height: 28px;
                box-sizing: border-box;
                gap: 3px;
                position: relative;
            }
            .chat-history-tab {
                padding: 4px 6px; margin-bottom: 0px;
                background-color: #404040;
                border: 1px solid #555; border-bottom: none; border-radius: 3px 3px 0 0;
                cursor: pointer; font-size: 11px; color: #bbb; position: relative;
                white-space: nowrap; max-width: 180px; overflow: hidden; text-overflow: ellipsis;
                display: flex; align-items: center;
                transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, opacity 0.15s ease-in-out;
                height: 24px;
                box-sizing: border-box;
                flex-shrink: 0;
            }
            .chat-history-tab:hover {
                background-color: #505050; color: #ddd;
            }
            .chat-history-tab.active-tab {
                background-color: #1a1a1a;
                color: #fff;
                border-color: #444;
                border-bottom: 1px solid #1a1a1a;
                margin-bottom: -1px;
                z-index: 2;
                height: 25px;
            }

            .chat-history-tab.is-pinned {
                background-color: #3a4a52;
                border-color: #50606a;
                color: #cce0ff;
                border-top: 3px solid #66ccff;
                padding-top: 1px;
            }
            .chat-history-tab.is-pinned:hover {
                background-color: #4a5a62;
                border-color: #60707a;
            }
            .chat-history-tab.is-pinned.active-tab {
                background-color: #1a1a1a;
                color: #fff;
                border-color: #444;
                border-bottom: 1px solid #1a1a1a;
                margin-bottom: -1px;
                z-index: 3;
                height: 25px;
            }
            .chat-history-tab.is-pinned.active-tab:hover {
                 background-color: #1a1a1a;
            }

             .chat-history-tab .tab-text {
                 flex-grow: 1; overflow: hidden; text-overflow: ellipsis;
                 display: inline-block;
                 vertical-align: middle;
                 pointer-events: none;
                 user-select: none;
                 margin-right: 5px;
            }
             .chat-history-tab .tab-close {
                 pointer-events: auto;
                 user-select: auto;
             }
            .chat-history-tab .tab-close {
                font-size: 12px; color: #888; font-weight: bold;
                padding: 0 2px; border-radius: 50%;
                vertical-align: middle; flex-shrink: 0;
            }
             .chat-history-tab.is-pinned .tab-close {
                 color: #99aabb;
             }
            .chat-history-tab .tab-close:hover { color: #fff; background-color: #555; }
            .chat-history-tab.active-tab .tab-close { color: #aaa; }
            .chat-history-tab.active-tab .tab-close:hover { color: #fff; background-color: #777; }
            .chat-history-tab.no-close .tab-close { display: none; }
            .chat-history-tab:not(.no-close):not(.is-pinned) .tab-close { display: inline-block; }
             .chat-history-tab.is-pinned .tab-close { display: none; }


            .chat-history-tab[draggable="true"] { cursor: grab; }
            .chat-history-tab.dragging-tab {
                 opacity: 0.5;
                 cursor: grabbing;
                 border: 1px dashed #aaa;
            }
             .chat-history-tab.drag-over-tab-for-message {
                  outline: 2px solid lightgreen;
                  outline-offset: -2px;
                  background-color: #446655 !important;
              }

            .tab-rename-input {
                 background-color: #111; color: #eee; border: 1px solid #66ccff;
                 padding: 0px 3px; font-size: 10px;
                 font-family: inherit; height: 15px;
                 vertical-align: middle; box-sizing: border-box;
                 width: 80px;
                 outline: none;
                 margin-right: 5px;
            }

            .chat-history-tabs .tab-bar-button {
                display: inline-flex; align-items: center; justify-content: center;
                padding: 2px 5px; margin-bottom: 0px;
                background-color: #383838; border: 1px solid #555; border-bottom: none;
                border-radius: 3px 3px 0 0;
                cursor: pointer; font-size: 16px;
                color: #bbb; width: 24px; height: 24px; line-height: 1;
                box-sizing: border-box; flex-shrink: 0;
                transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out, opacity 0.15s ease-in-out;
                user-select: none;
            }
            .chat-history-tabs .tab-bar-button:hover {
                background-color: #505050; color: #fff;
            }
             .chat-history-tabs .export-selected { }
            #global-pin-button {
                margin-left: auto;
                font-size: 14px;
            }
            #global-pin-button.pinned-state {
                color: #66ccff;
                font-weight: bold;
            }
            #global-pin-button.unpinned-state {
                color: #99aabb;
                font-weight: normal;
            }
            #global-pin-button:hover.pinned-state { color: #87dfff; }
            #global-pin-button:hover.unpinned-state { color: #cceeff; }
             #global-pin-button:disabled {
                 opacity: 0.4;
                 cursor: not-allowed;
                 color: #777 !important;
                 background-color: #303030 !important;
             }

            .chat-history-tab-contents {
                flex-grow: 1; position: relative; overflow: hidden;
                transition: opacity 0.2s ease-out;
             }
            .chat-history-content {
                 position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                 overflow-y: scroll; padding: 5px 8px; background-color: #1a1a1a;
                 line-height: 1.4; display: none;
                 transition: background-color 0.15s ease-in-out;
             }
             .chat-history-content.drag-over-content {
                  background-color: #2a3a2a !important;
              }
             .chat-history-content.active-content { display: block; z-index: 1; }

            .chat-history-content .msg {
                position: relative;
                border-bottom: 1px dotted #444; padding: 3px 20px 3px 0;
                overflow-wrap: break-word;
                transition: background-color 0.2s ease-in-out, opacity 0.15s ease-in-out;
                cursor: default;
                 user-select: none;
                 overflow: hidden;
             }
             .chat-history-content .msg[draggable="true"] { }
             .chat-history-content .msg:hover { background-color: rgba(255, 255, 255, 0.05); }
            .chat-history-content .msg.selected-message {
                background-color: rgba(135, 206, 250, 0.15);
                border-left: 3px solid skyblue; padding-left: 5px;
            }
             .chat-history-content .msg.dragging-message {
                 opacity: 0.4;
                 border: 1px dashed lightgreen;
             }
             .chat-history-content .msg.search-hidden { display: none; }
             .chat-history-content .moment { display: inline; font-size: 10px; color: #888; margin-left: 5px; white-space: nowrap; }
             .chat-history-content .full-timestamp {
                 display: inline; font-size: 10px;
                 color: #777;
                 margin-left: 5px;
                 user-select: text; font-family: monospace;
                 float: right;
                 white-space: nowrap;
             }
             #chat-history-window.timestamp-state-gameonly .chat-history-content .full-timestamp { display: none; }
             #chat-history-window.timestamp-state-none .chat-history-content .full-timestamp { display: none; }
             #chat-history-window.timestamp-state-none .chat-history-content .moment { display: none !important; }

             .chat-history-content .white { color: #fff; }
             .chat-history-content .linkable { color: #87CEEB; cursor: default; }
             .chat-history-content .couleur1 { color: #ffcc00; } .chat-history-content .couleur2 { color: #ff6666; }
             .chat-history-content .couleur3 { color: #99ccff; } .chat-history-content .couleur4 { font-weight: bold; }
             .chat-history-content .couleur5 { background-color: rgba(70,70,70,0.5); padding: 1px 0;}
             .chat-history-content em { font-style: italic; color: #aaa; }
             .chat-history-content em[onmouseover], .chat-history-content span[onmouseover], .chat-history-content .linkable { pointer-events: none !important; }

            .msg-delete-btn {
                 position: absolute;
                 top: 2px;
                 right: 3px;
                 font-size: 14px;
                 line-height: 1;
                 color: #777;
                 cursor: pointer;
                 padding: 0 3px;
                 border-radius: 3px;
                 display: none;
                 z-index: 5;
                 user-select: none;
                 font-weight: bold;
             }
             .msg:hover .msg-delete-btn {
                 display: inline-block;
             }
             .msg-delete-btn:hover {
                 color: #fff;
                 background-color: #a55;
             }

            .chat-history-resizer {
                 position: absolute; bottom: 0; right: 0; width: 15px; height: 15px;
                 background-color: rgba(255,255,255,0.1); border-top: 1px solid #555;
                 border-left: 1px solid #555; cursor: nwse-resize; z-index: 10;
                 transition: opacity 0.2s ease-out;
             }
             .chat-history-resizer:hover { background-color: rgba(255,255,255,0.2); }

            #chat-history-window.minimized .chat-history-tab-contents,
            #chat-history-window.minimized .chat-history-resizer {
                display: none;
                opacity: 0;
                pointer-events: none;
            }
            #chat-history-window.minimized .chat-history-tabs {
                display: none;
                height: 0;
                min-height: 0;
                padding: 0;
                border: none;
                opacity: 0;
                pointer-events: none;
            }
            #chat-history-window.minimized .chat-history-header {
                cursor: default;
                border-bottom: none;
            }
            #chat-history-window.minimized {
                min-height: 0 !important;
            }
        `);
    }

     function toggleHistoryWindow() {
        if (historyWindow) {
            closeHistoryWindow();
        } else {
            createHistoryWindow();
        }
    }

    function updateTimestampButtonTitle(button, state) {
        if (!button) return;
        switch (state) {
            case TIMESTAMP_STATE_FULL:
                button.attr('title', "Masquer l'horodatage détaillé");
                break;
            case TIMESTAMP_STATE_GAMEONLY:
                button.attr('title', "Masquer l'horodatage du jeu");
                break;
            case TIMESTAMP_STATE_NONE:
                button.attr('title', "Afficher tous les horodatages");
                break;
            default:
                button.attr('title', "Basculer l'affichage de l'horodatage");
        }
    }

    function cycleTimestampState() {
        if (!historyWindow) return;

        currentTimestampState++;
        if (currentTimestampState > TIMESTAMP_STATE_NONE) {
            currentTimestampState = TIMESTAMP_STATE_FULL;
        }

        historyWindow.removeClass('timestamp-state-gameonly timestamp-state-none');

        switch (currentTimestampState) {
            case TIMESTAMP_STATE_GAMEONLY:
                historyWindow.addClass('timestamp-state-gameonly');
                break;
            case TIMESTAMP_STATE_NONE:
                historyWindow.addClass('timestamp-state-none');
                break;
        }

        updateTimestampButtonTitle(historyWindow.find('.timestamp-toggle'), currentTimestampState);
        handleSearch();
    }


    function createHistoryWindow() {
        if (historyWindow) return;

        isMinimized = false;
        currentTimestampState = TIMESTAMP_STATE_FULL;

        const pinnedTabs = getPinnedTabs();
        let maxPinnedId = 0;
        pinnedTabs.forEach(tab => {
            if (tab.id && tab.id.startsWith('pinned-sel-')) {
                 try {
                     const num = parseInt(tab.id.substring(11), 10);
                     if (!isNaN(num) && num > maxPinnedId) { maxPinnedId = num; }
                 } catch (e) { }
            }
        });
        selectionTabCounter = maxPinnedId;

        const currentRoomId = getCurrentRoomId();
        if (!currentRoomId) {
            alert("Impossible de déterminer le salon de chat actuel.");
            return;
        }
        const roomName = getRoomNameById(currentRoomId);

        const messages = getStoredMessages(currentRoomId);
        const uniqueMessages = [];
        const seenHtml = new Set();
        for (const msgData of messages) {
            if (msgData && msgData.html && !seenHtml.has(msgData.html)) {
                seenHtml.add(msgData.html);
                uniqueMessages.push(msgData);
            }
        }

        historyWindow = $('<div id="chat-history-window"></div>');
        const headerTitle = $(`<span class="chat-history-header-title" title="${roomName}">Historique - ${roomName}</span>`);
        const searchContainer = $(`<div id="chat-history-search-container" class="chat-history-search-container"></div>`);
        const searchInput = $(`<input type="text" id="chat-history-search-input" class="chat-history-search-input" placeholder="Rechercher (Entrée pour fixer)...">`);
        searchContainer.append(searchInput);
        const timestampToggle = $(`<span class="timestamp-toggle">🕑</span>`);
        updateTimestampButtonTitle(timestampToggle, currentTimestampState);
        const selectAllButton = $(`<span class="select-all" title="Tout sélectionner/désélectionner (visible)">🧾</span>`);
        const copyButton = $(`<span class="copy-tab-content" title="Copier tout le contenu de l'onglet actif">↗</span>`);
        const closeButton = $(`<span class="chat-history-close" title="Fermer">✖</span>`);

        const headerControls = $('<div class="chat-history-header-controls"></div>')
            .append(timestampToggle)
            .append(selectAllButton)
            .append(copyButton)
            .append(closeButton);
        const header = $(`<div class="chat-history-header"></div>`)
            .append(headerTitle)
            .append(searchContainer)
            .append(headerControls);

        const tabBar = $('<div class="chat-history-tabs"></div>');
        const tabContents = $('<div class="chat-history-tab-contents"></div>');
        const resizer = $('<div class="chat-history-resizer"></div>');

        historyWindow.append(header).append(tabBar).append(tabContents).append(resizer);

        const mainTabId = 'history-tab-main';
        const mainContentId = 'history-content-main';
        const mainTabButton = $(`<div class="chat-history-tab no-close active-tab" id="${mainTabId}" data-tabid="${mainContentId}" draggable="false"><span class="tab-text">Historique</span></div>`);
        tabBar.append(mainTabButton);
        const mainContentPane = $(`<div class="chat-history-content active-content" id="${mainContentId}"></div>`);
        tabContents.append(mainContentPane);

        if (uniqueMessages.length === 0) {
            mainContentPane.append('<p style="text-align: center; color: #888;"><i>Aucun historique local.</i></p>');
        } else {
            uniqueMessages.forEach(msgData => {
                try {
                    appendMessageToPane(mainContentPane, msgData, false);
                } catch (parseError) {
                     mainContentPane.append($('<div>').text(`[Error parsing message: ${msgData.html}]`).css('color', 'red'));
                }
            });
        }

        pinnedTabs.forEach(pinnedTabData => {
             createPinnedTabElements(pinnedTabData, tabBar, tabContents);
        });

        const exportButton = $(`<button class="export-selected tab-bar-button" title="Créer un onglet avec la sélection">➕</button>`);
        const globalPinButton = $(`<button id="global-pin-button" class="tab-bar-button" title="Épingler/Détacher l'onglet actif" disabled>📌</button>`);

        tabBar.append(exportButton);
        tabBar.append(globalPinButton);

        $('body').append(historyWindow);

        header.on('mousedown', startDrag);
        header.on('dblclick', toggleMinimizeWindow);
        resizer.on('mousedown', startResize);
        timestampToggle.on('click', cycleTimestampState);
        closeButton.on('click', closeHistoryWindow);

        searchInput.on('input', handleSearch);
        searchInput.on('keydown', handleSearchInputKeydown);
        searchContainer.on('click', '.chat-history-search-tag-remove', handleTagRemoveClick);
        searchContainer.on('click', handleSearchContainerClick);

        exportButton.on('click', createSelectionTab);
        globalPinButton.on('click', handleGlobalPinClick);
        selectAllButton.on('click', toggleSelectAllVisibleMessages);
        copyButton.on('click', handleCopyTabContent);

        tabBar.on('click', '.chat-history-tab', handleTabClick);
        tabBar.on('dblclick', '.chat-history-tab', handleTabDoubleClick);
        tabBar.on('click', '.tab-close', handleTabCloseClick);
        tabBar.on('dragstart', '.chat-history-tab[draggable="true"]', handleTabDragStart);
        tabBar.on('dragover', '.chat-history-tab', handleTabOrContentDragOver);
        tabBar.on('dragenter', '.chat-history-tab', handleTabOrContentDragEnter);
        tabBar.on('dragleave', '.chat-history-tab', handleTabOrContentDragLeave);
        tabBar.on('drop', '.chat-history-tab', handleTabOrContentDrop);
        tabBar.on('dragend', '.chat-history-tab[draggable="true"]', handleTabDragEnd);

        tabContents.on('click', '.msg', handleMessageClick);
        tabContents.on('dragstart', '.msg[draggable="true"]', handleMessageDragStart);
        tabContents.on('dragover', '.chat-history-content', handleTabOrContentDragOver);
        tabContents.on('dragenter', '.chat-history-content', handleTabOrContentDragEnter);
        tabContents.on('dragleave', '.chat-history-content', handleTabOrContentDragLeave);
        tabContents.on('drop', '.chat-history-content', handleTabOrContentDrop);
        tabContents.on('dragend', '.msg[draggable="true"]', handleMessageDragEnd);
        tabContents.on('click', '.msg-delete-btn', handleMessageDeleteClick);

        mainContentPane.scrollTop(mainContentPane[0].scrollHeight);
        updateGlobalPinButtonState();
        handleSearch();
    }

    function closeHistoryWindow() {
         if (historyWindow) {
            $(document).off('.historydrag .historyresize');
            historyWindow.remove();
            historyWindow = null;
            isMinimized = false;
            isDraggingTab = false;
            isDraggingMessage = false;
            draggedTabInfo = null;
            draggedMessageInfo = null;
        }
    }

    function toggleMinimizeWindow(e) {
        if (!historyWindow || $(e.target).closest('.chat-history-header-controls, .chat-history-search-container').length > 0) {
            return;
        }
        e.preventDefault();

        if (isMinimized) {
            const originalHeight = historyWindow.data('originalHeight');
            historyWindow.height(originalHeight || MIN_WINDOW_HEIGHT);
            historyWindow.removeClass('minimized');
            isMinimized = false;
            setTimeout(() => {
                handleSearch();
            }, 50);
        } else {
            historyWindow.data('originalHeight', historyWindow.outerHeight());
            const headerHeight = historyWindow.find('.chat-history-header').outerHeight(true) || 0;
            historyWindow.height(headerHeight);
            historyWindow.addClass('minimized');
            isMinimized = true;
        }
    }


     function switchTab(tabButtonToActivate) {
        if (!historyWindow || !tabButtonToActivate || tabButtonToActivate.length === 0 || tabButtonToActivate.hasClass('active-tab')) {
            return;
        }

        const tabId = tabButtonToActivate.data('tabid');
        const contentPaneToActivate = historyWindow.find(`#${tabId}`);

        if (contentPaneToActivate.length) {
            cancelTabRename(historyWindow.find('.tab-rename-input'));

            const $currentActiveTab = historyWindow.find('.chat-history-tab.active-tab');
            const $currentActiveContent = historyWindow.find('.chat-history-content.active-content');

            $currentActiveTab.removeClass('active-tab');
            $currentActiveContent.removeClass('active-content');

            tabButtonToActivate.addClass('active-tab');
            contentPaneToActivate.addClass('active-content');

            handleSearch();
            updateGlobalPinButtonState();
        }
    }

     function createPinnedTabElements(pinnedTabData, tabBar, tabContents) {
        if (!pinnedTabData || !pinnedTabData.id || !pinnedTabData.name || typeof pinnedTabData.html !== 'string') {
            return;
        }

        const tabId = `content-${pinnedTabData.id}`;
        const tabButtonId = `tab-${pinnedTabData.id}`;
        const safeName = $('<div>').text(pinnedTabData.name).html();

        const tabButton = $(`
            <div class="chat-history-tab is-pinned" id="${tabButtonId}"
                 data-tabid="${tabId}" data-persistent-id="${pinnedTabData.id}"
                 title="${safeName} (Épinglé)" draggable="true">
                <span class="tab-text">${safeName}</span>
                <span class="tab-close" title="Fermer cet onglet">×</span>
            </div>`);

        const contentPane = $(`<div class="chat-history-content" id="${tabId}"></div>`);
        contentPane.html(pinnedTabData.html);

        contentPane.find('.msg').each(function() {
             const $msg = $(this);
             prepareMessageElement($msg, null, true);
        });

        const $lastButton = tabBar.children('.tab-bar-button').first();
        if ($lastButton.length) {
             tabButton.insertBefore($lastButton);
        } else {
             tabBar.append(tabButton);
        }

        tabContents.append(contentPane);
    }

    function createSelectionTab() {
        if (!historyWindow) return;

        const $activeContentPane = historyWindow.find('.chat-history-content.active-content');
        const $selectedMessages = $activeContentPane.find('.msg.selected-message:not(.search-hidden)');

        if ($selectedMessages.length === 0) {
            alert("Aucun message (visible) sélectionné à exporter dans un onglet.");
            return;
        }

        selectionTabCounter++;
        const newTabName = `Sélection ${selectionTabCounter}`;
        const persistentId = `pinned-sel-${selectionTabCounter}`;
        const newContentId = `content-${persistentId}`;
        const newTabButtonId = `tab-${persistentId}`;
        const safeName = $('<div>').text(newTabName).html();

        const newTabButton = $(`
            <div class="chat-history-tab" id="${newTabButtonId}"
                 data-tabid="${newContentId}" data-persistent-id="${persistentId}"
                 title="${safeName}" draggable="true">
                <span class="tab-text">${safeName}</span>
                <span class="tab-close" title="Fermer cet onglet">×</span>
            </div>`);

        const newContentPane = $(`<div class="chat-history-content" id="${newContentId}"></div>`);

        let clonedCount = 0;
        $selectedMessages.each(function() {
            const $clonedMsg = $(this).clone(true, true)
                                  .removeClass('selected-message search-hidden')
                                  .attr('draggable', 'true');

             prepareMessageElement($clonedMsg, null, true);

            newContentPane.append($clonedMsg);
            clonedCount++;
        });

        const tabBar = historyWindow.find('.chat-history-tabs');
        const $lastButton = tabBar.children('.tab-bar-button').first();

        if ($lastButton.length) {
            newTabButton.insertBefore($lastButton);
        } else {
            tabBar.append(newTabButton);
        }

        historyWindow.find('.chat-history-tab-contents').append(newContentPane);

        switchTab(newTabButton);

        handleSearch();
    }


     function removeTabAndContent(tabButton, options = {}) {
        const { skipPinnedCheck = false } = options;
        if(!tabButton || tabButton.length === 0 || tabButton.is('#history-tab-main')) {
            return false;
        }

        const isPinned = tabButton.hasClass('is-pinned');
        const persistentId = tabButton.data('persistent-id');
        const contentId = tabButton.data('tabid');
        const contentPane = historyWindow.find(`#${contentId}`);

        if (isPinned && !skipPinnedCheck) {
            alert("Vous devez d'abord détacher cet onglet pour le supprimer.");
            return false;
        }

        if (isPinned && persistentId) {
            try {
                let currentPinnedTabs = getPinnedTabs();
                savePinnedTabs(currentPinnedTabs.filter(tab => tab.id !== persistentId));
            } catch(e) {
            }
        }

        let switchToMain = false;
        if (tabButton.hasClass('active-tab')) {
            switchToMain = true;
        }

        tabButton.remove();
        if (contentPane.length) contentPane.remove();

        if (switchToMain) {
            switchTab(historyWindow.find('#history-tab-main'));
        } else {
            updateGlobalPinButtonState();
        }

        return true;
     }

    function closeInternalTab(closeButton) {
         const tabButton = closeButton.closest('.chat-history-tab');
         removeTabAndContent(tabButton);
     }

     function handleTabClick(e) {
        if (isDraggingTab || isDraggingMessage || $(e.target).is('.tab-close, .tab-rename-input') || $(e.target).closest('.tab-rename-input').length > 0 ) {
             return;
        }
        switchTab($(e.target).closest('.chat-history-tab'));
    }

     function handleTabDoubleClick(e) {
        const $tabButton = $(e.target).closest('.chat-history-tab');
        if (isDraggingTab || isDraggingMessage || $tabButton.is('#history-tab-main') || $tabButton.find('.tab-rename-input').length > 0 || historyWindow.find('.tab-rename-input').length > 0) {
            return;
        }
        e.preventDefault();
        startTabRename($tabButton);
     }

     function handleTabCloseClick(e) {
         e.stopPropagation();
         closeInternalTab($(e.target));
     }

    function updateGlobalPinButtonState() {
        if (!historyWindow || isMinimized) return;
        const $pinButton = historyWindow.find('#global-pin-button');
        const $activeTab = historyWindow.find('.chat-history-tab.active-tab');

        if (!$activeTab.length || $activeTab.is('#history-tab-main')) {
            $pinButton.prop('disabled', true).attr('title', "Pas d'onglet actif à épingler");
            $pinButton.removeClass('pinned-state unpinned-state');
        } else {
            $pinButton.prop('disabled', false);
            if ($activeTab.hasClass('is-pinned')) {
                $pinButton.addClass('pinned-state').removeClass('unpinned-state');
                $pinButton.attr('title', "Détacher l'onglet actif");
            } else {
                $pinButton.addClass('unpinned-state').removeClass('pinned-state');
                $pinButton.attr('title', "Épingler l'onglet actif");
            }
        }
    }

    function handleGlobalPinClick(e) {
         e.stopPropagation();
         const $pinButton = $(e.target);
         const $activeTab = historyWindow.find('.chat-history-tab.active-tab');

         if (!$activeTab.length || $activeTab.is('#history-tab-main')) {
             return;
         }

         const isPinned = $activeTab.hasClass('is-pinned');
         const persistentId = $activeTab.data('persistent-id');
         const contentId = $activeTab.data('tabid');
         const $contentPane = historyWindow.find(`#${contentId}`);
         const tabName = $activeTab.find('.tab-text').text();

         if (!persistentId || !$contentPane.length) {
             alert("Erreur interne : Impossible de trouver les données pour l'épinglage/détachement.");
             return;
         }

         cancelTabRename(historyWindow.find('.tab-rename-input'));

         let currentPinnedTabs = getPinnedTabs();
         const safeName = $('<div>').text(tabName).html();

         if (isPinned) {
             $activeTab.removeClass('is-pinned');
             $activeTab.attr('title', safeName);
             if (!$activeTab.is('#history-tab-main')) {
                 $activeTab.find('.tab-close').show();
             }
             savePinnedTabs(currentPinnedTabs.filter(tab => tab.id !== persistentId));
             $contentPane.find('.msg .msg-delete-btn').remove();
         } else {
             $activeTab.addClass('is-pinned');
             $activeTab.attr('title', `${safeName} (Épinglé)`);
             $activeTab.find('.tab-close').hide();

             $contentPane.find('.msg').each(function() {
                 const $msg = $(this);
                 if ($msg.find('.msg-delete-btn').length === 0) {
                     $msg.append('<span class="msg-delete-btn" title="Supprimer ce message">×</span>');
                 }
             });

             const newPinData = {
                 id: persistentId,
                 name: tabName,
                 html: $contentPane.html()
             };

             const existingIndex = currentPinnedTabs.findIndex(tab => tab.id === persistentId);
             if (existingIndex > -1) {
                 currentPinnedTabs[existingIndex] = newPinData;
             } else {
                 currentPinnedTabs.push(newPinData);
             }
             updateSinglePinnedTabHtml(persistentId, $contentPane.html());
         }

         updateGlobalPinButtonState();
     }


    function handleSearchContainerClick(e) {
        if ($(e.target).is('.chat-history-search-container, .chat-history-search-input')) {
            historyWindow.find('#chat-history-search-input').trigger('focus');
        }
    }

    function handleSearchInputKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const inputField = $(e.target);
            const searchTerm = inputField.val().trim();
            if (searchTerm) {
                addSearchTag(searchTerm);
            }
        }
    }

    function handleTagRemoveClick(e) {
        e.stopPropagation();
        removeSearchTag($(e.target).closest('.chat-history-search-tag'));
    }

    function addSearchTag(term) {
        if (!historyWindow || !term) return;

        const searchContainer = historyWindow.find('#chat-history-search-container');
        const searchInput = historyWindow.find('#chat-history-search-input');

        let tagType = 'fixed_term';
        let tagValue = term;
        let tagDisplay = term;
        const termLower = term.toLowerCase();

        if (termLower.startsWith('de:') && term.length > 3) {
            tagType = 'de';
            tagValue = term.substring(3).trim();
            tagDisplay = `de:${tagValue}`;
        }

        const escapedValue = $('<div/>').text(tagValue).html();
        const escapedDisplay = $('<div/>').text(tagDisplay).html();

        const $tag = $(`
            <div class="chat-history-search-tag" data-type="${tagType}" data-value="${escapedValue}">
                <span class="chat-history-search-tag-text">${escapedDisplay}</span>
                <span class="chat-history-search-tag-remove" title="Supprimer ce filtre">×</span>
            </div>`);

        $tag.insertBefore(searchInput);
        searchInput.val('');
        handleSearch();
    }

    function removeSearchTag(tagElement) {
        if (tagElement && tagElement.length) {
            tagElement.remove();
            handleSearch();
        }
    }

    function messageMatchesText($msg, searchText) {
        if (!searchText) return true;

        const searchTextLower = searchText.toLowerCase();
        let isDeFilterActive = false;
        let filterName = '';

        if (searchTextLower.startsWith('de:') && searchText.length > 3) {
            filterName = searchText.substring(3).trim();
            if (filterName) {
                isDeFilterActive = true;
            }
        }

        const msgRawTextLower = ($msg.data('raw-text') || '').toLowerCase();
        const msgSearchDate = ($msg.data('search-date') || '');

        if (isDeFilterActive) {
            if (msgRawTextLower.startsWith(filterName.toLowerCase())) {
                return true;
            }
        } else {
            if (msgRawTextLower.includes(searchTextLower)) {
                return true;
            }
             if (msgSearchDate && msgSearchDate.includes(searchText)) {
                return true;
             }
        }

        if (!isDeFilterActive) {
            if (currentTimestampState === TIMESTAMP_STATE_FULL) {
                const msgTimestampText = ($msg.find('.full-timestamp').text() || '');
                if (msgTimestampText && msgTimestampText.toLowerCase().includes(searchTextLower)) {
                    return true;
                }
            }
            if (currentTimestampState === TIMESTAMP_STATE_FULL || currentTimestampState === TIMESTAMP_STATE_GAMEONLY) {
                const msgMomentText = ($msg.find('.moment').text() || '');
                if (msgMomentText && msgMomentText.toLowerCase().includes(searchTextLower)) {
                    return true;
                }
            }
        }


        return false;
    }

    function handleSearch() {
        if (!historyWindow || isMinimized) return;

        const searchContainer = historyWindow.find('#chat-history-search-container');
        const searchInput = historyWindow.find('#chat-history-search-input');
        const activeContentArea = historyWindow.find('.chat-history-content.active-content');

        if (!activeContentArea.length) return;

        const activeTags = [];
        searchContainer.find('.chat-history-search-tag').each(function() {
            const $tag = $(this);
            activeTags.push({
                type: $tag.data('type'),
                value: $tag.data('value')
            });
        });

        const currentInputText = searchInput.val().trim();

        activeContentArea.find('.msg').each(function() {
            const $msg = $(this);
            let messageMatchesAllCriteria = true;

            if (activeTags.length > 0) {
                for (const tag of activeTags) {
                    let tagMatches = false;
                    const msgRawTextLower = ($msg.data('raw-text') || '').toLowerCase();
                    const tagValueLower = tag.value.toLowerCase();

                    switch (tag.type) {
                        case 'de':
                            if (msgRawTextLower.startsWith(tagValueLower)) {
                                tagMatches = true;
                            }
                            break;

                        case 'fixed_term':
                            if (msgRawTextLower.includes(tagValueLower)) {
                                tagMatches = true;
                                break;
                            }
                            if (currentTimestampState === TIMESTAMP_STATE_FULL) {
                                const msgTimestampTextLower = ($msg.find('.full-timestamp').text() || '').toLowerCase();
                                if (msgTimestampTextLower && msgTimestampTextLower.includes(tagValueLower)) {
                                    tagMatches = true;
                                    break;
                                }
                            }
                            if (currentTimestampState === TIMESTAMP_STATE_FULL || currentTimestampState === TIMESTAMP_STATE_GAMEONLY) {
                                const msgMomentTextLower = ($msg.find('.moment').text() || '').toLowerCase();
                                if (msgMomentTextLower && msgMomentTextLower.includes(tagValueLower)) {
                                    tagMatches = true;
                                    break;
                                }
                            }
                             const msgSearchDate = ($msg.data('search-date') || '');
                              if (msgSearchDate && msgSearchDate.includes(tagValueLower)) {
                                  tagMatches = true;
                                  break;
                              }
                            break;
                    }

                    if (!tagMatches) {
                        messageMatchesAllCriteria = false;
                        break;
                    }
                }
            }

            if (messageMatchesAllCriteria && currentInputText) {
                if (!messageMatchesText($msg, currentInputText)) {
                    messageMatchesAllCriteria = false;
                }
            }

            if (messageMatchesAllCriteria) {
                $msg.removeClass('search-hidden');
            } else {
                $msg.addClass('search-hidden');
            }
        });
    }


     function handleCopyTabContent(e) {
        if (!historyWindow) return;
        const $button = $(e.target);
        const activeContentPane = historyWindow.find('.chat-history-content.active-content');

        if (!activeContentPane.length) {
            return;
        }

        let textLines = [];
        activeContentPane.find('.msg:not(.search-hidden)').each(function() {
            const $msg = $(this);
            let lineParts = [];

            if (currentTimestampState === TIMESTAMP_STATE_FULL || currentTimestampState === TIMESTAMP_STATE_GAMEONLY) {
                const $moment = $msg.find('.moment');
                if ($moment.length > 0) {
                    const momentText = $moment.text().trim();
                    if (momentText) {
                        lineParts.push(momentText);
                    }
                }
            }

            const rawText = $msg.data('raw-text');
            if (rawText) {
                lineParts.push(rawText);
            } else {
                let fallbackText = '';
                $msg.contents().each(function() {
                    if (!$(this).is('.moment, .full-timestamp, .msg-delete-btn')) {
                         fallbackText += (this.nodeType === 3 ? this.textContent : $(this).text());
                    }
                });
                lineParts.push(fallbackText.trim());
            }

            if (currentTimestampState === TIMESTAMP_STATE_FULL) {
                const $timestamp = $msg.find('.full-timestamp');
                if ($timestamp.length > 0) {
                    const timestampText = $timestamp.text().trim();
                     if (timestampText) {
                        lineParts.push(`[${timestampText}]`);
                    }
                }
            }

            textLines.push(lineParts.join(' ').trim());
        });

        const textToCopy = textLines.join('\n');

        if (!textToCopy) {
            alert("Aucun message visible à copier.");
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalIcon = $button.text();
            const originalColor = $button.css('color');
            $button.text('✅').css('color', 'lightgreen');
            setTimeout(() => { $button.text(originalIcon).css('color', originalColor); }, 1500);
        }).catch(err => {
            alert('Erreur copie vers clipboard:\n' + err);
            const originalIcon = $button.text();
            const originalColor = $button.css('color');
            $button.text('❌').css('color', 'salmon');
            setTimeout(() => { $button.text(originalIcon).css('color', originalColor); }, 2500);
        });
    }

    function handleMessageClick(e) {
        if (isDragging || isResizing || isDraggingTab || isDraggingMessage || $(e.target).hasClass('msg-delete-btn') || $(e.target).hasClass('full-timestamp') || $(e.target).hasClass('moment')) return;
        $(e.currentTarget).toggleClass('selected-message');
    }

    function handleMessageDeleteClick(e) {
        e.stopPropagation();
        const $deleteButton = $(e.target);
        const $msg = $deleteButton.closest('.msg');
        const $pane = $msg.closest('.chat-history-content');
        const $tabButton = historyWindow.find(`.chat-history-tab[data-tabid="${$pane.attr('id')}"]`);
        const persistentId = $tabButton.data('persistent-id');

        if (!$msg.length || !$pane.length || !$tabButton.length) return;

        if ($pane.attr('id') === 'history-content-main') return;

        $msg.remove();

        if ($tabButton.hasClass('is-pinned') && persistentId) {
             updateSinglePinnedTabHtml(persistentId, $pane.html());
        }
    }


    function toggleSelectAllVisibleMessages() {
        if (!historyWindow || isMinimized) return;

        const activeContentPane = historyWindow.find('.chat-history-content.active-content');
        const $visibleMessages = activeContentPane.find('.msg:not(.search-hidden)');

        if ($visibleMessages.length === 0) return;

        const $selectedVisibleMessages = $visibleMessages.filter('.selected-message');

        if ($visibleMessages.length === $selectedVisibleMessages.length) {
            $visibleMessages.removeClass('selected-message');
        } else {
            $visibleMessages.addClass('selected-message');
        }
    }

    function startTabRename($tabButton) {
        const $tabTextSpan = $tabButton.find('.tab-text');
        const currentName = $tabTextSpan.text();

        $tabTextSpan.hide();
        const $input = $('<input type="text" class="tab-rename-input">')
            .val(currentName)
            .insertAfter($tabTextSpan)
            .on('blur', function() {
                finishTabRename($(this));
            })
            .on('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    finishTabRename($(this));
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelTabRename($(this));
                }
            });

        const approxCharWidth = 6;
        const minInputWidth = 50;
        const closeButtonWidth = ($tabButton.find('.tab-close').outerWidth(true) || 0);
        const paddingAndBorders = 10;
        const availableWidth = $tabButton.width() - closeButtonWidth - paddingAndBorders;
        const calculatedWidth = Math.max(minInputWidth, Math.min(availableWidth > minInputWidth ? availableWidth : 100 , currentName.length * approxCharWidth + paddingAndBorders));
        $input.width(calculatedWidth);

        setTimeout(() => $input.trigger('focus').trigger('select'), 0);
     }

     function finishTabRename($input) {
         if (!$input || $input.length === 0 || !$input.is(':visible')) return;

         const $tabButton = $input.closest('.chat-history-tab');
         const $tabTextSpan = $tabButton.find('.tab-text');
         const oldName = $tabTextSpan.text();
         const newName = $input.val().trim();
         const persistentId = $tabButton.data('persistent-id');

         $input.remove();
         $tabTextSpan.show();

         if (newName && newName !== oldName) {
             const safeNewName = $('<div>').text(newName).html();
             $tabTextSpan.text(newName);
             if ($tabButton.hasClass('is-pinned')) {
                 $tabButton.attr('title', `${safeNewName} (Épinglé)`);
             } else {
                 $tabButton.attr('title', safeNewName);
             }


             if ($tabButton.hasClass('is-pinned') && persistentId) {
                 try {
                     let currentPinnedTabs = getPinnedTabs();
                     const existingIndex = currentPinnedTabs.findIndex(tab => tab.id === persistentId);
                     if (existingIndex > -1) {
                         currentPinnedTabs[existingIndex].name = newName;
                         savePinnedTabs(currentPinnedTabs);
                     }
                 } catch (e) {
                 }
             }
         }
         updateGlobalPinButtonState();
     }

     function cancelTabRename($input) {
         if (!$input || $input.length === 0 || !$input.is(':visible')) return;

         const $tabButton = $input.closest('.chat-history-tab');
         const $tabTextSpan = $tabButton.find('.tab-text');

         $input.remove();
         $tabTextSpan.show();
     }

     function startDrag(e) {
        if (isMinimized || isDraggingTab || isDraggingMessage || !historyWindow || $(e.target).closest('.chat-history-search-container, .chat-history-header-controls').length > 0 ) {
            return;
        }
        e.preventDefault();
        isDragging = true;
        if(historyWindow) historyWindow.find('.chat-history-header').css('user-select', 'none');
        dragOffsetX = e.clientX - historyWindow[0].offsetLeft;
        dragOffsetY = e.clientY - historyWindow[0].offsetTop;
        $(document).on('mousemove.historydrag', doDrag).on('mouseup.historydrag', stopDrag);
    }
    function doDrag(e) {
        if (!isDragging || !historyWindow) return;
        e.preventDefault();
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
        historyWindow.css({ left: newX + 'px', top: newY + 'px' });
    }
    function stopDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        if(historyWindow) historyWindow.find('.chat-history-header').css('user-select', '');
        $(document).off('.historydrag');
    }

    function startResize(e) {
        if (!historyWindow || isMinimized || isDraggingTab || isDraggingMessage) return;
        e.preventDefault();
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        initialWidth = historyWindow[0].offsetWidth;
        initialHeight = historyWindow[0].offsetHeight;
        $(document).on('mousemove.historyresize', doResize).on('mouseup.historyresize', stopResize);
    }
    function doResize(e) {
        if (!isResizing || !historyWindow) return;
        e.preventDefault();
        let newWidth = initialWidth + (e.clientX - resizeStartX);
        let newHeight = initialHeight + (e.clientY - resizeStartY);
        newWidth = Math.max(MIN_WINDOW_WIDTH, newWidth);
        newHeight = Math.max(isMinimized ? 0 : MIN_WINDOW_HEIGHT, newHeight);
        historyWindow.css({ width: newWidth + 'px', height: newHeight + 'px' });
    }
    function stopResize(e) {
        if (!isResizing) return;
        isResizing = false;
        $(document).off('.historyresize');
    }


    function handleTabDragStart(e) {
        const $draggedTab = $(e.currentTarget);
        if ($draggedTab.is('#history-tab-main')) {
            e.preventDefault();
            return;
        }

        isDraggingTab = true;
        isDraggingMessage = false;
        draggedTabInfo = {
            buttonId: $draggedTab.attr('id'),
            contentId: $draggedTab.data('tabid'),
            persistentId: $draggedTab.data('persistent-id')
        };

        try {
            e.originalEvent.dataTransfer.setData(TAB_DRAG_TYPE, draggedTabInfo.buttonId);
            e.originalEvent.dataTransfer.effectAllowed = 'copy';
        } catch (err) {
             e.preventDefault();
             isDraggingTab = false;
             draggedTabInfo = null;
             return;
        }

        setTimeout(() => {
            if (isDraggingTab) {
                 $draggedTab.addClass('dragging-tab');
            }
        }, 0);
    }

    function handleMessageDragStart(e) {
        const $draggedMessage = $(e.currentTarget);
        const $sourcePane = $draggedMessage.closest('.chat-history-content');

        if (!$sourcePane.length) {
            e.preventDefault();
            return;
        }

        if (!$draggedMessage.hasClass('selected-message')) {
            $sourcePane.find('.msg.selected-message').removeClass('selected-message');
            $draggedMessage.addClass('selected-message');
        }

        const $selectedMessages = $sourcePane.find('.msg.selected-message:not(.search-hidden)');

        if ($selectedMessages.length === 0) {
            e.preventDefault();
            return;
        }

        isDraggingMessage = true;
        isDraggingTab = false;
        draggedMessageInfo = {
            sourcePaneId: $sourcePane.attr('id'),
            count: $selectedMessages.length
        };

        try {
            e.originalEvent.dataTransfer.setData(MESSAGE_DRAG_TYPE, draggedMessageInfo.sourcePaneId);
            e.originalEvent.dataTransfer.effectAllowed = 'copy';
        } catch (err) {
             e.preventDefault();
             isDraggingMessage = false;
             draggedMessageInfo = null;
             return;
        }

        setTimeout(() => {
            if (isDraggingMessage) {
                $selectedMessages.addClass('dragging-message');
            }
        }, 0);
    }


    function handleTabOrContentDragOver(e) {
        e.preventDefault();
        const $targetElement = $(e.currentTarget);
        const dataTransfer = e.originalEvent.dataTransfer;

        if(!$targetElement.hasClass('drag-over-tab-for-message') && !$targetElement.hasClass('drag-over-content')){
            if(historyWindow) {
                historyWindow.find('.drag-over-tab-for-message').removeClass('drag-over-tab-for-message');
                historyWindow.find('.drag-over-content').removeClass('drag-over-content');
            }
        }


        if (isDraggingTab) {
            if ($targetElement.hasClass('chat-history-tab') &&
                !$targetElement.is('#history-tab-main') &&
                draggedTabInfo && $targetElement.attr('id') !== draggedTabInfo.buttonId)
            {
                dataTransfer.dropEffect = 'copy';
                $targetElement.addClass('drag-over-tab-for-message');
            } else {
                dataTransfer.dropEffect = 'none';
                $targetElement.removeClass('drag-over-tab-for-message');
            }
        } else if (isDraggingMessage) {
             let isValidTarget = false;
             if ($targetElement.hasClass('chat-history-tab') && !$targetElement.is('#history-tab-main')) {
                const targetContentId = $targetElement.data('tabid');
                 if(targetContentId !== draggedMessageInfo?.sourcePaneId) {
                     isValidTarget = true;
                     $targetElement.removeClass('drag-over-content');
                     $targetElement.addClass('drag-over-tab-for-message');
                 }
             } else if ($targetElement.hasClass('chat-history-content') && $targetElement.attr('id') !== 'history-content-main') {
                 if($targetElement.attr('id') !== draggedMessageInfo?.sourcePaneId) {
                     isValidTarget = true;
                     $targetElement.removeClass('drag-over-tab-for-message');
                     $targetElement.addClass('drag-over-content');
                 }
             }

             if(isValidTarget) {
                 dataTransfer.dropEffect = 'copy';
             } else {
                 dataTransfer.dropEffect = 'none';
                 $targetElement.removeClass('drag-over-tab-for-message drag-over-content');
             }
        } else {
            dataTransfer.dropEffect = 'none';
            $targetElement.removeClass('drag-over-tab-for-message drag-over-content');
        }
    }

     function handleTabOrContentDragEnter(e) {
        e.preventDefault();
        handleTabOrContentDragOver(e);
    }

    function handleTabOrContentDragLeave(e) {
        const $targetElement = $(e.currentTarget);
        const related = e.relatedTarget || e.originalEvent.relatedTarget;
        if (!related || (related !== e.currentTarget && !$.contains(e.currentTarget, related))) {
             $targetElement.removeClass('drag-over-tab-for-message drag-over-content');
        }
    }


    function handleTabOrContentDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const $targetElement = $(e.currentTarget);
        const dataTransfer = e.originalEvent.dataTransfer;

        if(historyWindow) {
            historyWindow.find('.drag-over-tab-for-message').removeClass('drag-over-tab-for-message');
            historyWindow.find('.drag-over-content').removeClass('drag-over-content');
        }

        if (isDraggingTab && dataTransfer.types.includes(TAB_DRAG_TYPE)) {
            const $dropTargetTab = $targetElement.closest('.chat-history-tab');

            if (!$dropTargetTab.length || $dropTargetTab.is('#history-tab-main')) {
                return;
            }

            const draggedButtonId = dataTransfer.getData(TAB_DRAG_TYPE);
            const targetButtonId = $dropTargetTab.attr('id');

            if (!draggedButtonId || draggedButtonId === targetButtonId) {
                 return;
            }

            if (!confirm("Copier le contenu de l'onglet glissé dans cet onglet ? (L'onglet source restera ouvert)")) {
                return;
            }
            performTabContentCopy(draggedButtonId, $dropTargetTab);

        } else if (isDraggingMessage && dataTransfer.types.includes(MESSAGE_DRAG_TYPE)) {
            let $targetPane;
            let targetTabPersistentId = null;
            let $targetTabButton = null;

            if ($targetElement.hasClass('chat-history-tab')) {
                 if ($targetElement.is('#history-tab-main')) return;
                 $targetTabButton = $targetElement;
                 const targetContentId = $targetTabButton.data('tabid');
                 $targetPane = historyWindow.find(`#${targetContentId}`);
                 targetTabPersistentId = $targetTabButton.data('persistent-id');
            } else if ($targetElement.hasClass('chat-history-content')) {
                 if ($targetElement.attr('id') === 'history-content-main') return;
                 $targetPane = $targetElement;
                 const targetContentId = $targetPane.attr('id');
                 $targetTabButton = historyWindow.find(`.chat-history-tab[data-tabid="${targetContentId}"]`);
                 if ($targetTabButton.length) {
                     targetTabPersistentId = $targetTabButton.data('persistent-id');
                 }
            } else {
                 const $closestPane = $targetElement.closest('.chat-history-content');
                 if ($closestPane.length && $closestPane.attr('id') !== 'history-content-main') {
                     $targetPane = $closestPane;
                     const targetContentId = $targetPane.attr('id');
                     $targetTabButton = historyWindow.find(`.chat-history-tab[data-tabid="${targetContentId}"]`);
                     if ($targetTabButton.length) {
                         targetTabPersistentId = $targetTabButton.data('persistent-id');
                     }
                 } else {
                    return;
                 }
            }

            if (!$targetPane || $targetPane.length === 0 || !$targetTabButton || $targetTabButton.length === 0) {
                 return;
            }

            const sourcePaneId = dataTransfer.getData(MESSAGE_DRAG_TYPE);
            if (!sourcePaneId || !draggedMessageInfo || sourcePaneId === $targetPane.attr('id')) {
                return;
            }
            const $sourcePane = historyWindow.find(`#${sourcePaneId}`);
            if (!$sourcePane || $sourcePane.length === 0) {
                 return;
            }

            performMessageCopy($sourcePane, $targetPane, $targetTabButton);

        }
    }

    function performTabContentCopy(draggedButtonId, $targetTabButton) {
        const $draggedTabButton = historyWindow.find(`#${draggedButtonId}`);
        const draggedContentId = $draggedTabButton.data('tabid');
        const targetContentId = $targetTabButton.data('tabid');
        const $draggedContent = historyWindow.find(`#${draggedContentId}`);
        const $targetContent = historyWindow.find(`#${targetContentId}`);
        const targetPersistentId = $targetTabButton.data('persistent-id');
        const targetIsPinned = $targetTabButton.hasClass('is-pinned');

        if (!$draggedTabButton.length || !$targetTabButton.length || !$draggedContent.length || !$targetContent.length) {
            alert("Erreur interne lors de la copie du contenu de l'onglet.");
            return;
        }


        const existingMessagesText = new Set();
        $targetContent.find('.msg').each(function() {
            const rawText = $(this).data('raw-text');
            const timestamp = $(this).data('timestamp');
            if (rawText !== undefined && timestamp !== undefined) {
                existingMessagesText.add(`${timestamp}_${rawText}`);
            }
        });

        let messagesAddedCount = 0;
        let messagesSkippedCount = 0;
        const $messagesToCopy = $draggedContent.find('.msg');


        $messagesToCopy.each(function(index) {
            const $messageToCopy = $(this);
            const rawTextToCopy = $messageToCopy.data('raw-text');
            const timestampToCopy = $messageToCopy.data('timestamp');
            const uniqueKey = `${timestampToCopy}_${rawTextToCopy}`;

            if (rawTextToCopy !== undefined && timestampToCopy !== undefined && !existingMessagesText.has(uniqueKey)) {
                 const $clonedMsg = $messageToCopy.clone(true, true)
                                        .removeClass('selected-message dragging-message search-hidden');

                 prepareMessageElement($clonedMsg, null, targetIsPinned);

                 $targetContent.append($clonedMsg);
                 existingMessagesText.add(uniqueKey);
                 messagesAddedCount++;
            } else {
                 messagesSkippedCount++;
            }
        });

        if (messagesAddedCount > 0) {
            $targetContent.scrollTop($targetContent[0].scrollHeight);
            if (targetIsPinned && targetPersistentId) {
                updateSinglePinnedTabHtml(targetPersistentId, $targetContent.html());
            }
             if ($targetTabButton.hasClass('active-tab')) {
                 handleSearch();
             }
        }
    }


     function performMessageCopy($sourcePane, $targetPane, $targetTabButton) {
        const $messagesToCopy = $sourcePane.find('.msg.selected-message:not(.search-hidden)');

        if ($messagesToCopy.length === 0 || !$targetTabButton || $targetTabButton.length === 0) {
            return;
        }

        const targetIsPinned = $targetTabButton.hasClass('is-pinned');
        const targetPersistentId = $targetTabButton.data('persistent-id');


        const existingMessagesText = new Set();
        $targetPane.find('.msg').each(function() {
            const rawText = $(this).data('raw-text');
             const timestamp = $(this).data('timestamp');
            if (rawText !== undefined && timestamp !== undefined) {
                existingMessagesText.add(`${timestamp}_${rawText}`);
            }
        });

        let messagesAddedCount = 0;
        let messagesSkippedCount = 0;

        $messagesToCopy.each(function() {
            const $messageToCopy = $(this);
            const rawTextToCopy = $messageToCopy.data('raw-text');
             const timestampToCopy = $messageToCopy.data('timestamp');
             const uniqueKey = `${timestampToCopy}_${rawTextToCopy}`;


            if (rawTextToCopy === undefined || timestampToCopy === undefined) {
                messagesSkippedCount++;
                return;
            }

            if (existingMessagesText.has(uniqueKey)) {
                messagesSkippedCount++;
            } else {
                const $clonedMsg = $messageToCopy.clone(true, true)
                                          .removeClass('selected-message dragging-message');
                 prepareMessageElement($clonedMsg, null, targetIsPinned);

                $targetPane.append($clonedMsg);
                existingMessagesText.add(uniqueKey);
                messagesAddedCount++;
            }
        });


        if (messagesAddedCount > 0) {
            $targetPane.scrollTop($targetPane[0].scrollHeight);

            if (targetIsPinned && targetPersistentId) {
                 updateSinglePinnedTabHtml(targetPersistentId, $targetPane.html());
            }
            if ($targetTabButton.hasClass('active-tab')) {
                handleSearch();
            }
        }
    }


     function handleTabDragEnd(e) {
        if (!isDraggingTab) return;

        if (draggedTabInfo && draggedTabInfo.buttonId && historyWindow) {
            historyWindow.find(`#${draggedTabInfo.buttonId}`).removeClass('dragging-tab');
        }
        if(historyWindow) {
             historyWindow.find('.drag-over-tab-for-message').removeClass('drag-over-tab-for-message');
             historyWindow.find('.drag-over-content').removeClass('drag-over-content');
        }

        isDraggingTab = false;
        draggedTabInfo = null;
    }

    function handleMessageDragEnd(e) {
        if (!isDraggingMessage) return;

        if (draggedMessageInfo && historyWindow) {
            const $sourcePane = historyWindow.find(`#${draggedMessageInfo.sourcePaneId}`);
            if ($sourcePane.length) {
                $sourcePane.find('.msg.dragging-message').removeClass('dragging-message');
            } else {
                 historyWindow.find('.msg.dragging-message').removeClass('dragging-message');
            }
            historyWindow.find('.drag-over-tab-for-message').removeClass('drag-over-tab-for-message');
            historyWindow.find('.drag-over-content').removeClass('drag-over-content');
        }

        isDraggingMessage = false;
        draggedMessageInfo = null;
    }

    function getStorageKey(roomId) {
        return `${STORAGE_PREFIX}${roomId}`;
    }
    function getStoredMessages(roomId) {
        if (!roomId) return [];
        const key = getStorageKey(roomId);
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            localStorage.removeItem(key);
            return [];
        }
    }
    function saveMessage(roomId, messageData) {
        if (!roomId || !messageData || !messageData.html) {
            return;
        }
        const key = getStorageKey(roomId);
        let messages;
        try {
             messages = getStoredMessages(roomId);
        } catch (e) {
             messages = [];
        }

        messageData.timestamp = Date.now();
        messageData.roomId = roomId;

        messages.push(messageData);

        const cutoffTime = Date.now() - HISTORY_DURATION_MS;
        messages = messages.filter(msg => msg.timestamp >= cutoffTime);

        if (messages.length > MAX_MESSAGES_PER_ROOM) {
            messages = messages.slice(messages.length - MAX_MESSAGES_PER_ROOM);
        }

        try {
            localStorage.setItem(key, JSON.stringify(messages));
        } catch (e) {
        }
    }


     function parseMessageElement(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE || !node.classList.contains('msg')) {
            return null;
        }
        const $nodeClone = $(node).clone();
        $nodeClone.find('.msg-delete-btn').remove();
        const messageData = {
            html: $nodeClone[0].outerHTML,
            originalTimestampText: $(node).find('.moment').text()
        };
        return messageData;
    }

    function prepareMessageElement($msg, timestamp, addDeleteButton = false) {
        if (!$msg || $msg.length === 0) return;

        const currentTimestamp = timestamp || $msg.data('timestamp') || Date.now();
        const formattedTimestamp = formatTimestampEU(currentTimestamp);
        const searchDate = formatSearchDateEU(currentTimestamp);

        $msg.attr('data-timestamp', currentTimestamp);
        $msg.attr('data-search-date', searchDate);
        $msg.attr('draggable', 'true');

        $msg.find('[onmouseover]').removeAttr('onmouseover').removeAttr('onmouseout');
        $msg.find('.linkable').removeAttr('onclick').css('cursor', 'default');

        if (!$msg.attr('data-raw-text')) {
            let rawText = '';
            $msg.contents().each(function() {
                if (!$(this).is('.moment, .full-timestamp, .msg-delete-btn')) {
                    rawText += (this.nodeType === 3 ? this.textContent : $(this).text());
                }
            });
            $msg.attr('data-raw-text', rawText.trim());
        }

        let $fullTimestamp = $msg.find('.full-timestamp');
        if (formattedTimestamp) {
             if ($fullTimestamp.length === 0) {
                 $fullTimestamp = $(`<span class="full-timestamp">${formattedTimestamp}</span>`);
                 $msg.append($fullTimestamp);
             } else {

                 $fullTimestamp.text(formattedTimestamp).appendTo($msg);
             }
        } else if ($fullTimestamp.length > 0) {
            $fullTimestamp.remove();
        }

        if (addDeleteButton) {
            if ($msg.find('.msg-delete-btn').length === 0) {
                $msg.append('<span class="msg-delete-btn" title="Supprimer ce message">×</span>');
            }
        } else {
             $msg.find('.msg-delete-btn').remove();
        }
    }

    function appendMessageToPane($pane, messageData, addDeleteButton) {
        if (!$pane || $pane.length === 0 || !messageData || !messageData.html) return false;

        try {
            const $msg = $(messageData.html);
             const paneId = $pane.attr('id');
             const $tabButton = historyWindow.find(`.chat-history-tab[data-tabid="${paneId}"]`);
             const shouldAddDeleteBtn = $tabButton.length > 0 && $tabButton.hasClass('is-pinned');

            prepareMessageElement($msg, messageData.timestamp, shouldAddDeleteBtn);
            $pane.append($msg);
            return true;
        } catch (parseError) {
            $pane.append($('<div>').text(`[Error displaying message]`).css('color', 'red'));
            return false;
        }
    }


    function observeChat() {
        const chatContent = document.getElementById('chatContent');
        if (!chatContent) {
            return;
        }

        const observer = new MutationObserver(mutations => {
            const el = chatContent;
            const isScrolledToBottom = el.scrollHeight - el.clientHeight <= el.scrollTop + 50;

            const currentRoomId = getCurrentRoomId();
            let messageAddedToHistoryTab = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if(node.nodeType === Node.ELEMENT_NODE && (node.id === 'local-chat-history-float-btn' || node.id === 'chat-history-window')) {
                        return;
                    }

                    const messageData = parseMessageElement(node);

                    if (messageData && currentRoomId) {
                        saveMessage(currentRoomId, messageData);

                        if (historyWindow && !isMinimized) {
                             const mainContentPane = historyWindow.find('#history-content-main');
                             if (mainContentPane.length) {
                                 const historyNearBottom = mainContentPane[0].scrollHeight - mainContentPane[0].clientHeight <= mainContentPane[0].scrollTop + 100;

                                 if (appendMessageToPane(mainContentPane, messageData)) {
                                     messageAddedToHistoryTab = true;

                                     if (historyNearBottom) {
                                          mainContentPane.scrollTop(mainContentPane[0].scrollHeight);
                                     }
                                 }
                             }
                        }
                    }
                });
            });

            if (messageAddedToHistoryTab && historyWindow && !isMinimized && historyWindow.find('#history-tab-main').hasClass('active-tab')) {
                 handleSearch();
            }

            if(isScrolledToBottom) {
                 el.scrollTop = el.scrollHeight;
            }
        });

        observer.observe(chatContent, { childList: true });
    }

     function initialize() {
        addWindowStyles();
        addFloatingButton();
        observeChat();

        $(window).on('resize.holovisionPosition', function() {
             clearTimeout(window.holovisionResizeTimer);
             window.holovisionResizeTimer = setTimeout(updateButtonPosition, 100);
        });

        setTimeout(updateButtonPosition, 500);
    }

    let attempts = 0;
    const maxAttempts = 80;
    const initInterval = setInterval(() => {
        attempts++;
        if (typeof $ !== 'undefined' && $('#chatContent').length > 0 && $('#onglets_chat').length > 0) {
            clearInterval(initInterval);
            try {
                initialize();
            } catch (e) {
            }
        } else if (attempts > maxAttempts) {
            clearInterval(initInterval);
        }
    }, 200);

})();