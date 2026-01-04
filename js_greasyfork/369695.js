
// ==UserScript==
// @name         TLR Input Optimizer
// @namespace    http://cody.codes
// @version      0.1
// @description  For the part-time employees of Seattle Central - take back your time spent using the TLR interface by using this optimized input script!
// @author       Cody Antonio Gagnon - codycodes
// @match        https://apps.seattlecolleges.edu/TLR/Employee/TimeEntry.aspx*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369695/TLR%20Input%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/369695/TLR%20Input%20Optimizer.meta.js
// ==/UserScript==

(function() {
    var startTime = "9:00 AM"
    var endTime = "5:00 PM"
    document.addEventListener("keypress", function(e) {
//        alert(e.which); // Used to determine which keycode corresponds to the key just pressed.
        if (e.which == 115) {
            TimePicker_FindPicker('ctl00_cphMainContent_tpStartTime').SelectTime(startTime);
        } else if (e.which == 101) {
            TimePicker_FindPicker('ctl00_cphMainContent_tpEndTime').SelectTime(endTime);
        } else if (e.which == 116) {
            var startTimeToParse = prompt('what start time for tlr?');
            startTime = moment(startTimeToParse, 'hh:mm a').format('h:mm A');
            var endTimeToParse = prompt('what end time for tlr?');
            endTime = moment(endTimeToParse, 'hh:mm a').format('h:mm A');
        }
    });
})();