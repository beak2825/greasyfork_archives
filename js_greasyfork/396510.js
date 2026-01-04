// ==UserScript==
// @name         STUer Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script will fill "Daily Health Report" automatically. The form will be submitted in 3 seconds.
// @author       A STUer
// @match        https://my.stu.edu.cn/health-report/report/report.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396510/STUer%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/396510/STUer%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var Min = 363;
	var Max = 372;
    var Range = Max - Min;
    var Tyesterday = (Min + Math.round(Math.random() * Range))/10;
    var Ttoday = (Min + Math.round(Math.random() * Range))/10;

    //我的健康状况：1=请选择；2=良好；3=普通感冒；4=普通发烧；5=咳嗽；6=疑似病例；7=确诊病例；8=其他
    document.querySelector("#health > option:nth-child(2)").setAttribute("selected","selected");
    //家人健康状况：1=请选择；2=良好；3=普通感冒；4=普通发烧；5=咳嗽；6=疑似病例；7=确诊病例；8=其他
    document.querySelector("#familyHealth > option:nth-child(2)").setAttribute("selected","selected");
    //重点人员情况：1=请选择；2=现在肺炎疫情主要发生地和防控重点地区；3=到过肺炎疫情主要发生地和防控重点地区；4=返校前14天接触过疫情防控重点地区健康人群；5=返校前14天接触过疑似病例/确诊病例；6=不是以上重点人员
    document.querySelector("#importantPersonType > option:nth-child(6)").setAttribute("selected","selected");

    //昨天下午体温（随机生成，数值为变量Min和Max之间任意整数的1/10）
    document.querySelector("#reportForm > table:nth-child(2) > tbody > tr:nth-child(1) > td > input[type=number]").setAttribute("value",Tyesterday);
    //今天上午体温（随机生成，数值为变量Min和Max之间任意整数的1/10）
    document.querySelector("#reportForm > table:nth-child(2) > tbody > tr:nth-child(2) > td > input[type=number]").setAttribute("value",Ttoday);

    //咳嗽、气促、乏力、发烧
    document.querySelector("#reportForm > table:nth-child(2) > tbody > tr:nth-child(3) > td > label:nth-child(2) > input[type=radio]").setAttribute("checked","checked");
    document.querySelector("#reportForm > table:nth-child(2) > tbody > tr:nth-child(4) > td > label:nth-child(2) > input[type=radio]").setAttribute("checked","checked");
    document.querySelector("#reportForm > table:nth-child(2) > tbody > tr:nth-child(5) > td > label:nth-child(2) > input[type=radio]").setAttribute("checked","checked");
    document.querySelector("#reportForm > table:nth-child(2) > tbody > tr:nth-child(6) > td > label:nth-child(2) > input[type=radio]").setAttribute("checked","checked");

    setTimeout(function(){
        document.getElementById('submitBtn3').click();
    },3000);
})();