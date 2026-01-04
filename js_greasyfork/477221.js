// ==UserScript==
// @name         Rachio Reorder Calendar
// @namespace    duanemay/rachio-reorder-calendar
// @version      0.1.2
// @description  Reorders the Calendar widget on the Rachio website to be in chronological order instead of random order.
// @author       Duane May
// @license      Apache License 2
// @match        http*://app.rach.io/locations/*/devices/*
// @match        http*://app.rach.io/devices/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rach.io
// @source       https://github.com/duanemay/tampermonkey-scripts
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/477221/Rachio%20Reorder%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/477221/Rachio%20Reorder%20Calendar.meta.js
// ==/UserScript==

function getDaysArray() {
    let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dates = [];
    dates.push("Today");
    const date = new Date();

    for (let i = 1; i < 7; i++) {
        date.setDate(date.getDate() + 1);
        let dayOfWeek = date.getDay();
        dates.push(daysOfWeek[dayOfWeek]);
    }

    for (let i = 1; i < 9; i++) {
        date.setDate(date.getDate() + 1);
        let formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
            date.getDate().toString().padStart(2, '0');
        dates.push(formattedDate);
    }
    return dates;
}

function rachioReorderCalendar(container) {
    console.log("Reordering Rachio Calendar");
    const dates = getDaysArray();
    const newOrder = new Array(dates.length);
    const childDivs = container.childNodes;

    for (let i = 0; i < childDivs.length; i++) {
        const childDiv = childDivs[i];
        let divs = childDiv.getElementsByTagName('div');
        if (divs.length === 0) {
            continue;
        }
        let sections = divs[0].getElementsByTagName('section');
        if (sections.length === 0) {
            continue;
        }
        divs = sections[0].getElementsByTagName('div');
        if (divs.length === 0) {
            continue;
        }
        const dateDiv = divs[0];
        const matchValue = dateDiv.innerHTML;
        const index = dates.indexOf(matchValue);
        newOrder[index] = childDiv;
    }

    for (let i = newOrder.length; i >= 0; i--) {
        if (newOrder[i] == null) {
            continue;
        }
        container.insertBefore(newOrder[i], container.firstChild);
    }
}

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    const sections = document.getElementsByClassName("test-location-schedule-container");
    if (sections.length === 0) {
        return;
    }
    const childrenOfSection = sections[0].childNodes;
    if (childrenOfSection.length === 0) {
        return;
    }
    const div = childrenOfSection[1].childNodes;
    if (div.length === 0) {
        return;
    }
    const container = div[0];

    // We found the item we were looking for, Stop observing
    observer.disconnect();

    // and do the things we want to do
    rachioReorderCalendar(container);
};

(function () {
    'use strict';
    const observer = new MutationObserver(callback);

    // Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};
    observer.observe(document, config);
})();