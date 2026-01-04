// ==UserScript==
// @name         审核量
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       tequila
// @match        https://admin.p5.adm-corp.kuaishou.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398020/%E5%AE%A1%E6%A0%B8%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/398020/%E5%AE%A1%E6%A0%B8%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('.no-skin').append('<div id="shenheliang">审核量</div>');
    $('.no-skin').append('<button id="btn">清除</button>');
    $('#shenheliang').css({
        "position": "fixed",
        "right": "0px",
        "top": "500px",
        "height": "20px",
        "width": "45px",
        "backgroundColor": "#1e2836",
        "color": "#82adeb",
        "zIndex": "99999",
        "font-size": "12px",
        "text-align": "center",
        "border-style": "solid",
        "border-color": "#181d4b",
        "border-width": "1px",
        "line-height": "20px",
        "border-radius":"5px"
    });
    $('#btn').css({
        "position": "fixed",
        "right": "0px",
        "top": "550px",
        "height": "20px",
        "width": "45px",
        "backgroundColor": "#61e6f5",
        "color": "#555758",
        "zIndex": "99999",
        "font-size": "12px",
        "text-align": "center",
        "border-style": "solid",
        "border-color": "#181d4b",
        "border-width": "1px",
        "line-height": "20px",
        "outline":"none",
        "border-radius":"5px"
    })

    function setCookie(num) {
        $.cookie('shl', num, {
            expires: 1,
            //            path: "/"
        })
    };

    function getCookie() {
        return $.cookie('shl')
    };

    function delCookie() {
        //        $.Cookie('shl', null, {
        //            expires: -1,
        //            path: "/"
        //        })
        $.removeCookie('shl');
    };
    var c;
    var d = getCookie();

    function panDuan() {
        if (d != "" && d != null) {
            c = d;
        } else {
            c = 0;
        };
        return c;
    };
    panDuan();
    $('#btn').click(function () {
        delCookie();
        c = 0;
        $('#shenheliang').html(c);
    });
    $('#btn').mousedown(function () {
        $('#btn').css({
            "position": "fixed",
            "right": "0px",
            "top": "550px",
            "height": "20px",
            "width": "45px",
            "backgroundColor": "#27638a",
            "color": "#cbdbe2",
            "zIndex": "99999",
            "font-size": "12px",
            "text-align": "center",
            "border-style": "solid",
            "border-color": "#181d4b",
            "border-width": "1px",
            "line-height": "20px",
            "outline":"none",
            "border-radius":"5px"
        });
    });
    $('#btn').mouseup(function () {
        $('#btn').css({
            "position": "fixed",
            "right": "0px",
            "top": "550px",
            "height": "20px",
            "width": "45px",
            "backgroundColor": "#61e6f5",
            "color": "#555758",
            "zIndex": "99999",
            "font-size": "12px",
            "text-align": "center",
            "border-style": "solid",
            "border-color": "#181d4b",
            "border-width": "1px",
            "line-height": "20px",
            "outline":"none",
            "border-radius":"5px"
        });
    });
    function tm() {
        var date = new Date();
        var year = date.getFullYear(); //获取当前年份
        var month = date.getMonth() + 1; //获取当前月份
        var dat = date.getDate(); //获取当前日
        var day = date.getDay(); //获取当前星期几
        var hour = date.getHours(); //获取小时
        var minutes = date.getMinutes(); //获取分钟
        var second = date.getSeconds(); //获取秒
        console.log(year + '年' + month + '月' + dat + '日' + ' ' + '星期' + day + ' ' + hour + ':' + minutes + ':' + second);

    }
    var b = document.getElementById('shenheliang');
    $(document).keydown(function (e) {
        //console.log(e.which)
        if (e.which == 67 || e.which == 88) {
            var a = document.getElementsByClassName('co-biz-page-master-content-item');
            $('#shenheliang').html(Number(c) + a.length);
            c = Number(c) + a.length;
            delCookie();
            setCookie(c);
            console.log('*************************');
            tm();
        }
    });
})();