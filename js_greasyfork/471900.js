// ==UserScript==
// @name         统计刷新次数
// @namespace    https://gitee.com/liu-long068/
// @version      1.1
// @description  可以配合刷问卷的脚本查看刷新次数（提交次数）
// @author       echo
// @match        https://www.wjx.cn
// @include      https://www.wjx.cn/*
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/471900/%E7%BB%9F%E8%AE%A1%E5%88%B7%E6%96%B0%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471900/%E7%BB%9F%E8%AE%A1%E5%88%B7%E6%96%B0%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var targetUrl = "https://www.wjx.cn/";

    // 检查当前网址是否需要统计刷新次数
    var currentLocation = window.location.href;
    var matched = currentLocation.match(/https:\/\/www\.wjx\.cn\//);
    if (matched === null) {
        return;
    }

    // 检查浏览器是否支持localStorage
    if (typeof(Storage) !== "undefined") {
        // 获取存储的刷新次数，如果不存在则初始化为0
        var refreshCount = localStorage.getItem("refreshCount");
        if (refreshCount === null) {
            refreshCount = 0;
        }

        // 创建悬浮窗容器
        var refreshCountWindow = document.createElement("div");
        refreshCountWindow.id = "refreshCountWindow";
        refreshCountWindow.style.cssText = "position: fixed; top: 20px; right: 20px; width: 150px; height: 70px; background-color: rgba(0, 0, 0, 0.8); color: #fff; font-size: 14px; padding: 10px; border-radius: 5px; text-align: center;";

        // 创建刷新次数文本元素
        var refreshCountText = document.createElement("div");
        refreshCountText.id = "refreshCountText";
        refreshCountText.textContent = "页面刷新次数: " + refreshCount;

        // 创建清零按钮
        var resetButton = document.createElement("button");
        resetButton.id = "resetButton";
        resetButton.textContent = "清零";
        resetButton.style.cssText = "margin-top: 10px; background-color: #fff; color: #000; border: none; padding: 5px 10px; cursor: pointer;";

        // 添加清零按钮点击事件监听
        resetButton.addEventListener("click", function() {
            // 清零刷新次数
            localStorage.removeItem("refreshCount");
            refreshCount = 0;

            // 更新悬浮窗中的刷新次数文本
            refreshCountText.textContent = "页面刷新次数: " + refreshCount;
        });

        // 将刷新次数文本元素和按钮元素添加到悬浮窗容器中
        refreshCountWindow.appendChild(refreshCountText);
        refreshCountWindow.appendChild(resetButton);

        // 将悬浮窗容器添加到页面中
        document.body.appendChild(refreshCountWindow);

        // 判断当前页面是否为目标网址，如果是则更新刷新次数并显示
        if (currentLocation.includes(targetUrl)) {
            // 检查页面是否是通过手动刷新方式打开的
            function isManualRefresh() {
                var manualRefresh = false;
                if (performance && performance.navigation) {
                    manualRefresh = performance.navigation.type === 1;
                }
                return manualRefresh;
            }

            // 获取存储的刷新次数，如果不存在则初始化为0
            refreshCount = localStorage.getItem("refreshCount");
            if (refreshCount === null) {
                refreshCount = 0;
            }

            // 如果是手动刷新且不是第一次加载页面，则不处理刷新次数
            if (isManualRefresh() && refreshCount > 0) {
                // 不处理刷新次数
            } else {
                // 将刷新次数加1
                refreshCount++;
                // 存储更新后的刷新次数
                localStorage.setItem("refreshCount", refreshCount);
            }

            // 更新悬浮窗中的刷新次数文本
            refreshCountText.textContent = "页面刷新次数: " + refreshCount;
        }
    } else {
        console.log("浏览器不支持Web存储功能");
    }

    function shouldResetCount(){
        return performance.navigation.type === 1;
    }
})();