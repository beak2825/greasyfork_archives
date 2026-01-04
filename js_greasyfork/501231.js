// ==UserScript==
// @name         足球计算器脚本
// @namespace    https://m.sporttery.cn/mjc/jsq/zqbqc/
// @supportURL   https://m.sporttery.cn/mjc/jsq/zqbqc/
// @version      2024-09-24
// @description  足球计算器去除点击限制、最大倍数、禁用双击放大
// @author       韩鹏飞
// @match        *://m.sporttery.cn
// @match        *://m.sporttery.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501231/%E8%B6%B3%E7%90%83%E8%AE%A1%E7%AE%97%E5%99%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/501231/%E8%B6%B3%E7%90%83%E8%AE%A1%E7%AE%97%E5%99%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function htmlchange() {
        // 创建一个MutationObserver实例并传入一个回调函数
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // 每次DOM发生变化时都会执行这里的代码
                console.log('DOM mutation detected:', mutation);
                removeClickRestrictions();
            });
        });

        // 提供一个被观察目标节点，以及观察选项（观察子节点的变化）
        var config = { childList: true, subtree: true };

        // 传入目标节点和观察选项，开始观察
        observer.observe(document.body, config);
    }


    // 移除页面中的点击限制样式
    function removeClickRestrictions() {
        const spans = document.querySelectorAll('span.oddsDis, span.oddsPanDis');
        spans.forEach(span => {
            span.classList.remove('oddsDis');
            span.classList.remove('oddsPanDis');
        });
    }

    // 禁用页面上的双击放大功能
    function disableDoubleTapZoom() {
        document.addEventListener('dblclick', function (event) {
            event.preventDefault();
        }, true);
    }

    // 重写 alert 函数，阻止弹窗
    function suppressAlerts() {
        const originalAlert = window.alert;
        window.alert = function (message) {
            // 可以在这里记录日志等，但不做任何弹窗操作
        };
    }

    // 重置计算器的最大投注倍数
    function resetMaxBetMultiplier() {
        large_times = 1000; // 默认值设置为1000
        console.log('最大投注倍数已设置为:', large_times);
    }

    // 重写计算器的点击和删除按钮逻辑
    function overrideCalculatorFunctions() {
        if (lotFunc) {
            lotFunc.clickKeyboard = function (num) {
                var nums = $('#times').text();
                if ($("#initTimes").val() == "true") {
                    $("#initTimes").val("false");
                    if (num == 0) {
                        nums = 1;
                    } else {
                        nums = num;
                    }
                } else {
                    if (nums == "") {
                        nums = 1;
                    }
                    nums = nums + num;
                    if (nums > large_times) {
                        alert("投注倍数最高到" + large_times + "倍");
                        nums = large_times;
                    }
                }
                $()
                $('#times').text(nums);
                $('#multiple').text(nums);
            };

            // 查找页面上所有的 div 元素，假设按钮是唯一的或可以通过特定的类或 ID 选择
            var deleteButton = document.querySelector('div[onclick="lotFunc.clickKeyboardDel()"]');

            // 如果找到该元素，修改其文本内容为“清除”
            if (deleteButton) {
                deleteButton.textContent = '清除';
            }
            //删除按钮
            lotFunc.clickKeyboardDel = function () {
                var nums = $('#times').text(); // 获取当前的数字字符串

                nums = 1;
                $("#initTimes").val("true");

                // 更新页面元素
                $('#times').text(nums);
                $('#multiple').text(nums);
            };
        }
    }

    function removeOddsPanDisClass() {
        'use strict';

        // 选择一个父元素，它应该包含所有可能动态生成的按钮
        const parentSelector = 'body'; // 根据实际情况调整选择器

        // 监听页面加载完成事件
        window.addEventListener('load', function () {
            // 使用事件委托监听所有子元素的点击事件
            $(parentSelector).on('click', 'span.oddsPanDis', function (event) {
                // 移除 oddsPanDis 类
                $(this).removeClass('oddsPanDis');

                // 执行原有的点击事件逻辑（如果有）
                // 如果存在原有的 click 事件处理器，可以在这里调用
                // 注意：这里可能需要您根据实际情况添加代码来处理原有逻辑

                // 阻止默认行为和事件冒泡，防止触发其他不需要的行为
                event.preventDefault();
                event.stopPropagation();
            });
        });

        // 如果需要，可以在这里添加额外的逻辑来处理页面上的其他动态变化
        // 例如，监听页面上的某些事件，以响应动态内容的变化
    }

    // 监听页面加载完成事件
    window.addEventListener('load', function () {
        htmlchange(); //页面改变事件
        removeOddsPanDisClass(); //提前移除标签
        removeClickRestrictions(); // 移除页面中的点击限制样式，使得所有相关的 <span> 标签都可点击
        disableDoubleTapZoom(); // 禁用 Safari 浏览器中的双击放大功能，通过阻止 dblclick 事件的默认行为
        suppressAlerts(); // 重写 window.alert 函数，以阻止页面上的 alert 弹窗，避免影响用户体验
        resetMaxBetMultiplier(); // 如果页面上有定义 large_times 变量，将其值设置为 1000，表示最大投注倍数
        overrideCalculatorFunctions(); // 重写 lotFunc 对象中的 clickKeyboard 和 clickKeyboardDel 函数 // 以自定义计算器的点击和删除按钮逻辑，适应新的投注规则

    });
})();