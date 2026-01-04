// ==UserScript==
// @name         打开控制台查看过期考勤
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  try to take over the world!
// @author       G
// @match        https://cnfadmin.cnfschool.net/admin/notice/main/userList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnfschool.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485787/%E6%89%93%E5%BC%80%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%9F%A5%E7%9C%8B%E8%BF%87%E6%9C%9F%E8%80%83%E5%8B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/485787/%E6%89%93%E5%BC%80%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%9F%A5%E7%9C%8B%E8%BF%87%E6%9C%9F%E8%80%83%E5%8B%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    fetch(`https://cnfadmin.cnfschool.net/admin/notice/main/userListData?title=&type_id=0&_token=${''}&sort%5BsortBy%5D=id&sort%5BorderBy%5D=desc&page%5BpageSize%5D=20&page%5BpageNumber%5D=1&page%5Btotal%5D=0`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://cnfadmin.cnfschool.net/admin/notice/main/userList",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then((res)=>{
        res.json().then((res)=> {
            console.clear();
            console.log('%c 再次刷新页面查看结果\n再次刷新页面查看结果\n再次刷新页面查看结果', 'background: yellow; color: red ');
            for(const data of res.data.rows) {
                console.log('%c ' + data.title, 'background: #222; color: #bada55 ')
                console.log('%c 考勤结果', 'background: yellow; color: red ')
                console.table( JSON.parse(data.info))
                console.log('%c 考勤明细', 'background: #222; color: #bada55 ')
                console.table( JSON.parse(data.infos)[0])
                console.log('\n')
            }

        })
    });
})();