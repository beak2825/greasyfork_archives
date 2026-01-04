// ==UserScript==
// @name         FMP Colored Grades 
// @namespace    https://osama.dev
// @version      1.2
// @license      Simsem FC
// @description  Show colored grade numbers next to stars in player lists and player profile
// @match        https://footballmanagerproject.com/Team/Players
// @match        https://footballmanagerproject.com/Team/Training
// @match        https://footballmanagerproject.com/Transfers/TransfersList
// @match        https://footballmanagerproject.com/Transfers/TransfersInOut
// @match        https://footballmanagerproject.com/Transfers/TeamBids
// @match        https://footballmanagerproject.com/NationalTeam/NtPlayers
// @match        https://footballmanagerproject.com/Team/Player*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538297/FMP%20Colored%20Grades.user.js
// @updateURL https://update.greasyfork.org/scripts/538297/FMP%20Colored%20Grades.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getColor(grade) {
        const g = parseFloat(grade);
        if (g >= 16 && g < 18) return '#888';
        if (g >= 18 && g < 20) return '#00ccff';
        if (g >= 20 && g <= 23) return '#22dd66';
        if (g === 24) return '#ffaa00';
        if (g === 25) return '#ff4444';
        if (g > 25) return '#cc66ff';
        return '#ccc';
    }

    function insertGradeNumbers() {
        // معالجة الصفحات القديمة (قائمة اللاعبين)
        const spans = document.querySelectorAll('span.rating');
        spans.forEach(span => {
            if (!span.querySelector('.grade-number')) {
                const gradeVal = span.getAttribute('title');
                if (gradeVal) {
                    const numberSpan = document.createElement('span');
                    numberSpan.className = 'grade-number';
                    numberSpan.innerText = ` (${gradeVal})`;
                    numberSpan.style.color = getColor(gradeVal);
                    numberSpan.style.fontWeight = 'bold';
                    numberSpan.style.fontSize = '14px';
                    numberSpan.style.marginLeft = '4px';
                    span.appendChild(numberSpan);
                }
            }
        });

        // معالجة صفحة اللاعب المفرد
        const gradeCells = document.querySelectorAll('td');
        gradeCells.forEach(cell => {
            if (!cell.classList.contains('grade-colored') && cell.innerText.match(/^\d{1,2}(\.\d)?$/)) {
                const grade = parseFloat(cell.innerText);
                if (grade >= 15 && grade <= 30) {  // نطاق متوقع للدرجات
                    cell.style.color = getColor(grade);
                    cell.style.fontWeight = 'bold';
                    cell.classList.add('grade-colored');
                }
            }
        });
    }

    setInterval(insertGradeNumbers, 1500);
})();
