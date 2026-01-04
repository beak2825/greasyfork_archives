// ==UserScript==
// @name         聚融e银行职业在线教育平台-自动答题
// @namespace    代刷vx:shuake345
// @version      0.2
// @description  全自动答单选题|代刷多选判断vx:shuake345
// @author       代刷vx:shuake345
// @match        http://www.geron-e.com/static/course/coursedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geron-e.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467422/%E8%81%9A%E8%9E%8De%E9%93%B6%E8%A1%8C%E8%81%8C%E4%B8%9A%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/467422/%E8%81%9A%E8%9E%8De%E9%93%B6%E8%A1%8C%E8%81%8C%E4%B8%9A%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function cx() {
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
    function Dt(){
        var numbs=document.querySelectorAll(" div > input[data-answer=true]").length-1//[4].nextElementSibling.querySelector('i').click()
        var numb=numbs+1
        var LastXuan=document.querySelectorAll(" div > input[data-answer=true]")
        if(LastXuan[numbs].attributes[0].value=="checkbox"){//duox
            for (var i = 0; i < 5; i++) {//chise 6
                LastXuan[numbs-i].nextElementSibling.querySelector('i').click()
                setTimeout(nex,1100)
            }
        }else{
            LastXuan[numbs].nextElementSibling.querySelector('i').click()
    document.querySelector("#nextTestQuestions").click()
        setTimeout(nex,1100)
        }
    
    }
    setInterval(Dt,2415)
    function nex(){
        document.querySelector("#nextTestQuestions").click()
    }
    function asg() {
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
    function Reg_Get(HTML, reg) {
      let RegE = new RegExp(reg);
      try {
        return RegE.exec(HTML)[1];
      } catch (e) {
        return "";
      }
    }
    function ACSetValue(key, value) {
      GM_setValue(key, value);
      if(key === 'Config'){
        if (value) localStorage.ACConfig = value;
      }
    }
    function getElementByXpath(e, t, r) {
      r = r || document, t = t || r;
      try {
        return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      } catch (t) {
        return void console.error("无效的xpath");
      }
    }
    function getAllElementsByXpath(xpath, contextNode) {
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      contextNode = contextNode || doc;
      var result = [];
      try {
        var query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < query.snapshotLength; i++) {
          var node = query.snapshotItem(i); //if node is an element node
          if (node.nodeType === 1) result.push(node);
        }
      } catch (err) {
        throw new Error(`Invalid xpath: ${xpath}`);
      } //@ts-ignore
      return result;
    }
function getAllElements(selector) {
      var contextNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;
      var _cplink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
      if (!selector) return []; //@ts-ignore
      contextNode = contextNode || doc;
      if (typeof selector === 'string') {
        if (selector.search(/^css;/i) === 0) {
          return getAllElementsByCSS(selector.slice(4), contextNode);
        } else {
          return getAllElementsByXpath(selector, contextNode, doc);
        }
      } else {
        var query = selector(doc, win, _cplink);
        if (!Array.isArray(query)) {
          throw new Error('Wrong type is returned by getAllElements');
        } else {
          return query;
        }
      }
    }


})();