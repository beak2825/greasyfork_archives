// ==UserScript==
// @name         H
// @namespace    https://greasyfork.org/en/users/188747-beta048596
// @version      2.3
// @description  ch
// @author       beta048596
// @match        *://*/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/368809/H.user.js
// @updateURL https://update.greasyfork.org/scripts/368809/H.meta.js
// ==/UserScript==

//GM_setValue("isCH", true);

/* global vars */
/*******************************************************************************************************************************************************************/

const ch = "ch:";

// bases
const exbase = "ZXhoZW50YWkub3Jn";
const nbase = "bmhlbnRhaS5uZXQ=";
const tbase = "d3d3LnRzdW1pbm8uY29t";

const bases =  [exbase, nbase,  tbase,     "ZS1oZW50YWkub3Jn", "aGl0b21pLmxh", "aGVudGFpMnJlYWQuY29t", "aGVudGFpLmNhZmU=", "ZHluYXN0eS1zY2Fucy5jb20=", "aGVudGFpZnJvbWhlbGwub3Jn", "aGVudGFpaGF2ZW4ub3Jn", "aGFuaW1lLnR2", "ZmFra3UubmV0"];
const colors = ["red",  "gold", undefined, "orange"];

/* tooltips */
/*******************************************************************************************************************************************************************/

// tooltips
let tooltips = [];

// creates a new tooltip
function addTooltip(name, parseTitle) {
	let tt = $("<a>" + name + "</a>");
	tt.addClass("Htooltip");
	tt.css({
		display: "block",
		position: "absolute",
		background: "white",
		border: "1px solid black",
		fontSize: "15px",
	});
	tooltips.push({
		tt: tt,
		parseTitle: parseTitle,
	});
}

addTooltip("E", t => ch + "https://" + atob(exbase) + atob("Lz9mX2RvdWppbnNoaT0xJmZfbWFuZ2E9MSZmX2FydGlzdGNnPTAmZl9nYW1lY2c9MCZmX3dlc3Rlcm49MCZmX25vbi1oPTEmZl9pbWFnZXNldD0wJmZfY29zcGxheT0wJmZfYXNpYW5wb3JuPTAmZl9taXNjPTAmZl9zZWFyY2g9") + t.split(" ").join("+") + atob("JmZfYXBwbHk9QXBwbHkrRmlsdGVy"));
addTooltip("N", t => ch + "https://" + atob(nbase) + "/g/" + t);
addTooltip("T", t => ch + "https://" + atob(tbase) + atob("L0Jvb2tzI34oVGV4dH4n") + t.split(" ").join("*20") + ")#");

// show tooltips
function updateTooltips(title) {
	let selection = window.getSelection();
	let range = selection.getRangeAt(0);
	let rect = range.getBoundingClientRect();

	for (let i = 0; i < tooltips.length; i++) {
		let tt = tooltips[i].tt;

		tt.css({
			top: (rect.top + window.scrollY) + "px",
			left: (rect.left + window.scrollX + rect.width + 5 + 15 * i) + "px",
		});

		let parseTitle = tooltips[i].parseTitle;
		tt.attr("href", parseTitle(title));

		$("body").append(tt);
	}
}

// hide tooltips
function removeTooltips() {
	for (let i = 0; i < tooltips.length; i++) {
		tooltips[i].tt.remove();
	}
}

// get text from selection
function getTextSel(e) {
	if (e && e.target && e.target.className == "Htooltip") {
		return
	}
	if (GM_getValue("active")) {
		let text = document.getSelection();
		text = text.toString();
		if (text) {
			updateTooltips(text);
			return;
		}
	}
	removeTooltips();
}

// mouseup listener
$(document).mouseup(getTextSel);

/* Substitute links */
/*******************************************************************************************************************************************************************/
if (!GM_getValue("isCH", false)) {
	$("a").each(function() {
		let a = $(this);
		for (let i = 0; i < bases.length; i++) {
			if (a.attr("href") && a.attr("href").includes(atob(bases[i]))) {
				a.attr("href", ch + a.attr("href"));
				a.css("color", colors[i] || "blue");
				break;
			}
		}
	});
}

/* Hactive */
/*******************************************************************************************************************************************************************/

// create Hactive element
let active = $("<div id='Hactive'>H active</div>");
active.css({
	color: "white",
	background: "red",
	position: "fixed",
	top: "0px",
	left: "0px",
	display: "block",
	zIndex: "10000",
	fontStyle: "15px",
});

// add or remove Hactive div
function updateActive() {
	if (GM_getValue("active", false)) {
		$("body").append(active);
	} else {
		active.remove();
	}
}

// key listener
$(document).keydown(function(e) {
	if (e.key == "à" && e.metaKey) {
		if (!GM_getValue("isCH", false)) window.open(ch + window.location.href, "_self");
	}
	if (e.key == "ù" && e.metaKey) {
		GM_setValue("active", !GM_getValue("active", false));
		getTextSel();
		updateActive();
	}
});

// on focus listener
$(window).focus(updateActive);

// trigger at sript start
updateActive();