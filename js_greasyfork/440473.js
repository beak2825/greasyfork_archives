// ==UserScript==
// @name         DukeHub advisor buttons
// @namespace    http://duke.edu/
// @version      0.2
// @description  Provide direct access to common functions without having to 'act as user' on DukeHub.
// @author       Tyler Bletsch (Tyler.Bletsch@duke.edu)
// @match        https://dukehub.duke.edu/psc/CSPRD01/EMPLOYEE/SA/s/WEBLIB_HCX_FS.H_VIEW_ADVISEES.FieldFormula.IScript_Main*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duke.edu
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440473/DukeHub%20advisor%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/440473/DukeHub%20advisor%20buttons.meta.js
// ==/UserScript==

// Functions to make buttons for:
// (you can put more functions here by noting the URL used within the "Act as user" mode and pasting it below)
const DESTINATIONS = [
    //['Advisor', 'https://dukehub.duke.edu/psp/CSPRD01/EMPLOYEE/SA/s/WEBLIB_HCX_AA_S.H_ADVISORS.FieldFormula.IScript_Main'],
    ['Courses', 'https://dukehub.duke.edu/psp/CSPRD01/EMPLOYEE/SA/s/WEBLIB_HCX_RE_S.H_COURSE_LIST.FieldFormula.IScript_Main'],
    ['Grades', 'https://dukehub.duke.edu/psp/CSPRD01/EMPLOYEE/SA/s/WEBLIB_HCX_RE_S.H_GRADES.FieldFormula.IScript_Main'],
    ['Progress','https://dukehub.duke.edu/psp/CSPRD01/EMPLOYEE/SA/s/WEBLIB_HCX_RE_S.H_DEGREE_PROGRESS.FieldFormula.IScript_Main'],
];

function init(){
    // find all the "act as user" buttons and inject stuff before them
    var tgts = document.querySelectorAll("a[href^='https://dukehub.duke.edu/psp/CSPRD01/EMPLOYEE/SA/s/WEBLIB_HCX_GN_S.H_DASHBOARD.FieldFormula.IScript_Main?emplid=']");

    // we have to check repeatedly til the meandering js queries finish building the page. the SPECIALHAX check lets us skip if the buttons are already placed.
    // why repeatedly check even after the buttons are placed? because if you change the filters, the table is re-rendered and the buttons go away
    // This way, they come back after no more than a second
    if (tgts.length && !document.querySelector(".SPECIALHAX")) {

        tgts.forEach(function(tgt) {
            var emplid = tgt.href.match('emplid=(\\d*)')[1]; // extract id number from act-as url
            DESTINATIONS.forEach(function(dest_tuple) { // inject each button
                var dest_name = dest_tuple[0];
                var dest_url = dest_tuple[1];

                // construct the button
                var btn = document.createElement("a");
                btn.innerHTML = dest_name;
                btn.href = dest_url + "?emplid=" + emplid + '&lookupType=A&institution=DUKEU';
                btn.className = "cx-MuiButtonBase-root cx-MuiButton-root cx-MuiButton-contained cx-MuiButton-containedPrimary SPECIALHAX";
                btn.style.marginRight = '5px';
                btn.style.backgroundColor = '#2222FF'
                btn.target = "_top";

                // inject the button
                tgt.before(btn);
            });
        });
    }
}
setInterval(init, 1000); // we check every second and inject buttons as needed, because the filter controls will destroy them when used
