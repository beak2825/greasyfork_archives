// ==UserScript==
// @name         AutoClick
// @namespace    http://tampermonkey.net/
// @version      0.4.15
// @description  （づ￣3￣）づ╭❤～
// @author       Tequila
// @match        http://risk.baidu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/392697/AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/392697/AutoClick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    $('.container').append('<button class="bttn" id="bt1">开始</button>');
    $('.container').append('<button class="bttn" id="bt2">暂停</button>');
    $('.container').append('<button class="mybtn" id="bt3"></button>');

    $('.bttn').css({
        "font-size": "8px",
        "border-style": "solid",
        "border-color": "#0000a0",
        "border-width": "1px",
        "width": "20px",
        "height": "40px",
    });
    $('#bt1').css({
        "position": "fixed",
        "right": "0px",
        "top": "160px",
    });
    $('#bt2').css({
        "position": "fixed",
        "right": "0px",
        "top": "200px",
    });
    $('#bt3').css({
        "position": "fixed",
        "right": "0px",
        "top": "140px",
        "width": "20px",
        "height": "20px",
        "background-color": "rgba(45,176,214,1)",
        "border-style": "solid",
        "border-color": "rgba(40,24,109,1)",
        "border-width": "1px",
    });

    $('#bt1').mousedown(function () {
        $('#bt1').css({
            "border-width": "3px"
        });
    });
    $('#bt1').mouseup(function () {
        $('#bt1').css({
            "border-width": "1px"
        });
    });
    $('#bt2').mousedown(function () {
        $('#bt2').css({
            "border-width": "3px"
        });
    });
    $('#bt2').mouseup(function () {
        $('#bt2').css({
            "border-width": "1px"
        });
    });
    $('#bt3').mousedown(function () {
        $('#bt3').css({
            "border-width": "3px",
            "background-color": "rgba(18,253,245,1)",
        });
    });
    $('#bt3').mouseup(function () {
        $('#bt3').css({
            "border-width": "1px",
            "background-color": "rgba(45,176,214,1)",
        });
    });

    $(".bttn").hide();

    $("#bt3").click(function () {
        $("#bt1").fadeToggle();
        $("#bt2").fadeToggle();
        //         $(".bttn").animate({
        //             width:'toggle'
        //         });
    });

    var ran = function GetRandomNum() {
        var Rand = Math.random();
        return (1.5 + Rand);
    };

    var count = 0;

    $('#bt1').click(function () {
        console.log("开始");
        count = setInterval(function () {
            console.clear();
            console.log(Math.round(ran() * 1000) / 1000);
            var j = document.getElementsByClassName("current-done-total")[0].innerHTML;
            // console.log(j);
            if (j == 1500) {
                alert("已完成");
                clearInterval(count);
            } else {
                var g = document.getElementsByClassName("mt-content text")[1].innerHTML;
                var h = document.getElementsByClassName("mt-content text")[2].innerHTML;
                var i = g.split(h);
                if (i.length == 1) {
                    alert("未找到！");
                    clearInterval(count);
                } else {
                    $('.quality-btn.btn-ope.btn-pass').click();
                }
            }
        }, ran() * 1000);
    });

        
        $('#bt2').click(function () {
            clearInterval(count);
            console.log("暂停");
        });
})();