// ==UserScript==
// @name         Trim Countdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes all unnessesary data from timeanddate.com countdown.
// @copyright    2018, Santeri Hetekivi (https://github.com/SanteriHetekivi)
// @license      Apache-2.0
// @author       Santeri Hetekivi
// @match        https://www.timeanddate.com/countdown/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369662/Trim%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/369662/Trim%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Query for minutes.
    var minutes_query = "#el_m1";
    // Query for seconds.
    var seconds_query = "#el_s1";
    // Query for minutes and seconds.
    var minutes_or_seconds_query = minutes_query+", "+seconds_query;
    // If minutes and seconds are found.
    if($(minutes_or_seconds_query).length === 2)
    {
        // Adding minutes and seconds to end of body.
        $(minutes_or_seconds_query).appendTo("body");
        // Remove all other elements from body.
        $("body > :not("+minutes_or_seconds_query+")").remove();
        // Removing all classes from minutes and seconds.
        $(minutes_or_seconds_query).removeClass();
        // Setting font-size for minutes and seconds to 70% of viewport.
        $(minutes_or_seconds_query).css("font-size", "70vw");
    }
})();