// ==UserScript==
// @name             SHA1 Calculator
// @namespace   SWScripts
// @version          v1.1
// @description    Adds the ability to handle hash validator for SHA1 files based on Script by Sak32009
// @license          MIT
// @author           BN_LOS
// @match           https://steamdb.info/depot/*/?show_hashes
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/519369/SHA1%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/519369/SHA1%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addStyle = (css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.classList.add('toast', `alert-${type}`);
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    addStyle(`
        .toast { position: fixed; top: 1rem; right: 1rem; padding: 1rem; border-radius: 0.375rem; opacity: 0; transition: opacity 0.3s; z-index: 10000; }
        .toast.alert-info { background-color: #e2f3f5; color: #0c5460; }
        .toast.alert-error { background-color: #f8d7da; color: #721c24; }
        .status-summary { display: flex; gap: 1rem; margin-top: 1rem; font-size: 1rem; color: #555; }
        #notFoundFilesContainer { margin-top: 1rem; }
    `);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileInput.accept = '.sha1';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    const loadButton = document.createElement('button');
    loadButton.className = 'btn btn-outline mb-4';
    loadButton.textContent = 'Load .SHA1';
    const dtSearchDiv = document.querySelector('.dt-search');
    dtSearchDiv?.insertAdjacentElement('beforebegin', loadButton);

    const statusSummary = document.createElement('div');
    statusSummary.className = 'status-summary';
    statusSummary.innerHTML = '<span>Valid: <span id="validCount">0</span></span><span>Invalid: <span id="invalidCount">0</span></span><span>Not Found: <span id="notFoundCount">0</span></span><span>Total: <span id="totalCount">0</span></span>';
    const dataTableDisplayDiv = document.querySelector('.dataTable_display');
    dataTableDisplayDiv?.insertAdjacentElement('afterend', statusSummary);

    let sha1Data = [];

    const table = document.querySelector('#DataTables_Table_0');
    const th = document.createElement('th');
    th.textContent = 'Status';
    table.querySelector('thead tr')?.appendChild(th);

    const dataTableLengthSelect = document.getElementById('dt-length-0');
    if (dataTableLengthSelect) {
        dataTableLengthSelect.value = '-1';
        dataTableLengthSelect.dispatchEvent(new Event('change'));
    }

    loadButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file || !file.name.endsWith('.sha1')) {
            showToast('Invalid file. Please select a .sha1 file.', 'error');
            return;
        }

        try {
            const content = await file.text();
            sha1Data = [];
            clearTableStatus();
            clearNotInDepotTable();
            updateStatusSummary(0, 0, 0);
            updateDownloadButton([]);
            sha1Data = parseSHA1File(content);
            updateTable();
        } catch (error) {
            showToast('Error reading file.', 'error');
            console.error(error);
        }
    });

    const parseSHA1File = (content) => {
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => {
                const [hash, filename] = line.split(' *');
                return { hash, filename: filename.replace(/[\\\/]/g, '/').trim() };
            });
    };

    const clearTableStatus = () => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            if (row.cells.length > 3) {
                row.deleteCell(3);
            }
        });
    };

    const clearNotInDepotTable = () => {
        const notInDepotTable = document.getElementById('DataTables_Table_2_wrapper');
        if (notInDepotTable) {
            notInDepotTable.remove();
        }
    };

    const createNotInDepotTable = (notFoundInPageFiles) => {
        const wrapper = document.getElementById('DataTables_Table_0_wrapper');
        if (!wrapper) return;

        const existingTable2 = document.getElementById('DataTables_Table_2_wrapper');
        if (existingTable2) existingTable2.remove();

        if (notFoundInPageFiles.length === 0) return;

        const table2Wrapper = document.createElement('div');
        table2Wrapper.id = 'DataTables_Table_2_wrapper';
        table2Wrapper.innerHTML = `<h3>Not in Depot</h3>`;

        const table2 = document.createElement('table');
        table2.className = 'table table-bordered table-fixed dataTable mt-4';
        table2.innerHTML = `
            <thead><tr><th>Filename</th><th>Hashcode</th></tr></thead>
            <tbody>${notFoundInPageFiles.map(file => `<tr><td>${file.filename}</td><td>${file.hash}</td></tr>`).join('')}</tbody>
        `;

        table2Wrapper.appendChild(table2);
        wrapper.insertAdjacentElement('afterend', table2Wrapper);
    };


    const updateTable = () => {
        clearTableStatus();
        let validCount = 0;
        let invalidCount = 0;
        let notFoundCount = 0;
        const notFoundFiles = [];

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const filenameCell = row.cells[0];
            const hashCell = row.cells[1];
            const filename = filenameCell.textContent.trim().replace(/[\\\/]/g, '/');
            const pageHash = hashCell.textContent.replace('***', '').trim();

            const statusCell = document.createElement('td');

            if (!pageHash && filename) {
                statusCell.textContent = 'Folder';
                statusCell.className = 'text-blue-500';
                row.appendChild(statusCell);
                return;
            }

            const sha1Entry = sha1Data.find(entry => entry.filename === filename);

            if (sha1Entry) {
                const startHash = sha1Entry.hash.slice(0, 10);
                const endHash = sha1Entry.hash.slice(-10);
                const pageStartHash = pageHash.slice(0, 10);
                const pageEndHash = pageHash.slice(-10);

                if (startHash === pageStartHash && endHash === pageEndHash) {
                    statusCell.textContent = 'Matched';
                    statusCell.className = 'text-green-500';
                    validCount++;
                } else {
                    statusCell.textContent = 'Unmatched';
                    statusCell.className = 'text-red-500';
                    invalidCount++;
                }
            } else {
                statusCell.textContent = 'Not Found';
                statusCell.className = 'text-gray-500';
                notFoundFiles.push(filename);
                notFoundCount++;
            }

            row.appendChild(statusCell);
        });

        updateStatusSummary(validCount, invalidCount, notFoundCount);
        updateDownloadButton(notFoundFiles);

        const notFoundInPageFiles = sha1Data.filter(sha1File => {
            return !Array.from(table.querySelectorAll('tbody tr td:first-child')).some(cell => {
                return cell.textContent.trim().replace(/[\\\/]/g, '/') === sha1File.filename;
            });
        });

        createNotInDepotTable(notFoundInPageFiles);
    };

    const updateStatusSummary = (valid, invalid, notFound) => {
        document.getElementById('validCount').textContent = valid;
        document.getElementById('invalidCount').textContent = invalid;
        document.getElementById('notFoundCount').textContent = notFound;
        document.getElementById('totalCount').textContent = valid + invalid + notFound;
    };

    const updateDownloadButton = (notFoundFiles) => {
        const buttonContainer = document.getElementById('notFoundFilesContainer');
        if (!notFoundFiles.length) {
            if (buttonContainer) {
                buttonContainer.remove();
            }
        } else {
            if (!buttonContainer) {
                const container = document.createElement('div');
                container.id = 'notFoundFilesContainer';
                container.innerHTML = `<button class="btn btn-outline" id="downloadButton">Download Missing Files</button>`;
                document.body.appendChild(container);

                document.getElementById('downloadButton').addEventListener('click', downloadMissingFiles);
            }
        }
    };

    const downloadMissingFiles = () => {
        const blob = new Blob([notFoundFiles.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'missing_files.sha1';
        a.click();
        URL.revokeObjectURL(url);
    };

})();