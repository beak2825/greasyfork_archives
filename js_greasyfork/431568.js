// ==UserScript==
// @name         NPC - Dailies Timers
// @namespace
// @version      0.3
// @description  Timerz for dailies, resets at midnight NST
// @author       dani (Mousekat), ben (mushroom) / Customized by an Asher (sidefury)
// @include      https://neopetsclassic.com/*
// @include      https://www.neopetsclassic.com/*
// @exclude      https://neopetsclassic.com/lab/process/
// @exclude      https://neopetsclassic.com/island/training/complete/*
// @noframes
// @grant        none
// @namespace https://greasyfork.org/users/799416
// @downloadURL https://update.greasyfork.org/scripts/431568/NPC%20-%20Dailies%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/431568/NPC%20-%20Dailies%20Timers.meta.js
// ==/UserScript==

//Storage
var storage;
localStorage.getItem("DTlogger==") != null ? storage = JSON.parse(localStorage.getItem("DTlogger==")) : storage = {
    current_time: "N/A",
    int_time: "N/A",
    jelly_time: "N/A",
    om_time: "N/A",
    wok_time: "N/A",
    fm_time: "N/A",
    lr_time: "N/A",
    tb_time: "N/A",
    sw_time: "N/A"
};

//Colours
var ready = '#000000';
var done = '#000000';
var readyglow = '#CCCCCC';
var doneglow = '#696969';

//Triggers
var page_html = document.body.innerHTML;

if (page_html.indexOf("Welcome") !== -1){
    storage.current_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}
if (page_html.indexOf("- You have already collected your bank interest today -") !== -1){
    storage.int_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}
if (page_html.indexOf("The Jelly Keeper") !== -1){
    storage.jelly_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}
if (page_html.indexOf("You approach the massive omelette...") !== -1){
    storage.om_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}

if (page_html.indexOf("The Wheel of Knowledge") !== -1){
    storage.wok_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}
if (page_html.indexOf("The Neopets Fruit Machine") !== -1){
    storage.fm_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}
if (page_html.indexOf("The Laboratory") !== -1){
    storage.lr_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}
if (page_html.indexOf("You put your hand into the Tombola and draw the following ticket...") !== -1){
    storage.tb_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}
if (page_html.indexOf("The Snowager") !== -1){
    storage.sw_time = Date.now();
    localStorage.setItem("DTlogger==", JSON.stringify(storage));
}

//When on any page with Neopets sidebar, add sidebar modules
if (document.getElementsByName("a").length > 0) {
    //Container - Interest
    var intContainer = document.createElement("div");
        intContainer.id = "intContainer";
        document.body.appendChild(intContainer);

    //Container - Jelly
    var jellyContainer = document.createElement("div");
        jellyContainer.id = "jellyContainer";
        document.body.appendChild(jellyContainer);

    //Container - Omelette
    var omContainer = document.createElement("div");
        omContainer.id = "omContainer";
        document.body.appendChild(omContainer);

    //Container - Wheel of Knowlegde
    var wokContainer = document.createElement("div");
        wokContainer.id = "wokContainer";
        document.body.appendChild(wokContainer);

    //Container - Fruit Machine
    var fmContainer = document.createElement("div");
        fmContainer.id = "fmContainer";
        document.body.appendChild(fmContainer);

    //Container - Lab Ray
    var lrContainer = document.createElement("div");
        lrContainer.id = "lrContainer";
        document.body.appendChild(lrContainer);

    //Container - Tombola
    var tbContainer = document.createElement("div");
        tbContainer.id = "tbContainer";
        document.body.appendChild(tbContainer);

    //Container - Snowy
    var swContainer = document.createElement("div");
        swContainer.id = "swContainer";
        document.body.appendChild(swContainer);
}

//START checkTime
function checkTime() {

    var dstadjust = 8 //7 during dst, 8 outside of dst

    var timeInt = storage.int_time;
    var inth = timeInt / (1000 * 60 * 60)
    var intnpc = inth - dstadjust
    var int = Math.floor(intnpc / 24)
    var inttime = int

    var timeJelly = storage.jelly_time;
    var jellyh = timeJelly / (1000 * 60 * 60)
    var jellynpc = jellyh - dstadjust
    var jelly = Math.floor(jellynpc / 24)
    var jellytime = jelly

    var timeOm = storage.om_time;
    var omh = timeOm / (1000 * 60 * 60)
    var omnpc = omh - dstadjust
    var om = Math.floor(omnpc / 24)
    var omtime = om

    var timeWok = storage.wok_time;
    var wokh = timeWok / (1000 * 60 * 60)
    var woknpc = wokh - dstadjust
    var wok = Math.floor(woknpc / 24)
    var woktime = wok

    var timeFm = storage.fm_time;
    var fmh = timeFm / (1000 * 60 * 60)
    var fmnpc = fmh - dstadjust
    var fm = Math.floor(fmnpc / 24)
    var fmtime = fm

    var timeLr = storage.lr_time;
    var lrh = timeLr / (1000 * 60 * 60)
    var lrnpc = lrh - dstadjust
    var lr = Math.floor(lrnpc / 24)
    var lrtime = lr

    var timeTb = storage.tb_time;
    var tbh = timeTb / (1000 * 60 * 60)
    var tbnpc = tbh - dstadjust
    var tb = Math.floor(tbnpc / 24)
    var tbtime = tb

    var timeSw = storage.sw_time;
    var swh = timeSw / (1000 * 60 * 60)
    var swnpc = swh - dstadjust
    var swtime = Math.floor(swnpc)

    var epochms = storage.current_time;
    var epochh = epochms / (1000 * 60 * 60)
    var epochnst = epochh - dstadjust
    var epochd = Math.floor(epochnst / 24)
    var epochtime = epochd

    var epochs = Math.floor(epochnst)

    //Color Conditions
    //int
    if(inttime == epochtime) {
        intContainer.innerHTML = "<a href='/bank/' style='font-size:16;color:" + done + "'>&#128176;</a>";
        intContainer.style = "position:absolute;left:780;top:41;width:22;background:" + doneglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    else {
        intContainer.innerHTML = "<a href='/bank/' style='font-size:16;color:" + ready + "'>&#128176;</a>";
        intContainer.style = "position:absolute;left:780;top:41;width:22;background:" + readyglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    //jelly
    if(jellytime == epochtime) {
        jellyContainer.innerHTML = "<a href='/jelly/jelly' style='font-size:16;color:" + done + "'>&#127854;</a>";
        jellyContainer.style = "position:absolute;left:807;top:41;width:22;background:" + doneglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    else {
        jellyContainer.innerHTML = "<a href='/jelly/jelly' style='font-size:16;color:" + ready + "'>&#127854;</a>";
        jellyContainer.style = "position:absolute;left:807;top:41;background:" + readyglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    //om
    if(omtime == epochtime) {
        omContainer.innerHTML = "<a href='/prehistoric/plateau/omelette/' style='font-size:16;color:" + done + "'>&#127859;</a>";
        omContainer.style = "position:absolute;left:834;top:41;width:22;background:" + doneglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    else {
        omContainer.innerHTML = "<a href='/prehistoric/plateau/omelette/' style='font-size:16;color:" + ready + "'>&#127859;</a>";
        omContainer.style = "position:absolute;left:834;top:41;width:22;background:" + readyglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    //wok
    if(woktime == epochtime) {
        wokContainer.innerHTML = "<a href='/medieval/brightvale/wheel/' style='font-size:16;color:" + done + "'>&#128214;</a>";
        wokContainer.style = "position:absolute;left:861;top:41;width:22;background:" + doneglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    else {
        wokContainer.innerHTML = "<a href='/medieval/brightvale/wheel/' style='font-size:16;color:" + ready + "'>&#128214;</a>";
        wokContainer.style = "position:absolute;left:861;top:41;width:22;background:" + readyglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    //fm
    if(fmtime == epochtime) {
        fmContainer.innerHTML = "<a href='/desert/fruimachine/' style='font-size:16;color:" + done + "'>&#127825;</a>";
        fmContainer.style = "position:absolute;left:807;top:69;width:22;background:" + doneglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    else {
        fmContainer.innerHTML = "<a href='/desert/fruimachine/' style='font-size:16;color:" + ready + "'>&#127825;</a>";
        fmContainer.style = "position:absolute;left:807;top:69;width:22;background:" + readyglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    //tombola
    if(tbtime == epochtime) {
        tbContainer.innerHTML = "<a href='/island/tombola/' style='font-size:16;color:" + done + "'>&#128026;</a>";
        tbContainer.style = "position:absolute;left:834;top:69;width:22;background:" + doneglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    else {
        tbContainer.innerHTML = "<a href='/island/tombola/' style='font-size:16;color:" + ready + "'>&#128026;</a>";
        tbContainer.style = "position:absolute;left:834;top:69;width:22;background:" + readyglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    //lr
    if(lrtime == epochtime) {
        lrContainer.innerHTML = "<a href='/lab2/' style='font-size:16;color:" + done + "'>&#x26A1;</a>";
        lrContainer.style = "position:absolute;left:780;top:69;width:22;background:" + doneglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    else {
        lrContainer.innerHTML = "<a href='/lab2/' style='font-size:16;color:" + ready + "'>&#x26A1;</a>";
        lrContainer.style = "position:absolute;left:780;top:69;width:22;background:" + readyglow + ";padding:1px;text-align:center;border-radius:5px;";
    }

    var d = new Date();
    var snow = d.getUTCHours();

    //snowy
    if (swtime == epochs) {
        swContainer.innerHTML = "";
        swContainer.style = "";
    }
    else if(snow == 6){
        swContainer.innerHTML = "<a href='/winter/snowager/' style='color:#6ccdef;'><img src='https://i.imgur.com/mq8eWfQ.png'> Snowy's asleep!</a>";
        swContainer.style = "position:absolute;left:710px;top:40;width:70px;";
    }
    else if(snow == 14){
        swContainer.innerHTML = "<a href='/winter/snowager/' style='color:#6ccdef;'><img src='https://i.imgur.com/mq8eWfQ.png'> Snowy's asleep!</a>";
        swContainer.style = "position:absolute;left:710px;top:40;width:70px;";
    }
    else if(snow == 22){
        swContainer.innerHTML = "<a href='/winter/snowager/' style='color:#6ccdef;'><img src='https://i.imgur.com/mq8eWfQ.png'> Snowy's asleep!</a>";
        swContainer.style = "position:absolute;left:710px;top:40;width:70px;";
    }
    else {
        swContainer.innerHTML = "";
        swContainer.style = "";
    }
}

//end of code
(function(){
    "use strict";

    //first check
    checkTime()

    //refresh every 5 seconds
    setInterval(checkTime, 5000);

})();