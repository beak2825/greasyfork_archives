// ==UserScript==
// @name         屏蔽闲鱼各种职业卖家
// @namespace    https://greasyfork.org/zh-CN/scripts/374967
// @home-url     https://greasyfork.org/zh-CN/scripts/374967
// @version      0.0.2
// @description  屏蔽闲鱼各种职业卖家(会造成页面空白，介意勿用) 基于Rlunpika 373992 修改
// @author       hinum009
// @match        http*://*.2.taobao.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374967/%E5%B1%8F%E8%94%BD%E9%97%B2%E9%B1%BC%E5%90%84%E7%A7%8D%E8%81%8C%E4%B8%9A%E5%8D%96%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/374967/%E5%B1%8F%E8%94%BD%E9%97%B2%E9%B1%BC%E5%90%84%E7%A7%8D%E8%81%8C%E4%B8%9A%E5%8D%96%E5%AE%B6.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var keyWord = RegExp(/收|求购|王思聪|配置|有锁|特价/);
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