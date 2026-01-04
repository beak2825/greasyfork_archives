 
// ==UserScript==
// @license 妖火
// @name         妖火网 - 只看指定用户回帖
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在妖火网页面添加输入框，输入用户ID后跳转到只看该用户回帖的页面。（只在全部回帖页面生效)
// @author       你的名字
// @match        https://yaohuo.me/bbs/book_re.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530064/%E5%A6%96%E7%81%AB%E7%BD%91%20-%20%E5%8F%AA%E7%9C%8B%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E5%9B%9E%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530064/%E5%A6%96%E7%81%AB%E7%BD%91%20-%20%E5%8F%AA%E7%9C%8B%E6%8C%87%E5%AE%9A%E7%94%A8%E6%88%B7%E5%9B%9E%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找“文件回帖”文本节点
    const textNode = [...document.querySelectorAll('*')].find(el => el.textContent.trim() === '文件回帖');

    if (textNode) {
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入用户ID并回车';
        input.style.width = '150px'; // 固定宽度为 150px
        input.style.marginLeft = '10px'; // 与“文件回帖”保持一定距离
        input.style.padding = '5px 8px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '3px';
        input.style.fontSize = '14px';
        input.style.outline = 'none';
        input.style.boxSizing = 'border-box'; // 确保宽度包含 padding 和 border

        // 将输入框插入到“文件回帖”的右侧
        textNode.parentNode.insertBefore(input, textNode.nextSibling);

        // 监听回车键
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const userId = input.value.trim();
                if (userId) {
                    // 获取当前URL
                    const currentUrl = window.location.href;

                    // 判断是否已经包含查询参数
                    const hasQuery = currentUrl.includes('?');

                    // 构建新URL
                    const newUrl = currentUrl + (hasQuery ? '&' : '?') + 'mainuserid=' + userId;

                    // 跳转到新URL
                    window.location.href = newUrl;
                }
            }
        });
    }
})();
 