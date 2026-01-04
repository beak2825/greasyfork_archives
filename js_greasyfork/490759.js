// ==UserScript==
// @name        ANT Export Bookmarks
// @namespace   Violentmonkey Scripts
// @match       https://anthelion.me/bookmarks.php*
// @grant       none
// @version     1.0
// @license     MIT
// @author      ANThusiast
// @description 3/24/2024
// @downloadURL https://update.greasyfork.org/scripts/490759/ANT%20Export%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/490759/ANT%20Export%20Bookmarks.meta.js
// ==/UserScript==

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const currentDate = dd + '-' + mm + '-' + yyyy;

const export_file_name = 'ANT_Bookmarks' + ' (' + currentDate + ')' + '.txt';

function scrapeTable() {
    const rows = document.querySelectorAll('#manage_collage_table tbody tr');

    const data = Array.from(rows).map(row => {
        const torrentName = row.querySelector('td:nth-child(4) a.tooltip').textContent.trim();
        const year = row.querySelector('td:nth-child(3)').textContent.trim();
        return `${torrentName} ${year}`;
    });

    const textFileContent = data.join('\n');
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textFileContent);
    link.download = export_file_name;
    link.click();
}

function addLink() {
    const element = document.querySelector('#check_all').parentNode;
    const dragDropSaveDiv = document.querySelector('.drag_drop_save');

    if (element && dragDropSaveDiv) {
        const checkmark = document.createElement('input');
        checkmark.type = 'button';
        checkmark.classList.add('checkmark');
        checkmark.innerHTML = 'Export Bookmarks';
        checkmark.style.cursor = 'pointer';
        checkmark.style.padding = '10px';
        checkmark.style.marginLeft = '3px';
        checkmark.value = 'Export Bookmarks';
        const deleteButton = dragDropSaveDiv.querySelector('input[name="delete"]');

        if (deleteButton) {
            dragDropSaveDiv.insertBefore(checkmark, deleteButton.nextSibling);
        } else {
            dragDropSaveDiv.appendChild(checkmark);
        }

        checkmark.addEventListener('click', scrapeTable);
    }
}

window.onload = addLink;