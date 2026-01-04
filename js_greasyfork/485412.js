// ==UserScript==
// @name        监测刷新
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/485412/%E7%9B%91%E6%B5%8B%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/485412/%E7%9B%91%E6%B5%8B%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    var noDataXpaths = [
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/P[1]',
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/svg[1]'
    ];
    var messageSelector = 'div.el-message';
    var interval = 2000;

    function refreshPage() {
        location.reload();
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
            console.log('检测到“暂无数据”或消息提示元素，刷新页面');
            refreshPage();
        } else {
            console.log('未检测到“暂无数据”或消息提示元素，不刷新页面');
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