// ==UserScript==
// @name         SpringSunday-Show-Claim
// @namespace    https://springsunday.net/
// @version      1.1
// @description  显示种子认领数量
// @author       陶陶滔滔涛
// @include     http*://springsunday.net/torrents.php*
// @include     http*://springsunday.net/rescue.php*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419734/SpringSunday-Show-Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/419734/SpringSunday-Show-Claim.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    $('img.shield').each(function() {
        var title = $(this).attr('title');
        var count = title.replace('认领人数: ', '');
        var span = $('<span>' + count + '</span>');
        if (count < 10 && (getUrlParam('medium2') == 1 || getUrlParam('medium') == 2)) {
            span = $('<span style="color: red">' + count + '</span>');
        }
        $(this).after(span);
    });


    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
})();