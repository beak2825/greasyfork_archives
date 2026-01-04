// ==UserScript==
// @name         阿里网盘VIP（伪）
// @namespace    http://tampermonkey.net/
// @version      2024-10-19
// @description  阿里云本地VIP（包括倍速、解锁画质等）（好吧，其实也没有其他的了）
// @author       涛之雨
// @match        https://www.aliyundrive.com/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01JDQCi21Dc8EfbRwvF_!!6000000000236-73-tps-64-64.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/513206/%E9%98%BF%E9%87%8C%E7%BD%91%E7%9B%98VIP%EF%BC%88%E4%BC%AA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513206/%E9%98%BF%E9%87%8C%E7%BD%91%E7%9B%98VIP%EF%BC%88%E4%BC%AA%EF%BC%89.meta.js
// ==/UserScript==

/* global ajaxHooker*/
(function() {
    'use strict';
    ajaxHooker.filter([
        {url: "feature/list"},
        {url: "vip/info"},
    ]);

    ajaxHooker.hook(request => {
        if (request.url.endsWith('feature/list')) {
            request.response = res => {
                const json = JSON.parse(res.responseText);
                json.identity='svip';
                json.features=json.features.map(a=>(a.intercept=false,a.features=a.features?a.features.map(a=>(a.intercept=false,a)):null,a));
                res.responseText = JSON.stringify(json);
            };
        }
        if (request.url.endsWith('vip/info')) {
            request.response = res => {
                const json = JSON.parse(res.responseText);
                json.identity="svip";
                json.vipList= [
                    {
                        "name": "超级会员",
                        "code": "svip",
                        "promotedAt": 0,
                        "expire": 9705273204
                    }
                ];
                res.responseText = JSON.stringify(json);
            };
        }
    });
})();