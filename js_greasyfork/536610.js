// ==UserScript==
// @name         APS Oncall Handoff Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Format APS oncall handoff data
// @author       merlyngr
// @match        https://w.amazon.com/bin/view/KOMPAS/Advanced_Planning_Scheduling/Runbook/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536610/APS%20Oncall%20Handoff%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/536610/APS%20Oncall%20Handoff%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('APS Formatter Script Loading...');

    GM_addStyle(`
        #apsFormatterPanel {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: white;
            padding: 8px 24px;
            height: 50px;
            border-bottom: 1px solid #ccc;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            z-index: 99999;
            font-size: 13px;
            display: flex;
            justify-content: flex-start;
            transition: all 0.3s ease;
            align-items: center;
        }
        .header-bar {
            display: flex;
            align-items: center;
            gap: 20px;
            width: 100%;
            height: 100%;
        }
        .title-block {
            background: #232f3e;
            padding: 6px 16px;
            border-radius: 4px;
            margin-right: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            height: 32px;
            display: flex;
            align-items: center;
        }
        #apsFormatterPanel h2 {
            margin: 0;
            color: white;
            font-size: 16px;
            white-space: nowrap;
            font-weight: 500;
        }
        #apsFormatterPanel .panel-content {
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
            flex-grow: 1;
            height: 100%;
        }
        #apsFormatterPanel input {
            width: 150px;
            margin: 0;
            padding: 4px;
            font-size: 12px;
            border: 1px solid #ddd;
            border-radius: 3px;
            height: 24px;
        }
        #apsFormatterPanel label {
            margin: 0;
            font-weight: bold;
            font-size: 12px;
            white-space: nowrap;
            color: #232f3e;
        }
        #apsFormatterPanel button {
            background: #232f3e;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            white-space: nowrap;
            transition: background-color 0.2s;
            height: 32px;
        }
        #apsFormatterPanel button:hover {
            background: #394b61;
        }
        #minimizeBtn {
            position: absolute;
            top: 50%;
            right: 12px;
            transform: translateY(-50%);
            cursor: pointer;
            background: none;
            border: none;
            font-size: 16px;
            color: #666;
            padding: 0;
            width: auto !important;
            line-height: 1;
            height: 32px !important;
        }
        .drop-zone {
            border: 2px dashed #ccc;
            border-radius: 4px;
            padding: 4px 8px;
            text-align: center;
            background: #f9f9f9;
            cursor: pointer;
            width: 200px;
            transition: border-color 0.2s;
            height: 32px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .drop-zone:hover {
            border-color: #232f3e;
        }
        .drop-zone p {
            margin: 0;
            font-size: 12px;
            line-height: 1.2;
        }
        .drop-zone .small {
            font-size: 11px;
            color: #666;
        }
        #fileList {
            margin: 0;
            font-size: 11px;
            max-width: 200px;
            height: 32px;
            overflow: hidden;
        }
        #fileList div {
            margin: 4px 0;
            padding: 4px;
            background: #f0f0f0;
            border-radius: 3px;
        }
        #apsFormatterPanel.minimized {
            justify-content: center !important;
        }
        #apsFormatterPanel.minimized .header-bar {
            width: 50%;
            justify-content: center;
        }
        #apsFormatterPanel.minimized .title-block {
            margin-right: 0;
        }
        #apsFormatterPanel.minimized .panel-content {
            display: none;
        }
        #apsFormatterPanel.minimized #minimizeBtn {
            position: relative;
            top: 50%;
            right: 0;
        }
        body {
            padding-top: 50px !important;
        }
    `);

    const panelHTML = `
        <div class="header-bar">
            <div class="title-block">
                <h2>Oncall Handoff Helper</h2>
            </div>
            <div class="panel-content">
                <label for="alias">Your Alias:</label>
                <input type="text" id="alias" placeholder="Enter your alias">
                <label for="startDate">Start Date:</label>
                <input type="date" id="startDate">
                <label for="endDate">End Date:</label>
                <input type="date" id="endDate">
                <div id="dropZone" class="drop-zone">
                    <p>Drop your CSV files here</p>
                    <p class="small">(or click to select files)</p>
                    <input type="file" id="fileInput" multiple accept=".csv" style="display: none;">
                </div>
                <div id="fileList"></div>
                <button id="formatButton">Format & Copy</button>
            </div>
            <button id="minimizeBtn">−</button>
        </div>
    `;

    // Create panel element
    const panel = document.createElement('div');
    panel.id = 'apsFormatterPanel';
    panel.innerHTML = panelHTML;

    // Ensure the panel is added to the document
    function addPanel() {
        if (!document.getElementById('apsFormatterPanel')) {
            document.body.appendChild(panel);
            console.log('Panel added to document');
            initializeFileHandling();

            // Add minimize functionality
            document.getElementById('minimizeBtn').addEventListener('click', function() {
                panel.classList.toggle('minimized');
                this.textContent = panel.classList.contains('minimized') ? '+' : '−';
            });
        }
    }

    function initializeFileHandling() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');
        let files = [];

        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        function handleFiles(fileList) {
            Array.from(fileList).forEach(file => {
                if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                    files.push(file);
                    displayFile(file);
                }
            });
        }

        function displayFile(file) {
            const fileDiv = document.createElement('div');
            fileDiv.innerHTML = `
                ${file.name}
                <span class="remove-file" data-name="${file.name}">×</span>
            `;
            fileList.appendChild(fileDiv);

            fileDiv.querySelector('.remove-file').addEventListener('click', () => {
                files = files.filter(f => f.name !== file.name);
                fileDiv.remove();
            });
        }

        // Helper function to get unique tickets by IssueId
        const getUniqueTickets = (tickets) => {
            const uniqueMap = new Map();
            tickets.forEach(ticket => {
                if (!uniqueMap.has(ticket.IssueId)) {
                    uniqueMap.set(ticket.IssueId, ticket);
                }
            });
            return Array.from(uniqueMap.values());
        };

        document.getElementById('formatButton').addEventListener('click', function() {
            if (files.length === 0) {
                alert('Please add at least one CSV file.');
                return;
            }

            Promise.all(files.map(file =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsText(file);
                })
            )).then(contents => {
                // Combine all CSV contents
                const combinedContent = contents.join('\n');
                processCSVContent(combinedContent);
            }).catch(error => {
                console.error('Error reading files:', error);
                alert('Error reading files. Please try again.');
            });
        });

        function processCSVContent(content) {
            console.log('Processing CSV content:', content);

            const alias = document.getElementById('alias').value;
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);

            // Parse CSV properly handling quoted values
            function parseCSVLine(line) {
                const values = [];
                let currentValue = '';
                let insideQuotes = false;

                for (let char of line) {
                    if (char === '"') {
                        insideQuotes = !insideQuotes;
                    } else if (char === ',' && !insideQuotes) {
                        values.push(currentValue.replace(/^"|"$/g, '').trim());
                        currentValue = '';
                    } else {
                        currentValue += char;
                    }
                }
                values.push(currentValue.replace(/^"|"$/g, '').trim());
                return values;
            }

            // Split content into lines and filter out empty lines
            const lines = content.trim().split('\n').filter(line => line.trim());
            console.log('Number of lines:', lines.length);

            if (lines.length <= 1) {
                console.error('No data found in CSV');
                alert('No data found in the CSV files. Please check the file content.');
                return;
            }

            const headers = parseCSVLine(lines[0]);
            console.log('Headers:', headers);

            // Parse CSV data
            const tickets = lines.slice(1).map(line => {
                const values = parseCSVLine(line);
                const ticket = {};
                headers.forEach((header, index) => {
                    ticket[header] = values[index] || '';
                });
                return ticket;
            }).filter(ticket => ticket.IssueId && ticket.IssueUrl);

            console.log('Parsed tickets:', tickets);

            // Filter tickets and ensure uniqueness
            const incomingTickets = getUniqueTickets(tickets.filter(ticket => {
                try {
                    const createDate = new Date(ticket.CreateDate);
                    return createDate >= startDate && createDate <= endDate;
                } catch (e) {
                    console.error('Error processing ticket date:', ticket, e);
                    return false;
                }
            }));

            const closedTickets = getUniqueTickets(tickets.filter(ticket =>
                                                                  ticket.Status === 'Resolved' || ticket.Status === 'Closed'
                                                                 ));

            const openTickets = getUniqueTickets(tickets
                                                 .filter(ticket => ticket.Status !== 'Resolved' && ticket.Status !== 'Closed')
                                                 .sort((a, b) => Number(a.Severity) - Number(b.Severity))
                                                 .slice(0, 3));

            // Build formatted output
            let output = `== ${formatDate(startDate)} - ${formatDate(endDate)} ==\n\n`;
            output += ` Developer on-call: ${alias} \n\n`;
            output += `(((\n Incoming TT Queue: ${incomingTickets.length} \n\n`;
            output += ` Current TT Queue: \n\n`;
            output += ` Summary: \n)))\n\n`;
            output += `(((\n====== Incoming Issues: ${incomingTickets.length} ======\n\n`;

            // Table header
            output += '(% cellspacing="0" style="border-collapse:collapse; border:undefined" %)\n';

            // Add incoming tickets
            incomingTickets.forEach(ticket => {
                output += '|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:216.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += `[[${ticket.IssueUrl}>>url:${ticket.IssueUrl}]]`;
                output += ')))|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:38.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += '(% style="-webkit-hyphens:auto; color:#000000; font-family:Helvetica Neue; font-size:small; height:11px" %)';
                output += `${ticket.Severity}`;
                output += ')))|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:340.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += `${ticket.Title}`;
                output += ')))|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:41.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += '(% style="-webkit-hyphens:auto; color:#000000; font-family:Helvetica Neue; font-size:small; height:11px" %)';
                output += `${ticket.Status}`;
                output += ')))\n';
            });

            output += `\n====== Closed Issues: ${closedTickets.length} ======\n\n`;

            // Add closed tickets
            output += '(% cellspacing="0" style="border-collapse:collapse; border:undefined" %)\n';
            closedTickets.forEach(ticket => {
                output += '|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:216.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += `[[${ticket.IssueUrl}>>url:${ticket.IssueUrl}]]`;
                output += ')))|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:38.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += '(% style="-webkit-hyphens:auto; color:#000000; font-family:Helvetica Neue; font-size:small; height:11px" %)';
                output += `${ticket.Severity}`;
                output += ')))|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:340.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += `${ticket.Title}`;
                output += ')))|(% style="border-color:#000000 #000000 #000000 #000000; border-style:solid; border-width:1.0px 1.0px 1.0px 1.0px; width:41.0px" %)(((';
                output += '(% style="margin:0.0px 0.0px 0.0px 0.0px; padding:4.0px 4.0px 4.0px 4.0px" %)';
                output += '(% style="-webkit-hyphens:auto; color:#000000; font-family:Helvetica Neue; font-size:small; height:11px" %)';
                output += `${ticket.Status}`;
                output += ')))\n';
            });

            output += `\n====== Top 3 Open Tickets ======\n\n`;

            output += `\n====== Tickets to Discuss ======\n\n)))\n`;

            // Copy to clipboard
            GM_setClipboard(output);
            alert('Formatted handoff data copied to clipboard!');
        }

        function formatDate(date) {
            return (date.getMonth() + 1) + '/' + (date.getDate() + 1) + '/' + date.getFullYear();
        }
    }

    // Try to add panel immediately
    addPanel();

    // Also try after window load (backup)
    window.addEventListener('load', addPanel);

})();