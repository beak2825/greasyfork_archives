// ==UserScript==
// @name         佛大学分绩
// @namespace    rong
// @version      0.75
// @description  获取学分绩
// @author       rong
// @license MIT
// @match        https://100.fosu.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499262/%E4%BD%9B%E5%A4%A7%E5%AD%A6%E5%88%86%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/499262/%E4%BD%9B%E5%A4%A7%E5%AD%A6%E5%88%86%E7%BB%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

        let rows = document.querySelectorAll("#dataList tbody tr");
        let total_credit = 0;
        let total_grade = 0;

        for (var i = 1; i < rows.length; i++) {
            let curr_row = rows[i];
            let str_grade = curr_row.querySelector("a").textContent.trim();
            let str_credit = curr_row.cells[5].textContent.trim();

            let grade = parseFloat(str_grade);
            let credit = parseFloat(str_credit);

            // 检查是否成功转换为数字
            if (!isNaN(grade) && !isNaN(credit)) {
                total_credit += credit;
                total_grade += grade * credit;
            }
        }
        let grade_credit = total_grade / total_credit;
        let rounded_grade_credit = grade_credit.toFixed(2);
        let table =  document.getElementById("dataList");
        table.innerHTML +=
            "    <thead>\n" +
            "    <tr>\n" +
                        "<th>Header 1</th>"+
            "        <th>"+
                        "该表格下平均学分绩："+
            rounded_grade_credit+
            "</th>\n" +
            "    </tr>\n" +
            "    </thead>";
})();