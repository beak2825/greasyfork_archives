// ==UserScript==
// @name           chud
// @namespace      http://userscripts.org/users/72447
// @author         haliphax (http://userscripts.org/users/72447)
// @contributor    jimflexx (http://userscripts.org/users/117383)
// @description    Caddy Healer for Urban Dead
// @include        http://urbandead.com/map.cgi*
// @include        http://www.urbandead.com/map.cgi*
// @version 0.0.1.20210919202127
// @downloadURL https://update.greasyfork.org/scripts/432667/chud.user.js
// @updateURL https://update.greasyfork.org/scripts/432667/chud.meta.js
// ==/UserScript==


// sort characters array based on hp (characters[i][2])
function sortCharacters(a, b)
{
	return (a[2] - b[2]);
}


// displays the caddy
function displayCaddy(characters)
{
	var canFAK = false;
	var fakButton = document.evaluate("//form[@action and contains(@action,'use-h')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	if(fakButton.snapshotLength > 0) {
		canFAK = true;
		fakButton = fakButton.snapshotItem(0);
	}

	var weapons = getWeapons();
	var canPunch = weapons[0] == null ? false : true;
	var canKnife = weapons[1] == null ? false : true;
	var canPistol = weapons[2] == null ? false : true;
	var canShotgun = weapons[3] == null ? false : true;
	var canAxe = weapons[4] == null ? false : true;
	var canMaul = weapons[5] == null ? false : true;
	var canTeeth = weapons[6] == null ? false : true;
	var canDrag = weapons[7] == null ? false : true;

	var caddyMain = document.createElement('div');
	caddyMain.setAttribute('style','background-color: #556655; color: #fbb; border-width: 4px; border-style: solid; border-color: #454; padding: 4px 7px 2px 7px; margin-top: 5px; margin-bottom: 5px;');

	for(var i = 0; i < characters.length; i++) {
		var character = document.createElement('div');
		character.setAttribute('style','clear: both; margin: 2px 0px 3px 0px;');

		// Create the appropriate buttons
		createButton(canKnife, character, characters[i], "K", "knife", "Stab", "#933", "#111", "#fff", "#fff", "#fff", "map.cgi", "weapon", "knife");
		createButton(canAxe, character, characters[i], "A", "axe", "Hack", "#663", "#111", "#fff", "#fff", "#fff", "map.cgi", "weapon", "axe");
		createButton(canPistol, character, characters[i], "P", "pistol", "Shoot", "#366", "#111", "#fff", "#fff", "#fff", "map.cgi", "weapon", "pistol");
		createButton(canShotgun, character, characters[i], "S", "shotgun", "Blast", "#396", "#111", "#fff", "#fff", "#fff", "map.cgi", "weapon", "shotgun");
		createButton(canMaul, character, characters[i], "C", "maul", "Claw", "#396", "#111", "#fff", "#fff", "#fff", "map.cgi", "weapon", "maul");
		createButton(canTeeth, character, characters[i], "B", "teeth", "Bite", "#396", "#111", "#fff", "#fff", "#fff", "map.cgi", "weapon", "teeth");
		createButton(characters[i][2] <= 12 && canDrag, character, characters[i], "D", "drag", "Drag", "#396", "#111", "#fff", "#fff", "#fff", "map.cgi", "weapon", "drag");
		createButton(canFAK, character, characters[i], "+", "heal", "Heal", "#393", "#9e9", "#ded", "#fff", "#ded", fakButton.action, null, null);

		// Create the HP display, color-coded by value
		var characterHP = document.createElement('span');
		var inf = characters[i][4].indexOf("class=\"inf\"") != -1 ? true : false;
		characterHP.innerText = " " + characters[i][2] + " ";
		characterHP.setAttribute('style','color: ' + getHPColor(characters[i][2], inf) + '; width: 4em;');
		character.appendChild(characterHP);

		// Create the character's name, with appropriate links and Contact colors
		var characterName = document.createElement('a');
		characterName.innerHTML = characters[i][1];
		characterName.href = "profile.cgi?id=" + characters[i][0];
		if(characters[i][3] != null) characterName.className = characters[i][3];
		character.appendChild(characterName);

		caddyMain.appendChild(character);
	}

	var pars = document.evaluate('//tr/td[@class="cp"]/div[@class="gt"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(pars.snapshotLength != 0) {
		pars.snapshotItem(0).parentNode.appendChild(caddyMain);
	}

}


// simply creates a button with the given parameters
function createButton(able, character, characters, displayText, buttonType, titleText, defColor, hovColor, textColor, hovTextColor, borderColor, buttonAction, inputName, inputValue) {
	if(!able) return;

	var characterForm = document.createElement('form');
	characterForm.innerHTML = displayText;
	characterForm.setAttribute("onmouseover", "this.style.backgroundColor = '" + hovColor + "'; this.style.color = '" + hovTextColor + "'");
	characterForm.setAttribute("onmouseout", "this.style.backgroundColor = '" + defColor + "'; this.style.color = '" + textColor + "'");
	characterForm.setAttribute("onclick",  'chud' + buttonType + '_' + characters[0] + '.submit()', false);
	characterForm.setAttribute('style','height: 1em; clear: none; border: ' + borderColor + ' solid 1px; background-color: ' + defColor + '; padding: 0px 2px 0px 2px; margin-right: 1px; text-align: center; cursor: pointer; color: ' + textColor + ';');
	characterForm.name = "chud" + buttonType + "_" + characters[0];
	characterForm.action = buttonAction;
	characterForm.method = "post";
	characterForm.title = titleText;

	var characterTarget = document.createElement('input');
	characterTarget.setAttribute("type", "hidden");
	characterTarget.name = "target";
	characterTarget.value = characters[0];

	var otherInput = document.createElement('input');
	otherInput.setAttribute("type", "hidden");
	otherInput.name = inputName;
	otherInput.value = inputValue;

	characterForm.appendChild(characterTarget);
	characterForm.appendChild(otherInput);
	character.appendChild(characterForm);
}


// generates a color for HP based on its value
function getHPColor(hp, inf) {
	var level = hp / 60;
	var color = '#';

	if(inf) var c = [[170, 180, 70], [120, 240, 40]];
	else var c = [[255, 40, 60], [240, 175, 120]];
	
	for (var i = 0; i < 3; ++i)
		color += ('0' + parseInt(c[0][i] + ((c[1][i] - c[0][i]) * level)).toString(16)).substr(-2);
	
	return color;
}


// finds all of the weapons you can use
function getWeapons() {
	var weapons = new Array();
	weapons[0] = document.evaluate("//option[@value and contains(@value,'punch')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

	if(weapons[0].snapshotLength > 0) {
		weapons[1] = document.evaluate("//option[@value and contains(@value,'knife')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		weapons[2] = document.evaluate("//option[@value and contains(@value,'pistol')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		weapons[3] = document.evaluate("//option[@value and contains(@value,'shotgun')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		weapons[4] = document.evaluate("//option[@value and contains(@value,'axe')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}
	else {
		weapons[5] = document.evaluate("//option[@value and contains(@value,'maul')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		weapons[6] = document.evaluate("//option[@value and contains(@value,'teeth')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		weapons[7] = document.evaluate("//option[@value and contains(@value,'drag')]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}
	
	for(var i = 0; i < weapons.length; i++) {
		if(weapons[i] != null && weapons[i].snapshotLength > 0) weapons[i] = weapons[i].snapshotItem(0);
		else weapons[i] = null;
	}
	return weapons;
}


// main script body
var pnRegex = /<a.*?href="profile.cgi\?id=(\d+)"(?:\sclass="(.*?)")?>(.*?)<\/a>.*?\((\d+)<sub/gi;
var matches = null;

var characters = new Array();
var i = 0;
matches = pnRegex.exec(document.body.innerHTML);

while(matches != null) {
	if (matches[0].indexOf("class=\"trg\"")!=-1 || matches[0].indexOf("class=\"inf\"")!=-1) {
		characters[i] = new Array();
		characters[i][0] = matches[1]; // profile id
		characters[i][1] = matches[3]; // name
		characters[i][2] = matches[4]; // hit points
		characters[i][3] = matches[2]; // href class (color)
		characters[i][4] = matches[0]; // hp class
		i++;
	}
	else if(matches[4] != 60 && matches[4] != 50) {
		characters[i] = new Array();
		characters[i][0] = matches[1]; // profile id
		characters[i][1] = matches[3]; // name
		characters[i][2] = matches[4]; // hit points
		characters[i][3] = matches[2]; // href class (color)
		characters[i][4] = matches[0]; // hp class
		i++;
	}
	matches = pnRegex.exec(document.body.innerHTML);
}

if(characters.length > 0) {
	characters.sort(sortCharacters);
	displayCaddy(characters);
}
