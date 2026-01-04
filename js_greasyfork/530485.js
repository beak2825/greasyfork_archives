// ==UserScript==
// @name         PermTurn: Check my PERM estimated processing time
// @namespace    http://tampermonkey.net/
// @version      2025-03-20
// @description  Script to check pending applications and estimate processing time on permtimeline
// @author       Klaxien
// @match        https://permtimeline.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=permtimeline.com
// @grant        none
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/530485/PermTurn%3A%20Check%20my%20PERM%20estimated%20processing%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/530485/PermTurn%3A%20Check%20my%20PERM%20estimated%20processing%20time.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // --- Utility Functions ---
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const addDays = days => { const result = new Date(); result.setDate(result.getDate() + days); return result; };
    const createElement = (tag, props = {}, styles = {}) => {
        const element = document.createElement(tag);
        Object.assign(element, props);
        Object.assign(element.style, styles);
        return element;
    };

    // --- Configuration ---
    let priorityDate = "February 2025";
    let isCalculationDone = false;
    const calculationResults = {};
    const inputWidth = '200px';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const storageDictname = 'PermTurnScriptPreference';
    const mainButtonClass = ['perm-turn-main-button'];

    // --- Load Preferences ---
    const getPreferences = () => JSON.parse(localStorage.getItem(storageDictname) || '{}') || {};


    // --- Main Button ---
    const mainButton = createElement('button', { textContent: "Waiting page loading" }, {
        position: 'absolute', top: '100px', left: '10px', zIndex: '100',
        backgroundColor: 'rgb(28, 100, 242)', borderRadius: '9999px',
        padding: '0.5rem 1rem', color: 'white', fontSize: '14px', border: 'none', cursor: 'pointer'
    });
    mainButton.classList.add(mainButtonClass);
    if (!document.querySelector(`.${mainButtonClass.join('.')}`)){
        document.body.appendChild(mainButton);
    }


    function findShowAllSubmissionButtons() {
        return Array.from(document.querySelectorAll('button.bg-blue-500.text-white')).filter(btn => btn?.textContent?.includes('Show All Submission'))
    }

    // --- Modal Function ---
    function createModal(content, showCloseButton = true, isCalculationDoneModal = false, onClose = ()=>{}) {
        const modalBackdrop = createElement('div', {}, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '9999' });
        const modal = createElement('div', {}, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white',
            width: isCalculationDoneModal ? '80%' : 'auto', // Only set width for Calculation Done modal
            maxWidth: isCalculationDoneModal ? '600px' : 'auto', // Only set maxWidth for Calculation Done modal
            height: isCalculationDoneModal ? '80%' : 'auto',  // Only set height for Calculation Done modal
            maxHeight: isCalculationDoneModal ? '600px' : 'auto', // Only set maxHeight for Calculation Done modal
            border: '1px solid black', zIndex: '10000', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column'
        });

        // Scrollable Content Area
        const contentArea = createElement('div', {}, { overflowY: 'auto', padding: '20px', textAlign: 'left', flexGrow: '1' });

        if (typeof content === 'string') {
            contentArea.innerHTML = content;  // Set HTML content if it's a string
        } else if (content instanceof HTMLElement) {
            contentArea.appendChild(content); //append an element
        }

        // Footer with Fixed Button
        const modalFooter = createElement('div', {}, { padding: '10px 20px', borderTop: '1px solid #ccc', textAlign: 'center', display: 'flex', justifyContent: 'center' });
        modalFooter.style.flexShrink = '0'; // footer does not shrink

        if (showCloseButton) {
            const closeButton = createElement('button', { textContent: 'Close' }, { backgroundColor: 'rgb(28, 100, 242)', borderRadius: '9999px', padding: '0.5rem 1rem', color: 'white', fontSize: '14px', border: 'none', cursor: 'pointer' });
            closeButton.onclick = () => {
                modalBackdrop.remove();
                onClose && onClose();
            };

            const editButton = createElement('button', { textContent: 'Edit Preferences' }, { backgroundColor: 'rgb(28, 100, 242)', borderRadius: '9999px', padding: '0.5rem 1rem', color: 'white', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'block', marginRight: '1em' });
            editButton.onclick = () => {
                modalBackdrop.remove();
                onClose && onClose();
                showPreferenceModal();
            };
            modalFooter.appendChild(editButton);
            modalFooter.appendChild(closeButton);
        }

        modal.appendChild(contentArea);
        modal.appendChild(modalFooter);
        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);

        return { modalBackdrop, modalFooter };
    }

    // --- Preference Modal ---
    function showPreferenceModal() {
        const preferences = getPreferences();


        const modalContent = document.createElement('div');

        const storedAvg = preferences.estimatedDailyAverage || '450' || '';
        const storedMonth = preferences.priorityMonth || '';
        const storedYear = preferences.priorityYear || '';

        const inputAvg = createElement('input', { type: 'number', value: storedAvg }, { marginBottom: '10px', width: inputWidth });
        const selectMonth = createElement('select', {}, { marginBottom: '10px', width: inputWidth });
        const selectYear = createElement('select', {}, { marginBottom: '10px', width: inputWidth });
        const avgDigitError = createElement('p', { textContent: 'Estimated Daily Average must be a number.' }, { color: 'red', display: 'none', marginBottom: '10px' });
        const futureDateError = createElement('p', { textContent: 'Cannot select a future month/year.' }, { color: 'red', display: 'none', marginBottom: '10px' });
        const errorMessage = createElement('p', { textContent: 'Must select month/year' }, { color: 'red', display: 'none', marginBottom: '10px' });

        selectMonth.appendChild(createElement('option', { value: '', textContent: '-- Select Month --', selected: !storedMonth }));
        selectYear.appendChild(createElement('option', { value: '', textContent: '-- Select Year --', selected: !storedYear }));

        months.forEach(month => selectMonth.appendChild(createElement('option', { value: month, textContent: month, selected: month === storedMonth })));
        const currentYear = new Date().getFullYear();
        for (let year = 2023; year <= currentYear; year++) {
            selectYear.appendChild(createElement('option', { value: year, textContent: year, selected: year.toString() === storedYear }));
        }

        const saveButton = createElement('button', { textContent: 'Save' }, { backgroundColor: 'rgb(28, 100, 242)', borderRadius: '9999px', padding: '0.5rem 1rem', marginRight: '0.5em', color: 'white', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'block' });
        saveButton.onclick = () => {
            const selectedMonth = selectMonth.value;
            const selectedYear = selectYear.value;
            const avgValue = inputAvg.value;

            if (!/^\d+$/.test(avgValue)) {
                avgDigitError.style.display = 'block';
                futureDateError.style.display = 'none';
                errorMessage.style.display = 'none';
                return;
            }

            if (!selectedMonth || !selectedYear) {
                errorMessage.style.display = 'block';
                futureDateError.style.display = 'none';
                avgDigitError.style.display = 'none';
                return;
            }

            const selectedDate = new Date(parseInt(selectedYear), months.indexOf(selectedMonth), 1);
            const currentDate = new Date();
            if (selectedDate > currentDate) {
                futureDateError.style.display = 'block';
                errorMessage.style.display = 'none';
                avgDigitError.style.display = 'none';
                return;
            }

            const estimatedDailyAverage = parseInt(avgValue);
            const priorityMonth = selectedMonth;
            const priorityYear = selectedYear;
            localStorage.setItem(storageDictname, JSON.stringify({ estimatedDailyAverage, priorityMonth, priorityYear }));

            priorityDate = `${priorityMonth} ${priorityYear}`;
            modalBackdrop.remove();
            performCalculation();
        };

        modalContent.appendChild(createElement('label', { textContent: 'Estimated Business day Average(no Sat/Sun)' }, { display: 'block' })); //EDIT Text
        modalContent.appendChild(inputAvg);
        modalContent.appendChild(createElement('label', { textContent: 'PERM submission Month' }, { display: 'block' }));
        modalContent.appendChild(selectMonth);
        modalContent.appendChild(createElement('label', { textContent: 'PERM submission Year' }, { display: 'block' }));
        modalContent.appendChild(selectYear);
        modalContent.appendChild(errorMessage);
        modalContent.appendChild(futureDateError);
        modalContent.appendChild(avgDigitError);

        const { modalBackdrop, modalFooter } = createModal(modalContent, false);  // Don't show close button
        modalFooter.appendChild(saveButton);
    }

    // --- Calculation Function ---
    async function performCalculation() {
        const preferences = getPreferences();
        let estimatedDailyAverage = preferences.estimatedDailyAverage || 450;
        let priorityMonth = preferences.priorityMonth || '';
        let priorityYear = preferences.priorityYear || '';
        priorityDate = `${priorityMonth} ${priorityYear}`;

        findShowAllSubmissionButtons().map(button => button?.click());
        await sleep(200);

        const allDivs = Array.from(document.querySelectorAll('div.bg-blue-500.text-white'));
        let cutoffIndex = allDivs.findIndex(div => div.textContent.includes(priorityDate));

        // Handle the edge case where priorityDate isn't found
        if (cutoffIndex === -1) {
            cutoffIndex = 0;
        }

        const targetDivsWithPriorityDateMonth = cutoffIndex !== -1 ? allDivs.slice(cutoffIndex) : [];
        const targetDivsWithoutPriorityDateMonth = cutoffIndex !== -1 ? allDivs.slice(cutoffIndex + 1) : [];

        targetDivsWithPriorityDateMonth.forEach(div => { if (div.textContent.includes('►')) { console.log(div.textContent); div.click(); } });
        await sleep(200);

        const calculatePendingApplications = divs => divs.map(el => {
            const pdMatch = el.textContent.match(/\w+\s+20\d{2}/);
            const pendingMatch = el.nextSibling?.textContent.match(/Pending Applications: (\d{1,3}(,\d{3})*)/);
            if (pdMatch && pendingMatch) {
                return { pdDate: pdMatch[0], pendingApplications: parseInt(pendingMatch[1].replace(/,/g, ''), 10) };
            }
            return null;
        }).filter(item => item !== null);

        const pendingApplicationsArray = calculatePendingApplications(Array.from(targetDivsWithoutPriorityDateMonth));
        const pendingApplicationsWithPriorityArray = calculatePendingApplications(Array.from(targetDivsWithPriorityDateMonth));

        const totalPendingApplications = pendingApplicationsArray.reduce((sum, item) => sum + item.pendingApplications, 0);
        const totalPendingApplicationsWithPriority = pendingApplicationsWithPriorityArray.reduce((sum, item) => sum + item.pendingApplications, 0);

        const estimatedDaysLeftMin = Math.round(totalPendingApplications / (estimatedDailyAverage * 5 / 7));
        const estimatedDaysLeftMax = Math.round(totalPendingApplicationsWithPriority / (estimatedDailyAverage * 5 / 7));
        const estimatedCompletionDateMin = addDays(estimatedDaysLeftMin).toLocaleDateString("en-US");
        const estimatedCompletionDateMax = addDays(estimatedDaysLeftMax).toLocaleDateString("en-US");

        console.log("Pending Applications Data:", pendingApplicationsArray);
        console.log("Pending Applications With Priority Data:", pendingApplicationsWithPriorityArray);

        mainButton.textContent = `Est: ${estimatedCompletionDateMin}-${estimatedCompletionDateMax}`;

        Object.assign(calculationResults, {
            totalPendingApplications,
            totalPendingApplicationsWithPriority,
            pendingApplicationsWithPriorityArray,
            estimatedDaysLeftMin,
            estimatedDaysLeftMax,
            estimatedCompletionDateMin,
            estimatedCompletionDateMax
        });

        if (isCalculationDone) {

            // Capitalize First Letter of each Sentence
            const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
            const capPriorityDate = capitalize(priorityDate);

            const tableRows = calculationResults.pendingApplicationsWithPriorityArray.map(item => `
            <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">${item.pdDate}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: left;">${item.pendingApplications}</td>
            </tr>
        `).join('');

            // ADD DATE PREDICTION HERE
            const estimatedDaysLeftMin = Math.round(calculationResults.totalPendingApplications / (estimatedDailyAverage * 5 / 7));
            const estimatedDaysLeftMax = Math.round(calculationResults.totalPendingApplicationsWithPriority / (estimatedDailyAverage * 5 / 7));
            const estimatedCompletionDateMin = addDays(estimatedDaysLeftMin).toLocaleDateString("en-US");
            const estimatedCompletionDateMax = addDays(estimatedDaysLeftMax).toLocaleDateString("en-US");

            const modalContent = `
            <i>This script provides an estimate only. It may not be accurate and does not constitute legal advice.</i><br/>
            <p><b>Priority date:</b> ${capPriorityDate}</p>
            <p>Your case <b>might</b> be processed at eariest: ${capitalize(estimatedCompletionDateMin)}</p>
            <p>Your case <b>might</b> be processed at latest: ${capitalize(estimatedCompletionDateMax)}</p>
            <p>Assuming DOL can process <b>${estimatedDailyAverage}</b> cases per business day</p>
            <p>Total pending(<b>excluding</b> PD Month): ${calculationResults.totalPendingApplications}</p>
            <p>Total pending(<b>including</b> PD Month): ${calculationResults.totalPendingApplicationsWithPriority}</p>
            <p>Monthly pending application:</p>
            <table style="width:100%; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid black; padding: 8px; text-align: left;">Month</th>
                    <th style="border: 1px solid black; padding: 8px; text-align: left;">Pending Applications</th>
                </tr>
                ${tableRows}
            </table>

        `;

            createModal(modalContent, true, true); //EDIT HERE
            return;
        }
        isCalculationDone = true;

    }
    // --- Event Listeners and Initialization ---
    mainButton.onclick = performCalculation;

    let initializationDone = false; // Flag to prevent multiple initializations
    let intervalId;

    function initialize() {
        if (initializationDone) return; // Prevent running initialize() multiple times
        initializationDone = true;

        const preference = getPreferences();
        if (!preference.priorityMonth || !preference.priorityYear) {
            showPreferenceModal();
        } else {
            performCalculation();
        }

        // If intervalId is set, clear it.
        if (intervalId) {
            clearInterval(intervalId);
        }
    }

    intervalId = setInterval(()=>{
        if (document.readyState !== 'complete') return;
        initialize();
    }, 100);




})();