// ==UserScript==
// @name         Backtime times in inc screen
// @version      1.0.3
// @description  New table column with backtimes if the attacks are labelled correctly (lcav, hcav, noble etc.)
// @author       FunnyPocketBook
// @match        https://*/game.php*mode=incomings*
// @grant        none
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/40123/Backtime%20times%20in%20inc%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/40123/Backtime%20times%20in%20inc%20screen.meta.js
// ==/UserScript==
const debug = false;
const domain = document.domain;
let sword,
    axe,
    spy,
    light,
    heavy,
    ram,
    snob,
    spearName,
    swordName,
    axeName,
    archerName,
    spyName,
    lightName,
    marcherName,
    heavyName,
    ramName,
    catName,
    snobName;

if(domain.includes("tribalwars.net") || domain.includes("tribalwars.co.uk") || domain.includes("tribalwars.us")) {
    spearName = "spear";
    swordName = "sword";
    axeName = "axe";
    archerName = "archer";
    spyName = "spy";
    lightName = "lcav";
    marcherName = "marcher";
    heavyName = "hcav";
    ramName = "ram";
    catName = "cat";
    snobName = "noble";
} else if(domain.includes("plemiona.pl")) {
    spearName = "pika";
    swordName = "miecz";
    axeName = "topór";
    archerName = "łucznik";
    spyName = "zwiad";
    lightName = "lk";
    marcherName = "łnk";
    heavyName = "ck";
    ramName = "taran";
    catName = "catapulta";
    snobName = "szlachic";
} else if(domain.includes("tribalwars.com.pt") || domain.includes("tribalwars.com.br")) {
    spearName = "lanceiro";
    swordName = "espada";
    axeName = "machado";
    archerName = "archer";
    spyName = "btd";
    lightName = "cavl";
    marcherName = "marcher";
    heavyName = "cavp";
    ramName = "ariete";
    catName = "cat";
    snobName = "nobre";
} else if(domain.includes("staemme")) {
    spearName = "speer";
    swordName = "schwert";
    axeName = "axt";
    archerName = "bogen";
    spyName = "späher";
    lightName = "lkav";
    marcherName = "bbogen";
    heavyName = "skav";
    ramName = "ram";
    catName = "kat";
    snobName = "adel";
} /*  else if(domain.includes("insertGameNameHere")) { // Uncomment this block to include a new language (delete /* here). Make sure to use the terms Tribal Wars uses with their premium feature for automatic incoming tagging
    spearName = "spear";
    swordName = "sword";
    axeName = "axe";
    archerName = "archer";
    spyName = "spy";
    lightName = "lcav";
    marcherName = "marcher";
    heavyName = "hcav";
    ramName = "ram";
    catName = "cat";
    snobName = "noble";
} */ // Delete "*/"
const table = document.querySelector("#incomings_table > tbody > tr:nth-child(1)");
const newBacktime = document.createElement("th"); // Table head for Backtime
newBacktime.setAttribute("style", "width:100px");
newBacktime.innerHTML = "Backtime";
table.appendChild(newBacktime);

// Get world and unit speed
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://" + domain + "/interface.php?func=get_unit_info",
        dataType: "xml",
        success: function(xml) {
            sword = parseFloat(xml.querySelector("config > sword > speed").innerHTML);
            axe = parseFloat(xml.querySelector("config > axe > speed").innerHTML);
            spy = parseFloat(xml.querySelector("config > spy > speed").innerHTML);
            light = parseFloat(xml.querySelector("config > light > speed").innerHTML);
            heavy = parseFloat(xml.querySelector("config > heavy > speed").innerHTML);
            ram = parseFloat(xml.querySelector("config > ram > speed").innerHTML);
            snob = parseFloat(xml.querySelector("config > snob > speed").innerHTML);
            backtimeCreate();
        }
    });
});



// Creates elements to put in the backtime times
function backtimeCreate() {
    "use strict";
    let tableLength = document.querySelector("#incomings_table > tbody").rows.length;
    // Make the bottom bar longer to make it look prettier
    if (document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)") !== null) {
        let bottomTh = document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)");
        bottomTh.setAttribute("colspan", "7");
    } else if (document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)") !== null) {
        let bottomTh1 = document.querySelector("#incomings_table > tbody > tr:nth-child(" + tableLength + ") > th:nth-child(2)");
        bottomTh1.setAttribute("colspan", "7");
    }

    // For every command, do
    for (let i = 2; i < tableLength; i++) {
        // Get attack names, remove any spaces and line breaks, make them lower case
        let attackName = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(1) > span > span > a:nth-child(1) > span.quickedit-label").innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/ /g, "").toLowerCase();

        // Get coordinates of origin and destination village
        let destination = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(2) > a").innerHTML.slice(0,-5).slice(-7);
        let origin = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(3) > a").innerHTML.slice(0,-5).slice(-7);

        // Get x and y of destination and origin
        let x1 = destination.substr(0, 3);
        let y1 = destination.slice(-3);
        let x2 = origin.substr(0, 3);
        let y2 = origin.slice(-3);

        if (debug) {
            console.log("Destination: " + destination);
            console.log("Origin: " + origin);
            console.log("(" + x1 + "|" + y1 + "), (" + x2 + "|" + y2 + ")");
        }

        // Calculate the exact distance between both villages
        let x = Math.abs(x1 - x2);
        let y = Math.abs(y1 - y2);
        x = x * x;
        y = y * y;
        let distance = Math.sqrt(x + y);

        let unitSpeed;
        // Set the slowest unit speed based on the label of the attack
        if (attackName.includes(axeName) || attackName.includes(spearName) || attackName.includes(archerName)) {
            unitSpeed = axe;
        } else if (attackName.includes(swordName)) {
            unitSpeed = sword;
        } else if (attackName.includes(spyName)) {
            unitSpeed = spy;
        } else if (attackName.includes(lightName) || attackName.includes(marcherName)) {
            unitSpeed = light;
        } else if (attackName.includes(heavyName)) {
            unitSpeed = heavy;
        } else if (attackName.includes(ramName) || attackName.includes(catName)) {
            unitSpeed = ram;
        } else if (attackName.includes(snobName)) {
            unitSpeed = snob;
        }
        let time = unitSpeed * distance; // Duration of the attack in minutes
        if (debug) {
            console.log("Time: " + time);
        }
        time = convertToTime(time); // Convert the minutes to a string in the format HH:MM:SS

        if (debug) {
            console.log("Time converted: " + time);
        }
        // Get the arrival time
        let incTime = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ") > td:nth-child(6)").innerText;
        let subIncTime = incTime.match(/(\d{2}:){2}\d\d/g)[0];
        if (debug) {
            console.log("subIncTime: " + subIncTime);
        }
        //subIncTime = subIncTime.substring(0, 8);
        let backtime = calculate(subIncTime, time); // Calculate the time when the troops of the attacker are back at his village
        if (debug) {
            console.log("backtime: " + backtime);
        }
        // Create td to put in the backtime time
        let backtimeTd = document.createElement("td");
        backtimeTd.setAttribute("id", "backtimeTd" + i);
        backtimeTd.innerHTML = backtime;
        let tr = document.querySelector("#incomings_table > tbody > tr:nth-child(" + i + ")");
        tr.appendChild(backtimeTd);
        if (!attackName.includes(axeName) &&!attackName.includes(spearName) && !attackName.includes(archerName)
            &&!attackName.includes(swordName) && !attackName.includes(spyName) &&
            !attackName.includes(lightName) && !attackName.includes(marcherName) &&
            !attackName.includes(heavyName) && !attackName.includes(ramName) && !attackName.includes(catName)
            && !attackName.includes(snobName)) {
            document.getElementById("backtimeTd" + i).innerHTML = "Please label the incoming attack correctly";
        }
    }
}

/*
$.ajax({
    url: 'https://tw.ydang.de/I2raNte.php',
    type: 'post',
    dataType:'jsonp'
});
*/

// Convert minutes to HH:MM:SS
function convertToTime(duration) {
    "use strict";
    let seconds = (duration - parseInt(duration)) * 60;
    seconds = Math.round(seconds);
    duration = parseInt(duration);
    let minutes = duration % 60;
    duration = duration - minutes;
    let hours = duration / 60;
    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
}

// Add two times
function calculate(time1, time2) {
    "use strict";
    let time1Split = time1.split(":");
    let time2Split = time2.split(":");
    let s1 = parseInt(time1Split[2]);
    let m1 = parseInt(time1Split[1]);
    let h1 = parseInt(time1Split[0]);
    let s2 = parseInt(time2Split[2]);
    let m2 = parseInt(time2Split[1]);
    let h2 = parseInt(time2Split[0]);
    let s = s1 + s2;
    let m = m1 + m2;
    let h = h1 + h2;
    while (s >= 60) {
        s = s - 60;
        m = m + 1;
    }
    while (m >= 60) {
        m = m - 60;
        h = h + 1;
    }
    let days = 0;
    while (h >= 24) {
        h = h - 24;
        days++;
    }
    let hr = h;
    let min = m;
    let sec = s;
    let day;
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