// ==UserScript==
// @name           Google calendar to MeisterTask
// @namespace      XcomeX
// @description    Add Google calendar iframe to MeisterTask dashboard
// @version        1.0
// @author         Copyleft (Ɔ) 2018, by XcomeX
// @license        GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @include        https://www.meistertask.com/app/*
// @downloadURL https://update.greasyfork.org/scripts/371188/Google%20calendar%20to%20MeisterTask.user.js
// @updateURL https://update.greasyfork.org/scripts/371188/Google%20calendar%20to%20MeisterTask.meta.js
// ==/UserScript==

var calendarHolderId = "GoogleCalendarHolder";
AddCalendar();

function AddCalendar () {
   // calendar parameters
    var p_width = 1200;
    var p_height = 335;
    var p_bgColor = "000000";

    var p_ctz = "ctz=UTC";
    var p_src = "src=YOUR_EMAIL%40GMAIL.COM&amp;color=%232952A3";


   // insert calendar on page
    var calendarColumnElement = '<div id="'+calendarHolderId+'" style="position:absolute;right:15px;bottom:8px;z-index:999;opacity:0.85;overflow:hidden;height:'+(p_height-24)+'px;"><iframe width="'+p_width+'" height="'+p_height+'" src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showDate=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height='+p_height+'&amp;wkst=2&amp;bgcolor=%23'+p_bgColor+'&amp;'+p_src+'&amp;'+p_ctz+'" style="border-width:0" frameborder="0" scrolling="no"></iframe></div>';

    if ( document.getElementById(calendarHolderId) == null ) {
        var bodyElement = document.getElementsByTagName("BODY")[0];
        bodyElement.innerHTML += calendarColumnElement;
    }
}

function RemoveCalendar () {
    var calendarHolder = document.getElementById(calendarHolderId);
    if ( calendarHolder ) {
        calendarHolder.remove();
    }
}


// remove calendar on NO-dashboard pages
document.body.addEventListener('DOMSubtreeModified', function () {
    if (window.location.href.indexOf("dashboard") !== -1) {
        AddCalendar();
    }
    else {
        RemoveCalendar();
    }
}, false);


// support functions
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}