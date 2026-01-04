// ==UserScript==
// @name         xpath自动点击器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use console functions T() and S() to start and stop clicking a button identified by XPath
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493697/xpath%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493697/xpath%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var XPATH = "/html/body/div[1]/div[3]/div/div/div[2]/div[3]/div[2]/div[2]/div/div[3]/button";
    var intervalId = null;// 用于存储定时器ID

    // 定义一个点击函数，使用 XPath 定位按钮
    function clickButtonByXPath(xpath) {
        var result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (result && result.singleNodeValue) {
            result.singleNodeValue.click();
        } else {
            console.log('No element found with the given XPath');
        }
    }

    // XPath 示例，需要根据实际情况替换为目标按钮的 XPath
    var buttonXPath = XPATH;

    // 将 T 和 S 函数注册为全局函数
    window.T = function() {
        // 如果定时器尚未运行，则启动定时器
        if (!intervalId) {
            intervalId = setInterval(() => clickButtonByXPath(buttonXPath), 1000);
            console.log('Auto-click started. Interval ID:', intervalId);
        }
    };

    window.S = function() {
        // 停止定时器
        if (intervalId) {
            clearInterval(intervalId);
            console.log('Auto-click stopped.');
            intervalId = null;
        }
    };

    console.log('Auto-click script loaded. Use T() to start and S() to stop.');
})();
