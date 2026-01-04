// ==UserScript==
// @name         Bilibili 热门信息增强
// @namespace    https://github.com/AS042971/bilibili-bobo
// @supportURL   https://github.com/AS042971/bilibili-bobo/issues
// @license      BSD-3
// @version      0.1.1
// @description  在 Bilibili 热门榜中增加隐藏分显示
// @author       as042971
// @match        https://*.bilibili.com/*
// @exclude      https://live.bilibili.com/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @require      https://unpkg.com/xhook@1.4.9/dist/xhook.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447705/Bilibili%20%E7%83%AD%E9%97%A8%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447705/Bilibili%20%E7%83%AD%E9%97%A8%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    xhook.after(function(request, response) {
        if (request.url.includes('//api.bilibili.com/x/web-interface/ranking/v2')) {
            let response_json = JSON.parse(response.text);
            if (response_json.data) {
                for (let i in response_json.data.list) {
                    let ext = ""
                    if (i == 0) {
                        ext = " (" + response_json.data.list[i].score + " 分)";
                    } else {
                        ext = " (" + response_json.data.list[i].score + " 分, 距上一名 " + (response_json.data.list[i-1].score - response_json.data.list[i].score) + " 分)";
                    }
                    response_json.data.list[i].title += ext
                }
            }
            response.text = JSON.stringify(response_json);
        }
    });
})();

