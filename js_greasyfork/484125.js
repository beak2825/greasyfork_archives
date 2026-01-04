// ==UserScript==
// @version      0.5
// @name         new MT Add Free Torrents To Bookmark
// @namespace    http://tampermonkey.net/
// @description  mt站自动收藏免费种
// @include      */kp.m-team.cc/browse
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/484125/new%20MT%20Add%20Free%20Torrents%20To%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/484125/new%20MT%20Add%20Free%20Torrents%20To%20Bookmark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickFreeButton() {
        // 选择所有行
        const rows = document.querySelectorAll('tr.ant-table-row.ant-table-row-level-0');
        rows.forEach(row => {
            // 查找含有'Free'文本的标签
            const freeTag = Array.from(row.querySelectorAll('span.ant-tag-has-color')).find(tag => tag.textContent.trim() === 'Free');

            if (freeTag) {
                // 定位星形按钮，我们假定它是唯一的星形按钮或者第一个星形按钮
                const starButton = row.querySelector('button.ant-btn[aria-label="star"], button.ant-btn:has(span[aria-label="star"])');

                if (starButton) {
                    // 检查星形图标的颜色，如果不包含'gold'则点击
                    // 请注意，这一步假设你有方法确定按钮是否已经被点击过
                    // 这可能需要根据实际页面的具体行为进行调整
                    const starIcon = starButton.querySelector('span[role="img"].anticon-star');
                    if (starIcon && !starIcon.style.color.includes('gold')) {
                        starButton.click();
                    }
                }
            }
        });
    }
    setTimeout(clickFreeButton, 10000);
})();