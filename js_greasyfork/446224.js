// ==UserScript==
// @name         ICBC Appointment Finder 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Find ICBC Appointment
// @author       Yesinn
// @match        https://onlinebusiness.icbc.com/webdeas-ui/home
// @match        https://onlinebusiness.icbc.com/webdeas-ui/booking
// @icon         https://www.google.com/s2/favicons?domain=icbc.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446224/ICBC%20Appointment%20Finder%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/446224/ICBC%20Appointment%20Finder%2020.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const upperbound = moment('2022-06-09','YYYY-MM-DD')
    const lowerbound = moment('2022-06-10','YYYY-MM-DD')
    const lastName = 'Kwak'
    const licenceNumber = '4897823'
    const keyword = ''
    const address = '999 Kingsway, Vancouver, BC'

    async function main() {
        requestNotificationPermission();

        let found = false;
        while (!found) {
            try {
                let nextButton = await waitFor(() => Array.from(document.querySelectorAll('.mat-raised-button')).filter(i => i.textContent.includes('Next'))[0]);
                if (nextButton == null) {
                    location.href = 'https://onlinebusiness.icbc.com/webdeas-ui/booking';
                    continue;
                }
                nextButton.click();

                const lastNameText = await waitFor(() => document.querySelector('input[formcontrolname="drvrLastName"]'));
                lastNameText.value = lastName;
                lastNameText.dispatchEvent(new Event('input'));
                const licenceNumberText = document.querySelector('input[formcontrolname="licenceNumber"]');
                licenceNumberText.value = licenceNumber;
                licenceNumberText.dispatchEvent(new Event('input'));
                const keywordText = document.querySelector('input[formcontrolname="keyword"]');
                keywordText.value = keyword;
                keywordText.dispatchEvent(new Event('input'));
                const toc = document.querySelector('mat-checkbox[formcontrolname="cb"] input[type="checkbox"]');
                toc.click();

                const signIn = await waitFor(() => Array.from(document.querySelectorAll('button.mat-raised-button')).filter(i => i.textContent.includes('Sign in'))[0]);
                signIn.click();

                const reschedule = await waitFor(() => Array.from(document.querySelectorAll('button.mat-raised-button')).filter(i => i.textContent.includes('Reschedule appointment'))[0]);
                reschedule.click();

                const yes = await waitFor(() => Array.from(document.querySelectorAll('button.mat-raised-button')).filter(i => i.textContent.includes('Yes'))[0]);
                yes.click();

                const addressText = await waitFor(() => document.querySelector('input[formcontrolname="finishedAutocomplete"]'));
                addressText.focus();
                addressText.value = address;
                addressText.dispatchEvent(new Event('keyup'));

                const addressDropdown = await waitFor(() => Array.from(document.querySelectorAll('mat-option')).filter(i => i.textContent.includes(address))[0]);
                addressDropdown.click();
                const search = Array.from(document.querySelectorAll('button.mat-raised-button')).filter(i => i.textContent.includes('Search'))[0];
                search.click();

                for (; ;) {
                    const loc = await waitFor(() => document.querySelector('.appointment-location-wrapper'));
                    loc.click();

                    let dateTitle = await waitFor(() => document.querySelector('.date-title') || document.querySelector('.error-msg') || document.querySelector('.no-appts-msg'));
                    const dateStr = dateTitle.textContent.trim();
                    if (dateStr.includes('Hmm')) {
                        // Hmm, looks like something went wrong on our end. Please try again later.
                    } else {
                        const date = moment(dateStr, 'dddd, MMMM Do, YYYY');
                        if ( (date.isBefore(upperbound)) && (date.isAfter(lowerbound)) ) {
                            const dateFormatted = date.format('YYYY-MM-DD');
                            console.log(dateFormatted);
                            showNotification('ICBC appointment: ' + dateFormatted);
                            playSound('https://freesound.org/data/previews/337/337049_3232293-lq.mp3');
                            found = true;
                            break;
                        }
                    }

                    await delay(5000 + jitter(1000));
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function waitFor(func) {
        const ATTEMPTS = 30;
        for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
            await delay(1000);
            try {
                const result = func();
                if (result != null) {
                    return result;
                }
            } catch (e) {
            }
        }
        return null;
    }

    function showNotification(body) {
        if (Notification.permission === "granted") {
            const notification = new Notification('ICBC Appointment Finder', {
                body: body,
            });
        }
        else {
            alert(body);
        }
    }

    function playSound(url) {
        const audio = new Audio(url);
        audio.play();
    }

    function requestNotificationPermission() {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }

    function delay(t) {
        return new Promise(resolve => setTimeout(resolve, t));
    }

    function jitter(t) {
        return (Math.random() - 0.5) * t;
    }

    main();
})();
