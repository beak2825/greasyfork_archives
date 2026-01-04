// ==UserScript==
// @name         Edval block links
// @namespace    http://tampermonkey.net/
// @version      2024-07-28
// @description  Add additional links in Edval to view room availabilities in blocks
// @author       Alex Brewer
// @match        https://rousehillhs.edval.education/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edval.education
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501987/Edval%20block%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/501987/Edval%20block%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const theDate = checkDate();

    const linkPrefix = "https://rousehillhs.edval.education/timetable#search/" + theDate + "/resourceTimetable/day/";
    const staffRoomOne = "T!AB3,T!AP3,T!IQ1,T!AS1,T!IT1,T!VZ1/false/false/false/false";
    const dBlock = "R!D1,R!D4,R!D9,R!D10,R!D12,R!D13/true/false/false/false";
    const eBlock = "R!E4,R!E9,R!E10,R!E12/true/false/false/false";

    const mainBlock = document.getElementsByClassName("top-bar-section")[0];

    const myTimetable = addButton("Me", "https://rousehillhs.edval.education/timetable");
    const dBlockButton = addButton("D-Block", linkPrefix + dBlock);
    const eBlockButton = addButton("E-Block", linkPrefix + eBlock);

    mainBlock.insertAdjacentElement("beforeend", myTimetable);
    mainBlock.insertAdjacentElement("beforeend", dBlockButton);
    mainBlock.insertAdjacentElement("beforeend", eBlockButton);

    function checkDate(){
        const today = new Date();
        const yyyy = String(today.getFullYear());
        var mm = String(today.getMonth()+1);
        var dd = String(today.getDate());
        if( mm.length == 1){
            mm = "0"+mm
        };
        if( dd.length == 1){
            dd = "0"+dd
        };
        const date = [dd,mm,yyyy].join('-');
        return date;
    }

    function addButton(title, target){
        var container = document.createElement("ul");
        container.classList.add('left');

        var label = document.createElement("li");
        label.classList.add("not-click");

        container.append(label);

        var link = document.createElement("a");
        link.innerText = title;
        link.onclick = (()=>{window.location.href=target;});
        label.append(link);

        return container;
    }
})();