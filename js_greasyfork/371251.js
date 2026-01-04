// ==UserScript==
// @name         Wanikani Forums: Detailed Timestamps
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Changes the timestamps to display more information
// @author       Kumirei
// @include      *community.wanikani.com*
// @include      *community.bunpro.jp*
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371251/Wanikani%20Forums%3A%20Detailed%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/371251/Wanikani%20Forums%3A%20Detailed%20Timestamps.meta.js
// ==/UserScript==

(function($, wfs) {
    const AmPmTime = true;
    const shortFormat = true;
    const relativeHours = 24;
    const relativeDays = 30;

    wfs.wait('.relative-date',(e)=>{
        e.classList.remove('relative-date');
        e.classList.add('relative-date-custom');
        timeStamp(e);
    })
    setInterval(function(){$('.relative-date-custom').each(function(i, e) {timeStamp(e);});}, 60*1000);

    // Addd a zero to small numbers
    function tinyTime(number) {
        return number < 10 ? "0" + number : number;
    }

    // Switches from 24-hour time to 12-hour time
    function changeFormat(time) {
        var [hours, minutes] = time.split(":");
        hours = Number(hours);
        var Am = hours < 12;
        if (hours == 0) hours = 12;
        else if (hours > 12) hours -= 12;
        return String(hours) + ":" + minutes + (Am ? " AM" : " PM");
    }

    // Returns the time and it's tag as a string
    function format(hmsd, x, short) {
        switch (hmsd) {
            case "h":
                return x + (short ? "h" : " hour" + (x == 1 ? "" : "s"));
            case "m":
                return x + (short ? "m" : " minute" + (x == 1 ? "" : "s"));
            case "s":
                return short ? "< 1m" : "< 1 minute";
            case "d":
                if (short) return x == 0 ? "" : x + "d, ";
                if (x == 0) return "Today at ";
                else return x == 1 ? "Yesterday at " : x + " days, ";
        }
    }

    // Set the time stamps
    function timeStamp(e) {
        e = $(e);
        var forceShort = $(e[0].parentElement).hasClass('post-activity');
        var short = forceShort ? true : shortFormat;
        var postTime = new Date(Number(e.attr('data-time')));
        var timeOfDay = AmPmTime ? changeFormat(postTime.toTimeString().slice(0, 5)) : postTime.toTimeString().slice(0, 5);
        var currentTime = new Date();
        if (currentTime < postTime) currentTime = postTime;
        var timeDifference = currentTime - postTime;
        var text = "";
        // If it's not the same year
        if (currentTime.getFullYear() != postTime.getFullYear()) text = postTime.toLocaleString("en-us", {month: "short"}) + " " + postTime.getDate() + ", " + postTime.getFullYear();
        // If it is the same year
        else {
            // If it's not within the relative days cut off point
            if (timeDifference > relativeDays*1000*60*60*24 && postTime.toDateString() != new Date(currentTime - relativeDays*1000*60*60*24).toDateString()) text = postTime.toLocaleString("en-us", {month: "short"}) + " " + postTime.getDate() + (forceShort ? "" : " " + timeOfDay);
            // If it is, but not within the relative hours cut off point
            else if (timeDifference > relativeHours*1000*60*60) {
                var days = Math.floor(timeDifference/1000/60/60/24);
                if (postTime.toDateString() != new Date(currentTime - days*1000*60*60*24).toDateString()) days++;
                text = format("d", days, short) + timeOfDay;
            }
            // If it is
            else {
                var hours = Math.floor(timeDifference/1000/60/60);
                var minutes = Math.floor(timeDifference/1000/60%60);
                if (hours != 0) text = format("h", hours, short) + " " + format("m", minutes, short);                 // If it's over an hour ago
                else if (minutes != 0) text = format("m", minutes, short);                                     // If it's less than an hour ago
                else text = format("s", 1, short);                                                                // If it was only seconds ago
            }
        }
        e[0].innerText = text;
    }
})(window.jQuery, window.wfs);
