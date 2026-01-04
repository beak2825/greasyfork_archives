// ==UserScript==
// @name         IT之家 删除去除屏蔽目录广告 【会员等广告】
// @namespace    https://greasyfork.org/zh-CN/users/722555-vveishu
// @version      1.0.1
// @description  IT之家 删除/去除/屏蔽目录广告去除 【QQ音乐、会员、wps、夸克、svip】等广告
// @author       vveishu
// @match        https://*.ithome.com/*
// @icon         https://www.ithome.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535916/IT%E4%B9%8B%E5%AE%B6%20%E5%88%A0%E9%99%A4%E5%8E%BB%E9%99%A4%E5%B1%8F%E8%94%BD%E7%9B%AE%E5%BD%95%E5%B9%BF%E5%91%8A%20%E3%80%90%E4%BC%9A%E5%91%98%E7%AD%89%E5%B9%BF%E5%91%8A%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/535916/IT%E4%B9%8B%E5%AE%B6%20%E5%88%A0%E9%99%A4%E5%8E%BB%E9%99%A4%E5%B1%8F%E8%94%BD%E7%9B%AE%E5%BD%95%E5%B9%BF%E5%91%8A%20%E3%80%90%E4%BC%9A%E5%91%98%E7%AD%89%E5%B9%BF%E5%91%8A%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function displaynone(){
        // 选择所有li元素
        $('li').each(function() {
            // 查找当前li元素下的class为tags的后代元素中的a子元素
            var matchingAs = $(this).find('.tags a').filter(function() {
                // 使用正则表达式筛选有广告文本的元素
                return /^QQ ?音乐$|^大?会员$|^wps$|^夸克$|^svip$/.test($(this).text());
            });
            // 如果找到匹配的a元素，则隐藏该li元素
            if (matchingAs.length > 0) {
                $(this).css('display', 'none');
            }
        });
    }
    //确保 DOM 完全加载后再执行代码
    $(document).ready(displaynone());
    // 目标元素
    const targetElement = document.querySelector('#list .bl');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                console.log('子元素发生变化');
                // 执行相应的处理逻辑
                displaynone();
            }
        });
    });
    // 配置子元素观察器
    const config = {
        childList: true,
    };
    observer.observe(targetElement, config);
})();