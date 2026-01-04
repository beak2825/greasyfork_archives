// ==UserScript==
// @name         煎蛋用户名搜索
// @name:en      JandanUserSearch
// @namespace    https://github.com/cornradio/jandan-user-search
// @version      1.0.7
// @description  在煎蛋网页添加用户名搜索功能，支持自动翻页查找
// @description:en  Add username search function to jandan.net with auto-page-turning
// @author       kasusa
// @match        https://jandan.net/*
// @match        https://i.jandan.net/*
// @license      MIT
// @icon         https://jandan.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523770/%E7%85%8E%E8%9B%8B%E7%94%A8%E6%88%B7%E5%90%8D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/523770/%E7%85%8E%E8%9B%8B%E7%94%A8%E6%88%B7%E5%90%8D%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个容器来放置搜索框和按钮
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.gap = '5px';
    //max-width

    // 搜索框
    const search = document.createElement('input');
    search.type = 'text';
    search.placeholder = '请输入用户名';
    search.style.padding = '0px 74px 1px 3px'; // 右侧留出更多空间给计数器和按钮
    search.style.border = '1px solid #ccc';
    search.style.borderRadius = '4px';
    search.style.backgroundColor = '#ffffff78';
    search.style.backdropFilter = 'blur(10px)';
    search.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    search.style.position = 'relative';
    search.style.maxWidth = '200px';
    search.style.marginRight = '20px';

    // 计数器
    const counter = document.createElement('span');
    counter.textContent = '0/0';
    counter.style.position = 'absolute';
    counter.style.right = '50px';  // 调整位置，为搜索按钮留出空间
    counter.style.top = '50%';
    counter.style.transform = 'translateY(-50%)';
    counter.style.color = '#666';
    counter.style.fontSize = '14px';
    counter.style.pointerEvents = 'none';
    counter.style.backgroundColor = 'transparent';
    counter.style.border = 'none';
    counter.style.padding = '0';

    // 搜索按钮
    const searchBtn = document.createElement('button');
    searchBtn.innerHTML = '🔍';
    searchBtn.style.position = 'absolute';
    searchBtn.style.right = '18px';
    searchBtn.style.top = '50%';
    searchBtn.style.transform = 'translateY(-50%)';
    searchBtn.style.border = 'none';
    searchBtn.style.backgroundColor = 'transparent';
    searchBtn.style.color = '#666';
    searchBtn.style.cursor = 'pointer';
    searchBtn.style.fontSize = '16px';
    searchBtn.style.display = 'flex';
    searchBtn.style.alignItems = 'center';
    searchBtn.style.justifyContent = 'center';
    searchBtn.style.width = '32px';
    searchBtn.style.height = '32px';
    searchBtn.style.padding = '0';
    searchBtn.title = '搜索用户';

    // 创建一个包装器来包含搜索框、计数器和按钮
    const searchWrapper = document.createElement('div');
    searchWrapper.style.position = 'relative';
    searchWrapper.style.display = 'inline-block';
    searchWrapper.appendChild(search);
    searchWrapper.appendChild(counter);
    searchWrapper.appendChild(searchBtn);

    // 从localStorage加载保存的用户名
    const savedUsername = localStorage.getItem('monkey_jandan_username');
    if (savedUsername) {
        search.value = savedUsername;
    }

    // 监听输入变化并保存到localStorage
    search.addEventListener('input', () => {
        localStorage.setItem('monkey_jandan_username', search.value);
    });

    // 添加一个变量来跟踪当前匹配的索引
    let currentMatchIndex = -1;
    let currentMatches = [];

    // 修改搜索功能
    async function searchUsername() {
        // 移除之前的高亮
        document.querySelectorAll('.highlight-author').forEach(el => {
            el.classList.remove('highlight-author');
        });

        const username = search.value.trim();
        if (!username) {
            counter.textContent = '0/0';
            currentMatches = [];
            currentMatchIndex = -1;
            return;
        }

// 同时支持PC版和手机版的选择器，包括新版煎蛋的选择器
const authors = document.querySelectorAll('.author, li[id^="comment-"] > b, .author-anonymous, .author-logged');
currentMatches = Array.from(authors).filter(author =>
    // 检查textContent，因为作者名字在span标签内部
    author.textContent.toLowerCase().includes(username.toLowerCase())
);


        if (currentMatches.length > 0) {
            // 如果是新的搜索，重置索引
            if (currentMatchIndex === -1) {
                currentMatchIndex = 0;
            } else {
                // 移动到下一个匹配
                currentMatchIndex++;
                // 如果已经是最后一个匹配，则跳转到下一页
                if (currentMatchIndex >= currentMatches.length) {

const nextPageButton = Array.from(document.querySelectorAll('button, a')) // 尝试选择button和a标签，因为翻页按钮可能是a标签
    .find(btn => {
        const text = btn.textContent.trim();
        return text === 'NEXT' || text === '>';
    });
if (nextPageButton){
                        sessionStorage.setItem('searchUsername', username);
                        sessionStorage.setItem('autoSearch', 'true');
                        nextPageButton.click();
                        return;
                    } else {
                        alert('已到最后一页，未找到更多结果');
                        currentMatchIndex = currentMatches.length - 1;
                    }
                }
            }

            // 更新计数器显示当前位置/匹配总数
            counter.textContent = `${currentMatchIndex + 1}/${currentMatches.length}`;

            // 高亮并滚动到当前匹配
            currentMatches.forEach((match, index) => {
                match.classList.add('highlight-author');
                if (index === currentMatchIndex) {
                    match.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        } else {
            counter.textContent = '0/0';
            currentMatchIndex = -1;

const nextPageButton = Array.from(document.querySelectorAll('button, a')) // 尝试选择button和a标签，因为翻页按钮可能是a标签
    .find(btn => {
        const text = btn.textContent.trim();
        return text === 'NEXT' || text === '>';
    });
if (nextPageButton) {
                sessionStorage.setItem('searchUsername', username);
                sessionStorage.setItem('autoSearch', 'true');
                nextPageButton.click();
            } else {
                alert('已到最后一页，未找到该用户名');
            }
        }
    }

    // 页面加载完成后检查是否需要自动搜索
    function checkAutoSearch() {
        const autoSearch = sessionStorage.getItem('autoSearch');
        const searchUsername = sessionStorage.getItem('searchUsername');

        if (autoSearch === 'true' && searchUsername) {
            // 清除自动搜索标记
            sessionStorage.removeItem('autoSearch');

            // 设置搜索框的值
            search.value = searchUsername;

            // 缩短延迟时间，加快搜索速度
            setTimeout(() => {
                searchUsername();
            }, 500);
        }
    }

    // 添加高亮样式
    const style = document.createElement('style');
    style.textContent = `
        .highlight-author {
            background-color: yellow !important;
            padding: 2px 5px !important;
            border-radius: 3px !important;
            color:black !important;
        }
    `;
    document.head.appendChild(style);

    // 添加事件监听
    searchBtn.addEventListener('click', searchUsername);
    search.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchUsername();
        }
    });

    // 修改container样式
    container.style.alignItems = 'center';

    // 修改元素添加顺序
    container.appendChild(searchWrapper);
    document.body.appendChild(container);

    // 检查是否需要自动搜索
    checkAutoSearch();
})();