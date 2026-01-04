// ==UserScript==
// @name          Thêm iframe mini số thứ tự
// @namespace    github.com/nguyenhuy158
// @version      1.0
// @description  Script auto create mini frame show No.
// @author       nguyenhuy158
// @match        http://nopdon.tdtu.edu.vn/admin/tuvan/tiepnhan
// @match        https://nopdon.tdtu.edu.vn/admin/tuvan/tiepnhan
// @match        https://nopdon.tdtu.edu.vn/Admin/TuVan/TiepNhan
// @match        https?://nopdon.tdtu.edu.vn/[aA][dD][mM][iI][nN]/[tT][uU][vV][aA][nN]/[tT][iI][eE][pP][nN][hH][aA][nN]

// @icon         https://cdn-icons-png.flaticon.com/512/2632/2632839.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484919/Th%C3%AAm%20iframe%20mini%20s%E1%BB%91%20th%E1%BB%A9%20t%E1%BB%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/484919/Th%C3%AAm%20iframe%20mini%20s%E1%BB%91%20th%E1%BB%A9%20t%E1%BB%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const columnContent = document.querySelector(
        '#page-wrapper > div.page-content > div:nth-child(8) > div.col-md-5.col-lg-5'
    );
    const tableContainer = document.createElement('div');
    tableContainer.id = 'tableContainer';
    tableContainer.style.width = '100%';
    columnContent.prepend(tableContainer);
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Update';
    columnContent.prepend(reloadButton);

    function createTable(quayTuVanData, phieuTuVanData) {
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = '';

        // Create the table element
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.marginBottom = '20px';
        table.style.border = '1px solid black';
        table.style.borderCollapse = 'collapse';

        // Create the table header row
        const headerRow = document.createElement('tr');
        headerRow.style.border = '1px solid black';

        // Create the header columns
        const headerColumn1 = document.createElement('th');
        headerColumn1.textContent = 'No.';
        headerColumn1.style.textAlign = 'center';
        headerColumn1.style.padding = '10px';
        headerRow.appendChild(headerColumn1);

        // Loop through the quayTuVanData to create additional header columns
        quayTuVanData.forEach((quay) => {
            const headerColumn = document.createElement('th');
            headerColumn.style.border = '1px solid black';
            headerColumn.style.textAlign = 'center';

            headerColumn.textContent = quay.STT;
            headerColumn.dataset.quayId = quay.ID;
            headerRow.appendChild(headerColumn);
        });

        // Append the header row to the table
        table.appendChild(headerRow);

        // Create the table body rows
        phieuTuVanData.forEach((phieu) => {
            const bodyRow = document.createElement('tr');
            bodyRow.style.padding = '10px';
            bodyRow.style.border = '1px solid black';

            // Create the first column with the student name
            const studentColumn = document.createElement('td');
            studentColumn.style.padding = '10px';
            studentColumn.style.textAlign = 'center';

            studentColumn.textContent =
                phieu.STT +
                '-' +
                phieu.HoTen +
                ' (' +
                phieu.MaNguoiNop +
                ')';
            bodyRow.appendChild(studentColumn);

            // Loop through the quayTuVanData to create additional columns
            quayTuVanData.forEach((quay) => {
                const column = document.createElement('td');
                column.style.border = '1px solid black';
                column.style.textAlign = 'center';
                column.style.width = '20px';

                column.textContent = quay.ID === phieu.QuayId ? 'X' : '';
                bodyRow.appendChild(column);
            });

            // Append the body row to the table
            table.appendChild(bodyRow);
        });

        // Append the table to the table container
        tableContainer.appendChild(table);
    }
    function preData() {
        fetch('https://nopdon.tdtu.edu.vn/DangKyTuVan/GetAllQuayTuVan')
            .then((response) => response.json())
            .then((quayTuVanData) => {
            fetch(
                'https://nopdon.tdtu.edu.vn/DangKyTuVan/GetPhieuTuVanChua_DangXuLyTrongNgay'
            )
                .then((response) => response.json())
                .then((phieuTuVanData) => {
                // Process the fetched data and create the table
                createTable(quayTuVanData, phieuTuVanData);
            })
                .catch((error) => console.log(error));
        })
            .catch((error) => console.log(error));
    }
    preData();
    setInterval(() => {
        preData();
    }, 3000);
    reloadButton.addEventListener('click', () => {
        preData();
    });
})();
