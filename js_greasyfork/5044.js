// ==UserScript==
// @name        What.cd Hide unwated subscription posts
// @namespace   funeral_meat
// @include     https://what.cd/userhistory.php?*action=posts&userid=*
// @version     1
// @grant       none
// @description Adds Ignore link on the What.cd "grouped unread post history" page
// @downloadURL https://update.greasyfork.org/scripts/5044/Whatcd%20Hide%20unwated%20subscription%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/5044/Whatcd%20Hide%20unwated%20subscription%20posts.meta.js
// ==/UserScript==

//initialize empty array for storing ids to ignore
if(localStorage["wcd_ignorethreads"] == undefined) {
	//run the next 2 lines to reset ignored posts
	wcd_ignore_arr = [];
	localStorage["wcd_ignorethreads"] = JSON.stringify(wcd_ignore_arr);
}

//load and clean array of duplicates
wcd_ignore_arr = $.unique(JSON.parse(localStorage["wcd_ignorethreads"]));

window.hidelink = function(id, tname) { // e.g. id = "threadid=123456", tname = "Thread title"
	if(confirm("Ignore the thread '" + unescape(tname) + "'?")) {
		wcd_ignore_arr.push(id);
		localStorage["wcd_ignorethreads"] = JSON.stringify(wcd_ignore_arr);
	
		// hide instantly after confirmation - still to figure out
	}
}

threads = document.getElementsByClassName("thin")[0].getElementsByClassName("forum_post");

//add ignore link or hide it if it's already in the list
for(i = 0; i < threads.length; i++)	{
	ti = threads[i];
	tname = ti.getElementsByClassName("tooltip")[1].innerHTML;
	tnameesc = escape(tname); //for handling single and double quotation marks, and maybe other special chars
	tid = ti.innerHTML.match(/threadid\=[0-9]+/)[0];
	
	//id number required to find link injection point
	postid = ti.id.split("post")[1];
	
	if(wcd_ignore_arr.indexOf(tid) == -1) {
		//make function string
		hl = "'" + 'hidelink("' + tid + '","' + tnameesc + '")' + "'";
		//make html string
		hidelink = '<a href="javascript:void(0)"' + "onClick = " + hl + '; class = "brackets">Ignore</a>';
		//add ignore link before subscribe link
		tispan = ti.getElementsByTagName("span");
		tispan["bar"+postid].innerHTML = hidelink + tispan["bar"+postid].innerHTML;
	
	} else {
		
		ti.hidden = "true";
		
	}
}