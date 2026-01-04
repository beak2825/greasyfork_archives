// ==UserScript==
// @name         MCBBS无视解锁卡
// @namespace    net.mcbbs.unlock
// @version      1.0.1
// @description  直接查看需要解锁卡的帖子
// @author       author
// @match        https://www.mcbbs.net/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @icon         https://www.mcbbs.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444293/MCBBS%E6%97%A0%E8%A7%86%E8%A7%A3%E9%94%81%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/444293/MCBBS%E6%97%A0%E8%A7%86%E8%A7%A3%E9%94%81%E5%8D%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    jQuery.noConflict();
    var lock = jQuery('.alert_error');
    var text = lock.html();
    if (text != null) {
        var index = lock.html().toString().indexOf('您将要浏览的帖子由于过于陈旧');
        if (index === -1) {
            return;
        }
        var href = lock.find('.alert_btnleft a:first').attr('href').toString();
        var hindex = href.indexOf('&id=') + 4;
        var id = href.substring(hindex);
        var url = 'https://www.mcbbs.net/forum.php?mod=viewthread&action=printable&tid=' + id;
        var append = '<p class="alert_btnleft"><a href="' + url + '"">[ 无视解锁直接查看 ]</a></p>';
        lock.find('.alert_btnleft:first').after(append);
    }
})();