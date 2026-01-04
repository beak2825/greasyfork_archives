// ==UserScript==
// @name         Koombea OpenAir: functions
// @name:es      Koombea OpenAir: functions
// @description  Add custom functionality to OpenAir website
// @description:es Agrega funcionalidad personalizada al sitio web de OpenAir
// @namespace    koombea_air
// @version      0.5.0
// @author       rhonaldomaster
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @copyright    GNU/GPL v3
// @grant        GM_addStyle
// @homepage     https://github.com/rhonaldomaster/openair-k-colors
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openair.com
// @license      GPL-3.0-or-later
// @match        *://koombea-inc.app.netsuitesuiteprojectspro.com*
// @downloadURL https://update.greasyfork.org/scripts/482700/Koombea%20OpenAir%3A%20functions.user.js
// @updateURL https://update.greasyfork.org/scripts/482700/Koombea%20OpenAir%3A%20functions.meta.js
// ==/UserScript==

/**
 * Converts booking % to h/d
 */
function convertBookingPercentToHD() {
  const bookings = document.querySelectorAll('.GMGanttFixedIn, .GMGanttLeftIn, .GMGanttRightIn, .GMGanttBaseIn');
  bookings.forEach((booking) => {
    // Validates that the booking wasn't already converted and that it contains the % value
    const bookingHTML = booking.innerHTML;
    if (
      bookingHTML.split('h/d')[0] == bookingHTML &&
      bookingHTML != '' &&
      bookingHTML.match(/([0-9]*\.?[0-9]+)\s%/) != null
    ) {
      const hours_per_day = Math.round(((bookingHTML.match(/([0-9]*\.?[0-9]+)\s%/)[1] * 8) / 100 + Number.EPSILON) * 100) / 100;
      if (bookingHTML.match(/([0-9]*\.?[0-9]+)\s%/)[0] == booking.textContent) {
        // For allocation percentage bubbles at the top
        booking.innerHTML = hours_per_day + 'h/d';
      } else {
        // For bookings
        booking.innerHTML = hours_per_day + 'h/d ' + bookingHTML;
      }
    }
  });
}

/**
 * Displays alert if the opened timesheet is in the future
 */
function checkForFutureTimesheets() {
  const timesheetStart = new Date(document.querySelector('.header-text-record-title').innerHTML.split(' to ')[0]); //Gets timesheet's dates based on title
  const today = new Date();
  if(timesheetStart - today > 0) {
    document.querySelector('.header-text-record-title').innerHTML += '<span class="timesheet-alert"><b class="svg"></b> This timesheet is for a future period!</span>';
  }
}

/**
 * UI add-on for bookings form to calculate hours per day
 */
function calculateHoursPerDay() {
  const iframe = document.querySelector('iframe[name="Edit booking"]');
  const isNewBooking = window.location.href.indexOf("/booking.pl") > -1 && window.location.href.indexOf("action=new") > -1;
  var doc;

  if(iframe != null) {
    doc = iframe.contentDocument;
  } else if(isNewBooking) {
    doc = document;
  }

  if(doc != undefined) {
    const bookByTable = doc.querySelector('#row_section_4 .formLabeledPair > tbody');
    const warningContainer = doc.querySelector('.book-by__warning-text');

    if(warningContainer == null) {
      bookByTable.innerHTML += '<tr><td colspan="4">Hours per day calculator:</td><td class="book-by__hours-per-day"><input type="text" class="book-by__hours-per-day" value="0" size="12" maxlength="12"></td></tr><tr class="book-by__warning-text"><td colspan="5"><strong>Make sure to select "Percentage of time"</strong></td></tr>';
    }

    const perDayInput = doc.querySelector('input.book-by__hours-per-day');
    const percentageInput = doc.querySelector('#row_section_4 input[name="percentage"]');
    if(perDayInput.value != percentageInput.value * 8 / 100 && doc.activeElement != perDayInput && doc.activeElement != percentageInput) perDayInput.value = percentageInput.value * 8 / 100;

    percentageInput.addEventListener('input', () => {
      perDayInput.value = percentageInput.value * 8 / 100;
    });

    perDayInput.addEventListener('input', () => {
      percentageInput.value = perDayInput.value * 100 / 8;
    });
  }
}

/**
 * Checks the current page location
 */
function pageLocation(page) {
  const location = window.location.href;
  switch (page) {
    case "timesheet":
      return (location.indexOf("/timesheet.pl") > -1 && location.indexOf("timesheet_id=") > -1);
      break;
    case "planner":
      return (location.indexOf("/booking.pl") > -1 && location.indexOf("_booking_layout=planner") > -1);
      break;
    case "booking-edit":
      return (location.indexOf("/booking.pl") > -1 && (location.indexOf("_booking_layout=planner") > -1 || location.indexOf("action=new") > -1));
      break;
  }
}

window.addEventListener('load', () => {
  if(pageLocation("timesheet")) checkForFutureTimesheets();
  if(pageLocation("planner")) setInterval(convertBookingPercentToHD, 1000);
  if(pageLocation("booking-edit")) setInterval(calculateHoursPerDay, 1000);
});
