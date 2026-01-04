// ==UserScript==
// @name         AoXiang Score Calculation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  翱翔门户教务系统学分绩计算。请在新页标签打开
// @author       BBKKBKK...
// @match        http://us.nwpu.edu.cn/eams/teach/grade/course/*
// @icon         https://bkimg.cdn.bcebos.com/pic/d50735fae6cd7b89652eefd9062442a7d9330e2e?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U4MA==,g_7,xp_5,yp_5/format,f_auto
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/427234/AoXiang%20Score%20Calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/427234/AoXiang%20Score%20Calculation.meta.js
// ==/UserScript==

`
使用方法：
1、使用chrome、Edge、Firefox等浏览器。
2、自行安装Tampermonkey（油猴）插件。
3、添加本脚本。
4、依次进入【翱翔门户】(可无)-【教务系统】-【我的学业】。
5、鼠标中键点击【成绩与成绩单】或鼠标右键点击【成绩与成绩单】，选择【在新标签中打开链接】。

ps：有疑问联系kely001125@gmail.com
`

semesterId = {
    "2018秋季学期": 18,
    "2018春季学期": 36,
    "2019秋季学期": 19,
    "2019春季学期": 37,
    "2020秋季学期": 98,
    "2020春季学期": 118,
    "2021秋季学期": 158,
    "2021春季学期": 178,
}

$(document).ready(function() {
    var url = window.location.href;
    tableName = url.split('!')[1].split('.')[0] == "search" ? "gridtable" : "grid";

    var str = ''
    var all = '<div><a href="http://us.nwpu.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR"> 全部学期 </a></div>'
    for (let term in semesterId) {
        str += `<div><a href="http://us.nwpu.edu.cn/eams/teach/grade/course/person!search.action?semesterId=${semesterId[term]}&projectType="> ${term} </a></div>`
    }
    $("#semesterForm").remove();
    $(`.${tableName}`).before(`<div></br><span>选择学期</span>${str}${all}</div>`);
    $(`.${tableName}`).before("<div>学分积：<span id='gradeT'>null</span></div> <div> 绩点：<span id='gpaT'>null</span></div>");

    var tr_th = $(`.${tableName} tr`)[0];
    var tr_tbody = $(`.${tableName} tr`).slice(1);
    $(tr_th).append("<td width='5%'>全选<input type='checkbox' checked='checked' id='checkall' class='checkall'></td>");
    tr_tbody.each(function() {
        $(this).append("<td><input type='checkbox' checked='checked' id='checkname' class='checkname'></td>");
    });

    calculate();
    checkClick();
    checkall();
});


var checkall = function() {
    $(".checkall").click(function() {
        let chebox = $("#checkall");
        let trs = $(`.${tableName} tr`).slice(1);
        let flag = chebox.is(':checked') ? true : false
        trs.each(function() {
            $(this).find("input").prop("checked", flag);
        })
        calculate();
    });
}

var checkClick = function() {
    $(".checkname").click(function() {
        calculate();
    })
}

var calculate = function() {
    var trs = $(`.${tableName} tr`).slice(1);
    var credit = 0, // 学分
        grade = 0, // 最终
        gpa = 0; // 绩点
    trs.each(function() {
        let chebox = $(this).find("input");
        if (chebox.is(':checked')) {
            let credit_ = parseFloat($(this).find("td").eq(5).text());
            let grade_ = parseFloat($(this).find("td").eq(-3).text());
            let gpa_ = parseFloat($(this).find("td").eq(-2).text());
            if (!isNaN(grade_) && !isNaN(credit_)) {
                grade += grade_ * credit_;
                gpa += gpa_ * credit_;
                credit += credit_;
            }
        }
    });
    if (credit) {
        grade = grade / credit;
        gpa = gpa / credit;
    }
    $("#gradeT").text(grade.toFixed(2));
    $("#gpaT").text(gpa.toFixed(2));
}