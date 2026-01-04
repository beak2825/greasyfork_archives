// ==UserScript==
// @name         南信大yyds
// @namespace    myetyet
// @version      1
// @description  南京信息工程大学学分制教学管理系统评教页面自动勾选10分并提交
// @author       myetyet
// @match        http://bkxk.nuist.edu.cn/*/student/wspjdf.aspx*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428756/%E5%8D%97%E4%BF%A1%E5%A4%A7yyds.user.js
// @updateURL https://update.greasyfork.org/scripts/428756/%E5%8D%97%E4%BF%A1%E5%A4%A7yyds.meta.js
// ==/UserScript==

const mark = 10;

(function() {
    'use strict';
    var x = 1;
    while (true){
        var rname = ++x < 10 ? "GridView1_ctl0" : "GridView1_ctl";
        rname += String(x) + "_RadioButton" + String(10 - mark + 1);
        var rd = document.getElementById(rname);
        if (rd){
            rd.checked = true;
        } else {
            break;
        }
    }
    var btn = document.getElementById("Button2");
    if (btn){
        btn.click();
    }
})();