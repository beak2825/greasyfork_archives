// ==UserScript==
// @name         掘金文章自动显示全文
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  不用登录自动显示掘金博客全文
// @author       Lynxz
// @match        https://juejin.im/post/*
// @match        https://juejin.im/entry/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32115/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/32115/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 隐藏 "显示全文" 按钮
    $('.show-full').remove();
    $('.show-full-block').remove();
    // 隐藏右侧边栏
    // entry 和 post 网址的侧边栏名称还不太一样
    $('.entry-public-aside').remove();
    $('div.entry-public-main.shadow').css('max-width','100%');
    $('.container .main-container').css('max-width','100%');
    $('.columen-view-aside').remove();
    $('.columen-view-main').css('max-width','100%');
    $('.container .entry-view').css('max-width','100%');
    $('.container .bottom-container').css('max-width','100%');
    // 显示全文,并取消最大高度限制
    let ct = $('div.post-content-container.hidden');
    ct.css('max-height','');
    ct.removeClass('hidden');
})();