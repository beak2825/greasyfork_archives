// ==UserScript==
// @name         B站批量拉黑
// @version      1.0.3
// @description  批量拉黑
// @note         更新于 2024年11月6日
// @author       怀沙2049
// @match        https://*.bilibili.com/*
// @exclude      https://space.bilibili.com/473519710
// @license      GNU GPLv3
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-CN/users/1192640-huaisha2049
// @downloadURL https://update.greasyfork.org/scripts/514102/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/514102/B%E7%AB%99%E6%89%B9%E9%87%8F%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从cookie中获取csrf_token
    var csrf_token = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];

    // 需要拉黑的UID列表
    const uid_list = [
    ];

    // 批量拉黑函数
    function batch_block() {
        for (let i = 0; i < uid_list.length; i++) {
            setTimeout(function () {
                $.ajax({
                    url: '//api.bilibili.com/x/relation/modify',
                    type: "post",
                    xhrFields: {
                        withCredentials: true   // 携带跨域cookie
                    },
                    data: {
                        'fid': uid_list[i], // 要拉黑的UP主UID
                        'act': 5,
                        're_src': 11,
                        'jsonp': 'jsonp',
                        'csrf': csrf_token      // CSRF令牌
                    }
                })
                console.log("拉黑的UP主页:https://space.bilibili.com/" + uid_list[i])   //输出日志
                if(i===uid_list.length-1){
                    alert('批量拉黑操作执行完毕，拒绝龟公');
                }
            }, i * 100)
        };
    }

    // 执行批量拉黑操作
    //batch_block();
    function createStartButton() {
        // 创建一个按钮元素
        var startButton = document.createElement('button');
        // 设置按钮的文本
        startButton.textContent = '开始批量拉黑';
        // 设置按钮的样式（可选）
        startButton.style.position = 'fixed';
        startButton.style.top = '500px';
        startButton.style.right = '10px';
        startButton.style.padding = '10px 20px';
        startButton.style.backgroundColor = 'red';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.cursor = 'pointer';
        // 为按钮添加点击事件监听器
        startButton.addEventListener('click', function() {
            // 当用户点击按钮时，执行批量拉黑操作
            batch_block();
        });
        // 将按钮添加到页面的body元素中
        document.body.appendChild(startButton);
    }

    // 执行创建开始按钮的操作
    createStartButton();
})();