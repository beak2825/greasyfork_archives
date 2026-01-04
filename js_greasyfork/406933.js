// ==UserScript==
// @name         百度网盘复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  run-at: context-menu 老是没有启用，要重启浏览器才行~
// @author       imzhi <yxz_blue@126.com>
// @match        https://pan.baidu.com/disk/home*
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @run-at       context-menu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406933/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/406933/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $copyShare = $('#copyShare');
    var $share_url = $('.share-url');
    var $share_password = $('.share-password');
    if (!$copyShare.length || !$share_url.length || !$share_password.length) {
        console.log('#copyShare not exist');
        return;
    }
    var link = $share_url.val();
    var code = $share_password.val();
    var copy_text = `百度网盘链接：<a href="${link}" rel="noopener noreferrer" target="_blank">${link}</a>，提取码：${code}。`;
    var $copy_btn = $('<button id="copy-rijupao-btn" />');
    $copy_btn.text('复制(rijupao)');
    $copy_btn.attr('data-clipboard-text', copy_text);
    new ClipboardJS('#copy-rijupao-btn');
    $copyShare.append($copy_btn);
})();