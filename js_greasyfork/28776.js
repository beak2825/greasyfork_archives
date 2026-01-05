// ==UserScript==
// @name        TitleScore
// @namespace   Fergo
// @include     http://www.hltv.org/match/*
// @version     1
// @grant       none
// @description Shows live scores from HLTV match pages in the title bar.
// @downloadURL https://update.greasyfork.org/scripts/28776/TitleScore.user.js
// @updateURL https://update.greasyfork.org/scripts/28776/TitleScore.meta.js
// ==/UserScript==

var wrapper = document.createElement('div');
wrapper.style.textAlign = "center";
var selectText =  '<select id="updateformat" onchange="Display()"><option name="1" value="1">CT-Name 0:0 TR-Name</option><option name="2" value="2">0:0 CT-Name vs TR-Name</option><option name="3" value="3">0:0</option><option name="4" value="4">CT-Name (abbr.) 0:0 TR-Name (abbr.)</option></select>';
wrapper.innerHTML = selectText;

var divBefore = document.getElementById("time");
var divParent = divBefore.parentNode;

divParent.insertBefore(wrapper, divBefore);

window.setInterval(function(){
  var ctScore = document.getElementsByClassName("scoreboard-ctScore")[0];
  var tScore = document.getElementsByClassName("scoreboard-tScore")[0];
  
  var ctName = document.getElementsByClassName("scoreboard-ctTeamHeaderBg")[0].children[0].children[1];
  var tName = document.getElementsByClassName("scoreboard-tTeamHeaderBg")[0].children[0].children[1];
  
  switch(document.getElementById("updateformat").value) {
    case "1":
      document.title = ctName.innerHTML + " " + ctScore.innerHTML + ":" + tScore.innerHTML + " " + tName.innerHTML;
      break;
    case "2":
      document.title = ctScore.innerHTML + ":" + tScore.innerHTML + " " + ctName.innerHTML + " vs " + tName.innerHTML;
      break;
    case "3":
      document.title = ctScore.innerHTML + ":" + tScore.innerHTML;
      break;
    case "4":
      document.title = ctName.innerHTML.substring(0,3) + " " + ctScore.innerHTML + ":" + tScore.innerHTML + " " + tName.innerHTML.substring(0,3);
      break;
  }
}, 5000);