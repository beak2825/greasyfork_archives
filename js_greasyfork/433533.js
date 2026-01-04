// ==UserScript==
// @name         Map Cycler - Bonk.io
// @version      1.1.3
// @description  Cycles through maps that are shown in the Maps list
// @author       Excigma (Original idea and implementation by LEGENDBOSS123)
// @namespace    https://greasyfork.org/users/416480 
// @license      GPL-3.0
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/433533/Map%20Cycler%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/433533/Map%20Cycler%20-%20Bonkio.meta.js
// ==/UserScript==

// Credits to LEGENDBOSS123 for their idea and initial implementation

// I need to set up eslint AAAAA;;;;;;;;;;;;
// The code is so bad aaaaaaaaa

// What this does
// - Changes map after every x rounds

// Disable this if you don't want to use an injector to modify bonk.io's code for this to work
// It is much more likely that this script will survive bonk.io updates if this is turned off.
// However, the name of the map shows up before the round starts when `useInjector` is true, making it feel less janky and impulsive, so it's recommended to have it on unless it doesn't work.

const useInjector = true;

// Use https://keycode.info to find the .key for the key you want
// This is the key you press to skip the current map
const skipMapKey = "F1";

// Requires https://greasyfork.org/en/scripts/433861-code-injector-bonk-io also installed

unsafeWindow.mapCycler = {}

function CyclerInjector(str) {
	let newStr = str;
	// Allows us to directly start the game
	newStr = newStr.replace(`;function p1h(...D0h){`, `;window.mapCycler.startGame = () => p1h("startGame"); function p1h(...D0h){`);
	
	if (str === newStr) throw "Injection failed!";

	console.log("Map Cycler injector run");
	return newStr;
}

if (useInjector) {
	if (!unsafeWindow.bonkCodeInjectors) unsafeWindow.bonkCodeInjectors = [];
	unsafeWindow.bonkCodeInjectors.push(bonkCode => {
		try {
			return CyclerInjector(bonkCode);
		} catch (error) {
			alert(
				`Whoops! Map Cycler was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
Map Cycler.
		`);
			throw error;
		}
	});
	

	console.log("Map Cycler injector loaded");
}


document.addEventListener("DOMContentLoaded", () => {
	// This keeps track of the number of rounds played
	let enabled = false;
	let temporarilyDisabled = false;
	let roundCounter = 0;
	let mapList = [];

	// Get buttons and such... this is kinda messy... if someone knows a better way then tell me :)
	const ingamewinner = document.getElementById("ingamewinner");
	const ingamewinner_scores_right = document.getElementById("ingamewinner_scores_right");
	const newbonklobby_roundsinput = document.getElementById("newbonklobby_roundsinput");
	const newbonklobby_editorbutton = document.getElementById("newbonklobby_editorbutton");
	const mapeditor_midbox_testbutton = document.getElementById("mapeditor_midbox_testbutton");
	const mapeditor_close = document.getElementById("mapeditor_close");
	const pretty_top_exit = document.getElementById("pretty_top_exit");
	const maploadwindowmapscontainer = document.getElementById("maploadwindowmapscontainer");
	const maploadtypedropdown = document.getElementById("maploadtypedropdown");
	const newbonklobby_settingsbox = document.getElementById("newbonklobby_settingsbox");
	const newbonklobby_startbutton = document.getElementById("newbonklobby_startbutton");
	const mapeditorcontainer = document.getElementById("mapeditorcontainer");
	// Add a new button to CYCLE through maps
	const newbonklobby_cyclebutton = newbonklobby_settingsbox.appendChild(document.createElement("div"));

	const sleep = time => new Promise(resolve => setTimeout(resolve, time));

	newbonklobby_cyclebutton.id = "newbonklobby_cyclebutton";

	// Copy the classes over so it steals the "START" button's styles lol
	newbonklobby_cyclebutton.classList = newbonklobby_startbutton.classList;
	newbonklobby_cyclebutton.classList.add("brownButtonDisabled"); // Make the button disabled

	newbonklobby_cyclebutton.innerText = "CYCLE";

	// Hardcoding CSS go brr
	// eslint-disable-next-line no-undef
	GM_addStyle(`
    /* Reduce the CYCLE button width, and fit it to the right */
    #newbonklobby_cyclebutton {
        width: 58px;
        position: absolute;
        right: 15px;
        bottom: 15px;
    }

    /* Reduce the START button's width and make sure it stays on the left */
    #newbonklobby_startbutton {
        width: 58px !important;
        right: 73px !important;
    }
    `);

	// Advance to the next map
	const nextMap = async (force = false) => {
		if (!enabled) return;

		// Change maps after a delay
		++roundCounter;
		if (!force) temporarilyDisabled = true; // Temporarily disable whilst switching to the next map
		if (!force && useInjector && unsafeWindow.mapCycler?.startGame) await sleep(1000);

		// ingamewinner.style.display = "none";
		// Choose the next map. I added sleeping here just to possibly improve the reliability
		// It shouldn't be needed but shouldn't hurt, either
		mapList[roundCounter % mapList.length].click();
		await sleep(100);

		// Still work if injector failed.
		if (useInjector && unsafeWindow.mapCycler?.startGame) {
			unsafeWindow.mapCycler.startGame();
		} else {
			// Open and close the editor
			// Adding a delay here will cause an uncomfortable flicker so there is none
			newbonklobby_editorbutton.click();
			// Start the game using the button from the editor	
			mapeditor_midbox_testbutton.click();
		}
	};
	
	// Expose it, in case someone wants to use it, idk
	unsafeWindow.mapCycler.nextMap = nextMap

	new MutationObserver(async mutationsList => {
		if (enabled) {
			// The "ingamewinner"is shown. This means someone has won the round.
			if (ingamewinner.style.visibility === "inherit") {
				// It's technically split by \r\n, but in case somehow they switch to unix
				// line endings, this will break. parseInt will ignore the \r anyway
				const scores = ingamewinner_scores_right.textContent?.split("\n");

				// If someone wins and there is a next map, then..
				if (scores && parseInt(scores[0]) === parseInt(newbonklobby_roundsinput.value) && mapList.length !== 0 && !temporarilyDisabled) {
					await nextMap();
				}
			} else {
				// Disable until the thing is hidden
				temporarilyDisabled = false;
				ingamewinner.style.display = "";
			}
		}
	}).observe(ingamewinner, {
		attributeFilter: ["style"],
		attributeOldValue: true,
	});

	// Detect when the maps list is populated
	new MutationObserver(mutationsList => {
		mapList = Array.from(maploadwindowmapscontainer?.children ?? []);

		if (mapList.length !== 0) {
			shuffle(mapList);
			// Change state of CYCLE once maps are loaded
			if (!newbonklobby_startbutton.classList.contains("brownButtonDisabled")) {
				newbonklobby_cyclebutton.classList.remove("brownButtonDisabled");
			}
		}
	}).observe(maploadwindowmapscontainer, {
		childList: true
	});


	// Detect when the host button is not disabled
	new MutationObserver(mutationsList => {
		if (newbonklobby_startbutton.classList.contains("brownButtonDisabled")) {
			// No host :(
			newbonklobby_cyclebutton.classList.add("brownButtonDisabled");
		} else {
			// Got host (or round ended, apparently)
			if (mapList.length !== 0) {
				newbonklobby_cyclebutton.classList.remove("brownButtonDisabled");
			}
		}
	}).observe(newbonklobby_startbutton, {
		attributeFilter: ["class"]
	});

	// When you exit the game, bonk will make you go to the editor since
	// you clicked the test button in the editor. This closes the editor to return to the menu.
	pretty_top_exit.addEventListener("click", async () => {
		if (enabled) {
			await sleep(10);
			if (mapeditorcontainer.style.display === "block") {
				if (!(useInjector && unsafeWindow.mapCycler?.startGame)) mapeditor_close.click();
			}
		}
	});

	// Skip the current map
	document.addEventListener("keyup", async (event) => {
		if (event.key.toLowerCase() === skipMapKey.toLowerCase()) {
			await nextMap(true);
		}
	});

	// Picked a new thing from map picker
	maploadtypedropdown.addEventListener("click", () => {
		if (enabled) roundCounter = 0;
	});

	newbonklobby_cyclebutton.addEventListener("click", async () => {
		newbonklobby_startbutton.click();
		enabled = true;
	});

	newbonklobby_startbutton.addEventListener("click", () => {
		enabled = false;
	});

        // Button sounds hopefully, thanks to kklkkj
        // I haven't tested this lmao
        newbonklobby_cyclebutton.onmousedown = newbonklobby_startbutton.onmousedown
        newbonklobby_cyclebutton.onmouseenter = newbonklobby_startbutton.onmouseenter

	// Taken from https://stackoverflow.com/a/6274381
	function shuffle(a) {
		let j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
	}
});