// ==UserScript==
// @name         FastEvaluateUploader
// @namespace    http://tampermonkey.net/
// @version      2024-06-29
// @description  FastEvaluateUploader 1.0
// @author       青年桥东
// @match        http://124.133.43.209:8000/QuestionnaireItemsController/biao1/*
// @match        http://124.133.43.209:8000/QuestionnaireItemsController/biao2/*
// @icon         http://124.133.43.203:9005/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488553/FastEvaluateUploader.user.js
// @updateURL https://update.greasyfork.org/scripts/488553/FastEvaluateUploader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取所有输入框
    var inputs = document.querySelectorAll('.form-control');
    var scores = {};

    for (let i = 0; i < inputs.length; i++) {
        var oninput = inputs[i].getAttribute('oninput');
        if (oninput != null) {
            var max = oninput.match(/if\(value>(\d+)\)/);
            if (max != null) {
                scores[i] = max[1]; // 使用输入元素的索引作为键
            }
        }
    }
    // 随机选择 1 到 3 个 scores 对象的键
    var numKeysToSelect = Math.floor(Math.random() * 3) + 1;
    var selectedKeys = [];
    var selectedValues = [];

    // 选择不重复的键
    while (selectedKeys.length < numKeysToSelect) {
        var randomIndex = Math.floor(Math.random() * Object.keys(scores).length);
        var key = Object.keys(scores)[randomIndex];
        if (!selectedKeys.includes(key)) {
            selectedKeys.push(key);
        }
    }

    // 将选定的键对应的值减去 1 或 2
    for (var i = 0; i < selectedKeys.length; i++) {
        var key = selectedKeys[i];
        var decreaseAmount = Math.floor(Math.random() * 2) + 1;
        scores[key] -= decreaseAmount;
        selectedValues.push(scores[key]); // 将减去后的值存储起来，以备后续需要
    }

    console.log(selectedKeys); // 输出选定的键
    console.log(selectedValues); // 输出选定的值
    console.log(scores); // 输出所有的 scores 对象

    // 把scores对象的值转为字符串
    var scores = Object.values(scores);

    // 将scores对应的值填入输入框
    for (var i = 0; i < scores.length; i++) {
        inputs[i].value = scores[i];
        var event = new Event('blur');
        // 触发blur事件
        inputs[i].dispatchEvent(event);
    }

    var evaulations2student = ["该医生在科室表现出色，注重细节，值得信赖。",
                               "该医生表现积极主动，与患者和团队合作良好，展现出良好的沟通技巧。",
                               "该医生对医学知识的掌握程度令人印象深刻，能够在紧急情况下迅速作出决策。",
                               "该医生在科室值班期间表现出色，稳健的临床判断能力让人印象深刻。",
                               "该医生积极参与科研工作，对最新医学进展有着敏锐的洞察力。",
                               "该医生展现出良好的学习态度，乐于接受反馈并不断改进自己的工作方式。",
                               "该医生尊重患者权利和隐私，以患者为中心的服务态度值得肯定。",
                               "该医生对医院的管理和运作有清晰的认识，能够有效地组织工作并解决问题。",
                               "该医生表现出强烈的责任心和职业道德，始终以病人安全和治疗效果为首要目标。"]
    // 选择评语框
    var textarea2student = document.querySelector('#form-add > table > tbody > tr:nth-child(9) > td:nth-child(2) > textarea');
    var textarea2department = document.querySelector('#form-add > table > tbody > tr:nth-child(11) > td:nth-child(2) > textarea');
    var textarea2teacher = document.querySelector('#form-add > table > tbody > tr:nth-child(5) > td:nth-child(2) > textarea');

    if (textarea2student) {
        // 随机选择评语
        var randomIndex = Math.floor(Math.random() * evaulations2student.length);
        textarea2student.value = evaulations2student[randomIndex];
    } else {
        console.log('textarea2student does not exist.');
    }

    if (textarea2department) {
        textarea2department.value = "好";
    } else {
        console.log('textarea2department does not exist.');
    }

    if (textarea2teacher) {
        textarea2teacher.value = "好";
    } else {
        console.log('textarea2teacher does not exist.');
    }

})();