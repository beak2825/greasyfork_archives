// ==UserScript==
// @name         NCU sports center - volleyball booking
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Manual trigger for booking automation
// @author       Allen Jhang
// @match        https://17fit.com/service-flow-dt*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517399/NCU%20sports%20center%20-%20volleyball%20booking.user.js
// @updateURL https://update.greasyfork.org/scripts/517399/NCU%20sports%20center%20-%20volleyball%20booking.meta.js
// ==/UserScript==

'use strict';

let isRunningAppointmentScript;
let isDateTimeConfirmed;
let isAppointmentCompleted;
let isDateTimeConfirmInProgress;
let isAppointmentInProgress;
let intervalId;
let popup;

window.addEventListener('load', function() {
    isRunningAppointmentScript = false;
    isDateTimeConfirmed = false;
    isAppointmentCompleted = false;
    isDateTimeConfirmInProgress = false;
    isAppointmentInProgress = false;

    insertListItem(document.querySelector('.navbar-right'), '部落格', `<a href="#" class="appointment-script-popup"><i class="material-icons grey-scale">menu_book</i> <p class="regular">預約腳本</p></a>`);
    insertListItem(document.querySelector('.navbar-left'), '我的預約', '<a href="#" class="appointment-script-popup">預約腳本</a>');

    popup = document.createElement('div');
    popup.id = 'appointmentPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#f9f9f9';
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';
    popup.style.display = 'none';
    popup.innerHTML = `
        <style>
            #popupContainer {
                font-family: 'Arial', sans-serif;
                background-color: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 20px;
                width: 340px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            #popupContainer h3 {
                margin-top: 0;
                color: #333;
                font-size: 1.2em;
                font-weight: normal;
                text-align: center;
            }
            #popupContainer label {
                cursor: default;
                display: block;
                margin-bottom: 6px;
                font-size: 0.9em;
                color: #555;
            }
            #popupContainer select,
            #popupContainer input {
                width: 100%;
                padding: 8px;
                margin-bottom: 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 0.9em;
                background-color: #f9f9f9;
            }
            #popupContainer button {
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                font-size: 0.9em;
                cursor: pointer;
                width: 48%;
            }
            #appointmentButton.start-btn {
                background-color: #38B0E3;
                color: white;
            }
            #appointmentButton.stop-btn {
                background-color: #ff4d4d;
                color: white;
            }
            #appointmentButton.success-btn {
                background-color: #36E261;
                color: white;
            }
            #closePopupButton {
                background-color: #e0e0e0;
                color: #333;
            }
            #popupContainer button:hover {
                opacity: 0.9;
            }
            .button-container {
                display: flex;
                justify-content: space-between;
            }
        </style>
        <div id="popupContainer">
             <h3 id="appointment-script">預約腳本</h3>
             <label for="selectedDay">預約日期:</label>
             <input type="date" id="selectedDay" class="appointment-script-popup-input" value="${formatDate(new Date())}">

             <label for="selectedTime">預約時間:</label>
             <select id="selectedTime" class="appointment-script-popup-input">
                 ${Array.from({ length: 24 }, (_, i) => `<option value="${i.toString().padStart(2, '0')}:00">${i.toString().padStart(2, '0')}:00</option>`).join('')}
             </select>

             <label for="scriptStartTime">開始運作時間 (可選):</label>
             <input type="datetime-local" id="scriptStartTime" class="appointment-script-popup-input">

             <label for="scriptEndTime">結束運作時間 (可選):</label>
             <input type="datetime-local" id="scriptEndTime" class="appointment-script-popup-input">

             <div class="button-container">
                 <button id="closePopupButton">關閉</button>
                 <button id="appointmentButton" class='start-btn'>開始預約</button>
             </div>
         </div>
    `;

    document.body.appendChild(popup);

    document.querySelectorAll('.appointment-script-popup').forEach(function(element) {
        element.addEventListener('click', () => {
            popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
        });
    });

    document.getElementById('closePopupButton').addEventListener('click', () => {
        popup.style.display = 'none';
    });

    document.getElementById('appointmentButton').addEventListener('click', () => {
        if (isAppointmentCompleted) {
            window.open('https://17fit.com/my-class', '_blank');
        } else if (isRunningAppointmentScript) {
            stopAppointmentScript();
        } else {
            const selectedDay = document.getElementById('selectedDay').value.replace(/-/g, '/').trim();
            const selectedTime = document.getElementById('selectedTime').value.trim();
            startAppointmentScript(selectedDay, selectedTime);
        }
    });
});

function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function insertListItem(container, searchText, itemHTML) {
    const liElements = container.querySelectorAll('li');

    liElements.forEach(function(li) {
        if (li.textContent.includes(searchText)) {
            const newMenuItem = document.createElement('li');
            newMenuItem.innerHTML = itemHTML;

            li.insertAdjacentElement('afterend', newMenuItem);
        }
    });
}

function startAppointmentScript(selectedDay, selectedTime) {
    if (notValidInput(selectedDay, selectedTime)) {
        console.log(`[Not valid input] selectedDay: ${selectedDay}, selectedTime: ${selectedTime}`);
        return;
    }
    console.log(`selectedDay: ${selectedDay}, selectedTime: ${selectedTime}`);

    isRunningAppointmentScript = true;
    updateAppointmentStatus();

    intervalId = setInterval(() => {
        if (isWattingForAppointmentScript()) {
            console.log('watting for start appointment script')
            return;
        } else if (isNeedStopAppointmentScript()) {
            stopAppointmentScript();
        } else {
            runAppointment(selectedDay, selectedTime);
        }
    }, 1000);
}

function stopAppointmentScript() {
    clearInterval(intervalId);
    isRunningAppointmentScript = false;
    isDateTimeConfirmed = false;
    updateAppointmentStatus();
    console.log('stop appointment script')
}

function updateAppointmentStatus() {
    const appointmentButton = document.getElementById('appointmentButton');
    const appointmentScript = document.getElementById('appointment-script');
    const appointmentScriptPopupInputs = document.getElementsByClassName('appointment-script-popup-input');
    if (!appointmentButton || !appointmentScript || !appointmentScriptPopupInputs) {
        return;
    }

    for (const element of appointmentScriptPopupInputs) {
        element.disabled = isAppointmentCompleted || isRunningAppointmentScript ? true : false;
    }
    if (isAppointmentCompleted) {
        appointmentScript.textContent = '預約成功';
        appointmentButton.textContent = '我的預約';
        appointmentButton.classList.remove('start-btn');
        appointmentButton.classList.remove('stop-btn');
        appointmentButton.classList.add('success-btn');
    } else if (isRunningAppointmentScript) {
        appointmentScript.textContent = '腳本預約中';
        appointmentButton.textContent = '停止預約';
        appointmentButton.classList.remove('start-btn');
        appointmentButton.classList.remove('success-btn');
        appointmentButton.classList.add('stop-btn');
    } else {
        appointmentScript.textContent = '預約腳本';
        appointmentButton.textContent = '開始預約';
        appointmentButton.classList.remove('stop-btn');
        appointmentButton.classList.remove('success-btn');
        appointmentButton.classList.add('start-btn');
    }
}

function notValidInput(selectedDay, selectedTime) {
    const dateRegex = /^(19|20)\d\d\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(selectedDay)) {
        return true;
    }

    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(selectedTime)) {
        return true;
    }

    return false;
}

function isWattingForAppointmentScript() {
    const currentTime = new Date();
    const scriptStartTime = document.getElementById('scriptStartTime').value;
    if (scriptStartTime) {
        const scriptStartDate = new Date(scriptStartTime);
        return currentTime < scriptStartDate;
    }
    return false;
}

function isNeedStopAppointmentScript() {
    const currentTime = new Date();
    const scriptEndTime = document.getElementById('scriptEndTime').value;
    if (scriptEndTime) {
        const scriptEndDate = new Date(scriptEndTime);
        return currentTime > scriptEndDate;
    }
    return false;
}


function runAppointment(selectedDay, selectedTime) {
    if (!isDateTimeConfirmed) {
        confirmDateTime(selectedDay, selectedTime)
    }
    if (isDateTimeConfirmed) {
        appointment();
    }
}

function confirmDateTime(selectedDay, selectedTime) {
    if (isDateTimeConfirmInProgress) {
        return;
    }
    isDateTimeConfirmInProgress = true;

    const dataConfirm = new URLSearchParams();
    dataConfirm.append('is_cash', '0');
    dataConfirm.append('selected_time', selectedTime);
    dataConfirm.append('selected_day', selectedDay);

    const confirmUrl = 'https://17fit.com/service-flow-confirm';
    fetch(confirmUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: dataConfirm.toString(),
    })
    .then(response => response.text())
    .then(responseText => {
        const isTimePresent = responseText.includes(selectedTime);
        const isDatePresent = responseText.includes(selectedDay);

        if (isTimePresent && isDatePresent) {
            isDateTimeConfirmed = true;
            console.log(`Successful selected dateTime: ${selectedDay} ${selectedTime}`);
        } else {
            isDateTimeConfirmed = false;
            console.log(`Failed selected dateTime: ${selectedDay} ${selectedTime}`);
        }
    })
    .catch(error => {
        console.error('Error in confirm request:', error);
    })
    .finally(() => {
        isDateTimeConfirmInProgress = false;
    });
}

function appointment() {
    if (isAppointmentInProgress) {
        return;
    }
    isAppointmentInProgress = true;

    const dataAppointment = {
        client_booking_note: '',
        pay_method: 'cash',
        contract_selected: '{"32946":0}',
        studio_payment_method_id: '1',
        branch_uri: '01',
        studio_uri: 'NCUsportscenter'
    };

    const appointmentUrl = 'https://17fit.com/service-flow-make-appointment';
    fetch(appointmentUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataAppointment),
    })
    .then(response => response.text())
    .then(responseText => {
        const dateRegex = /"date":"([^"]+)"/;
        const timeSpanRegex = /"time_span":"([^"]+)"/;

        const dateMatch = responseText.match(dateRegex);
        const timeSpanMatch = responseText.match(timeSpanRegex);

        if (dateMatch && timeSpanMatch) {
            console.log('Success appointment')
            isAppointmentCompleted = true;
            stopAppointmentScript();
            const appointmentedDay = dateMatch[1];
            const appointmentedDayTimeSpan = timeSpanMatch[1];
        } else {
            isAppointmentCompleted = false;
            console.log('Failed appointment');
        }})
    .catch(error => {
        console.error('Error in appointment request:', error);
    })
    .finally(() => {
        isAppointmentInProgress = false;
    });
}

