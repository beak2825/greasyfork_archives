// ==UserScript==
// @name         v2ex 自动签到
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       imzhi
// @match        https://v2ex.com
// @match        https://v2ex.com/mission/daily
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406646/v2ex%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/406646/v2ex%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

'use strict';

(function() {
    // 对cloudflare拦截时直接返回
    if (!$('#Logo').length) {
        console.warn('no #Logo');
        return;
    }
    if (!$('#member-activity').length) {
        console.warn('未登录');
        return;
    }
    var date = new Date();
    var currdate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    var store = localStorage.getItem('tampermonkey-v2ex-sign');
    // 判断今天是否已经执行过
    if (store && store === currdate) {
        console.warn('已执行', store, currdate);
        return;
    }
    var url = 'https://v2ex.com/mission/daily';
    var href = location.href;
    if (href === 'https://v2ex.com/') {
        var $link = $('#Rightbar .inner a');
        if ($link.length) {
            location.href = url;
        } else {
            localStorage.setItem('tampermonkey-v2ex-sign', currdate);
            console.warn('已签到');
        }
    }
    if (href === url) {
        var $button = $('#Main .cell .super.normal.button');
        console.warn('签到按钮不存在aaa', $button);
        if ($button.length) {
            $button.click();
            localStorage.setItem('tampermonkey-v2ex-sign', currdate);
        } else {
            console.warn('签到按钮不存在');
        }
    }
})();