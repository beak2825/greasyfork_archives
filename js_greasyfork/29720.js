// ==UserScript==
// @name			AniDB.net Simple Filter
// @namespace		dexter86
// @include			http://anidb.net/*
// @include			https://anidb.net/*
// @description     Allows you to filter Group, Creator and Character pages by different types of filters
// @grant			none
// @version			1.2.1
// @downloadURL https://update.greasyfork.org/scripts/29720/AniDBnet%20Simple%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/29720/AniDBnet%20Simple%20Filter.meta.js
// ==/UserScript==
"use strict";

var Config = [
	{
		label: "Adult Content",
		options:
		[
			{value: "restricted", textContent: "18+ Content"}
		]
	},
	{
		label: "Filestate",
		options:
		[
			{value: "mylist", textContent: "In Mylist"},
			{value: "state_deleted", textContent: "deleted"},
			{value: "state_mixed", textContent: "mixed"},
			{value: "state_oncd", textContent: "external"},
			{value: "state_onhdd", textContent: "internal"},
			{value: "state_onserver", textContent: "remote"},
			{value: "state_unknown", textContent: "unknown"}
		]
	},
	{
		label: "Liststate",
		options:
		[
			{value: "liststate_collecting", textContent: "collecting"},
			{value: "liststate_completed", textContent: "completed"},
			{value: "liststate_dropped", textContent: "dropped"},
			{value: "liststate_stalled", textContent: "stalled"},
			{value: "liststate_unknown", textContent: "unknown"},
			{value: "liststate_watching", textContent: "watching"}
		]
	},
	{
		label: "Wishlist",
		options:
		[
			{value: "wishlist", textContent: "In Wishlist"},
			{value: "blacklist", textContent: "blacklist"},
			{value: "wishlist_type_buddy", textContent: "buddy rec."},
			{value: "wishlist_type_toget", textContent: "to get"},
			{value: "wishlist_type_towatch", textContent: "to watch"},
			{value: "wishlist_type_undefined", textContent: "undefined"}
		]
	},
	{
		label: "Notification",
		options:
		[
			{value: "notification", textContent: "In Notifies"},
			{value: "notification_type_all", textContent: "all"},
			{value: "notification_type_complete", textContent: "complete"},
			{value: "notification_type_group", textContent: "group"},
			{value: "notification_type_new", textContent: "new"}
		]
	}
];

var ConfigButtons = [
	{textContent: "Hide", value: "hide"},
	{textContent: "Show", value: "show"},
	{textContent: "Show only", value: "showonly"},
	{textContent: "Reset", value: "reset"}
];

var Priorities = [
	[
		{action: "wishlist_priority_low", textContent: "low"},
		{action: "wishlist_priority_med", textContent: "medium"},
		{action: "wishlist_priority_high", textContent: "high"}
	],
	[
		{action: "notification_priority_low", textContent: "low"},
		{action: "notification_priority_med", textContent: "medium"},
		{action: "notification_priority_high", textContent: "high"}
	]
];

function AddFilters(a) {
	var AnimeTables,
		Button,
		Div,
		Option,
		OptionGroup,
		Select,
		SelectPriority,
		i,
		j,
		k;
	AnimeTables = document.querySelectorAll("table[id^=" + a + "]");
	for (i = 0; i < AnimeTables.length; i++) {
		Div = document.createElement("div");
		Div.style.marginBottom = "0.4em";
		AnimeTables[i].parentNode.insertBefore(Div, AnimeTables[i]);

		Select = document.createElement("select");
		Select.id = "select_" + AnimeTables[i].id;
		Select.addEventListener("change", SelectChanged);
		Div.appendChild(Select);

		Option = document.createElement("option");
		Option.value = "none";
		Option.textContent = "Select filter";
		Select.appendChild(Option);

		for (j = 0; j < Config.length; j++) {
			OptionGroup = document.createElement("optgroup");
			OptionGroup.label = Config[j].label;
			Select.appendChild(OptionGroup);
			for (k = 0; k < Config[j].options.length; k++) {
				Option = document.createElement("option");
				Option.value = Config[j].options[k].value;
				Option.textContent = Config[j].options[k].textContent;
				OptionGroup.appendChild(Option);
			}
		}

		SelectPriority = document.createElement("select");
		SelectPriority.id = "selectpriority_" + AnimeTables[i].id;
		SelectPriority.style.marginLeft = "0.3em";
		SelectPriority.disabled = true;
		SelectPriority.addEventListener("change", SelectPriorityChanged);
		Div.appendChild(SelectPriority);

		Option = document.createElement("option");
		Option.value = "none";
		Option.textContent = "Priority";
		SelectPriority.appendChild(Option);

		for (j = 0; j < 3; j++) {
			Option = document.createElement("option");
			Option.value = "none";
			Option.textContent = Priorities[0][j].textContent;
			SelectPriority.appendChild(Option);
		}

		for (j = 0; j < ConfigButtons.length; j++) {
			Button = document.createElement("button");
			Button.type = "button";
			Button.id = ConfigButtons[j].value + "_" + AnimeTables[i].id;
			Button.value = ConfigButtons[j].value;
			Button.textContent = ConfigButtons[j].textContent;
			Button.style.marginLeft = "0.3em";
			j === 3 ? Button.addEventListener("click", Reset) : Button.addEventListener("click", WhatToDo);
			Div.appendChild(Button);
		}
	}
}

function Debug_LogValues(a) {
	console.log("this:", a);
	console.log("select:",a.parentNode.children[0].value);
	console.log("selectpriority:",a.parentNode.children[1].value);
}

function Debug_SetPage() {
	var What = document.title.split(" - ")[1];
	switch (What) {
		case "Group":
			return "group";
		case "Character":
			return "character";
		case "Person":
			return "creator";
	}
}

function DisablePriorities(a) {
	var i;
	a.nextSibling[0].value = "none";
	a.nextSibling[0].text = "Priority";
	for (i = 1; i < a.nextSibling.length; i++) {
		a.nextSibling[i].value = "none";
	}
	a.nextSibling.selectedIndex = 0;
	a.nextSibling.disabled = true;
}

function EnablePriorities(a, b) {
	var i;
	a.nextSibling[0].value = "none";
	a.nextSibling[0].text = "all";
	for (i = 0; i < Priorities[b].length; i++) {
		a.nextSibling[i+1].value = Priorities[b][i].action;
	}
	a.nextSibling.disabled = false;
}

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

function JustDoIt(a, b, c) {
	var i,
		NodeList = b.parentNode.nextSibling.lastElementChild.querySelectorAll(c);
/*	console.log(NodeList);
	console.log("action:", a);
	console.log("this:", b);
	console.log("selector:", c);
*/	for (i = 0; i < NodeList.length; i++) {
		a === "hide" ? NodeList[i].classList.add("hide") : NodeList[i].classList.remove("hide");
	}
}

function MarkOddLines(a) {
	var i,
		NodeList = a.parentNode.nextSibling.lastElementChild.querySelectorAll("tr:not(.hide)");
	for (i = 0; i < NodeList.length; i++) {
		i % 2 === 0 ? NodeList[i].classList.remove("g_odd") : NodeList[i].classList.add("g_odd");
	}
}

function Reset() {
	JustDoIt("show", this, ".hide");
	MarkOddLines(this);
}

function SelectChanged() {
	if (this.selectedIndex === 15 || (this.selectedIndex >= 17 && this.selectedIndex <= 20)) {
		EnablePriorities(this, 0);
	} else if (this.selectedIndex >= 21 && this.selectedIndex <= 25) {
		EnablePriorities(this, 1);
	}	else {
		DisablePriorities(this);
	}
//	Debug_LogValues(this);
}

function SelectPriorityChanged() {
//	Debug_LogValues(this);
}

function Userscript(a) {
//	a = Debug_SetPage();//debug
	switch (a) {
		case "group":
			AddFilters("releases");
			break;
		case "character":
			AddFilters("seiyuulist_");
			AddFilters("animelist_");
			break;
		case "creator":
			AddFilters("stafflist_");
			AddFilters("characterlist_");
			AddFilters("songlist_");
			break;
	}
}

function WhatToDo() {
	var Select = this.parentNode.children[0].value;
	var SelectPriority = this.parentNode.children[1].value;
	if (Select !== "none") {
		if (SelectPriority === "none") {
			switch (this.value) {
				case "hide":
					JustDoIt("hide", this, "." + Select);
					if (Select === "wishlist") {
						JustDoIt("hide", this, ".blacklist");
					}
					break;
				case "show":
					JustDoIt("show", this, ".hide." + Select);
					if (Select === "wishlist") {
						JustDoIt("show", this, ".hide.blacklist");
					}
					break;
				case "showonly":
					JustDoIt("show", this, ".hide");
					JustDoIt("hide", this, "tr:not(." + Select + ")");
					if (Select === "wishlist") {
						JustDoIt("show", this, ".hide.blacklist");
					}
					break;
			}
		} else {
			switch (this.value) {
				case "hide":
					JustDoIt("hide", this, "." + Select + "." + SelectPriority);
					break;
				case "show":
					JustDoIt("show", this, "." + Select + "." + SelectPriority);
					break;
				case "showonly":
					JustDoIt("show", this, ".hide");
					JustDoIt("hide", this, "tr:not(." + Select + ")");
					JustDoIt("hide", this, "tr." + Select + ":not(." + SelectPriority + ")");
					break;
			}
		}
		MarkOddLines(this);
	}
}

Userscript(ExtractValue("show"));