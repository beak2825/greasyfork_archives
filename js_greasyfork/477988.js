// ==UserScript==
// @name         autoClick
// @namespace    https://github.com/weiensong/cirrhinus-molitorella
// @version      1
// @description  B站自动宽页模式，知乎问题自动展开全部。快捷键为Z
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.zhihu.com/question/*
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/477988/autoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/477988/autoClick.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var xpathsToWaitFor = [
        '//div[@class="bpx-player-control-wrap"]//div[@aria-label="宽屏"]',
        '//button[contains(text(),"显示全部 ")]'
    ];

    function waitForXPaths(xpaths, callback) {
        function checkXPath(xpath) {
            var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                callback(element);
            }
        }

        xpaths.forEach(function(xpath) {
            checkXPath(xpath);
        });

        var observer = new MutationObserver(function(mutations) {
            xpaths.forEach(function(xpath) {
                var newElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (newElement) {
                    observer.disconnect();
                    callback(newElement);
                }
            });
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'z') {
            checkXPathsAndClick();
        }
    });

    function checkXPathsAndClick() {
        for (var i = 0; i < xpathsToWaitFor.length; i++) {
            var element = document.evaluate(xpathsToWaitFor[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                console.log(xpathsToWaitFor[i],element)
                element.click();
                break;
            }
        }
    }

    waitForXPaths(xpathsToWaitFor, function(elementToClick) {
        if (elementToClick) {
            elementToClick.click();
        }
    });

})();