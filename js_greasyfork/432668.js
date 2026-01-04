// ==UserScript==
// @name		    UD Barrista - iSpy
// @author			Bradley Sattem (a.k.a. Aichon)
// @namespace		https://ud.dxavier.net
// @version			1.1.1.4
// @description		Places a menu bar across the top with stats and buttons
// @match			http://urbandead.com/*
// @match			http://www.urbandead.com/*
// @match			https://urbandead.com/*
// @match			https://www.urbandead.com/*
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/432668/UD%20Barrista%20-%20iSpy.user.js
// @updateURL https://update.greasyfork.org/scripts/432668/UD%20Barrista%20-%20iSpy.meta.js
// ==/UserScript==

/* Urban Dead Barrista
 *
 * Copyright (C) 2016 Bradley Sattem
 * Last Modified: 2016-07-26
 *
 * Tested under: Chrome 51 on Windows
 *
 * Contact: [my first name [DOT] my last name]@gmail.com (check the Copyright info for my name)
 *
 * Changes:
 *   v1.0.9 - Adding Dumbwit button. Fixing a load of syntax errors.
 *   v1.0.8 - Metadata updates.
 *   v1.0.7 - Feature: Changed stuff so that SatPhone should hopefully work
 *   v1.0.6 - Feature: Added IDs to certain elements so other userscripts could find them easily
 *   v1.0.5 - Bug Fix: Profile pages no longer screwed up
 *   v1.04  - No longer hides Dumbwit timestamps
 *   v1.03-chrome - Fixed some line-height issues observed by a user
 *   v1.0.3 - Bug Fix: Removed development code that could cause issues in non-dev setups
 *   v1.0.2 - Bug Fix: Settings and RG buttons work after saving your settings
 *   v1.0.1 - Settings button now works on more pages
 *   v1.0   - Now works in Firefox
 *          - Gun Stores no longer disappear in Malls
 *          - Fixed to work with game update for safehouses
 *
 * Thanks:
 *   Midianian - For creating UD Building State Colorizer. It gave me the idea for adding cade levels.
 *   Sean Dwyer - For the original AP recovery time concept that I saw.
 *   Vaevictus - For producing QuickLinks. It was the inspiration for what got me started on this.
 *
 */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// General functions that retrieve information about the character and environment and variables for accessing it all //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// find out which page we're on
function getPage() {
	if(document.title.match(/Urban Dead - The City/)) return "city";
	else if(document.title.match(/Urban Dead - Skills Tree/)) return "skills";
	else if(document.title.match(/Urban Dead - Your Contacts List/) || document.title.match(/Urban Dead - Contacts List/)) return "contacts";
	else if(document.title.match(/Urban Dead - Profile/)) {
		if(location.href.indexOf("edit") != -1) return "settings";
        else if(document.evaluate("//p/a[@class='y' and contains(@href,'profile.cgi?mode=edit&id=')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength !== 0) return "your profile";
		else return "profile";
	}
	else if(document.title.match(/Urban Dead - Donation/)) return "donate";
	else if(document.title.match(/Urban Dead - FAQ/)) return "faq";
	else if(document.title.match(/Urban Dead - Game News/)) return "news";
	else if(document.title.match(/Urban Dead - Zombie Apocalypse/)) return "logout";
	else if(document.title.match(/Urban Dead - A Free Massively Multi/)) return "main";
	else if(document.title.match(/Urban Dead - Game Statistics/)) return "stats";
	else if(document.title.match(/Urban Dead - \$10 CPM Advertising/)) return "advertising";
	else if(document.title.match(/Urban Dead - Welcome to Malton/)) return "signup";
	return -1;
}


// grab character name, profile link, and profile id
function getCharacter() {
	var page = getPage();
	var character = [];
    var spans;

	if(page == "city") {
		var as = document.evaluate("//td[@class='cp']/div[@class='gt']/a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		if(as.snapshotLength !== 0) {
			character[0] = as.snapshotItem(0).innerHTML;
			character[1] = as.snapshotItem(0).href;
			character[2] = character[1].substring(character[1].indexOf("profile.cgi?id=") + 15);
			return character;
		}
	}
	else if(page == "profile") {
		spans = document.evaluate("//div[@class='gp']/h1/span[@class='ptt']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		if(spans.snapshotLength !== 0) {
			character[0] = spans.snapshotItem(0).innerHTML;
			character[1] = location.href;
			character[2] = character[1].substring(character[1].indexOf("profile.cgi?id=") + 15);
			return character;
		}
	}
	else if(page == "your profile") {
		spans = document.evaluate("//div[@class='gp']/h1/span[@class='ptt']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var editLink = document.evaluate("//p/a[@class='y' and contains(@href,'profile.cgi?mode=edit&id=')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		if(spans.snapshotLength !== 0 && editLink.snapshotLength !== 0) {
			character[0] = spans.snapshotItem(0).innerHTML;
			character[1] = editLink.snapshotItem(0).href;
			character[2] = character[1].substring(character[1].indexOf("mode=edit&id=") + 13);
			return character;
		}
	}
    else if(page == "settings") {
		var h1s = document.evaluate("//div[@class='gp']/h1", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var cancelLink = document.evaluate("//div[@class='gp']/form[@action='profile.cgi']/div/a[@class='y' and contains(@href,'profile.cgi?id=')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

		if(h1s.snapshotLength !== 0 && cancelLink.snapshotLength !== 0) {
			character[0] = h1s.snapshotItem(0).innerHTML.substring(8, h1s.snapshotItem(0).innerHTML.indexOf("'s"));
			character[1] = cancelLink.snapshotItem(0).href;
			character[2] = character[1].substring(character[1].indexOf("profile.cgi?id=") + 15);
			return character;
		}
	}
	character[0] = null;
	character[1] = null;
	character[2] = null;
	return character;
}


// grab the HP, XP, and AP values, as well as whether or not we're dead or infected
function getStats() {
	var bs = document.evaluate("//td[@class='cp']/div[@class='gt']//b", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var counter = 0;
	var stats = [];

	stats[3] = false;
	stats[4] = false;

	for(var i = 0; i < bs.snapshotLength; i++)
		if(!isNaN(parseInt(bs.snapshotItem(i).innerHTML)))
			stats[counter++] = parseInt(bs.snapshotItem(i).innerHTML);
		else if(bs.snapshotItem(i).innerHTML == "dead") stats[3] = true;
		else if(bs.snapshotItem(i).innerHTML == "infected") stats[4] = true;

	if(counter == 1) {
		stats[1] = -1;
		stats[2] = stats[0];
		stats[0] = -1;
	}
	else if(counter != 3) {
		stats[0] = -1;
		stats[1] = -1;
		stats[2] = 99;
	}
	return stats;
}


// grab the barricade level
function getCades() {
	// find the end of the correct sentence
	var gtTxt = document.evaluate("//td[@class='gp']/div[@class='gt']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	if(ap <= 0) return -1;
	if(gtTxt.snapshotLength === 0) return -1;
	else gtTxt = gtTxt.snapshotItem(0).innerHTML;

	if(gtTxt.indexOf("extremely heavily barricaded") != -1) return 9;
	else if(gtTxt.indexOf("very heavily barricaded") != -1) return 8;
	else if(gtTxt.indexOf("heavily barricaded") != -1) return 7;
	else if(gtTxt.indexOf("very strongly barricaded") != -1) return 6;
	else if(gtTxt.indexOf("quite strongly barricaded") != -1) return 5;
	else if(gtTxt.indexOf("lightly barricaded") != -1) return 4;
	else if(gtTxt.indexOf("loosely barricaded") != -1) return 3;
	else if(gtTxt.indexOf("have been secured") != -1) return 2;
	else if(gtTxt.indexOf("has been ruined") != -1 || gtTxt.indexOf("has fallen into ruin") != -1 || gtTxt.indexOf("are ruined") != -1) return 0;
	else if(gtTxt.indexOf("left wide open") != -1 || gtTxt.indexOf("hang open") != -1 || gtTxt.indexOf("ragged rectangle has been cut") != -1 || gtTxt.indexOf("opens directly onto the street") != -1) return 1;
	else return -1;
}


// calculates the time (in 24-hour clock) that we'll be at full AP, roughly
function calculateTimeAtFullAP() {
	var startDate = new Date();
	var endDate = new Date();
	var extraMinutes = (50 - ap) * 30;
	var endTime = "";
	var endMinutes = startDate.getHours() * 60 + startDate.getMinutes() + extraMinutes;

	endMinutes -= endMinutes % 30;
	endMinutes = endMinutes % 1440;

	endDate.setSeconds(0);
	endDate.setMinutes(endMinutes % 60);
	endDate.setHours(endMinutes / 60);

	if(endDate.getHours() < 10) endTime += "0";
	endTime += endDate.getHours();
	if(endDate.getMinutes() < 10) endTime += "0";
	endTime += endDate.getMinutes();

	return endTime;
}


// figures out which abilities can be done at this location
function getLocalAbilities() {
	var localAbilities = [];
	localAbilities[0] = document.evaluate("//form[@action and contains(@action,'map.cgi?barricade')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[1] = document.evaluate("//form[@action and contains(@action,'map.cgi?dump')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[2] = document.evaluate("//form[@action and contains(@action,'map.cgi?fixgen')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[3] = document.evaluate("//form[@action and contains(@action,'map.cgi?fixrad')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[4] = document.evaluate("//form[@action and contains(@action,'map.cgi?repair')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[5] = document.evaluate("//form[@action and contains(@action,'map.cgi?close')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[6] = document.evaluate("//form[@action and contains(@action,'map.cgi?in')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[7] = document.evaluate("//form[@action and contains(@action,'map.cgi?out')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[8] = document.evaluate("//form[@action and contains(@action,'map.cgi?groan')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[9] = document.evaluate("//form[@action and contains(@action,'map.cgi?ransack')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[10] = document.evaluate("//form[@action and contains(@action,'map.cgi?rise')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	localAbilities[11] = document.evaluate("//form[@action and contains(@action,'map.cgi?search')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	for(var i = 0; i < localAbilities.length; i++) {
		if(localAbilities[i].snapshotLength == 1) localAbilities[i] = localAbilities[i].snapshotItem(0);
		else localAbilities[i] = null;
	}
	return localAbilities;
}


// grabs the dump link
function getDumpButton() {
	var dumpForms = document.evaluate("//form[@action and contains(@action,'dump')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	if(dumpForms.snapshotLength > 0) return dumpForms.snapshotItem(0);
	else return null;
}


// grabs the location's name
function getBlockName() {
	var bs = document.evaluate("//td[@class='gp']/div[@class='gt']/b", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	if(bs.snapshotLength === 0) return -1;
	else return bs.snapshotItem(0).innerHTML;
}







// provide variables for accessing the data easily
var stats = getStats();
var character = getCharacter();
var localAbilities = getLocalAbilities();

var hp = stats[0];
var xp = stats[1];
var ap = stats[2];
var human = stats[3] === false ? true : false;
var zombie = !human && hp > 0 ? true : false;
var dead = zombie || hp === 0 ? true : false;
var alive = human;
var infected = stats[4];
var page = getPage();
var cades = getCades();
var charName = character[0];
var profileLink = character[1];
var charID = character[2];

var barricadeButton = localAbilities[0];
var dumpButton = localAbilities[1];
var fixGenButton = localAbilities[2];
var fixRadButton = localAbilities[3];
var repairButton = localAbilities[4];
var closeButton = localAbilities[5];
var enterButton = localAbilities[6];
var exitButton = localAbilities[7];
var groanButton = localAbilities[8];
var ransackButton = localAbilities[9];
var riseButton = localAbilities[10];
var searchButton = localAbilities[11];
var canBarricade = localAbilities[0] === null ? false : true;
var canDump = localAbilities[1] === null ? false : true;
var canFixGen = localAbilities[2] === null ? false : true;
var canFixRad = localAbilities[3] === null ? false : true;
var canRepair = localAbilities[4] === null ? false : true;
var canClose = localAbilities[5] === null ? false : true;
var canEnter = localAbilities[6] === null ? false : true;
var canExit = localAbilities[7] === null ? false : true;
var canGroan = localAbilities[8] === null ? false : true;
var canRansack = localAbilities[9] === null ? false : true;
var canRise = localAbilities[10] === null ? false : true;
var canSearch = localAbilities[11] === null ? false : true;

var blockName = getBlockName();













var barSize = 163;
var secondButtonBarUsed = false;
if(page == "city" || page == "skills" || page == "contacts" || page == "profile" || page == "your profile" || page == "settings") createMenuBar();

function createMenuBar() {
	var newMenu = document.createElement('div');
	var topBar = document.createElement('div');
	var botBar = document.createElement('div');
	var characterBox = document.createElement('div');
	var buttonBox = document.createElement('div');
	var secondButtonBox = document.createElement('div');

	document.body.insertBefore(newMenu,document.body.firstChild);
    newMenu.id="barrista";
	newMenu.setAttribute('style','margin: 0px 1px 0px 1px; height: 43px; width: 100%;');
	topBar.setAttribute('style','height: 28px; width: 100%; border: #454 solid 1px; border-width: 0px 0px 1px 0px; background-color: #232;');
	botBar.setAttribute('style','height: 15px; width: 100%;');
	document.body.setAttribute('style','margin: 0px 0px 0px 0px; padding: 0px;');

	buttonBox.setAttribute('style', 'margin: 0px; position: relative; float: right;');
	secondButtonBox.setAttribute('style', 'margin: 0px; position: relative; float: left;');

    var dumbwitType = "iSpy";
	if(page == "city") {
        var mainTable = document.evaluate("//table", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        mainTable.setAttribute('style', 'margin-top: -15px;');
        characterBox.id="barristacharbox";
		characterBox.setAttribute('style', 'margin: 0px 2px 0px 2px; height: 25px; position: relative; float: left;');
		addCharInfo(characterBox);
		newMenu.appendChild(characterBox);
		addCadeInfo(newMenu);

		if(canSearch) {
			addButtonToMenu('Search the area', 'map.cgi?search', secondButtonBox, true, false);
			remove(searchButton);
		}

		if(dead) addButtonToMenu('Stand up', 'map.cgi?rise', secondButtonBox, true, false);

		if(canDump) {
			addButtonToMenu('Dump body', 'map.cgi?dump', secondButtonBox, true, false);
			remove(dumpButton);
		}

		if(canEnter) {
			addButtonToMenu('Enter ' + blockName, 'map.cgi?in', secondButtonBox, true, false);
			remove(enterButton);
		}
		else if(canExit) {
			addButtonToMenu('Exit ' + blockName, 'map.cgi?out', secondButtonBox, true, false);
			remove(exitButton);
		}

		addButtonToMenu('REFRESH', 'map.cgi?zoom', buttonBox, true, true);
	}
	else {
		if(page == "profile" || page == "your profile") {
            addButtonToMenu('ADD CONTACT', 'contacts.cgi?sort=colour&add=' + charID, buttonBox, true, true);
			addButtonToMenu('ROGUE\'S GALLERY', 'http://rg.urbandead.net/profiles/view/' + charID, buttonBox, true, true);
			addButtonToMenu('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', '', buttonBox, false, true);
			dumbwitType += "PROFILE";
		}
        else if(page=="skills")
        {
            var h1 = document.evaluate("//h1", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
            h1.setAttribute('style', 'margin-top: -15px;');
        }

        if(page == "profile" || page == "your profile" || page == "contacts")
        {
            var profileDiv = document.evaluate("//div[@class='gp']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
            profileDiv.setAttribute('style', 'margin-top: -15px;');
        }
		addButtonToMenu('CITY', 'map.cgi?zoom', buttonBox, true, true);
	}

    addButtonToMenu('iSpy', dumbwitType, buttonBox, true, true);
	addButtonToMenu('WIKI', 'http://wiki.urbandead.com/', buttonBox, true, true);
	addButtonToMenu('SKILLS', 'skills.cgi', buttonBox, true, true);
	addButtonToMenu('CONTACTS', 'contacts.cgi?sort=colour', buttonBox, true, true);
	addButtonToMenu('SETTINGS', 'profile.cgi?mode=edit&id=' + charID, buttonBox, (page=="city" || page=="your profile" || page=="settings"), true);
	addButtonToMenu('LOGOUT', 'map.cgi?logout', buttonBox, true, true);

	topBar.appendChild(buttonBox);
	botBar.appendChild(secondButtonBox);
	newMenu.appendChild(topBar);
	newMenu.appendChild(botBar);
	removeButtons();
	removeGT();
}


function addCharInfo(characterBox) {
	var characterNameXP = document.createElement('div');
	var bars = document.createElement('div');
	var characterLink = document.createElement('a');
	var apBar = document.createElement('div');
	var apBarFill = document.createElement('div');
	var apBox = document.createElement('div');
	var hpBar = document.createElement('div');
	var hpBarFill = document.createElement('div');
	var hpBox = document.createElement('div');
	var xpBox = document.createElement('div');
	var apRecoveryXP = document.createElement('p');
	var xpLink = document.createElement('a');
	var apMax = 50;
	var hpMax = 60;

	if(ap != 99) apBox.innerHTML = ap + "AP";
	else {
		apBox.innerHTML = "AP";
		ap = 0;
	}

	if(hp != -1) hpBox.innerHTML = hp + "HP";
	else {
		hpBox.innerHTML = "HP";
		hp = 0;
	}

	// Fill the bars with various colors, depending on the ap/hp levels
    var apColor = '#f00';
	if(ap > 20) apColor = '#345';
	else if(ap >= 10) apColor = interpolateColor(ap, 20, 255, 0, 0, 171, 68, 85);
	else apColor = '#f00';

    var hpColor = '#f00';
	if(infected) hpColor = interpolateColor(hp, hpMax, 80, 140, 50, 100, 255, 0);		// special case: INFECTED
	else if(hp > 30) hpColor = '#898';
	else if(hp >= 10) hpColor = interpolateColor(hp, hpMax-30, 255, 0, 40, 230, 153, 136);
	else hpColor = '#f00';

	// Make the borders of the bars look duller as the bars get emptied
    var apBorder = '#bcb';
	if(ap >= 10 || ap === 0) apBorder = '#bcb';
	else apBorder = interpolateColor(ap, apMax, 136, 153, 136, 187, 204, 187);

    var hpBorder = '#bcb';
	if(infected) hpBorder = '#0f0';								// special case: INFECTED
	else if(hp > 30 || hp === 0) hpBorder = '#bcb';
	else hpBorder = interpolateColor(hp, hpMax-30, 136, 153, 136, 187, 204, 187);

    var apRightBorder = "";
    var hpRightBorder = "";
	if(ap < apMax && ap > 0) apRightBorder = "border-right: #fff solid 1px; ";
	if(hp < hpMax && hp > 0) hpRightBorder = "border-right: #fff solid 1px; ";

	if(xp != -1) {
		if(xp >= 1000) {
			var exact = false;
			if(Math.round(xp/1000) == xp/1000) exact = true;
			xpLink.innerHTML = (exact ? "" : "~") + Math.floor(xp/100)/10 + "K XP";
		}
		else xpLink.innerHTML = xp + "XP";
	}
	else xpLink.innerHTML = "XP";
	xpLink.href = "skills.cgi";
	apRecoveryXP.innerHTML = calculateTimeAtFullAP() + "|";

    characterNameXP.id="barristacharinfo";
	characterNameXP.setAttribute('style','margin: 0px; height: 27px; float: left; text-align: right; overflow: hidden; padding: 1px 5px 0px 5px; font-size: .7em; font-weight: bold;');
	apRecoveryXP.setAttribute('style', 'margin: 0px;');

    bars.id="barristabar";
	bars.setAttribute('style', 'margin: 0px; height: 25px; float: left;');

    apBar.id="barristaap";
	apBar.setAttribute('style','margin: 0px; height: 10px; width: ' + (barSize+28) + 'px; border: ' + apBorder + ' solid 1px; float: left; position: relative; top: 1px; background-color: #454;');

    hpBar.id="barristahp";
	hpBar.setAttribute('style','margin: 0px; height: 10px; width: ' + (barSize+28) + 'px; border: ' + hpBorder + ' solid 1px; float: left; position: relative; top: 2px; background-color: #454; clear: left;');

    apBox.id="barristaaptext";
	apBox.setAttribute('style','margin: 0px; height: 100%; width: 24px; position: relative; float: left; color: #fff; font-size: 9px; text-align: right; padding-right: 3px; border-right: #fff solid 1px; background-color: #454;');

    hpBox.id="barristahptext";
	hpBox.setAttribute('style','margin: 0px; height: 100%; width: 24px; position: relative; float: left; color: ' + (infected ? '#0f0' : '#fff') + '; font-size: 9px; text-align: right; padding-right: 3px; border-right: #fff solid 1px; background-color: #454;');

    apBarFill.id="barristaapbar";
	apBarFill.setAttribute('style','margin: 0px; height: 100%; width: ' + (ap/apMax * barSize) + 'px; position: relative; float: left; background-color: ' + apColor + ';' + apRightBorder);

    hpBarFill.id="barristahpbar";
	hpBarFill.setAttribute('style','margin: 0px; height: 100%; width: ' + (hp/hpMax * barSize) + 'px; position: relative; float: left; background-color: ' + hpColor + ';' + hpRightBorder);

	characterLink.innerHTML = charName + '<br />';
	characterLink.className = "barristaCharName";
	characterLink.href = profileLink;

	apBar.appendChild(apBox);
	hpBar.appendChild(hpBox);
	apBar.appendChild(apBarFill);
	hpBar.appendChild(hpBarFill);

	characterNameXP.appendChild(characterLink);
	bars.appendChild(apBar);
	characterNameXP.appendChild(apRecoveryXP);
	bars.appendChild(hpBar);
	apRecoveryXP.appendChild(xpLink);
	characterBox.appendChild(characterNameXP);
	characterBox.appendChild(bars);
}


function addCadeInfo(newMenu) {
	var cadeColors = [];

	if(cades == -1) return;

	cadeColors[0] = "#333";
	cadeColors[1] = "#a00";
	cadeColors[2] = "#f33";
	cadeColors[3] = "#fa3";
	cadeColors[4] = "#ff3";
	cadeColors[5] = "#af3";
	cadeColors[6] = "#3fa";
	cadeColors[7] = "#3ff";
	cadeColors[8] = "#3af";
	cadeColors[9] = "#bcb";

    var cadeBlock;
    var cadeBorder;
    var size;

	if(canBarricade) {
		cadeBlock = document.createElement('a');
		cadeBorder = "3px double #232";
		cadeBlock.href = barricadeButton.action;
		remove(barricadeButton);
		size = 19;
		if(canBarricade)
			cadeBlock.innerHTML = "cade";
		else
			cadeBlock.innerHTML = "close";
		cadeBlock.className = "barricade";
		cadeBlock.setAttribute("onmouseover", 'this.style.backgroundColor = "#fff"');
		cadeBlock.setAttribute("onmouseout", 'this.style.backgroundColor = "' + cadeColors[cades] + '"');
	}
	else {
		cadeBlock = document.createElement('div');
		cadeBorder = "1px solid #bcb";
		size = 23;
	}

    cadeBlock.id="barristabarricade";
	cadeBlock.setAttribute('style','display: block; margin: 0px; height: ' + size + 'px; width: ' + size + 'px; position: relative; float: left; top: 1px; border: ' + cadeBorder + '; background-color: ' + cadeColors[cades] + '; color: #232; font-size: 9px; text-align: center;');

	newMenu.appendChild(cadeBlock);
}


function addButtonToMenu(name, link, buttonBox, valid, top) {
	var styles = [];
	var styleCounter = 0;

	styles[0] = 'display: block; position: relative; float: left; font-size: 15px; padding: 5px 1em 5px 1em; border-left: 1px solid #454; border-right: 1px solid #898; font-weight: 500;';
	styles[1] = 'position: relative; float: left; font-size: 15px; padding: 5px 1em 5px 1em; border-left: 1px solid #454; border-right: 1px solid #898; font-weight: 400; background-color: #444; color: #666;';
	styles[2] = 'display: block; position: relative; float: left; font-size: 9px; padding: 2px .5em 2px .5em; border-left: 1px solid #454; border-right: 1px solid #898; border-bottom: 1px solid #454; font-weight: 500; background-color: #232;';
	styles[3] = 'position: relative; float: left; font-size: 9px; padding: 5px 1em 5px 1em; border-left: 1px solid #454; border-right: 1px solid #454; border-bottom: 1px solid #454; font-weight: 400; background-color: #444; color: #666;';

	if(!top) {
		styleCounter = 2;
		secondButtonBarUsed = true;
	}

    var button;
	if(valid) {
		button = document.createElement('a');

		button.setAttribute('style', styles[0 + styleCounter]);
		button.setAttribute("onmouseover", "this.style.backgroundColor = '#676'");
		button.setAttribute("onmouseout", "this.style.backgroundColor = '#232'");

        // If this is a dumbwit link, set up a special onclick event, otherwise set the link as the href
        if( link == "iSpy" )
        {
            button.setAttribute("onclick", "exportToDumbwit(btoa(unescape(encodeURIComponent(document.body.innerHTML))),window.document.lastModified,'ead.com/map.c')");
            button.href = "#";
        }
        else if( link == "iSpyPROFILE" )
        {
            button.setAttribute("onclick", "exportToDumbwit(btoa(unescape(encodeURIComponent(document.body.innerHTML))),window.document.lastModified,'ead.com/profile.c')");
            button.href = "#";
        }
        else
        {
            button.href = link;
        }
		button.className = "barristaButton";
	}
	else {
		button = document.createElement('div');
		button.setAttribute('style', styles[1 + styleCounter]);
	}

	button.innerHTML = name;
	buttonBox.appendChild(button);
}


exportToDumbwit = function(source, lastModified, hrefCheck)
{
    var dwDate = new Date();
    var dwWindow = window.open('', dwDate.toString().replace(/[\W]/g, ''));
    var dwComments = prompt("Comment for the Dumbwit (may be left blank):");
    dwWindow.document.write("<HTML><BODY><FORM accept-charset='UTF-8' NAME='wF' ACTION='https://ispy.dxavier.net/add/wit.php' METHOD='POST'><INPUT type='hidden' NAME='wP' VALUE='PRIVATE'>Enter iSpy Comment - may be blank</br></br><INPUT NAME='wC' VALUE=''><INPUT type='hidden' NAME='wT' VALUE='" + lastModified + "'><INPUT type='hidden' NAME='wZ' VALUE='" + dwDate.getTimezoneOffset() + "'><INPUT type='hidden' NAME='wV' VALUE='23'><TEXTAREA style='display:none;' NAME='wS'>" + source + "</TEXTAREA><input type='submit'>");
	var u = window.location.href.indexOf(hrefCheck);
    if( 12 < u && u < 18){
	}else{
		alert('Wrong website! This only works on UrbanDead!');
	}
};


function interpolateColor(value, max, r1, g1, b1, r2, g2, b2) {
	var c = [[r1, g1, b1], [r2, g2, b2]];
	var level = value / max;
	var color = '#';

	for (var i = 0; i < 3; ++i)
		color += ('0' + parseInt(c[0][i] + ((c[1][i] - c[0][i]) * level)).toString(16)).substr(-2);

	return color;
}


function removeButtons() {
	var pars = document.evaluate("//a[@class='y']/parent::p", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	if(pars.snapshotLength !== 0)
		for(var i = 0; i < pars.snapshotLength; i++) {
			remove(pars.snapshotItem(i));
		}
}


function removeGT() {
	var pars = document.evaluate('//tr/td[@class="cp"]/div[@class="gt"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(pars.snapshotLength !== 0) {
		var spacer = document.createElement('div');
		spacer.setAttribute('style', 'margin: 0px; height: 14px; width: 100%;');
		if(secondButtonBarUsed) pars.snapshotItem(0).parentNode.insertBefore(spacer, pars.snapshotItem(0).parentNode.childNodes[0]);
		remove(pars.snapshotItem(0));
	}
}


function remove(removeTarget) {
	removeTarget.setAttribute('style','display: none;');
}