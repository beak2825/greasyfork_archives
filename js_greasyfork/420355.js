// ==UserScript==
// @name         安徽工业大学教务系统计算GPA
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Z
// @match        http://jwxt.ahut.edu.cn/jsxsd/kscj/cjcx_list
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420355/%E5%AE%89%E5%BE%BD%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AE%A1%E7%AE%97GPA.user.js
// @updateURL https://update.greasyfork.org/scripts/420355/%E5%AE%89%E5%BE%BD%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AE%A1%E7%AE%97GPA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var mytable=document.querySelector("#dataList")
    if(mytable && mytable.rows[1].cells[0].innerText!="未查询到数据"){
        var sumCredits=0//定义总学分
        var totalScore=0//定义总成绩
        for (var i=1;i<mytable.rows.length;i++){
            if(!isNaN(parseFloat(mytable.rows[i].cells[6].innerText))){
                sumCredits+=parseFloat(mytable.rows[i].cells[8].innerText)
                totalScore+=parseFloat(mytable.rows[i].cells[8].innerText)*parseFloat(mytable.rows[i].cells[6].innerText)}}
    var gpa= totalScore/sumCredits
    alert("您的平均学分绩是"+gpa.toFixed(2))}
})();