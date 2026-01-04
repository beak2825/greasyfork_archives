// ==UserScript==
// @name         202310mant下单
// @require      https://libs.baidu.com/jquery/2.1.1/jquery.min.js
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  202310mant下单description
// @author       You
// @match        *://qn.taobao.com/home.htm/trade-platform/tp/detail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478049/202310mant%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478049/202310mant%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href
    var order_id;

    window.addEventListener("load", start, false);
    function start(){
        var t = setInterval(function(){
            let appModSwitch = $("div[class^='next-switch-btn']");
            let logisticsInfo = $(".receive-address_value__Fmomy");
            if(appModSwitch && logisticsInfo){
                clearInterval(t);
                //console.log("====================================")
               showLogisticsInfo();
            }
         },500);
    }
    function showLogisticsInfo(){
        let appModSwitch = $("div[class^='next-switch-btn']");
        console.log(appModSwitch.length)
        if(appModSwitch == null || appModSwitch.length <= 0){
            alert("未找到收货信息显示按钮");return;
        }

        let logistics = $("div[class^=logistics-panel_content]")
        //console.log(logistics)
        logistics.bind('DOMNodeInserted', function(e) {
            xdButtonOnClick();
        });
        appModSwitch.click();
        order_id = getQueryVariable("bizOrderId")
        console.log(order_id)
    }

    function xdButtonOnClick(){
        if(!order_id){alert("订单编号获取失败");return;}
        console.log(order_id)
        let sellerName = getSellerName()
        //console.log(sellerName)
        if(!sellerName){alert("获取店铺名称失败");return;}
        let logisticsInfo = getLogisticsInfo();
        let url = "https://mantang.propername.cn/41cd739d/booksystem/public/jumpBuy?tbShopName=" + sellerName + "&tbTid=" + order_id +"&receiver="+logisticsInfo
        console.log(encodeURI(url))
        let itemUrl = getItemUrl();
        console.log(itemUrl);
        let newWindow = window.open(encodeURI(url))
        console.log("=>",newWindow)
        if(newWindow){
            //window.location.href=itemUrl;
        }
    }

    function myFunction(e){
        console.log("myFunction",e)
    }

    function addButton(){
        let xdButton=$("<button></button>").text("下单");
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
        let itemUrl = $("div[class^='order-info_order-item-first-right-title']").find("a").attr('href');
        return itemUrl;
    }

    function getLogisticsInfo(){
        let logisticsInfo = $(".receive-address_value__Fmomy").text()
        //console.log(logisticsInfo)
        return logisticsInfo;
    }

    function getSellerName(){
         let qnworkbenHomeModsStr = localStorage.getItem("qnworkben_home_mods");
         let userName = null;
         try {
            let qnworkbenHomeMods = JSON.parse(qnworkbenHomeModsStr);
            userName = qnworkbenHomeMods.data.userName
         } catch (e) {
            console.log("发生异常:" + e)
         }
        if(userName == null){
            return userName;
        }
        userName = userName.split(":")[0];
        return userName;
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