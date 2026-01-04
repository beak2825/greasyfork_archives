// ==UserScript==
// @name         杭电自动评价插件
// @namespace    https://gitee.com/erike77/
// @version      1.3.0
// @description  杭电的自动学评教系统，需要配合屏蔽alert插件同时使用
// @author       Particle_G
// @match        *://jxgl.hdu.edu.cn/xs_main.aspx?xh=*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393610/%E6%9D%AD%E7%94%B5%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/393610/%E6%9D%AD%E7%94%B5%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var js_searchAndSelect_html = '<script type="text/javascript">var repeatTimer;var lastOne = false;\
    function repeatFunc(){\
    if($("#iframeautoheight").contents().find("select[id*=\'ctl02\']").length == 0){window.original_alert("请先进入评价界面再点击自动评价！");return;}\
    repeatTimer=window.setInterval(searchAndSelect,2000);}\
    function searchAndSelect(){\
    if(lastOne){console.log("Ended.");$("#iframeautoheight").contents().find("#Button2").click();clearInterval(repeatTimer);window.original_alert("自动评价已完成！");return;}\
    if($("#iframeautoheight").contents().find("#pjkc").find("option:last")[0].selected){\
    lastOne=true;\
    $("#iframeautoheight").contents().find("select").val("A（非常满意）");\
    $("#iframeautoheight").contents().find("select[id*=\'ctl02\']").val("B（满意）");\
    $("#iframeautoheight").contents().find("#Button1").click();\
    return;\
    }\
    $("#iframeautoheight").contents().find("select").val("A（非常满意）");\
    $("#iframeautoheight").contents().find("select[id*=\'ctl02\']").val("B（满意）");\
    $("#iframeautoheight").contents().find("#Button1").click();\
    };</script>';
    var sleep_script = '<script type="text/javascript">function sleep(delay){var start=(new Date()).getTime();while((new Date()).getTime()-start<delay){continue}};</script>';
    var jquery_script = '<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>';
    $("head").append(jquery_script);
    $("head").append(sleep_script);
    $("head").append(js_searchAndSelect_html);
    var start_button_html = '<li class="top"><a class="top_link" href = "javascript:void(0);" onclick ="repeatFunc()"><span class="">自动评价</span></a></li>';
    $(".nav").append(start_button_html);
})();