// ==UserScript==
// @name         BaiduAD Killer
// @namespace    https://greasyfork.org/users/212360
// @version      0.2
// @description  去除百度网盘广告
// @author       zelricx
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/link*
// @match        *://yun.baidu.com/share/link*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @encoding     utf-8
// @downloadURL https://update.greasyfork.org/scripts/380519/BaiduAD%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/380519/BaiduAD%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('[class|=ad]').remove();

    $('.module-share-file-main').css('padding-bottom', '100px');

})();