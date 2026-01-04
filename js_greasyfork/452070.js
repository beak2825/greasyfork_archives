// ==UserScript==
// @name         Reload US Visa Appointments
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Reload US Visa Appointments every ~30 seconds
// @author       Chris Xue <chrisxue815@gmail.com>
// @match        https://ais.usvisa-info.com/en-ca/niv/schedule/*/appointment
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usvisa-info.com
// @grant        none
// @license      UNLICENSE
// @downloadURL https://update.greasyfork.org/scripts/452070/Reload%20US%20Visa%20Appointments.user.js
// @updateURL https://update.greasyfork.org/scripts/452070/Reload%20US%20Visa%20Appointments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function main() {
        setTimeout(() => location.reload(), 30000 + Math.random() * 5000);

        console.log('Waiting for dropdown');
        await waitFor(() => isVisible(document.querySelector('#appointments_consulate_appointment_date')));

        //document.querySelector('#appointments_consulate_appointment_date').click();

        console.log('Waiting for calendar');
        await waitFor(() => document.querySelector('.ui-datepicker-calendar'));

        for (let i = 0; i < 24; i++) {
            if (document.querySelector('.ui-datepicker-calendar td[data-handler=selectDay]')) {
                break;
            }

            document.querySelector('.ui-datepicker-next').click();

            await delay(1);
        }
    }

    async function waitFor(func) {
        const ATTEMPTS = 300;
        for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
            await delay(100);
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

    function isVisible(el) {
        return el != null && !$.expr.filters.hidden(el);
    }

    main();
})();