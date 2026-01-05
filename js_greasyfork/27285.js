// ==UserScript==
// @name			AniDB.net status icons next to titles
// @namespace		dexter86
// @description		Adds icons next to anime titles corresponding to its filestate, liststate, wishlist & notification status. Also adds red "(18+)" if anime is "18 Restricted". On Anime page it also adds Mylist & Seen count.
// @include			http://anidb.net/*
// @include			https://anidb.net/*
// @grant			none
// @version			6.4.8
// @supportURL		https://anidb.net/forum/thread/50589
// @downloadURL https://update.greasyfork.org/scripts/27285/AniDBnet%20status%20icons%20next%20to%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/27285/AniDBnet%20status%20icons%20next%20to%20titles.meta.js
// ==/UserScript==
"use strict";
/*
TO DO
detecting dynamic changes with wishlist/notify (animepage, seasons chart, etc)
title wrap in related/similar on animepage
customization per pagetype
check with https://www.microsoft.com/en-us/store/p/tampermonkey/9nblggh5162s
*/
var classes = [
	"restricted",
	"state_deleted",
	"state_mixed",
	"state_oncd",
	"state_onhdd",
	"state_onserver",
	"state_unknown",
	"liststate_collecting",
	"liststate_completed",
	"liststate_dropped",
	"liststate_stalled",
	"liststate_unknown",
	"liststate_watching",
	"blacklist",
	"wishlist_type_buddy",
	"wishlist_type_toget",
	"wishlist_type_towatch",
	"wishlist_type_undefined",
	"wishlist_priority_low",
	"wishlist_priority_med",
	"wishlist_priority_high",
	"notification",
	"notification_type_all",
	"notification_type_new",
	"notification_type_group",
	"notification_type_complete",
	"notification_priority_low",
	"notification_priority_med",
	"notification_priority_high"
	];

var img = [
	"<span style='color: #BC1818'> (18+)</span>", //&#10084;
	"<span style='margin-left:0.5em;' class='i_icon i_state_deleted' title='File with status: deleted'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_state_mixed' title='File with status: mixed state'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_state_oncd' title='File with status: external storage (cd/dvd/...)'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_state_onhdd' title='File with status: internal storage (hdd)'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_state_onserver' title='File with status: remote storage (NAS/cloud/...)'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_state_unknown' title='File with status: unknown'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_liststate_collecting' title='State: collecting'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_liststate_completed' title='State: completed'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_liststate_dropped' title='State: dropped'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_liststate_stalled' title='State: stalled'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_liststate_unknown' title='State: unknown'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_liststate_watching' title='State: watching'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_wishlist_blacklist' title='Wishlist Type: blacklist'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_wishlist_buddy' title='Wishlist Type: buddy recommendations'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_wishlist_toget' title='Wishlist Type: to get'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_wishlist_towatch' title='Wishlist Type: to watch'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_wishlist_undefined' title='Wishlist Type: undefined'></span>",
	"<span style='margin-left:0.2em;' class='i_icon i_pri_low' title='Wishlist priority: low'></span>",
	"<span style='margin-left:0.2em;' class='i_icon i_pri_med' title='Wishlist priority: medium'></span>",
	"<span style='margin-left:0.2em;' class='i_icon i_pri_high' title='Wishlist priority: high'></span>",
	"<span style='margin-left:0.5em;' class='i_icon i_notify' title='Notification'></span>",
	" all",
	" new",
	" group",
	" complete",
	"<span style='margin-left:0.2em;' class='i_icon i_pri_low' title='Notification priority: low'></span>",
	"<span style='margin-left:0.2em;' class='i_icon i_pri_med' title='Notification priority: medium'></span>",
	"<span style='margin-left:0.2em;' class='i_icon i_pri_high' title='Notification priority: high'></span>"
	];

function ExtractValue(a) {
	var i,
		querystring = document.head.querySelector("meta[data-anidb-url]").getAttribute("data-anidb-url").substring(document.head.querySelector("meta[data-anidb-url]").getAttribute("data-anidb-url").indexOf("?")+1).split("&");
	//console.log("querystring: ", querystring);
	for (i = 0; i < querystring.length; i++) {
		if (querystring[i].split("=")[0] === a) {
			return querystring[i].split("=")[1];
		}
	}
}

function AniDB(page) {
	if (page === "anime") {
		var aftertitle = "",
			i,
			j,
			mylisteps = document.querySelector("tr.inmylist>td.value"),
			mylistseen = document.querySelector("tr.mylistseen>td.value"),
			myliststats = "";
		var mydata_filestate = [
			"i_state_deleted",
			"i_state_mixed",
			"i_state_oncd",
			"i_state_onhdd",
			"i_state_onserver",
			"i_state_unknown"
			];
		var mydata_liststate = [
			"i_liststate_collecting",
			"i_liststate_completed",
			"i_liststate_dropped",
			"i_liststate_stalled",
			"i_liststate_unknown",
			"i_liststate_watching"
			];
		var mydata_priorities = [
			"i_pri_low",
			"i_pri_med",
			"i_pri_high"
			];
		var mydata_wishlist = [
			"i_wishlist_blacklist",
			"i_wishlist_buddy",
			"i_wishlist_toget",
			"i_wishlist_towatch",
			"i_wishlist_undefined"
			];
		//18 restricted
		if (document.querySelector("a[href='/tag/2615/animetb']") !== null) {
			aftertitle += img[0];
		}
		//filestate
		for (i = 0; i < mydata_filestate.length; i++) {
			if (document.querySelector("tr.status a." + mydata_filestate[i]) !== null) {
				aftertitle += img[1+i];
				break;
			}
		}
		//liststate
		for (i = 0; i < mydata_liststate.length; i++) {
			if (document.querySelector("tr.status a." + mydata_liststate[i]) !== null) {
				aftertitle += img[7+i];
				break;
			}
		}
		//wishlist
		for (i = 0; i < mydata_wishlist.length; i++) {
			if (document.querySelector("tr.wishlist div.state>." + mydata_wishlist[i]) !== null) {
				aftertitle += img[13+i];
				for (j = 0; j < mydata_priorities.length; j++) {
					if (document.querySelector("tr.wishlist div.state>." + mydata_priorities[j]) !== null) {
						aftertitle += img[18+j];
						break;
					}
				}
				break;
			}
		}
		//notification
		if (document.querySelector("tr.notification div.state") !== null) {
			var notifytype = document.querySelector("tr.notification div.state>span[title='Notification Type']").textContent;
			aftertitle += img[21] + notifytype;
			for (i = 0; i < mydata_priorities.length; i++) {
				if (document.querySelector("tr.notification div.state>." + mydata_priorities[i]) !== null) {
					aftertitle += img[26+i];
					break;
				}
			}
		}
		//mylist stats
		if (mylisteps === null || mylistseen === null) {
			mylisteps = document.querySelector("div.g_section.mylist td.state:nth-child(2)");
			mylistseen = document.querySelector("div.g_section.mylist td.state:nth-child(3)");
		}
		if (mylisteps !== null && mylistseen !== null) {
			myliststats = "Mylist state: " + mylisteps.innerHTML + ", Seen: " + mylistseen.innerHTML;
			//myliststats = "";
		}
		//finishing touch :)
		var title = document.querySelector("h1.anime");
		if (title !== null) {
		  title.innerHTML = "<div style='display: flex; white-space: nowrap;'><div>" + title.innerHTML + aftertitle + "</div><div style='width: 100%;'></div><div>" + myliststats + "</div></div>";
		}
	}
	AddStatusIcons(page);
}

function AddStatusIcons(page) {
	//console.log("page: ", page);
	var ElementsWithClassInfo,
		i,
		j,
		k,
		LinksToProcess,
		LinksToProcessAdditional;
	for (i = 0; i < classes.length; i++) {
		if ((page === "mywishlist" && ((i >= 1 && i <=6) || (i>= 13 && i <= 28))) || (page === "mylist" && i >= 1 && i <= 12) || (page === "mynotifies" && ((i >= 1 && i <=6) || (i>= 21 && i <= 28)))) {
			continue;
		}
		ElementsWithClassInfo = document.querySelectorAll("." + classes[i]);
		//console.log(classes[i] + ": ", ElementsWithClassInfo);
		for (j = 0; j < ElementsWithClassInfo.length; j++) {
			//console.log("zmienna j: " + j);
			if ((ElementsWithClassInfo[j].nodeName === "TABLE") || (ElementsWithClassInfo[j].nodeName === "IMG")) {
				continue;
			}
			LinksToProcess = ElementsWithClassInfo[j].querySelectorAll("a[href^='/anime/']");
			//console.log("LinksToProcess ID " + j + ": ", LinksToProcess);
			if ((page === "userpage") || (page === "myfavourites") || (page === "addfavourite")) {
				//https://anidb.net/perl-bin/animedb.pl?show=userpage
				//https://anidb.net/perl-bin/animedb.pl?show=myfavourites
				//https://anidb.net/perl-bin/animedb.pl?show=addfavourite
				LinksToProcessAdditional = ElementsWithClassInfo[j].querySelectorAll("a[href^='/character/']");
			}
			if ((LinksToProcess === null) || (LinksToProcess === undefined)) {
			} else {
				for (k = 0; k < LinksToProcess.length; k++) {
					if (page === "anime" && LinksToProcess[k].getAttribute("title") === "Expand this release") {
						continue;
						//without it, script would add status icons on Anime page > Groups > Plus button on the left
					}
					if (LinksToProcess[k].querySelector(".g_image") !== null) {
						continue;
						//without it, script would add status icons under thumbnails
					}
					LinksToProcess[k].innerHTML += img[i];
					break;
				}
			}
			if ((LinksToProcessAdditional === null) || (LinksToProcessAdditional === undefined)) {
			} else {
				for (k = 0; k < LinksToProcessAdditional.length; k++) {
					if (LinksToProcessAdditional[k].querySelector(".g_image") !== null) {
						continue;
						//without it, script would add status icons under thumbnails
					}
					LinksToProcessAdditional[k].innerHTML += img[i];
					break;
				}
			}
		}
	}
}

AniDB(ExtractValue("show"));
