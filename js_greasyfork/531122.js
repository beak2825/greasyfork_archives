// ==UserScript==
// @name         禁用加粗斜体下划线
// @namespace    https://greasyfork.org/users/1171320
// @version      1.5
// @description  将加粗、倾斜、下划线（包括链接）恢复为标准文字样式，提升阅读舒适度。
// @author       yzcjd
// @author2      Lama AI 辅助
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531122/%E7%A6%81%E7%94%A8%E5%8A%A0%E7%B2%97%E6%96%9C%E4%BD%93%E4%B8%8B%E5%88%92%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/531122/%E7%A6%81%E7%94%A8%E5%8A%A0%E7%B2%97%E6%96%9C%E4%BD%93%E4%B8%8B%E5%88%92%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 恢复字体样式和去除下划线
    function normalizeFontStyles() {
        const elements = document.querySelectorAll('*');

        elements.forEach(element => {
            const style = window.getComputedStyle(element);

            // 去除斜体和加粗
            if (style.fontStyle === 'italic' || style.fontWeight >= 600) {
                element.style.fontStyle = 'normal';
                element.style.fontWeight = 'normal';
            }

            // 去除文本下划线，包括链接
            if (style.textDecorationLine.includes('underline')) {
                element.style.textDecoration = 'none';
            }
        });
    }

    normalizeFontStyles();
})();