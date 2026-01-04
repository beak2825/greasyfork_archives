// ==UserScript==
// @name         必应搜索去除右侧小冰图标
// @namespace    yang_space
// @version      0.1
// @description  去除必应搜索右侧的小冰图标
// @author       Y7521
// @match        *://cn.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480579/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E5%B0%8F%E5%86%B0%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/480579/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E5%B0%8F%E5%86%B0%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 在页面加载完成后执行
    window.addEventListener('load', function() {
        // 获取id为b_content的div元素
        var bContentDiv = document.getElementById('b_content');

        // 检查是否找到了元素
        if (bContentDiv) {
            // 获取b_content下的id为ev_talkbox_wrapper的div元素
            var evTalkboxWrapperDiv = bContentDiv.querySelector('#ev_talkbox_wrapper');

            // 检查是否找到了元素
            if (evTalkboxWrapperDiv) {
                // 移除ev_talkbox_wrapper元素
                evTalkboxWrapperDiv.remove();
                console.log('成功移除ev_talkbox_wrapper元素');
            } else {
                console.log('未找到id为ev_talkbox_wrapper的元素');
            }
        } else {
            console.log('未找到id为b_content的元素');
        }
    });
})();



