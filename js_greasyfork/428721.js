// ==UserScript==
// @name         Openplay Tennis Booker
// @namespace    http://charliefrancis.me/
// @version      0.2
// @description  Book Free Tennis Courts
// @author       You
// @match        https://www.openplay.co.uk/booking/place/*
// @icon         https://www.google.com/s2/favicons?domain=openplay.co.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428721/Openplay%20Tennis%20Booker.user.js
// @updateURL https://update.greasyfork.org/scripts/428721/Openplay%20Tennis%20Booker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const daysInFuture = 8;
    const requiredTime = 8;
    const refreshDelay = 2;

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    function padStart(length, char, string) {
        return new String(string).padStart(length, char);
    }

    function refresh() {
        setTimeout(() => window.location.reload(), refreshDelay * 1000);
    }

    const url = new URL(window.location);

    const bookingPage = new RegExp(/^\/booking\/place\/[0-9]+$/);
    const pricingPage = new RegExp(/^\/booking\/place\/[0-9]+\/pricing$/);
    const cartPage = new RegExp(/^\/booking\/place\/[0-9]+\/cart$/);
    const questionsPage = new RegExp(/^\/booking\/place\/[0-9]+\/questions$/);
    const confirmPage = new RegExp(/^\/booking\/place\/[0-9]+\/confirm$/);

    if (bookingPage.test(url.pathname)) {

        const date = new Date();
        const dateToBook = date.addDays(daysInFuture);
        const dateToBookFormatted = dateToBook.getFullYear() + "-" + (padStart(2, '0', dateToBook.getMonth() + 1)) + "-" + padStart(2, '0', dateToBook.getDate());
        const params = new URLSearchParams(window.location.search);

        if (!params.get('date') || params.get('date') !== dateToBookFormatted) {
            const url = new URL(window.location);
            url.searchParams.set('date', dateToBookFormatted);
            url.searchParams.set('use_id', 42);

            window.location = url.href;
        }

        const table = document.getElementsByClassName('table-times resource-2122')[0];

        if (!table) {
            refresh();
            return;
        }

        const tempSlotLinks = table.getElementsByTagName('a');

        if (tempSlotLinks.length > 0) {

            const tempSlotLink = tempSlotLinks[0];

            const resourceId = new URL(tempSlotLink.href).searchParams.get('resource_id');
            console.log(resourceId);
            window.location = `https://www.openplay.co.uk/booking/place/3473/pricing?start=${padStart(2, '0', requiredTime)}:00&end=${padStart(2, '0', requiredTime + 1)}:00&date=${dateToBookFormatted}&resource_id=${resourceId}&use_id=42`
        } else {
            refresh();
            return;
        }

    } else if (pricingPage.test(url.pathname)) {

        document.getElementById('pricingOption').click();

    } else if (cartPage.test(url.pathname)) {

        document.getElementById('cart-continue').click();

    } else if (questionsPage.test(url.pathname)) {

        document.getElementById('submit').click()

    } else if (confirmPage.test(url.pathname)) {

        document.getElementById('confirm-checkbox').click();
        document.getElementById('complete-order').click();

    }

})();