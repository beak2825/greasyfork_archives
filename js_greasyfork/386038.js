// ==UserScript==
// @name         CoinAll 抢币要滑块验证版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *://www.coinall.com/activity/jumpstart/*
// @match        *://www.coinall.live/activity/jumpstart/*
// @match        *://www.okex.com/activity/jumpstart/*
// @match        *://www.okex.me/activity/jumpstart/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386038/CoinAll%20%E6%8A%A2%E5%B8%81%E8%A6%81%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/386038/CoinAll%20%E6%8A%A2%E5%B8%81%E8%A6%81%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    //  'use strict';

    var Okex = {
        countdown: 0,
        /**
        * 获取剩余时间
        * @param  {Number} endTime    截止时间
        * @param  {Number} deviceTime 设备时间
        * @param  {Number} serverTime 服务端时间
        * @return {Object}            剩余时间对象
        */
        getRemainTime: function (endTime, deviceTime, serverTime) {
            let t = endTime - Date.parse(new Date()) - serverTime + deviceTime
            let seconds = Math.floor((t / 1000) % 60)
            let minutes = Math.floor((t / 1000 / 60) % 60)
            let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
            let days = Math.floor(t / (1000 * 60 * 60 * 24))
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            }
        },
        style(type) {
            return styles[type] ? styles[type] : "";
        },
        positionTip() {
            $(document.body).append('<div style="position: fixed; z-index: 199999;margin-left: -135px; margin-top: -43px; text-align: center;color: red;top: 50%;left: 50%;"><p style="margin-left: -50px;">如果倒计时结束，没有马上弹窗，请马上点击按钮！</p><div style="position:relative;width: 60px; height: 60px; border: 2px solid red;border-radius: 50%;"><span style="font-size: 42px;margin-left:-30px;" id="countdown"></span><span style="font-size: 32px;position: absolute;bottom: -4px;left: 36%;">☟</span><div></div>')
            $("head").append('<style type="text/css">.geetest_wind.geetest_panel{ z-index: 199998!important;}</style>')
        },
        init: function () {
            Okex.positionTip()
            var isShowDialog = false
            var isOpenHuaKuai = false
            var c = setInterval(()=>{
                var b = $('#countInput');
                var a = $('.buy-coin').eq(0);
                Okex.$countdown = $("#countdown");
                let serverTime = Math.round(new Date().getTime()) // 暂时用本地时间代替服务器时间
                // 得到剩余时间 Okex.countdown 减去1秒，提前一秒点击
                let remainTime = Okex.getRemainTime(new Date($("#publicOfferStart").text()).getTime(), Math.round(new Date().getTime()) , serverTime);
                let time =  Number.parseInt(remainTime.total/1000);
                //console.log("距离点击按钮剩下：" + time + "秒" + remainTime.total);
                //Okex.$countdown.text(time)
                console.log('扫描是否开启抢购...', a.hasClass('enable'), time);
                
                Okex.$countdown.text(remainTime.hours + ":" +remainTime.minutes + ":" + remainTime.seconds)

                if (a.hasClass('enable')){
                    if (!isShowDialog) {
                        a.click();
                        isShowDialog = true;
                    }
                    if (b.length && !isOpenHuaKuai) {
                        console.log("模块开启，结束循环,循环ID：", c);
                        setInterval(c);
                        console.log("确认结束循环,循环ID：", c)
                        isOpenHuaKuai = true;
                        $('#countInput').val(Number.parseInt($("#buyLimitMax").text().slice(0,-3).replace(',', '')));
                        $('#submitBtn').click();
                    }
                    if(isOpenHuaKuai) {
                        clearInterval(c)
                    }

                }
            }, 50)
        }
    }

    Okex.init();
})();