// ==UserScript==
// @name         YouTube Remaining Time
// @namespace    http://the6p4c.com/
// @version      1.3
// @description  Show the remaining time of a YouTube video inside the player.
// @author       The6P4C
// @match        *://www.youtube.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19120/YouTube%20Remaining%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/19120/YouTube%20Remaining%20Time.meta.js
// ==/UserScript==

// ***********************************************************************
// CHANGE TO true TO DISPLAY REMAINING TIME COMPENSATING FOR PLAYBACK RATE
// ***********************************************************************
var SHOW_REAL_TIME_REMAINING = false;

var TIME_KEYS_ORDER = ["days", "hours", "minutes", "seconds"];
var TIME_KEYS_ORDER_REV = [].concat(TIME_KEYS_ORDER).reverse();

function parseTime(timeString) {
    // reversed so seconds first
    var parts = timeString.split(":").reverse();
    var time = {};

    for (var i = 0; i < TIME_KEYS_ORDER_REV.length; ++i) {
        var key = TIME_KEYS_ORDER_REV[i];

        if (i < parts.length) {
            time[key] = parseInt(parts[i]);
        } else {
            time[key] = 0;
        }
    }

    return time;
}

function pad2(n) {
    if (n >= 10) {
        return n;
    } else {
        return "0" + n;
    }
}

function stringifyTime(time) {
    var timeString = "";
    var nonZeroEncountered = false;

    for (var i = 0; i < TIME_KEYS_ORDER.length; ++i) {
        var key = TIME_KEYS_ORDER[i];
        var currentValue = time[key];

        // Only start adding values from the first non zero
        // But... always show minutes, even if they're zero.
        if (currentValue !== 0 || nonZeroEncountered || key == "minutes") {
            // We don't want to pad the first value:
            // If there's hours, don't pad days
            // If there's minutes, don't pad hours
            // If there's seconds, don't pad minutes
            if (nonZeroEncountered) {
                currentValue = pad2(currentValue);
            }

            timeString += currentValue;

            if (key != "seconds") {
                timeString += ":";
            }

            nonZeroEncountered = true;
        }
    }

    return timeString;
}

function subtractTime(a, b) {
    var secondsDiff = a.seconds - b.seconds;
    var minutesDiff = a.minutes - b.minutes;
    var hoursDiff = a.hours - b.hours;
    var daysDiff = a.days - b.days;

    if (secondsDiff < 0) {
        minutesDiff -= 1;
        secondsDiff += 60;
    }

    if (minutesDiff < 0) {
        hoursDiff -= 1;
        minutesDiff += 60;
    }

    if (hoursDiff < 0) {
        daysDiff -= 1;
        hoursDiff += 24;
    }

    return {
        days: daysDiff,
        hours: hoursDiff,
        minutes: minutesDiff,
        seconds: secondsDiff
    };
}

function divideTime(time, divisor) {
    var timeSeconds = time.seconds + ((time.minutes + (time.hours + time.days * 24) * 60) * 60);
    var newTimeSeconds = Math.floor(timeSeconds / divisor);

    return {
        days: Math.floor(newTimeSeconds / (24 * 60 * 60)),
        hours: Math.floor(newTimeSeconds / (60 * 60)),
        minutes: Math.floor(newTimeSeconds / 60),
        seconds: newTimeSeconds % 60
    };
}

function tryGetPlaybackRate($timeDisplay) {
    // Try and find the playback speed from the settings UI
    var $ytdPlayer = $timeDisplay.parents(".html5-video-player");
    if ($ytdPlayer.length != 1) {
        // If we can't find the player, fall back to a "safe" alternative
        return 1;
    }

    $ytdPlayer = $ytdPlayer[0];

    // We can't be sure that this will work - if YouTube changes their player API somehow
    // we don't want our entire script to break. Again, fall back to a "safe" alternative.
    try {
        return $ytdPlayer.getPlaybackRate();
    } catch (e) {
       return 1;
    }
}

function onTimeChange() {
    var $this = $(this);

    // If this event was called in the context of the .ytp-time-duration event,
    // we need to set $timeCurrent not to $this but to the actual
    // .ytp-time-current element.
    var $timeCurrent = $this;
    if (!$this.hasClass("ytp-time-current")) {
        $timeCurrent = $this.parent().find(".ytp-time-current");
    }

    var $timeDisplay = $timeCurrent.parent();

    // For some reason a time will show on a live video, but I don't think it's very meaningful
    if ($timeDisplay.hasClass("ytp-live")) {
        return;
    }

    var $timeDuration = $timeDisplay.parent().find(".ytp-time-duration");

    if ($timeDisplay.attr("____remaining-added") != "____remaining-added") {
        var $timeRemainingWrapper = $("<div style='display: inline-block; width: 5px;'></div><span style='color: #ddd; text-shadow: 0 0 2px rgba(0,0,0,.5)'>(&minus;<span class='____time-remaining'></span>)</span>");
        $timeDuration.after($timeRemainingWrapper);

        $timeDisplay.attr("____remaining-added", "____remaining-added");
    }

    var $timeRemaining = $timeDisplay.find(".____time-remaining");

    var currentTime = parseTime($timeCurrent.text());
    var durationTime = parseTime($timeDuration.text());
    var remainingTime = subtractTime(durationTime, currentTime);

    if (SHOW_REAL_TIME_REMAINING) {
        var playbackRate = tryGetPlaybackRate($timeDisplay);
        var remainingRealTime = divideTime(remainingTime, playbackRate);

        var suffix = playbackRate == 1 ? "" : (" at x" + playbackRate);
        $timeRemaining.text(stringifyTime(remainingRealTime) + suffix);
    } else {
        $timeRemaining.text(stringifyTime(remainingTime));
    }
}

$(document).ready(function() {
    $("body").on("DOMSubtreeModified", ".ytp-time-current", onTimeChange);
    $("body").on("DOMSubtreeModified", ".ytp-time-duration", onTimeChange);
});