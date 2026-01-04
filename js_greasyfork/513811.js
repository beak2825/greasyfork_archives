// ==UserScript==
// @name         雪球更新通知
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  用来在开盘日，每分钟刷新网页，提醒你（关注的人， 讨论的内容）是否有新的通知
// @author       iOSleep  
// @license      MIT
// @match        https://xueqiu.com/*
// @icon         https://xueqiu.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-start
// @require      https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=
// @downloadURL https://update.greasyfork.org/scripts/513811/%E9%9B%AA%E7%90%83%E6%9B%B4%E6%96%B0%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/513811/%E9%9B%AA%E7%90%83%E6%9B%B4%E6%96%B0%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    ajaxHooker.hook(request => {
        // console.log("request", request);
        if (request.url.indexOf("/query/v1/search/status.json") != -1) { //搜索vcp的
            request.response = value => {
                const obj = JSON.parse(value.response);
                const id = obj.list[0].id;
                const saveId = GM_getValue("xueqiu_vcp_id", 0);
                GM_setValue("xueqiu_vcp_id", id);
                if (saveId != id && saveId != 0) {
                    GM_notification("有新的VCP通知，请注意查看");
                }
            };
        } else if (request.url.indexOf("/home_timeline.json") != -1) { // 首页关注的
            request.response = value => {
                const obj = JSON.parse(value.response);
                const id = obj.home_timeline[0].id;
                const saveId = GM_getValue("xueqiu_gz_id", 0);
                GM_setValue("xueqiu_gz_id", id);
                if (saveId != id && saveId != 0) {
                    GM_notification("有新的关注通知，请注意查看");
                }
            };
        }
    });

    // 函数 判断是否是在A股的开盘时间
    function isWorkDay() {
        var now = new Date();
        var day = now.getDay();
        var hour = now.getHours();
        var minute = now.getMinutes();
        // 周一至周五
        if (day > 0 && day < 6) {
            const a = 9 * 60 + 30;
            const b = 11 * 60 + 30;
            const c = 13 * 60;
            const d = 15 * 60;
            const nowNum = hour * 60 + minute;
            return ( nowNum >= a && nowNum <= b || nowNum >= c && nowNum <= d);
        }
        return false;
    }

    function myrefresh() {
        if (isWorkDay() === true) {
            setTimeout(() => {
                window.location.reload();
            }, 1000 * 60);// 一分钟后刷新
        } else {
            console.log("非工作时间，不刷新页面");
            setTimeout(() => {
                window.location.reload();
            }, 1000 * 60 * 30); // 30分钟后刷新
        }
    }

    myrefresh();
})();