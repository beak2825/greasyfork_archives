// ==UserScript==
// @name         Bilibili 打开高能看点面板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Bilibili创作中心-个性化配置页面里面打开原本隐藏的“高能看点”面板（目前暂时无法使用）
// @author       as042971
// @match        *://member.bilibili.com/platform/upload-manager/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @require      https://unpkg.com/xhook@1.4.9/dist/xhook.min.js
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470243/Bilibili%20%E6%89%93%E5%BC%80%E9%AB%98%E8%83%BD%E7%9C%8B%E7%82%B9%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/470243/Bilibili%20%E6%89%93%E5%BC%80%E9%AB%98%E8%83%BD%E7%9C%8B%E7%82%B9%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    xhook.after(function(request, response) {
        if (request.url.includes('//member.bilibili.com/x/web/viewpoint/rule')) {
            let response_json = JSON.parse(response.text);
            response_json.data.attentions.limit = 1024;
            response_json.data.chapters.limit = 1024;
            response_json.data.points.limit = 1024;
            response.text = JSON.stringify(response_json);
        }
    })
})();