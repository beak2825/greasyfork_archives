// ==UserScript==
// @name         cug教务系统学分计算器
// @namespace    http://202.114.207.126/jwglxt/xsxy/
// @version      1.1
// @description  排除通选学分的绩点计算
// @author       Chunibyo
// @match        http://202.114.207.126/jwglxt/xsxy/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396843/cug%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AD%A6%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/396843/cug%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AD%A6%E5%88%86%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==


jQuery(function($){
    'use strict';

    $(function () {
        // 总的学分和sum(credit * grade)
        let sum_gained_credit = 0
        let sum_credit = 0
        let tmp1, tmp2

        // 第一栏的课程
        $("div.position_r > ul.treeview > li:first li tbody > tr").each(function (index, item) {
            if (($(item).find("td:first > div").hasClass("tjxk4")) === true) {
                tmp1 = parseFloat($(item).find("td[name = 'xf']").html()) // 这门课的学分
                tmp2 = parseFloat($(item).find("td:nth-child(12)").html())

                if (isNaN(tmp1) || isNaN(tmp2)) tmp1 = 0, tmp2 = 0

                sum_credit += tmp1 // 选课的总学分
                sum_gained_credit += tmp1 * tmp2 // 获得的总学分
            }
        })

        // 展示
        let str1 = '<font size="2px">除去通选的学分绩点：<font size="2px" style="color: red;">' +
            (sum_gained_credit / sum_credit).toFixed(3) +
            '</font></font>'
        $("#alertBox br:first").after(str1)

        // 其他课程(第二栏)
        $("#kcxxqtkcxfyq tbody > tr").each(function (index, item) {
            tmp1 = parseFloat($(item).find("td[name = 'xf']").html()) // 这门课的学分
            tmp2 = parseFloat($(item).find("td:nth-child(12)").html())

            if (isNaN(tmp1) || isNaN(tmp2)) tmp1 = 0, tmp2 = 0

            sum_credit += tmp1 // 选课的总学分
            sum_gained_credit += tmp1 * tmp2 // 获得的总学分
        })

        // 展示
        let str2 = '<font size="2px">&nbsp;&nbsp;供各位校验的计算了通选的GPA：<font size="2px" style="color: red;">' +
            (sum_gained_credit / sum_credit).toFixed(3) +
            '</font></font><br>'
        $("#alertBox > font:nth-child(4)").after(str2)
    })
});
