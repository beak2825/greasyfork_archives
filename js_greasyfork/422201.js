// ==UserScript==
// @name         湖北交通职业技术学院[教务版]
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  湖北交通评教自动选择最大分值，自动填写评语
// @author       kingforkill
// @match        http://jw3.hbctc.edu.cn/jwglxt/xspjgl/*
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422201/%E6%B9%96%E5%8C%97%E4%BA%A4%E9%80%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%5B%E6%95%99%E5%8A%A1%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/422201/%E6%B9%96%E5%8C%97%E4%BA%A4%E9%80%9A%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%5B%E6%95%99%E5%8A%A1%E7%89%88%5D.meta.js
// ==/UserScript==


var COMMENT="充分的备课，流利的语言和清晰的思维。 准时到达教室，准时上课和下课，没有旷课和旷课的情况。 在教学过程中要注意个人形象，言语优美，表达清晰，易于理解，讲话速度适中，自然表达和亲和力。 课堂老师能够控制和组织课堂纪律。 教学态度认真，讲课内容正确。 教学内容连贯，严谨，科学。 各种方法和技巧以及师生之间的双边交流使学习气氛十分活跃。";

function Fill_it() {
  var m_xb = "<div href='javascript:void(0)' id='box' style='cursor:pointer;z-index:98;display:block;width:100px;height:500px;line-height:30px;position:fixed;left:0;top:200px;text-size:15px;text-align:center;overflow:visible'> <style>a{font-size:16px;text-decoration:none;}a:hover {color:red;text-decoration:none}</style><a id='s1'>插入</a></div>";
    $("body").append(m_xb);
    $("#s1").click(kkk);
}
function kkk() {
    var option_list = $(".form-group");
    for (var i = 0; i < option_list.length; i++) {
        var btn = $(option_list[i]).find(".radio-pjf")[0];
        $(btn).trigger("click");
    }
    var textbox_list = $(".form-control");
    for (var i = 0; i < textbox_list.length; i++) {
        $(textbox_list[i]).val(COMMENT).trigger('change');
    }
}
(function () {
    'use strict';
    window.onload = window.setTimeout(Fill_it, 2000);
})();