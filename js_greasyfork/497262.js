// ==UserScript==
// @name        WX监测刷新
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  css
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://wanx.myapp.com/*
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/497262/WX%E7%9B%91%E6%B5%8B%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/497262/WX%E7%9B%91%E6%B5%8B%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // XPath expressions for detecting "暂无待审数据" and the buttons
    var noDataXpath = 'id("app")/DIV[2]/DIV[1]/SECTION[2]/DIV[2]/DIV[1]/DIV[2]';
    var waitButtonXpath = 'id("app")/DIV[2]/DIV[1]/SECTION[2]/DIV[2]/DIV[1]/DIV[3]/DIV[1]/BUTTON[2]';
    var refreshButtonXpath = 'id("app")/DIV[2]/DIV[1]/SECTION[2]/DIV[1]/DIV[1]/DIV[1]/BUTTON[2]';
    var minDelay = 100;  // Minimum delay time in milliseconds
    var maxDelay = 200;  // Maximum delay time in milliseconds

    // Function to click a button given its XPath
    function clickButton(xpath, callback) {
        var button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button) {
            var delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
            console.log('Will click button in ' + delay + ' milliseconds');
            setTimeout(function() {
                button.click();
                if (callback) {
                    callback();
                }
            }, delay);
        } else {
            console.log('Button not found: ' + xpath);
        }
    }

    // Function to check if an element is present
    function isElementPresent(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue !== null;
    }

    // Function to handle the click sequence when no data is detected
    function handleNoData() {
        if (isElementPresent(noDataXpath)) {
            console.log('Detected "暂无待审数据" element');
            // Click the "继续等待" button, then click the "刷新" button
            clickButton(waitButtonXpath, function() {
                console.log('Clicked "继续等待" button');
                clickButton(refreshButtonXpath, function() {
                    console.log('Clicked "刷新" button');
                });
            });
        } else {
            console.log('"暂无待审数据" element not detected');
        }
    }

    // Initial check on page load
    handleNoData();

    // Observe DOM changes
    var observer = new MutationObserver(function(mutations) {
        handleNoData();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
