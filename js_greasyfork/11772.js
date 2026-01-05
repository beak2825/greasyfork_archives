// ==UserScript==
// @name         Fallen London aScript
// @namespace    http://nekoinemo.net/
// @version      1.4.17
// @description  Script to ease the grinding process by automagically repeating selected action
// @author       NekoiNemo
// @match        http://fallenlondon.storynexus.com/Gap/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11772/Fallen%20London%20aScript.user.js
// @updateURL https://update.greasyfork.org/scripts/11772/Fallen%20London%20aScript.meta.js
// ==/UserScript==

var DEFAULT_DELAY = 8000;
var DEFAULT_ACT_THRESHOLD = 30;

var aMenuHandle;
var repeaterActive = false;
var repeaterIntervalHandle;
var sequencerActive = false;
var sequencerIntervalHandle;
var sequenceCurrentAction = 0;

var inputDataJSON = JSON.parse("{\"storylets\":[{\"title\":\"Unfinished Business in Spite\",\"id\":\"18728\",\"locationId\":\"7\",\"branches\":[{\"title\":\"Keep your hands quick\",\"id\":\"8311\",\"cost\":\"1\",\"challenge\":\"Shadowy\"},{\"title\":\"The fellow in the corner\",\"id\":\"8312\",\"cost\":\"1\",\"challenge\":\"Shadowy\"},{\"title\":\"Encourage the honest folk of Spite to give you \'gifts\'\",\"id\":\"8313\",\"cost\":\"5\",\"challenge\":\"Shadowy\"},{\"title\":\"Eavesdropping\",\"id\":\"8314\",\"cost\":\"1\",\"challenge\":\"Shadowy\"},{\"title\":\"Rob a glim shipment\",\"id\":\"8315\",\"cost\":\"1\",\"challenge\":\"Shadowy\"},{\"title\":\"The prince of...\",\"id\":\"8316\",\"cost\":\"1\",\"challenge\":\"Shadowy\"},{\"title\":\"Ambush a few couriers for old times\' sake\",\"id\":\"9426\",\"cost\":\"2\",\"challenge\":\"Shadowy\"}]},{\"title\":\"Unfinished Business in Ladybones Road\",\"id\":\"18729\",\"locationId\":\"4\",\"branches\":[{\"title\":\"The anatomy of a secret\",\"id\":\"8317\",\"cost\":\"1\",\"challenge\":\"Watchful\"},{\"title\":\"The study of antiquities\",\"id\":\"8318\",\"cost\":\"2\",\"challenge\":\"Watchful\"},{\"title\":\"A lovely thought\",\"id\":\"8319\",\"cost\":\"1\",\"challenge\":\"Watchful\"},{\"title\":\"A tradition developed after the Fall\",\"id\":\"8320\",\"cost\":\"1\",\"challenge\":\"Watchful\"},{\"title\":\"Mischief and brass\",\"id\":\"8321\",\"cost\":\"5\",\"challenge\":\"Watchful\"},{\"title\":\"Debate the nature of Primordial Shrieks\",\"id\":\"9427\",\"cost\":\"1\",\"challenge\":\"Watchful\"}]},{\"title\":\"Unfinished Business in Veilgarden\",\"id\":\"15691\",\"locationId\":\"6\",\"branches\":[{\"title\":\"Take a consignment of old props\",\"id\":\"8306\",\"cost\":\"2\",\"challenge\":\"Persuasive\"},{\"title\":\"Your crowd of admirers\",\"id\":\"8307\",\"cost\":\"5\",\"challenge\":\"Persuasive\"},{\"title\":\"Shake down your agent\",\"id\":\"8308\",\"cost\":\"1\",\"challenge\":\"Persuasive\"},{\"title\":\"Get in on a card game\",\"id\":\"8309\",\"cost\":\"1\",\"challenge\":\"Persuasive\"},{\"title\":\"An admirer among the clergy\",\"id\":\"8310\",\"cost\":\"1\",\"challenge\":\"Persuasive\"},{\"title\":\"Doing the decent thing.\",\"id\":\"9425\",\"cost\":\"1\",\"challenge\":\"Persuasive\"}]},{\"title\":\"Unfinished Business in Watchmaker\'s Hill\",\"id\":\"18730\",\"locationId\":\"5\",\"branches\":[{\"title\":\"A spot of footpadry\",\"id\":\"8322\",\"cost\":\"1\",\"challenge\":\"Dangerous\"},{\"title\":\"A sure bet\",\"id\":\"8323\",\"cost\":\"2\",\"challenge\":\"Dangerous\"},{\"title\":\"Wade into the Ring Fights\",\"id\":\"8324\",\"cost\":\"5\",\"challenge\":\"Dangerous\"},{\"title\":\"A literary sort of fist-fight\",\"id\":\"8325\",\"cost\":\"1\",\"challenge\":\"Dangerous\"},{\"title\":\"Contracts and legs\",\"id\":\"8326\",\"cost\":\"1\",\"challenge\":\"Dangerous\"}]},{\"title\":\"Reaping the academic benefits\",\"id\":\"12036\",\"locationId\":\"9\",\"branches\":[{\"title\":\"A few quiet seminars\",\"id\":\"5027\",\"cost\":\"1\",\"challenge\":\"Watchful\"},{\"title\":\"A public lecture\",\"id\":\"5028\",\"cost\":\"1\",\"challenge\":\"Watchful\"}]}],\"equipment\":[{\"title\":\"BDR\",\"Hat\":\"21845\",\"Clothing\":\"23898\",\"Gloves\":\"21848\",\"Weapon\":\"1064\",\"Boots\":\"\",\"Companion\":\"899\",\"Affiliation\":\"790\",\"Transportation\":\"887\",\"HomeComfort\":\"\"},{\"title\":\"Watchful\",\"Hat\":\"727\",\"Clothing\":\"21895\",\"Gloves\":\"301\",\"Weapon\":\"655\",\"Boots\":\"608\",\"Companion\":\"102305\",\"Affiliation\":\"906\",\"Transportation\":\"\",\"HomeComfort\":\"786\"},{\"title\":\"Shadowy\",\"Hat\":\"21897\",\"Clothing\":\"318\",\"Gloves\":\"21848\",\"Weapon\":\"105465\",\"Boots\":\"23902\",\"Companion\":\"102304\",\"Affiliation\":\"794\",\"Transportation\":\"887\",\"HomeComfort\":\"912\"},{\"title\":\"Dangerous\",\"Hat\":\"727\",\"Clothing\":\"21892\",\"Gloves\":\"297\",\"Weapon\":\"21896\",\"Boots\":\"361\",\"Companion\":\"102304\",\"Affiliation\":\"\",\"Transportation\":\"\",\"HomeComfort\":\"788\"},{\"title\":\"Persuasive\",\"Hat\":\"21845\",\"Clothing\":\"23898\",\"Gloves\":\"730\",\"Weapon\":\"105465\",\"Boots\":\"360\",\"Companion\":\"899\",\"Affiliation\":\"101599\",\"Transportation\":\"\",\"HomeComfort\":\"\"}],\"sequences\":[{\"title\":\"Collection of Curiosities (Watchful)\",\"storylets\":[{\"type\":\"action\",\"storylet_title\":\"The Portly Assassin\",\"storylet_id\":\"19696\",\"locationId\":\"11\",\"branch_title\":\"Look for the Portly Assassin\",\"branch_id\":\"8795\",\"cost\":\"1\",\"challenge\":\"Watchful\"},{\"type\":\"action\",\"storylet_title\":\"The Boatman\'s Market\",\"storylet_id\":\"19701\",\"locationId\":\"11\",\"branch_title\":\"Bidding on a bargain\",\"branch_id\":\"8800\",\"cost\":\"1\",\"challenge\":\"Watchful\"},{\"type\":\"action\",\"storylet_title\":\"The Topsy King would like a Word\",\"storylet_id\":\"19702\",\"locationId\":\"11\",\"branch_title\":\"What is he talking about?\",\"branch_id\":\"8801\",\"cost\":\"1\",\"challenge\":\"Watchful\"},{\"type\":\"condition\",\"condition\":\"\'Dramatic Tension\'=2\",\"true\":\"continue\",\"false\":\"restart\"},{\"type\":\"action\",\"storylet_title\":\"The Treasures of War\",\"storylet_id\":\"19617\",\"locationId\":\"2\",\"branch_title\":\"A few of your old things\",\"branch_id\":\"8771\",\"cost\":\"1\",\"challenge\":\"\"}]}]}");

// Objects

function QualityUpdate(quality) {

	this.quality = quality;
	this.value = -1;
}

// Functions

function getActThreshold() {

	var input = document.getElementById("actThreshInput");

	if (input == null || isNaN(parseInt(input.value))) return DEFAULT_ACT_THRESHOLD;
	return parseInt(input.value);
}
function getDelay() {

	var input = document.getElementById("delayInput");

	if (input == null || isNaN(parseInt(input.value))) return DEFAULT_DELAY;
	return parseInt(input.value);
}
function getStoryletData() {

	var element = document.getElementById("storyletInput");
	var index = element.options[element.selectedIndex].value;
	return inputDataJSON.storylets[index];
}
function getBranchData(storyletData) {

	var element = document.getElementById("branchInput");
	var index = element.options[element.selectedIndex].value;
	return storyletData.branches[index];
}
function getSequenceData() {

	var element = document.getElementById("sequenceInput");
	var index = element.options[element.selectedIndex].value;
	return inputDataJSON.sequences[index];
}
function getEquipmentSet() {

	var element = document.getElementById("equipmentInput");
	var index = element.options[element.selectedIndex].value;
	return inputDataJSON.equipment[index];
}
function getEquipmentSetByName(requestedSetName) {

	for (var i = 0; i < inputDataJSON.equipment.length; i++) {
		if (inputDataJSON.equipment[i].title.toLowerCase() == requestedSetName.toLowerCase()) return inputDataJSON.equipment[i];
	}

	return null;
}

function populateBranches() {

	var branchInput = document.getElementById("branchInput");
	if (branchInput == null) return;

	// Clear
	while (branchInput.firstChild) {
		branchInput.removeChild(branchInput.firstChild);
	}

	var branches = getStoryletData().branches;
	for (var i = 0; i < branches.length; i++) {
		var opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = branches[i].title + (branches[i].cost != "1" ? " (" + branches[i].cost + ")" : "");
		branchInput.appendChild(opt);
	}
}
function menuInit() {

	console.log("Automate is loaded");

	aMenuHandle = document.createElement("div");
	aMenuHandle.id = "automateMenu";
	aMenuHandle.style.backgroundColor = "#B28F8F";
	aMenuHandle.style.position = "absolute";
	aMenuHandle.style.top = "55px";
	aMenuHandle.style.width = "360px";

	var repeaterButton = document.createElement("button");
	repeaterButton.id = "repeaterButton";
	repeaterButton.appendChild(document.createTextNode("Start"));
	repeaterButton.onclick = switchState;

	var actThreshInput = document.createElement("input");
	actThreshInput.id = "actThreshInput";
	actThreshInput.style.width = "30px";
	actThreshInput.style.marginLeft = "10px";
	actThreshInput.style.marginRight = "10px";
	actThreshInput.value = DEFAULT_ACT_THRESHOLD;

	var delayInput = document.createElement("input");
	delayInput.id = "delayInput";
	delayInput.style.width = "50px";
	delayInput.style.marginLeft = "10px";
	delayInput.style.marginRight = "10px";
	delayInput.value = DEFAULT_DELAY;

	var storyletInput = document.createElement("select");
	storyletInput.id = "storyletInput";
	storyletInput.style.width = "340px";
	storyletInput.style.marginLeft = "10px";
	storyletInput.style.marginRight = "10px";
	storyletInput.onchange = populateBranches;
	for (var i = 0; i < inputDataJSON.storylets.length; i++) {
		var opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = inputDataJSON.storylets[i].title;
		storyletInput.appendChild(opt);
	}

	var branchInput = document.createElement("select");
	branchInput.id = "branchInput";
	branchInput.style.width = "340px";
	branchInput.style.marginLeft = "10px";
	branchInput.style.marginRight = "10px";
	var branches = inputDataJSON.storylets[0].branches;
	for (var i = 0; i < branches.length; i++) {
		var opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = branches[i].title + (branches[i].cost != "1" ? " (" + branches[i].cost + ")" : "");
		branchInput.appendChild(opt);
	}

	var sequenceButton = document.createElement("button");
	sequenceButton.id = "sequenceButton";
	sequenceButton.appendChild(document.createTextNode("Start"));
	sequenceButton.onclick = switchSequencer;
	var sequenceInput = document.createElement("select");
	sequenceInput.id = "sequenceInput";
	sequenceInput.style.width = "340px";
	sequenceInput.style.marginLeft = "10px";
	sequenceInput.style.marginRight = "10px";
	var sequences = inputDataJSON.sequences;
	for (var i = 0; i < sequences.length; i++) {
		var opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = sequences[i].title;
		sequenceInput.appendChild(opt);
	}

	var equipmentInput = document.createElement("select");
	equipmentInput.id = "equipmentInput";
	equipmentInput.style.width = "160px";
	equipmentInput.style.marginLeft = "10px";
	equipmentInput.style.marginRight = "10px";
	for (var i = 0; i < inputDataJSON.equipment.length; i++) {
		var opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = inputDataJSON.equipment[i].title;
		equipmentInput.appendChild(opt);
	}
	var equipButton = document.createElement("button");
	equipButton.appendChild(document.createTextNode("Equip"));
	equipButton.onclick = equipSelectedSet;

	// DEBUG
	var resultButton = document.createElement("button");
	resultButton.appendChild(document.createTextNode("Analyze"));
	resultButton.onclick = displayBranchResult;

	aMenuHandle.appendChild(repeaterButton);
	aMenuHandle.appendChild(resultButton);
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(document.createTextNode("Act. threshold:"));
	aMenuHandle.appendChild(actThreshInput);
	aMenuHandle.appendChild(document.createTextNode("Delay:"));
	aMenuHandle.appendChild(delayInput);
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(document.createTextNode("Storylet:"));
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(storyletInput);
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(document.createTextNode("Branch:"));
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(branchInput);
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(document.createTextNode("Sequence:"));
	aMenuHandle.appendChild(sequenceButton);
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(sequenceInput);
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(document.createTextNode("Equip set:"));
	aMenuHandle.appendChild(document.createElement("br"));
	aMenuHandle.appendChild(equipmentInput);
	aMenuHandle.appendChild(equipButton);

	setInterval(redrawMenu, 100);
}
function redrawMenu() {

	if (document.getElementById("automateMenu") == null)
		document.body.appendChild(aMenuHandle);

	if (document.getElementById("infoBarCurrentActions") == null)
		aMenuHandle.style.display = "none";
	else aMenuHandle.style.display = "initial";
}

function switchState() {

	repeaterActive = !repeaterActive;
	var currState = document.getElementById("repeaterButton");

	if (repeaterActive) {
		launchRepeater();
		currState.innerHTML = "Stop";

		//document.getElementById("repeaterButton").setAttribute("disabled", true);
		document.getElementById("actThreshInput").setAttribute("disabled", true);
		document.getElementById("delayInput").setAttribute("disabled", true);
		document.getElementById("branchInput").setAttribute("disabled", true);
		document.getElementById("storyletInput").setAttribute("disabled", true);
		document.getElementById("sequenceButton").setAttribute("disabled", true);
		document.getElementById("sequenceInput").setAttribute("disabled", true);
	} else {
		clearInterval(repeaterIntervalHandle);
		currState.innerHTML = "Start";

		//document.getElementById("repeaterButton").removeAttribute("disabled");
		document.getElementById("actThreshInput").removeAttribute("disabled");
		document.getElementById("delayInput").removeAttribute("disabled");
		document.getElementById("branchInput").removeAttribute("disabled");
		document.getElementById("storyletInput").removeAttribute("disabled");
		document.getElementById("sequenceButton").removeAttribute("disabled");
		document.getElementById("sequenceInput").removeAttribute("disabled");
	}
}
function switchSequencer() {

	sequencerActive = !sequencerActive;
	var currState = document.getElementById("sequenceButton");

	if (sequencerActive) {
		launchSequencer();
		currState.innerHTML = "Stop";

		document.getElementById("repeaterButton").setAttribute("disabled", true);
		document.getElementById("actThreshInput").setAttribute("disabled", true);
		document.getElementById("delayInput").setAttribute("disabled", true);
		document.getElementById("branchInput").setAttribute("disabled", true);
		document.getElementById("storyletInput").setAttribute("disabled", true);
		//document.getElementById("sequenceButton").setAttribute("disabled", true);
		document.getElementById("sequenceInput").setAttribute("disabled", true);
	} else {
		clearInterval(sequencerIntervalHandle);
		currState.innerHTML = "Start";

		document.getElementById("repeaterButton").removeAttribute("disabled");
		document.getElementById("actThreshInput").removeAttribute("disabled");
		document.getElementById("delayInput").removeAttribute("disabled");
		document.getElementById("branchInput").removeAttribute("disabled");
		document.getElementById("storyletInput").removeAttribute("disabled");
		//document.getElementById("sequenceButton").removeAttribute("disabled");
		document.getElementById("sequenceInput").removeAttribute("disabled");
	}
}

function branchResult() {

	var repeatable = false;
	var qualityUpdates = [];

	var resultContainer = document.getElementById("mainContentViaAjax");
	for (var i = 0; i < resultContainer.getElementsByClassName("standard_btn").length; i++) {
		var button = resultContainer.getElementsByClassName("standard_btn")[i];

		if (button.value == "TRY THIS AGAIN") {
			repeatable = true;
			break;
		}
	}

	var qualityChildren = document.getElementsByClassName("quality_update_box")[0].children;
	var i = 0;
	while (i < qualityChildren.length) {
		while (i < qualityChildren.length && qualityChildren[i].id.toLowerCase() != "quality_update") i++;
		if (i >= qualityChildren.length) break;

		// Icon/tooltip element
		var iconToolTip = qualityChildren[i++];
		// Text element
		var qText = qualityChildren[i++];
		if ((qText.children.length >= 1 && qText.children[0].tagName.toLowerCase() == "strong")) {
			var qUpdate = new QualityUpdate(qText.children[0].innerHTML);

			var skip = false;

			var newValue;
			if (qText.innerHTML.indexOf("increasing") > 0 || qText.innerHTML.indexOf("dropping") > 0) {
				newValue = qualityChildren[i].innerHTML;
			} else if (qText.innerHTML.indexOf("increased") > 0 || qText.innerHTML.indexOf("dropped") > 0) {
				newValue = qualityChildren[i + 2].innerHTML;
			} else if (qText.innerHTML.indexOf("You are now") > 0 || qText.innerHTML.indexOf("shows your progress") > 0) {
				newValue = 1;
			} else {
				skip = true;
			}

			if (!skip) {
				qUpdate.value = newValue;
				qualityUpdates.push(qUpdate);
			}

			skip = false;
		} else {
			var hasGone = qText.innerHTML.match(/Your '(.*?)' Quality has gone/i);
			if (hasGone == null) hasGone = qText.innerHTML.match(/'(.*?)' has been reset/i);

			if (hasGone != null) {
				var qUpdate = new QualityUpdate(hasGone[1]);
				qUpdate.value = 0;
				qualityUpdates.push(qUpdate);
			}
		}
	}

	return {"repeatable": repeatable, "qualityUpdates": qualityUpdates};
}
function displayBranchResult() {

	var result = branchResult();
	console.log("Repeatable: " + result.repeatable);
	for (var i = 0; i < result.qualityUpdates.length; i++) {
		var qUpdate = result.qualityUpdates[i];

		console.log(qUpdate);
	}
}

function equipSelectedSet() {

	equipSet(getEquipmentSet());
}
function equipSetByName(requestedSetName) {

	var requestedSet = getEquipmentSetByName(requestedSetName);
	if (requestedSet != null) equipSet(requestedSet);
}
function equipSet(requestedSet) {

	for (var slot in requestedSet) {
		var value = requestedSet[slot];
		if (value && value != "") adoptThing(value, slot);
	}
}

function changeLocation(locationId) {

	travel(locationId);
}

function launchRepeater() {

	var storyletData = getStoryletData();
	var branchData = getBranchData(storyletData);

	changeLocation(storyletData.locationId);
	equipSetByName(branchData.challenge);

	setTimeout(loadMainContent, 3000, "/Storylet/Begin?eventid=" + storyletData.id);

	repeaterIntervalHandle = setInterval(repeater, getDelay());
}
function repeater() {

	var actions = parseInt(document.getElementById("infoBarCurrentActions").innerHTML);
	var thresh = getActThreshold();
	var storyletData = getStoryletData();
	var branchData = getBranchData(storyletData);

	if (actions >= (parseInt(thresh) + parseInt(branchData.cost))) {
		if (document.getElementById("branch" + branchData.id) != null) {

			loadMainContentWithParams("/Storylet/ChooseBranch", {
				'branchid': branchData.id,
				'secondChances': null
			});

			setTimeout(branchResult, 2000);
		}

		setTimeout(loadMainContent, 3000, "/Storylet/Begin?eventid=" + storyletData.id);
	}

}
function launchSequencer(){

	var sequenceData = getSequenceData();

	repeaterIntervalHandle = setInterval(sequencer, getDelay());
}
function sequencer(){

	var actions = parseInt(document.getElementById("infoBarCurrentActions").innerHTML);
	var thresh = getActThreshold();
	var sequenceData = getSequenceData();
	var currAction = sequenceData.storylets[sequenceCurrentAction];

	if (actions >= (parseInt(thresh) + parseInt(currAction.cost))) {
		loadMainContent("/Storylet/Begin?eventid=" + currAction.storylet_id);
		setTimeout(function(){


		}, 2000);
	}
}

window.addEventListener("load", menuInit, false);