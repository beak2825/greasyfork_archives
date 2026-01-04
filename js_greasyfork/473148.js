// ==UserScript==
// @name         Modify Height of Details Table and Add Section Number To It
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify the height of the details table to 430px and add the section number to the details table
// @author       Happy Sama ツ
// @match        https://edugate.ksu.edu.sa/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473148/Modify%20Height%20of%20Details%20Table%20and%20Add%20Section%20Number%20To%20It.user.js
// @updateURL https://update.greasyfork.org/scripts/473148/Modify%20Height%20of%20Details%20Table%20and%20Add%20Section%20Number%20To%20It.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSectionNumber(sectionNumber) {
        let element = document.querySelector('.pui-dialog-content.ui-widget-content');
        if (element) {
            element.style.height = '430px';
        }

        let detailsTable = document.querySelector('div.pui-dialog-content.ui-widget-content table');
        if (detailsTable) {
            // Remove previous attempts
            let addedRows = detailsTable.querySelectorAll('tr.added-row');
            addedRows.forEach(row => row.remove());

            // Add as new row at the bottom of the table
            let newRow = document.createElement('tr');
            newRow.className = 'added-row';
            let newCell = document.createElement('td');
            newCell.colSpan = 2;
            newCell.innerHTML = '<strong>رقم الشعبة ' + sectionNumber + '</strong>';
            newRow.appendChild(newCell);
            detailsTable.appendChild(newRow);
        }
    }

    document.addEventListener('click', function(event) {
        if (event.target && event.target.innerText.includes('التفاصيل')) {
            let row = event.target.closest('tr');
            if (row) {
                let sectionNumber = row.querySelector('td:nth-child(3)').innerText;
                setTimeout(() => addSectionNumber(sectionNumber), 500);
            }
        }
    });
})();
