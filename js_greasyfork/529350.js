// ==UserScript==
// @name         微博隐藏赞赏、点赞、评论框、分享按钮及多余分隔线
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏赞赏、点赞、评论框、分享按钮及多余分隔线
// @author       You
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529350/%E5%BE%AE%E5%8D%9A%E9%9A%90%E8%97%8F%E8%B5%9E%E8%B5%8F%E3%80%81%E7%82%B9%E8%B5%9E%E3%80%81%E8%AF%84%E8%AE%BA%E6%A1%86%E3%80%81%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%A4%9A%E4%BD%99%E5%88%86%E9%9A%94%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/529350/%E5%BE%AE%E5%8D%9A%E9%9A%90%E8%97%8F%E8%B5%9E%E8%B5%8F%E3%80%81%E7%82%B9%E8%B5%9E%E3%80%81%E8%AF%84%E8%AE%BA%E6%A1%86%E3%80%81%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E5%8F%8A%E5%A4%9A%E4%BD%99%E5%88%86%E9%9A%94%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏赞赏模块
    GM_addStyle(`
        div[class*="Reward_box_"] {
            display: none !important;
        }
    `);

    // 隐藏评论输入框
    GM_addStyle(`
        #composerEle {
            display: none !important;
        }
    `);

    // 隐藏底部工具栏（点赞、评论、转发）
    GM_addStyle(`
        div[class*="toolbar_main_"] {
            display: none !important;
        }
    `);

    // 隐藏分享按钮
    GM_addStyle(`
        div[class*="toolbar_share_"] {
            display: none !important;
        }
    `);

    // 隐藏点赞按钮（保险）
    GM_addStyle(`
        button[title="赞"] {
            display: none !important;
        }
    `);

    // 新增：隐藏分隔线
    GM_addStyle(`
        div.woo-divider-main.woo-divider-x {
            display: none !important;
        }
    `);
})();