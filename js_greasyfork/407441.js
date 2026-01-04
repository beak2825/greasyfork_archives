// ==UserScript==
// @name         xiaohx.org复制电驴链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.xiaohx.org/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/407441/xiaohxorg%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/407441/xiaohxorg%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.xiaohx.org/301397
(function() {
    'use strict';

    const link_arr = [];
    $('.download_list > tbody > tr > td > .download_title > a').each(function(i, el) {
        const filename = $(el).text();
        const url = $(el).prop('href');
        const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
        link_arr.push(link);
    });
    GM_setClipboard(link_arr.join("\n"), 'text');
})();