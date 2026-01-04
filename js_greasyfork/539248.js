// ==UserScript==
// @name         Soyjak.st Threadwatcher & Editor
// @namespace    http://tampermonkey.net/
// @version      9001.0.2
// @description  Adds a 4chan-X style thread watcher, with a hierarchical formatting helper for posts.
// @author       xXnatexsoytanXx
// @match        https://soyjak.st/*
// @license      CC BY-NC-SA 4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539248/Soyjakst%20Threadwatcher%20%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/539248/Soyjakst%20Threadwatcher%20%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STYLES ---
    GM_addStyle(`
        /* Styles are unchanged */
        #watcher-outer-container { position: fixed; left: 0; width: 100%; text-align: right; z-index: 9998; pointer-events: none; box-sizing: border-box; }
        #watcher-container { position: relative; display: inline-block; vertical-align: top; text-align: left; pointer-events: auto; }
        #watcher-button-wrapper { display: inline-flex; align-items: center; padding: 4px 8px; cursor: pointer; border: 1px solid; border-top: none; }
        .watch-heart-button { display: inline-block; width: 16px; height: 16px; vertical-align: middle; margin-right: 5px; cursor: pointer; transition: transform 0.1s ease-in-out; }
        .watch-heart-button:not(.watched) { opacity: 0.5; }
        .watch-heart-button:not(.watched):hover { transform: scale(1.15); }
        .watch-heart-button.watched { opacity: 1; }
        #watcher-icon { display: inline-block; width: 16px; height: 16px; margin-right: 5px; vertical-align: middle; }
        #watcher-toggle-btn { font-weight: normal; text-decoration: none !important; }
        #thread-watcher-panel { position: absolute; top: 100%; right: 0; width: 400px; max-height: 70vh; border: 1px solid; border-radius: 8px; z-index: 10000; font-family: sans-serif; font-size: 14px; display: none; flex-direction: column; }
        #thread-watcher-panel.visible { display: flex; }
        #watcher-header, #watcher-options-header { padding: 10px; border-bottom: 1px solid; display: flex; justify-content: space-between; align-items: center; }
        #watcher-header h3, #watcher-options-header h3 { margin: 0; font-size: 16px; }
        #watcher-header-controls { display: flex; align-items: center; gap: 10px; }
        .watcher-control-btn { background: none; border: none; cursor: pointer; padding: 2px; line-height: 1; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; }
        .watcher-control-btn:hover { background-color: rgba(128, 128, 128, 0.15); }
        #watcher-close-btn { font-size: 20px; font-weight: bold; width: 22px; height: 22px; }
        #watcher-thread-list, #watcher-options-panel { list-style: none; padding: 10px; margin: 0; overflow-y: auto; flex-grow: 1; }
        #watcher-options-panel { display: none; }
        .watcher-option { margin-bottom: 10px; }
        .watcher-option label { margin-left: 5px; }
        .watcher-thread-item { display: flex; align-items: center; padding: 8px; border-bottom: 1px solid; }
        .post { transition: all 0.3s ease-out; }
        .watcher-thread-item:last-child { border-bottom: none; }
        .watcher-thread-info { flex-grow: 1; overflow: hidden; }
        .watcher-thread-info a { text-decoration: none; }
        .watcher-thread-info a:hover { text-decoration: underline; }
        .watcher-thread-item.has-unread-you a.thread-link { color: red !important; font-weight: bold; }
        .watcher-thread-info small { color: #555; display: block; font-size: 12px; }
        .watcher-new-posts { background-color: #e06c75; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-left: 8px; margin-right: 5px; }
        .delete-x-btn { font-weight: bold; font-family: 'Courier New', Courier, monospace; text-decoration: none; padding: 0 8px; cursor: pointer; align-self: center; }
        .delete-x-btn:hover { color: #e06c75 !important; }
        #watcher-footer { padding: 5px; border-top: 1px solid; display: flex; justify-content: space-around; }
        #watcher-footer button { background: none; border: 1px solid; padding: 4px 8px; font-size: 12px; cursor: pointer; border-radius: 4px; }
        #watcher-footer button:hover { filter: brightness(1.2); }
        .watched-in-catalog { border: 2px solid red !important; box-sizing: border-box; }
        .refresh-spinner svg { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glowing-rainbow-border { 0%, 100% { border-color: hsl(0, 90%, 75%); box-shadow: 0 0 25px 10px hsl(0, 90%, 75%); } 16% { border-color: hsl(60, 90%, 75%); box-shadow: 0 0 25px 10px hsl(60, 90%, 75%); } 33% { border-color: hsl(120, 90%, 75%); box-shadow: 0 0 25px 10px hsl(120, 90%, 75%); } 50% { border-color: hsl(180, 90%, 75%); box-shadow: 0 0 25px 10px hsl(180, 90%, 75%); } 66% { border-color: hsl(240, 90%, 75%); box-shadow: 0 0 25px 10px hsl(240, 90%, 75%); } 83% { border-color: hsl(300, 90%, 75%); box-shadow: 0 0 25px 10px hsl(300, 90%, 75%); } }
        @keyframes glowing-lime-border { 0%, 100% { border-color: hsl(100, 100%, 50%); box-shadow: 0 0 25px 10px hsl(100, 100%, 50%); } 50% { border-color: hsl(100, 100%, 70%); box-shadow: 0 0 30px 15px hsl(100, 100%, 70%); } }
        @keyframes glowing-trans-border { 0%, 100% { border-color: #87CEEB; box-shadow: 0 0 25px 10px #87CEEB; } 33% { border-color: #FFFFFF; box-shadow: 0 0 30px 15px #FFFFFF; } 66% { border-color: #FFB6C1; box-shadow: 0 0 25px 10px #FFB6C1; } }
        .easter-egg-post { position: relative; z-index: 10; transform: scale(1.02); transition: transform 0.3s ease-in-out, box-shadow 1s ease-out, border-color 1s ease-out; }
        .colorjak-post { border: 3px solid; animation: glowing-rainbow-border 3s linear infinite; border-radius: 5px; }
        .glowie-post { border: 3px solid; animation: glowing-lime-border 2s linear infinite; border-radius: 5px; }
        .alicia-post { border: 3px solid; animation: glowing-trans-border 1.5s linear infinite; border-radius: 5px; }
        .easter-egg-post > .intro, .easter-egg-post > .body { background: transparent !important; }
        .alicia-post .body { font-weight: bold; }
        .alicia-text-gradient { background: linear-gradient(to right, #87CEEB 30%, #FFFFFF 50%, #FFB6C1 70%); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .rich-text-editor-btn { background: none; border: 1px solid; padding: 1px 8px; font-size: 12px; cursor: pointer; border-radius: 4px; margin-left: 5px; height: 22px; vertical-align: top; }
        .rich-text-editor-btn:hover { filter: brightness(1.2); }
        .formatting-helper-container { border: 1px solid; border-radius: 4px; padding: 8px; margin-top: 5px; display: flex; flex-wrap: wrap; gap: 6px; }
        .formatting-helper-container button { background: none; color: inherit; font-family: inherit; padding: 3px 7px; border: 1px solid; border-radius: 3px; cursor: pointer; font-size: 11px; }
        .formatting-helper-container button:hover { filter: brightness(1.2); }
    `);

    // MODIFIED: Full, prioritized list of all font styles
    const fontStyles = [
        // --- Hierarchical Formats ---
        { label: 'RED', syntax: ['==', '=='], priority: 1 },
        { label: 'BLUE', syntax: ['--', '--'], priority: 1 },
        { label: 'Big text', syntax: ['+=', '=+'], priority: 2 },
        { label: 'Jew text', syntax: ['(((', ')))'], priority: 3 },
        { label: '> GREEN', syntax: ['>', ''], priority: 4 },
        { label: '< ORANGE', syntax: ['<', ''], priority: 4 },
        { label: '^ L. BLUE', syntax: ['^', ''], priority: 4 },
        { label: 'Glow', syntax: ['%%', '%%'], priority: 5 },
        { label: 'Sneed', syntax: ['::', '::'], priority: 6 },
        { label: 'Red Glow', syntax: ['!!', '!!'], priority: 6 },
        { label: 'Blue glow', syntax: [';;', ';;'], priority: 6 },

        // --- Non-hierarchical / Simple Formats ---
        { label: 'Bold', syntax: ["'''", "'''"], priority: Infinity },
        { label: 'Italic', syntax: ["''", "''"], priority: Infinity },
        { label: 'Spoiler', syntax: ['**', '**'], priority: Infinity },
        { label: 'Underline', syntax: ['__', '__'], priority: Infinity },
        { label: 'Strikethrough', syntax: ['~~', '~~'], priority: Infinity },
        { label: 'Code', syntax: ['```', '```'], priority: Infinity },
        { label: 'Purple', syntax: ['-=', '=-'], priority: Infinity },
        { label: 'Rainbow', syntax: ['~-~', '~-~'], priority: Infinity },
        { label: 'Doll', syntax: ['-~-', '-~-'], priority: Infinity },
        { label: 'Gemerald', syntax: ['%%~-~', '~-~%%'], priority: Infinity },
        { label: 'Gold', syntax: ['~-~::', '::~-~'], priority: Infinity },
        { label: 'Gem', syntax: ['~-~;;', ';;~-~'], priority: Infinity },
        { label: 'Boring', syntax: ['^::', '::'], priority: Infinity },
        { label: 'Brappy', syntax: ['>%%', '%%'], priority: Infinity },
        { label: 'Froot', syntax: ['<!!', '!!'], priority: Infinity },
        { label: 'Rage', syntax: ['==!!', '!!=='], priority: Infinity },
        { label: 'Calm', syntax: ['--;;', ';;--'], priority: Infinity },
        { label: 'Anon', syntax: ['**```%%~-~', '~-~%%```**'], priority: Infinity }
    ];
    // A pre-sorted list of just the hierarchical styles, from lowest to highest priority, for efficient peeling.
    const hierarchicalStylesSorted = fontStyles.filter(s => isFinite(s.priority)).sort((a, b) => b.priority - a.priority);

    let watchedThreads = [], settings = {}, cachedStyles = {}, autoRefreshIntervalId = null, easterEggObserver;
    const REFRESH_BASE_INTERVAL = 10000, channel = new BroadcastChannel('threadwatcher_channel');

    /* All helper and core logic functions like captureThemeStyles, loadData, etc. are unchanged */
    function captureThemeStyles() { const sampleBody = document.body; const samplePost = document.querySelector('.post.reply') || sampleBody; const samplePostHeader = samplePost.querySelector('.intro') || samplePost; const sampleLink = samplePost.querySelector('a') || sampleBody; const tempHighlight = document.createElement('div'); tempHighlight.className = 'post reply highlighted you'; tempHighlight.style.display = 'none'; document.body.appendChild(tempHighlight); cachedStyles.highlightBgColor = window.getComputedStyle(tempHighlight).backgroundColor; document.body.removeChild(tempHighlight); cachedStyles.contentBgColor = window.getComputedStyle(samplePost).backgroundColor; let headerBg = window.getComputedStyle(samplePostHeader).backgroundColor; if (headerBg === 'rgba(0, 0, 0, 0)' || !headerBg) { headerBg = cachedStyles.contentBgColor; } cachedStyles.headerBgColor = headerBg; cachedStyles.textColor = window.getComputedStyle(samplePost).color || 'rgb(0, 0, 0)'; cachedStyles.linkColor = window.getComputedStyle(sampleLink).color || 'rgb(52, 52, 92)'; cachedStyles.borderColor = window.getComputedStyle(samplePostHeader).borderBottomColor || '#d9d9d9'; cachedStyles.fontFamily = window.getComputedStyle(sampleBody).fontFamily; }
    function applyDynamicStyles(hasUnreadOverall) { if (!cachedStyles.contentBgColor) { captureThemeStyles(); } const styles = cachedStyles; const panel = document.getElementById('thread-watcher-panel'); if (!panel) return; const header = panel.querySelector('#watcher-header'); const buttonWrapper = document.getElementById('watcher-button-wrapper'); const watcherIcon = buttonWrapper?.querySelector('#watcher-icon svg'); const toggleBtn = buttonWrapper?.querySelector('#watcher-toggle-btn'); const heartIcons = document.querySelectorAll('.watch-heart-button svg'); const footer = panel.querySelector('#watcher-footer'); if (buttonWrapper) { buttonWrapper.style.backgroundColor = styles.headerBgColor; buttonWrapper.style.borderColor = styles.borderColor; if (watcherIcon) { watcherIcon.style.fill = hasUnreadOverall ? 'red' : styles.textColor; } if (toggleBtn) toggleBtn.style.color = styles.linkColor; } panel.style.backgroundColor = styles.contentBgColor; panel.style.color = styles.textColor; panel.style.borderColor = styles.borderColor; panel.style.fontFamily = styles.fontFamily; if (header) { header.style.backgroundColor = styles.headerBgColor; header.style.borderColor = styles.borderColor; } if (footer) { footer.style.borderColor = styles.borderColor; footer.querySelectorAll('button').forEach(btn => { btn.style.color = styles.textColor; btn.style.borderColor = styles.borderColor; btn.style.backgroundColor = styles.contentBgColor; }); } panel.querySelectorAll('a:not(.thread-link), .delete-x-btn').forEach(link => { link.style.color = styles.linkColor; }); panel.querySelectorAll('button, #watcher-close-btn').forEach(btn => btn.style.color = styles.textColor); panel.querySelectorAll('.watcher-thread-item').forEach(item => { item.style.borderBottomColor = styles.borderColor; }); heartIcons.forEach(heart => heart.style.fill = styles.textColor); panel.querySelectorAll('.watcher-thread-item.has-unread-you a.thread-link').forEach(link => { link.style.color = 'red'; }); document.querySelectorAll('.rich-text-editor-btn').forEach(btn => { btn.style.color = styles.textColor; btn.style.borderColor = styles.borderColor; btn.style.backgroundColor = styles.contentBgColor; }); document.querySelectorAll('.formatting-helper-container').forEach(container => { container.style.borderColor = styles.borderColor; container.style.backgroundColor = styles.headerBgColor; container.querySelectorAll('button').forEach(btn => { btn.style.color = styles.textColor; btn.style.borderColor = styles.borderColor; btn.style.backgroundColor = styles.contentBgColor; }); }); }
    async function loadData() { watchedThreads = await GM_getValue('watchedThreads', []); settings = await GM_getValue('watcherSettings', { autoRefresh: true, permanentYou: false, enableEasterEggs: true }); }
    async function saveThreads() { await GM_setValue('watchedThreads', watchedThreads); channel.postMessage({ type: 'threads_updated', payload: watchedThreads }); }
    async function saveSettings() { await GM_setValue('watcherSettings', settings); channel.postMessage({ type: 'settings_updated', payload: settings }); }
    function parseThreadPage(htmlText) { const parser = new DOMParser(); const doc = parser.parseFromString(htmlText, 'text/html'); if (doc.title.includes('404 Not Found')) { return { postCount: -1, title: '404 Not Found' }; } let title = ''; const titleElement = doc.querySelector('.subject'); const titleText = titleElement ? titleElement.textContent.trim() : ''; if (titleText && titleText.length > 0) { title = titleText; } else { const opBody = doc.querySelector('.op .body'); if (opBody) { const bodyClone = opBody.cloneNode(true); bodyClone.querySelectorAll('small, .quote-link, .quotelink').forEach(el => el.remove()); const firstLine = bodyClone.innerText.split('\n')[0].trim(); title = firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : ''); } else { title = 'Untitled Thread'; } } const postElements = doc.querySelectorAll('.post.reply'); const postCount = postElements.length; return { postCount, title }; }
    function getUserPostNumbersOnPage() { const userPosts = []; document.querySelectorAll('div.post.you').forEach(post => { if (post.id) { const postNumber = post.id.replace(/op_|reply_/, ''); if (postNumber && !userPosts.includes(postNumber)) { userPosts.push(postNumber); } } }); return userPosts; }
    async function refreshThread(thread) { return new Promise((resolve) => { GM_xmlhttpRequest({ method: 'GET', url: thread.url, onload: function(response) { let changed = false; if (response.status === 404) { thread.newPosts = 'err'; changed = true; } else if (response.status >= 200 && response.status < 300) { const { postCount, title } = parseThreadPage(response.responseText); if (title && thread.title !== title) { thread.title = title; changed = true; } if (postCount === -1) { thread.newPosts = 'err'; changed = true; } else { const newPostCount = postCount - thread.lastKnownPostCount; if (newPostCount > 0) { thread.newPosts = (thread.newPosts > 0 ? thread.newPosts : 0) + newPostCount; thread.lastKnownPostCount = postCount; changed = true; if (thread.userPostNumbers && thread.userPostNumbers.length > 0) { if (!thread.unreadYouReplies) thread.unreadYouReplies = []; const parser = new DOMParser(); const doc = parser.parseFromString(response.responseText, 'text/html'); const allNewReplies = Array.from(doc.querySelectorAll('.post.reply')).slice(-newPostCount); for (const reply of allNewReplies) { if (reply.classList.contains('you')) continue; const quotes = reply.querySelectorAll('a.post_quote, a[onclick*="highlightReply"]'); for (const quote of quotes) { const quotedPostNo = quote.textContent.replace('>>', ''); if (thread.userPostNumbers.includes(quotedPostNo)) { const replyId = reply.id.replace('reply_', ''); if (!thread.unreadYouReplies.includes(replyId)) { thread.unreadYouReplies.push(replyId); } } } } } } } } else { thread.newPosts = 'err'; changed = true; } thread.nextRefreshTimestamp = Date.now() + REFRESH_BASE_INTERVAL; resolve(changed); }, onerror: function() { thread.newPosts = 'err'; thread.nextRefreshTimestamp = Date.now() + REFRESH_BASE_INTERVAL; resolve(true); } }); }); }
    async function checkAndRefreshThreads() { const now = Date.now(); const threadsToRefresh = watchedThreads.filter(thread => now >= (thread.nextRefreshTimestamp || 0)); if (threadsToRefresh.length > 0) { const results = await Promise.all(threadsToRefresh.map(refreshThread)); if (results.some(changed => changed)) { await saveThreads(); renderWatcher(); } } }
    async function manualRefreshAll() { watchedThreads.forEach(t => t.nextRefreshTimestamp = 0); const refreshBtn = document.getElementById('refresh-all-btn'); if (refreshBtn) { refreshBtn.classList.add('refresh-spinner'); await checkAndRefreshThreads(); refreshBtn.classList.remove('refresh-spinner'); } }
    function startAutoRefresh() { if (!settings.autoRefresh || autoRefreshIntervalId) return; autoRefreshIntervalId = setInterval(checkAndRefreshThreads, 5000); }
    function stopAutoRefresh() { clearInterval(autoRefreshIntervalId); autoRefreshIntervalId = null; }
    async function addCurrentThread() { const url = window.location.href.split('#')[0]; if (watchedThreads.some(t => t.url === url)) return; const { postCount, title } = parseThreadPage(document.documentElement.outerHTML); const newThread = { url, title, id: Date.now(), lastKnownPostCount: postCount, newPosts: 0, userPostNumbers: getUserPostNumbersOnPage(), unreadYouReplies: [], nextRefreshTimestamp: 0, }; watchedThreads.push(newThread); await saveThreads(); renderWatcher(); }
    async function removeCurrentThread() { const url = window.location.href.split('#')[0]; watchedThreads = watchedThreads.filter(t => t.url !== url); await saveThreads(); renderWatcher(); }
    async function handleHeartClick(e) { e.preventDefault(); e.stopPropagation(); await addOrRemoveCurrentThread(); }
    async function addOrRemoveCurrentThread() { const currentUrl = window.location.href.split('#')[0]; const isWatched = watchedThreads.some(t => t.url === currentUrl); if (isWatched) { await removeCurrentThread(); } else { await addCurrentThread(); } }
    async function clearThreads(filterFn) { watchedThreads = watchedThreads.filter(filterFn); await saveThreads(); renderWatcher(); }
    function openThread(threadUrl) { const thread = watchedThreads.find(t => t.url === threadUrl); let targetUrl = threadUrl; if (thread && thread.unreadYouReplies && thread.unreadYouReplies.length > 0) { const oldestUnreadId = thread.unreadYouReplies[0]; targetUrl = `${threadUrl}#reply_${oldestUnreadId}`; } window.open(targetUrl, '_blank'); }

    // --- NEW: Rewritten Hierarchical Wrapping Logic ---
    function hierarchicalWrap(textarea, newStyle) {
        const text = textarea.value;
        const selStart = textarea.selectionStart;
        const selEnd = textarea.selectionEnd;

        // --- A. Simple Wrapper for non-hierarchical styles ---
        if (!isFinite(newStyle.priority)) {
            const [startTag, endTag] = newStyle.syntax;
            const selectedText = text.substring(selStart, selEnd);
            const newContent = startTag + selectedText + endTag;
            textarea.value = text.slice(0, selStart) + newContent + text.slice(selEnd);
            // Place cursor inside if no text was selected
            const cursorPosition = (selectedText.length === 0) ? selStart + startTag.length : selStart + newContent.length;
            textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            textarea.focus();
            return;
        }

        // --- B. Hierarchical Wrapping ---
        // 1. Find the boundaries of the formatted block
        let boundaryStart = selStart, boundaryEnd = selEnd;
        let hasExpanded;
        do {
            hasExpanded = false;
            for (const style of hierarchicalStylesSorted) {
                const [sTag, eTag] = style.syntax;
                if (!eTag) continue;
                if (text.substring(boundaryStart - sTag.length, boundaryStart) === sTag &&
                    text.substring(boundaryEnd, boundaryEnd + eTag.length) === eTag) {
                    boundaryStart -= sTag.length;
                    boundaryEnd += eTag.length;
                    hasExpanded = true;
                    break;
                }
            }
        } while (hasExpanded);

        const blockText = text.substring(boundaryStart, boundaryEnd);
        let coreText = blockText;
        let peeledLayers = [];

        // 2. Peel the onion
        let hasPeeled;
        do {
            hasPeeled = false;
            for (const style of hierarchicalStylesSorted) {
                 const [sTag, eTag] = style.syntax;
                if (!eTag) continue;
                if (coreText.startsWith(sTag) && coreText.endsWith(eTag)) {
                    coreText = coreText.slice(sTag.length, -eTag.length);
                    peeledLayers.push(style);
                    hasPeeled = true;
                    break;
                }
            }
        } while(hasPeeled);

        // 3. Add or remove the new layer
        const existingLayerIndex = peeledLayers.findIndex(l => l.label === newStyle.label);
        if (existingLayerIndex > -1) {
            peeledLayers.splice(existingLayerIndex, 1);
        } else {
            peeledLayers.push(newStyle);
        }

        // 4. Rebuild the onion
        peeledLayers.sort((a, b) => a.priority - b.priority); // Sort 1, 2, 3...
        let newContent = coreText;
        peeledLayers.forEach(layer => {
            newContent = layer.syntax[0] + newContent + layer.syntax[1];
        });

        // 5. Update the textarea
        textarea.value = text.slice(0, boundaryStart) + newContent + text.slice(boundaryEnd);
        textarea.selectionStart = boundaryStart;
        textarea.selectionEnd = boundaryStart + newContent.length;
        textarea.focus();
    }

    // --- UI RENDERING & INJECTION ---
    function createFormattingHelper(form) {
        const container = document.createElement('div');
        container.className = 'formatting-helper-container';
        const textarea = form.querySelector('textarea[name="body"]');
        if (!textarea) return null;

        fontStyles.forEach(style => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = style.label;
            btn.title = `Apply ${style.label} formatting`;
            btn.addEventListener('click', () => hierarchicalWrap(textarea, style));
            container.appendChild(btn);
        });

        const newRow = document.createElement('tr');
        const newHeader = document.createElement('th');
        const newCell = document.createElement('td');
        newHeader.textContent = 'Formatting';
        newCell.appendChild(container);
        newRow.appendChild(newHeader);
        newRow.appendChild(newCell);
        return newRow;
    }

    function injectRichTextButton() { /* Unchanged */
        document.querySelectorAll('form[name="post"] input[name="post"][type="submit"]').forEach(postButton => {
            const parentContainer = postButton.parentElement;
            if (!parentContainer || parentContainer.querySelector('.rich-text-editor-btn')) { return; }
            const richTextButton = document.createElement('button');
            richTextButton.className = 'rich-text-editor-btn';
            richTextButton.type = 'button';
            richTextButton.textContent = 'Editor';
            richTextButton.title = 'Toggle Formatting Helper';
            postButton.insertAdjacentElement('afterend', richTextButton);
            richTextButton.addEventListener('click', (e) => {
                e.preventDefault();
                const form = e.target.closest('form');
                if (!form) return;
                let helperRow = form.querySelector('.formatting-helper-row');
                if (helperRow) {
                    helperRow.style.display = helperRow.style.display === 'none' ? '' : 'none';
                } else {
                    let subjectRow;
                    const ths = form.querySelectorAll('th');
                    for (const th of ths) {
                        if (th.textContent.trim() === 'Subject') {
                            subjectRow = th.parentElement;
                            break;
                        }
                    }
                    if (subjectRow) {
                        const newHelperRow = createFormattingHelper(form);
                        if (newHelperRow) {
                            newHelperRow.className = 'formatting-helper-row';
                            subjectRow.insertAdjacentElement('afterend', newHelperRow);
                            applyDynamicStyles();
                        }
                    }
                }
            });
        });
    }

    /* All other UI and initialization functions are unchanged */
    function updateHeartButtonState() { const heartButton = document.querySelector('.watch-heart-button'); if (!heartButton) return; const currentUrl = window.location.href.split('#')[0]; const isWatched = watchedThreads.some(t => t.url === currentUrl); heartButton.classList.toggle('watched', isWatched); if (isWatched) { heartButton.title = 'Unwatch this thread'; heartButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`; } else { heartButton.title = 'Watch this thread'; heartButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`; } }
    function renderWatcher() { const panel = document.getElementById('thread-watcher-panel'); if (!panel) return; const list = panel.querySelector('#watcher-thread-list'); list.innerHTML = ''; let hasUnreadOverall = false; watchedThreads.sort((a, b) => (b.id || 0) - (a.id || 0)).forEach(thread => { if (!thread) return; const item = document.createElement('li'); item.className = 'watcher-thread-item'; if (thread.unreadYouReplies && thread.unreadYouReplies.length > 0) { item.classList.add('has-unread-you'); hasUnreadOverall = true; } let newPostsIndicator = ''; if (thread.newPosts === 'err') { newPostsIndicator = `<span class="watcher-new-posts">ERR</span>`; } else if (thread.newPosts > 0) { newPostsIndicator = `<span class="watcher-new-posts">+${thread.newPosts}</span>`; } const totalPosts = 1 + thread.lastKnownPostCount; item.innerHTML = ` <a href="javascript:void(0);" class="delete-x-btn" title="Unwatch Thread">X</a> <div class="watcher-thread-info"> <a href="${thread.url}" class="thread-link" title="${thread.title}">${thread.title || 'Untitled Thread'}</a> <small>Replies: ${totalPosts - 1}</small> </div> ${newPostsIndicator} `; item.querySelector('.thread-link').addEventListener('click', (e) => { e.preventDefault(); openThread(thread.url); }); item.querySelector('.delete-x-btn').addEventListener('click', (e) => { e.stopPropagation(); clearThreads(t => t.id !== thread.id); }); list.appendChild(item); }); const toggleBtn = document.getElementById('watcher-toggle-btn'); if (toggleBtn) { toggleBtn.textContent = `[Watcher (${watchedThreads.length})]`; } updateHeartButtonState(); applyDynamicStyles(hasUnreadOverall); highlightWatchedInCatalog(); }
    function setupWatcherUI() { if (document.getElementById('watcher-outer-container')) return; const boardlistDiv = document.querySelector('.boardlist'); if (!boardlistDiv) return; const outerContainer = document.createElement('div'); outerContainer.id = 'watcher-outer-container'; const watcherContainer = document.createElement('div'); watcherContainer.id = 'watcher-container'; const watcherButtonWrapper = document.createElement('div'); watcherButtonWrapper.id = 'watcher-button-wrapper'; watcherButtonWrapper.innerHTML = ` <span id="watcher-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3z"/></svg></span> <a id="watcher-toggle-btn">[Watcher (0)]</a> `; const panel = document.createElement('div'); panel.id = 'thread-watcher-panel'; panel.innerHTML = ` <div id="watcher-header"> <h3>Threadwatcher</h3> <div id="watcher-header-controls"> <button id="refresh-all-btn" title="Refresh All" class="watcher-control-btn"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"> <path d="M21.5 2v6h-6"></path> <path d="M2.5 22v-6h6"></path> <path d="M2 11.5a10 10 0 0 1 18.8-4.3L2.5 22"></path> <path d="M22 12.5a10 10 0 0 1-18.8 4.3L21.5 2"></path> </svg> </button> <button id="watcher-close-btn" title="Close" class="watcher-control-btn">×</button> </div> </div> <div id="watcher-options-panel"> <div class="watcher-option"> <input type="checkbox" id="auto-refresh-check"> <label for="auto-refresh-check">Enable Auto-Refresh</label> </div> <div class="watcher-option"> <input type="checkbox" id="permanent-you-check"> <label for="permanent-you-check">Keep (You) replies highlighted</label> </div> <div class="watcher-option"> <input type="checkbox" id="easter-egg-check"> <label for="easter-egg-check">Enable Special Effects</label> </div> </div> <ul id="watcher-thread-list"></ul> <div id="watcher-footer"> <button id="options-btn">Options</button> <button id="clear-expired-btn" title="Remove all threads marked as 'ERR'">Prune dead threads</button> <button id="clear-all-btn" title="Remove all threads from watcher">Clear All</button> </div> `; watcherContainer.appendChild(watcherButtonWrapper); watcherContainer.appendChild(panel); outerContainer.appendChild(watcherContainer); document.body.appendChild(outerContainer); outerContainer.style.top = `${boardlistDiv.offsetHeight}px`; const autoRefreshCheck = panel.querySelector('#auto-refresh-check'); autoRefreshCheck.checked = settings.autoRefresh; autoRefreshCheck.addEventListener('change', (e) => { settings.autoRefresh = e.target.checked; saveSettings(); }); const permanentYouCheck = panel.querySelector('#permanent-you-check'); permanentYouCheck.checked = settings.permanentYou; permanentYouCheck.addEventListener('change', (e) => { settings.permanentYou = e.target.checked; saveSettings(); }); const easterEggCheck = panel.querySelector('#easter-egg-check'); easterEggCheck.checked = settings.enableEasterEggs; easterEggCheck.addEventListener('change', (e) => { settings.enableEasterEggs = e.target.checked; saveSettings(); }); watcherButtonWrapper.addEventListener('click', (e) => { panel.classList.toggle('visible'); }); panel.querySelector('#refresh-all-btn').addEventListener('click', manualRefreshAll); panel.querySelector('#watcher-close-btn').addEventListener('click', () => panel.classList.remove('visible')); panel.querySelector('#options-btn').addEventListener('click', () => { const optionsPanel = panel.querySelector('#watcher-options-panel'); const threadList = panel.querySelector('#watcher-thread-list'); const isVisible = optionsPanel.style.display === 'block'; optionsPanel.style.display = isVisible ? 'none' : 'block'; threadList.style.display = isVisible ? 'block' : 'none'; }); panel.querySelector('#clear-expired-btn').addEventListener('click', () => { if (window.confirm("Are you sure you want to remove all threads marked as 'ERR'?")) { clearThreads(t => t.newPosts !== 'err'); } }); panel.querySelector('#clear-all-btn').addEventListener('click', () => { if (window.confirm('Are you sure you want to remove ALL watched threads? This cannot be undone.')) { clearThreads(() => false); } }); document.addEventListener('click', (e) => { if (!watcherContainer.contains(e.target)) { panel.classList.remove('visible'); } }); }
    function injectHeartWatchButton() { if (!/soyjak\.st\/.*\/thread\/.*\.html/.test(window.location.href)) return; const opPost = document.querySelector('div.post.op .intro'); if (!opPost) return; const deleteCheckbox = opPost.querySelector('input.delete'); if (!deleteCheckbox) return; if (opPost.querySelector('.watch-heart-button')) return; const heartButton = document.createElement('span'); heartButton.className = 'watch-heart-button'; heartButton.addEventListener('click', handleHeartClick); opPost.insertBefore(heartButton, deleteCheckbox); updateHeartButtonState(); }
    function highlightWatchedInCatalog() { if (!/catalog\.html/.test(window.location.href)) return; const catalogLinks = document.querySelectorAll('a[href*="/thread/"]'); const watchedUrls = new Set(watchedThreads.map(t => t.url)); catalogLinks.forEach(link => { const image = link.querySelector('img.thread-image'); if(image) { image.classList.toggle('watched-in-catalog', watchedUrls.has(link.href)); } }); }
    function markYouRepliesOnPage(thread) { if (!thread || !thread.unreadYouReplies || thread.unreadYouReplies.length === 0) return; thread.unreadYouReplies.forEach(replyId => { const replyPost = document.getElementById(`reply_${replyId}`); if (replyPost) { replyPost.classList.add('unread-you-reply'); replyPost.style.backgroundColor = cachedStyles.highlightBgColor; } }); }
    function observeYouReplies(thread) { if (!thread || !thread.unreadYouReplies || !thread.unreadYouReplies.length === 0) return; const targets = document.querySelectorAll('.unread-you-reply'); if (targets.length === 0) return; const observer = new IntersectionObserver((entries, obs) => { let needsSave = false; entries.forEach(entry => { if (!entry.isIntersecting) return; const replyId = entry.target.id.replace('reply_', ''); const index = thread.unreadYouReplies.indexOf(replyId); if (index > -1) { thread.unreadYouReplies.splice(index, 1); needsSave = true; } if (settings.permanentYou === false) { entry.target.style.transition = 'background-color 2s ease-out'; entry.target.style.backgroundColor = ''; } obs.unobserve(entry.target); }); if (needsSave) { saveThreads(); } }, { threshold: 0.1 }); targets.forEach(target => observer.observe(target)); }
    async function handlePageLoadLogic() { const isThreadPage = /soyjak\.st\/.*\/thread\/.*\.html/.test(window.location.href); if (!isThreadPage) return; const currentUrl = window.location.href.split('#')[0]; const thread = watchedThreads.find(t => t.url === currentUrl); if (sessionStorage.getItem('isNewThread') === 'true') { sessionStorage.removeItem('isNewThread'); if (!thread) { await addCurrentThread(); } return; } if (thread) { if (thread.unreadYouReplies && thread.unreadYouReplies.length > 0) { markYouRepliesOnPage(thread); observeYouReplies(thread); if (!window.location.hash) { const oldestUnreadId = thread.unreadYouReplies[0]; const oldestUnreadPost = document.getElementById(`reply_${oldestUnreadId}`); if (oldestUnreadPost) { oldestUnreadPost.scrollIntoView({ block: 'center', behavior: 'smooth' }); } } } thread.userPostNumbers = [...new Set([...(thread.userPostNumbers || []), ...getUserPostNumbersOnPage()])]; if (thread.newPosts > 0) { const { postCount } = parseThreadPage(document.documentElement.outerHTML); thread.lastKnownPostCount = postCount; thread.newPosts = 0; await saveThreads(); } } }
    function listenForThreadCreation() { document.addEventListener('submit', (e) => { if (e.target.name === 'post') { const isNewThreadPost = !e.target.querySelector('input[name="reply_to"]'); if (isNewThreadPost) { sessionStorage.setItem('isNewThread', 'true'); } } }); }
    function handleEasterEggs() { if (!settings.enableEasterEggs) return; document.querySelectorAll('.post .name').forEach(nameSpan => { const post = nameSpan.closest('.post'); if (!post || post.dataset.easterEggProcessed) return; const name = nameSpan.textContent.trim(); if (name === 'Colorjak' || name === 'Glowie' || name === 'Alicia') { post.dataset.easterEggProcessed = 'true'; post.classList.add('easter-egg-post'); if (name === 'Colorjak') { post.classList.add('colorjak-post'); } else if (name === 'Glowie') { const body = post.querySelector('.body'); if (body) { const spoiler = document.createElement('span'); spoiler.className = 'spoiler'; spoiler.innerHTML = body.innerHTML; body.innerHTML = ''; body.appendChild(spoiler); } post.classList.add('glowie-post'); } else { const body = post.querySelector('.body'); if(body) { const text = body.innerHTML; body.innerHTML = `<font color="FD3D98"><b>${text}</b></font>`; } post.classList.add('alicia-post'); } easterEggObserver.observe(post); } }); }
    function observeThemeChanges() { const observer = new MutationObserver(() => { captureThemeStyles(); renderWatcher(); }); observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] }); }
    async function run() { try { channel.onmessage = (event) => { const { type, payload } = event.data; if (type === 'threads_updated' && payload) { watchedThreads = payload; renderWatcher(); } if (type === 'settings_updated' && payload) { settings = payload; stopAutoRefresh(); if (settings.autoRefresh) { startAutoRefresh(); } } }; easterEggObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { const targetPost = entry.target; setTimeout(() => { targetPost.classList.remove('easter-egg-post', 'colorjak-post', 'glowie-post', 'alicia-post'); }, 5000); easterEggObserver.unobserve(targetPost); } }); }, { threshold: 0.1 }); await loadData(); setupWatcherUI(); listenForThreadCreation(); captureThemeStyles(); injectRichTextButton(); const pageObserver = new MutationObserver(() => { injectHeartWatchButton(); injectRichTextButton(); handlePageLoadLogic(); handleEasterEggs(); applyDynamicStyles(); }); pageObserver.observe(document.body, { childList: true, subtree: true }); observeThemeChanges(); await handlePageLoadLogic(); handleEasterEggs(); renderWatcher(); if (settings.autoRefresh) { startAutoRefresh(); } } catch (e) { console.error("Soyjak Threadwatcher critical error:", e); } }
    function init() { if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run); } else { run(); } const heartObserver = new MutationObserver(() => { const opIntro = document.querySelector('div.post.op .intro'); if (opIntro) { injectHeartWatchButton(); heartObserver.disconnect(); } }); heartObserver.observe(document.body, { childList: true, subtree: true }); }
    init();

})();