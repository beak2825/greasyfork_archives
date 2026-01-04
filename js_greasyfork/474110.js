// ==UserScript==
// @name         培训跳检测
// @namespace    your-namespace
// @version      0.2
// @description  在特定页面上监控元素出现并自动运行脚本
// @match        https://v3.21tb.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474110/%E5%9F%B9%E8%AE%AD%E8%B7%B3%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474110/%E5%9F%B9%E8%AE%AD%E8%B7%B3%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要监控的元素的XPath表达式
    var targetXPath = "//*[@id='slideVerify']/div[2]/span"; // 替换为你的XPath表达式

    function waitForElementToAppear(selector, callback) {
        var interval = setInterval(function() {
            var element = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 100); // 100毫秒间隔，可以根据需要调整
    }

    waitForElementToAppear(targetXPath, function(targetElement) {
        targetElement.click();

        // 获取视频元素
        var video = document.querySelector('video');

        // 监听视频播放结束事件
        video.addEventListener('ended', function() {
            // 在视频播放结束时执行的操作
            alert("视频播放完毕啦，来点下一个！");
        });
    });

})();
