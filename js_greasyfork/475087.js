// ==UserScript==
// @name         bwsCalculator
// @namespace    bwsCalculator
// @version      1.02
// @author       cyndifusic
// @run-at       document-start
// @description  Calculates BWS rank on osu! profiles
     
// @include   http://osu.ppy.sh*
// @include   https://osu.ppy.sh*
// @downloadURL https://update.greasyfork.org/scripts/475087/bwsCalculator.user.js
// @updateURL https://update.greasyfork.org/scripts/475087/bwsCalculator.meta.js
// ==/UserScript==

var currentURL = window.location.href;

var gooooo = function() {
	var rankText = document.getElementsByClassName("value-display__value")[0].innerText;
  if (rankText.length >= 6) {
    rankText = rankText.slice(0, rankText.indexOf(",")) + rankText.slice(rankText.indexOf(",") + 1, rankText.length);
	}
	var rank = parseInt(rankText.slice(1, rankText.length)); 
	var badgeCount = document.getElementsByClassName("profile-badges")[0].children.length;
	var bws = Math.pow(rank, (Math.pow(0.991, Math.pow(badgeCount, 2))));
  
  document.getElementsByClassName("u-ellipsis-pre-overflow")[1].innerHTML += " ("+bws+")";	
	// navigator.clipboard.writeText(bws);
}

var goAgain = function() {
  var doubleCheck = function() {
  	if (window.location.href != currentURL) {
    	currentURL = window.location.href;
    	gooooo();
  	}
  }
  
  setTimeout(doubleCheck, 2000);
}

document.addEventListener("click", goAgain);
setTimeout(gooooo, 1000);

