// ==UserScript==
// @name        DVSA Booking Macro
// @description Brings you to the available slots ASAP.
// @match       https://driverpracticaltest.dvsa.gov.uk/*
// @grant       none
// @version     1.0
// @author      onlypuppy7
// @namespace   https://greasyfork.org/users/1083183
// @downloadURL https://update.greasyfork.org/scripts/524642/DVSA%20Booking%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/524642/DVSA%20Booking%20Macro.meta.js
// ==/UserScript==

if (location.pathname == "/login" && document.getElementById("driving-licence-number")) {
    let licenseNumber = localStorage.getItem("licenseNumber");
    if (!licenseNumber) {
        licenseNumber = prompt("enter license number");
        localStorage.setItem("licenseNumber", licenseNumber);
    };
    let referenceNumber = localStorage.getItem("referenceNumber");
    if (!referenceNumber) {
        referenceNumber = prompt("enter reference number");
        localStorage.setItem("referenceNumber", referenceNumber);
    };

    document.getElementById("driving-licence-number").value = licenseNumber;
    document.getElementById("application-reference-number").value = referenceNumber;
    document.getElementById("booking-login").click();
} else if (location.pathname == "/manage") {
    if (location.search == "?execution=e1s1") {
        document.getElementById("date-time-change").click();
    } else if (document.getElementById("test-choice-earliest")) {
        document.getElementById("test-choice-earliest").click();
        document.getElementById("driving-licence-submit").click();
    } else if (document.getElementsByClassName("BookingCalendar-date--bookable")) {
        document.getElementsByClassName("BookingCalendar-date--bookable")[0].children[0].children[0].click();
    };
};