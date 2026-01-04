// ==UserScript==
// @name         PMS Auto Fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  GTMD PMS
// @author       yansixing
// @match        https://t.xjjj.co/projects/*/issues/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xjjj.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451466/PMS%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/451466/PMS%20Auto%20Fill.meta.js
// ==/UserScript==

(function() {
    let subjectElement = document.getElementById("issue_subject");
    if(!subjectElement.value){
        console.log("Run PMS Auto Fill");
        // 自动指派给我
        let assign_to_me_link =document.getElementsByClassName("assign-to-me-link")[0]
        assign_to_me_link.click();

        // 预期工时8
        let issue_estimated_hours = document.getElementById("issue_estimated_hours");
        issue_estimated_hours.value=8;

        // 自动选中当前迭代
        let issue_agile_data_attributes_agile_sprint_id = document.getElementById("issue_agile_data_attributes_agile_sprint_id")
        issue_agile_data_attributes_agile_sprint_id.options[1].selected = true

        // 计划完成日期，默认明天
        let startTimeStamp = Date.parse(document.getElementById("issue_start_date").value);
        let offset = 24*60*60*1000;
        let endTimeStamp = startTimeStamp+offset;
        let endTimeString = new Date(endTimeStamp).toISOString().slice(0, 10)
        document.getElementById("issue_due_date").value = endTimeString;
    }else{
        console.log("已经有主题");
    }
})();