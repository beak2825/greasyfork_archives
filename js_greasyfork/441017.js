// ==UserScript==
// @name        nyaablue
// @match       https://nyaa.si/*
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @version     0.4.0
// @author      garret
// @description brings blue to nyaav2 with seadex api
// @namespace   garret's bad scripts
// @connect     sneedex.moe
// @downloadURL https://update.greasyfork.org/scripts/441017/nyaablue.user.js
// @updateURL https://update.greasyfork.org/scripts/441017/nyaablue.meta.js
// ==/UserScript==


function apply_blue(ids) {
	if (window.location.href.match("view")) {
		set_view_blue(ids)
	} else {
		set_search_blue(ids)
	}
}

function set_view_blue(ids) {
	let page_id = window
		.location
		.href
		.match("view/([0-9]+)")[1]
	if (ids.has(page_id)) {
		document.getElementsByClassName("panel-title")[0].parentNode.parentNode.className = "panel panel-info";
	}
}

function set_search_blue(ids) {
	let torrentlist = document.getElementsByClassName("torrent-list")[0].tBodies[0].children;
	for (const i of torrentlist) {
		let id = i
			.cells[1]
			.children[0]
			.attributes
			.href
			.value
			.match("view/([0-9]+)")[1]
		if (ids.has(id)) {
			i.className = "info"
		}
	}
}


function main(last_modified, cached_ids) {
	console.log("getting data")
	GM.xmlHttpRequest({
		headers: {
			"Accept": "application/json",
			"User-Agent": "nyaablue.user.js/" + GM_info.script.version,
			"If-Modified-Since": last_modified,
		},
		method: "GET",
		url: "https://sneedex.moe/api/public/nyaa",
		onload: function(response) {
			let ids = new Set(cached_ids);
			if (response.status != "304") {
				console.log("has been modified since last check");
				let entries = JSON.parse(response.responseText);
				ids = new Array()
				for (const i of entries) {
					for (const j of i.nyaaIDs) {
						ids.push(String(j))
					}
				}
				GM.setValue("ids", ids);
				ids = new Set(ids)
			} else {
				console.log("304, it's not changed since last time");
			}
			if (response.responseHeaders.search(/last\-modified:/i) !== -1){
				let last_modified = response.responseHeaders.match(/last\-modified: *(.+)/i)[1];
				GM.setValue("last_modified", last_modified);
			}
			GM.setValue("last_update", Date.now());

			apply_blue(ids);
		}
	})
}

async function check_cache() {
	let cached_ids = new Set();
	let last_update = 0;
	let lm = "";
	try {
		cached_ids = await GM.getValue("ids");
		last_update = await GM.getValue("last_update");
		lm = await GM.getValue("last_modified");

		if (typeof last_update !== "number") {
			throw "probably first run"
		}
		if (Date.now() > last_update + 3600000) { // not updated in 1 hour
			console.log("cache expired")
			throw "cache expired";
		} else {
			console.log("cache isnt expired");
			if (cached_ids == undefined) {
				console.log("but we dont have any data...");
				lm = "";
				throw "no data";
			}
			if (typeof cached_ids !== "object" || cached_ids[1] == undefined) {
				console.log("but data is bad");
				lm = "";
				throw "bad data"
			}
			console.log("and the data seems fine™");
			apply_blue(new Set(cached_ids))
		}

	} catch {
		console.log("ooer, handling exception")
		main(lm, cached_ids)
	}
}

// dark theme "support" (thanks olli)
document.head.insertAdjacentHTML('beforeend', '<style id="css_blue" type="text/css">body.dark .torrent-list > tbody > tr.info > td {color: inherit; background-color: rgba(0, 172, 255, 0.12);} body.dark .torrent-list > tbody > tr.info:hover > td {background-color: rgba(0, 172, 255, 0.18);} body.dark div.panel-info, body.dark div.panel-info > .panel-heading {border-color: #2c414b;} body.dark div.panel-info > .panel-heading {background-color: #2a3f4a;}</style>');

check_cache()
