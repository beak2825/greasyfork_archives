// ==UserScript==
// @name         林科大平时分/绩点查询
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Csuft 平时分/平时成绩/考试成绩/绩点查询
// @author       Xbai-hang
// @match        *://*.csuft.edu.cn/jsxsd/kscj/cjcx_list
// @icon         https://www.csuft.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-migrate/3.4.0/jquery-migrate.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/438411/%E6%9E%97%E7%A7%91%E5%A4%A7%E5%B9%B3%E6%97%B6%E5%88%86%E7%BB%A9%E7%82%B9%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/438411/%E6%9E%97%E7%A7%91%E5%A4%A7%E5%B9%B3%E6%97%B6%E5%88%86%E7%BB%A9%E7%82%B9%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
 
'use strict';
var config = {
    btn_course_status: true
};
(function() {
    $("th[class='Nsb_r_list_thb'] span").append(`<button id="btn_psf">查询平时分</button>&nbsp;&nbsp;<button id="btn_jd">计算绩点</button>&nbsp;&nbsp;<a href="javascript:void(0)" id="dialog_link">显示弹窗</a>`)
    var tags_tr_next_div = $("div[class='Nsb_pw Nsb_pw2'] tr");
    $($("th[class='Nsb_r_list_thb'] span button")[0]).click(function() {
        if (!config.btn_course_status) {
            return;
        }
        tags_tr_next_div.each(function(){
            $($(this).children()[4]).remove();
            this.innerHTML = this.innerHTML.replace("控制绩点显示","").replace("控制成绩显示","").replaceAll("-->","").replaceAll("<!--","");
        });
        config.btn_course_status = !config.btn_course_status;
        alert("已更改，点击蓝色成绩即可查询");
    });
    $($("th[class='Nsb_r_list_thb'] span button")[1]).click(function() {
        var sum_credit = 0;
        var sum_credit_gpa = 0;
        // 记录课程编号（用于去除未挂科但是重修导致的重复计算问题(偷懒了，观察发现重修课程在原课程之上，故等于是直接计算重修成绩（你要是重修的比原来的低你就是大笨蛋(❁´◡`❁))）
        let courseNoSet = new Set();
        tags_tr_next_div.each(function(){
            var credit = Number($(this).children()[5].innerText);
            var gpa = Number($(this).children()[7].innerText);
            var courseNo = Number($(this).children()[2].innerText);
            // 绩点为 0 不计入统计（缺考、挂科、重修了等等）
            if (gpa == 0 || courseNoSet.has(courseNo)) {
                return;
            }
            courseNoSet.add(courseNo);
            sum_credit += credit;
            sum_credit_gpa += gpa * credit;
        });
        alert("平均学分绩(绩点*学分/总学分)为: " + (sum_credit_gpa / sum_credit).toFixed(2) + "\n Warning: 并未计算未重修的课程（绩点为 0 的）");
    });
})();