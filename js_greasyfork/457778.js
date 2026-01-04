// ==UserScript==
// @name         Alibaba国际站询盘订单榜单90天内询盘订单数据查询--By 国际站运营Sky
// @namespace    https://mp.weixin.qq.com/s/DtcPGtbc34bORAsrsf0OvA
// @version      0.2
// @license      MIT
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @description  使用脚本快速查看行业爆品询盘数据
// @author       By Sky
// @match        https://www.alibaba.com/trade/search?*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457778/Alibaba%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%A6%9C%E5%8D%9590%E5%A4%A9%E5%86%85%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2--By%20%E5%9B%BD%E9%99%85%E7%AB%99%E8%BF%90%E8%90%A5Sky.user.js
// @updateURL https://update.greasyfork.org/scripts/457778/Alibaba%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%A6%9C%E5%8D%9590%E5%A4%A9%E5%86%85%E8%AF%A2%E7%9B%98%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2--By%20%E5%9B%BD%E9%99%85%E7%AB%99%E8%BF%90%E8%90%A5Sky.meta.js
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
       e.style.color = "Light Blue";
       e.style.fontWeight = "Bold";
       e.innerText = "90天内产品总询盘数：" + inquiry;
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
       e.style.color = "Light Blue";
       e.style.fontWeight = "Bold";
       e.innerText = "90天内产品总订单数：" + order;
       div[i].appendChild(e);
       clearInterval(main);
    }
    }
},
1000);