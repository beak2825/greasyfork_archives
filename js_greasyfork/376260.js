// ==UserScript==
// @name         BL R9.75 Jail Script
// @namespace    Bootleggers R9.75
// @version      0.0.3
// @description  Bust anyone (prioritising designated targets)/focus bust individual target. Avoids breaking users with same IP
// @author       BD
// @include      https://www.bootleggers.us/jail.php*
// @update       https://greasyfork.org/scripts/376260-bl-r9-75-jail-script/code/BL%20R975%20Jail%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/376260/BL%20R975%20Jail%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/376260/BL%20R975%20Jail%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var delay = 0;
    var target = "";
    var targetPriorities = ["BowDown", "RockSolid", "Flayne", "RearNakedChoke"];
    var sameIpUsers = {"RockSolid":"Funnels", "Funnels":"RockSolid"};
    var yourName = localStorage.getItem("yourName") != null ? localStorage.getItem("yourName") : false;
    var bust = localStorage.getItem("busting") == null ? false : localStorage.getItem("busting") == "true" ? true : false;
    var bustText = bust ? "Stop Busting!" : "Start Busting!";
    var inJail = $("#jailRow" + yourName)[0];
    var noBreakable = $(".bustLink > a")[0] == null ? true : false;
    var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;
    var evading = $("#evade")[0] != null ? true : false;

    $("<center><input id='bustbtn' type='button' value='" + bustText + "'></input></center><br>").insertBefore($(".insideTables").children()[0]);
    $("#bustbtn").click(function() {
        ToggleBusting();
    });

    function loadJail() {
        window.location.href = "/jail.php";
    }

    if (scriptCheck) {
        setTimeout(loadJail, 10000);
        console.log("Reloading in: 10");
    } else if (bust) {
        setTimeout(RunScript, delay * 1000)
    }

    function RunScript() {
        if (inJail) {
            if ((target == "BrunoFerilli") || (target == "AngeloToffoli") || (target == "FrancoChiatti") || (target == "SergioBraschi") || (target == "RobertMoretti")) {
                setTimeout(loadJail, $("#countdown." + yourName)[0].innerText *1000);
                console.log("Reloading jail in: " + $("#countdown." + yourName)[0].innerText);
            } else {
                setTimeout(loadJail, delay * 1000);
            }
        } else if (evading) {
            $("#evade")[0].click();
        } else if (noBreakable) {
            setTimeout(loadJail, delay * 1000)
        } else {
            if (target != "") {
                if ((target == "BrunoFerilli") || (target == "AngeloToffoli") || (target == "FrancoChiatti") || (target == "SergioBraschi") || (target == "RobertMoretti")) {
                    if (document.querySelectorAll("[style='color: #F00']")[0] == null) {
                        window.location.href = "https://www.bootleggers.us/jail.php?bust=" + target;
                    } else {
                        setTimeout(function() {
                            window.location.href = "https://www.bootleggers.us/scripts";
                        }, 5000);
                    }
                } else {
                    $("#jailRow" + target + " > td > a")[0] != null ? $("#jailRow" + target + " > td > a")[0].click() : loadJail();
                }
            } else {
                for (var x in targetPriorities) {
                    if ((targetPriorities[x] != sameIpUsers[yourName]) && (targetPriorities[x] != yourName) && ($("#jailRow" + targetPriorities[x] + " > td > a")[0] != null)) {
                        console.log("Breaking " + targetPriorities[x]);
                        $("#jailRow" + targetPriorities[x] + " > td > a")[0].click();
                        break;
                    } else {
                        //loadJail();
                        if ($(".inmateInfo").find("a")[0].innerText != sameIpUsers[yourName]) {
                            console.log("Breaking " + $(".inmateInfo").find("a")[0].innerText);
                            $(".bustLink > a")[0].click();
                        } else if ($(".bustLink > a")[1]) {
                            console.log("Breaking " + $(".inmateInfo").find("a")[1].innerText);
                            $(".bustLink > a")[1].click();
                        } else {
                            setTimeout(loadJail, delay * 1000);
                        }
                    }
                }
            }
        }
    }

    function ToggleBusting() {
        if (!bust) {
            bust = true;
            localStorage.setItem("busting", true);
            setTimeout(RunScript, delay * 1000)
            $("#bustbtn")[0].value = "Stop Busting!";
        } else if (bust) {
            bust = false;
            localStorage.setItem("busting", false);
            $("#bustbtn")[0].value = "Start Busting!";
        }
    }
});
