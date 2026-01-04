// ==UserScript==
// @name USCIS desired visa appointment dates notifier
// @description Polls the visa appointment calendar and gives your a browser push notification when a desired date opens up
// @match https://cgifederal.secure.force.com/scheduleappointment
// @version          0.1
// @license GNU AGPLv3 https://www.gnu.org/licenses/agpl-3.0.html
// @namespace USCIS-poller
// @downloadURL https://update.greasyfork.org/scripts/446245/USCIS%20desired%20visa%20appointment%20dates%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/446245/USCIS%20desired%20visa%20appointment%20dates%20notifier.meta.js
// ==/UserScript==

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

//sleep(4000);

exec(function() {
    return j_id184_onchange();
});

console.log("only " + document.getElementsByClassName("ui-datepicker-year")[0].innerText + " found. No 2022");

function notifyMe(earliestAppointmentYear) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("Este navegador no soporta notificaciones de escritorio.");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            createNotification(earliestAppointmentYear);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function(permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    createNotification(earliestAppointmentYear);
                }
            });
        }

    }

function createNotification(earliestAppointmentYear) {
        var title = earliestAppointmentYear +" date available!";
        var options = {
            body: "Want it?",
         };
        var notification = new Notification(title, options);
        notification.onclick = function() {
            window.focus();
        };
    }

notifyMe(document.getElementsByClassName("ui-datepicker-year")[0].innerText);




//GM_notification/GM.notification("2023");