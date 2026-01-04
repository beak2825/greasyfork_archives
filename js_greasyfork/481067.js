// ==UserScript==
// @name         职称评审小组评议自动输入
// @namespace    http://nbeea.net/
// @version      0.5
// @description  职称评审小组评议环节中，组员、组长设置评议结果“重点推荐”、“一般推荐”、“不推荐”时，根据点击的选择，自动在评语栏中输入评语。
// @author       邱鸿翔
// @match        https://zcps.rlsbt.zj.gov.cn/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/481067/%E8%81%8C%E7%A7%B0%E8%AF%84%E5%AE%A1%E5%B0%8F%E7%BB%84%E8%AF%84%E8%AE%AE%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/481067/%E8%81%8C%E7%A7%B0%E8%AF%84%E5%AE%A1%E5%B0%8F%E7%BB%84%E8%AF%84%E8%AE%AE%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).on("click","#column23_1",function (){
        $("#column19").text("AAA组长候选人是")
    })
    $(document).on("click","#column23_2",function (){
        $("#column19").text("BBB组长候选人否")
    })

    // Your code here...
})();

$(document).ready(function () {

    $("input[name='t61column9'][value='0']").closest("label").click(function() {
        $("#t61column10").val("符合");
    });
    $("input[name='t61column9'][value='1']").closest("label").click(function() {
        $("#t61column10").val("基本符合");
    });
    $("input[name='t61column9'][value='2']").closest("label").click(function() {
        $("#t61column10").val("不符合");
    });

});