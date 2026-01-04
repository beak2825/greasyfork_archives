// ==UserScript==
// @name         Extract
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract id's
// @author       Ahmed
// @license MIT
// @match        https://indriver.my.salesforce.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489584/Extract.user.js
// @updateURL https://update.greasyfork.org/scripts/489584/Extract.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractCaseIDs() {
        const caseElements = document.querySelectorAll('[id$="_CASES_CASE_NUMBER"]');
        const caseIDs = Array.from(new Set(Array.from(caseElements).map(el => {
            const id = el.id;
            if (id && id.endsWith('_CASES_CASE_NUMBER')) {
                return id.slice(0, id.indexOf('_CASES_CASE_NUMBER'));
            }
            return null;
        }).filter(id => id)));
        return caseIDs;
    }

    function generateCSVData(caseIDs, country) {
        let csvContent = "Id,CaseRegion__c,Region__c,Country__c\r\n";
        caseIDs.forEach(id => {
            csvContent += `${id},MENA,MENA,${country}\r\n`;
        });
        return csvContent;
    }

    function downloadCSV(data, filename) {
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function showModal() {
        const modal = document.createElement('div');
        modal.id = 'countrySelectionModal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '10000';
        modal.style.padding = '20px';
        modal.style.background = 'white';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        modal.style.textAlign = 'center';

        const countries = ['Egypt', 'Morocco', 'Turkey'];
        countries.forEach(country => {
            const button = document.createElement('button');
            button.textContent = country;
            button.style.margin = '5px';
            button.style.padding = '10px 20px';
            button.style.fontSize = '16px';
            button.style.border = 'none';
            button.style.background = 'gray';
            button.style.color = 'white';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.onclick = function() {
                document.body.removeChild(modal);
                const ids = extractCaseIDs();
                const csvData = generateCSVData(ids, country);
                downloadCSV(csvData, `salesforce_case_ids_with_details_${country}.csv`);
            };
            modal.appendChild(button);
        });

        document.body.appendChild(modal);
    }

    function addDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'Extract and Format IDs';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.border = 'none';
        button.style.background = 'green';
        button.style.color = 'white';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = showModal;

        document.body.appendChild(button);
    }

    addDownloadButton();
})();
