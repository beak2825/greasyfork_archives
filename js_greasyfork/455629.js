// ==UserScript==
// @name         Bonk Password
// @namespace    bonkio-createpasswordedroom
// @version      1
// @description  d
// @author       Helloim0_0
// @match        https://bonk.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455629/Bonk%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/455629/Bonk%20Password.meta.js
// ==/UserScript==
 
var monthslist = {
    "Jan": "01",
    "Feb": "02",
    "Mar": "03",
    "Apr": "04",
    "May": "05",
    "Jun": "06",
    "Jul": "07",
    "Aug": "08",
    "Sep": "09",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12"
}
 
if(document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_secretroombutton") == null){
    document.getElementById("maingameframe").contentDocument.getElementById("roomlistrefreshbutton").click();
    var secretroombutton = document.getElementById("maingameframe").contentDocument.createElement("div");
    secretroombutton.id = "classic_mid_secretroombutton";
    secretroombutton.classList.value = "brownButton brownButton_classic classic_mid_buttons";
    secretroombutton.textContent = `Secret room`;
    secretroombutton.onclick = function(){
        document.getElementById("maingameframe").contentDocument.getElementById("roomlistcreatewindowgamename").value = document.getElementById("maingameframe").contentDocument.getElementById('pretty_top_name').innerHTML + "'s game";
        document.getElementById("maingameframe").contentDocument.getElementById("roomlistcreatewindowmaxplayers").value = 8;
        document.getElementById("maingameframe").contentDocument.getElementById("roomlistcreatewindowpassword").value = (new Date + '').split(' ')[2] + eval('monthslist.'+(new Date + '').split(' ')[1]) + (new Date + '').split(' ')[3] + '°'
        document.getElementById("maingameframe").contentDocument.getElementById("roomlistcreatecreatebutton").click();
        document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_customgame").click();
    };
    document.getElementById("maingameframe").contentDocument.getElementById("classic_mid").insertBefore(secretroombutton,document.getElementById("maingameframe").contentDocument.getElementById("classic_mid_customgame"))
}