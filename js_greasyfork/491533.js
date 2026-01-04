// ==UserScript==
// @name         Snap Up US Visa Appointment
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get that US visa appointment
// @author       Chris Xue <chrisxue815@gmail.com>
// @match        https://ais.usvisa-info.com/en-ca/niv/schedule/*/appointment*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usvisa-info.com
// @grant        none
// @license      UNLICENSE
// @downloadURL https://update.greasyfork.org/scripts/491533/Snap%20Up%20US%20Visa%20Appointment.user.js
// @updateURL https://update.greasyfork.org/scripts/491533/Snap%20Up%20US%20Visa%20Appointment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const right = '2025-10-30';
    const refreshIntervalMillis = 120000;
    const refreshJitterMillis = 5000;

    async function main() {
        const timeout = setTimeout(() => location.reload(), refreshIntervalMillis + Math.random() * refreshJitterMillis);
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'));

        console.log('Waiting for dropdown');
        const dateDropdown = await waitFor(() => visible(document.querySelector('#appointments_consulate_appointment_date')));
        dateDropdown.click();

        console.log('Waiting for calendar');
        await waitFor(() => document.querySelector('.ui-datepicker-calendar'));
        let dayButton = null;

        for (let i = 0; i < 48; i++) {
            dayButton = document.querySelector('.ui-datepicker-calendar td[data-handler=selectDay]');
            if (dayButton) {
                break;
            }

            document.querySelector('.ui-datepicker-next').click();
            await delay(1);
        }

        const year = parseInt(dayButton.getAttribute('data-year'));
        const month = parseInt(dayButton.getAttribute('data-month'));
        const day = parseInt(dayButton.textContent.trim());
        const date = moment({year, month, day});
        const rightMoment = moment(right, 'YYYY-MM-DD');
        console.log(`Earliest slot: ${date.format('YYYY-MM-DD')}`);
        console.log(`Wanted before: ${rightMoment.format('YYYY-MM-DD')}`);

        if (date >= rightMoment) {
            console.log('Slot too late. Waiting to refresh');
            return;
        }

        dayButton.click();

        console.log('Waiting for time');
        const time = await waitFor(() => Array.from(document.querySelectorAll('#appointments_consulate_appointment_time option')).find(it => it.value));

        clearTimeout(timeout);

        console.log(`Selecting time ${time.value}`);
        const timeSelect = document.querySelector('#appointments_consulate_appointment_time');
        timeSelect.value = time.value;
        timeSelect.dispatchEvent(new Event('change'));

        document.querySelector('#appointments_submit').click();
        await delay(1);

        $('.reveal-overlay:visible a.alert:contains(Confirm)').click();
    }

    async function waitFor(func) {
        const intervalMillis = 100;
        const maxAttempts = (refreshIntervalMillis + refreshJitterMillis) / intervalMillis;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await delay(intervalMillis);
            try {
                const result = func();
                if (result) {
                    return result;
                }
            } catch (e) {
            }
        }
        return null;
    }

    function delay(t) {
        return new Promise(resolve => setTimeout(resolve, t));
    }

    function visible(el) {
        if (el != null && $(el).is(':visible') && !$(el).is(':hidden')) {
            return el;
        } else {
            return null;
        }
    }

    main();
})();