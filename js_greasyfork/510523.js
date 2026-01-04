// ==UserScript==
// @name         阿里云盘分享自动切换为列表显示
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  网页版阿里云盘分享分为卡片模式和列表模式，其中列表模式可以直观的看到文件的大小。这个简单的脚本将强制切换显示模式为列表模式。
// @author       CTRN43062
// @match        https://www.aliyundrive.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510523/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E4%BA%AB%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BA%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/510523/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E4%BA%AB%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E4%B8%BA%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const KEY = 'ADRIVE_SHARE_LIST_VIEW_TYPE'
    const view_mode = localStorage.getItem(KEY)
    if(view_mode !== 'table') {
        localStorage.setItem(KEY, 'table')
        location.reload()
    }
})();