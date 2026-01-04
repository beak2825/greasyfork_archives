// ==UserScript==
// @name         【SexyAI / 魅魔岛】作品留言板本地存储（无法互动）
// @name:zh      【SexyAI】作品留言板
// @name:zh-CN   【SexyAI】作品留言板
// @name:en      【SexyAI】Work Comment Board
// @namespace    https://greasyfork.org/users/SexyAI-CommentBoard
// @version      1.0.0
// @description  为SexyAI/魅魔岛网站的每个作品提供独立的外部留言板功能，支持匿名留言、表情、图片等
// @description:zh  为SexyAI/魅魔岛网站的每个作品提供独立的外部留言板功能
// @description:zh-CN  为SexyAI/魅魔岛网站的每个作品提供独立的外部留言板功能
// @description:en  Add external comment board for each work on SexyAI website
// @author       SexyAI-CommentBoard
// @match        https://www.sexyai.top/*
// @match        https://sexyai.top/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/537811/%E3%80%90SexyAI%20%20%E9%AD%85%E9%AD%94%E5%B2%9B%E3%80%91%E4%BD%9C%E5%93%81%E7%95%99%E8%A8%80%E6%9D%BF%E6%9C%AC%E5%9C%B0%E5%AD%98%E5%82%A8%EF%BC%88%E6%97%A0%E6%B3%95%E4%BA%92%E5%8A%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537811/%E3%80%90SexyAI%20%20%E9%AD%85%E9%AD%94%E5%B2%9B%E3%80%91%E4%BD%9C%E5%93%81%E7%95%99%E8%A8%80%E6%9D%BF%E6%9C%AC%E5%9C%B0%E5%AD%98%E5%82%A8%EF%BC%88%E6%97%A0%E6%B3%95%E4%BA%92%E5%8A%A8%EF%BC%89.meta.js
// ==/UserScript==

/*
【SexyAI / 魅魔岛】作品留言板 © 2024 by SexyAI-CommentBoard is licensed under CC BY-NC 4.0.
To view a copy of this license, visit https://creativecommons.org/licenses/by-nc/4.0/
*/

(function() {
    'use strict';

    // 配置选项
    let isCommentBoardEnabled = GM_getValue('isCommentBoardEnabled', true);
    let boardPosition = GM_getValue('boardPosition', 'right-side');
    let boardTheme = GM_getValue('boardTheme', 'dark');
    let showBoardByDefault = GM_getValue('showBoardByDefault', false);
    let allowAnonymous = GM_getValue('allowAnonymous', true);
    let maxCommentsPerWork = GM_getValue('maxCommentsPerWork', 100);

    // 全局变量
    let currentWorkId = null;
    let commentBoard = null;
    let isMinimized = !showBoardByDefault;
    let pageObserver = null;

    // 表情包数据
    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
        '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
        '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
        '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
        '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
        '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
        '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
        '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
        '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
        '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
        '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿',
        '😾', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎',
        '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟',
        '👍', '👎', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈',
        '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖',
        '👏', '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵'
    ];

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        /* SexyAI 作品留言板样式 */
        #sexyai-comment-board {
            position: fixed;
            z-index: 9999;
            width: 350px;
            max-height: 80vh;
            background: linear-gradient(135deg, rgba(20, 20, 30, 0.98), rgba(30, 20, 40, 0.98));
            border: 2px solid #ff6b9d;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        #sexyai-comment-board.minimized {
            height: 50px !important;
            max-height: 50px !important;
        }

        #sexyai-comment-board.right-side {
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
        }

        #sexyai-comment-board.left-side {
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
        }

        #sexyai-comment-board.bottom-right {
            bottom: 20px;
            right: 20px;
        }

        #sexyai-comment-board.bottom-left {
            bottom: 20px;
            left: 20px;
        }

        .comment-board-header {
            background: linear-gradient(45deg, #ff6b9d, #4ecdc4);
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }

        .comment-board-title {
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .comment-count {
            background: rgba(255, 255, 255, 0.2);
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
        }

        .comment-board-controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .control-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .control-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .comment-board-content {
            display: flex;
            flex-direction: column;
            height: calc(80vh - 50px);
            max-height: 600px;
        }

        .comment-board.minimized .comment-board-content {
            display: none;
        }

        .comments-list {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            max-height: 400px;
        }

        .comment-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 10px;
            border-left: 3px solid #ff6b9d;
            transition: all 0.2s ease;
        }

        .comment-item:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateX(2px);
        }

        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
        }

        .comment-author {
            font-weight: bold;
            color: #4ecdc4;
        }

        .comment-time {
            color: #ccc;
            font-size: 11px;
        }

        .comment-content {
            font-size: 13px;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .comment-actions {
            margin-top: 8px;
            display: flex;
            gap: 8px;
        }

        .comment-action-btn {
            background: none;
            border: none;
            color: #ccc;
            font-size: 11px;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .comment-action-btn:hover {
            background: rgba(255, 107, 157, 0.2);
            color: #ff6b9d;
        }

        .comment-input-area {
            border-top: 1px solid rgba(255, 107, 157, 0.3);
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
        }

        .comment-input {
            width: 100%;
            min-height: 60px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 107, 157, 0.5);
            border-radius: 8px;
            padding: 10px;
            color: white;
            font-size: 13px;
            resize: vertical;
            font-family: inherit;
        }

        .comment-input:focus {
            outline: none;
            border-color: #ff6b9d;
            box-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
        }

        .comment-input::placeholder {
            color: #ccc;
        }

        .input-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        }

        .emoji-picker {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
            max-width: 200px;
        }

        .emoji-btn {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 2px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .emoji-btn:hover {
            background: rgba(255, 107, 157, 0.2);
            transform: scale(1.2);
        }

        .submit-btn {
            background: linear-gradient(45deg, #4ecdc4, #45b7aa);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        .submit-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
        }

        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .author-input {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 107, 157, 0.3);
            border-radius: 6px;
            padding: 6px 10px;
            color: white;
            font-size: 12px;
            width: 100px;
            margin-bottom: 8px;
        }

        .author-input:focus {
            outline: none;
            border-color: #ff6b9d;
        }

        .no-comments {
            text-align: center;
            color: #ccc;
            font-style: italic;
            padding: 30px 15px;
        }

        .work-info {
            background: rgba(78, 205, 196, 0.1);
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            font-size: 12px;
            border-left: 3px solid #4ecdc4;
        }

        .settings-panel {
            position: absolute;
            top: 100%;
            right: 0;
            background: rgba(20, 20, 30, 0.98);
            border: 1px solid #ff6b9d;
            border-radius: 8px;
            padding: 15px;
            min-width: 200px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 10000;
        }

        .settings-item {
            margin-bottom: 10px;
        }

        .settings-label {
            display: block;
            font-size: 12px;
            margin-bottom: 5px;
            color: #ccc;
        }

        .settings-select {
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 107, 157, 0.3);
            border-radius: 4px;
            padding: 4px 8px;
            color: white;
            font-size: 12px;
        }

        .settings-checkbox {
            margin-right: 6px;
        }

        /* 滚动条样式 */
        .comments-list::-webkit-scrollbar {
            width: 6px;
        }

        .comments-list::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }

        .comments-list::-webkit-scrollbar-thumb {
            background: rgba(255, 107, 157, 0.5);
            border-radius: 3px;
        }

        .comments-list::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 107, 157, 0.7);
        }

        /* 动画效果 */
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .comment-item {
            animation: fadeIn 0.3s ease;
        }

        #sexyai-comment-board {
            animation: slideIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // 获取当前作品ID
    function getCurrentWorkId() {
        const url = window.location.href;

        // 尝试从URL中提取作品ID
        const patterns = [
            /\/work\/([^/?]+)/,
            /\/chat\/([^/?]+)/,
            /\/character\/([^/?]+)/,
            /\/story\/([^/?]+)/,
            /\/image\/([^/?]+)/,
            /id=([^&]+)/,
            /workId=([^&]+)/,
            /characterId=([^&]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        // 如果URL中没有明确的ID，尝试从页面元素中获取
        const titleElement = document.querySelector('h1, .title, .work-title, .character-name');
        if (titleElement) {
            const title = titleElement.textContent.trim();
            if (title) {
                // 使用标题的哈希值作为ID
                return btoa(encodeURIComponent(title)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
            }
        }

        // 最后使用URL路径作为ID
        return btoa(encodeURIComponent(window.location.pathname)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    // 获取作品信息
    function getWorkInfo() {
        const titleElement = document.querySelector('h1, .title, .work-title, .character-name, .chat-title');
        const title = titleElement ? titleElement.textContent.trim() : '未知作品';

        const authorElement = document.querySelector('.author, .creator, .username, .character-author');
        const author = authorElement ? authorElement.textContent.trim() : '未知作者';

        return { title, author };
    }

    // 创建留言板
    function createCommentBoard() {
        const board = document.createElement('div');
        board.id = 'sexyai-comment-board';
        board.className = boardPosition + (isMinimized ? ' minimized' : '');

        const workInfo = getWorkInfo();
        const comments = getComments(currentWorkId);

        board.innerHTML = `
            <div class="comment-board-header">
                <div class="comment-board-title">
                    💬 留言板
                    <span class="comment-count">${comments.length}</span>
                </div>
                <div class="comment-board-controls">
                    <button class="control-btn" id="settings-btn" title="设置">⚙️</button>
                    <button class="control-btn" id="minimize-btn" title="${isMinimized ? '展开' : '收起'}">${isMinimized ? '📖' : '📕'}</button>
                    <button class="control-btn" id="close-btn" title="关闭">✖️</button>
                </div>
                <div class="settings-panel" id="settings-panel">
                    <div class="settings-item">
                        <label class="settings-label">位置</label>
                        <select class="settings-select" id="position-select">
                            <option value="right-side">右侧</option>
                            <option value="left-side">左侧</option>
                            <option value="bottom-right">右下角</option>
                            <option value="bottom-left">左下角</option>
                        </select>
                    </div>
                    <div class="settings-item">
                        <label class="settings-label">
                            <input type="checkbox" class="settings-checkbox" id="show-by-default"> 默认展开
                        </label>
                    </div>
                    <div class="settings-item">
                        <label class="settings-label">
                            <input type="checkbox" class="settings-checkbox" id="allow-anonymous"> 允许匿名
                        </label>
                    </div>
                </div>
            </div>
            <div class="comment-board-content">
                <div class="work-info">
                    <strong>📖 ${workInfo.title}</strong><br>
                    <small>👤 ${workInfo.author}</small>
                </div>
                <div class="comments-list" id="comments-list">
                    ${renderComments(comments)}
                </div>
                <div class="comment-input-area">
                    ${allowAnonymous ? '' : '<input type="text" class="author-input" id="author-input" placeholder="您的昵称" maxlength="20">'}
                    <textarea class="comment-input" id="comment-input" placeholder="写下您的留言..." maxlength="500"></textarea>
                    <div class="input-controls">
                        <div class="emoji-picker">
                            ${emojis.slice(0, 10).map(emoji => `<button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`).join('')}
                        </div>
                        <button class="submit-btn" id="submit-comment">发送</button>
                    </div>
                </div>
            </div>
        `;

        return board;
    }

    // 渲染评论列表
    function renderComments(comments) {
        if (comments.length === 0) {
            return '<div class="no-comments">暂无留言，快来抢沙发吧！</div>';
        }

        return comments.map(comment => `
            <div class="comment-item" data-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${formatTime(comment.timestamp)}</span>
                </div>
                <div class="comment-content">${escapeHtml(comment.content)}</div>
                <div class="comment-actions">
                    <button class="comment-action-btn like-btn" data-id="${comment.id}">
                        👍 ${comment.likes || 0}
                    </button>
                    <button class="comment-action-btn reply-btn" data-id="${comment.id}">
                        💬 回复
                    </button>
                    <button class="comment-action-btn delete-btn" data-id="${comment.id}">
                        🗑️ 删除
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 获取评论数据
    function getComments(workId) {
        const key = `comments_${workId}`;
        const comments = GM_getValue(key, '[]');
        try {
            return JSON.parse(comments);
        } catch (e) {
            console.error('解析评论数据失败:', e);
            return [];
        }
    }

    // 保存评论数据
    function saveComments(workId, comments) {
        const key = `comments_${workId}`;
        // 限制评论数量
        if (comments.length > maxCommentsPerWork) {
            comments = comments.slice(-maxCommentsPerWork);
        }
        GM_setValue(key, JSON.stringify(comments));
    }

    // 添加评论
    function addComment(workId, content, author) {
        const comments = getComments(workId);
        const newComment = {
            id: Date.now().toString(),
            content: content.trim(),
            author: author || (allowAnonymous ? '匿名用户' : '游客'),
            timestamp: Date.now(),
            likes: 0
        };

        comments.push(newComment);
        saveComments(workId, comments);
        return newComment;
    }

    // 删除评论
    function deleteComment(workId, commentId) {
        const comments = getComments(workId);
        const filteredComments = comments.filter(c => c.id !== commentId);
        saveComments(workId, filteredComments);
    }

    // 点赞评论
    function likeComment(workId, commentId) {
        const comments = getComments(workId);
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes = (comment.likes || 0) + 1;
            saveComments(workId, comments);
        }
    }

    // 格式化时间
    function formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        if (diff < 60000) {
            return '刚刚';
        } else if (diff < 3600000) {
            return Math.floor(diff / 60000) + '分钟前';
        } else if (diff < 86400000) {
            return Math.floor(diff / 3600000) + '小时前';
        } else {
            const date = new Date(timestamp);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 初始化留言板事件
    function initCommentBoardEvents() {
        if (!commentBoard) return;

        // 头部点击切换最小化
        const header = commentBoard.querySelector('.comment-board-header');
        header.addEventListener('click', (e) => {
            if (e.target.closest('.comment-board-controls')) return;
            toggleMinimize();
        });

        // 最小化按钮
        const minimizeBtn = commentBoard.querySelector('#minimize-btn');
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMinimize();
        });

        // 关闭按钮
        const closeBtn = commentBoard.querySelector('#close-btn');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideCommentBoard();
        });

        // 设置按钮
        const settingsBtn = commentBoard.querySelector('#settings-btn');
        const settingsPanel = commentBoard.querySelector('#settings-panel');
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
        });

        // 设置选项
        const positionSelect = commentBoard.querySelector('#position-select');
        positionSelect.value = boardPosition;
        positionSelect.addEventListener('change', (e) => {
            boardPosition = e.target.value;
            GM_setValue('boardPosition', boardPosition);
            updateBoardPosition();
        });

        const showByDefaultCheckbox = commentBoard.querySelector('#show-by-default');
        showByDefaultCheckbox.checked = showBoardByDefault;
        showByDefaultCheckbox.addEventListener('change', (e) => {
            showBoardByDefault = e.target.checked;
            GM_setValue('showBoardByDefault', showBoardByDefault);
        });

        const allowAnonymousCheckbox = commentBoard.querySelector('#allow-anonymous');
        allowAnonymousCheckbox.checked = allowAnonymous;
        allowAnonymousCheckbox.addEventListener('change', (e) => {
            allowAnonymous = e.target.checked;
            GM_setValue('allowAnonymous', allowAnonymous);
            refreshCommentBoard();
        });

        // 表情按钮
        const emojiButtons = commentBoard.querySelectorAll('.emoji-btn');
        const commentInput = commentBoard.querySelector('#comment-input');
        emojiButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const emoji = btn.dataset.emoji;
                const cursorPos = commentInput.selectionStart;
                const textBefore = commentInput.value.substring(0, cursorPos);
                const textAfter = commentInput.value.substring(commentInput.selectionEnd);
                commentInput.value = textBefore + emoji + textAfter;
                commentInput.focus();
                commentInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
            });
        });

        // 发送评论
        const submitBtn = commentBoard.querySelector('#submit-comment');
        submitBtn.addEventListener('click', submitComment);

        // 回车发送
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                submitComment();
            }
        });

        // 评论操作
        const commentsList = commentBoard.querySelector('#comments-list');
        commentsList.addEventListener('click', (e) => {
            const target = e.target;
            const commentId = target.dataset.id;

            if (target.classList.contains('like-btn')) {
                likeComment(currentWorkId, commentId);
                refreshCommentsList();
            } else if (target.classList.contains('delete-btn')) {
                if (confirm('确定要删除这条评论吗？')) {
                    deleteComment(currentWorkId, commentId);
                    refreshCommentsList();
                }
            } else if (target.classList.contains('reply-btn')) {
                const commentItem = target.closest('.comment-item');
                const author = commentItem.querySelector('.comment-author').textContent;
                commentInput.value = `@${author} `;
                commentInput.focus();
            }
        });

        // 点击外部关闭设置面板
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#settings-panel') && !e.target.closest('#settings-btn')) {
                settingsPanel.style.display = 'none';
            }
        });
    }

    // 提交评论
    function submitComment() {
        const commentInput = commentBoard.querySelector('#comment-input');
        const authorInput = commentBoard.querySelector('#author-input');
        const content = commentInput.value.trim();

        if (!content) {
            alert('请输入留言内容');
            return;
        }

        const author = authorInput ? authorInput.value.trim() : '';

        addComment(currentWorkId, content, author);
        commentInput.value = '';
        if (authorInput) authorInput.value = '';

        refreshCommentsList();
        updateCommentCount();

        // 滚动到底部
        const commentsList = commentBoard.querySelector('#comments-list');
        setTimeout(() => {
            commentsList.scrollTop = commentsList.scrollHeight;
        }, 100);
    }

    // 刷新评论列表
    function refreshCommentsList() {
        const commentsList = commentBoard.querySelector('#comments-list');
        const comments = getComments(currentWorkId);
        commentsList.innerHTML = renderComments(comments);
    }

    // 更新评论数量
    function updateCommentCount() {
        const commentCount = commentBoard.querySelector('.comment-count');
        const comments = getComments(currentWorkId);
        commentCount.textContent = comments.length;
    }

    // 切换最小化状态
    function toggleMinimize() {
        isMinimized = !isMinimized;
        const minimizeBtn = commentBoard.querySelector('#minimize-btn');

        if (isMinimized) {
            commentBoard.classList.add('minimized');
            minimizeBtn.textContent = '📖';
            minimizeBtn.title = '展开';
        } else {
            commentBoard.classList.remove('minimized');
            minimizeBtn.textContent = '📕';
            minimizeBtn.title = '收起';
        }
    }

    // 更新留言板位置
    function updateBoardPosition() {
        commentBoard.className = boardPosition + (isMinimized ? ' minimized' : '');
    }

    // 显示留言板
    function showCommentBoard() {
        if (!isCommentBoardEnabled) return;

        currentWorkId = getCurrentWorkId();
        if (!currentWorkId) return;

        // 移除旧的留言板
        const existingBoard = document.getElementById('sexyai-comment-board');
        if (existingBoard) {
            existingBoard.remove();
        }

        // 创建新的留言板
        commentBoard = createCommentBoard();
        document.body.appendChild(commentBoard);

        // 初始化事件
        initCommentBoardEvents();

        console.log('SexyAI留言板已加载，作品ID:', currentWorkId);
    }

    // 隐藏留言板
    function hideCommentBoard() {
        if (commentBoard) {
            commentBoard.remove();
            commentBoard = null;
        }
    }

    // 刷新留言板
    function refreshCommentBoard() {
        if (commentBoard) {
            hideCommentBoard();
            showCommentBoard();
        }
    }

    // 检测页面变化
    function observePageChanges() {
        let currentUrl = window.location.href;

        const observer = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(() => {
                    if (shouldShowCommentBoard()) {
                        showCommentBoard();
                    } else {
                        hideCommentBoard();
                    }
                }, 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // 判断是否应该显示留言板
    function shouldShowCommentBoard() {
        const url = window.location.href;

        // 检查是否在作品页面
        const workPagePatterns = [
            /\/work\//,
            /\/chat\//,
            /\/character\//,
            /\/story\//,
            /\/image\//,
            /\/pages\/chat/,
            /\/pages\/character/,
            /\/pages\/work/
        ];

        return workPagePatterns.some(pattern => pattern.test(url));
    }

    // 创建控制按钮
    function createControlButton() {
        const button = document.createElement('div');
        button.id = 'sexyai-comment-control';
        button.innerHTML = '💬';
        button.style.cssText = `
            position: fixed;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            z-index: 9998;
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #ff6b9d, #4ecdc4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => {
            if (commentBoard) {
                hideCommentBoard();
            } else {
                showCommentBoard();
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-50%) scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(-50%) scale(1)';
        });

        return button;
    }

    // 初始化
    function init() {
        try {
            console.log('🔥 SexyAI作品留言板插件已启动 v1.0.0');

            // 加载设置
            isCommentBoardEnabled = GM_getValue('isCommentBoardEnabled', true);
            boardPosition = GM_getValue('boardPosition', 'right-side');
            boardTheme = GM_getValue('boardTheme', 'dark');
            showBoardByDefault = GM_getValue('showBoardByDefault', false);
            allowAnonymous = GM_getValue('allowAnonymous', true);
            maxCommentsPerWork = GM_getValue('maxCommentsPerWork', 100);

            // 创建控制按钮
            const controlButton = createControlButton();
            document.body.appendChild(controlButton);

            // 开始监听页面变化
            pageObserver = observePageChanges();

            // 初始检查
            setTimeout(() => {
                if (shouldShowCommentBoard() && showBoardByDefault) {
                    showCommentBoard();
                }
            }, 2000);

            // 页面卸载时清理
            window.addEventListener('beforeunload', () => {
                if (pageObserver) {
                    pageObserver.disconnect();
                }
            });

        } catch (error) {
            console.error('SexyAI留言板插件初始化失败:', error);
        }
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();