// ==UserScript==
// @name         BL R9.75 Accept OC Invite Script
// @namespace    Bootleggers R9.75
// @version      0.0.3
// @description  Accept OC invite and choose equipment
// @author       BD
// @include      https://www.bootleggers.us/orgcrime.php
// @update       https://greasyfork.org/scripts/376256-bl-r9-75-accept-oc-invite-script/code/BL%20R975%20Accept%20OC%20Invite%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/376256/BL%20R975%20Accept%20OC%20Invite%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/376256/BL%20R975%20Accept%20OC%20Invite%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var Leader = "RearNakedChoke";
    var pauseScript = true;
    Leader == "" ? alert("Please set leaders name in the Accept OC script source.") : pauseScript = false;
    var recovering = $("#recovering").find(".countdown-timeleft")[0] != null ? FormatTime($("#recovering").find(".countdown-timeleft")[0].innerText) : false;
    var isInvited = document.querySelectorAll("[name='go-accept']")[0] != null ? true : false;
    var hasAccepted = ((document.querySelectorAll("[value='Use!']")[0] != null) || (document.querySelectorAll("[value='Buy!']")[0] != null)) ? true : false;
    var needsReadying = document.querySelectorAll("[name='readyup']")[0] != null ? true : false;
    var inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];
    var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;

    function loadOC() {
        window.location.href = "/orgcrime.php";
    }

    if ((scriptCheck) || (inJail)) {
        setTimeout(loadOC, 5000);
        console.log("Reloading OC in: 5");
    } else if (pauseScript) {
        console.log("Accept OC invite script paused. Please specify OC leader in Accept OC invite script source.");
    } else if (recovering) {
        localStorage.setItem("OCTravelAllowed", true);
        setTimeout(loadOC, recovering*1000);
        console.log("Reloading OC in: " + recovering);
    } else if (isInvited) {
        for (let i = 0; i <= document.querySelectorAll("[onclick=\"chk(this, 'radio')\"]").length -1; i++) {
            if ($(document.querySelectorAll("[onclick=\"chk(this, 'radio')\"]")[i]).find("a")[0].innerText == Leader) {
                var inviterPos = i;
            }
        }
        var stateCode = $(document.querySelectorAll("[onclick=\"chk(this, 'radio')\"]")[inviterPos]).find("td")[4].innerText;
        var state = {"CA":"California", "NV":"Nevada", "MI":"Michigan", "IL":"Illinois", "NY":"New York", "NJ":"New Jersey"}
        var incorrectState = $("#1")[0].innerText != state[stateCode] ? state[stateCode] : false;
        if (incorrectState) {
            localStorage.setItem("travelOveride", incorrectState);
            if ($("#timer-tra")[0].dataset.seconds*1 <= 0) {
                setTimeout(loadOC, 5000);
                console.log("Reloading OC in: 5");
            } else {
                setTimeout(loadOC, ($("#timer-tra")[0].dataset.seconds + "000")*1 + 60000);
                console.log("Reloading OC in: " + $("#timer-tra")[0].dataset.seconds);
            }
        } else {
            localStorage.setItem("OCTravelAllowed", false);
            document.querySelectorAll("[name='invite']")[inviterPos].click();
            document.querySelectorAll("[name='go-accept']")[0].click();
        }
    } else if (hasAccepted) {
        if (document.querySelectorAll("[name='carid']")[0]) {
            for (let x in document.querySelectorAll("[name='carid']")[0].options) {
                if (document.querySelectorAll("[name='carid']")[0].options[x].innerText.includes("Duesenberg (0%)")) {
                    document.querySelectorAll("[name='carid']")[0].selectedIndex = x;
                    break;
                }
            }
            document.querySelectorAll("[value='Use!']")[0].click();
        } else if (document.querySelectorAll("[name='wtype']")[0]) {
            document.querySelectorAll("[name='wtype']")[0].selectedIndex = 2;
            document.querySelectorAll("[name='wamount']")[0].selectedIndex = 3;
            document.querySelectorAll("[value='Buy!']")[0].click();
        } else if (document.querySelectorAll("[name='etype']")[0]) {
            document.querySelectorAll("[name='etype']")[0].selectedIndex = 2;
            document.querySelectorAll("[value='Buy!']")[0].click();
        }
    } else if (needsReadying) {
        document.querySelectorAll("[name='readyup']")[0].click();
    } else {
        setTimeout(loadOC, 5000);
        console.log("Reloading OC in: 5");
    }

    function FormatTime(time) {
        return time == 0 ? 0 : time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
    }
});
