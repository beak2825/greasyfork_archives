// ==UserScript==
// @name         淘宝 天猫 优惠券  一键领取 简单功能 不占内存 2018年9月30 v1.3 持续更新！TaoBao & Tmall Coupons!
// @namespace    http://quan.leonguo.cn/
// @version      1.3
// @description  阿里妈妈提供的优惠券，不用白不用，装上逛淘宝更省钱！ 正常逛淘宝点击商品旁边的【领取优惠券】按钮即可领对应商品优惠券！功能简单不占内存！！在打开页面自行修改关键词可以获得更多优惠券信息。 Provide Tmall and Taobao hidden coupons, save u money! Easy to use- visit Taobao an Tmall as normal, just click the 【领取优惠券】button to obtain the coupons!
// @author       淘淘省钱小帮手
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @include      http*://detail.tmall.hk/*
// @include      http*://list.tmall.com/*
// @include      http*://list.tmall.hk/*
// @include      http*://s.taobao.com/*
// @include      http*://ai.taobao.com/search/*
// @include      http*://ai.taobao.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372652/%E6%B7%98%E5%AE%9D%20%E5%A4%A9%E7%8C%AB%20%E4%BC%98%E6%83%A0%E5%88%B8%20%20%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%20%E7%AE%80%E5%8D%95%E5%8A%9F%E8%83%BD%20%E4%B8%8D%E5%8D%A0%E5%86%85%E5%AD%98%202018%E5%B9%B49%E6%9C%8830%20v13%20%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%EF%BC%81TaoBao%20%20Tmall%20Coupons%21.user.js
// @updateURL https://update.greasyfork.org/scripts/372652/%E6%B7%98%E5%AE%9D%20%E5%A4%A9%E7%8C%AB%20%E4%BC%98%E6%83%A0%E5%88%B8%20%20%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%20%E7%AE%80%E5%8D%95%E5%8A%9F%E8%83%BD%20%E4%B8%8D%E5%8D%A0%E5%86%85%E5%AD%98%202018%E5%B9%B49%E6%9C%8830%20v13%20%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%EF%BC%81TaoBao%20%20Tmall%20Coupons%21.meta.js
// ==/UserScript==
(function() {
    $(document).ready(function() {
        var location = window.location.host;
        var name;
        var html
        if(location.indexOf("item.taobao.com")>=0){
            name = $('.tb-main-title').text();
            name = $.trim(name).substring(0,9); //去掉商品标题前后空格 取商品标题前10个字符
            html = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="http://quan.leonguo.cn/index.php?r=l&kw='+ encodeURI(name) + '" target="_blank">领取商品优惠券</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="http://quan.leonguo.cn/" target="_blank">获取更多优惠产品</a></div>';
            $('.tb-action').append(html);
        }else if(location.indexOf("detail.tmall") >= 0){
            name = $('meta[name=keywords]').attr('content');
            name = $.trim(name).substring(0,9);
            html = '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="http://quan.leonguo.cn/index.php?r=l&kw='+ encodeURI(name) + '" target="_blank">领取商品优惠券</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="http://quan.leonguo.cn/" target="_blank">获取更多优惠产品</a></div>';
            $('.tb-action').append(html);
        }else if(location.indexOf("s.taobao.com")>=0){
            $.each($(".pic"),function(index){
                if(index != -1){
                    var id = $(this).find("a").attr("data-nid");
                    name = $.trim($(this).parents(".item").find(".row-2").text());
                    name = $.trim(name).substring(0,9);
                    //alert(index + ":" + name);
                    $(this).parents(".item").find(".g_price").append('<a href="http://quan.leonguo.cn/index.php?r=l&kw=' + encodeURI(name) + ' " target="_blank"><em style="font-size:15px;color:red;border-style:solid;border-width:2px;padding:3px;"><strong>领取优惠券</strong></em></a>');
                }
             });
        }else if(location.indexOf("list.tmall.com")>=0){

            $(".productTitle").each(function(){
                name = $(this).children("a").attr("title");
                name = $.trim(name).substring(0,9);
                $(this).prev().append('<a href="http://quan.leonguo.cn/index.php?r=l&kw=' + encodeURI(name) + '" target="_blank" ><em style="font-size:12px;color:red;border-style:solid;border-width:1px;padding-bottom:6px;height:20px;"><strong>领取优惠券</strong></em></a>');
            });


        }else if(location.indexOf("ai.taobao.com")>=0){
            $(".title").each(function(){
                name = $(this).children("a:first").text();
                name = name.substring(0,9);
                $(this).after('<div style="margin-left:12px;"><a href="http://quan.leonguo.cn/index.php?r=l&kw=' + encodeURI(name.replace(/(^\s*)|(\s*$)/g, "")) + '" target="_blank" ><em style="font-size:12px;color:red;border-style:solid;border-width:1px;padding-bottom:6px;height:20px;"><strong>领取优惠券</strong></em></a><div>');
	    });
        }
    });

})();