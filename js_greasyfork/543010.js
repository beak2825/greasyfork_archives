// ==UserScript==
// @name         SteamDB App Parser
// @namespace    ViolentMonkey
// @version      1.2
// @description  Parse SteamDB Related Apps and DLC into structured format for SLSsteam.
// @author       Tasteless Void
// @match        https://steamdb.info/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543010/SteamDB%20App%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/543010/SteamDB%20App%20Parser.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // === Configuration ===
    const IGNORE_TYPES = ['Demo', 'Soundtrack', 'Beta'];

    // === Helper Functions ===

    const getMainAppId = () => location.pathname.match(/\/app\/(\d+)\//)?.[1] || null;

    const extractAppIdFromRow = (row) => {
        const attr = row.getAttribute('data-appid');
        if (attr) return attr;

        for (const cell of row.querySelectorAll('td')) {
            const text = cell.textContent.trim();
            if (/^\d{4,}$/.test(text)) return text;
            const link = cell.querySelector('a[href*="/app/"]');
            const match = link?.href.match(/\/app\/(\d+)\//);
            if (match) return match[1];
        }

        return null;
    };

    const extractCleanName = (cell) => {
        // First try to get the name from a <b> tag (for the new format)
        const boldElement = cell.querySelector('b');
        if (boldElement) {
            return boldElement.textContent.trim();
        }

        // Fallback to the original method, but exclude muted text
        const mutedElement = cell.querySelector('.muted');
        if (mutedElement) {
            // Clone the cell and remove muted elements to get clean text
            const clone = cell.cloneNode(true);
            const mutedClones = clone.querySelectorAll('.muted');
            mutedClones.forEach(el => el.remove());
            return clone.textContent.trim();
        }

        // Original fallback
        return cell.textContent.trim();
    };

    const parseAppTable = (selector, mainAppId, ignoreTypes = []) => {
        const results = [];
        const rows = document.querySelectorAll(`${selector} tbody tr`);

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) continue;

            const type = cells[1]?.textContent.trim();
            const nameCell = cells[2] || cells[1]; // Use second cell for type, third for name
            const name = extractCleanName(nameCell) || type;
            const appId = extractAppIdFromRow(row);

            if (!appId || appId === mainAppId || ignoreTypes.includes(type)) continue;

            results.push({ appId, appName: name.replace(/"/g, '\\"'), type });
        }

        return results;
    };

    const generateYamlOutput = (mainAppId, additionalApps, dlcEntries) => {
        const dlcMap = new Map();
        for (const { appId, appName } of dlcEntries) {
            dlcMap.set(appId, appName);
        }

        const lines = [];

        if (additionalApps.length) {
            lines.push('AdditionalApps:');
            for (const { appId, appName } of [...additionalApps].sort((a, b) => a.appId - b.appId)) {
                lines.push(`  - ${appId}\t# ${appName}`);
            }
        }

        if (dlcMap.size) {
            lines.push('\nDlcData:');
            lines.push(`  ${mainAppId}:`);
            for (const [appId, appName] of [...dlcMap.entries()].sort((a, b) => a[0] - b[0])) {
                lines.push(`    ${appId}: "${appName}"`);
            }
        }

        return lines.join('\n');
    };

    const generateAdditionalAppsOnly = (additionalApps) => {
        if (!additionalApps.length) return '';

        const lines = [];
        for (const { appId, appName } of [...additionalApps].sort((a, b) => a.appId - b.appId)) {
            lines.push(`  - ${appId}\t# ${appName}`);
        }
        return lines.join('\n');
    };

    const generateDlcOnly = (mainAppId, dlcEntries) => {
        if (!dlcEntries.length) return '';

        const dlcMap = new Map();
        for (const { appId, appName } of dlcEntries) {
            dlcMap.set(appId, appName);
        }

        const lines = [`${mainAppId}:`];
        for (const [appId, appName] of [...dlcMap.entries()].sort((a, b) => a[0] - b[0])) {
            lines.push(`    ${appId}: "${appName}"`);
        }
        return lines.join('\n');
    };

    const showOutputModal = (output, additionalApps, dlcEntries, mainAppId) => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: flex; justify-content: center;
            align-items: center; z-index: 10000;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background: #fff; padding: 20px; border-radius: 8px;
            max-width: 90%; max-height: 90%; overflow: auto;
        `;

        const textarea = document.createElement('textarea');
        textarea.readOnly = true;
        textarea.value = output;
        textarea.style.cssText = `
            width: 100%; height: 500px; font-family: monospace;
            font-size: 12px; border: 1px solid #ccc; padding: 10px;
            margin-bottom: 15px;
        `;

        const buttonRow = document.createElement('div');
        buttonRow.style.cssText = `
            text-align: center;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        `;

        const makeButton = (label, color, callback) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.cssText = `
                padding: 10px 15px;
                background: ${color}; color: white;
                border: none; border-radius: 4px; cursor: pointer;
                font-size: 12px; white-space: nowrap;
            `;
            btn.onclick = callback;
            return btn;
        };

        const copyToClipboard = (text, successMessage) => {
            textarea.value = text;
            textarea.select();
            document.execCommand('copy');
            alert(successMessage);
            textarea.value = output; // Reset to full output
        };

        buttonRow.appendChild(makeButton('Copy All', '#007bff', () => {
            copyToClipboard(output, 'Full output copied to clipboard!');
        }));

        if (additionalApps.length) {
            buttonRow.appendChild(makeButton('Copy AdditionalApps Only', '#28a745', () => {
                const appsOnly = generateAdditionalAppsOnly(additionalApps);
                copyToClipboard(appsOnly, 'AdditionalApps section copied to clipboard!');
            }));
        }

        if (dlcEntries.length) {
            buttonRow.appendChild(makeButton('Copy DLC Only', '#ffc107', () => {
                const dlcOnly = generateDlcOnly(mainAppId, dlcEntries);
                copyToClipboard(dlcOnly, 'DLC section copied to clipboard!');
            }));
        }

        buttonRow.appendChild(makeButton('Close', '#6c757d', () => overlay.remove()));

        box.appendChild(textarea);
        box.appendChild(buttonRow);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    };

    const ensureLinkedTabLoaded = () => {
        const tab = document.getElementById('tab-linked');
        if (!tab || tab.classList.contains('active')) return Promise.resolve();

        tab.click();
        return new Promise((resolve) => {
            const waitUntilLoaded = () => {
                const isReady = document.querySelector('#linked table tbody tr');
                if (isReady) resolve();
                else setTimeout(waitUntilLoaded, 300);
            };
            waitUntilLoaded();
        });
    };

    const createParseButton = () => {
        if (document.getElementById('steamdb-parse-button')) return;

        const btn = document.createElement('button');
        btn.id = 'steamdb-parse-button';
        btn.textContent = 'Parse SteamDB Data';
        btn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #28a745; color: white;
            border: none; padding: 12px 20px;
            border-radius: 6px; cursor: pointer;
            font-size: 14px; font-weight: bold;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        `;

        btn.onclick = async () => {
            const mainAppId = getMainAppId();
            if (!mainAppId) return;

            await ensureLinkedTabLoaded();

            const linkedApps = parseAppTable('#linked', mainAppId, IGNORE_TYPES);
            const dlcApps = parseAppTable('#dlc', mainAppId);

            const additionalApps = linkedApps;
            const dlcCombined = [...linkedApps.filter(e => e.type === 'DLC'), ...dlcApps];

            const output = generateYamlOutput(mainAppId, additionalApps, dlcCombined);
            if (!output) {
                alert('Could not parse any app data.');
                return;
            }

            showOutputModal(output, additionalApps, dlcCombined, mainAppId);
        };

        document.body.appendChild(btn);
    };

    const waitForTabs = () => {
        const hasTab = document.getElementById('tab-linked') || document.getElementById('tab-dlc');
        if (hasTab) createParseButton();
        else setTimeout(waitForTabs, 1000);
    };

    const observeNavigationChanges = () => {
        let previousPath = location.pathname;

        const observer = new MutationObserver(() => {
            if (location.pathname !== previousPath) {
                previousPath = location.pathname;
                setTimeout(waitForTabs, 1000);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // === Bootstrapping ===

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            waitForTabs();
            observeNavigationChanges();
        });
    } else {
        waitForTabs();
        observeNavigationChanges();
    }
})();