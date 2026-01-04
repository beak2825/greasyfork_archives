// ==UserScript==
// @name         Advanced Browser Hosts File (User Managed)
// @description  Mimics hosts file behavior with user-managed redirections via local storage.
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       s3b
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537463/Advanced%20Browser%20Hosts%20File%20%28User%20Managed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537463/Advanced%20Browser%20Hosts%20File%20%28User%20Managed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const STORAGE_KEY = 'browserHostsRules';
    const MANAGEMENT_TRIGGER_KEY = 'Alt+Shift+H'; // Keyboard shortcut to open management UI
    const MANAGEMENT_URL_PATH = '/_tmredirect'; // A unique path to trigger the management UI
    // --- END CONFIGURATION ---

    let hostsRules = {}; // Will be loaded from localStorage

    // --- UI Styles ---
    GM_addStyle(`
        #tmHostsManagerOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            font-family: sans-serif;
            color: #333;
        }
        #tmHostsManagerPanel {
            background-color: #fff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%;
            max-height: 90%;
            overflow-y: auto;
            position: relative;
        }
        #tmHostsManagerPanel h2 {
            margin-top: 0;
            color: #0056b3;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        #tmHostsManagerPanel label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        #tmHostsManagerPanel input[type="text"] {
            width: calc(100% - 22px);
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        #tmHostsManagerPanel button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
            transition: background-color 0.2s ease;
        }
        #tmHostsManagerPanel button:hover {
            background-color: #0056b3;
        }
        #tmHostsManagerPanel button.delete {
            background-color: #dc3545;
        }
        #tmHostsManagerPanel button.delete:hover {
            background-color: #c82333;
        }
        #tmHostsManagerPanel button.close {
            background-color: #6c757d;
        }
        #tmHostsManagerPanel button.close:hover {
            background-color: #5a6268;
        }
        #tmHostsManagerPanel #rulesList {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        #tmHostsManagerPanel .rule-item {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px dashed #eee;
        }
        #tmHostsManagerPanel .rule-item:last-child {
            border-bottom: none;
        }
        #tmHostsManagerPanel .rule-item span {
            flex-grow: 1;
            word-break: break-all;
        }
        #tmHostsManagerPanel .rule-item .actions {
            margin-left: 15px;
            display: flex;
            gap: 5px;
        }
        #tmHostsManagerPanel .rule-item .actions button {
            padding: 5px 10px;
            font-size: 14px;
            margin-right: 0;
        }
        #tmHostsManagerPanel .info-text {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #007bff;
            padding: 10px;
            border-radius: 4px;
        }
        #tmHostsManagerPanel .close-button-top {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #aaa;
            cursor: pointer;
            line-height: 1;
            padding: 0 5px;
        }
        #tmHostsManagerPanel .close-button-top:hover {
            color: #666;
        }
    `);

    // --- Core Functions ---

    async function loadRules() {
        try {
            const storedRules = await GM_getValue(STORAGE_KEY, '{}');
            hostsRules = JSON.parse(storedRules);
        } catch (e) {
            console.error('Tampermonkey Hosts: Failed to load rules from localStorage', e);
            hostsRules = {}; // Reset if parsing fails
        }
    }

    async function saveRules() {
        try {
            await GM_setValue(STORAGE_KEY, JSON.stringify(hostsRules));
            console.log('Tampermonkey Hosts: Rules saved.');
        } catch (e) {
            console.error('Tampermonkey Hosts: Failed to save rules to localStorage', e);
        }
    }

    function addRule(source, target) {
        source = source.trim().toLowerCase();
        target = target.trim();
        if (source && target) {
            hostsRules[source] = target;
            saveRules();
            renderRules(); // Re-render UI if it's open
            return true;
        }
        return false;
    }

    function deleteRule(source) {
        if (confirm(`Are you sure you want to delete the rule for "${source}"?`)) {
            delete hostsRules[source];
            saveRules();
            renderRules(); // Re-render UI if it's open
        }
    }

    function clearRuleInputs() {
        document.getElementById('tmSourceInput').value = '';
        document.getElementById('tmTargetInput').value = '';
    }

    // --- UI Management ---

    function createManagementUI() {
        if (document.getElementById('tmHostsManagerOverlay')) {
            // UI already exists
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'tmHostsManagerOverlay';
        overlay.innerHTML = `
            <div id="tmHostsManagerPanel">
                <span class="close-button-top" id="tmCloseManagerBtnTop">&times;</span>
                <h2>Browser Hosts Manager</h2>
                <div class="info-text">
                    Add rules to redirect websites. Use 'BLOCK' as the target URL to redirect to <code>about:blank</code> (effectively blocking).
                    <br>Rules are matched against the hostname (e.g., <code>www.google.com</code>) or its subdomains.
                </div>
                <div>
                    <label for="tmSourceInput">Source Hostname (e.g., youtube.com, www.facebook.com):</label>
                    <input type="text" id="tmSourceInput" placeholder="Enter source domain (e.g., badsite.com)" required>
                </div>
                <div>
                    <label for="tmTargetInput">Target URL (e.g., https://newsite.com, or BLOCK):</label>
                    <input type="text" id="tmTargetInput" placeholder="Enter target URL or 'BLOCK'" required>
                </div>
                <button id="tmAddRuleBtn">Add/Update Rule</button>
                <button id="tmCloseManagerBtnBottom" class="close">Close</button>

                <div id="rulesList">
                    <h3>Current Rules:</h3>
                    <div id="tmRulesContainer">
                        </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Event Listeners
        document.getElementById('tmAddRuleBtn').addEventListener('click', () => {
            const source = document.getElementById('tmSourceInput').value;
            const target = document.getElementById('tmTargetInput').value;
            if (addRule(source, target)) {
                clearRuleInputs();
            } else {
                alert('Please provide both a source hostname and a target URL.');
            }
        });

        document.getElementById('tmCloseManagerBtnTop').addEventListener('click', closeManagementUI);
        document.getElementById('tmCloseManagerBtnBottom').addEventListener('click', closeManagementUI);

        // Allow clicking outside the panel to close it
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeManagementUI();
            }
        });

        renderRules();
    }

    function renderRules() {
        const rulesContainer = document.getElementById('tmRulesContainer');
        if (!rulesContainer) return; // UI not open

        rulesContainer.innerHTML = ''; // Clear previous rules

        if (Object.keys(hostsRules).length === 0) {
            rulesContainer.innerHTML = '<p>No rules added yet. Add your first rule above!</p>';
            return;
        }

        for (const source in hostsRules) {
            if (hostsRules.hasOwnProperty(source)) {
                const target = hostsRules[source];
                const ruleItem = document.createElement('div');
                ruleItem.classList.add('rule-item');
                ruleItem.innerHTML = `
                    <span><b>${source}</b> &rarr; ${target === 'BLOCK' ? '<span style="color:red; font-weight:bold;">BLOCK</span>' : target}</span>
                    <div class="actions">
                        <button class="delete" data-source="${source}">Delete</button>
                    </div>
                `;
                rulesContainer.appendChild(ruleItem);

                ruleItem.querySelector('.delete').addEventListener('click', (event) => {
                    deleteRule(event.target.dataset.source);
                });
            }
        }
    }

    function openManagementUI() {
        createManagementUI();
        document.getElementById('tmHostsManagerOverlay').style.display = 'flex';
        renderRules(); // Ensure rules are up-to-date when opening
    }

    function closeManagementUI() {
        const overlay = document.getElementById('tmHostsManagerOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // --- Main Script Logic ---

    async function initializeAndRun() {
        await loadRules(); // Load rules asynchronously at script start

        const currentHostname = window.location.hostname;
        const currentPath = window.location.pathname;

        // Check for management UI trigger URL
        if (currentPath === MANAGEMENT_URL_PATH) {
            // Prevent the original page from loading
            document.documentElement.innerHTML = ''; // Clear existing content
            document.head.innerHTML = ''; // Clear head content
            document.title = 'Browser Hosts Manager'; // Set a temporary title
            openManagementUI();
            // Stop further script execution for the main page logic
            return;
        }

        // Check for redirection rules
        for (const domain in hostsRules) {
            if (hostsRules.hasOwnProperty(domain)) {
                // More robust check: exact match or currentHostname ends with '.' + domain
                // This covers www.example.com for example.com, but not example.com for an-example.com
                if (currentHostname === domain || currentHostname.endsWith('.' + domain)) {
                    const redirectTarget = hostsRules[domain];

                    if (redirectTarget === 'BLOCK') {
                        // Redirect to about:blank to "block" the site
                        window.location.replace('about:blank');
                        // Prevent the original page from loading further
                        throw new Error('Site blocked by Tampermonkey script.');
                    } else {
                        // Redirect to a specific URL
                        window.location.replace(redirectTarget);
                        // Prevent the original page from loading further
                        throw new Error('Site redirected by Tampermonkey script.');
                    }
                }
            }
        }
    }

    // Run the initialization and main logic
    initializeAndRun();

    // Add keyboard shortcut listener for convenience
    document.addEventListener('keydown', (e) => {
        const [modifier, key] = MANAGEMENT_TRIGGER_KEY.split('+');
        if (e.altKey === (modifier === 'Alt') &&
            e.shiftKey === (modifier === 'Shift') &&
            e.ctrlKey === (modifier === 'Control') &&
            e.key.toUpperCase() === key.toUpperCase()) {
            e.preventDefault(); // Prevent default browser action
            openManagementUI();
        }
    });

    // Option to open management UI from Tampermonkey's menu
    // This part is more for a context menu or similar, Tampermonkey doesn't have a direct GM_registerMenuCommand
    // However, the keyboard shortcut or the specific URL will serve the purpose.

})();
