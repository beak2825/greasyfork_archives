// ==UserScript==
// @name         书签地球-不关注公众号自动页面跳转
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  无视扫码关注公众号，直接跳转真实的地址。
// @author       Dreamer
// @match        *://www.bookmarkearth.com/view/*
// @grant        none
// @license      MIT
// @icon        https://www.bookmarkearth.com/media/img/logo/favicon.ico
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436201/%E4%B9%A6%E7%AD%BE%E5%9C%B0%E7%90%83-%E4%B8%8D%E5%85%B3%E6%B3%A8%E5%85%AC%E4%BC%97%E5%8F%B7%E8%87%AA%E5%8A%A8%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436201/%E4%B9%A6%E7%AD%BE%E5%9C%B0%E7%90%83-%E4%B8%8D%E5%85%B3%E6%B3%A8%E5%85%AC%E4%BC%97%E5%8F%B7%E8%87%AA%E5%8A%A8%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        var url = $('.link').text();
        $('.actions button').remove();
        $('.actions').append('<a class="btn btn-default btn-xs jump-target-url" href='+url+' target="_blank">继续访问</a>')
        $('.btn')[0].click()
        window.close()
    })
})();