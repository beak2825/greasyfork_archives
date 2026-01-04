// ==UserScript==
// @name         NPC - RE Timer Logger
// @namespace
// @version      0.2
// @description  Timer, reminder, and counter for random events
// @author       ben (mushroom), exarch, alexa, dani (Mousekat), zelle / Customized by an Asher (sidefury)
// @include      https://neopetsclassic.com/*
// @include      https://www.neopetsclassic.com/*
// @noframes
// @grant        none
// @namespace https://greasyfork.org/users/799416
// @downloadURL https://update.greasyfork.org/scripts/430820/NPC%20-%20RE%20Timer%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/430820/NPC%20-%20RE%20Timer%20Logger.meta.js
// ==/UserScript==

//Storage
var storage;
localStorage.getItem("RElogger==") != null ? storage = JSON.parse(localStorage.getItem("RElogger==")) : storage = {re_count: 0, rf_count: 0, re_time: "N/A", all_re: ["-<br>RE log started."]};

//Colors
var dontRefresh = '#666';
var soon = '#666';
var sooner = '#666';
var refresh = '#ffce02';

//Trigger
var page_html = document.body.innerHTML;
storage.rf_count++;
localStorage.setItem("RElogger==", JSON.stringify(storage));
console.log(storage.rf_count + " refreshes total!");

if(page_html.indexOf("Something has happened!") !== -1){
    console.log("Something has happened!");
    storage.re_count++;
    console.log(storage.re_count + " re's total!");
    if ((page_html.indexOf("as an avatar on the") === -1) && (page_html.indexOf("mixed in with your reward!") === -1)) {
        storage.re_time = new Date().getTime();
    }
    var humanReadableTime = new Date(storage.re_time).toLocaleString([], {timeZone: 'PST', timeStyle: 'short'}); //display the epoch time as a string a human can read
    console.log("Last re at " + storage.re_time);
    storage.all_re.unshift("<b>" + humanReadableTime + "</b>:" + document.querySelector(".txt").innerHTML);
    localStorage.setItem("RElogger==", JSON.stringify(storage));
}

//Containers
var reTimerContainer = document.createElement("div");
reTimerContainer.id = "reTimerContainer";
var reLog = document.createElement("div");
reLog.id = "reLog";

// When on any page with Neopets sidebar, add sidebar modules
if (document.getElementsByName("a").length > 0) {
    document.body.appendChild(reTimerContainer);
    document.body.appendChild(reLog);
}

//Clear Button
window.reset = function() {
    storage.re_count = 0;
    storage.all_re = ["-<br>RE log started."];
    localStorage.setItem("RElogger==", JSON.stringify(storage));
}

//Refresh Button
window.refresh = function() {
    location.reload(false); //<--- this one
}

// Choose one button, replace the one above (url can be changed)
//same tab url     -   window.location = "https://neopetsclassic.com/donations/"
//same tab reload  -   location.reload(false);
//new tab url      -   window.open('https://neopetsclassic.com/donations/', '_blank');

//Repeating---------------------------------------------------------------------------S:-checkTime
function checkTime() {

    //Time Variables
    var lastRE = storage.re_time; // get last RE time in epoch time
    var timeNow = new Date().getTime(); // get time now in epoch time
    var timeSince = (timeNow - lastRE) / 60000; // convert milliseconds to minutes
    timeSince = Math.round(timeSince); // round the minutes
    var humanTime = new Date(lastRE).toLocaleString(); //display the epoch time as a string a human can read
    var timeUntil = (8 - timeSince);
    var timeOver = (timeSince - 8);
    //Random Event log
    reLog.innerHTML = storage.all_re.join('<br>-<br>');

    var timerStyleStart = "position: absolute; top: 937px; width: 118; font-size: 11px; color: #000; text-align: center; padding: 6px; padding-top: 40px; border-radius: 0px 10px 10px 0px; background:"
    var reLogStyleStart = "position: absolute; top: 757px; left: -2px; width: 116; height: 200px; overflow-y: auto; text-align: left; padding: 6px; border-radius: 0px 10px 10px 0px; border: 2px solid"
    var buttonStyle = "font-size: 11px; background-color: transparent; border-radius: 2px; border: 1px solid black;"
    var styleEnd = ";"

    //Conditionals
    if (timeSince > 60) {
        reTimerContainer.style = timerStyleStart + refresh + styleEnd;
        reLog.style = reLogStyleStart + refresh + styleEnd;
        reTimerContainer.innerHTML = "<button style='" + buttonStyle + "' onclick='refresh()'>RF Now!</button><br> (ﾉ◕ヮ◕)ﾉ*･ﾟ✧ <br> Tally: " + storage.re_count + " <font size='1' style='float: right' onclick='reset()'>✖</font>";
    }
    else if(timeSince >= 9) {
        reTimerContainer.style = timerStyleStart + refresh + styleEnd;
        reLog.style = reLogStyleStart + refresh + styleEnd;
        reTimerContainer.innerHTML = "<button style='" + buttonStyle + "' onclick='refresh()'>RF Now!</button><br> Overtime: " + timeOver + "m <br> Tally: " + storage.re_count + " <font size='1' style='float: right' onclick='reset()'>✖</font>";
    }
    else if(timeSince == 8) {
        reTimerContainer.style = timerStyleStart + refresh + styleEnd;
        reLog.style = reLogStyleStart + refresh + styleEnd;
        reTimerContainer.innerHTML = "<button style='" + buttonStyle + "' onclick='refresh()'>RF Now!</button><br> Next RE: Ready! <br> Tally: " + storage.re_count + " <font size='1' style='float: right' onclick='reset()'>✖</font>";
    }
    else if(timeSince == 7) {
        reTimerContainer.style = timerStyleStart + sooner + styleEnd;
        reLog.style = reLogStyleStart + sooner + styleEnd;
        reTimerContainer.innerHTML = "Next RE in " + timeUntil + "m <br> Tally: " + storage.re_count + " <font size='1' style='float: right' onclick='reset()'>✖</font>";
    }
    else if(timeSince == 6) {
        reTimerContainer.style = timerStyleStart + soon + styleEnd;
        reLog.style = reLogStyleStart + soon + styleEnd;
        reTimerContainer.innerHTML = "Next RE in " + timeUntil + "m <br> Tally: " + storage.re_count + " <font size='1' style='float: right' onclick='reset()'>✖</font>";
    }
    else {
        reTimerContainer.style = timerStyleStart + dontRefresh + styleEnd;
        reLog.style = reLogStyleStart + dontRefresh + styleEnd;
        reTimerContainer.innerHTML = "Next RE in " + timeUntil + "m <br> Tally: " + storage.re_count + " <font size='1' style='float: right' onclick='reset()'>✖</font>";
    }
}

//(Repeating)---------------------------------------------------------------------------E:-checkTime

(function(){
    "use strict";

    //first check
    checkTime()

    //refresh every 1 seconds
    setInterval(checkTime, 1000);

})();