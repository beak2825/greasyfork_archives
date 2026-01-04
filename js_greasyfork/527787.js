// ==UserScript==
// @name         Timezone Converter
// @namespace    https://violentmonkey.github.io/get-it/
// @version      1.1
// @description  [Modified] Converts UTC dates to local timezone with weekday and 24-hour time format
// @author       Original Author Lemonade (original script), TurtleTough42 (modifications v1.0 & v1.1)
// @match        https://www.myanonamouse.net/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/527787/Timezone%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/527787/Timezone%20Converter.meta.js
// ==/UserScript==

/*
 * CHANGELOG:
 * v1.1 - Added comprehensive code comments
 * v1.0 - Major updates:
 *        - Added weekday display
 *        - Switched to 24-hour time format
 *        - Improved timezone handling using IANA codes
 *        - Removed unnecessary time adjustments
 *        - Added mutation observer for dynamic content
 * v0.8 - Initial release (basic timezone conversion without seconds)
 */

(function () {
  "use strict";

  // Configuration: Set your UTC offset here (e.g., -7 for UTC-7)
  const yourTimezoneOffset = -7; // <- CHNAGE TO YOUR TIMEZONE OFFSET

  /**
   * Generates IANA timezone identifier from numeric offset
   * @param {number} offset - UTC offset in hours
   * @returns {string} IANA timezone string (e.g., Etc/GMT+7)
   */
  function getTimeZoneForOffset(offset) {
    // Note: IANA's Etc/GMT±X zones have inverted sign convention
    return `Etc/GMT${offset > 0 ? '-' : '+'}${Math.abs(offset)}`;
  }

  /**
   * Parses UTC date string and converts to target timezone Date object
   * @param {string} dateStr - Original date string from page
   * @returns {Date} Date object adjusted for target timezone
   */
  function convertToYourTimezone(dateStr) {
    // Append " UTC" to force UTC parsing
    return new Date(dateStr + " UTC");
  }

  /**
   * Formats date with weekday and 24-hour time
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string
   */
  function formatDateWith24HourTime(date) {
    const timeZone = getTimeZoneForOffset(yourTimezoneOffset);
    return date.toLocaleString([], {
      timeZone: timeZone,
      weekday: "long",      // Full weekday name (e.g., "Monday")
      year: "numeric",      // 4-digit year
      month: "short",       // Abbreviated month (e.g., "Feb")
      day: "numeric",       // Day of month
      hour: "2-digit",      // 24-hour format with leading zero
      minute: "2-digit",    // Minutes with leading zero
      hour12: false         // Force 24-hour format <- CHNAGE TO TRUE IF YOU WANT 12 HOUR TIME
    });
  }

  /**
   * Updates DOM elements with converted timestamps
   * @param {HTMLElement} element - Target element containing original date
   */
  function updateTime(element) {
    // Store original date string in data attribute
    let originalDateStr = element.getAttribute("data-original-date");
    if (!originalDateStr) {
      originalDateStr = element.innerText;
      element.setAttribute("data-original-date", originalDateStr);
    }

    // Convert and format date
    let convertedDate = convertToYourTimezone(originalDateStr);
    let convertedDateStr = formatDateWith24HourTime(convertedDate);

    // Update DOM only if changed to minimize repaints
    if (element.innerText !== convertedDateStr) {
      element.innerText = convertedDateStr;
    }
  }

  /**
   * Observes DOM changes and sets up auto-updates
   */
  function observeMutations() {
    // CSS selector for target date elements
    const selector = '.fpTime.tP[data-dtype="1"]';
    let dateElements = document.querySelectorAll(selector);

    dateElements.forEach((element) => {
      // Initial conversion
      updateTime(element);

      // Mutation observer for dynamic content changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            updateTime(element);
          }
        });
      });

      // Watch for text changes in element and its children
      observer.observe(element, {
        childList: true,
        subtree: true
      });

      // Regular interval update (every 10 seconds) to handle:
      // - Time changes across minute boundaries
      // - Potential DOM modifications not caught by observer
      setInterval(() => {
        updateTime(element);
      }, 10000);
    });
  }

  // Start observing when script loads
  observeMutations();
})();