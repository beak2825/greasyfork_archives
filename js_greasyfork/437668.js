// ==UserScript==
// @name         Nitro Type Stats Button
// @namespace    https://www.youtube.com/channel/UCElpRuEtQQ3FA_wSRjAVszA
// @version      1.0
// @description  This script adds a "Stats" button to your nitrotype nav bar.
// @author       Nate Dogg
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/437668/Nitro%20Type%20Stats%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/437668/Nitro%20Type%20Stats%20Button.meta.js
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



	function insertAfter(e,r){r.parentNode.insertBefore(e,r.nextSibling)}var li=document.createElement("li");li.className="nav-list-item",li.innerHTML="<a href = 'https://www.nitrotype.com/stats' class = 'nav-link'> Stats </a>";var ref=document.querySelectorAll(".nav-list-item")[5];insertAfter(li,ref),"https://www.nitrotype.com/stats"==window.location.href&&document.querySelectorAll(".nav-list-item")[5].classList.add("is-current");
