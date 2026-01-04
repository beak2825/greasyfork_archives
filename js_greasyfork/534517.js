// ==UserScript==
// @name         CDC Booking Page Reload every 15m
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Refresh the page
// @author       afjw
// @match        https://bookingportal.cdc.com.sg/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534517/CDC%20Booking%20Page%20Reload%20every%2015m.user.js
// @updateURL https://update.greasyfork.org/scripts/534517/CDC%20Booking%20Page%20Reload%20every%2015m.meta.js
// ==/UserScript==

function isTargetPage() {
  return location.href === 'https://bookingportal.cdc.com.sg/NewPortal/Booking/BookingPL.aspx';
}

if (isTargetPage()) {
  (function () {
    setInterval(() => {
      location.reload();
    }, 4 * 60 * 1000); // 5 minutes in milliseconds
  })();
}

