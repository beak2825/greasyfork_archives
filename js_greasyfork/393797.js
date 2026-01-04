// ==UserScript==
// @name         test
// @namespace    sopfan
// @version      0.8.10
// @license MIT
// @description  屏蔽手机微博指定关键词(自用)
// @author       sopfan
// @match        https://m.weibo.cn/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://greasyfork.org/scripts/393896-filterlist/code/filterList.js
// @downloadURL https://update.greasyfork.org/scripts/393797/test.user.js
// @updateURL https://update.greasyfork.org/scripts/393797/test.meta.js
// ==/UserScript==
// 这里是一些常用的配置,以注释的形式呈现出来的,
// name:脚本的名字,这里可以自己命名
// namespace:可以写自己的域名,当自己把脚本分享后,用户可以直接通过这儿找到你的具体功能实现
// version:版本
// description:功能描述,自己用就不用写
// author:作者,可以写自己的网名
// match:匹配的网址,比如" https://m.weibo.cn/*",其中*是通配符
// require 引用外部资源的url 如jq
//剩下一个没搞懂,暂时不影响使用,还有更多可以了解官方文档:
//https://tampermonkey.net/documentation.php
(function () {
    'use strict';
    window.onload = function () {
        if (jQuery) {
            window.setTimeout(filter, 100);
            window.setTimeout(filter, 500);
            window.setTimeout(filter, 1000);
            //   $('body').on('DOMNodeInserted',function(){
            $(document).scroll(function () {
                filter();
            });
           var text = document.createTextNode(".npage-bg{display: none !important;}.card4 .card-wrap{min-height: 2.75rem;}span.main-text.m-text-cut { white-space: normal; overflow: auto; text-overflow: unset; }");
            var style = document.createElement("style");
            style.type = "text/css";
            style.appendChild(text);
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(style);
        } else {
            alert('jQuery 未加载');
        }
    };

    function filter() {
        $.each(filterList, function (index, item) {
            let replace = '屏蔽词';
            $('.main-text').each(function () {
                if ($(this).html().indexOf(item) != -1) {
                    $(this).html('<del>' + replace + '</del>');
                }
            });
            $('h4.m-text-cut').each(function () {
                if ($(this).html().indexOf(item) != -1) {
                    $(this).html('<del>' + replace + '</del>');
                }
            });
            $('.weibo-text').each(function () {
                if ($(this).html().indexOf(item) != -1) {
                    $(this).html('<del>' + replace + '</del>');
                    $(this).next().remove();
                }
            });
            $('h3.m-text-cut').each(function () {
                if ($(this).html().indexOf(item) != -1) {
                    $(this).html('<del>' + replace + '</del>');
                }
            });
            $('.wb-item-wrap').each(function () {
                if ($(this).html().indexOf(item) != -1) {
                    $(this).html('<del>' + replace + '</del>');
                }
            });
        });
        $(".lite-iconf-like").parent().remove();
        $(".f-card-title").parent().parent().remove();
    }
})();