// ==UserScript==
// @name         Canvas Grade Calculator
// @namespace    0612
// @version      1.5
// @description  Calculates the Letter Grade for Canvas
// @author       SaturnKai
// @match        *.instructure.com/*
// @downloadURL https://update.greasyfork.org/scripts/411709/Canvas%20Grade%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/411709/Canvas%20Grade%20Calculator.meta.js
// ==/UserScript==

const moduleGradeElement = document.getElementsByClassName('student_assignment final_grade');
const gradePageElement = document.getElementsByClassName('percent');

function returnGrade(grade) {
    if (grade >= 90) {
        return " (A)";
    } else if (grade >= 80 && grade <= 89.99) {
        return " (B)";
    } else if (grade >= 70 && grade <= 79.99) {
        return " (C)";
    } else if (grade >= 60 && grade <= 69.99) {
        return " (D)";
    } else if (grade <= 59.99) {
        return " (F)";
    } else {
        return "";
    }
}

function calculateGradePage() {
    var classes = document.getElementsByClassName('course_details student_grades')[0].rows.length;
    for (var i = 0; i < classes; i++) {
        var pageGrade = gradePageElement[i].innerText.split('%')[0];
        gradePageElement[i].innerText = gradePageElement[i].innerText + returnGrade(pageGrade);
    }
}

window.onload = function () {
    if (document.URL.includes('grades') && !document.URL.includes('courses')) {
        calculateGradePage();
    } else if (moduleGradeElement[1].innerHTML.includes("(")) {

    } else {
        let moduleGrade = moduleGradeElement[1].innerText.split(' ')[1].split('%')[0];
        moduleGradeElement[1].innerText = moduleGradeElement[1].innerText + returnGrade(moduleGrade);
    }
}
