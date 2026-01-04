// ==UserScript==
// @name         fuliba Auto Check-in
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically check-in when opening the page
// @author       You
// @match        https://www.wnflb*.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522751/fuliba%20Auto%20Check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/522751/fuliba%20Auto%20Check-in.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前日期
    var today = new Date().toISOString().split('T')[0];

    // 检查是否已经签到
    var checkInDate = localStorage.getItem('fuliba_checkInDate');
    if (checkInDate === today) {
        return;
    }

    // 预先定义 formhash 变量，确保在整个函数内都可访问
    let formhash;
    const html = document.documentElement.innerHTML;
    const match = html.match(/formhash=([a-zA-Z0-9]+)/);
    const signmatch = html.match(/已签到/);
    if (match) {
        formhash = match[1];
        console.log("提取到的 formhash 值:", formhash);
    } else {
        console.log("未找到 formhash");
        return;
    }
    if (signmatch) {return;}

    // 获取当前域名
    const currentDomain = window.location.origin;
    //console.log(currentDomain);

    GM_xmlhttpRequest({
        method: "POST",
        url: `${currentDomain}/plugin.php?id=fx_checkin:checkin&formhash=${formhash}&${formhash}&infloat=yes&handlekey=fx_checkin&inajax=1&ajaxtarget=fwin_content_fx_checkin`,
        headers: {
            'authority': 'www.wnflb2023.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'cache-control': 'no-cache',
            'dnt': '1',
            'pragma': 'no-cache',
            'referer': `${currentDomain}/forum.php`,
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        },
        onload: function(response) {
            const match = response.responseText.match(/签到成功/);
            if (match) {
                // 如果签到成功或者已经签到，保存签到日期
                localStorage.setItem('fuliba_checkInDate', today);
            }
            console.log(response.responseText);
        }
    });
})();
``
