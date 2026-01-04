// ==UserScript==
// @name         icondo booker
// @namespace    http://tampermonkey.net/
// @version      2025-07-31
// @description  Books icondo facilities
// @author       limli
// @match        https://resident.icondo.asia/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icondo.asia
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544357/icondo%20booker.user.js
// @updateURL https://update.greasyfork.org/scripts/544357/icondo%20booker.meta.js
// ==/UserScript==

function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    toast.style.zIndex = 9999;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

(function() {
    'use strict';

    function selectBadminton() {
        const select = document.querySelector('select#facilityId');
        if (!select) {
            console.warn('Facility select not found');
            return false;
        }
        const option = Array.from(select.options)
            .find(o => o.text.trim().toLowerCase() === 'badminton');
        if (!option) {
            console.warn('Badminton option not found');
            return false;
        }
        select.value = option.value;
        select.dispatchEvent(new Event('change', {
            bubbles: true
        }));
        console.log('Selected badminton');
        return true;
    }

    function selectDateOneWeekFromToday() {
        const label = Array.from(document.querySelectorAll('label.lbl-input'))
            .find(l => l.textContent.trim().toLowerCase() === 'choose a day');
        if (!label) {
            console.warn('Label "choose a day" not found');
            return false;
        }
        const labelContainer = label.parentElement;
        if (!labelContainer) {
            console.warn('Label container not found');
            return false;
        }
        const inputContainer = labelContainer.nextElementSibling;
        if (!inputContainer) {
            console.warn('Input container not found next to label container');
            return false;
        }
        const input = inputContainer.querySelector('input[datetimepicker]');
        if (!input) {
            console.warn('Date input not found');
            return false;
        }

        const today = new Date();
        const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const formatDate = oneWeekLater.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        }).replace(/ /g, '-'); // e.g. "07-Aug-25"

        input.value = formatDate;
        input.dispatchEvent(new Event('input', {
            bubbles: true
        }));
        console.log(`Date set to ${formatDate}`);
        return true;
    }

    function clickViewButton() {
        const btn = Array.from(document.querySelectorAll('button.btn-view[type="submit"]'))
            .find(b => b.textContent.trim().toLowerCase() === 'view');
        if (!btn) {
            console.warn('View button not found');
            return false;
        }
        btn.click();
        console.log('Clicked View button');
        return true;
    }

    function selectFacilityRadioAndChooseTime() {
        const radio = document.querySelector('table.table tbody tr td input[type="radio"]');
        if (!radio) {
            console.warn('Facility radio button not found');
            return false;
        }
        radio.click();
        console.log('Selected facility radio');

        const row = radio.closest('tr');
        const chooseBtn = row.querySelector('button[type="submit"]:not([disabled])');
        if (!chooseBtn) {
            console.warn('Choose time button not found or disabled');
            return false;
        }
        chooseBtn.click();
        console.log('Clicked Choose time button');
        return true;
    }

    // Modified function to accept timeslot text dynamically
    function selectTimeSlot(timeText) {
        const form = document.querySelector('form#payment-form');
        if (!form) {
            console.warn('Payment form not found');
            return false;
        }

        const rows = Array.from(form.querySelectorAll('div.row'));
        const targetRow = rows.find(row => {
            const labels = Array.from(row.querySelectorAll('label'));
            return labels.some(label => label.textContent.trim().startsWith(timeText));
        });
        if (!targetRow) {
            console.warn(`Timeslot "${timeText}" not found`);
            return false;
        }

        const checkbox = targetRow.querySelector('input[type="checkbox"]');
        if (!checkbox) {
            console.warn(`Checkbox for timeslot "${timeText}" not found`);
            return false;
        }
        checkbox.click();
        console.log(`Selected timeslot "${timeText}"`);
        return true;
    }

    function clickSubmit() {
        const btn = Array.from(document.querySelectorAll('button.btn.btn-next'))
            .find(b => b.textContent.trim().toLowerCase() === 'submit');
        if (!btn) {
            console.warn('Submit button not found');
            return false;
        }
        btn.click();
        console.log('Clicked Submit button');
        return true;
    }

    function clickNext() {
        const btn = Array.from(document.querySelectorAll('button.btn.btn-next[type="submit"]'))
            .find(b => b.textContent.trim().toLowerCase() === 'next');
        if (!btn) {
            console.warn('Next button not found');
            return false;
        }
        btn.click();
        console.log('Clicked Next button');
        return true;
    }

    function clickBookNow() {
        const btn = Array.from(document.querySelectorAll('button.btn.btn-next[type="submit"]'))
            .find(b => b.textContent.trim().toLowerCase() === 'book now');
        if (!btn) {
            console.warn('Book Now button not found');
            return false;
        }
        btn.click();
        console.log('Clicked Book Now button');
        return true;
    }

    async function runBooking() {
        if (!selectBadminton()) return;
        await new Promise(r => setTimeout(r, 500));
        if (!selectDateOneWeekFromToday()) return;
        await new Promise(r => setTimeout(r, 500));
        if (!clickViewButton()) return;
        await new Promise(r => setTimeout(r, 1000));
        if (!selectFacilityRadioAndChooseTime()) return;
        await new Promise(r => setTimeout(r, 1000));
        // Use the value from input
        const timeText = document.getElementById('timeslot-input')?.value.trim() || '7:00 PM';
        if (!selectTimeSlot(timeText)) return;
        await new Promise(r => setTimeout(r, 500));
        if (!clickSubmit()) return;
        await new Promise(r => setTimeout(r, 1000));
        if (!clickNext()) return;
        await new Promise(r => setTimeout(r, 1000));
        if (!clickBookNow()) return;
        console.log('Booking script completed');
    }

    // Add button and input to the page
    function addControls() {
        // Container styling
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = 10000;
        container.style.backgroundColor = 'white';
        container.style.padding = '12px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        container.style.width = '260px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.color = '#333';

        // Preferred time label + input
        const preferredTimeWrapper = document.createElement('div');
        preferredTimeWrapper.style.marginBottom = '8px';
        preferredTimeWrapper.style.display = 'flex';
        preferredTimeWrapper.style.alignItems = 'center';
        preferredTimeWrapper.style.gap = '6px';

        const preferredLabel = document.createElement('label');
        preferredLabel.textContent = 'Preferred time:';
        preferredLabel.htmlFor = 'timeslot-input';
        preferredLabel.style.flex = '0 0 90px';

        const preferredInput = document.createElement('input');
        preferredInput.type = 'text';
        preferredInput.id = 'timeslot-input';
        preferredInput.value = '7:00 PM';
        preferredInput.style.flex = '1';
        preferredInput.style.padding = '4px 6px';
        preferredInput.style.border = '1px solid #ccc';
        preferredInput.style.borderRadius = '3px';
        preferredInput.style.width = '100%';

        preferredTimeWrapper.appendChild(preferredLabel);
        preferredTimeWrapper.appendChild(preferredInput);

        // Run at label + input (with seconds)
        const runAtWrapper = document.createElement('div');
        runAtWrapper.style.marginBottom = '12px';
        runAtWrapper.style.display = 'flex';
        runAtWrapper.style.alignItems = 'center';
        runAtWrapper.style.gap = '6px';

        const runAtLabel = document.createElement('label');
        runAtLabel.textContent = 'Run at:';
        runAtLabel.htmlFor = 'runat-input';
        runAtLabel.style.flex = '0 0 90px';

        const runAtInput = document.createElement('input');
        runAtInput.type = 'text';
        runAtInput.id = 'runat-input';
        runAtInput.value = '08:00:00'; // default 8 AM with seconds
        runAtInput.placeholder = 'HH:mm:ss';
        runAtInput.style.flex = '1';
        runAtInput.style.padding = '4px 6px';
        runAtInput.style.border = '1px solid #ccc';
        runAtInput.style.borderRadius = '3px';
        runAtInput.style.width = '100%';

        runAtWrapper.appendChild(runAtLabel);
        runAtWrapper.appendChild(runAtInput);

        // Button
        const btn = document.createElement('button');
        btn.textContent = 'Run Booking Script';
        btn.style.width = '100%';
        btn.style.padding = '8px 0';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '3px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';

        btn.addEventListener('click', () => {
            const requiredURL = 'https://resident.icondo.asia/#/booking_facility/choose_time';
            if (location.href !== requiredURL) {
                showToast(`⚠️ Please navigate to:\n${requiredURL}`, 5000);
                return;
            }
            btn.disabled = true;

            // Parse run-at input (HH:mm:ss)
            const runAtValue = runAtInput.value.trim();
            if (!runAtValue.match(/^\d{2}:\d{2}:\d{2}$/)) {
                alert('Please enter a valid run time in HH:mm:ss format');
                btn.disabled = false;
                return;
            }

            const [hours, minutes, seconds] = runAtValue.split(':').map(Number);
            const now = new Date();
            let runTime = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hours,
                minutes,
                seconds,
                0
            );

            let delay = runTime - now;

            // If run time already passed today, run immediately
            if (delay <= 0) {
                btn.textContent = 'Running...';
                runBooking().then(() => {
                    btn.textContent = 'Run Booking Script';
                    btn.disabled = false;
                });
                return;
            }

            // Spinner + countdown UI
            btn.innerHTML = `
    <span class="spinner" style="display:inline-block; width:16px; height:16px; border:2px solid #fff; border-top:2px solid transparent; border-radius:50%; animation: spin 1s linear infinite; vertical-align:middle; margin-right:8px;"></span>
    Starting in <span id="countdown">${Math.round(delay / 1000)}</span>s
  `;

            const countdownEl = btn.querySelector('#countdown');
            const intervalId = setInterval(() => {
                const nowInner = new Date();
                const diff = Math.round((runTime - nowInner) / 1000);
                if (diff <= 0) {
                    clearInterval(intervalId);
                    btn.textContent = 'Running...';
                    runBooking().then(() => {
                        btn.textContent = 'Run Booking Script';
                        btn.disabled = false;
                    });
                } else {
                    countdownEl.textContent = diff;
                }
            }, 1000);
        });


        // Append all to container
        container.appendChild(preferredTimeWrapper);
        container.appendChild(runAtWrapper);
        container.appendChild(btn);

        document.body.appendChild(container);

        // Add spinner keyframe style
        const style = document.createElement('style');
        style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
  `;
        document.head.appendChild(style);
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addControls);
    } else {
        addControls();
    }

})();