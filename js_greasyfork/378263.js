// ==UserScript==
// @name         苏宁秒杀助手 Tony
// @namespace    https://www.abmbio.xin/
// @version      1.4
// @description  苏宁秒杀助手,秒杀产品购买助手
// @author       Tony Liu
// @include      http*://product.suning.com/*
// @include      http*://shopping.suning.com/*
// @grant        none
// @icon         https://www.abmbio.xin/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/378263/%E8%8B%8F%E5%AE%81%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B%20Tony.user.js
// @updateURL https://update.greasyfork.org/scripts/378263/%E8%8B%8F%E5%AE%81%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B%20Tony.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var TonyGetCoupon = TonyGetCoupon || {};
    var tonyToolVersion = "1.4";
    TonyGetCoupon.getTime = function(day) {
        if (day != null && day != "") {
            var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
            return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime()
        } else {
            return "0000"
        }
    };
    TonyGetCoupon.InitBox = function() {
        console.log("%c Tony Blog %c","background:#f26522; color:#ffffff","","https://www.abmbio.xin");
        console.log("%c  薅羊毛    %c","background:#f26522; color:#ffffff","","http://bbs.abmbio.xin");
        //var timeStart = TonyGetCoupon.format(new Date(), "yyyy-mm-dd HH") + ":59:59";
        var timeStart = TonyGetCoupon.formatO(new Date(), "yyyy-mm-dd HH") + ":00:00";
        if(window.location.origin == "https://product.suning.com" || window.location.origin == "http://product.suning.com"){
            $('#J-TZM').append('<dl><dt>&nbsp;</dt><dd><span><a href="https://www.abmbio.xin" target="_blank" style="color: #2272c8;font-size: 2em;font-weight: bold;">苏宁秒杀助手 V'+tonyToolVersion+' By Tony</a></span></dd></dl><dl><dt>&nbsp;</dt><dd><span><a href="http://bbs.abmbio.xin" target="_blank" style="color: red;font-size: 1.3em;font-weight: bold;">最新线报</a></span>|<span><a href="https://shang.qq.com/wpa/qunwpa?idkey=2e679f28d4a9694a8583fcf83d5566f2af3ecf68dff44c66f6a369baab7ead4a" target="_blank" style="color: red;font-size: 1.3em;font-weight: bold;">加入Q群</a></span>|<span style="color: red;font-size: 1em;font-weight: bold;">Powered By <a href="https://greasyfork.org/zh-CN/users/210097-tonyboy" target="_blank" style="color: red;font-size: 1em;font-weight: bold;">www.abmbio.xin</a></span><br><img src="https://www.abmbio.xin/uploads/images/other/tony-blog-qrcode.jpg"/></dd></dl><dl><dt>&nbsp;</dt><dd><a style="padding:5px 28px;background:blue;color:#fff;cursor:pointer;font-size:1.5em" id="TonyStart">开始倒计时</a><dd></dl><dl><dt>口令</dt><dd><input id="tonyKeyCode" type="password" style="width:80px;"/><span>公众号发送关键词【<strong>苏宁秒杀助手</strong>】获取</span></dd></dl><dl><dt>开始时间</dt><dd><input id="tonyStartTime" style="width:180px;"/>&nbsp;&nbsp;&nbsp;&nbsp;提前<input type="number" id="tonyBeforeTime" style="width:35px;" value="100"/>ms</dd></dl><dl><dt>日志</dt><dd><textarea id="tonyTellYou" style="width:300px;" rows="5"></textarea></dd></dl>');
            var uselink = $('#goToUseBtn>a').attr('href');
            $('#tonyStartTime').val(timeStart);
        }

        var _hmt = _hmt || [];
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?7f9964d6e2815216bcb376aa3325f971";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    };
    TonyGetCoupon.letTonyByGood = function () {
        if(window.location.origin == "https://shopping.suning.com" || window.location.origin == "http://shopping.suning.com"){
            $('#submit-btn').click();
        }
    }
    TonyGetCoupon.format = function (date, str) {
        var mat = {};
        mat.M = date.getMonth() + 1; //月份记得加1
        mat.H = date.getHours();
        mat.s = date.getSeconds();
        mat.m = date.getMinutes();
        mat.Y = date.getFullYear();
        mat.D = date.getDate();
        mat.d = date.getDay(); //星期几
        mat.d = check(mat.d);
        mat.H = check(mat.H);
        mat.M = check(mat.M);
        mat.D = check(mat.D);
        mat.s = check(mat.s);
        mat.m = check(mat.m);
        console.log(typeof mat.D);
        if (str.indexOf(":") > -1) {
            mat.Y = mat.Y.toString().substr(2, 2);
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H;
        }
        if (str.indexOf("/") > -1) {
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H;
        }
        if (str.indexOf("-") > -1) {
            return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H;
        }

        function check(str) {
            str = str.toString();
            if (str.length < 2) {
                str = '0' + str;
            }
            return str;
        }
    };
    TonyGetCoupon.formatO = function (date, str) {
        var mat = {};
        mat.M = date.getMonth() + 1; //月份记得加1
        mat.H = date.getHours() + 1;
        mat.s = date.getSeconds();
        mat.m = date.getMinutes();
        mat.Y = date.getFullYear();
        mat.D = date.getDate();
        mat.d = date.getDay(); //星期几
        mat.d = check(mat.d);
        mat.H = check(mat.H);
        mat.M = check(mat.M);
        mat.D = check(mat.D);
        mat.s = check(mat.s);
        mat.m = check(mat.m);
        console.log(typeof mat.D);
        if (str.indexOf(":") > -1) {
            mat.Y = mat.Y.toString().substr(2, 2);
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H;
        }
        if (str.indexOf("/") > -1) {
            return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H;
        }
        if (str.indexOf("-") > -1) {
            return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H;
        }

        function check(str) {
            str = str.toString();
            if (str.length < 2) {
                str = '0' + str;
            }
            return str;
        }
    };
    TonyGetCoupon.miaocountDownStart = function () {
        // var obj = $('.time-block');
        var beforeSeconds = $('#tonyBeforeTime').val();
        var Tonytimer,
            newTime = new Date().getTime(),
            attrNow,
            attrEnd = $('#tonyStartTime').val(),
            end = TonyGetCoupon.getTime(attrEnd);
            end = end - beforeSeconds;
        console.log(end);
        $('#tonyTellYou').val($('#tonyTellYou').val()+'\n'+'倒计时开始，开始时间：'+attrEnd);
        $.ajax({
            type: "get",
            url: "https://quan.suning.com/getSysTime.do",
            success: function(data) {
                var systime = eval("(" + data + ")");
                var now = systime.sysTime2;
                now = TonyGetCoupon.getTime(now);
                $('#tonyTellYou').val($('#tonyTellYou').val()+'\n'+'获取服务器时间成功：'+now);
                if($('#tonyKeyCode').val() == 'Tony2019'){countDown(now);}else{alert('口令不正确，请先输入口令');}
            }
        });
        function countDown(now) {
            var endDate = end,
                leftTime = endDate - parseFloat((now + new Date().getTime() - newTime) / 1000).toFixed(1) * 1000,
                leftSecond = parseFloat(leftTime / 1000),
                days = Math.floor(leftSecond / 24 / 3600),
                hour = Math.floor(leftSecond / 3600 % 24),
                minute = Math.floor(leftSecond / 60 % 60),
                second = (leftSecond % 60).toFixed(1),
                hour_end = hour + days * 24;
            if(leftTime < 0){
                $('#TonyStart').html(0+"时"+0+"分"+0+"秒");
                Tonytimer = setTimeout(function () {
                    countDown(now);
                }, 100);
                $('#tonyTellYou').val($('#tonyTellYou').val()+'\n'+'执行中。。。');
                Cart.buyNowTime();
                clearTimeout(Tonytimer);
            }else{
                $('#TonyStart').html(hour+"时"+minute+"分"+second+"秒");
                Tonytimer = setTimeout(function () {
                    countDown(now);
                }, 100);
            }

        }
    }
    TonyGetCoupon.InitBox();
    TonyGetCoupon.letTonyByGood();
    $('#TonyStart').click(function () {
        if($('#tonyKeyCode').val() == 'Tony2019'){
            TonyGetCoupon.miaocountDownStart();
        }else{
            alert('口令不正确，请先输入口令');
        }
    });
})();