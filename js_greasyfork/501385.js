// ==UserScript==
// @name         Kraland Event Log Exporter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Export Kraland event logs to HTML
// @match        http://kraland.org/report.php*
// @match        http://www.kraland.org/report.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501385/Kraland%20Event%20Log%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/501385/Kraland%20Event%20Log%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and trigger download of HTML file
    function downloadHTML(content, filename) {
        var blob = new Blob([content], {type: 'text/html;charset=utf-8'});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Function to export event logs
    function exportEventLogs() {
        var eventTable = document.querySelector('table.forum');
        if (!eventTable) return;

        var characterName = document.querySelector('select[name="p1"] option:checked').textContent;
        var date = new Date().toISOString().slice(0, 10);
        var filename = `${characterName}_logs_evenements_${date}.html`;

        var htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Logs d'événements - ${characterName}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                tr:nth-child(even) { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Logs d'événements - ${characterName}</h1>
            ${eventTable.outerHTML}
        </body>
        </html>
        `;

        downloadHTML(htmlContent, filename);
    }

    // Create and add export button
    function addExportButton() {
        var menuList = document.querySelector('div.sl ul');
        if (!menuList) return;

        var exportLi = document.createElement('li');
        var exportLink = document.createElement('a');
        exportLink.href = '#';
        exportLink.textContent = 'Exporter les logs';
        exportLink.addEventListener('click', function(e) {
            e.preventDefault();
            exportEventLogs();
        });

        exportLi.appendChild(exportLink);
        menuList.appendChild(exportLi);
    }

    // Run the script
    addExportButton();
})();