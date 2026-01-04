// ==UserScript==
// @name        Vic GPA
// @namespace   Violentmonkey Scripts
// @match *://student-records.vuw.ac.nz/*.P_FacStuInfo
// @version     1.0
// @author      geoCos
// @grant       unsafeWindow
// @description Adds a GPA section to vic's student records academic history page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456021/Vic%20GPA.user.js
// @updateURL https://update.greasyfork.org/scripts/456021/Vic%20GPA.meta.js
// ==/UserScript==


/** Get data from DOM */
const termTables = [
    ...document.querySelectorAll('table[summary*="degree history"]'),
  ].slice(1);

// can't find dom elements
if (termTables[0] === undefined) process.exit(1);

  
  const terms = termTables.map(
    (table) => table.querySelector('td.dddefault').textContent,
  );
  
   let courseData = termTables.reduce((courses, table) => {
    const term = table.querySelector('td.dddefault').textContent;
    const gradeTable = table.nextElementSibling;
  
    const headers = [...gradeTable.querySelectorAll('th.ddheader')].map(
      (th) => th.textContent,
    );

    const tableRows = [...gradeTable.querySelectorAll('tr:not(:first-of-type)')].map(
      (row) => {
        const cells = [...row.querySelectorAll('td')];
  
        return cells.reduce(
          (course, dataCell, index) => {
            course[headers[index]] = dataCell.textContent.trim();
            return course;
          },
          { Term: term },
        );
      },
    );
  
    return courses.concat(...tableRows);
  }, []);

  unsafeWindow.courseData = courseData;

  /** Perform calculations */
  const gpas = terms.reduce((gpas, term) => {
    const courses = courseData.filter(({ Term }) => Term === term);
    
    const gradePoints = courses
      .map(({ GradePts }) => parseInt(GradePts))
      .filter((grade) => !isNaN(grade) && grade !== 0);
  
    const sum = gradePoints.reduce((a, b) => a + b, 0);
  
    if (gradePoints.length) {
      gpas[term] = sum / gradePoints.length;
    }
  
    (accumulator, term) => {
      const courses = courseData.filter(({ Term }) => Term === term);
  
      const gradePoints = courses
        .map(({ GradePts }) => parseInt(GradePts))
        .filter((x) => !isNaN(x) && x !== 0);
  
      const sum = gradePoints.reduce((a, b) => a + b, 0);
    
      if (gradePoints.length) {
        accumulator[term] = sum / gradePoints.length;
      }
    
      return accumulator;
    }
    return gpas;
  }, {});
  
  const sum = Object.values(gpas).reduce((a, b) => a + b, 0);
  const countedTerms = Object.entries(gpas).length;
  const overallGpa = sum / countedTerms;
  const roundedOverallGpa = getRoundedGpa(overallGpa);
  const overallLetterGrade = getLetterGrade(overallGpa);
  
  /** Insert new Table */
  const qualificationStatusTable = document.querySelector(
    'table[summary*="qualification status"]'
  );
  
  const gpaTableRows = terms
    .map((term) => {
      const gpa = getRoundedGpa(gpas[term]);
      const letterGrade = getLetterGrade(gpas[term]);
  
      return `
      <tr>
        <td  class="dddefault">${term}</td>
        <td  class="dddefault">${isNaN(gpa) ? 'N/A' : gpa}</td>
        <td  class="dddefault">${letterGrade ?? 'N/A'}</td>
      </tr>
    `;
    })
    .join('');
  
  const gpaTableHTML = `
      <br>
      <hr>
      <table class='datadisplaytable' id='gpa_table' summary="This table displays the student gpa status information." style="width: 100%">
        <caption class="captiontext"><a name="gen_acad_det">GPA Status Overall: ${roundedOverallGpa}, ${overallLetterGrade}</a> &nbsp;&nbsp;&nbsp;<a href="#top" alt="TOP">-Top-</a></caption>
        <tbody>
        <tr>
          <th colspan=1 class=ddheader scope=col>Term</th>
          <th colspan=1 class=ddheader scope=col>GPA</th>
          <th colspan=1 class=ddheader scope=col>Closest Letter Grade</th>
        </tr>
        ${gpaTableRows}
      </tbody></table>
  `;
  
  qualificationStatusTable.insertAdjacentHTML('afterend', gpaTableHTML);
  
  /**
   * Utilities
   */
  function getRoundedGpa(gpa) {
    return Math.round((gpa + Number.EPSILON) * 100) / 100;
  }
  
  function getLetterGrade(gpa) {
    return ['D', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'][
      Math.round(gpa)
    ];
  }


