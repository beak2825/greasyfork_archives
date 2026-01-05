// ==UserScript==
// @name         Search tool
// @description  Search tool for Steamgifts.
// @version      0.4.1
// @author       otro_user_gil
// @exclude      http://www.steamgifts.com/giveaways/new
// @exclude      http://*.steamgifts.com/giveaways/new
// @exclude      http://steamgifts.com/giveaways/new
// @exclude      http://www.steamgifts.com/giveaways/created
// @exclude      http://*.steamgifts.com/giveaways/created
// @exclude      http://steamgifts.com/giveaways/created
// @exclude      http://www.steamgifts.com/giveaways/entered
// @exclude      http://*.steamgifts.com/giveaways/entered
// @exclude      http://steamgifts.com/giveaways/entered
// @exclude      http://www.steamgifts.com/giveaways/won
// @exclude      http://*.steamgifts.com/giveaways/won
// @exclude      http://steamgifts.com/giveaways/won
// @include      http://www.steamgifts.com/
// @include      https://steamgifts.com/
// @include      http://*.steamgifts.com/
// @include      https://*.steamgifts.com/
// @include      http://www.steamgifts.com/giveaway/*
// @include      https://steamgifts.com/giveaway/*
// @include      http://*.steamgifts.com/giveaway/*
// @include      https://*.steamgifts.com/giveaway/*
// @include      http://www.steamgifts.com/giveaways/*
// @include      https://steamgifts.com/giveaways/*
// @include      http://*.steamgifts.com/giveaways/*
// @include      https://*.steamgifts.com/giveaways/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @namespace https://greasyfork.org/users/15121
// @downloadURL https://update.greasyfork.org/scripts/14200/Search%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/14200/Search%20tool.meta.js
// ==/UserScript==

$("<hr><div style=\"position: relative;\"><span>Level Min: </span><select id=\"level_min\" style=\"width: 90px;\"><option>None</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select>	<span> Level Max: </span><select id=\"level_max\" style=\"width: 90px;\"><option>None</option><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select><br><br><span> Min Entries: </span><input type=\"number\" style=\"width: 60px;\" id=\"min_entries\" min=\"0\"><span> Max Entries: </span><input type=\"number\" style=\"width: 60px;\" min=\"0\" id=\"max_entries\"><br><br><center><span>Wishlist: </span><br> <input type=\"checkbox\" title=\"Wishlist\" id=\"wishlist\"><br><span style=\"margin: 0; text-align: center;\">Group: </span><br><input title=\"Group\" type=\"checkbox\" id=\"group\"><br><span style=\"margin: 0; text-align: center;\">New: </span><br><input title=\"New\" type=\"checkbox\" id=\"new\"></center><br><input type=\"button\" style=\"cursor: pointer; width: 150px;\" value=\"Search Giveaway \" id=\"giveawaysearch\"></div><hr>").insertAfter(".sidebar__mpu");
$("#giveawaysearch").click(function(){
var url;
var search_text;
var min_entries;
var max_entries;
var min_level;
var max_level;
var wishlist;
var group;
var recent;
function ga() {
	search_text = document.getElementsByName("search-query")[0].value;
	if (search_text == "Search...") {
		search_text = "";
	}
	min_entries = parseInt(document.getElementById("min_entries").value);
	max_entries = parseInt(document.getElementById("max_entries").value);
	min_level = document.getElementById("level_min").value;
	max_level = document.getElementById("level_max").value;
	wishlist = document.getElementById("wishlist");
	group = document.getElementById("group");
	recent = document.getElementById("new");
	if (min_entries > max_entries) {
		alert("Min Entries Cannot be higher than Max Entries.");
	} else if (min_level != "None" && max_level != "None" && min_level > max_level) {
		alert("Min Level Cannot be higher than Max Level");
	} else if (group.checked && wishlist.checked || group.checked && recent.checked || wishlist.checked && recent.checked || group.checked && wishlist.checked && recent.checked ) {
		alert("Multiple buttons Cannot be selected at the same time.");
	} else {
		if (search_text === "") {
			if (!isNaN(min_entries) || !isNaN(max_entries)) {
				if (!isNaN(min_entries)&& isNaN(max_entries)) {
					url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries;
					location.href = url;
				}
				if (isNaN(min_entries)&& !isNaN(max_entries)) {
					url = "http://www.steamgifts.com/giveaways/search?entry_max=" + max_entries;
					location.href = url;
				}
				if (!isNaN(min_entries) && !isNaN(max_entries)) {
					url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries + "&entry_max=" + max_entries;
					location.href = url;
				}
			} else {
				if (min_level == "None" && max_level == "None") {
					url = "http://www.steamgifts.com/giveaways/search?";
					location.href = url;
				}
				if (max_level == "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?level_min=" + min_level;
					location.href = url;
				}
				if (max_level != "None" && min_level == "None") {
					url = "http://www.steamgifts.com/giveaways/search?level_max=" + max_level;
					location.href = url;
				}
				if (max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
			}
			if (!isNaN(min_entries) && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries + "&level_min=" + min_level;
				location.href = url;
			}
			if (!isNaN(min_entries) && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_max=" + max_entries + "&level_min=" + min_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_max=" + max_entries + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
				location.href = url;
			}
		} else if (search_text !== "") {
			if (!isNaN(min_entries) || !isNaN(max_entries)) {
				if (!isNaN(min_entries) && isNaN(max_entries)) {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries;
					location.href = url;
				}
				if (isNaN(min_entries) && !isNaN(max_entries)) {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries;
					location.href = url;
				}
				if (!isNaN(min_entries) && !isNaN(max_entries)) {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries;
					location.href = url;
				}
			} else {
				if (min_level == "None" && max_level == "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text);
					location.href = url;
				}
				if (max_level == "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level;
					location.href = url;
				}
				if (max_level != "None" && min_level == "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_max=" + max_level;
					location.href = url;
				}
				if (max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
			}
			if (!isNaN(min_entries) && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level;
				location.href = url;
			}
			if (!isNaN(min_entries) && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_min=" + min_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level;
				location.href = url;
			}
			if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
				url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
				location.href = url;
			}
		}
		if (wishlist.checked) {
			if (search_text === "") {
				if (!isNaN(min_entries) || !isNaN(max_entries)) {
					if (!isNaN(min_entries) && isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries;
						location.href = url;
					}
					if (isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_max=" + max_entries;
						location.href = url;
					}
					if (!isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries + "&entry_max=" + max_entries;
						location.href = url;
					}
				} else {
					if (min_level == "None" && max_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=wishlist";
						location.href = url;
					}
					if (max_level == "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=wishlist&level_min=" + min_level;
						location.href = url;
					}
					if (max_level != "None" && min_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=wishlist&level_max=" + max_level;
						location.href = url;
					}
					if (max_level != "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=wishlist&level_min=" + min_level + "&level_max=" + max_level;
						location.href = url;
					}
				}
				if (!isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_max=" + max_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + max_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=wishlist&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
			} else if (search_text !== "") {
				if (!isNaN(min_entries) || !isNaN(max_entries)) {
					if (!isNaN(min_entries) && isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&type=wishlist";
						location.href = url;
					}
					if (isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries + "&type=wishlist";
						location.href = url;
					}
					if (!isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&type=wishlist";
						location.href = url;
					}
				} else {
					if (min_level == "None" && max_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&type=wishlist";
						location.href = url;
					}
					if (max_level == "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level + "&type=wishlist";
						location.href = url;
					}
					if (max_level != "None" && min_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_max=" + max_level + "&type=wishlist";
						location.href = url;
					}
					if (max_level != "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level + "&level_max=" + max_level + "&type=wishlist";
						location.href = url;
					}
				}
				if (!isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_max=" + max_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(max_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_min=" + min_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_max=" + max_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=wishlist";
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=wishlist";
					location.href = url;
				}
			}
		}
		if (group.checked) {
			if (search_text === "") {
				if (!isNaN(min_entries) || !isNaN(max_entries)) {
					if (!isNaN(min_entries) && isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries;
						location.href = url;
					}
					if (isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=group&entry_max=" + max_entries;
						location.href = url;
					}
					if (!isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries + "&entry_max=" + max_entries;
						location.href = url;
					}
				} else {
					if (min_level == "None" && max_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=group";
						location.href = url;
					}
					if (max_level == "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=group&level_min=" + min_level;
						location.href = url;
					}
					if (max_level != "None" && min_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=group&level_max=" + max_level;
						location.href = url;
					}
					if (max_level != "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=group&level_min=" + min_level + "&level_max=" + max_level;
						location.href = url;
					}
				}
				if (!isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_max=" + max_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + max_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=group&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
			} else if (search_text != "") {
				if (!isNaN(min_entries) || !isNaN(max_entries)) {
					if (!isNaN(min_entries) && isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&type=group";
						location.href = url;
					}
					if (isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries + "&type=group";
						location.href = url;
					}
					if (!isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&type=group";
						location.href = url;
					}
				} else {
					if (min_level == "None" && max_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text);
						location.href = url;
					}
					if (max_level == "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level + "&type=group";
						location.href = url;
					}
					if (max_level != "None" && min_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_max=" + max_level + "&type=group";
						location.href = url;
					}
					if (max_level != "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level + "&level_max=" + max_level + "&type=group";
						location.href = url;
					}
				}
				if (!isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_max=" + max_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(max_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_min=" + min_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_max=" + max_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=group";
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=group";
					location.href = url;
				}
			}
		}//fin group
		if (recent.checked) {
			if (search_text == "") {
				if (!isNaN(min_entries) || !isNaN(max_entries)) {
					if (!isNaN(min_entries) && isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries;
						location.href = url;
					}
					if (isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=new&entry_max=" + max_entries;
						location.href = url;
					}
					if (!isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries + "&entry_max=" + max_entries;
						location.href = url;
					}
				} else {
					if (min_level == "None" && max_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=new";
						location.href = url;
					}
					if (max_level == "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=new&level_min=" + min_level;
						location.href = url;
					}
					if (max_level != "None" && min_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=new&level_max=" + max_level;
						location.href = url;
					}
					if (max_level != "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?type=new&level_min=" + min_level + "&level_max=" + max_level;
						location.href = url;
					}
				}
				if (!isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_max=" + max_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + max_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?type=new&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level;
					location.href = url;
				}
			} else if (search_text != "") {
				if (!isNaN(min_entries) || !isNaN(max_entries)) {
					if (!isNaN(min_entries) && isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&type=new";
						location.href = url;
					}
					if (isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries + "&type=new";
						location.href = url;
					}
					if (!isNaN(min_entries) && !isNaN(max_entries)) {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&type=new";
						location.href = url;
					}
				} else {
					if (min_level == "None" && max_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text);
						location.href = url;
					}
					if (max_level == "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level + "&type=new";
						location.href = url;
					}
					if (max_level != "None" && min_level == "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_max=" + max_level + "&type=new";
						location.href = url;
					}
					if (max_level != "None" && min_level != "None") {
						url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&level_min=" + min_level + "&level_max=" + max_level + "&type=new";
						location.href = url;
					}
				}
				if (!isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_max=" + max_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(max_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_min=" + min_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + max_entries + "&level_max=" + max_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_max=" + max_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(max_entries) && !isNaN(min_entries) && min_level != "None" && max_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(min_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_min=" + min_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=new";
					location.href = url;
				}
				if (!isNaN(max_entries) && max_level != "None" && min_level != "None") {
					url = "http://www.steamgifts.com/giveaways/search?q=" + escape(search_text) + "&entry_max=" + max_entries + "&level_min=" + min_level + "&level_max=" + max_level + "&type=new";
					location.href = url;
				}
			}
		}
	}
}
ga();
});