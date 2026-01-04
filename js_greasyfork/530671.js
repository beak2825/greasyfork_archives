// ==UserScript==
// @name         微信读书-首页字体调整
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  为微信读书网页端分区域调整字体和字号
// @icon         https://i.miji.bid/2025/03/15/560664f99070e139e28703cf92975c73.jpeg
// @author       Grok
// @match        https://weread.qq.com/
// @match        https://weread.qq.com/web/shelf
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530671/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6-%E9%A6%96%E9%A1%B5%E5%AD%97%E4%BD%93%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/530671/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6-%E9%A6%96%E9%A1%B5%E5%AD%97%E4%BD%93%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        /* 导入霞鹜文楷在线字体 */
        @import url('https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/style.css');

        /* 全局默认字体设置 */
        body, body * {
            font-family: "LXGW WenKai", "霞鹜文楷", sans-serif !important;
        }

        /* 【我的书架】区域样式 */
        /* 标题栏 - 只加粗 */
        .wr_index_page_top_section_header_wrapper {
            font-weight: bold !important;
        }
        /* 书名 - 加粗 */
        .wr_index_mini_shelf_card_content_title {
            font-weight: bold !important;
            font-size: 100% !important;
        }
        /* 作者 - 默认 */
        .wr_index_mini_shelf_card_content_author {
            font-weight: normal !important;
            font-size: 90% !important;
        }

        /* 【猜你喜欢】区域样式 */
        /* 标题栏 - 只加粗 */
        .wr_index_page_top_section_content_title {
            font-weight: bold !important;
        }
        /* 书名 - 加粗 */
        .wr_suggestion_card_content_title {
            font-weight: bold !important;
            font-size: 100% !important;
        }
        /* 作者 - 默认 */
        .wr_suggestion_card_content_author {
            font-weight: normal !important;
            font-size: 90% !important;
        }
        /* 描述 - 默认 */
        .wr_suggestion_card_content_reason {
            font-weight: normal !important;
            font-size: 90% !important;
        }

        /* 【榜单】区域样式 */
        /* 标题栏 - 只加粗 */
        .wr_index_page_rank_list_title {
            font-weight: bold !important;
        }
        /* 书名 - 加粗 */
        .wr_index_page_mini_bookInfo_content_title {
            font-weight: bold !important;
            font-size: 100% !important;
        }
        /* 作者 - 默认 */
        .wr_index_page_mini_bookInfo_content_author {
            font-weight: normal !important;
            font-size: 90% !important;
        }
        /* 推荐值 - 默认 */
        .wr_index_page_mini_bookInfo_content_recommend_lang {
            font-weight: normal !important;
            font-size: 90% !important;
        }

        /* 【分类】区域样式 */
        /* 标题栏 - 只加粗 */
        .wr_index_page_category_list_title {
            font-weight: bold !important;
        }
        /* 分类名称 - 默认 */
        .wr_index_page_category_list_content_card_name {
            font-weight: normal !important;
            font-size: 100% !important;
        }
        /* 书籍数量 - 默认 */
        .wr_index_page_category_list_content_card_count {
            font-weight: normal !important;
            font-size: 90% !important;
        }
    `);

    // 动态检查和调试
    function checkElements() {
        const body = document.querySelector('body');
        if (body) {
            console.log('找到body元素，样式应已应用', body);
        } else {
            console.log('未找到body元素');
        }

        // 检查各区域关键元素是否应用了样式（用于调试）
        const elements = [
            '.wr_index_page_top_section_header_wrapper',  // 我的书架标题
            '.wr_index_mini_shelf_card_content_title',    // 我的书架书名
            '.wr_suggestion_card_content_title',          // 猜你喜欢书名
            '.wr_index_page_rank_list_title',            // 榜单标题
            '.wr_index_page_category_list_title'         // 分类标题
        ];

        elements.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                console.log(`找到元素: ${selector}`, el);
            } else {
                console.log(`未找到元素: ${selector}`);
            }
        });
    }

    // 页面加载完成后检查
    window.addEventListener('load', checkElements);
    // 动态内容可能延迟加载，定时检查
    setTimeout(checkElements, 2000);
})();