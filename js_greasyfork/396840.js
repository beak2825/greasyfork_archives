// ==UserScript==
// @name         Hdu教务系统已选学分统计
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  统计hdu教务系统里当前界面的已选学分的辅助工具
// @author       In_The_Wind
// @include      http://jxgl.hdu.edu.cn/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/396840/Hdu%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%B7%B2%E9%80%89%E5%AD%A6%E5%88%86%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/396840/Hdu%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%B7%B2%E9%80%89%E5%AD%A6%E5%88%86%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
var calCredit = function () {
    'use strict';
    // Your code here...
    let credit = getNowPageCredit();
    setShownCredit(credit);

};
var getNowPageCredit = function () {
    let credit = 0;
    let allclass = document.querySelectorAll("#kcmcgrid > tbody >tr");
    for (let i = 1; i <= allclass.length - 2; ++i) {
        //注意这个table，i从1开始，到allclass.length-2结束，这里i=0是表头，表尾length-1这里表示table的页面跳转，坑了很长时间才发现
        let selected = allclass[i].cells[8].innerText;
        if (selected === "已选") {
            credit = credit + parseFloat(allclass[i].children[4].innerText)
        }
    }
    return credit;
};
var setShownCredit = function (totalCredit) {
    let newtext = document.querySelector("#Table1 > tbody > tr.trtitle > td:nth-child(5)");
    newtext.innerText = "当前界面已选学分";
    let position = document.querySelector("#Table1 > tbody > tr:nth-child(2) > td:nth-child(5)");
    position.innerText = totalCredit;
};
setTimeout(calCredit,1000);
var showTotalCredit = function () {
    var tbodyp = document.getElementById("DBGrid");

    var tbody = tbodyp.children[0];
    var tbodyChildren = tbody.children;
    var sum = 0;
    for (let i = 1; i < tbodyChildren.length; ++i) {
        sum += parseFloat(tbodyChildren[i].children[5].innerText);
    }

    //var showPositionParent1 = document.getElementsByClassName("location");
    //if (showPositionParent1[0].children[0])
      //  var showPositionParent = showPositionParent1[0].children[0];
    //var span = document.createElement("sapn");
    //span.innerText = "该学期已修学分:" + sum;
    //showPositionParent.appendChild(span);
    document.write("该学期已修学分:" + sum);
};

//document.addEventListener("DOMContentLoaded", function () {
setTimeout(showTotalCredit, 8000);
//});