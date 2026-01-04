// ==UserScript==
// @name         BL R9.75 Rackets Script
// @namespace    Bootleggers R9.75
// @version      0.0.3
// @description  Start and collect rackets
// @author       BD
// @include      https://www.bootleggers.us/rackets.php
// @update       https://greasyfork.org/scripts/31646-bl-r9-75-rackets-script/code/BL%20R975%20Rackets%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/31646/BL%20R975%20Rackets%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/31646/BL%20R975%20Rackets%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var lockedIndex = document.querySelector("[data-status='locked']") != null ? document.querySelector("[data-status='locked']").dataset.id -1 : false;
    var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;
    var inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];
    var racketsCD = [];
    $(".running").each(function(i) {
        if ($(".running")[i].innerText.match(/[0-9]/)) {
            racketsCD.push(FormatTime(this.innerText));
        }
    });
    var reloadTime = Math.min.apply(null, racketsCD) == "Infinity" ? 0 : Math.min.apply(null, racketsCD);
    var rank = $("#8 > a")[0].innerText;
    var runningCount = 0;

    function loadRackets() {
        window.location.href = "/rackets.php";
    }

    if ((scriptCheck) || (inJail)) {
        setTimeout(loadRackets, 3000);
        console.log("Reloading rackets in: 3");
    } else if (rank == "Scum") {
        //Do nothing
    } else {
        for (var i = 0; i <= $(".crime").length -1; i++) {
            if ($(".idle")[i].clientHeight) {
                $(".idle > input")[i].click();
            } else if ($(".collectable")[i].clientHeight) {
                $(".collectable > input")[i].click();
            } else if ($(".running")[i].clientHeight) {
                runningCount++;
            }
        }
        if ((runningCount == lockedIndex) || (runningCount == $(".crime").length)) {
            setTimeout(loadRackets, reloadTime * 1000);
            console.log("Reloading rackets in: " + reloadTime);
        } else {
            runningCount = 0;
            setTimeout(loadRackets, 3000);
            console.log("Reloading rackets in: 3");
        }
    }

    function FormatTime(time) {
        return time == 0 ? 0 : time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
    }
});