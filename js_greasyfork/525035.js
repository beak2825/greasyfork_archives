// ==UserScript==
// @name         MayhemHub Payout Extension
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  Tampermonkey script extension for processing RW CSV payouts within Torn.
// @author       IAMAPEX [2523988]
// @match        https://www.torn.com/*
// @grant        none
// @license      CC BY-NC-ND 4.0; https://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/525035/MayhemHub%20Payout%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/525035/MayhemHub%20Payout%20Extension.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isCancelled = false;
    let savedFile = null;
    let panelOpen = false;
    let panelDiv = null;

    let useManualColumns = false;
    let selectedColumnIndex = "abcLayout";
    let manualIDIndex = 0;
    let manualNameIndex = 1;
    let manualPayIndex = 2;
    let manualRowSkip = 7;

    function addCustomButton() {
        waitForElement('.chat-setting-button___miWbI', (chatSettingsButton) => {
            const buttonClone = chatSettingsButton.cloneNode(true);
            buttonClone.innerHTML = '';

            const customButton = document.createElement('div');
            customButton.style.backgroundImage = 'url("https://mayhemhub.net/images/payout_icon.png")';
            customButton.style.backgroundSize = 'cover';
            customButton.style.width = '34px';
            customButton.style.height = '34px';
            customButton.style.display = 'block';
            customButton.style.margin = 'auto';
            customButton.style.cursor = 'pointer';

            buttonClone.addEventListener('click', togglePanel);
            buttonClone.style.display = 'flex';
            buttonClone.style.justifyContent = 'center';
            buttonClone.style.alignItems = 'center';
            buttonClone.style.padding = '0';

            buttonClone.appendChild(customButton);
            chatSettingsButton.parentElement.insertBefore(buttonClone, chatSettingsButton.nextSibling);
        });
    }

    function togglePanel() {
        if (panelOpen) {
            closePanel();
        } else {
            openPanel();
        }
    }

    function closePanel() {
        if (panelDiv) {
            panelDiv.remove();
            panelDiv = null;
        }
        panelOpen = false;
        document.removeEventListener('click', closeOutsideClick);
    }

    function openPanel() {
        panelOpen = true;
        waitForElement('.chat-app__chat-list-chat-box-wrapper___S7MmX', (parentWrap) => {
            panelDiv = document.createElement('div');
            panelDiv.className = 'chat-app__panel___wh6nM';

            const settingsPanel = document.createElement('div');
            settingsPanel.className = 'settings-panel___IZSDs';

            const header = document.createElement('div');
            header.className = 'settings-header___ih6Rs';
            header.innerHTML = `
                <div class="settings-header__text-container___iQ8kM">
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"
                       id="setting-header-icon" class="settings-header__icon___fd89P">
                    <defs>
                      <linearGradient id="setting_default" x1="0.5" x2="0.5" y2="1">
                        <stop offset="0" stop-color="#8faeb4"></stop>
                        <stop offset="1" stop-color="#638c94"></stop>
                      </linearGradient>
                    </defs>
                    <g>
                      <!-- Torn gear path -->
                      <path d="M1443,19.674a8.407,8.407,0,0,0-.659-1.593,2.576,
                               2.576,0,0,1-2.582-.84,2.492,2.492,0,0,1-.65-2.582,
                               8.4,8.4,0,0,0-1.592-.659,2.828,2.828,0,0,1-5.034,0,
                               8.4,8.4,0,0,0-1.592.659,2.492,2.492,0,0,1-.65,
                               2.582,2.578,2.578,0,0,1-2.582.841,8.371,8.371,0,
                               0,0-.659,1.592A2.722,2.722,0,0,1,1428.539,22,
                               3.015,3.015,0,0,1,1427,24.517a8.4,8.4,0,0,0,
                               .659,1.592,2.595,2.595,0,0,1,3.232,3.232,
                               8.338,8.338,0,0,0,1.592.659,2.828,2.828,0,0,1,
                               5.034,0,8.4,8.4,0,0,0,1.592-.659,2.492,2.492,0,
                               0,1,.65-2.582,2.576,2.576,0,0,1,2.582-.84,8.407,
                               8.407,0,0,0,.659-1.593A2.722,2.722,0,0,1,
                               1441.461,22,2.722,2.722,0,0,1,1443,19.674Z
                               m-8,5.805A3.479,3.479,0,1,1,1438.479,22,
                               3.48,3.48,0,0,1,1435,25.479Z"
                            transform="translate(-1418 -5)"
                            fill="url(#setting_default)"></path>
                    </g>
                  </svg>
                  <p class="typography___Dc5WV body3 bold color-white settings-header__text___iuLeJ">
                    Payout Settings
                  </p>
                </div>
                <button type="button" class="settings-header__close-button___QuRy7">
                  <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
                    <defs>
                      <linearGradient id="settings-header_close_default_blue" x1="0.5" x2="0.5" y2="1">
                        <stop offset="0" stop-color="#8faeb4"></stop>
                        <stop offset="1" stop-color="#638c94"></stop>
                      </linearGradient>
                    </defs>
                    <g>
                      <!-- X path -->
                      <path d="M14,11.776,9.15,6.988l4.783-4.831L11.776,0,
                               6.986,4.852,2.138.067,0,2.206,4.854,7.012.067,
                               11.861,2.206,14l4.8-4.852,4.833,4.785Z"
                            transform="translate(10 10)"
                            fill="url(#settings-header_close_default_blue)"></path>
                    </g>
                  </svg>
                </button>
            `;

            header.addEventListener('click', () => {
                closePanel();
            });
            const closeBtn = header.querySelector('.settings-header__close-button___QuRy7');
            closeBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                closePanel();
            });

            const contentSection = document.createElement('div');
            contentSection.className = 'settings-panel__section___Jszgh';
            contentSection.style.maxHeight = '300px';
            contentSection.style.overflowY = 'auto';

            buildCsvForm(contentSection);

            settingsPanel.appendChild(header);
            settingsPanel.appendChild(contentSection);
            panelDiv.appendChild(settingsPanel);

            parentWrap.appendChild(panelDiv);

            setTimeout(() => {
                document.addEventListener('click', closeOutsideClick);
            }, 100);
        });
    }

    function closeOutsideClick(event) {
        if (!panelDiv) return;
        if (!panelDiv.contains(event.target) &&
            !event.target.closest('.chat-setting-button___miWbI')) {
            closePanel();
        }
    }

    function buildCsvForm(parentEl) {
        // File input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'block';
        fileInput.style.margin = '10px 0';

        const payoutButton = document.createElement('button');
        payoutButton.textContent = 'Payout';
        payoutButton.className = 'torn-btn';
        payoutButton.style.display = 'block';
        payoutButton.style.marginTop = '10px';
        payoutButton.disabled = true;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'torn-btn';
        cancelButton.style.display = 'block';
        cancelButton.style.marginTop = '10px';

        fileInput.addEventListener('change', () => {
            payoutButton.disabled = !fileInput.files.length;
        });

        const label = document.createElement('label');
        label.textContent = 'Select Payout Column Layout:';
        label.style.display = 'block';
        label.style.marginTop = '10px';

        const columnSelect = document.createElement('select');
        columnSelect.style.marginTop = '5px';
        columnSelect.innerHTML = `
          <option value="abcLayout">CSV Tab V3 (A,B,C, Row 2)</option>
          <option value="16">RWSheet V3 (Col. Q)</option>
          <option value="10">RWSheet V1 (Col. K)</option>
          <option value="11">RWSheet V2 full (Col. L)</option>
          <option value="13">RWSheet V2 Red (Col. N)</option>
          <option value="manual">Manual input</option>
        `;

        const manualDiv = document.createElement('div');
        manualDiv.style.display = 'none';
        manualDiv.style.marginTop = '10px';

        const manualLabel = document.createElement('p');
        manualLabel.textContent = 'Manual Column Selection:';
        manualLabel.style.fontWeight = 'bold';
        manualLabel.style.marginBottom = '5px';
        manualLabel.style.color = '#fff';

        const rowLabel = document.createElement('label');
        rowLabel.textContent = 'Row start: ';
        rowLabel.style.marginLeft = '10px';

        const rowInput = document.createElement('input');
        rowInput.type = 'number';
        rowInput.value = '7'; // default
        rowInput.style.width = '50px';
        rowInput.min = '1';

        rowLabel.appendChild(rowInput);

        const rowFlex = document.createElement('div');
        rowFlex.style.display = 'flex';
        rowFlex.style.gap = '8px';
        rowFlex.style.alignItems = 'center';
        rowFlex.appendChild(rowLabel);

        const colRow = document.createElement('div');
        colRow.style.display = 'flex';
        colRow.style.gap = '6px';
        colRow.style.alignItems = 'center';
        colRow.style.marginTop = '5px';

        function makeLetterDropdown(defLetter, onChange) {
            const sel = document.createElement('select');
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
                const opt = document.createElement('option');
                opt.value = letter;
                opt.textContent = letter;
                sel.appendChild(opt);
            });
            sel.value = defLetter;
            sel.addEventListener('change', () => {
                onChange(letterToIndex(sel.value));
            });
            return sel;
        }

        const idLabel = document.createElement('label');
        idLabel.textContent = 'ID';
        const idSel = makeLetterDropdown('A', v => { manualIDIndex = v; });

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name';
        const nameSel = makeLetterDropdown('B', v => { manualNameIndex = v; });

        const payLabel = document.createElement('label');
        payLabel.textContent = 'Pay';
        const paySel = makeLetterDropdown('C', v => { manualPayIndex = v; });

        colRow.appendChild(idLabel);
        colRow.appendChild(idSel);
        colRow.appendChild(nameLabel);
        colRow.appendChild(nameSel);
        colRow.appendChild(payLabel);
        colRow.appendChild(paySel);

        manualDiv.appendChild(manualLabel);
        manualDiv.appendChild(colRow);
        manualDiv.appendChild(rowFlex);

        columnSelect.addEventListener('change', () => {
            const val = columnSelect.value;
            if (val === 'manual') {
                useManualColumns = true;
                manualDiv.style.display = 'block';
            } else if (val === 'abcLayout') {
                useManualColumns = false;
                manualDiv.style.display = 'none';
                selectedColumnIndex = "abcLayout";
            } else {
                useManualColumns = false;
                manualDiv.style.display = 'none';
                selectedColumnIndex = parseInt(val, 10);
            }
        });

        payoutButton.addEventListener('click', () => {
            isCancelled = false;

            const currentUrl = window.location.href;
            const correctUrl1 = 'https://www.torn.com/factions.php?step=your&type=1#/tab=controls';
            const correctUrl2 = 'https://www.torn.com/factions.php?step=your&type=1#/tab=controls&option=give-to-user';

            function processPayoutAfterNavigation(file) {
                let skipRows;
                if (!useManualColumns) {
                    if (selectedColumnIndex === 16) {
                        skipRows = 5;
                        parseAndProcessCSV(file, skipRows);
                    } else if (selectedColumnIndex === 10 || selectedColumnIndex === 11 || selectedColumnIndex === 13) {
                        skipRows = 6;
                        parseAndProcessCSV(file, skipRows);
                    } else if (selectedColumnIndex === "abcLayout") {
                        parseAndProcessCSV(file, 1, "abcLayout");
                    } else {
                        skipRows = 6;
                        parseAndProcessCSV(file, skipRows);
                    }
                } else {
                    const r = parseInt(rowInput.value, 10) || 1;
                    skipRows = Math.max(r - 1, 0);
                    parseAndProcessCSV(file, skipRows);
                }
            }

            if (currentUrl === correctUrl1 || currentUrl === correctUrl2) {
                processPayoutAfterNavigation(fileInput.files[0]);
            } else {
                if (confirm('You are not on the correct page. Navigate there now?')) {
                    savedFile = fileInput.files[0];
                    window.location.href = correctUrl2;
                }
            }
        });

        cancelButton.addEventListener('click', () => {
            isCancelled = true;
        });

        parentEl.appendChild(label);
        parentEl.appendChild(columnSelect);
        parentEl.appendChild(manualDiv);
        parentEl.appendChild(fileInput);
        parentEl.appendChild(payoutButton);
        parentEl.appendChild(cancelButton);
    }

    function parseAndProcessCSV(file, skipRows, layoutCode) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const csvString = event.target.result;
            let allRows = parseCSV(csvString);
            allRows = allRows.slice(skipRows);

            let index = 0;
            function processNextRow() {
                if (index < allRows.length) {
                    const columns = allRows[index];
                    let id, name, amount;

                    // 1) If the user chose the "abcLayout", use columns [0,1,2].
                    //    ignoring "selectedColumnIndex"
                    if (layoutCode === "abcLayout") {
                        id = columns[0];
                        name = columns[1];
                        amount = columns[2];

                        // 2) If not manual, do your existing logic
                    } else if (!useManualColumns) {
                        id = columns[0];
                        name = columns[1];
                        amount = columns[selectedColumnIndex];

                        // 3) manual columns
                    } else {
                        id = columns[manualIDIndex];
                        name = columns[manualNameIndex];
                        amount = columns[manualPayIndex];
                    }

                    if (id && name && amount) {
                        const userName = `${name.trim()} [${id.trim()}]`;
                        fillFormAndSubmit(userName, amount.trim(), () => {
                            index++;
                            processNextRow();
                        });
                    } else {
                        alert('Payout process completed for all rows with data.');
                    }
                } else {
                    alert('Payout process completed for all rows with data.');
                }
            }
            processNextRow();
        };
        reader.readAsText(file);
    }

    function fillFormAndSubmit(userName, amount, callback) {
        if (isCancelled) {
            alert('Payout process cancelled.');
            return;
        }
        waitForElement('#money-user', el => {
            el.value = userName;
            el.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                waitForElement('.input-money', el2 => {
                    el2.value = amount;
                    el2.dispatchEvent(new Event('input', { bubbles: true }));

                    setTimeout(() => {
                        waitForElement('#add-to-balance-money', el3 => {
                            el3.checked = true;
                            el3.dispatchEvent(new Event('change', { bubbles: true }));

                            setTimeout(() => {
                                waitForElement('button[aria-label="Add money"]', el4 => {
                                    el4.click();

                                    setTimeout(() => {
                                        waitForElement('button.confirm-btn', el5 => {
                                            el5.click();
                                            setTimeout(callback, 1000);
                                        }, 500);
                                    }, 500);
                                });
                            }, 500);
                        });
                    }, 500);
                });
            }, 500);
        });
    }

    function parseCSV(data) {
        const rows = [];
        const lines = data.split(/\r?\n/);

        for (let line of lines) {
            if (!line.trim()) {
                rows.push([]);
                continue;
            }
            let tokens = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
            if (!tokens) {
                rows.push([]);
                continue;
            }
            tokens = tokens.map(t => {
                t = t.trim();
                if (t.startsWith('"') && t.endsWith('"')) {
                    t = t.slice(1, -1);
                    t = t.replace(/""/g, '"');
                }
                return t;
            });
            rows.push(tokens);
        }
        return rows;
    }

    window.addEventListener('load', function () {
        if (savedFile) {
            parseAndProcessCSV(savedFile, 5);
            savedFile = null;
        }
    });

    addCustomButton();

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 150);
        }
    }
})();
