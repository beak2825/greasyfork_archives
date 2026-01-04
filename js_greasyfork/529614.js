// ==UserScript==
// @name         中山大学在线教学平台学习助手
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  1.安装脚本 2.打开中山大学在线教学平台中需要记录视频观看时长的课程（如心理健康教育），将自动增多观看时长 3.会自动前往下一个视频
// @author       廖彬东
// @match        *://lms.sysu.edu.cn/mod/fsresource/*
// @match        *://lms.sysu.edu.cn/mod/forum/*
// @match        *://lms.sysu.edu.cn/mod/page/*
// @icon         https://www.urongda.com/_next/image?url=%2Flogos%2Fnormal%2Fmedium%2Fsouth-china-university-of-technology-logo-1024px.png&w=750&q=75
// @grant        none
// @homepage     https://space.bilibili.com/240337949
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529614/%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529614/%E4%B8%AD%E5%B1%B1%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    wait(500);
    const timestampNumber = JSON.parse(playerdata.source).OD.match(/timestamp=(\d+)/)[1];
    var url = window.location.href;
    var button = document.getElementById('next-activity-link');
    function check(urlc) {
        var site;
        var lastSlashIndex = urlc.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
    	var secondLastSlashIndex = urlc.lastIndexOf('/', lastSlashIndex - 1);
    	site = urlc.substring(secondLastSlashIndex+1, lastSlashIndex);
        }
        return site;
    }
    if (check(url)=='fsresource') {
        var id1=playerdata.fsresourceid;
        fetch("https://lms.sysu.edu.cn/lib/ajax/service.php?timestamp="+timestampNumber+"&sesskey="+M.cfg.sesskey, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Microsoft Edge\";v=\"134\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": window.location.href,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `[{\"index\":0,\"methodname\":\"mod_fsresource_set_time\",\"args\":{\"fsresourceid\":${id1},\"time\":1200,\"finish\":0,\"progress\":\"15.66\"}}]`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
});
    }

    if (check(button.href)=='page'||check(button.href)=='fsresource'||check(button.href)=='forum') {
        button.click();
    }
})();