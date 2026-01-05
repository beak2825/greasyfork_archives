// ==UserScript==
// @name         CSGOPrices.com bot
// @version      1.4
// @description  reloads much less, uses more precise timing (timestamp diff instead of timer), utilizes AJAX request to get tickets, reloads when absolutely neccessary (page needs to recheck browser for DDoS protection) and blocks the stream as well as other annoyances
// @author       mik13ST (ЖНИК)
// @match        http://csgoprizes.com/get-tickets
// @match        http://leagueprizes.com/get-tickets
// @require	     https://code.jquery.com/jquery-2.1.4.min.js
// @namespace    https://greasyfork.org/users/20071
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/13841/CSGOPricescom%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/13841/CSGOPricescom%20bot.meta.js
// ==/UserScript==)))
if ($(".cf-browser-verification.cf-im-under-attack").length==0 && $("html")[0].innerHTML.indexOf("Our servers are encountering a high traffic right now.")==-1) {
	if (!GM_getValue("welcomeDone", false)) {	
		alert("Hello! I am CSGORage.com bot and I am ready to work!\n\nI will post info in the JS console, press F12 and then click \"console\" to view it.");
		GM_setValue("welcomeDone", true);
	}


	$.each($("script"),function(i,item){item.outerHTML="";}); //delete all their scripts

	retry_enabled=1;
	retry_count=0;

	function getTickets() {
		if (retry_enabled==1 && retry_count<=5) {
			$.ajax({
				url: '/wp-admin/admin-ajax.php?action=ajouterTicket',		
				timeout: 5000,
				success: function(data) {
					if (data.length<20) {
						$("#userCurrentTickets")[0].innerHTML=data;
						console.log(data);
						last_getTickets=Date.now();
						retry_count=0;	
					} else {
						console.log("getting \"high traffic\" message, will reload in 5sec");
						setTimeout(function() {location.reload()},5000);
					}				
				},
				error: function(data,textStatus) {
					if (textStatus=='timeout') {
						retry_count++;
						console.log("getting connection timeout, will reload in 5sec");
						setTimeout(function() {location.reload()},5000);
					} else {
						if (textStatus=='error') {							
							console.log("getting error, will reload in 5sec");
							setTimeout(function() {location.reload()},5000);
						} else {
							console.log(textStatus);
						}
					} 
				}
			});
		}
	}
	if (retry_count>5) {
		console.log("getting error, will reload in 5sec");
		setTimeout(function() {location.reload()},5000);
	}

	function isItTheRightTime(){
		if (Date.now()-last_getTickets > 120000){
			console.log("The right time has come, lauching getTickets().");
			getTickets();		
		} else {
			console.log("Not yet");
		}	
	}
	//getting rid of their timers in hope of resolving a memory leak
	var highestTimeoutId = setTimeout(";");
	for (var i = 0 ; i <= highestTimeoutId ; i++) {
		clearTimeout(i); 
	}	

	getTickets();

	last_getTickets=Date.now();
	timestamp_checker=setInterval(function() {isItTheRightTime();},5000);
	$("iframe")[0].outerHTML="";
	$("#disqus_thread")[0].outerHTML="";
	$("#pub")[0].innerHTML=""; 
	$("#karambit-ads-contest")[0].outerHTML="";
} else {
	console.log("the page is not in working state ... will reload in 5min");
	setTimeout(function() {location.reload()},300000);
	$("iframe")[0].outerHTML="";
}
