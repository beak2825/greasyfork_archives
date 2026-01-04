// ==UserScript==
// @name 神马搜索自动下一页
// @description 神马搜索自动下一页。
// @author ChatGPT
// @version 1.0
// @match https://m.sm.cn/*
// @match https://yz.m.sm.cn/*
// @run-at document-end
// @namespace https://greasyfork.org/users/452911
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/521530/%E7%A5%9E%E9%A9%AC%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/521530/%E7%A5%9E%E9%A9%AC%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

window.addEventListener('scroll', function() {
    var distanceToBottom = document.body.scrollHeight - (window.innerHeight + window.pageYOffset);

    if (distanceToBottom < 1000) {
        var loadMoreButton = document.querySelector('a#pager'); 

        if (loadMoreButton && !loadMoreButton.classList.contains('loading')) { 
            loadMoreButton.click();
            loadMoreButton.classList.add('loading'); 
        }
    }
});