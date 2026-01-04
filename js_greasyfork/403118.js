// ==UserScript==
// @name         分级审核量
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  O(∩_∩)O哈哈~
// @author       tequila
// @match        *.kuaishou.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.bootcss.com/vue/2.6.11/vue.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403118/%E5%88%86%E7%BA%A7%E5%AE%A1%E6%A0%B8%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/403118/%E5%88%86%E7%BA%A7%E5%AE%A1%E6%A0%B8%E9%87%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    $('.no-skin').append('<div id="shu" class="shuliang">数量</div>');
    $('.no-skin').append('<div id="shenheliang" class="shuliang">审核量</div>');
    $('.no-skin').append('<div id="biaoji" class="shuliang">标记量</div>');
    $('.no-skin').append('<div id="biaojilv" class="shuliang">标记率</div>');
    $('.no-skin').append('<button id="btn" class="jy">清除</button>');
    $('.shuliang').css({
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
        "border-radius": "5px"
    })
    $('#shu').css({
        "position": "fixed",
        "right": "0px",
        "top": "450px",
    });
    $('#shenheliang').css({
        "position": "fixed",
        "right": "0px",
        "top": "510px",
    });
    $('#biaoji').css({
        "position": "fixed",
        "right": "0px",
        "top": "490px",
    });
    $('#biaojilv').css({
        "position": "fixed",
        "right": "0px",
        "top": "530px",
    });
    $('.jy').hover(function () {
        // over
        $(this).css({
            backgroundColor: "#01aef8",
            color: "#eeeafd"
        });
    }, function () {
        // out
        $(this).css({
            backgroundColor: "#61e6f5",
            color: "#555758"
        });
    });
    $('.jy').css({
        "height": "20px",
        "width": "30px",
        "backgroundColor": "#61e6f5",
        "color": "#555758",
        "zIndex": "99999",
        "font-size": "10px",
        "text-align": "center",
        "border-style": "solid",
        "border-color": "#181d4b",
        "border-width": "1px",
        "line-height": "20px",
        "outline": "none",
        "border-radius": "5px",
        "padding": "0px",
    });
    $('#btn').css({
        "position": "fixed",
        "right": "0px",
        "top": "650px",
    });


    function setCookie(name, value) {
        $.cookie(name, value, {
            expires: 1,
        });
    };
    function getCookie(name) {
        return $.cookie(name);
    };
    function delCookie(name) {
        $.removeCookie(name);
    };

    var a;
    var b = getCookie('fenjishenheliang');
    var g;
    var h = getCookie('biaojiliang');
    function panduan() {
        if (b != "" && b != null) {
            a = b;
        } else {
            a = 0;
        };
        $('#shenheliang').html(Number(a));
        return a;
    };
    panduan();
    function panduan1() {
        if (h != "" && h != null) {
            g = h;
        } else {
            g = 0;
        };
        $('#biaoji').html(Number(g));
        return g;
    };
    panduan1();

    $('#btn').click(function () {
        delCookie('fenjishenheliang');
        delCookie('biaojiliang');
        a = 0;
        g = 0;
        $('#shenheliang').html(a);
        $('#biaoji').html(g);
    });
    //     var c = document.getElementsByClassName('co-biz-page-master-content-item');
    setInterval(function () {
        $('#shu').html($('.co-biz-page-master-content-item').length)
    }, 200);
    $(document).keydown(function (e) {
        if (e.which == 67 || e.which == 88) {
            var c = document.getElementsByClassName('co-biz-page-master-content-item');
            $('#shenheliang').html(Number(a) + c.length);
            a = Number(a) + c.length;
            //  console.log(a);
            var d = $('.item-message').children();
            //$('.item-message')
            var biaoji = [];
            for (var i = 0; i < d.length; i++) {
                biaoji.push(d[i])
            }
            console.log(biaoji.length)
            $('#biaoji').html(Number(g) + biaoji.length);
            g = Number(g) + biaoji.length;
            var f = g / a * 100;
            $('#biaojilv').html(f.toFixed(2) + '%')
            setCookie('fenjishenheliang', a)
            setCookie('biaojiliang', g)
        }
    })
})();


