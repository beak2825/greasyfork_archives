// ==UserScript==
// @name         Hdu课程总学分统计
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  在"学生选课情况查询"页面统计当前学期已选课程学分
// @author       litStronger
// @include      http://jxgl.hdu.edu.cn/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/404654/Hdu%E8%AF%BE%E7%A8%8B%E6%80%BB%E5%AD%A6%E5%88%86%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/404654/Hdu%E8%AF%BE%E7%A8%8B%E6%80%BB%E5%AD%A6%E5%88%86%E7%BB%9F%E8%AE%A1.meta.js
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

    console.log("tool box");

    let toolBox = document.getElementsByClassName("toolbox")[0]
    console.log("tool box");
    var toolBoxMsg = document.getElementsByClassName("toolbox")[0].innerHTML;

    console.log(toolBox);
        console.log(toolBoxMsg);

    toolBox.innerHTML = toolBoxMsg+"<p>该学期已选学分"+sum+"</p>"
};

setTimeout(showTotalCredit, 1000);
