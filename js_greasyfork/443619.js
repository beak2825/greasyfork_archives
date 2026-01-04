// ==UserScript==
// @name         Daymap Graphics
// @namespace    apate98
// @version      7.2.0
// @description  Allows Daymap to be customised.
// @author       apate98
// @match        https://*.daymap.net/*
// @icon         https://www.google.com/s2/favicons?domain=daymap.net
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/443619/Daymap%20Graphics.user.js
// @updateURL https://update.greasyfork.org/scripts/443619/Daymap%20Graphics.meta.js
// ==/UserScript==

// Changelog
// 6.0.0: Added changelog and introduced compatibility for Daymap's timetable view.
// 6.0.1: Fixed a problem where opacity is reversed in timetable view.
// 6.0.2: Changed the manual background change to apply to underlay rather than body. Increased speed of underlay rainbow.
// 6.0.3: Allowed manual changing of the attendance indicator colour to anything, replacing the old background-color with background.
// 6.1.0: Allows blurring behind the foreground cards, giving a glassy effect.
// 6.1.1: Made header also change opacity and made logo transparent.
// 7.0.0: Removed all jQuery usage to enable compatibility with new Daymap. Also basically rewrote a bunch of code to work with new Daymap.
// 7.0.1: Fixed an issue to do with timetable view transparency. Also made transparent cards match with dark mode or light mode.
// 7.0.2: Fixed transparency... again. This time for feed view. Also changed the namespace.
// 7.1.0: Made the header less obtrusive and made dark mode work properly.
// 7.2.0: Added option to revert to original layout.

// Credits and thanks:
// Special thanks to Kelvin for troubleshooting many issues when transferring to the new Daymap, whom without I could not have solved any of the problems.

// Notes:
// Some versions may not be available on Greasyfork.

// TODO:
// Presets
// Fix animated profile picture
// Change homework page opacity
// Change summary/portfolio page opacity
// Make diary look a bit nicer
// Change class list opacity
// Change task finder opacity
// Change results page opacity
// Change schedule page opacity
// Change my messages page opacity
// Change my calenders page opacity

// Compatibile pages:
// Feed View
// Timetable
// Mobile Daymap
// My Details

// Tips:
// Change the Daymap.Web_DaymapIdentityCookie cookie expiry date to 2038-01-18T18:14:07.000Z every time you log into Daymap. Daymap Graphics cannot do this automatically as the cookie is HTTP only, and creating another cookie witht the same data can lock a person out of Daymap.

// Known issues:
// When changing messages pages, the messages are opaque.
// Khan Academy returns a 403 error when using embeds. This will be fixed by using p5.js.
// Evil mode no longer works.










// Local storage functions by DY from Khan Academy at https://www.khanacademy.org/profile/darrylyeo/projects
var storage;
(function() {
    storage = localStorage;
})();

function getItem(key) {
    if(storage != undefined) {
        return storage.getItem(key);
    }
    storage = this.localStorage;
    return null;
};

function setItem(key, value) {
    if(storage != undefined) {
        storage.setItem(key, value);
    } else {
        storage = this.localStorage;
    }
};

function rainbowMove(val1, val2, val3, val4, val5, speed) {
    speed = speed ? speed : 1;
    val1 += (Math.random() - val4) * speed;
    val2 += (Math.random() - val5) * speed;
    val1 = val1 < 0 ? 0 : val1 > 410 ? 410 : val1;
    val2 = val2 < 0 ? 0 : val2 > 410 ? 410 : val2;
    return [val1, val2, val3, val4, val5];
}

function constrain(num, min, max) {
    return num < min ? min : num > max ? max : num;
}


var lessonStart;
var lessonEnd;

function timeOfDiaryEl(lessonEl) {
    if(lessonEl.innerText.substr(1, 1) === ":" && lessonEl.innerText.substr(12, 1) !== ":") {
        lessonStart = lessonEl.innerText.substr(0, 1) + lessonEl.innerText.substr(2, 2);
        lessonEnd = lessonEl.innerText.substr(11, 2) + lessonEl.innerText.substr(14, 2);
        if(lessonEl.innerText.substr(5, 1) === "P") {
            lessonStart = Number(lessonStart) + 1200;
        }
    }
    if(lessonEl.innerText.substr(1, 1) === ":" && lessonEl.innerText.substr(12, 1) === ":") {
        lessonStart = lessonEl.innerText.substr(0, 1) + lessonEl.innerText.substr(2, 2);
        lessonEnd = lessonEl.innerText.substr(11, 1) + lessonEl.innerText.substr(13, 2);
        if(lessonEl.innerText.substr(5, 1) === "P") {
            lessonStart = Number(lessonStart) + 1200;
        }
        if(lessonEl.innerText.substr(16, 1) === "P") {
            lessonEnd = Number(lessonEnd) + 1200;
        }
    }
    if(lessonEl.innerText.substr(1, 1) !== ":" && lessonEl.innerText.substr(13, 1) !== ":") {
        lessonStart = lessonEl.innerText.substr(0, 2) + lessonEl.innerText.substr(3, 2);
        lessonEnd = lessonEl.innerText.substr(12, 2) + lessonEl.innerText.substr(15, 2);
    }
    if(lessonEl.innerText.substr(1, 1) !== ":" && lessonEl.innerText.substr(13, 1) === ":") {
        lessonStart = lessonEl.innerText.substr(0, 2) + lessonEl.innerText.substr(3, 2);
        lessonEnd = lessonEl.innerText.substr(12, 1) + lessonEl.innerText.substr(14, 2);
        if(lessonEl.innerText.substr(17, 1) === "P") {
            lessonEnd = Number(lessonEnd) + 1200;
        }
    }
    return [lessonStart, lessonEnd];
}

// By joshuacockrell based on a post by Maxwell Collard and edited by Mahdi https://stackoverflow.com/a/25582882/#36481059
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

var attendanceColour = "#7FFFD4";
var bodyColour = "#ABCDEF";
var cardColour = "#E6E6E6";
var date;
var classEls = [];
var i;
var anything = [];
const animatedPhotoLinks = [5097557231353856, 6056784221388800, 5537046336684032]; //4617381095718912 (khanemon), 5169842873122816 (were in a comic, not working yet)
const animatedPhotoLinks2 = [5097557231353856, 6056784221388800, 4617381095718912];
var r50d = [];



(function() {
    'use strict';
    try {
        if(!getItem("usedTools")) {
            document.querySelector("body").appendChild((() => {
                let something = document.createElement("div"); something.innerHTML = `
                <div id='guide'></div>
                <style>
                    #guide {
                        position: absolute;
                    }
                </style>
            `; return something;})());
        }
        document.querySelector("body").style.fontFamily='Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif';
        document.querySelector("head").appendChild((() => {let something = document.createElement("style");something.innerHTML = `
            #toolbox {
                top: 15vh;
                left: 20vw;
                background-color: rgba(229, 229, 229, 0.8);
                position: fixed;
                width: 60vw;
                height: 70vh;
                padding: 50px;
                border-width: 50px;
                border-image: linear-gradient(red, yellow);
            }
            #closeToolbox {
                float: right;
                color: rgb(200, 200, 200);
                font-size: 2.5vw;
                cursor: pointer;
                background-color: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                width: 2.5vw;
                height: 2.5vw;
                text-align: center;
                vertical-align: baseline;
                line-height: 2.3vw;
            }
            #reloadBtn {
                position: absolute;
                bottom: 2vw;
                background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);
                border: 0;
                border-radius: 4.25%;
                width: 15vw;
                height: 4vh;
                color: white;
                cursor: pointer;
            }
            #bodyBackground, #additionalCSS {
                display:inline-block;
                width:100%;
            }
       `; return something;})());
        {
            let toolbox = document.createElement("div");
            toolbox.innerHTML = `<div id='closeToolbox'>×</div>
            <div>
                <form oninput='blurAmount.value=parseFloat(blur.value)'>
                    Opacity: <input id='translucent' type='range' min='0' max='1' step='0.001'></input><br/>
                    Blur amount: <input id='blur' type='range' min='0' max='50' step='0.1' name='blur'></input>
                    <input id='blurAmount' name='blurAmount' readonly='true' style='background-color:light-gray;'></input><br/>
                    Auto animated photo:<input id='autoAnimatedPhoto' type='checkbox'></input><br/>
                    Auto attendance rainbow:<input id='autoAttendanceRainbow' type='checkbox'></input><br/>
                    Animated profile project id:&nbsp;<input id='animatedProfileProjectId' type='number'></input><br/>
                    Auto body background:<input id='autoBackground' type='checkbox'/><br/>
                    Revert to original layout:<input id='originalLayout' type='checkbox'/><br/>
                    Dark mode:<input id='darkMode' type='checkbox'/><br/>
                    Body background CSS property (value only):<input type='text' id='bodyBackground'/><br/>
                    Additional CSS (CSS style declaration):<textarea id='additionalCSS' rows='3'></textarea>
                </form>
            </div>
            <button id='reloadBtn'>&nbsp;Apply changes and reload page</button>`;
            toolbox.setAttribute("id","toolbox");
            toolbox.style.display = "none";
            document.querySelector(".main-layout").appendChild(toolbox);
        }
        document.querySelector("head").appendChild((() => {let something = document.createElement("style");something.setAttribute("id", "customStyles"); return something;})());
        var tools = setInterval(function() {if(document.querySelector("li[menu-id='60']")) {document.querySelector("li[menu-id='60']").parentNode.innerHTML = "<tr><div class='tools' style='border-left: 2px solid #a0d7f1; text-align: left; padding: 7px 11px;' onclick='document.getElementById(`toolbox`).style.display = `block`;'>Daymap Graphics Command Center</div></div></tr><style>.tools:hover{background-color:#e5e5e5}</style>"; clearInterval(tools)}}, 50);
        {
            let bodyUnderlay = document.createElement("div");
            bodyUnderlay.setAttribute("id", "bodyUnderlay");
            document.querySelector("head").innerHTML += "<style>#bodyUnderlay {position: fixed; width: 100%; height: 100%; top: 0; z-index: -2147483647;}</style>";
            document.querySelector("body").appendChild(bodyUnderlay);
        }
        document.querySelector("#reloadBtn").innerHTML = '<svg width="0.75vw" height="0.75vw" viewBox="0 0 24 24" class="_18zn2ntb"><path fill="currentColor" d="M18.071 18.644c-3.532 3.232-9.025 3.13-12.452-.297a9.014 9.014 0 0 1-2.636-6.866 1 1 0 0 1 1.997.105 7.014 7.014 0 0 0 2.053 5.346c2.642 2.642 6.856 2.747 9.606.31h-1.81a1 1 0 1 1 0-2h4.242a1 1 0 0 1 1 1v4.243a1 1 0 0 1-2 0v-1.84zM7.361 6.757h1.81a1 1 0 0 1 0 2H4.93a1 1 0 0 1-1-1V3.515a1 1 0 1 1 2 0v1.84c3.532-3.231 9.025-3.13 12.452.298a9.014 9.014 0 0 1 2.636 6.866 1 1 0 1 1-1.997-.105 7.014 7.014 0 0 0-2.053-5.346c-2.642-2.642-6.856-2.747-9.606-.31z"></path></svg>' + document.querySelector("#reloadBtn").innerHTML;
        document.querySelector("#blurAmount").value = getItem("blurAmount");
        document.querySelector("#animatedProfileProjectId").value = getItem("animatedProfileProjectId");
        document.querySelector("#bodyBackground").value = getItem("bodyBackground");
        document.querySelector("#translucent").setAttribute("value", getItem("translucentMode"));
        document.querySelector("#blur").setAttribute("value", getItem("blurAmount"));
        if(getItem("autoAnimatedPhoto") != 0 && getItem("autoAnimatedPhoto")) {
            document.querySelector("#autoAnimatedPhoto").setAttribute("checked", 1);
        }
        if(getItem("autoAttendanceRainbow") != 0 && getItem("autoAttendanceRainbow")) {
            document.querySelector("#autoAttendanceRainbow").setAttribute("checked", 1);
        }
        if(getItem("originalLayout") != 0 && getItem("originalLayout")) {
            document.querySelector("#originalLayout").setAttribute("checked", 1);
        }
        if(document.cookie != "" ? parseInt(document.cookie.substr(document.cookie.length - 1, 1)) == 1 : 0) {
            document.querySelector("#darkMode").setAttribute("checked", 1);
        }
        if(getItem("autoBackground") != 0 && getItem("autoBackground")) {
            document.querySelector("#autoBackground").setAttribute("checked", 1);
            if(getItem("bodyBackground") != "" && getItem("bodyBackground") != undefined) {
                document.querySelector("#bodyUnderlay").style.background=getItem("bodyBackground");
                if(getItem("bodyBackground") === "linear-gradient(to bottom right, yellow, black, black, black)") {
                    document.querySelector("#bodyUnderlay").innerHTML += "<style></style>";
                    for(i = 0; i < 500; i ++) {
                        anything[0] = Math.random() * 7.5;
                        anything[1] = randn_bm() * 255;
                        anything[2] = Math.random() * 100;
                        anything[3] = Math.random() * 100;
                        anything[4] = Math.random() + 1;
                        anything[5] = (Math.random() - 0.5) * 90;
                        if(anything[2] < 37.5 && anything[3] < 37.5) {
                            continue;
                        }
                        document.querySelector("#bodyUnderlay").innerHTML += "<div class='r50d' style='width:" + anything[0] + "px;height:" + anything[0] + "px;top:" + anything[2] + "vh;left:" + anything[3] + "vw;position:absolute;border-radius:" + constrain(randn_bm() * 50, 0, 50) + "%;background-color:rgba(" + constrain(anything[1] * anything[4], 0, 255) + ", " + constrain((anything[1] > 127.5 ? (127.5 - anything[1]) : anything[1]) * anything[4], 0, 255) + ", " + constrain((255 - anything[1]) * anything[4], 0, 255) + ", " + Math.random() / 1.5 +");transform:rotate("+ anything[5] + "deg);'></div>";
                        r50d.push("1," + Math.random() / 100 + "," + anything[5] + "," + (randn_bm() - 0.5) * 15);
                    }
                }
                if(getItem("bodyBackground") === "url('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB_p0PncTtkrhaNDZtntrE3gKkoYw')") {
                    setItem("bodyBackground", "black url('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB_p0PncTtkrhaNDZtntrE3gKkoYw')");
                    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                }
            }
        }
        document.querySelector("#customStyles").innerText = getItem("additionalCSS");
        document.querySelector("#additionalCSS").value = getItem("additionalCSS");
        i = 0;

        setInterval(function() {
            for(i = 0; i < document.querySelectorAll(".r50d").length; i++) {
                document.querySelectorAll(".r50d")[i].style.transform = "scale(" + r50d[i].split(",")[0] + ", " + r50d[i].split(",")[0] + ") rotate(" + r50d[i].split(",")[2] + "deg)";
                r50d[i] = (parseFloat(r50d[i].split(",")[0]) + parseFloat(r50d[i].split(",")[1])) + "," + (parseFloat(r50d[i].split(",")[0]) >= 1.1 ? Math.abs(parseFloat(r50d[i].split(",")[1])) * -1 : parseFloat(r50d[i].split(",")[0]) <= 0.9 ? Math.abs(r50d[i].split(",")[1]) : parseFloat(r50d[i].split(",")[1])) + "," + (parseFloat(r50d[i].split(",")[2]) + parseFloat(r50d[i].split(",")[3])) + "," + parseFloat(r50d[i].split(",")[3]); i = i >= r50d.length - 1 ? 0 : i + 1;
            }
        }, 30);

        document.querySelector("#closeToolbox").addEventListener("click", function() {
            document.querySelector("#toolbox").style.display = "none";
        });
        document.querySelector("#reloadBtn").addEventListener("click", function() {
            setItem("animatedProfileProjectId", document.querySelector("#animatedProfileProjectId").value);
            setItem("bodyBackground", document.querySelector("#bodyBackground").value);
            setItem("translucentMode", document.querySelector("#translucent").value);
            setItem("additionalCSS", document.querySelector("#additionalCSS").value);
            setItem("blurAmount", document.querySelector("#blur").value);
            location.reload();
        });
        document.querySelector("#autoAnimatedPhoto").addEventListener("click", function() {setItem("autoAnimatedPhoto", getItem("autoAnimatedPhoto") != 0 && getItem("autoAnimatedPhoto") ? 0 : 1);});
        document.querySelector("#autoAttendanceRainbow").addEventListener("click", function() {setItem("autoAttendanceRainbow", getItem("autoAttendanceRainbow") != 0 ? 0 : 1);});
        document.querySelector("#autoBackground").addEventListener("click", function() {setItem("autoBackground", getItem("autoBackground") != 0 && getItem("autoBackground") ? 0 : 1);});
        document.querySelector("#originalLayout").addEventListener("click", function() {setItem("originalLayout", getItem("originalLayout") != 0 && getItem("originalLayout") ? 0 : 1);});
        document.querySelector("#darkMode").addEventListener("click", function() {let _dark = document.cookie != "" ? parseInt(document.cookie.substr(document.cookie.length - 1, 1)) == 1 ? "darkMode=0": "darkMode=1" : "darkMode=1"; document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");}); document.cookie = _dark;});
        if (!document.querySelector(".sdIndicator")) {
            if(document.querySelector(".StudentBox > table > tbody")) {
                document.querySelector(".StudentBox > table > tbody").innerHTML += ('<tr><td colspan="3"><div id="divIndicators"><div><div class="sdIndicator" title="Term" style="background-color:#65EC0B">100</div><div class="sdCap">Attendance Tracking</div></div></div></td></tr>');
                document.querySelector(".sdIndicator").innerHTML += ("<style>.sdIndicator{color: #302F46;font-size: 16pt;width: 50px;height: 50px;border-radius: 25px;text-align: center;vertical-align: baseline;margin-left: auto;margin-right: auto;line-height: 50px;}</style>");
            } else {
                document.querySelector(".expContent").innerHTML += ('<tr><td colspan="3"><div id="divIndicators"><div><div class="sdIndicator" title="Term" style="background-color:#65EC0B">100</div><div class="sdCap">Attendance Tracking</div></div></div></td></tr>');
                document.querySelector(".sdIndicator").innerHTML += ("<style>.sdIndicator{color: #302F46;font-size: 16pt;width: 50px;height: 50px;border-radius: 25px;text-align: center;vertical-align: baseline;margin-left: auto;margin-right: auto;line-height: 50px;}</style>");
            }
        }
        for(i = 0; i < document.querySelectorAll(".itm .Error").length; i ++) {
            document.querySelectorAll(".itm .Error")[i].innerText = "Uh did you submit on Turnitin or something?";
        }
        var attendanceEl = document.querySelector(".sdIndicator");
        attendanceEl.classList.add("attendance");
        var cardEl = document.querySelector(".diaryDay");
        var attendanceRainbow = [0, 0, 0, 0.5, 0.5];
        var attendanceRainbow1 = [400, 5, 0, 0.5, 0.5];
        var attendanceRainbow2 = [210, 350, 0, 0.5, 0.5];
        var bodyRainbow = [200, 200, 0, 0.5, 0.5];
        var cardRainbow = [200, 200, 0, 0.5, 0.5];
        // To make random numbers into colours that actually look good, there is a method by Weather: https://www.khanacademy.org/computer-programming/the-randomish-quiz/6515084802260992
        setInterval(function(){attendanceRainbow = rainbowMove(attendanceRainbow[0], attendanceRainbow[1], attendanceRainbow[2], attendanceRainbow[3], attendanceRainbow[4] , 15); attendanceRainbow1 = rainbowMove(attendanceRainbow1[0], attendanceRainbow1[1], attendanceRainbow1[2], attendanceRainbow1[3], attendanceRainbow1[4] , 15); attendanceRainbow2 = rainbowMove(attendanceRainbow2[0], attendanceRainbow2[1], attendanceRainbow2[2], attendanceRainbow2[3], attendanceRainbow2[4] , 15)}, 10);
        setInterval(function(){if(attendanceRainbow[2]) {document.querySelector(".attendance").style.backgroundImage = "linear-gradient(" + attendanceRainbow[0] + "deg, rgb(" + bodyRainbow[0] + "," + (400 - attendanceRainbow1[0] + attendanceRainbow1[1]) / 2.5 + "," + (400 - attendanceRainbow1[1]) + ") -75%, rgb(" + attendanceRainbow[0] + "," + (400 - attendanceRainbow[0] + attendanceRainbow[1]) / 2.5 + "," + (400 - attendanceRainbow[1]) + ") 50%, rgb(" + attendanceRainbow2[0] + "," + (400 - attendanceRainbow2[0] + attendanceRainbow2[1]) / 2.5 + "," + (400 - attendanceRainbow2[1]) + ") 175%)";}}, 10);
        setInterval(function(){attendanceRainbow[3] = Math.random() / 2 + 0.25; attendanceRainbow[4] = Math.random() / 2 + 0.25; attendanceRainbow1[3] = Math.random() / 2 + 0.25; attendanceRainbow1[4] = Math.random() / 2 + 0.25; attendanceRainbow2[3] = Math.random() / 2 + 0.25; attendanceRainbow2[4] = Math.random() / 2 + 0.25;}, 5000);
        setInterval(function(){bodyRainbow = rainbowMove(bodyRainbow[0], bodyRainbow[1], bodyRainbow[2], bodyRainbow[3], bodyRainbow[4] , 10)}, 10);
        setInterval(function(){if(bodyRainbow[2]) {document.querySelector("#bodyUnderlay").style.backgroundColor = "rgb(" + bodyRainbow[0] + "," + (400 - bodyRainbow[0] + bodyRainbow[1]) / 2.5 + "," + (400 - bodyRainbow[1]) + ")";}}, 10);
        setInterval(function(){bodyRainbow[3] = Math.random() / 2 + 0.25; bodyRainbow[4] = Math.random() / 2 + 0.25;}, 2000);
        setInterval(function(){cardRainbow = rainbowMove(cardRainbow[0], cardRainbow[1], cardRainbow[2], cardRainbow[3], cardRainbow[4] , 10)}, 10);
        setInterval(function(){if(cardRainbow[2]) {cardEl.style.backgroundColor = "rgb(" + cardRainbow[0] + "," + (400 - cardRainbow[0] + cardRainbow[1]) / 2.5 + "," + (400 - cardRainbow[1]) + ")";}}, 10);
        setInterval(function(){cardRainbow[3] = Math.random() / 2 + 0.25; cardRainbow[4] = Math.random() / 2 + 0.25;}, 5000);
        attendanceRainbow[2] = getItem("autoAttendanceRainbow") != 0 && getItem("autoAttendanceRainbow") ? 1 : 0;
        attendanceEl.addEventListener("click", function() {
            attendanceColour = prompt("Please enter a colour", "#7FFFD4");
            if (attendanceColour && attendanceColour != "RAINBOW") {
                attendanceRainbow[2] = 0;
                attendanceEl.style.backgroundImage = "";
                attendanceEl.style.background = attendanceColour;
            } else if (attendanceColour === "RAINBOW") {
                attendanceRainbow[2] = 1;
            }
        });
        if(cardEl) {
            cardEl.addEventListener("click", function() {
                cardColour = prompt("Please enter a colour", "#7FFFD4");
                if (cardColour && cardColour != "RAINBOW") {
                    cardRainbow[2] = 0;
                    cardEl.style.backgroundColor = cardColour;
                } else if (cardColour === "RAINBOW") {
                    cardRainbow[2] = 1;
                }
            });
        }
        if(document.querySelector(".diaryWeek")) {
            document.querySelector(".diaryWeek").addEventListener("click", function() {
                alert("rgb(" + attendanceRainbow[0] + "," + (400 - attendanceRainbow[0] + attendanceRainbow[1]) / 2.5 + "," + (400 - attendanceRainbow[1]) + ")");
            });
        }
        if(document.querySelector(".diaryDay")) {
            switch(Date().substr(4, 3)) {
                case "Jan":
                    date = Date().substr(11, 4) + "-01-" + Date().substr(8, 2);
                    break;
                case "Feb":
                    date = Date().substr(11, 4) + "-02-" + Date().substr(8, 2);
                    break;
                case "Mar":
                    date = Date().substr(11, 4) + "-03-" + Date().substr(8, 2);
                    break;
                case "Apr":
                    date = Date().substr(11, 4) + "-04-" + Date().substr(8, 2);
                    break;
                case "May":
                    date = Date().substr(11, 4) + "-05-" + Date().substr(8, 2);
                    break;
                case "Jun":
                    date = Date().substr(11, 4) + "-06-" + Date().substr(8, 2);
                    break;
                case "Jul":
                    date = Date().substr(11, 4) + "-07-" + Date().substr(8, 2);
                    break;
                case "Aug":
                    date = Date().substr(11, 4) + "-08-" + Date().substr(8, 2);
                    break;
                case "Sep":
                    date = Date().substr(11, 4) + "-09-" + Date().substr(8, 2);
                    break;
                case "Oct":
                    date = Date().substr(11, 4) + "-10-" + Date().substr(8, 2);
                    break;
                case "Nov":
                    date = Date().substr(11, 4) + "-11-" + Date().substr(8, 2);
                    break;
                case "Dec":
                    date = Date().substr(11, 4) + "-12-" + Date().substr(8, 2);
                    break;
            }
            var time = Number(Date().substr(16, 2) + Date().substr(19, 2));
            var lessonEls = [document.querySelector(".diaryDay[data-date='"+date+"']").nextSibling, document.querySelector(".diaryDay[data-date='"+date+"']").parentNode.childNodes[1], document.querySelector(".diaryDay[data-date='"+date+"']").parentNode.childNodes[2], document.querySelector(".diaryDay[data-date='"+date+"']").parentNode.childNodes[3], document.querySelector(".diaryDay[data-date='"+date+"']").parentNode.childNodes[4], document.querySelector(".diaryDay[data-date='"+date+"']").parentNode.childNodes[5]];
            var lessonEl;

            i = 0;
            while (!lessonEl && i < 10) {
                if (lessonEls[i]) {
                    if (timeOfDiaryEl(lessonEls[i])[0] < time && timeOfDiaryEl(lessonEls[i])[1] >= time) {
                        lessonEl = lessonEls[i];
                    }
                }
                i ++;
            }
            var evilEl;
            for(var i = 0; i < document.querySelectorAll(".L").length; i++) {
                let evils = ["ELZ", "ENG", "LLS", "LLH"];
                let something = document.querySelectorAll(".L")[i];
                if(evils.indexOf(something.childNodes[1].childNodes[0].innerText.substr(0, 3))) {
                    something.classList.add("evil");
                }
            }
            if(lessonEl != undefined) {
                lessonEl.style.transformOrigin = "50% 50%";
                lessonEl.style.borderRadius = "5px";

                lessonEl.innerHTML += "<style>@keyframes lessonAnimation {from, to {} 50% {}} .lessonEl {animation: lessonAnimation 15s infinite;}</style>";
                lessonEl.classList.add("lessonEl");
                document.querySelector(".lessonEl .t").addEventListener("click", function() {
                    lessonEl.style.borderRadius = prompt("Enter the radius", "5px");
                });
            }
            if(document.querySelector(".evil")) {
                document.querySelector(".evil .t").addEventListener("click", function() {
                    if(confirm("Are you sure you would like to enable evil mode? You will need to refresh the page to revert this.")) {
                        document.querySelector("daymap-menu div").style.backgroundColor = "rgb(85, 2, 2)";
                        document.querySelector(".menu-list li").style.backgroundColor = "rgb(85, 2, 2)";
                        document.querySelector("daymap-menu div").style.borderBottom = "rgb(0, 0, 0)";
                        document.querySelector("#bodyUnderlay").style.backgroundColor = "rgb(85, 10, 10)";
                        {
                            let something = document.createElement("div");
                            something.setAttribute("class", "bodyOverlay");
                            something.setAttribute("style", "background-color:rgba(113,13,13,0.5);width:100vw; height: 100vh; position:fixed;");
                            document.querySelector(".main-layout").appendChild(something);
                            document.querySelector("head").innerHTML += "<style>.bodyOverlay {background-color:rgba(113,13,13,0.5);width:100vw; height: 100vh; position:fixed;}</style>";
                        }
                        document.querySelector(".Toolbar").style.background = "rgb(100, 20, 20)";
                        for (i = 0; i < document.querySelectorAll(".grid div").length; i++) {
                            document.querySelectorAll(".grid div")[i].style.backgroundColor = "rgb(100, 20, 40)";
                        };
                        for (i = 0; i < document.querySelectorAll(".msgHead .icon").length; i++) {
                            document.querySelectorAll(".msgHead icon")[i].innerText("Mua ha ha ha!");
                        };
                        for (i = 0; i < document.querySelectorAll(".msgHead .icon").length; i++) {
                            document.querySelectorAll(".msgHead icon")[i].nextSibling.nextSibling.innerText("Always.");
                        };
                        for (i = 0; i < document.querySelectorAll(".msg table tbody tr:nth-child(2) td").length; i++) {
                            document.querySelectorAll(".msg table tbody tr:nth-child(2) td")[i].innerText("Daymap bows down to my power.");
                        };
                    }
                });
            }
            document.querySelector(".MasterContent table tbody tr td .Header").addEventListener("click", function() {
                bodyColour = prompt("Please enter a background", "#ABCDEF");
                if (bodyColour && bodyColour != "RAINBOW") {
                    bodyRainbow[2] = 0;
                    document.querySelector("#bodyUnderlay").style.background = bodyColour;
                } else if (bodyColour === "RAINBOW") {
                    bodyRainbow[2] = 1;
                }
            });
        }
        if(getItem("autoBodyRainbow")) {
            setTimeout(bodyRainbow[2]=1,1)
        }
        if(getItem("autoCardRainbow")) {
            setTimeout(cardRainbow[2]=1,1)
        }
        if(getItem("translucentMode") && getItem("translucentMode") < 1) {
            var dark = document.cookie.substr(document.cookie.length - 1, document.cookie.length);
            dark = dark == "1" ? 1 : 0;
            for(i = 0; i < document.querySelectorAll(".card, .msg, .ditm, .Toolbar").length; i ++) {
                document.querySelectorAll(".card, .msg, .ditm, .Toolbar")[i].style.background = "rgba(" + (dark ? "37, 37, 37," : "237, 235, 233,") + getItem("translucentMode") + ")";
            }
            for(i = 0; i < document.querySelectorAll(".item-container").length; i ++) {
                document.querySelectorAll(".item-container")[i].style.background = "rgba(255, 255, 255, 0)";
            }
            for(i = 0; i < document.querySelectorAll(".hasDatepicker").length; i ++) {
                document.querySelectorAll(".hasDatepicker")[i].style.backgroundColor = "rgba(" + (dark ? "37, 37, 37," : "237, 235, 233,") + getItem("translucentMode") * 0.7 + ")";
            }
            for(i = 0; i < document.querySelectorAll(".ditm, .Toolbar").length; i ++) {
                document.querySelectorAll(".ditm, .Toolbar")[i].style.outline = "3px solid rgba(250, 250, 250, " + getItem("translucentMode") * 0.45 + ")";
            }
            for(i = 0; i < document.querySelectorAll(".msg").length; i ++) {
                document.querySelector(".msg").style.border = "3px solid rgba(220, 220, 220, " + getItem("translucentMode") * 0.45 + ")";
            }
            if(document.querySelector("#bCalendar")) {
                document.querySelector("#bCalendar").style.backgroundColor = "rgba(31, 157, 217, " + getItem("translucentMode") * 1.6 + ")";
                document.querySelector("#btnDiary").style.backgroundColor = "rgba(31, 157, 217, " + getItem("translucentMode") * 1.6 + ")";
            }

            for(i = 0; i < document.querySelectorAll(".card, .msg, .ditm, .Toolbar, .ditm .t, .ditm .c, .hasDatepicker, #tblTt tbody tr td, #tblTt tbody tr td .ttCell, .msg, #bCalendar, #btnDiary").length; i ++) {
                document.querySelectorAll(".card, .msg, .ditm, .Toolbar, .ditm .t, .ditm .c, .hasDatepicker, #tblTt tbody tr td, #tblTt tbody tr td .ttCell, .msg, #bCalendar, #btnDiary")[i].style.backdropFilter = "blur(" + getItem("blurAmount") + "px)";
            }
            for(i = 0; i < document.querySelectorAll(".nav-container, .nav-user-container").length; i++) {
                document.querySelectorAll(".nav-container, .nav-user-container")[i].style.backgroundColor = "rgba(" + (dark ? "37, 37, 37," : "237, 235, 233,") + getItem("translucentMode") * 0.7 + ")";
            }
            window.setTimeout(function() {
                document.querySelector("daymap-header").style.backgroundColor = "rgba(255, 255, 255, " + getItem("translucentMode") * 1.2 + ")";
                document.querySelector("daymap-header").style.backdropFilter = "blur(" + getItem("blurAmount") * 3 + "px)";
                for(i = 0; document.querySelectorAll("daymap-header div ul li").length; i++) {
                    document.querySelectorAll("daymap-header div ul li")[i].style.backgroundColor = "rgba(255, 255, 255, " + getItem("translucentMode") * 0.8 + ")";
                }
            }, 500);
        }
        document.querySelector("#customStyles").innerHTML = getItem("additionalCSS");
        window.setInterval(function() {
            let length = document.querySelectorAll(".fa-mail-bulk").length;
            for(i = 0; i < length; i++) {
                document.querySelector(".fa-mail-bulk").outerHTML = "<img src='https://qasmt.eq.daymap.net/Daymap/images/coms/post32.png'/>";
            }
            length = document.querySelectorAll(".img-container .fa-comment-alt").length;
            for(i = 0; i < length; i++) {
                document.querySelector(".img-container .fa-comment-alt").outerHTML = "<img src='https://qasmt.eq.daymap.net/Daymap/images/coms/newmsg.png'/>";
            }
            length = document.querySelectorAll(".fa-comment-alt-dots").length;
            for(i = 0; i < length; i++) {
                document.querySelector(".fa-comment-alt-dots").outerHTML = "<img src='https://qasmt.eq.daymap.net/Daymap/images/coms/newmsg.png'/>";
            }
            length = document.querySelectorAll(".fa-paperclip").length;
            for(i = 0; i < length; i++) {
                document.querySelector(".fa-paperclip").outerHTML = "<img src='https://qasmt.eq.daymap.net/Daymap/images/buttons/attachment.gif'/>";
            }
        }, 1000);
        if(getItem("originalLayout")) {
            let megaphone = window.setInterval(() => {
                if(document.querySelector(".atooltip")) {
                    let link = document.createElement("div");
                    link.innerHTML = `
                <div class="post-ticker">
                    <div id="ctl00_divTickerPosts"><div class="post-subject current"><div id="divBulletinContainer"></div></div></div>
                    <div class="post-nav">
                        <i class="mdi mdi-chevron-left" aria-hidden="true" id="postNavPrev"></i>
                        <span id="postCounter">1/1</span>
                        <i class="mdi mdi-chevron-right" aria-hidden="true" id="postNavPrev"></i>
                    </div>
                </div>
                <style>
                .post-ticker {
                    position: fixed;
                    top: 74px;
                    margin-top: 2px;
                    right: -4px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    flex-flow: row;
                    background-color: rgb(31, 157, 217);
                    box-shadow: rgba(31, 157, 217, 0.7) 0px 0px 8px 1px;
                    padding-left: 15px;
                    padding-right: 18px;
                    border-radius: 3px;
                    z-index: 1080;
                    color: rgb(255, 255, 255);
                    transition: top 0.5s ease 0s;
                }
                </style>
                `;
                    document.querySelector(".main-layout").appendChild(link);
                    window.clearInterval(megaphone);
                    document.querySelector("header").remove();
                } else if (!document.querySelector(".header-announcements[style='display:block']")) {
                    window.clearInterval(megaphone);
                    document.querySelector("header").remove();
                }
            }, 100);
            window.setTimeout(() => {document.querySelector("body").prepend((() => {let header = document.createElement("div");header.innerHTML = `
        <div class="header" style="background-color: rgba(255, 255, 255, 0.416); backdrop-filter: blur(0px);">
            <div role="navigation" class="menuContainer" id="menuContainer">
                <div id="mnu"><table class="lpMenuTop"><tbody><tr><td href="/daymap/student/portfolio.aspx" menuid="272" style="background-color: rgba(255, 255, 255, 1);">Portfolio</td><td href="/daymap/default.aspx?hideNav=1" menuid="1" style="background-color: rgba(255, 255, 255, 0.28);">Day Plan</td><td href="/daymap/student/classes.aspx" menuid="4" style="background-color: rgba(255, 255, 255, 0.28);">Classes</td><td href="" menuid="5" style="background-color: rgba(255, 255, 255, 0.28);">Assessment</td><td href="" menuid="87" style="background-color: rgba(255, 255, 255, 0.28);">Communications</td><td href="" menuid="67" style="background-color: rgba(255, 255, 255, 0.28);">Calendars</td><td href="javascript:window.open('/Depot/', '_blank');" menuid="261" style="background-color: rgba(255, 255, 255, 0.28);">Depot</td><td href="" menuid="16" style="background-color: rgba(255, 255, 255, 0.28);">Tools</td></tr></tbody></table></div>
                <!-- HORIZONTAL MENU ITEMS INSERTED HERE -->
            </div>
            <div class="header-logo">
                <div class="landing-button" id="divLandingButton">
                    <i class="mdi mdi-menu" aria-hidden="true"></i>
                </div>
                <a href="/daymap">
                    <img src="https://portal-beta.daymap.net/daymapidentity/logo.png" class="logo" alt="" style="margin-top: -1.5px; margin-left: 43px; width: 122px;" class="logo-img">
                </a>
            </div>
            <div class="header-user">
                <div class="notification">
                    <a href="/daymap/coms/Messaging.aspx" id="divAlertCount"><i class="mdi mdi-message" title="Go to my messages"></i>` + (!document.querySelector("li[menu-id='1151'] .menu-item-container .menu-item .menu-message-count.hidden") ? `<div class="notification-amount" title="New messages"> ${(document.querySelector("li[menu-id='1151'] .menu-item-container .menu-item .menu-message-count").innerHTML ? document.querySelector("li[menu-id='1151'] .menu-item-container .menu-item .menu-message-count").innerHTML : ``)}</div>` : ``) + `</a>
                </div>
                <div id="divUserAvatar" class="avatar" style="background-Image: url('/DayMap/Images/profile-icon-grey.png'), url('/DayMap/Images/profile-icon-grey.png');" tabindex="1">
                <div class="vertical-menu open-from-right user-menu" style="top:45px"><a class="menu-label">Logged in as ` + document.querySelector(".sname").innerHTML + `</a><a tabindex="3">Sign Out</a><a tabindex="4">My Details</a></div></div>
            </div>
        </div>
        <style>
             .header {
                 transition: all 0.5s ease 0s;
                 position: fixed;
                 left: 0px;
                 right: 0px;
                 top: 0px;
                 height: 78px;
                 box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 1em 0.5em;
                 border-bottom: 1px solid gainsboro;
                 background-color: rgb(255, 255, 255);
                 z-index: 1100;
                 text-align: center;
                 display: flex;
                 flex-flow: row wrap;
                 justify-content: space-between;
                 align-items: center;
            }
            .menuContainer {
                width: 100%;
                font-size: .8rem;
                position: relative;
            }
            .menuContainer .lpMenuTop {
                cursor: pointer;
            }
            .menuContainer .lpMenuTop:hover td, .menuContainer .lpMenuTop.active td {
                color: #6f6f6f;
            }
            .menuContainer .lpMenuTop td {
                color: #bcbcbc;
                background-color: white;
                border-bottom: 1px solid white;
                border-left: 2px solid transparent;
                padding: 4px 9px 7px 9px;
                transition: border-bottom .5s, color .2s;
                white-space: nowrap;
            }
            .menuContainer .lpMenuTop td:hover, .menuContainer .lpMenuTop td.active {
                border-left: 2px solid #1F9DD9;
                background-color: #f0f0f0;
                color: #000;
            }
            .menuContainer div.lpMenu {
                cursor: pointer;
                position: absolute;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 8px rgba(0, 0, 0, 0.2);
                z-index: 1425;
            }
            .menuContainer div.lpMenu table.lpMenu {
                background-color: white;
                color: #3c3c3c;
            }
            .menuContainer div.lpMenu table.lpMenu tr .lpMenuTd1, .menuContainer div.lpMenu table.lpMenu tr .lpMenuTd1a {
                display: none;
            }
            .menuContainer div.lpMenu table.lpMenu tr .lpMenuTd2, .menuContainer div.lpMenu table.lpMenu tr .lpMenuTd2a {
                text-align: left;
                padding: 7px 11px;
            }
            .menuContainer div.lpMenu table.lpMenu tr .lpMenuTd2 {
                border-left: 2px solid #a0d7f1;
            }
            .menuContainer div.lpMenu table.lpMenu tr .lpMenuTd2a {
                border-left: 2px solid #1F9DD9;
            }
            .menuContainer div.lpMenu table.lpMenu tr:hover {
                background-color: #f0f0f0;
                color: #000;
            }
        </style>`;
            document.querySelector("daymap-nav").remove();
            document.querySelector("daymap-menu").remove();
            document.querySelector(".main-layout").style.marginLeft = "0px";
            document.querySelector(".main-layout").style.marginTop = "38.2px";
            for(i = 0; i < document.querySelectorAll(".card").length; i ++) {
                document.querySelectorAll(".card")[i].style.border = "1px solid " + (dark ? "gray" : "gainsboro");
                document.querySelectorAll(".card")[i].style.borderRadius = "4px";
            }
            for(i = 0; i < header.querySelectorAll("td").length; i++) {
                header.querySelectorAll("td")[i].style.backgroundColor = "rgba(" + (dark ? "37, 37, 37," : "237, 235, 233,") + getItem("translucentMode") * 1.2 + ")";
            }
            header.querySelector(".header").style.backgroundColor = "rgba(" + (dark ? "37, 37, 37," : "237, 235, 233,") + getItem("translucentMode") * 1.3 + ")";
            header.querySelector(".header").style.backdropFilter = "blur(" + getItem("blurAmount") + "px)";
            return header;})()); if(getItem("translucentMode")) {
            }}, 500);
            window.setTimeout(() => {
                let lpmenuScript = document.createElement("script");
                lpmenuScript.textContent = "let _mnu = new LoopMenu(document.querySelector('#mnu'), null);	_mnu.MenuHtml[272] = null; _mnu.MenuHtml[1] = \"<table class='lpMenu' cellspacing='0'><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Feed View</td><td class='lpMenuTd3' href=\\\"/daymap/student/dayplan.aspx\\\" menuId='2'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Timetable</td><td class='lpMenuTd3' href=\\\"/daymap/timetable/timetable.aspx\\\" menuId='3'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Homework</td><td class='lpMenuTd3' href=\\\"/daymap/student/homework.aspx\\\" menuId='36'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Summary</td><td class='lpMenuTd3' href=\\\"/daymap/student/studentreport.aspx\\\" menuId='56'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Portfolio</td><td class='lpMenuTd3' href=\\\"/daymap/student/portfolio.aspx\\\" menuId='175'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Mobile Daymap</td><td class='lpMenuTd3' href=\\\"/daymap/m/index.aspx\\\" menuId='141'>&nbsp;</td></tr></table>\";_mnu.MenuHtml[2] = null;_mnu.MenuHtml[3] = null;_mnu.MenuHtml[36] = null;_mnu.MenuHtml[56] = null;_mnu.MenuHtml[175] = null;_mnu.MenuHtml[141] = null;_mnu.MenuHtml[4] = \"<table class='lpMenu' cellspacing='0'><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Diary</td><td class='lpMenuTd3' href=\\\"/daymap/timetable/diary.aspx\\\" menuId='46'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Class List</td><td class='lpMenuTd3' href=\\\"/daymap/student/classes.aspx\\\" menuId='47'>&nbsp;</td></tr></table>\";_mnu.MenuHtml[46] = null;_mnu.MenuHtml[47] = null;_mnu.MenuHtml[5] = \"<table class='lpMenu' cellspacing='0'><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Task Finder</td><td class='lpMenuTd3' href=\\\"/daymap/student/assignments.aspx\\\" menuId='6'><img src='/DayMap/images/arrow_right.gif' align='right' border='0'></td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Results</td><td class='lpMenuTd3' href=\\\"/daymap/student/portfolio.aspx?tab=Assessment_Results\\\" menuId='274'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Schedule</td><td class='lpMenuTd3' href=\\\"/daymap/student/portfolio.aspx?tab=Assessment_Schedule\\\" menuId='275'>&nbsp;</td></tr></table>\";_mnu.MenuHtml[6] = \"<table class='lpMenu' cellspacing='0'><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>Current</td><td class='lpMenuTd3' href=\\\"/daymap/student/assignments.aspx?Status=1\\\" menuId='8'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>All For This Year</td><td class='lpMenuTd3' href=\\\"/daymap/student/assignments.aspx?Status=2\\\" menuId='9'>&nbsp;</td></tr><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>All</td><td class='lpMenuTd3' href=\\\"/daymap/student/assignments.aspx?Status=0\\\" menuId='41'>&nbsp;</td></tr></table>\";_mnu.MenuHtml[8] = null;_mnu.MenuHtml[87] = \"<table class='lpMenu' cellspacing='0'><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>My Messages</td><td class='lpMenuTd3' href=\\\"/daymap/coms/Messaging.aspx\\\" menuId='134'>&nbsp;</td></tr></table>\";_mnu.MenuHtml[134] = null;_mnu.MenuHtml[67] = \"<table class='lpMenu' cellspacing='0'><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2'>My Calendars</td><td class='lpMenuTd3' href=\\\"/daymap/calendar/MyCalendar.aspx\\\" menuId='196'>&nbsp;</td></tr></table>\";_mnu.MenuHtml[9] = null;_mnu.MenuHtml[41] = null;_mnu.MenuHtml[274] = null;_mnu.MenuHtml[275] = null;_mnu.MenuHtml[196] = null;_mnu.MenuHtml[261] = null;_mnu.MenuHtml[16] = \"<table class='lpMenu' cellspacing='0'><tr><td class='lpMenuTd1'><div></div></td><td class='lpMenuTd2' onclick=\\\"document.querySelector('#toolbox').style.display = 'block'\\\">Daymap Graphics Command Center</td><td class='lpMenuTd3' menuId='60'>&nbsp;</td></tr></table>\";_mnu.MenuHtml[60] = null;";
                document.querySelector("body").appendChild(lpmenuScript);
            }, 1000);
        }
    } catch (error) {
        //alert("An error has occured with the script. Please contact apate98.\n" + error)
    }
})();