// ==UserScript==
// @name         Envato Elements Quick Downloader
// @namespace    Finickyspider://envato/auto
// @version      1.6
// @description  Automatically selects your configured Envato Elements project and/or collection, triggers “Add & Download,” and closes modals. Defaults to “My Project” & collections off—be sure to configure!
// @author       FinickySpider
// @match        https://elements.envato.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535290/Envato%20Elements%20Quick%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/535290/Envato%20Elements%20Quick%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === SETTINGS STORAGE KEYS & DEFAULTS ===
    const KEY_PROJECT        = 'envato_targetProject';
    const KEY_ENABLED        = 'envato_autoEnabled';
    const KEY_COLLECTION     = 'envato_targetCollection';
    const KEY_COL_ENABLED    = 'envato_collectEnabled';

    let targetProject         = GM_getValue(KEY_PROJECT, 'My Project');
    let autoDownloadEnabled   = GM_getValue(KEY_ENABLED, true);
    let collectionName        = GM_getValue(KEY_COLLECTION, 'My Collection');
    let autoCollectionEnabled = GM_getValue(KEY_COL_ENABLED, false);
    // =========================================

    // --- Settings Panel via Tampermonkey Menu ---
    GM_registerMenuCommand("⚙️ Open Settings Panel", showSettingsPanel);

    const handledModals = new WeakSet();

    // Observe for new modals (project & collection)
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                // Project modal
                const projModal = node.matches('[data-testid="add-to-project-modal"]')
                    ? node
                    : node.querySelector?.('[data-testid="add-to-project-modal"]');
                if (projModal && autoDownloadEnabled && !handledModals.has(projModal)) {
                    handledModals.add(projModal);
                    initProjectModal(projModal);
                }

                // Collection modal
                const colModal = node.matches('[data-testid="existing-collections-modal"]')
                    ? node
                    : node.querySelector?.('[data-testid="existing-collections-modal"]');
                if (colModal && autoCollectionEnabled && !handledModals.has(colModal)) {
                    handledModals.add(colModal);
                    initCollectionModal(colModal);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Project handling (unchanged) ---
    function initProjectModal(modal) {
        const selector = `input[type="radio"][value="${targetProject}"]`;
        const radio = modal.querySelector(selector);
        if (radio) {
            radio.click();
            waitForDownloadButton(modal);
        } else {
            const radioObserver = new MutationObserver((ms, obs) => {
                const r = modal.querySelector(selector);
                if (r) {
                    obs.disconnect();
                    r.click();
                    waitForDownloadButton(modal);
                }
            });
            radioObserver.observe(modal, { childList: true, subtree: true });
        }
    }

    function waitForDownloadButton(modal) {
        const btn = modal.querySelector('[data-testid="add-download-button"]');
        if (btn) {
            const interval = setInterval(() => {
                if (!btn.disabled) {
                    btn.click();
                    clearInterval(interval);
                }
            }, 200);
        } else {
            const btnObserver = new MutationObserver((ms, obs) => {
                const b = modal.querySelector('[data-testid="add-download-button"]');
                if (b) {
                    obs.disconnect();
                    const interval = setInterval(() => {
                        if (!b.disabled) {
                            b.click();
                            clearInterval(interval);
                        }
                    }, 200);
                }
            });
            btnObserver.observe(modal, { childList: true, subtree: true });
        }
    }

    // --- Collection handling (updated) ---
    function initCollectionModal(modal) {
        const attempt = () => {
            const labels = modal.querySelectorAll('label[data-testid^="collection-list-checkbox-item-"]');
            for (const label of labels) {
                const span = label.querySelector('span._7yoIykb4');
                if (span && span.textContent.trim() === collectionName) {
                    const checkbox = label.querySelector('input[type="checkbox"]');
                    if (!checkbox) continue;
                    // If already added, just close
                    if (checkbox.checked) {
                        const closeBtn = modal.querySelector('[data-testid="close-modal-button"]');
                        if (closeBtn) closeBtn.click();
                    } else {
                        checkbox.click();
                        waitForCheckboxAndClose(modal, checkbox);
                    }
                    return true;
                }
            }
            return false;
        };
        if (!attempt()) {
            const colObserver = new MutationObserver((ms, obs) => {
                if (attempt()) obs.disconnect();
            });
            colObserver.observe(modal, { childList: true, subtree: true });
        }
    }

    function waitForCheckboxAndClose(modal, checkbox) {
        const interval = setInterval(() => {
            if (checkbox.checked) {
                const closeBtn = modal.querySelector('[data-testid="close-modal-button"]');
                if (closeBtn) closeBtn.click();
                clearInterval(interval);
            }
        }, 200);
    }

    // --- Settings panel UI ---
    function showSettingsPanel() {
        if (document.querySelector('#tm-settings-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'tm-settings-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: '2147483647',
            padding: '20px',
            background: '#111',
            color: '#eee',
            border: '2px solid #444',
            borderRadius: '8px',
            minWidth: '300px'
        });
        panel.innerHTML = `
            <h3 style="margin-top:0">⚙️ Envato Elements Settings</h3>

            <label>
              <input type="checkbox" id="autoEnabled">
              Enable auto-add & download
            </label><br><br>

            <label>
              Project Name (exact match):<br>
              <input type="text" id="projectName" style="width:100%; margin-top:4px;">
            </label><br><br>

            <label>
              <input type="checkbox" id="collectionEnabled">
              Enable auto-add to collection
            </label><br><br>

            <label>
              Collection Name (exact match):<br>
              <input type="text" id="collectionName" style="width:100%; margin-top:4px;">
            </label><br><br>

            <button id="saveSettings" style="margin-top:8px">Save</button>
            <button id="closeSettings" style="float:right">Close</button>
        `;
        document.body.appendChild(panel);

        panel.querySelector('#autoEnabled').checked      = autoDownloadEnabled;
        panel.querySelector('#projectName').value        = targetProject;
        panel.querySelector('#collectionEnabled').checked = autoCollectionEnabled;
        panel.querySelector('#collectionName').value     = collectionName;

        panel.querySelector('#closeSettings').addEventListener('click', () => panel.remove());
        panel.querySelector('#saveSettings').addEventListener('click', () => {
            autoDownloadEnabled   = panel.querySelector('#autoEnabled').checked;
            targetProject         = panel.querySelector('#projectName').value.trim()        || targetProject;
            autoCollectionEnabled = panel.querySelector('#collectionEnabled').checked;
            collectionName        = panel.querySelector('#collectionName').value.trim()     || collectionName;

            GM_setValue(KEY_ENABLED, autoDownloadEnabled);
            GM_setValue(KEY_PROJECT, targetProject);
            GM_setValue(KEY_COL_ENABLED, autoCollectionEnabled);
            GM_setValue(KEY_COLLECTION, collectionName);

            panel.remove();

            if (autoDownloadEnabled) {
                document.querySelectorAll('[data-testid="add-to-project-modal"]').forEach(m => {
                    if (!handledModals.has(m)) {
                        handledModals.add(m);
                        initProjectModal(m);
                    }
                });
            }
            if (autoCollectionEnabled) {
                document.querySelectorAll('[data-testid="existing-collections-modal"]').forEach(m => {
                    if (!handledModals.has(m)) {
                        handledModals.add(m);
                        initCollectionModal(m);
                    }
                });
            }
        });
    }

    // --- Hotkey: Ctrl+Alt+P to open settings panel ---
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
            showSettingsPanel();
            e.preventDefault();
        }
    });

})();
