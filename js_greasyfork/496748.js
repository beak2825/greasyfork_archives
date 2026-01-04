// ==UserScript==
// @name        监测刷新2.0
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/496748/%E7%9B%91%E6%B5%8B%E5%88%B7%E6%96%B020.user.js
// @updateURL https://update.greasyfork.org/scripts/496748/%E7%9B%91%E6%B5%8B%E5%88%B7%E6%96%B020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var noDataXpaths = [
        'id("app")/DIV[1]/DIV[3]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/P[1]',
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/svg[1]'
    ];
    var messageSelector = 'div.el-message';
    var refreshButtonXpath = 'id("app")/DIV[1]/DIV[3]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[3]/BUTTON[1]';
    var minDelay = 100;  // 最小延迟时间（毫秒）
    var maxDelay = 200;  // 最大延迟时间（毫秒）

    function clickRefreshButton() {
        var button = document.evaluate(refreshButtonXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button) {
            // 生成随机延迟时间
            var delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
            console.log('将在 ' + delay + ' 毫秒后点击刷新按钮');
            setTimeout(function() {
                button.click();
            }, delay);
        } else {
            console.log('刷新按钮未找到');
        }
    }

    function isElementPresent(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue !== null;
    }

    function isElementPresentCSS(selector, expectedText) {
        var element = document.querySelector(selector);
        return element !== null && element.innerText.trim() === expectedText;
    }

    function checkAndRefresh() {
        var shouldRefresh = false;
        for (var i = 0; i < noDataXpaths.length; i++) {
            if (isElementPresent(noDataXpaths[i])) {
                shouldRefresh = true;
                break;
            }
        }
        if (isElementPresentCSS(messageSelector, 'Error: 本任务不允许跳过')) {
            shouldRefresh = true;
        }

        if (shouldRefresh) {
            console.log('检测到“暂无数据”或消息提示元素，点击刷新按钮');
            clickRefreshButton();
        } else {
            console.log('未检测到“暂无数据”或消息提示元素，不点击刷新按钮');
        }
    }

    // 初次加载时检测
    checkAndRefresh();

    // 监听DOM变化
    var observer = new MutationObserver(function(mutations) {
        checkAndRefresh();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
