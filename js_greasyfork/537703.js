// ==UserScript==
// @name         IOL Report Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       @nowaratn
// @description  Generate IOL reports and send to Chime
// @match        http://peculiar-inventory-eu.aka.corp.amazon.com/KTW1/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/537703/IOL%20Report%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/537703/IOL%20Report%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const types = ['Inbound', 'LargeAdjustment', 'Outbound', 'PendingRepair', 'PendingResearch', 'ProblemSolve', 'ReverseLogistics', 'ReverseRepair', 'Transshipment', 'Unknown', 'UnsellableRemoval']; // Add more types as needed
    let webhookUrl = GM_getValue('webhookUrl', '');

    // Create configuration panel
    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; z-index: 9999; display: none;';
        panel.id = 'config-panel';
        panel.innerHTML = `
        <h4>IOL Report Configuration</h4>
        <label>Webhook URL:</label><br>
        <input type="text" id="webhook-url" value="${webhookUrl}" style="width: 300px;"><br>
        <button id="save-config">Save Configuration</button>
        <button id="close-config">Close</button>
    `;
        document.body.appendChild(panel);

        document.getElementById('save-config').addEventListener('click', () => {
            webhookUrl = document.getElementById('webhook-url').value;
            GM_setValue('webhookUrl', webhookUrl);
            alert('Configuration saved!');
            panel.style.display = 'none';
        });

        document.getElementById('close-config').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    // Create main button and settings button
    function createReportButton() {
        const targetElement = document.querySelector('.a-row');
        if (!targetElement) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'inline-block';

        const button = document.createElement('button');
        button.textContent = 'Generuj raport IOL';
        button.style.margin = '10px';
        button.dataset.action = 'generate-report'; // Add data attribute for easy selection

        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙️';
        settingsButton.style.cssText = 'margin-left: 5px; font-size: 16px; padding: 2px 6px; vertical-align: middle;';

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(settingsButton);
        targetElement.appendChild(buttonContainer);

        button.addEventListener('click', generateReport);
        settingsButton.addEventListener('click', () => {
            const panel = document.getElementById('config-panel');
            panel.style.display = 'block';
        });
    }

    // Generate report
    async function generateReport() {
        const button = document.querySelector('button[data-action="generate-report"]');
        button.disabled = true;
        button.textContent = 'Generowanie raportu...';

        let reportData = '# IOL Report\n\n';

        for (const type of types) {
            try {
                const url = `http://peculiar-inventory-eu.aka.corp.amazon.com/records/KTW1/${type}?timeBucket=TwoToThreeDay`;
                const response = await makeRequest(url);
                const data = JSON.parse(response.responseText);

                const filteredRecords = data.containerRecords.filter(record =>
                                                                     record.parent && record.parent.scannableId.toLowerCase().includes('vret')
                                                                    );

                if (filteredRecords.length > 0) {
                    reportData += `## ${type}\n`;
                    reportData += '| Container ID | Parent Container |\n';
                    reportData += '|--------------|------------------|\n';
                    filteredRecords.forEach(record => {
                        const containerLink = `[${record.scannableId}](http://fcresearch-eu.aka.amazon.com/KTW1/results?s=${record.scannableId})`;
                        reportData += `| ${containerLink} | ${record.parent.scannableId} |\n`;
                    });
                    reportData += '\n';
                }
            } catch (error) {
                console.error(`Error fetching ${type} data:`, error);
                reportData += `> ⚠️ Error fetching ${type} data\n\n`;
            }
        }

        button.disabled = false;
        button.textContent = 'Generuj raport IOL';

        if (reportData.trim() === '# IOL Report\n\n') {
            alert('Nie znaleziono żadnych danych do raportu.');
            return;
        }

        displayReport(reportData);
    }

    // Display report
    function displayReport(reportData) {
        const reportContainer = document.createElement('div');
        reportContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid #ccc; z-index: 9999; max-height: 80vh; overflow-y: auto;';

        reportContainer.innerHTML = `
            <h3>Generated Report</h3>
            <pre>${reportData}</pre>
            <button id="send-to-chime">Wyślij raport na Chime</button>
            <button id="close-report">Close</button>
        `;

        document.body.appendChild(reportContainer);

        document.getElementById('send-to-chime').addEventListener('click', () => sendToChime(reportData));
        document.getElementById('close-report').addEventListener('click', () => reportContainer.remove());
    }

    // Send to Chime
    function sendToChime(reportData) {
        if (!webhookUrl) {
            alert('Please configure Webhook URL first!');
            return;
        }

        // Dzielimy raport na sekcje według typów
        const sections = reportData.split('## ').filter(section => section.trim());

        // Dodajemy nagłówek do pierwszej wiadomości
        const messages = [];
        if (sections.length > 0) {
            messages.push('# IOL Report\n\n');
            sections.splice(0, 1);

            // Dodajemy pozostałe sekcje
            sections.forEach(section => {
                messages.push('# ' + section);
            });
        }

        // Funkcja do wysyłania pojedynczej wiadomości
        function sendMessage(content, index) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: webhookUrl,
                    data: JSON.stringify({
                        Content: '/md\n' + content
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve();
                        } else {
                            reject(`Error sending part ${index + 1}: ${response.statusText}`);
                        }
                    },
                    onerror: function(error) {
                        reject(`Failed to send part ${index + 1}`);
                    }
                });
            });
        }

        // Wysyłamy wiadomości sekwencyjnie z małym opóźnieniem
        async function sendAllMessages() {
            try {
                for (let i = 0; i < messages.length; i++) {
                    await sendMessage(messages[i], i);
                    // Dodajemy małe opóźnienie między wiadomościami
                    if (i < messages.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                alert('Report sent to Chime successfully!');
            } catch (error) {
                alert('Error sending report: ' + error);
                console.error('Send error:', error);
            }
        }

        sendAllMessages();
    }

    // Helper function for making requests
    function makeRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: resolve,
                onerror: reject
            });
        });
    }

    // Initialize
    createConfigPanel();
    createReportButton();
})();