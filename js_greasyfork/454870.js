// ==UserScript==
// @name         Work hours
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  This adds a button so that the work hours can be easily added
// @author       Feonx
// @match        https://portal.youforce.com/icweb/raetonlinedienstverlening/RaetOnlinePortaal/index.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youforce.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454870/Work%20hours.user.js
// @updateURL https://update.greasyfork.org/scripts/454870/Work%20hours.meta.js
// ==/UserScript==

function getDayName(date)
{
    return date.toLocaleDateString('en', { weekday: 'long' });
}
function isWeekday(dateToCheck) {
    var dayName = getDayName(dateToCheck);
    return dayName !== 'Sunday' && dayName !== 'Saturday'
}

function getAllDaysInMonth(year, month) {
  const date = new Date(year, month, 1);

  const dates = [];

  while (date.getMonth() === month) {
      if (isWeekday(date))
          dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function convertToLocalDate(date) {
    return date.toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

function getWeekNumber(date) {

    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function createButton() {
    var button = document.createElement("img");
    button.setAttribute("src", "https://svgsilh.com/svg/1426334.svg");
    button.setAttribute("height", "35");
    button.setAttribute("width", "35");
    button.setAttribute("style", "background-color: white;margin-right: 1rem;");

    var portalRight = document.getElementsByClassName("PortalRight")[0];
    portalRight.appendChild(button);
    return button;
}

function getDetailsIframe() {

    var frameContainer = document.querySelector("[id='framecontainer']");
    if (!frameContainer)
        return undefined;

    var iFrames = frameContainer.getElementsByTagName("iframe");
    if (!iFrames || iFrames.length <= 0)
        return undefined;

    var iframe = iFrames[0].contentWindow.document

    var basis = iframe.querySelector("[id='Basis']");
    if (!basis)
        return undefined;

    basis = basis.contentWindow.document;

    var details = basis.querySelector("[name='Details']");
    if(!details)
        return undefined;

    details = details.contentWindow.document;

    return details;
}

function getDaySkipFilters() {

    var officeDaysInput = window.prompt("My office days are? (monday, tuesday, wednesday):", "monday, tuesday, wednesday");
    var officeDays = officeDaysInput.toLowerCase().replaceAll(' ', '').split(',');

    var validDayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for(var i = 0; i < officeDays.length; i++) {
       if (validDayNames.indexOf(officeDays[i]) == -1) {
           alert('Day name "' + officeDays[i] + '" is not a valid day. Did you spell the day right?');
           return;
       }
    }

    if (officeDays[0].indexOf(',') >= 0)
        officeDays = officeDaysInput.split(',');

    var skipOnEvenOrUneven = false;
    var onlySkipOnEven = false;

    var skipDaysInput = window.prompt("Skip the day(s) e.g. (thursdag, friday)", "");
    var skipDays = skipDaysInput.split(', ');
    if (skipDays[0].indexOf(',') >= 0) {
        skipDays = skipDaysInput.split(',');
    }

    if (skipDays[0].length > 0) {

        for(i = 0; i < skipDays.length; i++) {
            if (validDayNames.indexOf(skipDays[i]) == -1) {
                alert('Skip day name "' + skipDays[i] + '" is not a valid day. Did you spell the day right?');
                return;
            }
        }
        var skipEvenOrUnevenInput = window.prompt("Only skip days on even (1) or uneven (0) weeks (empty for none)?:", "");
        onlySkipOnEven = skipEvenOrUnevenInput == "1";
        skipOnEvenOrUneven = skipEvenOrUnevenInput == "1" || skipEvenOrUnevenInput == "0";
    }

    return {
        skipOnEvenOrUneven,
        skipDays,
        onlySkipOnEven,
        officeDays
    }
}

function getDaysToFill(skipOnEvenOrUneven, skipDays, onlySkipOnEven) {

    var today = new Date();
    today.setMonth(today.getMonth()-1);
    var datesInMonth = getAllDaysInMonth(today.getFullYear(), today.getMonth());

    var datesToFill = [];
    if (skipDays.length > 0) {

        for(var i = 0; i < datesInMonth.length; i++) {
            var dateWeekNr = getWeekNumber(datesInMonth[i]);
            var isEvenNr = dateWeekNr%2 == 0;

            var isSkipDay = skipDays.indexOf(getDayName(datesInMonth[i]).toLowerCase()) > -1;

            if (!isSkipDay) {
              datesToFill.push(datesInMonth[i]);
              continue;
            }

            if (!skipOnEvenOrUneven)
                continue;

            if (onlySkipOnEven && isEvenNr)
                continue;

            datesToFill.push(datesInMonth[i]);
        }
    }

    return datesToFill;
}

function fillInRow(row, rowIndex, dateToEnter, officeDays) {

    var dayName = getDayName(dateToEnter).toLowerCase();
    var dateField = row.getElementsByTagName('input')[0];
    dateField.value = convertToLocalDate(dateToEnter);

    var isOfficeDay = officeDays.indexOf(dayName) !== -1;

    var rubriekId = "[id='v_FS0034_20_" + rowIndex + "']";
    var rubriek = row.querySelector(rubriekId);
    rubriek.value = isOfficeDay ? '10522076DV' : '10518147DV';

    var dayKind = isOfficeDay ? 'reisdagen' : 'thuiswerkdagen';

    var promptId = "[id='v_FS0035_30_" + rowIndex + "']";
    var prompt = row.querySelector(promptId);
    prompt.value = dayKind;

    var eenheidId = "[id='v_FS0041_90_" + rowIndex + "']";
    var eenheid = row.querySelector(eenheidId);
    eenheid.value = 'T';

    var hidId = "[id='hid_v_FS0035_30_" + rowIndex + "']";
    var hid = row.querySelector(hidId);
    hid.value = dayKind;

    var amountId = "[id='v_FS0039_70_" + rowIndex + "']";
    var amount = row.querySelector(amountId);
    amount.removeAttribute('readonly');
    amount.value = '1.00';
    amount.dispatchEvent(new Event('change'));
}

function isValidForm(details) {
    if (!details) {
        alert("Cannot fill in work hours because the wrong page is open! Please open the 'Declaratie home/office travel' form first.");
        return false;
    }

    var detailsTitle = details.querySelector("[id='ctl00_lblFormuliernaam']");
    var isCorrectDetailsScreen = detailsTitle && detailsTitle.innerText == 'Declaratie Home/Office';

    if (!isCorrectDetailsScreen) {
        alert("This form is not supported! Please open the supported 'Declaratie home/office travel' form.");
        return false;
    }

    return true;
}

(function() {
    'use strict';

    var button = createButton();

    button.addEventListener('click', function (event) {

        var details = getDetailsIframe();

        if (!isValidForm(details))
            return;

        var dayFilters = getDaySkipFilters();

        var today = new Date();
        var datesInMonth = getDaysToFill(dayFilters.skipOnEvenOrUneven, dayFilters.skipDays, dayFilters.onlySkipOnEven);

        for(var i = 1; i < datesInMonth.length+1; i++)
        {
            var id = "[id='row" + i + "']";
            var row = details.querySelector(id);

            if (row) {
                fillInRow(row, i, datesInMonth[i-1], dayFilters.officeDays);
            }
        }

    });


})();