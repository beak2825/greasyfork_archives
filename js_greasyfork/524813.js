// ==UserScript==
// @name        Shkolo++
// @namespace   Violentmonkey Scripts
// @match       https://app.shkolo.bg/diary*
// @grant       none
// @version     1.2.1
// @author      Skibidi Rizz
// @license     Sigma
// @description See the average grade for each subject.\nSee potential term/annual averages for stipends.\nExclude entry exams.
// @downloadURL https://update.greasyfork.org/scripts/524813/Shkolo%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/524813/Shkolo%2B%2B.meta.js
// ==/UserScript==

function calculateGrades() {
  if(!document.querySelector("#tableGrades")) return false;

  const localStorageKey = "excludeFirstGradeRows";

  function getExcludedRows() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || [];
  }

  function setExcludedRows(rows) {
    localStorage.setItem(localStorageKey, JSON.stringify(rows));
  }

  function toggleRowExclusion(rowNumber, exclude) {
    const excludedRows = getExcludedRows();
    if (exclude) {
      if (!excludedRows.includes(rowNumber)) excludedRows.push(rowNumber);
    } else {
      const index = excludedRows.indexOf(rowNumber);
      if (index > -1) excludedRows.splice(index, 1);
    }
    setExcludedRows(excludedRows);
  }

  function addCheckboxes() {
    const rows = document.querySelectorAll("#tableGrades > tbody > tr");
    const excludedRows = getExcludedRows();

    rows.forEach((row, index) => {
      const rowNumber = index + 1;
      const cell = row.querySelector("td:nth-child(2)");
      if (!cell || cell.querySelector('input[type="checkbox"]')) return;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.title = "Exclude first grade of term 1";
      checkbox.checked = excludedRows.includes(rowNumber);
      checkbox.style.marginRight = "8px";
      checkbox.style.transform = "scale(1.2)";
      checkbox.style.cursor = "pointer";
      checkbox.addEventListener("change", (e) => {
        toggleRowExclusion(rowNumber, e.target.checked);
        calculateGrades();
      });

      const label = document.createElement("label");
      label.style.marginLeft = "5px";
      label.appendChild(checkbox);
      cell.prepend(label);
    });
  }

  function calculateTermGrades(term, footerIndex) {
    const termCells = document.querySelectorAll(`#tableGrades > tbody > tr > td.${term}.solid-left-border`);
    const grades = [];
    const excludedRows = getExcludedRows();
    let calculated = 0;

    termCells.forEach((cell, index) => {
      const rowNumber = index + 1;
      const gradeCell = document.querySelector(`#tableGrades > tbody > tr:nth-child(${rowNumber}) > td.numVal.${term}`);
      const existingGrade = gradeCell?.children.length ? parseFloat(gradeCell.innerText) : null;

      if (existingGrade === null && cell.children.length) {
        const buttons = Array.from(cell.children);
        const gradeValues = buttons
          .map((button, i) => (excludedRows.includes(rowNumber) && i === 0 ? null : parseFloat(button.innerText)))
          .filter((v) => v !== null);

        const avg = gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length;
        if (gradeCell) gradeCell.innerText = avg.toFixed(2);
        grades.push(avg);
        calculated++;
      } else if (existingGrade !== null) {
        grades.push(existingGrade);
      }
    });

    if (grades.length) {
      const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
      const avgFloor = grades.reduce((a, b) => a + Math.floor(b), 0) / grades.length;
      const avgRound = grades.reduce((a, b) => a + Math.round(b), 0) / grades.length;

      const footerCell = document.querySelector(`#tableGrades > tfoot > tr > td:nth-child(${footerIndex})`);
      footerCell.innerHTML = `
        <a class="grade huge bold" title="Average of rounded down grades">${avgFloor.toFixed(2)}</a><br>
        <a class="grade huge bold" title="Average of grades as they are">${avg.toFixed(2)}</a><br>
        <a class="grade huge bold" title="Average of rounded grades">${avgRound.toFixed(2)}</a>
      `;
    }
  }

  function calculateAnnualGrades() {
    const term1Cells = document.querySelectorAll("#tableGrades > tbody > tr > td.term1.solid-left-border");
    const term2Cells = document.querySelectorAll("#tableGrades > tbody > tr > td.term2.solid-left-border");
    const grades = [];
    const excludedRows = getExcludedRows();
    let calculated = 0;

    term1Cells.forEach((cell, index) => {
      const rowNumber = index + 1;
      const term1Grade = cell.children.length
        ? parseFloat(document.querySelector(`#tableGrades > tbody > tr:nth-child(${rowNumber}) > td.numVal.term1`)?.innerText)
        : null;

      const term2Grade = term2Cells[index]?.children.length
        ? parseFloat(document.querySelector(`#tableGrades > tbody > tr:nth-child(${rowNumber}) > td.numVal.term2`)?.innerText)
        : null;

      if (term1Grade !== null || term2Grade !== null) {
        const avg = (term1Grade || 0) + (term2Grade || 0);
        const count = (term1Grade !== null) + (term2Grade !== null);
        const finalAvg = avg / count;
        const gradeCell = document.querySelector(`#tableGrades > tbody > tr:nth-child(${rowNumber}) > td.emptyAnnual.annualAssessment.solid-left-border`);

        if (gradeCell?.innerText === "") {
          gradeCell.innerText = finalAvg.toFixed(2);
          calculated++;
        }
        grades.push(finalAvg);
      }
    });

    if (grades.length) {
      const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
      const avgFloor = grades.reduce((a, b) => a + Math.floor(b), 0) / grades.length;
      const avgRound = grades.reduce((a, b) => a + Math.round(b), 0) / grades.length;

      const footerCell = document.querySelector(`#tableGrades > tfoot > tr > td:nth-child(8)`);
      footerCell.innerHTML = `
        <a class="grade huge bold" title="Annual average of rounded down grades">${avgFloor.toFixed(2)}</a><br>
        <a class="grade huge bold" title="Annual average of grades as they are">${avg.toFixed(2)}</a><br>
        <a class="grade huge bold" title="Annual average of rounded grades">${avgRound.toFixed(2)}</a>
      `;
    }
  }

  addCheckboxes();
  calculateTermGrades("term1", 4);
  calculateTermGrades("term2", 7);
  calculateAnnualGrades();

  return true;
}

let attempts = 0;
const interval = setInterval(() => {
  if (calculateGrades() || attempts > 10) {
    clearInterval(interval);
  }
  attempts++;
}, 1000);
