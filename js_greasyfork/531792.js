// ==UserScript==
// @name         Guild XP/h
// @namespace    http://tampermonkey.net/
// @version      2025-12-06
// @description  Guild XP/h tracker for MWI
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_setValues
// @grant        GM_listValues
// @grant        GM_deleteValues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531792/Guild%20XPh.user.js
// @updateURL https://update.greasyfork.org/scripts/531792/Guild%20XPh.meta.js
// ==/UserScript==

/*
	Changelog
	=========

	v2025-04-04
		- Initial version
	v2025-04-04 v2
		- FIXED: if you check XP too often (10m) it'll replace data instead of adding
		- Sort by Rank (or Level, Experience)
		- Sort by "Last hour XP gain" (or "Last hour XP/h")
		- Sort by "Last day XP gain" (or "Last day XP/h")
	v2025-04-04 v3
		- FIXED: Horizontal legend on the Last week XP/h chart wasn't aligned properly
		- Separate "Last hour/day XP/h" and "Last hour/day XP #" columns
		- Everything is sortable on Guild -> Members tab
		- Everything is sortable on Leaderboard -> Guild, except "Name"
	v2025-04-04-v3
		- FIXED: Version field
	v2025-04-06
		- FIXED: Chart tooltip was off when zoomed in
		- Show "Last XP/h" on Guild -> Overview if not enough data for "Last hour XP/h"
		- Changed "Last hour XP/h" to "Last XP/h", same for ranks (on Guild -> Members and Leaderboard -> Guild)
	v2025-04-06-v2
		- Don't store data older than 1 week
	v2025-04-07
		- FIXED: "Last XP/h" (On Leaderboard -> Guild tab) didn't stick the first row
		- Added Export data to a file (On Settings -> Profile tab)
		- Added Import data from a file (On Settings -> Profile tab)
		- Added Delete all data (On Settings -> Profile tab)
	v2025-07-10
		- FIXED: Settings buttons misaligned
		- FIXED: Settings onclick was conflicting with another mod
		- FIXED: "undefined" in XPs
		- Added time to level up
		- Merged Last XP/h with # column + on the guild leaderboard
		- Merged Last day XP/h with # column + on the guild leaderboard
		- Added emojis for 1st, 2nd, 3rd place
		- Made default sorting direction desc
		- Added sorting idle activities, like "23d ago" or empty
		- Removed Max XP/h from the guild leaderboard
		- Changed Status sorting
		- When joined
	v2025-08-19
		- Truncate anomalously hight XP/h values on the chart (for the 19.08.2025 combat rework XP redistribution)
	v2025-10-09
		- Removed Max Xp/h
		- Added "Invited by"
		- Fixed time to lvl up
		- Fixed NaN in LastXP/h when someone rejoining
		- o7 characters list for MB
	v2025-12-06
		- FIXED: Reconnecting after unfocus, tab switching, desktop switching
*/

/*
	        TODO
	====================
	- [Conflicts] with MWITools, "Current Assets" not showing
	- [Conflicts] with MWITools, sort items by, Character Build Score and the Total NetWorth not showing
	- [Conflicts] when run under ViolentMonkey on PC and Android

	- Combat Level
	- Who has the top lvl in a skill
	- Icons for setups
	- Use Lurpas server?
	- How many ppl doing what skill
	- Possible conflict with MWITools
	- Just have a little notepad next to the name in members tab where you can mouseover or click to see the note (ayzen)
*/

(function() {
	async function waitFor (selector) {
		return new Promise((resolve) => {
			function check () {
				const el = document.querySelector(selector);
				if (el) {
					resolve(el);
				} else {
					setTimeout(check, 1000/30);
				}
			}
			check();
		});
	}

	function f (n) {
		return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");
	}

	function reset () {
		const ok = confirm("Are you sure you want to delete ALL Guild XH/h data?");
		if (ok) {
			const keys = GM_listValues();
			GM_deleteValues(keys);
			console.log("Guild XP/h: Deleted stored values for", keys);
		}
	}

	function downloadFile (fileName, data) {
		const json = JSON.stringify(data, null, "\t");
		const blob = new Blob([json], { type: "octet/stream" });
		const url = URL.createObjectURL(blob);

		let a = document.createElement("a");
		document.body.appendChild(a);
		a.style.display = "none";
		a.href = url;
		a.download = fileName;
		a.click();
		a.remove();

		URL.revokeObjectURL(url);
	}

	async function uploadFile () {
		return new Promise((resolve) => {
			var input = document.createElement("input");
			//input.style.display = "none";
			document.body.appendChild(input);
			input.type = "file";

			input.onchange = (event) => {
				const file = event.target.files[0];

				const reader = new FileReader();
				reader.readAsText(file, "UTF-8");

				reader.onload = (event2) => {
					let text = event2.target.result;
					let data = JSON.parse(text);
					input.remove();
					resolve(data);
				}
			}

			input.click();
		});
	}

	function exportData () {
		let data = GM_getValues(GM_listValues());
		downloadFile("guildsXPh-"+characterName+".json", data);
	}

	async function importData () {
		const data = await uploadFile();

		const keys = GM_listValues();
		GM_deleteValues(keys);

		GM_setValues(data);
	}

	unsafeWindow.guildXPUserscriptDebug = false;

	unsafeWindow.guildXPUserscriptReset = reset;
	unsafeWindow.guildXPExportData = exportData;
	unsafeWindow.guildXPImportData = importData;

	function debugValue (id, value) {
		if (unsafeWindow.guildXPUserscriptDebug) {
			unsafeWindow[id] = value;
			console.log("window." + id + "=");
			console.log(value);
		}
	}

	function cleanData () {
		console.log("cleanData");
		let anomaliesCleaned = GM_getValue("anomaliesCleaned", false);
		console.log({anomaliesCleaned});
		if (!anomaliesCleaned) {
			console.error("Guild XP/h: Cleaning anomalies");
			const keys = GM_listValues();
			keys.forEach((key) => {
				if (key != "anomaliesCleaned") {
					let value = GM_getValue(key);
					for (let name in value) {
						const xps = value[name];
						cleanAnomalies(xps);
					}
				}
			});
			anomaliesCleaned = true;
			GM_setValue("anomaliesCleaned", anomaliesCleaned);
		}
	}

	function minusDay (t) {
		return (new Date(t)).setDate((new Date(t)).getDate() - 1);
	}

	let m10 = 10 * 60 * 1000;
	let h1 = 60 * 60 * 1000;
	let w1 = 7 * 24 * 60 * 60 * 1000;
	function pushXP (arr, d, recent=m10, far=h1, old=w1) {
		// Debug: Delete duplicate XPs
		/*
		for (let i = arr.length - 1; i >= 0; i--) {
			const d = arr[i];
			const same = arr.filter((d2) => d2 != d && d2.xp == d.xp);
			same.reverse().forEach((d2) => {
				const i2 = arr.indexOf(d2);
				arr.splice(i2, 1);
				i--;
			});
		}
		*/

		// Debug: Delete values not in order
		/*
		for (let i = 0; i < arr.length; i++) {
			const d = arr[i];
			if (i > 0) {
				const prev = arr[i-1];
				if (d.xp < prev.xp) {
					arr.splice(i, 1);
					i--;
				}
			}
		}
		*/

		if (arr.length == 0 || d.xp >= arr[arr.length - 1].xp) {
			arr.push(d);
		} else {
			// Why can it happen???
			console.error("Guild XP/h: Received lower XP value");
		}

		/*
		if (arr.length > 2) {
			const h = arr[arr.length - 1];
			const l = arr[arr.length - 2];
			const m = arr[arr.length - 3];
			const hld = h.xp - l.xp;
			const lmd = l.xp - m.xp;
			if (h.t - m.t < far && hld > lmd * 3) {
				console.error("Guild XP/h: Remove Anomalous datapoint");
				arr.splice(arr.length - 2, 1);
			}
		}
		*/

		// arr.length can get below 3 if an anomaly removed
		if (arr.length > 2) {
			// Assume records are in order
			let recentLength = 0;
			for (let i = arr.length - 1; i >= 0; i--) {
				const d2 = arr[i];
				if (d.t - d2.t <= recent) {
					recentLength += 1
				} else {
					break;
				}
			}

			if (recentLength > 2) {
				// Keep a first and last recond in *recent* time
				// To always have the latest data
				// But without adding too many records with short time between
				// If I keep only the last - it will always replace if you check more often then *recently*
				arr.splice(arr.length - recentLength + 1, recentLength - 2);
			}

			let sameLength = 0;
			for (let i = arr.length - 1; i >= 0; i--) {
				const d2 = arr[i];
				// Keep same XP values if they are far apart
				if (d.xp == d2.xp && d.t - d2.t <= far) {
					sameLength += 1
				} else {
					break;
				}
			}

			if (sameLength > 1) {
				// Keep only the last recond with the same XP value
				arr.splice(arr.length - sameLength, sameLength - 1);
			}

			let oldLength = 0;
			for (let i = 0; i < arr.length; i++) {
				const d2 = arr[i];
				if (d.t - d2.t > old) {
					oldLength += 1;
				}
			}

			if (oldLength > 0 ) {
				arr.splice(0, oldLength);
			}
		}
	}

	function cleanAnomalies (arr, far=h1) {
		if (arr.length > 2) {
			for (let i = 2; i < arr.length; i++) {
				const h = arr[i];
				const l = arr[i-1];
				const m = arr[i-2];
				const hld = h.xp - l.xp;
				const lmd = l.xp - m.xp;
				if (h.t - m.t < far && hld > lmd * 3) {
					console.error("Guild XP/h: Remove Anomalous datapoint");
					//console.error({ d: new Date(m.t), xp: m.xp });
					//console.error("Remove", { d: new Date(l.t), xp: l.xp });
					//console.error({ d: new Date(h.t), xp: h.xp });
					//console.error({ lmd, hld });
					arr.splice(i - 1, 1);
					i -= 1;
				}
			}
		}
	}

	// Test pushXP() and cleanAnomalies() in Node.js
	/*
	function unsafeWindow () {} // Hoist
	let r = 2;
	let far = 5;
	let o = 11;
	let arr = [];
	pushXP(arr, { t: 8, xp: 17 }, r, far, o); // <- too old, delete
	pushXP(arr, { t: 9, xp: 18 }, r, far, o); // <- too old, delete
	pushXP(arr, { t: 10, xp: 19 }, r, far, o);
	pushXP(arr, { t: 11, xp: 20 }, r, far, o); // <- recent, don't add
	pushXP(arr, { t: 12, xp: 21 }, r, far, o);
	pushXP(arr, { t: 20, xp: 21 }, r, far, o);
	console.log("10, 12, 20", arr);

	arr = [
		{ t: 20, xp: 21 },
		{ t: 30, xp: 30 },
		{ t: 32, xp: 32 }, // <- should delete
		{ t: 34, xp: 40 }
	];
	o = 100;
	cleanAnomalies(arr, far);
	console.log("20, 30, 34", arr);

	arr = [
		{ t: 20, xp: 21 },
	]
	pushXP(arr, { t: 30, xp: 30 }, r, far, o);
	pushXP(arr, { t: 32, xp: 32 }, r, far, o);  // <- should delete, after next
	console.log("20, 30, 32", arr);
	pushXP(arr, { t: 34, xp: 40 }, r, far, o);
	console.log("20, 30, 34", arr);

	return;
	*/

	function keepOneInInterval (arr, interval) {
		let filtered = [];
		for (let i = arr.length - 1; i >= 0; i--) {
			const d = arr[i];
			if (filtered.length == 0) {
				filtered.unshift(d);
			} else if (filtered[0].t - d.t >= interval) {
				filtered.unshift(d);
			} else if (i == 0) {
				filtered.unshift(d);
			} else {
				// Skip
			}
		}
		
		return filtered;
	}

	function inLastInterval (arr, interval) {
		let filtered = [];
		const now = Date.now();
		for (let i = arr.length - 1; i >= 0; i--) {
			const d = arr[i];
			if (now - d.t <= interval) {
				filtered.unshift(d);
			} else {
				// Skip
			}
		}

		return filtered;
	}

	function calcXPH (prev, d) {
		const xpD = d.xp - prev.xp;
		const tD = d.t - prev.t;
		const xpH = (xpD / (tD / (60 * 1000))) * 60;
		return xpH;
	}

	function calcIndividualStats (arr, options={}) {
		// all time min
		// all time max
		// last hour
		// last day
		// last week chart

		if (arr.length < 2) {
			return {
				lastHourXPH: 0,
				lastDayXPH: 0,
				minXPH: 0,
				maxXPH: 0,
				chart: [],
			};
		}

		const m10 = 10 * 60 * 1000;
		const d1 = 24 * 60 * 60 * 1000;
		const w1 = 7 * 24 * 60 * 60 * 1000;
		let temp = keepOneInInterval(inLastInterval(arr, w1), m10);


		let minXPH = Infinity;
		let maxXPH = 0;
		let chart = temp.map((d, i) => {
			if (i != 0) {
				const prev = temp[i - 1];
				const xpD = d.xp - prev.xp;
				const tD = d.t - prev.t;
				const xpH = (xpD / (tD / (60 * 1000))) * 60;
				minXPH = Math.min(minXPH, xpH);
				maxXPH = Math.max(maxXPH, xpH);

				return {
					t: d.t,
					tD,
					xpH,
				}
			}
		}).filter(Boolean);

		const lastXPH = arr.length >= 2 ? calcXPH(arr[arr.length - 2], arr[arr.length - 1]) : 0;

		const h1 = 60 * 60 * 1000;
		const lastHourArr = inLastInterval(arr, h1);
		const lastHourXPH = lastHourArr.length >= 2 ? calcXPH(lastHourArr[0], lastHourArr[lastHourArr.length - 1]) : 0;


		const lastDayArr = inLastInterval(arr, d1);
		const lastDayXPH = lastDayArr.length >= 2 ? calcXPH(lastDayArr[0], lastDayArr[lastDayArr.length - 1]) : 0;

		return {
			lastXPH,
			lastHourXPH,
			lastDayXPH,
			minXPH,
			maxXPH,
			chart,
		};
	}

	function showTooltip ({ x, y, header, body }) {
		const dbb = document.body.getBoundingClientRect();
		let template = `<div role="tooltip"
			class="userscript-guild-xph__tooltip MuiPopper-root MuiTooltip-popper css-112l0a2"
			style="position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate(${Math.floor(x - dbb.x)}px, ${Math.floor(y - dbb.bottom)}px) translate(-50%, 0);"
			data-popper-placement="top"
		>
			<div class="MuiTooltip-tooltip MuiTooltip-tooltipPlacementTop css-1spb1s5" style="opacity: 1; transition: opacity 0ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;">
				<div class="ItemTooltipText_itemTooltipText__zFq3A">
					<div class="ItemTooltipText_name__2JAHA">
						<span>${header}</span>
					</div>
					<div>
						<span>${body}</span>
					</div>
				</div>
			</div>
		</div>`

		hideTooltip();
		document.body.insertAdjacentHTML("beforeend", template);
	}

	function hideTooltip () {
		document.body.querySelectorAll(".userscript-guild-xph__tooltip").forEach((el) => el.remove());
	}

	function guildXPChart (chart) {
		if (chart.length == 0) {
			return "";
		}

		let maxXPH = 0;
		let tDSum = 0;
		let hasTruncated = false;
		if (chart.length >= 2) {
			const per50 = chart.slice(0).sort((a, b) => a.xpH - b.xpH)[Math.ceil(chart.length / 2)].xpH;

			chart.forEach((d) => {
				// Truncate data 2x the 50th percentile
				// For the big spike associated with the 19.08.2025 combat rework XP redistribution
				if (d.xpH > per50 * 2) {
					d.truncated = true;
					hasTruncated = true;
				}
			});
		}

		chart.forEach((d) => {
			tDSum += d.tD;

			if (!d.truncated) {
				maxXPH = Math.max(maxXPH, d.xpH);
			}
		});

		if (hasTruncated) {
			maxXPH = maxXPH * 1.1;
		}

		const minT = chart[0].t;
		const maxT = chart[chart.length - 1].t;

		let hLegend = [];
		let lastDayStart = (new Date(maxT)).setHours(0, 0, 0, 0);
		let lt = lastDayStart;
		while (lt > minT) {
			if (hLegend.length == 0) {
				hLegend.unshift({
					t: lt,
				});
			} else {
				hLegend.unshift({
					t: lt,
				});
			}
			lt = minusDay(lt);
		}

		if (hLegend.length == 0) {
			// Always show min label
			hLegend.unshift({
				t: minT,
			});
		} else if (hLegend.length > 0 && hLegend[0].t - minT > tDSum / 10) {
			hLegend.unshift({
				t: minT,
			});
		}

		if (hLegend.length > 0 && maxT - hLegend[hLegend.length - 1].t > tDSum / 10) {
			hLegend.push({
				t: maxT,
			});
		}

		let t = `
			<div class="userscript-guild-xph" style="
					display: grid;
					grid-template-columns: auto auto 1fr;
					grid-template-rows: 1fr auto;
					width: calc(100% - 28px * 2);
					height: calc(100% - 28px * 3 - 14px);
					margin-top: 28px;
					margin-left: 28px;
					gap: 2px;
				">
				<div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
					<div style="font-size: 10px; transform: translate(0, -50%);">${f(maxXPH)}</div>
					<div style="font-size: 10px;">${f(maxXPH / 2)}</div>
					<div style="font-size: 10px; transform: translate(0, 50%);">${0}</div>
				</div>
				<div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
					<div style="width: 8px; height: 1px; background-color: var(--color-space-300);"></div>
					<div style="width: 8px; height: 1px; background-color: var(--color-space-300);"></div>
					<div style="width: 8px; height: 1px; background-color: var(--color-space-300);"></div>
				</div>
				<div style="flex: 1 1; display: flex; align-items: flex-end; height: 100%; gap: 1px;">`;
					chart.forEach((d) => {
						t += `<div class="userscript-guild-xph__bar"
							style="
								height: ${(d.truncated ? maxXPH : d.xpH) / maxXPH * 100}%;
								width: ${d.tD / tDSum * 100}%;
								${ d.truncated
									? 'background-image: linear-gradient(45deg, var(--color-space-300) 25%, transparent 25%, transparent 50%, var(--color-space-300) 50%, var(--color-space-300) 75%, transparent 75%); background-size: 10px 10px;'
									: 'background-color: var(--color-space-300);'
								}"
							data-xph="${d.xpH}"
							${d.truncated ? 'data-truncated="true"' : ''}
							data-t="${d.t}"
						></div>`;
					});
				t += `</div>
				<div></div>
				<div></div>
				<div style="flex: 0 0; position: relative; height: 28px;">`
					hLegend.forEach((d) => {
						t += `<div style="position: absolute; top: 0; left: ${(d.t - minT) / tDSum * 100}%; flex-direction: column;">
							<div style="width: 1px; height: 8px; background-color: var(--color-space-300);"></div>
							<div style="font-size: 10px; width: 80px; transform: translate(-50%, 0);">${new Date(d.t).toLocaleString()}</div>
						</div>`;
					});
				t += `</div>
			</div>`;

		return t;
	}

	function onBarEnter (event) {
		const el = event.target;
		const truncated = el.dataset.truncated === "true";
		const xpH = +el.dataset.xph;
		const t = +el.dataset.t;

		const bb = el.getBoundingClientRect();

		showTooltip({
			x: bb.x,
			y: bb.y,
			header: (new Date(t)).toLocaleString(),
			body: f(xpH) + " XP/h" + (truncated ? " (anomalously high value)" : "")
 		});
	}

	function onBarLeave (event) {
		hideTooltip();
	}

	function textColumnValueGetter (columnIndex, trEl) {
		return trEl.children[columnIndex].textContent;
	}

	function numberColumnValueGetter (columnIndex, trEl) {
		let n = trEl.children[columnIndex].textContent;
		n = n.replace(/ /, "");
		if (n.endsWith("K")) {
			return (+n) * 1000;
		} else {
			return +n;
		}
	}

	// For members natural sort order, activity
	function dataValueColumnValueGetter (columnIndex, trEl) {
		return trEl.children[columnIndex]._value;
	}

	function sortColumn (thEl, options) {
		const tableEl = thEl.parentElement.parentElement.parentElement;
		const tbodyEl = tableEl.querySelector("tbody");

		// Toggle direction + store selected sortId
		if (tableEl.dataset.sortId == options.sortId) {
			tableEl.dataset.sortDirection = tableEl.dataset.sortDirection == "asc" ? "desc" : "asc";
		} else {
			tableEl.dataset.sortId = options.sortId;
		}

		let trEls = Array.from(tbodyEl.children);

		// For leaderboards
		if (options.skipFirst) {
			trEls = trEls.slice(1);
		}

		trEls
			.sort((a, b) => {
				const av = options.sortGetter(a);
				const bv = options.sortGetter(b);
				if (typeof av == "number") {
					if (tableEl.dataset.sortDirection == "asc") {
						return av - bv;
					} else {
						return bv - av;
					}
				} else if (typeof av == "string"){
					if (tableEl.dataset.sortDirection == "asc") {
						return av.localeCompare(bv);
					} else {
						return bv.localeCompare(av);
					}
				} else {
					console.error("Guild XP/h: Should be unreachable");
				}
			})
			.forEach(trEl => tbodyEl.appendChild(trEl) );



		// Rerender sort icons
		const theadTrEl = thEl.parentElement;
		Array.from(theadTrEl.children).forEach((thEl) => {
			const iconEl = thEl.querySelector(".userscript-guild-xph__sort-icon");
			if (iconEl) {
				iconEl.remove();
				const template = sortIcon({ direction: thEl.dataset.sortId == tableEl.dataset.sortId ? tableEl.dataset.sortDirection : "none"});
				thEl.insertAdjacentHTML("beforeend", template)
			}
		});
	}

	function makeColumnSortable(thEl, options = {}) {
		if (!("icon" in options)) {
			options.icon = true;
		}

		const theadTrEl = thEl.parentElement;
		const columnIndex = Array.from(theadTrEl.children).indexOf(thEl);

		if (!("showIcon" in options)) {
			options.showIcon = true;
		}

		if (!("skipFirst" in options)) {
			options.skipFirst = false;
		}

		if (!("sortId" in options)) {
			options.sortId = columnIndex;
		}

		if (!("sortGetter" in options)) {
			if (options.sortData || options.data) {
				options.sortGetter = dataValueColumnValueGetter.bind(null, columnIndex);
			} else {
				options.sortGetter = textColumnValueGetter.bind(null, columnIndex);
			}
		}

		const tableEl = thEl.parentElement.parentElement.parentElement;
		if (options.defaultSortId) {
			tableEl.dataset.sortId = options.defaultSortId;
		}

		if (options.sortData) {
			const tbodyEl = tableEl.querySelector("tbody");
			Array.from(tbodyEl.children).forEach((trEl, i) => {
				trEl.children[columnIndex]._value = options.sortData[i];
			});
		} else if (options.data) {
			const tbodyEl = tableEl.querySelector("tbody");
			Array.from(tbodyEl.children).forEach((trEl, i) => {
				trEl.children[columnIndex]._value = options.data[i];
			});
		}

		thEl.dataset.sortId = options.sortId;
		tableEl.dataset.sortDirection = "desc";

		if (options.showIcon) {
			const template = sortIcon({ direction: thEl.dataset.sortId == tableEl.dataset.sortId ? tableEl.dataset.sortDirection : "none"});
			thEl.insertAdjacentHTML("beforeend", template)
		}

		thEl.style.cursor = "pointer";
		thEl.onclick = sortColumn.bind(null, thEl, options);
	}

	function addColumn(tableEl, options) {
		let thEl = tableEl.querySelector(`th.userscript-guild-xph[data-name="${options.name}"`)
		if (!thEl) {
			const theadTrEl = tableEl.querySelector("thead tr");

			if (!("insertAfter" in options) && !("insertBefore" in options)) {
				options.insertAfter = theadTrEl.children.length - 1;
			}

			const template = `<th class="userscript-guild-xph">${options.name}</th>`;
			if (options.insertBefore) {
				theadTrEl.children[options.insertBefore].insertAdjacentHTML("beforebegin", template);
			} else {
				theadTrEl.children[options.insertAfter].insertAdjacentHTML("afterend", template);
			}

			const tbodyEl = tableEl.querySelector("tbody");
			Array.from(tbodyEl.children).forEach((trEl, i) => {
				const v = options.data[i];
				let fv;
				if (options.format) {
					fv = options.format(v, i);
				} else if (v === undefined) {
					fv = "";
				} else if (typeof v == "number" && isNaN(v)) {
					fv = "";
				} else {
					fv = typeof v == "number" ? f(v) : (v ?? "0");
				}
				const template = `<td class="userscript-guild-xph">${fv}</td>`
				if (options.insertBefore) {
					trEl.children[options.insertBefore].insertAdjacentHTML("beforebegin", template);
				} else {
					trEl.children[options.insertAfter].insertAdjacentHTML("afterend", template);
				}
			});

			if (options.makeSortable) {
				if (options.insertBefore) {
					makeColumnSortable(theadTrEl.children[options.insertBefore], options);
				} else {
					makeColumnSortable(theadTrEl.children[options.insertAfter + 1], options);
				}
			}
		}
	}

	function fTimeLeft (ms) {
		const m1 = 60 * 1000;
		const h1 = 60 * 60 * 1000;
		const d1 = 24 * 60 * 60 * 1000;
		const w1 = 7 * 24 * 60 * 60 * 1000;

		const w = Math.floor(ms / w1);
		const d = Math.floor((ms % w1) / d1);
		const h = Math.floor((ms % d1) / h1);
		const m = Math.ceil((ms % h1) / m1);

		const s = (n) => ("" + n).endsWith("1") ? "" : "s";

		let f = [];

		if (w >= 1) {
			f.push(`${w} week${s(w)}`);
		}

		if (d >= 1) {
			f.push(`${d} day${s(d)}`);
		}

		if (ms < w1 && h >= 1) {
			f.push(`${h} hour${s(h)}`);
		}

		if (ms < 6 * h1 && m >= 1) {
			f.push(`${m} minute${s(m)}`);
		}

		return f.join(" ");
	}

	// Test in Node
	/*
	console.log(fTimeLeft(1000));
	console.log(fTimeLeft(2 * 60 * 1000));
	console.log(fTimeLeft(51 * 60 * 1000));
	console.log(fTimeLeft(59 * 60 * 1000));
	console.log();

	console.log(fTimeLeft(1 * 60 * 60 * 1000));
	console.log(fTimeLeft(1.5 * 60 * 60 * 1000));
	console.log(fTimeLeft(1 * 60 * 60 * 1000 + 1 * 60 * 1000));
	console.log(fTimeLeft(1 * 60 * 60 * 1000 + 21 * 60 * 1000));
	console.log();

	console.log(fTimeLeft(5 * 60 * 60 * 1000));
	console.log(fTimeLeft(5 * 60 * 60 * 1000 + 21 * 60 * 1000));
	console.log(fTimeLeft(24 * 60 * 60 * 1000));
	console.log();

	console.log(fTimeLeft(24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000));
	console.log(fTimeLeft(7 * 24 * 60 * 60 * 1000));
	console.log();
	
	console.log(fTimeLeft(7 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000));
	console.log(fTimeLeft(7 * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000));
	console.log();

	console.log(fTimeLeft(2 * 7 * 24 * 60 * 60 * 1000));
	console.log(fTimeLeft(2.5 * 7 * 24 * 60 * 60 * 1000));
	console.log();
	*/

	function fPlace (n) {
		if (n <= 3) {
			return ["🥇", "🥈", "🥉"][n - 1];
		} else {
			return `<span class="userscript-guild-xph" style="color: var(--color-disabled);">#${n}</span>`;
		}
	}

	// Hardcoded, because unzipping the initClientData is a pain
	const levelExperienceTable = [
		0, 33, 76, 132, 202, 286, 386, 503, 637, 791,
		964, 1159, 1377, 1620, 1891, 2192, 2525, 2893, 3300, 3750,
		4247, 4795, 5400, 6068, 6805, 7618, 8517, 9508, 10604, 11814,
		13151, 14629, 16262, 18068, 20064, 22271, 24712, 27411, 30396, 33697,
		37346, 41381, 45842, 50773, 56222, 62243, 68895, 76242, 84355, 93311,
		103195, 114100, 126127, 139390, 154009, 170118, 187863, 207403, 228914, 252584,
		278623, 307256, 338731, 373318, 411311, 453030, 498824, 549074, 604193, 664632,
		730881, 803472, 882985, 970050, 1065351, 1169633, 1283701, 1408433, 1544780, 1693774,
		1856536, 2034279, 2228321, 2440088, 2671127, 2923113, 3197861, 3497335, 3823663, 4179145,
		4566274, 4987741, 5446463, 5945587, 6488521, 7078945, 7720834, 8418485, 9176537, 10000000,
		11404976, 12904567, 14514400, 16242080, 18095702, 20083886, 22215808, 24501230, 26950540, 29574787,
		32385721, 35395838, 38618420, 42067584, 45758332, 49706603, 53929328, 58444489, 63271179, 68429670,
		73941479, 79829440, 86117783, 92832214, 100000000, 114406130, 130118394, 147319656, 166147618, 186752428,
		209297771, 233962072, 260939787, 290442814, 322702028, 357968938, 396517495, 438646053, 484679494, 534971538,
		589907252, 649905763, 715423218, 786955977, 865044093, 950275074, 1043287971, 1144777804, 1255500373, 1376277458,
		1508002470, 1651646566, 1808265285, 1979005730, 2165114358, 2367945418, 2588970089, 2829786381, 3092129857, 3377885250,
		3689099031, 4027993033, 4396979184, 4798675471, 5235923207, 5711805728, 6229668624, 6793141628, 7406162301, 8073001662,
		8798291902, 9587056372, 10444742007, 11377254401, 12390995728, 13492905745, 14690506120, 15991948361, 17406065609, 18942428633,
		20611406335, 22424231139, 24393069640, 26531098945, 28852589138, 31372992363, 34109039054, 37078841860, 40302007875, 43799759843,
		47595067021, 51712786465, 56179815564, 61025256696, 66280594953, 71979889960, 78159982881, 84860719814, 92125192822, 100000000000,
	];

	async function onOverviewClick () {
		//console.log("onOverviewClick");

		await waitFor(".GuildPanel_dataGrid__11Jpe");

		let guildsXP = GM_getValue("guildsXP", {});
		debugValue("guildsXP", guildsXP);

		const stats = calcIndividualStats(guildsXP[ownGuildName]);
		debugValue("stats", stats)

		const template = `
			<div class="GuildPanel_dataBlockGroup__1d2rR userscript-guild-xph">
				<div class="GuildPanel_dataBlock__3qVhK">
					<div class="GuildPanel_label__-A63g">${stats.lastHourXPH > 0 ? "Last hour XP/h" : "Last XP/h"}</div>
					<div class="GuildPanel_value__Hm2I9">${f(stats.lastHourXPH > 0 ? stats.lastHourXPH : stats.lastHourXPH)}</div>
				</div>
				<div class="GuildPanel_dataBlock__3qVhK">
					<div class="GuildPanel_label__-A63g">Last day XP/h</div>
					<div class="GuildPanel_value__Hm2I9">${f(stats.lastDayXPH)}</div>
				</div>
			</div>
			<div class="GuildPanel_dataBlockGroup__1d2rR userscript-guild-xph">
				<div class="GuildPanel_dataBlock__3qVhK">
					<div class="GuildPanel_label__-A63g">Min XP/h</div>
					<div class="GuildPanel_value__Hm2I9">${f(stats.minXPH)}</div>
				</div>
				<div class="GuildPanel_dataBlock__3qVhK">
					<div class="GuildPanel_label__-A63g">Max XP/h</div>
					<div class="GuildPanel_value__Hm2I9">${f(stats.maxXPH)}</div>
				</div>
			</div>
			<div class="GuildPanel_dataBlockGroup__1d2rR userscript-guild-xph" style="grid-column: 1 / 3; max-width: none;">
				<div class="GuildPanel_dataBlock__3qVhK" style="height: 240px;">
					<div class="GuildPanel_label__-A63g">Last week XP/h</div>
					${guildXPChart(stats.chart)}
				</div>
			</div>
		`;

		const dataGridEl = document.querySelector(".GuildPanel_dataGrid__11Jpe");
		dataGridEl.querySelectorAll(".userscript-guild-xph").forEach((el) => el.remove());
		dataGridEl.insertAdjacentHTML("beforeend", template);
		dataGridEl.querySelectorAll(".userscript-guild-xph__bar").forEach((el) => {
			el.onmouseenter = onBarEnter;
			el.onmouseleave = onBarLeave;
		});

		const currentXp = guildsXP[ownGuildName][guildsXP[ownGuildName].length - 1].xp;

		const nextLvlIndex = levelExperienceTable.findIndex((xp) => currentXp <= xp);
		const xpTillLvl = levelExperienceTable[nextLvlIndex] - currentXp;
		const h1 = 60 * 60 * 1000;
		const msTillLvl = xpTillLvl / stats.lastDayXPH * h1;

		const template2 = `
			<div class="userscript-guild-xph" style="color: var(--color-space-300);">${fTimeLeft(msTillLvl)}</div>
		`;

		const expToLvlEl = dataGridEl.querySelector(".GuildPanel_dataBlockGroup__1d2rR:nth-child(2) .GuildPanel_dataBlock__3qVhK:nth-child(1)");
		expToLvlEl.querySelector(".userscript-guild-xph")?.remove();
		expToLvlEl.insertAdjacentHTML("beforeend", template2);


		const template3 = `
			<span class="userscript-guild-xph" style="color: var(--color-disabled);font-size: 14px;font-weight: 400;">${"making cheese since " +  (new Date(guildCreatedAt)).toLocaleDateString()}</span>
		`;

		const guildNameEl = document.querySelector(".GuildPanel_guildName__E5D_h");
		guildNameEl.querySelector(".userscript-guild-xph")?.remove();
		guildNameEl.insertAdjacentHTML("beforeend", template3);

	}


	function sortIcon ({ direction = "none" } = {}) {
		return `
			<span class="userscript-guild-xph userscript-guild-xph__sort-icon" style="display: inline-flex; flex-direction: column; vertical-align: middle">
				<span style="font-size: 8px; line-height: 8px;">${direction == "asc" ? "▲" : "△"}</span>
				<span style="font-size: 8px; line-height: 8px;">${direction == "desc" ? "▼" : "▽"}</span>
			</span>
		`;
	}

	let membersSort = "natural";
	function onMembersSort () {
		const el = event.target;
		const column = el.dataset.column;

		membersSort = column;
	}

	async function onMembersClick () {
		//console.log("onMembersClick");

		await waitFor(".GuildPanel_membersTable__1NwIX");

		const containerEl = document.querySelector(".GuildPanel_membersTab__2ax4-");

		if (containerEl.querySelector(".userscript-guild-xph")) {
			return; // Already modded
		}

		// Make table wider
		containerEl.style.maxWidth = "1100px";

		let membersXP = GM_getValue("membersXP_"+ownGuildID, {});
		debugValue("membersXP", membersXP);

		const tableEl = document.querySelector(".GuildPanel_membersTable__1NwIX");

		let allStats = [];
		const tbodyEl = tableEl.querySelector("tbody");
		Array.from(tbodyEl.children).forEach((trEl, i) => {
			const name = trEl.children[0].textContent;
			const id = nameToId[name];
			const stats = calcIndividualStats(membersXP[id]);
			stats.i = i;
			stats.xp = membersXP[id][membersXP[id].length - 1].xp;
			stats.gameMode = nameToGameMode[name];
			stats.joinTime = nameToJoinTime[name];
			stats.invitedBy = nameToInvitedBy[name];
			//stats.name = name;
			allStats.push(stats);
		});

		allStats.slice(0).sort((a, b) => b.lastXPH - a.lastXPH).forEach((stats, i) => stats.lastXPH_N = i + 1);
		allStats.slice(0).sort((a, b) => b.lastDayXPH - a.lastDayXPH).forEach((stats, i) => stats.lastDayXPH_N = i + 1);

		const theadTrEl = tableEl.querySelector("thead tr");

		// Name - sort in natural order
		makeColumnSortable(theadTrEl.children[0], {
			defaultSortId: "index",
			sortId: "index",
			data: allStats.map((s) => s.i),
		});

		// Role - sort in natural order
		makeColumnSortable(theadTrEl.children[1], {
			sortId: "index",
			sortGetter: dataValueColumnValueGetter.bind(null, 0),
			showIcon: false,
		});

		// Guild Exp
		makeColumnSortable(theadTrEl.children[2], {
			sortId: "xp",
			data: allStats.map((s) => s.xp),
		});

		// Game Mode
		addColumn(tableEl, {
			insertBefore: Array.from(theadTrEl.children).findIndex((el) => el.textContent == "Activity"),
			name: "Game Mode",
			data: allStats.map((d) => d.gameMode),
			format: (d, i) => {
				const modes = {
					"standard": "MC",
					"ironcow": "IC",
					"legacy_ironcow": "LC",
				};
				return modes[d];
			},
			makeSortable: true,
			sortId: "gameMode",
		});

		// Joined
		addColumn(tableEl, {
			insertBefore: Array.from(theadTrEl.children).findIndex((el) => el.textContent == "Activity"),
			name: "Joined",
			data: allStats.map((d) => d.joinTime),
			sortData: allStats.map((d) => +(new Date(d.joinTime))),
			format: (d, i) => {
				return (new Date(d)).toLocaleDateString();
			},
			makeSortable: true,
			sortId: "joinTime",
		});

		// Invited by
		addColumn(tableEl, {
			insertBefore: Array.from(theadTrEl.children).findIndex((el) => el.textContent == "Activity"),
			name: "Invited by",
			data: allStats.map((d) => d.invitedBy),
			makeSortable: true,
			sortId: "invitedBy",
		});

		// Last XP + #
		addColumn(tableEl, {
			insertBefore: Array.from(theadTrEl.children).findIndex((el) => el.textContent == "Activity"),
			name: "Last XP/h",
			data: allStats.map((d) => d.lastXPH),
			format: (d, i) => {
				if (d == 0) {
					return ""
				}
				let n = allStats[i].lastXPH_N;
				return f(d) + " " + fPlace(n);
			},
			makeSortable: true,
			sortId: "last",
		});

		// Last day XP + #
		addColumn(tableEl, {
			insertBefore: Array.from(theadTrEl.children).findIndex((el) => el.textContent == "Activity"),
			name: "Last day XP/h",
			data: allStats.map((d) => d.lastDayXPH),
			format: (d, i) => {
				if (d == 0) {
					return ""
				}
				let n = allStats[i].lastDayXPH_N;
				return f(d) + " " + fPlace(n);
			},
			makeSortable: true,
			sortId: "day",
		});

		// Activity
		const activities = [
			"idle",
			"milking",
			"foraging",
			"woodcutting",
			"cheesesmithing",
			"crafting",
			"tailoring",
			"cooking",
			"brewing",
			"alchemy",
			"enhancing",
			"combat",
		];

		const activityIndex = Array.from(theadTrEl.children).findIndex((el) => el.textContent == "Activity");
		const activityData = Array.from(tableEl.querySelector("tbody").children).map((trEl) => {
			const columnIndex = activityIndex;
			const activity =  trEl.children[activityIndex].querySelector("use")?.getAttribute("href")?.split("#")?.[1];
			if (activity) {
				return activities.indexOf(activity);
			} else if (trEl.children[columnIndex].textContent == "") {
				return activities.indexOf("idle");
			} else {
				// Parse "23d ago", use as a negative value when sorting
				return -(parseInt(trEl.children[columnIndex].textContent));
			}
		});

		makeColumnSortable(Array.from(theadTrEl.children).find((el) => el.textContent == "Activity"), {
			sortId: "activity",
			showIcon: true,
			sortData: activityData,
		});

		// Status
		const statuses = [
			"Offline",
			"Hidden",
			"Online",
		];

		const statusIndex = Array.from(theadTrEl.children).findIndex((el) => el.textContent == "Status");
		const statusData = Array.from(tableEl.querySelector("tbody").children).map((trEl) => {
			const columnIndex = statusIndex;
			return statuses.indexOf(trEl.children[columnIndex].textContent);
		});

		makeColumnSortable(Array.from(theadTrEl.children).find((el) => el.textContent == "Status"), {
			sortId: "status",
			showIcon: true,
			sortData: statusData,
		});
	}

	async function onGuildClick () {
		await waitFor(".GuildPanel_tabsComponentContainer__1JjQu");

		const overviewTabEl = document.querySelector(".GuildPanel_tabsComponentContainer__1JjQu .MuiButtonBase-root:nth-child(1)");
		overviewTabEl.onclick = onOverviewClick;

		const membersTabEl = document.querySelector(".GuildPanel_tabsComponentContainer__1JjQu .MuiButtonBase-root:nth-child(2)");
		membersTabEl.onclick = onMembersClick;

		onOverviewClick();
	}

	async function onLeaderboardClick () {
		await waitFor(".LeaderboardPanel_leaderboardTable__3JLvu");

		const containerEl = document.querySelector(".LeaderboardPanel_content__p_WNw");

		if (containerEl.querySelector(".userscript-guild-xph")) {
			return; // Already modded
		}

		// Make table wider
		containerEl.style.maxWidth = "1000px";

		let guildsXP = GM_getValue("guildsXP", {});
		debugValue("guildsXP", guildsXP);

		const tableEl = document.querySelector(".LeaderboardPanel_leaderboardTable__3JLvu");

		let allStatsObj = {};
		const tbodyEl = tableEl.querySelector("tbody");
		Array.from(tbodyEl.children).forEach((trEl, i) => {
			const name = trEl.children[1].textContent;
			const stats = calcIndividualStats(guildsXP[name]);
			stats.rank = i + 1;
			allStatsObj[name] = stats;
		});

		Object.values(allStatsObj).sort((a, b) => b.lastXPH - a.lastXPH).forEach((stats, i) => stats.lastXPH_N = i + 1);
		Object.values(allStatsObj).sort((a, b) => b.lastDayXPH - a.lastDayXPH).forEach((stats, i) => stats.lastDayXPH_N = i + 1);

		let allStats = [];
		Array.from(tbodyEl.children).forEach((trEl, i) => {
			const name = trEl.children[1].textContent;
			allStats.push(allStatsObj[name]);
		});

		const theadTrEl = tableEl.querySelector("thead tr");

		// Rank
		makeColumnSortable(Array.from(theadTrEl.children).find((el) => el.textContent == "Rank"), {
			defaultSortId: "rank",
			sortId: "rank",
			showIcon: true,
			skipFirst: true,
			sortGetter: numberColumnValueGetter.bind(null, 0),
		});

		// Skip Name

		// Level - sort by rank
		makeColumnSortable(Array.from(theadTrEl.children).find((el) => el.textContent == "Level"), {
			sortId: "rank",
			showIcon: false,
			skipFirst: true,
			sortGetter: numberColumnValueGetter.bind(null, 0), // Sort by rank
		});

		// Experience - sort by rank
		makeColumnSortable(Array.from(theadTrEl.children).find((el) => el.textContent == "Experience"), {
			sortId: "rank",
			showIcon: false,
			skipFirst: true,
			sortGetter: numberColumnValueGetter.bind(null, 0), // Sort by rank
		});

		// Last XP + #
		addColumn(tableEl, {
			name: "Last XP/h",
			data: allStats.map((d) => d.lastXPH),
			format: (d, i) => {
				if (d == 0) {
					return ""
				}
				let n = allStats[i].lastXPH_N;
				return f(d) + " " + fPlace(n);
			},
			makeSortable: true,
			skipFirst: true,
			sortId: "last",
		});

		// Last day XP + #
		addColumn(tableEl, {
			name: "Last day XP/h",
			data: allStats.map((d) => d.lastDayXPH),
			format: (d, i) => {
				if (d == 0) {
					return ""
				}
				let n = allStats[i].lastDayXPH_N;
				return f(d) + " " + fPlace(n);
			},
			makeSortable: true,
			sortId: "day",
			skipFirst: true,
		});
	}

	async function onSettingsClick () {
		await waitFor(".SettingsPanel_tabsComponentContainer__Xb_5H");

		const profileTabEl = document.querySelector(".SettingsPanel_tabsComponentContainer__Xb_5H .MuiButtonBase-root:nth-child(1)");
		profileTabEl.onclick = onSettingsClick;

		const profileEl = document.querySelector(".SettingsPanel_profileTab__214Bj");

		const template = `
			<div class="SettingsPanel_infoGrid__2nh1u userscript-guild-xph">
				<h3 style="grid-column: 1 / 3; margin-top: 40px;">Guild XP/h userscript settings:</h3>

				<div class="SettingsPanel_label__24LRD">Export to file:</div>
				<div class="SettingsPanel_value__2nsKD">
					<button class="Button_button__1Fe9z userscript-guild-xph__export">Export</button>
				</div>

				<div class="SettingsPanel_label__24LRD">Import from file:</div>
				<div class="SettingsPanel_value__2nsKD">
					<button class="Button_button__1Fe9z userscript-guild-xph__import">Import</button>
				</div>

				<div class="SettingsPanel_label__24LRD">Delete ALL data:</div>
				<div class="SettingsPanel_value__2nsKD">
					<button class="Button_button__1Fe9z userscript-guild-xph__reset">Delete</button>
				</div>
			</div>
		`;

		profileEl.querySelector(".userscript-guild-xph")?.remove();
		profileEl.insertAdjacentHTML("beforeend", template);

		profileEl.querySelector(".userscript-guild-xph .userscript-guild-xph__export").onclick = exportData;
		profileEl.querySelector(".userscript-guild-xph .userscript-guild-xph__import").onclick = importData;
		profileEl.querySelector(".userscript-guild-xph .userscript-guild-xph__reset").onclick = reset;
	}

	let ownGuildName;
	let ownGuildID;
	let nameToId = {};
	let nameToGameMode = {};
	let nameToJoinTime = {};
	let nameToInvitedBy = {};
	let guildCreatedAt;

	const o7 = {
		85899: "h0tc0wture o7",
		//83620: "?", // Invited vaivars, not froeggy/anura
		83470: "SlimeBD o7",
		114747: "Tickles o7",
		101996: "Trafalet o7",
	};

	let characterName;
	function handle (message) {
		if (message.type == "init_character_data") {
			characterName = message.character.name;
		}

		if (message.type == "guild_updated" || message.type == "init_character_data") {
			//console.log(message);

			let t = Date.now();

			let guildsXP = GM_getValue("guildsXP", {});

			const name = message.guild.name;
			const xp = message.guild.experience;
			guildCreatedAt = message.guild.createdAt;

			ownGuildName = name;

			if (!guildsXP[name]) {
				guildsXP[name] = [];
			}

			const d = { t, xp };
			pushXP(guildsXP[name], d);

			GM_setValue("guildsXP", guildsXP);
		}

		// Intentionally not if/else, cause of "init_character_data"
		if (message.type == "guild_characters_updated" || message.type == "init_character_data") {
			//console.log(message);

			let t = Date.now();

			const guildID = Object.values(message.guildCharacterMap)[0].guildID;

			ownGuildID = guildID;

			Object.entries(message.guildSharableCharacterMap).forEach(([characterID, d]) => {
				nameToId[d.name] = characterID;
				nameToGameMode[d.name] = d.gameMode;
				nameToJoinTime[d.name] = message.guildCharacterMap[characterID].joinTime;
				const inviterCharacterID = message.guildCharacterMap[characterID].inviterCharacterID;
				nameToInvitedBy[d.name] =  message.guildSharableCharacterMap[inviterCharacterID]?.name ?? o7[inviterCharacterID] ?? ("#" + inviterCharacterID + " o7");
			});

			let membersXP = GM_getValue("membersXP_"+guildID, {});

			Object.values(message.guildCharacterMap).forEach((c) => {
				const id = c.characterID;
				const xp = c.guildExperience;

				if (!membersXP[id]) {
					membersXP[id] = [];
				}

				const d = { t, xp };
				pushXP(membersXP[id], d);
			});

			GM_setValue("membersXP_"+guildID, membersXP);
		}

		if (message.type == "guild_updated") {
			onGuildClick();
		}

		if (message.type == "leaderboard_updated" && message.leaderboardCategory == "guild") {
			//console.log(message);

			const t = Date.now();

			let guildsXP = GM_getValue("guildsXP", {});

			message.leaderboard.rows.forEach((r) => {
				const name = r.name;
				const xp = r.value2;

				if (!guildsXP[name]) {
					guildsXP[name] = [];
				}

				const d = { t, xp };
				pushXP(guildsXP[name], d);
			});

			GM_setValue("guildsXP", guildsXP);

			onLeaderboardClick();
		}
	}

	/*
		Wrap WebSocket to set own listener
		Use unsafeWindow + run-at document-start to do that before MWI calls the WebSocket constuctor
	*/
	const OriginalWebSocket = unsafeWindow.WebSocket;
	let ws;
	function listener (e) {
		const message = JSON.parse(e.data);
		handle(message);
	}
	const WrappedWebSocket = function (...args) {
		ws = new OriginalWebSocket(...args)
		ws.addEventListener("message", listener);
		return ws;
	};

	// Used in .performConnectionHealthCheck() and .sendHealthCheckPing() in the MWI
	WrappedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
	WrappedWebSocket.OPEN = OriginalWebSocket.OPEN;
	WrappedWebSocket.CLOSED = OriginalWebSocket.CLOSED;

	unsafeWindow.WebSocket = WrappedWebSocket;

	console.log("Guild XP/h: Wrapped window.WebSocket");
	console.log("Guild XP/h: Set window.guildXPUserscriptDebug = true; - to see debug logging");

	//cleanData();

	(async function () {
		const settingsEl = await waitFor(`.NavigationBar_navigationLink__3eAHA:has(svg[aria-label="navigationBar.settings"])`);
		settingsEl.addEventListener("click", onSettingsClick);
	})();


})();

