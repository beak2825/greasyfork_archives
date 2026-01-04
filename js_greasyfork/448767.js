// ==UserScript==
// @name         Grundos.cafe - SC/Colt/WoE/HS/BT
// @namespace    https://greasyfork.org/users/748951
// @version      v2.0.11
// @description  Timers for Scratchcard, Wheel of Excitement, Healing Springs, and Training School
// @author       ben (mushroom), alexa, dani (Mousekat)
// @include      https://grundos.cafe/*
// @include      https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/userlookup/?user=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/448767/Grundoscafe%20-%20SCColtWoEHSBT.user.js
// @updateURL https://update.greasyfork.org/scripts/448767/Grundoscafe%20-%20SCColtWoEHSBT.meta.js
// ==/UserScript==

//Storgage
var storage;
localStorage.getItem("MTlogger==") != null ? storage = JSON.parse(localStorage.getItem("MTlogger==")) : storage = {cz_time: "N/A", sc_time: "N/A", woe_time: "N/A", hs_time: "N/A", bt_time: "N/A", display: true, students: {}};

//Change Hex Codes to Change Colors
var cznotReady = '#fec89a';
var czready = '#f4a261';
var scnotReady = '#EBFDFF';
var scready = '#9BF6FF';
var hsnotReady = '#DCD6FF';
var hsready = '#BDA1FF';
var btnotReady = '#FFBFF4';
var btready = '#FF93ED';
var woenotReady = '#FDFFB6';
var woeready = '#FBFF85';
var womnotReady = '#FDFFB6';
var womready = '#FBFF85';

var czlheight = '34';
var czheight = '50';
var sclheight = '74';
var scheight = '90';
var btlheight = '114';
var btheight = '130';
var woelheight = '150';
var woeheight = '170';
var hslheight = '194';
var hsheight = '210';

var leftpos = '950';

//-----------------------hex codes online: https://coolors.co/
        // Append the CSS to the page
    let customCSS = `
    #CZtimerContainer, #SCtimerContainer, #HStimerContainer,  #BTtimerContainer, #WOEtimerContainer, #CZtimerLabel, #SCtimerLabel, #WOEtimerLabel, #HStimerLabel, #BTtimerLabel {
        color: black;
        text-align: center;
        text-transform: lowercase;
        padding: 3px;
        letter-spacing: 2px;
        font-weight: 500;
        font-size: 0.9em;
        color: #000;
        border-radius:25px;
    }

        #CZtimerContainer a, #SCtimerContainer a, #HStimerContainer a, #BTtimerContainer a, #WOEtimerContainer a, #CZtimerLabel a, #SCtimerLabel a, #WOEtimerLabel a, #HStimerLabel a, #BTtimerLabel a {
        color: black;
        text-align: center;
        text-transform: lowercase;
        border: 0px solid pink;
        padding: 3px;
        letter-spacing: 2px;
        font-weight: 600;
        font-size: 0.9em;
        color: #000;
    }
    `;

    $("<style>").prop("type", "text/css").html(customCSS).appendTo("head");
//Begin Code-----

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

if(page_html.indexOf("The Water Faerie says a few magical words and...") !== -1){
    storage.hs_time = new Date().getTime();
    localStorage.setItem("MTlogger==", JSON.stringify(storage));
}

if(page_html.indexOf("pulls out a ticket... and...") !== -1){
    storage.bt_time = new Date().getTime();
    localStorage.setItem("MTlogger==", JSON.stringify(storage));
}

// Wheel of excitement
$('form[action="/faerieland/wheel/"').submit(function( event ) {
  storage.woe_time = new Date().getTime();
  localStorage.setItem("MTlogger==", JSON.stringify(storage));
  this.submit();
});



//Static Containers
var CZtimerLabel = document.createElement("div");
CZtimerLabel.id = "CZtimerLabel";
CZtimerLabel.innerHTML = "<a href=https://www.grundos.cafe/desert/shrine/ style='color:#000000'>Coltzan</a>"
CZtimerLabel.style = "position:absolute;left:950;top:" + czlheight + ";background:transparent;padding-top:1px;padding-bottom:1px;width:103text-align:left;";

var SCtimerLabel = document.createElement("div");
SCtimerLabel.id = "SCtimerLabel";
SCtimerLabel.innerHTML = "<a href=https://www.grundos.cafe/winter/kiosk/ style='color:#000000'>TM</a>"
SCtimerLabel.style = "position:absolute;left:950;top:" + sclheight + ";background:transparent;padding-top:1px;padding-bottom:1px;width:103text-align:left;";

var WOEtimerLabel = document.createElement("div");
WOEtimerLabel.id = "WOEtimerLabel";
WOEtimerLabel.innerHTML ="<padding-top:-15; position:absolute; left:757px; top: 66px; background:FFEBFF;><a href=https://www.grundos.cafe/faerieland/wheel/ style='color:#000000'>WoE</a><a href=https://www.grundos.cafe/quickstock/ style='font-size: 15px; font-weight:800;color:#000000'>&nbsp;&nbsp;&#10032;&nbsp;&nbsp;</a><br>";
WOEtimerLabel.style = "position:absolute;left:950;top:" + woelheight + ";background:transparent;padding-top:1px;padding-bottom:1px;width:103text-align:left;";

var HStimerLabel = document.createElement("div");
HStimerLabel.id = "HStimerLabel";
HStimerLabel.innerHTML = "<a href=https://www.grundos.cafe/faerieland/springs/ style='color:#000000'>Springs</a>"
HStimerLabel.style = "position:absolute;left:950;top:" + hslheight + ";background:transparent;padding-top:1px;padding-bottom:1px;width:103text-align:left;";

var BTtimerLabel = document.createElement("div");
BTtimerLabel.id = "BTtimerLabel";
BTtimerLabel.innerHTML = "<a href=/pirates/buriedtreasure/ style='color:#000000'>Treasure</a>"
BTtimerLabel.style = "position:absolute;left:950;top:" + btlheight + ";background:transparent;padding-top:1px;padding-bottom:1px;width:103text-align:left;";


//Scratchcard and Healing Springs
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
var lastBT = storage.bt_time; // get last HS time in epoch time
var lastWOE = storage.woe_time; // get last WOE time in epoch time
var timeSinceCZ = (timeNow - lastCZ) / 60000; // convert milliseconds to minutes
    timeSinceCZ = Math.round(timeSinceCZ); // round the minutes
var timeSinceSC = (timeNow - lastSC) / 60000; // convert milliseconds to minutes
    timeSinceSC = Math.round(timeSinceSC); // round the minutes
var timeSinceHS = (timeNow - lastHS) / 60000; // convert milliseconds to minutes
    timeSinceHS = Math.round(timeSinceHS); // round the minutes
var timeSinceBT = (timeNow - lastBT) / 60000; // convert milliseconds to minutes
    timeSinceBT = Math.round(timeSinceBT); // round the minutes
var timeSinceWOE = (timeNow - lastWOE) / 60000; // convert milliseconds to minutes
    timeSinceWOE = Math.round(timeSinceWOE); // round the minutes
var humanTimeCZ = new Date(lastCZ).toLocaleString(); //display the epoch time as a string a human can read
var humanTimeSC = new Date(lastSC).toLocaleString(); //display the epoch time as a string a human can read
var humanTimeHS = new Date(lastHS).toLocaleString(); //display the epoch time as a string a human can read
var humanTimeBT = new Date(lastBT).toLocaleString(); //display the epoch time as a string a human can read
var humanTimeWOE = new Date(lastWOE).toLocaleString(); //display the epoch time as a string a human can read
var timeUntilCZ = (780 - timeSinceCZ);
var timeUntilSC = (360 - timeSinceSC);
var timeUntilSC2 = (120 - timeSinceSC);
var timeUntilHS = (30 - timeSinceHS);
var timeUntilBT = (180 - timeSinceBT);
var timeUntilWOE = (120 - timeSinceWOE);

//Dynamic Containers
var CZtimerContainer = document.createElement("div");
CZtimerContainer.id = "CZtimerContainer";
CZtimerContainer.innerHTML = (timeConvert(timeUntilCZ));
CZtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + czheight + ";background:" + cznotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";

var SCtimerContainer = document.createElement("div");
SCtimerContainer.id = "SCtimerContainer";
SCtimerContainer.innerHTML = (timeConvert(timeUntilSC));
SCtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + scheight + ";background:" + scnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:10;text-align:center;";

var HStimerContainer = document.createElement("div");
HStimerContainer.id = "HStimerContainer";
HStimerContainer.innerHTML = timeUntilHS + "m";
HStimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + hsheight + ";background:" + hsnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";

var BTtimerContainer = document.createElement("div");
BTtimerContainer.id = "BTtimerContainer";
BTtimerContainer.innerHTML = (timeConvert(timeUntilBT));
BTtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + btheight + ";background:" + btnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";

var WOEtimerContainer = document.createElement("div");
WOEtimerContainer.id = "WOEtimerContainer";
WOEtimerContainer.innerHTML = (timeConvert(timeUntilWOE));
WOEtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + woeheight + ";background:" + woenotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";


//Repeating---------------------------------------------------------------------------S:-checkTime
function checkTime() {

    //Conditionals
    //CZ
    //test = || czDate != todayDate )
    if(timeSinceCZ >= 780) {
        CZtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + czheight + ";background:" + czready + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        CZtimerContainer.innerHTML = "<b>Ready!</b>";
    }

    else if(timeUntilCZ <= 60) {
        CZtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + czheight + ";background:" + cznotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        CZtimerContainer.innerHTML = timeUntilCZ + "m";
    }

    else {
        CZtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + czheight + ";background:" + cznotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        CZtimerContainer.innerHTML = (timeConvert(timeUntilCZ));
    }

        //SC
    if(timeSinceSC >= 360) {
        SCtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + scheight + ";background:" + scready + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        SCtimerContainer.innerHTML = "<b>Ready!</b>";
    }

    else if(timeUntilSC <= 60) {
        SCtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + scheight + ";background:" + scnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        SCtimerContainer.innerHTML = timeUntilSC + "m";
    }

    else {
        SCtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + scheight + ";background:" + scnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        SCtimerContainer.innerHTML = (timeConvert(timeUntilSC));
    }


    //Woe
    if(timeSinceWOE >= 120) {
        WOEtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + woeheight + ";background:" + woeready + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        WOEtimerContainer.innerHTML = "<b>Ready!</b>";
    }

    else if(timeUntilWOE <= 60) {
        WOEtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + woeheight + ";background:" + woenotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        WOEtimerContainer.innerHTML = timeUntilWOE + "m";
    }

    else {
        WOEtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + woeheight + ";background:" + woenotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        WOEtimerContainer.innerHTML = (timeConvert(timeUntilWOE));
    }

    //HS
    if(timeSinceHS >= 30) {
        HStimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + hsheight + ";background:" + hsready + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        HStimerContainer.innerHTML = "<b>Restored!<b>";
    }

    else {
        HStimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + hsheight + ";background:" + hsnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        HStimerContainer.innerHTML = timeUntilHS + "m";
    }

    //BT
    if(timeSinceBT >= 180) {
        BTtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + btheight + ";background:" + btready + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        BTtimerContainer.innerHTML = "<b>Ready!<b>";
    }
    else if(timeUntilBT <= 60) {
        BTtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + btheight + ";background:" + btnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        BTtimerContainer.innerHTML = timeUntilBT + "m";
    }

    else {
        BTtimerContainer.style = "position:absolute;left:" + leftpos + ";top:" + btheight + ";background:" + btnotReady + ";border: 1px solid; padding-top:1px;padding-bottom:1px;width:103;font-size:12;text-align:center;";
        BTtimerContainer.innerHTML = (timeConvert(timeUntilBT));
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
            var h = Math.floor((endDate - newDate)/(1000*60*60));
            var m = Math.floor(((endDate - newDate) % (1000*60*60)) / (1000*60));
            var s = Math.floor(((endDate - newDate) % (1000*60)) / (1000));
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);

            if (s >= 0) {
                timeString = h + ":" + m + ":" + s;
            }
            else {
                timeString = "Course Finished!";
            }
        }

        else {
            timeString = storage.students[student].timeToCompletion;
        }

        function checkTime(i) {
            if (i < 10) {i = "0" + i};
            return i;
            }

            document.getElementById(studentName + "_ttc").innerText = timeString;
        }

    }
//TS Conditionals
(function() {
    'use strict';



    // When on any page with Neopets sidebar, add sidebar modules
    if (document.getElementsByName("a").length > 0) {

        document.body.appendChild(CZtimerLabel);
        document.body.appendChild(SCtimerLabel);
        document.body.appendChild(WOEtimerLabel);
        document.body.appendChild(HStimerLabel);
        document.body.appendChild(BTtimerLabel);
        document.body.appendChild(CZtimerContainer);
        document.body.appendChild(SCtimerContainer);
        document.body.appendChild(HStimerContainer);
        document.body.appendChild(BTtimerContainer);
        document.body.appendChild(WOEtimerContainer);
     
    //first check
    checkTime()

    //refresh every 5 seconds
    setInterval(checkTime, 5000);
    }

})();