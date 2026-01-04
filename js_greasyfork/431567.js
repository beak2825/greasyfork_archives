// ==UserScript==
// @name         NPC - Main Timers
// @namespace
// @version      0.35
// @description  Timerz for recurring things
// @author       ben (mushroom), alexa, dani (Mousekat) / Customized by an Asher (sidefury)
// @include      https://neopetsclassic.com/*
// @include      https://www.neopetsclassic.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @noframes
// @namespace https://greasyfork.org/users/799416
// @downloadURL https://update.greasyfork.org/scripts/431567/NPC%20-%20Main%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/431567/NPC%20-%20Main%20Timers.meta.js
// ==/UserScript==

//Storage
var storage;
localStorage.getItem("MTlogger==") != null ? storage = JSON.parse(localStorage.getItem("MTlogger==")) : storage = {cz_time: "N/A", sc_time: "N/A", woe_time: "N/A", hs_time: "N/A", display: true, students: {}};

// Colours
var cznotReady = "#666";
var czready = "#eec114";
var scnotReady = "#666";
var scready = "#0AA3DC";
var woenotReady = "#666";
var woeready = "#15A3A3";
var hsnotReady = "#666";
var hsready = "#2D79D0";

//Begin Code
var currentPage = window.location.href;
var pageHTML = document.body.innerHTML;
var content = document.getElementsByClassName("content")[0];
var currentDate = new Date();

//Triggers
var page_html = document.body.innerHTML;
localStorage.setItem("MTlogger==", JSON.stringify(storage));

if(page_html.indexOf("walks slowly up to the strange shrine...") !== -1){
    storage.cz_time = new Date().getTime();
    localStorage.setItem("MTlogger==", JSON.stringify(storage));
}

if(page_html.indexOf("Thanks for buying a scratchcard!") !== -1){
    storage.sc_time = new Date().getTime();
    localStorage.setItem("MTlogger==", JSON.stringify(storage));
}

if(page_html.indexOf("Thanksss for buying a ssscratchcard") !== -1){
    storage.sc_time = new Date().getTime();
    localStorage.setItem("MTlogger==", JSON.stringify(storage));
}

if(page_html.indexOf("The Water Faerie says a few magical words and...") !== -1){
    storage.hs_time = new Date().getTime();
    localStorage.setItem("MTlogger==", JSON.stringify(storage));
}

// Wheel of excitement
$('form[action="/faerieland/wheel/"').submit(function( event ) {
  event.preventDefault();
  storage.woe_time = new Date().getTime();
  localStorage.setItem("MTlogger==", JSON.stringify(storage));
  this.submit();
});

//Time Variables
var timeNow = new Date().getTime();

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
}

var lastCZ = storage.cz_time; // get last SC time in epoch time
var lastSC = storage.sc_time; // get last SC time in epoch time
var lastHS = storage.hs_time; // get last HS time in epoch time
var lastWOE = storage.woe_time; // get last WOE time in epoch time
var timeSinceCZ = (timeNow - lastCZ) / 60000; // convert milliseconds to minutes
    timeSinceCZ = Math.round(timeSinceCZ); // round the minutes
var timeSinceSC = (timeNow - lastSC) / 60000; // convert milliseconds to minutes
    timeSinceSC = Math.round(timeSinceSC); // round the minutes
var timeSinceHS = (timeNow - lastHS) / 60000; // convert milliseconds to minutes
    timeSinceHS = Math.round(timeSinceHS); // round the minutes
var timeSinceWOE = (timeNow - lastWOE) / 60000; // convert milliseconds to minutes
    timeSinceWOE = Math.round(timeSinceWOE); // round the minutes
var humanTimeCZ = new Date(lastCZ).toLocaleString(); //display the epoch time as a string a human can read
var humanTimeSC = new Date(lastSC).toLocaleString(); //display the epoch time as a string a human can read
var humanTimeHS = new Date(lastHS).toLocaleString(); //display the epoch time as a string a human can read
var humanTimeWOE = new Date(lastWOE).toLocaleString(); //display the epoch time as a string a human can read
var timeUntilCZ = (720 - timeSinceCZ);
var timeUntilSC = (240 - timeSinceSC);
var timeUntilSC2 = (120 - timeSinceSC);
var timeUntilHS = (30 - timeSinceHS);
var timeUntilWOE = (120 - timeSinceWOE);

// Containers
var CZtimerContainer = document.createElement("div");
CZtimerContainer.id = "CZtimerContainer";

var SCtimerContainer = document.createElement("div");
SCtimerContainer.id = "SCtimerContainer";

var SC2timerContainer = document.createElement("div");
SC2timerContainer.id = "SC2timerContainer";

var WOEtimerContainer = document.createElement("div");
WOEtimerContainer.id = "WOEtimerContainer";

var HStimerContainer = document.createElement("div");
HStimerContainer.id = "HStimerContainer";

//Time Checking - ALSO CHECK LINE 258 IF YOU ARE ADDING NEW CONTAINER hi
function checkTime() {
    //Coltzan
    if (timeSinceCZ >= 720) {
        CZtimerContainer.style = "position:absolute;left:780;top:100;width:97;background:" + czready + ";padding:3px;font-size:11px;border-radius:5px;";
        CZtimerContainer.innerHTML = "<a href=/desert/shrine/ style='color:#333;'>CZ</a> <b>Ready!<b>";
    } else if (timeUntilCZ <= 60) {
        CZtimerContainer.style = "position:absolute;left:780;top:100;width:97;background:" + cznotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        CZtimerContainer.innerHTML = "<a href=/desert/shrine/ style='color:#CCC;'>CZ</a> " + timeUntilCZ + "m";
    } else {
        CZtimerContainer.style = "position:absolute;left:780;top:100;width:97;background:" + cznotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        CZtimerContainer.innerHTML = "<a href=/desert/shrine/ style='color:#CCC;'>CZ</a> " + (timeConvert(timeUntilCZ));
    }
    //Scratchies - Kiosk
    if (timeSinceSC >= 240) {
        SCtimerContainer.style = "position:absolute;left:780;top:130;width:45;background:" + scready + ";padding:3px;font-size:11px;border-radius:5px;";
        SCtimerContainer.innerHTML = "<a href=/winter/kiosk/ style='color:#333;'>SC</a> <b>Ready!</b>";
    } else if (timeUntilSC <= 60) {
        SCtimerContainer.style = "position:absolute;left:780;top:130;width:45;background:" + scnotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        SCtimerContainer.innerHTML = "<a href=/winter/kiosk/ style='color:#CCC;'>SC</a> <br>" + timeUntilSC + "m";
    } else {
        SCtimerContainer.style = "position:absolute;left:780;top:130;width:45;background:" + scnotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        SCtimerContainer.innerHTML = "<a href=/winter/kiosk/ style='color:#CCC;'>SC</a> <br>" + (timeConvert(timeUntilSC));
    }
    //Scratchies - Deserted Fairground
    if (timeSinceSC >= 120) {
        SC2timerContainer.style = "position:absolute;left:832;top:130;width:45;background:" + scready + ";padding:3px;font-size:11px;border-radius:5px;";
        SC2timerContainer.innerHTML = "<a href=/halloween/scratch style='color:#333;'>DF</a> <b>Ready!</b>";
    } else if (timeUntilSC <= 60) {
        SC2timerContainer.style = "position:absolute;left:832;top:130;width:45;background:" + scnotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        SC2timerContainer.innerHTML = "<a href=/halloween/scratch style='color:#CCC;'>DF</a> <br>" + timeUntilSC2 + "m";
    } else {
        SC2timerContainer.style = "position:absolute;left:832;top:130;width:45;background:" + scnotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        SC2timerContainer.innerHTML = "<a href=/halloween/scratch style='color:#CCC;'>DF</a> <br>" + (timeConvert(timeUntilSC2));
    }
    //Wheel of Excitement
    if (timeSinceWOE >= 120) {
        WOEtimerContainer.style = "position:absolute;left:780;top:173;width:97;background:" + woeready + ";padding:3px;font-size:11px;border-radius:5px;";
        WOEtimerContainer.innerHTML = "<a href=/faerieland/wheel/ style='color:#333;'>WoE</a> <b>Ready!</b>";
    } else if (timeUntilWOE <= 60) {
        WOEtimerContainer.style = "position:absolute;left:780;top:173;width:97;background:" + woenotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        WOEtimerContainer.innerHTML = "<a href=/faerieland/wheel/ style='color:#CCC;'>WoE</a> " + timeUntilWOE + "m";
    } else {
        WOEtimerContainer.style = "position:absolute;left:780;top:173;width:97;background:" + woenotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        WOEtimerContainer.innerHTML = "<a href=/faerieland/wheel/ style='color:#CCC;'>WoE</a> " + (timeConvert(timeUntilWOE));
    }
    //Healing Springs
    if (timeSinceHS >= 30) {
        HStimerContainer.style = "position:absolute;left:780;top:203;width:97;background:" + hsready + ";padding:3px;font-size:11px;border-radius:5px;";
        HStimerContainer.innerHTML = "<a href=/faerieland/springs/ style='color:#333;'>HS</a> <b>Restored!<b>";
    } else {
        HStimerContainer.style = "position:absolute;left:780;top:203;width:97;background:" + hsnotReady + ";padding:3px;font-size:11px;border-radius:5px;";
        HStimerContainer.innerHTML = "<a href=/faerieland/springs/ style='color:#CCC;'>HS</a> " + timeUntilHS + "m";
    }

    // Training School
    // Loop through students in storage
    var newDate = new Date();

    for (var student in storage.students) {
        // get name, parse date, update content of
        let studentName = student;
        var endDate = new Date(storage.students[student].timeToCompletion);
        var timeString;
        if (!isNaN(Date.parse(endDate))) {
            var h = Math.floor((endDate - newDate) / (1000 * 60 * 60));
            var m = Math.floor(((endDate - newDate) % (1000 * 60 * 60)) / (1000 * 60));
            var s = Math.floor(((endDate - newDate) % (1000 * 60)) / (1000));
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);
            if (s >= 0) {
                timeString = h + ":" + m + ":" + s;
            } else {
                timeString = "Course Finished!";
            }
        } else {
            timeString = storage.students[student].timeToCompletion;
        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i
            };
            return i;
        }
        document.getElementById(studentName + "_ttc").innerText = timeString;
    }
}

//Training School Conditionals
(function() {
    'use strict';
    if (currentPage == "https://neopetsclassic.com/island/training/status/" | "https://neopetsclassic.com/pirates/academy/status/") {
        var petTables = content.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        var numOfPets = petTables.length / 2;
        var petNames = [];
        for (var i = 0; i < numOfPets; i++) {
            var courseInfo = petTables[2 * i].getElementsByTagName("td")[0].getElementsByTagName("b")[0].innerText.split(" ");
            petNames.push(courseInfo[0]);
            if (courseInfo[courseInfo.length - 1] == "course") {
                console.log(courseInfo[0] + " not on a course");
                delete storage.students[courseInfo[0]];
            } else {
                var timeToCompletion = petTables[2 * i + 1].getElementsByTagName("td")[1].getElementsByTagName("b")[0].innerText;
                if (timeToCompletion.indexOf("Codestone") > 0) {
                    storage.students[courseInfo[0]] = {
                        currentCourse: courseInfo[courseInfo.length - 1],
                        timeToCompletion: timeToCompletion
                    };
                } else if (timeToCompletion == "Course Finished!") {
                    storage.students[courseInfo[0]] = {
                        currentCourse: courseInfo[courseInfo.length - 1],
                        timeToCompletion: timeToCompletion
                    };
                } else {
                    var re = /\d+/g;
                    var timeParts = [...timeToCompletion.matchAll(re)];
                    console.log(timeParts[0] * 60 * 60 * 1000 + timeParts[1] * 60 * 1000 + timeParts[2] * 1000);
                    var endTime = new Date(currentDate.getTime() + timeParts[0] * 60 * 60 * 1000 + timeParts[1] * 60 * 1000 + timeParts[2] * 1000)
                    storage.students[courseInfo[0]] = {
                        currentCourse: courseInfo[courseInfo.length - 1],
                        timeToCompletion: endTime
                    };
                }
            }
        }
        for (var st in storage.students) {
            var matchExists = 0;
            for (var j = 0; j < petNames.length; j++) {
                if (petNames[j] == st) {
                    matchExists = 1;
                }
            }
            if (matchExists == 0) {
                delete storage.students[st];
            } else if (st == "Αστέρι") {
                delete storage.students[st];
            }
        }
        localStorage.setItem("MTlogger==", JSON.stringify(storage));
    }

// When on any page with Neopets sidebar, add sidebar modules
    if (document.getElementsByName("a").length > 0) {

        document.body.appendChild(CZtimerContainer);
        document.body.appendChild(SCtimerContainer);
        document.body.appendChild(SC2timerContainer);
        document.body.appendChild(WOEtimerContainer);
        document.body.appendChild(HStimerContainer);

        var trainingModule = `<div style="position:absolute;left:780;top:233;width:97;background-color:#1A8733;padding:3px;font-size:10px;border-radius: 5px;">`
		var studentCount = 0;
        history.scrollRestoration = 'auto';

        // Loop through students in storage
        for (var student in storage.students) {
            let studentName = student;
            let currentCourse = storage.students[student].currentCourse;
            var endDate = new Date(storage.students[student].timeToCompletion);
            var timeString;
            if (!isNaN(Date.parse(endDate))) {
                if (Date.parse(endDate) > currentDate) {
                    var h = Math.floor((endDate - currentDate) / (1000 * 60 * 60));
                    var m = Math.floor(((endDate - currentDate) % (1000 * 60 * 60)) / (1000 * 60));
                    var s = Math.floor(((endDate - currentDate) % (1000 * 60)) / (1000));
                    h = checkTime(h);
                    m = checkTime(m);
                    s = checkTime(s);
                    if (s >= 0) {
                        timeString = h + ":" + m + ":" + s;
                        trainingModule = `<div style="position:absolute;left:780;top:233;width:97;background-color:#666;padding:3px;font-size:10px;border-radius: 5px;">`
					} else {
                        timeString = "Course Finished!";
                    }
                }
            } else {
                timeString = storage.students[student].timeToCompletion;
            }

            function checkTime(i) {
                if (i < 10) {
                    i = "0" + i
                };
                return i;
            }
            var trainingModulePart = `<a href=/island/training/status/ style='color:#CCC'>TS</a>/<a href=/pirates/academy/status/ style='color:#CCC'>SA</a><br><b>${student}</b> - <i>${currentCourse}</i><br><span id="${student}_ttc">${timeString}</span>`
			trainingModule = trainingModule + trainingModulePart;
            studentCount++;
        }
        if (studentCount == 0) {
            trainingModule = trainingModule + `<a href=/island/training/status/ style='color:#CCC'>TS</a>/<a href=/pirates/academy/status/ style='color:#CCC'>SA</a><br>No pet in training`;
        }
        trainingModule = trainingModule + `</div>`;
        document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", trainingModule)

        //first check
        checkTime()
        //refresh every 5 seconds
        setInterval(checkTime, 5000);
    }
})();