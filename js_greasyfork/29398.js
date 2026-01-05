// ==UserScript==
// @name        杉果一键购买
// @description 杉果一键购买脚本、登录时自动定位输入框、首页自动跳转付款、自动注销、自动登录
// @author      Simon
// @include     https://www.sonkwo.com/*
// @include     https://excashier.alipay.com/*
// @icon        https://www.sonkwo.com/assets/gostore-7b32f77a974921d3a9f64ad461fd801805f368bee65064a1d44f504b684bd1a4.png
// @version     1.0.5
// @updatetime  2017-05-03
// @run-at      document-end
// @require     http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @require     http://cdn.bootcss.com/zeroclipboard/2.2.0/ZeroClipboard.js
// @grant       GM_xmlhttpRequest
// @namespace   https://greasyfork.org/users/120697
// @downloadURL https://update.greasyfork.org/scripts/29398/%E6%9D%89%E6%9E%9C%E4%B8%80%E9%94%AE%E8%B4%AD%E4%B9%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/29398/%E6%9D%89%E6%9E%9C%E4%B8%80%E9%94%AE%E8%B4%AD%E4%B9%B0.meta.js
// ==/UserScript==

//请根据网络情况自行调节延时器

//功能开启
var auto2cart = true,                          //首页自动跳转购物车一键购买,如不需要，设置为false
    alipay = "",        //支付宝扫码成功自动注销，这里填的是扫码后显示的账户（会打码，所以数值和支付宝账户不一样），不需要自动注销请留空
    autoclose = true,                          //订单完成后自动关闭返回确认页，如不需要，设置为false，autosignout开启时此选项无效
    number =  3,                               //通用账户数字前缀位数，如250xxx@yyy.zz，则填3
    phostname = "",  //通用账户前缀及域名空间，如250xxx@yyy.zz，则填xxx@yyy.zz
    password = "",                 //通用登录密码
    money = "59.00",                        //价格检验，免得买错（心痛）
    auto2cart2 = true;                      //价格检验不通过弹窗提醒，如不需要，设置为false

//需要购买的东西的ID
var buyGamearray = new Array("2327");
//例子: var buyGamearray = new Array("2327","2328");

//首页自动跳转购物车
if (location.href == "https://www.sonkwo.com/" && auto2cart) {
    window.location.href = "https://www.sonkwo.com/cart";
}
//购物车自动确认
setTimeout(function () {
    if (location.href == "https://www.sonkwo.com/cart") {
        if($('input[type = checkbox]').length-1 == buyGamearray.length){
            $('.game_item_check').click();
            $('.button').click();
        }else {
            addCart();
            window.location.reload();
        }
    }
},1000);

//确认订单信息
var regex1 = new RegExp("https:\/\/www\.sonkwo\.com\/cart\/confirm");
var match1 = regex1.exec(location.href);
setTimeout(function () {
    if (match1 !== null) {
        $('.button').click();
    }
},1000);

//确认支付
var regex2 = new RegExp("https:\/\/www\.sonkwo\.com\/orders\/");
var match2 = regex2.exec(location.href);
if (match2 !== null) {
    $('#SK-payment-alipay-icon').click(); //使用支付宝付款
    setTimeout(function () {
        form = document.getElementById('SK-submit-order-form');
        form.submit();
    },500);
    setTimeout(function () {
        window.opener=null;window.open('','_self');window.close();
    },1500);
}

//自动关闭返回确认网页
var regex3 = new RegExp("https:\/\/www\.sonkwo\.com\/payment\/done");
var match3 = regex3.exec(location.href);
if (match3 !== null && autoclose) {
    $('.SK-btn').click();
}


//价格检验，不符则弹窗提示
var regex4 = new RegExp("https:\/\/excashier\.alipay\.com");
var match4 = regex4.exec(location.href);
if (match4 !== null && document.querySelector(".payAmount-area strong").innerHTML !== money) {
    if (auto2cart2) {
        window.location.href = "https://www.sonkwo.com/cart"; //自动回到购物车重新下单，这次肯定不会买错
    }else {
            alert("你该付￥" + money + "，而不是￥" + document.querySelector(".payAmount-area strong").innerHTML + "\n" + "夭寿了，差点买错了！");
            window.location.href = "https://www.sonkwo.com/cart"; //自动回到购物车重新下单，这次肯定不会买错
        }
}

//扫码成功自动注销
setInterval(function () {
    if (match4 !== null && document.querySelector(".mi-notice-explain-other.qrcode-notice-explain.ft-break span").innerHTML == alipay) {
        window.location.href = "https://www.sonkwo.com/sign_out";
    }
},500);

//自动加入购物车
function addCart(){
    for (var x in buyGamearray) {
        $.ajax({ url: "https://www.sonkwo.com/cart/add?game_id="+buyGamearray[x], context: document.body, success: function(){}});
    }
}

//登录页面自动定位光标至输入框并自动登录
$(function() {
    if (location.href == "https://www.sonkwo.com/sign_in") {
        document.getElementById('login_name').focus();
        var token = document.getElementsByName("authenticity_token")[0].value;
        $('#login_name').bind('input propertychange',function() {
            console.log($(this).val());
            if ($(this).val().length == number) {
                var account = $(this).val() + phostname;
                login(account,token);
                setTimeout(function () {
                window.location.reload();
                },500);
            }
        }
                             );
    }
});

//自动登录脚本
function login(account,token){
    $.post("https://www.sonkwo.com/sign_in",{
        "utf8":"%E2%9C%93",
        "authenticity_token":token,
        "account[login_name]":account,
		"account[password]":password,
		"account[remember_me]":"1",
		"commit":"登录"
    });
}

//ESC键强制注销
$(document).keydown(function (event) {
    if (event.keyCode == 27) {
        window.location.href = "https://www.sonkwo.com/sign_out";
    }
});

//自动领取优惠卷
//暂未实现