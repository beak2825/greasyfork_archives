// ==UserScript==
// @name         Kudy z nudy - Přidat do Google Kalendáře
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Přidání tlačítka pro vytvoření události v Google Kalendáři na Kudyznudy.cz
// @author       StepanK
// @match        https://www.kudyznudy.cz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529288/Kudy%20z%20nudy%20-%20P%C5%99idat%20do%20Google%20Kalend%C3%A1%C5%99e.user.js
// @updateURL https://update.greasyfork.org/scripts/529288/Kudy%20z%20nudy%20-%20P%C5%99idat%20do%20Google%20Kalend%C3%A1%C5%99e.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mapa pro převod názvů měsíců na čísla
    const monthMapping = {
        "leden": "01", "únor": "02", "březen": "03", "duben": "04", "květen": "05", "červen": "06",
        "červenec": "07", "srpen": "08", "září": "09", "říjen": "10", "listopad": "11", "prosinec": "12"
    };

    // Najdi všechny prvky obsahující data
    const dateElements = document.querySelectorAll('ul.date-info li.future-date a');
    if (!dateElements.length) {
        console.error("No date elements found!");
        return;
    }

    // Najdi popis události z požadovaného elementu
    const descriptionElement = document.querySelector('div.content-text.annotation');
    let description = descriptionElement ? descriptionElement.textContent.trim() : 'Popis není k dispozici';
    description += `\n\nVíce informací: ${window.location.href}`;

    console.log("Description:", description);

    // Získání názvu události
    const title = document.title.split('–')[0].trim();

    // Najdi adresu - přesunuto před vytváření URL
    const locationElement = document.querySelector('#ctl00_placeHolderMain_placeHolderMainZones_lt_zoneMain_SumInfo_repeaterAddresses_ctl00_panelItem address');
    const location = locationElement ? locationElement.textContent.trim().replace(/\s+/g, ' ') : '';

    const dateRangeElement = dateElements[0].textContent.trim();
    console.log("Date Range Element:", dateRangeElement);

    const fullRangeRegex = /(\d{1,2})\.\s+([a-záéíóúýěščřžů]+)\s+(\d{4})(?:\s+(\d{1,2})(?::(\d{2}))?)?(?:\s*–\s*|\s*-\s*)(\d{1,2})\.\s+([a-záéíóúýěščřžů]+)\s+(\d{4})(?:\s+(\d{1,2})(?::(\d{2}))?)?/i;
    const singleDayWithTimeRangeRegex = /(\d{1,2})\.\s+([a-záéíóúýěščřžů]+)\s+(\d{4})(?:\s+(\d{1,2})(?::(\d{2}))?(?:\s*-\s*(\d{1,2})(?::(\d{2}))?)?)?/i;
    const singleDaySimpleRegex = /(\d{1,2})\.\s+([a-záéíóúýěščřžů]+)\s+(\d{4})/i;

    const cleanedDateRangeElement = dateRangeElement.replace(/\u00a0/g, ' ');
    console.log("Cleaned Date Range Element:", cleanedDateRangeElement);

    const fullRangeMatch = cleanedDateRangeElement.match(fullRangeRegex);
    const singleDayWithTimeRangeMatch = !fullRangeMatch && cleanedDateRangeElement.match(singleDayWithTimeRangeRegex);
    const singleDaySimpleMatch = !fullRangeMatch && !singleDayWithTimeRangeMatch && cleanedDateRangeElement.match(singleDaySimpleRegex);

    let startDate, endDate;

    if (fullRangeMatch) {
        const [_, startDay, startMonth, startYear, startHour, startMinute, endDay, endMonth, endYear, endHour, endMinute] = fullRangeMatch;
        const startMonthNum = monthMapping[startMonth.toLowerCase()];
        const endMonthNum = monthMapping[endMonth.toLowerCase()];

        const startHourDefault = startHour || '00';
        const startMinuteDefault = startMinute || '00';
        const endHourDefault = endHour || '23';
        const endMinuteDefault = endMinute || '59';

        startDate = `${startYear}${startMonthNum}${startDay.padStart(2, '0')}T${startHourDefault.padStart(2, '0')}${startMinuteDefault}00`;
        endDate = `${endYear}${endMonthNum}${endDay.padStart(2, '0')}T${endHourDefault.padStart(2, '0')}${endMinuteDefault}00`;
    } else if (singleDayWithTimeRangeMatch) {
        const [_, day, month, year, startHour, startMinute, endHour, endMinute] = singleDayWithTimeRangeMatch;
        const monthNum = monthMapping[month.toLowerCase()];

        const formattedStartHour = startHour ? startHour.padStart(2, '0') : '00';
        const formattedStartMinute = startMinute || '00';

        const formattedEndHour = endHour ? endHour.padStart(2, '0') : (startHour ? startHour.padStart(2, '0') : '23');
        const formattedEndMinute = endMinute || (startHour && !endHour ? startMinute || '00' : '59');

        startDate = `${year}${monthNum}${day.padStart(2, '0')}T${formattedStartHour}${formattedStartMinute}00`;
        endDate = `${year}${monthNum}${day.padStart(2, '0')}T${formattedEndHour}${formattedEndMinute}00`;
    } else if (singleDaySimpleMatch) {
        const [_, day, month, year] = singleDaySimpleMatch;
        const monthNum = monthMapping[month.toLowerCase()];

        startDate = `${year}${monthNum}${day.padStart(2, '0')}T000000`;
        endDate = `${year}${monthNum}${day.padStart(2, '0')}T235900`;
    } else {
        console.error("No matching date format found for:", cleanedDateRangeElement);
        return;
    }

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Vytvoř odkaz na Google Kalendář
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&text=${encodeURIComponent(title)}`;

    console.log("Generated URL:", calendarUrl);

    // Vytvoř tlačítko
    const button = document.createElement('a');
    button.textContent = 'Přidat do Google Kalendáře';
    button.href = calendarUrl;
    button.target = '_blank';
    button.style.cssText = 'display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 3px;';

    // Přidání kliknutí pro debug informace
    button.addEventListener('click', function(e) {
        console.log("Clicked calendar button with URL:", this.href);
    });

    // Najdi kontejner, kam tlačítko vložit
    const container = document.querySelector('#ctl00_placeHolderMain_placeHolderMainZones_lt_zoneDetailLeft_SmallInfoRow_container');
    if (container) {
        container.appendChild(button);
    } else {
        console.error("Container for button not found!");
    }
})();