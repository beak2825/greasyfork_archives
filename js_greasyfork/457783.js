// ==UserScript==
// @name         Alibaba国际站询盘订单榜单90天内产品询盘订单数查询--By 微信公众号搜索国际站运营Sky
// @namespace    https://mp.weixin.qq.com/s/DtcPGtbc34bORAsrsf0OvA
// @version      0.3
// @license      MIT
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @description  用来查询国际站订单询盘榜单90天内产品询盘订单数
// @author       By 微信公众号搜索国际站运营Sky
// @match        https://www.alibaba.com/trade/search?*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457783/Alibaba%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%A6%9C%E5%8D%9590%E5%A4%A9%E5%86%85%E4%BA%A7%E5%93%81%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%95%B0%E6%9F%A5%E8%AF%A2--By%20%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99%E8%BF%90%E8%90%A5Sky.user.js
// @updateURL https://update.greasyfork.org/scripts/457783/Alibaba%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%A6%9C%E5%8D%9590%E5%A4%A9%E5%86%85%E4%BA%A7%E5%93%81%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%95%B0%E6%9F%A5%E8%AF%A2--By%20%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99%E8%BF%90%E8%90%A5Sky.meta.js
// ==/UserScript==
 
setTimeout(function(){
    var html=document.documentElement.outerHTML;
    var json=html.substring(html.indexOf("bannerData")+12,html.indexOf("offerResultData")-10).trim();
    var obj=$.parseJSON(json);
    var list1=obj.operateTheme.templateData.cardList[0].rankList;
    for(var i=0;i<list1.length;i++){
       var inquiry = list1[i].count;
       var div = document.getElementsByClassName('mt-offer__content');
       var e = document.createElement("span");
       e.style.color = "Blue";
       e.style.fontWeight = "Bold";
       e.innerText = "微信公众号搜索 国际站Sky \r\n 进运营交流群 \r\n90天内该产品总询盘数：" + inquiry;
       div[i].appendChild(e);
    }
},1000);
 
var main = setInterval(function() {
    var html = document.documentElement.outerHTML;
    var orderPage = document.querySelector('div[data-spm="order"]');
    //alert(orderPage)
    if (orderPage)
    {
    var json=html.substring(html.indexOf("bannerData")+12,html.indexOf("offerResultData")-10).trim();
    var obj=$.parseJSON(json);
    var list=obj.operateTheme.templateData.cardList[1].rankList;
    for(var i=0;i<list.length;i++){
       var order = list[i].count;
       var div = document.querySelectorAll('div[data-spm="order"] > div > div > div > div');
       var e = document.createElement("span");
       e.style.color = "RED";
       e.style.fontWeight = "Bold";
       e.innerText = "微信公众号搜索 国际站Sky \r\n 进运营交流群 \r\n90天内该产品总订单数：" + order;
       div[i].appendChild(e);
       clearInterval(main);
    }
    }
},
1000);