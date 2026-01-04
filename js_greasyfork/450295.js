// ==UserScript==
// @name         Grundos.cafe - RE Timer w Toggle
// @namespace    https://greasyfork.org/users/748951
// @version      v2.4
// @description  Timer, reminder, and counter for random events (modified from npc timer)
// @author       ben (mushroom), exarch, alexa, dani (Mousekat), zelle
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/userlookup/*
// @exclude      https://www.grundos.cafe/petlookup/?pet_name=*
// @noframes
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450295/Grundoscafe%20-%20RE%20Timer%20w%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/450295/Grundoscafe%20-%20RE%20Timer%20w%20Toggle.meta.js
// ==/UserScript==
/* globals $ */

//change this to you main pets name, capitalization is important
var petname = "Sprocket";

//change icons here
var petnameicon = "🐺";
var quickstockicon = "✨";
var SDBicon = "🎁";
var REicon = "<button style = 'background-color:transparent; border:none;' id='view'>❓</button>";

//to change the location chage the values for top and left below

//code
var link ="<a href='/setactivepet/?pet_name=" + petname + "'>" + petnameicon +
    "</a> <a href='/quickstock/'>" + quickstockicon +
    "</a> <a href='/safetydeposit/'>" + SDBicon +
    "</a>" + REicon;

if (document.getElementById("userinfo")) {

    var PPNContainer = document.createElement("div");
    PPNContainer.id = "PPNContainer";
    document.querySelector("#aio_sidebar > div:first-child").prepend(PPNContainer);
    PPNContainer.innerHTML ="<p style='font-size: 13px'>" + link + "</style>";
    PPNContainer.style = `
    background:transparent;
    color:#00000;
    text-align:center;
    width: 100%;
    margin: 0px;
    height: 20px;
`;
}

//Storgage
var storage;
localStorage.getItem("BENPETSRElogger==") != null ? storage = JSON.parse(localStorage.getItem("BENPETSRElogger==")) : storage = {re_count: 0, rf_count: 0, re_time: "N/A", all_re: ["Random Events log started. New REs will appear above this notice."]};

//Change Hex Codes to Change Colors
var dontRefresh = '#E0D4FC';
var soon = '#D4DDFC';
var sooner = '#D4F1FC';
var refresh = '#D4FCE0';

//Triggers
var page_html = document.body.innerHTML;
storage.rf_count++;
localStorage.setItem("BENPETSRElogger==", JSON.stringify(storage));
console.log(storage.rf_count + " refreshes total!");

const randomEvent = document.querySelector(".re_text")
if (randomEvent) { // if there is an re on the page
    randomEvent.innerText // do something with it
    console.log("Something has happened!");
    storage.re_count++;
    console.log(storage.re_count + " re's total!");
    storage.re_time = new Date().getTime();
    var humanReadableTime = new Date(storage.re_time).toLocaleString([], {timeZone: 'America/Vancouver', timeStyle: 'short'}); //display the epoch time as a string a human can read
    console.log("Last re at " + storage.re_time);
    storage.all_re.unshift("<b>" + humanReadableTime + "</b>:" + document.querySelector(".re_text").innerText);
    localStorage.setItem("BENPETSRElogger==", JSON.stringify(storage));
}

//Containers
var timerContainer = document.createElement("div");
timerContainer.id = "timerContainer";

var reLog = document.createElement("div");
reLog.id = "reLog";

// When on any page with Neopets sidebar, add sidebar modules
if (document.getElementById("userinfo")) {
    document.querySelector("#aio_sidebar").append(timerContainer);
    document.body.appendChild(reLog);
}

//Clear Button
window.reset = function() {
    storage.re_count = 0;
    storage.all_re = ["---<br>Random Events log started. New REs will appear above this notice."];
    localStorage.setItem("BENPETSRElogger==", JSON.stringify(storage));
};

//Refresh Button
window.refresh = function() {
    window.location = "https://www.grundos.cafe/donations/"; //<--- this one
};

//toggle the reLog
function toggleLog() {
    var x = document.getElementById("reLog");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// Choose one button, replace the one above (url can be changed)
//same tab url     -   window.location = "https://neopetsclassic.com/donations/"
//same tab relaod  -   location.reload(false);
//new tab url      -   window.open('https://neopetsclassic.com/donations/', '_blank');

//Random Event log
reLog.innerHTML = "<p style='font-size: 13px; color:#666;'>" + storage.all_re.join('<br>') + "</font>";

//Styling
var TimerStyle1 = "width:auto;padding:5px;height:100px;color:#121212;font-size:10px;border-radius:25px;text-transform: lowercase;letter-spacing: 1px;z-index:0;background:";
var TimerStyle2 = ";padding-top:10px;padding-bottom:6px;text-align:center;"

var InnerHTML1 = "</style><center><button style = 'color:#666;cursor: pointer;border:0px;border-radius:25px;width:50px;' onclick='refresh()' id='refresh'><font size=1>Refresh</font></button></center><br>";
var InnerHTML2 = "<br><br><center><button style = 'color:#666;cursor: pointer;border:0px;border-radius:25px;width:70px;' onclick='reset()' id='clear'><font size=1>Clear Log</i></font></center></button>";

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
    //Conditionals
    if (timeSince > 60) {
        timerContainer.style = TimerStyle1 + refresh + TimerStyle2;
        timerContainer.innerHTML = InnerHTML1 + "Last RE: " + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince >= 6) {
        timerContainer.style = TimerStyle1 + refresh + TimerStyle2;
        timerContainer.innerHTML = InnerHTML1 + "Last RE: " + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince == 5) {
        timerContainer.style = TimerStyle1 + sooner + TimerStyle2;
        timerContainer.innerHTML = InnerHTML1 + "Last RE: " + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince == 4) {
        timerContainer.style = TimerStyle1 + soon + TimerStyle2;
        timerContainer.innerHTML = InnerHTML1 + "Last RE: " + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else if(timeSince == 3) {
        timerContainer.style = TimerStyle1 + soon + TimerStyle2;
        timerContainer.innerHTML = InnerHTML1 + "Last RE: " + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    else {
        timerContainer.style = TimerStyle1 + dontRefresh + TimerStyle2;
        timerContainer.innerHTML = InnerHTML1 + "Last RE: " + timeSince + "m<br><br>Tally: " + storage.re_count + InnerHTML2;
    }
    document.querySelector("#view").addEventListener("click", toggleLog);
}

//Append CSS to the page
let customCSS = `
    #TimerContainer {
       display: flex;
       align-content: right;
       justify-content: center;
       flex-direction: column;
       padding: 0px;
        }

    #reLog {
        display: none;
        width: 950px;
        height: 300px;
        overflow: auto;
        position: fixed;
        bottom: 0px;
        left: 0px;
        background-color: #D4DDFC;
        border: 2px solid #DECAF5;
        padding: 0px 10px;
        z-index: 1;
        }
        #view {
        cursor: pointer;
        }
        #refresh, #clear {
        background-color:rgb(255,255,255,0.5);
        }
        #refresh:hover, #clear:hover {
        background-color: rgb(255,255,255,1);
        }

 `;

$("<style>").prop("type", "text/css").html(customCSS).appendTo("head");


//(Repeating)---------------------------------------------------------------------------E:-checkTime

(function(){
    "use strict";

    //first check
    checkTime();

    //refresh every 1 seconds
    setInterval(checkTime, 1000);

})();