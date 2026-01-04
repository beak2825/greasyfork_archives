// ==UserScript==
// @name         99shouHelper
// @namespace    https://www.ywmter.com/
// @version      1.0
// @description  因为http://99shou.cn的话费订单比较难抢，所以编写此脚本，使用计时器每隔一段时间自动提交获取订单。
// @author       唐僧肉片
// @match        http://99shou.cn/charge/phone/table?type=doing
// @match        http://99shou.cn/charge/phone/wopay/table?type=doing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375611/99shouHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/375611/99shouHelper.meta.js
// ==/UserScript==

// 暂时只需要99收的普通充值和沃支付充值

(function() {
    'use strict';
    var url = window.location.href;
    var normal = "http://99shou.cn/charge/phone/table?type=doing";
    var wopay = "http://99shou.cn/charge/phone/wopay/table?type=doing";
    var sec = 4000;
    var btn;
    var html, random, date_now;
    var timer;

    window.wopayFun = function () {
        random = sec + parseInt(Math.random() * 500);
        layer.msg("开始自动获取订单");
        timer = setInterval(function () {
            date_now = new Date();
            receive(3,500,2); // 从左到右，依次为receive(0,100,2)/receive(1,200,2)/receive(2,300,2)/receive(3,500,2)
            var msg = $(".layui-layer-dialog");
            msg.find(".layui-layer-btn0").click();
            console.log(date_now.toLocaleTimeString() + " 获取指令已发送，请留意屏幕提示");
        }, random);
    }

    window.normalFun = function () {
        random = sec + parseInt(Math.random() * 500);
        layer.msg("开始自动获取订单");
        timer = setInterval(function () {
            date_now = new Date();
            fastReceive();
            console.log(date_now.toLocaleTimeString() + " 获取指令已发送，请留意屏幕提示");
        }, random);
    }
    window.stopTimer = function (b = 1) {
        clearInterval(timer);
        if(b == 1) { layer.msg("停止自动获取"); }
    }


    if(url == normal){
        btn = $(".layui-btn-danger");
        html = '<button class="layui-btn layui-btn-sm layui-btn-warm" onclick="normalFun()">自动获取</button><button class="layui-btn layui-btn-sm layui-btn-primary" onclick="stopTimer()">停止自动</button>';
    }else if(url == wopay) {
        btn = $(".layui-btn-lg");
        html = '<button class="layui-btn layui-btn-lg layui-btn-warm" onclick="wopayFun()">自动500</button><button class="layui-btn layui-btn-lg layui-btn-primary" onclick="stopTimer()">停止自动</button>';
    }
    btn.after(html);
    btn.hide();
    stopTimer(0);
    layer.msg("初始化成功");


    // Your code here...
})();

