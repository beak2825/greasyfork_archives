// ==UserScript==
// @name        Steam Auto Queue
// @namespace   SteamAutoQueue@Byzod.user.js
// @description 自动探索Steam队列，有延时，可暂停
// @include     /^https?:\/\/store\.steampowered\.com\/((?:agecheck\/)?app\/\d+|explore)/
// @version     1
// @grant       none
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/30926/Steam%20Auto%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/30926/Steam%20Auto%20Queue.meta.js
// ==/UserScript==

// Settings
var AUTO_DISCOVERY_QUEUE = true;
var AUTO_DISCOVERY_QUEUE_DELAY = 0;
var AUTO_DISCOVERY_QUEUE_STOPPED_TITLE_PREFIX = "【已停止梦游】";
var AUTO_DISCOVERY_QUEUE_WITHOUT_CARD_DROP = false;
// Settings End


// Auto discovery queue
if(AUTO_DISCOVERY_QUEUE){
	let timeoutId = setTimeout(AutoQueue, AUTO_DISCOVERY_QUEUE_DELAY);
	
	document.addEventListener(
		"keydown",
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			document.title = AUTO_DISCOVERY_QUEUE_STOPPED_TITLE_PREFIX + document.title;
			setTimeout(
				()=>{
					document.title = document.title.replace(AUTO_DISCOVERY_QUEUE_STOPPED_TITLE_PREFIX,"")
				},
				1000
			);
			clearTimeout(timeoutId);
			console.log("Auto Queue Stopped");
		},
		{capture:true, once:true}
	);
}

// Auto browse discovery queue
function AutoQueue(){
	var discoveryQueueWinterSaleCardsHeaderSubText = document.getElementsByClassName('subtext');
	var refreshQueueBtn = document.getElementById('refresh_queue_btn');
	if (refreshQueueBtn != null 
		&& (AUTO_DISCOVERY_QUEUE_WITHOUT_CARD_DROP
			|| ( discoveryQueueWinterSaleCardsHeaderSubText.length > 0 
				&& /^.+\s\d\s.+$/.test(discoveryQueueWinterSaleCardsHeaderSubText[0].innerHTML)
				)
			)
	){
		setTimeout(()=>{refreshQueueBtn.click()}, 500);
	}
	var nextInQueueForm = document.getElementById('next_in_queue_form');
	if (nextInQueueForm !== null){
		nextInQueueForm.submit();
		console.log("SteamTemp: nextInQueueForm submit");
	}

	var ageYear = document.getElementById('ageYear');
	if (ageYear !== null) {
		ageYear.selectedIndex = 77;
		DoAgeGateSubmit();
		console.log("SteamTemp: ageYear submit");
	}else{
		console.log("SteamTemp: ageYear not found");
	}
	
	var appId = location.href.match(/app\/(\d+)/)[1];
	if(document.title === "Site Error"){
		$J.post("/app/7", { sessionid: g_sessionID, appid_to_clear_from_queue: appId });
		console.warn("Locked game: " + appId + " removed.");
		window.location = "http://store.steampowered.com"
	}
}