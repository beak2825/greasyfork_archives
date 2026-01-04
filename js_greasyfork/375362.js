// ==UserScript==
// @name         BL R9.75 Auto Burglary Script
// @namespace    Bootleggers R9.75
// @version      0.0.8
// @description  Steal cars, ship to nearest state and repair Duesenbergs
// @author       BD
// @include      https://www.bootleggers.us/autoburglary.php*
// @include      https://www.bootleggers.us/send.php*
// @include      https://www.bootleggers.us/mailbox.php*
// @update       https://greasyfork.org/scripts/375362-bootleggers-auto-theft-script/code/Bootleggers%20Auto%20Theft%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/375362/BL%20R975%20Auto%20Burglary%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/375362/BL%20R975%20Auto%20Burglary%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var noSteal = false;
    var commitID = 3;
    var sendOveride = "";
    var mission10partner = "";
    var sub25Crimes = $("font")[0] != null ? $("font")[0].innerText.includes("not good enough") : false;
    var recoveryTimer = $($("#timeBlock")[0]).find(".countdown")[0] ? $($("#timeBlock")[0]).find(".countdown")[0].innerText : 0;
    var gtaCD = FormatTime(recoveryTimer);
    var curState = $("#1")[0].innerText;
    var sendState = {"Illinois":"michigan", "New Jersey":"new-york", "Nevada":"california", "Michigan":"illinois", "California":"nevada", "New York":"new-jersey"}
    var successful = $("#carNum0")[0] == null ? false : $("#carNum0").closest("tr")[0].cells[4].innerText == $("#carNum0").closest("tr")[0].cells[5].innerText ? true : false;
    var mission = $(".featureBoxMission > span")[0] != null ? $(".featureBoxMission > span")[0].innerText.match(/\d+/g)[0]*1 : false;
    var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;
    var inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];

    function loadGTA() {
        window.location.href = "/autoburglary.php"
    }

    if (sub25Crimes) {
        setTimeout(loadGTA, 60000);
        console.log("Haven't completed 25 crimes yet, reloading GTA in: 60");
    } else if ((window.location.href.includes("/send.php")) && (mission == 10)) {
        if (document.referrer == "https://www.bootleggers.us/send.php?b=1") {
            window.location.href = "/autoburglary.php";
        } else {
            if (mission10partner == "") {
                alert("Please set targets name in the Auto Burglary script source");
            } else {
                document.querySelectorAll("[name='sendTo']")[0].value = mission10partner;
                $("textarea")[0].value = "Steal car";
                setTimeout(function() {
                    document.querySelectorAll("[value='Send!']")[0].click();
                }, 1000);
            }
        }
    } else if ((window.location.href.includes("/mailbox.php")) && (mission == 10) && (mission10partner != "")) {
        if (window.location.href.includes("/mailbox.php?b=1")) {
            if ($(".newmessage")[0]) {
                $(".newmessage").each(function() {
                    if ($(this).find("a")[0].innerText == mission10partner) {
                        window.location = "https://www.bootleggers.us/mailbox.php?page=1&delete=" + mission10partner;
                    }
                });
            } else {
                setTimeout(function() {
                    window.location.href = "/mailbox.php?b=1";
                }, 10000);
                console.log("Reloading mailbox in: 10");
            }
        } else if (window.location.href.includes("delete=" + mission10partner)) {
            window.location.href = "/autoburglary.php?b=1";
        }
    } else {
        if (inJail) {
            setTimeout(loadGTA, 5000);
            console.log("Reloading auto burglary in: 5");
        } else if (scriptCheck) {
            //Wait for captcha to be solved
        } else {
            RunScript();
        }

        function RunScript() {
            if (successful) {
                document.querySelectorAll("[name='carPlate[0]']")[0].click();
                if (sendOveride == "") {
                    document.querySelector("[data-state=" + sendState[curState] + "]").selected = true;
                } else {
                    document.querySelector("[data-state=" + sendOveride + "]").selected = true;
                }
                document.querySelectorAll("[name='shipcar']")[0].click();
            } else {
                if ((mission == 10) && (curState == "New York") && (mission10partner != "")) {
                    var burglar = $(".insideTables")[0] != null ? $(".insideTables")[0].textContent.includes("You are the burglar") : false;
                    var lookout = $(".insideTables")[0] != null ? $(".insideTables")[0].textContent.includes("You are the lookout") : false;
                    if (lookout) {
                        var lookoutTimer = $("#simple_countdown")[0] != null ? $("#simple_countdown")[0].innerText : false;
                        if (lookoutTimer) {
                            if ($("#simple_countdown")[0].previousSibling.textContent.includes("Currently looking out: ") && (document.referrer != "https://www.bootleggers.us/send.php")) {
                                window.location.href = "/send.php?b=1";
                            } else if ((document.referrer == "https://www.bootleggers.us/scripts") || (document.referrer == "https://www.bootleggers.us/send.php")) {
                                setTimeout(loadGTA, lookoutTimer * 1000);
                                console.log("Reloading auto burglary in: " + lookoutTimer);
                            }
                        } else if (document.querySelectorAll("[value='Start looking out!']")[0]) {
                            document.querySelectorAll("[value='Start looking out!']")[0].click();
                        }
                    } else if (burglar) {
                        if (window.location.href == "https://www.bootleggers.us/autoburglary.php?b=1") {
                            commitID = 5;
                            document.querySelectorAll("[type='radio']")[commitID].click();
                            if ((recoveryTimer == null) || (gtaCD == 0)) {
                                document.querySelectorAll("[value='Steal!']")[0].click();
                            }
                        } else {
                            window.location.href = "/mailbox.php?b=1";
                        }
                    }
                } else if ((mission == 15) && (curState == "California")) {
                    commitID = 5;
                    document.querySelectorAll("[type='radio']")[commitID].click();
                    if ((recoveryTimer == null) || (gtaCD == 0)) {
                        document.querySelectorAll("[value='Steal!']")[0].click();
                    }
                } else if (window.location.href == "https://www.bootleggers.us/autoburglary.php") {
                    recoveryTimer = $($("#timeBlock")[0]).find(".countdown")[0] ? $($("#timeBlock")[0]).find(".countdown")[0].innerText : 0;
                    gtaCD = FormatTime(recoveryTimer);
                    if ((recoveryTimer == null) || (gtaCD == 0)) {
                        if (!noSteal) {
                            var ranGen = Math.round(Math.random()*20);
                            var timerCount = ranGen;
                            $("<center><b><font id='waitMsg' color='red'>*Waiting a randomly generated: " + timerCount + " seconds<br>before committing the next burglary*</font></b></center>").insertBefore("div.insideTables");
                            var waitMsgTimer = setInterval(function() {
                                timerCount--;
                                if (timerCount == -1) {
                                    document.querySelectorAll("[type='radio']")[commitID].click();
                                    document.querySelectorAll("[value='Steal!']")[0].click();
                                    $("#waitMsg").closest("center").remove();
                                    clearInterval(waitMsgTimer);
                                } else {
                                    $("#waitMsg")[0].innerHTML = "*Waiting a randomly generated: " + timerCount + " seconds<br>before committing the next burglary*"
                                }
                            }, 1000);
                        }
                    } else if (gtaCD > 0) {
                        RepairDueseys();
                        setTimeout(RunScript, gtaCD * 1000);
                        console.log("Reloading auto burglary in: " + gtaCD);
                    }
                }
            }
        }
    }

    function RepairDueseys() {
        var curState = $("#1")[0].innerText;
        var carCount = $(".selCar")[0] != null ? $(".selCar").length : null;
        var repairCount = 0;
        var heatCount = 0;
        for (let i = 0; i <= carCount -1; i++) {
            var carName = $("#carNum" + i).closest("tr")[0].cells[2].innerText;
            var carDmg = $("#carNum" + i).closest("tr")[0].cells[3].innerText.match(/\d+/g)[0]*1 + "%";
            var carOrigin = $("#carNum" + i).closest("tr")[0].cells[4].innerText;
            var carLocation = $("#carNum" + i).closest("tr")[0].cells[5].innerText;
            if ((carName.includes("Duesenberg")) && (!carOrigin.includes(carLocation)) && (carLocation.includes(curState)) && (carDmg != "0%")) {
                repairCount++;
                $(".selCar")[i].click();
            }
        }
        if (repairCount > 0) {
            document.querySelectorAll("[value='Repair!']")[0].click();
        } else {
            for (let i = 0; i <= carCount -1; i++) {
                var carHeat = $("#carNum" + i).closest("tr")[0].cells[7].children[0].src.match(/\d+/g)[0]*1;
                if (carHeat > 0) {
                    heatCount++;
                    $(".selCar")[i].click();
                }
            }
            if (heatCount > 0) {
                document.querySelectorAll("[value='Change plate!']")[0].click();
            }
        }
    }

    function FormatTime(time) {
        return time == 0 ? 0 : time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
    }
});