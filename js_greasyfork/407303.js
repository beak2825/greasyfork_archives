// ==UserScript==
// @name KKKK动漫左右按键翻页
// @namespace leonhcg
// @version      0.1.4
// @description  使用键盘左右键翻页
// @match *://*.ikkdm.com/*
// @match *://*.kukudm.com/*
// @match *://*.kkkkdm.com/*
// @match *://*.kukukkk.com/*
// @match *://*.ikukudm.com/*
// @match *://*.ikuku.*/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/407303/KKKK%E5%8A%A8%E6%BC%AB%E5%B7%A6%E5%8F%B3%E6%8C%89%E9%94%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/407303/KKKK%E5%8A%A8%E6%BC%AB%E5%B7%A6%E5%8F%B3%E6%8C%89%E9%94%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

$(function () {
    var txt1 = $("tbody").text();
    var re_1 = /共([0-9]{1,3})页 \| 当前第([0-9]{1,3})页/;
    var r_tmp = txt1.match(re_1);
    var v1_tmp = parseInt(r_tmp[1]);
    var v2_tmp = parseInt(r_tmp[2]);
    $(document).keydown(function (event) {
        var n = 0;
        //判断当event.keyCode 为37时（即左方面键），执行函数to_left();
        //判断当event.keyCode 为39时（即右方面键），执行函数to_right();
        if (event.keyCode === 37 && v2_tmp > 1) {
            //console.log('按下了左方向键');
            n = v2_tmp - 1;
            window.location.href = '' + n + '.htm';
        } else if (event.keyCode === 39 && v1_tmp > v2_tmp) {
            //console.log('按下了右方向键');
            n = v2_tmp + 1;
            window.location.href = '' + n + '.htm';
        }
    });
})();

