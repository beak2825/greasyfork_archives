// ==UserScript==
// @name         AutoGrind: Intelligent Bing Rewards Auto-Grinder
// @namespace    https://github.com/jeryjs/
// @version      5.3.6
// @description  This user script automatically finds random words from the current search results and searches Bing with them. Additionally, it auto clicks the unclaimed daily points from your rewards dashboard too.
// @icon         https://www.bing.com/favicon.ico
// @author       Jery
// @match        https://www.bing.com/*
// @match        https://rewards.bing.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498482/AutoGrind%3A%20Intelligent%20Bing%20Rewards%20Auto-Grinder.user.js
// @updateURL https://update.greasyfork.org/scripts/498482/AutoGrind%3A%20Intelligent%20Bing%20Rewards%20Auto-Grinder.meta.js
// ==/UserScript==

/*=============================================*\
|*                CONFIGURATION               *|
\*=============================================*/
// Constants
var MAX_SEARCHES = GM_getValue("max-searches", 33); // Maximum number of words to search
var TIMEOUT_RANGE = GM_getValue("timeout-range", [5, 10]);	// Randomize the time to wait between searches
var COOLDOWN_TIMEOUT = GM_getValue("cooldown-timeout", 15); // Cooldown_Timeout between searches
var UNDER_COOLDOWN = GM_getValue("under-cooldown", false);	// Workaround for cooldown restriction
var OPEN_RANDOM_LINKS = GM_getValue("open-random-links", true);	// Simulate real human searcg by opening links
var COLLECT_DAILY_ACTIVITY = GM_getValue("collect-daily-activity", false);	// Automatically collect daily activity points from bingo rewards dashboard page
var AUTO_CLOSE_TABS = GM_getValue("auto-close-tabs", true);	// Automatically close any tabs/windows opened by the script
var OPEN_POINTS_BREAKDOWN = GM_getValue("open-points-breakdown", false);	// Open points breakdown page in a new tab

var TIMEOUT = (Math.floor(Math.random() * (TIMEOUT_RANGE[1] - TIMEOUT_RANGE[0]) * 1000) + TIMEOUT_RANGE[0] * 1000);	// Randomize the timeout with given range

// Configuration options for the user script
const configurations = [
	{
		id: "max-searches",
		name: "Max Searches",
		type: "slider",
		value: MAX_SEARCHES,
		range: [3, 50],
		description: "The maximum number of searches to make.<br>Default: 33",
	},
	{
		id: "timeout-range",
		name: "Random Timeout Range",
		type: "range",
		value: TIMEOUT_RANGE,
		range: [1, 60],
		description: "Randomise the time to wait between searches (in seconds).<br>Example: 5-10 makes the script wait between 5 to 10 seconds before going to next search.<br>Setting it below 5 is not advised as bing limits how often points are awarded searches.<br>Default: 5-10",
	},
	{
		id: "under-cooldown",
		name: "Under Cooldown Workaround",
		type: "checkbox",
		value: UNDER_COOLDOWN,
		description: "Enable this option if you are facing the 15 min cooldown restriction.<br>For some accounts, Bing restricts the points earned to 9-12 points every 15 minutes. Enabling this option makes the script wait 15 mins after every 4 searches..<br>Default: False",
	},
	{
		id: "cooldown-timeout",
		name: "Cooldown Timeout",
		type: "slider",
		value: COOLDOWN_TIMEOUT,
		range: [3, 30],
        disabled: !UNDER_COOLDOWN,
		description: "The Cooldown timeout between every 4th search (in seconds).<br> Under Cooldown must be enabled for this option to become active.<br>Default: 15",
	},
	{
		id: "open-random-links",
		name: "Open Random Links",
		type: "checkbox",
		value: OPEN_RANDOM_LINKS,
		description: "Enable this option to open any random link from the page in an iframe after every search. It has been observed that doing this removes the 15-point restriction after a while / reduces chances of getting the restriction.<br>Default: True",
	},
	{
		id: "collect-daily-activity",
		name: "Daily Activity Points",
		type: "checkbox",
		value: COLLECT_DAILY_ACTIVITY,
		description: "Open rewards page and auto-collect daily activity points from the Bing rewards dashboard page. This option loads the activities into an iframe to earn the points.<br>Default: False",
	},
	{
		id: "auto-close-tabs",
		name: "Auto Close Tabs",
		type: "checkbox",
		value: AUTO_CLOSE_TABS,
		description: "Automatically close any tabs/windows opened by the script. This applies to the search page and any rewards page that were opened as well.<br>Default: True",
	},
	{
		id: "open-points-breakdown",
		name: "Open Points Breakdown",
		type: "checkbox",
		value: OPEN_POINTS_BREAKDOWN,
		description: "Open the points breakdown page in a new tab on completing searches. This is useful to check how many points you have earned so far.<br>Default: False",
	}
];

// Load previous searches from local storage or initialize an empty array
var searches = GM_getValue("searches", []);

// store the list of window handles or urls to close them later
var tabsToClose = GM_getValue("tabsToClose", []);

// Adjust timeout if under cooldown and within search limit
if (UNDER_COOLDOWN && searches.length % 4 == 0 && searches.length <= MAX_SEARCHES - 4) {
	TIMEOUT = COOLDOWN_TIMEOUT * 60000; // mins * 60 secs
}
// Check if the current page is Bing search page
const isSearchPage = window.location.href.startsWith("https://www.bing.com/search");
// Check if the current page is Bing rewards page
const isRewardPage = window.location.href.startsWith("https://rewards.bing.com");
// Check whether current device is a mobile or not
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


/*=============================================*\
|*					MAIN UI					   *|
\*=============================================*/

/**
 * Create a container for the auto-search icon and settings icon.
 * The auto-search icon starts the search process, and the settings icon opens the settings overlay.
 */
const autoSearchContainer = document.createElement("div");
autoSearchContainer.classList.add("auto-search-container");

const searchIcon = document.createElement("div");
searchIcon.classList.add("search-icon");
if(!isRewardPage) searchIcon.innerHTML = `<a style="font-size: 25px">🔍</a><span>Auto-Search</span>`;
searchIcon.title = "Start Auto-Search!!";
searchIcon.addEventListener("click", startSearch);

const settingsIcon = document.createElement("div");
settingsIcon.classList.add("settings-icon");
if(!isRewardPage) settingsIcon.innerHTML = `<a style="font-size: 20px;">⚙️</a><span>Configure</span>`;

autoSearchContainer.appendChild(searchIcon);
autoSearchContainer.appendChild(settingsIcon);

setTimeout(() => {
    if (searchIcon.textContent.includes("Auto-Search")) searchIcon.classList.add("shrink")
}, 3000);


/**
 * Create a settings overlay to configure the user script.
 * The settings overlay contains a list of configuration options that can be adjusted by the user.
 * The settings are stored in the local storage and are used to update the script's behavior.
 */
const settingsOverlay = document.createElement("div");
settingsOverlay.classList.add("settings-overlay");
settingsOverlay.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 1000;`;

const settingsContent = document.createElement("div");
settingsContent.style = `background-color: white; padding: 20px; border-radius: 10px; display: flex; flex-direction: column;`;

configurations.forEach(config => {
	const settingItem = document.createElement("div");
	settingItem.classList.add("settings-item");

	const name = document.createElement("div");
	name.classList.add("settings-item-name");
	name.textContent = config.name;

	const inputContainer = document.createElement("div");
	inputContainer.classList.add("settings-item-input");
	let input;
	if (config.type == "slider") {
		input = document.createElement("input");
		input.type = "range";
		input.min = config.range[0];
		input.max = config.range[1];
		input.value = GM_getValue(config.id, config.value);
		input.disabled = config.disabled;
	} else if (config.type == "range") {
		input = document.createElement("div"); input.classList.add("range-slider");
		input.value = GM_getValue(config.id, config.value);
		input.valueText = input.value.join("-");
		for (let i = 0; i < 2; i++) {
			let rangeInput = document.createElement("input");
			Object.assign(rangeInput, { type: "range", value: config.value[i], min: config.range[0], max: config.range[1], style: `height: 1px;` });
			input.appendChild(rangeInput);
			rangeInput.addEventListener("input", () => {
				if (parseInt(input.children[0].value) > parseInt(input.children[1].value)) input.children[i].value = input.children[1 - i].value; // Ensure min <= max
				input.value = [input.children[0].value, input.children[1].value];
				input.valueText = input.value.join("-");
			});
		}
	} else if (config.type == "checkbox") {
		input = document.createElement("input");
		input.type = "checkbox";
		input.checked = GM_getValue(config.id, config.value);
		input.oninput = () => input.valueText = input.checked ? "Enabled" : "Disabled";
	}
	input.id = config.id;
	input.dispatchEvent(new Event("input"));	// Trigger input event to initialize `input.valueText`

	const currentValue = document.createElement("div");
	currentValue.classList.add("settings-item-value");
	currentValue.textContent = input.valueText??input.value;

	input.addEventListener("input", () => {
		GM_setValue(config.id, input.type == "checkbox" ? input.checked : input.value);
		currentValue.textContent = input.valueText??input.value;
		updateConfigVariable(config.id, input.type == "checkbox" ? input.checked : input.value);
	});
	inputContainer.appendChild(input);

	const description = document.createElement("div");
	description.classList.add("settings-item-description");
	description.innerHTML = config.description;

	settingItem.appendChild(name);
	settingItem.appendChild(inputContainer);
	settingItem.appendChild(currentValue);
	settingItem.appendChild(description);

	settingsContent.appendChild(settingItem);
});

const closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.style = `align-self: center; margin-top: 10px; padding: 5px 10px; border-radius: 5px; background-color: lightgray;`;
closeButton.addEventListener("click", () => {
	settingsOverlay.style.display = "none";
});

settingsContent.appendChild(closeButton);
settingsOverlay.appendChild(settingsContent);
document.body.appendChild(settingsOverlay);

settingsIcon.addEventListener("click", () => {
	settingsOverlay.style.display = "flex";
});

// Close settings dialog when clicking outside the popup
settingsOverlay.addEventListener("mousedown", function (event) {
	// Only close if clicking outside the settingsContent
	if (event.target === settingsOverlay) {
		settingsOverlay.style.display = "none";
	}
});

// Add logic to enable/disable the cooldown-timeout input
document.getElementById("under-cooldown").addEventListener("change", (event) => {
    const cooldownInput = document.getElementById("cooldown-timeout");
    cooldownInput.disabled = !event.target.checked;
});


/**
 * This function updates the icon's appearance with the specified content and classlist.
 * @param {string} content - The content to display in the icon.
 * @param {string} classlist - The classlist to apply to the icon.
 */
function updateIcon(content, classlist="searching") {
	searchIcon.classList.add(classlist);
	settingsIcon.classList.add(classlist);
	searchIcon.querySelector("span").textContent = content;
}


/**
 * This function updates the configuration variables based on the user's input in the settings overlay.
 * This is required only for configurations that require immediate changes before reloading the tab like the `Max Searches` option.
 * @param {string} id - The id of the configuration variable to update.
 * @param {string} value - The new value of the configuration variable.
*/
function updateConfigVariable(id, value) {
	if (id === "max-searches") MAX_SEARCHES = parseInt(value);
	else if (id === "cooldown-timeout") COOLDOWN_TIMEOUT = parseInt(value);
	else if (id === "under-cooldown") UNDER_COOLDOWN = value == "true";
  }

/*=============================================*\
|* 				HELPER FUNCTIONS			   *|
\*=============================================*/
/**
 * Perform a search for dynamically extracted random words from descriptions.
 * This function finds all the result elements on the page and extracts random words from their text content.
 * The extracted words are stored in the searches array, which is then used to perform searches on Bing.
 * The number of searches is limited to [MAX_SEARCHES].
 * If [COLLECT_DAILY_ACTIVITY] is enabled, the Bing rewards page is opened in a new tab to collect daily activity points.
 * A search term is opened in the current tab to start the search process.
 */
function startSearch() {
	searches = [];
	GM_setValue("searches", searches);
	tabsToClose = [];
	GM_setValue("tabsToClose", tabsToClose);
	const resultElements = document.querySelectorAll(".b_caption p");
	while (searches.length < MAX_SEARCHES) {
		resultElements.forEach((element) => {
			const text = element.textContent.trim().split(/\s+/);
			for (let i = 0; i < text.length; i += Math.floor(Math.random() * 5) + 1) {
				const chunk = text.slice(i, i + Math.floor(Math.random() * 5) + 1).join(" ");
				if (chunk && chunk !== "...") searches.push(chunk);
				if (searches.length >= MAX_SEARCHES) break;
			}
			if (searches.length >= MAX_SEARCHES) return;
		});
	}
	searches = [...new Set(searches)]; // Remove duplicates
	searches = searches.slice(0, MAX_SEARCHES); // Extract up to MAX_SEARCHES
	console.log(searches);

	GM_setValue("searches", searches);
	
	if (COLLECT_DAILY_ACTIVITY) window.open(`https://rewards.bing.com/?ref=rewardspanel`, "_blank");
	if (AUTO_CLOSE_TABS) addTabToClose("https://rewards.bing.com/?ref=rewardspanel");
	
	const nextSearchTerm = searches.pop();
	
	GM_setValue("searches", searches);
	addTabToClose(generateSearchUrl(searches[0]));
	window.open(generateSearchUrl(nextSearchTerm), "_self");
}

/**
 * Wait for elements to appear on the page and execute a callback function when they are found.
 * This function repeatedly checks for the presence of the specified selectors on the page.
 * Once any of the selectors are found, the callback function is called with the selector as a parameter.
 * @param {Array} selectors - The selectors to wait for.
 * @param {Function} callback - The callback function to execute when the selectors are found.
 */
function waitForElements(selectors, callback) {
	if (selectors == null) {
		callback(null);
		return;
	}
	for (let selector of selectors) {
		if (document.querySelector(selector)) {
			callback(selector);
			return;
		}
	}
	setTimeout(() => waitForElements(selectors, callback), 500);
}

/**
 * Add a tab to the list of tabs to close after a specified timeout.
 * This function adds the tab to the [tabsToClose] array and sets a timeout to close the tab.
 * The tabs to close are stored in the local storage and are closed after the specified timeout.
 * @param {Window} tab - The tab to close.
 * @param {number} timeout - The timeout in milliseconds to close the tab.
 * @example addTabToClose(window.open("https://rewards.bing.com/?ref=rewardspanel", "_blank"), 5000);
 */
function addTabToClose(tab, timeout=5000) {
	tabsToClose.push(
		{"url": tab, "timeout": timeout}
	);
	GM_setValue("tabsToClose", tabsToClose);
}

/**
 * Get the Bing search URL for a given search term.
 * This function constructs the Bing search URL with the specified search term and returns it.
 * @param {string} searchTerm - The search term to include in the URL.
 * @returns {string} - The Bing search URL for the given search term.
 */
function generateSearchUrl(searchTerm) {
	return `https://www.bing.com/search?FORM=U523DF&PC=U523&q=${encodeURI(searchTerm)}&FORM=ANNTA1&qs=ds`;
}


/*=============================================*\
|*                MAIN SCRIPT                 *|
\*=============================================*/
/**
 * Wait for the page to load the points element first.
 * For android, this step is skipped.
 * Bing seems to have 2 different selectors for the points element
 * based on which browser is being used, so the possible selectors are
 * put inside [pointsElem]
 * In case of mobile, the script skips searching for the element.
 */
try {
if (isSearchPage) {
	// Add the auto-search icons to the top left corner of the page
	document.body.appendChild(autoSearchContainer);

	let pointsElems = isMobile ? null : ["#id_rc", ".points-container"];
	waitForElements(pointsElems, function (pointsElem) {
		/**
		 * If the current URL contains the "&form=STARTSCRIPT" parameter,
		 * the script automatically extracts words from the page and starts the search.
		 * This is a workaround for automating the script locally, without the need for
		 * clicking the start icon.
		 */
		if (window.location.href.includes("&form=STARTSCRIPT")) {
			startSearch();
		}
		/**
		 * If the current URL contains the "&qs=ds&form=QBRE" parameter (which I've noticed that bing sets for all searches),
		 * and the [searches] array is not empty, the script automatically waits
		 * for a few secs (on mobile, it waits fixed time and on desktop it waits until points element is updated),
		 * and then proceeds to the next search in the current tab.
		 */
		else if (searches.length > 0 && window.location.href.includes("&FORM=ANNTA1&qs=ds")) {
			updateIcon(`${searches.length} left`);
			let targetNode = document.querySelector(pointsElem);
			const observerTimeout = 4000;

			let observerOptions = {characterData: true, childList: true, subtree: true};

			if (pointsElem != null) {
				let oldTextContent = targetNode.textContent.trim();

				let observer = new MutationObserver((mutationsList, observer) => {
					for (let mutation of mutationsList) {
						if (mutation.type == "childList" || mutation.type == "characterData") {
							let newTextContent = targetNode.textContent.trim();
							if (newTextContent != oldTextContent) {
								gotoNextSearch();
								observer.disconnect();
								clearTimeout(timeoutId);
								break;
							}
						}
					}
				});

				observer.observe(targetNode, observerOptions);
			}

			// Store the timeout ID so it can be cleared by the observer
			let timeoutId = setTimeout(() => {
				gotoNextSearch();
			}, observerTimeout);

			/**
			 * Go to the next search after a timeout.
			 * This function updates the icon's appearance with a countdown timer.
			 * After the timeout, it opens the next search in the current tab and updates the searches array in local storage.
			 * If [OPEN_RANDOM_LINKS] is enabled, it also opens a random link from the search results in an iframe.
			 * It's been observed that some links like britannica.com refuse to open in an iframe and end up opening in current window.
			 * As a workaround, such domains are excluded from being opened in an iframe.
			 */
			function gotoNextSearch() {
				countdownTimer(TIMEOUT / 1000);

				if (OPEN_RANDOM_LINKS) {
					try {
						let searchLinks = isMobile
						? document.querySelectorAll(".b_algoheader > a")
						: document.querySelectorAll("li.b_algo h2 a");

						// workaround for the britannica bug.
						const excludeDomains = ["britannica.com", "sunshineseeker.com"];
						searchLinks = Array.from(searchLinks).filter(link => !excludeDomains.some(domain => link.closest(".b_algo").querySelector(".b_tpcn div.tpmeta").innerText.includes(domain)));
						let randLink = searchLinks[Math.floor(Math.random() * searchLinks.length)];
						
						let iframe = document.createElement("iframe");
						iframe.name = "randLinkFrame";
						iframe.style.width = "100%";
						iframe.style.height = "600px";
						randLink.parentElement.appendChild(iframe);
						randLink.target = "randLinkFrame";
						randLink.click();
					} catch (e) {
						console.error(e);
					}
				}

				setTimeout(() => {
					// if this is the final search, then open the points breakdown page in a new tab if OPEN_POINTS_BREAKDOWN is enabled
					if (searches.length==1 && OPEN_POINTS_BREAKDOWN) window.open("https://rewards.bing.com/pointsbreakdown", "_blank");
					
					// window.open(`https://www.bing.com/search?go=Search&q=${encodeURI(searches.pop())}&qs=ds&form=QBRE`, "_self");
					window.open(generateSearchUrl(searches.pop()), "_self");
					// document.querySelector("textarea.b_searchbox").value = searches.pop();
					// document.querySelector("input.b_searchboxSubmit").click();
					GM_setValue("searches", searches);
				}, TIMEOUT);
			}

			/**
			 * Start a countdown timer and update the icon's appearance.
			 * This function updates the icon's appearance every second with the remaining time in the countdown.
			 * @param {number} count - The duration of the countdown in seconds.
			 */
			function countdownTimer(count) {
				let c = parseInt(count);
				const intervalId = setInterval(() => {
					updateIcon(c, "counting");
					if (c == 0) {
						clearInterval(intervalId);
					}
					c--;
				}, 1000);
			}
		}
	});
}


/**
 * If the current page is the Bing rewards page, the script automatically clicks the unclaimed daily points.
 * To prevent opening new tabs, points are opened into an iframe inside each point card.
 */
if (isRewardPage) {
	if (COLLECT_DAILY_ACTIVITY) {
		// Wait for the page to load the point cards first
		window.onload = () => document.querySelectorAll("a.ds-card-sec:has(span.mee-icon-AddMedium)").forEach((card) => {
			addTabToClose(card.href);
			card.click();
		});
	}
}


/**
 * Close the current tab if it has been registered for auto-closing.
 * Waits for the specified timeout before closing the tab.
 * If the tab cant be closed, then use a workaround for modern browser's limitation in closing tabs that werent opened by the script.
 * Tip: This workaround still might not work, so you can use an external tool to automate closing windows
 * by checking for the title of the window (Close this window).
 */
if (AUTO_CLOSE_TABS) {
    const tabToClose = tabsToClose.find(tab => window.location.href == tab.url);
	if (tabToClose) {
		tabsToClose = tabsToClose.filter(tab => tab.url != tabToClose.url);
		GM_setValue("tabsToClose", tabsToClose);
        setTimeout(() => {
			window.close()

			// IF the tab still hasnt closed, take the user to close-this-window page
			window.open(`https://jeryjs.github.io/Userscripts/Bing-AutoGrind/close-this-window.html?bing-autogrind=true`, "_self");
		}, tabToClose.timeout);
    }
}

/*=============================================*\
|*					CSS STYLES				   *|
\*=============================================*/

const stylesheet = Object.assign(document.createElement("style"), {textContent: `
    .auto-search-container {
        position: fixed;
        top: 90px;
        left: 20px;
		display: inline-grid;
		align-items: flex-start;
		z-index: 1000;
    }
    .auto-search-container span {
		margin-left: 5px;
    }
    .search-icon, .settings-icon {
        display: flex;
        align-items: center;
		overflow: hidden;
        cursor: pointer;
        border-radius: 20px;
        background-color: lightgray;
        padding: 2px 10px 2px 0px;
        transition: all 0.5s ease;
    }
    .b_drk .search-icon,
    .b_drk .settings-icon,
    .b_dark .search-icon,
    .b_dark .settings-icon {
        background-color: #333;
    }
    .search-icon.shrink {
        width: 27px;
        transition: width 0.5s;
    }
    .search-icon.shrink:hover {
        width: 100%;
    }
    .settings-icon {
		opacity: 0;
        width: 23px;
        transition: all 0.5s ease;
    }
	.auto-search-container:hover .settings-icon,
	.auto-search-container .settings-icon.searching {
		opacity: 1;
	}
    .settings-icon:hover {
        width: 100%;
    }
    .search-icon.searching {
        background-color: lightblue !important;
    }
    .b_drk .search-icon.searching,
    .b_dark .search-icon.searching {
        background-color: midnightblue !important;
    }
    .search-icon.counting {
        background-color: lightgreen !important;
    }
    .b_drk .search-icon.counting,
    .b_dark .search-icon.counting {
        background-color: green !important;
    }
	

	/******** Settings Overlay *********/

	.b_drk .settings-overlay > div,
	.b_dark .settings-overlay > div {
		background-color: black !important;
	}
	.settings-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10px 0;
	}
	.settings-item:hover {
		border: ivory groove 1px;
		border-radius: 10px;
	}
	.settings-item-name {
		flex-basis: 20%;
		text-align: left;
	}
	.settings-item-input {
		flex-basis: 10%;
    	text-align: center;
	}
	.settings-item-value {
		flex-basis: 20%;
		text-align: center;
	}
	.settings-item-description {
		flex-basis: 40%;
		height: 0;
		width: 50vw;
		padding: 5px 10px 20px 10px;
		border: grey solid 1px;
		border-radius: 10px;
		overflow: hidden;
		transition: height 0.3s ease;
	}
	.settings-item:hover .settings-item-description {
		height: 60px;
		overflow-y: scroll;
		place-content: center;
		text-align: center;
   		padding: 20px;
	}
`})
if(!isRewardPage) document.head.appendChild(stylesheet);
} catch (e) {
	alert("AutoGrind ran into an error. Check the console for more information.\n"+e);
	console.error("AutoGrind ran into an error. Check the console for more information.\n"+e);
}