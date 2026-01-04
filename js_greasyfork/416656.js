// ==UserScript==
// @name         小花仙 快捷放大缩小
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  对小花仙官网游戏页面新增了快捷的放大缩小的按钮，不需要再用右键菜单慢慢点了。点击放大缩小按钮即可对游戏画面放大缩小。但是移动视野需要从面板的文本框开始拖动，这点需要注意。暂不支持输入放大倍率。
// @license      BSD-3-Clause
// @author       别问我是谁请叫我雷锋
// @match        http://hua.61.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416656/%E5%B0%8F%E8%8A%B1%E4%BB%99%20%E5%BF%AB%E6%8D%B7%E6%94%BE%E5%A4%A7%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/416656/%E5%B0%8F%E8%8A%B1%E4%BB%99%20%E5%BF%AB%E6%8D%B7%E6%94%BE%E5%A4%A7%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#gamehead").after('<div class="age-hint" style="height: 100px;">放大<input type="number" readonly id="scale" style="width: 50px;"><span>%</span><button id="zoomin">&nbsp;＋&nbsp;</button><button id="zoomout">&nbsp;－&nbsp;</button><br><button style="font-family: \'simsun\'" id=\'panUp\'>↑</button><br><button style="font-family: \'simsun\'" id=\'panLeft\'">←</button><button style="font-family: \'simsun\'" id=\'panBottom\'>↓</button><button style="font-family: \'simsun\'" id=\'panRight\'>→</button></div>');
    $("#scale").val(100);


    $("#zoomin").click(() => {
        var prevVal = $("#scale").val();
        if (prevVal <= 100) {
            prevVal = 100;
        }
        $("#scale").val($("#scale").val() * 2);
        console.log(prevVal / $("#scale").val() * 100);
        $("#gamehead").find("embed")[0].Zoom(prevVal / $("#scale").val() * 100)

    });

    $("#zoomout").click(() => {
        var prevVal = $("#scale").val();
        $("#scale").val($("#scale").val() / 2);
        console.log(prevVal / $("#scale").val() * 100);
        $("#gamehead").find("embed")[0].Zoom(prevVal / $("#scale").val() * 100)
    });

    $("#panUp").click(() => {
        $("#gamehead").find("embed")[0].Pan(0, -100, 1);
    });

    $("#panBottom").click(() => {
        $("#gamehead").find("embed")[0].Pan(0, 100, 1);
    });

    $("#panLeft").click(() => {
        $("#gamehead").find("embed")[0].Pan(-100, 0, 1);
    });

    $("#panRight").click(() => {
        $("#gamehead").find("embed")[0].Pan(100, 0, 1);
    });
    // Your code here...
})();