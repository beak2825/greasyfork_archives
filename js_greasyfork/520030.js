// ==UserScript==
// @name         UCAS Auto Course Evaulater
// @namespace    http://tampermonkey.net/
// @version      2024-12-25
// @description  Auto Evaulate UVAS courses and teachers.
// @author       Hilbert Wang
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateCourse/*
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateTeacher/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ucas.ac.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520030/UCAS%20Auto%20Course%20Evaulater.user.js
// @updateURL https://update.greasyfork.org/scripts/520030/UCAS%20Auto%20Course%20Evaulater.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;
    let mcbody = document.getElementsByClassName('mc-body')[0]
    let p = document.getElementsByClassName('mc-body')[0].children[1]
    let btn = document.createElement('div')
    btn.setAttribute('class', 'btn')
    if(/^https:\/\/jwxk\.ucas\.ac\.cn\/evaluate\/evaluateCourse\/.*?/.test(currentUrl)){btn.setAttribute('onclick', '(function(){document.querySelectorAll(\'input[type="radio"].required[value="5"]\').forEach((el) => el.checked = true);document.querySelector(\'.required.radio\').checked = true;document.querySelector(\'.required.checkbox\').checked = true;document.querySelector(\'#item_1355\').value="讲课风趣；知识点齐全；学到了很多新知识。";document.querySelector(\'#item_1356\').value="提高互动性；介绍前言发展；引导学生独立思考。";document.querySelector(\'#item_1357\').value="我平均每周在这门课程上花费10个小时。";document.querySelector(\'#item_1358\').value="在参与这门课之前，我对这个学科领域兴趣很浓厚。";document.querySelector(\'#item_1359\').value="我保证每次出勤，并且在课堂上积极回答问题";})()')}
    if(/^https:\/\/jwxk\.ucas\.ac\.cn\/evaluate\/evaluateTeacher\/.*?/.test(currentUrl)){btn.setAttribute('onclick', '(function(){document.querySelectorAll(\'input[type="radio"].required[value="5"]\').forEach((el) => el.checked = true);document.querySelector(\'#item_1403\').value="我最喜欢他的讲课幽默风趣且逻辑紧密，能学到很多知识。";document.querySelector(\'#item_1404\').value="希望老师可以增加更多拓展内容，帮助同学们更好的理解知识点。";})()')}
    btn.innerText = 'Auto Evaluate'
    mcbody.insertBefore(btn, p)
})();