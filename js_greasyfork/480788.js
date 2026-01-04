// ==UserScript==
// @name         Github 搜索净化
// @namespace    https://greasyfork.org/zh-CN/scripts/478777
// @version      1.1
// @description  屏蔽令人烦恼的小家伙，在搜索结果内不在呈现黑名单列表内用户发布的项目，用户id直接写进blacklist内即可例如["test","test2"]
// @author       mu
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480788/Github%20%E6%90%9C%E7%B4%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/480788/Github%20%E6%90%9C%E7%B4%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var blacklist = ["黑名单用户1","黑名单用户2"];
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeBlacklistedElements();
            }
        });
    });
    observer.observe(document, { childList: true, subtree: true });

    function removeBlacklistedElements() {
        var elementsToRemove = [];

        for (var i = 1; i <= 10; i++) {
            var xpath = `/html/body/div[1]/div[6]/main/react-app/div/div/div[1]/div/div/div[2]/div[2]/div/div[1]/div[4]/div/div/div[${i}]`;

            var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (element) {
                var titleElement = element.querySelector("h3 a span");
                if (titleElement) {
                    var title = titleElement.textContent.trim();
                    var valueBeforeSlash = title.split("/")[0];
                    if (blacklist.includes(valueBeforeSlash)) {
                        elementsToRemove.push(element);
                    }
                }
            }
        }
        elementsToRemove.forEach(function(element) {
            console.log(`黑名单命中，稍后进行元素删除`);
            element.remove();
        });
    }
    removeBlacklistedElements();
})();
