// ==UserScript==
// @name         爱卡净化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  爱卡汽车论坛净化
// @author       Androidcn
// @license      GPL-3.0 License
// @match        https://www.xcar.com.cn/bbs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xcar.com.cn
// @grant        none
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/443562/%E7%88%B1%E5%8D%A1%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443562/%E7%88%B1%E5%8D%A1%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
     var $ = window.$;
    $('.picScroll-left').hide()
    $('.noRelated').hide()
    $('.seo_optimization').hide()
    $('.forum_right_item').hide()
    $('.forum_intro_right').hide()
    $('#slideVideo').hide()

})();