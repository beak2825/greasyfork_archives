// ==UserScript==
// @name         TEWA-86X Super Administrator
// @namespace    http://tampermonkey.net/
// @version      2024-05-04
// @description  TEWA-86X 系列光猫使用普通账户登录获取超级管理员权限，通过拦截并改写登录状态接口实现。
// @author       小忍Lily
// @match        http://192.168.1.1/*
// @grant        none
// @run-at       document-start
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500153/TEWA-86X%20Super%20Administrator.user.js
// @updateURL https://update.greasyfork.org/scripts/500153/TEWA-86X%20Super%20Administrator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function ajax_hook() {
        ah.proxy({
            onRequest: (config, handler) => {
                handler.next(config);
            },
            onError: (err, handler) => {
                handler.next(err);
            },
            onResponse: (response, handler) => {
                let config = response.config;
                if (config.url.indexOf("/getLogStatus") !== -1) {
                    let res = JSON.parse(response.response);
                    res["skipAuth"] = true;
                    res["isAdmin"] = true;
                    response.response = JSON.stringify(res);
                    handler.resolve(response);
                } else {
                    handler.next(response);
                }
            },
        });
    }

    console.log('开始注入ajax_hook');
    ajax_hook();
    Object.assign(XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 });
})();