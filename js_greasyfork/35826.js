// ==UserScript==
// @name         慕课实战
// @version      1.0.2
// @description  个人向
// @author       Li
// @name         慕课高亮实战按钮
// @match        http://www.imooc.com/u/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/85311
// @downloadURL https://update.greasyfork.org/scripts/35826/%E6%85%95%E8%AF%BE%E5%AE%9E%E6%88%98.user.js
// @updateURL https://update.greasyfork.org/scripts/35826/%E6%85%95%E8%AF%BE%E5%AE%9E%E6%88%98.meta.js
// ==/UserScript==


//(function () {
//    null;
//})();

$().ready(function () {
    $('.imv2-war').parent().css({
        background: 'rgba(240,20,20,.8)',
        color: '#fff',
        borderRadius: '8px'
    }).find('i').css('color','#fff');
});