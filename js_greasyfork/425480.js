// ==UserScript==
// @name     BGG Better Timestamps
// @version  2.1
// @description Allows you to easily see the full timestamps of posts on boardgamegeek.com
// @author uthbees
// @include *boardgamegeek.com/*
// @namespace uthbees_scripts
// @downloadURL https://update.greasyfork.org/scripts/425480/BGG%20Better%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/425480/BGG%20Better%20Timestamps.meta.js
// ==/UserScript==

var observer = new MutationObserver(callback);
var targetNode = document.getElementById('mainbody');
var config = {childList: true, subtree: true };
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var ready = true;//Because changing the timestamps triggers the mutation observer, we have to disregard the 'hit' we get from it to prevent an infinite loop.

function callback(mutations) {
	if(ready){
		var timeElements = document.getElementsByTagName('gg-tstamp');
		if(timeElements[0]){
			fixTimestamps(timeElements);
			ready = false;
		}
	}else{
		ready = true;
	}
}

function fixTimestamps(timeElements){
	for (var i = 0; i < timeElements.length; i++)
	{
		//Main text
		var timeElement = timeElements[i].firstChild.firstChild.children[1];
		var timestamp = timeElement.attributes[1].nodeValue;
		timestamp = formatTimestamp(timestamp, "post", "");
		timeElement.innerText = timestamp;
		
		//Tooltip
		timeElement = timeElements[i].children[1];
		if(timeElement.id.slice(0, 12) == "ngb-popover-"){
			timeElement = timeElement.children[1].firstChild.children[1];
			if(timeElement.innerText.slice(-1) != "s"){
				timestamp = timeElement.attributes[1].nodeValue;
				timestamp = formatTimestamp(timestamp, "tooltip", timeElement.innerText);
				timeElement.innerText = timestamp;
			}
		}
	}
}

function formatTimestamp(timestamp, format, tooltip){
	d = new Date(timestamp);
	n = new Date(Date.now());
	
	var month = months[d.getMonth()];
	var date = d.getDate().toString();
	var adjustedYear = d.getYear() != n.getYear() ? ", "+d.getFullYear().toString() : "";
	var hour = ((d.getHours()+11)%12+1).toString();
	var minute = ("0"+d.getMinutes().toString()).slice(-2);
	var AMPM = d.getHours() < 12 ? "am" : "pm";
	
	var second = d.getSeconds().toString();
	
	if(format == "post") return month+" "+date+adjustedYear+" "+hour+":"+minute+" "+AMPM;
	else if(format == "tooltip") return tooltip+" "+second+"s";
	else return "Error - invalid format";
}

observer.observe(targetNode, config);