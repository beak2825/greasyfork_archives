// ==UserScript==
// @name         Adjust dates on iLearn
// @version      2024-02-11
// @description  Auto increment dates in iLearn
// @author       Richard Garner
// @match        https://ilearn.mq.edu.au/*
// @license      MIT
// @namespace https://greasyfork.org/users/1243343
// @downloadURL https://update.greasyfork.org/scripts/487138/Adjust%20dates%20on%20iLearn.user.js
// @updateURL https://update.greasyfork.org/scripts/487138/Adjust%20dates%20on%20iLearn.meta.js
// ==/UserScript==

'use strict';
const dayOffset = -2;
// change this to match the year in question!

function changeDate(yearSelect,monthSelect,daySelect)
{
    // read existing date from form
    let year = parseInt(yearSelect.value)+1;
    let month = parseInt(monthSelect.value);
    let day = parseInt(daySelect.value);

    // compute new date
    let newDate = new Date(year, month-1, day);
    newDate.setDate(newDate.getDate() + dayOffset);
    let newYear = newDate.getYear()+1900;
    let newMonth = newDate.getMonth()+1;
    let newDay = newDate.getDate();

    // adjust date on form
    yearSelect.value = newYear.toString();
    monthSelect.value = newMonth.toString();
    daySelect.value = newDay.toString();

    // ensure change is noticed by page
    yearSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
    monthSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
    daySelect.dispatchEvent(new window.Event('change', { bubbles: true }));
}

function findAndChangeDate(text)
{
    // find nodes with the appropriate names
    let yearSelect = document.querySelector('select[name="'+text+'[year]"]');
    let monthSelect = document.querySelector('select[name="'+text+'[month]"]');
    let daySelect = document.querySelector('select[name="'+text+'[day]"]');
    if (yearSelect && monthSelect && daySelect) {
        changeDate(yearSelect,monthSelect,daySelect);
    }
}

(function() {
    document.body.addEventListener("keydown", function (event) {
        if (event.key === "+" && event.ctrlKey) {

            // find all date fields on form
            let dateNodeSet = new Set();
            document.querySelectorAll('select[name]').forEach(node => {
                if (node.name.includes('[year]')) {
                    dateNodeSet.add(node.name.split('[')[0]);
                }
            });

            // iterate over date fields and change them
            dateNodeSet.forEach(name => {
                findAndChangeDate(name);
            });
        }});
    })();