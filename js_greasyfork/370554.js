// ==UserScript==
// @name         批量删除京东优惠券
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量删除京东优惠券（全部删除）
// @author       wuzhizhemu569@gmail.com
// @match        https://quan.jd.com/user_quan.action*
// @grant        none
// @run-at      document-end
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370554/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E4%BA%AC%E4%B8%9C%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/370554/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E4%BA%AC%E4%B8%9C%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

var url = 'https://quan.jd.com/user_quan.action?couponType=-1&sort=3&page=1';

(function() {
    'use strict';
setTimeout(function() {

var length = $('.coupon-item .c-range').length;
if (length === 0) return;
location.href = url;
for (var i = 0 ; i < length ;i++) {
var para = {
        couponId:  $('.coupon-item .c-range:eq('+i+') .range-item:eq(2) span.txt').text(),
        pin: document.cookie.replace(/(?:(?:^|.*;\s*)pin\s*\=\s*([^;]*).*$)|^.*$/, "$1")
}
    jQuery.ajax({
        type: "POST",
        url: "/lock_coupon.action?r=" + Math.random(),
        data: para,
        dataType: "json",
        cache: false,
        success: function (result) {}
    });
}
    setTimeout(function() {
        location.href = url
    }, 1000)
}, 2000)

})();