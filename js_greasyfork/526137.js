// ==UserScript==
// @name         DeepSeek chat bookmarks
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Adds bookmarks to DeepSeek chat
// @author       DeepSeek + WM
// @license      MIT
// @match        https://chat.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/526137/DeepSeek%20chat%20bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/526137/DeepSeek%20chat%20bookmarks.meta.js
// ==/UserScript==

const SVG_BOOKMARK = `<svg viewBox="0 0 20 20" fill="none" style="fill: none !important" xmlns="http://www.w3.org/2000/svg">
<path d="M14 2H6a2 2 0 0 0-2 2v14l6-3.5 6 3.5V4a2 2 0 0 0-2-2z"
      stroke="currentColor"
      stroke-width="1.8"
      style="fill: none !important"/>
</svg>`;

const configPruneOnRewrite = true;

let currentSessionId = "none";

// Storage management
// TODO store date of update, clear month old data
// TODO change data handling - load on start, work on cached, async save?
const STORAGE_SESSION_BOOKMARKS = 'ds-tamper-ui-session-bookmarks';

function loadStoredData() {
    const json_data = GM_getValue(STORAGE_SESSION_BOOKMARKS, '{}');
    console.log(`Loaded ${json_data}`);
    return JSON.parse(json_data);
}

function loadStoredSessionData(sessionId) {
    const data = loadStoredData();
    return data[sessionId] || {};
}

function saveStoredData(data) {
    console.log(`Saving ${JSON.stringify(data)}`);
    // localStorage.setItem(STORAGE_SESSION_BOOKMARKS, JSON.stringify(data));
    GM_setValue(STORAGE_SESSION_BOOKMARKS, JSON.stringify(data));
}

function saveStoredSessionData(sessionId, data) {
    const stored = loadStoredData();
    stored[sessionId] = data;
    saveStoredData(stored);
}

// Prune session data to match current prompt count for this session
function pruneSessionData() {
    const sessionData = loadStoredData()[currentSessionId] || {};
    const maxIndex = document.querySelectorAll('.fa81').length - 1;

    const prunedData = Object.entries(sessionData).reduce((acc, [index, value]) => {
        if (index <= maxIndex) acc[index] = value;
        return acc;
    }, {});

    saveStoredSessionData(currentSessionId, prunedData);
}

function toggleBookmarkState(index) {  
    const data = loadStoredData();  
    data[currentSessionId] = data[currentSessionId] || {};  
    data[currentSessionId][index] = !(data[currentSessionId][index] || false);  
    saveStoredData(data);  
}

function setBookmarkState(index, value) {
    const data = loadStoredData();
    data[currentSessionId][index] = value;
    saveStoredData(data);
}

function createStyledButton(onClick, svgMarkup) {
    const btn = document.createElement('div');
    btn.className = 'ds-icon-button';
    btn.style = '--ds-icon-button-text-color: #909090; --ds-icon-button-size: 20px;';
    btn.tabIndex = 0;
    btn.onclick = onClick;

    const icon = document.createElement('div');
    icon.className = 'ds-icon';
    icon.style = 'font-size:20px;width:20px;height:20px';
    icon.innerHTML = svgMarkup;
    btn.appendChild(icon);

    return btn;
}

function renderBookmarkList() {
    // Remove existing list
    const existingList = document.getElementById('ds-tamper-bookmark-list');
    if (existingList) existingList.remove();

    // Get target element
    const targetDiv = document.querySelector('.aaff8b8f');
    if (!targetDiv) return;

    // Get session data
    const sessionData = loadStoredData()[currentSessionId] || {};
    const sortedIndices = Object.entries(sessionData)
        .filter(([_, v]) => v === true)
        .map(([k]) => parseInt(k, 10))
        .sort((a, b) => a - b);

    // Create container
    const listContainer = document.createElement('div');
    listContainer.id = 'ds-tamper-bookmark-list';
    listContainer.style = `
        position: fixed;
        top: 80px;
        bottom: auto;
        background: rgba(255,255,255,0.9);
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 12px;
        max-height: 60vh;
        display: none;
    `;

    // Update bookmark list position
    const updatePosition = () => {
        const rect = targetDiv.getBoundingClientRect();
        const marginRight = 30;
        const availableWidth = window.innerWidth - rect.right - marginRight;

        if (availableWidth < 160) {
            listContainer.style.display = 'none';
            return;
        }

        listContainer.style.display = 'block';
        listContainer.style.left = `${rect.right + 12}px`;
        listContainer.style.right = `${marginRight}px`;
        listContainer.style.width = 'auto';
        listContainer.style.minWidth = '165px';
    };

    // Event listeners for resize of bookmarks window
    ['resize', 'scroll', 'orientationchange'].forEach(event => {
        window.addEventListener(event, () => {
            updatePosition();
        });
    });

    // Header
    // TODO Options button here, with export & clear all data 
    const header = document.createElement('div');
    header.textContent = `Bookmarks (${sortedIndices.length})`;
    header.style = 'color: #333; font-weight: bold; margin-bottom: 12px;';

    // Scroll area
    const scrollArea = document.createElement('div');
    scrollArea.style = 'overflow-y: auto; max-height: calc(60vh - 50px);';

    // Entries
    sortedIndices.forEach(index => {
        const container = document.querySelectorAll('.fa81')[index];
        if (!container) return;

        const textDiv = container.querySelector('.fbb737a4');
        const text = textDiv?.textContent?.trim() || `Message ${index + 1}`;

        // Bookmark row div
        const entry = document.createElement('div');
        entry.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            margin: 4px 0;
            background: #f8f8f8;
            border-radius: 4px;
        `;

        // Bookmark text
        const textSpan = document.createElement('span');
        textSpan.textContent = `#${index + 1}: ${text.slice(0, 40)}${text.length > 40 ? '...' : ''}`;
        textSpan.style = `
            color: #333;
            flex-grow: 1;
            margin-right: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        `;
        textSpan.onclick = () => {
            const targetDiv = document.querySelectorAll('.fa81')[index];
            if (targetDiv) {
                targetDiv.style.scrollMarginTop = '60px';
                targetDiv.scrollIntoView({ behavior: 'auto', block: 'start' });
                targetDiv.style.transition = 'background-color 0.7s, border-radius 0.7s';
                targetDiv.style.backgroundColor = '#ff8400';
                targetDiv.style.borderRadius = '22px';
                setTimeout(() => {
                    targetDiv.style.backgroundColor = '';
                    targetDiv.style.borderRadius = '';
                    targetDiv.style.scrollMarginTop = '';
                }, 700);
            }
        };

        // TODO would be nice to have an indicator that this bookmark is a branch-out node

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '❌';
        removeBtn.style = `
            background: transparent;
            border: none;
            padding: 0;
            margin-left: 4px;
            cursor: pointer;
            color: red;
        `;
        removeBtn.onclick = () => {
            console.log(`Removing bookmark #${index}`);
            setBookmarkState(index, false);
            const bookmarkBtn = container.querySelector('.ds-tamper-bookmark-btn');
            if (bookmarkBtn) {
                bookmarkBtn.querySelectorAll('svg path, svg circle').forEach(el =>
                    el.style.stroke = '#909090'
                );
                bookmarkBtn.dataset.active = 'false';
            }
            renderBookmarkList();
        };

        entry.appendChild(textSpan);
        entry.appendChild(removeBtn);
        scrollArea.appendChild(entry);
    });

    const clearAllBtn = document.createElement('button');
    clearAllBtn.textContent = "Delete all bookmarks";
    clearAllBtn.style = `
        background: transparent;
        border: 1px solid #ccc;
        border-radius: 4px;
        color: #ff4444;
        padding: 8px 12px;
        margin-top: 12px;
        width: 100%;
        cursor: pointer;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `;
    clearAllBtn.onclick = () => {
        console.log(`Removing all bookmarks`);
        const data = loadStoredData();
        data[currentSessionId] = {};
        saveStoredData(data);
        const bookmarkButtons = document.querySelectorAll('.ds-tamper-bookmark-btn');
        bookmarkButtons.forEach((btn) => {
            btn.querySelectorAll('svg path, svg circle').forEach(el =>
                el.style.stroke = '#909090'
            );
            btn.dataset.active = 'false';
        });
        renderBookmarkList();
    };
    
    listContainer.appendChild(header);
    listContainer.appendChild(scrollArea);
    listContainer.appendChild(clearAllBtn);
    document.body.appendChild(listContainer);
    updatePosition();
}

function refreshPerPromptButtons() {
    const sessionId = currentSessionId;
    const promptDiv = document.querySelectorAll('.fa81');

    promptDiv.forEach((container, index) => {
        const btnGroup = container.querySelector('.ds-flex.e0558cb1');
        if (!btnGroup) return;

        // Bookmark button
        if (!btnGroup.querySelector('.ds-tamper-bookmark-btn')) {
            const bookmarkBtn = createStyledButton((e) => {
                const isActive = e.currentTarget.dataset.active === 'true';
                const newColor = isActive ? '#909090' : '#00CC00';
                const svgElements = e.currentTarget.querySelectorAll('svg path, svg circle');
                svgElements.forEach(el => el.style.stroke = newColor);
                e.currentTarget.dataset.active = !isActive;

                console.log(`Session ${sessionId} bookmark #${index} active -> ${!isActive}`);
                toggleBookmarkState(index);
                renderBookmarkList();
            }, SVG_BOOKMARK);

            bookmarkBtn.classList.add('ds-tamper-bookmark-btn');
            bookmarkBtn.dataset.active = 'false';
            btnGroup.appendChild(bookmarkBtn);
        }
    });

    // State management
    const stored = loadStoredData();
    const sessionData = stored[sessionId] || {};

    document.querySelectorAll('.fa81').forEach((container, index) => {
        const bookmarkBtn = container.querySelector('.ds-tamper-bookmark-btn');
        if (bookmarkBtn && sessionData.hasOwnProperty(index)) {
            const isActive = sessionData[index];
            const svgElements = bookmarkBtn.querySelectorAll('svg path, svg circle');
            svgElements.forEach(el => el.style.stroke = isActive ? '#00CC00' : '#909090');
            bookmarkBtn.dataset.active = isActive;
        }
    });
}

const handleSessionChange = async () => {
    // Clear old state
    document.querySelectorAll('.ds-tamper-bookmark-btn').forEach(btn => btn.remove());

    // Wait for containers to exist
    await new Promise(resolve => {
        const checkContainers = () => {
            if (document.querySelectorAll('.fa81').length > 0) {
                resolve();
            } else {
                setTimeout(checkContainers, 100);
            }
        };
        checkContainers();
    });

    refreshPerPromptButtons();
    renderBookmarkList();
};


const observer = new MutationObserver((mutations) => {
    if (mutations.some(m => Array.from(m.addedNodes).some(n => n.matches?.('.fa81')))) {
        // TODO how to handle switching between conversation branches?
        // ! what is the main usecase of branching?
        //    > technically to have parallel conversations
        //    > practically to
        //        > rewrite last message
        //        > drop conversation past some point and continue on a branch
        //        ! for both of these, pruning is good enough
        //    
        // could prune data whenever prompt count is lower than stored
        //    > understandable behavior
        //    > loss of bookmarks past Nth on Nth rewrite
        //    > risk of total loss on running prune before something loads
        // ! even if pruning, change between two branches of N=5 with 4th bookmarked
        // ! will not prune, but carry over B1 bookmark to B2 (and refresh the content)
        //    > this is fine I guess, jsut awkward
        // 
        // could track branches
        //    > horribly complex, especially past complex branching at multiple points
        //    > NO WAY
        // if (configPruneOnRewrite) { pruneSessionData(); }
        refreshPerPromptButtons();
        renderBookmarkList();
    }
});

// History API override for SPA navigation
// const originalPushState = history.pushState;
// history.pushState = function () {
//     handleSessionChange();
//     return originalPushState.apply(this, arguments);
// };

// Poll URL every 300ms
setInterval(() => {
    const path = window.location.pathname;

    if (!/^\/a\/chat\/s\/[^\/]+$/.test(path)) {
        const existingList = document.getElementById('ds-tamper-bookmark-list');
        if (existingList) existingList.remove();
        currentSessionId = "none";
        return;
    }
    
    const sessionID = path.split('/').pop();
    if (currentSessionId !== sessionID) {
        console.log(`Session changed from ${currentSessionId} to ${sessionID}`);
        currentSessionId = sessionID;
        handleSessionChange();
    }

}, 300);

observer.observe(document.body, { childList: true, subtree: true });