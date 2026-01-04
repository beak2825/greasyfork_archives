// ==UserScript==
// @name         风之动漫键盘控制+去广告
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       imzhi
// @match        https://manhua.fzdm.com/*
// @match        https://manhua.fffdm.com/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406746/%E9%A3%8E%E4%B9%8B%E5%8A%A8%E6%BC%AB%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/406746/%E9%A3%8E%E4%B9%8B%E5%8A%A8%E6%BC%AB%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏头部广告
    GM_addStyle('@charset utf-8; #fix_top_dom {display: none;}');
    // 隐藏右下角广告
    GM_addStyle('@charset utf-8; #HMRichBox {display: none !important;}');
    // 隐藏底部广告
    GM_addStyle('@charset utf-8; .navigation+center {display: none !important;}');

    const $buttons = $('.navigation > .pure-button');
    if (!$buttons.length) {
        return;
    }
    let prev_btn, next_btn;
    $buttons.each(function(i, el) {
        if ($(el).text() === '上一页') {
            prev_btn = el;
        } else if ($(el).text() === '下一页' || $(el).text() === '下一话吧') {
            next_btn = el;
        }
    });
    $(document).keydown(function(e) {
        if (e.which == 37) {
            if (prev_btn) {
                prev_btn.click();
            }
        } else if (e.which == 39) {
            if (next_btn) {
                next_btn.click();
            }
        }
    });
})();