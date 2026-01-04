// ==UserScript==
// @name         剩余年假和补休提醒，一定要好好休息！！！
// @namespace    https://www.weilino.gitee.io
// @version      1.0.0
// @description  查询补休和年假剩余天数 作为小狮子提醒的辅助脚本 以便跨域访问
// @author       weilino
// @match        *://ps7.cnsuning.com/*
// @icon         http://ps7.cnsuning.com/favicon.ico
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466630/%E5%89%A9%E4%BD%99%E5%B9%B4%E5%81%87%E5%92%8C%E8%A1%A5%E4%BC%91%E6%8F%90%E9%86%92%EF%BC%8C%E4%B8%80%E5%AE%9A%E8%A6%81%E5%A5%BD%E5%A5%BD%E4%BC%91%E6%81%AF%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/466630/%E5%89%A9%E4%BD%99%E5%B9%B4%E5%81%87%E5%92%8C%E8%A1%A5%E4%BC%91%E6%8F%90%E9%86%92%EF%BC%8C%E4%B8%80%E5%AE%9A%E8%A6%81%E5%A5%BD%E5%A5%BD%E4%BC%91%E6%81%AF%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

// 配置控制类
class Config {
    get(key, value) {
        var cookie = $.cookie(key);
        if (cookie == undefined) {
            new Config().set(key, value);
            console.debug("Renew key: " + key + " : " + value);
            return value;
        }
        console.debug("Read key: " + key + " : " + cookie);
        if (cookie === "true") { return true; }
        if (cookie === "false") { return false; }
        return cookie;
    }
}

var title = "";
var annualLeaveRation = "";
var restRation = "";

(function() {

    console.log("开始==========");

    //获取当前时间
    function getNowFormatDate() {
        var day = new Date();
        var Year = 0;
        var Month = 0;
        var Day = 0;
        var CurrentDate = "";
        Year = day.getFullYear();
        Month = day.getMonth() + 1;
        Day = day.getDate();
        CurrentDate += Year + "-";
        if (Month >= 10) {
            CurrentDate += Month + "-";
        } else {
            CurrentDate += "0" + Month + "-";
        }
        if (Day >= 10) {
            CurrentDate += Day;
        } else {
            CurrentDate += "0" + Day;
        }
        return CurrentDate;
    }

    //获取登录后cookie中的工号
    var employeeId = new Config().get("custno");

    //发送请求获取信息
    $.ajax({
        url: 'http://ps7.cnsuning.com/HRCommonShare/leaveAjax.do',
        data: {
            methodName: 'checkRestRation',
            employeeId: employeeId,
            leaveTypeCode: "0001",
            startDate: getNowFormatDate(),
            endDate: getNowFormatDate(),
            startTime: "09:00:00",
            endTime: "18:00:00",
            leaveDays: 1
        },
        type: "POST",
        async:false,
        dataType: 'json',
        success: function(jsonData) {
            console.log(employeeId,"您好呀，","您查询的：");
            console.log("年假剩余：", jsonData.annualLeaveRation);
            console.log("补休剩余：", jsonData.restRation);
            console.log("感谢您的付出，要好好休息呀！！！");
            //赋值给全部变量
            annualLeaveRation = jsonData.annualLeaveRation;
            restRation = jsonData.restRation;
        },
        error: function(e) {
            console.log(e);
        }
    });

    console.log("结束==========");
})();

//拼接提示信息
title = title + "您好呀！您的年假剩余："+annualLeaveRation +"，补休剩余："+restRation+"，请假剩余：365，答应我，一定要好好休息呀！！！";
console.log(title);

//覆盖整个原页面
document.write("<body style='background-color:#0081cc'><img id='show' src='http://res.suning.cn/project/cmsWeb/suning/homepage/v8/css/images/tool-logo.png?v=2021062901' width='25' height='25'/></body>")

//赋值标签的属性
document.getElementById('show').setAttribute('title',title)
