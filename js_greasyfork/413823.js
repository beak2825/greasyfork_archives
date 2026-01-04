
// ==UserScript==
// @name         Nitro Type "Leaderboards" button
// @namespace    https://www.youtube.com/watch?v=0taZDDHiiBo&t=6s_10thingsbored
// @version      1.2
// @description  Using this script you are able to have the Nitro Type "Leaderboards" button back on the navigation bar since it was just moved to the dropdown box – where you can still acces it, but not as easy as it being on the leaderboard..
// @author       Ginfio
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/413823/Nitro%20Type%20%22Leaderboards%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/413823/Nitro%20Type%20%22Leaderboards%22%20button.meta.js
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
 
 /*
 you.like.that;
  if (Skittles.Typer){
      convert.skittle.(food.print);
      user.has();
      user.has(skittles);
      return "Skittles Typer";
      
  }
 
 */


























	function insertAfter(e,r){r.parentNode.insertBefore(e,r.nextSibling)}var li=document.createElement("li");li.className="nav-list-item",li.innerHTML="<a href = '/leaderboards' class = 'nav-link'> Leaderboards </a>";var ref=document.querySelectorAll(".nav-list-item")[5];insertAfter(li,ref),"https://www.nitrotype.com/leaderboards"==window.location.href&&document.querySelectorAll(".nav-list-item")[6].classList.add("is-current");