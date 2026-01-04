// ==UserScript==
// @name		    Firebase User Data CSV Exporter
// @description		This userscript adds a convenient **Export CSV** button to the Firebase Authentication console, allowing you to quickly export all user data to a CSV file for analysis, backup, or migration purposes.
// @author          robomonkey.io
// @version		    1.0.1
// @license         MIT
// @match		    https://*.console.firebase.google.com/*
// @icon		    https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_16dp.png
// @namespace https://greasyfork.org/users/1502483
// @downloadURL https://update.greasyfork.org/scripts/544929/Firebase%20User%20Data%20CSV%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/544929/Firebase%20User%20Data%20CSV%20Exporter.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function createExportButton() {
        const button = document.createElement('button');
        button.textContent = 'Export CSV';
        button.className = 'mdc-button mat-mdc-button-base mdc-button--raised mat-mdc-raised-button mat-primary';
        button.style.marginLeft = '10px';
        button.setAttribute('data-test-id', 'export-csv-button');
        return button;
    }

    function extractUserData() {
        const userRows = document.querySelectorAll('table[id="auth-users-table"] tbody tr.mat-mdc-row');
        const users = [];
    
        userRows.forEach(row => {
            const identifierElement = row.querySelector('.cdk-column-identifier .identifier-text');
            const createdElement = row.querySelector('.cdk-column-created-at .mat-cell-wrapper');
            const signedInElement = row.querySelector('.cdk-column-last-login .mat-cell-wrapper');
        
            const identifier = identifierElement ? identifierElement.textContent.trim() : '';
            const created = createdElement ? createdElement.textContent.trim() : '';
            const signedIn = signedInElement ? signedInElement.textContent.trim() : '';
        
            users.push({
                identifier: identifier,
                created: created,
                signedIn: signedIn
            });
        });
    
        return users;
    }

    function generateCSV(userData) {
        let csv = 'Identifier,Created,Signed In\n';
    
        userData.forEach(user => {
            csv += `${user.identifier.replace(/"/g, '""')},${user.created.replace(/"/g, '""')},${user.signedIn.replace(/"/g, '""')}\n`;
        });
    
        return csv;
    }

    function downloadCSV(csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'firebase-users-export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function handleExportClick() {
        const userData = await extractUserData();
        if (userData.length === 0) {
            alert('No user data found to export');
            return;
        }
        const csvContent = generateCSV(userData);
        downloadCSV(csvContent);
        console.log(`Exported ${userData.length} users to CSV`);
    }

    function addExportButton() {
        const addUserButton = document.querySelector('button[data-test-id="add-user-button"]');
        if (!addUserButton) {
            console.error('Add user button not found');
            return;
        }
    
        const parentContainer = addUserButton.parentElement;
    
        if (document.querySelector('[data-test-id="export-csv-button"]')) {
            return;
        }
    
        const exportButton = createExportButton();
        exportButton.addEventListener('click', handleExportClick);
        parentContainer.appendChild(exportButton);
        console.log('Export CSV button added successfully');
    }

    function observePageChanges() {
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                addExportButton();
            }, 1000);
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('Started observing page changes for export button');
    }

    function init() {
        addExportButton();
        observePageChanges();
        console.log('Firebase CSV Exporter initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();