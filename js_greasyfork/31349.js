// ==UserScript==
// @name         BL R9.75 Lead OC Script
// @namespace    Bootleggers R9.75
// @version      0.0.5
// @description  Rob the state bank. Ability to designate members and cut percentages
// @author       BD
// @include      https://www.bootleggers.us/orgcrime.php
// @update       https://greasyfork.org/scripts/31349-bl-r9-75-lead-oc-script/code/BL%20R975%20Lead%20OC%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/31349/BL%20R975%20Lead%20OC%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/31349/BL%20R975%20Lead%20OC%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var Leadpercent = 0;
    var TP = "";
    var TPpercent = 10;
    var WM = "";
    var WMpercent = 65;
    var EE = "";
    var EEpercent = 25;
    var pauseScript = true;
    ((TP == "") || (WM == "") || (EE == "")) ? alert("Please specify TP, WM and EE in Lead OC script source.") : pauseScript = false;
    var recovering = $("#recovering").find(".countdown-timeleft")[0] != null ? FormatTime($("#recovering").find(".countdown-timeleft")[0].innerText) : false;
    var needsStarting = document.querySelectorAll("[value='bank']")[0] != null ? true : false;
    var needsInviting = document.querySelectorAll("[value='Finalize percents!']")[0] != null ? true : false;
    var allReady = document.querySelectorAll("[value='Commit the crime!']")[0] != null ? true : false;
    var inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];
    var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;

    function loadOC() {
        window.location.href = "/orgcrime.php";
    }

    if ((scriptCheck) || (inJail)) {
        setTimeout(loadOC, 5000);
        console.log("Reloading OC in: 5");
    } else if (pauseScript) {
        console.log("Lead OC script paused. Please specify TP, WM and EE in Lead OC script source.");
    } else if (recovering) {
        localStorage.setItem("OCTravelAllowed", true);
        setTimeout(loadOC, recovering*1000);
        console.log("Reloading OC in: " + recovering);
    } else if (needsStarting) {
        localStorage.setItem("OCTravelAllowed", false);
        document.querySelectorAll("[value='bank']")[0].click();
        $("#car1 > img")[0].click();
        document.querySelectorAll("[value='Do it!']")[0].click();
    } else if (needsInviting) {
        document.querySelectorAll("[name='percent[1]']")[0].value = Leadpercent;
        document.querySelectorAll("[name='iusername[2]']")[0].value = TP;
        document.querySelectorAll("[name='percent[2]']")[0].value = TPpercent;
        document.querySelectorAll("[name='iusername[3]']")[0].value = WM;
        document.querySelectorAll("[name='iposition[3]']")[0].selectedIndex = 2;
        document.querySelectorAll("[name='percent[3]']")[0].value = WMpercent;
        document.querySelectorAll("[name='iusername[4]']")[0].value = EE;
        document.querySelectorAll("[name='iposition[4]']")[0].selectedIndex = 1;
        document.querySelectorAll("[name='percent[4]']")[0].value = EEpercent;
        document.querySelectorAll("[value='Finalize percents!']")[0].click();
    } else {
        if (allReady) {
            document.querySelectorAll("[value='Commit the crime!']")[0].click();
        } else {
            setTimeout(function() {
                loadOC();
            }, 5000);
        }
    }

    function FormatTime(time) {
        return time == 0 ? 0 : time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
    }
});