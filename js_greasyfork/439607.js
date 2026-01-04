// ==UserScript==
// @name         贴吧显示原图
// @namespace    stack
// @version      0.1
// @description  帖子默认加载原图
// @author       stack
// @match        https://tieba.baidu.com/p/*
// @icon         https://tb2.bdstatic.com/tb/static-common/img/search_logo_big_v2_d84d082.png
// @grant        unsafeWindow
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/439607/%E8%B4%B4%E5%90%A7%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/439607/%E8%B4%B4%E5%90%A7%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.innerHTML = document.body.innerHTML.replace(/tiebapic\.baidu\.com\/forum\/.+?\/sign=.+?\/(.+?\.jpg)/g, String.raw `tiebapic.baidu.com/forum/pic/item/$1`);
})();