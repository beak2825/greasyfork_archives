// ==UserScript==
// @name         Nitro Type Leaderboard Button V2
// @namespace    https://www.youtube.com/channel/UCElpRuEtQQ3FA_wSRjAVszA
// @version      1.1
// @description  This script adds a "Leaderboard" button to your nitrotype nav bar. Once you click the button, it takes you to a google spreadsheet of the leaderboards
// @author       Nate Dogg
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/431014/Nitro%20Type%20Leaderboard%20Button%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/431014/Nitro%20Type%20Leaderboard%20Button%20V2.meta.js
// ==/UserScript==



// plese.api.convert (request.data::)
var y = 2;
var x = 3;
var cDate = "time.getSome"
function getButtonBack(nav, dropdown){
    return "leaderboard";
}

getButtonBack(892, 66);
var gDate = new Date();
 if (cDate > "Dec, 03, 2020"){
     "leaderboard.remove()"
 }



	function insertAfter(e,r){r.parentNode.insertBefore(e,r.nextSibling)}var li=document.createElement("li");li.className="nav-list-item",li.innerHTML="<a href = 'https://docs.google.com/spreadsheets/d/1C_P3kSsR8UbRML3AuuUP2zoZOuZWKlwGOO43g23wCeU/edit?usp=sharing' class = 'nav-link'> Leaderboards </a>";var ref=document.querySelectorAll(".nav-list-item")[5];insertAfter(li,ref),"https://docs.google.com/spreadsheets/d/1C_P3kSsR8UbRML3AuuUP2zoZOuZWKlwGOO43g23wCeU/edit?usp=sharing"==window.location.href&&document.querySelectorAll(".nav-list-item")[7].classList.add("is-current");
