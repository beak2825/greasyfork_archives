// ==UserScript==
// @name         闲鱼二维码
// @icon         https://gtms02.alicdn.com/tps/i2/TB1VqSxHVXXXXb.XVXXqw4SJXXX-79-60.png
// @namespace    Nobody
// @version      0.12
// @description  在宝贝图列表里添加一张手机闲鱼App能扫描的二维码
// @author       Nobody
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @match        https://www.taobao.com/favicon.ico
// @match        http*://2.taobao.com/*
// @match        http*://s.2.taobao.com/*
// @match        http*://trade.2.taobao.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387078/%E9%97%B2%E9%B1%BC%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/387078/%E9%97%B2%E9%B1%BC%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

// 部分代码来源于 https://greasyfork.org/zh-CN/scripts/373103-闲鱼-咸鱼-助手

(function() {
    'use strict';

    // 根据当前URL获取二维码图片地址
    window.qrurl2 = function(){
        var imgsrc = "";
        var strs = location.search.split("&");
        for (var i=0;i<strs.length;i++){
            var s = strs[i];
            if (s.indexOf("id=")==0){
                var url = "https://market.m.taobao.com/app/idleFish-F2e/widle-taobao-rax/page-detail?"+s;
                //qr(url);
                imgsrc = "https://api.qrserver.com/v1/create-qr-code/?margin=0&data="+encodeURIComponent(url);
                break;
            }
        }
        //$('#qrcode img').attr('src', imgsrc);
        return imgsrc;
    };

    window.addItemQRCode = function(){
        //if ($('.mau-guide').length == 0) return;

        //生成当前页面的二维码
        var imgSrc = window.qrurl2();

        //放到轮播图最后
        var lastLi = $('ul[class="album"] li:last');
        var reg = /(?<=(lazyload-img="))[^"]*?(?=")/ig;
        var guideHtml = lastLi[0].outerHTML.replace(reg, imgSrc);
        $('ul[class="album"]').append(guideHtml);

        //处理thumb
        var thumbUl = $('.thumb-list ul');
        var thumbUlLastLiHtml = thumbUl.children('li')[0].outerHTML;
        var thumbReg = /(?<=(src="))[^"]*?(?=")/ig;
        thumbUl.append(thumbUlLastLiHtml.replace(thumbReg, imgSrc));

        //去掉宝贝轮播图首图上碍眼又无用二维码遮挡
        $('.mau-guide').remove();
    };

    window.addItemQRCode();


})();