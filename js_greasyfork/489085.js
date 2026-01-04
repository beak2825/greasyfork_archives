// ==UserScript==
// @name         Canvas Grade Calculator
// @namespace    0612
// @version      1.7
// @description  Calculates the Letter Grade for Canvas
// @author       Evan Gao
// @match        http*://*.instructure.com/*
// @match        http*://*.canvas.*.edu/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489085/Canvas%20Grade%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/489085/Canvas%20Grade%20Calculator.meta.js
// ==/UserScript==

function getLetterGrade(percent) {
  let grade = percent.match(/\d+\.?\d+/)?.[0];
  if (!grade || percent.includes("(")) {
    return "";
  }
  if (grade >=97) {
    return " (A+)";
  } else if (grade >=93 && grade <97) {
    return " (A)";
  } else if (grade >=90 && grade <=92.99) {
    return " (A-)";
  } else if (grade >=87 && grade <=89.99) {
    return " (B+)";
  } else if (grade >=83 && grade<=86.99) {
    return " (B)"
  } else if (grade >=80 && grade <=82.99) {
    return " (B-)"
  } else if (grade >=77 && grade <=79.99) {
    return " (C+)"
  } else if (grade >=73 && grade <=76.99) {
    return " (C)"
  } else if (grade >=70 && grade <=72.99) {
    return " (C-)"
  } else if (grade >= 60) {
    return " (D)";
  } else if (grade < 60) {
    return " (F)";
  } else {
    return "";
  }
}

function addLetterGrade(element) {
  element.innerText += getLetterGrade(element.innerText);
}

function main() {
  document.querySelectorAll("td.percent").forEach(addLetterGrade);
  document.querySelectorAll(".final_grade .grade").forEach(addLetterGrade);
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  main();
} else {
  window.addEventListener("DOMContentLoaded", () => {
    main();
  });
}