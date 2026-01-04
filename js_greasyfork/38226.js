// ==UserScript==
// @name         Backtime times in inc screen
// @version      0.5.1
// @description  New table column with backtimes if the attacks are labelled correctly (lcav, hcav, noble etc.)
// @author       FunnyPocketBook
// @match        https://*/game.php?village=*&screen=overview_villages&mode=incomings*
// @grant        none
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/38226/Backtime%20times%20in%20inc%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/38226/Backtime%20times%20in%20inc%20screen.meta.js
// ==/UserScript==
// Sorry for the ugly code, I don't know much about code/comment conventions
var table = document.querySelector("#incomings_table > tbody > tr:nth-child(1)");
var newBacktime = document.createElement("th"); // Table head for Backtime
newBacktime.setAttribute("style", "width:100px");
newBacktime.innerHTML = "Backtime";
table.appendChild(newBacktime);

var parentElement = document.querySelector("#paged_view_content > table.vis.modemenu");
var newUnitSpeed = document.createElement("input"); // Input field for unit speed
newUnitSpeed.setAttribute("placeholder", "Set unit speed");
newUnitSpeed.setAttribute("id", "unitSpeedId");
var newWorldSpeed = document.createElement("input"); // input field for world speed
newWorldSpeed.setAttribute("placeholder", "Set world speed");
newWorldSpeed.setAttribute("id", "worldSpeedId");
var newButton = document.createElement("button"); // OK button
newButton.setAttribute("id", "buttonSetSpeed");
newButton.setAttribute("class", "btn");
newButton.innerHTML = "OK";
parentElement.appendChild(newWorldSpeed);
parentElement.appendChild(newUnitSpeed);
parentElement.appendChild(newButton);

// Set unit speed to the saved unit speed if available
if (localStorage.getItem("unitSpeed") !== null) {
    newUnitSpeed.value = localStorage.getItem("unitSpeed");
}
// Set world speed to the saved world speed if available
if (localStorage.getItem("worldSpeed") !== null) {
    newWorldSpeed.value = localStorage.getItem("worldSpeed");
}

// Functions to let "enter" click the OK button
document.getElementById("unitSpeedId").addEventListener("keyup", function(event) {
    "use strict";
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("buttonSetSpeed").click();
    }
});
document.getElementById("worldSpeedId").addEventListener("keyup", function(event) {
    "use strict";
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("buttonSetSpeed").click();
    }
});

// Function to set what should be done when the OK button is clicked
document.getElementById("buttonSetSpeed").onclick = function setSpeed() {
    "use strict";
    var unitSpeed = parseFloat(document.getElementById("unitSpeedId").value);
    var worldSpeed = parseFloat(document.getElementById("worldSpeedId").value);
    localStorage.setItem("unitSpeed", unitSpeed);
    localStorage.setItem("worldSpeed", worldSpeed);
    localStorage.setItem("speed", parseFloat(localStorage.getItem("unitSpeed")) * parseFloat(localStorage.getItem("worldSpeed"))); // Set factor of unit speed
    backtimeRefresh();
};

backtimeCreate();

// Creates elements to put in the backtime times
function backtimeCreate() {
    "use strict";
    var tableLength = document.querySelector("#incomings_table > tbody").rows.length;
    // Make the bottom bar longer to make it look prettier
    if (document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)") !== null) {
        var bottomTh = document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)");
        bottomTh.setAttribute("colspan", "7");
    } else if (document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)") !== null) {
        var bottomTh1 = document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)");
        bottomTh1.setAttribute("colspan", "7");
    }

    // For every command, do
    for (var i = 2; i < tableLength; i++) {
        // Get attack names, remove any spaces and line breaks, make them lower case
        var attackName = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span > a:nth-child(1) > span.quickedit-label").innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/ /g, "").toLowerCase();

        // Get coordinates of origin and destination village
        var destination = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(2) > a").innerHTML.slice(-12).substr(0, 7);
        var origin = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(3) > a").innerHTML.slice(-12).substr(0, 7);

        // Get x and y of destination and origin
        var x1 = destination.substr(0, 3);
        var y1 = destination.slice(-3);
        var x2 = origin.substr(0, 3);
        var y2 = origin.slice(-3);

        // Calculate the exact distance between both villages
        var x = Math.abs(x1 - x2);
        var y = Math.abs(y1 - y2);
        x = x * x;
        y = y * y;
        var distance = Math.sqrt(x + y);

        var unitSpeedDefault;
        // Set the slowest unit speed based on the label of the attack
        if (attackName.includes("axe") || attackName.includes("spear") || attackName.includes("archer")) {
            unitSpeedDefault = 18;
        } else if (attackName.includes("sword")) {
            unitSpeedDefault = 22;
        } else if (attackName.includes("spy")) {
            unitSpeedDefault = 9;
        } else if (attackName.includes("lcav") || attackName.includes("marcher")) {
            unitSpeedDefault = 10;
        } else if (attackName.includes("hcav")) {
            unitSpeedDefault = 11;
        } else if (attackName.includes("ram") || attackName.includes("cat")) {
            unitSpeedDefault = 30;
        } else if (attackName.includes("noble")) {
            unitSpeedDefault = 35;
        }
        var unitSpeedReal = unitSpeedDefault / parseFloat(localStorage.getItem("speed")); // Minutes per field
        var time = unitSpeedReal * distance; // Duration of the attack in minutes
        time = convertToTime(time); // Convert the minutes to a string in the format HH:MM:SS
        // Get the arrival time
        var incTime = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(6)").innerText;
        var subIncTime = incTime.slice(-12);
        subIncTime = subIncTime.substring(0, 8);
        var backtime = calculate(subIncTime, time); // Calculate the time when the troops of the attacker are back at his village
        // Create td to put in the backtime time
        var backtimeTd = document.createElement("td");
        backtimeTd.setAttribute("id", "backtimeTd" + i);
        backtimeTd.innerHTML = backtime;
        var tr = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ")");
        tr.appendChild(backtimeTd);
        // If no world speed or unit speed is given, the backtime will show "Please enter the unit speed and world speed"
        // If the attack is labelled incorrectly, the backtime will show "Please label the incoming attack correctly"
        if (localStorage.getItem("unitSpeed") === "NaN" || localStorage.getItem("unitSpeed") === null || localStorage.getItem("worldSpeed") === "NaN" || localStorage.getItem("worldSpeed") === null) {
            document.getElementById("backtimeTd" + i).innerHTML = "Please enter the unit speed and world speed";
        } else if (attackName !== "axe" && attackName !== "spear" && attackName !== "archer" && attackName !== "sword" && attackName !== "spy" && attackName !== "lcav" && attackName !== "marcher" && attackName !== "hcav" && attackName !== "ram" && attackName !== "cat" && attackName !== "noble") {
            document.getElementById("backtimeTd" + i).innerHTML = "Please label the incoming attack correctly";
        }
    }
}

// Pretty much exactly the same as backtimeCreate, except it doesn't create any elements but only updates the time
function backtimeRefresh() {
    "use strict";
    var tableLength = document.querySelector("#incomings_table > tbody").rows.length;
    for (var i = 2; i < tableLength; i++) {
        var attackName = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span > a:nth-child(1) > span.quickedit-label").innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/ /g, "").toLowerCase();

        var destination = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(2) > a").innerHTML.slice(-12).substr(0, 7);
        var origin = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(3) > a").innerHTML.slice(-12).substr(0, 7);

        var x1 = destination.substr(0, 3);
        var y1 = destination.slice(-3);
        var x2 = origin.substr(0, 3);
        var y2 = origin.slice(-3);

        var x = Math.abs(x1 - x2);
        var y = Math.abs(y1 - y2);
        x = x * x;
        y = y * y;
        var distance = Math.sqrt(x + y);


        var unitSpeedDefault;
        if (attackName.includes("axe") || attackName.includes("spear") || attackName.includes("archer")) {
            unitSpeedDefault = 18;
        } else if (attackName.includes("sword")) {
            unitSpeedDefault = 22;
        } else if (attackName.includes("spy")) {
            unitSpeedDefault = 9;
        } else if (attackName.includes("lcav") || attackName.includes("marcher")) {
            unitSpeedDefault = 10;
        } else if (attackName.includes("hcav")) {
            unitSpeedDefault = 11;
        } else if (attackName.includes("ram") || attackName.includes("cat")) {
            unitSpeedDefault = 30;
        } else if (attackName.includes("noble")) {
            unitSpeedDefault = 35;
        }
        var unitSpeedReal = unitSpeedDefault / parseFloat(localStorage.getItem("speed"));
        var time = unitSpeedReal * distance;
        time = convertToTime(time);

        var incTime = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(6)").innerText;
        var subIncTime = incTime.slice(-12);
        subIncTime = subIncTime.substring(0, 8);
        var backtime = calculate(subIncTime, time);

        document.getElementById("backtimeTd" + i).innerHTML = backtime;

        if (localStorage.getItem("unitSpeed") === "NaN" || localStorage.getItem("unitSpeed") === null || localStorage.getItem("worldSpeed") === "NaN" || localStorage.getItem("worldSpeed") === null) {
            document.getElementById("backtimeTd" + i).innerHTML = "Please enter the unit speed and world speed";
        } else if (attackName !== "axe" && attackName !== "spear" && attackName !== "archer" && attackName !== "sword" && attackName !== "spy" && attackName !== "lcav" && attackName !== "marcher" && attackName !== "hcav" && attackName !== "ram" && attackName !== "cat" && attackName !== "noble") {
            document.getElementById("backtimeTd" + i).innerHTML = "Please label the incoming attack correctly";
        }
    }
}

// Convert minutes to HH:MM:SS
function convertToTime(duration) {
    "use strict";
    var seconds = (duration - parseInt(duration)) * 60;
    seconds = Math.round(seconds);
    duration = parseInt(duration);
    var minutes = duration % 60;
    duration = duration - minutes;
    var hours = duration / 60;
    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
}

// Add two times 
function calculate(time1, time2) {
    "use strict";
    var time1Split = time1.split(":");
    var time2Split = time2.split(":");
    var s1 = parseInt(time1Split[2]);
    var m1 = parseInt(time1Split[1]);
    var h1 = parseInt(time1Split[0]);
    var s2 = parseInt(time2Split[2]);
    var m2 = parseInt(time2Split[1]);
    var h2 = parseInt(time2Split[0]);
    var s = s1 + s2;
    var m = m1 + m2;
    var h = h1 + h2;
    if (s >= 60) {
        s = s - 60;
        m = m + 1;
    }
    if (m >= 60) {
        m = m - 60;
        h = h + 1;
    }
    var days = 0;
    while (h >= 24) {
        h = h - 24;
        days++;
    }
    var hr = h;
    var min = m;
    var sec = s;
    var day;
    if (days === 0) {
        day = "same day as arrival at ";
    } else if (days === 1) {
        day = "one day after arrival at ";
    } else {
        day = days + " days after arrival at ";
    }
    hr = ("0" + hr).slice(-2);
    min = ("0" + min).slice(-2);
    sec = ("0" + sec).slice(-2);
    return day + hr + ":" + min + ":" + sec;
}