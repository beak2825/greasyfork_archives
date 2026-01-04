// ==UserScript==
// @name         屏蔽闲鱼收购狗
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  屏蔽掉闲鱼各种挂链接收购XXX的垃圾“商品”(会造成页面空白，介意勿用)
// @author       Rlunpika
// @match        http*://*.2.taobao.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373992/%E5%B1%8F%E8%94%BD%E9%97%B2%E9%B1%BC%E6%94%B6%E8%B4%AD%E7%8B%97.user.js
// @updateURL https://update.greasyfork.org/scripts/373992/%E5%B1%8F%E8%94%BD%E9%97%B2%E9%B1%BC%E6%94%B6%E8%B4%AD%E7%8B%97.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var keyWord = RegExp(/收|求购/);
    setInterval(function(){
        $('.item-brief-desc').each(function(){
            if(this.innerHTML.match(keyWord)){
                this.closest('div.ks-waterfall').remove();
            }
        });

        $('.item-pic').children().children('img').each(function(){
            if(this.title.match(keyWord)){
                this.closest('div.ks-waterfall').remove();
            }
        });

        //兼容“闲鱼助手”
        $('.item-pic').children('a').each(function(){
            if(this.title.match(keyWord)){
                this.closest('div.ks-waterfall').remove();
            }
        });
    },1000);
})(jQuery);