// ==UserScript==
// @name        Torn RR Mugging
// @namespace   https://www.torn.com/profiles.php?XID=2029670
// @version     1.10
// @description Make RR mugging great again
// @author      MikePence [2029670]
// @match       https://www.torn.com/*
// @requires    https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @connect     mpsse.epizy.com
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       window.focus
// @downloadURL https://update.greasyfork.org/scripts/395989/Torn%20RR%20Mugging.user.js
// @updateURL https://update.greasyfork.org/scripts/395989/Torn%20RR%20Mugging.meta.js
// ==/UserScript==

// RR player coloring
var cantMugStrongPlayers = ["-R3x- [483525]", "JayBragga [1874267]", "Burning_Sun [1266246]", "MJ_Cookie [271665]", "rEd-dEvIL [471053]", "Sun_WuKong_ [1677346]", "_Gabriel_ [1620993]", "Thrie [148961]", "Miracle [1591334]", "Crayfish [954866]", "Rum4nyby [1567187]", "Batman [984129]", "razzaonpc [1841988]", "Denom [49368]", "Jerobie [1863992]", "Odin-All-Father [2010524]", "Pops [1025410]", "Keon [1955275]", "Frost211 [1823290]", "Paul [1176287]", "CerealKillaKyle [1857028]", "j0ker5 [995014]", "cobhc [259560]", "ACWang [520139]"];
//var cantMugStrongPlayers = [];
var dontMugFactions = ["23952"];
//var dontMugFactions = [];
var quickPlayers = ["-Carson- [2065381]", "KingJack [1656265]", "Mr_Oxygen [2425714]", "Shane77ss [2281988]", "HareTrigger [2184187]", "Sai_Lazuli [1744215]", "SofiaVitosha [2414422]", "YorkTzu [2329970]", "TooSkyHigh [2339475]"];
var cantMugNewPlayers = [];
var cantMugPlayers = cantMugStrongPlayers.concat(cantMugNewPlayers);
//var dontHostNotifyPlayers = quickPlayers.concat(cantMugPlayers);
var dontHostNotifyPlayers = cantMugPlayers;

// Notifications
var silentNotifications = true; // Silences all types of notifications
var hostNotificationsOn = true; // Get notified for games being hosted
var autoTrack = true; // Automatically track games
var trackNotificationType = 1; // 1 for notification, 2 for notification and custom sound
var trackNotificationSoundClip = "https://www.freesound.org/data/previews/72/72128_1028972-lq.mp3"; // Audio clip to play if trackNotificationType = 2
var trackNotificationSoundVolume = 0.2;
var timeoutNotificationsOn = false; // Get notified for games about to timeout
var timeoutNotificationTime = 60; // At how many seconds until game timeout to get notified

// Misc
var minRRBet = 25000000; // Only get notified for hosted games with bet >= minRRBet, timeout games with bet * 2 >= minRRBet
var hideRRShots = false; // If game < $10,000, hide the shoot button. If game >= $10,000, hide the 2x and 3x buttons.
var statsShowRefreshTime = false; // See how fast your RR stats page refreshes are

// Code
$(document).ready(function(){
    if(!window.location.href.includes("viewRussianRouletteStats") && !window.location.href.includes("attack")){
        //var blacklistInterval = window.setInterval(blacklistFunction, 10);
        function blacklistFunction(){
            var list = [];
            $("#nav-enemies").children().eq(1).children().first().children().first().children().each(function(){
                var name = $(this).children().eq(1).attr("id").replace("enemies_user_", "");
                var inList = false;
                for(var i = 0; i < list.length; i++){
                    if(list[i][0] == name) {
                        inList = i;
                        break;
                    }
                }
                if(inList === false){
                    $(this).children().eq(1).css("color", "black");
                }
                else{
                    if(list[inList][1] === "mugger" && list[inList][2] === "serious"){
                        $(this).children().eq(1).css("color", "yellow");
                    }
                    else if(list[inList][1] === "player"){
                        $(this).children().eq(1).css("color", "red");
                    }
                    else if(list[inList][1] === "squeek"){
                        $(this).children().eq(1).css("color", "green");
                    }
                    else{
                        $(this).children().eq(1).css("color", "black");
                    }
                }
            });
        }
    }
    if(window.location.href.includes("russianRoulette")){
        var myRRTimeoutNotified = false;
        $(".status").first().text("Time until timeout (0-5s error)");
        //var rrInterval = window.setInterval(rrFunction, 500);
        //$("body").on("DOMSubtreeModified",".rr-wrap",rrFunction);
        var observerConfig = {attributes: false, childList: true, subtree: false};
        var observer = new MutationObserver(rrFunction);
        observer.observe(document.getElementsByClassName("rr-list-wrap")[0], observerConfig);
        function rrFunction(){
            //console.log($(".rr-wrap").html());
            //console.log($(".rr-list-wrap").length);
            if($('.rr-game-wrap').length > 0){
                if(hideRRShots){
                    var shootButton = $(".btn-wrap.shoot").first();
                    var x2Button = $(".btn-wrap.x2").first();
                    var x3Button = $(".btn-wrap.x3").first();
                    var pot = parseInt($(".rr-pot").first().text().substr(12).replace(/,/g, ""));
                    var message = $(".rr-message").first().text();
                    console.log(message);
                    var timingMessage = $(".rr-timing-message").first().text();
                    var timeout = $(".time").first().text();
                    var timeoutMins = parseInt(timeout.substr(0, 2));
                    var timeoutSecs = parseInt(timeout.substr(3, 2));
                    var timeoutTotalSecs = timeoutMins * 60 + timeoutSecs;
                    if(message == "You pull up a chair and sit down, waiting for a participant to join you."){
                    }
                    else if(message.startsWith("You pass the revolver to") || message.startsWith("You hear a CLICK and smile briefly! You hand the gun to") || message.startsWith("BANG!") || timingMessage.startsWith("BANG!") || message.startsWith("You hit")){
                        shootButton.css("display", "none");
                        x2Button.css("display", "none");
                        x3Button.css("display", "none");
                    }
                    else if(message.endsWith("appears to be a little anxious...") || timeoutTotalSecs > 600){
                        shootButton.css("display", "none");
                        x2Button.css("display", "none");
                        x3Button.css("display", "none");
                        var takeActionButton = $(".btn-wrap.takeaction").first();
                        takeActionButton.css("display", "inline-block");
                    }
                    else{
                        if(pot >= 10000){
                            shootButton.css("display", "inline-block");
                            x2Button.css("display", "none");
                            x3Button.css("display", "none");
                        }
                        else{
                            var shot = $(".rr-timing-cilinder").first().children().length;
                            console.log(shot);
                            if(shot <= 3){
                                shootButton.css("display", "none");
                                x2Button.css("display", "none");
                                x3Button.css("display", "inline-block");
                            }
                            else if(shot <= 4){
                                shootButton.css("display", "none");
                                x2Button.css("display", "inline-block");
                                x3Button.css("display", "none");
                            }
                            else{
                                shootButton.css("display", "inline-block");
                                x2Button.css("display", "none");
                                x3Button.css("display", "none");
                            }
                        }
                    }
                }
                if(!myRRTimeoutNotified && timeoutTotalSecs <= 30){
                    GM_notification({
                        text: timeoutTotalSecs + "s left",
                        title: "Your RR about to timeout",
                        silent: silentNotifications,
                        timeout: 5000,
                        onclick: function() {
                            window.focus();
                        }
                    });
                    myRRTimeoutNotified = true;
                }
            }
            else{
                myRRTimeoutNotified = false;
            }
            if($(".rr-list").length > 0){
                var rrGames = GM_getValue("rrGames", "{\"rrGames\":[]}");
                rrGames = JSON.parse(rrGames);
                var currentGames = [];
                var rrGamesChildren = $(".rr-list").first().children();
                rrGamesChildren.each(function(){
                    var startedBy = $(this).children(".left").first().children(".started-by").first();
                    var name = startedBy.children(".name").first().attr("data-placeholder");
                    var faction = startedBy.children(".faction").first().attr("href");
                    if(!faction){
                        faction = -1;
                    }
                    else{
                        faction = faction.substr(faction.indexOf("ID=") + 3);
                    }
                    var bet = $(this).children(".right").first().children(".bet").first().attr("data-info");
                    currentGames.push({
                        "host": name,
                        "faction": faction,
                        "bet": bet
                    });
                    if(cantMugPlayers.includes(name) || dontMugFactions.includes(name)){
                        $(this).css("background-color", "#F76B6B");
                    }
                    else if(quickPlayers.includes(name)){
                        $(this).css("background-color", "#FCCF3E");
                    }
                });
                for(i = 0; i < currentGames.length; i++){
                    var recordedGame = false;
                    for(j = 0; j < rrGames["rrGames"].length; j++){
                        if(rrGames["rrGames"][j]["host"] == currentGames[i]["host"] && rrGames["rrGames"][j]["bet"] == currentGames[i]["bet"] && rrGames["rrGames"][j]["status"] == "pending"){
                            currentGames[i]["rrGamesIndex"] = j;
                            recordedGame = true;
                            break;
                        }
                    }
                    if(!recordedGame){
                        rrGames["rrGames"].push({
                            "host": currentGames[i]["host"],
                            "bet": currentGames[i]["bet"],
                            "status": "pending",
                            "hostTime": Date.now(),
                            "trackingDisappear": autoTrack && currentGames[i]["bet"] >= minRRBet,
                            "willTimeoutNotify": currentGames[i]["bet"] * 2 >= minRRBet,
                            "timeoutNotified": false
                        });
                        currentGames[i]["rrGamesIndex"] = rrGames["rrGames"].length - 1;
                        if(hostNotificationsOn && !dontHostNotifyPlayers.includes(currentGames[i]["host"]) && !dontMugFactions.includes(currentGames[i]["faction"]) && currentGames[i]["bet"] >= minRRBet){
                            GM_notification({
                                text: "Hosted by " + currentGames[i]["host"],
                                title: "$" + intAbbreviation(currentGames[i]["bet"]) + " RR pending",
                                silent: silentNotifications,
                                timeout: 5000,
                                onclick: function() {
                                    window.focus();
                                }
                            });
                        }
                    }
                }
                for(var i = 0; i < rrGames["rrGames"].length; i++){
                    if(rrGames["rrGames"][i]["status"] != "pending"){
                        continue;
                    }
                    var gameDisappeared = true;
                    for(var j = 0; j < currentGames.length; j++){
                        if(currentGames[j]["host"] == rrGames["rrGames"][i]["host"] && currentGames[j]["bet"] == rrGames["rrGames"][i]["bet"]){
                            gameDisappeared = false;
                            break;
                        }
                    }
                    if(gameDisappeared){
                        rrGames["rrGames"][i]["status"] = "disappeared";
                        rrGames["rrGames"][i]["disappearTime"] = Date.now();
                        if(rrGames["rrGames"][i]["trackingDisappear"] && (!rrGames["rrGames"][i]["willTimeoutNotify"] || !rrGames["rrGames"][i]["timeoutNotified"])){
                            GM_notification({
                                text: "Hosted by " + rrGames["rrGames"][i]["host"],
                                title: "$" + intAbbreviation(rrGames["rrGames"][i]["bet"]) + " RR disappeared",
                                silent: trackNotificationType == 2 ? false : silentNotifications,
                                timeout: 5000,
                                onclick: function() {
                                    window.focus();
                                }
                            });
                            if(trackNotificationType == 2){
                                var audio = new Audio(trackNotificationSoundClip);
                                audio.volume = trackNotificationSoundVolume;
                                audio.play();
                            }
                        }
                    }
                }
                rrGamesChildren.each(function(index){
                    var status = $(this).children(".status").first().children().first();
                    var newStatusHtml = timeDifferenceSAndM(rrGames["rrGames"][currentGames[index]["rrGamesIndex"]]["hostTime"] + 900000, Date.now());
                    if(!rrGames["rrGames"][currentGames[index]["rrGamesIndex"]]["timeoutNotified"]){
                        newStatusHtml += " <button id='MikeRRMugTrackButton-" + currentGames[index]["rrGamesIndex"] + "' data-id='" + currentGames[index]["rrGamesIndex"] + "'>" + (rrGames["rrGames"][currentGames[index]["rrGamesIndex"]]["trackingDisappear"] ? "Untrack" : "Track") + "</button>";
                    }
                    status.html(newStatusHtml);
                    $("#MikeRRMugTrackButton-" + currentGames[index]["rrGamesIndex"]).click(function(){
                        var rrGames = GM_getValue("rrGames", "{\"rrGames\":[]}");
                        rrGames = JSON.parse(rrGames);
                        var currentGamesIndex = parseInt($(this).attr("data-id"));
                        if(rrGames["rrGames"][currentGamesIndex]["trackingDisappear"]){
                            $(this).text("Track");
                        }
                        else{
                            $(this).text("Untrack");
                        }
                        rrGames["rrGames"][currentGamesIndex]["trackingDisappear"] = !rrGames["rrGames"][currentGamesIndex]["trackingDisappear"];
                        GM_setValue("rrGames", JSON.stringify(rrGames));
                    });
                    if(rrGames["rrGames"][currentGames[index]["rrGamesIndex"]]["willTimeoutNotify"] && !rrGames["rrGames"][currentGames[index]["rrGamesIndex"]]["timeoutNotified"]){
                        var difference = Math.floor((rrGames["rrGames"][currentGames[index]["rrGamesIndex"]]["hostTime"] + 900000 - Date.now()) / 1000);
                        if(difference <= timeoutNotificationTime){
                            GM_notification({
                                text: "Hosted by " + currentGames[index]["host"],
                                title: "$" + intAbbreviation(currentGames[index]["bet"]) + " RR about to timeout",
                                silent: silentNotifications,
                                timeout: 5000,
                                onclick: function() {
                                    window.focus();
                                }
                            });
                            rrGames["rrGames"][currentGames[index]["rrGamesIndex"]]["timeoutNotified"] = true;
                        }
                    }
                });
                GM_setValue("rrGames", JSON.stringify(rrGames));
            }
        }
    }
    else if(window.location.href.includes("viewRussianRouletteStats")){
        var hasChanged = false;
        var statsChanged = [];
        //                 check, stat, last variable, last variable change
        var checkStats = [[false, "Stat"],
                          [false, "Number of users played Russian roulette"],
                          [true, "Total money won", "lastTotalMoneyWon", "lastTotalMoneyWonChange"],
                          [false, "Average pot"],
                          [true, "Total games", "lastTotalGames", "lastTotalGamesChange"],
                          [true, "Round #1 shots", "lastRound1Shots", "lastRound1ShotsChange"],
                          [true, "Round #2 shots", "lastRound2Shots", "lastRound2ShotsChange"],
                          [true, "Round #3 shots", "lastRound3Shots", "lastRound3ShotsChange"],
                          [true, "Round #4 shots", "lastRound4Shots", "lastRound4ShotsChange"],
                          [true, "Round #5 shots", "lastRound5Shots", "lastRound5ShotsChange"],
                          [true, "Round #6 shots", "lastRound6Shots", "lastRound6ShotsChange"],
                          [true, "Timeouts", "lastTimeouts", "lastTimeoutsChange"]];
        var overallStatsChildren = $("#overall-stats").children("ul").first().children();
        var statsTitle = $("#skip-to-content");
        overallStatsChildren.each(function(index){
            if(!checkStats[index][0]){
                statsChanged.push(false);
                return;
            }
            //var stat = $(this).children(".item").first().children(".stat").first().text().trim();
            var valueElement = $(this).children(".item").first().children(".stat-value").first();
            var value = valueElement.text().trim().replace(/,/g, "");
            if(index == 2){
                value = value.substr(1, value.length - 1);
            }
            value = parseInt(value);
            var lastValue = GM_getValue(checkStats[index][2]);
            if(value != lastValue){
                var change = value - lastValue;
                if(index == 2){
                    valueElement.html("<span style='color:" + (change >= minRRBet ? "red" : "green") + "'>+$" + change.toLocaleString() + "</span>");
                }
                else{
                    valueElement.html(value.toLocaleString() + " <span style='color:green'>(+" + change.toLocaleString() + ")</span>");
                }
                GM_setValue(checkStats[index][2], value);
                GM_setValue(checkStats[index][3], change);
                hasChanged = true;
                statsChanged.push(true);
            }
            else{
                statsChanged.push(false);
            }
        });
        if(!hasChanged){
            if(statsShowRefreshTime){
                statsTitle.html("No changes (Last update " + timeDifferenceSOrM(Date.now(), GM_getValue("lastStatsChange")) + " ago, refresh time " + timeDifferenceSubS(Date.now(), GM_getValue("lastStatsRefresh")) + ")");
            }
            else{
                statsTitle.html("No changes (Last update " + timeDifferenceSOrM(Date.now(), GM_getValue("lastStatsChange")) + " ago)");
            }
            overallStatsChildren.each(function(index){
                if(!checkStats[index][0]){
                    return;
                }
                var valueElement = $(this).children(".item").first().children(".stat-value").first();
                var value = valueElement.text().trim();
                var lastChange = GM_getValue(checkStats[index][3]);
                if(lastChange != 0){
                    if(index == 2){
                        valueElement.html("<span style='color:green'>+$" + lastChange.toLocaleString() + "</span>");
                    }
                    else{
                        valueElement.html(value.toLocaleString() + " <span style='color:green'>(+" + lastChange.toLocaleString() + ")</span>");
                    }
                }
            });
        }
        else{
            if(statsShowRefreshTime){
                statsTitle.html("<span style='color:green'>Updated</span> (Refresh time " + timeDifferenceSubS(Date.now(), GM_getValue("lastStatsRefresh")) + ")");
            }
            else{
                statsTitle.html("<span style='color:green'>Updated</span>");
            }
            for(var i = 0; i < checkStats.length; i++){
                if(!statsChanged[i]){
                    GM_setValue(checkStats[i][3], 0);
                }
            }
            GM_setValue("lastStatsChange", Date.now());
        }
        if(statsShowRefreshTime){
           GM_setValue("lastStatsRefresh", Date.now());
        }
    }
    else if(window.location.href.includes("attackLog")){
        $(".log-list").first().children().each(function(){
            var messageWrapChildren = $(this).children().first().children();
            var message = messageWrapChildren.eq(1);
            var messageWords = message.text().split(" ");
            if(messageWords[1] == "left" || messageWords[1] == "mugged" || messageWords[1] == "hospitalized" || messageWords[1] == "lost"){
                if(messageWords[1] == "mugged"){
                    var messageSplitQuotes = message.html().split("\"");
                    if(messageSplitQuotes[0] == "Someone mugged <a href="){
                        message.append("<button id='MikeRRMugRecordButton' disabled>Error: this attack log is not yours!</button>");
                    }
                    else{
                        var myId = $("#sidebarroot").children().first().children().first().children().first().children().first().children().first().children().first().children().eq(1).children().first().children().eq(1).children().eq(1).attr("href").substr(18);
                        var muggerId = messageSplitQuotes[1].substr(17);
                        if(myId != 2029670 && myId != muggerId){
                            message.append("<button id='MikeRRMugRecordButton' disabled>Error: this attack log is not yours!</button>");
                        }
                        else{
                            message.append("<button id='MikeRRMugRecordButton'>Record as RR Mug</button>");
                            $("#MikeRRMugRecordButton").click(function(){
                                var victimId = messageSplitQuotes[3].substr(17);
                                var victimName = messageWords[2];
                                var mugAmount = 0;
                                if(messageWords[3] == "for"){
                                    mugAmount = parseInt(messageWords[4].substr(1).replace(/,/g, ""));
                                }
                                var attackLogLink = window.location.href.split("ID=")[1];
                                var participantsListChildren = $(".participants-list").eq(1).children();
                                var attackLogId = participantsListChildren.first().text().substr(12);
                                var attackLogTime = participantsListChildren.eq(1).text();
                                var timeText = messageWrapChildren.eq(2).text();
                                var startHour = parseInt(attackLogTime.substr(1, 2));
                                var endHour = parseInt(timeText.substr(0, 2));
                                var startMinute = parseInt(attackLogTime.substr(4, 2));
                                var endMinute = parseInt(timeText.substr(3, 2));
                                var startSecond = parseInt(attackLogTime.substr(7, 2));
                                var endSecond = parseInt(timeText.substr(6, 2));
                                if(startHour > endHour){
                                    endHour += 24;
                                }
                                if(startMinute > endMinute){
                                    endMinute += 60;
                                }
                                if(startSecond > endSecond){
                                    endSecond += 60;
                                }
                                var mugLength = (endHour * 24 * 60 + endMinute * 60 + endSecond) - (startHour * 24 * 60 + startMinute * 60 + startSecond);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://mpsse.epizy.com/api.php?action=rr_mug_record&mugger_torn_id=" + muggerId + "&victim_torn_id=" + victimId + "&victim_torn_name=" + victimName + "&mug_amount=" + mugAmount + "&mug_length=" + mugLength + "&attack_log_link=" + attackLogLink + "&attack_log_id=" + attackLogId + "&attack_log_time=" + attackLogTime,
                                    onreadystatechange: function(res){
                                        if (res.readyState > 3 && res.status === 200) {
                                            console.log(res.response);
                                            var json = JSON.parse(res.response);
                                            if(!json.error){
                                                $("#MikeRRMugRecordButton").text("Recorded!");
                                            }
                                            else{
                                                $("#MikeRRMugRecordButton").text("Error: " + json.error);
                                            }
                                            $("#MikeRRMugRecordButton").prop("disabled", true);
                                        }
                                    },
                                    onerror: function(err){
                                        $("#MikeRRMugRecordButton").text("Error: " + err);
                                        $("#MikeRRMugRecordButton").prop("disabled", true);
                                    }
                                });
                            });
                        }
                    }
                }
                return;
            }
        });
    }
});

function intAbbreviation(value){
    var valueLength = value.toString().length;
    if(valueLength > 9){
        return Math.round(value / 1000000000 * 100) / 100 + "b";
    }
    else if(valueLength > 6){
        return Math.round(value / 1000000 * 100) / 100 + "m";
    }
    else if(valueLength > 3){
        return Math.round(value / 1000 * 100) / 100 + "k";
    }
    else{
        return value;
    }
}

function timeDifferenceSOrM(current, previous){
    var difference = current - previous;
    if(difference < 1000){
        return "0s";
    }
    if(difference < 60000){
        return Math.floor(difference / 1000) + "s";
    }
    return Math.floor(difference / 60000) + "m";
}

function timeDifferenceSAndM(current, previous){
    var difference = current - previous;
    if(difference < 1000){
        return "<span style='color:red'>0s</span>";
    }
    if(difference < 60000){
        return "<span style='color:red'>" + Math.floor(difference / 1000) + "s</span>";
    }
    var mins = Math.floor(difference / 60000);
    var secs = Math.floor((difference - mins * 60000) / 1000);
    return mins + "m " + secs + "s";
}

function timeDifferenceSubS(current, previous){
    var difference = current - previous;
    return (difference / 1000).toFixed(2) + "s";
}