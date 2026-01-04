// ==UserScript==
// @name         Harvest - Hourly Pay
// @namespace    https://zachhardesty.com
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  adds total money made per day and week to Harvest (excl. taxes)
// @copyright    2019, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.0.2

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/harvest-hourly-pay.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Harvest_-_Hourly_Pay
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://*.harvestapp.com/*
// @downloadURL https://update.greasyfork.org/scripts/419649/Harvest%20-%20Hourly%20Pay.user.js
// @updateURL https://update.greasyfork.org/scripts/419649/Harvest%20-%20Hourly%20Pay.meta.js
// ==/UserScript==

/**
 * @param {string} t - hh:mm
 * @returns {number} parsed time
 */
function timeToDecimal(t) {
  const splitTime = t.split(":")
  return Number.parseFloat(splitTime[0]) + Number.parseFloat(splitTime[1]) / 60
}

;(function harvestPay() {
  function addPay() {
    // ** hourly pay rate - replace this **
    const rate = 16

    const hoursPerDay = document.querySelectorAll(
      ".day-view-week-nav li a span"
    )
    for (const time of hoursPerDay) {
      if (!time.textContent.includes("$")) {
        /* eslint-disable-next-line no-param-reassign */
        time.textContent += ` | $${Math.round(
          timeToDecimal(time.textContent) * rate
        )}`
      }
    }
    const hoursPerWeek = document.querySelector(
      "#day-view-week-nav-total .test-week-total"
    )
    if (!hoursPerWeek.textContent.includes("$")) {
      hoursPerWeek.textContent += ` | $${Math.round(
        timeToDecimal(hoursPerWeek.textContent) * rate
      )}`
    }
  }

  const observeDOM = (() => {
    const MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver
    const eventListenerSupported = window.addEventListener

    return (obj, callback) => {
      if (MutationObserver) {
        // define a new observer
        const obs = new MutationObserver((mutations) => {
          if (
            mutations[0].addedNodes.length ||
            mutations[0].removedNodes.length
          ) {
            callback()
          }
        })
        // have the observer observe foo for changes in children
        obs.observe(obj, { childList: true, subtree: true })
      } else if (eventListenerSupported) {
        obj.addEventListener("DOMNodeInserted", callback, false)
        obj.addEventListener("DOMNodeRemoved", callback, false)
      }
    }
  })()

  // Observe a specific DOM el for node changes:
  observeDOM(document.querySelector(".day-view-week-nav"), addPay)

  addPay() // Execute on page load
})()
