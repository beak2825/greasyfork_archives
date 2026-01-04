// ==UserScript==
// @name         BL R9.75 Bootlegging Script
// @namespace    Bootleggers R9.75
// @version      0.0.11
// @description  Buy booze, fly to most profitable/designated country, sell booze.
// @author       BD
// @include      https://www.bootleggers.us/trainstation.php*
// @include      https://www.bootleggers.us/bootleg.php*
// @include      https://www.bootleggers.us/missions.php*
// @update       https://greasyfork.org/scripts/375415-bootleggers-bootlegging-script/code/Bootleggers%20Bootlegging%20Script.user.js
// @downloadURL https://update.greasyfork.org/scripts/375415/BL%20R975%20Bootlegging%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/375415/BL%20R975%20Bootlegging%20Script.meta.js
// ==/UserScript==

/*Michigan > Nevada 424
Nevada > California > 71
California > New Jersey 217
New Jersey > Illinois 456
Illinois > New York 161
New York > Michigan > 207*/

$(document).ready(function() {
    var KeepBoozeForMission = false;
    var doBoozeRun = false;
    var curState = $("#1")[0].innerText;
    var boozePairs = {"Michigan Illinois":"Cognac", "Michigan California":"Gin", "Michigan New York":"Cognac", "Michigan Nevada":"Cognac", "Michigan New Jersey":"Vodka", "Illinois Michigan":"Wine", "Illinois California":"Gin", "Illinois New York":"Rum", "Illinois Nevada":"Rum", "Illinois New Jersey":"Rum", "California Michigan":"Tequila", "California Illinois":"Cognac", "California New York":"Cognac", "California Nevada":"Cognac", "California New Jersey":"Tequila", "New York Michigan":"Vodka", "New York Illinois":"Cognac", "New York California":"Vodka", "New York Nevada":"Cognac", "New York New Jersey":"Vodka", "Nevada Michigan":"Tequila", "Nevada Illinois":"Tequila", "Nevada California":"Gin", "Nevada New York":"Rum", "Nevada New Jersey":"Tequila", "New Jersey Michigan":"Wine", "New Jersey Illinois":"Cognac", "New Jersey California":"Cognac", "New Jersey New York":"Cognac", "New Jersey Nevada":"Cognac"};
    var destinationPairs = {"Michigan":"Nevada", "Nevada":"California", "New Jersey":"Illinois", "Illinois":"New York", "California":"New Jersey", "New York":"Michigan"};
    var mission = $(".featureBoxMission > span")[0] != null ? $(".featureBoxMission > span")[0].innerText.match(/\d+/g)[0]*1 : false;
    if (mission == 9) {
        if (curState == "Illinois") {
            localStorage.setItem("travelOveride", "California");
            boozePairs["Illinois California"] = "Cognac";
        } else {
            localStorage.setItem("travelOveride", "Illinois");
        }
    } else if (mission == 14) {
        boozePairs["New York Nevada"] = "Whisky";
        if (curState == "New York") {
            localStorage.setItem("travelOveride", "Nevada");
        } else if (curState == "Nevada") {
            localStorage.setItem("travelOveride", "New York");
        }
    } else if (mission == 17) {
        var dest = localStorage.getItem("mission17dest") == null ? localStorage.setItem("mission17dest", "California") : localStorage.getItem("mission17dest");
        dest = localStorage.getItem("mission17dest") == "California" ? "California" : "Nevada";
        destinationPairs["Michigan"] = dest;
        boozePairs["Michigan " + dest] = "Wine";
        destinationPairs[dest] = "Michigan";
        if ((curState == "Michigan") ||(curState == "Nevada")) {
            localStorage.setItem("travelOveride", destinationPairs[curState]);
        }
    }
    var travelOveride = localStorage.getItem("travelOveride") == null ? destinationPairs[curState] : localStorage.getItem("travelOveride");
    var nextState = curState == travelOveride ? destinationPairs[curState] : travelOveride;
    var travelAllowed = localStorage.getItem("travelAllowed") == null ? localStorage.setItem("travelAllowed", false) : localStorage.getItem("travelAllowed");
    travelAllowed = localStorage.getItem("travelAllowed") == "true" ? true : false;
    var OCTravelAllowed = localStorage.getItem("OCTravelAllowed") == null ? localStorage.setItem("OCTravelAllowed", true) : localStorage.getItem("OCTravelAllowed");
    OCTravelAllowed = localStorage.getItem("OCTravelAllowed") == "true" ? true : false;
    $("<select id='travelOveride' style='position:absolute; left:10px; top:10px; width:100px'><option value='California'>California</option><option value='Nevada'>Nevada</option><option value='Illinois'>Illinois</option><option value='Michigan'>Michigan</option><option value='New York'>New York</option><option value='New Jersey'>New Jersey</option></select><input type='checkbox' id='travelAllowed' style='position:absolute; left:110px; top:10px;'><h3 id='nextState' style='position:absolute; left:10px; top:20px;'></h3>").insertBefore($("body").children()[0]);
    $("#travelAllowed")[0].checked = travelAllowed;
    $("#travelAllowed").change(function() {
        if ($("#travelAllowed")[0].checked) {
            $("#nextState")[0].innerText = "Next state: " + $("#travelOveride")[0].value;
            travelAllowed = true;
            localStorage.setItem("travelAllowed", true);
        } else {
            $("#nextState")[0].innerText = "Travelling disabled!";
            travelAllowed = false;
            localStorage.setItem("travelAllowed", false);
        }
    });
    $("#travelOveride")[0].value = nextState;
    localStorage.setItem("travelOveride", nextState);
    $("#travelOveride").change(function() {
        if ($("#travelOveride")[0].value == curState) {
            alert("Cannot set your next destination as your current location\nDefaulting to " + destinationPairs[curState]);
            localStorage.setItem("travelOveride", destinationPairs[curState]);
            travelOveride = destinationPairs[curState];
            $("#travelOveride")[0].value = destinationPairs[curState];
            $("#travelOveride").trigger("change");
        } else {
            localStorage.setItem("travelOveride", $("#travelOveride")[0].value);
            travelOveride = $("#travelOveride")[0].value;
            nextState = travelOveride;
            $("#nextState")[0].innerText = travelAllowed ? "Next state: " + nextState : "Travelling disabled!";
        }
    });
    var yourRank = $("#8 > a")[0].innerText;
    $("#nextState")[0].innerText = travelAllowed ? "Next state: " + nextState : "Travelling disabled!";
    var nextBooze = boozePairs[curState + " " + nextState];
    var travelCD = $("td > .countdown-timeleft")[0] == null ? 0 : FormatTime($("td > .countdown-timeleft")[0].innerText);
    var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;
    var inJail = $(".header")[0].innerText.includes("jail");

    function loadBL(){
        window.location.href = window.location.href
    }

    if ((scriptCheck) || (inJail)) {
        setTimeout(loadBL, 5000);

    } else if (!travelAllowed) {
        console.log("Travel disabled!");
    } else if (!OCTravelAllowed) {
        console.log("Travel disabled while waiting to complete OC");
    } else if (window.location.href == ("https://www.bootleggers.us/trainstation.php?s=1")) {
        TravelToNextCountry();

    } else if (window.location.href == ("https://www.bootleggers.us/trainstation.php")) {
        //Arrived in new country, sell booze
        if (travelCD) {
            window.location.href = "/bootleg.php?s=1";
        }

    } else if (window.location.href == ("https://www.bootleggers.us/bootleg.php?s=1")) {
        SellBooze();

    } else if (window.location.href == ("https://www.bootleggers.us/bootleg.php")) {
        //Booze bought or sold
        HandleBoozePurchaseOrSale();

    } else if (window.location.href == ("https://www.bootleggers.us/trainstation.php?s=2")) {
        HandleScriptProgression();
    } else if (window.location.href == ("https://www.bootleggers.us/bootleg.php?s=2")) {
        BuyBooze();
    } else if (window.location.href == ("https://www.bootleggers.us/missions.php?deliver=crates")) {
        DeliverCrates();
    } else if ((window.location.href == "https://www.bootleggers.us/missions.php") && (document.referrer == "https://www.bootleggers.us/missions.php?deliver=crates")) {
        if (mission == 9) {
            window.location.href = "/bootleg.php?s=1";
        } else if (mission == 17) {
            let crates;
            crates = this.innerText == curState + " delivered" ? this.nextElementSibling.innerText*1 : crates;
            if ((curState == "California") && (crates == 150)) {
                localStorage.setItem("mission17dest", "Nevada");
            }
        } else {
            window.location.href = "/bootleg.php?s=1";
        }
    }

    function TravelToNextCountry() {
        if (travelCD == 0) {
            var travelStatus = document.createElement("h3");
            var travelText = "Travelling to " + nextState + " in: ";
            travelStatus.innerText = travelText;
            travelStatus.className = "travelStatus";
            $("form").find("div").append(travelStatus);
            document.querySelectorAll("[alt='" + nextState + "']")[0].click();
            function loopDone() {
                document.querySelectorAll("[value='Travel!']")[0].click();
            }
            for(let i = 0; i <= 10; i++) {
                setTimeout(()=>{
                    $(".travelStatus")[0].innerText = travelText + (10-i);
                    if(i === 10){
                        loopDone();
                    }
                },i * 1000);
            }
        }
    }

    function SellBooze() {
        if ((((curState == "California") && (mission == 9)) ||((curState == "Nevada") && (mission == 14)) || ((curState == localStorage.getItem("mission17dest")) && (mission == 17))) && (document.referrer != "https://www.bootleggers.us/missions.php")) {
            window.location.href = "/missions.php?deliver=crates";
        } else {
            setTimeout(function() {
                var boozeTD;
                var boozeIndex = {};
                var curBoozeArr = [];
                var curBooze;
                //Add all booze to array
                $($(".sub3")[1].parentElement.nextElementSibling).find("span").each(function(i) {
                    boozeIndex[i] = this.innerText;
                    curBoozeArr.push(this.innerText);
                });
                //Check array to find booze you are carrying the most of
                for (var x in boozeIndex) {
                    if (boozeIndex[x] == Math.max.apply(null, curBoozeArr)) {
                        boozeTD = x*1;
                    }
                }
                curBooze = $(".insideTables").find("b")[boozeTD*1+1].innerText;
                var myStockRow = $(".sub3")[1].parentElement.nextElementSibling;
                var sellBooze = document.querySelectorAll("[name='sell[" + (boozeTD + 1) + "]']")[0];
                sellBooze.value = myStockRow.children[boozeTD].innerText.split(/\r?\n/)[0];
                document.querySelectorAll("[type='submit']")[0].click();
            }, 5000);
        }
    }

    function BuyBooze() {
        var boozeTD;
        var ammount = $("table.sub2.centered").find("b")[0].parentElement.innerText.match(/\d+/g)[0]*1;
        $($(".insideTables > table > tbody > tr")[3]).find("td").each(function(i) {
            boozeTD = this.innerText.includes(nextBooze) ? i : boozeTD;
        });
        var myStockRow = $(".sub3")[0].parentElement.nextElementSibling;
        var buyBooze = document.querySelectorAll("[name='purch[" + (boozeTD + 1) + "]']")[0];
        var affordAmt = (Math.floor(document.querySelectorAll("[data-player-stat='cash']")[0].innerText.replace(/[$,]/g, "")*1/(myStockRow.children[boozeTD].textContent.replace(/[A-Za-z$,]/g, "")*1)))-1
        var curBoozeArr = [];
        $($(".sub3")[1].parentElement.nextElementSibling).find("span").each(function(i) {
            curBoozeArr.push(this.innerText*1);
        });
        var capacityRemaining = ammount - (curBoozeArr.reduce(function(a, b) { return a + b; }, 0));
        buyBooze.value = mission == 9 ? 6 : affordAmt > capacityRemaining ? capacityRemaining : affordAmt;
        if (capacityRemaining != 0) {
            setTimeout(function() {
                document.querySelectorAll("[type='submit']")[0].click();
            }, 5000);
        } else {
            window.location.href = "https://www.bootleggers.us/bootleg.php?s=1";
        }
    }

    function HandleBoozePurchaseOrSale() {
        var boozeTD;
        $($(".insideTables > table > tbody > tr")[3]).find("td").each(function(i) {
            boozeTD = this.innerText.includes(nextBooze) ? i : boozeTD;
        });
        var myStockRow = $(".sub3")[1].parentElement.nextElementSibling;
        var sellBooze = myStockRow.children[boozeTD].innerText.split(/\r?\n/)[0];
        //If carrying booze to sell, proceed to travel page
        if (sellBooze > 0) {
            setTimeout(function() {
                window.location.href = "/trainstation.php?s=1";
            }, 500);
        //If not carrying booze to sell, proceed to home page and wait
        } else {
            setTimeout(function() {
                window.location.href = "/trainstation.php?s=2";
            }, 500);
        }
    }

    function HandleScriptProgression() {
        setTimeout(function() {
            if (doBoozeRun) {
                window.location.href = "/orgcrime.php";
            } else {
                window.location.href = "/bootleg.php?s=2";
            }
        }, travelCD * 1000);
        console.log("Reloading bootlegging in: " + travelCD);
    }

    function DeliverCrates() {
        var rankAmounts = {"Hitman":40, "Assassin":55, "Boss":70, "Respectable Boss":85, "Godfather":100, "Legendary Godfather":115, "Don":130, "Respectable Don":145, "Legendary Don":160}
        var crates;
        if (mission == 9) {
            document.querySelectorAll("[name='crates']")[0].value = 6;
        }
        /*if (mission == 14) {
                crates = this.innerText == "Crates delivered" ? this.nextElementSibling.innerText*1 : crates;
                document.querySelectorAll("[name='crates']")[0].value = (150 - crates) > rankAmounts[yourRank] ? rankAmounts[yourRank] : 150 - crates;
            } else if (mission == 17) {
                crates = this.innerText == curState + " delivered" ? this.nextElementSibling.innerText*1 : crates;
                document.querySelectorAll("[name='crates']")[0].value = (150 - crates) > rankAmounts[yourRank] ? rankAmounts[yourRank] : 150 - crates;
            }
        });*/
        if (mission == 17) {
            crates = $("td:contains('" + curState + " delivered')")[$("td:contains('" + curState + " delivered')").length-1].nextElementSibling.innerText*1;
            document.querySelectorAll("[name='crates']")[0].value = (150-crates) > rankAmounts[yourRank] ? rankAmounts[yourRank] : 150 - crates;
        }
        document.querySelectorAll("[value='Deliver!']")[0].click();
    }

    function FormatTime(time) {
        return time == 0 ? 0 : time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
    }
});