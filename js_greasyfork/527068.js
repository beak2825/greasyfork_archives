// ==UserScript==
// @name         Block Posts by Thread ID with Unblock Feature and Pagination
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block posts by their thread ID, show blocked list with pagination, and add unblock feature
// @author       You
// @match        https://simpcity.su/forums/transgender.36/*
// @match        https://simpcity.su/forums/trans-requests.39/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527068/Block%20Posts%20by%20Thread%20ID%20with%20Unblock%20Feature%20and%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/527068/Block%20Posts%20by%20Thread%20ID%20with%20Unblock%20Feature%20and%20Pagination.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从 Tampermonkey 存储中获取已经屏蔽的帖子 ID 列表，如果没有则使用空数组
    let blockedThreadIds = GM_getValue('blockedThreadIds', []);
    let currentPage = 1; // 当前页码

    // 每页显示的帖子 ID 数量
    const postsPerPage = 10;

    // 创建一个容器来显示被屏蔽的帖子 ID 列表
    const blockedListContainer = document.createElement('div');
    blockedListContainer.style.position = 'fixed';
    blockedListContainer.style.top = '10px';
    blockedListContainer.style.right = '10px';
    blockedListContainer.style.padding = '10px';
    blockedListContainer.style.backgroundColor = '#f44336';
    blockedListContainer.style.color = 'white';
    blockedListContainer.style.borderRadius = '5px';
    blockedListContainer.style.maxWidth = '300px';
    blockedListContainer.style.maxHeight = '400px';
    blockedListContainer.style.overflowY = 'scroll';
    blockedListContainer.style.zIndex = '1000';
    blockedListContainer.innerHTML = '<strong>Blocked Threads:</strong>';

    // 创建分页按钮容器
    const paginationContainer = document.createElement('div');
    paginationContainer.style.marginTop = '10px';

    // 更新显示被屏蔽的帖子 ID 列表，并添加分页功能
    const updateBlockedList = () => {
        blockedListContainer.innerHTML = '<strong>Blocked Threads:</strong>';
        const startIdx = (currentPage - 1) * postsPerPage;
        const endIdx = startIdx + postsPerPage;
        const currentPageThreads = blockedThreadIds.slice(startIdx, endIdx);

        currentPageThreads.forEach(id => {
            const item = document.createElement('div');
            item.textContent = `Thread ID: ${id}`;

            // 创建撤回屏蔽按钮
            const unblockButton = document.createElement('button');
            unblockButton.textContent = 'Unblock'; // "撤回屏蔽"按钮
            unblockButton.style.marginLeft = '10px';
            unblockButton.style.backgroundColor = '#4CAF50';
            unblockButton.style.color = 'white';
            unblockButton.style.border = 'none';
            unblockButton.style.borderRadius = '4px';
            unblockButton.style.cursor = 'pointer';
            unblockButton.addEventListener('click', () => {
                // 点击撤回按钮时，从屏蔽列表中移除该 ID，并更新页面
                blockedThreadIds = blockedThreadIds.filter(threadId => threadId !== id);
                GM_setValue('blockedThreadIds', blockedThreadIds); // 更新 Tampermonkey 存储
                updateBlockedList(); // 更新显示列表
                const post = document.querySelector(`.js-threadListItem-${id}`);
                if (post) {
                    post.style.display = ''; // 恢复显示该帖子
                }
            });

            item.appendChild(unblockButton);
            blockedListContainer.appendChild(item);
        });

        // 生成分页按钮
        generatePagination();
    };

    // 创建分页按钮并添加到页面
    const generatePagination = () => {
        paginationContainer.innerHTML = ''; // 清空现有的分页按钮
        const totalPages = Math.ceil(blockedThreadIds.length / postsPerPage);

        // 上一页按钮
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.style.marginRight = '10px';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateBlockedList(); // 更新显示列表
            }
        });

        // 下一页按钮
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateBlockedList(); // 更新显示列表
            }
        });

        paginationContainer.appendChild(prevButton);

        // 显示当前页码和总页数
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        paginationContainer.appendChild(pageInfo);

        paginationContainer.appendChild(nextButton);
        blockedListContainer.appendChild(paginationContainer);
    };

    // 将列表添加到页面
    document.body.appendChild(blockedListContainer);

    // 在页面加载时检查并隐藏被屏蔽的帖子
    const posts = document.querySelectorAll('.structItem'); // 找到所有帖子容器

    posts.forEach(post => {
        // 先尝试获取帖子 ID
        const postId = post.className.match(/js-threadListItem-(\d+)/);

        if (postId && postId[1]) {
            const threadId = parseInt(postId[1]);

            // 如果帖子被屏蔽，则隐藏帖子
            if (blockedThreadIds.includes(threadId)) {
                post.style.display = 'none'; // 隐藏已经屏蔽的帖子
            }

            // 为每个帖子添加一个“屏蔽”按钮
            const blockButton = document.createElement('button');
            blockButton.textContent = 'Block'; // 修改为 Block
            blockButton.style.position = 'absolute';
            blockButton.style.top = '10px';
            blockButton.style.right = '10px';
            blockButton.style.padding = '5px';
            blockButton.style.backgroundColor = '#f44336';
            blockButton.style.color = 'white';
            blockButton.style.border = 'none';
            blockButton.style.borderRadius = '4px';
            blockButton.style.cursor = 'pointer';

            // 点击 "Block" 按钮时，添加帖子 ID 到屏蔽名单
            blockButton.addEventListener('click', function() {
                if (!blockedThreadIds.includes(threadId)) {
                    blockedThreadIds.push(threadId); // 添加到屏蔽名单
                    GM_setValue('blockedThreadIds', blockedThreadIds); // 实时更新 Tampermonkey 存储
                    post.style.display = 'none'; // 立即隐藏该帖子
                    updateBlockedList(); // 更新屏蔽帖子列表
                    alert('帖子已加入屏蔽名单');
                }
            });

            // 将按钮添加到每个帖子的容器中
            post.style.position = 'relative'; // 确保帖子容器有位置属性
            post.appendChild(blockButton);
        }
    });

    // 监视页面中是否新增了帖子并更新按钮（避免动态加载）
    const observer = new MutationObserver(() => {
        const posts = document.querySelectorAll('.structItem');
        posts.forEach(post => {
            const postId = post.className.match(/js-threadListItem-(\d+)/);
            if (postId && !post.querySelector('.block-btn')) {
                const blockButton = document.createElement('button');
                blockButton.textContent = 'Block'; // 修改为 Block
                blockButton.className = 'block-btn';
                blockButton.style.position = 'absolute';
                blockButton.style.top = '10px';
                blockButton.style.right = '10px';
                blockButton.style.padding = '5px';
                blockButton.style.backgroundColor = '#f44336';
                blockButton.style.color = 'white';
                blockButton.style.border = 'none';
                blockButton.style.borderRadius = '4px';
                blockButton.style.cursor = 'pointer';

                blockButton.addEventListener('click', function() {
                    if (postId && postId[1]) {
                        const threadId = parseInt(postId[1]);
                        if (!blockedThreadIds.includes(threadId)) {
                            blockedThreadIds.push(threadId); // 添加到屏蔽名单
                            GM_setValue('blockedThreadIds', blockedThreadIds); // 实时更新 Tampermonkey 存储
                            post.style.display = 'none'; // 立即隐藏该帖子
                            updateBlockedList(); // 更新屏蔽帖子列表
                            alert('帖子已加入屏蔽名单');
                        }
                    }
                });

                post.style.position = 'relative'; // 确保帖子容器有位置属性
                post.appendChild(blockButton);
            }
        });
    });

    // 开始观察 DOM 变化（监听页面动态加载帖子）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化时更新显示屏蔽帖子列表
    updateBlockedList();
})();
