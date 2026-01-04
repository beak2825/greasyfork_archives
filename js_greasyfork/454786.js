// ==UserScript==
// @name        bilibili去除鼠标悬停预览视频
// @namespace    https://greasyfork.org/scripts/454786
// @homepage     https://greasyfork.org/scripts/454786
// @version      0.2
// @description  bilibili去除鼠标悬停预览视频。只去除全屏预览暂时不知道怎么弄，只能把悬停预览整个去除。
// @author       dazzulay
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @require    https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/454786/bilibili%E5%8E%BB%E9%99%A4%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/454786/bilibili%E5%8E%BB%E9%99%A4%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle ( `
    .fuck_preview_mask {
        position: absolute;
        z-index: 999;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
` );
    $(document).on('mouseenter', '.__scale-player-wrap', function () {
        if($(this).attr('replaced') != 1){
            $(this).attr('replaced',1);
            $(this).append('<div class="fuck_preview_mask"></div>');
        }
    });
})();