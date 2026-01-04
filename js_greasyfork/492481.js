// ==UserScript==
// @name         Facebook Page Email Collector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Collect publicly shared email addresses from Facebook pages
// @author       BBAtech
// @match        *://*.facebook.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/492481/Facebook%20Page%20Email%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/492481/Facebook%20Page%20Email%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var floatingDiv = document.createElement('div');
    floatingDiv.style.cssText = 'position:fixed;top:10px;left:10px;width:850px;padding:10px;background-color:white;border:1px solid black;';
    document.body.appendChild(floatingDiv);

    var floatingTextarea = document.createElement('textarea');
    floatingTextarea.placeholder = "Enter list of Facebook page URLs (one per line).";
    floatingTextarea.style.cssText = 'width:100%;height:100px;';
    floatingDiv.appendChild(floatingTextarea);

     // Add warning message
    var warningMessage = document.createElement('p');
    warningMessage.textContent = "Use of this script without permission from Facebook may break their T&C. Check your local laws before collecting email addresses using this script.";
    warningMessage.style.color = 'red';
    warningMessage.style.marginBottom = '10px'; // Add spacing after the warning
    floatingDiv.appendChild(warningMessage);

    var saveButton = addButton(floatingDiv, 'Save List', saveData);
    var clearButton = addButton(floatingDiv, 'Clear All Data', clearData);
    var exportButton = addButton(floatingDiv, 'Export Results (CSV)', exportCSV);

    var intervalLabel = document.createElement('label');
    intervalLabel.textContent = "Page Change Interval:";
    floatingDiv.appendChild(intervalLabel);

    var intervalSelect = document.createElement('select');
    intervalSelect.style.marginRight = '10px';
    floatingDiv.appendChild(intervalSelect);

    // Populate dropdown with options from 2 to 30 seconds
    for (var i = 2; i <= 30; i++) {
        var option = document.createElement('option');
        option.value = i * 1000; // Convert seconds to milliseconds
        option.textContent = i + " seconds";
        intervalSelect.appendChild(option);
    }
    intervalSelect.value = GM_getValue('pageChangeInterval') || 5000; // Default to 5 seconds

    intervalSelect.addEventListener('change', function() {
        GM_setValue('pageChangeInterval', this.value);
    });

    var table = createTable(floatingDiv);

    var websiteData = JSON.parse(localStorage.getItem('websiteData')) || [];

    function renderTable() {
        table.innerHTML = '<tr><th>Website</th><th>Email</th><th>Checked</th></tr>';
        websiteData.forEach(function(entry) {
            var row = table.insertRow();
            row.insertCell().textContent = entry.website;
            row.insertCell().textContent = entry.email;
            row.insertCell().textContent = entry.checked || 'no';
        });
    }

    function saveData() {
    var lines = floatingTextarea.value.split('\n');
    websiteData = lines.map(function(line) {
        var parts = line.split('\t');
        var website = parts[0];
        var email = parts[1] || '';
        var checked = website.includes('facebook.com') ? (parts[2] || 'no') : 'yes'; // Check if URL includes facebook.com
        return {
            website: website,
            email: email,
            checked: checked
        };
    });
    localStorage.setItem('websiteData', JSON.stringify(websiteData));
    renderTable();
    floatingTextarea.value = '';
    if (websiteData.length > 0) {
        window.location.href = websiteData[0].website + '/about';
    }
}


    function clearData() {
        localStorage.removeItem('websiteData');
        websiteData = [];
        renderTable();
    }

    function addButton(parent, text, onClick, style) {
    var button = document.createElement('button');
    button.textContent = text;
    button.style.cssText = 'width: auto; padding: 8px 12px; border: 1px solid #007bff; background-color: #007bff; color: #fff; cursor: pointer; margin-right: 10px;' + style; // Consolidated CSS
    button.addEventListener('click', onClick);
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'inline-block';
    buttonContainer.appendChild(button);
    parent.appendChild(buttonContainer);
}

    function createTable(parent) {
        var tableContainer = document.createElement('div');
        tableContainer.style.cssText = 'width:100%;max-height:300px;overflow-y:auto;border:1px solid black;';
        parent.appendChild(tableContainer);
        var table = document.createElement('table');
        table.style.cssText = 'width:100%;border-collapse:collapse;';
        table.innerHTML = '<tr><th>Website</th><th>Email</th><th>Checked</th></tr>';
        tableContainer.appendChild(table);
        return table;
    }

    function exportCSV() {
        var csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Website,Email,Checked\n";
        websiteData.forEach(function(entry) {
            csvContent += entry.website + "," + entry.email + "," + entry.checked + "\n";
        });
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "website_data.csv");
        document.body.appendChild(link);
        link.click();
    }

    function markChecked(url) {
        websiteData.forEach(function(entry) {
            if (entry.website === url) {
                entry.checked = 'yes';
            }
        });
        localStorage.setItem('websiteData', JSON.stringify(websiteData));
    }

    function extractEmailAndUpdateData() {
        var regex = /\b[A-Za-z0-9._%+-]+\\u0040[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        var scriptElements = document.querySelectorAll('script[data-sjs]');
        for (var i = 0; i < scriptElements.length; i++) {
            var scriptElement = scriptElements[i];
            var scriptContent = scriptElement.textContent;
            if (scriptContent.includes("profile_email")) {
                var emailMatch = scriptContent.match(regex);
                var email = emailMatch ? emailMatch[0].replace(/\\u0040/g, '@') : null;
                var modifiedUrl = window.location.href.replace(/\/about$/, '').replace("https://www.", "https://");
                console.log(modifiedUrl);
                console.log(email);
                websiteData.forEach(function(entry) {
                    if (entry.website === modifiedUrl) {
                        entry.email = email;
                        localStorage.setItem('websiteData', JSON.stringify(websiteData));
                    }
                });
                break;
            }
        }
    }

    extractEmailAndUpdateData();

    setTimeout(function() {
        var pageChangeInterval = GM_getValue('pageChangeInterval') || 5000;
        var uncheckedURL = websiteData.find(function(entry) {
            return entry.checked === 'no';
        });
        if (uncheckedURL) {
            markChecked(uncheckedURL.website);
            window.location.href = uncheckedURL.website + '/about';
        }
    }, GM_getValue('pageChangeInterval') || 5000);

    renderTable();
})();
