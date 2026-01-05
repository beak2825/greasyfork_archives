// ==UserScript==
// @name        PTH Artist Aliases Filter
// @namespace   PTH Artist Aliases Filter
// @description Add a box on artist page to filter based on aliases
// @include     https://passtheheadphones.me/artist.php?id=*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25376/PTH%20Artist%20Aliases%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/25376/PTH%20Artist%20Aliases%20Filter.meta.js
// ==/UserScript==

/* Avoid using jQuery in this userscript, prioritize vanilla javascript as a matter of performance on big pages */

var artist_id = window.location.href.match(/id=(\d+)/)[1];

var box_aliases = 
	'<div class="box box_aliases">' +
		'<div class="head"><strong>Aliases (Click to filter)</strong></div>' + 
		'<ul class="stats nobullet">' +
			'<li>Loading...</li>' +
		'</ul>' +
	'</div>';
document.getElementsByClassName("box_search")[0].insertAdjacentHTML('beforebegin', box_aliases);
var box_aliases_dom = document.getElementsByClassName("box_aliases")[0];

// Display an error message if the API query goes wrong
var set_error_message = function() {
	document.querySelector(".sidebar .box_aliases li").innerHTML = "An error occued";
};

// Parse JSON response after having queried the API and extract interesting data
var get_aliases_and_groups = function(json_data) {
	var aliases = {}; // `aliasid` => `name`
	var groups = {}; // `groupid` => `aliasid`

	var response = json_data.response;
	var main_id = response.id;

	// Iterate through each artists of each group to find those correct (`id` === `main_id`)
	var torrentgroup = response.torrentgroup;
	for (var i = 0; i < torrentgroup.length; i++) {
		var group = torrentgroup[i];

		var extendedArtists = group.extendedArtists;
		var found = false;
		for (var id in extendedArtists) {
			var artists = extendedArtists[id];
			if (artists) {
				for (var k = 0; k < artists.length; k++) {
					var artist = artists[k];
					if (artist.id === main_id) {
						// This is not perfect:
						// If a release contains references to multiple aliases of the same artist, it keeps only the first one
						// For example, see group 72607761 of Snoop Dogg
						// However, it is better for performance not to have to iterate through an array
						// So let's say 1 group release => 1 artist alias
						aliases[artist.aliasid.toString()] = artist.name;
						groups[group.groupId.toString()] = artist.aliasid.toString();
						found = true;
						break;
					}
				}
			}
			if (found) break;
		}
		// Sometimes, release does not contain any artist because of an issue with the API
		// See: https://what.cd/forums.php?action=viewthread&threadid=192517&postid=5290204
		// In such a case, the release is not linked to any alias, just the default "[Show All]"
		if (!found) groups[group.groupId.toString()] = "-1";
	}
	return {aliases: aliases, groups: groups};
};

// Get dom elements corresponding to each alias, it will be stored once and for all (except on reload), usefull for performances
// These elements are those which will be shown or hidden (torrents rows, release groups rows and tables categories)
var get_dom_elements_per_alias = function(artist_data) {
	var dom_elements_per_alias = {"-1": []};
	for (var aliasid in artist_data.aliases) {
		dom_elements_per_alias[aliasid] = [];
	}

	var groups = artist_data.groups;

	var torrent_tables = document.getElementsByClassName("torrent_table");

	for (var i = 0; i < torrent_tables.length; i++) {
		var torrent_table = torrent_tables[i];
		var discogs = torrent_table.getElementsByClassName("discog");
		var current_aliasid = undefined;
		var table_aliases = {};
		for (var j = 0; j < discogs.length; j++) {
			var discog = discogs[j];
			// The groupid of each torrent row is the same that the previous encountered main release row
			// This avoid having to extract groupid value at each iteration
			if (discog.classList.contains("group")) {
				var current_groupid = discog.firstElementChild.firstElementChild.id.split("_")[1];
				current_aliasid = groups[current_groupid];
				table_aliases[current_aliasid] = 1;
			}
			dom_elements_per_alias[current_aliasid].push(discog);
		}

		for (var table_alias in table_aliases) {
			dom_elements_per_alias[table_alias].unshift(torrent_table);
		}
	}

	return dom_elements_per_alias;

};

var hide_elements = function(dom_elements) {
	var nb_elems = dom_elements.length;
	for (var i = 0; i < nb_elems; i++) {
		dom_elements[i].style.display = "none";
	}
};

var show_elements = function(dom_elements) {
	var nb_elems = dom_elements.length;
	for (var i = 0; i < nb_elems; i++) {
		dom_elements[i].style.display = "";
	}
};


var set_aliases_box = function(artist_data) {
	var aliases = artist_data.aliases;
	var groups = artist_data.groups;

	// If there is only one alias, hide the box
	if (Object.keys(aliases).length < 2) {
		box_aliases_dom.style.display = "none";
		return;
	}

	// First, create the associative array of corresponding dom elements
	var dom_elements_per_alias = get_dom_elements_per_alias(artist_data);

	// Then, fill the aliases box
	var list = box_aliases_dom.getElementsByTagName("ul")[0];
	list.getElementsByTagName("li")[0].innerHTML = "<a style='font-size:80%;font-weight:bold' href='#' aliasid='-1'>[Show All]</a>";
	for (var aliasid in aliases) {
		var name = aliases[aliasid];
		list.insertAdjacentHTML('beforeend', "<li><a href='#' aliasid='" + aliasid + "''>" + name + "</a></li>");
	}

	// Finally, bind filtering on aliases links
	var links = list.getElementsByTagName("a");
	var current_alias_filter = "-1";
	for (var i = 0; i < links.length; i++) {
		links[i].addEventListener("click", function(e) {
			e.preventDefault();
			var new_alias_filter = this.getAttribute("aliasid");
			if (new_alias_filter === current_alias_filter) return;

			for (var j = 0; j < links.length; j++) {
				links[j].style.fontWeight = "";
			}
			this.style.fontWeight = "bold";

			if (current_alias_filter === "-1") {
				for (var aliasid in dom_elements_per_alias) {
					if (aliasid !== new_alias_filter) {
						hide_elements(dom_elements_per_alias[aliasid]);
					}
				}
				show_elements(dom_elements_per_alias[new_alias_filter]);
			} else if (new_alias_filter === "-1") {
				for (var aliasid in dom_elements_per_alias) {
					if (aliasid !== current_alias_filter) {
						show_elements(dom_elements_per_alias[aliasid]);
					}
				}
			} else {
				hide_elements(dom_elements_per_alias[current_alias_filter]);
				show_elements(dom_elements_per_alias[new_alias_filter]);
			}

			current_alias_filter = new_alias_filter;
		});
	}
};

// Get cache (associative array {`artist_id` => {groups_ids, aliases, groups}})
var storage_key = "what.cd_artists_aliases_filter";
var storage = sessionStorage.getItem(storage_key) || "{}";
var cache = JSON.parse(storage);

var artist_cache = cache[artist_id];

// Get an array `groups_ids` of all groupid on the current artist page to ensure that cache is still valid (no new group since last visit)
var dom_groups = document.getElementsByClassName("group");
var groups_ids = [];
for (var i = 0; i < dom_groups.length; i++) {
	var group_id = dom_groups[i].firstElementChild.firstElementChild.id.split("_")[1];
	groups_ids.push(group_id);
}
groups_ids.sort();
var stringified_groups_id = groups_ids.toString();

// If cache is not yet set or if it is no longer valid, query the API
if (artist_cache === undefined || (artist_cache.groups_ids !== stringified_groups_id)) {
	var api_req = "/ajax.php?action=artist&id=" + artist_id;
	$.ajax({
		url: api_req,
		success: function(data) {
			if (data.status === "success") {
				var aliases_and_groups = get_aliases_and_groups(data);
				artist_cache = {
					groups_ids: stringified_groups_id,
					aliases: aliases_and_groups.aliases,
					groups: aliases_and_groups.groups
				};
				cache[artist_id] = artist_cache;
				sessionStorage.setItem(storage_key, JSON.stringify(cache));
				set_aliases_box(artist_cache);
			} else {
				set_error_message();
			}
		},
		error: set_error_message,
	});
} else {
	set_aliases_box(artist_cache);
}