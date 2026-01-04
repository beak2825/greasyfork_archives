// ==UserScript==
// @name         河南电子科技大学评教mycos
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  河南电子科技大学评教：自动选择第一个选项，自动填写评语
// @author       zushng
// @match        https://zut.mycospxk.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482887/%E6%B2%B3%E5%8D%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99mycos.user.js
// @updateURL https://update.greasyfork.org/scripts/482887/%E6%B2%B3%E5%8D%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99mycos.meta.js
// ==/UserScript==

var COMMENT="我对本课程非常满意。";

function Fill_it() {
    var checkbox_list = $(".ant-radio-group"); //单选框
    for (var i = 0; i < checkbox_list.length; i++) {
        var lists = checkbox_list[i].children;
        var mxbtn = $(checkbox_list[i]).find(".ant-radio-input")[0];//[]内数字对应第几个选项 -1 代表最后一项
        $(mxbtn).trigger("click"); //选择最大分值
    }

    checkbox_list = $(".ant-checkbox-group"); //多选框
    for (var i = 0; i < checkbox_list.length; i++) {
        var lists = checkbox_list[i].children;
        for (var j = 0;j<lists.length;j++){
            var btn = $(checkbox_list[i]).find(".ant-checkbox-input")[j];
            $(btn).trigger("click"); //选择所有多选框
        }
    }
    var textbox_list = $(".ant-input");
    for (var i = 0; i < textbox_list.length; i++) {
        $(textbox_list[i]).trigger('click');
        $(textbox_list[i]).val(COMMENT).trigger('change');
    }
}
(function () {
    'use strict';
    window.onload = window.setTimeout(Fill_it, 2000);
})();