// ==UserScript==
// @name         欺骗LeetCode的IP检查
// @namespace    com.boris1993
// @version      2024-05-12
// @description  伪造LeetCode的is_china_ip请求的响应，以阻止显示力扣中国横幅及跳转
// @author       boris1993
// @license      WTFPL
// @match        https://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494760/%E6%AC%BA%E9%AA%97LeetCode%E7%9A%84IP%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/494760/%E6%AC%BA%E9%AA%97LeetCode%E7%9A%84IP%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    xhook.after((request, response) => {
        if (request.url === 'https://leetcode.cn/api/is_china_ip/') {
            response.text = '(false, "1.1.1.1")';
        }
    });
})();
