// ==UserScript==
// @name         时间加速
// @namespace    http://el-bjce.bjdj.gov.cn/
// @version      0.1
// @description  增加学习时间加速按钮
// @author       You
// @match        *://el-bjce.bjdj.gov.cn/*
// @icon         http://bjce.bjdj.gov.cn/dist/static/image/index/ico.ico
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448163/%E6%97%B6%E9%97%B4%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/448163/%E6%97%B6%E9%97%B4%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function() {
   
    var faster = function(step){
        $.data($('#countTime')[0],"timer").current +=step;
        // 提交
        exitPlayerShellActionForm();
        GM_log('加速'+step+'秒');
    };
    GM_log('开始加速');

    $(".coursewareBottomContent").append('<input id = "ffff1" type="submit" value="加速60秒" />');
    $(".coursewareBottomContent").append('<input id = "ffff2" type="submit" value="加速120秒" />');
    $(".coursewareBottomContent").append('<input id = "ffff3" type="submit" value="加速180秒" />');

    $("#ffff1").click(function(){ faster(60);});
    $("#ffff2").click(function(){ faster(120);});
    $("#ffff3").click(function(){ faster(180);});
})();