// ==UserScript==
// @name         南信大自动评教
// @namespace    myetyet
// @version      0.3
// @description  南京信息工程大学学分制教学管理系统评教页面自动勾选8分并提交
// @author       myetyet
// @match        http://bkxk.nuist.edu.cn/*/student/wspjdf.aspx*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376604/%E5%8D%97%E4%BF%A1%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/376604/%E5%8D%97%E4%BF%A1%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

const mark = 8;

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