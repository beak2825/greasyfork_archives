// ==UserScript==
// @name         Meet Attendance
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  take attendance in a Google Meet (copies to the clipboard)
// @author       Rob Iverson
// @match        https://meet.google.com/*
// @match        https://docs.google.com/spreadsheets/*
// @grant GM_log
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/401905/Meet%20Attendance.user.js
// @updateURL https://update.greasyfork.org/scripts/401905/Meet%20Attendance.meta.js
// ==/UserScript==

// TODO figure out why GM_log didn't work

(function() {
    'use strict';

    var sheetUrl = "https://docs.google.com/spreadsheets/d/abcdefg123456/edit#gid=12345";
    var updateSheet = false;

    function openSheet() {
        if (updateSheet) {
            GM_openInTab(sheetUrl, { insert : true, setParent : true, active : true });
        }
    }

    function findAny(tag,clazz) {
        var divs = document.getElementsByTagName(tag);

        for (var i = 0 ; i < divs.length ; i++) {
            if ( divs[i].className == clazz) {
                console.log("found div");
                return divs[i];
            }
        }
        console.log("did not find div");
        return null;
    }

    function findDiv(clazz) {
        return findAny("DIV",clazz);
    }

    function getZoomyDiv() {
        // TODO another option: div class="ZHdB2e iy732"

        // div class="fe4pJf Pdo15c" jsname="KYYiw"
        // didn't zoom good return findDiv("fe4pJf Pdo15c");
        // didn't zoom good return findDiv("ZHdB2e iy732");
        // didn't zoom good return findDiv("Bx7THd PBWx0c Uy7Qke XN1AMe");
        // didn't zoom good return findAny("SPAN","HALYaf tmIkuc s2gQvd KKjvXb)");

        return findDiv("TnISae CnDs7d hPqowe crOkHf"); // works great I think (tested with 2 people)
    }

    function preCollect() {
        try {
            var thing = getZoomyDiv();
            thing.style.transform = "scale(.1)";
        }
        catch (err) {
            console.log("error in precollect");
            console.log(err);
        }
    }

    function postCollect() {
        try {
            var thing = getZoomyDiv();
            thing.style.transform = "scale(1)";
        }
        catch (err) {
            console.log("error in postCollect");
            console.log(err);
        }
    }

    function actualCollect() {
        console.log('console.log - collect called - finding attendance');

        // find the divs with names in them
        //    <div class="cS7aqe NkoVdd">FIRST LAST (You)</div>
        //    <div class="e19J0b CeoRYc" aria-label="Show more actions for Firstname Lastname" aria-expanded="false"></div>
        //    <div class="e19J0b CeoRYc" aria-label="Show more actions for AnotherFirst AnotherLast" aria-expanded="false"></div>
        var divs = document.getElementsByTagName('DIV');

        var names = [];

        var srch = "Show more actions for ";

        for (var i = 0; i < divs.length; i++) {
            var al = divs[i].getAttribute("aria-label");

            if ( al && al.search(srch) >= 0 ) {
                var name = al.substring(srch.length);
                if (! names.includes(name)) {
                    names.push(name);
                }
            }
        }

        var text = ""; // "students:\n";

        for (var j = 0 ; j < names.length ; j++) {
            text += names[j] + "\n";
        }

        GM_setClipboard(text, "text");
        GM_setValue("attendance_list", text);
        console.log("done collecting; trying to open sheet");
        openSheet();
    }

    function collect() {
        preCollect();
        setTimeout(function() { actualCollect(); postCollect(); }, 2000);
    }

    function storeAttendance() {
        var namesStr = GM_getValue("attendance_list","oops");
        console.log("yes i am attempting to store attendance:");
        console.log(namesStr);
        console.log("----------");
        var names = namesStr.split("\n");

//         var keyboardEvent = document.createEvent("KeyboardEvent");
//         var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

//         keyboardEvent[initMethod](
//             "keypress", // event type: keydown, keyup, keypress
//             true,      // bubbles
//             true,      // cancelable
//             unsafeWindow,    // view: should be window
//             true,      // ctrlKey
//             false,     // altKey
//             false,     // shiftKey
//             false,     // metaKey
//             39,        // keyCode: unsigned long - the virtual key code, else 0
//             0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
//         );
//         document.dispatchEvent(keyboardEvent);
//         console.log("yo, after dispatching keyboard event");
    }

    if ( document.URL.search("meet.google.com") >= 0 ) {
        // add a "collect" button
        console.log("in a meet tab - registering a menu command");
        GM_registerMenuCommand("Collect Attendance", collect, "Ctrl-Alt-A");
    }
    else if ( document.URL.search("docs.google.com/spreadsheets") >= 0 ) {
        console.log("in a spreadsheet tab - should i paste? or getData or whatever?");
        setTimeout(function() { storeAttendance(); }, 5000);
    }
})();
