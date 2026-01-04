// ==UserScript==
// @name         CUSIS auto reg 4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hard code
// @author       umzr https://github.com/umzr/CUHK-CUSIS-AUTO-Reg
// @match        https://cusis.cuhk.edu.hk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449935/CUSIS%20auto%20reg%204.user.js
// @updateURL https://update.greasyfork.org/scripts/449935/CUSIS%20auto%20reg%204.meta.js
// ==/UserScript==

var xmlHttp;

function srvTime() {
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    } catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (eerr3) {
                //AJAX not supported, use CPU time.
                console.log("asd");
                alert("AJAX not supported");

            }
        }
    }
    xmlHttp.open('HEAD', window.location.href.toString(), false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Date");
}

function display_c() {
    var refresh = 1000; // Refresh rate in milli seconds
    var mytime = setTimeout('display_ct()', refresh);
}

function display_ct() {
    var x = new Date()
    var y = display_c();
    return x.toLocaleString();
}

function addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
}


(function() {
    'use strict';
    var newHTML = document.createElement('div');
    newHTML.innerHTML = '             \
    <div id="FUCKYOUCISIS">             \
        <p>Auto REG </p>     \
        <div>BY: <a href="https://github.com/umzr"  style="color:red;" target="_blank">umzr</a></div><br>\
<h1>CUSIS Server Time:</h1>\
        <div id="serverTime"> </div>\
        <h1>Your Local Time is </h1> \
<span id="localtime" ></span>\
</div>                          \
';

    var setTimes = document.createElement('div');
    setTimes.innerHTML = '             \
    <div id="setTime">             \
<form>\
  <label for="startTime">set time: </label>\
  <input id="startTime" type="time" name="startTime" step="2">\
  <p>\
    <code>trigger</code>ed: <code>\
            "<span id="value">not yet trigger</span>"</code>.\
  </p>\
</form>\
</div>\
';


    document.getElementById("win0hdrdivPTLAYOUT_HEADER_GROUPBOX1").appendChild(newHTML);
    document.getElementById("FUCKYOUCISIS").appendChild(setTimes);


    setInterval(function() {
        const serv = srvTime().split(' ');
        const [shh, smm, sss] = serv[4].split(':');


        var HKG = 8;
        var gohh = 0;
        (parseInt(shh) + HKG >= 24) ? gohh = parseInt(shh) + HKG - 24: gohh = parseInt(shh) + HKG;
        const gotime = addZero(gohh) + ":" + smm + ":" + sss;

        document.getElementById('serverTime').innerHTML = gotime;
        document.getElementById('localtime').innerHTML = display_ct();

        const startTime = document.getElementById("startTime");
        const valueSpan = document.getElementById("value");

        startTime.addEventListener("input", () => {
            valueSpan.innerText = startTime.value;
        }, false);


        const [hh, mm, ss] = startTime.value.split(':');
        const fuckTime = hh + ":" + mm + ":" + ss;
        if (fuckTime == gotime) {
            document.getElementById("DERIVED_SSR_FL_SSR_ENROLL_FL").click();
            valueSpan.innerText = "DONE";
            sleep(500);
        }
    }, 500)
})();