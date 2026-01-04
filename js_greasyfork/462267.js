// ==UserScript==
// @name                Weather only view
// @namespace           Violentmonkey Scripts
// @homepageURL         https://github.com/alexlogvin/browser-userscripts/blob/main/weather-only-view.js
// @supportURL          https://github.com/alexlogvin/browser-userscripts/issues
// @contributionURL     https://paypal.me/AlexLogvin
// @contributionAmount  $1.00
// @author              alexlogvin
// @copyright           alexlogvin
// @license             MIT
// @match               https://weather.com/*
// @grant               none
// @version             1.4
// @description         Modifies weather.com website to make it look more focused on needed data and can be used on presentational monitors
// @icon                https://www.google.com/s2/favicons?sz=64&domain=weather.com
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/462267/Weather%20only%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/462267/Weather%20only%20view.meta.js
// ==/UserScript==



//page url (with search for city, language and temperature unit preference)
const url = 'https://weather.com/uk-UA/weather/today/l/a737b8766e57e8b96a7df67ff1cdfd2b6f63d2322c2b8025e603838dc22f9c94';

//page refresh in milliseconds
const reloadTimeout = 60 * 60 * 1000;

//calendar language
const locale = navigator.language || navigator.userLanguage;
//you can set any language by ISO-639-1, for example "en" - for english
//locale = 'uk';



Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


window.setTimeout( function() {
  window.location.replace(url);
}, reloadTimeout);

document.querySelector('[name=viewport]').remove();
document.head.innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`;
document.head.innerHTML += `<meta name="HandheldFriendly" content="true" />`;

document.getElementById('regionHeader').remove();
document.getElementsByTagName("footer").remove();
document.getElementById('Wxu-MapCard-Module').parentElement.remove();
document.getElementById('dpr-manager').remove();
document.querySelector('[id^=Taboola]').remove();
document.querySelector('head').innerHTML += `
<style>
    [id^=WxuAd] {
        display: none !important;
    }
</style>
`

document.getElementById('appWrapper').style.backgroundColor = 'none';
document.getElementById('appWrapper').style.backgroundImage = 'none';
document.getElementById('appWrapper').style.background = 'black';
document.getElementsByTagName('html')[0].style.background = 'black';
document.getElementsByClassName('region-main')[0].parentElement.style.display = 'block';
document.getElementsByClassName('region-main')[0].style.margin = '0 12px';
document.getElementsByClassName('region-sidebar')[0].style.margin = '0 12px';
document.querySelectorAll('[class^=AirQuality--detailsButton]').remove();
document.querySelectorAll('[href]').forEach((e) => e.removeAttribute("href"));

document.querySelector('[id^=WxuCurrentConditions]').style.gridColumn = 'span 8';



const calendarDOM =
`
<div style="grid-column: span 4;">
  <style>
    #calendar-body td {
      text-align: center;
      vertical-align: middle;
      width: 20px;
    }

    .calendarToday {
      font-weight: bold;
      background: var(--buttonText);
      color: white;
      border-radius: 6px;
    }

    * {
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */
      cursor: default;
    }
  </style>
  <div class="Card--card--2AzRg" style='margin: 0;'>
    <header class="Card--cardHeader--3NRFf">
      <h2 class="Card--cardHeading--2H1-_" id="monthAndYear"></h2>
    </header>
    <table id="calendar" style='width: 100%;'>
      <thead>
        <tr id='calendar-header'>
        </tr>
      </thead>

      <tbody id="calendar-body">

      </tbody>
    </table>
  </div>
</div>
`;

document.querySelector('[id^=WxuCurrentConditions]').insertAdjacentHTML('afterend', calendarDOM);

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = currentYear;
selectMonth = currentMonth;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay() - 1;

    tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = new Date().toLocaleString(locale ,{ month: 'long' }).capitalizeFirstLetter() + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            else {
                cell = document.createElement("td");
                cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("calendarToday");
                } // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

    for (let i = 1; i < 8; i++) {
      document.getElementById('calendar-header').innerHTML +=
        `<th>${new Date(2023, 4, i).toLocaleString('uk', {weekday: 'short'}).capitalizeFirstLetter()}</th>`;
    }
}


// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}
