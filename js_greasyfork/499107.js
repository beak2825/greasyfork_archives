// ==UserScript==
// @name         inoreader主题自定义
// @version      0.14
// @description  自定义主题
// @match        *://*.inoreader.com/*
// @grant        none
// @namespace https://greasyfork.org/users/158417
// @downloadURL https://update.greasyfork.org/scripts/499107/inoreader%E4%B8%BB%E9%A2%98%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/499107/inoreader%E4%B8%BB%E9%A2%98%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义CSS样式
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .graybutton_outline, .graybutton_outline:active, .graybutton_outline:focus, .graybutton_outline:disabled {
            color: #888888;
            background-color: #08bcd869;
            border: 1px solid #888888;
        }
        /* 为 parent_div_inner 类添加淡绿色背景 */
        .parent_div_inner {
            background-color: #71a471; /* 浅绿色 */
        }
                /* 为 sb_tree_part 添加指定背景颜色 */
        #sb_tree_part {
            background: #549b77; /* 指定背景颜色 */
        }
        /* 为 sidebar_wrapper 添加指定背景颜色 */
        #sidebar_wrapper {
             background-color: #2a9b4c80; /* 指定背景颜色，带透明度 */
        }
        #reader_pane{
             background-color:#8d998975;
        }
        .article_unreaded .article_unread_dot_internal {
             background-color: #e013d9;
        }
        #tree_pane{
             color: #ffffff;
        }
        .parent_div_inner_selected {
             color: #b800ff;
        }
        .subscriptions_legend {
             color: #b800ff;
        }
    `;
    document.head.appendChild(style);

    
})();
