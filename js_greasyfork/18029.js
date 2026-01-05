// ==UserScript==
// @name        Reputation Timer
// @namespace   Reputation Timer
// @description http://hackforums.net/showthread.php?tid=5202767
// @include     *hackforums.net/reputation.php?action=add&uid=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18029/Reputation%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/18029/Reputation%20Timer.meta.js
// ==/UserScript==

uid = GM_getValue("uid", true);

if (uid == true) {
	$.get("http://hackforums.net/index.php", function(data) {
		var regex = /Welcome back(.*?)strong/i;
		var match = regex.exec(data);
		uid = match[0].substr(79).split('"');	
		GM_setValue("uid", uid[0]);			
	});
	alert("Script successfully configured. Please reload.");
} else {
	$(".smalltext").before("<div class='smalltext'>Reputations left today : <span id='repsLeft'></span></div>");
	$.get("http://hackforums.net/repsgiven.php?uid="+uid, function(data) {
		var date = [];
		$(data).find(".repvote .repvoteright").each(function(i) {
			date[i] = $(data).find("table.tborder:nth-child(2) > tbody:nth-child(1) > tr:nth-child("+(i+5)+") .repvote .repvoteright").html();
		});
		var match = [];
		for (var i = 0; i < 5; i++) {
			if (/(Today)/i.test(date[i]) == true) {
				match[i] = 1;
			} else if (/(Yesterday)/i.test(date[i]) == true) {
				var dateObj = new Date();
				var hour = dateObj.getHours();
				var minute = dateObj.getMinutes();
				var tempDate = date[i].substr(11).split(":");
				if (tempDate[0] > hour) {
					match[i] = 1;
				} else if (tempDate[0] == hour) {
					console.log("same h");
					if (tempDate[1] > minute) {
						match[i] = 1;
					}
				}
			}
		}
		left = 5 - match.length;
		$("#repsLeft").html(left);
	});
}