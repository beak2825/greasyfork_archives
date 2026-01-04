// ==UserScript==
// @name         简单搜索自动展开
// @description  自动展开简单搜索的结果，避免需要多次点击“加载更多”按钮。
// @author       ChatGPT
// @version      3.7
// @match        https://m.baidu.com/*
// @match        https://www.baidu.com/*
// @exclude      https://*.baidu.com/video/
// @run-at      document-end
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/466175/%E7%AE%80%E5%8D%95%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/466175/%E7%AE%80%E5%8D%95%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在搜索结果页面
    if (!window.location.href.includes('word=') && !window.location.href.includes('wd=')) {
        return;
    }

    // 检查是否存在加载更多按钮
    var loadMoreButton = document.querySelector('div.se-infiniteload-text');
    if (!loadMoreButton) {
        return;
    }

    // 如果存在"加载更多"span也点击
    var spanLoadMore = document.querySelector('div.se-infiniteload-text');
    if (spanLoadMore) {
        spanLoadMore.click();
    }

    // 滚动时自动加载更多
    window.addEventListener('scroll', function() {
        var distanceToBottom = document.body.scrollHeight - (window.innerHeight + window.pageYOffset);
        if (distanceToBottom < 400) {
            var currentLoadMoreButton = document.querySelector('div.se-infiniteload-text');
            if (currentLoadMoreButton) {
                currentLoadMoreButton.click();
            }
        }
    });

    // 隐藏元素
    var div = document.getElementById("head-queryarea");
    if (div) {
        div.style.display = "none";
    }
})();