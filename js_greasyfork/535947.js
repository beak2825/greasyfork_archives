// ==UserScript==
// @name         Torn Logs Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhances the Torn Log page by allowing the user to select and copy logs with a total cost calculation. Currently supports the Bounty Place category. More for future work.
// @author       Hesper [2924630]
// @match        https://www.torn.com/page.php?sid=log*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535947/Torn%20Logs%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/535947/Torn%20Logs%20Enhancer.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let currentLogType = null; 

    function initializeForLogType(logType) {
        if (logType === '6700') {
            console.log('Initializing for bounty place logs...');
            setupBountyPlaceLogs();
        }
        // Add more log types here in the future
    }

    function setupBountyPlaceLogs() {
        const style = document.createElement('style');
        style.textContent = `
            #floating-torn-log-enhancer {
                position: fixed;
                top: 300px;
                right: 0px;
                background-color: #333;
                color: #fff;
                border: 1px solid #ccc;
                padding: 5px;
                z-index: 1000;
                width: 30px;
                height: 25px;
                font-size: 1em;
                border-radius: 5px 0px 0px 5px;
                overflow: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                cursor: pointer;
            }

            #floating-torn-log-enhancer #collapsed-view {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                font-size: 1em;
            }

            #floating-torn-log-enhancer #expanded-view {
                display: none;
                flex-direction: column;
                gap: 2px;
            }

            #floating-torn-log-enhancer button {
                margin-top: 10px;
                padding: 5px 10px;
                border: 1px solid #fff;
                background-color: #444;
                color: #fff;
                border-radius: 3px;
                cursor: pointer;
            }


            #log-list {
                margin-top: 10px;
                overflow-y: auto;
                max-height: 150px;
                scrollbar-width: thin; /* For Firefox */
                scrollbar-color: #fff #333; /* For Firefox */
            }

            /* For WebKit browsers (Chrome, Edge, Safari) */
            #log-list::-webkit-scrollbar {
                width: 8px;
            }

            #log-list::-webkit-scrollbar-track {
                background: #333;
            }

            #log-list::-webkit-scrollbar-thumb {
                background: #fff;
                border-radius: 4px;
            }

            #log-list::-webkit-scrollbar-thumb:hover {
                background: #ccc;
            }
        `;
        document.head.appendChild(style);

        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'floating-torn-log-enhancer';
        floatingDiv.innerHTML = `
            <div id="collapsed-view">
                <span>◀</span> <span id="selected-count-collapsed">0</span>
            </div>
            <div id="expanded-view">
                <div>
                    <strong>Selected Logs:</strong> <span id="selected-count">0</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>Total:</strong> $<span id="total-bounties">0</span></span>
                    <span>▶</span>
                </div>
                <div>
                    <strong>Category:</strong> Bounty place
                </div>
                <button id="copy-button">Copy Logs</button>
                <div id="log-list"></div>
            </div>
        `;
        document.body.appendChild(floatingDiv);

        const collapsedView = document.getElementById('collapsed-view');
        const expandedView = document.getElementById('expanded-view');
        const selectedCountCollapsed = document.getElementById('selected-count-collapsed');
        const selectedCount = document.getElementById('selected-count');
        const totalBounties = document.getElementById('total-bounties');
        const copyButton = document.getElementById('copy-button');
        const logList = document.getElementById('log-list');

        floatingDiv.addEventListener('click', () => {
            if (expandedView.style.display === 'none') {
                expandedView.style.display = 'flex';
                collapsedView.style.display = 'none';
                floatingDiv.style.width = '200px'; // Expand width
                floatingDiv.style.height = 'auto'; // Adjust height
            } else {
                expandedView.style.display = 'none';
                collapsedView.style.display = 'flex';
                floatingDiv.style.width = '30px'; // Collapse width
                floatingDiv.style.height = '25px'; // Collapse height
            }
        });

        function updateCollapsedViewCount() {
            selectedCountCollapsed.textContent = selectedLogs.length;
        }

        function updateLogList() {
            const sortedLogs = selectedLogs.sort((a, b) => {
                const dateRegex = /(\d{2}:\d{2}:\d{2}) - (\d{2}\/\d{2}\/\d{2})/;
                const dateA = new Date(a.match(dateRegex)[2] + ' ' + a.match(dateRegex)[1]);
                const dateB = new Date(b.match(dateRegex)[2] + ' ' + b.match(dateRegex)[1]);
                return dateB - dateA; // Descending order
            });

            logList.innerHTML = sortedLogs.map(log => `<div>${log}</div>`).join('');
            updateCollapsedViewCount();
        }

        let selectedLogs = [];
        let total = 0;

        function addCheckboxesToLogs(logEntries) {
            logEntries.forEach((row) => {
                const timeElement = row.querySelector('.time___CjMrZ');
                const logTextElement = row.querySelector('.log-text');
                if (!timeElement || !logTextElement || timeElement.querySelector('input[type="checkbox"]')) return;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.marginLeft = '10px';
                checkbox.addEventListener('change', () => {
                    const timeText = timeElement.textContent.trim();
                    const logText = logTextElement.textContent.trim();
                    const costMatch = logText.match(/cost of \$([\d,]+)/);

                    if (checkbox.checked) {
                        selectedLogs.push(`${timeText} ${logText}`);
                        if (costMatch) {
                            total += parseInt(costMatch[1].replace(/,/g, ''), 10);
                        }
                    } else {
                        selectedLogs = selectedLogs.filter(log => log !== `${timeText} ${logText}`);
                        if (costMatch) {
                            total -= parseInt(costMatch[1].replace(/,/g, ''), 10);
                        }
                    }

                    selectedCount.textContent = selectedLogs.length;
                    totalBounties.textContent = total.toLocaleString();
                    updateLogList();
                });

                timeElement.appendChild(checkbox);
            });
        }

        // Copy logs to clipboard
        copyButton.addEventListener('click', () => {
            const logsText = selectedLogs.join('\n') + `\n\nTotal: $${total.toLocaleString()}`;
            GM_setClipboard(logsText);
            alert('Logs copied to clipboard!');
        });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const newRows = Array.from(mutation.addedNodes).filter(node => node.tagName === 'TR');
                    addCheckboxesToLogs(newRows);
                }
            });
        });

        const waitForTable = setInterval(() => {
            const logTable = document.querySelector('table');
            if (logTable) {
                observer.observe(logTable, { childList: true, subtree: true });
                const initialLogEntries = logTable.querySelectorAll('tr');
                addCheckboxesToLogs(initialLogEntries);
                clearInterval(waitForTable);
            }
        }, 500);
    }

    function monitorUrlChanges() {
        let previousUrl = null;

        const checkUrl = () => {
            const currentUrl = window.location.href;

            if (currentUrl !== previousUrl) {
                previousUrl = currentUrl;

                const urlParams = new URLSearchParams(window.location.search);
                const logType = urlParams.get('log');

                if (logType && logType !== currentLogType) {
                    const existingDiv = document.getElementById('floating-torn-log-enhancer');
                    if (existingDiv) {
                        existingDiv.remove();
                    }
                    currentLogType = logType;
                    initializeForLogType(logType);
                }
            }
        };

        // Initial check then monitor for changes
        checkUrl();
        setInterval(checkUrl, 500);
    }

    monitorUrlChanges();
})();