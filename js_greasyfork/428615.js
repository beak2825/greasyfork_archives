// ==UserScript==
// @name 新版正方教务学生评价（长大可用）
// @namespace http://tampermonkey.net/
// @version 1.2
// @description 支援新版正方教务系统，一键自动评价，一键算学分。食用方法见下。
// @author lafish
// @supportURL https://lafish.fun/
// @compatible chrome
// @compatible firefox
// @license MIT
// @match           http://jwxt.jwc.ccsu.cn/*
// @include *://*.edu.cn/*
// @run-at document-start
// @require https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428615/%E6%96%B0%E7%89%88%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%EF%BC%88%E9%95%BF%E5%A4%A7%E5%8F%AF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/428615/%E6%96%B0%E7%89%88%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%EF%BC%88%E9%95%BF%E5%A4%A7%E5%8F%AF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

var StudentEvalutionURL = "xspjgl/xspj_cxXspjIndex.html"; // 学生评教页面
var StudentPersonURL = "index_initMenu.html"; // 学生个人信息页面
var StudentLoginURL = "login_slogin.html"; // 学生登入页面
var zhh = '';
var mma = '';

(function () {
    'use strict';

    function getRandom(min, max) {
        var r = Math.random() * (max - min);
        var re = Math.round(r + min);
        re = Math.max(Math.min(re, max), min);
        return re;
    }

    var windowURL = window.location.href;
    if (windowURL.indexOf(StudentLoginURL) != -1) {
        if (zhh) {
            $(function () {
                $('#yhm').val(zhh);
                $('#mm').val(mma);
            });
        }
    }
    var windowURL = window.location.href;
    if (windowURL.indexOf(StudentEvalutionURL) != -1) {
        $(document).keydown(function (event) {
            if (event.keyCode == 13) { //13：enter键
                var SelectionOfALl = document.getElementsByClassName("radio-pjf");
                var num = SelectionOfALl.length;
                for (var i = 0; i < num; i++) //默认五星好评
                {
                    if (i % 5 == 0) {
                        var Select = SelectionOfALl[i];
                        Select.checked = true;
                    }
                }
                SelectionOfALl[getRandom(0, num / 5) * 5 + 1].checked = true; //随机差评
                var button1 = document.getElementById("btn_xspj_bc"); //寻找保存按钮的Id来触发事件
                button1.click();
            }
        });
    }
    if (windowURL.indexOf(StudentPersonURL) != -1) {
        $(document).keydown(function (event) {
            if (event.keyCode == 187) { //187：=键
                if ($("#content_xsxxgl_xsxkxx .ui-pg-selbox").val() != 5000) {
                    alert('1.点击\'选课信息\'页面\n2.选择学年学期\n3.每页显示条目(' + $(".ui-pg-selbox").val() + ')调整为5000\n完成后再次按下 = 键');
                } else {
                    $(".ui-jqgrid-bdiv").height('auto');
                    var len_xf = $('td[aria-describedby="ckXkTabGrid_xf"]').length;
                    var sum_xf = 0;
                    for (var i = 0; i < len_xf; i++) {
                        sum_xf += Number($('td[aria-describedby="ckXkTabGrid_xf"]').eq(i).attr('title'));
                    }
                    alert('选课信息页面中学分总和为【 ' + sum_xf + ' 】分');
                }
            }
        });
    }
})();