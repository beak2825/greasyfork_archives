// ==UserScript==
// @name         UCAS SEP教评系统自动填写
// @namespace    Yuankong11
// @version      0.1
// @description  自动填写SEP教评系统。
// @author       Yuankong11
// @include      http://jwxk.ucas.ac.cn/evaluate/evaluateTeacher/*
// @include      http://jwxk.ucas.ac.cn/evaluate/evaluateCourse/*
// @downloadURL https://update.greasyfork.org/scripts/426521/UCAS%20SEP%E6%95%99%E8%AF%84%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/426521/UCAS%20SEP%E6%95%99%E8%AF%84%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let l = document.querySelectorAll('[name^="item_"][value="5"]');
    for(let i = 0; i < l.length; i++) {
        l[i].checked = true;
    }
    let t = document.querySelectorAll('textarea[name^="item_"]');
    for(let i = 0; i < t.length; i++) {
        let text = window.location.href.indexOf('evaluateTeacher') + 1 ?
              "治学严谨、备课充分、讲课认真、因材施教" : "课程与作业（包括作业、报告、测验测试、论文等）有助于我的能力的提高";
        t[i].innerText = text;
    }
    if (window.location.href.indexOf('evaluateCourse') + 1) {
        document.querySelectorAll('input[name^="radio_"]')[0].checked = true;
        document.querySelectorAll('input[name^="item_"][type="checkbox"]')[0].checked = true;
    }
})();
