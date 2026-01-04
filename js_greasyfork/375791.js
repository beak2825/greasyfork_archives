// ==UserScript==
// @name         禁止Web版微信延迟加载图片
// @description  在Web版微信文章页面中直接显示图片
// @namespace    https://greasyfork.org/zh-CN/scripts/disable_lazy_load
// @version      0.1
// @author       reinstallsys
// @match        http://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/s?*
// @match        http://mp.weixin.qq.com/s/*
// @match        https://mp.weixin.qq.com/s/*
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375791/%E7%A6%81%E6%AD%A2Web%E7%89%88%E5%BE%AE%E4%BF%A1%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/375791/%E7%A6%81%E6%AD%A2Web%E7%89%88%E5%BE%AE%E4%BF%A1%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

var $ = window.jQuery;

$(document).ready(function() {
    setTimeout(function(){
        $('img').each(function(){
            var dataSrc = $(this).attr('data-src');
            if (dataSrc){
                $(this).attr('src', dataSrc);
                $(this).removeAttr('data-src');
            }
        });
    }, 1000);
});