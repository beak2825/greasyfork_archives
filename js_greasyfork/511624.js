// ==UserScript==
// @name         云萌|持续删除水印元素
// @namespace    https://oj.cloudcode.team/
// @version      1.0
// @description  持续删除oj.cloudcode.team网页中id为1.23452384164.123412416的元素
// @author       OneMan
// @match        https://oj.cloudcode.team/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511624/%E4%BA%91%E8%90%8C%7C%E6%8C%81%E7%BB%AD%E5%88%A0%E9%99%A4%E6%B0%B4%E5%8D%B0%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/511624/%E4%BA%91%E8%90%8C%7C%E6%8C%81%E7%BB%AD%E5%88%A0%E9%99%A4%E6%B0%B4%E5%8D%B0%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个函数，用于删除具有特定ID的元素
    function removeElementById(id) {
        var element = document.getElementById(id);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    // 创建一个MutationObserver来监控DOM的变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.id === '1.23452384164.123412416') {
                        removeElementById('1.23452384164.123412416');
                    }
                }
            }
        });
    });

    // 配置MutationObserver
    var config = { childList: true, subtree: true };

    // 开始监控整个文档
    observer.observe(document.body, config);

    // 删除初始页面加载时可能存在的元素
    removeElementById('1.23452384164.123412416');
})();
