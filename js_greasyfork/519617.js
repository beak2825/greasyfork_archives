// ==UserScript==
// @name         UCAS_course_auto_assessment
// @namespace    https://www.lac.icu
// @version      1.0
// @description  自动填写中国科学院大学选课系统的评价和教师评价，本人仅进行油猴脚本的封装。功能代码来源github开源代码，地址：https://github.com/culeao/UCAS-auto-assessment
// @author       liaowei
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/evaluateCourse/*
// @match        https://xkcts.ucas.ac.cn:8443/evaluate/evaluateTeacher/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ucas.ac.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519617/UCAS_course_auto_assessment.user.js
// @updateURL https://update.greasyfork.org/scripts/519617/UCAS_course_auto_assessment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮并添加到页面上
    function createButton(text, callback) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.borderRadius = "8px";
        button.style.color = "white";
        button.style.background = "#e33e33";
        button.style.border = "5px solid #e33e33";
        button.style.zIndex = '9999';
        button.addEventListener('click', callback);
        document.body.appendChild(button);
    }

    // 检查当前页面URL并执行相应的脚本
    if (window.location.href.indexOf('evaluateCourse') !== -1) {
        // 为evaluateCourse页面创建按钮
        createButton('一键填写课程评价', function() {
            var x = document.getElementsByClassName('required');
            for (var i = 0; i < x.length; i++) {
                if (i < 109 && i % 5 == 0) {
                    x[i].checked = true;
                }
            }
            x[110].textContent = "在课堂上可以学到很多有用的东西，老师讲的很清晰，让我受益匪浅！";
            x[111].textContent = "课堂互动再多一点，必要的时候可以停一下，与学生互动要增多！";
            x[112].textContent = "每周可以花费大概4个小时，不固定，有时多有时少。";
            x[113].textContent = "很有兴趣，喜欢这个学科和领域，想进行更深入的了解。";
            x[114].textContent = "保持全勤，从未旷课、早退和迟到。回答问题挺积极。";
            x[115].checked = true;
            x[121].checked = true;
            x[123].checked = true;
            x[124].checked = true;
        });
    } else if (window.location.href.indexOf('evaluateTeacher') !== -1) {
        // 为evaluateTeacher页面创建按钮
        createButton('一键填写教师评价', function() {
            var x = document.getElementsByClassName('required');
            for (var i = 0; i < x.length; i++) {
                if (i < 105 && i % 5 == 0) {
                    x[i].checked = true;
                }
            }
            x[105].textContent = "最喜欢老师上课讲各种与课堂相关的趣事，老师上课认真，思路清晰。";
            x[106].textContent = "课堂互动再多一点，必要的时候可以停一下，与学生互动要增多！";
        });
    }
})();