// ==UserScript==
// @id             e0ab4aca-0004-4b8d-92cb-2aa415ad0c3e
// @name           GameFAQs - Date Format
// @version        1.5
// @namespace      Takato
// @author         Takato
// @description    Date formatting on GameFAQs
// @include        *://www.gamefaqs.com/*
// @include        *://gamefaqs.com/*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant	aaa
// @downloadURL https://update.greasyfork.org/scripts/1919/GameFAQs%20-%20Date%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/1919/GameFAQs%20-%20Date%20Format.meta.js
// ==/UserScript==

var myRegion = ""; // leave blank for your browser to decide, or type in a region manually eg "en-US", "en-CA", "ja-JP"

// Create <time>
$(".post_time").each(function() {
	var datestring = $(this).text();
	var datestringClean = datestring.replace("Posted ","").replace(/[^a-zA-Z0-9/:]/g, " ");
	var postDateNode;	
	$(this).html("<time datetime=\""+datestringClean+"\">"+datestringClean+"</time>");
});
$("td.lastpost a, td.lastpost:not(:has(*)):not(:empty)").each(function() {
	var datestring = $(this).text();
	$(this).html("<time datetime=\""+datestring+"\">"+datestring+"</time>");
});


// Format <time>
$(".post_time time").each(function(){
	$(this).text(new Intl.DateTimeFormat(myRegion,{year:"numeric", month:"numeric", day:"numeric", hour: "numeric", minute: "numeric", second: "numeric"}).format(new Date($(this).attr("datetime"))).toUpperCase());
});

$("td.lastpost time").each(function(){
	var timestamp = $(this).attr("datetime");
	if (timestamp.indexOf(" ") > -1) {
		timestamp = timestamp.replace(" ", "/" + (new Date().getFullYear()) + " ").replace(/PM/i," PM").replace(/AM/i," AM");
		$(this).attr("datetime", timestamp);
		$(this).text(new Intl.DateTimeFormat(myRegion,{month:"numeric", day:"numeric", hour: "numeric", minute: "numeric"}).format(new Date(timestamp)).toUpperCase().replace(/ PM/i,"PM").replace(/ AM/i,"AM"));
	} else {
		$(this).text(new Intl.DateTimeFormat(myRegion,{year:"numeric", month:"numeric", day:"numeric"}).format(new Date(timestamp)).toUpperCase());
	}
	
});