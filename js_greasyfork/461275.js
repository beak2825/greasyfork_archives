// ==UserScript==
// @name         飞书 wiki 侧栏优化 | Feishu wiki sidebar optimization
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  增加横向滚动条 | Vertical scrolling support
// @author       You
// @match        https://*.feishu.cn/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461275/%E9%A3%9E%E4%B9%A6%20wiki%20%E4%BE%A7%E6%A0%8F%E4%BC%98%E5%8C%96%20%7C%20Feishu%20wiki%20sidebar%20optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/461275/%E9%A3%9E%E4%B9%A6%20wiki%20%E4%BE%A7%E6%A0%8F%E4%BC%98%E5%8C%96%20%7C%20Feishu%20wiki%20sidebar%20optimization.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
.wiki-page-tree .wiki-tree-wrap { overflow-x: auto; }
.wiki-page-tree .wiki-tree-wrap .list-filler { min-width: 600px !important; }
`);
})();