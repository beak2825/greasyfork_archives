// ==UserScript==
// @name         Bilibili 强制全景模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给Bilibili所有的视频增加全景模式选项，一键生成栗子头
// @author       as042971
// @match        https://*.bilibili.com/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @require      https://unpkg.com/xhook@1.4.9/dist/xhook.min.js
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453724/Bilibili%20%E5%BC%BA%E5%88%B6%E5%85%A8%E6%99%AF%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453724/Bilibili%20%E5%BC%BA%E5%88%B6%E5%85%A8%E6%99%AF%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    xhook.after(function(request, response) {
        if (request.url.includes('//api.bilibili.com/x/player/v2')) {
            let response_json = JSON.parse(response.text);
            response_json.data.options.is_360 = true;
            response.text = JSON.stringify(response_json);
        }
    })
})();