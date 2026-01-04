// ==UserScript==
// @name         Steam Workshop Filter Played & Subscribed
// @namespace    https://greasyfork.org/de/scripts/406939-steam-workshop-filter-played-subscribed
// @version      0.2
// @description  Filters
// @author       Guitar Hero
// @grant        none
// @match        https://steamcommunity.com/workshop/browse/*
// @downloadURL https://update.greasyfork.org/scripts/406939/Steam%20Workshop%20Filter%20Played%20%20Subscribed.user.js
// @updateURL https://update.greasyfork.org/scripts/406939/Steam%20Workshop%20Filter%20Played%20%20Subscribed.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	function addButton(label, fct) {
		var a = document.createElement("a");
		a.innerHTML = label;
		a.setAttribute("href", "#");
		a.setAttribute("onclick", "return false;");
		a.setAttribute("class", "btnv6_blue_blue_innerfade btn_small_tall");
		a.setAttribute("style", "padding: 7px;");
		
		a.on("click", fct);

		var innerDiv = document.createElement("div");
		innerDiv.setAttribute("class","browseOption notSelected");
		innerDiv.insert(a);

		var outerDiv = document.createElement("div");
		outerDiv.setAttribute("style","position:relative;");
		outerDiv.insert(innerDiv);
		
		document.querySelector(".rightDetailsBlock").append(outerDiv);
	}
	
	function addButtonToFilterList() {
		console.log("adding button to filter list");
		addButton("Only unplayed and unsubscribed", filterPlayedItems);
	}
	
	function addSubscribeButtonToFilterList() {
		console.log("adding subscribe button to filter list");
		addButton("Subscribe all unplayed and unsubscribed", subscribeAllUnplayed);
	}
	
	
	addButtonToFilterList();
	addSubscribeButtonToFilterList();
	
	function isMapPlayed(item) {
		return item.querySelector(".played") != null;
	}
	
	function isMapSubscribed(item) {
		return item.querySelector(".subscribe.toggled") != null;
	}
	
	function filterPlayedItems() {
		console.log("filter played items");
		
		var workshopItems = document.querySelectorAll(".workshopItem");
		workshopItems.forEach(function(item) {
			if (!isMapPlayed(item) && !isMapSubscribed(item)) {
				return;
			}
			item.remove();
		});
	}
	
	function subscribeAllUnplayed() {
		var workshopItems = document.querySelectorAll(".workshopItem");
		workshopItems.forEach(function(item) {
			if (isMapPlayed(item) || isMapSubscribed(item)) {
				return;
			}
			item.querySelector(".workshopItemSubscriptionControls > .general_btn.subscribe").click();
		});
	}
})();
