// ==UserScript==
// @name         中华医学教育在线视频解锁
// @namespace    http://tampermonkey.net/webtrn
// @version      1.0
// @description  对中华医学教育在线的在线视频进行解锁，可以播放学习列表中的任意视频
// @match        https://yxdzcbs-kfkc.webtrn.cn/learnspace/learn/learn/templatethree*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495874/%E4%B8%AD%E5%8D%8E%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/495874/%E4%B8%AD%E5%8D%8E%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截 XMLHttpRequest
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            if (url.includes('learnCourseware/getSingleItemCompleteCase.json')) {
                this.addEventListener('readystatechange', function() {
                    if (this.readyState === 4 && this.status === 200) {
                        try {
                            let response = JSON.parse(this.responseText);
                            if (response.result && response.result.completed === "2") {
                                response.result.completed = "1";
                            }
                           if (response.result && response.result.completed === "0") {
                                response.result.completed = "1";
                            }

                            // 创建一个代理以重写 responseText
                            let _responseText = JSON.stringify(response);
                            Object.defineProperty(this, 'responseText', {
                                get: function() {
                                    return _responseText;
                                }
                            });
                        } catch (e) {
                            console.error('Error processing JSON response:', e);
                        }
                    }
                }, false);
            }
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);
})();