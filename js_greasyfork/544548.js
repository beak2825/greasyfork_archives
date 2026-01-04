// ==UserScript==
// @name         9GAG Comment Upvoter/Downvoter
// @namespace    http://tampermonkey.net/
// @version      2.3.13
// @description  Upvote or downvote comments from a specific user on 9GAG with a draggable GUI, username buttons, and thread tracking
// @author       FunkyJustin
// @license      MIT
// @match        https://9gag.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/544548/9GAG%20Comment%20UpvoterDownvoter.user.js
// @updateURL https://update.greasyfork.org/scripts/544548/9GAG%20Comment%20UpvoterDownvoter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastVoteAction = null;
    const VOTE_DELAY = 500;
    let threadData = {};
    let debugMode = false;
    let isVoting = false;
    let voteQueue = [];
    let isMinimized = false;
    let isMaximized = false;

    // Create draggable GUI
    const createGUI = () => {
        if (document.getElementById('upvoter-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'upvoter-panel';
        panel.style.position = 'fixed';
        panel.style.top = '50px';
        panel.style.right = '20px';
        panel.style.zIndex = '10000';
        panel.style.width = isMaximized ? 'calc(100% - 40px)' : '350px';
        panel.style.maxHeight = '85vh';
        panel.style.overflowY = 'auto';
        panel.style.overflowX = 'hidden';
        panel.style.backgroundColor = '#1f2939';
        panel.style.color = '#e5e7eb';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        panel.style.border = '1px solid #374151';
        panel.style.padding = '15px';
        panel.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(panel);

        panel.innerHTML = `
            <style>
                #upvoter-panel .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #374151;
                    margin-bottom: 10px;
                }
                #upvoter-panel .header span {
                    color: #9ca3af;
                    font-size: 0.875rem;
                }
                #upvoter-panel .header h2 {
                    font-weight: 600;
                    font-size: 1.25rem;
                    color: #ffffff;
                    margin: 0;
                }
                #upvoter-panel .header .controls {
                    display: flex;
                    gap: 5px;
                }
                #upvoter-panel .header button {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0 5px;
                    transition: color 0.2s;
                }
                #upvoter-panel .header button:hover {
                    color: #f87171;
                }
                #upvoter-panel .content {
                    display: ${isMinimized ? 'none' : 'block'};
                    padding: 0;
                }
                #upvoter-panel .input-group {
                    margin-bottom: 15px;
                }
                #upvoter-panel .input-group.buttons {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }
                #upvoter-panel input {
                    width: 100%;
                    padding: 8px;
                    background-color: #2d3748;
                    color: #e5e7eb;
                    border: 1px solid #4b5563;
                    border-radius: 4px;
                    font-size: 0.875rem;
                }
                #upvoter-panel input:focus {
                    border-color: #60a5fa;
                    outline: none;
                }
                #upvoter-panel .button-group {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                }
                #upvoter-panel button {
                    padding: 8px;
                    border-radius: 4px;
                    border: none;
                    color: #ffffff;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    flex-grow: 1;
                }
                #upvoter-panel .upvote-btn { background-color: #3b82f6; }
                #upvoter-panel .upvote-btn:hover { background-color: #2563eb; }
                #upvoter-panel .downvote-btn { background-color: #ef4444; }
                #upvoter-panel .downvote-btn:hover { background-color: #dc2626; }
                #upvoter-panel .upvote-downvote-others-btn { background-color: #8b5cf6; }
                #upvoter-panel .upvote-downvote-others-btn:hover { background-color: #7c3aed; }
                #upvoter-panel .downvote-upvote-others-btn { background-color: #34d399; }
                #upvoter-panel .downvote-upvote-others-btn:hover { background-color: #10b981; }
                #upvoter-panel .upvote-all-btn { background-color: #22c55e; }
                #upvoter-panel .upvote-all-btn:hover { background-color: #16a34a; }
                #upvoter-panel .downvote-all-btn { background-color: #ef4444; }
                #upvoter-panel .downvote-all-btn:hover { background-color: #dc2626; }
                #upvoter-panel .open-thread-btn { background-color: #22c55e; }
                #upvoter-panel .open-thread-btn:hover { background-color: #16a34a; }
                #upvoter-panel .undo-btn { background-color: #f59e0b; }
                #upvoter-panel .undo-btn:hover { background-color: #d97706; }
                #upvoter-panel .reset-btn { background-color: #6b7280; }
                #upvoter-panel .reset-btn:hover { background-color: #4b5563; }
                #upvoter-panel .clear-btn { background-color: #ef4444; }
                #upvoter-panel .clear-btn:hover { background-color: #dc2626; }
                #upvoter-panel .options table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }
                #upvoter-panel .options td {
                    padding: 2px 0;
                    vertical-align: middle;
                }
                #upvoter-panel .options .checkbox-column {
                    width: 20px;
                    padding-right: 5px;
                }
                #upvoter-panel .options .label-column {
                    padding-left: 5px;
                }
                #upvoter-panel .status {
                    margin-top: 10px;
                    font-size: 0.875rem;
                    color: #9ca3af;
                }
                #upvoter-panel .progress-tracker {
                    margin-top: 10px;
                    font-size: 0.875rem;
                    color: #d1d5db;
                    background-color: #2d3748;
                    padding: 8px;
                    border-radius: 4px;
                }
            </style>
            <div class="header">
                <span>v2.3.13</span>
                <h2>9GAG Comment Voter</h2>
                <div class="controls">
                    <button id="minimize-panel" title="Minimize">-</button>
                    <button id="maximize-panel" title="Maximize">□</button>
                    <button id="close-panel" title="Close">&times;</button>
                </div>
            </div>
            <div class="content">
                <div class="input-group">
                    <input id="username-input" type="text" placeholder="Enter username">
                </div>
                <div class="input-group">
                    <input id="thread-url-input" type="text" placeholder="Thread URL (optional)" title="Enter the direct comment URL (e.g., https://9gag.com/gag/a6Z8E7L#cs_comment_id=c_175414307819931225)">
                </div>
                <div class="input-group">
                    <input id="post-id-input" type="text" placeholder="Post ID (optional)" title="Enter the post ID (e.g., a6Z8E7L)">
                </div>
                <div class="button-group">
                    <button id="upvote-btn" class="upvote-btn">Upvote</button>
                    <button id="downvote-btn" class="downvote-btn">Downvote</button>
                    <button id="upvote-downvote-others-btn" class="upvote-downvote-others-btn">Up/Down Others</button>
                    <button id="downvote-upvote-others-btn" class="downvote-upvote-others-btn">Down/Up Others</button>
                    <button id="upvote-all-btn" class="upvote-all-btn">Upvote All</button>
                    <button id="downvote-all-btn" class="downvote-all-btn">Downvote All</button>
                </div>
                <div class="input-group buttons">
                    <button id="open-thread-btn" class="open-thread-btn">Open Thread</button>
                    <button id="reset-btn" class="reset-btn">Reset Processed</button>
                    <button id="clear-btn" class="clear-btn">Clear</button>
                </div>
                <div class="input-group">
                    <button id="undo-btn" class="undo-btn" style="display: none;">Undo Last Vote</button>
                </div>
                <div class="options">
                    <table>
                        <tr>
                            <td class="checkbox-column"><input id="confirm-vote" type="checkbox"></td>
                            <td class="label-column"><label for="confirm-vote">Require vote confirmation</label></td>
                        </tr>
                        <tr>
                            <td class="checkbox-column"><input id="debug-mode" type="checkbox"></td>
                            <td class="label-column"><label for="debug-mode">Debug mode</label></td>
                        </tr>
                        <tr>
                            <td class="checkbox-column"><input id="auto-reset" type="checkbox" checked></td>
                            <td class="label-column"><label for="auto-reset">Auto-reset after vote</label></td>
                        </tr>
                        <tr>
                            <td class="checkbox-column"><input id="auto-scroll" type="checkbox" checked></td>
                            <td class="label-column"><label for="auto-scroll">Auto-scroll during voting</label></td>
                        </tr>
                        <tr>
                            <td class="checkbox-column"><input id="hotfix" type="checkbox"></td>
                            <td class="label-column"><label for="hotfix">Enable two-cycle hotfix with scroll</label></td>
                        </tr>
                    </table>
                </div>
                <div class="input-group">
                    <input id="interval-input" type="number" min="1" value="5" placeholder="Check interval (seconds)">
                </div>
                <div class="input-group">
                    <input id="vote-limit" type="number" min="1" value="10" placeholder="Max votes per action">
                </div>
                <div id="progress-tracker" class="progress-tracker">Progress: Cycle 1, 0 comments voted / 0 total comments</div>
                <p id="status" class="status"></p>
            </div>
        `;

        const isPanelHidden = GM_getValue('panelHidden', false);
        if (!isPanelHidden) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }

        $(panel).draggable({ handle: '.header', containment: 'window' });

        document.getElementById('close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
            GM_setValue('panelHidden', true);
        });

        document.getElementById('minimize-panel').addEventListener('click', () => {
            isMinimized = !isMinimized;
            document.querySelector('.content').style.display = isMinimized ? 'none' : 'block';
        });

        document.getElementById('maximize-panel').addEventListener('click', () => {
            isMaximized = !isMaximized;
            panel.style.width = isMaximized ? 'calc(100% - 40px)' : '350px';
        });
    };

    const initializeGUI = () => {
        setTimeout(() => {
            const panel = document.getElementById('upvoter-panel');
            if (!panel) {
                createGUI();
                return;
            }

            // Restore saved values
            const savedThreadUrl = GM_getValue('lastThreadUrl', '');
            const savedPostId = GM_getValue('lastPostId', '');
            const savedInterval = GM_getValue('lastInterval', 5);
            const savedVoteLimit = GM_getValue('lastVoteLimit', 10);
            const savedAutoScroll = GM_getValue('lastAutoScroll', true);
            const savedHotfix = GM_getValue('lastHotfix', false);
            const savedDebugMode = GM_getValue('lastDebugMode', false);
            const savedConfirmVote = GM_getValue('lastConfirmVote', false);

            if (savedThreadUrl) document.getElementById('thread-url-input').value = savedThreadUrl;
            if (savedPostId) document.getElementById('post-id-input').value = savedPostId;
            document.getElementById('interval-input').value = savedInterval;
            document.getElementById('vote-limit').value = savedVoteLimit;
            document.getElementById('username-input').value = '';
            document.getElementById('confirm-vote').checked = savedConfirmVote;
            document.getElementById('debug-mode').checked = savedDebugMode;
            document.getElementById('auto-reset').checked = true;
            document.getElementById('auto-scroll').checked = savedAutoScroll;
            document.getElementById('hotfix').checked = savedHotfix;
            debugMode = savedDebugMode;

            // Add event listeners
            document.getElementById('confirm-vote').addEventListener('change', (e) => {
                GM_setValue('lastConfirmVote', e.target.checked);
            });
            document.getElementById('debug-mode').addEventListener('change', (e) => {
                debugMode = e.target.checked;
                GM_setValue('lastDebugMode', debugMode);
            });
            document.getElementById('reset-btn').addEventListener('click', () => {
                document.querySelectorAll('section.comment-list-item').forEach(c => {
                    c.dataset.upvoteProcessed = null;
                    c.dataset.downvoteProcessed = null;
                });
                document.getElementById('status').textContent = 'Processed states reset';
                document.getElementById('status').style.color = '#9ca3af';
            });
            document.getElementById('auto-scroll').addEventListener('change', (e) => {
                GM_setValue('lastAutoScroll', e.target.checked);
            });
            document.getElementById('hotfix').addEventListener('change', (e) => {
                GM_setValue('lastHotfix', e.target.checked);
            });
            document.getElementById('upvote-all-btn').addEventListener('click', () => {
                if (!isVoting) enqueueVoteAll('upvote');
            });
            document.getElementById('downvote-all-btn').addEventListener('click', () => {
                if (!isVoting) enqueueVoteAll('downvote');
            });

            addUsernameButtons();
        }, 100);
    };

    const addUsernameButtons = () => {
        const comments = document.querySelectorAll('section.comment-list-item');
        comments.forEach(comment => {
            const usernameElement = comment.querySelector('a.ui-comment-header__username');
            if (usernameElement) {
                if (!comment.querySelector('.upvote-user-btn')) {
                    const upvoteBtn = document.createElement('button');
                    upvoteBtn.className = 'upvote-user-btn';
                    upvoteBtn.style.backgroundColor = '#2563eb';
                    upvoteBtn.style.color = '#ffffff';
                    upvoteBtn.style.padding = '4px 8px';
                    upvoteBtn.style.borderRadius = '4px';
                    upvoteBtn.style.marginLeft = '8px';
                    upvoteBtn.style.fontSize = '0.75rem';
                    upvoteBtn.style.transition = 'background-color 0.2s';
                    upvoteBtn.textContent = 'Upvote';
                    upvoteBtn.addEventListener('click', () => enqueueVote(usernameElement.textContent.trim(), 'upvote'));
                    upvoteBtn.addEventListener('mouseover', () => { upvoteBtn.style.backgroundColor = '#1d4ed8'; });
                    upvoteBtn.addEventListener('mouseout', () => { upvoteBtn.style.backgroundColor = '#2563eb'; });
                    usernameElement.parentElement.appendChild(upvoteBtn);
                }
                if (!comment.querySelector('.downvote-user-btn')) {
                    const downvoteBtn = document.createElement('button');
                    downvoteBtn.className = 'downvote-user-btn';
                    downvoteBtn.style.backgroundColor = '#dc2626';
                    downvoteBtn.style.color = '#ffffff';
                    downvoteBtn.style.padding = '4px 8px';
                    downvoteBtn.style.borderRadius = '4px';
                    downvoteBtn.style.marginLeft = '4px';
                    downvoteBtn.style.fontSize = '0.75rem';
                    downvoteBtn.style.transition = 'background-color 0.2s';
                    downvoteBtn.textContent = 'Downvote';
                    downvoteBtn.addEventListener('click', () => enqueueVote(usernameElement.textContent.trim(), 'downvote'));
                    downvoteBtn.addEventListener('mouseover', () => { downvoteBtn.style.backgroundColor = '#b91c1c'; });
                    downvoteBtn.addEventListener('mouseout', () => { downvoteBtn.style.backgroundColor = '#dc2626'; });
                    usernameElement.parentElement.appendChild(downvoteBtn);
                }
                if (!comment.querySelector('.upvote-downvote-others-btn')) {
                    const upvoteDownvoteOthersBtn = document.createElement('button');
                    upvoteDownvoteOthersBtn.className = 'upvote-downvote-others-btn';
                    upvoteDownvoteOthersBtn.style.backgroundColor = '#9333ea';
                    upvoteDownvoteOthersBtn.style.color = '#ffffff';
                    upvoteDownvoteOthersBtn.style.padding = '4px 8px';
                    upvoteDownvoteOthersBtn.style.borderRadius = '4px';
                    upvoteDownvoteOthersBtn.style.marginLeft = '4px';
                    upvoteDownvoteOthersBtn.style.fontSize = '0.75rem';
                    upvoteDownvoteOthersBtn.style.transition = 'background-color 0.2s';
                    upvoteDownvoteOthersBtn.textContent = 'Up/Down Others';
                    upvoteDownvoteOthersBtn.addEventListener('click', () => enqueueVote(usernameElement.textContent.trim(), 'upvote-downvote-others'));
                    upvoteDownvoteOthersBtn.addEventListener('mouseover', () => { upvoteDownvoteOthersBtn.style.backgroundColor = '#7e22ce'; });
                    upvoteDownvoteOthersBtn.addEventListener('mouseout', () => { upvoteDownvoteOthersBtn.style.backgroundColor = '#9333ea'; });
                    const downvoteBtn = comment.querySelector('.downvote-user-btn');
                    if (downvoteBtn) downvoteBtn.parentElement.insertBefore(upvoteDownvoteOthersBtn, downvoteBtn.nextSibling);
                }
                if (!comment.querySelector('.downvote-upvote-others-btn')) {
                    const downvoteUpvoteOthersBtn = document.createElement('button');
                    downvoteUpvoteOthersBtn.className = 'downvote-upvote-others-btn';
                    downvoteUpvoteOthersBtn.style.backgroundColor = '#0d9488';
                    downvoteUpvoteOthersBtn.style.color = '#ffffff';
                    downvoteUpvoteOthersBtn.style.padding = '4px 8px';
                    downvoteUpvoteOthersBtn.style.borderRadius = '4px';
                    downvoteUpvoteOthersBtn.style.marginLeft = '4px';
                    downvoteUpvoteOthersBtn.style.fontSize = '0.75rem';
                    downvoteUpvoteOthersBtn.style.transition = 'background-color 0.2s';
                    downvoteUpvoteOthersBtn.textContent = 'Down/Up Others';
                    downvoteUpvoteOthersBtn.addEventListener('click', () => enqueueVote(usernameElement.textContent.trim(), 'downvote-upvote-others'));
                    downvoteUpvoteOthersBtn.addEventListener('mouseover', () => { downvoteUpvoteOthersBtn.style.backgroundColor = '#0f766e'; });
                    downvoteUpvoteOthersBtn.addEventListener('mouseout', () => { downvoteUpvoteOthersBtn.style.backgroundColor = '#0d9488'; });
                    const upvoteDownvoteOthersBtn = comment.querySelector('.upvote-downvote-others-btn');
                    if (upvoteDownvoteOthersBtn) upvoteDownvoteOthersBtn.parentElement.insertBefore(downvoteUpvoteOthersBtn, upvoteDownvoteOthersBtn.nextSibling);
                }
            }
        });
    };

    const enqueueVote = (username, voteType, passCount = 0) => {
        voteQueue.push({ username, voteType, passCount });
        if (!isVoting) processQueue();
    };

    const enqueueVoteAll = (voteType) => {
        voteQueue.push({ voteType, all: true });
        if (!isVoting) processQueue();
    };

    const processQueue = async () => {
        if (voteQueue.length === 0) {
            isVoting = false;
            return;
        }
        isVoting = true;
        const { username, voteType, passCount, all } = voteQueue.shift();
        if (all) {
            await handleVoteAll(voteType);
        } else {
            await handleVote(username, voteType, passCount);
        }
        processQueue();
    };

    const handleVote = async (username, voteType, passCount) => {
        const usernameInput = document.getElementById('username-input');
        const threadUrlInput = document.getElementById('thread-url-input');
        const postIdInput = document.getElementById('post-id-input');
        const confirmVote = document.getElementById('confirm-vote').checked;
        const autoReset = document.getElementById('auto-reset').checked;
        const hotfix = document.getElementById('hotfix').checked;
        usernameInput.value = username;
        GM_setValue('lastUsername', '');
        GM_setValue('lastThreadUrl', threadUrlInput.value);
        GM_setValue('lastPostId', postIdInput.value);
        if (threadUrlInput.value) {
            if (!confirm(`Vote on comments in thread ${threadUrlInput.value}?`)) return;
            const threadId = threadUrlInput.value.match(/cs_comment_id=([^&]+)/)?.[1];
            if (threadId) threadData[threadId] = username;
        }
        if (voteType === 'upvote-downvote-others') {
            await voteUserAndOthers(username, threadUrlInput.value, autoReset, passCount, hotfix);
            if (hotfix && passCount === 0 && document.querySelectorAll('div.comment-item').length > 0) {
                enqueueVote(username, voteType, 1);
            }
        } else if (voteType === 'downvote-upvote-others') {
            await voteUserAndOthersReverse(username, threadUrlInput.value, autoReset, passCount, hotfix);
            if (hotfix && passCount === 0 && document.querySelectorAll('div.comment-item').length > 0) {
                enqueueVote(username, voteType, 1);
            }
        } else {
            if (confirmVote && !confirm(`Confirm ${voteType} for ${username}'s comments?`)) return;
            await voteComments(username, voteType, threadUrlInput.value, autoReset, passCount, hotfix);
            if (hotfix && passCount === 0 && document.querySelectorAll('div.comment-item').length > 0) {
                enqueueVote(username, voteType, 1);
            }
        }
    };

    const handleVoteAll = async (voteType) => {
        const confirmVote = document.getElementById('confirm-vote').checked;
        const autoReset = document.getElementById('auto-reset').checked;
        const hotfix = document.getElementById('hotfix').checked;
        if (confirmVote && !confirm(`Confirm ${voteType} all comments in the thread?`)) return;
        await voteAllComments(voteType, autoReset, hotfix);
    };

    const voteComments = async (username, voteType, threadUrl, autoReset, passCount, hotfix) => {
        const status = document.getElementById('status');
        const progressTracker = document.getElementById('progress-tracker');
        let comments = Array.from(document.querySelectorAll('div.comment-item'));
        const totalComments = comments.length;
        progressTracker.textContent = `Progress: Cycle ${passCount + 1}, 0 comments voted / ${totalComments} total comments`;
        status.textContent = `Searching for comments to ${voteType} (Cycle ${passCount + 1})...`;
        status.style.color = '#facc15';

        // Load all previous replies if on a thread page
        if (window.location.href.includes('#cs_comment_id=')) {
            let loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            while (loadPreviousBtn) {
                loadPreviousBtn.click();
                await new Promise(resolve => setTimeout(resolve, 1500));
                loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            }
        }

        let voteCount = 0;
        const isThreadPage = window.location.href.includes('#cs_comment_id=');
        const maxVotes = isThreadPage ? 9999 : parseInt(document.getElementById('vote-limit').value) || 10;
        const intervalInput = document.getElementById('interval-input');
        const voteLimitInput = document.getElementById('vote-limit');
        GM_setValue('lastInterval', parseInt(intervalInput.value));
        GM_setValue('lastVoteLimit', parseInt(voteLimitInput.value));
        const autoScroll = document.getElementById('auto-scroll').checked;

        if (debugMode) console.log(`Found ${comments.length} comments to process (Cycle ${passCount + 1})`);

        for (let i = 0; i < comments.length; i++) {
            if (voteCount >= maxVotes) break;
            const comment = comments[i];
            const usernameElement = comment.querySelector('a.ui-comment-header__username');
            const commentThreadId = comment.querySelector('a.ui-comment-header__time')?.href.match(/cs_comment_id=([^&]+)/)?.[1];
            if (usernameElement && usernameElement.textContent.trim().toLowerCase() === username.toLowerCase()) {
                if (document.getElementById('post-id-input').value.trim()) {
                    const postLink = comment.querySelector('a.ui-comment-header__time')?.href;
                    if (!postLink || !postLink.includes(document.getElementById('post-id-input').value.trim())) continue;
                }
                if (threadUrl && commentThreadId !== threadUrl.match(/cs_comment_id=([^&]+)/)?.[1]) continue;

                if (comment.classList.contains('comment-item--collapsed')) {
                    comment.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                const upvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(2)');
                const downvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(3)');
                let targetBtn = null;
                let action = '';

                if (voteType === 'upvote') {
                    if (!upvoteBtn || !downvoteBtn) continue;
                    if (!upvoteBtn.classList.contains('vote-button_voted')) {
                        if (downvoteBtn.classList.contains('vote-button_voted')) {
                            targetBtn = downvoteBtn;
                            action = 'remove downvote then upvote';
                        } else {
                            targetBtn = upvoteBtn;
                            action = 'upvote';
                        }
                    } else {
                        targetBtn = upvoteBtn;
                        action = 'remove upvote';
                    }
                } else if (voteType === 'downvote') {
                    if (!upvoteBtn || !downvoteBtn) continue;
                    if (!downvoteBtn.classList.contains('vote-button_voted')) {
                        if (upvoteBtn.classList.contains('vote-button_voted')) {
                            targetBtn = upvoteBtn;
                            action = 'remove upvote then downvote';
                        } else {
                            targetBtn = downvoteBtn;
                            action = 'downvote';
                        }
                    } else {
                        targetBtn = downvoteBtn;
                        action = 'remove downvote';
                    }
                }

                if (targetBtn) {
                    try {
                        await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                        if (action.includes('remove')) targetBtn.click();
                        if (action.includes('then')) {
                            await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                            (voteType === 'upvote' ? upvoteBtn : downvoteBtn).click();
                        } else if (action) {
                            targetBtn.click();
                        }
                        voteCount++;
                        const commentSection = comment.closest('section.comment-list-item');
                        if (commentSection) {
                            commentSection.dataset[voteType === 'upvote' ? 'upvoteProcessed' : 'downvoteProcessed'] = 'true';
                        }
                        comment.style.transition = 'background-color 0.5s';
                        comment.style.backgroundColor = voteType === 'upvote' ? '#2d3748' : '#4a2d2d';
                        setTimeout(() => { comment.style.backgroundColor = ''; }, 2000);

                        // Scroll logic: Use hotfix scroll if enabled, otherwise follow autoScroll or refresh
                        if (hotfix) {
                            window.scrollTo(0, document.body.scrollHeight);
                            await new Promise(resolve => setTimeout(resolve, 500));
                        } else if (autoScroll) {
                            window.scrollTo(0, document.body.scrollHeight);
                            await new Promise(resolve => setTimeout(resolve, 500));
                        } else {
                            comments = Array.from(document.querySelectorAll('div.comment-item'));
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }

                        progressTracker.textContent = `Progress: Cycle ${passCount + 1}, ${voteCount} comments voted / ${totalComments} total comments`;
                        if (debugMode) console.log(`Performed ${action} on comment by ${username} (Cycle ${passCount + 1})`, comment);
                    } catch (e) {
                        if (debugMode) console.log(`Error processing comment: ${e.message} (Cycle ${passCount + 1})`, comment);
                    }

                    setTimeout(() => {
                        if (document.querySelector('.login-prompt')) {
                            status.textContent = 'Please log in to vote';
                            status.style.color = '#ef4445';
                        }
                    }, 1000);

                    lastVoteAction = { type: voteType, count: voteCount, timestamp: Date.now(), threadId: threadUrl?.match(/cs_comment_id=([^&]+)/)?.[1] };
                    document.getElementById('undo-btn').style.display = 'block';
                }
            }
        }

        if (debugMode) console.log(`Processed ${voteCount} comments (Cycle ${passCount + 1})`);

        if (voteCount > 0) {
            status.textContent = `${voteType === 'upvote' ? 'Processed' : 'Processed'} ${voteCount} ${voteType} action(s) for ${username} (Cycle ${passCount + 1})`;
            status.style.color = voteType === 'upvote' ? '#10b981' : '#ef4444';
        } else {
            status.textContent = `No ${voteType}able actions found for ${username} (Cycle ${passCount + 1})`;
            status.style.color = '#ef4444';
        }

        if (voteCount > maxVotes / 2 && !isThreadPage) {
            status.textContent += ' (Approaching vote limit)';
            status.style.color = '#facc15';
        }

        if (autoReset) {
            document.querySelectorAll('section.comment-list-item').forEach(c => {
                c.dataset.upvoteProcessed = null;
                c.dataset.downvoteProcessed = null;
            });
            status.textContent += ' (Auto-reset applied)';
        }
    };

    const voteUserAndOthers = async (targetUsername, threadUrl, autoReset, passCount, hotfix) => {
        const status = document.getElementById('status');
        const progressTracker = document.getElementById('progress-tracker');
        let comments = Array.from(document.querySelectorAll('div.comment-item'));
        const totalComments = comments.length;
        progressTracker.textContent = `Progress: Cycle ${passCount + 1}, 0 comments voted / ${totalComments} total comments`;
        status.textContent = `Processing upvote for ${targetUsername} and downvote for others (Cycle ${passCount + 1})...`;
        status.style.color = '#facc15';

        // Load all previous replies if on a thread page
        if (window.location.href.includes('#cs_comment_id=')) {
            let loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            while (loadPreviousBtn) {
                loadPreviousBtn.click();
                await new Promise(resolve => setTimeout(resolve, 1500));
                loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            }
        }

        let upvoteCount = 0;
        let downvoteCount = 0;
        const isThreadPage = window.location.href.includes('#cs_comment_id=');
        const maxVotes = isThreadPage ? 9999 : parseInt(document.getElementById('vote-limit').value) || 10;
        const intervalInput = document.getElementById('interval-input');
        const voteLimitInput = document.getElementById('vote-limit');
        GM_setValue('lastInterval', parseInt(intervalInput.value));
        GM_setValue('lastVoteLimit', parseInt(voteLimitInput.value));
        const autoScroll = document.getElementById('auto-scroll').checked;

        if (debugMode) console.log(`Found ${comments.length} comments to process (Cycle ${passCount + 1})`);

        for (let i = 0; i < comments.length; i++) {
            if (upvoteCount + downvoteCount >= maxVotes) break;
            const comment = comments[i];
            const usernameElement = comment.querySelector('a.ui-comment-header__username');
            const commentThreadId = comment.querySelector('a.ui-comment-header__time')?.href.match(/cs_comment_id=([^&]+)/)?.[1];
            if (usernameElement) {
                if (document.getElementById('post-id-input').value.trim()) {
                    const postLink = comment.querySelector('a.ui-comment-header__time')?.href;
                    if (!postLink || !postLink.includes(document.getElementById('post-id-input').value.trim())) continue;
                }
                if (threadUrl && commentThreadId !== threadUrl.match(/cs_comment_id=([^&]+)/)?.[1]) continue;

                if (comment.classList.contains('comment-item--collapsed')) {
                    comment.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                const upvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(2)');
                const downvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(3)');
                let targetBtn = null;
                let action = '';
                const currentUsername = usernameElement.textContent.trim().toLowerCase();

                if (currentUsername === targetUsername.toLowerCase()) {
                    if (!upvoteBtn || !downvoteBtn) continue;
                    if (!upvoteBtn.classList.contains('vote-button_voted')) {
                        if (downvoteBtn.classList.contains('vote-button_voted')) {
                            targetBtn = downvoteBtn;
                            action = 'remove downvote then upvote';
                        } else {
                            targetBtn = upvoteBtn;
                            action = 'upvote';
                        }
                    } else {
                        targetBtn = upvoteBtn;
                        action = 'remove upvote';
                    }
                    if (targetBtn) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                            if (action.includes('remove')) targetBtn.click();
                            if (action.includes('then')) {
                                await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                                upvoteBtn.click();
                            } else if (action) {
                                targetBtn.click();
                            }
                            upvoteCount++;
                            const commentSection = comment.closest('section.comment-list-item');
                            if (commentSection) {
                                commentSection.dataset.upvoteProcessed = 'true';
                            }
                            comment.style.transition = 'background-color 0.5s';
                            comment.style.backgroundColor = '#2d3748';
                            setTimeout(() => { comment.style.backgroundColor = ''; }, 2000);
                            if (debugMode) console.log(`Upvoted comment by ${currentUsername} (Cycle ${passCount + 1})`, comment);
                        } catch (e) {
                            if (debugMode) console.log(`Error upvoting comment by ${currentUsername}: ${e.message} (Cycle ${passCount + 1})`, comment);
                        }
                    }
                } else {
                    if (!upvoteBtn || !downvoteBtn) continue;
                    if (!downvoteBtn.classList.contains('vote-button_voted')) {
                        if (upvoteBtn.classList.contains('vote-button_voted')) {
                            targetBtn = upvoteBtn;
                            action = 'remove upvote then downvote';
                        } else {
                            targetBtn = downvoteBtn;
                            action = 'downvote';
                        }
                    } else {
                        targetBtn = downvoteBtn;
                        action = 'remove downvote';
                    }
                    if (targetBtn) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                            if (action.includes('remove')) targetBtn.click();
                            if (action.includes('then')) {
                                await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                                downvoteBtn.click();
                            } else if (action) {
                                targetBtn.click();
                            }
                            downvoteCount++;
                            const commentSection = comment.closest('section.comment-list-item');
                            if (commentSection) {
                                commentSection.dataset.downvoteProcessed = 'true';
                            }
                            comment.style.transition = 'background-color 0.5s';
                            comment.style.backgroundColor = '#4a2d2d';
                            setTimeout(() => { comment.style.backgroundColor = ''; }, 2000);
                            if (debugMode) console.log(`Downvoted comment by ${currentUsername} (Cycle ${passCount + 1})`, comment);
                        } catch (e) {
                            if (debugMode) console.log(`Error downvoting comment by ${currentUsername}: ${e.message} (Cycle ${passCount + 1})`, comment);
                        }
                    }
                }

                // Scroll logic: Use hotfix scroll if enabled, otherwise follow autoScroll or refresh
                if (hotfix) {
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else if (autoScroll) {
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    comments = Array.from(document.querySelectorAll('div.comment-item'));
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                progressTracker.textContent = `Progress: Cycle ${passCount + 1}, ${upvoteCount + downvoteCount} comments voted / ${totalComments} total comments`;
            }
        }

        if (debugMode) console.log(`Processed ${upvoteCount} upvotes and ${downvoteCount} downvotes (Cycle ${passCount + 1})`);

        if (upvoteCount > 0 || downvoteCount > 0) {
            status.textContent = `Upvoted ${upvoteCount} comments for ${targetUsername}, downvoted ${downvoteCount} others (Cycle ${passCount + 1})`;
            status.style.color = '#10b981';
        } else {
            status.textContent = `No actions performed for ${targetUsername} (Cycle ${passCount + 1})`;
            status.style.color = '#ef4444';
        }

        if (upvoteCount + downvoteCount > maxVotes / 2 && !isThreadPage) {
            status.textContent += ' (Approaching vote limit)';
            status.style.color = '#facc15';
        }

        if (autoReset) {
            document.querySelectorAll('section.comment-list-item').forEach(c => {
                c.dataset.upvoteProcessed = null;
                c.dataset.downvoteProcessed = null;
            });
            status.textContent += ' (Auto-reset applied)';
        }

        lastVoteAction = { type: 'upvote-downvote-others', count: upvoteCount + downvoteCount, timestamp: Date.now(), threadId: threadUrl?.match(/cs_comment_id=([^&]+)/)?.[1] };
        document.getElementById('undo-btn').style.display = 'block';
    };

    const voteUserAndOthersReverse = async (targetUsername, threadUrl, autoReset, passCount, hotfix) => {
        const status = document.getElementById('status');
        const progressTracker = document.getElementById('progress-tracker');
        let comments = Array.from(document.querySelectorAll('div.comment-item'));
        const totalComments = comments.length;
        progressTracker.textContent = `Progress: Cycle ${passCount + 1}, 0 comments voted / ${totalComments} total comments`;
        status.textContent = `Processing downvote for ${targetUsername} and upvote for others (Cycle ${passCount + 1})...`;
        status.style.color = '#facc15';

        // Load all previous replies if on a thread page
        if (window.location.href.includes('#cs_comment_id=')) {
            let loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            while (loadPreviousBtn) {
                loadPreviousBtn.click();
                await new Promise(resolve => setTimeout(resolve, 1500));
                loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            }
        }

        let downvoteCount = 0;
        let upvoteCount = 0;
        const isThreadPage = window.location.href.includes('#cs_comment_id=');
        const maxVotes = isThreadPage ? 9999 : parseInt(document.getElementById('vote-limit').value) || 10;
        const intervalInput = document.getElementById('interval-input');
        const voteLimitInput = document.getElementById('vote-limit');
        GM_setValue('lastInterval', parseInt(intervalInput.value));
        GM_setValue('lastVoteLimit', parseInt(voteLimitInput.value));
        const autoScroll = document.getElementById('auto-scroll').checked;

        if (debugMode) console.log(`Found ${comments.length} comments to process (Cycle ${passCount + 1})`);

        for (let i = 0; i < comments.length; i++) {
            if (downvoteCount + upvoteCount >= maxVotes) break;
            const comment = comments[i];
            const usernameElement = comment.querySelector('a.ui-comment-header__username');
            const commentThreadId = comment.querySelector('a.ui-comment-header__time')?.href.match(/cs_comment_id=([^&]+)/)?.[1];
            if (usernameElement) {
                if (document.getElementById('post-id-input').value.trim()) {
                    const postLink = comment.querySelector('a.ui-comment-header__time')?.href;
                    if (!postLink || !postLink.includes(document.getElementById('post-id-input').value.trim())) continue;
                }
                if (threadUrl && commentThreadId !== threadUrl.match(/cs_comment_id=([^&]+)/)?.[1]) continue;

                if (comment.classList.contains('comment-item--collapsed')) {
                    comment.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                const upvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(2)');
                const downvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(3)');
                let targetBtn = null;
                let action = '';
                const currentUsername = usernameElement.textContent.trim().toLowerCase();

                if (currentUsername === targetUsername.toLowerCase()) {
                    if (!upvoteBtn || !downvoteBtn) continue;
                    if (!downvoteBtn.classList.contains('vote-button_voted')) {
                        if (upvoteBtn.classList.contains('vote-button_voted')) {
                            targetBtn = upvoteBtn;
                            action = 'remove upvote then downvote';
                        } else {
                            targetBtn = downvoteBtn;
                            action = 'downvote';
                        }
                    } else {
                        targetBtn = downvoteBtn;
                        action = 'remove downvote';
                    }
                    if (targetBtn) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                            if (action.includes('remove')) targetBtn.click();
                            if (action.includes('then')) {
                                await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                                downvoteBtn.click();
                            } else if (action) {
                                targetBtn.click();
                            }
                            downvoteCount++;
                            const commentSection = comment.closest('section.comment-list-item');
                            if (commentSection) {
                                commentSection.dataset.downvoteProcessed = 'true';
                            }
                            comment.style.transition = 'background-color 0.5s';
                            comment.style.backgroundColor = '#4a2d2d';
                            setTimeout(() => { comment.style.backgroundColor = ''; }, 2000);
                            if (debugMode) console.log(`Downvoted comment by ${currentUsername} (Cycle ${passCount + 1})`, comment);
                        } catch (e) {
                            if (debugMode) console.log(`Error downvoting comment by ${currentUsername}: ${e.message} (Cycle ${passCount + 1})`, comment);
                        }
                    }
                } else {
                    if (!upvoteBtn || !downvoteBtn) continue;
                    if (!upvoteBtn.classList.contains('vote-button_voted')) {
                        if (downvoteBtn.classList.contains('vote-button_voted')) {
                            targetBtn = downvoteBtn;
                            action = 'remove downvote then upvote';
                        } else {
                            targetBtn = upvoteBtn;
                            action = 'upvote';
                        }
                    } else {
                        targetBtn = upvoteBtn;
                        action = 'remove upvote';
                    }
                    if (targetBtn) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                            if (action.includes('remove')) targetBtn.click();
                            if (action.includes('then')) {
                                await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                                upvoteBtn.click();
                            } else if (action) {
                                targetBtn.click();
                            }
                            upvoteCount++;
                            const commentSection = comment.closest('section.comment-list-item');
                            if (commentSection) {
                                commentSection.dataset.upvoteProcessed = 'true';
                            }
                            comment.style.transition = 'background-color 0.5s';
                            comment.style.backgroundColor = '#2d3748';
                            setTimeout(() => { comment.style.backgroundColor = ''; }, 2000);
                            if (debugMode) console.log(`Upvoted comment by ${currentUsername} (Cycle ${passCount + 1})`, comment);
                        } catch (e) {
                            if (debugMode) console.log(`Error upvoting comment by ${currentUsername}: ${e.message} (Cycle ${passCount + 1})`, comment);
                        }
                    }
                }

                // Scroll logic: Use hotfix scroll if enabled, otherwise follow autoScroll or refresh
                if (hotfix) {
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else if (autoScroll) {
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    comments = Array.from(document.querySelectorAll('div.comment-item'));
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                progressTracker.textContent = `Progress: Cycle ${passCount + 1}, ${downvoteCount + upvoteCount} comments voted / ${totalComments} total comments`;
            }
        }

        if (debugMode) console.log(`Processed ${downvoteCount} downvotes and ${upvoteCount} upvotes (Cycle ${passCount + 1})`);

        if (downvoteCount > 0 || upvoteCount > 0) {
            status.textContent = `Downvoted ${downvoteCount} comments for ${targetUsername}, upvoted ${upvoteCount} others (Cycle ${passCount + 1})`;
            status.style.color = '#10b981';
        } else {
            status.textContent = `No actions performed for ${targetUsername} (Cycle ${passCount + 1})`;
            status.style.color = '#ef4444';
        }

        if (downvoteCount + upvoteCount > maxVotes / 2 && !isThreadPage) {
            status.textContent += ' (Approaching vote limit)';
            status.style.color = '#facc15';
        }

        if (autoReset) {
            document.querySelectorAll('section.comment-list-item').forEach(c => {
                c.dataset.upvoteProcessed = null;
                c.dataset.downvoteProcessed = null;
            });
            status.textContent += ' (Auto-reset applied)';
        }

        lastVoteAction = { type: 'downvote-upvote-others', count: downvoteCount + upvoteCount, timestamp: Date.now(), threadId: threadUrl?.match(/cs_comment_id=([^&]+)/)?.[1] };
        document.getElementById('undo-btn').style.display = 'block';
    };

    const voteAllComments = async (voteType, autoReset, hotfix) => {
        const status = document.getElementById('status');
        const progressTracker = document.getElementById('progress-tracker');
        let comments = Array.from(document.querySelectorAll('div.comment-item'));
        const totalComments = comments.length;
        progressTracker.textContent = `Progress: All, 0 comments voted / ${totalComments} total comments`;
        status.textContent = `Voting ${voteType} all comments...`;
        status.style.color = '#facc15';

        // Load all previous replies if on a thread page
        if (window.location.href.includes('#cs_comment_id=')) {
            let loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            while (loadPreviousBtn) {
                loadPreviousBtn.click();
                await new Promise(resolve => setTimeout(resolve, 1500));
                loadPreviousBtn = document.querySelector('button.load-previous.single-thread__load-previous');
            }
        }

        let voteCount = 0;
        const isThreadPage = window.location.href.includes('#cs_comment_id=');
        const maxVotes = isThreadPage ? 9999 : parseInt(document.getElementById('vote-limit').value) || 10;
        const autoScroll = document.getElementById('auto-scroll').checked;

        if (debugMode) console.log(`Found ${comments.length} comments to process for ${voteType} all`);

        for (let i = 0; i < comments.length; i++) {
            if (voteCount >= maxVotes) break;
            const comment = comments[i];

            if (comment.classList.contains('comment-item--collapsed')) {
                comment.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const upvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(2)');
            const downvoteBtn = comment.querySelector('button.vote-button.comment-item-action__vote:nth-child(3)');
            let targetBtn = null;
            let action = '';

            if (voteType === 'upvote') {
                if (!upvoteBtn || !downvoteBtn) continue;
                if (!upvoteBtn.classList.contains('vote-button_voted')) {
                    if (downvoteBtn.classList.contains('vote-button_voted')) {
                        targetBtn = downvoteBtn;
                        action = 'remove downvote then upvote';
                    } else {
                        targetBtn = upvoteBtn;
                        action = 'upvote';
                    }
                }
            } else if (voteType === 'downvote') {
                if (!upvoteBtn || !downvoteBtn) continue;
                if (!downvoteBtn.classList.contains('vote-button_voted')) {
                    if (upvoteBtn.classList.contains('vote-button_voted')) {
                        targetBtn = upvoteBtn;
                        action = 'remove upvote then downvote';
                    } else {
                        targetBtn = downvoteBtn;
                        action = 'downvote';
                    }
                }
            }

            if (targetBtn) {
                try {
                    await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                    if (action.includes('remove')) targetBtn.click();
                    if (action.includes('then')) {
                        await new Promise(resolve => setTimeout(resolve, VOTE_DELAY));
                        (voteType === 'upvote' ? upvoteBtn : downvoteBtn).click();
                    } else if (action) {
                        targetBtn.click();
                    }
                    voteCount++;
                    const commentSection = comment.closest('section.comment-list-item');
                    if (commentSection) {
                        commentSection.dataset[voteType === 'upvote' ? 'upvoteProcessed' : 'downvoteProcessed'] = 'true';
                    }
                    comment.style.transition = 'background-color 0.5s';
                    comment.style.backgroundColor = voteType === 'upvote' ? '#2d3748' : '#4a2d2d';
                    setTimeout(() => { comment.style.backgroundColor = ''; }, 2000);

                    if (hotfix) {
                        window.scrollTo(0, document.body.scrollHeight);
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } else if (autoScroll) {
                        window.scrollTo(0, document.body.scrollHeight);
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } else {
                        comments = Array.from(document.querySelectorAll('div.comment-item'));
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }

                    progressTracker.textContent = `Progress: All, ${voteCount} comments voted / ${totalComments} total comments`;
                    if (debugMode) console.log(`Performed ${action} on comment ${i + 1} for ${voteType} all`, comment);
                } catch (e) {
                    if (debugMode) console.log(`Error processing comment ${i + 1}: ${e.message} for ${voteType} all`, comment);
                }

                setTimeout(() => {
                    if (document.querySelector('.login-prompt')) {
                        status.textContent = 'Please log in to vote';
                        status.style.color = '#ef4445';
                    }
                }, 1000);

                lastVoteAction = { type: `${voteType}-all`, count: voteCount, timestamp: Date.now() };
                document.getElementById('undo-btn').style.display = 'block';
            }
        }

        if (debugMode) console.log(`Processed ${voteCount} comments for ${voteType} all`);

        if (voteCount > 0) {
            status.textContent = `Processed ${voteCount} ${voteType} actions for all comments`;
            status.style.color = voteType === 'upvote' ? '#10b981' : '#ef4444';
        } else {
            status.textContent = `No ${voteType}able actions found for all comments`;
            status.style.color = '#ef4444';
        }

        if (voteCount > maxVotes / 2 && !isThreadPage) {
            status.textContent += ' (Approaching vote limit)';
            status.style.color = '#facc15';
        }

        if (autoReset) {
            document.querySelectorAll('section.comment-list-item').forEach(c => {
                c.dataset.upvoteProcessed = null;
                c.dataset.downvoteProcessed = null;
            });
            status.textContent += ' (Auto-reset applied)';
        }
    };

    const undoLastVote = () => {
        if (lastVoteAction) {
            const elapsed = (Date.now() - lastVoteAction.timestamp) / 1000;
            if (elapsed <= 5) {
                const comments = document.querySelectorAll('section.comment-list-item .comment-item');
                let undone = 0;
                comments.forEach(comment => {
                    const voteBtn = comment.querySelector('button.vote-button.comment-item-action__vote.vote-button_voted');
                    if (voteBtn) {
                        voteBtn.click();
                        undone++;
                        comment.closest('section.comment-list-item').dataset.upvoteProcessed = null;
                        comment.closest('section.comment-list-item').dataset.downvoteProcessed = null;
                    }
                });
                const status = document.getElementById('status');
                status.textContent = `Undid ${undone} vote(s)`;
                status.style.color = '#facc15';
                lastVoteAction = null;
                document.getElementById('undo-btn').style.display = 'none';
            } else {
                document.getElementById('status').textContent = 'Undo timed out (5s limit)';
                document.getElementById('status').style.color = '#ef4444';
            }
        }
    };

    const init = () => {
        createGUI();
        initializeGUI();

        const upvoteBtn = document.getElementById('upvote-btn');
        const downvoteBtn = document.getElementById('downvote-btn');
        const upvoteDownvoteOthersBtn = document.getElementById('upvote-downvote-others-btn');
        const downvoteUpvoteOthersBtn = document.getElementById('downvote-upvote-others-btn');
        const upvoteAllBtn = document.getElementById('upvote-all-btn');
        const downvoteAllBtn = document.getElementById('downvote-all-btn');
        const undoBtn = document.getElementById('undo-btn');
        const resetBtn = document.getElementById('reset-btn');
        const clearBtn = document.getElementById('clear-btn');
        const openThreadBtn = document.getElementById('open-thread-btn');
        const usernameInput = document.getElementById('username-input');
        const threadUrlInput = document.getElementById('thread-url-input');
        const postIdInput = document.getElementById('post-id-input');
        const intervalInput = document.getElementById('interval-input');
        const voteLimitInput = document.getElementById('vote-limit');

        upvoteBtn.addEventListener('click', () => {
            if (!isVoting) enqueueVote(usernameInput.value.trim(), 'upvote');
        });
        downvoteBtn.addEventListener('click', () => {
            if (!isVoting) enqueueVote(usernameInput.value.trim(), 'downvote');
        });
        upvoteDownvoteOthersBtn.addEventListener('click', () => {
            if (!isVoting) enqueueVote(usernameInput.value.trim(), 'upvote-downvote-others');
        });
        downvoteUpvoteOthersBtn.addEventListener('click', () => {
            if (!isVoting) enqueueVote(usernameInput.value.trim(), 'downvote-upvote-others');
        });
        undoBtn.addEventListener('click', undoLastVote);
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('section.comment-list-item').forEach(c => {
                c.dataset.upvoteProcessed = null;
                c.dataset.downvoteProcessed = null;
            });
            document.getElementById('status').textContent = 'Processed states reset';
            document.getElementById('status').style.color = '#9ca3af';
        });
        clearBtn.addEventListener('click', () => {
            usernameInput.value = '';
            threadUrlInput.value = '';
            postIdInput.value = '';
            GM_setValue('lastUsername', '');
            GM_setValue('lastThreadUrl', '');
            GM_setValue('lastPostId', '');
            document.getElementById('status').textContent = 'Cleared';
            document.getElementById('status').style.color = '#9ca3af';
            lastVoteAction = null;
            document.getElementById('undo-btn').style.display = 'none';
        });
        openThreadBtn.addEventListener('click', () => {
            const url = threadUrlInput.value.trim();
            if (url) window.open(url, '_blank');
            else document.getElementById('status').textContent = 'Please enter a thread URL';
        });

        threadUrlInput.addEventListener('change', () => GM_setValue('lastThreadUrl', threadUrlInput.value));
        postIdInput.addEventListener('change', () => GM_setValue('lastPostId', postIdInput.value));
        intervalInput.addEventListener('change', () => GM_setValue('lastInterval', parseInt(intervalInput.value)));
        voteLimitInput.addEventListener('change', () => GM_setValue('lastVoteLimit', parseInt(voteLimitInput.value)));

        const observer = new MutationObserver((mutations) => {
            if (!document.getElementById('upvoter-panel')) {
                createGUI();
                initializeGUI();
            }
            addUsernameButtons();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            if (!document.getElementById('upvoter-panel')) {
                createGUI();
                initializeGUI();
            }
        }, 2000);

        setInterval(() => {
            addUsernameButtons();
        }, intervalInput.value * 1000);
    };

    GM_registerMenuCommand('Show 9GAG Comment Voter GUI', () => {
        const panel = document.getElementById('upvoter-panel');
        if (panel) {
            panel.style.display = 'block';
            GM_setValue('panelHidden', false);
        } else {
            createGUI();
            initializeGUI();
        }
    });

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();