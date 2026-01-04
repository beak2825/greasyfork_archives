// ==UserScript==
// @name         xjtw脚本
// @namespace    SmilerGo
// @version      2.1
// @description  小小工具
// @author       小新学IT
// @match        https://zsy.coolthink.cn/Wxxcx/wdplay/zsyGame/xjtw
// @icon         https://t7.baidu.com/it/u=1951548898,3927145&fm=193&f=GIF
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456141/xjtw%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456141/xjtw%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var current = 0;
    var alreadV = false;
    var globalControl = false;

    // 获取当前窗口相对路径
    function GetUrlRelativePath(){
        let pathName = window.location.pathname;
        console.log("当前窗口路径:" + pathName);
        return pathName;
    }

    console.log("当前窗口路径:" + GetUrlRelativePath() + window.location.hash);

    //支付宝支付
    sdk.alipay = function(args) {
        //    $.ajax({
        //        url: "/Alipay/pay",
        //        dataType: 'json',
        //        type: 'post',
        //        data: args,
        //        success: function(res) {
        //            if (res.errorCode == 0) {
        //                $("body").append(res.data);
        //            } else {
        //                app.$toast(res.errorMessage);
        //            }
        //        }
        //    });
        //    alert(args.zsyGame);
        window.open( 'https://zsy.coolthink.cn/Alipay/pay?zsyGame='+args.zsyGame+'&subject='+args.subject+'&money='+1+'&zsyOrder='+args.zsyOrder, '_blank');
    }

    //微信WAP支付
    sdk.wxwappay = function(args) {
        console.log("当前窗口路径支付:");
        console.log(args);
        args.money = 1;
        $.ajax({
            url: "/Wxxcx/wdpay",
            dataType: 'json',
            type: 'post',
            data: args,
            success: function(res) {
                if (res.errorCode == 0) {
                    console.log(res.data);
                    if(versionsRes.ios) {
                        if(res.iosurl){
                            location.href=res.iosurl;
                        }else{
                            location.href = res.data + '&redirect_url=#'
                        }
                        //https://zsy.coolthink.cn/Wxxcx/payback
                    } else {
                        window.open( res.data + '&redirect_url=#', '_blank');
                    }


                } else {
                    app.$toast(res.errorMessage);
                }
            }
        });
    }
    window.SDKJS = sdk;

})();