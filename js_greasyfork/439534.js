// ==UserScript==
// @name         RPP Counter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.5
// @description  Its the RPP countdown
// @author       Printf
// @match        https://www.wykop.pl/tag/nieruchomosci/*
// @match        https://www.wykop.pl/tag/znaleziska/nieruchomosci/*
// @match        https://www.wykop.pl/tag/wpisy/nieruchomosci/*
// @icon         https://www.google.com/s2/favicons?domain=wykop.pl
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/439534/RPP%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/439534/RPP%20Counter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    GM_addStyle(`#counterContainer { bottom:0; right:0; width:auto; height:auto; background-color:rgba(0, 0, 0, 0.8);}`);
    GM_addStyle(`#counterText {padding:6px; display:block; font-size:14px; font-weight:bolder;color:#eec630}`);

    const EVENT_HOUR_START = 12;
    const EVENT_HOUR_STOP = 24;

    const EVENTS_LIST = ["Jan  3, 2023",
                         "Feb  7, 2023",
                         "Mar  7, 2023",
                         "Apr  4, 2023",
                         "May  9, 2023",
                         "Jun  5, 2023",
                         "Jul  5, 2023",
                         "Aug 21, 2023",
                         "Sep  5, 2023",
                         "Oct  3, 2023",
                         "Nov  7, 2023",
                         "Dec  5, 2023",
                         "Jan 10, 2023"];


    /**
     * Return string with remaining time base on input value
     * @param {number} timeLeftMs - Time in miliseconds
     */
    function getCounterString(timeLeftMs) {
        var timeLeftSeconds = (timeLeftMs / 1000);

        var days = Math.floor(timeLeftSeconds / (60 * 60 * 24));
        timeLeftSeconds -= (days * (60 * 60 * 24));

        var hours = Math.floor(timeLeftSeconds / (60 * 60));
        timeLeftSeconds -= (hours * (60 * 60));

        var minutes = Math.floor(timeLeftSeconds / (60));
        timeLeftSeconds -= (minutes * 60);

        var seconds = Math.floor(timeLeftSeconds % 60);

        //Add leading zeros
        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");
        seconds = seconds.toString().padStart(2, "0");

        if(days > 1) {
            return `${days} dni ${hours}:${minutes}:${seconds}`
        } else if(days == 1) {
            return `${days} dzień ${hours}:${minutes}:${seconds}`
        } else {
            return `${hours}:${minutes}:${seconds}`
        }
    }

    /**
     * Show HTML on page
     * @param {string} html_string - String with HTML code
     */
    function showHTML(html_string) {
        if (document.querySelector(`#counterText`) === null) {
            document.querySelector('.commercial-header').innerHTML = `<div id='counterContainer'>
                                                                           <span id='counterText'>
                                                                             ${html_string}
                                                                           </span>
                                                                         </div>`;
        } else {
            document.querySelector("#counterText").innerHTML = `${html_string}`;
        }
    }


    setInterval(function(){

        var eventDate = new Date(Date.parse(EVENTS_LIST.find((event) => (Date.parse(event) + EVENT_HOUR_STOP*(60*60*1000) - Date.now()) > 0))).getTime();
        var timeLeft = eventDate + EVENT_HOUR_START*(60*60*1000) - Date.now();

        if(timeLeft > 0) {
            showHTML(`Do posiedzenia RPP pozostało: ${getCounterString(timeLeft)}`);
        } else {
            showHTML(`Posiedzenie trwa, ale on już jest wielki!`);
        }
    },1000);

})();