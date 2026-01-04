// ==UserScript==
// @name         BOA Timesheets
// @namespace    http://bricsys.com/
// @version      1.0
// @description  BOA Timesheets with keyboard shortcuts
// @author       You
// @match        https://boa.bricsys.com/boa/timesheets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bricsys.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451903/BOA%20Timesheets.user.js
// @updateURL https://update.greasyfork.org/scripts/451903/BOA%20Timesheets.meta.js
// ==/UserScript==

var formName = "eventDataForm";
var form = document.forms[formName];
var minuteIncrement = 30;

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.ctrlKey && evt.altKey) {
        console.log(evt.keyCode);
        if (evt.keyCode == 13) {
            document.onReturnKeyDown();
        } else if (evt.keyCode == 33) {
            document.onPageUpKeyDown();
        } else if (evt.keyCode == 34) {
            document.onPageDownKeyDown();
        } else if (evt.keyCode == 37) {
            document.onLeftKeyDown();
        } else if (evt.keyCode == 38) {
            document.onUpKeyDown();
        } else if (evt.keyCode == 39) {
            document.onRightKeyDown();
        } else if (evt.keyCode == 40) {
            document.onDownKeyDown();
        } else if (evt.keyCode == 72) {
            document.onHKeyDown();
        } else if (evt.keyCode == 73) {
            document.onIKeyDown();
        } else if (evt.keyCode == 78) {
            document.onNKeyDown();
        } else if (evt.keyCode == 79) {
            document.onOKeyDown();
        } else if (evt.keyCode == 82) {
            document.onRKeyDown();
        } else if (evt.keyCode == 83) {
            document.onSKeyDown();
        } else if (evt.keyCode == 86) {
            document.onVKeyDown();
        }
    }
}

document.setType = function(eventType, subject) {
    form.eventType.value = eventType;
    form.eventSubject.value = subject;
    form.eventDescription.value = "";
    form.eventSubject.select();
}

document.onRKeyDown = function() {
    document.setType(9, "R&D");
}

document.onSKeyDown = function() {
    document.setType(10, "Support");
}

document.onOKeyDown = function() {
    document.setType(3, "Other");
}

document.onVKeyDown = function() {
    document.setType(5, "Vacation");
}

document.onHKeyDown = function() {
    document.setType(6, "Holiday");
}

document.onIKeyDown = function() {
    document.setType(1, "Illness");
}

document.onPageUpKeyDown = function() {
    document.decrementDate();
}

document.onPageDownKeyDown = function() {
    document.incrementDate();
}

document.onReturnKeyDown = function() {
    document.getElementById("saveEventButton").click();
}

document.onNKeyDown = function() {
    document.getElementById("newEventButton").click();
}

document.onLeftKeyDown = function() {
    document.decrementTime(form.eventStartTime);
    document.decrementTime(form.eventEndTime);
}

document.onRightKeyDown = function() {
    document.incrementTime(form.eventStartTime);
    document.incrementTime(form.eventEndTime);
}

document.onUpKeyDown = function() {
    document.decrementTime(form.eventEndTime);
}

document.onDownKeyDown = function() {
    document.incrementTime(form.eventEndTime);
}

document.incrementDate = function() {
    var date = new Date(Date.parse(form.eventStartDate.value));
    date.setDate(date.getDate() + 1);

    var dateValue = document.getDateValue(date);
    form.eventStartDate.value = dateValue;
    form.eventEndDate.value = dateValue;
}

document.decrementDate = function() {
    var date = new Date(Date.parse(form.eventStartDate.value));
    date.setDate(date.getDate() - 1);

    var dateValue = document.getDateValue(date);
    form.eventStartDate.value = dateValue;
    form.eventEndDate.value = dateValue;
}

document.incrementTime = function(timeField) {
    var split = timeField.value.split(":")
    var hour = parseInt(split[0]);
    var minutes = parseInt(split[1]);

    minutes = minutes + minuteIncrement;

    timeField.value = document.getTimeValue(hour, minutes);
}

document.decrementTime = function(timeField) {
    var split = timeField.value.split(":")
    var hour = parseInt(split[0]);
    var minutes = parseInt(split[1]);

    minutes = minutes - minuteIncrement;

    timeField.value = document.getTimeValue(hour, minutes);
}

document.getDateValue = function(date) {
    var year = date.getFullYear();
    var month = document.pad(date.getMonth() + 1);
    var day = document.pad(date.getDate());
    return year + "-" + month + "-" + day;

}

document.pad = function(value) {
    if (value < 10) {
        value = "0" + value;
    }
    return value;
}

document.getTimeValue = function(hour, minutes) {
    if (minutes < 0) {
        minutes = minutes + 60;
        hour = hour - 1;
    }
    if (minutes >= 60) {
        minutes = minutes - 60;
        hour = hour + 1;
    }
    if (hour < 0) {
        hour = hour + 24;
    }
    if (hour >= 24) {
        hour = hour - 24;
    }

    hour = document.pad(hour);
    minutes = document.pad(minutes);

    return hour + ":" + minutes;
}

var onLoad = function() {
    'use strict';

    //    document.createRndButton();
}

onLoad();

