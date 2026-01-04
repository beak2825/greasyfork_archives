// ==UserScript==
// @name         Time on Tab Title
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Display remaining travel time, hospital time, raceway time, and time left for chain on tab title.
// @author       HesperCroft [2924630]
// @match   https://www.torn.com/hospitalview.php
// @include   https://www.torn.com/loader.php?sid=racing*
// @include   https://www.torn.com/factions.php*
// @include https://www.torn.com/page.php?sid=travel*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481120/Time%20on%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/481120/Time%20on%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const title = "[Time on Tab Title]: ";

    const TEXT_TRAVEL = " Traveling | TORN";
    const TEXT_HOSPITAL = " Hospital | TORN";
    const TEXT_RACEWAY = " Racing | TORN";
    const TEXT_CHAIN = " Chain | TORN";


    const ID_HOSPITAL = 'theCounter';
    const ID_RACEWAY = 'infoSpot';

    const SPAN_CHAIN_TITLE = 'span.chain-box-title';
    const SPAN_CHAIN_LENGTH = 'p.bar-value___uxnah';
    const SPAN_CHAIN_TIME = "p.bar-timeleft___B9RGV";

    const URL_HOSPITAL = "https://www.torn.com/hospitalview.php";
    const URL_RACEWAY = "https://www.torn.com/loader.php?sid=racing";
    const URL_CHAIN = 'https://www.torn.com/factions.php';
    const URL_TRAVEL = "https://www.torn.com/page.php?sid=travel";


    const IF_PARSE_HOSPITAL_TIME = false;
    const IF_PARSE_RACEWAY_TIME = false;


    function parseTime(timeString) {
        // Extract hours, minutes, and seconds from the string
        let hoursMatch = timeString.match(/(\d+)\s*hour/);
        let minutesMatch = timeString.match(/(\d+)\s*minute/);
        let secondsMatch = timeString.match(/(\d+)\s*second/);

        // If hours, minutes, or seconds weren't found, default to 0
        let hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
        let minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
        let seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

        // Add any minutes over 60 to the hours and keep the remainder as minutes
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;

        // Pad the hours, minutes, and seconds with leading zeros if necessary
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        return hours + ':' + minutes + ':' + seconds;
    }


    function startObserving(spanId, tabText) {
        let span = document.getElementById(spanId);


        if (span) {

            let observer = new MutationObserver(function(mutations) {
                if (document.contains(span)) {
                    let text = null;
                    if (spanId === ID_RACEWAY) {
                        if (span.textContent.startsWith("Race")) {
                            text = span.textContent;
                        } else {
                            text = span.querySelector("span").textContent;
                            if (IF_PARSE_RACEWAY_TIME) {
                                text = parseTime(text);
                            }

                        }
                    } else {
                        text = span.textContent;
                    }

                    // If raceway or hospital check for if parse time is enabled
                    if (spanId === ID_HOSPITAL && IF_PARSE_HOSPITAL_TIME) {
                        text = parseTime(text);
                    } else {
                        text = span.textContent;
                    }
                    let newTitle = text + tabText;
                    document.title = newTitle;
                } else {
                    observer.disconnect();
                    console.log(title + 'Element with id "' + spanId + '" not found. Observer disconnected.');
                }
            });

            observer.observe(span, { characterData: true, childList: true, subtree: true });
        } else {
            window.setTimeout(() => startObserving(spanId, tabText), 500);
        }

    }

    function startObservingChain() {
        let span = document.querySelector(SPAN_CHAIN_TIME);
        if (span) {

            let observer = new MutationObserver(function(mutations) {

                if (document.contains(span)) {

                    let length = document.querySelector(SPAN_CHAIN_LENGTH).textContent;
                    let time = document.querySelector(SPAN_CHAIN_TIME).textContent;

                    document.title = time + " left " + length + " " + TEXT_CHAIN;

                } else {
                    observer.disconnect();
                    console.log(title + 'Element with class ' + SPAN_CHAIN_TITLE + ' not found or chain inactive. Observer disconnected.');
                }
            });

            observer.observe(span, { characterData: true, childList: true, subtree: true });
        } else {

            window.setTimeout(startObservingChain, 500);
        }


    }


    function startObservingTravel() {

        let span = document.querySelector("#travel-root > div.flightProgressSection___fhrD5 > div.progressText___qJFfY > span > span:nth-child(2) > time");
        if (span) {
            let observer = new MutationObserver(function(mutations) {
                if (document.contains(span)) {
                    let text = span.textContent;

                    document.title = text + TEXT_TRAVEL;

                } else {
                    observer.disconnect();
                    console.log(title + 'Element with id "travel-root" not found. Observer disconnected.');
                }
            });

            observer.observe(span, { characterData: true, childList: true, subtree: true });
        } else {
            window.setTimeout(startObservingTravel, 500);
        }

    }



    if (window.location.href === URL_TRAVEL) {
        startObservingTravel();

    } else if (window.location.href === URL_HOSPITAL){
        // For Hospital Times
        startObserving(ID_HOSPITAL, TEXT_HOSPITAL);

    } else if (window.location.href.startsWith(URL_RACEWAY)) {
        // For Raceway
        startObserving(ID_RACEWAY, TEXT_RACEWAY);

    } else if (window.location.href.startsWith(URL_CHAIN)) {
        // For Chain
        startObservingChain();
    }



})();