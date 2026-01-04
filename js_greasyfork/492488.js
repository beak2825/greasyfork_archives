// ==UserScript==
// @name         雪球快速拉黑用户按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在页面上直接为雪球网的个股讨论添加拉黑按钮
// @author       很太
// @match        https://xueqiu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/492488/%E9%9B%AA%E7%90%83%E5%BF%AB%E9%80%9F%E6%8B%89%E9%BB%91%E7%94%A8%E6%88%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492488/%E9%9B%AA%E7%90%83%E5%BF%AB%E9%80%9F%E6%8B%89%E9%BB%91%E7%94%A8%E6%88%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => mutations.forEach(addButtonIfNewNodes));

    function addButtonIfNewNodes(mutation) {
        if (mutation.addedNodes.length) addButton();
    }

    function addButton() {
        document.querySelectorAll('article.timeline__item').forEach(item => {
            if (!item.querySelector('.custom-blacklist-btn')) {
                const userInfoLink = item.querySelector('a[data-tooltip]');
                if (userInfoLink) {
                    const blockButton = createBlockButton(userInfoLink.getAttribute('data-tooltip'));
                    const actionsContainer = item.querySelector('.timeline__item__ft');
                    actionsContainer && actionsContainer.appendChild(blockButton);
                }
            }
        });
    }

    function createBlockButton(userId) {
        const blockButton = document.createElement('a');
        blockButton.className = 'timeline__item__control custom-blacklist-btn';
        blockButton.innerHTML = '<i class="iconfont"></i><span>拉黑</span>';
        blockButton.href = 'javascript:void(0);';
        blockButton.onclick = () => blockUser(userId);
        return blockButton;
    }

    function blockUser(userId) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://xueqiu.com/blocks/create.json',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: `user_id=${encodeURIComponent(userId)}`,
            onload: (response) => handleResponse(response, userId),
            onerror: () => GM_notification('拉黑请求发送失败。', '请求失败')
        });
    }

    function handleResponse(response, userId) {
        const jsonResponse = JSON.parse(response.responseText);
        if (response.status === 200 && jsonResponse.success) {
            GM_notification(`用户 ${userId} 已被拉黑`, '拉黑成功');
        } else {
            GM_notification('拉黑操作失败，请稍后再试。', '操作失败');
        }
    }

    observer.observe(document.body, { childList: true, subtree: true });
    addButton();
})();