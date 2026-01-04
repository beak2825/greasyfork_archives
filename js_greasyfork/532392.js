// ==UserScript==
// @name         ShadConnect | Foreman Mode
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Foreman Mode: Sign-in, Prestart Generator, PTA Helper, and a Preferences Panel
// @match        https://employee.shadconnect.com.au/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532392/ShadConnect%20%7C%20Foreman%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/532392/ShadConnect%20%7C%20Foreman%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Append Icon Font to Head
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);


    // PTA Tool Standalone Code - Starts Here
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRg_UV1Bj6FKzxU4iVmyX0mwLaAd5lQtZIIemLFgbO3bmsZPXzd5vmuUtGDzLrZv23RWiqfOCcsqv54/pub?output=csv";
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    async function fetchTemplatesFromCSV(url) {
        const res = await fetch(url);
        const text = await res.text();
        const lines = text.trim().split("\n");
        const [header, ...rows] = lines.map(line => line.split(","));

        return rows.map(cols => {
            const [taskCategory, hazardType, taskDescription, hazardDescription, controlsRaw] = cols;
            return {
                taskCategory: taskCategory.trim(),
                hazardType: hazardType.trim(),
                taskDescription: taskDescription.trim(),
                hazardDescription: hazardDescription.trim(),
                controls: controlsRaw.split(";").map(c => c.trim())
            };
        });
    }

    function fireAngularInputEvents(el, value) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function clickYesCheckboxes() {
        const checkboxes = Array.from(document.querySelectorAll('.dx-checkbox')).filter(cb => {
            const label = cb.querySelector('.dx-checkbox-text');
            return label && /yes|true/i.test(label.textContent.trim());
        });
        checkboxes.forEach(cb => {
            if (!cb.classList.contains('dx-checkbox-checked')) cb.click();
        });
    }

    function selectDxLookupByLabel(labelMatchText, optionText, callback) {
        const normalize = str => str.replace(/\s+/g, ' ').trim().toLowerCase();
        const fields = [...document.querySelectorAll('.field')];
        const match = fields.find(field => {
            const label = field.querySelector('.field-label') ?.textContent ?.toLowerCase();
            return label && label.includes(labelMatchText.toLowerCase());
        });
        if (!match) return callback ?.();

        const dxLookup = match.querySelector('dx-lookup');
        const toggle = dxLookup ?.querySelector('.dx-lookup-field');
        if (!toggle) return callback ?.();

        toggle.click();

        let attempts = 0;
        const interval = setInterval(() => {
            const overlays = document.querySelectorAll('.dx-overlay-wrapper');
            const lastOverlay = overlays[overlays.length - 1];
            const items = [...lastOverlay ?.querySelectorAll('.dx-list-item') || []];
            const matchItem = items.find(opt => normalize(opt.textContent) === normalize(optionText));

            if (matchItem) {
                matchItem.click();
                document.body.click();
                clearInterval(interval);
                callback ?.();
            } else if (++attempts > 10) {
                console.warn(`[PTA Autofill] Option '${optionText}' not found for '${labelMatchText}'`);
                clearInterval(interval);
                callback ?.();
            }
        }, 100);
    }

    function waitAndAutofill(template) {
        const observer = new MutationObserver(() => {
            const taskInput = document.querySelector('dx-text-box input.dx-texteditor-input');
            const textareas = document.querySelectorAll('textarea.dx-texteditor-input');
            if (taskInput && textareas.length >= 2) {
                const [hazardField, controlField] = textareas;
                fireAngularInputEvents(taskInput, template.taskDescription);
                fireAngularInputEvents(hazardField, "");
                fireAngularInputEvents(controlField, "");
                setTimeout(() => {
                    fireAngularInputEvents(hazardField, template.hazardDescription);
                    fireAngularInputEvents(controlField, template.controls.join('\n'));

                    setTimeout(() => {
                        if (!hazardField.value.trim()) {
                            console.log("[PTA Autofill] Re-applying hazard field");
                            fireAngularInputEvents(hazardField, template.hazardDescription);
                        }
                        if (!controlField.value.trim()) {
                            console.log("[PTA Autofill] Re-applying control field");
                            fireAngularInputEvents(controlField, template.controls.join('\n'));
                        }
                    }, 1000);

                }, 300);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function openTemplateModal(templates) {
        const modal = document.createElement('div');
        modal.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            z-index: 9999;
            padding: 16px;
            width: 600px;
            max-height: 80vh;
            overflow: auto;
            font-family: sans-serif;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.4);
        `;

        const title = document.createElement('h3');
        title.textContent = "Select a PTA Template";
        modal.appendChild(title);

        templates.forEach((t, i) => {
            const btn = document.createElement('button');
            btn.style = `
                display: block;
                width: 100%;
                text-align: left;
                margin: 5px 0;
                padding: 8px;
                background: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
            `;
            btn.innerHTML = `<strong>${t.taskCategory}</strong> — <em>${t.hazardType}</em><br><small>${t.taskDescription}</small>`;
            btn.onclick = async () => {
                document.body.removeChild(modal);
                clickYesCheckboxes();
                await sleep(800);
                selectDxLookupByLabel("Task Category", t.taskCategory, () => {
                    const taskInput = document.querySelector('dx-text-box input.dx-texteditor-input');
                    fireAngularInputEvents(taskInput, t.taskDescription);
                    setTimeout(() => {
                        selectDxLookupByLabel("Hazard Type", t.hazardType, () => {
                            waitAndAutofill(t);
                        });
                    }, 400);
                });
            };
            modal.appendChild(btn);
        });

        const cancel = document.createElement('button');
        cancel.textContent = "Cancel";
        cancel.style = "margin-top: 10px; padding: 6px 12px; background: #eee; border: none; border-radius: 4px;";
        cancel.onclick = () => document.body.removeChild(modal);
        modal.appendChild(cancel);

        document.body.appendChild(modal);
    }

    const button = document.createElement('button');
    button.textContent = "Autofill PTA";
    button.style = `opacity: 0;`;

    button.onclick = async () => {
        button.disabled = true;
        button.textContent = "Loading templates...";
        const templates = await fetchTemplatesFromCSV(localStorage.getItem('ptaCSVUrl'));
        button.disabled = false;
        button.textContent = "Autofill PTA";
        openTemplateModal(templates);
    };

    document.body.appendChild(button);
    // PTA Tool Standalone Code - Ends Here

    // --- Prestart Generator code ---
    function waitForElement(selector, timeout = 10000) {
        console.log(`[Prestart] Waiting for: ${selector}`);
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    console.log(`[Prestart] Found: ${selector}`);
                    clearInterval(timer);
                    resolve(el);
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(`[Prestart] Timeout waiting for ${selector}`);
                }
            }, 300);
        });
    }

    function waitForTextContent(selector, matchText, timeout = 10000) {
        console.log(`[Prestart] Waiting for text "${matchText}" in: ${selector}`);
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                for (let el of elements) {
                    if (el.textContent.trim() === matchText.trim()) {
                        console.log(`[Prestart] Found element with text: "${matchText}"`);
                        clearInterval(timer);
                        resolve(el);
                        return;
                    }
                }
                if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(`[Prestart] Timeout waiting for text "${matchText}" in ${selector}`);
                }
            }, 300);
        });
    }

    async function initPrestartFlow() {
        try {
            const addBtn = await waitForElement('app-kick-off-meeting-list > div > div i');
            addBtn.click();

            const kickOffOption = await waitForTextContent('div[role="generic"], div.dx-item-content', 'Kick Off');
            kickOffOption.click();

            await waitForTextContent('.title-popup', 'New Kick Off Meeting');

            const siteDropdown = await waitForElement('[displayexpr="siteName"] .dx-lookup-field');
            await waitForElement('.dx-scrollable-content .dx-list-item-content', 10000);
            siteDropdown.click();
            console.log('[Prestart] Opened site dropdown — waiting for user to select site manually...');

            // After selection, wait for the copy button
            const siteSelected = await new Promise((resolve, reject) => {
                const field = document.querySelector('[displayexpr="siteName"] .dx-lookup-field');
                const start = Date.now();
                const timer = setInterval(() => {
                    const val = field ?.textContent ?.trim();
                    if (val && val.length > 0 && val !== 'Select...') {
                        clearInterval(timer);
                        console.log(`[Prestart] Detected selected site: ${val}`);
                        resolve(val);
                    }
                    if (Date.now() - start > 20000) {
                        clearInterval(timer);
                        reject('[Prestart] Timeout waiting for site selection');
                    }
                }, 300);
            });

            const copyBtn = await waitForTextContent('dx-button .dx-button-text', 'Copy Previous Meeting', 10000);
            copyBtn.closest('dx-button').click();
            console.log('[Prestart] Clicked "Copy Previous Meeting"');

        } catch (err) {
            console.error('[Prestart Flow] Error:', err);
            alert(`[Prestart Error]\n${err}`);
        }
    }

    window.addEventListener('load', () => {
        const dashboard = document.createElement('div');
        dashboard.setAttribute("class", "fmContainer open");
        dashboard.innerHTML = `
        <style>

            .fmContainer, .submitModal {
                width: 180px;
                position: fixed;
                top: 0;
                right: 145px;
                z-index:99999;
                background-color: #636b70;
                font-family: Geomanist-Book,serif;
                font-size: 16px;
                padding: 15px;
                border:none;
                border-radius: 8px;
                box-shadow: 0px 0px grey;
                transition: box-shadow .3s ease-in-out;
            }

            .fmContainer.open {
                box-shadow: 5px 5px #d3dc26
            }

            .fmContainer button, .submitModal button {
                width: 100%;
                margin-bottom: 8px;
                font-family: Geomanist-Book,serif;
                font-size: 10pt;
                background-color: teal;
                color: white;
                border: none;
                cursor: pointer;
                padding: 8px 12px;
                transition:  border-radius .3s;
                text-transform: uppercase;
            }

            .submitModal {
    top: auto !important;
    bottom: 100px;
                box-shadow: 5px 5px #d3dc26;
    color: white !important;
}

            .submitModal ul {
            margin: 0;
    padding: 0 0 0 16px;
            }

            .submitModal strong {margin-bottom: 6px;display:block;}
            .submitModal ul li::marker {
                color: #d3dc26;
            }

            #prefsBtn {
                background-color: grey;
            }

            .fmContainer button:hover {
                border-radius: 100px;
            }

            .currentPage{
                background-color: #d3dc26 !important;
                color: grey !important;
            }
            #toggleButton{
               cursor:pointer; color: white; font-weight: bold; margin-bottom: 20px; text-align: center;
            }
            #toggleButton:hover .menu-icon {

            }
            .words { float: left; }
            .menu-icon {
                width: 22px;
                height: 16px;
                position: relative;
                cursor: pointer;
                transition: transform 0.3s ease-in-out;
                float: right !important;
                margin: 4px 11px 0 0 !important;
            }

            .menu-icon span {
                position: absolute;
                height: 3px;
                width: 100%;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.menu-icon span:nth-child(1) {
  top: 0;
}

.menu-icon span:nth-child(2) {
  top: 6.5px;
}

.menu-icon span:nth-child(3) {
  top: 13px;
}

/* Open state transforms into an X */
.menu-icon.open span:nth-child(1) {
  transform: rotate(45deg);
  top: 6.5px;
}

.menu-icon.open span:nth-child(2) {
  opacity: 0;
}

.menu-icon.open span:nth-child(3) {
  transform: rotate(-45deg);
  top: 6.5px;
}
.clearfix {
  overflow: auto;
}
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}
.itemsWrapper {
    max-height: 500px;
    overflow: hidden;
    transition: max-height .3s ease-in-out;
}
.menuOpen.itemsWrapper {
    max-height:0;
}

        </style>

        <div>
            <div class="menuWrapper">
            <div id="toggleButton" class="clearfix">
                <div class="words">Foreman Mode</div><div id="menuIcon" class="menu-icon open"><span></span><span></span><span></span></div>
            </div>
<div class="itemsWrapper">
            <button id="enterSite" class="toggleTarget" data-url="https://employee.shadconnect.com.au/site-resources/digital-sign-on">
                <i class="fas fa-map"></i>&nbsp;&nbsp;Sign In
            </button>

            <button id="startPrestart" class="toggleTarget" data-url="https://employee.shadconnect.com.au/supervisor-resources/site-meetings">
                <i class="fas fa-atom"></i>&nbsp;&nbsp;Prestart
            </button>

            <button id="ptaHelper" class="toggleTarget" data-url="https://employee.shadconnect.com.au/employee-resources/pta-form" >
                <i class="fas fa-tasks"></i>&nbsp;&nbsp;PTA
            </button>

            <button id="machinePrestart" class="toggleTarget" data-url="https://employee.shadconnect.com.au/site-resources/equipment-prestart-checklist" >
                <i class="fas fa-truck-pickup"></i>&nbsp;&nbsp;Machines
            </button>

            <button id="prefsBtn" class="toggleTarget">
                <i class="fas fa-tools"></i>&nbsp;&nbsp;Preferences
            </button>
</div>
</div>
        </div>

        `;
        document.body.appendChild(dashboard);

        document.getElementById("toggleButton").addEventListener("click", () => {
            document.querySelectorAll(".toggleTarget").forEach(el => {
                el.classList.toggle("hidden");
            });
            document.querySelectorAll(".menu-icon").forEach(el => {
                el.classList.toggle("open");
            });
            document.querySelectorAll(".itemsWrapper").forEach(el => {
                el.classList.toggle("menuOpen");
            });
            document.querySelectorAll(".fmContainer").forEach(el => {
                el.classList.toggle("open");
            });
        });

        document.getElementById('ptaHelper').addEventListener('click', () => {
            // Check if we're on the correct PTA page, otherwise redirect
            const ptaUrl = 'https://employee.shadconnect.com.au/employee-resources/pta-form';
            if (window.location.href !== ptaUrl) {
                console.log('[Foreman Mode] Redirecting to PTA form page...');
                window.location.href = ptaUrl;
                return;
            }

            // Trigger the standalone PTA button
            button.click();
        });

        const currentPageUrl = window.location.href;

        const menuItems = document.querySelectorAll('.fmContainer button');

        menuItems.forEach(item => {
            // Get the value of the 'data-url' attribute for each menu item
            const menuItemUrl = item.getAttribute('data-url');

            // Check if the menu item's URL matches the current page URL
            if (menuItemUrl === currentPageUrl) {
                // If it matches, add the 'active' class
                item.classList.add('currentPage');
            } else {
                // Optionally remove the 'active' class if it doesn't match
                item.classList.remove('currentPage');
            }
        });


        document.getElementById('enterSite').addEventListener('click', () => {
            const signInUrl = 'https://employee.shadconnect.com.au/site-resources/digital-sign-on';
            if (window.location.href !== signInUrl) {
                console.log('[Foreman Mode] Redirecting to Sign In page...');
                window.location.href = signInUrl;
                return;
            }
            console.log('[Foreman Mode] Launching Sign In...');
            initSignIn();
        });

        document.getElementById('machinePrestart')?.addEventListener('click', () => {
            const targetUrl = "https://employee.shadconnect.com.au/site-resources/equipment-prestart-checklist";

            if (window.location.href.startsWith(targetUrl)) {
                // Wait briefly in case DOM is still loading
                runMachinePrestartAutomation();
            } else {
                window.location.href = targetUrl;
            }
        });

        async function runMachinePrestartAutomation() {
            console.log("[ForemanMode] Launching Machine Prestart automation...");

            // ====== CONFIG / STATE ======
            const sessionKey = `prestartSession-${new Date().toISOString().slice(0, 10)}`;
            const log = (...args) => console.log("[MachinePrestart]", ...args);

            let currentMachineIndex = parseInt(localStorage.getItem("currentMachineIndex")) || 0;
            let completedMachines = JSON.parse(localStorage.getItem("completedMachines") || "[]");
            let machineNames = [];

            // ====== UTILITY ======
            const waitFor = (selector, timeout = 20000) => new Promise((resolve, reject) => {
                log(`Waiting for: ${selector}`);
                const interval = 300;
                const maxAttempts = timeout / interval;
                let attempts = 0;
                const check = setInterval(() => {
                    const elem = document.querySelector(selector);
                    if (elem) {
                        clearInterval(check);
                        log(`Found: ${selector}`);
                        resolve(elem);
                    } else if (++attempts >= maxAttempts) {
                        clearInterval(check);
                        reject(`Timeout: ${selector}`);
                    }
                }, interval);
            });

            function displayAnomaly(message) {
                log("Anomaly:", message);
                const div = document.createElement('div');
                div.style.cssText = 'position:fixed;bottom:10px;left:10px;background:#ff4444;color:#fff;padding:8px;border-radius:5px;z-index:9999;';
                div.textContent = message;
                document.body.appendChild(div);
                setTimeout(() => div.remove(), 6000);
            }

            function fillForm() {
                log("Filling form inputs (looking for Pass and Yes checkboxes)...");
                const labels = Array.from(document.querySelectorAll('.lbl-answer-value'));
                let count = 0;
                labels.forEach(label => {
                    const text = label.textContent.trim().toLowerCase();
                    if (text === "pass" || text === "yes") {
                        const checkbox = label.closest('.d-flex')?.querySelector('.dx-checkbox');
                        if (checkbox && !checkbox.classList.contains('dx-checkbox-checked')) {
                            checkbox.click();
                            count++;
                        }
                    }
                });
                log(`Form fill complete. Selected ${count} checkboxes.`);
            }

            async function waitForMachineToRender(target) {
                const container = await waitFor('.dx-list-items', 10000).catch(() => null);
                if (!container) throw new Error("Machine list container not found");

                return new Promise((resolve, reject) => {
                    const observer = new MutationObserver(() => {
                        const items = Array.from(container.querySelectorAll('.dx-list-item-content'));
                        const match = items.find(el => el.textContent.includes(target));
                        if (match) {
                            observer.disconnect();
                            resolve(match);
                        }
                    });
                    observer.observe(container, { childList: true, subtree: true });
                    setTimeout(() => {
                        observer.disconnect();
                        reject("Search results did not update in time.");
                    }, 8000);
                });
            }

            async function selectMachineFromSearch(name) {
                const match = await waitForMachineToRender(name).catch(err => {
                    displayAnomaly(err);
                    return null;
                });
                if (match) {
                    log("Selecting from search results:", match.textContent.trim());
                    match.click();
                    return true;
                }
                return false;
            }

            async function handleConfirmationDialog() {
                const popup = await waitFor('.dx-popup-content', 5000).catch(() => null);
                if (!popup) return;
                const yesBtn = await waitFor('[aria-label="Yes"]', 5000).catch(() => null);
                if (yesBtn) {
                    log("Clicked 'Yes' button to confirm machine change");
                    yesBtn.click();
                }
            }

            async function verifyAndFillForm(machine) {
                const lookupField = await waitFor('dx-lookup[placeholder*="Equipment"] .dx-lookup-field');
                const selectedText = lookupField.textContent.trim();
                log(`Verifying selected machine: expected "${machine}", got "${selectedText}"`);

                if (selectedText.includes(machine)) {
                    fillForm();
                    showSubmitModal(machine);
                } else {
                    displayAnomaly("Machine mismatch after selection.");
                }
            }

            async function attemptMachineSelection(machine) {
                log(`Attempting selection for machine: ${machine}`);
                const arrow = await waitFor('div.mt-2 .dx-lookup-arrow');
                arrow.click();

                await waitFor('.dx-lookup-popup');
                const input = await waitFor('.dx-lookup-search input');
                input.value = machine;
                input.dispatchEvent(new Event('input', { bubbles: true }));

                const found = await selectMachineFromSearch(machine);
                if (!found) return;

                await handleConfirmationDialog();
                await verifyAndFillForm(machine);
            }

            function showSubmitModal(machine) {
                const modal = document.createElement('div');
                modal.classList.add("submitModal");
                modal.innerHTML = `
            <strong>Machine ${machine} prestart ready.</strong><br><br>
            <button id="submitPrestart">Submit Prestart</button>
        `;
        document.body.appendChild(modal);

        document.getElementById('submitPrestart').addEventListener('click', () => {
            const submitBtn = [...document.querySelectorAll('dx-button[aria-label="Submit"]')].pop();
            if (submitBtn) {
                log("Clicking submit button...");
                submitBtn.click();

                completedMachines.push(machine);
                localStorage.setItem("completedMachines", JSON.stringify(completedMachines));
                currentMachineIndex++;
                localStorage.setItem("currentMachineIndex", currentMachineIndex.toString());

                setTimeout(() => {
                    location.href = "https://employee.shadconnect.com.au/site-resources/equipment-prestart-checklist";
                }, 4000);
            } else {
                displayAnomaly("Could not locate submit button");
            }
        });
    }

                function showCompletionModal() {
                    const modal = document.createElement('div');
                    modal.classList.add("submitModal");
                    modal.innerHTML = `
            <strong>Prestarts Completed</strong>
            <ul>${completedMachines.map(name => `<li>${name}</li>`).join('')}</ul>
            <br><button id="closeReview">Confirm</button>
        `;
        document.body.appendChild(modal);
        document.getElementById('closeReview').addEventListener('click', () => modal.remove());
    }

                async function initMachinePrestart() {
                    log("Initializing script...");

                    const dynamicCsvUrl = localStorage.getItem("ptaCSVUrl");
                    if (!dynamicCsvUrl) return displayAnomaly("No PTA CSV URL found in localStorage");

                    const response = await fetch(dynamicCsvUrl);
                    const csv = await response.text();
                    const rows = csv.split('\n').map(r => r.split(','));
                    const machineCol = rows[0].map(h => h.trim().toLowerCase()).indexOf("machine name");
                    if (machineCol === -1) return displayAnomaly("CSV missing 'Machine Name' column");

                    machineNames = rows.slice(1).map(r => r[machineCol]?.trim()).filter(name => !!name && name.toLowerCase() !== "machine name");

                    log(`Loaded ${machineNames.length} machines from dynamic CSV.`);
                    log(`Machine list: ${JSON.stringify(machineNames)}`);
                    log(`Current machine index: ${currentMachineIndex}`);

                    if (!machineNames.length) return displayAnomaly("No valid machines in CSV");

                    if (!localStorage.getItem(sessionKey)) {
                        if (!confirm("You haven't submitted any prestarts today. Start now?")) return;
                        localStorage.setItem(sessionKey, "true");
                        currentMachineIndex = 0;
                        completedMachines = [];
                        localStorage.setItem("currentMachineIndex", "0");
                        localStorage.setItem("completedMachines", "[]");
                    }

                    if (currentMachineIndex >= machineNames.length) {
                        log("All machines processed. Ending script.");
                        showCompletionModal();
                        return;
                    }

                    const field = await waitFor('dx-lookup[placeholder*="Equipment"] .dx-lookup-field');
                    const selected = field.textContent.trim();
                    const expected = machineNames[currentMachineIndex];

                    log(`Initial machine check: expected "${expected}", got "${selected}"`);

                    if (selected.includes(expected)) {
                        log("Correct machine already selected on load. Filling form...");
                        fillForm();
                        showSubmitModal(expected);
                    } else {
                        log("Machine not selected. Initiating dropdown selection...");
                        await attemptMachineSelection(expected);
                    }
                }

                // Kick off the logic
                setTimeout(initMachinePrestart, 1000);
            }






        document.getElementById('startPrestart').addEventListener('click', () => {
            const prestartUrl = 'https://employee.shadconnect.com.au/supervisor-resources/site-meetings';
            if (window.location.href !== prestartUrl) {
                console.log('[Foreman Mode] Redirecting to Site Meetings page...');
                window.location.href = prestartUrl;
                return;
            }
            console.log('[Foreman Mode] Launching Prestart Flow...');
            initPrestartFlow();
        });

        document.getElementById('prefsBtn').addEventListener('click', () => {
            const existing = document.getElementById('foremanPrefsModal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'foremanPrefsModal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = 'white';
            modal.style.border = '2px solid grey';
            modal.style.borderRadius = '10px';
            modal.style.padding = '20px';
            modal.style.zIndex = 100000;
            modal.style.fontFamily = 'Arial';
            modal.style.fontSize = '10pt';
            modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
            modal.innerHTML = `
                <div style="margin-bottom: 8px; color: teal; font-weight: bold;">Foreman Preferences</div>
                <label for="siteAddress" style="display: block; margin-top: 12px; margin-bottom: 4px;">Site Address:</label>
                <input type="text" id="siteAddress" value="${localStorage.getItem('siteAddress') || ''}" style="width: 100%; padding: 4px; font-family: Arial; font-size: 10pt; border: 1px solid grey; border-radius: 4px;">
                <small style="color: gray;">Used to fetch and cache lat/lon coordinates</small>
                <label for="ptaCSVUrl" style="display: block; margin-bottom: 4px;">PTA CSV URL:</label>
                <input type="text" id="ptaCSVUrl" value="${localStorage.getItem('ptaCSVUrl') || ''}" style="width: 100%; padding: 4px; font-family: Arial; font-size: 10pt; border: 1px solid grey; border-radius: 4px;">
                <button id="savePrefs" style="margin-top: 10px; background-color: teal; color: white; width: 100%; font-family: Arial; font-size: 10pt; border: 1px solid grey; border-radius: 6px; padding: 4px; cursor: pointer;">Save</button>
                <button id="closePrefs" style="margin-top: 6px; background-color: grey; color: white; width: 100%; font-family: Arial; font-size: 10pt; border: 1px solid teal; border-radius: 6px; padding: 4px; cursor: pointer;">Cancel</button>
            `;



            document.body.appendChild(modal);

            document.getElementById('savePrefs').addEventListener('click', () => {
                const url = document.getElementById('ptaCSVUrl').value.trim();
                if (url) {
                    localStorage.setItem('ptaCSVUrl', url);
                    alert('Preferences saved!');
                    const address = document.getElementById('siteAddress').value.trim();
                    if (address) {
                        localStorage.setItem('siteAddress', address);
                        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
                            headers: { 'User-Agent': 'ForemanMode/1.0' }
                        })
                            .then(res => res.json())
                            .then(data => {
                            if (data && data.length > 0) {
                                const { lat, lon } = data[0];
                                localStorage.setItem('siteLat', lat);
                                localStorage.setItem('siteLon', lon);
                                alert('Preferences saved and coordinates updated!');
                            } else {
                                alert('Address saved, but coordinates not found.');
                            }
                        })
                            .catch(err => {
                            console.error('[ForemanMode] Geocode error:', err);
                            alert('Address saved, but failed to fetch coordinates.');
                        });
                    } else {
                        localStorage.removeItem('siteAddress');
                        localStorage.removeItem('siteLat');
                        localStorage.removeItem('siteLon');
                    }
                    modal.remove();
                } else {
                    alert('Please enter a valid CSV URL.');
                }
            });

            document.getElementById('closePrefs').addEventListener('click', () => {
                modal.remove();
            });


        });
    });

    function initSignIn() {

        // ✅ Logger overlay
        function safeLog(msg) {
            const el = document.createElement("div");
            el.textContent = "🟢 " + msg;
            el.style = "position:fixed;bottom:0;left:0;background:#000;color:#0f0;padding:6px 12px;font-size:14px;z-index:999999;font-family:monospace";
            document.body.appendChild(el);
            console.log(msg);
        }

        safeLog("🟢 Site Sign-In Script Started");
        // 🗺️ Spoof Swanbank location
        const cachedLat = localStorage.getItem('siteLat');
        const cachedLon = localStorage.getItem('siteLon');

        if (!cachedLat || !cachedLon) {
            alert("⚠️ No cached site coordinates found.\nPlease open Preferences and enter your Site Address to enable sign-in.");
            return;
        }

        const spoofedLocation = {
            latitude: parseFloat(cachedLat),
            longitude: parseFloat(cachedLon)
        };

        navigator.geolocation.getCurrentPosition = function(success) {
            success({
                coords: {
                    latitude: spoofedLocation.latitude,
                    longitude: spoofedLocation.longitude,
                    accuracy: 30
                }
            });
            safeLog(`📍 Location spoofed to: Latitude ${spoofedLocation.latitude}, Longitude ${spoofedLocation.longitude}`);
        };
        navigator.geolocation.watchPosition = navigator.geolocation.getCurrentPosition;

        // 📝 Function to spoof location and send the detect request
        function sendLocationRequest() {
            const url = `https://employee.shadconnect.com.au/api/digital/detect?latitude=${spoofedLocation.latitude}&longitude=${spoofedLocation.longitude}`;
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbXBsb3llZUtleUlkIjoiNTQ2NyIsIlVzZXJLZXlJZCI6IjE4NzYiLCJQUkNvIjoiNCIsIkZpcnN0TmFtZSI6IkRhbGUiLCJMYXN0TmFtZSI6IkxpdHN0ZXIiLCJuYmYiOjE3NDQwOTkyMTksImV4cCI6MTc0NTMwODgxOSwiaWF0IjoxNzQ0MDk5MjE5fQ.mJyi8ACw7segd1GautrmiH6tYga0ZKYEFprv9YTmthw";

            safeLog(`📡 Sending location request to: ${url}`);

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                }
            })
                .then(response => response.json())
                .then(data => {
                if (data) {
                    safeLog("📡 Location detected and site validated successfully.");
                    proceedWithSignIn();
                } else {
                    safeLog("❌ Location validation failed. Please check the coordinates or connection.");
                }
            })
                .catch(error => {
                safeLog("❌ Error during location request: " + error);
            });
        }

        // Proceed with the sign-in once location is validated
        function proceedWithSignIn() {
            // Simulate clicking "Detect Site and Sign in" button
            const detectBtn = [...document.querySelectorAll('span')].find(el => el.textContent.includes("Detect Site and Sign in"));

            safeLog("🟢 Checking for 'Detect Site and Sign in' button...");

            if (detectBtn && !detectBtn.classList.contains("tm-clicked")) {
                detectBtn.click();
                detectBtn.classList.add("tm-clicked");
                safeLog("📡 Clicked 'Detect Site and Sign in'");
            } else {
                safeLog("❌ 'Detect Site and Sign in' button not found or already clicked.");
            }

            // 📝 Wait for the "Enter Site" button to appear and click it
            const enterSiteBtn = [...document.querySelectorAll('span')].find(el => el.textContent.includes("Enter Site"));
            if (enterSiteBtn) {
                enterSiteBtn.click();
                safeLog("🚪 Clicked 'Enter Site'");
            } else {
                safeLog("❌ 'Enter Site' button not found.");
            }

            // Optionally, you can further automate the rest of the sign-in process...
        }

        // Trigger location detection and sign-in
        sendLocationRequest();

    }



})()