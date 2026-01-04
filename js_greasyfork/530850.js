// ==UserScript==
// @name         block let user
// @namespace    yournamespace
// @version      1.1
// @description  屏蔽 lowendtalk 指定用户的帖子，支持点击用户名屏蔽
// @author       ayasetan
// @match        https://lowendtalk.com/categories/offers*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530850/block%20let%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/530850/block%20let%20user.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从存储中获取屏蔽用户列表，如果没有则使用默认空数组
    let blockedUsers = JSON.parse(GM_getValue('blockedUsers', '[]'));

    // 主功能：屏蔽帖子
    function hideBlockedUsers() {
        const items = document.querySelectorAll('.ItemDiscussion');  // 获取所有帖子的元素

        items.forEach(item => {
            const authorLink = item.querySelector('.DiscussionAuthor a');
            if (!authorLink) return;

            const username = authorLink.textContent.trim();

            if (blockedUsers.includes(username)) {
                item.style.display = 'none';  // 隐藏被屏蔽用户的帖子
            } else {
                // 添加点击事件监听器
                authorLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (confirm(`是否要屏蔽用户 ${username} 的所有帖子？`)) {
                        if (!blockedUsers.includes(username)) {
                            blockedUsers.push(username);
                            GM_setValue('blockedUsers', JSON.stringify(blockedUsers));
                            alert(`已屏蔽用户 ${username}`);
                            hideBlockedUsers(); // 重新执行屏蔽
                        }
                    }
                });
            }
        });
    }

    // 初始执行
    hideBlockedUsers();


})();