// ==UserScript==
// @name         Revolution Money Only
// @namespace    http://revolutionmmo.com/
// @version      1.0
// @description  Revolution
// @author       Unknown
// @match        http://revolutionmmo.com/*
// @grant        none
// @include      *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372829/Revolution%20Money%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/372829/Revolution%20Money%20Only.meta.js
// ==/UserScript==

window.onload = function () {
  if(window.location.href.indexOf("streets.php") > -1){
    setTimeout(function(){
      if($("body").text().indexOf("Sorry, you are too exhausted. Come back when you've had a rest.") > -1) {
          window.location.href = "https://revolutionmmo.com/index.php";
      }
      else {
      		window.location.href = "https://revolutionmmo.com/streets.php?act=search";
      }
    }, 2500);
  }
  else if(window.location.href.indexOf("hourly.php") > -1){
    setTimeout(function(){
      if($("body").text().indexOf("You have earned") > -1 || $("body").text().indexOf("You must wait") > -1) {
        	window.location.href = "https://revolutionmmo.com/index.php";
      }
      else {
        	$("input[value='Claim Your Reward']").click();
      }
    }, 2500);
  }
  else if(window.location.href.indexOf("vote.php") > -1){
    setTimeout(function(){
      if (window.location.href.indexOf("name=BBOGD") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=MMORPG100";
      }
      else if (window.location.href.indexOf("name=MMORPG100") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=MMORPG50";
      }
      else if (window.location.href.indexOf("name=MMORPG50") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=mmTop 200";
      }
      else if (window.location.href.indexOf("200") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=MPOGTop";
      }
      else if (window.location.href.indexOf("name=MPOGTop") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=PBBGames";
      }
      else if (window.location.href.indexOf("name=PBBGames") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=Top Web Games";
      }
      else if (window.location.href.indexOf("Web") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=Top500";
      }
      else if (window.location.href.indexOf("name=Top500") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=TopGameSites";
      }
      else if (window.location.href.indexOf("name=TopGameSites") > -1){
        window.location.href = "https://revolutionmmo.com/vote.php?name=TopOnline";
      }
      else if (window.location.href.indexOf("name=TopOnline") > -1){
        window.location.href = "https://revolutionmmo.com/index.php";
      }
      else {
      	window.location.href = "https://revolutionmmo.com/vote.php?name=BBOGD";
      }
    }, 2500);
  }
}