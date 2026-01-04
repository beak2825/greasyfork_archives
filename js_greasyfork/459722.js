// ==UserScript==
// @name         Tạo Điểm TBHT
// @namespace    https://congdaotao.tmu.edu.vn/student
// @version      4
// @description  tạo GPA cho TMUer
// @author       VBF
// @license MIT
// @match        https://congdaotao.tmu.edu.vn/student/marks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459722/T%E1%BA%A1o%20%C4%90i%E1%BB%83m%20TBHT.user.js
// @updateURL https://update.greasyfork.org/scripts/459722/T%E1%BA%A1o%20%C4%90i%E1%BB%83m%20TBHT.meta.js
// ==/UserScript==

  function addscore() {
  let totalScore = 0;
let totalCredits = 0;

document.querySelectorAll('table tbody tr').forEach(row => {
  let cells = row.getElementsByTagName('td');
  if (cells[5] && cells[5].innerText && !isNaN(parseFloat(cells[5].innerText)) && parseFloat(cells[5].innerText) !== 0.0) {
    let scoreValue = parseFloat(cells[5].innerText);
    if (cells[3] && cells[3].innerText && !isNaN(parseInt(cells[3].innerText)) && parseInt(cells[3].innerText) !== 1) {
      let creditsValue = parseInt(cells[3].innerText);
      totalCredits += creditsValue;
      totalScore += scoreValue * creditsValue;
    }
  }
});

let averageScore = totalScore / totalCredits;
let table = document.querySelector('table');
let newRow = table.insertRow(-1);
newRow.classList.add("MuiTableRow-root", "css-1du9sao-MuiTableRow-root");

let newCell1 = newRow.insertCell(0);
newCell1.colSpan = 4;
newCell1.textContent = "Tổng số tín chỉ: " + totalCredits;

let newCell2 = newRow.insertCell(1);
newCell2.colSpan = 3;
newCell2.textContent = "Điểm trung bình học tập: " + averageScore.toFixed(4);
}
setTimeout(addscore, 3000);