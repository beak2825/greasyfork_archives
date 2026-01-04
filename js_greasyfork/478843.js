// ==UserScript==
// @name         医学云
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  测试脚本
// @author       行侠仗义
// @match        mic.ljjk.org.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478843/%E5%8C%BB%E5%AD%A6%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/478843/%E5%8C%BB%E5%AD%A6%E4%BA%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("脚本已启动"); // 打印启动消息
    // 定义关键字和触发复选框的按钮选择器
    // 定位文本为"搜索"的按钮元素
    var 搜索 = 'button.el-button.search-button.el-button--primary.el-button--small';
    var 认领 = 'button.el-button.search-button.el-button--success.el-button--small';

    // 定义循环间隔时间（毫秒）
    var loopInterval = 1000;

    // 开始循环
    setInterval(function() {
        // 获取当前页面的完整 URL
        var currentURL = window.location.href;

        // 判断 URL 中是否包含特定的片段标识符
        if (currentURL.includes('#/diagnosisCenter')) {
            // 片段标识符匹配，执行相应的操作
            console.log("当前页面包含片段标识符 '#/diagnosisCenter'");



                    // 点击按钮
            console.log("搜索"); // 打印启动消息
            var button = document.querySelector(搜索);
            if (button) {
                button.click();
            }




            // 定位复选框元素
            var checkbox = document.querySelector('.el-checkbox__original');
            if (checkbox) {
            if (checkbox.disabled) {
                console.log("禁用");
            } else {
                setTimeout(function() {
                    var checkboxContainer = document.querySelector('.el-checkbox');
                    if (checkboxContainer) {
                    checkboxContainer.click(); // 模拟点击复选框容器
                    console.log("已模拟点击复选框");
                    } else {
                    console.log("未找到复选框容器元素");
                    }

                }, 500); // 延迟


                setTimeout(function() {
                    console.log("点击认领按钮");
                    var buttons = document.querySelectorAll('button'); // 获取所有按钮元素
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].textContent.trim() === "认领") { // 根据按钮文本进行匹配
                            console.log("找到认领按钮");
                            buttons[i].click(); // 点击认领按钮
                            break; // 终止循环
                        }
                    }
                }, 1000); // 1秒延迟

            }
            } else {
            console.log("找不到复选框元素");
            }
        } else {
            console.log("当前页面不包含片段标识符 '#/diagnosisCenter'");
        }

    }, loopInterval);
})();