// ==UserScript==
// @name         SECA SIM Auto-Fill Tool
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Pulls data from JC Tracker and auto-fills SECA SIM template
// @author       Arjun Bridgelal
// @match        https://quip-amazon.com/b0w8Awc6xyjW/Jurisdiction-Configuration-Q3-2025-Tracker*
// @match        https://quip-amazon.com/o3q3AgLHlYn2/Jurisdiction-Configuration-Q4-2025-Tracker*
// @match        https://issues.amazon.com/issues/create?templateIssue=da74d706-5761-4274-a42c-3320399fe81c*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/540349/SECA%20SIM%20Auto-Fill%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/540349/SECA%20SIM%20Auto-Fill%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatDate(dateStr) {
        try {
            // Handle "1-Jun" format
            if (dateStr.includes('-')) {
                const [day, monthStr] = dateStr.split('-');

                // Map of month abbreviations to numbers
                const monthMap = {
                    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
                };

                // Create date object (using 2025 as default year)
                const date = new Date(2025, monthMap[monthStr] - 1, parseInt(day));

                // Format as "Month DD, YYYY"
                return date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric'
                });
            }

            return dateStr;
        } catch (e) {
            console.log('Date formatting error:', e);
            return dateStr;
        }
    }

    function getWeekNumber(date) {
        // Start of year
        const startOfYear = new Date(date.getFullYear(), 0, 1);

        // Number of days into the year
        const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));

        // Get week number (adding 1 because we want weeks to start at 1)
        return Math.ceil((days + startOfYear.getDay() + 2) / 7);
    }

    // On Quip page
    if (window.location.href.includes('quip-amazon.com')) {
        // Create container for the whole widget
        const container = document.createElement('div');
        container.style = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 300px;
            background: black;
            border: 1px solid #ccc;
            border-radius: 4px;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // Add header bar with title and collapse button
        const header = document.createElement('div');
        header.style = `
            padding: 8px;
            background-color: #006644;
            color: white;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        `;
        header.innerHTML = '<span>SECA SIM Generator</span><span class="toggle">+</span>';
        container.appendChild(header);

        // Create content container
        const content = document.createElement('div');
        content.style = `
            padding: 10px;
            transition: height 0.3s ease;
            display: none;
        `;

        // Add paste area
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Paste rows here...';
        textarea.style = `
            width: 100%;
            height: 110px;
            margin-bottom: 8px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            resize: none;
            white-space: pre;
            overflow: auto;
        `;
        content.appendChild(textarea);

        // Create button container for side-by-side buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style = `
            display: flex;
            gap: 8px;
            width: 100%;
        `;

        // Add extract button
        const createButton = document.createElement('button');
        createButton.innerHTML = 'Import to SIM';
        createButton.style = `
            flex: 1;
            padding: 8px;
            background-color: #006644;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        `;
        createButton.onmouseover = () => createButton.style.backgroundColor = '#006633';
        createButton.onmouseout = () => createButton.style.backgroundColor = '#006644';

        // Add reset button
        const resetButton = document.createElement('button');
        resetButton.innerHTML = 'Reset';
        resetButton.style = `
            flex: 1;
            padding: 8px;
            background-color: #006644;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        `;
        resetButton.onmouseover = () => resetButton.style.backgroundColor = '#006633';
        resetButton.onmouseout = () => resetButton.style.backgroundColor = '#006644';

        // Add buttons to container
        buttonContainer.appendChild(createButton);
        buttonContainer.appendChild(resetButton);
        content.appendChild(buttonContainer);

        // Add content to container
        container.appendChild(content);

        // Add to page
        document.body.appendChild(container);

        // Initialize as collapsed
        let isCollapsed = true;

        // Add collapse/expand functionality
        header.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            content.style.display = isCollapsed ? 'none' : 'block';
            header.querySelector('.toggle').textContent = isCollapsed ? '+' : '−';
        });

        // Handle reset button click
        resetButton.addEventListener('click', function() {
            textarea.value = '';
        });

                // Handle create button click
        createButton.addEventListener('click', function() {
            const text = textarea.value;
            if (!text.trim()) {
                alert('Please paste row data first');
                return;
            }

            // Process rows - split by newline and handle each row
            const rows = text.split(/\r?\n/).filter(row => row.trim());
            console.log('Processing rows:', rows);

            const processedData = rows.map(row => {
                // Split by tab and clean up each cell
                const cells = row.split('\t').map(cell => cell.trim());
                console.log('Processing cells:', cells);

                const rawDate = cells[2] || '';
                const formattedDate = formatDate(rawDate);

                return {
                    station: cells[0] || '',
                    date: formattedDate,
                    rawDate: rawDate,
                    triggeredBy: cells[4] || '',
                    trackingSim: cells[8] || ''
                };
            }).filter(row => row.station);

            if (processedData.length === 0) {
                alert('No valid data found. Please check the pasted content.');
                return;
            }

            if (processedData.length > 5) {
                alert('Maximum 5 stations allowed. Please reduce the number of rows.');
                return;
            }

            const selectedData = {
                stations: processedData.map(row => row.station),
                date: processedData[0].date,
                rawDate: processedData[0].rawDate,
                triggeredBy: processedData.map(row => row.triggeredBy),
                trackingSim: processedData.map(row => row.trackingSim)
            };

            console.log('Selected data:', selectedData);
            GM_setValue('holocronData', JSON.stringify(selectedData));
            window.open('https://issues.amazon.com/issues/create?templateIssue=da74d706-5761-4274-a42c-3320399fe81c', '_blank');
        });
    }
    // On SIM page
    if (window.location.href.includes('issues.amazon.com/issues/create')) {
        const fillButton = document.createElement('button');
        fillButton.innerHTML = 'Import Data';
        fillButton.style = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            padding: 10px;
            background-color: #006644;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        `;
        fillButton.onmouseover = () => fillButton.style.backgroundColor = '#005533';
        fillButton.onmouseout = () => fillButton.style.backgroundColor = '#006644';
        document.body.appendChild(fillButton);

        // Wait for page to be ready
        function waitForPageLoad() {
            return new Promise(resolve => {
                if (document.querySelector('#issue-title')) {
                    resolve();
                } else {
                    const observer = new MutationObserver((mutations, obs) => {
                        if (document.querySelector('#issue-title')) {
                            obs.disconnect();
                            resolve();
                        }
                    });

                    observer.observe(document, {
                        childList: true,
                        subtree: true
                    });
                }
            });
        }

        fillButton.addEventListener('click', async function() {
            fillButton.disabled = true;
            fillButton.innerHTML = 'Loading...';

            try {
                // Wait for page to be ready
                await waitForPageLoad();

                const data = JSON.parse(GM_getValue('holocronData', '{}'));
                console.log('Retrieved data:', data);

                if (!data.stations || data.stations.length === 0) {
                    throw new Error('No data found. Please extract data from Quip first.');
                }

                // Select folder first
                const folderTrigger = document.querySelector('.folder-suggestions.dropdown-toggle');
                if (folderTrigger) {
                    folderTrigger.click();
                    await new Promise(resolve => setTimeout(resolve, 300));

                    const folderOption = Array.from(document.querySelectorAll('.folder-suggestion-item'))
                        .find(el => el.textContent.includes('TESS-NEMO/2025/AMZL C Returns'));

                    if (folderOption) {
                        folderOption.click();
                        await new Promise(resolve => setTimeout(resolve, 300));
                    }
                }

                // Fill title
                const titleField = document.querySelector('#issue-title');
                if (titleField) {
                    const title = `Jedi SLOT tool Configuration - ${data.stations.join(' ')} - ${data.date} OFD`;
                    titleField.value = title;
                    titleField.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Fill description
                const descriptionField = document.querySelector('#editable-rich-text-field');
                if (descriptionField) {
                    let description = `Start Date: ${data.date} OFD\n`;
                    description += `Configuration for Project Jedi adjusting active zips due to core jurisdiction change. Stations impacted:\n\n`;

                    data.stations.forEach((station, index) => {
                        description += `${index + 1} - ${station}\n`;
                        description += `*  Triggered By [https://sim.amazon.com/issues/${data.triggeredBy[index]}    ]\n`;
                        description += `*  Tracking SIM [https://issues.amazon.com/issues/${data.trackingSim[index]}    ]\n`;
                        if (index < data.stations.length - 1) description += '\n';
                    });

                    descriptionField.value = description;
                    descriptionField.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Fill custom fields immediately after description
                const dateObj = new Date(data.date);
                const effectiveDate = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
                const weekNumber = getWeekNumber(dateObj);

                const customFields = {
                    0: effectiveDate,
                    1: "Jurisdiction Update",
                    2: "3455",
                    3: "N/A",
                    4: "Returns/Missorts",
                    5: "Standard Request",
                    6: "No",
                    7: "N/A",
                    8: "Program not onboarded to Torch",
                    9: "Jedi SLOT Tool Configuration",
                    10: ">100",
                    11: `Week ${weekNumber}`
                };

                // Fill fields concurrently
                await Promise.all(Object.entries(customFields).map(async ([index, value]) => {
                    const field = document.querySelector(`[data-cf-type="policy"][data-index="${index}"]`);
                    if (field) {
                        field.value = value;
                        field.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }));

                // Set assignee to nobody last
                const assigneeDropdown = document.querySelector('.assignee-select-trigger');
                if (assigneeDropdown) {
                    assigneeDropdown.click();
                    await new Promise(resolve => setTimeout(resolve, 300));

                    const nobodyOption = document.querySelector('li[data-value="nobody"]');
                    if (nobodyOption) {
                        nobodyOption.click();
                        document.querySelector('input[name="issue-assignee"]')?.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

            } catch (error) {
                console.error('Error:', error);
                alert(error.message);
            } finally {
                fillButton.disabled = false;
                fillButton.innerHTML = 'Import Data';
            }
        });
    }
})();