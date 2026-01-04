// ==UserScript==
// @name         Get vaccinated fool v3
// @namespace    http://tedmor.in/
// @version      3.1
// @description  just get a bloody vaccine
// @author       Ted Morin
// @match        https://vaccine.covaxonbooking.ca/*
// @icon         https://www.google.com/s2/favicons?domain=covaxonbooking.ca
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/426622/Get%20vaccinated%20fool%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/426622/Get%20vaccinated%20fool%20v3.meta.js
// ==/UserScript==

const DAYS_TO_SEARCH_AHEAD = 7
const MIN_DAYS_TO_SEARCH_AHEAD = 0
const MAX_DISTANCE_KM = 25

/**
 * Regex for locations that you don't want keywords for.
 *
 * E.g. if you're not a member of an indigenous household.
 *
 * Pipe-separated list like (item one|item two|item three)
 */
const blocklistedLocationQuery = /(indigenous)/
/**
 * Regex that location text **has** to match.
 *
 * E.g. specify a location or date that the locations will match.
 */
const allowlistedLocationQuery = /(.*)/

;(function() {
    'use strict';

    let paused = true

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const targetDate = new Date(new Date().setDate(new Date().getDate() + DAYS_TO_SEARCH_AHEAD))
    const minDate = new Date(new Date().setDate(new Date().getDate() + MIN_DAYS_TO_SEARCH_AHEAD))

    const minYear = minDate.getFullYear()

    const maxMonthIndex = targetDate.getMonth()
    const maxDay = targetDate.getDate()
    const maxMonthIsNextYear = targetDate.getFullYear() > minYear

    const minMonthIndex = minDate.getMonth()
    const minDay = minDate.getDate()

    const loadingIndicator = '[data-testid="loading-indicator"]'
    const currentDate = '[data-testid="dose-appointment-edit"] > div > div:nth-child(2) > p'

    const locationPageHeader = '[data-testid="location-select-page-header"]';
    const searchPageContinue = '[data-testid="location-search-page-continue"]';
    const backButtonInHeader = '[data-testid="back-button-header"]';
    const appointmentPageHeader =
          '[date-testid="next-appointment-select-page-header"]';


    function getCurrentWidgetDate() {
        const dateLabel = document.querySelector(currentDate)
        if (!dateLabel) return {}

        const [month, dayString, yearString] = dateLabel.innerText.split(' ').slice(2, 5)
        const monthIndex = months.indexOf(month)
        const year = parseInt(yearString, 10)
        const day = parseInt(dayString, 10)
        return { month, monthIndex, day, year }
    }

    async function isCurrentDateGood(goBackIfNecessary = false) {
        const { day, monthIndex, month, year } = getCurrentWidgetDate()

        if (!month) return false

        const isNextYear = year > minYear

        const effectiveMonthIndex = monthIndex + (isNextYear ? 12 : 0)
        const effectiveMaxMonthIndex = maxMonthIndex + (maxMonthIsNextYear ? 12 : 0)

        if (goBackIfNecessary && effectiveMonthIndex > effectiveMaxMonthIndex) {
            await clickPage('prev')
            return isCurrentDateGood(true)
        }


        const hasTimeslot = document.querySelector('[data-testid="appointment-select-timeslot"]') !== null
        const meetsMinimum = minMonthIndex < effectiveMonthIndex || minMonthIndex === monthIndex && minDay <= day
        const meetsMaximum = effectiveMonthIndex < effectiveMaxMonthIndex || monthIndex === maxMonthIndex && day <= maxDay
        return hasTimeslot && meetsMinimum && meetsMaximum
    }

    function waitForElement(selector, timeout = 0) {
        if (document.querySelector(selector) === null && timeout > 0) {
            return sleep(50).then(() => waitForElement(selector, timeout - 50));
        } else {
            return Promise.resolve(true);
        }
    }

    function waitForElementToNotExist(selector) {
        if (document.querySelector(selector) === null) {
            return Promise.resolve(true);
        } else {
            return sleep(50).then(() => waitForElementToNotExist(selector));
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    $("body").keydown(function(e) {
        if (e.key === 'g') {
            paused = false
            startScript()
        } else if (e.key === 's') {
            paused = true
        }
    });

    async function waitForLoad(timeout = 2000) {
        await waitForElement(loadingIndicator, timeout) // Sometimes the loading indicator doesn't show up, hence timeout.
        await waitForElementToNotExist(loadingIndicator)
        // Handle a flicker load.
        await waitForElement(loadingIndicator, 50)
        await waitForElementToNotExist(loadingIndicator)
        await sleep(100) // Reduce false positives.
    }

    async function clickPage(direction) {
        document.querySelector(`[data-testid="calendar-${direction}-button"]`)?.click()
        await waitForLoad()

        // Click first day available in order to update appointment widget.
        const clickableDay = document.querySelector('.calendar__day:not(.day--blocked)')
        if (clickableDay) {
            clickableDay.click()
            await waitForLoad(250)
        }
        // Now, click first day available that's within our criteria.
        const { monthIndex, day } = getCurrentWidgetDate()
        if (monthIndex === undefined) return
        // If the first day that we clicked was lower than the minimum day, we use more complex logic to click the next valid date.
        if (monthIndex === minMonthIndex && day < minDay) {
            // We are at the lower limit, so we need to avoid the minimum day (e.g. if minimum is 12, we want to skip over 10)
            const availableDayElement = Array.from(document.querySelectorAll('.calendar__day:not(.day--blocked)')).find(
                dayElement => {
                    const availableDay = parseInt(dayElement.innerText, 10) || -1
                    return availableDay >= minDay
                }
            )
            if (availableDayElement) {
                availableDayElement.click()
                await waitForLoad(250)
            }
        }
    }

    async function checkForAppointments() {
        if (paused) return
        if (await isCurrentDateGood()) {
            document.querySelector('[data-testid="appointment-select-timeslot"]')?.click()
            return
        }
        await clickPage('next')
        if (paused) return
        if (await isCurrentDateGood()) {
            document.querySelector('[data-testid="appointment-select-timeslot"]')?.click()
            return
        }
        await clickPage('prev')
        if (paused) return
        if (await isCurrentDateGood(true)) {
            document.querySelector('[data-testid="appointment-select-timeslot"]')?.click()
        } else {
            checkForAppointments()
        }
    }

    async function startScript() {
      if (paused) return
      const onLocationPage = !!document.querySelector(locationPageHeader)

      if (onLocationPage) {
        return findLocations()
      }

      const onAppointmentPage = !!document.querySelector(appointmentPageHeader)
      if (onAppointmentPage) {
        return checkForAppointments()
      }
    }

    /**
     * Given element text in lowercase, decide whether it's a location we want to click.
     */
    const locationPageMatcher = (text) => {
      const distanceRegex = /(\d+\.\d+) km away/g;
      const distance = parseFloat([...text.matchAll(distanceRegex)][0]);
      if (isNaN(distance)) return false
      if (blocklistedLocationQuery.test(text)) return false
      return allowlistedLocationQuery.test(text) && distance <= MAX_DISTANCE_KM
    }

    async function findLocations() {
      if (paused) return

      const element = [...document.querySelectorAll(".tw-border-n200")].find(
        (element) => locationPageMatcher(element.innerText.toLowerCase())
      )
      if (element) {
        const locationButton = element
          .querySelector('[data-testid="location-select-location-continue"]')
        if (locationButton) {
            locationButton.click()
            await sleep(100)
            await waitForLoad()
            if (paused) return
            return checkForAppointments()
        }
      }

      document.querySelector(backButtonInHeader).click();
      await sleep(500)
      if (paused) return

      document.querySelector(searchPageContinue).click();
      await waitForLoad()

      findLocations()
    }
})();