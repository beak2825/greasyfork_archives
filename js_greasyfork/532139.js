// ==UserScript==
// @name         ShadConnect Paul PTA Autofill (Google Sheets Live + Field Check)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Autofill PTA form using live Google Sheets CSV (with textarea fix)
// @match        https://employee.shadconnect.com.au/employee-resources/pta-form
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532139/ShadConnect%20Paul%20PTA%20Autofill%20%28Google%20Sheets%20Live%20%2B%20Field%20Check%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532139/ShadConnect%20Paul%20PTA%20Autofill%20%28Google%20Sheets%20Live%20%2B%20Field%20Check%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuIK4GpZOpZbNefnZ3WRmj4F056fMY3ueBdaS-tbatzXGnk-TK3heTZcoYVO-r26CzR8mrk_yeksNn/pub?output=csv";
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
            const label = field.querySelector('.field-label')?.textContent?.toLowerCase();
            return label && label.includes(labelMatchText.toLowerCase());
        });
        if (!match) return callback?.();

        const dxLookup = match.querySelector('dx-lookup');
        const toggle = dxLookup?.querySelector('.dx-lookup-field');
        if (!toggle) return callback?.();

        toggle.click();

        let attempts = 0;
        const interval = setInterval(() => {
            const overlays = document.querySelectorAll('.dx-overlay-wrapper');
            const lastOverlay = overlays[overlays.length - 1];
            const items = [...lastOverlay?.querySelectorAll('.dx-list-item') || []];
            const matchItem = items.find(opt => normalize(opt.textContent) === normalize(optionText));

            if (matchItem) {
                matchItem.click();
                document.body.click();
                clearInterval(interval);
                callback?.();
            } else if (++attempts > 10) {
                console.warn(`[PTA Autofill] Option '${optionText}' not found for '${labelMatchText}'`);
                clearInterval(interval);
                callback?.();
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

                    // 🛠️ Re-populate if blank after a second
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
    button.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 16px;
        background: #007bff;
        color: white;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
    `;

    button.onclick = async () => {
        button.disabled = true;
        button.textContent = "Loading templates...";
        const templates = await fetchTemplatesFromCSV(CSV_URL);
        button.disabled = false;
        button.textContent = "Autofill PTA";
        openTemplateModal(templates);
    };

    document.body.appendChild(button);
})();
