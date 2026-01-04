// ==UserScript==
// @name         GitHub to DeepWiki Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在GitHub仓库页面插入Go DeepWiki按钮，跳转到对应DeepWiki页面
// @author       teddyxiong53
// @match        https://github.com/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534770/GitHub%20to%20DeepWiki%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534770/GitHub%20to%20DeepWiki%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 按钮唯一标识，防止重复插入
    const BUTTON_ID = 'go-deepwiki-btn';
    // 监听目标区域变化
    function insertButtonIfNeeded() {
        const titleContainer = document.querySelector('.pagehead-actions');
        if (!titleContainer) return;
        if (document.getElementById(BUTTON_ID)) return;
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.className = 'btn ml-2';
        button.style.backgroundColor = '#2da44e';
        button.style.color = 'white';
        button.textContent = 'Go DeepWiki';
        button.addEventListener('click', function() {
            const currentUrl = window.location.href;
            const newUrl = currentUrl.replace('github.com', 'deepwiki.com');
            window.open(newUrl, '_blank');
        });
        titleContainer.prepend(button);
    }
    // MutationObserver用于兼容GitHub的动态页面
    const observer = new MutationObserver(function() {
        insertButtonIfNeeded();
    });
    function tryObserve() {
        const titleContainer = document.querySelector('.pagehead-actions');
        if (titleContainer) {
            observer.observe(titleContainer, {childList: true, subtree: false});
            insertButtonIfNeeded();
        } else {
            // 页面未加载完全时重试
            setTimeout(tryObserve, 500);
        }
    }
    // 页面加载后启动监听
    window.addEventListener('load', tryObserve);
    // 兼容pjax页面切换
    document.addEventListener('pjax:end', insertButtonIfNeeded);
})();