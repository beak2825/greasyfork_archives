// ==UserScript==
// @name         新mant下单
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  新mant快速下单
// @author       You
// @match        *://trade.taobao.com/trade/detail/trade_order_detail.htm*
// @icon         https://www.google.com/s2/favicons?domain=taobao.com
// @grant        none
// @grant             GM_info
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467678/%E6%96%B0mant%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/467678/%E6%96%B0mant%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var url = window.location.href
    var order_id;
 
    window.addEventListener("load", init, false);
    function init(){
        let appModSwitch = $("img[class^='app-mod__switch-img']");
        console.log(appModSwitch.length)
        if(appModSwitch.length > 0){
            let sifg = getQueryVariable("sifg")
            console.log(sifg)
            if(sifg === false){
                if(appModSwitch){appModSwitch.click();return;}
            }
            order_id = getQueryVariable("biz_order_id")
            console.log(order_id)
            xdButtonOnClick();
        }
    }
 
    function xdButtonOnClick(){
        if(!order_id){alert("订单编号获取失败");return;}
        console.log(order_id)
        let sellerName = getSellerName()
        console.log(sellerName)
        if(!sellerName){alert("获取店铺名称失败");return;}
        let logisticsInfo = getLogisticsInfo();
        let url = "https://newbooks.propername.cn/0d7e3264/booksystem/public/jumpBuy?tbShopName=" + sellerName + "&tbTid=" + order_id +"&receiver="+logisticsInfo
        console.log(encodeURI(url))
        let itemUrl = getItemUrl();
        console.log(itemUrl);
        let newWindow = window.open(encodeURI(url))
        console.log("=>",newWindow)
        if(newWindow){
            window.location.href=itemUrl;
        }
    }
 
    function myFunction(e){
        console.log("myFunction",e)
    }
 
    function addButton(){
        let xdButton=$("<button></button>").text("新下单");
        xdButton.attr('id','xdButton');
        xdButton.attr('type','button');
        xdButton.css("position","fixed");
        xdButton.css("top","30%");
        xdButton.css("right","100px");
        xdButton.css("width","100px");
        xdButton.css("padding","8px");
        xdButton.css("background-color","#428bca");
        xdButton.css("border-color","#357ebd");
        xdButton.css("color","#fff");
        xdButton.css("-moz-border-radius","10px");
        xdButton.css("-webkit-border-radius","10px");
        xdButton.css("border-radius","10px");
        xdButton.css("-khtml-border-radius","10px");
        xdButton.css("text-align","center");
        xdButton.css("vertical-align","middle");
        xdButton.css("border","1px solid transparent");
        xdButton.css("font-weight","900");
        xdButton.css("font-size","14px");
        $("body").append(xdButton);
        $('#xdButton').bind("click",xdButtonOnClick); //绑定点击事件
    }
 
    function getItemUrl(){
        let itemUrl = $("div[class^='item-mod__text-info']").find("div[class='desc']").find("div[class='name']").find("a").attr('href');
        return itemUrl;
    }
 
    function getLogisticsInfo(){
        let logisticsInfo = $("div[class^='logistics-panel-mod__group-info']").find("div[class^='logistics-panel-mod__content']").first().find("span[class='value']").text()
        console.log(logisticsInfo)
        return logisticsInfo;
    }
 
    function getSellerName(){
         let loginInfoNick = $(".site-nav-login-info-nick")
         let nickname = loginInfoNick.text()
         let i = nickname.lastIndexOf(":");
         let sellerName = nickname.substring(0,i);
        return sellerName;
    }
 
    function getQueryVariable(variable)
    {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }
})();