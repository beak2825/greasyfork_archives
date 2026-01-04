// ==UserScript==
// @name         高亮2
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  高亮并复制脚本
// @author       Tequila
// @match        http://risk.baidu.com/mark/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @note         v0.9 添加保存按钮点击效果
// @note         v0.8 添加第一次执行颜色
// @note         v0.7 修复bug
// @note         v0.6 修复bug
// @note         v0.5 2019-11-18 - 保存颜色到cookie
// @note         v0.4 2019-11-18 - 自动高亮复制 添加颜色选择
// @note         v0.3 2019-11-18 - 点击高亮并复制
// @note         v0.2 2019-11-18 - 自动高亮并复制
// @downloadURL https://update.greasyfork.org/scripts/392526/%E9%AB%98%E4%BA%AE2.user.js
// @updateURL https://update.greasyfork.org/scripts/392526/%E9%AB%98%E4%BA%AE2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //设置cookie函数
    function setCookie() {
        var v = ys();
        var d = new Date();
        d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = 'yjse=' + v + ';expires=' + expires;
    };

    //获取cookie函数
    function getCookie() {
        var name = 'yjse' + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };

    //删除cookie函数
    function delCookie() {
        document.cookie = "yjse=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    };

    $('.container').append('<input type="color" id="cho"> '); //创建颜色选择器
    $('.container').append('<button id="btn">保存</button>'); //创建保存按钮

    //设置颜色选择器CSS属性
    $('#cho').css({
        "position": "fixed",
        "top": "0px",
        "left": "270px",
    });

    //设置保存按钮CSS属性
    $('#btn').css({
        "position": "fixed",
        "top": "30px",
        "left": "270px",
        "font-size": "12px",
        "border-style": "solid",
        "border-color": "#0080c0",
        "border-width": "2px",
        "width": "40px",
        "height": "25px",
        "backgroundColor:": "rgba(170,175,170,1)"
    });

    $('#btn').mousedown(function () { 
        $('#btn').css({"border-width":"5px"})
    });
    $('#btn').mouseup(function () { 
        $('#btn').css({"border-width":"2px"})
    });

    var coo = getCookie(); //获取颜色cookie
    //判断cookie设置颜色
    function cooKie() {
        if (coo != "" && coo != null) {
            $('#cho').val(coo);
        } else {
            $('#cho').val("#00ff00");
        }
    };
    cooKie();

    var ip = $('#cho')[0];

    //颜色数值函数
    function ys() {
        return ip.value;
    };

    //复制内容函数
    function Cp(text) {
        let ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
    };

    //200毫秒运行一次高亮并复制
    setInterval(function () {
        try {
            var a = document.getElementsByClassName("mt-content text")[1];
            var b = document.getElementsByClassName("mt-content text")[2];
            var e = a.innerHTML;
            var c = b.innerHTML;
            var values = e.split(c);
            a.innerHTML = values.join('<span class="glys">' + c + '</span>');
            var p = ys();
            $('.glys').css({
                "background": p,
            })
            Cp(c);
        } catch (error) {
            
        }
    }, 200);

    //点击保存颜色cookie
    $('#btn').click(function () {
        delCookie();
        setCookie();
    });
})();