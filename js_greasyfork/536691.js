// ==UserScript==
// @name        Bazaar Directory - WTF is in there?
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/page.php*
// @grant       GM_xmlhttpRequest
// @version     1.0.1
// @author      Titanic_
// @license     MIT
// @description The new bazaar directory feature doesn't tell you anything about what is in each bazaar. This replaces the (largely) useless counter showing how many favorites a bazaar has with a button to show their bazaar's contents instead.
// @downloadURL https://update.greasyfork.org/scripts/536691/Bazaar%20Directory%20-%20WTF%20is%20in%20there.user.js
// @updateURL https://update.greasyfork.org/scripts/536691/Bazaar%20Directory%20-%20WTF%20is%20in%20there.meta.js
// ==/UserScript==

let userApiKey = getData("API_KEY") || "";

const bazaarIconSVG = `<svg class="bazaar-icon" style="scale: 0.75;"></svg>`;
window.MyCustomBazaarInterval = null;

async function fetchApi(endpoint, selections = "basic", apiKeyToUse = userApiKey) {
	if (!apiKeyToUse) {
		console.warn("API Key not set. Cannot fetch API.");
		return Promise.resolve({ error: { code: 0, error: "API Key not set" } });
	}

	return new Promise((resolve) => {
		GM_xmlhttpRequest({
			method: "GET",
			url: `https://api.torn.com/${endpoint}?key=${apiKeyToUse}&selections=${selections}`,
			timeout: 15000,
			onload: function (response) {
				let parsedJson;
				try {
					parsedJson = JSON.parse(response.responseText);
				} catch (e) {
					console.error(`Error parsing JSON response:`, e, "Response:", response.responseText);
					resolve({ error: { error: "JSON Parse Error", details: e.message, responseText: response.responseText } });
					return;
				}

				if (parsedJson?.error) {
					const errorMessage = parsedJson.error.error || JSON.stringify(parsedJson.error);
					if (parsedJson.error.error !== "API Key not set") console.error(`API Error (Status: ${response.status}): ${errorMessage}`);
					resolve(parsedJson);
					return;
				}

				if (response.status >= 200 && response.status < 300) resolve(parsedJson);
				else {
					console.error(`HTTP Error ${response.status}: Non-success status without specific API error in JSON.`, "Response:", response.responseText);
					resolve({
						error: {
							error: `HTTP Error ${response.status}`,
							details: "Server returned non-2xx status without a Torn API error object in JSON.",
							responseText: response.responseText,
						},
					});
				}
			},
			onerror: function (response) {
				console.error("Network Error:", response.statusText || "Unknown network issue", response);
				resolve({ error: { error: "Network Error", details: response.statusText || "Unknown network issue" } });
			},
			ontimeout: function () {
				console.error("Request Timeout");
				resolve({ error: { error: "Request Timeout" } });
			},
		});
	});
}

function checkUrl() {
	if (!window.location.href.includes("page.php?sid=bazaar")) {
		if (window.MyCustomBazaarInterval) {
			clearInterval(window.MyCustomBazaarInterval);
			window.MyCustomBazaarInterval = null;
		}
		return;
	}

	addBazaarIcons();
}

function addBazaarIcons() {
	document.querySelectorAll("li[class^=bazaarWrap]").forEach((row) => {
		const linkEl = row.querySelector("a[href*='bazaar.php']");
		if (!linkEl) return;

		const statsWrap = linkEl.querySelector("div[class^=statsWrap]");
		if (statsWrap) statsWrap.remove();

		if (!linkEl.querySelector(".bazaar-icon-container")) {
			const bazaarIcon = Object.assign(document.createElement("div"), {
				className: "bazaar-icon-container",
				innerHTML: bazaarIconSVG,
				style: "cursor: pointer; float: right; padding-left: 8px;",
			});

			linkEl.append(bazaarIcon);

			if (!bazaarIcon.dataset.listenerAttached) {
				bazaarIcon.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();
					toggleExpand(row);
				});
				bazaarIcon.dataset.listenerAttached = "true";
			}
		}
	});
}

function toggleExpand(row) {
	const existingDetailsDiv = row.querySelector(".expanded-bazaar-details");

	document.querySelectorAll(".expanded-bazaar-details").forEach((div) => {
		if (div.parentElement !== row) div.style.display = "none";
	});

	if (existingDetailsDiv) existingDetailsDiv.style.display = existingDetailsDiv.style.display === "none" ? "block" : "none";
	else {
		const detailsDiv = Object.assign(document.createElement("div"), {
			className: "expanded-bazaar-details",
			style: "",
		});

		const filterInput = Object.assign(document.createElement("input"), {
			type: "text",
			placeholder: "Filter item name",
			style: "width: calc(100% + 10px); text-align: center; background-color: #333333; color: #e0e0e0 !important; border: 1px outset #4f4f4f; padding: 3px;",
		});
		filterInput.addEventListener("input", () => {
			filterTable(table, filterInput.value);
		});
		detailsDiv.appendChild(filterInput);

		const table = Object.assign(document.createElement("table"), {
			style: "width: 100%; border-collapse: collapse; background-color: #383838;",
		});

		const headerRow = table.createTHead().insertRow();
		const columnHeaders = ["Name", "#", "$"];
		columnHeaders.forEach((header) => {
			headerRow.appendChild(
				Object.assign(document.createElement("th"), {
					textContent: header,
					style: `border: 1px solid #4F4F4F; padding: 5px; text-align: ${header == "Name" ? "left" : "right"}; background-color: #454545; color: #e0e0e0;`,
				})
			);
		});

		const placeholderCell = table.createTBody().insertRow().insertCell();
		Object.assign(placeholderCell, {
			colSpan: columnHeaders.length,
			textContent: "Details will be loaded here.",
			style: "text-align: center; padding: 3px; font-style: italic; color: #a0a0a0; border: 1px solid #4F4F4F;",
		});

		detailsDiv.appendChild(table);
		row.appendChild(detailsDiv);
		detailsDiv.style.display = "block";

		populateBazaar(row, table);
	}
}

function filterTable(table, searchText) {
	Array.from(table.querySelector("tbody").querySelectorAll("tr")).forEach((row) => {
		const nameCell = row.querySelector("td:first-child");
		if (nameCell) {
			const name = nameCell.textContent.toLowerCase();
			if (name.includes(searchText.toLowerCase())) row.style.display = "";
			else row.style.display = "none";
		}
	});
}

async function populateBazaar(row, table) {
	const url = row.querySelector("a[href*='bazaar.php']").href;
	const userID = new URL(url).searchParams.get("userId");
	const data = await fetchApi(`user/${userID}`, "bazaar");

	const tbody = table.querySelector("tbody");
	tbody.innerHTML = "";

	if (data.error) {
		const errorRow = tbody.insertRow();
		const errorCell = errorRow.insertCell();
		errorCell.colSpan = 3;
		errorCell.style = "text-align: center; padding: 10px; font-style: italic; color: #a0a0a0; border: 1px solid #4F4F4F;";

		if (data.error.error === "API Key not set") {
			const setKeyLink = Object.assign(document.createElement("a"), {
				href: "#",
				textContent: "Click to set Public API",
				style: "color: #88C9F2; cursor: pointer;",
			});

			setKeyLink.onclick = async (e) => {
				e.preventDefault();
				const newApiKeyInput = prompt("Please enter your Torn API (Public) key:");
				if (newApiKeyInput) {
					const trimmedKey = newApiKeyInput.trim();
					if (trimmedKey !== "") {
						setData("API_KEY", trimmedKey);
						userApiKey = trimmedKey;

						tbody.innerHTML = "";
						const loadingRow = tbody.insertRow();
						const loadingCell = loadingRow.insertCell();
						loadingCell.colSpan = 3;
						loadingCell.textContent = "Reloading bazaar data...";
						loadingCell.style = "text-align: center; padding: 10px; font-style: italic; color: #a0a0a0; border: 1px solid #4F4F4F;";

						await populateBazaar(row, table);
					} else {
						alert("API Key cannot be empty.");
					}
				}
			};
			errorCell.innerHTML = "";
			errorCell.appendChild(setKeyLink);
		} else errorCell.textContent = `Error loading bazaar: ${data.error.error}`;
		return;
	}

	if (!data.bazaar || data.bazaar.length === 0) {
		const noItemsRow = tbody.insertRow();
		const noItemsCell = noItemsRow.insertCell();
		noItemsCell.colSpan = 3;
		noItemsCell.textContent = "No items available in this bazaar.";
		noItemsCell.style = "text-align: center; padding: 10px; font-style: italic; color: #a0a0a0; border: 1px solid #4F4F4F;";
		return;
	}

	const items = data.bazaar.map((item) => ({
		name: item.name,
		amount: item.quantity,
		price: item.price,
	}));

	const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));

	for (const item of sortedItems) {
		const itemRow = tbody.insertRow();

		itemRow.appendChild(
			Object.assign(document.createElement("td"), {
				textContent: item.name,
				style:
					"border: 1px solid #4F4F4F; padding: 5px; color: #E0E0E0 !important; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;",
			})
		);

		itemRow.appendChild(
			Object.assign(document.createElement("td"), {
				textContent: item.amount.toLocaleString(),
				style: "border: 1px solid #4F4F4F; padding: 5px; color: #E0E0E0 !important; text-align: right;",
			})
		);

		itemRow.appendChild(
			Object.assign(document.createElement("td"), {
				textContent: "$" + item.price.toLocaleString(),
				style: "border: 1px solid #4F4F4F; padding: 5px; color: #E0E0E0 !important; text-align: right;",
			})
		);
	}

	const filterInput = row.querySelector('.expanded-bazaar-details > input[type="text"]');
	if (filterInput) {
		filterTable(table, filterInput.value);
	}
}

function getData(key) {
	return localStorage.getItem(key);
}

function setData(key, value) {
	localStorage.setItem(key, value);
}

function addStyle(css) {
	const styleEl = Object.assign(document.createElement("style"), { type: "text/css" });
	styleEl.appendChild(document.createTextNode(css));
	document.head.appendChild(styleEl);
}

if (window.MyCustomBazaarInterval) clearInterval(window.MyCustomBazaarInterval);
window.MyCustomBazaarInterval = setInterval(checkUrl, 1000);
checkUrl();

addStyle(`
    .bazaarWrap___XXYgz {
        flex-direction: column;
        height: fit-content !important;
    }
    .expanded-bazaar-details {
        display: block;
        max-width: 100%;
        width: 100%;
        max-height: 200px;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #383838;
        border-top: 1px solid #222222;
        clear: both; color: #cccccc;
        padding-right: 10px;
    }
`);
