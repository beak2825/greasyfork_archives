// ==UserScript==
// @name         Loyola Syllabus GPA Viewer
// @name:ja      Loyola Syllabus GPA Viewer
// @name:en      Loyola Syllabus GPA Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  脚本用于显示 GPA 数据
// @description:ja  GPAデータを表示するスクリプト
// @description:en  A script to display GPA data
// @author       Ruka
// @match        https://scs.cl.sophia.ac.jp/campusweb/campussquare.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sophia.ac.jp
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530216/Loyola%20Syllabus%20GPA%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/530216/Loyola%20Syllabus%20GPA%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GPA_DATA_URL = "https://raw.githubusercontent.com/Edgration/Sophia_GPA_Viewer/refs/heads/main/courses.json";

    console.log("脚本加载成功");
    function getCourseCodes() {
        let courses = document.querySelectorAll("td[align='center']");
        return Array.from(courses)
            .map(td => td.textContent.trim())
            .filter(text => /^[A-Z]{3}.*/.test(text));
    }
    function isTargetPage() {
        let firstRow = document.querySelector("table tr");
        if (firstRow) {
            let firstRowCells = Array.from(firstRow.querySelectorAll("th, td")).map(cell => cell.textContent.trim());
            return firstRowCells.includes("学期") && firstRowCells.includes("開講") && firstRowCells.includes("曜日・時限");
        }
        return false;
    }

    function fetchAndDisplayGPA() {
        GM_xmlhttpRequest({
            method: "GET",
            url: GPA_DATA_URL,
            onload: function(response) {
                const gpaData = JSON.parse(response.responseText);
                insertGPA(gpaData);
            }
        });
    }
    function insertGPA(gpaData) {
        let rows = document.querySelectorAll("tr");
        let table = document.querySelector("table");
        let headerRow = table.querySelector("tr");
        table.style.width = "90%";

        if (headerRow) {
            let headerTitles = ["セメスター", "平均GPA", "人数", "A", "B", "C", "D", "F", "他", "担当教員"];
            let headerCells = headerTitles.map(title => {
                let newHeaderCell = document.createElement("th");
                newHeaderCell.textContent = title;
                newHeaderCell.style.backgroundColor = "#AAAAEF";
                newHeaderCell.style.padding = "5px";
                newHeaderCell.style.textAlign = "center";
                if (title === "セメスター") {
                    newHeaderCell.style.width = "100px";
                } else if (title === "担当教員") {
                    newHeaderCell.style.width = "auto";
                } else {
                    newHeaderCell.style.width = "60px";
                }
                return newHeaderCell;
            });

            headerCells.forEach(cell => headerRow.appendChild(cell));
        }
        rows.forEach(row => {
            let cells = row.querySelectorAll("td");

            if (cells.length > 0) {
                let courseCodeCell = cells[4];
                if (courseCodeCell) {
                    let courseCode = courseCodeCell.innerText.trim();

                    let newColumns = {
                        semesterColumn: document.createElement("td"),
                        gpaColumn: document.createElement("td"),
                        studentsColumn: document.createElement("td"),
                        aColumn: document.createElement("td"),
                        bColumn: document.createElement("td"),
                        cColumn: document.createElement("td"),
                        dColumn: document.createElement("td"),
                        fColumn: document.createElement("td"),
                        othersColumn: document.createElement("td"),
                        professorsColumn: document.createElement("td")
                    };

                    Object.values(newColumns).forEach(col => {
                        col.style.background = "#dddddd";
                        col.style.border = "1px solid #ffffff";
                        col.style.padding = "3px";
                        col.style.fontSize = "14px";
                        col.style.whiteSpace = "pre-line";
                        col.style.textAlign = "center";
                    });

                    if (gpaData[courseCode]) {
                        gpaData[courseCode].forEach(gpa => {
                            newColumns.semesterColumn.textContent += `${gpa.semester}\n`;
                            newColumns.gpaColumn.textContent += `${gpa.Average_GPA.toFixed(1)}\n`;
                            newColumns.studentsColumn.textContent += `${gpa.students}\n`;
                            newColumns.professorsColumn.textContent += `${gpa.instructor}\n`;
                            newColumns.aColumn.textContent += `${gpa.A.toFixed(1)}%\n`;
                            newColumns.bColumn.textContent += `${gpa.B.toFixed(1)}%\n`;
                            newColumns.cColumn.textContent += `${gpa.C.toFixed(1)}%\n`;
                            newColumns.dColumn.textContent += `${gpa.D.toFixed(1)}%\n`;
                            newColumns.fColumn.textContent += `${gpa.F.toFixed(1)}%\n`;
                            newColumns.othersColumn.textContent += `${gpa.Others.toFixed(1)}%\n`;
                        });
                    }

                    Object.values(newColumns).forEach(col => row.appendChild(col));
                }
            }
        });
    }

    if (isTargetPage()) {
        fetchAndDisplayGPA();
    }
})();