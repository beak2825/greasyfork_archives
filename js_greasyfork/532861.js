// ==UserScript==
// @name         Torn Chat 3.0 Integrated Search Feature
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @version      1.2
// @description  Adds search to Torn Chats.
// @author       TR0LL [2561502]
// @license      CC BY-SA 4.0
// @match        *://*.torn.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532861/Torn%20Chat%2030%20Integrated%20Search%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/532861/Torn%20Chat%2030%20Integrated%20Search%20Feature.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_ID = 'chat-3-0-search';
    const PANEL_ID = `${SCRIPT_ID}-panel`;
    const FOOTER_BUTTON_ID = `${SCRIPT_ID}-footer-button`;
    const FACTION_ID_STORAGE_KEY = 'chatHelper_factionId_v2';

    const config = {
        panelVisible: false,
        panelPosition: { top: '20px', right: '20px', left: 'auto' },
        targetChatIdRegex: /^(public_global$|public_trade$|public_company$|public_poker$|public_staff$|private-\d+-\d+|company-\d+|poker-|staff-)$/,
        chatWindowSelector: `#chatRoot [class*="root___"][class*="visible___"]`,
        chatListSelector: `div[class*="list___"]`,
        messageGroupSelector: `div[class*="root___r_1Ra"]`,
        messageTextSelector: `span[class*="message___pRfWR"] span[class*="root___Xw4jI"]`,
        senderSelector: `a[class*="sender___"]`,
        timestampSelector: `[class*="messageGroupTimestamp___"]`,
        chatFooterBarSelector: 'div[class*="root___oWxEV"]',
        inputAreaContainerSelector: 'div[class*="root___WUd1h"]',
        chatHeaderClass: '[class*="root___"][class*="header___"]',
        chatWindowTitleClass: '[class*="title___"]',
        RETRY_INTERVAL_MS: 3000,
        FOOTER_BUTTON_CHECK_INTERVAL_MS: 3000,
        WAIT_FOR_ELEMENT_TIMEOUT_MS: 5000,
        INITIAL_SCAN_DELAY_MS: 1500,
    };

    let enhancedPanel = null;
    let dragOffsetX, dragOffsetY;
    let activeChatWindows = {};
    let currentSearchResults = [];
    let currentSearchDetails = { query: '', chatId: '', chatName: '' };
    let forceSearchContainer = {};
    let storedFactionId = null;

    function saveSettings() {
        try {
            const settingsToSave = {
                panelPosition: (enhancedPanel && enhancedPanel.style.left !== 'auto' && enhancedPanel.style.top) ? { top: enhancedPanel.style.top, left: enhancedPanel.style.left } : config.panelPosition
            };
            GM_setValue('chatEnhancerSettings_v3_pos_only', JSON.stringify(settingsToSave));
        } catch (error) {
            console.error("EnhancedChat: Error saving settings:", error);
        }
    }
    function loadSettings() {
        try {
            const savedSettings = GM_getValue('chatEnhancerSettings_v3_pos_only');
            if (!savedSettings) return;
            const loadedSettings = JSON.parse(savedSettings);
            if (!loadedSettings || typeof loadedSettings !== 'object') return;
            if (loadedSettings.panelPosition) {
                 if (typeof loadedSettings.panelPosition.top === 'string' && loadedSettings.panelPosition.top !== 'auto' &&
                     typeof loadedSettings.panelPosition.left === 'string' && loadedSettings.panelPosition.left !== 'auto')
                 {
                     config.panelPosition = {
                         top: loadedSettings.panelPosition.top,
                         left: loadedSettings.panelPosition.left,
                         right: 'auto',
                         bottom: 'auto'
                     };
                 } else {
                     config.panelPosition = {
                         top: loadedSettings.panelPosition.top || 'auto',
                         bottom: loadedSettings.panelPosition.bottom || '60px',
                         left: loadedSettings.panelPosition.left || '20px',
                         right: loadedSettings.panelPosition.right || 'auto'
                     };
                     if(config.panelPosition.top !== 'auto') config.panelPosition.bottom = 'auto';
                     if(config.panelPosition.left !== 'auto') config.panelPosition.right = 'auto';
                 }
            }
        } catch (error) {
            console.error("EnhancedChat: Error loading settings:", error);
            config.panelPosition = { top: 'auto', bottom: '60px', left: '20px', right: 'auto' };
        }
    }
    function parseTimestampText(text) { if (!text) return null; const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1); text = text.trim(); const timeParts = (match) => ({ hours: parseInt(match[1], 10), minutes: parseInt(match[2], 10), seconds: match[3] ? parseInt(match[3], 10) : 0 }); const dateParts = (match) => ({ day: parseInt(match[1], 10), month: parseInt(match[2], 10) - 1, year: 2000 + parseInt(match[3], 10) }); if (text.startsWith('Today')) { const timeMatch = text.match(/Today (\d{1,2}):(\d{2})(?::(\d{2}))?/); if (timeMatch) { const { hours, minutes, seconds } = timeParts(timeMatch); const date = new Date(today); date.setHours(hours, minutes, seconds); return date; } return today; } if (text.startsWith('Yesterday')) { const timeMatch = text.match(/Yesterday (\d{1,2}):(\d{2})(?::(\d{2}))?/); if (timeMatch) { const { hours, minutes, seconds } = timeParts(timeMatch); const date = new Date(yesterday); date.setHours(hours, minutes, seconds); return date; } return yesterday; } const dateTimeMatch = text.match(/^(\d{2}):(\d{2}):(\d{2})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{2})$/); if (dateTimeMatch) { try { const { hours, minutes, seconds } = timeParts(dateTimeMatch); const { day, month, year } = dateParts(dateTimeMatch.slice(4)); const date = new Date(year, month, day, hours, minutes, seconds); if (!isNaN(date) && date.getMonth() === month) return date; } catch (e) {} } const simpleDateMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/); if (simpleDateMatch) { try { const { day, month, year } = dateParts(simpleDateMatch); const date = new Date(year, month, day); if (!isNaN(date) && date.getMonth() === month) return date; } catch (e) {} } return null; }
    function escapeRegex(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    const searchIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
    function applyStyles() {
        GM_addStyle(`
            #${PANEL_ID} {position:fixed; z-index:1001; width:350px; height:300px; background-color: var(--chat-color-background, #f2f2f2); border:1px solid var(--chat-color-border-primary, #ababab); border-radius:5px; box-shadow:0 3px 8px rgba(0,0,0,0.3); display:flex; flex-direction:column; color: var(--default-color, #333); font-size:12px; overflow:hidden; opacity:1; visibility:visible; transform:scale(1); transition:opacity 0.25s ease-in-out, transform 0.25s ease-in-out, visibility 0s linear 0s;}
            #${PANEL_ID}.hidden {opacity:0; transform:scale(0.98); visibility:hidden; transition:opacity 0.25s ease-in-out, transform 0.25s ease-in-out, visibility 0s linear 0.25s; pointer-events:none;}
            #${SCRIPT_ID}-panel-header {padding:5px 8px; border-bottom:1px solid var(--chat-color-border-secondary, #ccc); background:var(--title-gray-gradient, linear-gradient(180deg, #888888 0%, #444444 100%)); display:flex; justify-content:space-between; align-items:center; font-size:12px; font-weight:bold; color:var(--title-color, #FFF); border-top-left-radius:4px; border-top-right-radius:4px; text-shadow:var(--title-text-shadow, 0 1px 0 #000); cursor:grab; flex-shrink:0;}
            #${SCRIPT_ID}-panel-header:active {cursor:grabbing;}
            #${SCRIPT_ID}-panel-title {white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-right:5px;}
            #${SCRIPT_ID}-panel-close {cursor:pointer; font-weight:bold; background:none; border:none; color:#fff; font-size:16px; line-height:1; opacity:0.8; text-shadow:0 1px 0 #000; padding:0 2px;}
            #${SCRIPT_ID}-panel-close:hover {opacity:1;}
            #${SCRIPT_ID}-tabs {display:flex; flex-shrink:0; border-bottom:1px solid var(--chat-color-border-secondary, #ccc); background-color: var(--torn-tabs-active-background, #fff);}
            .enh-chat-tab {padding:6px 12px; cursor:default; border:none; font-size:11px; font-weight:bold; color: var(--torn-tabs-active-color, #333); flex-grow:1; text-align:center;}
            #${SCRIPT_ID}-content-container {flex-grow:1; display:flex; flex-direction:column; overflow:hidden;}
            .enh-chat-tab-content {display:flex; flex-direction:column; height:100%; overflow:hidden; flex-grow:1; padding:10px; background-color:#fff; color:#333;}
            #${SCRIPT_ID}-search-controls {display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-shrink:0; border-bottom:1px solid var(--chat-color-border-secondary, #ccc); padding-bottom:5px;}
            #${SCRIPT_ID}-search-results-title {font-size:12px; font-weight:bold; color: var(--default-gray-6-color); margin:0; padding:0;}
            #${SCRIPT_ID}-export-button {cursor:pointer; background:var(--btn-background, linear-gradient(180deg,#DEDEDE 0%,#F7F7F7 25%,#CFCFCF 60%,#E7E7E7 78%,#D9D9D9 100%)); border:var(--btn-border, 1px solid #aaa); color:var(--btn-color, #555); border-radius:3px; padding:3px 8px; font-size:10px; text-shadow:var(--btn-text-shadow, 0 1px 0 #FFFFFF40); font-weight:normal; margin-left:5px;}
            #${SCRIPT_ID}-export-button:hover {background:var(--btn-hover-background, linear-gradient(180deg,#CCCCCC 0%,#FFFFFF 25%,#BBBBBB 60%,#EEEEEE 78%,#CCCCCC 100%));}
            #${SCRIPT_ID}-search-results {border:1px solid var(--chat-color-border-secondary, #ccc); background-color: #fff; border-radius:3px; overflow-y:auto; flex-grow:1;}
            .${SCRIPT_ID}-search-result-item {padding:5px 8px; border-bottom:1px solid #eee; font-size:11px; cursor:default; line-height:1.4; color: #333;}
            .${SCRIPT_ID}-search-result-item:hover {background-color: #f0f0f0;}
            .${SCRIPT_ID}-search-result-item:last-child {border-bottom:none;}
            .${SCRIPT_ID}-search-result-item .cloned-sender-link {font-weight:bold; margin-right:3px; color: #369;}
            .${SCRIPT_ID}-search-result-item .cloned-sender-link:hover {text-decoration:underline;}
            .${SCRIPT_ID}-search-result-highlight {background-color: #FFFF80; border-radius:2px; padding:0 1px; font-weight:bold; color: #000;}
            .${SCRIPT_ID}-search-no-results {padding:10px; text-align:center; font-style:italic; color: #666; font-size:11px;}
            .chat-search-container {padding: 3px 6px; border-top:1px solid var(--chat-color-border-secondary, #ccc); border-bottom:1px solid var(--chat-color-border-secondary, #ccc); display:flex; flex-wrap: nowrap; align-items:center; gap: 3px; background-color: var(--chat-color-background, #f0f0f0); margin-top:-1px;}
            .chat-search-container input[type=text] {flex-grow:1; height: 22px; line-height:20px; font-size:11px; border:1px solid var(--input-border-color, #ccc); color: var(--input-color, #000); background: var(--input-background-color, linear-gradient(0deg, #fff 0%, #fff 100%)); padding: 1px 5px; border-radius:3px; min-width:60px;}
            .chat-search-container input[type=text]:focus {border-color:var(--input-focus-border-color, #1864AB80); outline:none;}
            .chat-search-container button { flex-shrink:0; cursor:pointer; background:var(--btn-background, linear-gradient(180deg,#DEDEDE 0%,#F7F7F7 25%,#CFCFCF 60%,#E7E7E7 78%,#D9D9D9 100%)); border:var(--btn-border, 1px solid #aaa); color:var(--btn-color, #555); border-radius:3px; padding: 1px 3px; height: 22px; line-height:1; display:inline-flex; align-items:center; justify-content:center;}
            .chat-search-container button svg { width: 12px; height: 12px; }
            .chat-search-container button:hover {background:var(--btn-hover-background, linear-gradient(180deg,#CCCCCC 0%,#FFFFFF 25%,#BBBBBB 60%,#EEEEEE 78%,#BBBBBB 100%)); border:var(--btn-hover-border, 1px solid #999); color:var(--btn-hover-color, #444);}
            .chat-search-container .msg-count-display {font-size:9px; color: var(--default-gray-6-color, #666); margin-left:auto; padding-left:5px; flex-shrink:0; white-space:nowrap;}
            .highlighted-search-result {background-color: #FFFACD !important; border:1px solid #FFD700 !important; box-shadow:0 0 5px #FFD700 !important; border-radius:3px; margin:1px 0; transition:background-color .3s ease;}
       `);
    }

    function createPanelHeader() { const header = document.createElement('div'); header.id = `${SCRIPT_ID}-panel-header`; const title = document.createElement('span'); title.id = `${SCRIPT_ID}-panel-title`; title.textContent = 'Chat Search Results'; const closeButton = document.createElement('button'); closeButton.id = `${SCRIPT_ID}-panel-close`; closeButton.innerHTML = '&times;'; closeButton.title = 'Close Panel'; closeButton.addEventListener('click', () => togglePanelVisibility(false)); header.appendChild(title); header.appendChild(closeButton); return header; }
    function createSearchTabContent(container) { const controlsDiv = document.createElement('div'); controlsDiv.id = `${SCRIPT_ID}-search-controls`; controlsDiv.innerHTML = `<h3 id="${SCRIPT_ID}-search-results-title">Search Results</h3><button id="${SCRIPT_ID}-export-button" title="Export current results to a text file">Export Results</button>`; controlsDiv.querySelector(`#${SCRIPT_ID}-export-button`).addEventListener('click', exportSearchResults); const resultsDiv = document.createElement('div'); resultsDiv.id = `${SCRIPT_ID}-search-results`; resultsDiv.innerHTML = `<div class="${SCRIPT_ID}-search-no-results">Perform a search in a chat window.</div>`; container.appendChild(controlsDiv); container.appendChild(resultsDiv); }
    function createPanelContentContainer() { const container = document.createElement('div'); container.id = `${SCRIPT_ID}-content-container`; const tabsContainer = document.createElement('div'); tabsContainer.id = `${SCRIPT_ID}-tabs`; const searchTabBtn = document.createElement('div'); searchTabBtn.className = 'enh-chat-tab'; searchTabBtn.textContent = 'Search Results'; tabsContainer.appendChild(searchTabBtn); const tabContentArea = document.createElement('div'); tabContentArea.style.flexGrow = '1'; tabContentArea.style.overflow = 'hidden'; tabContentArea.style.display = 'flex'; const searchContent = document.createElement('div'); searchContent.id = `${SCRIPT_ID}-search-content`; searchContent.className = 'enh-chat-tab-content active'; createSearchTabContent(searchContent); tabContentArea.appendChild(searchContent); container.appendChild(tabsContainer); container.appendChild(tabContentArea); return container; }
    function createEnhancedChatPanel() { if (enhancedPanel) return enhancedPanel; enhancedPanel = document.createElement('div'); enhancedPanel.id = PANEL_ID; enhancedPanel.classList.add('hidden'); const header = createPanelHeader(); const contentContainer = createPanelContentContainer(); enhancedPanel.append(header, contentContainer); document.body.appendChild(enhancedPanel); header.addEventListener('mousedown', dragMouseDown); applyPanelPosition(); return enhancedPanel; }
    function applyPanelPosition() { if (!enhancedPanel) return; Object.assign(enhancedPanel.style, { top: '', left: '', right: '', bottom: '' }); enhancedPanel.style.top = config.panelPosition.top || 'auto'; enhancedPanel.style.left = config.panelPosition.left || 'auto'; enhancedPanel.style.right = config.panelPosition.right || 'auto'; enhancedPanel.style.bottom = config.panelPosition.bottom || 'auto'; }
    function displaySearchResultsInPanel(targetChatId, query, results) {
        console.log(`EnhancedChat: Displaying ${results.length} results for "${query}" in ${targetChatId}`);
        if (!enhancedPanel) { createEnhancedChatPanel(); if(!enhancedPanel) { console.error("EnhancedChat: Failed to create panel for displaying results."); return; } }
        const resultsDiv = document.getElementById(`${SCRIPT_ID}-search-results`);
        const resultsTitle = document.getElementById(`${SCRIPT_ID}-search-results-title`);
        if (!resultsDiv || !resultsTitle) { console.error("EnhancedChat: Panel internal elements missing for search results display."); return; }
        if (enhancedPanel.classList.contains('hidden')) { togglePanelVisibility(true); }
        const chatName = activeChatWindows[targetChatId]?.name || targetChatId.replace(/^(public_|faction-|private-\d+-|company-|poker-|staff-)/, '');
        const safeQuery = escapeRegex(query);
        const regex = new RegExp(safeQuery, 'gi');
        resultsDiv.innerHTML = '';
        resultsTitle.textContent = `Results for "${query}" in ${chatName} (${results.length})`;
        currentSearchResults = results;
        currentSearchDetails = { query: query, chatId: targetChatId, chatName: chatName };
        if (results.length > 0) { const fragment = document.createDocumentFragment(); results.forEach(result => { const resultItem = document.createElement('div'); resultItem.className = `${SCRIPT_ID}-search-result-item`; const senderContainer = document.createElement('span'); const originalSenderLink = result.senderElement; let senderHtml = ''; if (originalSenderLink && originalSenderLink.tagName === 'A') { const clonedLink = originalSenderLink.cloneNode(true); clonedLink.className = 'cloned-sender-link'; senderHtml = clonedLink.outerHTML; } else { senderHtml = `<span class="${result.senderElement?.className||''}">${result.sender}</span>`; } if (result.sender.toLowerCase().includes(query.toLowerCase())) { senderHtml = senderHtml.replace(regex, match => `<span class="${SCRIPT_ID}-search-result-highlight">${match}</span>`); } senderContainer.innerHTML = senderHtml + ':&nbsp;'; const textSpan = document.createElement('span'); textSpan.className = 'text'; const highlightedText = result.text.replace(regex, match => `<span class="${SCRIPT_ID}-search-result-highlight">${match}</span>`); textSpan.innerHTML = highlightedText; resultItem.appendChild(senderContainer); resultItem.appendChild(textSpan); fragment.appendChild(resultItem); }); resultsDiv.appendChild(fragment); } else { resultsDiv.innerHTML = `<div class="${SCRIPT_ID}-search-no-results">No results found for "${query}" in ${chatName}.</div>`; }
    }
    function exportSearchResults() { if (!currentSearchResults || currentSearchResults.length === 0) return; const { query, chatId, chatName } = currentSearchDetails; let exportText = `Torn Chat Search Results\nChat: ${chatName} (${chatId})\nQuery: "${query}"\nGenerated: ${new Date().toLocaleString()}\nResults Found: ${currentSearchResults.length}\n\n----------------------------------------\n\n`; currentSearchResults.forEach(result => { exportText += `${result.sender}: ${result.text}\n`; }); const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; const safeChatName = (chatName || 'UnknownChat').replace(/[^a-z0-9_-]/gi, '_'); const safeQuery = (query || 'no_query').replace(/[^a-z0-9_-]/gi, '_').substring(0, 20); a.download = `torn_search_${safeChatName}_${safeQuery}_${Date.now()}.txt`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }
    function togglePanelVisibility(forceShow = null) { if (!enhancedPanel) { createEnhancedChatPanel(); if (!enhancedPanel) return; } let makeVisible; if (forceShow === true) makeVisible = true; else if (forceShow === false) makeVisible = false; else makeVisible = enhancedPanel.classList.contains('hidden'); enhancedPanel.classList.toggle('hidden', !makeVisible); }
    function dragMouseDown(e) { if (e.target.closest('button')) return; e.preventDefault(); dragOffsetX = e.clientX - enhancedPanel.offsetLeft; dragOffsetY = e.clientY - enhancedPanel.offsetTop; document.addEventListener('mousemove', elementDrag); document.addEventListener('mouseup', closeDragElement, { once: true }); }
    function elementDrag(e) { e.preventDefault(); let newLeft = e.clientX - dragOffsetX; let newTop = e.clientY - dragOffsetY; newTop = Math.max(0, Math.min(newTop, window.innerHeight - enhancedPanel.offsetHeight)); newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - enhancedPanel.offsetWidth)); enhancedPanel.style.top = `${newTop}px`; enhancedPanel.style.left = `${newLeft}px`; enhancedPanel.style.right = "auto"; enhancedPanel.style.bottom = "auto"; }
    function closeDragElement() { document.removeEventListener('mousemove', elementDrag); config.panelPosition = { top: enhancedPanel.style.top, left: enhancedPanel.style.left, right: 'auto', bottom: 'auto' }; saveSettings(); }

    function enhanceChatWindow(chatWindow) {
        if (!chatWindow || chatWindow.dataset.enhancedChatProcessed === 'true') return;
        const chatId = chatWindow.id;

        const shouldEnhance = (storedFactionId && chatId === storedFactionId) || config.targetChatIdRegex.test(chatId);
        if (!chatId || !shouldEnhance) return;

        const inputAreaContainer = chatWindow.querySelector(config.inputAreaContainerSelector);
        if (!inputAreaContainer || !inputAreaContainer.parentNode) {
            forceSearchContainer[chatId] = true;
            return;
        }
        const insertionPoint = inputAreaContainer.parentNode;

        if (!chatWindow.querySelector(`.${SCRIPT_ID}-search-container`)) {
            const searchContainer = document.createElement('div');
            searchContainer.className = `chat-search-container ${SCRIPT_ID}-search-container`;

            const searchInput = document.createElement('input'); searchInput.type = 'text';
            const titleElement = chatWindow.querySelector(`${config.chatHeaderClass} ${config.chatWindowTitleClass}`);
            const chatTitle = titleElement?.textContent || chatId?.replace(/^public_|^faction-|^private-.*?(-|$)|^company-|^poker-|^staff-/, '') || 'chat';
            searchInput.placeholder = `Search ${chatTitle}...`;

            const searchButton = document.createElement('button'); searchButton.innerHTML = searchIconSVG; searchButton.title = 'Search';
            const msgCountDisplay = document.createElement('span'); msgCountDisplay.className = 'msg-count-display'; msgCountDisplay.textContent = '(...)';

            searchContainer.appendChild(searchInput);
            searchContainer.appendChild(searchButton);
            searchContainer.appendChild(msgCountDisplay);

            insertionPoint.parentNode.insertBefore(searchContainer, insertionPoint);

            const handleSearch = () => {
                console.log(`EnhancedChat: handleSearch called for ${chatId}`);
                const query = searchInput.value;
                if(!query) return;
                const results = performIndividualChatSearch(chatId, query);
                displaySearchResultsInPanel(chatId, query, results);
            };
            searchButton.addEventListener('click', handleSearch);
            searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } });

            updateMessageCount(chatWindow);
        }

        const titleElement = chatWindow.querySelector(`${config.chatHeaderClass} ${config.chatWindowTitleClass}`);
        activeChatWindows[chatId] = { name: titleElement?.textContent || chatId.replace(/^public_|^faction-|^private-.*?(-|$)|^company-|^poker-|^staff-/, ''), element: chatWindow };
        chatWindow.dataset.enhancedChatProcessed = 'true';

        if (forceSearchContainer[chatId]) {
            delete forceSearchContainer[chatId];
        }
    }

    function performIndividualChatSearch(targetChatId, query) {
        query = query.trim().toLowerCase();
        if (!query) return [];
        const chatWindowElement = document.getElementById(targetChatId);
        if (!chatWindowElement) return [];

        const chatList = chatWindowElement.querySelector(config.chatListSelector);
        if (!chatList) return [];

        const results = [];
        const messageGroups = chatList.querySelectorAll(config.messageGroupSelector);
        console.log(`EnhancedChat: Found ${messageGroups.length} message groups in ${targetChatId}`);

        messageGroups.forEach((msgGroup) => {
            const senderElement = msgGroup.querySelector(config.senderSelector);
            const messageElement = msgGroup.querySelector(config.messageTextSelector);

            if (senderElement && messageElement) {
                const senderText = senderElement.textContent?.replace(':', '').trim() || '';
                const messageText = messageElement.textContent?.trim() || '';

                if (messageText.toLowerCase().includes(query) || senderText.toLowerCase().includes(query)) {
                    results.push({
                        element: msgGroup,
                        sender: senderText,
                        senderElement: senderElement,
                        text: messageText
                    });
                }
            }
        });
        console.log(`EnhancedChat: Found ${results.length} matches for "${query}" in ${targetChatId}`);
        return results;
    }

    function updateMessageCount(chatWindow) { const chatList = chatWindow.querySelector(config.chatListSelector); const messageCountSpan = chatWindow.querySelector(`.${SCRIPT_ID}-search-container .msg-count-display`); if (chatList && messageCountSpan) { const messageCount = chatList.querySelectorAll(config.messageGroupSelector).length; messageCountSpan.textContent = `(${messageCount} msgs)`; } }
    function cleanupChatWindow(chatWindow) { if (chatWindow?.id && activeChatWindows[chatWindow.id]) { delete activeChatWindows[chatWindow.id]; } if (chatWindow?.id && forceSearchContainer[chatWindow.id]) { delete forceSearchContainer[chatWindow.id]; } }

    async function waitForElement(selector, parent = document, timeout = config.WAIT_FOR_ELEMENT_TIMEOUT_MS) { return new Promise((resolve, reject) => { const existingElement = parent.querySelector(selector); if (existingElement) { resolve(existingElement); return; } let observer = null; let timer = null; const cleanup = () => { if (observer) observer.disconnect(); clearTimeout(timer); }; observer = new MutationObserver(() => { const element = parent.querySelector(selector); if (element) { cleanup(); resolve(element); } }); try { observer.observe(parent, { childList: true, subtree: true }); } catch (e) { cleanup(); reject(new Error(`Observer failed for ${selector} in ${parent.id || parent.tagName}: ${e.message}`)); return; } timer = setTimeout(() => { cleanup(); reject(new Error(`Element ${selector} not found within timeout ${timeout}ms in parent ${parent.id || parent.tagName}`)); }, timeout); }); }
    async function enhanceChatWindowWhenReady(chatWindow) { if (!chatWindow || !chatWindow.id || chatWindow.dataset.enhancedChatProcessed === 'true') return; const timeoutMs = config.WAIT_FOR_ELEMENT_TIMEOUT_MS; try { await Promise.all([ waitForElement(config.inputAreaContainerSelector, chatWindow, timeoutMs), waitForElement(config.chatListSelector, chatWindow, timeoutMs) ]); enhanceChatWindow(chatWindow); } catch (error) { console.warn(`${GM_info.script.name}: Initial check failed for chat ${chatWindow.id}. Flagging for retry. Error:`, error.message); forceSearchContainer[chatWindow.id] = true; } }
    function setupObservers() { const bodyObserver = new MutationObserver(mutations => { mutations.forEach(mutation => { mutation.addedNodes.forEach(node => { if (node.nodeType === Node.ELEMENT_NODE) { const chatWindows = node.matches(config.chatWindowSelector) ? [node] : node.querySelectorAll(config.chatWindowSelector); chatWindows.forEach(chatWindow => { if (chatWindow.id && !chatWindow.dataset.enhancedChatProcessed && (chatWindow.id === storedFactionId || config.targetChatIdRegex.test(chatWindow.id))) { enhanceChatWindowWhenReady(chatWindow); } }); } }); mutation.removedNodes.forEach(node => { if (node.nodeType === Node.ELEMENT_NODE) { const chatWindows = node.matches(config.chatWindowSelector) ? [node] : node.querySelectorAll(config.chatWindowSelector); chatWindows.forEach(cleanupChatWindow); } }); }); }); bodyObserver.observe(document.body, { childList: true, subtree: true }); const footerBar = document.querySelector(config.chatFooterBarSelector); if (footerBar) { const buttonObserver = new MutationObserver(mutations => { mutations.forEach(mutation => { if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.nodeName === 'BUTTON' && mutation.target.id.startsWith('channel_panel_button:')) { const button = mutation.target; const chatId = button.id.split(':')[1]; if (chatId && (chatId === storedFactionId || config.targetChatIdRegex.test(chatId))) { const chatWindow = document.getElementById(chatId); if (button.classList.contains('opened___Mwpgz') && chatWindow && !chatWindow.dataset.enhancedChatProcessed) { enhanceChatWindowWhenReady(chatWindow); } } } }); }); buttonObserver.observe(footerBar, { attributes: true, subtree: true, attributeFilter: ['class'] }); } else { console.warn("EnhancedChat: Footer bar not found, cannot observe button states."); } setupMessageObserver(); setInterval(() => { for (const chatId in forceSearchContainer) { if (forceSearchContainer[chatId] === true) { const chatWindow = document.getElementById(chatId); if (chatWindow && !chatWindow.dataset.enhancedChatProcessed && (chatId === storedFactionId || config.targetChatIdRegex.test(chatId))) { enhanceChatWindow(chatWindow); } else if (!chatWindow || chatWindow.dataset.enhancedChatProcessed) { delete forceSearchContainer[chatId]; } } } }, config.RETRY_INTERVAL_MS); setTimeout(() => { document.querySelectorAll(config.chatWindowSelector).forEach(chatWindow => { if (chatWindow.id && !chatWindow.dataset.enhancedChatProcessed && (chatWindow.id === storedFactionId || config.targetChatIdRegex.test(chatWindow.id))) { const button = document.getElementById(`channel_panel_button:${chatWindow.id}`); if (button && button.classList.contains('opened___Mwpgz')) { enhanceChatWindowWhenReady(chatWindow); } } }); }, config.INITIAL_SCAN_DELAY_MS); }
    function setupMessageObserver() { const observerCallback = (mutationsList) => { const updatedWindows = new Set(); for (const mutation of mutationsList) { if (mutation.type === 'childList') { const chatWindow = mutation.target.closest(config.chatWindowSelector); if (chatWindow && chatWindow.dataset.enhancedChatProcessed === 'true') { updatedWindows.add(chatWindow); } } } updatedWindows.forEach(win => updateMessageCount(win)); }; const listObserver = new MutationObserver(observerCallback); const bodyObserver = new MutationObserver(mutations => { mutations.forEach(mutation => { mutation.addedNodes.forEach(node => { if (node.nodeType === Node.ELEMENT_NODE) { const chatLists = node.matches(config.chatListSelector) ? [node] : node.querySelectorAll(config.chatListSelector); chatLists.forEach(list => { if (!list.dataset.messageObserverAttached) { listObserver.observe(list, { childList: true }); list.dataset.messageObserverAttached = 'true'; const chatWindow = list.closest(config.chatWindowSelector); if(chatWindow) updateMessageCount(chatWindow); } }); } }); mutation.removedNodes.forEach(node => { if (node.nodeType === Node.ELEMENT_NODE) { const chatLists = node.matches(config.chatListSelector) ? [node] : node.querySelectorAll(config.chatListSelector); chatLists.forEach(list => { if(list.dataset.messageObserverAttached) { delete list.dataset.messageObserverAttached; } }); } }); }); }); bodyObserver.observe(document.body, { childList: true, subtree: true }); document.querySelectorAll(config.chatListSelector).forEach(list => { if (!list.dataset.messageObserverAttached) { listObserver.observe(list, { childList: true }); list.dataset.messageObserverAttached = 'true'; const chatWindow = list.closest(config.chatWindowSelector); if(chatWindow) updateMessageCount(chatWindow); } }); }

    function createFooterButton() { if (document.getElementById(FOOTER_BUTTON_ID)) return null; const buttonContainer = document.createElement('div'); buttonContainer.className = 'root___cYD0i'; const button = document.createElement('button'); button.type = 'button'; button.className = 'root___WHFbh root___K2Yex root___RLOBS'; button.id = FOOTER_BUTTON_ID; button.title = 'Toggle Enhanced Chat Search Panel'; button.innerHTML = searchIconSVG; button.addEventListener('click', () => { togglePanelVisibility(null); }); buttonContainer.appendChild(button); return buttonContainer; }
    function ensureFooterButtonExists() { const footerBar = document.querySelector(config.chatFooterBarSelector); if (footerBar) { const existingButton = document.getElementById(FOOTER_BUTTON_ID); if (!existingButton || !footerBar.contains(existingButton)) { const buttonContainer = createFooterButton(); if (buttonContainer) { const notesButton = footerBar.querySelector('#notes_panel_button'); if (notesButton) { footerBar.insertBefore(buttonContainer, notesButton); } else { footerBar.appendChild(buttonContainer); } } } } }

    function initialize() {
        loadSettings();
        applyStyles();

        storedFactionId = GM_getValue(FACTION_ID_STORAGE_KEY, null);
        const currentPath = window.location.pathname;
        const isOnAllowedPage = currentPath.includes('/preferences.php') || currentPath.includes('/factions.php');

        if (!storedFactionId && isOnAllowedPage) {
             let enteredId = window.prompt("Enter Faction ID (Numbers only):", "");
             if (enteredId && /^\d+$/.test(enteredId.trim())) {
                 storedFactionId = 'faction-' + enteredId.trim();
                 GM_setValue(FACTION_ID_STORAGE_KEY, storedFactionId);
                 console.log(`EnhancedChat: Stored Faction ID: ${storedFactionId}`);
             } else if (enteredId !== null) {
                 window.alert("Invalid Faction ID entered (only numbers allowed). Faction chat search will not be enabled until a valid ID is provided on the preferences or faction page.");
                 storedFactionId = null;
             } else {
                 storedFactionId = null;
             }
        } else if (storedFactionId) {
             console.log(`EnhancedChat: Loaded stored Faction ID: ${storedFactionId}`);
        }

        ensureFooterButtonExists();
        setInterval(ensureFooterButtonExists, config.FOOTER_BUTTON_CHECK_INTERVAL_MS);

        setupObservers();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
