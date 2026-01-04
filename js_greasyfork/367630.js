// ==UserScript==
// @name         淘宝天猫内部优惠券.taobao,tianmao,tmall
// @namespace    淘宝天猫内部优惠券.taobao,tianmao,tmall
// @version      3.40.25
// @description  淘宝天猫内部优惠券
// @author       淘宝天猫内部优惠券
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @include      http*://s.taobao.com/*
// @include      http*://list.tmall.com/*
// @include      http*://list.tmall.hk/*
// @include      http*://chaoshi.tmall.com/*
// @include      http*://detail.tmall.hk/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367630/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8taobao%2Ctianmao%2Ctmall.user.js
// @updateURL https://update.greasyfork.org/scripts/367630/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8taobao%2Ctianmao%2Ctmall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 淘宝天猫优惠券,查找优惠券!!!...
    $(document).ready(function() {
		var url = window.location.host;
        var itemName = '';//$(document).attr('title');
        var itemId = '';
		if (url == 'item.taobao.com') {
            itemId = $("link[rel=canonical]").attr("href");
            itemId = itemId.split("id=")[1];
            itemName = $('.tb-main-title').attr('data-title');
            var btn_quan_taobao = '<a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #2e8b57;#2e8b57;margin-left:10px" href="https://www.ishtq.com/?m=search&a=index&k='+ encodeURI(itemName) +'&id='+ encodeURI(itemId) +'" " target="_blank">查优惠券</a><a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #2e8b57;#2e8b57;margin-left:10px" href="https://s.click.taobao.com/qwFLesv" target="_blank">双旦会场</a></div>';
            $('.tb-action').append(btn_quan_taobao);
		}else if(url == 'detail.tmall.com'){
            itemId = $("link[rel=canonical]").attr("href");
            itemId = itemId.split("id=")[1];
            itemName = $('meta[name=keywords]').attr('content');
            var btn_quan_tmall =   '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;width:100px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #2e8b57;#2e8b57;" href="https://www.ishtq.com/?m=search&a=index&k='+ encodeURI(itemName) +'&id='+ encodeURI(itemId) +'" " target="_blank">查优惠券</a><a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #2e8b57;#2e8b57;margin-left:10px" href="https://s.click.taobao.com/qwFLesv" target="_blank">双旦会场</a></div>';
			$('.tb-sku').append(btn_quan_tmall);
        }else if(url == 'chaoshi.detail.tmall.com'){
            itemId = $('a[id=J_AddFavorite]').attr('data-aldurl')
            itemId = itemId.split("itemId=")[1]
            itemName = $('input[name=title]').attr('value');
            var btn_chaoshi_tmall = '<div class="tb-action tb-btn-add tb-btn-sku"><a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;width:100px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:5px;color: #fff;background-color: #2e8b57;#2e8b57;"href="https://www.ishtq.com/?m=search&a=index&k='+ encodeURI(itemName) +'&id='+ encodeURI(itemId) +'" " target="_blank">查优惠券</a><a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #2e8b57;#2e8b57;margin-left:10px" href="https://s.click.taobao.com/qwFLesv" target="_blank">双旦会场</a></div>';
            $('.tb-sku').append(btn_chaoshi_tmall);
        }else if(url == 'detail.tmall.hk'){
            itemId = $("link[rel=canonical]").attr("href");
            itemId = itemId.split("id=")[1];
            itemName = $('meta[name=keywords]').attr('content');
            var btn_tmall_hk =   '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;width:100px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #2e8b57;#2e8b57;" href="https://www.ishtq.com/?m=search&a=index&k='+ encodeURI(itemName) +'&id='+ encodeURI(itemId) +'" " target="_blank">查优惠券</a><a style="display: inline-block;padding: 6px 9px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:16px;line-height:16px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #2e8b57;#2e8b57;margin-left:10px" href="https://s.click.taobao.com/qwFLesv" target="_blank">双旦会场</a></div>';
			$('.tb-sku').append(btn_tmall_hk);
        }
    });
})();