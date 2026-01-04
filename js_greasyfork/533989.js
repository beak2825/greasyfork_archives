// ==UserScript==
// @name             Mensaar Show Next Day
// @namespace        https://github.com/ikelax/userscripts
// @match            https://mensaar.de/
// @grant            none
// @version          0.4.0
// @author           Alexander Ikonomou
// @description      A userscript that switches to the meal plans for the next day when the canteen has already closed for today
// @license          MIT
// @require          https://update.greasyfork.org/scripts/502635/1422102/waitForKeyElements-CoeJoder-fork.js
// @supportURL       https://github.com/ikelax/userscripts/issues
// @copyright        2025, Alexander Ikonomou (https://github.com/ikelax)
// @homepageURL      https://github.com/ikelax/userscripts
// @homepage         https://github.com/ikelax/userscripts
// @contributionURL  https://github.com/ikelax/userscripts
// @collaborator     ikelax
// @icon             https://mensaar.de/img/icon.png
// @downloadURL https://update.greasyfork.org/scripts/533989/Mensaar%20Show%20Next%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/533989/Mensaar%20Show%20Next%20Day.meta.js
// ==/UserScript==

waitForKeyElements("div.active", switchToNextDay);

function switchToNextDay(activeTab) {
  const tabDate = activeTab.innerText;

  if (tabDate == undefined) {
    return;
  }

  const canteen = window.location.hash.replace("#/menu/", "");

  if (!["sb", "htwcas", "musiksb"].includes(canteen)) {
    return;
  }

  const closingTime = getClosingTime(canteen, tabDate);

  if (closingTime === undefined) {
    return;
  }

  const now = new Date();

  if (now > closingTime) {
    activeTab.nextSibling?.click();
  }
}

/***********************************************************
 *
 * The code below is copied from `utils/getClosingTime.js`.
 * If you make any changes to the code, please copy them to
 * `utils/getClosingTime.js`.
 *
 * For the reasons, see commit c47a8305a7a5163d638becc2c169.
 *
 **********************************************************/

/**
 * Converts a German date in the format "Weekday, Day. Month
 * Year" to "Day. Month Year", translating the month into
 * English.
 *
 * @param {string} date The date string to convert
 * @returns {string | undefined} The converted date string or undefined if the
 * date string was not in the expected format
 */
function convertDate(date) {
  const germanDate = date.split(", ")[1];

  return germanDate
    ?.replace("Januar", "January")
    ?.replace("Februar", "February")
    ?.replace("März", "March")
    ?.replace("Mai", "May")
    ?.replace("Juni", "June")
    ?.replace("Juli", "July")
    ?.replace("Oktober", "October")
    ?.replace("Dezember", "December");
}

/**
 * Depending on the weekday, the canteens close at different
 * times. For the closing times see also the
 * {@link https://www.stw-saarland.de/gastro/ page of the Studentenwerk}.
 *
 * The closing time of the canteen is the closing time of
 * the latest counter. For example, for the canteen at the
 * Saarland University, this means that it is the closing
 * time of the counter for Menü 1 and Menü 2.
 *
 * `dateString` is expected to be a string in the format
 * "Weekday, Day. Month Year" in German.
 *
 * @param {"sb" | "htwcas" | "musiksb"} canteen The canteen
 * @param {string} dateString The date string of the day in
 * the specified format
 * @returns {Date | undefined} The closing time for the
 * `canteen` and the day or undefined if the `dateString`
 * was not in the expected format
 */
function getClosingTime(canteen, dateString) {
  const convertedDateString = convertDate(dateString);

  if (convertedDateString === undefined) {
    return;
  }

  const convertedDate = new Date(convertedDateString);

  let closingMinutes = getClosingMinutes(canteen, convertedDate.getDay());
  return new Date(
    convertedDate.getFullYear(),
    convertedDate.getMonth(),
    convertedDate.getDate(),
    14,
    closingMinutes,
  );
}

/**
 * The function does not check whether `canteen` is one of
 * the specified strings.
 *
 * @param {"sb" | "htwcas" | "musiksb"} canteen The canteen
 * @param {number} day The day of the week in the same
 * enumeration as the `getDay` property of `Date`
 * @returns {0 | 15 | 30} The minutes of the closing time
 * for the `canteen` and the day
 */
function getClosingMinutes(canteen, day) {
  switch (canteen) {
    case "musiksb":
      return 0;
    case "htwcas":
      return 15;
    case "sb":
      // The canteen closes 15 minutes earlier on Fridays.
      return day === 5 ? 15 : 30;
  }
}
