// ==UserScript==
// @name         Rabbit hide bar
// @version      0.4
// @description  try to Hide bottom bar!
// @author       Maximas
// @match        https://www.rabb.it/s/*
// @grant        none
// @namespace https://greasyfork.org/users/246423
// @downloadURL https://update.greasyfork.org/scripts/377667/Rabbit%20hide%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/377667/Rabbit%20hide%20bar.meta.js
// ==/UserScript==

setTimeout(function(){ add(); }, 5000);

function add() {
    'use strict';
     let buttonWrap = document.getElementsByClassName('controls')[0];
     var panels = document.getElementsByClassName('tray');
     var hidebtn = document.createElement("BUTTON");
     var hid = false;
     //var tray = document.getElementsByClassName('tray')[0];
     hidebtn.append(document.createTextNode("H"));
     buttonWrap.append(hidebtn);
     hidebtn.addEventListener ("click", toggle, false);

    function toggle(){
        if (hid) toggleUp();
        else toggleDown();
        hid = !hid;
    }

    function toggleDown(){
       var p1=document.getElementsByClassName("toggle left open");
       for (let i = 0; i <p1.length; i++){
           p1[i].click();
       }
       var p2=document.getElementsByClassName("toggle right open");
       for (let i = 0; i <p2.length; i++){
           p2[i].click();
       }
       for (let i = 0; i <panels.length; i++){
           panels[i].hidden=true;
       }
    }
    function toggleUp(){
       var p1=document.getElementsByClassName("toggle left");
       for (let i = 0; i <p1.length; i++){
           p1[i].click();
       }
       var p2=document.getElementsByClassName("toggle right");
       for (let i = 0; i <p2.length; i++){
           p2[i].click();
       }
       for (let i = 0; i <panels.length; i++){
           panels[i].hidden=false;

       }
    }
}