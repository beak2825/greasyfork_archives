// ==UserScript==
// @name         Custom Auto Refresh
// @namespace    https://github.com/ymhomer/ym_Userscript
// @version      2.0
// @description  Define custom auto-refresh intervals for different websites, and manage them through a settings menu with options to view, modify, or clear.
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513942/Custom%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/513942/Custom%20Auto%20Refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;
    const currentRoot = window.location.hostname;
    const defaultRefreshInterval = 0;
    let allRefreshSettings = GM_getValue('allRefreshSettings', {});
    let refreshInterval = allRefreshSettings[currentRoot] || defaultRefreshInterval;
    let refreshTimer;
    let manageSettingsDialogOpen = false;

    const startAutoRefresh = () => {
        if (refreshInterval > 0 && !manageSettingsDialogOpen) {
            refreshTimer = setInterval(() => { location.reload(); }, refreshInterval * 1000);
        }
    };

    const stopAutoRefresh = () => { clearInterval(refreshTimer); };

    const showDialog = (title, content, onCloseCallback = null) => {
        const dialog = document.createElement('div');
        dialog.innerHTML = `
            <style>
                .custom-dialog {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    z-index: 10000;
                    max-width: 400px;
                    max-height: 500px;
                    overflow-y: auto;
                }
                .custom-dialog input[type="checkbox"] { margin-right: 5px; }
                .custom-dialog button { margin-top: 10px; }
                .custom-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                }
                .custom-dialog table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .custom-dialog table, .custom-dialog th, .custom-dialog td {
                    border: 1px solid #ccc;
                }
                .custom-dialog th, .custom-dialog td {
                    padding: 8px;
                    text-align: left;
                }
            </style>
            <div class="custom-dialog">
                <h2>${title}</h2>
                <div id="dialogContent">${content}</div>
            </div>
            <div class="custom-overlay"></div>
        `;

        document.body.appendChild(dialog);

        const overlay = dialog.querySelector('.custom-overlay');
        overlay.addEventListener('click', () => {
            document.body.removeChild(dialog);
            if (onCloseCallback) onCloseCallback();
        });

        return dialog.querySelector('.custom-dialog');
    };

    const refreshManageSettingsDialog = (dialog) => {
        const siteKeys = Object.keys(allRefreshSettings);
        let tableRows = siteKeys.map(site => `
            <tr>
                <td>${site}</td>
                <td>${allRefreshSettings[site]} seconds</td>
                <td><button class="modifyBtn" data-site="${site}">Modify</button></td>
                <td><button class="deleteBtn" data-site="${site}">Delete</button></td>
            </tr>
        `).join('');

        const dialogContent = `
            <button id="addSettingBtn">Add New</button>
            <table>
                <thead>
                    <tr>
                        <th>Site</th>
                        <th>Refresh Interval</th>
                        <th>Modify</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        `;

        dialog.querySelector('#dialogContent').innerHTML = dialogContent;
        bindManageSettingsEvents(dialog);
    };

    const openSettingsDialog = (parentDialog = null) => {
        stopAutoRefresh();

        const dialogContent = `
            <label>Enter refresh interval (Seconds):</label>
            <input type="number" id="intervalInput" value="${refreshInterval}" min="0" />
            <br/>
            <label><input type="checkbox" id="fullUrlCheckbox"> Apply to full URL</label>
            <button id="saveIntervalBtn">Save</button>
        `;
        const dialog = showDialog("Set Refresh Interval", dialogContent);

        dialog.querySelector('#saveIntervalBtn').addEventListener('click', () => {
            const intervalInput = dialog.querySelector('#intervalInput').value;
            const applyToFullUrl = dialog.querySelector('#fullUrlCheckbox').checked;
            const targetUrl = applyToFullUrl ? currentUrl : currentRoot;

            if (intervalInput !== null) {
                refreshInterval = parseInt(intervalInput, 10);
                allRefreshSettings[targetUrl] = refreshInterval;
                GM_setValue('allRefreshSettings', allRefreshSettings);
                document.body.removeChild(dialog.parentNode);
                startAutoRefresh();

                // Refresh Manage Settings dialog if open
                if (parentDialog) {
                    refreshManageSettingsDialog(parentDialog);
                }
            }
        });
    };

    const manageAllSettingsDialog = () => {
        stopAutoRefresh();
        manageSettingsDialogOpen = true;
        const dialog = showDialog("Manage Settings", '', () => {
            manageSettingsDialogOpen = false;
            refreshInterval = allRefreshSettings[currentRoot] || defaultRefreshInterval;
            startAutoRefresh();
        });
        refreshManageSettingsDialog(dialog);
    };

    const bindManageSettingsEvents = (dialog) => {
        dialog.querySelector('#addSettingBtn').addEventListener('click', () => openSettingsDialog(dialog));

        dialog.querySelectorAll('.modifyBtn').forEach(button => {
            button.addEventListener('click', () => {
                const site = button.getAttribute('data-site');
                modifySettingDialog(dialog, site);
            });
        });

        dialog.querySelectorAll('.deleteBtn').forEach(button => {
            button.addEventListener('click', () => {
                const site = button.getAttribute('data-site');
                deleteSetting(dialog, site);
            });
        });
    };

    const modifySettingDialog = (parentDialog, site) => {
        const currentInterval = allRefreshSettings[site];
        const dialogContent = `
            <label>Enter new refresh interval (Seconds) for ${site}:</label>
            <input type="number" id="newIntervalInput" value="${currentInterval}" min="0" />
            <button id="saveModifyBtn">Save</button>
        `;
        const dialog = showDialog("Modify Refresh Interval", dialogContent);

        dialog.querySelector('#saveModifyBtn').addEventListener('click', () => {
            const newInterval = dialog.querySelector('#newIntervalInput').value;
            if (newInterval !== null) {
                allRefreshSettings[site] = parseInt(newInterval, 10);
                GM_setValue('allRefreshSettings', allRefreshSettings);
                document.body.removeChild(dialog.parentNode);
                refreshManageSettingsDialog(parentDialog);
            }
        });
    };

    const deleteSetting = (parentDialog, site) => {
        delete allRefreshSettings[site];
        GM_setValue('allRefreshSettings', allRefreshSettings);
        refreshManageSettingsDialog(parentDialog);
    };

    startAutoRefresh();
    GM_registerMenuCommand("Manage Settings", manageAllSettingsDialog);
})();
