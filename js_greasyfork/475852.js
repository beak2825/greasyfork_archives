// ==UserScript==
// @name         Nodeseek Auto Check-in
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically check-in when opening the page
// @author       You
// @match        https://www.nodeseek.com/
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475852/Nodeseek%20Auto%20Check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/475852/Nodeseek%20Auto%20Check-in.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前日期
    var today = new Date().toISOString().split('T')[0];

    // 检查是否已经签到
    var checkInDate = localStorage.getItem('checkInDate');
    if (checkInDate === today) {
        return;
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://www.nodeseek.com/api/attendance?random=true",
        headers: {
            "authority": "www.nodeseek.com",
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            "cache-control": "no-cache",
            "content-length": "0",
            "dnt": "1",
            "origin": "https://www.nodeseek.com",
            "pragma": "no-cache",
            "referer": "https://www.nodeseek.com/board",
            "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="102"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        },
        onload: function(response) {
            var res = JSON.parse(response.responseText);
            if (res.success || res.message === '今天已完成签到，请勿重复操作') {
                // 如果签到成功或者已经签到，保存签到日期
                localStorage.setItem('checkInDate', today);
            }
            console.log(response.responseText);
        }
    });
})();