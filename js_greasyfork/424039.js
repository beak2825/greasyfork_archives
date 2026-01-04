// ==UserScript==
// @name         VA DMV Appointment Helper
// @description  Tool to help schedule VA DMV appointment
// @icon         https://www.dmv.virginia.gov/favicon.ico
// @version      0.1.2
// @author       foomango
// @match        https://vadmvappointments.as.me/schedule.php?*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango2
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424039/VA%20DMV%20Appointment%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/424039/VA%20DMV%20Appointment%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function notifyMe(message) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(message);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(message);
                }
            });
        }
    }

    function playSound() {
        open('https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3')
    }

    const testBtn = $('div[data-qa="appointment-16554603-select"]')
    testBtn.click()
    setTimeout(() => {
        const availableDays = $('.activeday')
        if (availableDays.length && /2021\-0[7-8].*/.test(availableDays.attr('day'))) {
            setInterval(() => notifyMe(`DMV Available: ${availableDays.attr('day')}`), 3000);
            playSound()
        } else {
            const timeoutID = setTimeout(() => {
                clearTimeout(timeoutID)
                location.reload()
            }, 8000);
        }
    }, 3000)

})();