// ==UserScript==
// @name        里屋论坛显示发帖时间（Show Timestamp in Liwu）
// @namespace   Violentmonkey Scripts
// @match       https://*.253874.net/t/*
// @match       http://*.253874.net/t/*
// @grant       none
// @version     1.0
// @author      Calon
// @license     MIT
// @description 2025/3/30 19:44:16
// @downloadURL https://update.greasyfork.org/scripts/531327/%E9%87%8C%E5%B1%8B%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4%EF%BC%88Show%20Timestamp%20in%20Liwu%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531327/%E9%87%8C%E5%B1%8B%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4%EF%BC%88Show%20Timestamp%20in%20Liwu%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有class为post_list的元素
    const postListElements = document.getElementsByClassName('post_list');

    // 遍历每个post_list元素
    for (let postElement of postListElements) {
        try {
            // 提取title内容
            const title = postElement.title;

            // 从title中提取时间部分（去掉"UTC+8："前缀）
            let timestamp = title.replace(/^UTC\+8：/, '').trim();

            // 找到author div下的username链接
            const authorDiv = postElement.getElementsByClassName('author')[0];
            if (!authorDiv) continue;

            const usernameLink = authorDiv.getElementsByClassName('username')[0];
            if (!usernameLink) continue;

            // 检查是否已经添加过时间戳（避免重复添加）
            if (!usernameLink.textContent.includes('@')) {
                // 在用户名后添加时间戳
                usernameLink.textContent += `@${timestamp}`;
            }
        } catch (e) {
            console.error('处理post_list元素时出错:', e);
        }
    }
})();