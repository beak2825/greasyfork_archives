// ==UserScript==
// @name         山东理工职业学院继续教育平台
// @namespace    vx:shuake345
// @version      0.2
// @description  自动看课程|自动切换课程|代刷vx:shuake345
// @author       vx:shuake345
// @match        https://sdjn-gxk.yxlearning.com/*
// @match        *.zhuanjipx.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yxlearning.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467246/%E5%B1%B1%E4%B8%9C%E7%90%86%E5%B7%A5%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/467246/%E5%B1%B1%E4%B8%9C%E7%90%86%E5%B7%A5%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function KJ() {
    $(document).ready(function() {
       'use strict';
		var host = window.location.host;
        var itemName = '';//$(document).attr('title');
        //var itemId = '';
        var Url = 'https://django.taobaocoupon.1143438227845072.cn-shenzhen.fc.devsapp.net/api'
        var link = window.location;
		// alert(link);
		if (host == 'item.taobao.com') {
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                if(data.reslut == '200'){
                    console.log(data)
                    $('.tb-action').append('<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a>');
                }else if(data.reslut == '0'){
                    $('.tb-action').append('<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="/" " target="_blank">暂无可用优惠券</a>');
                }
            });
		}else if(host == 'detail.tmall.com'){
            //itemId = $(location).attr("href");
            //itemId = itemId.split("id=")[1];
            //itemId = itemId.split("&")[0];
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'chaoshi.detail.tmall.com'){
            //itemId = $(location).attr("href");
            //itemId = itemId.split("id=")[1];
            //itemId = itemId.split("&")[0];
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            console.log(itemName)
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'detail.tmall.hk'){
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'detail.liangxinyao.com'){
            itemId = $("link[rel=canonical]").attr("href");
            itemId = itemId.split("id=")[1];
            itemName = $('meta[name=keywords]').attr('content');
            $.getJSON(Url,{itmename:itemName,id:itemId},function(data){
                if(data.reslut == '200'){
                    $('.tb-sku').append('<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    $('.tb-sku').append( '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }
      });
}
    function BF(){
        var JD=document.querySelectorAll("ul>li.sonLi > a")
        //34num
        if(document.getElementsByClassName('sonLi width100 on')[0].querySelector('a').nextElementSibling!==null){
            if(document.getElementsByClassName('sonLi width100 on')[0].querySelector('a').nextElementSibling=="完成学习"){//当前播放的完成了
                for (var i = 0; i < JD.length; i++) {
            if(JD[i].nextElementSibling!==null){//n or Y
                if(JD[i].nextElementSibling.innerText!=="完成学习"){
                    JD[i].click()
                    break;
                }
            }
        }
            }
        }
    }
    setInterval(BF,14245)
})();