// ==UserScript==
// @name         Nitro Type Top Teams Button 
// @namespace    https://www.youtube.com/c/SwiftTyper
// @version      1.2
// @description  This script adds a "Top Teams" button to your nitrotype navigation bar. Once you click the button, it takes you to the NT Top Teams Leaderboard
// @author       SwiftTyper
// @match        https://www.nitrotype.com/*
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/449762/Nitro%20Type%20Top%20Teams%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/449762/Nitro%20Type%20Top%20Teams%20Button.meta.js
// ==/UserScript==



// plese.api.convert (request.data::)
var y = 2;
var x = 3;
var cDate = "time.getSome"
function getButtonBack(nav, dropdown){
    return "Top Teams";
}

getButtonBack(892, 66);
var gDate = new Date();
 if (cDate > "Dec, 03, 2020"){
     "leaderboard.remove()"
 }



	function insertAfter(e,r){r.parentNode.insertBefore(e,r.nextSibling)}var li=document.createElement("li");li.className="nav-list-item",li.innerHTML="<a href = 'https://www.nitrotype.com/leaderboards' class = 'nav-link'> Top Teams </a>";var ref=document.querySelectorAll(".nav-list-item")[5];insertAfter(li,ref),"https://www.nitrotype.com/leaderboards"==window.location.href&&document.querySelectorAll(".nav-list-item")[7].classList.add("is-current");