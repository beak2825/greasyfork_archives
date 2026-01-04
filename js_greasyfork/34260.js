// ==UserScript==
// @name         autoDD373
// @namespace    http://pansx.net/
// @version      0.93
// @description  DD373自动购买脚本!
// @author       pansx
// @match        http://buy.dd373.com/buy/FillOrder.html*
// @match        http://pay.dd373.com/*
// @match        https://pay.dd373.com/*
// @match        http://m.dd373.com/Wap/*
// @match        https://m.dd373.com/Wap/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34260/autoDD373.user.js
// @updateURL https://update.greasyfork.org/scripts/34260/autoDD373.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //设置你的等级:
    var level="60";
    //设置你的支付密码以便启用直接用余额付款功能
    var password="518918";

    // Your code here...
    var url	 = window.location.href;
    function main(){

           $("#promit").val("房屋当面交易（推荐）");
            $("input#text1.form-control.req.degree").val(level);
        //最大数量购买
        $("#buycountS").val($("#buycountS>option:last").val());
        if (url.match("FillOrder.html")){
            //电脑端填表
            $("input[name='RoleName']:eq(0)").click();
            $("#nextstep>a").click();
        }
        if (url.match("BizBuy.shtml")){
            $("#BizBuyForm button").click();
            setTimeout(function () {

                            //手机确认,选中的客服不为空时点击提交
           var iv=setInterval(function () {
if ($("#qq0").attr("checked")==="checked"){
    $("#submit").click();
    clearInterval(iv);
}
},50);

            },100);

            //错误检测系统
           var errD=setInterval(function () {
            //需要密码的订单直接关闭
            if(!$("#BuyPwd").is(":hidden")){
         self.close();
         clearInterval(errD);
}


},30000);



        }

        //手机支付
         if (url.match("PayOrder.shtml")){
             //直接使用余额付款
             $("#Pay_yue").tap();
             $("#Zhifupsw > div > input[type='password']:nth-child(2)").val(password);
             $("#Confirm > a").click();
             setTimeout(function () {$(".go_pay >a").click();},200);

         }


        //支付
        $("#ThirdSelect").click();
        $("#ZfbMoneyPay").click();
        $("#PaySure").click();
        $("#GoPayZfb>a").click();


        $("body > div > form > input").click();
        //检测支付宝支付是否被隐藏,没被隐藏就点击
        if(!$(".go_pay").is(":hidden")){
         $("#BankPay > div > a").click();
}

    }

    //执行循环
    //setInterval(function(){main();},100);
    main();

})();