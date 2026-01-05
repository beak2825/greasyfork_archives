// ==UserScript==
// @name         Cascade Bicycle Club Add to Google Calendar
// @namespace    http://sunnyrodriguez.com
// @version      0.1
// @description  Adds a Google Calendar button to Cascade Bicycle free group rides.
// @author       splttingatms
// @match        https://www.cascade.org/node/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19767/Cascade%20Bicycle%20Club%20Add%20to%20Google%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/19767/Cascade%20Bicycle%20Club%20Add%20to%20Google%20Calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ride = parseRidePage();
    var calendarEvent = toCalendarEvent(ride);
    var button = createGoogleCalendarButton(calendarEvent);
    getFirstElementByClassName(document, "sharethis-wrapper").appendChild(button);

    function buildUrl(url, parameters){
        var keyValues = [];
        for(var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                var value = parameters[key];
                keyValues.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
            }
        }

        if (keyValues.length > 0){
            url = url + "?" + keyValues.join("&");
        }

        return url;
    }

    function parseTime(timeString) {
        if (timeString === '') return null;

        var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
        if (time === null) return null;

        var hours = parseInt(time[1],10);
        if (hours == 12 && !time[4]) {
            hours = 0;
        }
        else {
            hours += (hours < 12 && time[4])? 12 : 0;
        }
        var d = new Date();
        d.setHours(hours);
        d.setMinutes(parseInt(time[3],10) || 0);
        d.setSeconds(0, 0);
        return d;
    }

    function toYYYYMMDDHHMMSSFormat(date) {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return date.getFullYear() +
            pad2(date.getMonth() + 1) +
            pad2(date.getDate()) + "T" +
            pad2(date.getHours()) +
            pad2(date.getMinutes()) +
            pad2(date.getSeconds());
    }

    function getFirstElementByClassName(root, name) {
        var elements = root.getElementsByClassName(name);
        if (elements.length < 1)
            throw "an element with class name \"" + name + "\" does not exist";
        return elements[0];
    }

    function getFieldElement(fieldName) {
        try {
            var field = getFirstElementByClassName(document, fieldName);
            return getFirstElementByClassName(field, "field-items");
        } catch (err) {
            throw "a field with name \"" + fieldName + "\" does not exist";
        }
    }

    function getFieldElementOrDefault(fieldName) {
        try {
            return getFieldElement(fieldName);
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    function getFieldValue(fieldName) {
        return getFieldElement(fieldName).innerText.trim().replace(/\r\n|\r|\n/g, " ").trim();
    }

    function getFieldValueOrDefault(fieldName) {
        try {
            return getFieldValue(fieldName);
        } catch (err) {
            console.warn(err);
            return null;
        }
    }

    function toCalendarEvent(ride) {
        var description = "Ride URL: " + ride.url;
        if (ride.distanceText !== null) description += "\nDistance: " + ride.distanceText;
        if (ride.elevationGain !== null) description += "\nElevation Gain: " + ride.elevationGain;
        if (ride.paces !== null) description += "\nPace(s): " + ride.paces;
        if (ride.terrain !== null) description += "\nTerrain: " + ride.terrain;
        if (ride.regroup !== null) description += "\nRegroup: " + ride.regroup;
        if (ride.weatherCancels !== null) description += "\nWeather Cancels? " + ride.weatherCancels;
        if (ride.links !== null) description += "\nLinks: " + ride.links;
        description += "\nDescription:\n\n" + ride.description;

        return {
            title: "[" + ride.distanceValue + "mi] " + ride.title,
            dateRange: toYYYYMMDDHHMMSSFormat(ride.startDateTime) + "/" + toYYYYMMDDHHMMSSFormat(ride.endDateTime),
            location: ride.location,
            description: description
        };
    }

    function getRideDateTimeText() {
        try {
            return getFieldValue("field-name-field-global-datetime");
        } catch (err) {
            return getFirstElementByClassName(document, "date-display-single");
        }
    }

    function getRideLinksAsCommaSeparatedList() {
        try {
            var links = [];
            var anchors = getFieldElement("field-name-field-daily-links").getElementsByTagName("a");
            for (var i = 0; i < anchors.length; i++)
                links.push(anchors[i].href);
            return links.join(", ");
        } catch (err) {
            return null;
        }
    }

    function getRideStartDateTime() {
        var dateTime = getRideDateTimeText(); // format "Friday, May 20, 2016 - 10:00am"
        var date = new Date(dateTime.split("-")[0].trim());
        var time = parseTime(dateTime.split("-")[1].trim());
        var startDateTime = new Date(date.setHours(time.getHours()));
        return startDateTime;
    }

    function addHours(dateTime, n) {
        return new Date(new Date(dateTime).setHours(dateTime.getHours() + 3));
    }

    function parseRidePage() {
        try {
            var rideLink = window.location.href;
            var name = getFirstElementByClassName(document, "page-title").innerText.trim();
            var location = getFieldValue("field-name-field-daily-locations").replace("Directions", "").trim();
            var distanceText = getFieldValue("field-name-field-daily-distance");
            var distanceValue = Number(distanceText.split(" ")[0]); // text is a string with format "XX.XX miles"
            var rideDescription = getFieldValue("field-type-text-with-summary");
            var startDateTime = getRideStartDateTime();
            var endDateTime = addHours(startDateTime, 3); // assume rides take 3hrs

            // non-critical ride properties
            var contactInformation = getFieldValueOrDefault("field-name-field-global-contacts");
            var elevationGain = getFieldValueOrDefault("field-name-field-daily-elevation");
            var paces = getFieldValueOrDefault("field-name-field-daily-pace");
            var terrain = getFieldValueOrDefault("field-name-field-daily-terrain");
            var regroup = getFieldValueOrDefault("field-name-field-daily-regroup");
            var weatherCancels = getFieldValueOrDefault("field-name-field-daily-weather");
            var links = getRideLinksAsCommaSeparatedList();

            return {
                url: rideLink,
                title: name,
                startDateTime: startDateTime,
                endDateTime: endDateTime,
                location: location,
                contactInformation: contactInformation,
                distanceText: distanceText,
                distanceValue: distanceValue,
                elevationGain: elevationGain,
                paces: paces,
                terrain: terrain,
                regroup: regroup,
                weatherCancels: weatherCancels,
                description: rideDescription,
                links: links,
            };
        } catch (err) {
            throw "could not parse page: " + err;
        }
    }

    function toGoogleCalendarAddUrl(event) {
        return buildUrl("http://www.google.com/calendar/event", {
            action: "TEMPLATE",
            dates: calendarEvent.dateRange,
            text: calendarEvent.title,
            details: calendarEvent.description,
            location: calendarEvent.location,
            trp: false});
    }

    function createGoogleCalendarButton(event) {
        var image = document.createElement("img");
        image.src = "//www.google.com/calendar/images/ext/gc_button1.gif";

        var link = document.createElement("a");
        link.href = toGoogleCalendarAddUrl(calendarEvent);
        link.target = "_blank"; // open link in new window
        link.style = "text-decoration:none; border:none;";
        link.appendChild(image);

        var paragraph = document.createElement("p");
        paragraph.appendChild(link);

        return paragraph;
    }
})();