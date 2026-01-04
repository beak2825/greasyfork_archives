// ==UserScript==
// @name         走读申请生成器
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       D1n910
// @include      https://gitlab.photonpay.com/*/*/merge_requests/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391682/%E8%B5%B0%E8%AF%BB%E7%94%B3%E8%AF%B7%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/391682/%E8%B5%B0%E8%AF%BB%E7%94%B3%E8%AF%B7%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==
// @require https://code.jquery.com/jquery-2.1.4.min.js

(function() {
    'use strict';
    // Your code here...
    try {
        $(document).ready(function(){
            if (!$('.js-task-list-field')[0]) {
                return false
            }
            // 走读申请组合器
            console.log(`
走读申请
>>>TAPD:
${$('.js-task-list-field')[0].innerText}

>>>GitlabPR：
${window.location.pathname.split('/')[2]}
${window.location.href}

@

看到这条信息默认为收到
走读时 看到有问题/完成 可发到群里
`)
        });
    } catch(e) {
        console.log('发生错误：', e)
    }
})();