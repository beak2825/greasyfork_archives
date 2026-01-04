// ==UserScript==
// @name         Bas弹幕实验室
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  就BAS弹幕实验室显示太小了嘛
// @require       http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @author       奎
// @match        *://*
// @match      *://*
// @include        *://*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429719/Bas%E5%BC%B9%E5%B9%95%E5%AE%9E%E9%AA%8C%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/429719/Bas%E5%BC%B9%E5%B9%95%E5%AE%9E%E9%AA%8C%E5%AE%A4.meta.js
// ==/UserScript==





window.onload = function () {
    $('<link rel="stylesheet" href="https://www.layuicdn.com/layui/css/layui.css">').appendTo('head');
    const CONTAINER = document.querySelector('.basContainer');
    if (CONTAINER != null) {
        $('<button id="BUTTON">确定</button>').appendTo('body');
        $('#BUTTON').addClass('layui-btn layui-btn-normal');
        $('#BUTTON').html('点击开启');
        $('#BUTTON').css({
            "position": "absolute",
            "left": 8 + "%",
            "top": 20 + "px",
            "z-index": 99999,
        })
    }else{
        return 0;
    }
    $('#BUTTON').click(function () {
        changeCss();
    });

    function changeCss() {
        addCloseBtn();
        $('header').css('height', 47 + 'px');
        $('#BUTTON').css("top", 5 + 'px')
        $('.basContainer').css({
            "transition": 0.3 + 's',
            "position": "absolute",
            "width": 1600 + 'px',
            "height": 900 + 'px',
            "left": 0,

        })
        $('.el-menu').css({
            "margin-top": -15 + 'px',
            "transition": 0.3 + 's',
        });
        $('.editor').css({
            "z-index": 1,
            "transition": 0.3 + 's',
        })
        $('#BUTTON_close').click(() => {
            START($('#BUTTON_close'));
        })
        $('.el-button').css({
            "transition": 0.3 + 's',
            "right": -100 + 'px',
            "top": -43 + 'px',
            "z-index": 5
        })
        console.log(document.querySelector('#BUTTON_close'));
        return 0;
    }

    function addCloseBtn() {
        $('<button class="layui-btn layui-btn-normal" id="BUTTON_close">收起并运行</button>').appendTo('body');
        $('#BUTTON_close').css({
            "position": "absolute",
            "left": 29 + "%",
            "top": 5 + "px",
            "z-index": 99999,
        })
        return 0;
    }

    function START(e) {
        if (e.html() == '收起并运行') {
            $('.editor').css({
                "height": 0 + '%'
            })
            $('.el-button').click();
            e.html('展开');
            return e;
        }
        if (e.html() != '收起并运行') {
            $('.editor').css({
                "height": 100 + '%'
            })
            e.html('收起并运行')
            return e;
        }
        return 0;
    }
}