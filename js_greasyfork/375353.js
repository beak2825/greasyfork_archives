// ==UserScript==
// @name         BL R9.75 Crimes Script
// @namespace    Bootleggers R9.75
// @version      0.1.3
// @description  Commit most profitable/required crime for Applying Pressure assignments
// @author       BD
// @include      https://www.bootleggers.us/crimes.php
// @update       https://greasyfork.org/scripts/375353-bootleggers-crimes-script/code/Bootleggers%20Crimes%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/375353/BL%20R975%20Crimes%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/375353/BL%20R975%20Crimes%20Script.meta.js
// ==/UserScript==

(function RunScript() {
    var yourName = localStorage.getItem("yourName") ? localStorage.getItem("yourName") : false;
    var scriptCheck = $(".g-recaptcha")[0];
    var crimesMaxed = $("#timer-cri")[0].innerText == "Maxed";
    var inJail = $("#timer-jai")[0].innerText == "Free" ? 0 : $("#timer-jai")[0].dataset.seconds;
    var evading = $('[name="evade"]')[0];
    var cityID = $('[name="toCity"]')[0] ? $("input:radio").length < 8 ? $('[name="toCity"]')[0].selectedIndex : GetCityID(1) : false;
    var crimeID = localStorage.getItem("crimeID") ? localStorage.getItem("crimeID") : $("input:radio").index($("input:radio").last());
    !localStorage.getItem(crimeID) ? localStorage.setItem("crimeID", $("input:radio").index($("input:radio").last())) : false;
    var crimeCD = $("#timer-cri")[0].innerText == "Ready" ? 0 : $("#timer-cri")[0].dataset.seconds;
    var arrested = $("div:contains('You failed the crime and were arrested by police')")[0];
    var reloadTimer;

        if (scriptCheck) {
            //HandleScriptCheck();
        } else if (crimesMaxed) {
            //Do nothing;
        } else if (evading) {
            evading.click();
        } else if (inJail) {
            CheckJailStatus();
        } else if (arrested) {
            window.location.href = "/crimes.php";
        } else if (cityID) {
            DoCrime();
        }

    function DoCrime() {
        if ((cityID) && (!crimeCD)) {
            CommitCrime(crimeID);
        } else if (crimeCD) {
            var countdownTimer = $(".countdown-timeleft")[0];
            if ($("td:contains('recovering')")[0]) {
                $("td:contains('recovering')").last()[0].innerHTML = $("td:contains('recovering')").last()[0].innerHTML.replace("You are currently recovering from your previous crime...", "<b><font color='red'>*CRIMES SCRIPT* Reloading crimes in:</font></b>");
            }
            reloadTimer = setInterval(function() {
                if (crimeCD == 0) {
                    countdownTimer.innerText = "00:00:00";
                    CommitCrime(crimeID);
                } else {
                    crimeCD--;
                    countdownTimer.innerText = FormatTime(crimeCD);
                }
            }, 1000);
        } else {
            window.location.href = "/crimes.php";
        }

        function CommitCrime(crime) {
            $("input:radio")[crime].click();
            $('[value="Commit!"]')[0].click();
        }
    }

    function CheckJailStatus() {
        inJail = $("#timer-jai")[0].innerText == "Free" ? 0 : $("#timer-jai")[0].dataset.seconds;
        $.get("/jail.php", function(data) {
            if (!data.includes("jailRow" + yourName)) {
                RunScript();
            } else {
                if ((arrested) && (!$("#jailCD")[0])) {
                    $("div:contains('You failed the crime and were arrested by police')").parent().append("<center id='jailStatus'><b><font color='red'>*CRIMES SCRIPT* Checking if you're in jail in: <span id='jailCD'>5</span></font></b></center>");
                } else if (inJail) {
                    $("<center id='jailStatus'><b><font color='red'>*CRIMES SCRIPT* Checking if you're still in jail in: <span id='jailCD'>5</span></font></b></center>").insertBefore($("center > .insideTables"));
                } else if (!inJail) {
                    window.location.href = "/crimes.php";
                }
                reloadTimer = setInterval(function() {
                    if ($("#jailCD")[0].innerText == "0") {
                        clearInterval(reloadTimer);
                        $("#jailStatus").remove();
                        CheckJailStatus();
                    } else {
                        $("#jailCD")[0].innerText = $("#jailCD")[0].innerText*1 - 1;
                    }
                }, 1000);
            }
        });
    }

    function GetCityID(i) {
        $.post("/crimes.php", "toCity=" + i, function(data) {
            if ((data.split('<input type=radio name="business_').length-1 < 8) && (data.split('<input type=radio name="business_').length-1 > 0)) {
                $('[name="toCity"]')[0].selectedIndex = i-1;
                $('[name="toCity"]').trigger("change");
            } else {
                GetCityID(i+1);
            }
        });
    }

    function FormatTime(time) {
        if ((time == 0) || (time == "Time has Expired!")) {
            return 0;
        } else if (time.toString().includes(":")) {
            return time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
        } else {
            var hrs = Math.floor(time/3600) >= 10 ? Math.floor(time/3600) : "0" + Math.floor(time/3600);
            var mins = (time - Math.floor(time/3600)*3600)/60 >= 10 ? Math.floor((time - Math.floor(time/3600)*3600)/60) : "0" + Math.floor((time - Math.floor(time/3600)*3600)/60);
            var secs = time - Math.floor(time/3600)*3600 - Math.floor((time - Math.floor(time/3600)*3600)/60)*60 >= 10 ? Math.floor(time - Math.floor(time/3600)*3600 - Math.floor((time - Math.floor(time/3600)*3600)/60)*60) : "0" + Math.floor(time - Math.floor(time/3600)*3600 - Math.floor((time - Math.floor(time/3600)*3600)/60)*60);
            return hrs + ":" + mins + ":" + secs;
        }
    }
})();