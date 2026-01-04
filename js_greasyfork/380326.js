// ==UserScript==
// @name         RWTH Online Colorcoded Calendar
// @namespace    https://github.com/Seneral/
// @version      2.1
// @description  System to color-code calendar events by wildcard, hide useless header/footer and mark special events
// @author       Seneral
// @icon         https://www.seneral.dev/img/Icon/favicon.ico
// @match        https://online.rwth-aachen.de/RWTHonline/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/380326/RWTH%20Online%20Colorcoded%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/380326/RWTH%20Online%20Colorcoded%20Calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var showOnlyCalendar = true;
    var markUnmodifiedEvents = true;

    // "col" : color applied to matching events
    // "opc" : opacity of WHOLE event
    // "in" : included in description
    // "ex" : excluded from description
    // "name" : included in name
    // "days" : List of days included - "1,2,4,5" for all but Wednesday, none for all days
    // "border" : Border size in pixel, default 0
    // All colors from the settings / css are valid - red, blue, green, yellow, aquamarine, etc.

    var colorMap = [
        // Einsicht and Klausuren (with borders since they are still special events)
        { "opc": 1.0, "col" : "yellow",          "in" : "Einsicht", "border" : "3" },
        { "opc": 1.0, "col" : "yellow",          "in" : "einsicht", "border" : "3" },
        { "opc": 1.0, "col" : "bold-red",        "in" : "Klausur",  "border" : "3" },
        { "opc": 1.0, "col" : "bold-red",        "in" : "Prüfung",  "border" : "3" },

        /* -- OVERRIDE -- */

        // Einzelne Events die vom Default abweichen - e.g:
      //{ "opc": 1.0, "col" : "red",        "in" : "Abhaltung; Übung;",     "name" : "Formale Systeme, Automaten, Prozesse", "days" : "4" },    // FoSAP Lecture Thursday
      //{ "opc": 1.0, "col" : "red",        "in" : "Abhaltung; Vorlesung;", "name" : "Formale Systeme, Automaten, Prozesse", "days" : "1" },    // FoSAP Lecture Monday
      //{ "opc": 1.0, "col" : "orange",     "in" : "Abhaltung; Vorlesung;", "name" : "Formale Systeme, Automaten, Prozesse", "days" : "3" },    // FoSAP Global Wednesday

        /* -- DEFAULT -- */

        { "opc": 1.0, "col" : "olive",      "in" : "Abhaltung; Proseminar" },
        { "opc": 1.0, "col" : "red",        "in" : "Abhaltung; Vorlesung" },
        { "opc": 1.0, "col" : "orange",     "in" : "Abhaltung; Übung"     },
        { "opc": 0.8, "col" : "wheat",      "in" : "Abhaltung; Tutorium"  },
        { "opc": 1.0, "col" : "blue",       "in" : "Abhaltung; Praktikum" },
        { "opc": 0.8, "col" : "yellow",     "in" : "Abhaltung; Sprachkurs" },
    ]

    function handleEventColor(event){
        var weekContainer = event.parentNode.parentNode.parentNode.parentNode;
        var dayContainer = event.parentNode.parentNode.parentNode;
        var dayOfWeek = Array.prototype.slice.call(weekContainer.children).indexOf(dayContainer); // 1 Mon

        var colorBar = event.children[0];
        var colorBox = event.children[1];
        var name = event.children[1].children[0].children[2].innerText;
        var desc = event.children[1].children[1].children[0].innerText;

        var color = undefined;
        var opacity = 1;
        var border = 0;
        for (var i = 0; i < colorMap.length; i++)
        {
            var rules = colorMap[i];
            var inc  = !rules.in   ||  desc.includes (rules.in);
            var exc  = !rules.ex   || !desc.includes (rules.ex);
            var nm   = !rules.name ||  name.includes (rules.name);
            var day  = !rules.days ||  rules.days.includes (dayOfWeek.toString());
            if (inc && exc && nm && day)
            {
                color = rules.col;
                opacity = rules.opc;
                if (rules.border) border = rules.border;
                break;
            }
        }

        if (color)
        {
            event.style.opacity = opacity;
            colorBox.className = colorBox.className.replace(/\b(cocal\-skin\-)([a-zA-Z-]+)\b/g, "") + "cocal-skin-" + color;

            if (border > 0)
            {
                event.style.border = border + "px solid black";
                event.style.boxSizing = "border-box";
                event.style.MozBoxSizing = "border-box";
            }
        }
        else if (markUnmodifiedEvents)
        {
            event.style.border = "3px solid black";
            event.style.boxSizing = "border-box";
            event.style.MozBoxSizing = "border-box";
        }
    }

    function updateCalendar(){
        if(!window.location.href.includes ("wbKalender.wbPerson")) return;

        if (showOnlyCalendar)
        { // Only execute when not yet successful once
            var header = document.getElementsByTagName("ca-header");
            var footer = document.getElementsByTagName("ca-footer");
            if (header.length != 0 && footer.length != 0)
            {
                header[0].style.display = "none";
                footer[0].style.display = "none";
            }
        }

        var calendarFrame = document.getElementById("idIframe");
        if (!calendarFrame) return;
        var events = calendarFrame.contentWindow.document.body.querySelectorAll("[id^='idTermin_']");
        for(var i=0 ; i < events.length ; i++)
        {
            handleEventColor(events[i]);
        }
    }

    // Execute every seconds in case new content has been added to the page
    setInterval(updateCalendar, 200);
})();

