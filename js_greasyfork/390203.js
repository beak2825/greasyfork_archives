// ==UserScript==
// @name         BUPTNU
// @namespace    greasyfork.org
// @version      3.1
// @description  优化学习页面
// @author       codrwu
// @match        http://jx2.buptnu.com.cn/portal/tool/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @icon         http://jw.buptnu.com.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/390203/BUPTNU.user.js
// @updateURL https://update.greasyfork.org/scripts/390203/BUPTNU.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        // 导学页面,自动进入第一节学习页面
        clickLink('viewmoduleStudentform:tablesec:0:viewSectionEditor');
    } catch(e) {
        console.log("非导学页面");
    }
    try {
        var watchMin = sectionIDidd.split(".")[0];
        // var watchSec = Math.round(("0."+sectionIDidd.split(".")[1])*60);
        var maxMin = ztimeidd;
        // var leftMin = watchSec > 0 ? maxMin - watchMin -1 : maxMin - watchMin;
        var leftMin = maxMin - watchMin - 1;
        // var leftSec = 60 - watchSec;
        var leftSec = 59;
        $("#floater .div_HelperCont")
            .append("<div id='leftTime' style='color: #780701; font-weight: bold; text-align: center;'>&nbsp;</div>")
            .append("<div class='helper_line'><img src='images/helper_line.jpg'border='0'></div>");

        setInterval(function(){
            if(leftSec == -1){
                leftMin -= 1;
                leftSec = 59;
            }
            if((leftMin == 0 && leftSec ==0) || leftMin < 0){
                $("#leftTime").html("<span style='color:green'>已学完</span>");
                // 后续可以加入学完后的逻辑
                // 自动跳转下一节
                $(".div_HelperCont table  tr td:last a").click();
                return;
            }
            $("#leftTime").text(leftMin + ":" + leftSec);
            leftSec -= 1;
        },1000);
    } catch(e) {
        console.log("非学习页面");
    }
})();