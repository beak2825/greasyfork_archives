// ==UserScript==
// @name         Neopets: Caption Contest Voter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Votes for a specific caption contest entry every four hours
// @author       Nyu (clraik)
// @match        *://*.neopets.com/games/caption_browse.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41058/Neopets%3A%20Caption%20Contest%20Voter.user.js
// @updateURL https://update.greasyfork.org/scripts/41058/Neopets%3A%20Caption%20Contest%20Voter.meta.js
// ==/UserScript==

var entry_id = "00000000";

var cc_url="http://www.neopets.com/games/caption_browse.phtml";
var vote_url=cc_url+"?page=0&action=vote&actionid=";
var voting_url=vote_url+entry_id;

if(document.URL.toString()==voting_url){
	var neopetsTime=$("[id='nst']")[0].innerHTML.toString();
	var Ntime=neopetsTime.split(':');
	var hours=parseInt(Ntime[0]);
	var minutes=parseInt(Ntime[1]);
	var nh=hours;
	for(var i = 0;i<4;i++){
		var nh=nh+1;
		if(nh==13){
			nh=1;
		}
	}
	window.setInterval(function(){ checkTime(nh,minutes); }, 1000);
}
else if(document.URL.toString()==cc_url) {
	location.href=voting_url;
}
function checkTime(nextVoteHour,nextVoteMinute){
	var neopetsTimeToVote=$("[id='nst']")[0].innerHTML.toString();
	var NtimeToVote=neopetsTime.split(':');
	var hourToVote=parseInt(Ntime[0]);
	var minutesToVote=parseInt(Ntime[1]);
	if(hourToVote==nextVoteHour && minutesToVote > nextVoteMinute){
		location.href=voting_url;
	}
}
