// ==UserScript==
// @name         Reddit AdBlocker｜Remove ads from Reddit🚫 
// @name:zh-CN   Reddit广告拦截器｜移除Reddit广告🚫
// @name:ru      Reddit блокировщик рекламы｜Удалить рекламу🚫
// @name:ja      Redditアドブロッカー｜広告を削除🚫
// @name:ko      Reddit 광고 차단기｜광고 제거🚫
// @name:es      Bloqueador de anuncios Reddit｜Eliminar anuncios🚫
// @namespace    https://www.reddit.com/
// @version      0.6
// @description  Remove ads from Reddit pages, including elements with shreddit-dynamic-ad-link class
// @description:zh-CN  移除 Reddit 页面上的广告,包括带有 shreddit-dynamic-ad-link 类的元素
// @description:ru    Удаляет рекламу со страниц Reddit, включая элементы с классом shreddit-dynamic-ad-link
// @description:ja    Redditページから広告を削除します（shreddit-dynamic-ad-linkクラスを含む）
// @description:ko    Reddit 페이지에서 광고 제거 (shreddit-dynamic-ad-link 클래스 포함)
// @description:es    Elimina anuncios de las páginas de Reddit, incluyendo elementos con clase shreddit-dynamic-ad-link
// @author       YourName
// @match        *://*.reddit.com/*
// @grant        none
// @license      MIT
// @icon         https://www.reddit.com/favicon.ico
// @supportURL   https://github.com/YourName/reddit-adblocker/issues
// @homepage     https://github.com/YourName/reddit-adblocker
// @downloadURL https://update.greasyfork.org/scripts/509503/Reddit%20AdBlocker%EF%BD%9CRemove%20ads%20from%20Reddit%F0%9F%9A%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/509503/Reddit%20AdBlocker%EF%BD%9CRemove%20ads%20from%20Reddit%F0%9F%9A%AB.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const adSelectors = [
        'div[data-testid="ad"]',                      // Reddit 广告容器
        '.promotedlink',                              // 推广帖子
        'div[data-adclicklocation]',                  // 带有特定点击位置的广告
        '.shreddit-dynamic-ad-link.absolute.inset-0'  // 你提供的自定义广告类
    ];
 
    // 移除广告的函数
    function removeAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => ad.remove());
        });
    }
 
    // 使用 MutationObserver 监听 DOM 变化,实时移除新出现的广告
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });
 
    // 初始执行一次移除现有广告
    removeAds();
})();