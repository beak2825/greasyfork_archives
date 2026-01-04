// ==UserScript==
// @name         淘宝、天猫订单页面显示用户信息
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  显示订单页面用户信息
// @author       xingyu
// @match        https://trade.taobao.com/*
// @match        https://refund2.taobao.com/*
// @match        https://trade.tmall.com/*
// @match        https://refund2.tmall.com/*
// @match        https://tradearchive.taobao.com/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/436096/%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/436096/%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(() => {
        console.log("引入完成")
        // var i = 0
        //定义变量jiance，设置循环延迟，每500毫秒检测一次答题卡是否出现
        let jiance = setInterval(() => {

            // //循环20次，20次后还未找到，则退出循环
            // i++;
            // console.log("第" + i + "次检测")
            // if (i > 19) {
            //     //清除延迟
            //     clearInterval(jiance)
            // }


            //检测已卖出宝贝与详情页
            //控制台图片按钮长度，判断图片按钮是否出现
            //console.log("已卖出宝贝按钮" + $('.switch-img').length);
            //如果按钮不=0，则清除延迟，进行点击
            if ($('.switch-img').length) {
                //清除延迟,已卖出宝贝不清除延时，解决下一页后无法自动开启
                //clearInterval(jiance)

                //取图片路径
                console.log($('.switch-img').attr('src'))

                //判断图片路径是否为隐藏，是则点击
                if ($('.switch-img').attr('src') == "https://img.alicdn.com/imgextra/i2/O1CN01GSdb4q28dtn7GUSSr_!!6000000007956-2-tps-166-104.png") {
                    $('.switch-img').click();
                    console.log("详情页隐私点击完成");
                }
            }

            //检测退款管理与退款详情页
            //判断按钮是否存在
            //console.log("退款管理隐私按钮" + $('.switch-container').length);
            //如果按钮不=0，则清除延迟，进行点击
            if ($('.switch-container').length) {
                //清除延迟
                clearInterval(jiance)

                //$('input.switch-checkbox').click();
                document.querySelector('input.switch-checkbox').click();
                console.log("执行调试");
            }
        }, 500);
    })
    // Your code here...
})
();