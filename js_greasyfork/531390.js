// ==UserScript==
// @name        当页开链
// @namespace   -
// @match       *://*/*
// @exclude-match    *://www.gamer520.com/*
// @exclude-match    *://bray.tech/*
// @grant       none
// @version     5.5
// @author      -
// @description 当前页面打开链接
// @downloadURL https://update.greasyfork.org/scripts/531390/%E5%BD%93%E9%A1%B5%E5%BC%80%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/531390/%E5%BD%93%E9%A1%B5%E5%BC%80%E9%93%BE.meta.js
// ==/UserScript==

(() => {

const shouldExcludeElement = (target) => {
    const EXCLUDE_SELECTORS = [
      '[href^="javascript"]',
      '#ks',
      //
      '.bpx-player-ending-content','.carousel-wrap',//bilibili
      '#sb_form',//bing
      '.swiper-wrapper',//baidubaike
      '.win-wapper',//kook
      '[class="hidden xl:flex space-x-4 items-center"]','[class="flex items-start justify-between"]',
      '[role="button"]',
      '[class="pager__btn pager__btn__prev"]','[class="pager__btn pager__btn__next"]',//acfun
      '[id="download_tab_cont"]',
      '[class^="SourceListItem__name"]','[class^="file-tree-btn"]','[id="send_sms_code"]','[class="comment-reply-link"]','[class="download-buttons-container"]',
      '[id="rdgenconseemore"]'//bing
    ];
    return EXCLUDE_SELECTORS.some(selector => target.closest(selector));
};

  //

document.addEventListener('click', function(event) {
    // 使用Event.composedPath()获取精确目标（2025推荐）
    const preciseTarget = event.composedPath()[0];

    if (shouldExcludeElement(preciseTarget)) return true;

    // 动态节点溯源（兼容Shadow DOM）
    let node = preciseTarget;
    while (node && node.tagName !== 'A') {
        node = node.parentElement || node.host; // 处理Web Components场景
    }

    // 增强型链接处理
    if (node?.tagName === 'A') {
        // 最新安全策略（2025-04）
        event.stopImmediatePropagation(); // 防止其他监听器干扰
        event.preventDefault();

        // 异步跳转避免阻塞（2025性能优化方案）
        requestAnimationFrame(() => {
            window.location.assign(node.href); // 替代直接href赋值
        });
    }
}, true);

  //

window.open = u => (location = u);

  //

new MutationObserver(_=>document.querySelectorAll('form').forEach(f=>f.target='_self')).observe(document,{childList:1,subtree:1});

})();