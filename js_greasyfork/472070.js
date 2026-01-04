// ==UserScript==
// @name         blsitalyvisa_helper1
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  none
// @author       Something begins
// @license      none
// @match        https://www.blsitalyvisa.com/kazakhstan/appointments/bls-italy-appointment*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472070/blsitalyvisa_helper1.user.js
// @updateURL https://update.greasyfork.org/scripts/472070/blsitalyvisa_helper1.meta.js
// ==/UserScript==

const intervalCD = 100; // Searching for an element cooldown
const scanLimit = 12; // Amount of months that will be scanned
const firstName = "John";
const secondName = "Doe";
const passportNo = "123456";
const withButton = false;
// PATHS
let chosenMonth, dateInput, dateDiv, calendarDaysTable, nextButton, monthTitle, firstNameInput, secondNameInput, passportNoInput, triggerButtonParent;
const paths = {
    dateDiv: { element: dateDiv, path: "body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom" },
    dateInput: { element: dateInput, path: "#valAppointmentDate" },
    calendarDaysTable: { element: calendarDaysTable, path: "body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom > div.datepicker-days > table" },
    nextButton: { element: nextButton, path: "body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom > div.datepicker-days > table > thead > tr:nth-child(2) > th.next" },
    monthTitle: { element: monthTitle, path: "body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom > div.datepicker-days > table > thead > tr:nth-child(2) > th.datepicker-switch" },
    firstNameInput: { element: firstNameInput, path: "#divAppointmentType > div:nth-child(6) > input", value: firstName },
    secondNameInput: { element: secondNameInput, path: "#divAppointmentType > div:nth-child(7) > input", value: secondName },
    passportNoInput: { element: passportNoInput, path: "#divAppointmentType > div:nth-child(8) > input", value: passportNo },
    triggerButtonParent: { element: triggerButtonParent, path: "body > div.header-sticky > div" },
};

// ---

const focusEvent = new FocusEvent('focus', {
    bubbles: true,
    cancelable: true,
    view: window,
});
// UTILS
function waitForElementLoad(elementKeyArr, fun, args = null) {
    const elementLoadedIterval = setInterval(() => {
        let elArr = [];
        for (const elementKey of elementKeyArr) {
            paths[elementKey].element = document.querySelector(paths[elementKey].path);
            elArr.push(paths[elementKey].element);
        }
        if (!elArr.includes(null)) {
            clearInterval(elementLoadedIterval);
            fun(args);
        }

    }, intervalCD)
}
// ---
function FillCredentials() {
    ["firstNameInput", "secondNameInput", "passportNoInput"].forEach(elementKey => {
        paths[elementKey].element.value = paths[elementKey].value;
    })
};

function scanForAvailableDates(i = 0) {
    if (i > scanLimit) return false;
    paths["calendarDaysTable"].element = document.querySelector(paths["calendarDaysTable"].path)
    let availableDates = Array.from(paths["calendarDaysTable"].element.querySelectorAll(".day")).filter(day => { return day.title === "Available" });
    if (availableDates.length === 0) {
        document.querySelector(paths["nextButton"].path).click();
        const nextMonthLoadedInterval = setInterval(() => {
            const monthTitle = document.querySelector(paths["monthTitle"].path).textContent;
            if (chosenMonth !== monthTitle) {
                clearInterval(nextMonthLoadedInterval);
                chosenMonth = monthTitle;
                return scanForAvailableDates(i + 1);
            }
        }, intervalCD)
    } else {
        console.log(availableDates[0]);
        availableDates[0].click();
        waitForElementLoad(["firstNameInput", "secondNameInput", "passportNoInput"], FillCredentials);
        return true;
    }
};
waitForElementLoad(["dateInput"], () => {
    if (withButton) {
        document.querySelector(paths["triggerButtonParent"].path).insertAdjacentHTML("beforeend", `<button id  = "Script1_triggerAutoFill"> Auto-fill </button>`);
        document.querySelector("#Script1_triggerAutoFill").addEventListener("click", event => {
            event.preventDefault();
            paths["dateInput"].element.dispatchEvent(focusEvent);
            waitForElementLoad(["calendarDaysTable"], scanForAvailableDates);
        });
    } else {
        paths["dateInput"].element.dispatchEvent(focusEvent);
        waitForElementLoad(["calendarDaysTable"], scanForAvailableDates);
    }
});