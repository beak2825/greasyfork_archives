// ==UserScript==
// @name         隐藏 Linux.do 特定帖子和用户
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  隐藏 Linux.do 上指定标签的帖子和无解决方案的帖子，以及指定用户的帖子，并添加置顶按钮
// @match        https://linux.do/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520299/%E9%9A%90%E8%97%8F%20Linuxdo%20%E7%89%B9%E5%AE%9A%E5%B8%96%E5%AD%90%E5%92%8C%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/520299/%E9%9A%90%E8%97%8F%20Linuxdo%20%E7%89%B9%E5%AE%9A%E5%B8%96%E5%AD%90%E5%92%8C%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blockedUsers = GM_getValue('blockedUsers', []);
    let blockedTags = GM_getValue('blockedTags', []);
    let hideNoSolution = GM_getValue('hideNoSolution', true);

    GM_registerMenuCommand('配置屏蔽的用户', configureBlockedUsers);
    GM_registerMenuCommand('配置屏蔽的标签', configureBlockedTags);
    GM_registerMenuCommand('切换无解决方案帖子显示', toggleNoSolution);

    function configureBlockedUsers() {
        const users = prompt('请输入要屏蔽的用户名，用"|"分隔：', blockedUsers.join('|'));
        if (users !== null) {
            const trimmedUsers = users.split('|').map(user => user.trim()).filter(user => user.length > 0);
            if (trimmedUsers.length > 0) {
                blockedUsers = trimmedUsers;
                GM_setValue('blockedUsers', blockedUsers);
                alert('屏蔽的用户已更新。请刷新页面以应用更改。');
                hideTopics();
            } else {
                alert('请输入至少一个有效的用户名。');
            }
        }
    }

    function configureBlockedTags() {
        const tags = prompt('请输入要屏蔽的标签，用"|"分隔：', blockedTags.join('|'));
        if (tags !== null) {
            const trimmedTags = tags.split('|').map(tag => tag.trim()).filter(tag => tag.length > 0);
            blockedTags = trimmedTags;
            GM_setValue('blockedTags', blockedTags);
            alert('屏蔽的标签已更新。请刷新页面以应用更改。');
            hideTopics();
        }
    }

    function toggleNoSolution() {
        hideNoSolution = !hideNoSolution;
        GM_setValue('hideNoSolution', hideNoSolution);
        alert(`${hideNoSolution ? '已开启' : '已关闭'}隐藏无解决方案帖子。请刷新页面以应用更改。`);
        hideTopics();
    }

    function hideTopics() {
        const topicItems = document.querySelectorAll('tr.topic-list-item:not([data-processed])');

        topicItems.forEach((topic) => {
            const tags = topic.querySelectorAll('a.discourse-tag');
            const noSolution = topic.querySelector('span[title="此话题尚无解决方案"]');
            const userElement = topic.querySelector('.posters a:first-child');
            const username = userElement ? userElement.getAttribute('data-user-card') : null;

            if (Array.from(tags).some(tag => blockedTags.includes(tag.getAttribute('data-tag-name'))) ||
                (hideNoSolution && noSolution) ||
                (username && blockedUsers.includes(username))) {
                topic.style.visibility = 'hidden';
                topic.style.position = 'absolute';
                topic.style.left = '-9999px';
            }

            topic.setAttribute('data-processed', 'true');
        });
    }

    function addBlockButton() {
        const userCardContainer = document.querySelector('ul.usercard-controls');
        if (userCardContainer) {
            if (!userCardContainer.querySelector('.block-user-button')) {
                const button = document.createElement('button');
                button.textContent = '屏蔽此用户';
                button.className = 'btn btn-icon-text btn-primary block-user-button';
                button.style.marginTop = '10px';
                button.addEventListener('click', () => {
                    const username = document.querySelector('.names__secondary.username').textContent.trim();
                    if (username && !blockedUsers.includes(username)) {
                        blockedUsers.push(username);
                        GM_setValue('blockedUsers', blockedUsers);
                        alert(`${username} 已被屏蔽。`);
                        hideTopics();
                        addBlockButton();
                    }
                });
                userCardContainer.appendChild(button);
            }
        }
    }

    function addUnblockButton() {
        const userCardContainer = document.querySelector('ul.usercard-controls');
        if (userCardContainer) {
            if (!userCardContainer.querySelector('.unblock-user-button')) {
                const button = document.createElement('button');
                button.textContent = '取消屏蔽';
                button.className = 'btn btn-icon-text btn-secondary unblock-user-button';
                button.style.marginTop = '10px';
                button.addEventListener('click', () => {
                    const username = document.querySelector('.names__secondary.username').textContent.trim();
                    if (username && blockedUsers.includes(username)) {
                        blockedUsers = blockedUsers.filter(user => user !== username);
                        GM_setValue('blockedUsers', blockedUsers);
                        alert(`${username} 的屏蔽已被取消。`);
                        hideTopics();
                        addUnblockButton();
                    }
                });
                userCardContainer.appendChild(button);
            }
        }
    }

    function addScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'btn-scroll-top';
    button.innerHTML = `
        <svg class="fa d-icon d-icon-arrow-up svg-icon" xmlns="http://www.w3.org/2000/svg">
            <use href="#arrow-up"></use>
        </svg>
        <span style="margin-left: 5px;">置顶</span>
    `;
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = 'rgb(209, 240, 255)'; // 设置背景颜色
    button.style.color = '#646464'; // 设置文字颜色
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.transition = 'background-color 0.3s';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = 'rgb(189, 220, 235)'; // 悬停时的背景颜色
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = 'rgb(209, 240, 255)';
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(button);
}

    hideTopics();
    addScrollToTopButton();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                hideTopics();
                addBlockButton();
                addUnblockButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        if (scrolled >= scrollable) {
            const loadMoreButton = document.querySelector('.load-more-button');
            if (loadMoreButton) {
                loadMoreButton.click();
            }
        }
    });
})();