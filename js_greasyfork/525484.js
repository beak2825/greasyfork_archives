// ==UserScript==
// @name         EOS Time on Task Monitor
// @namespace    tampermonkey.net/
// @version      1.5
// @description  Monitor Time on Task and send notifications via Chime webhook
// @author       @nowaratn
// @match        https://fclm-portal.amazon.com/reports/timeOnTask*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      https://hooks.chime.aws
// @downloadURL https://update.greasyfork.org/scripts/525484/EOS%20Time%20on%20Task%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/525484/EOS%20Time%20on%20Task%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SHOULD_CHECK_TOT = 'shouldCheckToT';
    const DEFAULT_NOTIFICATION_HOURS = [5, 17]; // Default hours
    GM_setValue('notificationHours', GM_getValue('notificationHours', DEFAULT_NOTIFICATION_HOURS));

    if (sessionStorage.getItem(SHOULD_CHECK_TOT)) {
        sessionStorage.removeItem(SHOULD_CHECK_TOT);
        checkTimeOnTask();
    }

    function generateHourOptions(selectedHour) {
        let options = '';
        for(let i = 0; i < 24; i++) {
            options += `<option value="${i}" ${i === selectedHour ? 'selected' : ''}>${i}:00</option>`;
        }
        return options;
    }

    // First, modify the styles to include new elements:
    const styles = `
    .tot-monitor {
        position: fixed;
        top: 5%;
        right: 2%;
        background: #232f3e;
        padding: 15px;
        border-radius: 8px;
        color: white;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        width: 250px;
    }
    .tot-monitor h3 {
        margin: 0 0 10px 0;
        font-size: 14px;
        text-align: center;
    }
    .settings-toggle {
        width: 100%;
        background: #ff9900;
        border: none;
        padding: 8px;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        margin-top: 10px;
    }
    #send {
        width: 50%;
        height: 30%;
        background: #ff9900;
        border: none;
        padding: 8px;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        margin-top: 10px;
    }
    .settings-panel {
        display: none;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #455166;
    }
    .settings-panel.visible {
        display: block;
    }
    .webhook-input {
        width: -moz-available;
        padding: 8px;
        margin: 5px 0;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
    .time-input-container {
        margin: 10px 0;
    }
    .time-input {
        width: 100px;
        padding: 6px;
        margin: 5px 0;
        border-radius: 4px;
        border: 1px solid #ccc;
    }
    .add-time-btn {
        background: #1E88E5;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        margin-top: 10px;
    }
    .remove-time-btn {
        background: #dc3545;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        margin-left: 8px;
    }
    .save-settings {
        width: 100%;
        background: #28a745;
        border: none;
        padding: 8px;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        margin-top: 15px;
    }
    .status-text {
        margin-top: 10px;
        font-size: 11px;
        color: #9ea9b3;
        text-align: center;
    }
`;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Modify the settings panel HTML:
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'tot-monitor';
    settingsPanel.innerHTML = `
    <h3>ToT EOS Monitor Settings</h3>
    <div id="status" class="status-text">Script active</div>
    <button class="settings-toggle" id="toggle-settings">Settings</button>
    <button id="send">Send Now</button>
    <div class="settings-panel" id="settings-panel">
        <input type="text" class="webhook-input" id="webhook-url" placeholder="Chime Webhook URL" value="${GM_getValue('webhookUrl', '')}">
        <div id="notification-times">
            <div class="time-input-container">
                <input type="time" class="time-input" value="${formatTime(GM_getValue('notificationTimes', ['05:01'])[0])}">
                <button class="remove-time-btn">×</button>
            </div>
        </div>
        <button class="add-time-btn" id="add-time">Add Notification Time</button>
        <button class="save-settings" id="save-settings">Save Settings</button>
    </div>
`;

    // Add helper function to format time
    function formatTime(timeString) {
        if (!timeString) return '05:01';
        return timeString;
    }

    document.body.appendChild(settingsPanel);


    // Add these functions after the panel is added to document:
    document.getElementById('toggle-settings').addEventListener('click', function() {
        const panel = document.getElementById('settings-panel');
        panel.classList.toggle('visible');
    });

    document.getElementById('add-time').addEventListener('click', function() {
        const container = document.createElement('div');
        container.className = 'time-input-container';
        container.innerHTML = `
        <input type="time" class="time-input" value="05:01">
        <button class="remove-time-btn">×</button>
    `;
        document.getElementById('notification-times').appendChild(container);

        container.querySelector('.remove-time-btn').addEventListener('click', function() {
            container.remove();
        });
    });



    function updateStatusWithTime() {
        const now = new Date();
        updateStatus(`Script active - Last check: ${now.toLocaleTimeString()}`);
    }

    updateStatusWithTime();

    function updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    function refreshPage() {
        sessionStorage.setItem(SHOULD_CHECK_TOT, 'true');
        location.reload();
    }

    function waitForContent() {
        return new Promise((resolve) => {
            const checkContent = setInterval(() => {
                const contentPanel = document.querySelector('#content-penal');
                if (contentPanel && contentPanel.querySelectorAll('tr').length > 0) {
                    clearInterval(checkContent);
                    resolve();
                }
            }, 500);
        });
    }

    async function checkTimeOnTask(manual = false) {
        try {
            await waitForContent();
            const lowTotEmployees = [];
            const rows = document.querySelector('#content-penal').querySelectorAll('tr');

            rows.forEach(row => {
                const cells = row.cells;
                if (cells && cells.length >= 6) {
                    const tot = parseFloat(cells[5].textContent);
                    if (tot < 100) {
                        lowTotEmployees.push({
                            id: cells[0].textContent.trim(),
                            name: cells[1].textContent.trim(),
                            manager: cells[2].textContent.trim(),
                            tot: tot
                        });
                    }
                }
            });

            const webhookUrl = GM_getValue('webhookUrl', '');

            if (lowTotEmployees.length > 0) {
                let message = "/md # 🚨 *Time on Task EOS Report* 🚨 #\n\n" +
                    "| Employee Name | Manager | ToT |\n" +
                    "| ------ | ------ | ------ |\n";

                lowTotEmployees.forEach(emp => {
                    message += `| [${emp.name}](https://fclm-portal.amazon.com/employee/timeDetails?employeeId=${emp.id}) | ${emp.manager} | ${emp.tot}% |\n`;
                });

                if (webhookUrl) {
                    await sendToWebhook(webhookUrl, message);
                    updateStatus(`Report sent successfully! (${new Date().toLocaleTimeString()})`);
                } else {
                    updateStatus('Error: Webhook URL not set');
                }
            } else {
                updateStatus('No employees with ToT < 100% found');
                let message = "/md # 🟢 *Time on Task EOS Report* 🟢 #\n\n" +
                    "No employees with ToT < 100% found.";

                if (webhookUrl) {
                    await sendToWebhook(webhookUrl, message);
                    updateStatus(`Report sent successfully! (${new Date().toLocaleTimeString()})`);
                } else {
                    updateStatus('Error: Webhook URL not set');
                }
            }
        } catch (error) {
            updateStatus(`Error: ${error.message}`);
        }
    }

    function sendToWebhook(webhookUrl, message) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: webhookUrl,
                data: JSON.stringify({ Content: message }),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        resolve();
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Modify the save settings handler:
    document.getElementById('save-settings').addEventListener('click', () => {
        const webhookUrl = document.getElementById('webhook-url').value;
        const timeInputs = document.querySelectorAll('.time-input');
        const notificationTimes = Array.from(timeInputs).map(input => input.value);

        GM_setValue('webhookUrl', webhookUrl);
        GM_setValue('notificationTimes', notificationTimes);

        updateStatusWithTimeout('Settings saved!');

        // Hide settings panel after saving
        setTimeout(() => {
            document.getElementById('settings-panel').classList.remove('visible');
        }, 3000);
    });

    // Add initial status check when script loads
    document.addEventListener('DOMContentLoaded', () => {
        checkAndUpdateStatus();
    });

    // Add this function to handle status messages with auto-reset
    function updateStatusWithTimeout(message, duration = 3000) {
        updateStatus(message);
        setTimeout(() => {
            checkAndUpdateStatus();
        }, duration);
    }

    // Add function to check webhook and update status accordingly
    function checkAndUpdateStatus() {
        const webhookUrl = GM_getValue('webhookUrl', '');
        if (!webhookUrl) {
            updateStatus('Script active - WARNING: Webhook URL not set');
        } else {
            updateStatus('Script active');
        }
    }


    document.getElementById('send').addEventListener('click', async () => {
        updateStatus('Sending report...');
        await checkTimeOnTask(true);
    });

    setInterval(async () => {
        checkAndUpdateStatus();
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const notificationTimes = GM_getValue('notificationTimes', ['05:01']);
        const webhookUrl = GM_getValue('webhookUrl', '');

        if (webhookUrl) {
            for (const time of notificationTimes) {
                const [hours, minutes] = time.split(':');
                if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes)) {
                    refreshPage();
                    break;
                }
            }
        }
    }, 60000);

})();