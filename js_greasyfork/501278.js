// ==UserScript==
// @name         Fix Countdown Timer for PD3 Mask Mania Event
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix the countdown timer to use Europe/Stockholm timeonze on paydaythegame.com
// @author       Hoppy
// @match        https://www.paydaythegame.com/payday3/updates/maskmania/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501278/Fix%20Countdown%20Timer%20for%20PD3%20Mask%20Mania%20Event.user.js
// @updateURL https://update.greasyfork.org/scripts/501278/Fix%20Countdown%20Timer%20for%20PD3%20Mask%20Mania%20Event.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Waiting for the page to load completely
    window.addEventListener('load', function() {
        // Adding a small delay to ensure all elements are fully loaded
        setTimeout(function() {
            // Waiting for luxon library to load
            function waitForLuxon(callback) {
                if (typeof luxon !== 'undefined') {
                    callback();
                } else {
                    setTimeout(function() {
                        waitForLuxon(callback);
                    }, 100);
                }
            }

            waitForLuxon(function() {
                var DateTimeLastMask = luxon.DateTime;

                const lastMaskStartDate = DateTimeLastMask.fromISO("2024-07-16T18:00:00", { zone: 'Europe/Stockholm' });
                const lastMaskEndDate = DateTimeLastMask.fromISO("2024-07-21T23:59:00", { zone: 'Europe/Stockholm' });

                var lastMaskCountdown;
                var lastMaskProgressCountdown;

                jQuery(document).ready(function() {
                    jQuery(".lastmaskgreenscreen").removeClass("hide");

                    jQuery(".lastmaskinfopopup, .lastmaskgreenscreen").hide();

                    jQuery(".lastmaskinfopopup i.fa-xmark").click(function(){
                        hideLastMaskInfoPopUp();
                    });

                    jQuery(".lastmaskgreenscreen i.fa-xmark").click(function(){
                        hideGreenScreen();
                    });

                    jQuery(".lastmaskgreenscreentoggle").click(function(){
                        showGreenScreen();
                    });

                    lastMaskCountdown = setInterval(function(){
                        doMaskTimers();
                    }, 30000);

                    doMaskTimers();

                    lastMaskProgressCountdown = setInterval(function(){
                        doMaskProgressBars();
                    }, 600000);

                    doMaskProgressBars();
                });

                function doMaskTimers(){
                    const now = DateTimeLastMask.now().setZone('Europe/Stockholm');
                    const remaining = lastMaskEndDate.diff(now);

                    var thisTimeLeft = remaining.shiftTo('days', 'hours', 'minutes').toObject();

                    if (thisTimeLeft.days >= 0) {
                        jQuery(".lastmaskeventstatusinnerdaycount").text(thisTimeLeft.days);
                    } else {
                        jQuery(".lastmaskeventstatusinnerday").remove();
                    }

                    if (thisTimeLeft.hours >= 0) {
                        jQuery(".lastmaskeventstatusinnerhourcount").text(thisTimeLeft.hours);
                    } else {
                        if (thisTimeLeft.days == 0){
                            jQuery(".lastmaskeventstatusinnerhour").remove();
                        }
                    }

                    if (thisTimeLeft.minutes >= 0) {
                        jQuery(".lastmaskeventstatusinnermincount").text(parseInt(thisTimeLeft.minutes));
                    } else {
                        if (thisTimeLeft.hours == 0){
                            jQuery(".lastmaskeventstatusinnermin").remove();
                        }
                    }

                    if (remaining.values.milliseconds < 0) {
                        clearInterval(lastMaskCountdown);

                        jQuery(".lastmaskeventstatusinnertitle").html("<p><strong>This Event has now concluded</strong></p>");
                    }
                }
            });
        }, 1000); // Adjust this delay as needed
    });

})();
