// ==UserScript==
// @name         Shotgun Slot
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automagically take a slot (config inside)
// @author       JeanMax
// @match        https://projects.intra.42.fr/projects/*/slots
// @match        https://projects.intra.42.fr/*/mine
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40273/Shotgun%20Slot.user.js
// @updateURL https://update.greasyfork.org/scripts/40273/Shotgun%20Slot.meta.js
// ==/UserScript==

var DRY_RUN = true,
    /*
      in dry-run mode, the script won't confirm the slot
    */

    MULTIPLE_SLOTS = false,
    /*
      if enabled, we'll click on the 'subscibe to defense' button
      to take multiple slots for one project
    */

    HOUR_MIN = 14,
    /*
      minimum hour (24h format) to take a slot

      exemple: don't take any slot before 2pm -> HOUR_MIN = 14
      note: a slot at 14:00 would be accepted
    */

    HOUR_MAX = 21,
    /*
      maximum hour (24h format) to take a slot

      exemple: don't take any slot after 9pm -> HOUR_MAX = 21
      note: a slot at 21:45 would be accepted
     */

    DAYS_ID_LIKE_TO_DO_STUFFS = [0, 4],
    /*
      which day(s) should we be watching?
       days from 0 to 6:
        0 -> Monday
        1 -> Tuesday
        2 -> Wednesday
        3 -> Thursday
        4 -> Friday
        5 -> Saturday
        6 -> Sunday

       exemple: Monday and Friday -> DAYS_ID_LIKE_TO_DO_STUFFS = [0, 4]
    */

    WEEKS_ID_LIKE_TO_DO_STUFFS = [0];
    /*
      which week(s) should we be watching?
       weeks from 0 to n:
        0 -> current week
        1 -> next week
        ...

       exemple: only current week -> WEEKS_ID_LIKE_TO_DO_STUFFS = [0]
       exemple: next 2 weeks, but not the current -> WEEKS_ID_LIKE_TO_DO_STUFFS = [1, 2]
    */


(function() {
    'use strict';
    window.onload = checkSlot();
})();

function sleep(ms) {
    console.log("sleeping for " + parseInt(ms / 1000) + "s");
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkSlot() {
    var week, day, hour, hour_array, event,
        subscribe, slot, button, arrow,
        cols = [],
        events = [];

    await sleep((1 + Math.random()) * 1e4); // random delay between 10/20 seconds

    if (MULTIPLE_SLOTS) {
        subscribe = document.getElementsByClassName("btn btn-primary btn-block")[0];
        if (subscribe) {
            subscribe.click();
            await sleep(3000);
            return;
        }
    }

    for (week = 0; week <= Math.max(...WEEKS_ID_LIKE_TO_DO_STUFFS); week++) {
        await sleep((1 + Math.random()) * 5 * 1e3); // random delay between 5/10 seconds

        if (WEEKS_ID_LIKE_TO_DO_STUFFS.includes(week)) {
            cols = document.getElementsByClassName("fc-content-col");
            for (day = 0; day < 7; day++) {
                if (DAYS_ID_LIKE_TO_DO_STUFFS.includes(day)) {
                    events = cols[day].getElementsByClassName("fc-time-grid-event");
                    for (event = 0; event < events.length; event++) {
                        hour_array = events[event].getElementsByClassName("fc-time")[0]
                            .getAttribute("data-full")
                            .split(" ");
                        hour = parseInt(hour_array[0]);
                        if (hour_array[1] === "PM") {
                            hour += 12;
                        }
                        if (hour >= HOUR_MIN && hour <= HOUR_MAX) {
                            slot = events[event];
                            console.log(
                                "slot found at: "
                                + parseInt(hour) + "h, d" + parseInt(day) + ", w" + parseInt(week)
                            );
                            break;
                        }
                    }
                }
            }

            if (slot) {
                slot.click();
                console.log("shot...");
                await sleep(1000);
                if (DRY_RUN) {
                    button = document.getElementsByClassName("btn btn-default")[0];
                } else {
                    button = document.getElementsByClassName("btn btn-primary")[0];
                }
                if (button) {
                    button.click();
                    console.log("...gun!");
                    await sleep(3000);
                }
            }
        }

        arrow = document.getElementsByClassName("fc-next-button fc-button fc-state-default fc-corner-left fc-corner-right")[0];
        if (arrow && week != Math.max(...WEEKS_ID_LIKE_TO_DO_STUFFS)) {
            arrow.click();
            console.log("next-week");
        }
    }

    console.log("reloading");
    location.reload();
}
