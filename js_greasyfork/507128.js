// ==UserScript==
// @name        Attendance Percentage for IIITA ERP
// @namespace   Violentmonkey Scripts
// @match       https://erp.iiita.ac.in/*
// @exclude     https://erp.iiita.ac.in/*feedback*
// @grant       none
// @version     1.2.2
// @author      rakim-0
// @license     gpl-3.0
// @description 25/11/2024, 19:19 PM
// @downloadURL https://update.greasyfork.org/scripts/507128/Attendance%20Percentage%20for%20IIITA%20ERP.user.js
// @updateURL https://update.greasyfork.org/scripts/507128/Attendance%20Percentage%20for%20IIITA%20ERP.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to calculate attendance percentage
    function calculatePercentage(fraction) {
        if (fraction.includes('Sec')) {
          fraction = fraction.slice(0, -5)
        }
        const [attended, total] = fraction.split('/').map(Number);
        const ret = ((attended / total) * 100).toFixed(2);
        if (ret === "NaN" || ret === "Infinity") {
            return "-";
        }
        return ret+'%';
    }

    // Find the specific table
    const targetTables = document.querySelectorAll('table.interface2');
    if (!targetTables) return;
    targetTables.forEach((targetTable, index) => {
      // Add new header for Attendance Percentage
    const headerRow = targetTable.querySelector('tr');
    const newHeader = document.createElement('th');
    newHeader.textContent = 'Attendance Percentage';
    newHeader.width = '8%';
    headerRow.insertBefore(newHeader, headerRow.children[7]);

    // Process each row
    const rows = targetTable.querySelectorAll('tr:not(:first-child):not(:last-child)');
    rows.forEach(row => {
        const attendanceCell = row.querySelector('td:nth-child(7)');
        if (!attendanceCell) return;

        const attendanceFraction = attendanceCell.textContent.trim();

        const newCell = document.createElement('td');
        newCell.textContent = calculatePercentage(attendanceFraction);
        row.insertBefore(newCell, attendanceCell.nextSibling);
    });

    // Adjust the colspan of the last row (Semester Summary)
    const lastRow = targetTable.querySelector('tr:last-child');
    if (lastRow) {
        const summaryCell = lastRow.querySelector('th[colspan="7"]');
        if (summaryCell) {
            summaryCell.setAttribute('colspan', '8');
        }
    }
    });

})();