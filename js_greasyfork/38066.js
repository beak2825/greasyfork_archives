// ==UserScript==
// @name         QuantiSci Beverage Cat
// @namespace    salembeats
// @version      1.2
// @description  .
// @author       Cuyler Stuwe (salembeats)
// @include      *
// @grant        none
// @test-hit     https://www.mturkcontent.com/dynamic/hit?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=38O9DZ0A62O17G9LUB4XAUJDSXM262&workerId=&turkSubmitTo=
// @require      https://greasyfork.org/scripts/33041-mturk-frame-parent-interface-library/code/mTurk%20Frame-%3EParent%20Interface%20Library.js?version=239183
// @downloadURL https://update.greasyfork.org/scripts/38066/QuantiSci%20Beverage%20Cat.user.js
// @updateURL https://update.greasyfork.org/scripts/38066/QuantiSci%20Beverage%20Cat.meta.js
// ==/UserScript==

const GID = "3ZA8T98ZB59SF8ULWO18G6Q2P0CFTD";

const DEBUG_IN_TOP_FRAME = false;

if(window === window.top && !DEBUG_IN_TOP_FRAME) {return;}
if(!document.referrer.includes(GID) && !DEBUG_IN_TOP_FRAME) {return;}

const VALUES = {

	ALCOHOL: {
		BEER: "beer",
		WINE_CHAMP: "wine_champ",
		MIXED: "mixed_alc",
		OTHER: "other_alc"
	},

	BREWED: {
		COFFEE: "coffee",
		TEA: "tea"
	},

	OTHER: {
		WATER: "water",
		JUICE: "juice",
		ENERGY: "energy",
		SPORTS: "sports",
		SPARKLING: "sparkling_non_alc",
		MIXED: "blended_non_alc"
	},

	NONE: {
		NOT_BROKEN: "none",
		BROKEN: "broken"
	}

};

const CATEGORY_INDEX_MAP = {

	CATEGORY: {
		"0": "ALCOHOL",
		"1": "BREWED",
		"2": "OTHER",
		"3": "NONE"
	},

	ALCOHOL: {
		"0": "BEER",
		"1": "WINE_CHAMP",
		"2": "MIXED",
		"3": "OTHER"
	},

	BREWED: {
		"0": "COFFEE",
		"1": "TEA"
	},

	OTHER: {
		"0": "WATER",
		"1": "JUICE",
		"2": "ENERGY",
		"3": "SPARKLING",
        "4": "SPORTS",
		"5": "MIXED"
	},

	NONE: {
		"0": "NOT_BROKEN",
		"1": "BROKEN"
	}
};

const INPUT_INDEX_MAP = {
	"z": 0,
	"x": 1,
	"c": 2,
	"v": 3,
	"b": 4,
	" ": 5
};

for(let key of Object.keys(INPUT_INDEX_MAP)) {
	let value = INPUT_INDEX_MAP[key];
	let reverseKey = value;
	let reverseValue = key;
	INPUT_INDEX_MAP[reverseKey] = reverseValue;
}

var selectionCategory = "CATEGORY";

document.querySelector(".img-responsive.center-block").insertAdjacentHTML("afterend", `

<style>
#choicesDiv span.which-key {
font-weight: bold;
}
#choicesDiv span.which-outcome {
font-style: italic;
}
</style>

<div id="choicesDiv">
</div>
`);

var choicesDiv = document.getElementById("choicesDiv");

function updateChoicesDisplay() {

	let newHTML = "";

	var sortedEntries = Object.entries(CATEGORY_INDEX_MAP[selectionCategory])
	    .sort((first, second) => { let returnVal = (first[0] > second[0] ? 1 : -1); return returnVal; });

	for(let [index, option] of sortedEntries) {
		newHTML += `<span class="which-key">${INPUT_INDEX_MAP[index].replace(" ", "space").toUpperCase()}:</span> <span class="which-outcome">${option.replace("SPARKLING", "SODA")}</span> `;
	}

	choicesDiv.innerHTML = newHTML.substr(0, newHTML.length);
}

updateChoicesDisplay();

document.addEventListener("keydown", e => {

	console.log(e.key);

    if(e.key === "Shift") {mTurkParentWindow.returnHIT();}

	if(e.key in INPUT_INDEX_MAP) {

		e.preventDefault();

		let keyIndex = INPUT_INDEX_MAP[e.key];

		if(String(keyIndex) in CATEGORY_INDEX_MAP[selectionCategory]) {

			let choice = CATEGORY_INDEX_MAP[selectionCategory][keyIndex];

			if(selectionCategory === "CATEGORY") {
				selectionCategory = choice;
			}
			else {
				document.querySelector(`input[value=${VALUES[selectionCategory][choice]}`).click();
				document.querySelector("input[type='submit']").click();
			}

			updateChoicesDisplay();
		}
	}
});

document.querySelector(".fields").style.display = "none";
document.querySelector(".panel.panel-primary").style.display = "none";