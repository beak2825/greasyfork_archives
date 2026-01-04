// ==UserScript==
// @name         pteplus vip
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  always vip
// @author       xiaoyu2er
// @match        https://pteplus.com.cn/*
// @icon         https://www.google.com/s2/favicons?domain=pteplus.com.cn
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @grant        none
// @run-at document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/437228/pteplus%20vip.user.js
// @updateURL https://update.greasyfork.org/scripts/437228/pteplus%20vip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    xhook.after(function (request, response) {
        // console.log(request.url);
        if (request.url == '/api/user/info') {
            var res = response.text;
            var json = JSON.parse(res);
            json.message.vip_tag = 'practice_vip';
            json.message.vip_exprie = '' + (+new Date() + 10000);
            response.text = JSON.stringify(json);
        }
    });

})();