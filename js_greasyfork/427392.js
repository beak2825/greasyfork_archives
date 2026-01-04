// ==UserScript==
// @name         百度搜索过滤
// @namespace    js-scripts/baidu-filter
// @version      2.2.0
// @description  在block_list中添加你想过滤的关键词，世界都将清净了
// @author       THENDINGs
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @match        https://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        unsafeWindow
// @license      GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/427392/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/427392/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = unsafeWindow.jQuery;

    // 屏蔽关键词列表
    const block_list = ['baijiahao', 'CSDN', '广告'];

    function block() {
        const results = $('#content_left .c-color-gray').toArray();
        results.forEach(item => {
            if (block_list.some(b => item.innerText.includes(b))) {
                const span = $(item);
                const parents = span.parents('.c-container');
                if (parents.length > 0) {
                    parents[0].remove();
                }
            }
        })
    }

    document.querySelector('#su').addEventListener('click', (e) => {
        setTimeout(block, 1000);
    })

    $(function () {
        setTimeout(block, 200);
    });

})();
