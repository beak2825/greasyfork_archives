// ==UserScript==
// @name         Kad Timekeeper
// @namespace    http://tampermonkey.net/
// @version      2024-05-18
// @description  Kad timekeeper
// @author       You
// @match        http*://www.neopets.com/games/kadoatery*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423920/Kad%20Timekeeper.user.js
// @updateURL https://update.greasyfork.org/scripts/423920/Kad%20Timekeeper.meta.js
// ==/UserScript==
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// if using greasemonkey, move the above line up one ^

/* TODO:
 - when kads remained from last refresh, do not count them in new refresh
 - enable manual rf inputs
 - partially missed refreshes should not count as refresh missed
 - Account for late refreshes (kads that refresh 30s or more past the expected time usually reset to the expected time, so the next expected refresh would be 28 min from the old expected time)
 - enable multiple mini clocks
*/
(function() {
    'use strict';
    var KADS_KEY = 'kk';
    var KADS_META_KEY = 'kmk';
    var MAX_KADS = 20;
    var MAX_MINI = 3;
    var MAIN_STR = "main";
    var MINI_STR = "mini";
    var kadsMap = localStorage.getItem(KADS_KEY) ? JSON.parse(localStorage.getItem(KADS_KEY)): {};
    var lastRf = localStorage.getItem(KADS_META_KEY) ? JSON.parse(localStorage.getItem(KADS_META_KEY)): {};
    var kadsMeta = {};
    var foods = [];
    var epochTime = new Date().getTime();

    function formatMinsOnly(t) {
        // Convert the epoch time to a Date object
        const date = new Date(t); // Convert seconds to milliseconds

        // Format the date in Pacific Time
        const options = {
            timeZone: 'America/Los_Angeles',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };
        const pacificTimeFormatter = new Intl.DateTimeFormat('en-US', options);
        const parts = pacificTimeFormatter.formatToParts(date);
        const partMap = {};
        parts.forEach(({ type, value }) => {
            partMap[type] = value;
        });

        // Format the date and time as a string
        const pacificTimeString = `${partMap.hour}:${partMap.minute} ${partMap.dayPeriod}`;

        return pacificTimeString;
    }

    function convertToMinutes(t) {
        return t / 1000 / 60;
    }

    function addMinutes(t, minutes) {
        return t + minutes * 60 * 1000;
    }

    console.log("Running kad helper");
    var kadContainers = $('.content').find('table');
    var newKads = {};
    var refreshCount = 0;
    var missedRefreshCount = 0;
    kadContainers.find("td").each(function(k, v) {
        var isFed = !/You should give it/.test(v.innerHTML)
        var itemName = $(v).find("strong").last().html();
        var kadName = $(v).find("strong").first().html();

        newKads[kadName] = isFed ? null : itemName;

        if (!isFed) {
            foods.push(itemName);
        }
    })

    var hasKadsNotInMiniPosition = false;
    var newKadsCount = 0;
    for (var d in newKads) {
        if (!kadsMap[d] || newKads[d]) {
            if (newKads[d] && (!kadsMap[d] || newKads[d] !== kadsMap[d])) {
                ++refreshCount;
                if (newKadsCount < MAX_KADS - MAX_MINI) {
                    hasKadsNotInMiniPosition = true;
                }
            } else if (newKads[d] === null) {
                ++missedRefreshCount;
            }
        }
        ++newKadsCount;
    }

    // TODO: Ignore foods that were there from the previous refresh
    var rfType;
    var canBeMain = epochTime - (lastRf.rfMain || 0) >= 27 * 60 * 1000; // should be 28 but leaving 1 minute buffer time (assuming you caught the refresh within a minute of the true refresh time)
    var canBeMini = epochTime - (lastRf.rfMain || 0) >= 6 * 60 * 1000 || epochTime - (lastRf.rfMini || 0) >= 6 * 60 * 1000; // 1 minute buffer from 7
    console.log(missedRefreshCount, canBeMain, canBeMini, hasKadsNotInMiniPosition);
    if (missedRefreshCount > 0) {
        if (refreshCount > 0 && canBeMain && hasKadsNotInMiniPosition) {
            rfType = MAIN_STR;
            console.log("kadtools > main");
        } else if (refreshCount > 0 && canBeMini && !hasKadsNotInMiniPosition) {
            rfType = "mini";
            console.log("kadtools > mini");
        } else {
            rfType = "missed";
        }

        localStorage.setItem(KADS_KEY, JSON.stringify(newKads));
    } else if (refreshCount > 0 && hasKadsNotInMiniPosition && canBeMain) {
        rfType = MAIN_STR;
        console.log("kadtools > main");
        localStorage.setItem(KADS_KEY, JSON.stringify(newKads));
    } else if (refreshCount > 0 && !hasKadsNotInMiniPosition && canBeMini) {
        rfType = MINI_STR;
        console.log("kadtools > mini");
        localStorage.setItem(KADS_KEY, JSON.stringify(newKads));
    }

    if (rfType && rfType !== "missed") {
        kadsMeta = {
            "foods": foods,
        }
        if (rfType === MAIN_STR) {
            kadsMeta.rfMain = epochTime;
        } else if (rfType === MINI_STR) {
            kadsMeta.rfMini = epochTime;
        }

        console.log("refreshed", kadsMeta);
        localStorage.setItem(KADS_META_KEY, JSON.stringify(kadsMeta));
    }

    var optionsBox = document.createElement('div');
    optionsBox.style = 'border: 1px solid #000';
    $(optionsBox)
        .append('<br><button id="kfl-button" style="display: block;">Kad Food List</button>')
        //.append('<br><button id="rf-button" style="display: block;">Manually input refresh times</button>' );

    kadContainers
    .after(optionsBox);

    function filterBlacklist(listString) {
        // Neoboards filters certain words. Work around by adding a . after the first letter
        var blacklist = ["weed", "cracker", "balls", "rape", "cum", "onion"];
        blacklist.forEach(function(d) {
            var re = new RegExp(d, 'gi');
            listString = listString.replace(re, d[0] + '.' + d.substring(1));
        })

        return listString;
    }

    $( '#kfl-button' ).on( 'click', function( e ) {
        e.preventDefault();
        e.stopPropagation();

        lastRf = localStorage.getItem(KADS_META_KEY) ? JSON.parse(localStorage.getItem(KADS_META_KEY)): {};
        var list = '';

        if (lastRf.foods) {

            $( 'td', kadContainers ).each( function( i ) {
                var item = lastRf.foods[i];
                var lineBreak = '\n';

                if ( 0 !== i && 0 === ( i + 1 ) % 4 ) {
                    lineBreak = '\n\n';
                }

                if (item) {
                    list += item + lineBreak;
                }
            });


            if (lastRf.rfMain) {
                list += "\nlast rf @ " + formatMinsOnly(lastRf.rfMain) + "\n\n";
                list += "new main @ " + formatMinsOnly(addMinutes(lastRf.rfMain, 28)) + "\n";
            }

            if (lastRf.rfMini) {
                list += "new mini @ " + formatMinsOnly(addMinutes(lastRf.rfMini, 28));
                }
        }

        if (!$('#kfl-output').length) {
            $( this ).after( '<textarea id="kfl-output" rows="26" cols="50">' + filterBlacklist(list) + '</textarea>' );
        }
    });

    var pendingTimes = '';
    //if (rfType === "missed") {
    //    pendingTimes = 'Missed Refresh';
    //} else {
        var nth;

        if (kadsMeta.rfMain || lastRf.rfMain) {
            var mainMins = convertToMinutes(kadsMeta.rfMain || lastRf.rfMain);
            var currentMins = convertToMinutes(epochTime);
            nth = Math.ceil((currentMins - mainMins) / 7);

            if (nth <= 4) {
                pendingTimes += "new main @ " + formatMinsOnly(addMinutes(kadsMeta.rfMain || lastRf.rfMain, 28)) + "\n";
            } else {
                pendingTimes += "main (" + (nth - 4) + ") pending @ " + formatMinsOnly(addMinutes(kadsMeta.rfMain || lastRf.rfMain, 7 * nth)) + "\n";
            }
        }

        if (kadsMeta.rfMini || lastRf.rfMini) {
            var miniMins = convertToMinutes(kadsMeta.rfMini || lastRf.rfMini);
            currentMins = convertToMinutes(epochTime);
            nth = Math.ceil((currentMins - miniMins) / 7);
            if (nth <= 4) {
                pendingTimes += "new mini @ " + formatMinsOnly(addMinutes(kadsMeta.rfMini || lastRf.rfMini, 28)) + "\n";
            } else {
                pendingTimes += "mini (" + nth + ") pending @ " + formatMinsOnly(addMinutes(kadsMeta.rfMini || lastRf.rfMini, 7 * nth)) + "\n";
            }
        }
    //}

    if (!$('#pending-output').length) {
        $( optionsBox ).append( '<textarea id="pending-output" rows="4" cols="50">' + pendingTimes + '</textarea>' );
    }
})();


/*
 Possible states:

 initial state
 - previous: none OR out of date for main and mini AND not all unfed
 initial time set for main and mini

 main refresh
 - current: > 3 unfed OR > 3 new names EXCEPT kads remaining from last refresh
 could do all unfed OR all new names, but 
  fails if a new kad replaces an old kad with the same name and gets fed before the user refreshes
 update time for main

 main refresh, no change
  - previous: ALL names equal current AND within time window for main
  - no time update

 main refresh, missed
  - previous: > 3 names different from current AND > 0 fed
  - time update, but labeled missed if all fed. otherwise, label partial miss?

 mini refresh (repeatable)
  - current: <=3 unfed OR <=3 new names
  - there is a small chance that checking in after a long period of time (like a day) the names *happen* to be similar to the previous logged state, and misregister as a mini
  - time update for mini

 mini refresh, no change
  - previous: ALL names equal current
  - no time update

 mini refresh, missed
  - previous: x <= 3 names different from current AND all fed
  - time update, but labeled missed
  if < x unfed, is a partial miss

 */