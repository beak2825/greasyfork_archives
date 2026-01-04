// ==UserScript==
// @name         衡水学院URP教务系统助手
// @version      2.0
// @description  自动完成教学评估~
// @author       Thunpo
// @license      MIT
// @match        http://xjw.hsnc.edu.cn:7777/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://xjw.hsnc.edu.cn:7777/student/teachingEvaluation/evaluation/index
// @match        http://xjw.hsnc.edu.cn:7777/student/teachingEvaluation/newEvaluation/*
// @match        http://xjw.hsnc.edu.cn:7777/student/teachingEvaluation/newEvaluation/evaluation/*
// @match        http://xjw.hsnc.edu.cn:7777/student/teachingEvaluation/newEvaluation/index?mobile=false
// @grant        none
// @namespace    https://greasyfork.org/users/916290
// @downloadURL https://update.greasyfork.org/scripts/455971/%E8%A1%A1%E6%B0%B4%E5%AD%A6%E9%99%A2URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/455971/%E8%A1%A1%E6%B0%B4%E5%AD%A6%E9%99%A2URP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    $(document).ready(function () {
        const tabLink = document.querySelector("a[data-toggle='tab'][href='#home']");
        if (tabLink) {
            tabLink.click();
        } else {
            return;
        }
        const waitForTable = setInterval(() => {
            const tableRows = $("table tbody tr");
            if (tableRows.length > 0) {
                tableRows.each(function () {
                    const row = $(this);
                    const isEvaluated = row.find("td:last").text().trim();

                    if (isEvaluated === "否") {
                        const evalButton = row.find('.btn.btn-xs.btn-round.btn-purple[flag="jxpg"]');
                        if (evalButton.length) {
                            evalButton.click();
                            console.log("点击评估按钮成功");
                        } else {
                            console.error("未找到评估按钮！");
                        }
                    }
                });

                clearInterval(waitForTable);
            } else {
                console.log("等待表格加载中...");
            }
        }, 500);

    });

   $(document).ready(function () {
        var keyWord=["优"];
        $(".ace").each(function(){
            var self=$(this);
            var text=$(this).next().next().html();
            keyWord.forEach(function(value){
                if(text.indexOf(value)!=-1)
                    self.click();
            });
            console.log(text);
        })
    });
     setTimeout(function (){
           $("textarea").val("教师课堂上的整体教学效果非常好，教师在教学方面极认真负责，教师的基本知识技能过硬。");
     },1000);
 setTimeout(function(){$("#savebutton").click()},127001);
})();
