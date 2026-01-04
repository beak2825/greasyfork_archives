// ==UserScript==
// @name         xxl job 增加执行器筛选
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  xxl job 增加执行器筛选 新版
// @license      MIT
// @author       Torin
// @match        https://task-uat.zkh360.com/*
// @match        https://task.zkh360.com/*
// @match        http://task-uat.zkh360.com/*
// @match        http://task.zkh360.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zkh360.com
// @grant        none
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js
// @downloadURL https://update.greasyfork.org/scripts/451038/xxl%20job%20%E5%A2%9E%E5%8A%A0%E6%89%A7%E8%A1%8C%E5%99%A8%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451038/xxl%20job%20%E5%A2%9E%E5%8A%A0%E6%89%A7%E8%A1%8C%E5%99%A8%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('link');
    script.setAttribute('rel', 'stylesheet');
    script.setAttribute('type', 'text/css');
    script.href = "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css";
    document.documentElement.appendChild(script);
    $('#jobGroup').select2();
    // Your code here...
})();