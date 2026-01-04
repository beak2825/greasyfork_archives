// ==UserScript==
// @name         Torn - Logs Filter by Log Title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds button on Torn Settings page to upload logs json file which will categorize each log type by title and add checkboxes that can be unselected and then filtered out
// @author       You
// @match        https://www.torn.com/preferences.php*
// @downloadURL https://update.greasyfork.org/scripts/532024/Torn%20-%20Logs%20Filter%20by%20Log%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/532024/Torn%20-%20Logs%20Filter%20by%20Log%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createLogFilterUI(logData) {
        const container = document.createElement('div')
        container.style.cssText = 'position:fixed;top:10px;right:10px;z-index:10000;background:#333;color:#fff;border:1px solid #000;padding:10px;max-height:90vh;overflow:auto;font-size:14px'

        const titleSet = new Set()
        const categories = {}

        for (const key in logData.log) {
            const entry = logData.log[key]
            const { category, title } = entry
            if (!categories[category]) categories[category] = new Set()
            categories[category].add(title)
            titleSet.add(title)
        }

        const checkboxMap = {}

        for (const cat in categories) {
            const header = document.createElement('h4')
            header.textContent = cat
            header.style.color = '#fff';
            container.appendChild(header)

            categories[cat].forEach(title => {
                const label = document.createElement('label')
                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.value = title
                checkbox.checked = true
                checkboxMap[title] = checkbox
                label.appendChild(checkbox)
                label.appendChild(document.createTextNode(' ' + title))
                label.style.cssText = 'display:block;margin-left:10px'
                container.appendChild(label)
            })
        }

        const button = document.createElement('button')
        button.textContent = 'Download Filtered Logs'
        button.style.cssText = 'margin-top:10px;padding:5px 10px; background-color: #444; color: #fff;'
        button.onclick = () => {
            const selectedTitles = new Set()
            for (const title in checkboxMap) {
                if (checkboxMap[title].checked) selectedTitles.add(title)
            }

            const filtered = {}
            for (const key in logData.log) {
                const entry = logData.log[key]
                if (selectedTitles.has(entry.title)) {
                    filtered[key] = entry
                }
            }

            const finalData = { log: filtered }
            const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'filtered_logs.json'
            a.click()
            URL.revokeObjectURL(url)
        }

        container.appendChild(button)
        header.appendChild(container)
    }

    const button = document.createElement('button');
    button.textContent = 'Start Log Filter';
    button.style.padding = '10px';
    button.style.margin = '10px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#333';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.margin = '10px';

    const header = document.querySelector('div.content-title > h4');
    if (header) {
        header.appendChild(button);
        header.appendChild(fileInput);
    }

    button.addEventListener('click', function() {
        if (fileInput.files.length === 0) {
            alert("Please upload a JSON file first.");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const logs = JSON.parse(e.target.result);
                createLogFilterUI(logs);
            } catch (error) {
                alert("Invalid JSON file.");
                console.error(error);
            }
        };

        reader.readAsText(file);
    });

})();
