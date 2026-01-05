// ==UserScript==
// @name         SG Entered / Created / Won Giveaway Page
// @namespace    https://steamcommunity.com/id/Ruphine/
// @version      7
// @description  Added point value, creator, level, and giveaway type at Giveaway > Entered page.
// @author       Ruphine
// @match        https://www.steamgifts.com/giveaways/entered*
// @match        https://www.steamgifts.com/giveaways/created*
// @match        https://www.steamgifts.com/giveaways/won*
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23859/SG%20Entered%20%20Created%20%20Won%20Giveaway%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/23859/SG%20Entered%20%20Created%20%20Won%20Giveaway%20Page.meta.js
// ==/UserScript==

const PROCESS_ENDED_GA = false; //change to [true] to enable info for ended GA too
const SHOW_POINT   = true; //change to [false] to disable giveaway point value
const SHOW_CREATOR = true; //change to [false] to disable giveaway creator
const SHOW_LEVEL   = true; //change to [false] to disable giveaway level
const SHOW_TYPE    = true; //change to [false] to disable giveaway type
const SHOW_STEAM   = true; //change to [false] to disable steam store page link
const CACHE_TIME = 60*60*1000; //1 hour. cache data will be deleted after 1 hour not opening any of created/won/entered page.

var LastSavedData = GM_getValue("lastchecked", 0);
var CachedData;

if(LastSavedData <  Date.now() - CACHE_TIME) //delete cache if over CACHE_TIME has passed
	CachedData = [];
else{
	CachedData = JSON.parse(GM_getValue("cache", "[]"));
	GM_setValue("lastchecked", Date.now()); //refresh cache time countdown
}

ProcessPage($(".widget-container"));

//eventlistener to scan new page added by endless scroll
var observer = new MutationObserver(function(mutations){
	$.each(mutations, function(index, mutation){
		ProcessPage(mutation.addedNodes);
	});
});
var config = {childList: true, attributes: false, characterData: false, subtree: true};
$(".widget-container>div").each(function(index, element){
	observer.observe(element, config);
});

function ProcessPage(parent){
	//Add columns
	if(SHOW_TYPE){
		$(parent).find(".table__heading .table__column--width-fill").after('<div class="table__column--width-small text-center">Type</div>');
		$(parent).find(".table__row-inner-wrap .table__column--width-fill").after('<div class="table__column--width-small text-center table__column-type"></div>');
	}
	if(SHOW_LEVEL){
		$(parent).find(".table__heading .table__column--width-fill").after('<div class="table__column--width-small text-center">Level</div>');
		$(parent).find(".table__row-inner-wrap .table__column--width-fill").after('<div class="table__column--width-small text-center table__column-level"></div>');
	}
	$(parent).find(".table__column--width-small").css("width", 0); // remove responsive column width, to gain more spaces

	//process each giveaway
	$(parent).find(".table__row-inner-wrap").each(function(index, element){
		var timeleft = $(element).find(".table__column--width-fill p")[1].textContent;
		//check if giveaway is still running. currently running giveaway will have "remaining" in the timeleft text. will still run in won page
		if(!/Ended/.test(timeleft) || PROCESS_ENDED_GA || /\/giveaways\/won/.test(window.location.href)){
			var GiveawayID = $(element).find(".table__column__heading")[0].href.split("/")[4];
			var Giveaway_data = $.grep(CachedData, function(e){ return e.id == GiveawayID; });
			if(Giveaway_data.length === 0)// if no data saved
				GetGiveawayData(element);
			else //if giveaway data is already saved
				ShowGiveawayData(element, Giveaway_data[0]);
		}
	});
	$(".table__rows>.table__heading>.table__column--width-small").remove(); //for SG++ weird table__heading inside table__rows
}

function GetGiveawayData(element){
	var GiveawayID = $(element).find(".table__column__heading")[0].href.split("/")[4];
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: "/giveaway/" + GiveawayID + "/",
		onload: function(result){
			var page = result.responseText;

			var point = $(page).find(".featured__heading__small");
			if(point.length > 0){
				point = point[point.length-1].textContent.replace("(", "").replace(")", "").replace("P", ""); //only retrieve point value

				var creator = $(page).find(".featured__column--width-fill.text-right a").text();

				var level = $(page).find(".featured__column--contributor-level").text().replace("Level ", "").replace("+", "");
				if(level === "") level = 0;

				var type;
				var group = $(page).find(".featured__column--group").length > 0;
				var wl = $(page).find(".featured__column--whitelist").length > 0;
				var invite = $(page).find(".featured__column--invite-only").length > 0;
				if(group && wl)
					type = "WL+Group";
				else if(group)
					type = "Group";
				else if(wl)
					type = "Whitelist";
				else if(invite)
					type = "Invite Only";
				else
					type = "Public";

				var store_url = $(page).find(".global__image-outer-wrap--game-large")[0].href;

				var Giveaway_data = {id: GiveawayID, point: point, creator: creator, level: level, type: type, store: store_url};
				ShowGiveawayData(element, Giveaway_data);
				CachedData.push(Giveaway_data);
				GM_setValue("cache", JSON.stringify(CachedData));
				GM_setValue("lastchecked", Date.now());
			}
			else // giveaway deleted or user blacklisted or user not group member anymore
				console.log("Unable to get data from www.steamgifts.com/giveaway/" + GiveawayID + "/");
		}
	});
}

function ShowGiveawayData(element, data){
	if(SHOW_POINT){
		var title = $(element).find(".table__column--width-fill p a")[0];
		var node = document.createTextNode(" (" + data.point + "P)");
		title.insertBefore(node, title.firstChild.nextSibling);
	}
	if(SHOW_CREATOR && !/\/giveaways\/created/.test(window.location.href)){ //prevent run in created page
		var timeleft = $(element).find(".table__column--width-fill p")[1];
		$(timeleft).append(" by <a class='giveaway__username' href='/user/" + data.creator + "'>" + data.creator + "</a>");
	}
	if(SHOW_LEVEL)
		$(element).find(".table__column-level")[0].innerHTML = data.level;
	if(SHOW_TYPE)
		$(element).find(".table__column-type")[0].innerHTML = data.type;
	if(SHOW_STEAM){
		var title = $(element).find(".table__column--width-fill p a")[0];
		var icon = '<a class="giveaway__icon" rel="nofollow" target="_blank" href="' + data.store + '"><i class="fa fa-steam" style="vertical-align: initial;"></i></a>';
		$(title).append(icon);
	}
}