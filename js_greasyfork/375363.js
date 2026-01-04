// ==UserScript==
// @name         Bootleggers Rackets Script
// @namespace    https://greasyfork.org/en
// @version      0.0.13
// @description  try to take over the world!
// @author       You
// @include      https://www.bootleggers.us/rackets?s=1
// @require      https://code.jquery.com/jquery-3.2.1.js
// @update       https://greasyfork.org/scripts/375363-bootleggers-rackets-script/code/Bootleggers%20Rackets%20Script.user.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375363/Bootleggers%20Rackets%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/375363/Bootleggers%20Rackets%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var lockedIndex = document.querySelector("[data-status='locked']").dataset.id -1;
    var racketsCD = [];
    $(".running > .BL-timer-display").each(function(i) {
        if (i < lockedIndex) {
            var tempCD = this.innerText == "" ? "00:00:00" : this.innerText;
            racketsCD.push(tempCD.split(":")[1]*60+tempCD.split(":")[2]*1);
        }
    });
    var jailCD = $(".jail-indicator > .timer")[0].innerText == "" ? "00:00" : $(".jail-indicator > .timer")[0].innerText;
    jailCD = jailCD.split(":")[0]*60+jailCD.split(":")[1]*1;
    var reloadTime = Math.min.apply(null, racketsCD) >= jailCD ? Math.min.apply(null, racketsCD) : jailCD;
    var reloadTimer;
    var counter = 0;
    var jailTimer = setInterval(CheckJailStatus, 5000);
    var rank = $(".level > p")[0].innerText;
    var rankId;

    SelectAction();

    function CheckJailStatus() {
        jailCD = $(".jail-indicator > .timer")[0].innerText == "" ? "00:00" : $(".jail-indicator > .timer")[0].innerText;
        jailCD = jailCD.split(":")[0]*60+jailCD.split(":")[1]*1;
        if (jailCD > 0) {
            clearTimeout(reloadTimer);
            SelectAction();
        }
    }

    function SelectAction() {
        var $statuslocked = $(".status > .locked");
        if (rank < 5) {
            console.log("Not yet level 5, re-checking in 60 seconds.");
            clearTimeout(reloadTimer);
            reloadTimer = setTimeout(function() {
                SelectAction();
            }, 60000);
        } else {
            if (rank < ((lockedIndex-1)*10+10)) {
                if ($($statuslocked[lockedIndex-1]).css("display") == "flex") {
                    window.location.href = "https://www.bootleggers.us/rackets?s=1";
                } else {
                    RunScript();
                }
            }
        }

    };

    function RunScript() {
        if ((Math.min.apply(null, racketsCD) == 0) && (jailCD == 0)) {
            var i = racketsCD.indexOf(Math.min(...racketsCD));
            if ($($(".idle > .button")[i]).css("display") == "block") {
                $(".idle > .button")[i].click();
            } else if ($($(".collect > .button")[i]).css("display") == "block") {
                $(".collect > .button")[i].click();
                clearTimeout(reloadTimer);
                reloadTimer = setTimeout(function() {
                    counter += 1;
                    if (counter == 1) {
                        SelectAction();
                        counter = 0;
                    }
                }, 1000);
            }
        }

        $(".running > .BL-timer-display").each(function(i) {
            if (i < lockedIndex) {
                var tempCD = this.innerText == "" ? "00:00:00" : this.innerText;
                racketsCD[i] = tempCD.split(":")[1]*60+tempCD.split(":")[2]*1;
            }
        });
        jailCD = $(".jail-indicator > .timer")[0].innerText == "" ? "00:00" : $(".jail-indicator > .timer")[0].innerText;
        jailCD = jailCD.split(":")[0]*60+jailCD.split(":")[1]*1;
        var reloadTime = Math.min.apply(null, racketsCD) >= jailCD ? Math.min.apply(null, racketsCD) : jailCD;
        if (reloadTime > 0) {
            console.log("Re-attempting in: " + reloadTime);
            clearTimeout(reloadTimer);
            reloadTimer = setTimeout(function() {
                counter += 1;
                if (counter == 1) {
                    SelectAction();
                    counter = 0;
                }
            }, reloadTime * 1000);
        } else {
            clearTimeout(reloadTimer);
            reloadTimer = setTimeout(function() {
                counter += 1;
                if (counter == 1) {
                    SelectAction();
                    counter = 0;
                }
            }, 1000);
        }
    };
});