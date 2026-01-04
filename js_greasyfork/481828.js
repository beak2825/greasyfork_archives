// ==UserScript==
// @name        DFProfiler - Add Block Maps and Coordinates
// @namespace   Dead Frontier - Shrike00
// @match       https://s1.dfprofiler.com/bossmap
// @match       https://s2.dfprofiler.com/bossmap
// @match       https://s3.dfprofiler.com/bossmap
// @match       https://s4.dfprofiler.com/bossmap
// @match       https://www.dfprofiler.com/bossmap
// @match       https://test2.dfprofiler.com/bossmap
// @grant       none
// @version     0.1.9
// @author      Shrike00
// @description Adds block maps and coordinates on click to boss map on DFProfiler.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481828/DFProfiler%20-%20Add%20Block%20Maps%20and%20Coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/481828/DFProfiler%20-%20Add%20Block%20Maps%20and%20Coordinates.meta.js
// ==/UserScript==

// Changelog:
// 0.1.9 - August 3, 2025
// - Change: Updated for changes to DFProfiler bossmap.
// 0.1.8 - December 25, 2023
// - Bugfix: Fix attempt 3.
// 0.1.7 - December 23, 2023
// - Bugfix: Fix attempt 2.
// 0.1.6 - December 23, 2023
// - Bugfix: Corrected code from 0.1.5.
// 0.1.5 - December 22, 2023
// - Bugfix: Updated for multiple boss slots in the same block.
// 0.1.4 - December 18, 2023
// - Change: Flags block in the top-left to check if it needs to refresh event handlers.
// - Change: Updates about-to-expire bosses with same coloration as legend.
// 0.1.3 - February 11, 2022
// - Change: Added loading div pop-up while image is loading.
// 0.1.2 - January 4, 2022
// - Change: Increased size of coordinates on pop-up.
// 0.1.1 - January 2, 2022
// - Feature: Added manual refresh button.

// TODO: Add player and location tracking.

(function() {
	// Constants
	const outposts = ["nastyasHoldout", "doggsStockade", "precinct13", "fortPastor", "secronomBunker", "campValcrest"];
	// Globals
	let refreshing = false;
	let callbacks = {};

	// Helpers
	function addToGrid(grid, x, y, value) {
		if (!(x in grid)) {
			grid[x] = {};
		}
		grid[x][y] = value;
	}

	function tableRows(table) {
		// Returns array of table row elements from table element.
		const children = Array.from(table.childNodes);
		const body = children.filter((child) => child.tagName !== undefined && child.tagName.toLowerCase() == "tbody")[0];
		if (body === undefined) {
			return [];
		}
		const table_children = Array.from(body.childNodes);
		const table_rows = table_children.filter((child) => child.tagName !== undefined && child.tagName.toLowerCase() == "tr");
		return table_rows;
	}

	function tableData(table) {
		// Returns array of table data elements from table element.
		let table_data = [];
		const table_rows = tableRows(table);
		for (let i = 0; i < table_rows.length; i++) {
			const row = table_rows[i];
			const row_children = row.childNodes;
			for (let j = 0; j < row_children.length; j++) {
				const child = row_children[j];
				if (child.tagName !== undefined && child.tagName.toLowerCase() == "td") {
					table_data.push(child);
				}
			}
		}
		return table_data;
	}

	function coordinatesFromTableData(table_data) {
		// Returns [x, y] from table data element.
		const classname = table_data.className;
		const regex = /coord x(\d+) y(\d+)/;
		const matches = classname.match(regex);
		return [parseInt(matches[1]), parseInt(matches[2])];
	}

	function isMission(table_data) {
		// Returns if table datum corresponds to mission block.
		// const classname = table_data.className;
		// return classname.indexOf("mission") != -1;
		return table_data.classList.contains("mission");
	}

	function isBoss(table_data) {
		// Returns if table datum corresponds to boss block.
		return table_data.classList.contains("boss-cycle");
	}

	function isOutpost(table_data) {
		for (let i = 0; i < outposts.length; i++) {
			if (table_data.classList.contains(outposts[i])) {
				return true;
			}
		}
		return false;
	}

	function getOutpost(table_data) {
		const classlist = table_data.classList
		if (classlist.contains("nastyasHoldout")) {
			return "Nastya's Holdout";
		} else if (classlist.contains("doggsStockade")) {
			return "Dogg's Stockade";
		} else if (classlist.contains("precinct13")) {
			return "Precinct 13";
		} else if (classlist.contains("fortPastor")) {
			return "Fort Pastor";
		} else if (classlist.contains("secronomBunker")) {
			return "Secronom Bunker";
		} else if (classlist.contains("campValcrest")) {
			return "Camp Valcrest";
		} else {
			return undefined;
		}
	}

	function getChild(parent, predicate) {
		const first_match = Array.from(parent.childNodes).filter(predicate)[0];
		return first_match === undefined ? null : first_match;
	}

	function removeChildrenPredicate(parent, predicate) {
		// Removes children for which predicate returns true.
		const to_be_removed = [];
		const children = parent.childNodes;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (predicate(child)) {
				to_be_removed.push(child);
			}
		}
		for (let i = 0; i < to_be_removed.length; i++) {
			to_be_removed[i].remove();
		}
	}

	function waitForLoad(callback, timeout) {
		const start = performance.now();
		const ajaxloader = document.getElementById("ajax-loader");
		const check = setInterval(function() {
			if (ajaxloader.style.getPropertyValue("display") === "none") {
				clearInterval(check);
				callback();
			}
			if (performance.now() > timeout) {
				clearInterval(check);
			}
		}, 500);
	}

	function clearTitle(e) {
		// Removes added title text, if necessary.
		const title = e.dataset["title"];
		const added_text_start = title.indexOf(",");
		if (added_text_start != -1) {
			e.setAttribute("title", title.substring(0, added_text_start));
		}
	}

	// Main Subroutines
	const base_url = "https://deadfrontier.info/map/Fairview_";
	const mission_holder = document.getElementById("mission-holder");
	const mission_info = document.getElementById("mission-info");

	function clickListeners() {
		// Adds click listeners to map blocks to add coordinates and block maps to pop-up.
		const map = document.getElementById("boss-table");
		const data = tableData(map);
		console.log("Click listeners added");
		for (let i = 0; i < data.length; i++) {
			let datum = data[i];
			const [x, y] = coordinatesFromTableData(datum);
			const target = base_url + x.toString() + "x" + y.toString() + ".png";
			if (window.getComputedStyle(datum).opacity === "0") { // Non-existent block.
				continue;
			}
			if (!isMission(datum) && !isBoss(datum)) { // Block does not have a boss or mission associated with it.
				clearTitle(datum);
				if (isOutpost(datum)) {
					datum.setAttribute("title", getOutpost(datum) + ", " + x.toString() + "x" + y.toString())
				} else {
					datum.setAttribute("title", x.toString() + "x" + y.toString());
				}
				const callback = function() {
					removeChildrenPredicate(mission_info, (child) => true); // Remove all children.
					if (isOutpost(datum)) {
						const title_element = document.createElement("h3");
						title_element.innerHTML = getOutpost(datum);
						mission_info.prepend(title_element);
					}
					const new_img = document.createElement("img");
					const loading_div = document.createElement("div");
					loading_div.innerHTML = "Loading block map...";
					mission_info.appendChild(loading_div);
					new_img.onload = function() {
						mission_info.removeChild(loading_div);
					}
					new_img.setAttribute("src", target);
					new_img.setAttribute("abm", "base");
					mission_info.appendChild(new_img);
					mission_holder.style.setProperty("display", "block");
					const coords_element = document.createElement("div");
					coords_element.style.setProperty("font-size", "16px");
					coords_element.style.setProperty("font-weight", "bold");
					coords_element.innerHTML = x.toString() + "x" + y.toString();
					coords_element.setAttribute("abm", "base");
					mission_info.appendChild(coords_element);
				};
				addToGrid(callbacks, x, y, callback);
				datum.addEventListener("click", callback);
			} else if (isMission(datum)) { // Mission block.
				clearTitle(datum);
				datum.setAttribute("title", datum.dataset["title"] + ", " + x.toString() + "x" + y.toString());
				const callback = function() {
					removeChildrenPredicate(mission_info, (child) => true);
					mission_info.appendChild(document.createElement("br"));
					mission_info.appendChild(document.createElement("br"));
					const new_img = document.createElement("img");
					const loading_div = document.createElement("div");
					loading_div.innerHTML = "Loading block map...";
					mission_info.appendChild(loading_div);
					new_img.onload = function() {
						mission_info.removeChild(loading_div);
					}
					new_img.setAttribute("src", target);
					new_img.setAttribute("abm", "base");
					mission_info.appendChild(new_img);
					mission_holder.style.setProperty("display", "block");
					const coords_element = document.createElement("div");
					coords_element.style.setProperty("font-size", "16px");
					coords_element.style.setProperty("font-weight", "bold");
					coords_element.innerHTML = x.toString() + "x" + y.toString();
					coords_element.setAttribute("abm", "base");
					mission_info.appendChild(coords_element);
				};
				addToGrid(callbacks, x, y, callback);
				datum.addEventListener("click", callback);
			} else if (isBoss(datum)) { // Boss block.
				clearTitle(datum);
				datum.setAttribute("title", datum.dataset["title"] + ", " + x.toString() + "x" + y.toString());
				const callback = function() {
					removeChildrenPredicate(mission_info, (child) => true);
					const new_img = document.createElement("img");
					const loading_div = document.createElement("div");
					loading_div.innerHTML = "Loading block map...";
					mission_info.appendChild(loading_div);
					new_img.onload = function() {
						mission_info.removeChild(loading_div);
					}
					new_img.setAttribute("src", target);
					new_img.setAttribute("abm", "base");
					mission_info.appendChild(new_img);
					if (datum.dataset.newboss !== undefined) {
						const boss_title_element = document.createElement("h3");
						boss_title_element.innerHTML = datum.dataset.newboss;
						mission_info.prepend(boss_title_element);
					}
					const coords_element = document.createElement("div");
					coords_element.style.setProperty("font-size", "16px");
					coords_element.style.setProperty("font-weight", "bold");
					coords_element.innerHTML = x.toString() + "x" + y.toString();
					coords_element.setAttribute("abm", "base");
					mission_info.appendChild(coords_element);
					mission_holder.style.setProperty("display", "block");
				};
				addToGrid(callbacks, x, y, callback);
				datum.addEventListener("click", callback);
			}
		}
	}

	function removeClickListeners() {
		// Removes click listeners from map block pop-ups.
		const map = document.getElementById("boss-table");
		const data = tableData(map);
		console.log("Click listeners removed");
		for (let i = 0; i < data.length; i++) {
			let datum = data[i];
			const [x, y] = coordinatesFromTableData(datum);
			datum.removeEventListener("click", callbacks[x][y]);
			delete callbacks[x][y];
		}
	}

	function refresh() {
		refreshing = true;
		removeClickListeners();
		clickListeners();
		refreshing = false;
	}

	function setBossColors() {
		const current_bosses = tableRows(document.getElementById("cur_bosses"));
		const color_map = new Map();
		const current_boss_map = new Map();
		for (let i = 0; i < current_bosses.length; i++) {
			const row = current_bosses[i];
			const color = window.getComputedStyle(row).getPropertyValue("color");
			const data = row.children;
			const slot = data[0].innerHTML;
			const boss = data[1].innerHTML;
			const count = data[2].innerHTML;
			// console.log(slot, boss, count, color);
			const default_color = "rgb(170, 170, 170)"
			if (color !== default_color) {
				color_map.set(slot, color);
			}
			current_boss_map.set(slot, boss);
		}
		const boss_map = document.getElementById("boss-table");
		const squares = tableData(boss_map);
		for (let i = 0; i < squares.length; i++) {
			const square = squares[i];
			if (isBoss(square)) {
				for (let j = 0; j < square.children.length; j++) {
					const slot = square.children[j];
					const is_current_boss = current_boss_map.get(slot.innerHTML) === square.dataset.newboss || current_boss_map.has(slot.innerHTML);
					if (color_map.has(slot.innerHTML) && is_current_boss) {
						slot.style.setProperty("color", color_map.get(slot.innerHTML));
					}
				}
			}
		}
	}

	function tableDataByCoordinates() {
		// Returns elements in an [x][y] object.
		const map = document.getElementById("boss-table");
		const data = tableData(map);
		const output = {};
		for (let i = 0; i < data.length; i++) {
			let datum = data[i];
			const [x, y] = coordinatesFromTableData(datum);
			if (output[x] === undefined) {
				output[x] = {};
			}
			output[x][y] = datum;
		}
		return output;
	}

	function addRefreshButton() {
		const bossmap = document.getElementById("bossmap-page");
		const div = bossmap.children[0];
		const button = document.createElement("button");
		button.id = "refresh-onclick-abm"
		button.innerHTML = "Refresh On-click Listeners";
		button.addEventListener("click", function(e) {
			if (!refreshing) {
				refresh();
			}
		});
		div.append(button);
	}

	function flagBlock() {
		const data = tableDataByCoordinates();
		const checkblock = data[1000][981];
		checkblock.dataset.abmacflag = "true";
	}

	function eventListenersPresent() {
		const data = tableDataByCoordinates();
		const checkblock = data[1000][981];
		return checkblock.dataset.abmacflag === "true";
	}

	function main() {
		clickListeners();
		addRefreshButton();
		flagBlock();
		setBossColors();
		setInterval(function() { // Removes and re-adds click listeners, since it seems to stop working otherwise.
			if (!eventListenersPresent() && !refreshing) {
				refresh();
				flagBlock();
				setBossColors();
			}
			// if (!refreshing) {
			// 	refresh();
			// }
		}, 1000)
	}
	waitForLoad(main, 30000);
})();
