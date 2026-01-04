// ==UserScript==
// @name         51job批量申请
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在页面左下角添加按钮，点击按钮执行批量申请
// @author       ash_zli
// @match        https://we.51job.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472704/51job%E6%89%B9%E9%87%8F%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/472704/51job%E6%89%B9%E9%87%8F%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // 创建按钮元素
    var button = document.createElement('button');
    button.innerHTML = '批量申请'; // 按钮文本
    button.style.position = 'fixed';
    button.style.bottom = '10px'; // 距离底部的距离
    button.style.left = '10px'; // 距离左侧的距离
    button.style.zIndex = '9999';

    // 将按钮添加到页面中
    document.body.appendChild(button);

    // 绑定按钮点击事件
    button.addEventListener('click', function() {
        //document.querySelectorAll("#app div.post div.j_result > div > div:nth-child(2) div.leftbox div.job-list div.job-list-item div.ick").forEach(ele => ele.click())
        //document.querySelectorAll("#app div.post div.j_result div.leftbox div.job-list div.job-list-item div.ick").forEach(ele => ele.click())
        document.querySelectorAll("#app div.post div.j_result div.leftbox div.joblist div.joblist-item div.ick").forEach(ele => ele.click())
        // 延迟1秒后执行按钮点击
        setTimeout(function() {
            //document.querySelectorAll("#app > div > div.post > div > div > div.j_result div.rt.bbox button.p_but:not(.flesh)").forEach(ele => ele.click())
            document.querySelectorAll("#app div.post div.j_result div.rt.bbox button.p_but:not(.flesh)").forEach(ele => ele.click())
            setTimeout(function() {
                document.querySelectorAll("#app div.post div.j_result div.leftbox div.van-popup.van-popup--center i").forEach(ele => ele.click())
                document.querySelectorAll("#app div.post div.j_result div.leftbox div.dialog__wrapper div.el-dialog button.el-dialog__headerbtn").forEach(ele => ele.click())
                document.querySelector(`#app > div > div.post > div > div > div.j_result > div > div:nth-child(2) > div > div.bottom-page > div > div > div > button.btn-next`).click()
            
            }, 2000);
        }, 1000);
    });
})();