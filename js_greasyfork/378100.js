// ==UserScript==
// @name         Seckill
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  try to take over the world!
// @author       OrzPiggy
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      http://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// @match        https://h5.m.taobao.com/cart/order.html*
// @match        https://h5.m.taobao.com/mlapp/cart.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378100/Seckill.user.js
// @updateURL https://update.greasyfork.org/scripts/378100/Seckill.meta.js
// ==/UserScript==

var initsdtime_int = 0;
var d8;
var starttime;
var endtime;
var bwtime =100;
var IsRob = $.cookie('IsRob') === "true" ? true : false;

function syncTime()
{
    d8 = new Date();
    d8.setTime($.cookie("d8time"));//读取抢拍时间

    starttime = new Date().getTime();
    $.ajax({
        url: "https://t.alicdn.com/t/gettime",
        async: false,
        success: function (result)
        {
            endtime = new Date().getTime();
            console.log("耗时" + (endtime - starttime));
            console.log("结束获取时间" + new Date().getTime());
            //服务器时间
            var sd = new Date();
            sd.setTime(result.time * 1000);
            console.log("时间:" + sd.toLocaleString());
            console.log("d8时间:" + d8.toLocaleString());
            var ttx = d8 - sd;
            console.log("ttx:" + ttx);
            $.cookie('IsRob', true, { expires: 7 ,path: '/'});
            if (ttx < 0)//已过
            {
                alert("时间已过");
                $.cookie('IsRob', false, { expires: 7,path: '/' });
                location.replace(location.href);
            }
            else if (ttx > 60 * 1000 * 10){//10分钟才同步
                console.log("距离开始抢拍还要一段时间");
                setTimeout(() => {
                    location.replace(location.href);
                }, 60 * 1000);}
            else if (ttx > 0) {
                if (initsdtime_int == 0) {
                    initsdtime_int = parseInt(result.time);}

                if (parseInt(result.time) == (initsdtime_int + 1)) {
                    console.log("同步时间完成");

                    sd.setTime(result.time * 1000 + endtime - starttime + bwtime);

                    window.setTimeout(function (){
                        // alert("时间到");
                        console.log("时间到");
                        location.replace(location.href);
                        $('div.ft-cb p label').click();
                        $('div.footer.f-fx.toolbar-footer div.btn').click();
                    }, d8 - sd);
                }
                else {
                    setTimeout(() => {
                        syncTime();
                    }, 20);
                }
            }
        },
        dataType: "jsonp"
    });
}

if (window.location.href.includes('order.html')){
    window.setTimeout(function () {
            $('div.cell.fixed.action').click();
            window.setInterval(function () {
                $('div.cell.fixed.action').click();}, 0);}, 5);}

(function() {
    'use strict';
    var elem = 'div.qx';
    if (IsRob) {
        $(elem).after("<button class=\"btn\" id=\"startRob\" > 抢拍中... <botton>");}
    else {
        $(elem).after("<button class=\"btn\" id=\"startRob\"> 开抢 <botton>");}
    if ($.cookie('robtime')) {
        $(elem).after("<input id=\"Robtime\" class=\"hj\" style='width:70px' value=\"" + $.cookie('robtime') + "\"  type=\"text\"  ></input>");}
    else {
        $(elem).after("<input id=\"Robtime\" class=\"hj\" value=\"00:00:00\" style='width:70px'  type=\"text\"  ></input>");}

    $(elem).after("<label class=\"major\"style='color:red' >开始时间(点击修改)</label>");
    $("#startRob").click(function (){
        if (IsRob) {
            IsRob = false;
            $.cookie('IsRob', false, { expires: 7 ,path: '/'});
            $("#startRob").text("开始抢拍");}
        else {
            let d = new Date();
            d8 = new Date();
            var timestr = $("#Robtime").val();

            var tts = timestr.split(":");
            console.log(timestr);
            if (tts.length != 3) {
                alert("输入的时间有误 参考: 20:00:00  ");
                return;}

            d8.setHours(parseInt(tts[0]));
            d8.setMinutes(parseInt(tts[1]));
            d8.setSeconds(parseInt(tts[2]));

            let ttx = d8 - d;
            if (ttx < 0){//已过10s
                d8.setTime(d8.getTime() + 24 * 60 * 60 * 1000);}
            console.log("抢拍时间:" + d8.toLocaleString());
            $.cookie('d8time', d8.getTime(), { expires: 7 });
            IsRob = true;
            $.cookie('robtime', $("#Robtime").val(), { expires: 7 });
            $.cookie('IsRob', true, { expires: 7,path: '/' });
            $("#startRob").text("抢拍中...");
            syncTime();
        }});
})();