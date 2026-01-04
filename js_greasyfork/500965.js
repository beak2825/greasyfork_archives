// ==UserScript==
// @name         EWT360 Permission Interceptor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  拦截并修改EWT360 课程视频API响应内容
// @author       LaoShui
// @match        https://teacher.ewt360.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500965/EWT360%20Permission%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/500965/EWT360%20Permission%20Interceptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this.status === 200 && url.endsWith('getLessonDetailV2')) {
                let response = JSON.parse(this.responseText);
                if (response.success && response.code === "200") {
                    response.data.hasPermission = true;
                    response.data.authFromSchool = false;
                    response.data.tips = null;
                    Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) });
                }
            }
        }, false);
        open.call(this, method, url, async, user, password);
    };
})();