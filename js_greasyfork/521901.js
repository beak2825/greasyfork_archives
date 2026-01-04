// ==UserScript==
// @name         Nitro Type Leaderboard Button
// @version      1.2
// @description  It works
// @author       Ashwin
// @match        https://www.nitrotype.com/*
// @namespace https://greasyfork.org/users/900432
// @downloadURL https://update.greasyfork.org/scripts/521901/Nitro%20Type%20Leaderboard%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/521901/Nitro%20Type%20Leaderboard%20Button.meta.js
// ==/UserScript==
 
 
 
// plese.api.convert (request.data::)
var y = 2;
var x = 3;
var cDate = "time.getSome";
function getButtonBack(nav, dropdown){
    return "leaderboard";
}
 
getButtonBack(892, 66);
var gDate = new Date();
 if (cDate > "Dec, 03, 2020"){
     "leaderboard.remove()";
 }
 
 
 
	function insertAfter(e,r){r.parentNode.insertBefore(e,r.nextSibling)}var li=document.createElement("li");li.className="nav-list-item",li.innerHTML="<a href = 'https://ntleaderboards.onrender.com/' class = 'nav-link'> Leaderboards </a>";var ref=document.querySelectorAll(".nav-list-item")[5];insertAfter(li,ref),"https://ntleaderboards.onrender.com/"==window.location.href&&document.querySelectorAll(".nav-list-item")[7].classList.add("is-current");