// ==UserScript==
// @name          Hentaiverse Equipment Comparison
// @namespace     HVEquipCompare
// @description   Allows to compare pieces of equipment. (modified by sssss2)
// @match         http://*.hentaiverse.org/?s=Bazaar&ss=es*
// @match         http://*.hentaiverse.org/?s=Character&ss=eq*
// @match         http://*.hentaiverse.org/pages/showequip.php?eid=*&key=*
// @match         http://*.hentaiverse.org/?s=Forge&ss=*
// @match         http://*.hentaiverse.org/?s=Battle&ss=iw*
// @match         http://*.hentaiverse.org/?s=Bazaar&ss=lt*
// @match         http://*.hentaiverse.org/?s=Bazaar&ss=la*
// @match         http://*.hentaiverse.org/?s=Character&ss=in
// @match         http://*.hentaiverse.org/?s=Bazaar&ss=mm*
// @match         https://ehwiki.org/wiki/Equipment_Ranges?where=*
// @match         https://ehwiki.org/wiki/Equipment_Ranges_*
// @version       0.6.5.3
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/23982/Hentaiverse%20Equipment%20Comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/23982/Hentaiverse%20Equipment%20Comparison.meta.js
// ==/UserScript==

/*
	Cheat-sheet
	f: forum link
	h: HTML link
	r: open Wiki page

	t: original base
	b: current base (original + forge/IW)
	y: original base vs. {SEMLP}Max
	i: original base lv scale
	o: original base compare
	p: original base lv scale compare

	e: level 0 stat compare, +forge/IW
	q: direct stat compare, +forge/IW
	u: stat scale with your level

	w: compare stats (+forge/IW) vs. {SEMLP}Max
	
	n: switch wiki base data 21 January 2015 and 6 April 2016
*/

/*
Changes:

* 0.6.5.3
	- Update to Wiki Ranges data (31 May 2016)

* 0.6.5.2
	- Added " N " hotkey to switch wiki base data 21 January 2015 and 6 April 2016.
	-- default use new data and option is not stored. If page reloaded, base data will use new data.
	- Added " P " hotkey to calculate approximate base values before forge|iw (not sure about iw part), scale with your level and then compare.
	-- work only on pages where you can see "Upgrades and Enchantments"

* 0.6.5.1
	- Update to Wiki Ranges data (6 April 2016)
	- Added Oak Staff Counter-Resist.

* 0.6.5.0
	- Update to Wiki Ranges data (13 March 2016)
	- Fixed 'R' key for Leather and Shade Helmet, Plate Cuirass.
	- Fixed switchslot bug.

* 0.6.4.9
	- Fixed bug none effect Damage Mitigations by forge base.
	- Change EHWiki URL to https.

* 0.6.4.8
	- Update to Wiki Ranges data (17 February 2016)
	- Added "Counter-Resist", "Attack Crit Damage" and "Spell Crit Damage".
	- Fixed Wiki Table highlight and scope extends.
	- Fixed Weapon procs level scaling.
	- Fixed mixed use "Cast Speed" and "Casting Speed". ("Cast Speed" is forgebase bug)
	- Base compare code some changed.
		Result means;
			Number: stat does not managed. (except burden and interference)
			'X': have stat, but not have stat's sub type
			'NaN': calculate error

* 0.6.4.7
	- Fixed bug for parsing issue section 'Upgrades and Enchantments'
	- Added " I " hotkey to calculate approximate base values before forge|iw (not sure about iw part) and then scale with your level
	- Added " O " hotkey to calculate approximate base values before forge|iw (not sure about iw part) and then compare; (both equip's original base compare)

* 0.6.4.6
	- sorry fixed some bugs
	- Added " U " hotkey to calculate approximate base values, and then scale with your level
	- Fix code equipment level and potency tier

* 0.6.4.5 by sssss2
	- Added " Y " hotkey to calculate approximate base values before forge|iw (not sure about iw part) and then vs. {SEMLP}Max
	- Replace Equipment Popup Title with Equipment Name

* 0.6.4.4
* 0.6.4.3
	- Partial update to support HV 0.82 - base stats have *not* been updated yet.
	- Tweaked the parser to handle new info and find old info that was moved.
	- Modified stat scaling to use an equip's bind-level when present, and character level otherwise.

* 0.6.4.2
	- Fixed a bunch of regressions in the form of missing/misplaced data (sorry! :( ).

* 0.6.4.1
	- Update to Wiki Ranges data (21 January 2015)
	- Stat list now includes "Attack Crit Damage" and "Spell Crit Damage" data, though neither are used yet.

* 0.6.4.0
	- Update to Wiki Ranges data (26 August 2014)
	- Update to HV 0.81
	- Added " T " hotkey to calculate approximate base values before forge|iw (not sure about iw part)
	-- work only on pages where you can see "Upgrades and Enchantments"
	- Now also compares Durability (max Condition)
*/

var NEW_DATA_DATE = '31 May 2016';
var OLD_DATA_DATE = '21 January 2015';

var Parser, Cruncher, Controller, Formatter, Wiki;

var USE_MULTIPLIER = false;  // true/false

/* * * * * * * * * * * * * * * * * * * * * * * */
Parser = {

	parse: function(source) {

		// decorator for _parseObject
		var result;
		if (source != null && source.constructor == String) {
			var tokens = source.match(/'.+?'/g), temp = document.createElement('div');
			temp.innerHTML = tokens[2].slice(1,tokens[2].length-1);
			result = Parser._parseObject(temp.firstElementChild);
			result.Info.Name = tokens[1].slice(1,tokens[1].length-1);
			return result;
		}

		var equipment = document.getElementById('equipment');
		if (equipment) {
			result = Parser._parseObject(equipment.querySelector('div:first-child'));
			if (document.location.search.indexOf('s=Bazaar&ss=l') >= 0) {
				result.Info.Name = document.querySelector('#leftpane > div:nth-child(2)').textContent;
			}else {
				var nameList, fullName = "", eq;
				eq = document.location.search.indexOf('s=Forge&ss=') >= 0 ? document.getElementById('leftpane') : document.body;
				nameList = eq.getElementsByClassName('fd2');//Have Changed Name
				if (!nameList.length) {
					nameList = eq.getElementsByClassName('fd4');
				}
				if (nameList.length != 0) {
					for (var i = 0; i < nameList.length; i++) fullName = fullName + " " + nameList[i].textContent;
					result.Info.Name = fullName.replace(/^\s+|\s+$/g,"");
				}
				else {
					result.Info.Name = document.querySelector('.fd4').textContent;
				}
			}

			Parser.addUpgrades(result, document);

			return result;
		}

		var popup = document.getElementById('popup_box');
		if (popup.childElementCount) {
			result = Parser._parseObject(document.querySelector('#popup_box > div + div > div'));
			result.Info.Name = document.querySelector('#popup_box > div').textContent;
			return result;
		}
	},

	_parseObject: function(source) {

		var temp;
		if (source.constructor == String) {
			temp = document.createElement('div');
			temp.innerHTML = source;
			return Parser._parseObject(temp);
		}

		var res = { Info: { } }, n = source.childElementCount;
		var section = null, sectionContents = { }, child;
		for (var i = 0; i < n; i++) {
			child = source.children[i];
			// check for equipment procs & info
			if (child.className == 'e1') {
				var tokens;
				if (child.textContent.indexOf('Level') != -1 || child.textContent.indexOf('Soulbound') != -1) {
					// type, assigned level
					tokens = child.textContent.match(/^(.+)\s+(?:Level (\d+)|Level Unassigned|Soulbound)/);
					res.Info.Type = tokens[1].trim();
					if(tokens[2]) {
						res.Info.Level = parseInt(tokens[2]);
					}else {
						if (!Controller.Level) Controller.loadData();
						res.Info.Level = Controller.Level;
					}
				}else if (child.textContent.indexOf('Potency Tier') != -1) {
					// Potency Tier, EXP and Condition
					tokens = child.textContent.match(/Condition: (\d+) \/ (\d+).+Potency Tier: (\d+)\s+(.+)$/);
					res.Info.Durability = parseInt(tokens[2]);
					res.Info.PotencyTier = parseInt(tokens[3],10);
					res.Info.EXP = tokens[4];
				}

				continue;

			}else if (child.className == 'e2') {
				if (child.textContent.indexOf('turn') != -1) {
					// proc type, chance, duration and damage
					tokens = child.textContent.match(/^(.+): ([\d\.]+)%.+(\d+) turns?(?:.+?(\d+)% DOT)?/);
					res.Proc = { Type: tokens[1], Chance: parseFloat(tokens[2]), Duration: parseInt(tokens[3],10) };
					if (tokens[4]) res.Proc.Damage = parseInt(tokens[4],10);
				}else if (child.textContent.indexOf('points') != -1) {
					// siphon type, chance and damage
					tokens = child.textContent.match(/^Siphon (.+): ([\d\.]+)%.+ ([\d\.]+) points/);
					res.Siphon = { Type: tokens[1], Chance: parseFloat(tokens[2]), Damage: parseFloat(tokens[3]) };
				}else if (child.textContent.indexOf('Damage') != -1) {
					// weapon damage and damage type
					tokens = child.textContent.match(/^\+(\d+) (.+) Damage/);
					res.Damage = { Damage: parseInt(tokens[1],10), Type: tokens[2] };
				}else if (child.textContent.indexOf('Strike') != -1) {
					// elemental strike
					res.Info.Element = child.textContent.match(/^(.+) Strike/)[1];
				}

				continue;
			}

			// check for section name
			if (!child.firstElementChild.childElementCount && child.textContent.trim().length) {

				temp = Parser._filterSection(sectionContents, section || 'Stats');
				if (Parser._hasChildren(temp)) // previous section or stats
					res[section || 'Stats'] = temp; // clone

				section = child.firstElementChild.textContent;
				sectionContents = { };
			}

			// retrieve section contents
			var targets = child.getElementsByTagName('div'), target = null, attributeName = null, attributeValue = null;

			for (var j = 0; j < targets.length; j++) {
				target = targets[j];
				if (target.firstElementChild && target.firstElementChild.nodeName == 'DIV') continue;
				if (target.textContent.length == 0) continue;
				if (target.textContent.trim()[0] == '%') continue;

				target = target.textContent.split('+');
				if (target.length > 1 && target[0].length > 0 && target[1].length > 0) {
					attributeName = target[0].trim();
					attributeValue = target[1].trim();
					sectionContents[attributeName] = parseFloat(attributeValue);
				}else {
					if (target.length == 1 || target[0].length > 0) // attribute name
						attributeName = target[0];
					else { // attribute value
						attributeValue = target[1];
						sectionContents[attributeName] = parseFloat(attributeValue);
					}
				}
			}
		}

		temp = Parser._filterSection(sectionContents, section || 'Stats');
		if (Parser._hasChildren(temp)) // last section
			res[section || 'Stats'] = temp; // clone

		return res;
	},

	addUpgrades: function(data, doc) {

		var sectionUpgrades = doc.evaluate('.//div[starts-with(text(),"Upgrades and Enchantments")]',doc,null,9,null).singleNodeValue;
		if (!sectionUpgrades)
			return;
		else
			sectionUpgrades = sectionUpgrades.parentElement;

		// Upgrades
		var x, y, Upgrades = {}, Potencies = {}, Enchantments = {}, i;
		x = sectionUpgrades.querySelectorAll('.eu');
		for (i = 0; i< x.length; i++) {
			if (y = x[i].textContent.match(/^(.+?)\sLv\.(\d+)$/)) {
				Upgrades[y[1]] = parseInt(y[2]);
			}
		}

		data.Upgrades = Upgrades;

		// Potencies
		x = sectionUpgrades.querySelectorAll('.ep');
		for (i = 0; i< x.length; i++) {
			if (y = x[i].textContent.match(/^(.+?)\sLv\.(\d+)$/)) {
				Potencies[y[1]] = parseInt(y[2]);
			}else {
				// Hollowforged
				Potencies[x[i].textContent] = 0;
			}
		}

		data.Potencies = Potencies;

		//* Enchantments
		x = sectionUpgrades.querySelectorAll('.ee');
		for (i = 0; i< x.length; i++) {
			if (y = x[i].textContent.match(/^(.+?)\s\[(\d+)m\]$/)) {
				Enchantments[y[1]] = parseInt(y[2]);
			}
		}

		data.Enchantments = Enchantments;
		//*/

		return data;
	},

	_hasChildren: function(object) {
		if (!object) return false;
		for (var x in object) return true;
		return false;
	},

	_filterSection: function(section,name) {

		if (!section) return null;
		if (!Parser._hasChildren(section)) return null;

		return section;

	}
};

/* * * * * * * * * * * * * * * * * * * * * * * */

Cruncher = {

	// https://ehwiki.org/wiki/Level_Scaling
	scalingFactors: {
		'Stats': {
			'Attack Damage': 16 + 2 / 3,'Magic Damage': 22 + 3 / 4,'Attack Accuracy': 5000,'Magic Accuracy': 5000,
			'Attack Crit Chance': 2000,'Attack Crit Damage': Infinity,'Magic Crit Chance': 2000,'Spell Crit Damage': Infinity,'Block Chance': 2000,
			'Evade Chance': 2000,'Parry Chance': 2000,'Resist Chance': 2000,'Physical Mitigation': 2000,'Magical Mitigation': 2000,
			'Burden': Infinity,'Interference': Infinity,'Mana Conservation': Infinity,
			'Attack Speed': Infinity,'Casting Speed': Infinity,'Counter-Resist':Infinity,'Counter-Parry':Infinity
		},
		'Damage': 16 + 2 / 3,
		'Damage Mitigations': { 'Crushing': Infinity,'Slashing': Infinity,'Piercing': Infinity,'default': Infinity },
		'Proficiency': 35 + 5 / 7,
		'Spell Damage': 200,
		'Primary Attributes': 35 + 5 / 7,
		//'Proc': { 'Duration': 200,'Damage': Infinity,'Chance': Infinity },
		'Proc': { 'Duration': Infinity,'Damage': Infinity,'Chance': Infinity },	// HV 0.82 and later duration does not lavel scaling
		'Siphon': { 'Damage': 25,'Chance': Infinity }
	},

	// https://ehwiki.org/wiki/Equipment_Base_Coefficients
	fluctuation: {
		'Stats': {
			'Attack Damage': 0.854,'Magic Damage': 0.82969,'Attack Accuracy': 0.6069,'Magic Accuracy': 0.491,
			'Attack Crit Chance': 0.105,'Attack Crit Damage': 0.1,'Magic Crit Chance': 0.114,'Spell Crit Damage': 0.1,'Block Chance': 0.998,
			'Evade Chance': 0.25,'Parry Chance': 0.894,'Resist Chance': 0.804,'Physical Mitigation': 0.21,'Magical Mitigation': 0.201,
			'Burden': 0.7,'Interference': 0.7,'Mana Conservation': 1,
			'Attack Speed': 0.481,'Casting Speed': 0.489,'Counter-Resist':1,'Counter-Parry':1},
		'Damage': 0.854,
		'Damage Mitigations': {'Crushing': 0.1549,'Slashing': 0.1529,'Piercing': 0.1499,'Fire': 1,'Cold': 1,'Elec': 1,'Wind': 1,'Holy': 1,'Dark': 1,'default': 1},
		'Proficiency': 0.306,
		'Spell Damage': 0.804,
		'Primary Attributes': 0.3,
		'Proc': {'Duration': 1,'Damage': 1,'Chance': 1},
		'Siphon': {'Damage': 0.01,'Chance': 1}
	},

	scale: function(source) {

		var result = { };
		for (var x in source) {
			result[x] = { };
			var factor = Cruncher.scalingFactors[x] || Infinity, effectiveFactor;
			for (var y in source[x]) {
				if (source[x][y].constructor != Number) {
					result[x][y] = source[x][y];
					continue;
				}
				if (factor.constructor == Number) effectiveFactor = factor;
				else if (factor.hasOwnProperty(y)) effectiveFactor = factor[y];
				else if (factor.hasOwnProperty('default')) effectiveFactor = factor.default;
				else effectiveFactor = Infinity;
				result[x][y] = (source[x][y] / (1 + source.Info.Level / effectiveFactor));
			}
		}
		return result;
	},

	scaleWithLevel: function(source, level) {

		if (!level) return source;
		var result = { };
		for (var x in source) {
			result[x] = { };
			var factor = Cruncher.scalingFactors[x] || Infinity, effectiveFactor;
			for (var y in source[x]) {
				if (source[x][y].constructor != Number) {
					result[x][y] = source[x][y];
					continue;
				}
				if (factor.constructor == Number) effectiveFactor = factor;
				else if (factor.hasOwnProperty(y)) effectiveFactor = factor[y];
				else if (factor.hasOwnProperty('default')) effectiveFactor = factor.default;
				else effectiveFactor = Infinity;
				result[x][y] = (1 + level / effectiveFactor) * source[x][y];
			}
		}
		return result;
	},

	forgeBase: function(source) {
		function DB(base,fluc,forge,iw) {
			iw = iw || 0;
			forge = forge || 0;
			var forgeFactor = 1 + 0.278875 * Math.log(0.1 * forge + 1),
				baseRoll = Math.floor(base / fluc / (1 + iw * 0.02) / forgeFactor);
			return Math.round((baseRoll + (base / fluc - baseRoll * (1 + iw * 0.02) * forgeFactor)) * fluc * 100) / 100;
		}
		function non_DB(base,fluc,forge) {
			var forgeFactor = 1 + 0.2* Math.log(0.1 * forge + 1),
				baseRoll = Math.floor(base / fluc / forgeFactor);
			return Math.round((baseRoll + (base / fluc - baseRoll * forgeFactor)) * fluc * 100) / 100;
		}

		var UpgEnch= {};
		var upEn = { Upgrades: source.Upgrades, Potencies: source.Potencies };
		for (var i in upEn) {
			for (var j in upEn[i]) {
				var elem = j;
				elem = elem.replace(/Physical(?! Defense)/,'Attack').replace(/Magical(?! Defense)/,'Magic').replace('Hit Chance','Accuracy');
				elem= elem.replace('Defense','Mitigation').replace(' Proficiency','').replace(' Bonus','');
				UpgEnch[elem] = parseInt(upEn[i][j]);
			}
		}

		for (var x in source) {
			if (x == 'Info') continue;
			for (var y in source[x]) {
				if (x == "Damage") {
					if (y == "Damage" && (UpgEnch['Attack Damage'] || UpgEnch['Butcher']))
						source[x][y] = DB(source[x][y],Cruncher.fluctuation[x],UpgEnch['Attack Damage'],UpgEnch['Butcher']);
				}
				else if (x == "Stats") {
					if (y == "Attack Damage" && UpgEnch[y]) source[x][y] = DB(source[x][y],Cruncher.fluctuation[x][y],UpgEnch[y]);
					else if (y == "Magic Damage" && (UpgEnch[y] || UpgEnch['Archmage'])) source[x][y] = DB(source[x][y],Cruncher.fluctuation[x][y],UpgEnch[y],UpgEnch['Archmage']);
					else if (y == "Attack Speed" && UpgEnch['Swift Strike']) source[x][y] = source[x][y] - [0,1.92,3.85,5.77,7.7,9.62][UpgEnch['Swift Strike']];
					else if (y == "Casting Speed" && UpgEnch['Spellweaver']) source[x][y] = source[x][y] - [0,1.47,2.93,4.4,5.86,7.34][UpgEnch['Spellweaver']];
					else if (y == "Counter-Resist" && UpgEnch['Penetrator']) source[x][y] = source[x][y] - 4 * UpgEnch['Penetrator'];
					else if (y == "Counter-Parry" && UpgEnch['Overpower']) source[x][y] = source[x][y] - 4 * UpgEnch['Overpower'];
					else if (y == "Attack Crit Damage" && UpgEnch['Fatality']) source[x][y] = source[x][y] - 2 * UpgEnch['Fatality'];
					else if (y == "Spell Crit Damage" && UpgEnch['Annihilator']) source[x][y] = source[x][y] - 2 * UpgEnch['Annihilator'];
					else if (y == "Mana Conservation" && UpgEnch['Economizer']) source[x][y] = source[x][y] - 5 * UpgEnch['Economizer'];
					else if (y == "HP Bonus" && UpgEnch['Juggernaut']) source[x][y] = source[x][y] - 2 * UpgEnch['Juggernaut'];
					else if (y == "MP Bonus" && UpgEnch['Capacitor']) source[x][y] = source[x][y] - 2 * UpgEnch['Capacitor'];
					else if (UpgEnch[y]) source[x][y] = non_DB(source[x][y],Cruncher.fluctuation[x][y],UpgEnch[y]);
				}
				else if (x == "Spell Damage" && UpgEnch[y + ' Spell Damage']) source[x][y] = non_DB(source[x][y],Cruncher.fluctuation[x],UpgEnch[y + ' Spell Damage']);
				else if (x == "Damage Mitigations") {
					if (UpgEnch[y + 'proof']) source[x][y] = source[x][y] - 4 * UpgEnch[y + 'proof'];
					if (UpgEnch[y + ' Mitigation']) source[x][y] = non_DB(source[x][y],Cruncher.fluctuation[x][y],UpgEnch[y + ' Mitigation']);
				}
				else if ((x == "Primary Attributes" || x == "Proficiency") && UpgEnch[y]) source[x][y] = non_DB(source[x][y],Cruncher.fluctuation[x],UpgEnch[y]);
			}
		}
		return source;
	},

	compare: function(a,b) {

		// returns a-b (b = equipped item)
		var result = { }, x, y;

		for (x in a) {
			result[x] = { };
			for (y in a[x]) {
				if (x == 'Info' && y != 'Level' && y != 'PotencyTier' && y != 'Durability')
					result[x][y] = a[x][y];
				else if (!b.hasOwnProperty(x) || !b[x].hasOwnProperty(y)) {
					if (a[x][y].constructor == Number)
						result[x][y] = a[x][y];
					else
						result[x][y] = '!' + a[x][y];
				}
				else if (b[x][y].constructor == Number)
					result[x][y] = a[x][y] - b[x][y];
				else
					result[x][y] = a[x][y] == b[x][y] ? a[x][y] : '!' + a[x][y];
			}
		}

		for (x in b) {
			if (!result.hasOwnProperty(x)) result[x] = { };
			for (y in b[x]) {
				if (result.hasOwnProperty(x) && result[x].hasOwnProperty(y)) continue;
				if (b[x][y].constructor == Number)
					result[x][y] = -b[x][y];
				else
					result[x][y] = '!' + b[x][y];
			}
		}

		return result;

	},

	compareBaseData: function(result) {

		var weaponT, weaponD, x, y, edbT, pref, suff;
		//if(result.Info.PotencyTier == 10 && Controller.popup) return false;
		weaponT = result.Info.Name.match(/Axe|Club|Wakizashi|Dagger|Rapier|Shortsword|Estoc|Mace|Longsword|Katana|Scythe|Katalox|Oak|Redwood|Willow|Buckler|Kite|Force|Tower/);
		//if (!weaponT) weaponT = result.Info.Name.match(/Cotton \w+ |Gossamer \w+ |Phase \w+ |Leather \w+ |Shade \w+ |Plate \w+ |Power \w+ /);
		if (!weaponT) weaponT = result.Info.Name.match(/Cotton \w+|Gossamer \w+|Phase \w+|Leather \w+|Shade \w+|Plate \w+|Power \w+/);	// for HV 0.82 and later
		if (weaponT) weaponT = weaponT[0].trim();
		else return false;

		function CompareWithBaseData(equipData, baseData, multiplier, offset) {
			var resultStr = '', equipResult = '', secondStr = '';
			if (offset === undefined) offset = 0;
			if (!baseData) return equipData.toFixed(2);
			for (var i = 0; i < 5; i++ ) {
				if (baseData.length < i + offset) {
					return 'X';
				}
				var temp = (equipData - baseData[i + offset]).toFixed(2);
				if (isNaN(temp)) {
					return NaN;
				}
				if (USE_MULTIPLIER) equipResult = ((baseData[i + offset] - equipData) / multiplier).toFixed(1);
				else equipResult = (baseData[i + offset] - equipData).toFixed(2);
				if (temp > 0.01) {//±0.01 margin
					//if (i == 4 && baseData[3 + offset] == baseData[4 + offset]) i = 5;//Eq that can't have Peerless, but are Leg+
					if (i == 4 && baseData[3 + offset] == baseData[4 + offset] && /Dagger|Scythe|Tower|Gossamer \w+/.test(result.Info.Name)) i = 5; // HV 0.82 and later can have Peerless
					else continue;
				}
				resultStr = ['S','E','M','L','P','R'][i];
				if (equipResult > 0.01) {//±0.01 margin
					resultStr += '-' + equipResult;
					for (var j = 0; j < 5; j++) {
						temp = (equipData - baseData[j + offset]).toFixed(2);
						if (temp > 0) continue;
						secondStr = ['','S','E','M','L'][i];
						if (secondStr != '' && temp < 0) {
							if (USE_MULTIPLIER) equipResult = ((equipData - baseData[j - 1 + offset]) / multiplier).toFixed(1);
							else equipResult = (equipData - baseData[j - 1 + offset]).toFixed(2);
							if (equipResult > 0) secondStr += '+' + equipResult;
							break;
						}
					}
				}
				break;
			}
			if (secondStr != '' && secondStr != resultStr) resultStr = resultStr + ' ' + secondStr;
			if (resultStr == 'R') resultStr='L+' + equipResult*-1;
			else if (resultStr == '') resultStr='P+' + equipResult*-1;
			return resultStr;
		}

		function GetStarResult(equipData, baseData, multiplier, offset) {
			var resultStr = '';
			if (typeof(equipData) == 'number') resultStr = CompareWithBaseData(equipData, baseData, multiplier, offset);
			else for (var y in equipData) resultStr += CompareWithBaseData(equipData[y], baseData, multiplier) + ' ';
			return resultStr;
		}

		var calcLv1PXP = function(potencyTier,nextPXP) {
			function sign(x) {return Number(x > 0) - Number(x < 0);}//
			function calcPXP(potencyTier,lv1PXP) {return lv1PXP * Math.pow(1 + lv1PXP / 1000,potencyTier - 1);}

			if (potencyTier === 0) return nextPXP - 0.5;
			potencyTier++;
			var prevLv1PXP = 300,
				step = 32,
				lv1PXP, diff, //difference
				prevDiff = nextPXP - calcPXP(potencyTier,prevLv1PXP);
			while (Math.abs(prevDiff) >= 0.5) { //error margin
				lv1PXP = prevLv1PXP + step * sign(prevDiff);
				diff = nextPXP - calcPXP(potencyTier,lv1PXP);
				if (Math.abs(diff) > Math.abs(prevDiff)) step /= 2;
				else {
					if (sign(diff) !== sign(prevDiff)) step /= 2;
					prevLv1PXP = lv1PXP;
					prevDiff = diff;
				}
			}
			return lv1PXP;
		};

		for (x in result) {
			if (x == 'Info' || x == 'Upgrades' || x == 'Potencies' || x == 'Enchantments') continue;
			for (y in result[x]) {
				if (x == "Damage") {
					if (y == "Damage") {
						weaponD = /Slaughter/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData["Attack Damage"][weaponT],0.854,weaponD);
					}
				}
				else if (x == "Primary Attributes") result[x][y] = GetStarResult(result[x][y],Wiki.baseData[x][y][weaponT],0.3);
				else if (x == "Stats") {
					if (y == "Attack Damage") {
						weaponD = /Slaughter/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.854,weaponD);
					}
					else if (y == "Attack Accuracy" || y == "Attack Crit Chance") {
						weaponD = /Balance/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.6069,weaponD);
					}
					else if (y == "Magic Damage") {
						weaponD = /Destruction/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.82969,weaponD);
					}
					else if (y == "Magic Accuracy" || y == "Magic Crit Chance") {
						weaponD = /Focus/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.491,weaponD);
					}
					else if (y == "Physical Mitigation") {
						weaponD = /Protection/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.21,weaponD);
					}
					else if (y == "Magical Mitigation") {
						weaponD = /Warding/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.201,weaponD);
					}
					else if (y == "Evade Chance") {
						weaponD = /Fleet|Shadowdancer/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.25,weaponD);
					}
					else if (y == "Resist Chance") {
						weaponD = /Negation/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.804,weaponD);
					}
					else if (y == "Parry Chance") {
						weaponD = /(Rapier|Wakizashi|Dagger) of the Nimble/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.894,weaponD);
					}
					else if (y == "Block Chance") {
						weaponD = /Barrier/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.998,weaponD);
					}
					else if (y == "Attack Speed" && Wiki.baseData[y][weaponT]) {
						if (!/Swiftness|Agile|Wakizashi|Dagger/.test(result.Info.Name)) continue;
						weaponD = /(Wakizashi|Dagger) of Swiftness/.test(result.Info.Name) ? 5 : 0;
						result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.481,weaponD);
					}
					else if (y == "Casting Speed" && Wiki.baseData[y][weaponT]) result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.489);
					else if (y == "Mana Conservation") {
						if ((/Katalox|Oak|Redwood|Willow/.test(result.Info.Name) && /Focus/.test(result.Info.Name)) || /Battlecaster|Frugal/.test(result.Info.Name))
							result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],1);
					}
					else if (y == "Burden") {
						weaponD = /Mithril/.test(result.Info.Name) ? 2 : 0;
						pref = Wiki.baseData[y][weaponT][weaponD];//min
						suff = Wiki.baseData[y][weaponT][weaponD+1];//max
						result[x][y] = ((result[x][y] - pref)/(suff-pref)*100).toFixed(0) + '%' ;
					}
					else if (y == "Interference") {
						// Battlecaster has no Interference
						//weaponD = /Battlecaster|Arcanist/.test(result.Info.Name) ? 2 : 0;
						weaponD = /Arcanist/.test(result.Info.Name) ? 2 : 0;
						pref = Wiki.baseData[y][weaponT][weaponD];//min
						suff = Wiki.baseData[y][weaponT][weaponD+1];//max
						result[x][y] = ((result[x][y] - pref)/(suff-pref)*100).toFixed(0) + '%' ;
					}
					else if (y == 'Counter-Resist' && Wiki.baseData[y][weaponT]) {
						if (/Oak|Willow/.test(result.Info.Name)) {
							result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],1);
						}
					}else if (y == 'Attack Crit Damage' && Wiki.baseData[y][weaponT]) {
						if (/(Shade|Power) \w+/.test(result.Info.Name)) {
							weaponD = /Savage Power/.test(result.Info.Name) ? 5 : 0;
							result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.1,weaponD);
						}
					}else if (y == 'Spell Crit Damage' && Wiki.baseData[y][weaponT]) {
						if (/Mystic Phase \w+/.test(result.Info.Name)) {
							result[x][y] = GetStarResult(result[x][y],Wiki.baseData[y][weaponT],0.1);
						}
					}
				}
				else if (x == "Proficiency") {
					if (/Katalox|Oak|Redwood|Willow/.test(result.Info.Name) &&
						((y == "Elemental" && /Elementalist/.test(result.Info.Name)) || (y == "Divine" && /Heaven-sent/.test(result.Info.Name)) ||
							(y == "Forbidden" && /Demon-fiend/.test(result.Info.Name)) || (y == "Supportive" && /Earth-walker/.test(result.Info.Name)) ||
							(y == "Deprecating" && /Curse-weaver/.test(result.Info.Name)))) weaponD = 5;
					else if ((y != "Divine" && y != "Forbidden" && weaponT == 'Katalox') || (y != "Elemental" && weaponT == 'Redwood') ||
						(y != "Supportive" && weaponT == 'Oak') || (y != "Deprecating" && weaponT == 'Willow')) weaponD = 10;
					else weaponD = 0;
					result[x][y] = GetStarResult(result[x][y],Wiki.baseData[x][weaponT],0.306,weaponD);
				}
				else if (x == "Spell Damage") {
					weaponD = 0;
					if (/Katalox|Oak|Redwood|Willow/.test(result.Info.Name)) {
						edbT = ['Holy','Dark','Fire','Cold','Wind','Elec'].indexOf(y);
						suff = result.Info.Name.indexOf(['Heimdall','Fenrir','Surtr','Niflheim','Freyr','Mjolnir'][edbT]) >= 0;//has maching suffix
						pref = result.Info.Name.indexOf(['Hallowed','Demonic','Fiery','Arctic','Tempestuous','Shocking'][edbT]) >= 0;//has maching prefix
						//Katalox|Oak|Redwood:[0: without Prefix + non Suffix; 5: with Prefix + non Suffix; 10: Prefix not matching to staff (ex. Hallowed Redwood);
						//15: with Prefix + Matching Suffix; 20: without Prefix + Matching Suffix; 25: Cold/Fire (with Prefix) only Oak; 30: Cold/Fire (without Prefix) only Oak]
						//Willow:[0: Dark (Without Prefix); 5: Dark (With Prefix); 10: Cold/Fire/Holy (With Prefix); 15: Elec/Wind (With Prefix); 20: Elec/Wind (Without Prefix)]
						// Staff EDB combinations
						// Staff None EDB w Prefix
						// Staff Mid  EDB
						// Staff Mid  EDB w Prefix
						// Staff Mid  EDB w Suffix
						// Staff Mid  EDB w Prefix w Suffix
						// Staff Low  EDB
						// Staff Low  EDB w Prefix
						// Staff High EDB
						// Staff High EDB w Prefix
						// Staff High EDB w Suffix
						// Staff High EDB w Prefix w Suffix
						// --------------------------------------------------------------------------------
						// Staff EDB cases are only have Mid EDB or have High EDB and Low EDB
						// replace High/Mid EDB with Major EDB, replace Low EDB with Minor EDB
						// Staff EDB combinations
						//  0: Staff Major EDB
						//  5: Staff Major EDB w Prefix
						// 10: Staff None  EDB w Prefix
						// 15: Staff Major EDB w Prefix w Suffix / Staff Minor EDB w Prefix (only Willow)
						// 20: Staff Major EDB w Suffix / Staff Minor EDB (only Willow)
						// 25: Staff Minor EDB w Prefix (only Oak)
						// 30: Staff Minor EDB (only Oak)

						if (suff) {
							if (pref) weaponD = 15;
							else weaponD = 20;
						}
						else {
							if (weaponT == "Katalox") {
								if (edbT > 1) weaponD = 10;//elem (only with prefix)
								else if (pref) weaponD = 5;//else weaponD = 0;
							}
							else if (weaponT == "Redwood") {
								if (edbT < 2) weaponD = 10;//holy|dark (only with prefix)
								else if (pref) weaponD = 5;//else weaponD = 0;
							}
							else if (weaponT == "Oak") {
								if (edbT == 0) {
									if (pref) weaponD = 5;//else weaponD = 0;
								}
								else if (edbT == 1 || edbT == 4 || edbT == 5) weaponD = 10;//(only with prefix)
								else if (pref) weaponD = 25;//Cold|Fire
								else weaponD = 30;
							}
							else if (weaponT == "Willow") {
								if (edbT == 1) {
									if (pref) weaponD = 5;//else weaponD = 0;
								}
								else if (edbT == 0 || edbT == 2 || edbT == 3) weaponD = 10;//(only with prefix)
								else if (pref) weaponD = 15;//Wind|Elec
								else weaponD = 20;
							}
						}
					}
					result[x][y] = GetStarResult(result[x][y],Wiki.baseData[x][weaponT],0.804,weaponD);
				}
				else if (x == "Damage Mitigations") {
					if (/Fire|Cold|Elec|Wind|Holy|Dark/.test(y)) {
						edbT = 1;
						if ((y == "Fire" && /Ruby/.test(result.Info.Name)) || (y == "Cold" && /Cobalt/.test(result.Info.Name)) ||
							(y == "Elec" && /Amber/.test(result.Info.Name)) || (y == "Wind" && /Jade/.test(result.Info.Name)) ||
							(y == "Holy" && /Zircon/.test(result.Info.Name)) || (y == "Dark" && /Onyx/.test(result.Info.Name))) weaponD = 0;
						else continue;
					}
					else if (y == 'Crushing') {
						edbT = 0.1549;
						weaponD = /Dampening/.test(result.Info.Name) ? 20 : 5;
					}
					else if (y == 'Slashing') {
						edbT = 0.1529;
						weaponD = /Stoneskin/.test(result.Info.Name) ? 25 : 10;
					}
					else if (y == 'Piercing') {
						edbT = 0.1499;
						weaponD = /Deflection/.test(result.Info.Name) ? 30 : 15;
					}
					//if (/Reinforced/.test(result.Info.Name)) weaponD += weaponT.indexOf('Leather') >= 0 ? 30 : 15; // Leather|Kite : Buckler
					if (/Reinforced/.test(result.Info.Name)) weaponD += /Leather|Kite/.test(weaponT) ? 30 : 15; // Leather|Kite : Buckler
					result[x][y] = GetStarResult(result[x][y],Wiki.baseData[x][weaponT],edbT,weaponD);
				}
			}
		}
		if (!result['Primary Attributes']) result['Primary Attributes'] = {};
		var shield = (result.Info.Type == 'Shield' && Object.keys(result['Primary Attributes']).length > 2);
		for (y in Wiki.baseData["Primary Attributes"]) {
			if (Wiki.baseData["Primary Attributes"][y][weaponT] && !result['Primary Attributes'][y]) {
				if (!shield && !(/Intelligence|Wisdom/.test(y) && /Shade/.test(result.Info.Name) && !/Arcanist/.test(result.Info.Name))) {
					result['Primary Attributes'][y] = '※※※';
				}
			}
		}
		if (result.Info.PotencyTier < 10) {
			suff = Number(result.Info.EXP.match(/(\d+) \/ (\d+)/)[2]);
			x = result.Info.PotencyTier > 0 ? Math.ceil(calcLv1PXP(result.Info.PotencyTier, suff)) : suff;
			y = Math.round(75 * Math.pow((x - 100) / 250,3));
			if (y < 10) y = 10;
			else if (y > 100) y = 100;
			result.Info.PotencyTier = 0;
			result.Info.EXP = x + " (" + y + ")";
		}
		return result;
	}
};

/* * * * * * * * * * * * * * * * * * * * * * * */

Controller = {

	_extractSlot: function(name,slot) {
		if (/Weapon|Staff/i.test(slot)) return 'Main';
		if (/Shield/i.test(slot)) return 'Off';
		if (/Cap|Helm|Coif/i.test(name)) return 'Helmet';
		if (/Robe|Armor|Breastplate|Cuirass|Hauberk/i.test(name)) return 'Body';
		if (/Gloves|Gauntlets|Mitons/i.test(name)) return 'Hands';
		if (/Pants|Leggings|Greaves|Chausses/i.test(name)) return 'Legs';
		if (/Shoes|Boots|Sabatons/i.test(name)) return 'Feet';
		return 'Unknown';
	},

	getTarget: function() {
		return document.querySelector('#popup_box > div + div > div, #equipment > div');
	},

	loading: function(elem) {
		var div = document.createElement("div");
		div.style.cssText = "font-size:12pt; font-weight:bold; color:red;";
		div.textContent = "EC: Loading..";
		return div;
	},

	saveData: function(eq) {
		if (!eq.getElementById("togpane_log")) {
			if (/slot/.test(window.location.href))
				return;

			Controller.lastLoadingElem.insertBefore(Controller.lastLoadingDiv, null);

			var data = { };

			var level = eq.evaluate('.//div[starts-with(text(),"Level")]',eq,null,9,null).singleNodeValue;
			if (level) localStorage.setItem('HVLevel',level.textContent.match(/(\d+)/)[1]);

			// equipment
			var host = document.location.origin;
			Array.prototype.slice.call(eq.querySelectorAll('.eqde'),0).forEach(function(x) {
				var item = Parser.parse(x.getAttribute('onmouseover'));
				//var slot = Controller._extractSlot(item.Info.Name,item.Info.Type);
				var slot = x.parentNode.firstElementChild.textContent.replace(' Hand', '');
				var tokens = x.getAttribute('onmouseover').match(/equips.set\((\d+), '(\S+)'/);
				if (tokens && tokens.length == 3) {
					item.Info.URL = host + '/pages/showequip.php?eid=' + tokens[1] + '&key=' + tokens[2];
				}
				data[slot] = item;
			});

			if (Object.keys(data).length > 0) {
				Controller.addUpgradesData(data);
			}else {
				localStorage.setItem('HVEquipment',JSON.stringify(data));
				Controller.lastLoadingElem.removeChild(Controller.lastLoadingDiv);
			}
		}else {
			Controller.inBattle = true;
		}
	},

	addUpgradesData: function(data) {
		var arrXhr = [ ];

		var helperFunc = function(arrXhr, idx, data, slot) {
			return function() {
				if (arrXhr[idx].readyState === 4) {
					// doing some functionality here on item
					Controller.ProcessResponseForItem(arrXhr, idx, data, slot);
					// doing some code if all xhr's is completed
					Controller.ProcessResponseForAllItems(arrXhr, data);
				}
			}
		}

		var idx = 0;
		for (var slot in data) {
			if (data[slot].hasOwnProperty('Info') && data[slot].Info.hasOwnProperty('URL')) {
				arrXhr[idx] = new XMLHttpRequest();
				arrXhr[idx].open("GET", data[slot].Info.URL, true);
				arrXhr[idx].responseType = "document";
				arrXhr[idx].onreadystatechange = helperFunc(arrXhr, idx, data, slot);
				arrXhr[idx].send(null);
				idx++;
			}
		}
	},

	ProcessResponseForItem: function(arrXhr, idx, data, slot) {
		if (arrXhr[idx].status === 200) {
			Parser.addUpgrades(data[slot], arrXhr[idx].response);
			// do some code if response is succ
		}
		else {
			// if fail
		}
	},

	ProcessResponseForAllItems: function(arrXhr, data) {
		var isAllComplete = true, isAllCompleteSucc = true;
		for (var i = 0; i < arrXhr.length; i++) {
			if ((!arrXhr[i]) || (arrXhr[i].readyState !== 4)) {
				isAllComplete = false;
				break;
			}
		}

		if (isAllComplete) {
			for (var i = 0; i < arrXhr.length; i++) {
				if (arrXhr[i].status !== 200) {
					isAllCompleteSucc = false;
					break;
				}
			}
			if (isAllCompleteSucc) {
				// do some code when all is completed and all is succ
				localStorage.setItem('HVEquipment',JSON.stringify(data));
				Controller.lastLoadingElem.removeChild(Controller.lastLoadingDiv);
			}
			else {
				// do some code when all is completed and some is fail
				div.textContent = 'EC: Fail..';
			}
		}
	},

	getData: function(key) {
		Controller.lastLoadingElem = document.body;
		Controller.lastLoadingDiv = Controller.loading(Controller.lastLoadingElem);
		var host = document.location.origin + "/?s=Character&ss=eq";
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.open("GET", host, true);
		xmlhttp.responseType = "document";
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4) {
				//console.log(xmlhttp.response,xmlhttp);
				if (xmlhttp.response.getElementById("togpane_log")) Controller.inBattle = true;
				Controller.saveData(xmlhttp.response);
				//Controller.keyEvent(key);
			}
		};
		xmlhttp.send(null);
	},

	loadData: function() {
		var level = parseInt(localStorage.getItem('HVLevel'));
		if (level) Controller.Level = level;

		var equipment = JSON.parse(localStorage.getItem('HVEquipment'));
		if (!equipment) return;
		for (var x in equipment)
			this[x] = equipment[x];
	},

	keyEvent: function(e) {

		if(e.altKey || e.ctrlKey || e.shiftKey) return;
		var key = String.fromCharCode(e.keyCode).toLowerCase(), name, result;
		if (!/[qwertbfyhuiopn]/.test(key) || !Controller.parseable.childElementCount) return;
		if (/[tyiop]/.test(key) && !(document.location.href.indexOf('pages/showequip') >= 0 || (!Controller.popup && document.location.search.indexOf('s=Forge&ss=') >= 0))) return;

		if (key == 'n') {
			Controller.useBaseDataOld = !Controller.useBaseDataOld;
			alert('Wiki Data Date: ' + (Controller.useBaseDataOld ? OLD_DATA_DATE : NEW_DATA_DATE));
			return;
		}
		Wiki.baseData = Controller.useBaseDataOld ? Wiki.baseDataOld : Wiki.baseDataNew;

		if (!Controller.loaded) {
			if (!Controller.inBattle && (!localStorage.hasOwnProperty('HVLevel') || !localStorage.hasOwnProperty('HVEquipment'))) {
				Controller.getData(e);
				return;
			}
			Controller.loadData();
			if (localStorage.hasOwnProperty('HVLevel') && localStorage.hasOwnProperty('HVEquipment')) Controller.loaded = true;
		}

		// if (Controller.popup) name = document.querySelector('#popup_box > div');
		// else if (document.location.search.indexOf('s=Bazaar&ss=l') >= 0) name = document.querySelector('#leftpane > div:nth-child(2)');//Lottery
		// if (!name) {
			// result = document.location.search.indexOf('s=Forge&ss=') >= 0 ? document.getElementById('leftpane') : document.body;
			// name = result.getElementsByClassName('fd2');//Have Changed Name
			// if (!name.length) name = result.getElementsByClassName('fd4');
			// name = name[name.length - 1].getElementsByTagName('div')[0];
		// }
		// name.textContent = name.textContent.replace(/\s\(.+\)/,'');//Delete (Main Hand)/(Off Hand)
		var source = Parser.parse(), slot = Controller._extractSlot(source.Info.Name,source.Info.Type), isWiki;
		if (key == 'f') prompt("Forum Url Link:",'[url\='+document.location.href+']'+source.Info.Name+'[/url]');
		if (key == 'h') prompt("HTML Url Link:",'<a href="'+document.location.href+'" target="_blank">'+source.Info.Name+'</a>');

		if (key == 'r') {
			if (!/Ebony|Chucks|Scythe|Dagger|Tower|Gossamer|Silk|Kevlar|Dragon Hide|Shield (?!of)|Chainmail|Coif|Hauberk|Mitons|Chausses/.test(source.Info.Name)) {
				if (source.Info.Type.match(/Cloth/)) window.open('https://ehwiki.org/wiki/Equipment_Ranges_Clothes?where=' + source.Info.Name.replace(/\s/g,'+'));
				else if (source.Info.Type.match(/Heavy/)) window.open('https://ehwiki.org/wiki/Equipment_Ranges_Heavy?where=' + source.Info.Name.replace(/\s/g,'+'));
				else if (source.Info.Type.match(/Light/)) window.open('https://ehwiki.org/wiki/Equipment_Ranges_Light?where=' + source.Info.Name.replace(/\s/g,'+'));
				else window.open('https://ehwiki.org/wiki/Equipment_Ranges?where=' + source.Info.Name.replace(/\s/g,'+'));
			}
			return;
		}

		if (!Controller.loaded) {
			console.warn("HVEquipCompare: No data stored and you are in Battle. Visit equipment page to gather data about your current set.");
			return;
		}

		var switchSlot = ((key == 'q' || key == 'e' || key == 'o' || key == 'p') && Controller.loaded && Controller.lastEquip == source.Info.Name && source.Info.Type.match(/One/) == 'One'
			&& document.getElementById('Equipment') != null && Controller.lastSlot != 'Off' && Controller['Off'] != undefined
			&& Controller['Off'].Info.Type != 'Shield');

		if (document.getElementById('Equipment') != null) {
			Controller.lastResult.parentNode.removeChild(Controller.lastResult);
			if (Controller.lastKey == key && !switchSlot) {
				Controller.getTarget().style.display = null;
				return;
			}
		}

		if (Controller.lastKey == key && switchSlot) slot = (Controller.lastSlot == 'Main' ? 'Off' : 'Main');

		if (key == 'q' || key == 'e' || key == 'o' || key == 'p') {
			var tempSlot = Controller[slot] ? JSON.parse(JSON.stringify(Controller[slot])) : { };
			if (key == 'e' || key == 'o' || key == 'p') {
				source = Cruncher.scale(source);
				tempSlot = Cruncher.scale(tempSlot);

				if (key == 'o' || key == 'p') {
					source = Cruncher.forgeBase(source);
					tempSlot = Cruncher.forgeBase(tempSlot);
				}

				if (key == 'p') {
					source = Cruncher.scaleWithLevel(source, Controller.Level);
					tempSlot = Cruncher.scaleWithLevel(tempSlot, Controller.Level);
					source.Info.Level = Controller.Level;
					tempSlot.Info.Level = Controller.Level;
				}
			}
			result = Cruncher.compare(source, tempSlot);
		}
		else result = source;

		if (key == 'w' || key == 't' || key == 'b' || key == 'y' || key == 'i') result = Cruncher.scale(result);

		if (key == 'w') {
			isWiki = Cruncher.compareBaseData(result);
			if (isWiki) result = isWiki;
		}
		if (key == 't') result = Cruncher.forgeBase(result);

		// modified by sssss2
		if (key == 'y') {
			result = Cruncher.forgeBase(result);
			isWiki = Cruncher.compareBaseData(result);
			if (isWiki) result = isWiki;
		}
		//

		if (key == 'u' && source.Info.Level != Controller.Level) {
			result = Cruncher.scale(source);
			result = Cruncher.scaleWithLevel(result, Controller.Level);
			result.Info.Level = Controller.Level;
		}

		if (key == 'i') {
			result = Cruncher.forgeBase(result);
			result = Cruncher.scaleWithLevel(result, Controller.Level);
			result.Info.Level = Controller.Level;
		}

		Controller.print(result, slot, source.Info.Name, isWiki, key);
	},

	print: function(result, lastSlot, lastEquip, isWiki, key) {
		if (Controller.loaded || key == 'w' || key == 'b' || key == 't' || key == 'y' || key == 'u' || key == 'i') {
			var div = document.createElement('div');
			div.id = 'Equipment';
			div.innerHTML = Formatter.toHTML(result,!!isWiki);
			Formatter.addColors(div,key == 'q' || key == 'e' || key == 'o' || key == 'p');

			var target = Controller.getTarget();
			target.parentNode.insertBefore(div,target.nextSibling);
			target.style.display = 'none';
		}

		Controller.lastKey = key;
		Controller.lastResult = div;
		Controller.lastSlot = lastSlot;
		Controller.lastEquip = lastEquip;
	}
};

/* * * * * * * * * * * * * * * * * * * * * * * */

Formatter = {

	_sectionOrder: ['Info','Stats','Spell Damage','Proficiency','Damage Mitigations','Primary Attributes'],

	_format: function(string) {
		var parameters = arguments;
		return string.replace(/{(\d+)}/g,function(match,number) {
			return parameters.length > +number+1 ? parameters[+number+1] : match;
		});
	},

	_formatInfo: function(source,wiki) {

		var result = '';

		result += Formatter._format(
			'<div style="margin:3px auto; font-size:110%; text-align:center">' +
				'<b>{0}</b> &nbsp; &nbsp; <b>Level</b> <strong>{1}</strong><br /><b>Potency Tier</b> <strong>{2}</strong> &nbsp; &nbsp; <b>{3}</b><br /><b>Durability</b> <strong>{4}</strong></div>',
			source.Info.Type,source.Info.Level,source.Info.PotencyTier,source.Info.EXP,source.Info.Durability
		);

		if (source.hasOwnProperty('Proc')) {
			result += Formatter._format(
				'<div style="text-align:center; margin:3px auto"><b>{0}</b>: ' +
					'<strong>{1}%</strong> chance - <strong>{2}</strong> turns{3}</div>',
				source.Proc.Type,source.Proc.Chance.toFixed(2),source.Proc.Duration.toFixed(2),
				!source.Proc.hasOwnProperty('Damage') ?
					'' :
					Formatter._format(' / <strong>{0}%</strong> DOT',source.Proc.Damage.toFixed(2))
			);
		}

		if (source.hasOwnProperty('Siphon')) {
			result += Formatter._format(
				'<div style="text-align:center; margin:3px auto"><b>Siphon</b> <b>{0}</b>: ' +
					'<strong>{1}%</strong> chance - <strong>{2}</strong> points</div>',
				source.Siphon.Type,source.Siphon.Chance.toFixed(2),source.Siphon.Damage.toFixed(1)
			);
		}

		if (source.hasOwnProperty('Damage')) {
			result += Formatter._format(
				'<div style="text-align:center; margin:3px auto">'+ (wiki? '':'+') +'<strong>{0}</strong> <b>{1}</b> <b>Damage</b> </div>',
				wiki ? source.Damage.Damage:source.Damage.Damage.toFixed(2),source.Damage.Type
			);
		}

		if (source.Info.hasOwnProperty('Element')) {
			result += Formatter._format(
				'<div style="text-align:center; margin:3px auto"><strong>{0}</strong> <b>Strike</b></div>',
				source.Info.Element
			);
		}

		// removes contradicting signs
		result = result.replace(/\+<strong>-/g,'<strong>-');

		return result;

	},

	_formatSection: function(name,source,wiki) {

		var result = '', attributes = '', stats = (name == 'Stats'), attributeCount = 0, temp;
		var newLine = [];

		for (var x in source) {
			if (wiki) temp =
				Formatter._format('<div style="float:left; width:{0}px; text-align:right; {1}">', stats ? '155' : '106',
					attributeCount > 1 && x != 'Burden'&& x != 'Interference' && ((stats && attributeCount % 2 == 0) || (!stats && attributeCount % 3 == 0)) ? 'clear:left;' : '') +
				(!stats ? x + '' : Formatter._format('<div style="float:left; {0}">{1}</div>',stats ? 'width:99px; padding:2px' : 'width:65px',x)) +
				Formatter._format('<div style="float:' + (stats ? 'left' : 'right') + '; width:45px; {0}"><strong>{1}</strong></div>','padding:0 3px 0 0', source[x]) +
					'<div style="clear:both"></div></div>';

			else temp =
				Formatter._format('<div style="float:left; width:{0}px; text-align:right;">',stats ? '155' : '100') +
				Formatter._format('<div style="float:left; {0}">{1}</div>',stats ? 'width:99px; padding:2px' : 'width:65px',x) +
				Formatter._format('<div style="float:left; width:35px; {0}">+<strong>{1}</strong></div>', stats ? 'padding:2px 0 2px 2px' : '', source[x].toFixed(2)) +
				// additional div needed for stats (containing the percent sign)
				(!stats ? '' : Formatter._format(
					'<div style="float:left; width:6px; text-align:left; padding:2px 2px 2px 1px">{0}</div>',
					(stats && !/Attack Damage|Magic Damage|Interference|Burden/.test(x) ? ' %' : '') // exclude damage, burden and interference. Not 'Attack Crit Damage'
				)) +
			'<div style="clear:both"></div></div>';

			// added later on a new line
			if (stats && (x == 'Burden' || x == 'Interference')) newLine.push(temp);
			else attributes += temp;

			attributeCount++; // needed later to center the floating div(s)
		}

		if (newLine.length) {
			attributes += newLine[0].replace(/">/,'clear: left;">');
			if (newLine[1]) attributes += newLine[1];
		}

		if (stats)
			result = Formatter._format(
				'<div style="border-top:1px solid #A47C78; margin:5px auto 2px; padding-top:2px">{0}<div style="clear:both"></div></div>',
				attributes
			);

		else
			result = Formatter._format(
				'<div style="margin:7px auto 2px"><div style="font-weight:bold; text-align:center">{0}</div>' +
					'<div style="padding-right:20px"><div style="margin:-4px auto 5px; width:{1}20px">{2}</div></div><div style="clear:both"></div></div>',
				name,Math.min(3,attributeCount),attributes
			);

		// add color to Burden and Interference
		result = result.replace(/((?:Burden|Interference).+?)">/g,'$1;color:#BF0000">');

		// removes contradicting signs
		result = result.replace(/\+<strong>-/g,'<strong>-');

		return result;

	},

	addColors: function(source, comparison) {

		// source must be a node
		// comparison = true > red/green
		// comparison = false > purple (base values)

		var targets = source.querySelectorAll('div[style^="float"] strong');
		for (var i=targets.length-1;i>=0;i--) {
			if (comparison) {
				if (Math.abs(parseFloat(targets[i].textContent)) <= 0.01) targets[i].parentNode.style.color = 'dodgerblue';
				else {
					var reverse = /Burden|Interference/.test(targets[i].parentNode.previousElementSibling.textContent);
					if (targets[i].parentNode.textContent[0] != '-') targets[i].parentNode.style.color = !reverse ? 'darkgreen' : 'red';
					else targets[i].parentNode.style.color = !reverse ? 'red' : 'darkgreen';
				}
			}
			else targets[i].parentNode.style.color = 'darkorchid';
		}

		// info & procs
		targets = source.querySelectorAll('div:not([style^="float"]) > div > strong');
		for (i=targets.length-1;i>=0;i--) {
			if (comparison) {
				if (!/[-\+\d]/.test(targets[i].textContent[0]) || Math.abs(parseFloat(targets[i].textContent)) <= 0.01)
					targets[i].style.color = 'dodgerblue';
				else {
					if (targets[i].textContent[0] != '-') {
						targets[i].style.color = 'darkgreen';
						if (targets[i].parentNode.textContent[0] != '+')
							targets[i].textContent = '+' + targets[i].textContent;
					}
					else targets[i].style.color = 'red';
				}
			}
			else if (/\d/.test(targets[i].textContent)) targets[i].style.color = 'darkorchid';
		}

		// highlight different strings
		targets = source.querySelectorAll('strong, b');
		for (i=targets.length-1;i>=0;i--) {
			if (targets[i].textContent[0] != '!' || targets[i].childElementCount) continue;
			targets[i].textContent = targets[i].textContent.slice(1);
			targets[i].style.color = 'dodgerblue';
		}

	},

	toHTML: function(source,w) {

		var result = '';

		Formatter._sectionOrder.forEach(function(section) {
			if (section == 'Info') {
			}else if (source.hasOwnProperty(section)) {
				for (var v in source[section]) {
					if (!isNaN(source[section][v])) {
						source[section][v] = parseFloat(source[section][v]).toFixed(2) * 1;
					}
				}
			}
		});

		Formatter._sectionOrder.forEach(function(section) {
			if (section == 'Info') result += Formatter._formatInfo(source,w);
			else if (source.hasOwnProperty(section))
				result += Formatter._formatSection(section,source[section],w);
		});

		return result;

	}

};

/* * * * * * * * * * * * * * * * * * * * * * * */

Wiki = {

	_evaluate: function(query,x) {
		if(!x) x = document;
		return document.evaluate(query,x,null,9,null).singleNodeValue;
	},

	check: function() {

		var equip = window.location.href.match(/where=([^#&]+)/)[1].replace(/\+/g,' '), temp, target;

		//if (temp = equip.match(/(Cotton|Gossamer|Phase|Leather|Kevlar|Shade|Plate|Shield (?!of)|Power) (Cap|Robe|Gloves|Pants|Shoes|Breastplate|Gauntlets|Leggings|Boots|Helmet|Cuirass|Greaves|Sabatons|Armor)/)) { // armor
		//if (temp = equip.match(/Cotton|Phase|Leather|Shade|Plate|Power/)) {
		if (temp = equip.match(/((Cotton|Phase) (Cap|Robe|Gloves|Pants|Shoes))|((Leather|Shade) (Helmet|Breastplate|Gauntlets|Leggings|Boots))|(Plate (Helmet|Cuirass|Gauntlets|Greaves|Sabatons))|(Power (Helmet|Armor|Gauntlets|Leggings|Boots))/g)) {
			//type = temp[0].replace(/(Leather|Shade) Helmet/, '$1 Cap');
			type = temp[0];
			target = Wiki._evaluate('.//h4[./span[starts-with(text(),"' + type + '")]]/following-sibling::table');
		}
		else { // other
			var type = equip.replace(/Flimsy|Crude|Fair|Average|Fine|Superior|Exquisite|Magnificent|Legendary|Peerless|Ethereal/g,'');
			type = type.replace(/Shocking|Arctic|Tempestuous|Fiery|Astral|Quintessential|Hallowed|Demonic|Ruby|Cobalt|Amber|Jade|Zircon|Onyx|Agile|Reinforced|Mithril/g,'');
			type = type.match(/([^\s]+)/)[1].trim();
			target = Wiki._evaluate('.//h3[./span[starts-with(text(),"' + type + '")]]/following-sibling::table');
		}

		setTimeout(function(){Wiki._highlightTable(target,equip);},30);

	},

	_highlightTable: function(target,equip) {

		if (!target) return;

		if (/collapsibleTable/.test(target.id)) {
			if (unsafeWindow && unsafeWindow.collapseTable) unsafeWindow.collapseTable(target.id.match(/(\d+)$/)[1]); // firefox
			else window.location.href = 'javascript:collapseTable(' + target.id.match(/(\d+)$/)[1] + ')'; //chrome
		}

		target.scrollIntoView();
		//var offset = (/Exquisite/.test(equip)?1:/Magnificent/.test(equip)?2:/Legendary/.test(equip)?3:/Peerless/.test(equip)?4:0);
		var offset = (/Legendary|Peerless/.test(equip)?0:/Magnificent/.test(equip)?2:/Exquisite/.test(equip)?4:6);

		// highlight relevant rows

		function isFirst(x) {
			return !x.firstElementChild.hasAttribute('scope');
		}

		function checkSuffix(td,suffix) {
			return td.indexOf(suffix) == 0 ||
				(/Mjolnir|Surtr|Niflheim|Freyr/.test(suffix) && /×★/i.test(td)) ||
				(/Heimdall|Fenrir/.test(suffix) && /×√/i.test(td)) ||
				(/Heaven-sent|Demon-fiend|Elementalist|Curse-weaver|Priestess|Earth-walker/.test(suffix) && /Prof/i.test(td)) ||
				(/Fox|Owl|Cheetah|Raccoon|Turtle|Ox/.test(suffix) && /PAB/i.test(td)) ||
				(/Dampening|Stone|Deflection|Warding|eater|born|child|waker|blessed|ward/.test(suffix) && /Mitigation/i.test(td));
		}

		function checkPreffix(td,preffix) {
			return td.indexOf(preffix) == 0 ||
				//(/Fiery|Shocking|Tempestuous|Arctic/.test(preffix) && /★×/i.test(td))||
				(/Fiery/.test(preffix) && /Fire.*?★×/i.test(td))||
				(/Shocking/.test(preffix) && /Elec.*?★×/i.test(td))||
				(/Tempestuous/.test(preffix) && /Wind.*?★×/i.test(td))||
				(/Arctic/.test(preffix) && /Cold.*?★×/i.test(td))||
				(/Demonic|Hallowed/.test(preffix) && /√×/i.test(td))||
				(/Shielding/.test(preffix) && /Shielding/i.test(td))||
				(/Charged/.test(preffix) && /Charged/i.test(td)) ||
				(/Frugal/.test(preffix) && /Frugal/i.test(td)) ||
				(/Radiant/.test(preffix) && /Radiant/i.test(td)) ||
				(/Mystic/.test(preffix) && /Mystic/i.test(td)) ||
				(/Agile/.test(preffix) && /Agile/i.test(td)) ||
				(/Mithril/.test(preffix) && /Mithril/i.test(td)) ||
				(/Savage/.test(preffix) && /Savage/i.test(td)) ||
				(/Ruby|Cobalt|Amber|Jade|Zircon|Onyx/.test(preffix) && /Elemental.*?Prefix/i.test(td));
		}

		function highlightRow(row) {
			//var n = row.cells.length-5+offset;
			var n = row.cells.length-1 - offset;
			if (row.cells[n].textContent.trim() == 0) return;
			for (var i=n;i>=0;i--) highlightCell(row.cells[i]);
			highlightCell(row.cells[n],true);
			if (isFirst(row)) {
				var temp = Wiki._evaluate('preceding-sibling::tr[./th[1][@scope]][1]/th[1]',row);
				if (temp) highlightCell(temp);
			}
		}

		function highlightCell(cell,text) {
			if (!cell) return;
			cell.style.cssText = 'background-color: bisque;' + (text?'color: firebrick; font-weight: bold; text-decoration: underline;':'');
		}

		var rows = Array.prototype.slice.call(target.rows,0).slice(3), n = rows.length;
		var suffix = equip.match(/([^\s]+)$/)[1].trim()+' '+equip.match(/\S+ (\S+)/)[1].trim();
		for (var i = 0; i < n; i++) {
			var rowspan = rows[i].firstElementChild.getAttribute('rowspan') || 1, temp = false, temp2 = null, temp3 = false;
			for (var j = 0; j < rowspan; j++, i++) {
				if (temp) continue;
				var suffixTD = isFirst(rows[i])?rows[i].firstElementChild:rows[i].firstElementChild.nextElementSibling, suffixTDtext = suffixTD.textContent.trim();
				// console.log(suffix);
				if ((/Heimdall Hallowed|Demonic Fenrir/.test(suffix) && /√√/i.test(suffixTDtext)) ||
					(/Surtr Fiery|Mjolnir Shocking|Freyr Tempestuous|Niflheim Arctic/.test(suffix) && /★★/i.test(suffixTDtext))) {
					temp3 = true;
					highlightRow(rows[i]);
				}
				if (!temp3 && checkSuffix(suffixTDtext,suffix.match(/\S+/))) {
					temp = true;
					temp3 = true;
					highlightRow(rows[i]);
				}
				else if (/^$|Others|Prof. Suffix|^EDB Suffix/.test(suffixTDtext) || (!temp2 && !suffixTD.nextElementSibling.textContent.trim().length)) temp2 = rows[i];
				if (/Phase/.test(equip) && /Suffix/.test(suffixTDtext)) temp2 = rows[i];

				if (!temp && temp2) highlightRow(temp2);

				if (!temp3) {
					if (checkPreffix(suffixTDtext,suffix)) {
						highlightRow(rows[i]);
						temp3 = true;
					}
					else if (equip.indexOf('Fiery Oak') < 0 && equip.indexOf('Arctic Oak') < 0 && equip.indexOf('Tempestuous Willow') < 0
						&& equip.indexOf('Shocking Willow') < 0 && !checkSuffix(suffixTDtext,suffix.match(/\S+/)) && /fix\)$/i.test(suffixTDtext)) {
						temp3 = true;
						highlightRow(rows[i]);
					}
				}
			}
			i--;
		}
	},

	baseDataOld: {"Attack Damage":{"Dagger":[21.23,23.01,23.9,25.66,25.66,35.75,38.38,40.13,43.59,43.59],"Scythe":[51.98,54.6,57.21,62.38,62.38,75.04,79.37,82.83,90.56,90.56],"Axe":[39.17,41.79,43.55,47.04,49.65,59.66,63.14,65.75,71.8,75.27],"Club":[34.9,36.67,38.42,41.91,43.67,53.69,57.17,59.77,64.97,67.59],"Rapier":[24.65,26.42,27.32,29.96,30.86,40.02,42.65,44.4,48.75,50.51],"Shortsword":[30.63,32.4,34.15,36.79,38.55,48.56,51.19,53.79,58.99,60.75],"Wakizashi":[21.23,23.01,23.9,25.69,26.59,35.75,38.38,40.13,43.62,45.38],"Estoc":[43.44,46.06,47.82,52.16,54.78,64.79,68.27,71.73,77.78,81.25],"Longsword":[51.98,54.6,57.21,62.41,65.02,75.89,80.22,83.68,91.45,94.91],"Mace":[43.44,46.06,47.82,52.16,54.78,64.79,68.27,71.73,77.78,81.25],"Katana":[43.44,46.06,47.82,52.16,54.78,64.79,68.27,71.73,77.78,81.25],"Katalox":[22.09,23.86,24.76,26.54,28.3],"Oak":[22.09,23.86,24.76,26.54,28.3],"Redwood":[22.09,23.86,24.76,26.54,28.3],"Willow":[22.09,23.86,24.76,26.54,28.3],"Shade Helmet":[6.72,7.63,7.68,8.61,8.66],"Shade Breastplate":[7.57,8.49,8.53,9.46,9.51],"Shade Gauntlets":[5.86,6.78,6.82,7.75,7.81],"Shade Leggings":[7.57,8.49,8.53,9.46,9.51],"Shade Boots":[5.86,6.78,6.82,7.75,7.81],"Power Helmet":[9.28,10.2,10.24,11.17,12.08,20.38,22.15,23.05,24.83,25.74],"Power Armor":[10.99,11.9,12.8,13.73,13.78,24.65,26.42,27.32,29.96,30.86],"Power Gauntlets":[8.42,9.34,9.39,10.32,11.22,18.67,20.44,21.34,23.13,24.03],"Power Leggings":[10.13,11.05,11.95,12.88,12.93,22.09,23.86,24.76,26.54,28.3],"Power Boots":[7.57,8.49,8.53,9.46,9.51,16.11,17.03,17.93,19.71,20.62]},"Attack Accuracy":{"Dagger":[19.95,21.21,22.45,24.3,24.33,8.76,41.23,43.69,47.37,47.37],"Scythe":[6.59,7.25,7.28,7.92,7.92,18.13,19.38,20.02,21.88,21.88],"Axe":[9.63,10.28,10.92,11.58,12.22],"Club":[10.24,10.89,11.53,12.79,12.83,24.19,25.45,26.7,29.18,30.43],"Rapier":[17.52,18.78,19.41,21.29,21.93,35.12,36.98,38.84,42.53,44.39],"Shortsword":[21.77,23.03,24.27,26.15,27.4,41.79,44.27,46.12,50.42,52.28],"Wakizashi":[19.95,21.21,22.45,24.32,24.97,38.76,41.23,43.08,46.78,48.64],"Estoc":[7.81,8.46,9.1,9.76,9.8,20.55,21.81,23.06,24.93,26.18],"Longsword":[9.63,10.28,10.92,11.58,12.22,23.59,24.85,26.09,28.57,29.82],"Mace":[9.63,10.28,10.92,11.58,12.22,23.59,24.85,26.09,28.57,29.82],"Katana":[21.77,23.03,24.27,26.15,27.4,41.79,44.27,46.12,50.42,52.28],"Cotton Cap":[3.56,4.21,4.24,4.3,4.94],"Cotton Robe":[4.17,4.82,4.85,5.51,5.55],"Cotton Gloves":[3.56,4.21,4.24,4.3,4.94],"Cotton Pants":[4.17,4.82,4.85,5.51,5.55],"Cotton Shoes":[2.95,3.6,3.64,3.69,3.73],"Phase Cap":[3.56,4.21,4.24,4.3,4.94],"Phase Robe":[4.17,4.82,4.85,5.51,5.55],"Phase Gloves":[3.56,4.21,4.24,4.3,4.94],"Phase Pants":[4.17,4.82,4.85,5.51,5.55],"Phase Shoes":[2.95,3.6,3.64,3.69,3.73],"Shade Helmet":[5.38,6.03,6.06,6.72,6.76],"Shade Breastplate":[6.59,7.25,7.28,7.94,8.58],"Shade Gauntlets":[4.77,5.43,5.46,6.12,6.15],"Shade Leggings":[5.99,6.64,6.67,7.33,7.97],"Shade Boots":[4.17,4.82,4.85,5.51,5.55],"Power Helmet":[4.77,5.43,5.46,6.12,6.15,16.3,17.56,18.2,20.08,20.72],"Power Armor":[5.38,6.03,6.06,6.72,6.76,18.73,19.99,20.63,22.5,23.75],"Power Gauntlets":[4.17,4.82,4.85,5.51,5.55,14.48,15.74,16.38,17.65,18.29],"Power Leggings":[5.38,6.03,6.06,6.72,6.76,18.13,19.38,20.02,21.9,23.15],"Power Boots":[4.17,4.82,4.85,5.51,5.55,13.27,14.53,15.17,16.43,17.08]},"Attack Crit Chance":{"Dagger":[4.29,4.51,4.72,5.15,5.15,8.07,8.5,8.92,9.779,9.779],"Scythe":[6.39,6.71,7.03,7.67,7.67,10.7,11.33,11.86,12.92,12.92],"Axe":[4.29,4.51,4.72,5.15,5.37],"Club":[4.29,4.51,4.72,5.15,5.37,8.28,8.71,9.13,9.98,10.41],"Rapier":[4.29,4.51,4.72,5.15,5.37,8.28,8.71,9.13,9.98,10.41],"Shortsword":[4.29,4.51,4.72,5.15,5.37,8.28,8.71,9.13,9.98,10.41],"Wakizashi":[4.29,4.51,4.72,5.15,5.37,8.28,8.71,9.13,9.98,10.41],"Estoc":[6.39,6.71,7.03,7.67,7.99,10.8,11.44,11.97,13.03,13.56],"Longsword":[6.39,6.71,7.03,7.67,7.99,10.8,11.44,11.97,13.03,13.56],"Mace":[6.39,6.71,7.03,7.67,7.99,10.8,11.44,11.97,13.03,13.56],"Katana":[6.39,6.71,7.03,7.67,7.99,10.8,11.44,11.97,13.03,13.56],"Shade Helmet":[2.19,2.3,2.41,2.63,2.74],"Shade Breastplate":[2.61,2.83,2.94,3.16,3.27],"Shade Gauntlets":[1.98,2.09,2.2,2.42,2.53],"Shade Leggings":[2.4,2.62,2.73,2.95,3.06],"Shade Boots":[1.77,1.88,1.99,2.21,2.22],"Power Helmet":[1.14,1.25,1.26,1.37,1.48,4.5,4.82,5.04,5.47,5.68],"Power Armor":[1.35,1.46,1.57,1.69,1.69,5.34,5.66,5.88,6.41,6.73],"Power Gauntlets":[1.04,1.15,1.15,1.27,1.38,4.08,4.3,4.51,4.94,5.16],"Power Leggings":[1.25,1.36,1.47,1.58,1.59,4.92,5.24,5.46,5.99,6.21],"Power Boots":[0.93,1.04,1.05,1.16,1.17,3.66,3.88,4.09,4.42,4.63]},"Attack Speed":{"Dagger":[7.63,8.15,8.65,9.16,9.16,9.16,11.96,12.96,13.46,14.45,14.45],"Shortsword":[5.23,5.26,5.29,5.33,5.36],"Wakizashi":[10.04,10.07,10.1,10.14,10.17,14.85,14.88,14.91,14.95,14.98],"Buckler":[3.3,3.34,3.36,3.41,3.43],"Kite":[3.3,3.34,3.36,3.41,3.43],"Leather Helmet":[3.3,3.34,3.36,3.41,3.43],"Leather Breastplate":[3.78,3.82,3.84,3.89,3.92],"Leather Gauntlets":[2.82,2.86,2.88,2.92,2.95],"Leather Leggings":[3.78,3.82,3.84,3.89,3.92],"Leather Boots":[2.82,2.86,2.88,2.92,2.95],"Shade Helmet":[3.3,3.34,3.36,3.41,3.43],"Shade Breastplate":[3.78,3.82,3.84,3.89,3.92],"Shade Gauntlets":[2.82,2.86,2.88,2.92,2.95],"Shade Leggings":[3.78,3.82,3.84,3.89,3.92],"Shade Boots":[2.82,2.86,2.88,2.92,2.95]},"Casting Speed":{"Cotton Cap":[2.87,2.9,2.93,2.97,3],"Cotton Robe":[3.36,3.39,3.42,3.46,3.49],"Cotton Gloves":[2.87,2.9,2.93,2.97,3],"Cotton Pants":[3.36,3.39,3.42,3.46,3.49],"Cotton Shoes":[2.38,2.42,2.44,2.48,2.51],"Phase Cap":[2.87,2.9,2.93,2.97,3],"Phase Robe":[3.36,3.39,3.42,3.46,3.49],"Phase Gloves":[2.87,2.9,2.93,2.97,3],"Phase Pants":[3.36,3.39,3.42,3.46,3.49],"Phase Shoes":[2.38,2.42,2.44,2.48,2.51]},"Magic Damage":{"Katalox":[25.61,27.33,28.2,30.76,32.47,41.37,43.92,45.62,49.85,52.39],"Oak":[23.95,25.67,26.54,29.11,29.98],"Redwood":[23.95,25.67,26.54,29.11,29.98,38.88,41.43,43.14,47.36,49.07],"Willow":[23.95,25.67,26.54,29.11,29.98,38.88,41.43,43.14,47.36,49.07],"Phase Cap":[3.21,3.27,3.31,3.39,3.43],"Phase Robe":[4.04,4.1,4.14,4.21,4.26],"Phase Gloves":[3.21,3.27,3.31,3.39,3.43],"Phase Pants":[3.21,3.27,3.31,3.39,3.43],"Phase Shoes":[2.38,2.44,2.48,2.56,2.61]},"Magic Accuracy":{"Dagger":[4.84,5.37,5.4,5.91,5.91],"Gossamer Cap":[3.37,3.9,3.92,4.44,4.44],"Gossamer Robe":[3.86,4.39,4.41,4.93,4.93],"Gossamer Gloves":[2.88,3.41,3.43,3.46,3.46],"Gossamer Pants":[3.86,4.39,4.41,4.93,4.93],"Gossamer Shoes":[2.88,3.41,3.43,3.46,3.46],"Club":[4.84,5.37,5.4,5.93,6.45],"Rapier":[4.84,5.37,5.4,5.93,6.45],"Shortsword":[4.84,5.37,5.4,5.93,6.45],"Wakizashi":[4.84,5.37,5.4,5.93,6.45],"Estoc":[7.79,8.32,8.83,9.37,9.89],"Longsword":[7.79,8.32,8.83,9.37,9.89],"Mace":[7.79,8.32,8.83,9.37,9.89],"Katalox":[15.15,16.17,16.69,18.21,19.22,29.88,31.39,32.89,35.88,37.38],"Oak":[14.17,15.19,15.71,17.22,17.74,28.41,29.92,31.42,34.41,35.91],"Redwood":[14.17,15.19,15.71,17.22,17.74,28.41,29.92,31.42,34.41,35.91],"Willow":[14.17,15.19,15.71,17.22,17.74,28.41,29.92,31.42,34.41,35.91],"Buckler":[7.79,8.32,8.83,9.37,9.89],"Cotton Cap":[3.37,3.9,3.92,4.46,4.49],"Cotton Robe":[3.86,4.39,4.41,4.95,4.98],"Cotton Gloves":[2.88,3.41,3.43,3.48,4],"Cotton Pants":[3.86,4.39,4.41,4.95,4.98],"Cotton Shoes":[2.88,3.41,3.43,3.48,4],"Phase Cap":[4.35,4.88,4.91,5.44,5.47],"Phase Robe":[5.33,5.86,5.89,6.42,6.94],"Phase Gloves":[3.86,4.39,4.41,4.95,4.98],"Phase Pants":[4.84,5.37,5.4,5.93,6.45],"Phase Shoes":[3.37,3.9,3.92,4.46,4.49],"Shade Helmet":[5.33,5.86,5.89,6.42,6.94],"Shade Breastplate":[6.32,6.84,7.36,7.9,7.92],"Shade Gauntlets":[4.84,5.37,5.4,5.93,6.45],"Shade Leggings":[5.83,6.35,6.87,7.4,7.43],"Shade Boots":[4.35,4.88,4.91,5.44,5.47]},"Magic Crit Chance":{"Katalox":[5.8,6.15,6.38,6.96,7.31,9.56,10.14,10.6,11.52,11.99],"Oak":[4.66,4.9,5.13,5.6,5.83,8.42,8.89,9.35,10.16,10.62],"Redwood":[4.66,4.9,5.13,5.6,5.83,8.42,8.89,9.35,10.16,10.62],"Willow":[4.66,4.9,5.13,5.6,5.83,8.42,8.89,9.35,10.16,10.62]},"Mana Conservation":{"Dagger":[14,14,14,14,14],"Gossamer Cap":[2.87,2.94,2.99,3.05,3.05],"Gossamer Robe":[2.87,2.94,2.99,3.05,3.05],"Gossamer Gloves":[2.87,2.94,2.99,3.05,3.05],"Gossamer Pants":[2.87,2.94,2.99,3.05,3.05],"Gossamer Shoes":[2.87,2.94,2.99,3.05,3.05],"Club":[12.87,12.94,12.99,13.08,13.14],"Rapier":[12.87,12.94,12.99,13.08,13.14],"Shortsword":[12.87,12.94,12.99,13.08,13.14],"Wakizashi":[12.87,12.94,12.99,13.08,13.14],"Estoc":[20.87,20.94,20.99,21.08,21.14],"Longsword":[20.87,20.94,20.99,21.08,21.14],"Mace":[20.87,20.94,20.99,21.08,21.14],"Katalox":[25.87,25.94,25.99,26.08,26.14],"Oak":[25.87,25.94,25.99,26.08,26.14],"Redwood":[25.87,25.94,25.99,26.08,26.14],"Willow":[25.87,25.94,25.99,26.08,26.14],"Buckler":[20.87,20.94,20.99,21.08,21.14],"Cotton Cap":[2.87,2.94,2.99,3.08,3.14],"Cotton Robe":[2.87,2.94,2.99,3.08,3.14],"Cotton Gloves":[2.87,2.94,2.99,3.08,3.14],"Cotton Pants":[2.87,2.94,2.99,3.08,3.14],"Cotton Shoes":[2.87,2.94,2.99,3.08,3.14],"Phase Cap":[2.87,2.94,2.99,3.08,3.14],"Phase Robe":[2.87,2.94,2.99,3.08,3.14],"Phase Gloves":[2.87,2.94,2.99,3.08,3.14],"Phase Pants":[2.87,2.94,2.99,3.08,3.14],"Phase Shoes":[2.87,2.94,2.99,3.08,3.14]},"Physical Mitigation":{"Tower":[2.7,2.93,3.15,3.37,3.37,4.17,4.61,4.83,5.26,5.26],"Gossamer Cap":[2.7,2.93,3.15,3.37,3.37],"Gossamer Robe":[3.12,3.35,3.57,3.79,3.79],"Gossamer Gloves":[2.49,2.72,2.94,3.16,3.16],"Gossamer Pants":[2.91,3.14,3.36,3.58,3.58],"Gossamer Shoes":[2.28,2.51,2.52,2.74,2.74],"Buckler":[1.86,2.09,2.1,2.33,2.34,3.33,3.56,3.78,4.01,4.23],"Kite":[2.7,2.93,3.15,3.38,3.39,4.17,4.4,4.62,5.06,5.28],"Force":[2.7,2.93,3.15,3.38,3.39,4.17,4.4,4.62,5.06,5.28],"Cotton Cap":[3.54,3.77,3.99,4.43,4.44,5.22,5.66,5.88,6.32,6.54],"Cotton Robe":[4.17,4.4,4.62,5.06,5.28,6.27,6.71,6.93,7.58,8.01],"Cotton Gloves":[3.12,3.35,3.57,3.8,4.02,4.8,5.24,5.46,5.9,6.12],"Cotton Pants":[3.96,4.19,4.41,4.85,5.07,6.06,6.5,6.72,7.37,7.59],"Cotton Shoes":[2.91,3.14,3.36,3.59,3.81,4.38,4.61,4.83,5.27,5.49],"Phase Cap":[2.7,2.93,3.15,3.38,3.39],"Phase Robe":[3.12,3.35,3.57,3.8,4.02],"Phase Gloves":[2.49,2.72,2.94,3.17,3.18],"Phase Pants":[2.91,3.14,3.36,3.59,3.81],"Phase Shoes":[2.28,2.51,2.52,2.75,2.97],"Leather Helmet":[6.48,6.92,7.14,7.79,8.22,8.79,9.44,9.87,10.73,11.16],"Leather Breastplate":[7.74,8.18,8.61,9.47,9.69,10.47,11.12,11.55,12.62,13.26],"Leather Gauntlets":[5.85,6.29,6.51,7.16,7.38,7.95,8.39,8.82,9.68,10.11],"Leather Leggings":[7.11,7.55,7.98,8.63,9.06,9.84,10.49,10.92,11.99,12.42],"Leather Boots":[5.22,5.66,5.88,6.32,6.54,7.11,7.55,7.98,8.63,9.06],"Shade Helmet":[5.43,5.87,6.09,6.53,6.96],"Shade Breastplate":[6.48,6.92,7.14,7.79,8.22],"Shade Gauntlets":[5.01,5.45,5.67,6.11,6.33],"Shade Leggings":[6.06,6.5,6.72,7.37,7.59],"Shade Boots":[4.38,4.61,4.83,5.27,5.49],"Plate Helmet":[8.58,9.02,9.45,10.31,10.74,11.31,11.96,12.6,13.67,14.31],"Plate Cuirass":[10.26,10.91,11.34,12.41,12.84,13.62,14.48,15.12,16.4,17.04],"Plate Gauntlets":[7.74,8.18,8.61,9.47,9.69,10.26,10.91,11.34,12.41,12.84],"Plate Greaves":[9.42,10.07,10.5,11.36,11.79,12.57,13.22,13.86,15.14,15.78],"Plate Sabatons":[6.9,7.34,7.77,8.42,8.64,9,9.65,10.08,10.94,11.37],"Power Helmet":[6.48,6.92,7.14,7.79,8.22,8.79,9.44,9.87,10.73,11.16],"Power Armor":[7.74,8.18,8.61,9.47,9.69,10.47,11.12,11.55,12.62,13.26],"Power Gauntlets":[5.85,6.29,6.51,7.16,7.38,7.95,8.39,8.82,9.68,10.11],"Power Leggings":[7.11,7.55,7.98,8.63,9.06,9.84,10.49,10.92,11.99,12.42],"Power Boots":[5.22,5.66,5.88,6.32,6.54,7.11,7.55,7.98,8.63,9.06]},"Magical Mitigation":{"Tower":[2.59,2.8,3.01,3.23,3.23,3.23,3.59,4.01,4.22,4.43,4.43],"Gossamer Cap":[3.39,3.61,3.82,4.23,4.23],"Gossamer Robe":[3.99,4.21,4.42,4.83,4.83],"Gossamer Gloves":[2.99,3.2,3.41,3.63,3.63],"Gossamer Pants":[3.79,4.01,4.22,4.63,4.63],"Gossamer Shoes":[2.79,3,3.21,3.43,3.43],"Buckler":[1.78,2,2.01,2.23,2.24,5.2,5.62,5.83,6.25,6.66],"Kite":[2.59,2.8,3.01,3.23,3.24,6,6.42,6.63,7.25,7.67],"Force":[2.59,2.8,3.01,3.23,3.24,6,6.42,6.63,7.25,7.67],"Cotton Cap":[3.39,3.61,3.82,4.24,4.25,7.01,7.42,7.84,8.46,8.87],"Cotton Robe":[3.99,4.21,4.42,4.84,5.05,8.41,9.03,9.44,10.27,10.68],"Cotton Gloves":[2.99,3.2,3.41,3.63,3.85,6.4,6.82,7.23,7.86,8.07],"Cotton Pants":[3.79,4.01,4.22,4.64,4.85,8.01,8.43,8.84,9.66,10.08],"Cotton Shoes":[2.79,3,3.21,3.43,3.65,5.8,6.22,6.43,7.05,7.26],"Phase Cap":[3.39,3.61,3.82,4.24,4.25],"Phase Robe":[3.99,4.21,4.42,4.84,5.05],"Phase Gloves":[2.99,3.2,3.41,3.63,3.85],"Phase Pants":[3.79,4.01,4.22,4.64,4.85],"Phase Shoes":[2.79,3,3.21,3.43,3.65],"Leather Helmet":[5.2,5.62,5.83,6.25,6.66,9.22,9.84,10.25,11.07,11.69],"Leather Breastplate":[6.2,6.62,6.83,7.45,7.87,11.03,11.65,12.26,13.28,13.9],"Leather Gauntlets":[4.8,5.21,5.42,5.85,6.06,8.62,9.23,9.65,10.47,10.88],"Leather Leggings":[5.8,6.22,6.43,7.05,7.26,10.42,11.04,11.66,12.68,13.09],"Leather Boots":[4.19,4.41,4.62,5.04,5.25,7.41,7.83,8.24,9.06,9.27],"Shade Helmet":[4.19,4.41,4.62,5.04,5.25],"Shade Breastplate":[5,5.41,5.63,6.05,6.26],"Shade Gauntlets":[3.79,4.01,4.22,4.64,4.85],"Shade Leggings":[4.6,5.01,5.22,5.64,5.86],"Shade Boots":[3.39,3.61,3.82,4.24,4.25],"Plate Helmet":[6.2,6.62,6.83,7.45,7.87,10.42,11.04,11.66,12.68,13.09],"Plate Cuirass":[7.41,7.83,8.24,9.06,9.27,12.43,13.25,13.87,15.09,15.71],"Plate Gauntlets":[5.6,6.02,6.23,6.85,7.06,9.42,10.04,10.45,11.47,11.89],"Plate Greaves":[6.81,7.22,7.64,8.26,8.67,11.63,12.25,12.86,14.09,14.7],"Plate Sabatons":[5,5.41,5.63,6.05,6.26,8.41,9.03,9.44,10.27,10.68],"Power Helmet":[5.2,5.62,5.83,6.25,6.66,9.22,9.84,10.25,11.07,11.69],"Power Armor":[6.2,6.62,6.83,7.45,7.87,11.03,11.65,12.26,13.28,13.9],"Power Gauntlets":[4.8,5.21,5.42,5.85,6.06,8.62,9.23,9.65,10.47,10.88],"Power Leggings":[5.8,6.22,6.43,7.05,7.26,10.42,11.04,11.66,12.68,13.09],"Power Boots":[4.19,4.41,4.62,5.04,5.25,7.41,7.83,8.24,9.06,9.27]},"Damage Mitigations":{"Tower":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.06,1.23,1.24,1.4,1.4,2.12,2.28,2.44,2.61,2.61,1.78,1.94,2.1,2.26,2.26],"Gossamer Cap":[16.87,17.94,18.99,21.05,21.05],"Gossamer Robe":[19.87,20.94,21.99,24.05,24.05],"Gossamer Gloves":[14.87,15.94,16.99,18.05,18.05],"Gossamer Pants":[18.87,19.94,20.99,23.05,23.05],"Gossamer Shoes":[13.87,14.94,15.99,17.05,17.05],"Buckler":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3.54,3.71,3.72,3.88,3.89,3.5,3.66,3.67,3.83,3.84,3.43,3.59,3.6,3.76,3.77],"Kite":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.56,5.88,6.19,6.67,6.99,5.48,5.8,6.11,6.59,6.9,5.38,5.69,5.99,6.46,6.77,2.46,2.47,2.48,2.49,2.5,2.43,2.44,2.44,2.46,2.47,2.38,2.39,2.4,2.41,2.42,7.88,8.2,8.52,9,9.32,7.78,8.09,8.41,8.88,9.2,7.62,7.94,8.24,8.71,9.01],"Force":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5.56,5.88,6.19,6.67,6.99,5.48,5.8,6.11,6.59,6.9,5.38,5.69,5.99,6.46,6.77],"Cotton Cap":[20.87,20.94,20.99,21.08,21.14,0,0,0,0,0],"Cotton Robe":[24.87,24.94,24.99,25.08,25.14,0,0,0,0,0],"Cotton Gloves":[18.87,18.94,18.99,19.08,19.14,0,0,0,0,0],"Cotton Pants":[22.87,22.94,22.99,23.08,23.14,0,0,0,0,0],"Cotton Shoes":[16.87,16.94,16.99,17.08,17.14,0,0,0,0,0],"Phase Cap":[20.87,20.94,20.99,21.08,21.14,0,0,0,0,0],"Phase Robe":[24.87,24.94,24.99,25.08,25.14,0,0,0,0,0],"Phase Gloves":[18.87,18.94,18.99,19.08,19.14,0,0,0,0,0],"Phase Pants":[22.87,22.94,22.99,23.08,23.14,0,0,0,0,0],"Phase Shoes":[16.87,16.94,16.99,17.08,17.14,0,0,0,0,0],"Leather Helmet":[20.87,20.94,20.99,21.08,21.14,6.33,6.65,6.97,7.6,7.92,6.25,6.57,6.88,7.5,7.82,3.13,3.29,3.45,3.76,3.92,11.75,12.38,13.01,14.11,14.74,11.6,12.22,12.84,13.93,14.55,8.37,8.84,9.29,10.06,10.51,8.65,8.97,9.29,9.93,10.25,8.54,8.86,9.17,9.8,10.11,5.38,5.54,5.69,6.01,6.17,14.07,14.71,15.33,16.43,17.06,13.89,14.52,15.14,16.22,16.84,10.62,11.08,11.54,12.3,12.76],"Leather Breastplate":[24.87,24.94,24.99,25.08,25.14,7.57,8.05,8.36,9.15,9.47,7.47,7.94,8.26,9.03,9.35,3.73,4.04,4.2,4.51,4.67,14.07,14.86,15.49,16.9,17.68,13.89,14.67,15.29,16.68,17.45,10.02,10.63,11.09,12.15,12.61,10.36,10.83,11.15,11.94,12.26,10.22,10.69,11.01,11.79,12.1,6.43,6.74,6.89,7.21,7.37,16.86,17.65,18.28,19.68,20.47,16.65,17.42,18.04,19.43,20.2,12.72,13.33,13.79,14.85,15.31],"Leather Gauntlets":[18.87,18.94,18.99,19.08,19.14,5.71,6.03,6.35,6.98,7.15,5.64,5.95,6.27,6.89,7.05,2.83,2.99,3.15,3.46,3.62,10.67,11.3,11.77,12.87,13.34,10.53,11.15,11.62,12.7,13.17,7.62,8.09,8.39,9.16,9.61,7.88,8.2,8.52,9.15,9.32,7.78,8.09,8.41,9.03,9.2,4.93,5.09,5.25,5.56,5.72,12.84,13.47,13.94,15.04,15.51,12.67,13.29,13.76,14.84,15.31,9.72,10.18,10.49,11.25,11.71],"Leather Leggings":[22.87,22.94,22.99,23.08,23.14,6.95,7.43,7.74,8.38,8.7,6.86,7.33,7.64,8.27,8.58,3.43,3.74,3.9,4.21,4.37,12.99,13.78,14.4,15.66,16.29,12.82,13.6,14.22,15.46,16.08,9.27,9.88,10.34,11.25,11.71,9.58,10.06,10.38,11.01,11.33,9.46,9.93,10.24,10.87,11.18,5.98,6.29,6.44,6.76,6.92,15.62,16.41,17.04,18.29,18.92,15.42,16.2,16.82,18.05,18.68,11.82,12.43,12.89,13.8,14.26],"Leather Boots":[16.87,16.94,16.99,17.08,17.14,5.09,5.41,5.73,6.21,6.37,5.03,5.34,5.66,6.13,6.29,2.53,2.69,2.85,3.16,3.17,9.43,9.9,10.38,11.32,11.79,9.31,9.78,10.24,11.17,11.64,6.73,7.19,7.49,8.11,8.42,6.95,7.27,7.59,8.07,8.23,6.86,7.18,7.49,7.96,8.13,4.33,4.49,4.65,4.96,4.97,11.29,11.76,12.24,13.18,13.65,11.14,11.61,12.08,13.01,13.48,8.52,8.99,9.29,9.91,10.21],"Shade Helmet":[20.87,20.94,20.99,21.08,21.14,4.78,5.1,5.27,5.74,6.06,4.72,5.04,5.2,5.67,5.98],"Shade Breastplate":[24.87,24.94,24.99,25.08,25.14,5.71,6.03,6.35,6.98,7.15,5.64,5.95,6.27,6.89,7.05],"Shade Gauntlets":[18.87,18.94,18.99,19.08,19.14,4.32,4.64,4.8,5.28,5.44,4.26,4.58,4.74,5.21,5.37],"Shade Leggings":[22.87,22.94,22.99,23.08,23.14,5.25,5.57,5.88,6.36,6.68,5.18,5.5,5.81,6.28,6.6],"Shade Boots":[16.87,16.94,16.99,17.08,17.14,3.85,4.17,4.34,4.66,4.82,3.8,4.12,4.28,4.6,4.76],"Plate Helmet":[20.87,20.94,20.99,21.08,21.14,4.78,5.1,5.27,5.74,6.06,7.78,8.25,8.56,9.34,9.81,7.62,8.09,8.39,9.16,9.61,10.2,10.83,11.31,12.25,12.88,13.13,13.9,14.52,15.76,16.53,12.87,13.63,14.24,15.45,16.21],"Plate Cuirass":[24.87,24.94,24.99,25.08,25.14,5.71,6.03,6.35,6.98,7.15,9.31,9.78,10.24,11.17,11.64,9.12,9.58,10.04,10.95,11.41,12.22,12.85,13.47,14.73,15.36,15.73,16.66,17.43,18.97,19.75,15.42,16.33,17.09,18.6,19.36],"Plate Gauntlets":[18.87,18.94,18.99,19.08,19.14,4.32,4.64,4.8,5.28,5.44,7.01,7.48,7.8,8.42,8.89,6.88,7.34,7.64,8.26,8.72,9.27,9.75,10.22,11.17,11.64,11.91,12.53,13.15,14.38,15.01,11.67,12.28,12.89,14.1,14.71],"Plate Greaves":[22.87,22.94,22.99,23.08,23.14,5.25,5.57,5.88,6.36,6.68,8.54,9.01,9.48,10.26,10.72,8.37,8.84,9.29,10.06,10.51,11.29,11.92,12.55,13.64,14.12,14.5,15.28,16.05,17.44,18.22,14.22,14.98,15.74,17.1,17.86],"Plate Sabatons":[16.87,16.94,16.99,17.08,17.14,3.85,4.17,4.34,4.66,4.82,6.25,6.57,6.88,7.5,7.82,6.13,6.44,6.74,7.36,7.67,8.19,8.67,9.14,9.93,10.25,10.53,11.15,11.62,12.7,13.17,10.32,10.93,11.39,12.45,12.91],"Power Helmet":[20.87,20.94,20.99,21.08,21.14,4.01,4.33,4.49,4.81,5.13,6.25,6.57,6.88,7.5,7.82,6.13,6.44,6.74,7.36,7.67],"Power Armor":[24.87,24.94,24.99,25.08,25.14,4.78,5.1,5.27,5.74,6.06,7.47,7.94,8.26,9.03,9.35,7.32,7.79,8.09,8.86,9.16],"Power Gauntlets":[18.87,18.94,18.99,19.08,19.14,3.7,4.02,4.18,4.5,4.67,5.64,5.95,6.27,6.89,7.05,5.53,5.84,6.14,6.76,6.92],"Power Leggings":[22.87,22.94,22.99,23.08,23.14,4.47,4.79,4.96,5.43,5.6,6.86,7.33,7.64,8.27,8.58,6.73,7.19,7.49,8.11,8.42],"Power Boots":[16.87,16.94,16.99,17.08,17.14,3.23,3.4,3.56,3.88,4.05,5.03,5.34,5.66,6.13,6.29,4.93,5.24,5.54,6.01,6.17]},"Evade Chance":{"Gossamer Cap":[3.22,3.49,3.75,4.01,4.01],"Gossamer Robe":[3.72,3.99,4.25,4.51,4.51],"Gossamer Gloves":[2.97,3.24,3.5,3.76,3.76],"Gossamer Pants":[3.47,3.74,4,4.26,4.26],"Gossamer Shoes":[2.72,2.99,3,3.26,3.26],"Cotton Cap":[3.22,3.49,3.75,4.02,4.04],"Cotton Robe":[3.72,3.99,4.25,4.52,4.79],"Cotton Gloves":[2.97,3.24,3.5,3.77,3.79],"Cotton Pants":[3.47,3.74,4,4.27,4.54],"Cotton Shoes":[2.72,2.99,3,3.27,3.54],"Phase Cap":[4.22,4.49,4.75,5.27,5.29],"Phase Robe":[4.97,5.24,5.5,6.02,6.29],"Phase Gloves":[3.72,3.99,4.25,4.52,4.79],"Phase Pants":[4.72,4.99,5.25,5.77,6.04],"Phase Shoes":[3.47,3.74,4,4.27,4.54],"Leather Helmet":[1.97,2.24,2.25,2.52,2.54],"Leather Breastplate":[2.22,2.49,2.5,2.77,2.79],"Leather Gauntlets":[1.72,1.99,2,2.27,2.29],"Leather Leggings":[2.22,2.49,2.5,2.77,2.79],"Leather Boots":[1.72,1.99,2,2.27,2.29],"Shade Helmet":[3.47,3.74,4,4.27,4.54,5.22,5.49,5.75,6.27,6.54],"Shade Breastplate":[4.22,4.49,4.75,5.27,5.29,6.22,6.74,7,7.52,7.79],"Shade Gauntlets":[3.22,3.49,3.75,4.02,4.04,4.72,4.99,5.25,5.77,6.04],"Shade Leggings":[3.72,3.99,4.25,4.52,4.79,5.72,6.24,6.5,7.02,7.29],"Shade Boots":[2.72,2.99,3,3.27,3.54,4.22,4.49,4.75,5.27,5.29]},"Resist Chance":{"Cotton Cap":[4.72,5.58,5.62,5.69,6.54],"Cotton Robe":[5.52,6.38,6.42,7.3,7.35],"Cotton Gloves":[4.72,5.58,5.62,5.69,6.54],"Cotton Pants":[5.52,6.38,6.42,7.3,7.35],"Cotton Shoes":[3.91,4.78,4.82,4.89,4.94],"Phase Cap":[4.72,5.58,5.62,5.69,6.54],"Phase Robe":[5.52,6.38,6.42,7.3,7.35],"Phase Gloves":[4.72,5.58,5.62,5.69,6.54],"Phase Pants":[5.52,6.38,6.42,7.3,7.35],"Phase Shoes":[3.91,4.78,4.82,4.89,4.94],"Leather Helmet":[7.93,8.8,8.84,9.71,10.56],"Leather Breastplate":[9.54,10.4,11.25,12.12,12.17],"Leather Gauntlets":[7.13,7.99,8.03,8.91,8.96],"Leather Leggings":[8.74,9.6,9.64,10.52,11.37],"Leather Boots":[6.32,7.19,7.23,8.1,8.15],"Shade Helmet":[11.95,12.82,13.66,14.54,15.39,16.78,17.64,18.48,20.16,21.02],"Shade Breastplate":[14.36,15.23,16.07,17.75,18.6,19.99,21.66,22.5,24.18,25.04],"Shade Gauntlets":[11.15,12.01,12.86,13.73,14.58,15.17,16.03,16.88,18.56,19.41],"Shade Leggings":[12.76,13.62,14.46,15.34,16.19,18.38,20.05,20.9,22.58,23.43],"Shade Boots":[9.54,10.4,11.25,12.12,12.17,13.56,14.42,15.27,16.95,17]},"Parry Chance":{"Dagger":[16.87,17.83,18.77,20.6,20.6,22.23,24.08,25.02,27.75,27.75],"Club":[7.03,7.99,8.04,9.01,9.07],"Rapier":[15.08,16.04,16.98,18.85,18.9,21.34,23.19,24.13,26,26.95],"Shortsword":[14.18,15.14,16.08,17.06,18.01],"Wakizashi":[16.87,17.83,18.77,20.63,21.58,23.12,24.98,25.92,27.79,29.63],"Buckler":[7.03,7.99,8.04,9.01,9.07]},"Block Chance":{"Tower":[27.81,29.88,30.93,33.98,33.98,31.8,34.87,35.92,38.97,38.97],"Buckler":[20.82,21.9,22.94,25.03,26.09,25.81,27.88,28.93,31.02,33.07],"Kite":[25.81,27.88,28.93,31.02,33.07],"Force":[30.8,32.87,33.92,37.01,39.06],"Plate Helmet":[4.86,4.93,4.98,5.07,5.13],"Plate Cuirass":[5.85,5.93,5.98,6.07,6.13],"Plate Gauntlets":[4.86,4.93,4.98,5.07,5.13],"Plate Greaves":[4.86,4.93,4.98,5.07,5.13],"Plate Sabatons":[3.86,3.93,3.98,4.07,4.13]},"Burden":{"Dagger":[2.8,5.6],"Scythe":[21,35],"Tower":[13.3,20.3,10.5,16.1],"Axe":[14,17.5],"Club":[9.8,15.4],"Rapier":[6.3,12.6],"Shortsword":[5.6,10.5],"Wakizashi":[2.8,5.6],"Estoc":[14,27.3],"Longsword":[21,35],"Mace":[14,28],"Katana":[14,28],"Katalox":[7,13.3],"Oak":[4.9,10.5],"Redwood":[4.9,10.5],"Willow":[4.9,10.5],"Buckler":[2.8,5.6,2.1,4.2],"Kite":[10.5,17.5,8.4,14],"Force":[2.8,7,2.1,5.6],"Leather Helmet":[3.5,7],"Leather Breastplate":[4.2,8.4],"Leather Gauntlets":[3.5,6.3],"Leather Leggings":[4.2,7.7],"Leather Boots":[2.8,5.6],"Plate Helmet":[14,21,11.2,16.8],"Plate Cuirass":[16.8,25.2,13.3,20.3],"Plate Gauntlets":[12.6,18.9,9.8,15.4],"Plate Greaves":[15.4,23.1,12.6,18.2],"Plate Sabatons":[11.2,16.8,9.1,13.3],"Power Helmet":[10.5,17.5,8.4,14],"Power Armor":[12.6,21,9.8,16.8],"Power Gauntlets":[9.8,16.1,7.7,12.6],"Power Leggings":[11.9,19.6,9.8,15.4],"Power Boots":[8.4,14,7,11.2]},"Interference":{"Dagger":[3.5,8.4],"Scythe":[7,20.3],"Tower":[14,19.6],"Axe":[3.5,10.5],"Club":[3.5,10.5],"Rapier":[3.5,10.5],"Shortsword":[3.5,10.5],"Wakizashi":[3.5,8.4],"Estoc":[7,14],"Longsword":[10.5,21],"Mace":[7,14],"Katana":[7,14],"Buckler":[1.4,4.9],"Kite":[10.5,17.5],"Force":[28,42],"Leather Helmet":[7,12.6],"Leather Breastplate":[8.4,15.4],"Leather Gauntlets":[6.3,11.2],"Leather Leggings":[7.7,14],"Leather Boots":[5.6,9.8],"Shade Helmet":[8.4,14,2.1,3.5],"Shade Breastplate":[9.8,16.8,2.8,4.2],"Shade Gauntlets":[7.7,12.6,2.1,3.5],"Shade Leggings":[9.1,15.4,2.1,4.2],"Shade Boots":[7,11.2,2.1,2.8],"Plate Helmet":[14,21],"Plate Cuirass":[16.8,25.2],"Plate Gauntlets":[12.6,18.9],"Plate Greaves":[15.4,23.1],"Plate Sabatons":[11.2,16.8],"Power Helmet":[17.5,24.5],"Power Armor":[21,29.4],"Power Gauntlets":[16.1,22.4],"Power Leggings":[19.6,27.3],"Power Boots":[14,19.6]},"Spell Damage":{"Dagger":[8.74,9.6,9.64,10.49,10.49],"Scythe":[8.74,9.6,9.64,10.49,10.49],"Axe":[8.74,8.8,8.84,8.91,8.96],"Club":[8.74,8.8,8.84,8.91,8.96],"Rapier":[8.74,8.8,8.84,8.91,8.96],"Shortsword":[8.74,8.8,8.84,8.91,8.96],"Wakizashi":[8.74,8.8,8.84,8.91,8.96],"Estoc":[8.74,8.8,8.84,8.91,8.96],"Longsword":[8.74,8.8,8.84,8.91,8.96],"Mace":[8.74,8.8,8.84,8.91,8.96],"Katana":[8.74,8.8,8.84,8.91,8.96],"Katalox":[8.74,9.6,9.64,10.52,11.37,16.78,17.64,17.68,18.56,19.41,8.74,8.8,8.84,8.91,8.96,28.84,30.5,31.35,33.03,34.68,20.8,22.46,23.31,24.99,26.64],"Oak":[12.76,13.62,14.46,15.34,16.19,20.8,21.66,22.5,23.38,24.23,8.74,8.8,8.84,8.91,8.96,32.86,34.52,35.37,37.85,39.51,24.82,26.48,27.33,29.81,31.47,14.36,15.23,15.27,16.14,16.19,6.32,7.19,7.23,8.1,8.15],"Redwood":[8.74,9.6,9.64,10.52,11.37,16.78,17.64,17.68,18.56,19.41,8.74,8.8,8.84,8.91,8.96,28.84,30.5,31.35,33.03,34.68,20.8,22.46,23.31,24.99,26.64],"Willow":[12.76,13.62,14.46,15.34,16.19,20.8,21.66,22.5,23.38,24.23,8.74,8.8,8.84,8.91,8.96,14.36,15.23,15.27,16.14,16.19,6.32,7.19,7.23,8.1,8.15],"Phase Cap":[12.76,13.62,14.46,15.34,16.19],"Phase Robe":[15.17,16.03,16.88,18.56,19.41],"Phase Gloves":[11.95,12.82,13.66,14.54,15.39],"Phase Pants":[14.36,15.23,16.07,17.75,18.6],"Phase Shoes":[10.34,11.21,12.05,12.93,12.98]},"Proficiency":{"Gossamer Cap":[6.38,6.71,7.03,7.66,7.66],"Gossamer Robe":[7.61,8.24,8.56,9.19,9.19],"Gossamer Gloves":[5.77,6.1,6.42,7.05,7.05],"Gossamer Pants":[7,7.63,7.95,8.58,8.58],"Gossamer Shoes":[5.16,5.49,5.81,6.44,6.44],"Katalox":[6.38,6.71,7.03,7.67,8,12.5,13.14,13.77,15.02,15.65,4.85,5.18,5.5,5.84,6.16],"Oak":[9.44,10.08,10.4,11.35,11.98,15.56,16.51,17.13,18.69,19.63,4.85,5.18,5.5,5.84,6.16],"Redwood":[6.38,6.71,7.03,7.67,8,12.5,13.14,13.77,15.02,15.65,3.32,3.65,3.67,4,4.33],"Willow":[9.44,10.08,10.4,11.35,11.98,15.56,16.51,17.13,18.69,19.63,4.85,5.18,5.5,5.84,6.16],"Cotton Cap":[6.38,6.71,7.03,7.67,8],"Cotton Robe":[7.61,8.24,8.56,9.2,9.53],"Cotton Gloves":[5.77,6.1,6.42,7.06,7.39],"Cotton Pants":[7,7.63,7.95,8.59,8.92],"Cotton Shoes":[5.16,5.49,5.81,6.45,6.47]},"Primary Attributes":{"Strength":{"Dagger":[2.66,2.98,3,3.31,3.31],"Scythe":[9.26,9.88,10.2,11.11,11.11],"Tower":[3.56,3.88,4.2,4.51,4.51],"Axe":[4.76,5.08,5.4,5.72,6.04],"Club":[4.76,5.08,5.4,5.72,6.04],"Rapier":[3.26,3.58,3.6,3.92,4.24],"Shortsword":[4.76,5.08,5.4,5.72,6.04],"Wakizashi":[2.66,2.98,3,3.32,3.34],"Estoc":[9.26,9.88,10.2,11.12,11.74],"Longsword":[9.26,9.88,10.2,11.12,11.74],"Mace":[9.26,9.88,10.2,11.12,11.74],"Katana":[9.26,9.88,10.2,11.12,11.74],"Buckler":[4.76,5.08,5.4,5.72,6.04],"Kite":[4.76,5.08,5.4,5.72,6.04],"Force":[4.76,5.08,5.4,5.72,6.04],"Leather Helmet":[3.86,4.18,4.5,4.82,4.84],"Leather Breastplate":[4.46,4.78,5.1,5.42,5.74],"Leather Gauntlets":[3.56,3.88,4.2,4.52,4.54],"Leather Leggings":[4.16,4.48,4.8,5.12,5.44],"Leather Boots":[3.26,3.58,3.6,3.92,4.24],"Shade Helmet":[3.26,3.58,3.6,3.92,4.24],"Shade Breastplate":[3.86,4.18,4.5,4.82,4.84],"Shade Gauntlets":[2.96,3.28,3.3,3.62,3.94],"Shade Leggings":[3.56,3.88,4.2,4.52,4.54],"Shade Boots":[2.66,2.98,3,3.32,3.34],"Plate Helmet":[3.86,4.18,4.5,4.82,4.84],"Plate Cuirass":[4.46,4.78,5.1,5.42,5.74],"Plate Gauntlets":[3.56,3.88,4.2,4.52,4.54],"Plate Greaves":[4.16,4.48,4.8,5.12,5.44],"Plate Sabatons":[3.26,3.58,3.6,3.92,4.24],"Power Helmet":[5.66,5.98,6.3,6.92,7.24],"Power Armor":[6.86,7.48,7.8,8.42,8.74],"Power Gauntlets":[5.06,5.38,5.7,6.32,6.34],"Power Leggings":[6.26,6.58,6.9,7.52,7.84],"Power Boots":[4.46,4.78,5.1,5.42,5.74]},"Dexterity":{"Dagger":[4.76,5.08,5.4,5.71,5.71],"Scythe":[4.76,5.08,5.4,5.71,5.71],"Tower":[3.56,3.88,4.2,4.51,4.51],"Gossamer Cap":[3.86,4.18,4.5,4.81,4.81],"Gossamer Robe":[4.46,4.78,5.1,5.41,5.41],"Gossamer Gloves":[3.56,3.88,4.2,4.51,4.51],"Gossamer Pants":[4.16,4.48,4.8,5.11,5.11],"Gossamer Shoes":[3.26,3.58,3.6,3.91,3.91],"Axe":[3.26,3.58,3.6,3.92,4.24],"Club":[3.26,3.58,3.6,3.92,4.24],"Rapier":[4.76,5.08,5.4,5.72,6.04],"Shortsword":[4.76,5.08,5.4,5.72,6.04],"Wakizashi":[6.26,6.58,6.9,7.52,7.84],"Estoc":[4.76,5.08,5.4,5.72,6.04],"Longsword":[7.76,8.38,8.7,9.32,9.94],"Mace":[6.26,6.58,6.9,7.52,7.84],"Katana":[7.76,8.38,8.7,9.32,9.94],"Buckler":[4.76,5.08,5.4,5.72,6.04],"Kite":[4.76,5.08,5.4,5.72,6.04],"Force":[4.76,5.08,5.4,5.72,6.04],"Leather Helmet":[3.86,4.18,4.5,4.82,4.84],"Leather Breastplate":[4.46,4.78,5.1,5.42,5.74],"Leather Gauntlets":[3.56,3.88,4.2,4.52,4.54],"Leather Leggings":[4.16,4.48,4.8,5.12,5.44],"Leather Boots":[3.26,3.58,3.6,3.92,4.24],"Shade Helmet":[3.86,4.18,4.5,4.82,4.84],"Shade Breastplate":[4.46,4.78,5.1,5.42,5.74],"Shade Gauntlets":[3.56,3.88,4.2,4.52,4.54],"Shade Leggings":[4.16,4.48,4.8,5.12,5.44],"Shade Boots":[3.26,3.58,3.6,3.92,4.24],"Plate Helmet":[3.86,4.18,4.5,4.82,4.84],"Plate Cuirass":[4.46,4.78,5.1,5.42,5.74],"Plate Gauntlets":[3.56,3.88,4.2,4.52,4.54],"Plate Greaves":[4.16,4.48,4.8,5.12,5.44],"Plate Sabatons":[3.26,3.58,3.6,3.92,4.24],"Power Helmet":[4.76,5.08,5.4,5.72,6.04],"Power Armor":[5.66,5.98,6.3,6.92,7.24],"Power Gauntlets":[4.46,4.78,5.1,5.42,5.74],"Power Leggings":[5.36,5.68,6,6.62,6.94],"Power Boots":[3.86,4.18,4.5,4.82,4.84]},"Agility":{"Dagger":[6.26,6.58,6.9,7.51,7.51],"Scythe":[2.66,2.98,3,3.31,3.31],"Tower":[2.36,2.68,2.7,3.01,3.01],"Gossamer Cap":[3.86,4.18,4.5,4.81,4.81],"Gossamer Robe":[4.46,4.78,5.1,5.41,5.41],"Gossamer Gloves":[3.56,3.88,4.2,4.51,4.51],"Gossamer Pants":[4.16,4.48,4.8,5.11,5.11],"Gossamer Shoes":[3.26,3.58,3.6,3.91,3.91],"Axe":[2.66,2.98,3,3.32,3.34],"Club":[3.26,3.58,3.6,3.92,4.24],"Rapier":[3.26,3.58,3.6,3.92,4.24],"Shortsword":[4.76,5.08,5.4,5.72,6.04],"Wakizashi":[6.26,6.58,6.9,7.52,7.84],"Estoc":[2.66,2.98,3,3.32,3.34],"Longsword":[3.26,3.58,3.6,3.92,4.24],"Mace":[3.26,3.58,3.6,3.92,4.24],"Katana":[3.26,3.58,3.6,3.92,4.24],"Cotton Cap":[3.86,4.18,4.5,4.82,4.84],"Cotton Robe":[4.46,4.78,5.1,5.42,5.74],"Cotton Gloves":[3.56,3.88,4.2,4.52,4.54],"Cotton Pants":[4.16,4.48,4.8,5.12,5.44],"Cotton Shoes":[3.26,3.58,3.6,3.92,4.24],"Phase Cap":[4.76,5.08,5.4,5.72,6.04],"Phase Robe":[5.66,5.98,6.3,6.92,7.24],"Phase Gloves":[4.46,4.78,5.1,5.42,5.74],"Phase Pants":[5.36,5.68,6,6.62,6.94],"Phase Shoes":[3.86,4.18,4.5,4.82,4.84],"Leather Helmet":[3.26,3.58,3.6,3.92,4.24],"Leather Breastplate":[3.86,4.18,4.5,4.82,4.84],"Leather Gauntlets":[2.96,3.28,3.3,3.62,3.94],"Leather Leggings":[3.56,3.88,4.2,4.52,4.54],"Leather Boots":[2.66,2.98,3,3.32,3.34],"Shade Helmet":[3.86,4.18,4.5,4.82,4.84],"Shade Breastplate":[4.46,4.78,5.1,5.42,5.74],"Shade Gauntlets":[3.56,3.88,4.2,4.52,4.54],"Shade Leggings":[4.16,4.48,4.8,5.12,5.44],"Shade Boots":[3.26,3.58,3.6,3.92,4.24],"Buckler":[0,0,0,0,0],"Kite":[0,0,0,0,0],"Force":[0,0,0,0,0]},"Endurance":{"Tower":[3.26,3.58,3.6,3.91,3.91],"Buckler":[4.76,5.08,5.4,5.72,6.04],"Kite":[4.76,5.08,5.4,5.72,6.04],"Force":[4.76,5.08,5.4,5.72,6.04],"Leather Helmet":[3.26,3.58,3.6,3.92,4.24],"Leather Breastplate":[3.86,4.18,4.5,4.82,4.84],"Leather Gauntlets":[2.96,3.28,3.3,3.62,3.94],"Leather Leggings":[3.56,3.88,4.2,4.52,4.54],"Leather Boots":[2.66,2.98,3,3.32,3.34],"Shade Helmet":[3.26,3.58,3.6,3.92,4.24],"Shade Breastplate":[3.86,4.18,4.5,4.82,4.84],"Shade Gauntlets":[2.96,3.28,3.3,3.62,3.94],"Shade Leggings":[3.56,3.88,4.2,4.52,4.54],"Shade Boots":[2.66,2.98,3,3.32,3.34],"Plate Helmet":[4.76,5.08,5.4,5.72,6.04],"Plate Cuirass":[5.66,5.98,6.3,6.92,7.24],"Plate Gauntlets":[4.46,4.78,5.1,5.42,5.74],"Plate Greaves":[5.36,5.68,6,6.62,6.94],"Plate Sabatons":[3.86,4.18,4.5,4.82,4.84],"Power Helmet":[3.86,4.18,4.5,4.82,4.84],"Power Armor":[4.46,4.78,5.1,5.42,5.74],"Power Gauntlets":[3.56,3.88,4.2,4.52,4.54],"Power Leggings":[4.16,4.48,4.8,5.12,5.44],"Power Boots":[3.26,3.58,3.6,3.92,4.24]},"Intelligence":{"Gossamer Cap":[4.76,5.08,5.4,5.71,5.71],"Gossamer Robe":[5.66,5.98,6.3,6.91,6.91],"Gossamer Gloves":[4.46,4.78,5.1,5.41,5.41],"Gossamer Pants":[5.36,5.68,6,6.61,6.61],"Gossamer Shoes":[3.86,4.18,4.5,4.81,4.81],"Katalox":[5.66,5.98,6.3,6.92,7.24],"Oak":[3.86,4.18,4.5,4.82,4.84],"Redwood":[4.76,5.08,5.4,5.72,6.04],"Willow":[3.86,4.18,4.5,4.82,4.84],"Cotton Cap":[4.76,5.08,5.4,5.72,6.04],"Cotton Robe":[5.66,5.98,6.3,6.92,7.24],"Cotton Gloves":[4.46,4.78,5.1,5.42,5.74],"Cotton Pants":[5.36,5.68,6,6.62,6.94],"Cotton Shoes":[3.86,4.18,4.5,4.82,4.84],"Phase Cap":[5.66,5.98,6.3,6.92,7.24],"Phase Robe":[6.86,7.48,7.8,8.42,8.74],"Phase Gloves":[5.06,5.38,5.7,6.32,6.34],"Phase Pants":[6.26,6.58,6.9,7.52,7.84],"Phase Shoes":[4.46,4.78,5.1,5.42,5.74],"Shade Helmet":[2.66,2.98,3,3.32,3.34],"Shade Breastplate":[3.26,3.58,3.6,3.92,4.24],"Shade Gauntlets":[2.36,2.68,2.7,3.02,3.04],"Shade Leggings":[2.96,3.28,3.3,3.62,3.94],"Shade Boots":[2.06,2.38,2.4,2.72,2.74]},"Wisdom":{"Dagger":[2.66,2.98,3,3.31,3.31],"Gossamer Cap":[4.76,5.08,5.4,5.71,5.71],"Gossamer Robe":[5.66,5.98,6.3,6.91,6.91],"Gossamer Gloves":[4.46,4.78,5.1,5.41,5.41],"Gossamer Pants":[5.36,5.68,6,6.61,6.61],"Gossamer Shoes":[3.86,4.18,4.5,4.81,4.81],"Katalox":[3.86,4.18,4.5,4.82,4.84],"Oak":[5.66,5.98,6.3,6.92,7.24],"Redwood":[4.76,5.08,5.4,5.72,6.04],"Willow":[5.66,5.98,6.3,6.92,7.24],"Cotton Cap":[4.76,5.08,5.4,5.72,6.04],"Cotton Robe":[5.66,5.98,6.3,6.92,7.24],"Cotton Gloves":[4.46,4.78,5.1,5.42,5.74],"Cotton Pants":[5.36,5.68,6,6.62,6.94],"Cotton Shoes":[3.86,4.18,4.5,4.82,4.84],"Phase Cap":[5.66,5.98,6.3,6.92,7.24],"Phase Robe":[6.86,7.48,7.8,8.42,8.74],"Phase Gloves":[5.06,5.38,5.7,6.32,6.34],"Phase Pants":[6.26,6.58,6.9,7.52,7.84],"Phase Shoes":[4.46,4.78,5.1,5.42,5.74],"Shade Helmet":[2.66,2.98,3,3.32,3.34],"Shade Breastplate":[3.26,3.58,3.6,3.92,4.24],"Shade Gauntlets":[2.36,2.68,2.7,3.02,3.04],"Shade Leggings":[2.96,3.28,3.3,3.62,3.94],"Shade Boots":[2.06,2.38,2.4,2.72,2.74]}},"Counter-Resist":{"Oak":[0,0,0,0,0],"Willow":[0,0,0,0,0]},"Attack Crit Damage":{"Shade Helmet":[0,0,0,0,0],"Shade Breastplate":[0,0,0,0,0],"Shade Gauntlets":[0,0,0,0,0],"Shade Leggings":[0,0,0,0,0],"Shade Boots":[0,0,0,0,0],"Power Helmet":[0,0,0,0,0,0,0,0,0,0],"Power Armor":[0,0,0,0,0,0,0,0,0,0],"Power Gauntlets":[0,0,0,0,0,0,0,0,0,0],"Power Leggings":[0,0,0,0,0,0,0,0,0,0],"Power Boots":[0,0,0,0,0,0,0,0,0,0]},"Spell Crit Damage":{"Phase Cap":[0,0,0,0,0],"Phase Robe":[0,0,0,0,0],"Phase Gloves":[0,0,0,0,0],"Phase Pants":[0,0,0,0,0],"Phase Shoes":[0,0,0,0,0]}},

	baseDataNew: {"Attack Damage":{"Dagger":[21.23,23.01,23.9,25.66,25.66,35.75,38.38,40.13,43.59,43.59],"Scythe":[51.98,54.6,57.21,62.38,62.38,75.04,79.37,82.83,90.56,90.56],"Axe":[45.39,51.14,55.37,59.87,59.87,57.56,64.78,70.24,75.92,75.92],"Club":[37.77,43.81,48.28,53.04,53.04,48.45,56.09,61.68,67.72,67.72],"Rapier":[26.6,31.67,35.41,39.38,39.38,34.99,41.3,46.05,51.33,51.33],"Shortsword":[33.01,38.95,43.33,47.92,47.92,42.7,50.3,55.69,61.58,61.58],"Wakizashi":[24.82,28.86,31.92,35.11,35.11,32.84,37.96,41.79,46.21,46.21],"Estoc":[49.07,55.42,60.07,64.99,64.99,62.01,69.91,75.44,82.07,82.07],"Longsword":[57.15,65.74,71.99,78.66,78.66,71.67,82.3,88.92,98.47,98.47],"Mace":[49.06,55.43,60.07,64.99,64.99,61.96,69.84,75.76,82.07,82.07],"Katana":[48.03,54.79,59.23,64.99,64.99,60.63,69.32,74.72,82.07,82.07],"Katalox":[21.92,26.81,30.41,34.23,34.23],"Oak":[21.93,26.82,30.42,34.24,34.24],"Redwood":[21.91,26.84,30.42,34.24,34.24],"Willow":[21.92,26.83,30.42,34.24,34.24],"Shade Helmet":[6.86,8.53,9.93,11.34,11.34],"Shade Breastplate":[8.18,10.07,11.7,13.3,13.3],"Shade Gauntlets":[6.3,7.77,9.06,10.32,10.32],"Shade Leggings":[7.56,9.38,10.87,12.3,12.3],"Shade Boots":[5.59,7.06,8.13,9.29,9.29],"Power Helmet":[11.38,14,15.97,18.04,18.04,16.48,19.81,22.91,25.73,25.73],"Power Armor":[13.53,16.65,19.11,21.46,21.46,19.65,23.71,27.03,30.68,30.68],"Power Gauntlets":[10.28,12.64,14.49,16.33,16.33,14.93,18.18,20.47,23.25,23.25],"Power Leggings":[12.49,15.38,17.57,19.75,19.75,17.51,22.27,24.63,28.2,28.2],"Power Boots":[9.25,11.38,12.94,14.62,14.62,13.1,16.39,18.34,20.77,20.77]},"Attack Accuracy":{"Dagger":[19.95,21.21,22.45,24.3,24.33,8.76,41.23,43.69,47.37,47.37],"Scythe":[6.59,7.25,7.28,7.92,7.92,18.13,19.38,20.02,21.88,21.88],"Axe":[8.84,10.43,11.55,12.81,12.81],"Club":[9.01,10.49,11.62,12.81,12.81,21.72,25.47,27.83,31.02,31.02],"Rapier":[15.75,18.21,20,21.92,21.92,31.88,36.95,40.51,44.68,44.68],"Shortsword":[20.37,23.36,25.62,27.99,27.99,38.73,44.8,48.95,53.79,53.79],"Wakizashi":[20.25,22.09,23.5,24.96,24.96,38.63,42.85,45.8,49.24,49.24],"Estoc":[7.3,8.25,9,9.78,9.78,19.16,21.95,23.65,26.47,26.47],"Longsword":[8.83,10.44,11.52,12.81,12.81,21.5,25.05,27.59,31.02,31.02],"Mace":[8.71,10.06,11.14,12.2,12.2,21.29,24.51,27.23,30.11,30.11],"Katana":[20.35,23.36,25.63,27.98,27.98,38.73,44.66,48.6,53.78,53.78],"Cotton Cap":[2.89,3.53,4.1,4.62,4.62],"Cotton Robe":[3.37,4.13,4.82,5.41,5.41],"Cotton Gloves":[2.64,3.22,3.73,4.25,4.25],"Cotton Pants":[3.13,3.83,4.47,5.04,5.04],"Cotton Shoes":[2.4,2.92,3.37,3.83,3.83],"Phase Cap":[2.87,3.52,4.09,4.62,4.62],"Phase Robe":[3.36,4.12,4.83,5.41,5.41],"Phase Gloves":[2.64,3.22,3.73,4.25,4.25],"Phase Pants":[3.12,3.81,4.46,5.04,5.04],"Phase Shoes":[2.39,2.91,3.38,3.83,3.83],"Shade Helmet":[4.15,5.15,6.01,6.78,6.78],"Shade Breastplate":[5.06,6.19,7.06,8,8],"Shade Gauntlets":[3.91,4.73,5.39,6.18,6.18],"Shade Leggings":[4.58,5.57,6.2,7.05,7.05],"Shade Boots":[3.49,4.25,4.85,5.57,5.57],"Power Helmet":[3.67,4.61,5.38,6.15,6.15,13.02,16.27,18.64,19.65,19.65],"Power Armor":[4.34,5.47,6.35,7.24,7.24,15.33,19.19,21.54,25.09,25.09],"Power Gauntlets":[3.36,4.19,4.86,5.6,5.6,11.82,14.49,16.84,18.42,18.42],"Power Leggings":[3.98,5.04,5.83,6.69,6.69,14.49,17.24,20.4,23.08,23.08],"Power Boots":[3.01,3.77,4.4,5.05,5.05,10.66,12.86,14.66,16.31,16.31]},"Attack Crit Chance":{"Dagger":[4.29,4.51,4.72,5.15,5.15,8.07,8.5,8.92,9.779,9.779],"Scythe":[6.39,6.71,7.03,7.67,7.67,10.7,11.33,11.86,12.92,12.92],"Axe":[3.53,4.26,4.8,5.37,5.37],"Club":[3.41,4.19,4.76,5.37,5.37,6.88,8.26,9.2,10.41,10.41],"Rapier":[3.41,4.19,4.76,5.37,5.37,6.84,8.25,9.16,10.41,10.41],"Shortsword":[3.53,4.26,4.8,5.37,5.37,7.03,8.34,9.31,10.41,10.41],"Wakizashi":[3.53,4.26,4.8,5.37,5.37,7.04,8.32,9.19,10.41,10.41],"Estoc":[6.03,6.81,7.39,7.99,7.99,9.97,11.38,12.21,13.56,13.56],"Longsword":[6.43,7.26,7.86,8.52,8.52,10.47,11.9,12.87,14.19,14.19],"Mace":[6.03,6.81,7.39,7.99,7.99,10,11.41,12.3,13.56,13.56],"Katana":[6.43,7.26,7.86,8.52,8.52,10.48,11.95,12.94,14.19,14.19],"Shade Helmet":[2.05,2.32,2.53,2.75,2.75],"Shade Breastplate":[2.41,2.75,3.01,3.27,3.27],"Shade Gauntlets":[1.81,2.1,2.28,2.49,2.49],"Shade Leggings":[2.25,2.52,2.76,2.95,2.95],"Shade Boots":[1.65,1.87,2.05,2.22,2.22],"Power Helmet":[0.88,1.09,1.26,1.43,1.43,3.71,4.45,4.88,5.58,5.58],"Power Armor":[1.03,1.29,1.49,1.69,1.69,4.6,5.08,6.06,6.8,6.8],"Power Gauntlets":[0.79,0.99,1.14,1.3,1.3,3.36,3.92,4.36,4.91,4.91],"Power Leggings":[0.96,1.2,1.37,1.57,1.57,4.09,4.84,5.26,6.25,6.25],"Power Boots":[0.72,0.89,1.03,1.17,1.17,3.01,3.5,3.9,4.3,4.3]},"Attack Speed":{"Dagger":[7.63,8.15,8.65,9.16,9.16,9.16,11.96,12.96,13.46,14.45,14.45],"Shortsword":[4.57,5.32,5.94,6.54,6.54],"Wakizashi":[8.25,9.96,11.23,12.56,12.56,12.44,14.86,16.51,18.57,18.57],"Buckler":[2.22,2.78,3.22,3.61,3.61],"Kite":[2.21,2.77,3.19,3.65,3.65],"Leather Helmet":[2.25,2.78,3.27,3.69,3.69],"Leather Breastplate":[2.63,3.26,3.75,3.99,3.99],"Leather Gauntlets":[2.09,2.54,2.95,3.4,3.4],"Leather Leggings":[2.43,3.02,3.29,4.03,4.03],"Leather Boots":[1.83,2.28,2.7,3.06,3.06],"Shade Helmet":[2.24,2.63,3.2,3.69,3.69],"Shade Breastplate":[2.47,3.26,3.68,4.31,4.31],"Shade Gauntlets":[1.89,2.43,2.75,3.4,3.4],"Shade Leggings":[2.38,2.77,3.44,4.03,4.03],"Shade Boots":[1.83,2.15,2.69,3.06,3.06]},"Casting Speed":{"Cotton Cap":[2.3,2.74,3.01,3.47,3.47],"Cotton Robe":[2.68,3.21,3.61,4.06,4.06],"Cotton Gloves":[2.11,2.47,2.82,3.18,3.18],"Cotton Pants":[2.47,2.97,3.34,3.77,3.77],"Cotton Shoes":[1.91,2.24,2.55,2.89,2.89],"Phase Cap":[2.2,2.66,3,3.47,3.47],"Phase Robe":[2.43,3.07,3.58,4.06,4.06],"Phase Gloves":[2.06,2.48,2.81,3.18,3.18],"Phase Pants":[2.33,2.96,3.34,3.77,3.77],"Phase Shoes":[1.73,2.22,2.52,2.89,2.89]},"Magic Damage":{"Katalox":[22.86,26.61,29.27,32.4,32.4,36.66,42.26,46.84,52.2,52.2],"Oak":[22.6,26.38,29.02,31.99,31.99],"Redwood":[22.6,26.38,29.02,31.99,31.99,36.39,42.03,46.86,51.71,51.71],"Willow":[22.61,26.37,28.96,31.99,31.99,36.51,42.63,45.94,51.71,51.71],"Phase Cap":[2.69,3.31,3.77,4.24,4.24],"Phase Robe":[3.17,3.8,4.35,4.9,4.9],"Phase Gloves":[2.35,3.03,3.44,3.9,3.9],"Phase Pants":[2.97,3.53,4.1,4.56,4.56],"Phase Shoes":[1.94,2.78,3.18,3.57,3.57]},"Magic Accuracy":{"Dagger":[4.84,5.37,5.4,5.91,5.91],"Gossamer Cap":[3.37,3.9,3.92,4.44,4.44],"Gossamer Robe":[3.86,4.39,4.41,4.93,4.93],"Gossamer Gloves":[2.88,3.41,3.43,3.46,3.46],"Gossamer Pants":[3.86,4.39,4.41,4.93,4.93],"Gossamer Shoes":[2.88,3.41,3.43,3.46,3.46],"Club":[5.91,6.66,7.24,7.48,7.48],"Rapier":[5.91,6.67,7.24,7.91,7.91],"Shortsword":[5.91,6.67,7.2,7.89,7.89],"Wakizashi":[5.92,6.68,7.03,7.91,7.91],"Estoc":[9.58,10.88,11.8,12.82,12.82],"Longsword":[9.58,10.83,11.53,12.82,12.82],"Mace":[9.57,10.9,11.5,12.82,12.82],"Katalox":[13.52,15.76,17.44,19.18,19.18,26.81,31.42,34.08,38.34,38.34],"Oak":[13.39,15.62,17.19,18.94,18.94,26.74,31.19,34.14,38,38],"Redwood":[13.38,15.62,17.2,18.94,18.94,26.65,31.28,33.55,38,38],"Willow":[13.39,15.61,17.19,18.94,18.94,26.7,31.14,33.98,38,38],"Buckler":[9.59,10.89,11.58,12.73,12.73],"Cotton Cap":[2.83,3.34,3.8,4.23,4.23],"Cotton Robe":[3.32,3.93,4.5,4.96,4.96],"Cotton Gloves":[2.57,3.05,3.47,3.88,3.88],"Cotton Pants":[3.07,3.64,4.15,4.62,4.62],"Cotton Shoes":[2.33,2.75,3.12,3.49,3.49],"Phase Cap":[3.8,4.46,4.94,5.45,5.45],"Phase Robe":[4.48,5.3,5.82,6.43,6.43],"Phase Gloves":[3.46,4.07,4.5,4.96,4.96],"Phase Pants":[4.14,4.85,5.38,5.94,5.94],"Phase Shoes":[3.12,3.63,4.06,4.47,4.47],"Shade Helmet":[5.3,5.84,6.48,7.01,7.01],"Shade Breastplate":[6.23,7.12,7.53,8.2,8.2],"Shade Gauntlets":[4.77,5.35,5.86,6.37,6.37],"Shade Leggings":[5.81,6.23,6.94,7.62,7.62],"Shade Boots":[4.31,4.86,5.3,5.73,5.73]},"Magic Crit Chance":{"Katalox":[5.16,6.02,6.64,7.3,7.3,8.48,9.87,11.02,12.39,12.39],"Oak":[3.7,4.55,5.17,5.82,5.82,6.84,8.36,9.36,10.61,10.61],"Redwood":[3.7,4.55,5.17,5.82,5.82,6.83,8.32,8.8,10.61,10.61],"Willow":[3.7,4.55,5.17,5.82,5.82,6.85,8.31,9.19,10.61,10.61]},"Mana Conservation":{"Dagger":[14,14,14,14,14],"Gossamer Cap":[2.87,2.94,2.99,3.05,3.05],"Gossamer Robe":[2.87,2.94,2.99,3.05,3.05],"Gossamer Gloves":[2.87,2.94,2.99,3.05,3.05],"Gossamer Pants":[2.87,2.94,2.99,3.05,3.05],"Gossamer Shoes":[2.87,2.94,2.99,3.05,3.05],"Club":[12,13.56,14.69,15.34,15.34],"Rapier":[12.01,13.55,14.66,16.11,16.11],"Shortsword":[11.94,13.47,14.74,15.97,15.97],"Wakizashi":[12.04,13.61,14.81,16.12,16.12],"Estoc":[19.33,22.06,23.54,26.11,26.11],"Longsword":[19.52,22.05,23.49,26.11,26.11],"Mace":[19.54,21.9,23.36,26.11,26.11],"Katalox":[21.95,26.41,29.6,33.08,33.08],"Oak":[21.97,26.41,29.64,33.09,33.09],"Redwood":[21.96,26.39,29.12,33.09,33.09],"Willow":[21.97,26.42,29.62,33.09,33.09],"Buckler":[19.53,22.17,23.96,25.24,25.24],"Cotton Cap":[2.63,2.98,3.21,3.61,3.61],"Cotton Robe":[3.05,3.39,3.76,4.04,4.04],"Cotton Gloves":[2.41,2.78,3.04,3.41,3.41],"Cotton Pants":[2.85,3.17,3.41,3.91,3.91],"Cotton Shoes":[2.24,2.56,2.75,3.03,3.03],"Phase Cap":[2.59,2.98,3.25,3.61,3.61],"Phase Robe":[2.97,3.39,3.74,4.11,4.11],"Phase Gloves":[2.29,2.75,3.03,3.41,3.41],"Phase Pants":[2.72,3.18,3.45,3.91,3.91],"Phase Shoes":[2.19,2.58,2.74,3.11,3.11]},"Physical Mitigation":{"Tower":[2.7,2.93,3.15,3.37,3.37,4.17,4.61,4.83,5.26,5.26],"Gossamer Cap":[2.7,2.93,3.15,3.37,3.37],"Gossamer Robe":[3.12,3.35,3.57,3.79,3.79],"Gossamer Gloves":[2.49,2.72,2.94,3.16,3.16],"Gossamer Pants":[2.91,3.14,3.36,3.58,3.58],"Gossamer Shoes":[2.28,2.51,2.52,2.74,2.74],"Buckler":[1.73,1.95,2.15,2.33,2.33,2.94,3.42,3.79,4.22,4.22],"Kite":[2.53,2.85,3.11,3.38,3.38,3.9,4.53,4.98,5.48,5.48],"Force":[2.42,2.79,3.08,3.38,3.38,3.77,4.4,4.88,5.48,5.48],"Cotton Cap":[3.33,3.76,4.09,4.43,4.43,4.86,5.6,6.11,6.74,6.74],"Cotton Robe":[3.96,4.47,4.86,5.27,5.27,5.79,6.7,7.29,8.04,8.04],"Cotton Gloves":[3.01,3.4,3.7,4.01,4.01,4.4,5.07,5.53,6.09,6.09],"Cotton Pants":[3.64,4.12,4.48,4.85,4.85,5.32,6.11,6.75,7.39,7.39],"Cotton Shoes":[2.7,3.05,3.3,3.59,3.59,3.92,4.5,4.99,5.36,5.36],"Phase Cap":[2.53,2.85,3.11,3.38,3.38],"Phase Robe":[3.01,3.4,3.7,4.01,4.01],"Phase Gloves":[2.3,2.58,2.83,3.07,3.07],"Phase Pants":[2.76,3.13,3.41,3.7,3.7],"Phase Shoes":[2.05,2.31,2.53,2.75,2.75],"Leather Helmet":[6.73,7.29,7.69,8.12,8.12,8.95,9.84,10.45,11.17,11.17],"Leather Breastplate":[8.05,8.72,9.18,9.7,9.7,10.7,11.73,12.44,13.35,13.35],"Leather Gauntlets":[6.08,6.57,6.93,7.34,7.34,8.09,8.86,9.38,10.09,10.09],"Leather Leggings":[7.38,8,8.44,8.92,8.92,9.82,10.75,11.43,12.28,12.28],"Leather Boots":[5.41,5.86,6.2,6.55,6.55,7.17,7.89,8.37,8.98,8.98],"Shade Helmet":[5.15,5.81,6.41,6.99,6.99],"Shade Breastplate":[6.15,7.02,7.65,8.31,8.31],"Shade Gauntlets":[4.63,5.29,5.8,6.32,6.32],"Shade Leggings":[5.64,6.42,7.06,7.64,7.64],"Shade Boots":[4.13,4.73,5.19,5.64,5.64],"Plate Helmet":[9.36,9.91,10.3,10.73,10.73,12.09,12.97,13.57,14.3,14.3],"Plate Cuirass":[11.21,11.87,12.31,12.83,12.83,14.49,15.54,16.23,17.12,17.12],"Plate Gauntlets":[8.43,8.95,9.28,9.68,9.68,10.91,11.71,12.21,12.9,12.9],"Plate Greaves":[10.28,10.88,11.3,11.78,11.78,13.3,14.23,14.91,15.71,15.71],"Plate Sabatons":[7.51,7.96,8.28,8.63,8.63,9.69,10.39,10.88,11.49,11.49],"Power Helmet":[6.73,7.29,7.68,8.11,8.11,8.91,9.83,10.41,11.16,11.16],"Power Armor":[8.05,8.71,9.17,9.69,9.69,10.71,11.7,12.42,13.34,13.34],"Power Gauntlets":[6.07,6.58,6.92,7.33,7.33,8.01,8.83,9.37,10.09,10.09],"Power Leggings":[7.38,8,8.43,8.91,8.91,9.79,10.69,11.38,12.27,12.27],"Power Boots":[5.41,5.85,6.17,6.54,6.54,7.17,7.85,8.33,8.97,8.97]},"Magical Mitigation":{"Tower":[2.59,2.8,3.01,3.23,3.23,3.23,3.59,4.01,4.22,4.43,4.43],"Gossamer Cap":[3.39,3.61,3.82,4.23,4.23],"Gossamer Robe":[3.99,4.21,4.42,4.83,4.83],"Gossamer Gloves":[2.99,3.2,3.41,3.63,3.63],"Gossamer Pants":[3.79,4.01,4.22,4.63,4.63],"Gossamer Shoes":[2.79,3,3.21,3.43,3.43],"Buckler":[1.65,1.87,2.06,2.23,2.23,4.72,5.44,5.9,6.12,6.12],"Kite":[2.42,2.73,2.98,3.24,3.24,5.67,6.48,7.08,7.86,7.86],"Force":[2.32,2.67,2.95,3.24,3.24,5.45,6.32,7.09,7.86,7.86],"Cotton Cap":[3.19,3.6,3.91,4.24,4.24,6.57,7.54,8.2,9.07,9.07],"Cotton Robe":[3.79,4.28,4.66,5.05,5.05,7.85,9.06,9.83,10.83,10.83],"Cotton Gloves":[2.89,3.26,3.55,3.84,3.84,5.94,6.81,7.44,8.18,8.18],"Cotton Pants":[3.49,3.94,4.29,4.64,4.64,7.23,8.32,9,9.95,9.95],"Cotton Shoes":[2.58,2.91,3.16,3.44,3.44,5.29,6.07,6.62,7.3,7.3],"Phase Cap":[3.18,3.59,3.89,4.24,4.24],"Phase Robe":[3.79,4.28,4.65,5.05,5.05],"Phase Gloves":[2.88,3.26,3.55,3.84,3.84],"Phase Pants":[3.48,3.93,4.29,4.64,4.64],"Phase Shoes":[2.58,2.91,3.15,3.44,3.44],"Leather Helmet":[4.91,5.61,6.13,6.67,6.67,8.67,9.92,10.91,11.97,11.97],"Leather Breastplate":[5.88,6.69,7.32,7.95,7.95,10.34,11.84,12.94,14.33,14.33],"Leather Gauntlets":[4.43,5.06,5.55,6.02,6.02,7.8,8.96,9.84,10.81,10.81],"Leather Leggings":[5.4,6.15,6.73,7.31,7.31,9.5,10.91,11.83,13.14,13.14],"Leather Boots":[3.95,4.52,4.94,5.38,5.38,6.92,8,8.7,9.62,9.62],"Shade Helmet":[3.95,4.48,4.85,5.28,5.28],"Shade Breastplate":[4.71,5.34,5.79,6.28,6.28],"Shade Gauntlets":[3.56,4.06,4.38,4.78,4.78],"Shade Leggings":[4.33,4.88,5.33,5.76,5.76],"Shade Boots":[3.16,3.6,3.94,4.28,4.28],"Plate Helmet":[5.86,6.61,7.16,7.76,7.76,9.77,11.15,12.02,13.29,13.29],"Plate Cuirass":[7.01,7.9,8.55,9.27,9.27,11.72,13.4,14.5,15.79,15.79],"Plate Gauntlets":[5.29,5.97,6.46,7.02,7.02,8.79,10.05,10.86,12,12],"Plate Greaves":[6.44,7.25,7.87,8.52,8.52,10.78,12.23,13.33,14.61,14.61],"Plate Sabatons":[4.71,5.33,5.76,6.25,6.25,7.86,8.95,9.82,10.67,10.67],"Power Helmet":[4.69,5.3,5.78,6.26,6.26,8.33,9.44,10.48,11.48,11.48],"Power Armor":[5.6,6.33,6.91,7.46,7.46,10.03,11.45,12.53,13.73,13.73],"Power Gauntlets":[4.23,4.78,5.22,5.65,5.65,7.55,8.64,9.33,10.36,10.36],"Power Leggings":[5.16,5.83,6.34,6.86,6.86,9.18,10.49,11.45,12.61,12.61],"Power Boots":[3.79,4.28,4.65,5.05,5.05,6.72,7.59,8.4,9.23,9.23]},"Damage Mitigations":{"Tower":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.06,1.23,1.24,1.4,1.4,2.12,2.28,2.44,2.61,2.61,1.78,1.94,2.1,2.26,2.26],"Gossamer Cap":[16.87,17.94,18.99,21.05,21.05],"Gossamer Robe":[19.87,20.94,21.99,24.05,24.05],"Gossamer Gloves":[14.87,15.94,16.99,18.05,18.05],"Gossamer Pants":[18.87,19.94,20.99,23.05,23.05],"Gossamer Shoes":[13.87,14.94,15.99,17.05,17.05],"Buckler":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.25,2.66,2.94,3.26,3.26,2.21,2.62,2.88,3.19,3.19,2.18,2.57,2.83,3.16,3.16],"Kite":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4.82,5.74,6.42,7.06,7.06,4.76,5.67,6.34,6.94,6.94,4.67,5.56,6.19,6.69,6.69,2.23,2.65,2.92,3.27,3.27,2.21,2.63,2.89,3.23,3.23,2.17,2.57,2.75,3.16,3.16,6.57,7.87,8.75,9.51,9.51,6.54,7.92,8.2,8.2,8.2,6.68,7.42,8.13,9.26,9.26],"Force":[18.18,21.35,23.75,26.1,26.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4.7,5.62,6.42,7.14,7.14,4.76,5.67,6.33,7.04,7.04,4.67,5.53,6.18,6.83,6.83],"Cotton Cap":[18.35,21.38,23.67,26.11,26.11,2.46,2.78,3.02,3.27,3.27],"Cotton Robe":[21.82,25.47,28.34,31.11,31.11,2.92,3.3,3.59,3.89,3.89],"Cotton Gloves":[16.52,19.29,21.43,23.61,23.61,2.22,2.51,2.74,2.96,2.96],"Cotton Pants":[20.13,23.48,26.03,28.61,28.61,2.69,3.04,3.31,3.58,3.58],"Cotton Shoes":[14.83,17.27,19.13,21.11,21.11,1.99,2.25,2.43,2.65,2.65],"Phase Cap":[18.32,21.37,23.73,26.11,26.11,1.87,2.1,2.3,2.5,2.5],"Phase Robe":[21.2,25.47,28.31,31.11,31.11,2.22,2.51,2.73,2.96,2.96],"Phase Gloves":[16.42,19.25,21.45,23.61,23.61,1.7,1.91,2.09,2.26,2.26],"Phase Pants":[20.09,23.46,26.03,28.61,28.61,2.04,2.31,2.52,2.73,2.73],"Phase Shoes":[14.8,17.29,19.03,21.11,21.11,1.51,1.71,1.87,2.03,2.03],"Leather Helmet":[18.33,21.37,23.82,26.17,26.17,5.98,6.74,7.33,7.93,7.93,5.9,6.66,7.24,7.83,7.83,2.93,3.33,3.62,3.93,3.93,10.67,12.32,13.31,14.07,14.07,10.53,12.2,13.28,14.71,14.71,7.51,8.68,9.54,10.46,10.46,7.97,9.17,9.81,10.8,10.8,7.93,9.1,9.71,10.74,10.74,4.97,5.71,6.11,6.84,6.84,12.27,14.55,15.93,17.27,17.27,12.14,14.11,15.02,16.35,16.35,9.08,10.3,11.11,12.79,12.79],"Leather Breastplate":[21.82,25.47,28.43,31.17,31.17,7.16,8.06,8.78,9.48,9.48,7.06,7.96,8.66,9.36,9.36,3.51,3.98,4.31,4.68,4.68,12.82,14.81,16.19,17.74,17.74,12.55,14.38,15.92,17.62,17.62,8.99,10.44,11.39,12.78,12.78,9.73,10.88,11.97,13.2,13.2,9.51,10.75,11.87,13.03,13.03,5.93,6.77,7.39,8.28,8.28,14.89,16.98,18.13,18.13,18.13,14.74,16.9,17.89,20,20,11.07,12.65,13.4,15.48,15.48],"Leather Gauntlets":[16.52,19.29,21.45,23.67,23.67,5.39,6.08,6.62,7.16,7.16,5.32,6,6.54,7.06,7.06,2.65,3.02,3.27,3.55,3.55,9.64,11.13,12.12,13.43,13.43,9.45,10.88,11.92,13.26,13.26,6.77,7.86,8.64,9.42,9.42,7.2,8.06,9.02,9.95,9.95,7.12,8.17,8.81,9.73,9.73,4.5,5.03,5.47,6.25,6.25,10.8,12.75,13.97,13.97,13.97,10.78,12.51,14.24,16.01,16.01,8.07,9.72,9.72,10.86,10.86],"Leather Leggings":[20.14,23.5,26.12,28.67,28.67,6.57,7.41,8.05,8.71,8.71,6.48,7.32,7.94,8.59,8.59,3.22,3.65,3.96,4.3,4.3,11.76,13.58,14.79,16.26,16.26,11.58,13.38,14.57,15.3,15.3,8.24,9.63,10.62,11.73,11.73,8.87,10.19,10.87,11.78,11.78,8.72,9.94,10.82,11.7,11.7,5.45,6.27,6.86,7.38,7.38,13.56,15.42,17.16,18.63,18.63,13.48,14.87,16.62,18.71,18.71,10.16,11.44,13.08,13.77,13.77],"Leather Boots":[14.82,17.3,18.99,21.17,21.17,4.8,5.42,5.89,6.38,6.38,4.74,5.36,5.81,6.3,6.3,2.37,2.69,2.92,3.18,3.18,8.56,9.88,10.75,11.96,11.96,8.43,9.77,10.61,11.81,11.81,6.02,6.99,7.59,8.58,8.58,6.34,7.32,7.94,8.86,8.86,6.34,7.27,7.96,8.75,8.75,4,4.54,5.03,5.58,5.58,9.77,10.53,12.43,12.43,12.43,9.56,11.69,12.67,12.67,12.67,7.28,8.46,9.7,10.98,10.98],"Shade Helmet":[18.03,21.39,23.81,26.28,26.28,4.54,5.11,5.54,6.01,6.01,4.46,5.03,5.46,5.93,5.93],"Shade Breastplate":[21.73,25.48,28.35,31.18,31.18,5.42,6.1,6.61,7.16,7.16,5.33,6.01,6.52,7.06,7.06],"Shade Gauntlets":[16.52,19.28,21.31,23.78,23.78,4.08,4.6,4.98,5.44,5.44,4.04,4.56,4.94,5.37,5.37],"Shade Leggings":[20.1,23.39,25.92,28.67,28.67,4.99,5.6,6.08,6.58,6.58,4.9,5.53,6,6.5,6.5],"Shade Boots":[14.7,17.26,19.11,21.28,21.28,3.63,4.1,4.47,4.85,4.85,3.6,4.05,4.41,4.79,4.79],"Plate Helmet":[18.34,21.38,23.67,26.11,26.11,4.04,4.8,5.39,5.98,5.98,7.81,8.57,9.14,9.73,9.73,7.66,8.4,8.96,9.54,9.54,8.73,10.42,11.56,12.96,12.96,12.44,14.04,14.92,16.62,16.62,12.18,13.76,14.88,16.29,16.29],"Plate Cuirass":[21.82,25.49,28.35,31.11,31.11,4.83,5.73,6.44,7.15,7.15,9.36,10.25,10.95,11.64,11.64,9.17,10.05,10.73,11.42,11.42,10.41,12.39,13.76,14.95,14.95,14.94,16.86,18.25,19.91,19.91,14.66,16.48,17.77,19.52,19.52],"Plate Gauntlets":[16.52,19.27,21.44,23.61,23.61,3.65,4.34,4.86,5.41,5.41,7.05,7.73,8.24,8.78,8.78,6.91,7.58,8.08,8.61,8.61,7.86,9.29,10.44,11.69,11.69,11.17,12.68,13.52,14.98,14.98,11.03,12.48,13.35,14.69,14.69],"Plate Greaves":[20.12,23.49,25.97,28.61,28.61,4.42,5.27,5.9,6.57,6.57,8.57,9.41,10.05,10.7,10.7,8.41,9.23,9.85,10.49,10.49,9.57,11.45,12.59,14.25,14.25,13.71,15.48,16.71,18.27,18.27,13.37,15.12,16.46,17.91,17.91],"Plate Sabatons":[14.81,17.28,19.08,21.11,21.11,3.25,3.87,4.33,4.82,4.82,6.26,6.88,7.34,7.82,7.82,6.15,6.75,7.19,7.67,7.67,7,8.3,9.12,10.4,10.4,9.97,11.31,12.22,13.33,13.33,9.79,11.02,11.95,13.07,13.07],"Power Helmet":[18.3,21.39,23.49,26.13,26.13,3.62,4.09,4.46,4.82,4.82,5.9,6.66,7.23,7.82,7.82,5.78,6.53,7.08,7.67,7.67],"Power Armor":[21.68,25.5,28.36,31.13,31.13,4.32,4.88,5.33,5.76,5.76,7.06,7.95,8.65,9.35,9.35,6.92,7.8,8.48,9.17,9.17],"Power Gauntlets":[16.36,19.08,21.26,23.63,23.63,3.26,3.69,4.02,4.36,4.36,5.32,6,6.53,7.06,7.06,5.21,5.88,6.4,6.92,6.92],"Power Leggings":[19.97,23.38,26,28.63,28.63,3.98,4.5,4.89,5.29,5.29,6.48,7.31,7.94,8.59,8.59,6.35,7.17,7.78,8.42,8.42],"Power Boots":[14.85,17.18,19.16,21.13,21.13,2.92,3.3,3.59,3.89,3.89,4.73,5.36,5.81,6.29,6.29,4.64,5.25,5.69,6.17,6.17]},"Evade Chance":{"Gossamer Cap":[3.22,3.49,3.75,4.01,4.01],"Gossamer Robe":[3.72,3.99,4.25,4.51,4.51],"Gossamer Gloves":[2.97,3.24,3.5,3.76,3.76],"Gossamer Pants":[3.47,3.74,4,4.26,4.26],"Gossamer Shoes":[2.72,2.99,3,3.26,3.26],"Cotton Cap":[2.71,3.23,3.61,4.03,4.03],"Cotton Robe":[3.21,3.83,4.29,4.78,4.78],"Cotton Gloves":[2.46,2.93,3.29,3.65,3.65],"Cotton Pants":[2.96,3.53,3.96,4.4,4.4],"Cotton Shoes":[2.21,2.62,2.94,3.28,3.28],"Phase Cap":[3.96,4.47,4.86,5.28,5.28],"Phase Robe":[4.71,5.32,5.79,6.28,6.28],"Phase Gloves":[3.58,4.05,4.41,4.78,4.78],"Phase Pants":[4.33,4.9,5.33,5.78,5.78],"Phase Shoes":[3.2,3.62,3.92,4.28,4.28],"Leather Helmet":[1.64,1.98,2.26,2.54,2.54],"Leather Breastplate":[1.94,2.33,2.65,2.99,2.99],"Leather Gauntlets":[1.49,1.8,2.06,2.32,2.32],"Leather Leggings":[1.79,2.15,2.45,2.77,2.77],"Leather Boots":[1.34,1.63,1.85,2.09,2.09],"Shade Helmet":[2.91,3.52,3.88,4.45,4.45,4.59,5.36,6.04,6.67,6.67],"Shade Breastplate":[3.45,4.17,4.65,5.24,5.24,5.51,6.46,7.05,7.94,7.94],"Shade Gauntlets":[2.63,3.14,3.53,4.05,4.05,4.17,4.87,5.36,6.04,6.04],"Shade Leggings":[3.16,3.82,4.3,4.84,4.84,5.07,5.92,6.62,7.32,7.32],"Shade Boots":[2.36,2.84,3.23,3.62,3.62,3.72,4.37,4.85,5.39,5.39]},"Resist Chance":{"Cotton Cap":[4.23,4.91,5.5,6.11,6.11],"Cotton Robe":[4.95,5.79,6.48,7.16,7.16],"Cotton Gloves":[3.83,4.51,5.03,5.63,5.63],"Cotton Pants":[4.62,5.31,6,6.68,6.68],"Cotton Shoes":[3.5,4.02,4.55,5.07,5.07],"Phase Cap":[4.37,5.22,5.84,6.52,6.52],"Phase Robe":[5.18,6.1,6.88,7.64,7.64],"Phase Gloves":[3.97,4.75,5.35,5.95,5.95],"Phase Pants":[4.77,5.7,6.33,7.08,7.08],"Phase Shoes":[3.58,4.34,4.79,5.39,5.39],"Leather Helmet":[7.04,8.46,9.5,10.59,10.59],"Leather Breastplate":[8.33,9.97,11.26,12.52,12.52],"Leather Gauntlets":[6.4,7.65,8.57,9.62,9.62],"Leather Leggings":[7.68,9.25,10.38,11.55,11.55],"Leather Boots":[5.76,6.93,7.73,8.66,8.66],"Shade Helmet":[9.27,11.24,12.66,14.21,14.21,14.95,17.2,19.26,21.15,21.15],"Shade Breastplate":[11.03,13.36,15.13,16.86,16.86,17.7,20.71,23,25.54,25.54],"Shade Gauntlets":[8.39,10.21,11.44,12.92,12.92,13.47,15.74,17.44,19.43,19.43],"Shade Leggings":[10.17,12.28,13.9,15.57,15.57,16.34,19.13,21.03,23.53,23.53],"Shade Boots":[7.5,9.15,10.3,11.56,11.56,11.92,13.89,15.65,17.22,17.22]},"Parry Chance":{"Dagger":[16.87,17.83,18.77,20.6,20.6,22.23,24.08,25.02,27.75,27.75],"Club":[6.93,7.7,8.3,9.04,9.04],"Rapier":[13.03,15.39,17.05,18.89,18.89,19.24,22.25,24.31,26.94,26.94],"Shortsword":[13.03,15.4,17.06,18.89,18.89],"Wakizashi":[16.87,19.07,20.74,22.48,22.48,23.16,25.97,28.15,30.53,30.53],"Buckler":[6.91,7.68,8.3,9.04,9.04]},"Block Chance":{"Tower":[27.81,29.88,30.93,33.98,33.98,31.8,34.87,35.92,38.97,38.97],"Buckler":[23.29,26.34,28.69,31.03,31.03,27.71,31.52,34.28,36.55,36.55],"Kite":[28.28,31.33,33.6,36.02,36.02],"Force":[31.96,34.61,36.47,38.52,38.52],"Plate Helmet":[3.92,4.77,5.34,6.09,6.09],"Plate Cuirass":[4.6,5.54,6.25,7.09,7.09],"Plate Gauntlets":[3.53,4.35,4.9,5.43,5.43],"Plate Greaves":[4.22,5.12,5.71,6.59,6.59],"Plate Sabatons":[3.23,3.98,4.53,5.09,5.09]},"Burden":{"Dagger":[2.8,5.6],"Scythe":[21,35],"Tower":[13.3,20.3,10.5,16.1],"Axe":[14,17.5],"Club":[9.8,15.4],"Rapier":[6.3,12.6],"Shortsword":[5.25,10.5],"Wakizashi":[2.8,5.6],"Estoc":[14,28],"Longsword":[21.14,35],"Mace":[14.35,28],"Katana":[14,28],"Katalox":[7,14],"Oak":[4.9,10.5],"Redwood":[4.9,10.5],"Willow":[4.9,10.5],"Buckler":[2.8,5.6,2.1,3.57],"Kite":[10.64,17.5,7.91,11.62],"Force":[2.8,6.23,2.1,5.6],"Leather Helmet":[3.5,7],"Leather Breastplate":[4.27,8.4],"Leather Gauntlets":[3.15,6.3],"Leather Leggings":[3.85,7.7],"Leather Boots":[2.8,5.6],"Plate Helmet":[14,21,10.85,14.21],"Plate Cuirass":[16.87,25.2,13.37,17.08],"Plate Gauntlets":[12.6,18.9,9.73,12.81],"Plate Greaves":[15.4,23.1,11.9,15.68],"Plate Sabatons":[11.2,16.8,8.54,11.41],"Power Helmet":[10.5,16.38,8.12,11.27],"Power Armor":[12.6,19.67,9.87,12.53],"Power Gauntlets":[9.52,14.7,7.49,10.36],"Power Leggings":[11.55,17.92,8.75,12.67],"Power Boots":[8.4,13.02,6.3,9.24]},"Interference":{"Dagger":[3.5,8.4],"Scythe":[7,20.3],"Tower":[14,19.6],"Axe":[3.5,10.5],"Club":[3.5,10.5],"Rapier":[3.5,10.5],"Shortsword":[3.5,10.5],"Wakizashi":[3.5,8.4],"Estoc":[7,14],"Longsword":[10.5,21],"Mace":[7,14],"Katana":[7,14],"Buckler":[1.4,5.6],"Kite":[10.5,17.5],"Force":[28,39.62],"Leather Helmet":[7,12.6],"Leather Breastplate":[8.4,15.12],"Leather Gauntlets":[6.3,11.34],"Leather Leggings":[7.7,13.86],"Leather Boots":[5.6,10.08],"Shade Helmet":[8.4,13.02,2.1,3.25],"Shade Breastplate":[10.08,15.68,2.52,3.92],"Shade Gauntlets":[7.56,11.76,1.89,2.94],"Shade Leggings":[9.24,14.35,2.31,3.59],"Shade Boots":[6.72,10.5,1.68,2.63],"Plate Helmet":[14,21],"Plate Cuirass":[16.8,25.2],"Plate Gauntlets":[12.6,18.9],"Plate Greaves":[15.4,23.1],"Plate Sabatons":[11.2,16.8],"Power Helmet":[17.5,23.31],"Power Armor":[21,28.07],"Power Gauntlets":[15.75,21],"Power Leggings":[19.25,25.69],"Power Boots":[14,18.69]},"Spell Damage":{"Dagger":[8.74,9.6,9.64,10.49,10.49],"Scythe":[8.74,9.6,9.64,10.49,10.49],"Axe":[8.62,9.7,10.49,11.34,11.34],"Club":[8.64,9.71,10.47,11.34,11.34],"Rapier":[8.62,9.71,10.49,11.34,11.34],"Shortsword":[8.61,9.71,10.5,11.34,11.34],"Wakizashi":[8.62,9.72,10.49,11.35,11.35],"Estoc":[8.63,9.61,10.48,11.34,11.34],"Longsword":[8.62,9.67,10.46,11.34,11.34],"Mace":[8.6,9.7,10.49,11.34,11.34],"Katana":[8.62,9.69,10.48,11.34,11.34],"Katalox":[6.89,8.69,9.9,11.32,11.32,14.62,17.18,19.61,21.77,21.77,8.63,9.69,10.45,11.32,11.32,25.75,29.96,33.45,37.85,37.85,18.99,22.26,24.13,27.4,27.4],"Oak":[9.94,12.38,14.25,16.14,16.14,16.83,20.57,22.77,26.6,26.6,8.64,9.73,10.48,11.32,11.32,28.86,34.07,37.32,42.68,42.68,22.07,26.03,28.95,32.22,32.22,13.15,15.1,16.65,18.56,18.56,5.29,6.37,7.17,8.1,8.1],"Redwood":[6.9,8.71,9.92,11.32,11.32,14.84,17.68,19.55,21.77,21.77,8.44,9.72,10.21,11.32,11.32,25.78,29.74,33.7,37.85,37.85,19.07,22.27,24.46,27.4,27.4],"Willow":[9.95,12.39,14.25,16.14,16.14,17.5,20.82,22.68,26.6,26.6,8.65,9.65,10.48,11.32,11.32,13.3,15.13,16.74,18.56,18.56,5.28,6.36,7.18,8.1,8.1],"Phase Cap":[12.73,14.39,15.64,16.97,16.97],"Phase Robe":[15.13,17.11,18.59,20.18,20.18],"Phase Gloves":[11.52,13.01,14.19,15.36,15.36],"Phase Pants":[13.94,15.73,17.16,18.58,18.58],"Phase Shoes":[10.31,11.65,12.66,13.75,13.75]},"Proficiency":{"Gossamer Cap":[6.38,6.71,7.03,7.66,7.66],"Gossamer Robe":[7.61,8.24,8.56,9.19,9.19],"Gossamer Gloves":[5.77,6.1,6.42,7.05,7.05],"Gossamer Pants":[7,7.63,7.95,8.58,8.58],"Gossamer Shoes":[5.16,5.49,5.81,6.44,6.44],"Katalox":[5.65,6.7,7.47,8.29,8.29,11.65,13.46,14.69,16.24,16.24,4.15,4.96,5.51,6.14,6.14],"Oak":[8.93,10.07,10.91,11.81,11.81,14.88,16.67,18.12,19.76,19.76,4.46,5.27,5.82,6.45,6.45],"Redwood":[5.8,6.8,7.5,8.29,8.29,11.8,13.55,14.57,16.24,16.24,2.99,3.53,3.9,4.31,4.31],"Willow":[8.93,10.07,10.9,11.81,11.81,14.92,16.79,18.28,19.76,19.76,4.15,4.96,5.52,6.15,6.15],"Cotton Cap":[6.23,7.04,7.67,8.29,8.29],"Cotton Robe":[7.42,8.38,9.13,9.89,9.89],"Cotton Gloves":[5.62,6.36,6.93,7.5,7.5],"Cotton Pants":[6.84,7.71,8.4,9.09,9.09],"Cotton Shoes":[5.04,5.69,6.19,6.7,6.7]},"Primary Attributes":{"Strength":{"Dagger":[2.66,2.98,3,3.31,3.31],"Scythe":[9.26,9.88,10.2,11.11,11.11],"Tower":[3.56,3.88,4.2,4.51,4.51],"Axe":[4.36,5.16,5.71,6.33,6.33],"Club":[4.36,5.16,5.72,6.33,6.33],"Rapier":[2.86,3.33,3.71,4.08,4.08],"Shortsword":[4.37,5.16,5.71,6.33,6.33],"Wakizashi":[2.39,2.76,3.05,3.33,3.33],"Estoc":[8.75,9.87,10.7,11.58,11.58],"Longsword":[9.28,10.49,11.35,12.33,12.33],"Mace":[8.83,9.99,10.82,11.73,11.73],"Katana":[9.28,10.49,11.38,12.33,12.33],"Buckler":[4,4.91,5.63,6.33,6.33],"Kite":[4,4.91,5.62,6.32,6.32],"Force":[3.99,4.91,5.62,6.33,6.33],"Leather Helmet":[3.26,3.87,4.35,4.85,4.85],"Leather Breastplate":[3.86,4.59,5.16,5.75,5.75],"Leather Gauntlets":[2.96,3.51,3.96,4.4,4.4],"Leather Leggings":[3.55,4.23,4.77,5.3,5.3],"Leather Boots":[2.66,3.15,3.54,3.95,3.95],"Shade Helmet":[2.72,3.26,3.66,4.13,4.13],"Shade Breastplate":[3.22,3.83,4.33,4.85,4.85],"Shade Gauntlets":[2.46,2.96,3.37,3.77,3.77],"Shade Leggings":[2.94,3.55,4,4.49,4.49],"Shade Boots":[2.2,2.63,3.03,3.38,3.38],"Plate Helmet":[3.1,3.78,4.3,4.83,4.83],"Plate Cuirass":[3.68,4.5,5.11,5.73,5.73],"Plate Gauntlets":[2.81,3.41,3.91,4.38,4.38],"Plate Greaves":[3.41,4.14,4.7,5.28,5.28],"Plate Sabatons":[2.53,3.06,3.49,3.93,3.93],"Power Helmet":[4.62,5.62,6.3,7.09,7.09],"Power Armor":[5.53,6.69,7.52,8.44,8.44],"Power Gauntlets":[4.18,5.06,5.71,6.43,6.43],"Power Leggings":[5.08,6.06,6.89,7.78,7.78],"Power Boots":[3.73,4.53,5.12,5.74,5.74]},"Dexterity":{"Dagger":[4.76,5.08,5.4,5.71,5.71],"Scythe":[4.76,5.08,5.4,5.71,5.71],"Tower":[3.56,3.88,4.2,4.51,4.51],"Gossamer Cap":[3.86,4.18,4.5,4.81,4.81],"Gossamer Robe":[4.46,4.78,5.1,5.41,5.41],"Gossamer Gloves":[3.56,3.88,4.2,4.51,4.51],"Gossamer Pants":[4.16,4.48,4.8,5.11,5.11],"Gossamer Shoes":[3.26,3.58,3.6,3.91,3.91],"Axe":[3.01,3.42,3.74,4.08,4.08],"Club":[2.87,3.33,3.71,4.08,4.08],"Rapier":[4.36,5.16,5.72,6.33,6.33],"Shortsword":[4.37,5.16,5.72,6.33,6.33],"Wakizashi":[5.5,6.42,7.13,7.83,7.83],"Estoc":[4.22,4.94,5.48,6.03,6.03],"Longsword":[7.01,7.92,8.62,9.33,9.33],"Mace":[5.86,6.65,7.22,7.83,7.83],"Katana":[7,7.91,8.61,9.33,9.33],"Buckler":[4,4.91,5.6,6.33,6.33],"Kite":[4,4.92,5.62,6.33,6.33],"Force":[3.99,4.91,5.6,6.33,6.33],"Leather Helmet":[3.26,3.87,4.35,4.85,4.85],"Leather Breastplate":[3.86,4.59,5.16,5.75,5.75],"Leather Gauntlets":[2.96,3.51,3.96,4.4,4.4],"Leather Leggings":[3.55,4.23,4.77,5.3,5.3],"Leather Boots":[2.66,3.15,3.54,3.95,3.95],"Shade Helmet":[3.25,3.89,4.35,4.88,4.88],"Shade Breastplate":[3.88,4.59,5.16,5.75,5.75],"Shade Gauntlets":[2.95,3.5,3.99,4.43,4.43],"Shade Leggings":[3.59,4.22,4.8,5.3,5.3],"Shade Boots":[2.67,3.15,3.55,3.98,3.98],"Plate Helmet":[3.11,3.78,4.3,4.83,4.83],"Plate Cuirass":[3.68,4.5,5.12,5.73,5.73],"Plate Gauntlets":[2.81,3.42,3.91,4.38,4.38],"Plate Greaves":[3.41,4.14,4.7,5.28,5.28],"Plate Sabatons":[2.53,3.06,3.49,3.93,3.93],"Power Helmet":[4,4.92,5.63,6.34,6.34],"Power Armor":[4.76,5.84,6.61,7.54,7.54],"Power Gauntlets":[3.62,4.44,5.09,5.74,5.74],"Power Leggings":[4.39,5.4,6.17,6.94,6.94],"Power Boots":[3.25,4,4.54,5.14,5.14]},"Agility":{"Dagger":[6.26,6.58,6.9,7.51,7.51],"Scythe":[2.66,2.98,3,3.31,3.31],"Tower":[2.36,2.68,2.7,3.01,3.01],"Gossamer Cap":[3.86,4.18,4.5,4.81,4.81],"Gossamer Robe":[4.46,4.78,5.1,5.41,5.41],"Gossamer Gloves":[3.56,3.88,4.2,4.51,4.51],"Gossamer Pants":[4.16,4.48,4.8,5.11,5.11],"Gossamer Shoes":[3.26,3.58,3.6,3.91,3.91],"Axe":[2.39,2.76,3.04,3.33,3.33],"Club":[2.86,3.33,3.7,4.08,4.08],"Rapier":[2.87,3.33,3.71,4.08,4.08],"Shortsword":[4.37,5.16,5.72,6.33,6.33],"Wakizashi":[5.51,6.42,7.13,7.83,7.83],"Estoc":[2.63,3.14,3.52,3.93,3.93],"Longsword":[3.61,4.08,4.45,4.83,4.83],"Mace":[3.01,3.42,3.73,4.08,4.08],"Katana":[3.25,3.87,4.29,4.83,4.83],"Cotton Cap":[3.11,3.77,4.31,4.83,4.83],"Cotton Robe":[3.68,4.5,5.11,5.73,5.73],"Cotton Gloves":[2.8,3.42,3.91,4.38,4.38],"Cotton Pants":[3.41,4.14,4.7,5.28,5.28],"Cotton Shoes":[2.54,3.06,3.5,3.93,3.93],"Phase Cap":[3.85,4.7,5.36,6.03,6.03],"Phase Robe":[4.57,5.61,6.37,7.17,7.17],"Phase Gloves":[3.49,4.25,4.84,5.46,5.46],"Phase Pants":[4.21,5.16,5.84,6.6,6.6],"Phase Shoes":[3.13,3.8,4.34,4.89,4.89],"Leather Helmet":[2.72,3.25,3.67,4.1,4.1],"Leather Breastplate":[3.23,3.84,4.32,4.85,4.85],"Leather Gauntlets":[2.48,2.94,3.34,3.74,3.74],"Leather Leggings":[2.95,3.54,4,4.49,4.49],"Leather Boots":[2.21,2.64,3,3.35,3.35],"Shade Helmet":[3.26,3.89,4.33,4.88,4.88],"Shade Breastplate":[3.86,4.61,5.16,5.75,5.75],"Shade Gauntlets":[2.95,3.51,3.95,4.43,4.43],"Shade Leggings":[3.55,4.21,4.77,5.31,5.31],"Shade Boots":[2.66,3.14,3.57,3.98,3.98],"Buckler":[4,4.91,5.62,6.33,6.33],"Kite":[4,4.91,5.6,6.33,6.33],"Force":[4,4.88,5.56,6.33,6.33]},"Endurance":{"Tower":[3.26,3.58,3.6,3.91,3.91],"Buckler":[3.99,4.91,5.62,6.33,6.33],"Kite":[4,4.91,5.62,6.33,6.33],"Force":[4,4.91,5.62,6.33,6.33],"Leather Helmet":[2.72,3.24,3.67,4.1,4.1],"Leather Breastplate":[3.23,3.84,4.32,4.85,4.85],"Leather Gauntlets":[2.48,2.94,3.33,3.74,3.74],"Leather Leggings":[2.96,3.55,4,4.49,4.49],"Leather Boots":[2.21,2.64,3,3.35,3.35],"Shade Helmet":[2.72,3.23,3.66,4.13,4.13],"Shade Breastplate":[3.25,3.87,4.33,4.85,4.85],"Shade Gauntlets":[2.5,2.96,3.33,3.77,3.77],"Shade Leggings":[2.95,3.53,4,4.49,4.49],"Shade Boots":[2.2,2.66,3,3.38,3.38],"Plate Helmet":[4.01,4.93,5.63,6.33,6.33],"Plate Cuirass":[4.76,5.85,6.7,7.53,7.53],"Plate Gauntlets":[3.61,4.44,5.08,5.73,5.73],"Plate Greaves":[4.4,5.4,6.17,6.93,6.93],"Plate Sabatons":[3.25,3.99,4.54,5.13,5.13],"Power Helmet":[3.1,3.77,4.31,4.84,4.84],"Power Armor":[3.68,4.49,5.12,5.74,5.74],"Power Gauntlets":[2.79,3.43,3.92,4.39,4.39],"Power Leggings":[3.39,4.14,4.69,5.29,5.29],"Power Boots":[2.53,3.06,3.51,3.94,3.94]},"Intelligence":{"Gossamer Cap":[4.76,5.08,5.4,5.71,5.71],"Gossamer Robe":[5.66,5.98,6.3,6.91,6.91],"Gossamer Gloves":[4.46,4.78,5.1,5.41,5.41],"Gossamer Pants":[5.36,5.68,6,6.61,6.61],"Gossamer Shoes":[3.86,4.18,4.5,4.81,4.81],"Katalox":[4.7,5.7,6.42,7.22,7.22],"Oak":[3.26,3.87,4.33,4.83,4.83],"Redwood":[4.37,5.17,5.7,6.33,6.33],"Willow":[3.26,3.87,4.33,4.83,4.83],"Cotton Cap":[4.01,4.92,5.63,6.33,6.33],"Cotton Robe":[4.75,5.85,6.71,7.53,7.53],"Cotton Gloves":[3.62,4.44,5.08,5.73,5.73],"Cotton Pants":[4.4,5.4,6.17,6.93,6.93],"Cotton Shoes":[3.26,3.99,4.55,5.13,5.13],"Phase Cap":[4.63,5.6,6.31,7.08,7.08],"Phase Robe":[5.53,6.68,7.51,8.43,8.43],"Phase Gloves":[4.17,5.07,5.71,6.42,6.42],"Phase Pants":[5.08,6.15,6.92,7.77,7.77],"Phase Shoes":[3.73,4.53,5.12,5.73,5.73],"Shade Helmet":[2.48,2.82,3.05,3.38,3.38],"Shade Breastplate":[2.92,3.32,3.58,3.84,3.84],"Shade Gauntlets":[2.25,2.58,2.8,3.08,3.08],"Shade Leggings":[2.75,3.08,3.34,3.63,3.63],"Shade Boots":[2.05,2.31,2.55,2.78,2.78]},"Wisdom":{"Dagger":[2.66,2.98,3,3.31,3.31],"Gossamer Cap":[4.76,5.08,5.4,5.71,5.71],"Gossamer Robe":[5.66,5.98,6.3,6.91,6.91],"Gossamer Gloves":[4.46,4.78,5.1,5.41,5.41],"Gossamer Pants":[5.36,5.68,6,6.61,6.61],"Gossamer Shoes":[3.86,4.18,4.5,4.81,4.81],"Katalox":[3.26,3.87,4.33,4.82,4.82],"Oak":[4.7,5.7,6.42,7.23,7.23],"Redwood":[4.37,5.16,5.71,6.33,6.33],"Willow":[4.7,5.71,6.43,7.23,7.23],"Cotton Cap":[4.01,4.92,5.63,6.33,6.33],"Cotton Robe":[4.76,5.85,6.71,7.53,7.53],"Cotton Gloves":[3.61,4.44,5.09,5.73,5.73],"Cotton Pants":[4.4,5.4,6.17,6.93,6.93],"Cotton Shoes":[3.26,3.99,4.55,5.13,5.13],"Phase Cap":[4.63,5.61,6.29,7.08,7.08],"Phase Robe":[5.53,6.69,7.52,8.43,8.43],"Phase Gloves":[4.19,5.05,5.72,6.42,6.42],"Phase Pants":[5.08,6.15,6.88,7.77,7.77],"Phase Shoes":[3.74,4.53,5.11,5.73,5.73],"Shade Helmet":[2.5,2.82,3.1,3.38,3.38],"Shade Breastplate":[2.95,3.29,3.39,3.9,3.9],"Shade Gauntlets":[2.26,2.58,2.77,3.08,3.08],"Shade Leggings":[2.71,2.99,3.36,3.6,3.6],"Shade Boots":[2,2.28,2.55,2.78,2.78]}},"Counter-Resist":{"Oak":[8.36,10.4,11.94,13.59,13.59],"Willow":[8.36,10.41,11.91,13.59,13.59]},"Attack Crit Damage":{"Shade Helmet":[2.32,2.48,2.88,2.99,2.99],"Shade Breastplate":[2.67,3.08,3.36,3.72,3.72],"Shade Gauntlets":[2.05,2.35,2.55,2.78,2.78],"Shade Leggings":[2.34,2.9,3.11,3.42,3.42],"Shade Boots":[1.88,2.09,2.29,2.47,2.47],"Power Helmet":[1.02,1.16,1.26,1.36,1.36,3.24,3.48,3.89,4.36,4.36],"Power Armor":[1.22,1.38,1.49,1.61,1.61,3.81,4.33,4.64,5.21,5.21],"Power Gauntlets":[0.93,1.05,1.14,1.24,1.24,2.82,3.22,3.6,3.94,3.94],"Power Leggings":[1.12,1.27,1.38,1.49,1.49,3.61,3.94,4.31,4.61,4.61],"Power Boots":[0.84,0.94,1.03,1.11,1.11,2.42,2.94,3.25,3.51,3.51]},"Spell Crit Damage":{"Phase Cap":[2.92,3.32,3.42,3.86,3.86],"Phase Robe":[3.2,3.97,4.31,4.67,4.67],"Phase Gloves":[0,2.92,3.23,3.53,3.53],"Phase Pants":[3.21,3.59,3.96,4.28,4.28],"Phase Shoes":[2.23,2.53,2.91,3.07,3.07]}},

	baseData: { }
};

/* * * * * * * * * * * * * * * * * * * * * * * */

if (window.location.host == 'hentaiverse.org' || window.location.host == 'alt.hentaiverse.org') {

	// added by sssss2
	if(/pages\/showequip\.php/.test(window.location.href)) {
		var nameList = document.getElementsByClassName("fd2");
		if(!nameList.length) {
			nameList = document.getElementsByClassName("fd4");
		}
		if(nameList.length) {
			var fullName = [].map.call(nameList,function(e){return e.textContent;}).join(" ").trim().replace(/\b(?:The|Of)\b/g,function(e){return e.toLowerCase();});

			if(nameList.length>1) {
				nameList[0].firstElementChild.textContent = fullName;
				while(nameList[0].parentNode.nextElementSibling) {
					nameList[0].parentNode.nextElementSibling.remove();
				}
			}
			nameList[0].style.height
			= nameList[0].parentNode.style.height
			= nameList[0].parentNode.parentNode.style.height = "";

			window.history.pushState(null,null); // Chrome
			document.title = fullName + " (" + ((document.querySelector("a[target=_forums]")||{}).textContent||"System") + ") - Equipment Popup";
			window.history.pushState(null,null); // Chrome (Older version)
		}
	}
	//
	if (/&ss=eq/.test(window.location.href)) {
		Controller.lastLoadingElem = document.getElementsByClassName('clb')[0];
		Controller.lastLoadingDiv = Controller.loading(Controller.lastLoadingElem);
		Controller.saveData(document);
	}
	var tmp = document.getElementById('equipment');
	if (!tmp) {
		tmp = document.getElementById('popup_box');
		Controller.popup = true;
	}
	else Controller.popup = false;
	Controller.parseable = tmp;
	Controller.loaded = false;
	Controller.useBaseDataOld = false;
	window.addEventListener('keyup',function(e){
		if (e.target.localName == 'input' || e.target.localName == 'textarea') return;
		Controller.keyEvent(e);
	},false);
}
else if (window.location.host == 'ehwiki.org' && window.location.search.indexOf('where=') >= 0) window.addEventListener('load',Wiki.check,false);