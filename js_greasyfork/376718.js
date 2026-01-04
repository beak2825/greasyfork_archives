// ==UserScript==
// @name         BL R9.75 Mission Manager
// @namespace    Bootleggers R9.75
// @version      0.0.3
// @description  Manage various scripts
// @author       BD
// @include      https://www.bootleggers.us/*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @update       https://greasyfork.org/scripts/376718-bl-r9-75-mission-manager/code/BL%20R975%20Mission%20Manager.user.js
// @downloadURL https://update.greasyfork.org/scripts/376718/BL%20R975%20Mission%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/376718/BL%20R975%20Mission%20Manager.meta.js
// ==/UserScript==

$(document).ready(function() {
    //GLOBAL VARIABLES
    var login = document.querySelectorAll("[value='Login!']")[0];
    var sameIpUsers = localStorage.getItem("sameIpUsers") ? localStorage.getItem("sameIpUsers") : false;
    var yourName = localStorage.getItem("yourName") ? localStorage.getItem("yourName") : false;
    var yourRank = $("#8 > a")[0] ? $("#8 > a")[0].innerText : false;
    var yourCash = document.querySelectorAll("[data-player-stat='cash']")[0] ? document.querySelectorAll("[data-player-stat='cash']")[0].innerText.replace(/[$,]/g, "")*1 : false;
    var mission = $(".featureBoxMission > span")[0] ? $(".featureBoxMission > span")[0].innerText.match(/\d+/g)[0]*1 : localStorage.getItem("mission") ? localStorage.getItem("mission") : false;
    var curState = $("#1")[0] ? $("#1")[0].innerText : false
    var crimesMaxed = $("#timer-cri")[0] ? $("#timer-cri")[0].dataset.seconds == "Maxed" : false;
    var jailBustDelay = 1;
    var boozePairs = {"Michigan Illinois":"Cognac", "Michigan California":"Gin", "Michigan New York":"Cognac", "Michigan Nevada":"Cognac", "Michigan New Jersey":"Vodka", "Illinois Michigan":"Wine", "Illinois California":"Gin", "Illinois New York":"Rum", "Illinois Nevada":"Rum", "Illinois New Jersey":"Rum", "California Michigan":"Tequila", "California Illinois":"Cognac", "California New York":"Cognac", "California Nevada":"Cognac", "California New Jersey":"Tequila", "New York Michigan":"Vodka", "New York Illinois":"Cognac", "New York California":"Vodka", "New York Nevada":"Cognac", "New York New Jersey":"Vodka", "Nevada Michigan":"Tequila", "Nevada Illinois":"Tequila", "Nevada California":"Gin", "Nevada New York":"Rum", "Nevada New Jersey":"Tequila", "New Jersey Michigan":"Wine", "New Jersey Illinois":"Cognac", "New Jersey California":"Cognac", "New Jersey New York":"Cognac", "New Jersey Nevada":"Cognac"};
    var destinationPairs = {"Michigan":"Nevada", "Nevada":"California", "New Jersey":"Illinois", "Illinois":"New York", "California":"New Jersey", "New York":"Michigan"};
    var travelOveride = localStorage.getItem("travelOveride") == null ? destinationPairs[curState] : localStorage.getItem("travelOveride");
    var nextState = curState == travelOveride ? destinationPairs[curState] : travelOveride;
    var travelAllowed = localStorage.getItem("travelAllowed") == null ? localStorage.setItem("travelAllowed", false) : localStorage.getItem("travelAllowed");
    travelAllowed = localStorage.getItem("travelAllowed") == "true" ? true : false;
    var OCTravelAllowed = localStorage.getItem("OCTravelAllowed") == null ? localStorage.setItem("OCTravelAllowed", true) : localStorage.getItem("OCTravelAllowed");
    OCTravelAllowed = localStorage.getItem("OCTravelAllowed") == "true" ? true : false;
    var nextBooze;
    var recoveryTimer = $($("#recovering")[0]).find(".countdown-timeleft")[0] ? $($("#recovering")[0]).find(".countdown-timeleft")[0].innerText : 0;
    var freezeTimer;
    var inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];
    var scriptCheck = $(".g-recaptcha")[0];


    if (!login) {
        if ((!yourName) || (!mission)) {
            RetrieveInfo();
        }
        if (!sameIpUsers) {
            RetrieveInfo("sameIpUsers")
        }
        if (window.location.href == "https://www.bootleggers.us/news.php") {
            RetrieveInfo("sameIpUsers");
        }
        if (window.location.href == "https://www.bootleggers.us/missionmanager") {
            $("body").css({"margin": "0"});
        }
        if ((window.location.href == "https://www.bootleggers.us/user/" + yourName) && (window.top.location.href == "https://www.bootleggers.us/missionmanager")) {
            if (scriptCheck) {
                //Solve captcha
            } else {
                window.top.location.href = "https://www.bootleggers.us/missionmanager";
            }
        } else {
            if (window.location.href != "https://www.bootleggers.us/missionmanager") {
                if (mission) {
                    localStorage.setItem("mission", mission);
                } else if (!mission) {
                    localStorage.setItem("mission", "No Current Mission");
                }
            }
            if (((window.location.href.includes("/trainstation.php")) || (window.location.href == "https://www.bootleggers.us/bootleg.php")) && (window.top.location.href == "https://www.bootleggers.us/missionmanager")) {
                SetupTravelOveride();
            }
            if ((window.location.href == "https://www.bootleggers.us/missionmanager") || (window.top.location.href == "https://www.bootleggers.us/missionmanager")) {
                if (mission == 1) {
                    HandleMission1();
                } else if (mission == 3) {
                    HandleMission3();
                } else if (mission == 4) {
                    HandleMission4();
                } else if (mission == 5) {
                    HandleMission5();
                } else if (mission == 6) {
                    HandleMission6();
                }
            }
        }
    }
    if ((window.location.href == "https://www.bootleggers.us/") ||  (window.location.href.includes("logout.php")) ){
        CleanUpPreferences();
    }



    function RetrieveInfo(param) {
        if (param == "sameIpUsers") {
            console.log("Script paused, retrieving usernames sharing the same IP as you.");
            $.ajax({
                async: false,
                type: "GET",
                url: "https://www.bootleggers.us/family.php",
                success: function(data) {
                    sameIpUsers = data.split("viewuser=")[1].split('"')[0];
                    localStorage.setItem("sameIpUsers", sameIpUsers);
                    console.log("Script resumed");
                }
            });
        } else {
            $.ajax({
                async: false,
                type: "GET",
                url: "https://www.bootleggers.us/profile.php?tab=vote",
                success: function(data) {
                    yourName = data.split("incentive=")[1].split(".")[0];
                    localStorage.setItem("yourName", yourName);
                    mission = data.split('14px;">Mission ')[1].match(/\d+/)[0];
                    localStorage.setItem("mission", mission);
                    console.log("Script resumed");
                }
            });
        }
    }

    function HandleMission1() {
        if (window.location.href == "https://www.bootleggers.us/missionmanager") {
            $("iframe").remove();
            CreateFreezeTimer(ReloadMissionManager, 60000);
            CreateFrame("100%", "100%", "0", "0", "/crimes.php");
        } else if (window.location.href == "https://www.bootleggers.us/crimes.php") {
            CommitCrime();
        }
    }

    function HandleMission3() {
        if (window.location.href == "https://www.bootleggers.us/missionmanager") {
            $("iframe").remove();
            CreateFreezeTimer(ReloadMissionManager, 10000);
            CreateFrame("100%", "100%", "0", "0", "/jail.php");
        } else if (window.location.href == "https://www.bootleggers.us/jail.php") {
            CommitJailBust();
        }
    }

    function HandleMission4() {
        if (window.location.href == "https://www.bootleggers.us/missionmanager") {
            $("iframe").remove();
            CreateFreezeTimer(ReloadMissionManager, 60000);
            CreateFrame("100%", "100%", "0", "0", "/bootleg.php?buyBooze=Beer");
        } else if (window.location.href.includes("/bootleg.php")) {
            if (window.location.href.split("Booze=")[1]) {
                CommitBootleg(window.location.href.split("Booze=")[1]);
            } else {
                CommitBootleg("All");
            }
        } else if (window.location.href.includes("/trainstation.php")) {
            if (document.referrer.includes("nextState")) {
                window.location.href = "/bootleg.php?sellBooze=Beer";
            } else {
                TravelToNextState(window.location.href.split("nextState=")[1]);
            }
        }
    }

    function HandleMission5(){
        if (window.location.href == "https://www.bootleggers.us/missionmanager") {
            $("iframe").remove();
            CreateFreezeTimer(ReloadMissionManager, 300000);
            CreateFrame("100%", "100%", "0", "0", "/autoburglary.php");
        } else if (window.location.href == "https://www.bootleggers.us/autoburglary.php") {
            if (localStorage.getItem(yourName + "CrimeCount") >= 25) {
                //CommitAutoBurglary();
            } else {
                window.frameElement.ownerDocument.getElementsByTagName("iframe")[0].src = "/crimes.php";
            }
        } else if (window.location.href == "https://www.bootleggers.us/crimes.php") {
            CommitCrime();
        }
    }

    function HandleMission6(){
        if (window.location.href == "https://www.bootleggers.us/missionmanager") {
            $("iframe").remove();
            CreateFreezeTimer(ReloadMissionManager, 60000);
            CreateFrame("100%", "100%", "0", "0", "/buy.php");
        } else if (window.location.href == "https://www.bootleggers.us/buy.php") {
            if (scriptCheck) {
            parent.HandleScriptCheck();
            } else if (inJail) {
                setTimeout(function() {
                    window.location.href = "/buy.php";
                }, 10000)
            } else {
                BuyGunFromStore();
            }
        } else if (window.location.href == "https://www.bootleggers.us/crimes.php") {
            CommitCrime();
        }
    }

    function CommitCrime() {
        window.parent.postMessage("resetFreezeTimer, 120", "*");
        var crimesCD = FormatTime(recoveryTimer);
        var commitID = $($(".insideTables")[0]).find("input:radio").length-1;//Math.round(Math.random()*(document.querySelectorAll("[type='radio']").length-1));
        var stateID = $("select")[0] ? $("select")[0].selectedIndex : false;
        var evading = $("#evadeSpan")[0];
        var arrested = $(".centered")[0] ? $(".centered")[0].innerText == "You failed the crime and were arrested by police" : false;
        var commitBtn = document.querySelectorAll("[value='Commit!']")[0];
        if (scriptCheck) {
            parent.HandleScriptCheck();
        } else if (inJail) {
            setTimeout(function() {
                window.location.href = "/crimes.php";
            }, 10000);
        } else if (crimesMaxed) {
            //Do nothing
        } else if (mission == 1) {
            RunScript(stateID, commitID);
        } else {
            RunScript($("select")[0].selectedIndex, $($(".insideTables")[0]).find("input:radio").length-1);
        }

        function RunScript(state, id) {
            $(".insideTables :radio")[id].click();
            if ($("select")[0].selectedIndex == state) {
                if (crimesCD == 0) {
                    commitBtn.click();
                } else {
                    var successful = $(".centered")[0] ? $(".centered")[0].innerText.includes("successfully") : false;
                    var crimeCount = localStorage.getItem(yourName + "CrimeCount") ? localStorage.getItem(yourName + "CrimeCount") : 0;
                    successful ? crimeCount++ : false;
                    localStorage.setItem(yourName + "CrimeCount", crimeCount);
                    var countdownText = $(".countdown-timeleft").closest("td")[0].innerHTML;
                    $(".countdown-timeleft").closest("td")[0].innerHTML = countdownText.replace("You are currently recovering from your previous crime...", "<font id='reload' color='red'><b>*MISSION MANAGER* Reloading crimes in:</b></font>");
                    setTimeout(function() {
                        window.location.href = "/crimes.php";
                    }, crimesCD * 1000);
                }
            } else {
                $("select")[0].selectedIndex = state;
            }
        }
    }

    function CommitAutoBurglary() {
        window.parent.postMessage("resetFreezeTimer, 60", "*");

    }

    function CommitJailBust() {
        window.parent.postMessage("resetFreezeTimer, 10", "*");
        inJail = $("#jailRow" + yourName)[0];
        var evading = $("#evade")[0]
        var bustLink = false;
        $("#inmateList > tr").each(function(i) {
            if ((!sameIpUsers.includes(this.id.split("jailRow")[1])) && ($("#jailRow" + this.id.split("jailRow")[1] + " > .bustLink > a")[0])) {
                bustLink = i;
                return false;
            }
        });
        if (scriptCheck) {
            parent.HandleScriptCheck();
        } else if (mission == 3) {
            RunScript(jailBustDelay, bustLink);
        }

        function RunScript(delay, link) {
            if (evading) {
                evading.click();
            } else if ((inJail) || (bustLink === false)) {
                setTimeout(function() {
                    window.location.href = "/jail.php";
                }, delay * 1000);
            } else {
                console.log($(".bustLink > a")[bustLink]);
                $(".bustLink > a")[bustLink].click();
            }
        }
    }

    function CommitBootleg(booze) {
        window.parent.postMessage("resetFreezeTimer, 60", "*");
        var boozeID = {"Moonshine":0, "Beer":1, "Gin":2, "Whisky":3, "Rum":4, "Vodka":5, "Tequila":6, "Wine":7, "Cognac":8};
        var boozeTD = $("td.sub3:contains('Your stock')").parent().next().find("td");
        var completeBtn = document.querySelectorAll("[value='Complete transaction!']")[0];
        var nextBoozePrice = $("b:contains('" + nextBooze + "')").parent()[0] ? $("b:contains('" + nextBooze + "')").parent()[0].innerText.match(/\d+/)*1 : false;
        var carryCapacity = $("b:contains('Crate info')").parent()[0].innerText.match(/\d+/)*1;
        var capacityRemaining = 0;
        $("td:contains('Inventory space used').sub3").parent().next()[0].innerText.match(/\d+/) != 100 ? $("td.sub3:contains('Your stock')").parent().next().find("td").each(function() { capacityRemaining += this.textContent.match(/\d+/)*1 }) : capacityRemaining = false;
        capacityRemaining = capacityRemaining ? carryCapacity - capacityRemaining : 0;
        var buyAmount = capacityRemaining > 0 ? (yourCash-200)/nextBoozePrice >= capacityRemaining ? capacityRemaining : Math.floor((yourCash-200)/nextBoozePrice) : 0;
        if (scriptCheck) {
            parent.HandleScriptCheck();
        } else if (inJail) {
            setTimeout(function() {
                window.location.href = "/bootleg.php";
            }, 10000);
        } else if (mission == 4) {
            RunScript(booze);
        }

        function RunScript(booze, amount) {
            window.parent.postMessage("resetFreezeTimer, 60", "*");
            if (mission == 4) {
                if (window.location.href.includes("/bootleg.php?buyBooze=")) {
                    if (window.location.href.split("buyBooze=")[1] == "Beer") {
                        BuyBooze("Beer", 2);
                    } else {
                        BuyBooze(window.location.href.split("buyBooze=")[1], buyAmount);
                    }
                } else if (window.location.href.includes("/bootleg.php?sellBooze=")) {
                    if (window.location.href.split("sellBooze=")[1] == "Beer") {
                        SellBooze("Beer", 2);
                    } else if (window.location.href.split("sellBooze=")[1] == "All") {
                        SellBooze("All");
                    }
                } else if (document.referrer.includes("buyBooze=")) {
                    if ((document.referrer.split("buyBooze=")[1] == "Beer")) {
                        window.location.href = "/bootleg.php?buyBooze=" + nextBooze;
                    } else {
                        window.location.href = "/trainstation.php?nextState=" + nextState;
                    }
                } else {
                    window.top.location.href = window.top.location.href;
                }
            } else if (document.referrer.includes("sellBooze=")) {
                if ((capacityRemaining < carryCapacity) && (document.referrer.split("sellBooze=")[1] == "Beer") && (mission == 5)) {
                    window.location.href = "/bootleg.php?sellBooze=All";
                }
            }/* else if (boozeTD[boozeID[booze]].textContent.match(/\d+/) <= buyAmount - amount) {
                BuyBooze(booze, amount);
            } else {
                alert("Sell the rest");
            }*/
            //If not mission 4
        }

        function BuyBooze(booze, amount) {
            window.parent.postMessage("resetFreezeTimer, 60", "*");
            document.querySelectorAll("[name='purch[" + (boozeID[booze] + 1) + "]']")[0].value = amount;
            completeBtn.click();
        }

        function SellBooze(booze, amount) {
            window.parent.postMessage("resetFreezeTimer, 60", "*");
            if (window.location.href.includes("sellBooze=All")) {
                $("td.sub3:contains('Your stock')").parent().next().find("td").each(function(i) {
                    this.innerText.match(/\d+/)*1 > 0 ? document.querySelectorAll("[name='sell[" + (i + 1) + "]']")[0].value = this.innerText.match(/\d+/)*1 : false;
                });
            } else {
                document.querySelectorAll("[name='sell[" + (boozeID[booze] + 1) + "]']")[0].value = amount ? amount : document.querySelectorAll("[name='sell[" + (boozeID[booze] + 1) + "]']")[0].value;
            }
            completeBtn.click();
        }
    }

    function BuyGunFromStore() {
        changePic('gun', 1);
        if (document.querySelectorAll("[value='Purchase!']")[0]) {
            document.querySelectorAll("[value='Purchase!']")[0].click();
        } else {
            window.location.href = "/crimes.php";
        }
    }

    function TravelToNextState(state) {
        window.parent.postMessage("resetFreezeTimer, 60", "*");
        document.querySelectorAll("[alt='" + state.replace("%20", " ") + "']")[0].click();
        if ((travelAllowed) && (OCTravelAllowed) && (document.querySelectorAll("[value='Travel!']")[0])) {
            document.querySelectorAll("[value='Travel!']")[0].click();
        }
    }

    function SetupTravelOveride() {
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
        $("#nextState")[0].innerText = travelAllowed ? "Next state: " + nextState : "Travelling disabled!";
        nextBooze = boozePairs[curState + " " + nextState];
    }

    function CreateFrame(w,h,pl,pt,s) {
        var frame = document.createElement("iframe");
        frame.width = w;
        frame.height = h;
        frame.style.position = "absolute";
        frame.style.top = pl;
        frame.style.left = pt;
        frame.src = s;
        $("body").append($(frame));
    }

    function ReloadMissionManager() {
        window.top.location.href = "/missionmanager";
    }

    function FormatTime(time) {
        return time == 0 ? 0 : time.split(":")[0]*3600 + time.split(":")[1]*60 + time.split(":")[2]*1;
    }

    HandleScriptCheck = function() {
        $("iframe").remove();
        CreateFrame("100%", "100%", "0", "0", "/user/" + yourName);
    }

    function CreateFreezeTimer(a, t) {
        window.addEventListener("message", HandleFreezeTimer);
        freezeTimer = setTimeout(a, t);

        function HandleFreezeTimer(e) {
            if (e.data.includes("resetFreezeTimer")) {
                window.removeEventListener("message", HandleFreezeTimer);
                CreateFreezeTimer(ReloadMissionManager, e.data.split(", ")[1]*1000);
            }
        }
    }

    function CleanUpPreferences() {
        localStorage.getItem("yourName") ? localStorage.removeItem("yourName") : null;
        localStorage.getItem("mission") ? localStorage.removeItem("mission") : null
        localStorage.getItem("travelOveride") ? localStorage.removeItem("travelOveride") : null;
        localStorage.getItem("travelAllowed") ? localStorage.removeItem("travelAllowed") : null;
        localStorage.getItem("OCTravelAllowed") ? localStorage.removeItem("OCTravelAllowed") : null;
    }
});