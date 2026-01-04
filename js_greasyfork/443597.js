// ==UserScript==
// @name			Old Reddit: Simple Filter
// @description		Filter subreddits, users, websites and topics
// @version			2019.8.14
// @author			Flightless22
// @license			MIT; https://opensource.org/licenses/MIT
// @namespace		flightless22.ORSF
// @include		 	https://old.reddit.com/*
// @match			*://old.reddit.com/*
// @grant			none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/443597/Old%20Reddit%3A%20Simple%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/443597/Old%20Reddit%3A%20Simple%20Filter.meta.js
// ==/UserScript==
(function() {
	"use strict";
  
  	//TODO: Optimize

	//------------------------------------------
	//-------[User Configurable Settings]-------
	//------------------------------------------
	var subreddit_filter = [];
	var user_filter = [];
	var title_filter = [];
	var site_filter = [];

	var subreddit_filter_on = true;
	var user_filter_on = true;
	var title_filter_on = true;
	var site_filter_on = true;
  var debug = false;

	//------------------------------------------
	//----------[Do Not Edit Below]-------------
	//------------------------------------------

	function init(){
		if (subreddit_filter_on) subreddit_filter_on = subreddit_filter.length > 0;
		if (user_filter_on) user_filter_on = user_filter.length > 0;
		if (title_filter_on) title_filter_on = title_filter.length > 0;
		if (site_filter_on) site_filter_on = site_filter.length > 0;

		console.log("%c> Reddit Simple Filter: ", "color:#ffa600",
			"{ Subreddits (" + (subreddit_filter_on ? subreddit_filter.length : "none") + ")" +
			" | Users (" + (user_filter_on ? user_filter.length : "none") + ")" +
			" | Titles (" + (title_filter_on ? title_filter.length : "none") + ")" +
			" | Sites (" + (site_filter_on ? site_filter.length : "none") + ") }"
		);

		if (!subreddit_filter_on && !user_filter_on && !title_filter_on && !site_filter_on) return;

		subreddit_filter = arr_to_lowercase(subreddit_filter);
		user_filter = arr_to_lowercase(user_filter);
		title_filter = arr_exact_str_or_regexp(title_filter);
		site_filter = arr_to_lowercase(site_filter);

		setup();
	}

	function setup(){
		if (location.hostname.indexOf("old.reddit.com") > -1){

			if (location.pathname.indexOf("search") && location.search.indexOf("q=") > -1){
				old_reddit_filter(
					{"thing" : "div.search-result-group div.search-result",
						"subreddit" : "a.search-subreddit-link",
						"user" : "a.author",
						"title" : "a.search-title",
						"site": "????"});

			}else{
				old_reddit_filter(
					{"thing" : "div.thing",
						"subreddit" : "a.subreddit",
						"user" : "a.author",
						"title" : "a.title",
						"site" : "span.domain"});
			}
		}else{

		//
		}
	}

	function old_reddit_filter(query = {}) {
		var thingymebob = document.querySelectorAll(query.thing);
		var thingy = {thing : null, subreddit : null, user : null, title : null, site : null};

		for (var i = 0; i < thingymebob.length; i++) {

			thingy.thing = thingymebob[i];
			thingy.subreddit = thingymebob[i].querySelector(query.subreddit);
			thingy.subreddit = thingy.subreddit !== null ? thingy.subreddit.textContent.substring(2) : "" ;//strip off 'r/'
			thingy.user = thingymebob[i].querySelector(query.user);
			thingy.user = thingy.user !== null ? thingy.user.textContent : "" ;
			thingy.title = thingymebob[i].querySelector(query.title);
			thingy.title = thingy.title !== null ? thingy.title.textContent : "";
			thingy.site = thingymebob[i].querySelector(query.site);
			thingy.site = thingy.site !== null ? thingy.site.textContent.substring(1,thingy.site.textContent.length-1) : "";//strip off ()
      if (debug){
			  console.log(i, thingymebob[i]);
			  console.log("id: ", thingy.thing.id, "| subreddit: ", thingy.subreddit,
				"| user: ", thingy.user, "| title: ", thingy.title, "|site: ", thingy.site); 
      }
			filter(thingy);

		}
	}

	function filter(thingy){
		var x, match = null;
		var subreddit = thingy.subreddit.toLowerCase();
		var user = thingy.user.toLowerCase();
		var title = thingy.title.toLowerCase(); //could break user regex filter
		var site = thingy.site.toLowerCase();

		if (subreddit_filter_on && (x = subreddit_filter.findIndex(s => s === subreddit)) > -1) {
			match = ["Subreddit", subreddit_filter[x]];
		}else if (user_filter_on && (x = user_filter.findIndex(s => s === user)) > -1) {
			match = ["User", user_filter[x]];
		}else if (title_filter_on && (x = title_filter.findIndex(s => s.test(title))) > -1) {
			match = ["Title", title_filter[x]];
		}else if (site_filter_on && (x = site_filter.findIndex(s => s === site)) > -1) {
			match = ["Site", site_filter[x]];
		}

		if (match !== null) {
			thingy.thing.style.display = "none";

			console.log("%c> Reddit Simple Filter: ", "color:#ffa600", "Filter: '" + match[0] + "' Match: '" + match[1] + "' Id: "
      + thingy.thing.id + "' , Subreddit: '" + thingy.subreddit + "' , User: '" + thingy.user + "' , Title: '" + thingy.title + "'")
		}

	}

	function arr_exact_str_or_regexp(arr) {
		for (var i = 0; i < arr.length; i++){
			if (typeof arr[i] !== "object" && !(arr[i] instanceof RegExp) ) {
				arr[i] = new RegExp("\\b" + str_esc_regexp(arr[i].toLowerCase()) + "\\b", "i");
			}
		}
		return arr;
	}

	function str_esc_regexp(str){
		return str.replace(/[.*+?\/\\^${}()|\[\]]/gm, "\\$&");
	}

	function arr_to_lowercase(arr){
		if (arr.length < 1) return arr;
		return arr.join("|").toLowerCase().split("|");
	}

	init();

})();
