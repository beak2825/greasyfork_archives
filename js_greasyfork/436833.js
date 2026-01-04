// ==UserScript==
// @name         飞书自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用来飞书自动登录
// @author       AC-YoY
// @match        https://open.feishu.cn/open-apis/authen/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436833/%E9%A3%9E%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/436833/%E9%A3%9E%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function () {
        setTimeout(function() {
            document.querySelector('.index--bottom-btn--22MzT.index--bottom-btn-accept--5zsKr').click();
        }, 1000)
    })
})();