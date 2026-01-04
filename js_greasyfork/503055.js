// ==UserScript==
// @name         Bypass Permission Check
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Bypass permission check for daily report system
// @match        http://10.6.*/*
// @match        http://10.6.1.129/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503055/Bypass%20Permission%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/503055/Bypass%20Permission%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        const url = arguments[1];

        if (url.includes('/daily_reportapi/permission?user=') ||
            url.includes('/prod-api/getProcess?card=')) {

            const self = this;
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4) {
                    Object.defineProperty(this, 'response', {writable: true});
                    Object.defineProperty(this, 'responseText', {writable: true});
                    Object.defineProperty(this, 'status', {writable: true});

                    if (url.includes('/daily_reportapi/permission?user=')) {
                        // 模拟第一个API的成功响应
                        this.response = this.responseText = '1';
                    } else if (url.includes('/prod-api/getProcess?card=')) {
                        // 模拟第二个API的成功响应
                        const fakeResponse = {
                            "msg": "操作成功",
                            "code": 200,
                            "data": {
                                "processName": "全部权限"
                            }
                        };
                        this.response = this.responseText = JSON.stringify(fakeResponse);
                    }

                    this.status = 200;
                }
            });
        }
        originalXHROpen.apply(this, arguments);
    };

    console.log('Multiple permission bypass script loaded');
})();