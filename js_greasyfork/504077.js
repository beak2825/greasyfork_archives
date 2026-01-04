// ==UserScript==
// @name         TradeVille Bond Calc
// @namespace    http://tampermonkey.net/
// @version      2024-08-20-2
// @description  Calculate bond interest rate!
// @author       Gyozo Kudor
// @match        https://portal.tradeville.ro/portal/trading.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradeville.ro
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/504077/TradeVille%20Bond%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/504077/TradeVille%20Bond%20Calc.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function dateDiffYears(date1, date2) {
        // Extract year, month, and day from both dates
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const day1 = date1.getDate();

        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
        const day2 = date2.getDate();

        // Calculate the difference in years
        let yearsDifference = year2 - year1;

        // Adjust for months and days
        if (month2 < month1 || (month2 === month1 && day2 < day1)) {
            yearsDifference--;
        }

        return yearsDifference;
    }

    function dateDiffDays(date1, date2) {

        // Calculate the time difference in milliseconds
        let differenceInTime = date2.getTime() - date1.getTime();

        // Convert the time difference to days
        let differenceInDays = differenceInTime / (1000 * 3600 * 24);

        return differenceInDays;
    }

    function parseCustomDateString(dateStr) {
        const regexymd = /(\d{4})-(\d{2})-(\d{2})/gm;
        let [matches] = [...dateStr.matchAll(regexymd)];
        if (matches?.length === 4) {
            const year = parseInt(matches[1]);
            const month = parseInt(matches[2]) - 1;
            const day = parseInt(matches[3]);

            // Create a new Date object
            return new Date(year, month, day);
        }

        const regexmdy = /(\d{2})\/(\d{2})\/(\d{2})/gm;
        [matches] = [...dateStr.matchAll(regexmdy)];
        if (matches?.length === 4) {
            const year = 2000 + parseInt(matches[3]);
            const month = parseInt(matches[1]) - 1;
            const day = parseInt(matches[2]);

            // Create a new Date object
            return new Date(year, month, day);
        }

        return null;
    }

    function getTodaysDate() {
        const today = new Date(); // Gets the current date and time

        const year = today.getFullYear(); // Extracts the year
        const month = today.getMonth(); // Extracts the month (note: months are 0-indexed)
        const day = today.getDate(); // Extracts the day

        return new Date(year, month, day);
    }

    function setOutput(interest1Y, interestYMT, totalEarned) {
        const interest1YFmt = `${(interest1Y * 100).toFixed(2)} %`;
        const interestYMTFmt = `${(interestYMT * 100).toFixed(2)} %`;

        const interest1YId = 'interest1Y';
        const interestYMTId = 'interestYMT';
        const totalEarnedId = 'totalEarned';
        if ($(`.ordinprev table tr#${interest1YId}`).length == 0) {
            let newRow = `<tr id='${interest1YId}'> <td>interest1Y</td> <td></td> </tr>`;
            $('.ordinprev table').append(newRow);
        }

        if ($(`.ordinprev table tr#${interestYMTId}`).length == 0) {
            let newRow = `<tr id='${interestYMTId}'> <td>interestYMT</td> <td></td> </tr>`;
            $('.ordinprev table').append(newRow);
        }

        if ($(`.ordinprev table tr#${totalEarnedId}`).length == 0) {
            let newRow = `<tr id='${totalEarnedId}'> <td>Total earned</td> <td></td> </tr>`;
            $('.ordinprev table').append(newRow);
        }

        $(`.ordinprev table tr#${interest1YId} td:nth-child(2)`).text(interest1YFmt);
        $(`.ordinprev table tr#${interestYMTId} td:nth-child(2)`).text(interestYMTFmt);
        $(`.ordinprev table tr#${totalEarnedId} td:nth-child(2)`).text(totalEarned.toFixed(2));
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    $(document).ready(async function () {
        await delay(1000);

        // $(document.body).on('click', 'button#trade[rol=cumparaSimbol], button.button-buy', async () => {
        //     $('#butonDetaliiSimbolPortalO').click();
        // });

        await delay(1000);
        $(document.body).on('keyup mouseup', '#NewOrderSection form[comanda=ordinnou].centru', _.debounce(() => {
            const bondTitle = $('.TitluSiSimbol span[gi=nume]').text();
            if (!bondTitle.startsWith('Titluri de stat')) return;

            if ($('#containerInformatii span[gi=randcup].denomPrc, #containerInformatii span[gi=valnom]').length < 2) {
                $('#butonDetaliiSimbolPortalO').click();
                return;
            }

            try {

                //get bond information
                const bondPrice = Number.parseInt($('#containerInformatii span[gi=valnom]')[0].innerText);
                const bondinterestRate = Number.parseFloat($('#containerInformatii span[gi=randcup].denomPrc')[0].innerText) / 100;
                const maturityDate = parseCustomDateString($('#containerInformatii #detaliiTsimOblig span[gi=datafin]')[0].innerText);

                const buyAmount = Number.parseInt($('#NewOrderSection form[comanda=ordinnou].centru').find('input[name=cant]')[0].value); //TODO;
                if (buyAmount == 0) return;
                const orderTotal = Number.parseFloat($('#NewOrderSection .ordinprev span[gi=valord]')[0].innerText.replace(',', ''));

                //do the calculations
                console.log('calculating bond YMT ...');

                //interest for 1 year
                const interest1Y = bondPrice * buyAmount * (1 + bondinterestRate) / orderTotal - 1;

                //interest total for multiple years (if any)
                const todayDate = getTodaysDate();
                const yearsDiff = dateDiffYears(todayDate, maturityDate) + 1; //difference in years rounded up
                const interestTotal = interest1Y * yearsDiff;

                //calculate annualized interest rate (YMT)
                const daysUntilMaturity = dateDiffDays(todayDate, maturityDate);
                const interestYMT = interestTotal * 365.25 * yearsDiff / daysUntilMaturity;

                const totalEarned = bondPrice * buyAmount * interestTotal;

                //output data
                setOutput(interest1Y, interestYMT, totalEarned);

            } catch (e) {
                console.error(e);
                setOutput(999, 999, 0);
            }
        }, 1500));


    });
})();