// ==UserScript==
// @name         LIMS系统，实验室信息管理系统(LIMS)
// @name:zh-CN   LIMS实验室信息管理系统
// @name:zh-TW   LIMS系统
// @name:en      baima Laboratory Information Management System
// @namespace    https://www.bnocode.com/lims.html
// @version      1.1
// @description  lims系统,实验室信息管理系统,实验室管理软件,白码LIMS是一款功能全面的实验室管理系统，包括样品管理、仪器设备管理、实验计划与执行、数据记录与分析、质量控制等功能。能够帮助实验室实现高效的实验管理和数据记录，提高工作效率和数据质量。白码LIMS实验室管理系统可根据实验室需求进行个性化设置，满足不同行业实验室的管理需求。通过使用白码实验室管理软件，能够打造智慧实验室，实现信息化管理，提升实验室管理水平和科研竞争力。
// @description:zh-CN  lims系统,实验室信息管理系统,实验室管理软件,白码LIMS是一款功能全面的实验室管理系统，包括样品管理、仪器设备管理、实验计划与执行、数据记录与分析、质量控制等功能。能够帮助实验室实现高效的实验管理和数据记录，提高工作效率和数据质量。白码LIMS实验室管理系统可根据实验室需求进行个性化设置，满足不同行业实验室的管理需求。通过使用白码实验室管理软件，能够打造智慧实验室，实现信息化管理，提升实验室管理水平和科研竞争力。
// @description:zh-TW  lims系統,實驗室信息管理系統,實驗室管理軟件,白碼LIMS是一款功能全面的實驗室管理系統，包括樣品管理、儀器設備管理、實驗計劃與執行、數據記錄與分析、質量控製等功能。能夠幫助實驗室實現高效的實驗管理和數據記錄，提高工作效率和數據質量。白碼LIMS實驗室管理系統可根據實驗室需求進行個性化設置，滿足不同行業實驗室的管理需求。通過使用白碼實驗室管理軟件，能夠打造智慧實驗室，實現信息化管理，提升實驗室管理水平和科研競爭力。
// @description:en  LIMS System,Laboratory Information Management System,Laboratory Management Software,白码 LIMS is a fully functional laboratory management system
// @author       白码lims系统
// @license      白码lims
// @match        *://www.bnocode.com/lims.html/*
// @match        *://www.bnocode.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/500902/LIMS%E7%B3%BB%E7%BB%9F%EF%BC%8C%E5%AE%9E%E9%AA%8C%E5%AE%A4%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%28LIMS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500902/LIMS%E7%B3%BB%E7%BB%9F%EF%BC%8C%E5%AE%9E%E9%AA%8C%E5%AE%A4%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%28LIMS%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var questions = document.getElementsByClassName("styleTitle");
    var _question, question, index, answer;
    var notfounds = new Array(), dislocations = new Array();
    var notfound = 0, dislocation = 0;
    for (let i = 0, __qlength__ = questions.length; i < __qlength__; ++i) {
        var choice_length=document.getElementsByName("question"+i.toString()).length
        _question = questions[i].children[0].textContent.split("\u002e");
        index = _question.shift();
        question = _question.join("\u002e").replace(/\s/g, "");
        console.log(question)
        answer = findAnswer(question);
        console.log(answer)
    }
})();