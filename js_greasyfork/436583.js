// ==UserScript==
// @name         干掉笔趣阁手机广告
// @namespace    maozhi
// @version      0.1
// @description  干掉笔趣阁手机网页广告
// @author       You
// @match        *://www.lylcrc.cn/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436583/%E5%B9%B2%E6%8E%89%E7%AC%94%E8%B6%A3%E9%98%81%E6%89%8B%E6%9C%BA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/436583/%E5%B9%B2%E6%8E%89%E7%AC%94%E8%B6%A3%E9%98%81%E6%89%8B%E6%9C%BA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let parentdiv = $('.layout-col1');
    let iframe = parentdiv.find("iframe");
    iframe.parent().attr('style','display:none');
    //去掉下载客户端提示
    $('.aznav').attr('style','display:none');
})();