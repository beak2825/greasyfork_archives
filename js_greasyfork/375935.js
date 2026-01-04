// ==UserScript==
// @name         wenqu dashboard
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://msa.baidu.com/realtime/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375935/wenqu%20dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/375935/wenqu%20dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        var onlyWenqu='<div class="btn btn-primary btn-sm" id="only-wenqu" style="position:absolute;right:150px;"><span style="color:#FFFFFF" class="wenqu-button">wenqu</span></div>'
        $(".illustrate").parent().before(onlyWenqu);
        $("#only-wenqu").click(function(){
            // 点击两次展开全部
            $(".dynatree-has-children:not(.dynatree-expanded) .dynatree-expander").click();
            $(".dynatree-has-children:not(.dynatree-expanded) .dynatree-expander").click();
            // 所有的li隐藏
            $(".dynatree-title").closest("li").css("display", "none");
            // 显示需要的
            $(".dynatree-title").filter(function() {return $(this).text() == "凤巢整体";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线凤巢";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线网页";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线上方";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线混排";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线混排_第三位";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线自主混排-众秀";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线联盟混排-众秀";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线自主上方";}).closest("li").css("display","");
            $(".dynatree-title").filter(function() {return $(this).text() == "无线联盟上方";}).closest("li").css("display","");
            $(".dynatree-title:contains('文曲')").closest("li").css("display","");
            $("[title='586']").closest("li").css("display","");
            $("[title='587']").closest("li").css("display","");
            $(".dynatree-title:contains('文曲')").closest("li").css("display","");

            // 更改文案
            $("[title='750']").text("750-原生");
            $("[title='751']").text("751-列表页明投");
            $("[title='752']").text("752-前置明投");

        });

    })

})();