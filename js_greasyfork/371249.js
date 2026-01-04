// ==UserScript==
// @name         Better ExHentai
// @namespace    none
// @version      0.59
// @description  Various ExHentai/E-Hentai improvements
// @author       beta048596
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wARBmb/EQZm/xEGZv8RBmb/EQZm/////wD///8A////ABEGZv8RBmb/////AP///wARBmb/EQZm/////wD///8AEQZm/xEGZv8RBmb/EQZm/xEGZv////8A////AP///wARBmb/EQZm/////wD///8AEQZm/xEGZv////8A////ABEGZv8RBmb/////AP///wD///8A////AP///wD///8AEQZm/xEGZv////8A////ABEGZv8RBmb/////AP///wARBmb/EQZm/////wD///8A////AP///wD///8A////ABEGZv8RBmb/////AP///wARBmb/EQZm/////wD///8AEQZm/xEGZv////8A////AP///wD///8A////AP///wARBmb/EQZm/////wD///8AEQZm/xEGZv////8A////ABEGZv8RBmb/EQZm/xEGZv////8AEQZm/xEGZv////8AEQZm/xEGZv8RBmb/EQZm/xEGZv8RBmb/////AP///wARBmb/EQZm/xEGZv8RBmb/////ABEGZv8RBmb/////ABEGZv8RBmb/EQZm/xEGZv8RBmb/EQZm/////wD///8AEQZm/xEGZv////8A////AP///wD///8A////AP///wARBmb/EQZm/////wD///8AEQZm/xEGZv////8A////ABEGZv8RBmb/////AP///wD///8A////AP///wD///8AEQZm/xEGZv////8A////ABEGZv8RBmb/////AP///wARBmb/EQZm/////wD///8A////AP///wD///8A////ABEGZv8RBmb/////AP///wARBmb/EQZm/////wD///8AEQZm/xEGZv8RBmb/EQZm/xEGZv////8A////AP///wARBmb/EQZm/////wD///8AEQZm/xEGZv////8A////ABEGZv8RBmb/EQZm/xEGZv8RBmb/////AP///wD///8AEQZm/xEGZv////8A////ABEGZv8RBmb/////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//8AAP//AACDmQAAg5kAAJ+ZAACfmQAAn5kAAISBAACEgQAAn5kAAJ+ZAACfmQAAg5kAAIOZAAD//wAA//8AAA==
// @match        http*://e-hentai.org/*
// @match        http*://exhentai.org/*
// @match        http*://nhentai.net/g/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        window.close
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371249/Better%20ExHentai.user.js
// @updateURL https://update.greasyfork.org/scripts/371249/Better%20ExHentai.meta.js
// ==/UserScript==

/* utility */
/*******************************************************************************************************************************************************************/
// formats tag to "slave:tag name", can shorten slave tag and use exact match
function formatTag(str, exact, shorten) {
	let m = str.match(/^(\w+)??:?([.\w -]+)$/);
	let slave = m[1];
	let tag = m[2];
	if (shorten && slave) slave = slave.charAt(0);
	return `${slave ? slave + ":" : ""}"${tag}${exact ? "$" : ""}"`;
}

function getTagFromLink(a) {
	let fun = a.onclick
	if (!fun) return "";
	fun = fun.toString();
	let m = fun.match(/toggle_tagmenu\(\d+,'([.\w: -]+)',this\)/);
	if (!m) return "";
	return m[1];
}

function quickFavourite(gid, token, favID, favNote, onsuccess) {
	let url = `${window.location.protocol}//${window.location.host}/gallerypopups.php?gid=${gid}&t=${token}&act=addfav`;
	let dat = `apply=Add to Favorites&favcat=${favID}&favnote=${favNote}&update=1`;

	// prepare XHR
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

	xhr.onload = function() {
		if (xhr.status == 200) {
			if (onsuccess) onsuccess();
		} else {
			alert("Error occurred! Favorite was not updated!");
		}
	};

	// send XHR
	xhr.send(dat);
}

let hotkeyStyle = {
	"float":         "right",
	"position":      "relative",
	"right":         "6px",
	"box-sizing":    "border-box",
	"padding":       "1px 1px 0px 1px",
	"border":        "1px solid #888",
	"border-radius": "2px",
	"background":    "#eee",
	"color":         "#666",
	"font-family":   "monospace",
	"font-size":     "13px",
	"box-shadow":    "-1px 0px 2px 2px #5F636B",
};

// Colors
const geh = {
	"border"      : "#5C0D12",
	"bg"          : "#E3E0D1",
	"bg_light"    : "#F8F6EE",
	"bar_bg"      : "#cccccc",
	"bar_loaded"  : "#decc70",
	"bar_current" : "#f2a119", // #edebdf
	"bar_error"   : "rgba(255, 0, 0, 0.5)",
};
const exh = {
	"border"      : "#000000",
	"bg"          : "#4F535B",
	"bg_light"    : "#5F636B",
	"bar_bg"      : "#808080",
	"bar_loaded"  : "#34353b",
	"bar_current" : "#4f535b",
	"bar_error"   : "rgba(255, 0, 0, 0.25)",
};

// Are we on fjords?
let color = (location.host.substr(0,2) == "ex" ) ? exh : geh;

/* jump table */
/*******************************************************************************************************************************************************************/
let pages = [];

/* goto exhentai */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/e-hentai\.org\/$/, /e-hentai\.org\/(watched|popular|torrents\.php|favorites\.php|uconfig.php|mytags|g\/|\?f_search)/],
	func: function() {
		$("#nb").append(`<div><a href='${window.location.href.replace("-", "x")}'> ExHentai.org</a></div>`);
		$("#nb").css("max-width", "1200px");
	}
});

pages.push({
	re: [/nhentai\.net\/g\//],
	func: function() {
		let title = $("#info > h1").text();
		title = title.replace(/\(.+?\) ?/g, "");
		let url = `https://exhentai.org/?f_search=${encodeURIComponent(title).replace(/[!'()*]/g, escape)}`;
		$(".menu.left").append(`<li><a href='${url}'>ExHentai.org</a></li>`);
	}
});

/* keyboard navigation + style */
/*******************************************************************************************************************************************************************/
let props = {};
props.cursor_position = 1;
props.cursor_row = 5;
props.cursor_max = null; // set with loadCursor
props.cursor_bg_default = null; // set with loadCursor
props.cursor_bg_selected = "rgba(255, 0, 0, 0.25)";
props.selector_prev = ".ptt > tbody > tr > td:first-child, #uprev";
props.selector_next = ".ptt > tbody > tr > td:last-child, #unext";
// these properties need to be set before using the cursor
props.get_metadata = null; // function that returns the target gallery id and token
props.cursor_selector = null;
props.keys = null; // stores the currently selected keys

const globalKeys = [
	{ key: "w", func: function() { move_cursor(-props.cursor_row, true); } },
	{ key: "a", func: function() { move_cursor(-1, true); } },
	{ key: "s", func: function() { move_cursor(props.cursor_row, true); } },
	{ key: "d", func: function() { move_cursor(1, true); } },
	{ key: "f", func: function() { get_cursor_anchor()[0].click(); } },
	{ key: "F", func: function() { GM_openInTab(get_cursor_anchor()[0].href, true); } },
	{ key: "q", func: function() { console.log($(props.selector_prev)); $(props.selector_prev)[0].click(); } },
	{ key: "e", func: function() { console.log($(props.selector_next)); $(props.selector_next)[0].click(); } },
	{ key: "r", func: function() { window.location.href = window.location.origin; } },
	{ key: "R", func: function() { GM_openInTab(window.location.origin, false); } },
	{ key: "x", func: function() { window.location.href = window.location.origin + "/favorites.php"; } },
	{ key: "X", func: function() { GM_openInTab(window.location.origin + "/favorites.php", false); } },
	{ key: "z", func: function() { window.history.back(); } },
	{ key: "Z", func: function() { window.history.forward(); } },
];

const readerStyle = document.createElement("style");
readerStyle.innerHTML = `
	body,
	#i1,
	#img {
		padding-top: 0!important;
		margin-top: 0!important;
		top: 0!important;
		border: 0;
	}

	#i1 h1,
	#i1 #i2 {
		display: none;
	}

	#i1 {
		min-width: 1220px!important;
		width: fit-content!important;
	}

	#i3.dis #img {
		min-height: calc(100vh - 5px)!important;
		width: auto!important;
		max-width: none!important;
	}

	#i3:not(.dis) #img {
		max-height: calc(100vh - 5px)!important;
		width: auto!important;
	}
`;

// front/search/watched/popular page
pages.push({
	re: [/e[x-]hentai\.org\/$/, /e[x-]hentai\.org\/\?/, /e[x-]hentai\.org\/watched/, /e[x-]hentai\.org\/popular$/],
	func: function() {
		props.get_metadata = function() {
			let url = get_cursor_anchor()[0].href.split("/");
			return { gid: url[4], token: url[5] };
		};
		props.cursor_selector = ".gl1t";
		// global keys
		props.keys = globalKeys;
		// filter english key
		props.keys.push({ key: "E", func: function() { apply_filter("english", false); } })
		// change favorite key
		props.keys.push({ key: "c", func: function() {
			let md = props.get_metadata();
			popUp(`${window.location.protocol}//${window.location.host}/gallerypopups.php?gid=${md.gid}&t=${md.token}&act=addfav`, 675, 415);
		} });

		load_listener();
		load_cursor();
	}
});

// favorites page
pages.push({
	re: [/e[x-]hentai\.org\/favorites\.php/],
	func: function() {
		props.get_metadata = function() {
			let url = get_cursor_anchor()[0].href.split("/");
			return { gid: url[4], token: url[5] };
		};
		props.cursor_selector = ".gl1t";
		// global keys
		props.keys = globalKeys;
		// change favorite key
		props.keys.push({ key: "c", func: function() {
			let md = props.get_metadata();
			popUp(`${window.location.protocol}//${window.location.host}/gallerypopups.php?gid=${md.gid}&t=${md.token}&act=addfav`, 675, 415);
		} });
		// category keys
		for (let i = 1; i <= 10; i++) {
			let n = (i % 10).toString();
			// add key to listener
			props.keys.push({ key: n, func: function() {
				window.location.href = `${window.location.protocol}//${window.location.host}/favorites.php?favcat=${i-1}`;
			} });
			// add hotkey hint
			$(`<div>${n}</div>`).appendTo(`body > div.ido > div.nosel > div.fp:nth-child(${i})`).css(hotkeyStyle);
		}
		// all favs key
		props.keys.push({ key: "\\", func: function() {
			window.location.href = `${window.location.protocol}//${window.location.host}/favorites.php`;
		} });
		// add hotkey hint
		$("<div>\\</div>").appendTo("body > div.ido > div.nosel > div:nth-child(12)").css(hotkeyStyle);

		load_listener();
		load_cursor();
	}
});

// gallery page
pages.push({
	re: [/e[x-]hentai\.org\/g\//],
	func: function() {
		let url = window.location.href.split("/");
		props.get_metadata = function() {
			return { gid: url[4], token: url[5] };
		};
		props.cursor_selector = "#gdt > a";
		// set keys
		props.keys = globalKeys;
		props.keys.push({ key: "A", func: function() {
			// look for artists, if none are found then look for group
			let field = $("#taglist .tc:contains(artist)");
			if (field.length == 0) field = $("#taglist .tc:contains(group)");
			if (field.length == 0) return;
			// get first artist or group and search for galleries
			let tag = getTagFromLink(field.next().children()[0].firstChild);
			window.location.href = `${window.location.protocol}//${window.location.host}/?f_search=${encodeURIComponent(formatTag(tag, true, true))}`;
		} });

		load_listener();
		load_cursor();

		// disable old key listener
		document.onkeydown = null;
	}
});

// reader page
pages.push({
	re: [/e[x-]hentai\.org\/s\//],
	func: function() {
		// add style to page
		document.body.appendChild(readerStyle);

		let url = $("#i5 > div > a")[0].href.split("/");
		props.get_metadata = function() {
			return { gid: url[4], token: url[5] };
		};
		// set keys to page
		props.keys = [
			{ key: "f", func: function() { $("#i5 > div > a")[0].click(); } },
			{ key: "F", func: function() { GM_openInTab($("#i5 > div > a").attr("href"), false); } },
			{ key: "R", func: function() { window.location.href = window.location.origin; } },
			{ key: "e", func: function() { $("#i3").toggleClass("dis") } },
		];
		load_listener();
	}
});

// favorite popup
pages.push({
	re: [/e[x-]hentai\.org\/gallerypopups\.php.*act=addfav/],
	func: function() {
		let gid = window.location.href.match(/gid=(\w+)/)[1];
		let token = window.location.href.match(/t=(\w+)/)[1];

		props.keys = [];

		for (let i = 1; i <= 10; i++) {
			let n = (i % 10).toString();
			// add key to listener
			props.keys.push({ key: n, func: function() {
				let favNote = $("#galpop > div > div:nth-child(2) > textarea").val();
				quickFavourite(gid, token, i-1, favNote, window.close);
			} });
			// add hotkey hint
			$(`<div>${n}</div>`).insertBefore(`#galpop > div > div.nosel > div:nth-child(${i}) > div.c`).css(hotkeyStyle);
		}

		// add key to listener
		props.keys.push({ key: "\\", func: function() {
			let favNote = $("#galpop > div > div:nth-child(2) > textarea").val();
			quickFavourite(gid, token, "favdel", favNote, window.close);
		} });
		// add hotkey hint
		$("<div>\\</div>").insertBefore("#galpop > div > div.nosel > div:nth-child(11) > div.c").css(hotkeyStyle);

		load_listener();
	}
});

// activates keydown listener
function load_listener() {
	$(window).keydown(function(e) {
		// don't trigger key when in input, text area or modifier is pressed
		let tag = e.target.tagName.toLowerCase();
		if (tag == "input" || tag == "textarea" || e.altKey || e.ctrlKey || e.metaKey) {
			return;
		}

		for (let i = 0; i < props.keys.length; i++) {
			if (props.keys[i].key == e.key) {
				props.keys[i].func();
				break;
			}
		}
	});
}

// load and activate cursor
function load_cursor() {
	props.cursor_max = $(props.cursor_selector).length;
	props.cursor_bg_default = get_cursor().css("background");
	move_cursor(0, false);
}

// return jQuery object for the selected image
function get_cursor() {
	return $(`${props.cursor_selector}:nth-child(${props.cursor_position})`);
}

function get_cursor_anchor() {
	let cursor = get_cursor();
	return cursor.is("a") ? cursor : cursor.find("a");
}

// moves the cursor by delta positions
function move_cursor(delta, canScroll) {
	// scroll to top if alredy at first position
	if (props.cursor_position == 1 && delta < 0) {
		$('html, body').animate({
			scrollTop: 0,
		}, 200);
		canScroll = false;
	}

	get_cursor().css("background", props.cursor_bg_default);
	get_cursor().css("border", "");
	props.cursor_position += delta;
	if (props.cursor_position < 1) props.cursor_position = 1;
	if (props.cursor_position > props.cursor_max) props.cursor_position = props.cursor_max;
	props.cursor_bg_default = get_cursor().css("background");
	get_cursor().css("background", props.cursor_bg_selected);
	get_cursor().css("border", "solid 2px red");
	// scroll into focus
	if (canScroll) {
		$('html, body').animate({
			scrollTop: get_cursor().offset().top - 10,
		}, 200);
	}
}

/* fast filter */
/*******************************************************************************************************************************************************************/
// front/search/favorites/watched page
pages.push({
	re: [/e[x-]hentai\.org\/$/, /e[x-]hentai\.org\/\?/, /e[x-]hentai\.org\/favorites\.php/, /e[x-]hentai\.org\/watched/],
	func: function() {
		// click on tag to filter
		$(".gt").click(function() {
			apply_filter($(this).text(), true);
		});

		// add english only button
		let a = $("<a href='#' rel='nofollow' onclick='return false;'>English Only</a>");
		a.click(function() {
			apply_filter("english", false);
		});
		$("#searchbox > form > div:nth-child(4)").append(" &nbsp; &nbsp;").append(a);
	}
});

function apply_filter(str, exact) {
	// get params from url
	let params = {};
	let split = window.location.search.split(/[&?]/);
	for (let i = 0; i < split.length; i++) {
		if (!split[i]) continue;
		let kv = split[i].split("=");
		if (!kv[0] || !kv[1]) continue;
		params[kv[0]] = kv[1];
	}

	// remove page indication
	delete params.page;

	// format str to f_search
	str = encodeURIComponent(formatTag(str, exact, true));

	if (params.f_search) {
		// update f_search param with new string
		if (!params.f_search.includes(str)) {
			params.f_search += "+" + str;
		}
	} else {
		// if there is no f_search param, add it
		params.f_search = str;
	}

	// update current url
	let finalUrl = "";
	for (let k in params) {
		if (params.hasOwnProperty(k)) {
			finalUrl += (finalUrl ? "&" : "?") + k + "=" + params[k];
		}
	}
	window.location.search = finalUrl;
}

/* skip /tag/ pages */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/e[x-]hentai\.org\/g\//],
	func: function() {
		tag_show_galleries = function() {
			top.location.href = base_url + "?f_search=" + encodeURIComponent(formatTag(selected_tagname, true, true));
		}
	}
});

/* highlight tags in gallery page */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/e[x-]hentai\.org\/g\//],
	func: function() {
		let tags = GM_getValue("tags", null);
		if (tags && tags._date > +new Date()) {
			highlightTags();
		} else {
			loadTags(true);
		}
	}
});

pages.push({
	re: [/e[x-]hentai\.org\/mytags/],
	func: loadTags,
});

function loadTags(doHighlight) {
	GM_xmlhttpRequest({
		method: "GET",
		url: `${window.location.protocol}//${window.location.host}/mytags`,
		onload: function(resp) {
			let tags = {};
			let jqPage = $(resp.response);

			jqPage.find("#usertags_outer > div .gt").each(function() {
				let tag = $(this).attr("title");
				let color = $(this).parent().parent().parent().find(".tagcolor").val();
				tags[tag] = color;
			});

			tags._date = +new Date() + 24*60*60*1000;

			GM_setValue("tags", tags);
			if (doHighlight) highlightTags();
		}
	});
}

function highlightTags() {
	let tags = GM_getValue("tags", {});

	$("#taglist > table > tbody").find(".gt, .gtl").each(function() {
		let t = getTagFromLink(this.firstChild);
		if (tags[t]) {
			$(this).css("border-color", tags[t]);
		}
	});
}

/* set tab title */
/*******************************************************************************************************************************************************************/
pages.push({
	re: [/e[x-]hentai\.org\/.*f_search.*/],
	func: function() {
		let params = {};
		let split = window.location.search.split(/[&?]/);
		for (let i = 0; i < split.length; i++) {
			if (!split[i]) continue;
			let kv = split[i].split("=");
			if (!kv[0] || !kv[1]) continue;
			params[kv[0]] = kv[1];
		}
		document.title = decodeURIComponent(params.f_search).replaceAll(/\+/g, " ");;
	}
});

pages.push({
	re: [/e[x-]hentai\.org\/watched/],
	func: function() {
		document.title = "Watched";
	}
});

pages.push({
	re: [/e[x-]hentai\.org\/popular/],
	func: function() {
		document.title = "Popular";
	}
});

pages.push({
	re: [/e[x-]hentai\.org\/favorites\.php/],
	func: function() {
		document.title = "Favorites";
	}
});

/* gallery quick favorite */
/*******************************************************************************************************************************************************************/

/* ====================================================== *\

	Code below modified from EH Gallery Quick Favourite
			   All credits to FabulousCupcake
   https://forums.e-hentai.org/index.php?showtopic=194073

\* ====================================================== */

let hotkeyInit = false;

// Stylesheet
const stylesheet =`
#gdf {
	margin: 6px 0 !important;
	padding: 10px 5px !important;
	width: 160px !important;
	height: 18px;
	position: relative;
	border: 1px dashed ${color.border};
	left: -2px !important;
}

#gdf>div:nth-child(1),
#gdf>div:nth-child(2),
#gdf>div:nth-child(3) {
	display: inline !important;
	float: none !important;
}

#gdf>div:nth-child(2)>a {
	position: relative;
	top: -1px;
	line-height: 21px;
}

#gdf>#fav {
	padding-left: 5px;
}

#gdf>#fav>* {
	float: none !important;
	display: inline-block !important;
	margin: 0 !important;
	position: relative;
	top: 2px;
}

#gdf div.i {
	display: inline-block;
	margin: 0 !important;
}

#gdf a:hover {
	color: inherit !important;
}

.qf-top,
.qf-bot {
	background: ${color.bg_light}!important;
	width: inherit;
	padding: 0 5px;
	position: absolute;
	left: -1px;
	visibility: hidden;
	border: 1px solid ${color.border};
}

.qf-top {
	border-bottom: none;
	padding-top: 5px;
	bottom: 33px;
}

.qf-bot {
	border-top: none;
	padding-bottom: 5px;
	top: 33px;
}

#gdf .fav {
	box-sizing: border-box;
	cursor: pointer;
	padding: 5px;
	text-align: left;
	width: 100%;
}

#gdf .fav:hover {
	background: ${color.bg};
}

#gdf:hover,
#gdf.hover {
	border: 1px solid ${color.border};
}

#gdf:hover>.qf-top,
#gdf:hover>.qf-bot,
#gdf.hover>.qf-top,
#gdf.hover>.qf-bot {
	visibility: visible;
}

#gdf.hover .fav {
	position: relative;
}

#gdf .hotkey-hint {
	position: absolute;
	top: 4px;
	right: 0;
	box-sizing: border-box;
	padding: 0 1px 0 2px;
	border: 1px solid #888;
	border-radius: 2px;
	background: #eee;
	color: #666 !important;
	font-family: monospace;
	font-size: 13px;
	box-shadow: -3px 0 2px 2px ${color.bg_light};
	visibility: hidden;
}

#gdf.hover .fav:hover .hotkey-hint {
	box-shadow: -3px 0 2px 2px ${color.bg};
}

#gdf.hover .hotkey-hint {
	visibility: visible;
}
`;


/* ========================================================================= *\
* *  UTILITY FUNCTIONS
\* ========================================================================= */
// Get the actual/current favourite category of the current gallery
function getPageFavId() {
	let idElement = document.querySelector("#fav .i");
	if (!idElement) return 10;

	return (idElement.style.backgroundPositionY.match(/\d+/)[0] - 2) / 19;
}


/* ========================================================================= *\
* *  UI INJECTIONS
\* ========================================================================= */
// Inject CSS
function injectStylesheet() {
	let stylesheetEl = document.createElement("style");
	stylesheetEl.innerHTML = stylesheet;
	document.body.appendChild(stylesheetEl);
}

// Build & Inject QF UI
function injectQFElements() {
	// Fetch the FavID of the current gallery
	let curFavID = getPageFavId();

	// Fetch the Labels of the 10 Fav items
	let favLabels = [];
	for (let i = 0; i < 10; i++) {
		let label = localStorage.getItem(`EHGQF-fav${i}`);
		if (!label) label = `Favorites ${i+1}`;
		favLabels.push(label);
	}

	// Build fav item elements
	let favEl = [];
	for (let i = 0; i < 10; i++) {
		let n = (i + 1) % 10;
		let offset = 2 + (i * 19);
		favEl.push(`
		<div qfid='${i}' class='fav'>
			<div class="i" style="background-image:url(https://ehgt.org/g/fav.png); background-position:0px -${offset}px;"></div>
			&nbsp; <a id="favoritelink" href="#">${favLabels[i]}</a>
			<div class="hotkey-hint">${n}</div>
		</div>
		`);
	}

	// Add the `remove favorites` fav item
	favEl.push(`
	<div qfid='favdel' class='fav'>
		<a id="favoritelink" href="#">Remove from Favorites</a>
		<div class="hotkey-hint">\\</div>
	</div>
	`);

	// Build top list
	let qfTopElContent = "";
	for (let i = 0; i < curFavID; i++) { qfTopElContent += favEl[i]; }
	let qfTopEl = `<div class='qf-top'>${qfTopElContent}</div>`;

	// Build bottom list
	let qfBotElContent = "";
	for (let i = curFavID + 1; i < favEl.length; i++) { qfBotElContent += favEl[i]; }
	let qfBotEl = `<div class='qf-bot'>${qfBotElContent}</div>`;

	// Inject Elements! Finally
	let gdf = document.getElementById("gdf");
	gdf.insertAdjacentHTML("beforeend", qfTopEl);
	gdf.insertAdjacentHTML("beforeend", qfBotEl);

	// Add Event Listeners
	let favDOMEl = document.querySelectorAll("#gdf .fav");
	for (let i = 0; i < favDOMEl.length; i++) {
		favDOMEl[i].addEventListener("click", quickFavourite);
	}

	// Disable `#gdf` click event; move it to its child element;
	gdf.children[0].onclick = function() { return pop_fav(); };
	gdf.children[1].onclick = function() { return pop_fav(); };
	gdf.onclick = "";
}


/* ========================================================================= *\
* *  QUICK FAVOURITE
\* ========================================================================= */
// Send Favouriting XHR request to EH server
function quickFavourite(id) {
	// Gather and build things
	let favnote = ""; // TODO
	let favID;
	try {
		favID = this.attributes.qfid.value;
	} catch(e) {
		favID = id;
	}
	let galID = location.pathname.match(/^\/\w\/(\d+)\//)[1];
	let token = location.pathname.match(/\/(\w+)\/$/)[1];
	let prot = location.protocol;
	let host = location.host;
	let url = `${prot}//${host}/gallerypopups.php?gid=${galID}&t=${token}&act=addfav`;
	let dat = `apply=Add to Favorites&favcat=${favID}&favnote=${favnote}&update=1`;

	// Prepare to send XHR
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

	// Remove Quick Favourite Elements to prevent sending multiple XHR
	document.querySelector(".qf-top").remove();
	document.querySelector(".qf-bot").remove();

	// Send XHR
	xhr.send(dat);

	// Update UI if request was successful
	xhr.onload = function() {
		if (xhr.status == 200) {
			updateCurrentFav(favID);     // Update #gdf
		} else {
			alert("Error occurred! Favorite was not updated!");
		}

		injectQFElements();              // Reinject Quick Favourite UI
		disableHotkeys();
	};
}

// Update the current/actual Favourite Category of the current Gallery
function updateCurrentFav(favID) {
	// If id is not specified, refresh
	if (typeof favID == "undefined") {
		favID = getPageFavId();
	}

	let el;

	if (favID == "favdel" || favID === 10) {
		el = `
		<div style="float:left">
			&nbsp; <a onclick="return false" href="#" id="favoritelink"><img src="https://ehgt.org/g/mr.gif"> Add to Favorites</a>
				   <div class="hotkey-hint"></div>
		</div>
		`;
	} else {
		// Fetch the Labels of the 10 Fav items
		let favLabels = [];
		for (let i = 0; i < 10; i++) {
			let label = localStorage.getItem(`EHGQF-fav${i}`);
			if (!label) label = `Favorites ${i}`;
			favLabels.push(label);
		}

		// Calculate bg offset
		let offset = 2 + (favID * 19);

		// Build
		el = `
		<div id="fav" style="float:left; cursor:pointer">
			<div title="Read Later" style="background-image:url(https://ehgt.org/g/fav.png); background-position:0px -${offset}px;" class="i"></div>
		</div>
		<div style="float:left">&nbsp;
			<a onclick="return false" href="#" id="favoritelink">${favLabels[favID]}</a>
		</div>
		`;
	}

	document.getElementById("gdf").innerHTML = el;
}

/* ========================================================================= *\
* *  FAVOURITE NOTES
\* ========================================================================= */
// Get Favourite Notes remotely from the popup
function fetchFavouriteNotes(cb) {
	// Send XHR to Favourite Page
	let galID = location.pathname.match(/^\/\w\/(\d+)\//)[1];
	let token = location.pathname.match(/\/(\w+)\/$/)[1];
	let prot = location.protocol;
	let host = location.host;
	let url = `${prot}//${host}/gallerypopups.php?gid=${galID}&t=${token}&act=addfav`;

	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.timeout = config.timeout;
	xhr.responseType = "document";
	xhr.send();

	// And grab the favnotes
	xhr.onload = function() {
		if (xhr.status == 200) {
			// grab it!
			let data = xhr.response;
			let favnoteEl = data.querySelector("textarea[name='favnote']");
			cb(favnoteEl.value); // Fire callback function
		} else {
			return false;
		}
	};

	xhr.timeout = function() {
		return false;
	};
}

/* ========================================================================= *\
* *  FAVOURITE HOTKEYS
\* ========================================================================= */
// Adds keypress event listener
function injectHotkeyListener() {
	document.addEventListener("keypress", hotkeyHandler);
}

// Handles keypresses
function hotkeyHandler(e) {
	let key = e.which;
	let char = String.fromCharCode(key);
	if (hotkeyInit) {
		if (e.keyCode == 27) {
			return;
		}

		// 1-0 and "\"
		let favID;
		switch(char) {
		case("1"):
			favID = 0;
			break;
		case("2"):
			favID = 1;
			break;
		case("3"):
			favID = 2;
			break;
		case("4"):
			favID = 3;
			break;
		case("5"):
			favID = 4;
			break;
		case("6"):
			favID = 5;
			break;
		case("7"):
			favID = 6;
			break;
		case("8"):
			favID = 7;
			break;
		case("9"):
			favID = 8;
			break;
		case("0"):
			favID = 9;
			break;
		case("\\"):
			favID = "favdel";
			break;
		default:
			disableHotkeys();
			break;
		}
		if (typeof favID != "undefined") quickFavourite(favID);
	} else {
		if (char == "c") enableHotkeys();
	}
}

function enableHotkeys() {
	hotkeyInit = true;
	// show CheatSheet
	document.getElementById("gdf").classList.add("hover");
	// scroll to top
	$('html, body').animate({ scrollTop: 0 }, 200);
}

function disableHotkeys() {
	// hide CheatSheet
	document.getElementById("gdf").classList.remove("hover");
	hotkeyInit = false;
}


/* ========================================================================= *\
* *  CORE LOGICS
\* ========================================================================= */
function checkSyncNecessity() {
	// >1w = stale
	let currentTime = new Date().getTime();
	let lastSyncTime = localStorage.getItem("EHGQF-lastSyncTime");
	let timeDelta = currentTime - lastSyncTime;
	if (timeDelta > 1000 * 60 * 60 * 24 * 7) return true;

	// setup
	let x = localStorage.getItem("EHGQF-setup");
	if (typeof x == "undefined") return true;

	// constant page check
	let labelId = getPageFavId();
	if (labelId == 10) return false;   // can't check if page isn't favourited yet

	let pageLabel = document.querySelector("#favoritelink").textContent;
	let storedLabel = localStorage.getItem(`EHGQF-fav${labelId}`);
	if (pageLabel != storedLabel) return true;

	return false;
}

function syncFavouriteLabels() {
	// Send XHR to Favourite Page
	let galID = location.pathname.match(/^\/\w\/(\d+)\//)[1];
	let token = location.pathname.match(/\/(\w+)\/$/)[1];
	let prot = location.protocol;
	let host = location.host;
	let url = `${prot}//${host}/gallerypopups.php?gid=${galID}&t=${token}&act=addfav`;

	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "document";
	xhr.send();

	// And grab the favnotes
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			let data = xhr.response;
			for (let i = 0; i <= 9; i++) {
				let label = data.querySelector(`div + div + div[onclick*='fav${i}']`).textContent;
				localStorage.setItem(`EHGQF-fav${i}`, label);
			}

			let time = new Date().getTime();
			localStorage.setItem("EHGQF-setup", 1);
			localStorage.setItem("EHGQF-lastSyncTime", time);
			updateCurrentFav();
			injectQFElements();
		}
	};
}

function initEHQF() {
	if (checkSyncNecessity()) syncFavouriteLabels();
	injectStylesheet();
	injectQFElements();
	injectHotkeyListener();
}

/* ====================================================== *\

	Code above modified from EH Gallery Quick Favourite
			   All credits to FabulousCupcake
   https://forums.e-hentai.org/index.php?showtopic=194073

\* ====================================================== */

pages.push({
	re: [/e[x-]hentai\.org\/g\//],
	func: initEHQF
});

/* preload images */
/*******************************************************************************************************************************************************************/
const barStyle = `
#bar {
	display: flex;
	flex-direction: row;
	height: 5px;
}

.page {
	flex-grow: 1;
	border-right: 1px solid black;
	border-bottom: 1px solid black;
	background-color: ${color.bar_bg};
}

.page:first-child {
	border-left: 1px solid black;
}

.page.loaded {
	background-color: ${color.bar_loaded}!important;
}

.page.current {
	background-color: ${color.bar_current}!important;
}

.page.error {
	background-color: ${color.bar_error}!important;
}`;

// init
let lastPage;
let imageList = {};
let urlList = {};
let respList = {};

function requestPage(url, n, cbFirst) {
	// done?
	if (n < 0) return;

	let part = url.split("/");
	let imgkey = part[4];
	let page = part[5].split("-")[1];

	let data = {
		method: "showpage",
		gid: gid,
		imgkey: imgkey,
		page: page,
		showkey: showkey,
	};

	GM_xmlhttpRequest({
		method: "POST",
		url: `${window.location.protocol}//${window.location.host}/api.php`,
		data: JSON.stringify(data),
		onload: function(response) {
			if (response.status == 200) {
				let resp = JSON.parse(response.responseText);
				let page = parseInt(resp.p);

				// save resp into list
				respList[page] = resp;

				// save image into list
				let imgSrc = resp.i3.match(/src="(.+?)"/)[1];

				// create and download image
				imageList[page] = new Image();
				imageList[page].id = "img";
				imageList[page].onload = function() { $(`#bar > .page:nth-child(${page})`).addClass("loaded").removeClass("error") };
				imageList[page].onerror = function() { $(`#bar > .page:nth-child(${page})`).addClass("error").removeClass("loaded") };
				imageList[page].src = imgSrc;

				// callback if this is the first call
				if (cbFirst) cbFirst();

				let sn = $(resp.n);
				let urlPrev = sn.find("#prev").attr("href");
				let urlNext = sn.find("#next").attr("href");

				// set prev url
				if (!urlList[page - 1]) urlList[page - 1]  = urlPrev;

				// request next page if not already loaded or last
				if (!imageList[page + 1] && urlNext.match(/\d+$/)[0] != page) {
					urlList[page + 1] = urlNext;
					requestPage(urlNext, n - 1, null);
				}
			}
		}
	});
}

function setImage(page, imgkey) {
	let resp = respList[page];
	let myi3 = resp.i3.replace(/<img.+?>/, "");

	// push state to history
	history.pushState({
		page: page,
		imgkey: imgkey,
	}, document.title, `${window.location.protocol}//${window.location.host}/s/${imgkey}/${gid}-${page}`);

	// modify page
	window.scrollTo(0, 0);
	document.getElementById("i1").style.width = resp.x + "px";
	document.getElementById("i2").innerHTML = resp.n + resp.i;
	document.getElementById("i3").innerHTML = myi3;
	document.getElementById("i3").children[0].appendChild(imageList[page]);
	document.getElementById("i4").innerHTML = resp.i + resp.n;
	document.getElementById("i5").innerHTML = resp.i5;
	document.getElementById("i6").innerHTML = resp.i6;
	// document.getElementById("i7").innerHTML = resp.i7;
	si = parseInt(resp.si);
	xres = parseInt(resp.x);
	yres = parseInt(resp.y);
	update_window_extents();

	// update loading bar cursor
	let barPages = $("#bar > .page");
	barPages.removeClass("current");
	barPages.eq(page - 1).addClass("current");
}

function saveCurrentImage(page) {
	// construct resp object
	let resp = {};
	resp.x = document.getElementById("i1").style.width.slice(0, -2);
	resp.i3 = document.getElementById("i3").innerHTML;
	resp.i5 = document.getElementById("i5").innerHTML;
	resp.i6 = document.getElementById("i6").innerHTML;
	// resp.i7 = document.getElementById("i7").innerHTML;
	resp.si = si.toString();
	resp.x = xres.toString();
	resp.y = yres.toString();
	// disassemble i4 into i and n
	let match = document.getElementById("i4").innerHTML.match(/(<div>.+?<\/div>)(.*)/);
	resp.i = match[1];
	resp.n = match[2];

	// save resp to array
	respList[page] = resp;
	// save image to array
	imageList[page] = new Image();
	imageList[page].id = "img";
	imageList[page].onload = function() { $(`#bar > .page:nth-child(${page})`).addClass("loaded").removeClass("error") };
	imageList[page].onerror = function() { $(`#bar > .page:nth-child(${page})`).addClass("error").removeClass("loaded") };
	imageList[page].src = document.getElementById("img").src;
}

function initImagePreload() {
	lastPage = parseInt($("#i4 > div.sn > div > span:nth-child(2)").text());

	// inject stylesheet
	let styleEl = document.createElement("style");
	styleEl.innerHTML = barStyle;
	document.body.appendChild(styleEl);

	// create loading bar element
	let barEl = $(`<div id="bar"></div>`);
	$("#i1").before(barEl);
	for (let i = 0; i < lastPage; i++) {
		barEl.append(`<div class="page"></div>`);
	}

	// set loading bar cursor
	barEl.find(`.page:nth-child(${startpage})`).addClass("current");

	// global override
	load_image = function(page, imgkey) {
		// load and set page
		if (imageList[page]) {
			setImage(page, imgkey);
		} else {
			requestPage(urlList[page], 0, function() { setImage(page, imgkey); });
		}

		// preload next pages if needed
		for (let i = page + 1; i <= page + 5 && i <= lastPage; i++) {
			if (!imageList[i] && urlList[i]) {
				requestPage(urlList[i], page + 5 - i, null);
				break;
			}
		}

		// prevent default action
		return false;
	}

	nl = function(a) {
		GM_xmlhttpRequest({
			method: "GET",
			url: window.location.href + (window.location.href.indexOf("?") > -1 ? "&" : "?") + "nl=" + a,
			onload: function(resp) {
				if (resp.status == 200) {
					// OK
					let page = window.location.href.split("-")[1];
					let imgkey = window.location.href.split("/")[4];
					let src = $(resp.responseText).find("#img").attr("src");

					imageList[page] = new Image();
					imageList[page].id = "img";
					imageList[page].onload = function() { $(`#bar > .page:nth-child(${page})`).addClass("loaded").removeClass("error") };
					imageList[page].onerror = function() { $(`#bar > .page:nth-child(${page})`).addClass("error").removeClass("error") };
					imageList[page].src = src;

					setImage(page, imgkey);
				}
			}
		});
	}

	// request current page
	urlList[startpage] = window.location.href;
	saveCurrentImage(startpage);
	// preload first images
	urlList[startpage - 1] = $(".sn").find("#prev").attr("href");
	urlList[startpage + 1] = $(".sn").find("#next").attr("href");
	requestPage(urlList[startpage + 1], 4, null);
}

pages.push({
	re: [/e[x-]hentai\.org\/s\//],
	func: initImagePreload
});

/* main */
/*******************************************************************************************************************************************************************/
(function($) {
	for (let i = 0; i < pages.length; i++) {
		for (let j = 0; j < pages[i].re.length; j++) {
			if (window.location.href.match(pages[i].re[j])) {
				pages[i].func();
				// break so we don't execute the same function twice
				break;
			}
		}
		// we don't break the external for, so we can execute multiple different function on the same page
	}
})(jQuery);
