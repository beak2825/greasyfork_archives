// ==UserScript==
// @name         Google Calendar event count
// @namespace    sami@kankaristo.fi
// @version      0.4.3
// @description  Display event count in Google Calendar
// @author       sami@kankaristo.fi
// @match        https://calendar.google.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/376285/Google%20Calendar%20event%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/376285/Google%20Calendar%20event%20count.meta.js
// ==/UserScript==


Util.LOGGING_ID = "Google Calendar event count";


///
/// Create an event count element.
///
function CreateEventCountElement(parent) {
    var eventCountElement = document.createElement("div");
    eventCountElement.textContent = "0";
    eventCountElement.className = "event-count";
    
    parent.append(eventCountElement);
    
    var parentRect = parent.getBoundingClientRect();
    
    eventCountElement.style.cssText = (
        "color: #333333;"
        + "background-color: #eeeeee;"
        + "border-radius: 100px;"
        + "font-size: 0.9em;"
        + "margin-left: 4px;"
        + "padding: 4px;"
        + "position: fixed;"
        + "top: " + (68) + "px;"
        + "left: " + (parentRect.left + 118) + "px;"
    );
    
    return eventCountElement;
}


///
/// Create all event count elements.
///
function CreateEventCounts() {
    //Util.Log("CreateEventCounts()");
    
    var days = document.getElementsByClassName("A3o4Oe");
    
    if (days.length == 0) {
        Util.Log("Got here too early, try again later");
        setTimeout(
            CreateEventCounts,
            1000
        );
        
        return;
    }
    
    //Util.Log(days);
    //Util.Log(days.length);
    //Util.Log(days[0]);
    
    for (var i = 0; i < days.length; ++i) {
        var day = days[i];
        //Util.Log(day);
        
        var parent = day.parentElement;
        var eventCountElement = parent.querySelector(".event-count");
        if (eventCountElement == null) {
            eventCountElement = CreateEventCountElement(parent);
        }
        
        var eventCount = day.childNodes.length;
        if (parent == day) {
            eventCount -= 1;
        }
        
        //Util.Log(eventCount);
        eventCountElement.textContent = eventCount;
        eventCountElement.style.backgroundColor = (
            (eventCount == 0)
            ? "#eeeeee"
            : "#6666ff"
        );
        eventCountElement.style.color = (
            (eventCount == 0)
            ? "#333333"
            : "#ffffff"
        );
    }
    
    setTimeout(
        CreateEventCounts,
        1000
    );
}


(
    function () {
        "use strict";
        
        setTimeout(
            CreateEventCounts,
            1000
        );
    }
)();
