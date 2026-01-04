// ==UserScript==
// @name         Grundos.cafe - RE Timer w Logger
// @namespace    https://greasyfork.org/users/748951
// @version      v1.1.3
// @description  Timer, reminder, and counter for random events (modified from npc timer)
// @author       ben (mushroom), exarch, alexa, dani (Mousekat), zelle
// @include      *grundos.cafe/*
// @exclude      https://www.grundos.cafe/~*
// @exclude      https://www.grundos.cafe/guilds*
// @noframes
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448904/Grundoscafe%20-%20RE%20Timer%20w%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/448904/Grundoscafe%20-%20RE%20Timer%20w%20Logger.meta.js
// ==/UserScript==

//Storgage
var storage;
localStorage.getItem("BENPETSRElogger==") != null ? storage = JSON.parse(localStorage.getItem("BENPETSRElogger==")) : storage = {re_count: 0, rf_count: 0, re_time: "N/A", all_re: ["Random Events log started. New REs will appear above this notice."]};

//Change Hex Codes to Change Colors
var dontRefresh = '#EBB8DA';
var soon = '#EBB8DA';
var sooner = '#EBB8DA';
var refresh = '#EBB8DA';

//Triggers
var page_html = document.body.innerHTML;
storage.rf_count++;
localStorage.setItem("BENPETSRElogger==", JSON.stringify(storage));
console.log(storage.rf_count + " refreshes total!");

if(page_html.indexOf("Something has happened!") !== -1 || page_html.indexOf("Winter Random Event!!!") !== -1 || page_html.indexOf("Tyrannian Random Event!!!") !== -1){
    console.log("Something has happened!");
    storage.re_count++;
    console.log(storage.re_count + " re's total!");
    storage.re_time = new Date().getTime();
    var humanReadableTime = new Date(storage.re_time).toLocaleString([], {timeZone: 'America/Vancouver', timeStyle: 'short'}); //display the epoch time as a string a human can read
    console.log("Last re at " + storage.re_time);
    storage.all_re.unshift("<b>" + humanReadableTime + "</b>:" + document.querySelector(".rtxt").innerText);
    localStorage.setItem("BENPETSRElogger==", JSON.stringify(storage));
}

//Containers
var timerContainer = document.createElement("div");
timerContainer.id = "timerContainer";

var reLog = document.createElement("div");
reLog.id = "reLog";

// When on any page with Neopets sidebar, add sidebar modules
    document.body.appendChild(timerContainer);
    document.body.appendChild(reLog);


//Clear Button
window.reset = function() {
    storage.re_count = 0;
    storage.all_re = ["---<br>Random Events log started. New REs will appear above this notice."];
    localStorage.setItem("BENPETSRElogger==", JSON.stringify(storage));
}

//Refresh Button
window.refresh = function() {
    window.location = "https://grundos-cafe.herokuapp.com/donations/" //<--- this one
}

// Choose one button, replace the one above (url can be changed)
//same tab url     -   window.location = "https://neopetsclassic.com/donations/"
//same tab relaod  -   location.reload(false);
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
    reLog.innerHTML = storage.all_re.join('<br>');

    //Styling
    var TimerStyle1 = "position:absolute;left:-2.5px;top:745px;width:127px;height:310px;color:#666666;font-size:10px;border: 2.5px solid #000;border-radius:0px 12px 12px 0px;text-transform: lowercase;letter-spacing: 1px;background:"
    var TimerStyle2 = ";padding-top:10px;padding-bottom:6px;text-align:center;"

    var LoggerStyle1 = "position:absolute;left:-2px;top:835px;width:109px;overflow-y:scroll;resize:vertical;height:200px;color:#666666;font-size:7.5px verdana;text-transform: lowercase;letter-spacing: 1px;background: #FFFFFF; font-size:10px;border: 2px solid #000;"
    var LoggerStyle2 = ";padding-top:6px;padding-bottom:6px;padding-left:6px;padding-right:6px;"

    var InnerHTML1 = "<button style = 'background-color:transparent;' onclick='refresh()'><font size=3>Refresh</font></button><br><br>"
    var InnerHTML2 = "<br><button style = 'background-color:transparent; border-color:transparent;' onclick='reset()'><font size=1>- Clear -</font></button>"

    //Conditionals
    if (timeSince > 60) {
        timerContainer.style = TimerStyle1 + dontRefresh + TimerStyle2;
        reLog.style = LoggerStyle1 + dontRefresh + LoggerStyle2;
        timerContainer.innerHTML = "Last RE:<br>" + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince >= 9) {
        timerContainer.style = TimerStyle1 + dontRefresh + TimerStyle2;
        reLog.style = LoggerStyle1 + dontRefresh + LoggerStyle2;
        timerContainer.innerHTML = "Last RE:<br>" + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince == 8) {
        timerContainer.style = TimerStyle1 + dontRefresh + TimerStyle2;
        reLog.style = LoggerStyle1 + dontRefresh + LoggerStyle2;
        timerContainer.innerHTML = "Last RE:<br>" + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince == 7) {
        timerContainer.style = TimerStyle1 + dontRefresh + TimerStyle2;
        reLog.style = LoggerStyle1 + dontRefresh + LoggerStyle2;
        timerContainer.innerHTML = "Last RE:<br>" + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince == 6) {
        timerContainer.style = TimerStyle1 + dontRefresh + TimerStyle2;
        reLog.style = LoggerStyle1 + dontRefresh + LoggerStyle2;
        timerContainer.innerHTML = "Last RE:<br>" + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else {
        timerContainer.style = TimerStyle1 + dontRefresh + TimerStyle2;
        reLog.style = LoggerStyle1 + dontRefresh + LoggerStyle2;
        timerContainer.innerHTML = "Last RE:<br>" + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
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