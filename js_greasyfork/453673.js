// ==UserScript==
// @name         Add timezone autocomplete text input to Google Calendar
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds a filter input to Google Calendar so you can filter the timezone list
// @author       Nathan Broadbent (@ndbroadbent)
// @match        https://calendar.google.com/calendar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453673/Add%20timezone%20autocomplete%20text%20input%20to%20Google%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/453673/Add%20timezone%20autocomplete%20text%20input%20to%20Google%20Calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let added = false;
    const addTimezoneAutocomplete = function() {
        const timeZoneLabel = Array.from(document.querySelectorAll('div')).find(el => el.innerText === 'Event time zone')
        if (!timeZoneLabel) {
            added = false
            return
        }
        if (added) return;
        added = true;

        const wrapper = timeZoneLabel.parentElement
        const startTimeZoneLabel = Array.from(wrapper.querySelectorAll('label')).find(el => el.innerText === "Event start time zone")
        if (!startTimeZoneLabel) {
            console.warn("can't find start time zone label")
            return
        }
        const filterInput = document.createElement("input");
        filterInput.type = "text";
        filterInput.placeholder = "Filter Timezones";
        filterInput.name = "filter_timezones";
        filterInput.style.marginTop = "10px"
        filterInput.style.marginBottom = "10px"
        console.log('Adding timezone filter input')
        const startTimeZoneContainer = startTimeZoneLabel.parentElement
        startTimeZoneContainer.parentElement.insertBefore(filterInput, startTimeZoneContainer)
        filterInput.onkeyup = function() {
            window.timezoneFilter = filterInput.value
        }

        const filterTimezones = function(container) {
            console.log("Filtering")
            if (!window.timezoneFilter) return
            setTimeout(function() {
                const timezones = container.querySelectorAll(':scope > div > div')[1]
                timezones.scroll({top:0})
                let foundSeparator = false;
                timezones.querySelectorAll(':scope > div').forEach(function(el) {
                    if (!window.timezoneFilter) return
                    if (!el.innerText) {
                        foundSeparator = true
                        return
                    }
                    if (!foundSeparator) return
                    const elText = el.innerText.toLowerCase()
                    if (elText.indexOf(window.timezoneFilter) === -1) {
                        el.style.display = 'none'
                    } else {
                        el.style.display = 'block'
                    }
                })
                timezones.scroll({top:0})
            }, 400)
        }

        startTimeZoneContainer.onclick = function() { filterTimezones(startTimeZoneContainer) }
        const endTimeZoneLabel = Array.from(wrapper.querySelectorAll('label')).find(el => el.innerText === "Event end time zone")
        if (!endTimeZoneLabel) {
            console.warn("can't find end time zone label")
            return
        }
        const endTimeZoneContainer = endTimeZoneLabel.parentElement
        endTimeZoneContainer.onclick = function() { filterTimezones(endTimeZoneContainer) }
    }

    setInterval(addTimezoneAutocomplete, 100)
})();