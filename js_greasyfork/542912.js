// ==UserScript==
// @name            BUBT Annex Grade Calculator
// @version	        2.0
// @description     See instant GPA updates as you tweak course grades.
// @author          kurtnettle
// @homepageURL     https://github.com/kurtnettle/bubt-grade-calc/
// @supportURL      https://github.com/kurtnettle/bubt-grade-calc/
// @namespace       https://github.com/kurtnettle/bubt-grade-calc/
// @icon            https://raw.githubusercontent.com/kurtnettle/bubt-grade-calc/refs/heads/master/assets/icons/128x128.png
// @license         GPL-3.0-only
// @run-at          document-idle
// @include         https://annex.bubt.edu.bd/*
// @released        2025-07-16
// @updated         2025-07-17
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @downloadURL https://update.greasyfork.org/scripts/542912/BUBT%20Annex%20Grade%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/542912/BUBT%20Annex%20Grade%20Calculator.meta.js
// ==/UserScript==

(function(){'use strict';const LOG_TAG = "bubt-grade-calc";
const SEMESTER_WISE_PAGE_HEADER_SELECTOR = "div#message > div > h2";
const SEMESTER_WISE_TABLE_SELECTOR = "input#tabseven + label + div.tab > table";
const ALL_PREV_PAGE_HEADER_SELECTOR = "div#courseTbl > table#tableCrntAcdm";
const ALL_PREV_TABLE_SELECTOR = "div#courseTbl > table#tableCrntAcdm";
const GRADE_POINTS = {
    "A+": 4.0,
    A: 3.75,
    "A-": 3.5,
    "B+": 3.25,
    B: 3.0,
    "B-": 2.75,
    "C+": 2.5,
    C: 2.25,
    D: 2.0,
    F: 0.0,
};function cleanBracketText(text) {
    const pattern = /\(.*.\)/gi;
    return text.replace(pattern, "");
}
function getSGPAValue(text) {
    // SGPA: 3.00
    // SGPA: 3.00 (2.52)
    const parts = text.split(":");
    try {
        return parseFloat(parts[1].match(/\(([^)]+)\)/)?.[1] || parts[1]);
    }
    catch (error) {
        console.error(`[${LOG_TAG}] Failed to extract SGPA from '${text}':`, error.message);
    }
}
function updateCellContent(cell, condition, oldValue, newValue) {
    if (!cell)
        return;
    cell.textContent = condition ? newValue.toString() : oldValue.toString();
}
function genGradeDropDown(credit, defaultGrade, onChange) {
    const select = document.createElement("select");
    select.setAttribute("data-credit", credit);
    // empty selection for missing grade :/
    const option = document.createElement("option");
    option.value = "0.00";
    option.textContent = "-";
    option.selected = defaultGrade === "";
    select.appendChild(option);
    Object.keys(GRADE_POINTS).forEach((grade) => {
        const option = document.createElement("option");
        option.value = GRADE_POINTS[grade];
        option.textContent = grade;
        if (grade === defaultGrade)
            option.selected = true;
        select.appendChild(option);
    });
    select.addEventListener("change", (e) => {
        // updateGradeTexts();
        onChange();
    });
    return select;
}
function addGradeDropdownToTable(table, isAllPrevCourseTable, onChange) {
    if (!table) {
        console.info(`[${LOG_TAG}] : no table found.`);
        return;
    }
    let currSemesterNo = 0;
    const tableRows = table.querySelectorAll("tr");
    tableRows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        if (isAllPrevCourseTable) {
            if (tds.length !== 5) {
                if (row.textContent?.includes("SEMESTER"))
                    currSemesterNo++;
                return;
            }
        }
        else {
            if (tds.length < 3) {
                if (row.textContent?.includes("Semester"))
                    currSemesterNo++;
                return;
            }
        }
        let creditCell;
        let gradeCell;
        if (isAllPrevCourseTable) {
            creditCell = tds[2];
            gradeCell = tds[4];
        }
        else {
            creditCell = tds[2];
            gradeCell = row.querySelector("th");
        }
        if (!creditCell || !gradeCell)
            return;
        const courseCode = tds[0];
        courseCode?.setAttribute("data-semester-number", currSemesterNo.toString());
        const grade = gradeCell?.textContent?.trim() || "";
        const credit = creditCell?.textContent?.trim() || "0";
        const gradeDropdown = genGradeDropDown(credit, grade, onChange);
        gradeCell.innerHTML = "";
        gradeCell.appendChild(gradeDropdown);
    });
}
function addTotalTextRowToTable(table, rowIndex, totalCredit, totalPoints, semesterNo, isAllPrevCourseTable) {
    const newRow = table.insertRow(rowIndex);
    newRow.align = "center";
    if (!isAllPrevCourseTable)
        newRow.style.backgroundColor = "#F0F0F0";
    newRow.setAttribute("data-semester-number", semesterNo);
    if (isAllPrevCourseTable) {
        // dummy cells :/
        let dummy = document.createElement("th");
        newRow.appendChild(dummy);
    }
    const totalTextCell = newRow.insertCell();
    totalTextCell.colSpan = 2;
    totalTextCell.style.textAlign = "right";
    totalTextCell.style.fontWeight = "bold";
    totalTextCell.textContent = "Total";
    const totalCreditCell = newRow.insertCell();
    totalCreditCell.textContent = totalCredit;
    if (isAllPrevCourseTable) {
        // dummy cells :/
        let dummy = document.createElement("td");
        newRow.appendChild(dummy);
    }
    const totalPointsCell = newRow.insertCell();
    totalPointsCell.textContent = totalPoints;
}function getGradeTable$1() {
    return document.querySelector(ALL_PREV_TABLE_SELECTOR);
}
function addTableTotalRows$1(table) {
    if (!table)
        return;
    const semesterHeaders = table.querySelectorAll("tr > td[colspan='7']");
    if (semesterHeaders.length === 0)
        return;
    let semesterCount = 1;
    const rows = table.rows;
    semesterHeaders.forEach((header) => {
        const rowIndex = header.closest("tr")?.rowIndex;
        const rowText = rows[rowIndex]?.textContent?.trim();
        if (!rowIndex || rowIndex < 2 || !rowText.includes("SGPA"))
            return;
        addTotalTextRowToTable(table, rowIndex, 0, 0, semesterCount, true);
        semesterCount++;
    });
}
function getImprovedGrade$1(table, courseCode) {
    const xpath = `.//td[normalize-space(text())='${courseCode}']/parent::tr`;
    const results = document.evaluate(xpath, table, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    let courseSemester = 1000;
    let courseBestGrade = 0;
    let node = results.iterateNext();
    while (node) {
        let courseCodeCell = node.querySelector("td");
        const semesterNo = parseInt(courseCodeCell.getAttribute("data-semester-number"));
        let gradePoint = "0";
        let gradePointCell = node.querySelector("select");
        if (gradePointCell) {
            gradePoint = gradePointCell?.value || "0";
        }
        else {
            gradePointCell = node.querySelector("td");
            gradePoint = gradePointCell?.textContent;
        }
        if (semesterNo) {
            courseSemester = Math.min(courseSemester, semesterNo);
            courseBestGrade = Math.max(courseBestGrade, parseFloat(gradePoint));
        }
        node = results.iterateNext();
    }
    return { courseSemester, courseBestGrade };
}
function updateSemesterTotalCreditAndGradePoints$1(mainTable, tableStart) {
    let semesterPoints = 0;
    let semesterCredit = 0;
    let nonSemesterPoints = 0;
    let nonSemesterCredit = 0;
    let currElem = tableStart.parentElement?.nextElementSibling;
    // annex may do some bs, we never know
    let iterations = 0;
    const MAX_ITERATIONS = 30;
    let currElemText = currElem?.textContent?.trim();
    while (currElem &&
        currElemText !== "" &&
        !currElemText?.includes("Total") &&
        iterations < MAX_ITERATIONS) {
        const courseCodeCell = currElem.querySelector("td:nth-child(2)");
        const courseCode = courseCodeCell?.textContent?.trim() || "";
        const semesterNo = parseInt(courseCodeCell?.getAttribute("data-semester-number") || "0");
        if (courseCode === "") {
            console.warn(`[${LOG_TAG}] - page semester-wise: empty course code found from row <${currElemText}>`);
            currElem = currElem.nextElementSibling;
            iterations++;
            continue;
        }
        // retake / improvement course code will occur more than once
        const { courseSemester, courseBestGrade } = getImprovedGrade$1(mainTable, courseCode);
        const select = currElem.querySelector("select");
        if (select) {
            const creditVal = parseFloat(select.getAttribute("data-credit") || "0");
            const gradeVal = parseFloat(select.value) || 0;
            if (isNaN(creditVal) || isNaN(gradeVal)) {
                console.info(`[${LOG_TAG}] - page semester-wise: Invalid credit (${creditVal}) or grade value (${gradeVal}) found -_-`);
            }
            else if (select.options[select.selectedIndex].text !== "-") {
                const points = creditVal * courseBestGrade;
                if (courseSemester !== semesterNo) {
                    nonSemesterPoints = points;
                    nonSemesterCredit += creditVal;
                }
                else {
                    semesterCredit += creditVal;
                    semesterPoints += points;
                }
            }
        }
        if (currElem.nextElementSibling) {
            currElem = currElem.nextElementSibling;
            currElemText = currElem.textContent?.trim();
        }
        iterations++;
    }
    let totalCells = currElem?.querySelectorAll("td");
    if (totalCells?.length === 4) {
        updateCellContent(totalCells[1], nonSemesterCredit !== 0, semesterCredit, `${semesterCredit} (${nonSemesterCredit})`);
        updateCellContent(totalCells[3], nonSemesterPoints !== 0, semesterPoints, `${semesterPoints} (${nonSemesterPoints})`);
    }
    return {
        currElem,
        semesterCredit,
        nonSemesterCredit,
        semesterPoints,
        nonSemesterPoints,
    };
}
function updateCgpaText$1() {
    const table = getGradeTable$1();
    if (!table)
        return;
    let currSemesterNo = 1;
    let totalPoints = 0;
    const semesters = table.querySelectorAll("tr > td[colspan='7']");
    semesters.forEach((row) => {
        const gradeCell = row.querySelector("strong");
        const currentText = gradeCell?.textContent?.trim().split("and") || "";
        if (currentText.length !== 2)
            return;
        const [SGPAText, CGPAText] = currentText;
        const oldCgpaCleanedText = cleanBracketText(CGPAText);
        const oldCGPA = oldCgpaCleanedText.split(":")[1]?.trim();
        const oldPointText = `${SGPAText} and ${oldCgpaCleanedText}`;
        try {
            const sgpa = getSGPAValue(SGPAText || "");
            if (!sgpa)
                return;
            totalPoints += sgpa;
            const newCGPA = (totalPoints / currSemesterNo).toFixed(2);
            updateCellContent(gradeCell, oldCGPA !== newCGPA, oldPointText, `${SGPAText} and ${oldCgpaCleanedText} (${newCGPA})`);
        }
        catch (error) {
            console.error(`[${LOG_TAG}] - page semester-wise:`, `Failed to update CGPA of Semester ${currSemesterNo}:`, error);
        }
        finally {
            currSemesterNo++;
        }
    });
}
function updateSGPAText$1(tableStart, newSGPA) {
    const sGPACell = tableStart?.nextElementSibling?.querySelector("strong");
    if (!sGPACell || sGPACell?.textContent?.includes("SEMESTER"))
        return;
    const currentText = sGPACell.textContent?.trim().split("and") || "";
    const currentCleanedText = cleanBracketText(currentText[0]);
    const oldSGPA = currentCleanedText.split(":")[1]?.trim() || "";
    const oldText = `${currentCleanedText} and ${currentText[1]}`;
    const newText = `${currentCleanedText} (${newSGPA}) and ${currentText[1]}`;
    updateCellContent(sGPACell, newSGPA !== oldSGPA, oldText, newText);
}
function calcSgpa$1() {
    const table = getGradeTable$1();
    if (!table)
        return;
    const semesters = table.querySelectorAll("tr > td[colspan='7']");
    semesters.forEach((row) => {
        const x = updateSemesterTotalCreditAndGradePoints$1(table, row);
        const sgpa = x.semesterPoints / x.semesterCredit || 0;
        updateSGPAText$1(x.currElem, sgpa.toFixed(2));
    });
}
function updateGradeTexts$1() {
    calcSgpa$1();
    updateCgpaText$1();
}
function checkIfUserOnAllPrevPage() {
    const isHeaderPresent = document
        .querySelector(ALL_PREV_PAGE_HEADER_SELECTOR)
        ?.textContent?.includes("previous");
    const isUrlMatch = document.URL.includes("38c366c15da2633c430828f8de90df5a");
    const isOnAllPrevPage = isHeaderPresent || isUrlMatch;
    console.info(`[${LOG_TAG}] - User ${isOnAllPrevPage ? "is" : "is not"} on all-prev page`);
    return isOnAllPrevPage;
}
function setupAllPrevGradeTable() {
    console.info(`[${LOG_TAG}] - page all-prev: starting initial processing`);
    const table = getGradeTable$1();
    if (!table) {
        console.info(`[${LOG_TAG}] - page all-prev: no table found.`);
        return;
    }
    addGradeDropdownToTable(table, true, updateGradeTexts$1);
    addTableTotalRows$1(table);
    updateGradeTexts$1();
    console.info(`[${LOG_TAG}] - page all-prev: finished initial processing.`);
}function getGradeTable() {
    return document.querySelector(SEMESTER_WISE_TABLE_SELECTOR);
}
function addTableTotalRows(table) {
    if (!table)
        return;
    const semesterHeaders = table.querySelectorAll("tr > th[colspan='4']");
    if (semesterHeaders.length === 0)
        return;
    let semesterCount = 1;
    const rows = table.rows;
    semesterHeaders.forEach((header) => {
        const rowIndex = header.closest("tr")?.rowIndex;
        if (!rowIndex || rowIndex < 2)
            return;
        addTotalTextRowToTable(table, rowIndex, 0, 0, semesterCount, false);
        semesterCount++;
    });
    // last semester
    const lastRowIndex = rows.length;
    addTotalTextRowToTable(table, lastRowIndex, 0, 0, semesterCount, false);
}
function getImprovedGrade(table, courseCode) {
    const xpath = `.//td[text()='${courseCode}']/parent::tr`;
    const results = document.evaluate(xpath, table, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    let courseSemester = 1000;
    let courseBestGrade = 0;
    let node = results.iterateNext();
    while (node) {
        let courseCodeCell = node.querySelector("td");
        const semesterNo = parseInt(courseCodeCell.getAttribute("data-semester-number"));
        let gradePoint = "0";
        let gradePointCell = node.querySelector("select");
        if (gradePointCell) {
            gradePoint = gradePointCell?.value || "0";
        }
        else {
            gradePointCell = node.querySelector("td");
            gradePoint = gradePointCell?.textContent;
        }
        if (semesterNo) {
            courseSemester = Math.min(courseSemester, semesterNo);
            courseBestGrade = Math.max(courseBestGrade, parseFloat(gradePoint));
        }
        node = results.iterateNext();
    }
    return { courseSemester, courseBestGrade };
}
function updateSemesterTotalCreditAndGradePoints(mainTable, tableStart) {
    let semesterPoints = 0;
    let semesterCredit = 0;
    let nonSemesterPoints = 0;
    let nonSemesterCredit = 0;
    let currElem = tableStart.parentElement?.nextElementSibling;
    let hasReachedTableEnd = false;
    // annex may do some bs, we never know
    let iterations = 0;
    const MAX_ITERATIONS = 30;
    while (currElem &&
        !currElem.textContent?.includes("Semester") &&
        iterations < MAX_ITERATIONS) {
        const courseCodeCell = currElem.querySelector("td");
        const courseCode = courseCodeCell?.textContent?.trim() || "";
        const semesterNo = parseInt(courseCodeCell?.getAttribute("data-semester-number") || "0");
        // retake / improvement course code will occur more than once
        const { courseSemester, courseBestGrade } = getImprovedGrade(mainTable, courseCode);
        const select = currElem.querySelector("select");
        if (select) {
            const creditVal = parseFloat(select.getAttribute("data-credit") || "0");
            const gradeVal = parseFloat(select.value) || 0;
            if (isNaN(creditVal) || isNaN(gradeVal)) {
                console.info(`[${LOG_TAG}] - page semester-wise: Invalid credit (${creditVal}) or grade value (${gradeVal}) found -_-`);
            }
            else if (select.options[select.selectedIndex].text !== "-") {
                const points = creditVal * courseBestGrade;
                if (courseSemester !== semesterNo) {
                    nonSemesterPoints = points;
                    nonSemesterCredit += creditVal;
                }
                else {
                    semesterCredit += creditVal;
                    semesterPoints += points;
                }
            }
        }
        if (currElem.nextElementSibling) {
            currElem = currElem.nextElementSibling;
        }
        else {
            hasReachedTableEnd = true;
        }
        iterations++;
    }
    let semesterLastCell = currElem?.previousElementSibling;
    let totalCells = semesterLastCell?.querySelectorAll("td");
    if (hasReachedTableEnd)
        totalCells = currElem?.querySelectorAll("td");
    if (totalCells?.length === 3) {
        updateCellContent(totalCells[1], nonSemesterCredit !== 0, semesterCredit, `${semesterCredit} (${nonSemesterCredit})`);
        updateCellContent(totalCells[2], nonSemesterPoints !== 0, semesterPoints, `${semesterPoints} (${nonSemesterPoints})`);
    }
    return {
        semesterCredit,
        nonSemesterCredit,
        semesterPoints,
        nonSemesterPoints,
    };
}
function updateCgpaText() {
    const table = getGradeTable();
    if (!table)
        return;
    let currSemesterNo = 1;
    let totalPoints = 0;
    const semesters = table.querySelectorAll("tr > th[colspan='4']");
    semesters.forEach((row) => {
        const gradePointCells = row.parentElement?.nextElementSibling?.querySelectorAll("th");
        if (!gradePointCells || gradePointCells.length !== 2) {
            console.warn(`[${LOG_TAG}] - page semester-wise:`, `Skipping semester ${currSemesterNo} (invalid structure):`, "gradePointCells: ", gradePointCells);
            currSemesterNo++;
            return;
        }
        const [sgpaCell, cgpaCell] = gradePointCells;
        const oldCgpaText = cgpaCell.textContent || "";
        const oldCgpaCleanedText = cleanBracketText(oldCgpaText);
        const oldCGPA = oldCgpaCleanedText.split(":")[1]?.trim();
        try {
            const sgpa = getSGPAValue(sgpaCell.textContent || "");
            if (sgpa)
                totalPoints += sgpa;
            if (oldCGPA) {
                const newCGPA = (totalPoints / currSemesterNo).toFixed(2);
                if (oldCGPA !== newCGPA) {
                    cgpaCell.textContent = `${oldCgpaCleanedText} (${newCGPA})`;
                }
                else {
                    cgpaCell.textContent = oldCgpaCleanedText;
                }
            }
        }
        catch (error) {
            console.error(`[${LOG_TAG}] - page semester-wise:`, `Failed to update CGPA of Semester ${currSemesterNo}:`, error);
        }
        finally {
            currSemesterNo++;
        }
    });
}
function updateSGPAText(tableStart, newSemesterSGPA) {
    const sGPACell = tableStart?.parentElement?.nextElementSibling?.querySelector("th");
    if (!sGPACell)
        return;
    const oldText = sGPACell.textContent?.trim() || "";
    const oldCleanedText = cleanBracketText(oldText);
    const oldSGPA = oldCleanedText.split(":")[1]?.trim() || "";
    const newText = `${oldCleanedText} (${newSemesterSGPA})`;
    updateCellContent(sGPACell, newSemesterSGPA !== oldSGPA, oldCleanedText, newText);
}
function calcSgpa() {
    const table = getGradeTable();
    if (!table)
        return;
    const semesters = table.querySelectorAll("tr > th[colspan='4']");
    semesters.forEach((row) => {
        const x = updateSemesterTotalCreditAndGradePoints(table, row);
        const sgpa = (x.semesterPoints / x.semesterCredit).toFixed(2);
        updateSGPAText(row, sgpa);
    });
}
function updateGradeTexts() {
    calcSgpa();
    updateCgpaText();
}
function checkIfUserOnSemesterWisePage() {
    const isHeaderPresent = document
        .querySelector(SEMESTER_WISE_PAGE_HEADER_SELECTOR)
        ?.textContent?.includes("Info");
    const isUrlMatch = document.URL.includes("course_result_info");
    const isOnSemesterPage = isHeaderPresent || isUrlMatch;
    console.info(`[${LOG_TAG}] - User ${isOnSemesterPage ? "is" : "is not"} on semester-wise page`);
    return isOnSemesterPage;
}
function setupSemesterWiseGradeTable() {
    console.info(`[${LOG_TAG}] - page semester-wise: starting initial processing`);
    const table = getGradeTable();
    if (!table) {
        console.info(`[${LOG_TAG}] - page all-prev: no table found.`);
        return;
    }
    addGradeDropdownToTable(table, false, updateGradeTexts);
    addTableTotalRows(table);
    updateGradeTexts();
    console.info(`[${LOG_TAG}] - page semester-wise: finished initial processing.`);
}if (document.readyState === "complete") {
    main();
}
else {
    document.addEventListener("DOMContentLoaded", main);
    window.addEventListener("load", main);
}
function main() {
    if (checkIfUserOnAllPrevPage())
        setupAllPrevGradeTable();
    else if (checkIfUserOnSemesterWisePage())
        setupSemesterWiseGradeTable();
}})();