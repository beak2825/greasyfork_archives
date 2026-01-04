// ==UserScript==
// @name         NS Watcher Spies
// @namespace    m0tch.nsWatcherSpies
// @version      0.3
// @description  Show tornstats spies on ns-watcher
// @match        https://whackamole.thatastronautguy.space/factionmembers
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=herokuapp.com
// @grant        GM_xmlhttpRequest
// @author       m0tch
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450644/NS%20Watcher%20Spies.user.js
// @updateURL https://update.greasyfork.org/scripts/450644/NS%20Watcher%20Spies.meta.js
// ==/UserScript==


let bsCache = JSONparse(localStorage["m0tch.bs"]) || {};
let highlightFrom = parseInt(localStorage.getItem("m0tch.from")) || undefined;
let highlightTo = parseInt(localStorage.getItem("m0tch.to")) || undefined;

const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

function getApiKey() {
    // if an API key is provided, use that, otherwise fall back on key provided to site in cookie.
    if (localStorage["m0tch.apikey"]){
        return localStorage["m0tch.apikey"];
    }
    return getCookieValue("apikey");
}

function JSONparse(str) {
	try {
		return JSON.parse(str);
	} catch (e) {}
	return null;
}

/*
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 420
{"status":false,"message":"Something wrong with the API Call. Error code: Your key is currently timed out. Please wait a few minutes before trying again."}
*/

function checkApiKey(key, cb) {
	GM_xmlhttpRequest({
		method: "GET",
		url: `https://www.tornstats.com/api/v1/${key}`,
		onload: (r) => {
			if (r.status == 429){
				cb("Couldn't check (rate limit)");
				return;
			}
			if (r.status != 200){
				cb(`Couldn't check (status code ${r.status})`);
				return;
			}

			let j = JSONparse(r.responseText);
			if (!j){
				cb("Couldn't check (unexpected response)");
				return;
			}

			if (!j.status) {
				cb(j.message || "Wrong API key?");
			}
			else {
				localStorage["m0tch.apikey"] = key;
				cb(true);
			}
		},
		onabort: () => cb("Couldn't check (aborted)"),
		onerror: () => cb("Couldn't check (error)"),
		ontimeout: () => cb("Couldn't check (timeout)")
	})
}
let loadTSFactionLock = false;
let loadTSFactionBacklog = [];
let loadTSFactionDone = [];
function loadTSFactionsDone() {
	loadTSFactionLock = false;
}
function loadTSFactions() {
    let id = getCookieValue("faction_id")
    let apiKey = getApiKey();
	GM_xmlhttpRequest({
		method: "GET",
		url: `https://www.tornstats.com/api/v2/${apiKey}/spy/faction/${id}`,
		onload: (r) => {
			let j = JSONparse(r.responseText);
            if (j.message == "ERROR: User not found."){
                alert("Torn Stats returned " + j.message + " Please set your spies API key to the one you use with Torn Stats.");
            }

			if (!j || !j.status || !j.faction) {
				loadTSFactionsDone();
				return;
			}

			Object.keys(j.faction.members).forEach((k) => addSpy(k, j.faction.members[k].spy));
			localStorage["m0tch.bs"] = JSON.stringify(bsCache);

			loadTSFactionsDone();
            window.location.reload();
		},
		onabort: () => loadTSFactionsDone(),
		onerror: () => loadTSFactionsDone(),
		ontimeout: () => loadTSFactionsDone()
	});
}

let apiKeyCheck = false;
function addAPIKeyInput(node) {
	if (!node) return;

	node.style.position = "relative";

	let apiKeyNode = document.createElement("div");
	apiKeyNode.style.display = "none";
	let apiKeyText = document.createElement("span");
	apiKeyText.innerHTML = "Update your API key: ";
	let apiKeyInput = document.createElement("input");
	let apiKeySave = document.createElement("input");
	apiKeySave.type = "button";
	apiKeySave.value = "Save";
	let apiKeyClose = document.createElement("input");
	apiKeyClose.type = "button";
	apiKeyClose.value = "Close";
	let wipeButton = document.createElement("input");
	wipeButton.type = "button";
	wipeButton.value = "Wipe Stored Key & Reload";
	apiKeyNode.appendChild(apiKeyText);
	apiKeyNode.appendChild(apiKeyInput);
	apiKeyNode.appendChild(apiKeySave);
	apiKeyNode.appendChild(apiKeyClose);
	apiKeyNode.appendChild(wipeButton);

	function checkApiKeyCb(r) {
		if (r === true) {
			apiKeyNode.style.display = "none";
			apiKeyInput.value = "";
			loadTSFactions(getApiKey());
		}
		else {
			apiKeyNode.style.display = "block";
			apiKeyText.innerHTML = `${r}: `;
		}
	}

	apiKeySave.addEventListener("click", () => {
		apiKeyText.innerHTML = "Checking key";
		checkApiKey(apiKeyInput.value, checkApiKeyCb);
	});
	apiKeyClose.addEventListener("click", () => {
		apiKeyNode.style.display = "none";
	});
	wipeButton.addEventListener("click", () => {
		bsCache = {};
		localStorage["m0tch.bs"] = JSON.stringify(bsCache);
        localStorage["m0tch.apikey"] = "";
		apiKeyNode.style.display = "none";
		window.location.reload();
	});

	let apiKeyButton = document.createElement("button");
	apiKeyButton.innerHTML = `
		<span>Update Spies API Key</span>
	`;

	apiKeyButton.addEventListener("click", () => {
		apiKeyText.innerHTML = "Update your API key: ";
		apiKeyNode.style.display = "block";
	});

	node.appendChild(apiKeyButton);
	node.appendChild(apiKeyNode);
}

function addRefreshSpiesButton(node) {
	if (!node) return;

	node.style.position = "relative";

    let refreshSpiesButton = document.createElement("input");
	refreshSpiesButton.type = "button";
	refreshSpiesButton.value = "Refresh Spies";
    refreshSpiesButton.style = "margin-right: 4px;";

	refreshSpiesButton.addEventListener("click", () => {
		bsCache = {};
		loadTSFactions();
	});

	node.appendChild(refreshSpiesButton);
}

function addButtonsDiv(node) {
    if (!node) return;

	node.style.position = "relative";

    let buttonsNode = document.createElement("div");

    addRefreshSpiesButton(buttonsNode);
    addAPIKeyInput(buttonsNode);

    node.after(buttonsNode);
}



function addSpy(id, spy) {
	if (!spy) return;

	bsCache[id] = spy;
}

function updateStats(id, node, parentNode) {
	if (!node) return;

	let stats = ["N/A", "N/A", "N/A", "N/A", "N/A"];
	let time = "";
	if (bsCache[id]) {
		stats[0] = bsCache[id].total;
		stats[1] = bsCache[id].strength;
		stats[2] = bsCache[id].defense;
		stats[3] = bsCache[id].speed;
		stats[4] = bsCache[id].dexterity;

		let difference = (new Date().getTime()/1000) - bsCache[id].timestamp;
		if (difference < 0) {
			delete bsCache[id];
			localStorage["m0tch.bs"] = JSON.stringify(bsCache);
			return;
		}
		if      (difference > (365*24*60*60)) time = Math.floor(difference / (365*24*60*60)) + " years ago";
		else if (difference > ( 30*24*60*60)) time = Math.floor(difference / ( 30*24*60*60)) + " months ago";
		else if (difference > (    24*60*60)) time = Math.floor(difference / (    24*60*60)) + " days ago";
		else if (difference > (       60*60)) time = Math.floor(difference / (       60*60)) + " hours ago";
		else if (difference > (          60)) time = Math.floor(difference / (          60)) + " minutes ago";
		else                                  time = Math.floor(difference)                  + " seconds ago";
	}

	let units = ["K", "M", "B", "T", "Q"]
	for(let i = 0; i < stats.length; i++) {
		let stat = Number.parseInt(stats[i]);
		if (Number.isNaN(stat) || stat == 0) continue;

		for (let j = 0; j < units.length; j++) {
			stat = stat / 1000;
			if (stat > 1000) continue;

			stat = stat.toFixed(i == 0 ? (stat >= 100 ? 0 : 1) : 2);
			stats[i] = `${stat}${units[j]}`;
			break;
		}
	}

	node.innerHTML = stats[0];
	node.title = `STR: ${stats[1]}
DEF: ${stats[2]}
SPD: ${stats[3]}
DEX: ${stats[4]}
${time}`;
}

function showStats(node) {
	if (!node) return;

    let profileLink = node.querySelector('a[href*="XID"]');
    if (!profileLink) {
        //assume that no profile link is the first row, which is the label row
        let headerNode = document.createElement("th");
        headerNode.innerHTML = "Stats";
        node.appendChild(headerNode);
        return;
    }
	let id = node.querySelector('a[href*="XID"]').href.replace(/.*?XID=(\d+)/i, "$1");
	let bsNode = node.querySelector(".bs") || document.createElement("td");

	updateStats(id, bsNode, node);

	if (bsNode.classList.contains("bs")) {
		return;
	}

	node.appendChild(bsNode);
}

function showStatsAll(node) {
	if (!node) node = Array.from(document.querySelectorAll("table"));
	if (!node) return;

	if (!(node instanceof Array)) {
		node = [node];
	}

	node.forEach((n) => n.querySelectorAll("tr").forEach((e) => showStats(e)));
}


showStatsAll();
addButtonsDiv(document.querySelector("form"));