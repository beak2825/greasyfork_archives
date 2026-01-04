// ==UserScript==
// @name         知乎自动关闭弹窗
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动移除知乎登录窗口和其他后续加载的弹窗
// @author       nia3y
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418175/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/418175/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const removeNode = (node) => {
        node.remove();
    };
    const callback = (mutationList) => {
        document.querySelector('html').style.overflow = '';
        mutationList.forEach(mutationRecord => {
            mutationRecord.addedNodes.forEach(removeNode)
        })
    };
    const config = {
        childList: true,
    };

    let observer = new MutationObserver(callback);
    let node = document.querySelector('body');
    observer.observe(node, config);
})();