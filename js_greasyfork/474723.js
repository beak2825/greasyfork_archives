// ==UserScript==
// @name         GPACalculator
// @version      0.7
// @description  Calculate GPA on plus portals
// @author       Andrew Miller
// @match        https://www.plusportals.com/*
// @match        https://plusportals.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @namespace https://greasyfork.org/users/1167790
// @downloadURL https://update.greasyfork.org/scripts/474723/GPACalculator.user.js
// @updateURL https://update.greasyfork.org/scripts/474723/GPACalculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const gpaWeights = {
  "A+": 4.33,
  "A": 4.17,
  "A-": 4.00,
  "B+": 3.67,
  "B": 3.33,
  "B-": 3.00,
  "C+": 2.67,
  "C": 2.33,
  "C-": 2.00,
  "D+": 1.67,
  "D": 1.33,
  "D-": 1.00,
  "F": 0.00
};

    function getLetterGrade(gpa) {
        let letterGrade = 'F'; // Default to F
        for (const [grade, weight] of Object.entries(gpaWeights)) {
            if (gpa >= weight) {
                letterGrade = grade;
                break;
                }
            }
        return letterGrade;
    }


let markingPeriodInput = null;
let lastuwGPA;
let lastwGPA;

async function checkElements(newInput) {
    const elements = document.querySelectorAll('[title="Subject"], [title="Grade"]');
    if(elements.length > 0) {
            //clearInterval(intervalId);
            markingPeriodInput = newInput;
            const subjectGradePairs = {};
            let currentSubject = '';
            let currentGrade = '';
            let wTotalGPA = 0;
            let uwTotalGPA = 0;
            let elementCount = 0;
            let subjectsWithoutGrades = [];

        elements.forEach(element => {
            const title = element.getAttribute('title');

            if (title === 'Subject') {
                currentSubject = element.textContent.trim();
                //console.log(currentSubject);
                subjectsWithoutGrades.push(currentSubject);
            } else if (title === 'Grade') {
                currentGrade = element.textContent.trim();
                if(currentGrade !== '') {
                    subjectGradePairs[currentSubject] = currentGrade;
                    const indexOfSubject = subjectsWithoutGrades.indexOf(currentSubject);
                    if (indexOfSubject > -1) {
                        subjectsWithoutGrades.splice(indexOfSubject, 1);
                    }
                    let gradeWeight = gpaWeights.hasOwnProperty(currentGrade) ? gpaWeights[currentGrade] : 0;
                    uwTotalGPA += gradeWeight;
                    if(gradeWeight >= 2.00) {
                        if ((currentSubject.includes('Hnrs') || currentSubject.includes('Hon') || currentSubject.includes('H '))) gradeWeight += 1;
                        if ((currentSubject.includes('AP'))) gradeWeight += 1.5;
                    }

                    wTotalGPA += gradeWeight;
                    elementCount++;
               }
            }
        });

        const wAverageGPA = elementCount > 0 ? (wTotalGPA / elementCount).toFixed(2) : 0;
        const uwAverageGPA = elementCount > 0 ? (uwTotalGPA / elementCount).toFixed(2) : 0;
        if((lastwGPA !== wAverageGPA) || (lastuwGPA !== uwAverageGPA)) {
            lastwGPA = wAverageGPA;
            lastuwGPA = uwAverageGPA;
            const rows = document.querySelectorAll('tbody[role="rowgroup"] tr');
            rows.forEach(row => {
                const subjectCell = row.querySelector('[title="Subject"]');
                if (subjectCell) {
                    const subjectText = subjectCell.textContent.trim();
                    if (subjectsWithoutGrades.includes(subjectText)) {
                        row.remove();
                        console.log("ROW DELETED");
                    } 
                }
            });

            let tbody = document.querySelector('tbody[role="rowgroup"]');

            let newRow = document.createElement('tr');
            let newCell1 = document.createElement('td');
            let newCell2 = document.createElement('td');
            let newCell3 = document.createElement('td');

            newRow.setAttribute('role', 'row');
            newCell1.setAttribute('role', 'gridcell');
            newCell2.setAttribute('role', 'gridcell');
            newCell3.setAttribute('role', 'gridcell');
            newRow.setAttribute('role', 'row');
            newCell1.setAttribute('role', 'gridcell');
            newCell2.setAttribute('role', 'gridcell');
            newCell3.setAttribute('role', 'gridcell');
            newCell1.innerHTML = 'Unweighted GPA';
            newCell2.innerHTML = uwAverageGPA;
            newCell3.innerHTML = getLetterGrade(uwAverageGPA);
            newRow.appendChild(newCell1);
            newRow.appendChild(newCell2);
            newRow.appendChild(newCell3);

            if (tbody.firstChild) {
                tbody.insertBefore(newRow, tbody.firstChild);
            } else {
                tbody.appendChild(newRow);
            }


            newRow = document.createElement('tr');
            newCell1 = document.createElement('td');
            newCell2 = document.createElement('td');
            newCell3 = document.createElement('td');


            newRow.setAttribute('role', 'row');
            newCell1.setAttribute('role', 'gridcell');
            newCell2.setAttribute('role', 'gridcell');
            newCell3.setAttribute('role', 'gridcell');
            newRow.setAttribute('role', 'row');
            newCell1.setAttribute('role', 'gridcell');
            newCell2.setAttribute('role', 'gridcell');
            newCell3.setAttribute('role', 'gridcell');
            newCell1.innerHTML = 'Weighted GPA';
            newCell2.innerHTML = wAverageGPA;
            newCell3.innerHTML = getLetterGrade(wAverageGPA);
            newRow.appendChild(newCell1);
            newRow.appendChild(newCell2);
            newRow.appendChild(newCell3);
            if (tbody.firstChild) {
                tbody.insertBefore(newRow, tbody.firstChild);
            } else {
                tbody.appendChild(newRow);
            }

        }

    }
}

const fetchMarkingPeriod = () => {
    let newInput = document.querySelectorAll('[title="Subject"], [title="Grade"]');
    if((newInput != markingPeriodInput)) {
        checkElements(newInput);
    }

}
    const intervalId = setInterval(fetchMarkingPeriod, 750);

})();