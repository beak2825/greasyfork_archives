// ==UserScript==
// @name         Elron calendar event link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add google calendar event creation links to all trips on the elron website
// @author       You
// @match        https://elron.pilet.ee/*
// @icon         https://www.google.com/s2/favicons?domain=pilet.ee
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432158/Elron%20calendar%20event%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/432158/Elron%20calendar%20event%20link.meta.js
// ==/UserScript==

//pad zero
function pz(x) {if (x.length == 1) {return "0" + x;} else {return x}}

(function() {
    'use strict';
    let didIt = false;
    let interval = window.setInterval(function () {
    [].forEach.call(document.getElementsByClassName("single-ticket__content"), function (el) {
        if (!didIt) {
            window.clearInterval(interval);
            let details = el.getElementsByClassName("description");
          	let currentLocalDate = new Date();
          	let offset = currentLocalDate.getTimezoneOffset()/60;
            let route = details[0].innerText;
            let time = details[1].innerText; console.log(time);
            let ymd = time.split(" ")[4].split(".")[2] + time.split(" ")[4].split(".")[1] + time.split(" ")[4].split(".")[0];
          	let starth=parseInt((time.split(" ")[0].split(":")[0]),10)+offset;
          	let startm=(time.split(" ")[0].split(":")[1]);
            let startz=ymd + "T" + pz(starth.toString()) + pz(startm.toString()) +"00Z";
          	let endh = parseInt((time.split(" ")[2].split(":")[0]),10)+offset;
            let endm = time.split(" ")[2].split(":")[1];
            let endz=ymd + "T" + pz(endh.toString()) + endm +"00Z";
            let link = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent("ELRON: " + route) + "&details=blank&location=" + encodeURIComponent(route.split(" ")[0]) + "&dates=" + encodeURIComponent(startz + "/" + endz);
            el.insertAdjacentHTML("beforeend", '<a href="' + link + '" target="_blank"><button>Add to calendar</button></a>');
        }});
    }, 500);                                                                                                                                           //=20211227T18-22800Z/20211227T19-25200Z
    //https://www.google.com/calendar/render?action=TEMPLATE&text=ELRON+Tallinn+%E2%80%BA+Rakke&details=%C3%9Che+korra+sooduspilet&location=Tallinn&dates=20210912T094000Z%2F20210913T110700Z
})();