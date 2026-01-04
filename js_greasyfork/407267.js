// ==UserScript==
// @name         vikacg enhancement
// @namespace    http://tampermonkey.net/
// @version      0.4.6
// @description  为vikacg提供自动签到,自动翻页功能
// @author       cordea
// @match        https://www.vikacg.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/407267/vikacg%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/407267/vikacg%20enhancement.meta.js
// ==/UserScript==
"use strict";
const DATE = "DATE";
let today = new Date();
let lastSignIn = new Date(GM_getValue(DATE, new Date("2006-1-1")));
if (
    today.getFullYear() != lastSignIn.getFullYear() ||
    today.getMonth() != lastSignIn.getMonth() ||
    today.getDate() != lastSignIn.getDate()
) {
    GM_setValue(DATE, today);
    DailySignIn();
}
else{
    console.log("今天已经自动签到，如有问题请尝试手动签到");
}
const button = document.querySelector(
    "#main > div.zrz-pager.clearfix.pd10.pos-r.box > div > button"
);
const options = {
    threshold: 1.0,
};
const callback = function (entries, observer) {
    button.click();
    console.log("auto click");
};
const observer = new IntersectionObserver(callback, options);
observer.observe(button);
function DailySignIn() {
    console.log(GM_getValue(DATE, "Date not found"));
    GM_xmlhttpRequest({
        "method": "GET",
        "url": "https://www.vikacg.com/qiandao",
        "headers": {
            "Accept":
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7",
            "Cache-Control": "max-age=0",
            "Connection": "keep-alive",
            "Host": "www.vikacg.com",
            "Referer": "https://www.vikacg.com",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
        },
        //"cookie": document.cookie,
        "onload": function (result) {
            console.log("签到成功，请刷新查看积分是否有变动");
        },
    });
}