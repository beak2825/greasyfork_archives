// ==UserScript==
// @name         Jable修改页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description        该脚本修改Jable页面，使视频标题不再被隐藏，完整显示。
// @description:zh-CN  该脚本修改Jable页面，使视频标题不再被隐藏，完整显示。
// @description:zh-TW  該指令碼修改Jable頁面，使視頻標題不再被隱藏，完整顯示。
// @description:en     This script modifies the Jable page to fully display video titles, no longer hiding them.
// @description:ko     이 스크립트는 Jable 페이지를 수정하여 비디오 제목이 숨겨지지 않고 완전히 표시되도록 합니다.
// @description:ja     このスクリプトは、Jableページを修正し、ビデオタイトルを隠さずに完全に表示します。
// @author       mrhydra
// @license      MIT
// @match        https://jable.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jable.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514595/Jable%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/514595/Jable%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateTitleStyles() {
        // 获取所有带有 .video-img-box .title 类的元素
        let titles = document.querySelectorAll('.video-img-box .title');

        titles.forEach(function(title) {
            title.style.whiteSpace = 'normal';
        });
    }

    // 使用 MutationObserver 监听 DOM 的变化
    const observer = new MutationObserver(updateTitleStyles);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行一次，以处理页面加载时的元素
    updateTitleStyles();
})();