// ==UserScript==
// @name         Smartling Translation Export
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Export translations from Smartling to CSV
// @match        https://ti.smartling.com/app/*
// @grant        GM_xmlhttpRequest
// @connect      ti.smartling.com
// @license      MIT
// @author       LL-Floyd
// @downloadURL https://update.greasyfork.org/scripts/519252/Smartling%20Translation%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/519252/Smartling%20Translation%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/519252/Smartling%20Translation%20Export.meta.js",
            onload: function(response) {
                const latestVersion = /@version\s+([0-9.]+)/.exec(response.responseText)[1];
                const currentVersion = GM_info.script.version;
                if (latestVersion > currentVersion) {
                    alert("Smartling Translation Export 有新版本可用: " + latestVersion + "\n请点击OK更新");
                    window.location.href = "https://greasyfork.org/en/scripts/519252-smartling-translation-export";
                }
            },
            onerror: function(error) {
                console.error('Error checking for updates:', error);
            }
        })
    }

    function createExportButton() {
        const button = document.createElement('button');
        button.id = 'smartling-export-button';
        button.textContent = 'Export Translations';
        button.style.position = 'fixed';
        button.style.top = '5px';
        button.style.right = '350px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '14px';
        button.style.transition = 'background-color 0.3s';
        
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#45a049';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#4CAF50';
        });
        
        button.addEventListener('click', handleExport);
        document.body.appendChild(button);
        return button;
    }

    async function handleExport() {
        const button = document.getElementById('smartling-export-button');
        const originalText = button.textContent;
        button.textContent = 'Exporting...';
        button.style.backgroundColor = '#808080';
        button.disabled = true;

        try {
            // Extract parameters from URL
            const url = new URL(window.location.href);
            const pathParts = url.pathname.split('/');
            const projectId = pathParts[pathParts.indexOf('app') + 1];
            const params = new URLSearchParams(url.search);
            const jobId = params.get('translationJobUids');
            const locale = params.get('locale');
            const workflowStepUid = params.get('workflowStepUids');

            // First request - get count
            const countResponse = await makeRequest({
                method: 'GET',
                url: `https://ti.smartling.com/pwa/api/translations/strings/count?translationJobUids=${jobId}&projectId=${projectId}&stringState=IN_TRANSLATION&workflowStepUids=${workflowStepUid}&locale=${locale}&contentAuthorization=READ`
            });

            const totalCount = countResponse.response.data.filteredPartsCount;
            const batchSize = 1000;
            const allItems = [];

            // Second request - get translations
            for (let start = 0; start < totalCount; start += batchSize) {
                button.textContent = `Exporting... ${Math.min(start + batchSize, totalCount)}/${totalCount}`;
                
                const translationsResponse = await makeRequest({
                    method: 'POST',
                    url: `https://ti.smartling.com/p/translations-api/v2/projects/${projectId}/translations`,
                    data: {
                        maxResults: batchSize,
                        contentAuthorization: "READ",
                        translationJobUids: [jobId],
                        projectId: projectId,
                        stringState: "IN_TRANSLATION",
                        workflowStepUids: [workflowStepUid],
                        locale: locale,
                        start: start
                    }
                });

                const items = translationsResponse.response.data.items;
                const hashcodes = items.map(item => item.hashcode);

                // Third request - get string numbers
                const numbersResponse = await makeRequest({
                    method: 'POST',
                    url: `https://ti.smartling.com/p/jobs-api/v3/projects/${projectId}/jobs/${jobId}/fetch-strings-numbers`,
                    data: { hashcodes }
                });

                // Combine data
                const numberMap = new Map(numbersResponse.response.data.items.map(item => [item.hashcode, item.stringNumber]));
                
                items.forEach(item => {
                    allItems.push({
                        stringNumber: numberMap.get(item.hashcode) || '',
                        sourceText: item.sourceText,
                        translation: item.translations[0]?.translation || ''
                    });
                });
            }

            // Export to CSV
            const sortedItems = allItems.sort((a, b) => a.stringNumber - b.stringNumber);
            const csvContent = generateCSV(sortedItems);
            downloadCSV(csvContent, `smartling_export_${locale}_${new Date().toISOString().split('T')[0]}.csv`);
            
            button.textContent = 'Export Complete!';
            button.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Check console for details.');
            button.textContent = originalText;
            button.style.backgroundColor = '#4CAF50';
            button.disabled = false;
        }
    }

    function generateCSV(items) {
        const escapeCSV = (str) => {
            if (!str) return '';
            // Replace newlines with spaces and escape quotes
            str = str.replace(/[\n\r]+/g, ' ').replace(/"/g, '""');
            // Wrap in quotes if contains comma or escaped quotes
            return /[,"]/.test(str) ? `"${str}"` : str;
        };

        const header = 'String Number,Source Text,Translation\n';
        const rows = items.map(item => 
            `${item.stringNumber},${escapeCSV(item.sourceText)},${escapeCSV(item.translation)}`
        ).join('\n');

        return header + rows;
    }

    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    function makeRequest({ method, url, data }) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                data: data ? JSON.stringify(data) : undefined,
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    try {
                        resolve(JSON.parse(response.responseText));
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    // Initialize
    checkForUpdates();
    createExportButton();
})();