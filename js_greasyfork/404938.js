// ==UserScript==
// @name         STU dailyReport Automator
// @name:zh      汕头大学健康打卡自动化
// @name:zh-CN   汕头大学健康打卡自动化
// @namespace    http://my.stu.edu.cn/
// @version      0.01
// @license      Anti 996 License
// @description  Automatically completes the health daily report during the Wuhan pneumonia pandemic.
// @description:zh 自动完成汕头大学线上服务健康打卡过程。
// @description:zh-CN 自动完成汕头大学线上服务健康打卡过程。借鉴@SaltfishAmi东南大学健康打卡自动化脚本https://greasyfork.org/zh-CN/scripts/398138-seu-lwreportepidemicseu-dailyreport-automator
// @author       yunjingshan
// @include      https://my.stu.edu.cn/health-report/login.html?_t=1591603871484
// @include      https://my.stu.edu.cn/health-report/report/report.do
// @include      https://sso.stu.edu.cn/login?service=https%3A%2F%2Fmy.stu.edu.cn%2Fhealth-report%2Finit-stu-user
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404938/STU%20dailyReport%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/404938/STU%20dailyReport%20Automator.meta.js
// ==/UserScript==

//======================CONFIG======================
// Credentials for auto-login
    var username = "username";
    var password = "password";
// Timeout settings in ms
    var timeoutBeforeLogin = 1500;
    var timeoutBeforeClickSummit = 2000;
    var timeoutBeforeCloseWindows = 3000;

//Temperature setting
    //var temperature = String((361 + Math.floor(Math.random() * 10))/10.0);
    var temperature = String(36.4);//固定温度
//==================================================

    function $(id){
        return document.getElementById(id);
    }
    function $$(classname){
        return document.getElementsByClassName(classname);
    }
    function $$$(name){
        return document.getElementsByName(name);
    }
    var clickevt = document.createEvent("MouseEvents");
    clickevt.initEvent("click", true, true);

(function() {
    'use strict';

    if(username=="username"){
        // username check
        alert("Please edit the script and set your username & password! \n请编辑脚本，指定你的用户名和密码！");
        alert("The script will now terminate. \n脚本执行中断。");
        return false;
    }

    if(window.location.hostname != "my.stu.edu.cn"){
        // login
        $("username").value = username;
        $("password").value = password;

        setTimeout(function(){
            $$("login-button")[0].dispatchEvent(clickevt);
        }, timeoutBeforeLogin);

    } else {

        setTimeout(function(){

            //填写体温
            $$$("dailyReport.afternoorBodyHeat")[0].value = temperature;
            $$$("dailyReport.forenoonBodyHeat")[0].value = temperature;
            //window.alert($$$("dailyReport.forenoonBodyHeat")[0].value);

            //勾选
            $$$("dailyReport.hasCough")[1].checked="Ture";
            $$$("dailyReport.hasShortBreath")[1].checked="Ture";
            $$$("dailyReport.hasWeak")[1].checked="Ture";
            $$$("dailyReport.hasFever")[1].checked="Ture";
            //window.alert($$$("dailyReport.hasCough")[1].checked);

            //提交健康信息按钮
            $("submitBtn3").click();
            //window.alert($("submitBtn3"));

        }, timeoutBeforeClickSummit);

        setTimeout(function(){
            //window.alert($("noticeMsg").innerHTML);
            if(/数据已上报成功/.test($("noticeMsg").innerHTML)){
                //window.alert("提交成功");
                window.close();
            };
        }, timeoutBeforeCloseWindows);
    }
})();
