// ==UserScript==
// @name         知识星球插件
// @namespace    http://zsxq.com/
// @version      0.2
// @description  知识星球深色背景
// @author       ogli324
// @license      GPL
// @match        https://articles.zsxq.com/*
// @match        https://wx.zsxq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zsxq.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464726/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/464726/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
    addEventListener("load", () => {

        // 背景深色， 保留图标背景。
        GM_addStyle("div:not(.post-topic-btn):not(.button):not(.icon):not([style*='background-image']) { background-color: #333 !important; }");

        // 修改文字颜色为灰色，不然看不见。
        GM_addStyle("* { color: #5A5C66 !important; }");

        // 修改知识星球两边白色背景为深色。
        if (location.href.indexOf("articles.zsxq.com") != -1){
            GM_addStyle(`
            body {
                background-color: #333 !important;
            }
            `)
        }

    });
})();