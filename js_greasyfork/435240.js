// ==UserScript==
// @name         青少年普法跳过
// @namespace    xyz.javaee
// @version      0.2
// @description  能自动跳过青少年普法的学习，不能考试
// @author       lovelinessmoe
// @match        https://static.qspfw.moe.gov.cn/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/435240/%E9%9D%92%E5%B0%91%E5%B9%B4%E6%99%AE%E6%B3%95%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/435240/%E9%9D%92%E5%B0%91%E5%B9%B4%E6%99%AE%E6%B3%95%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("开始运行");

    // $("#nextColumn").show();
    $("#afterClassPractice").show();

  /*  const href = window.location.href;
    const {gradeId, columnId, gradeName} = GetRequestParam(href);*/


    let choices;
    let j, totalNum;
    totalNum = Math.floor(document.querySelector('#totalTopic').innerHTML);

    console.log("total", totalNum);
    for (j = 1; j <= totalNum; j++) {
        choices = document.querySelectorAll('.prev');
        // console.log("choices", choices);
        choices['ABCD'.indexOf(questionBank_answer)].click();
        nextQuestion();
    }

    $("#next_exam").show();
    $("#next_exam").textContent="点我继续";


   /* $("#nextColumn").on("click", function () {
        // 点击下一章节
        fun();
    });
    $("#next_exam").on("click", function () {
        // 点击下一章节
        fun();
    })

    let fun = () => {
        //const columnId = $("#nextStep").attr("columnId");
        let next_ColumnId = 0;
        for (let n = 0; n < gradeColumnList.length; n++) {
            if (gradeColumnList[n].columnId == columnId) {
                if (n + 1 < gradeColumnList.length) {
                    next_ColumnId = gradeColumnList[n + 1].columnId
                } else {
                    next_ColumnId = 0
                }

            }
        }

        let gradeIdParam = ""
        if (gradeId) {
            gradeIdParam = `&gradeId=${gradeId}`
        }
        let gradeNameParam = ""
        if (gradeName) {
            gradeNameParam = `&gradeName=${gradeName}`
        }
        const columnId1 = next_ColumnId;
        window.location.replace(`./learning-page.html?columnId=${columnId1}${gradeIdParam}${gradeNameParam}`);
    }*/


})();
