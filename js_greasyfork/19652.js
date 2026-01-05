// ==UserScript==
// @name           FleetLogBeautifier
// @namespace      kelder.ogame.org
// @description    Fleetlog parser
// @include        http*://*.ogame.*/game/admin2/flottenlog.php?session=*&uid=*&list=*
// @include        http*://*.ogame.*/game/admin2/flottenlog.php?session=*&showplanet=*
// @version        2013.3.17
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/19652/FleetLogBeautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/19652/FleetLogBeautifier.meta.js
// ==/UserScript==
//** Copyright © 2008 by Kelder for ogame.org community. **
//** May only be used by ogame staff. If you are not ogame staff, then delete this script immediately. **
//** Obtain permission before redistributing. **
// ******** CONSTANTS ********
// Config settings can be set from a javascript console while logged into the AT:
// Just type localStorage['COMBINE_FLEETS_AND_RESOURCES'] = 1 to set the option.
// localStorage['COMBINE_FLEETS_AND_RESOURCES']   boolean (0 = false, 1 = true)
// localStorage['externalCSS']                    string (0 = off, else 'http://<yourCSSfilehere>' )
// localStorage['DATE_FORMAT']                    string (default = '%d/%m %H:%M:%S' )
//  -> see http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html for info on format.
(function() {
var LNG_START_BUTTON = 'Beautify! [de]';
// The function that contains all the REAL stuff to parse logs and display them
function DoModify() {
var CONV = new Array();
var CLS = new Array();
// ***************
// LANGUAGE CONFIG
// ***************
// Mission names (do not have to be exact like in admin tool)
var LNG_ESPIONAGE = 'Spionage';
var LNG_ATTACK = 'Angreifen';
var LNG_TRANSPORT = 'Transport';
var LNG_HARVEST = 'Abbau';
var LNG_DEPLOYMENT = 'Stationieren';
var LNG_EXPEDITION = 'Expedition';
var LNG_ACS_ATTACK = 'Verbandsangriff';
var LNG_COLONIZATION = 'Kolonisieren';
var LNG_MOON_DESTRUCTION = 'Zerstören';
var LNG_ACS_DEFEND = 'Halten';
var LNG_IPM = 'IRAK';
// table header text
var LNG_HDR_MISSION = 'Mission';
var LNG_HDR_PLAYER1 = 'Spieler 1';
var LNG_HDR_PLAYER2 = 'Spieler 2';
var LNG_HDR_ORIGIN = 'Von';
var LNG_HDR_DESTINATION = 'Nach';
var LNG_HDR_LAUNCH = 'Start';
var LNG_HDR_ARRIVAL = 'Ankunft';
var LNG_HDR_RESOURCES = 'Res';
var LNG_HDR_FLEET = 'Flotte';
var LNG_HDR_RETURN_TIME = 'Rückkehr';
var LNG_HDR_RETURN_RES = 'Res';
var LNG_HDR_RETURN_FLEET = 'Flotte';
// coordinates stuff
var LNG_SHORT_DF = 'TF';
var LNG_SHORT_MOON = 'M';
var LNG_SHORT_PLANET = 'P';
var LNG_NO_COORDS = '?:?:?';

// for each CSS class name give the label of the button
var mission =  {
	Att: '[Atts + VAngr]',
	Esp: '[Spios]',
	Exp: '[Expos]',
	Own: '[eigene]',
	Tra: '[Transporte]',
	Dep: '[Statios]',
	Col: '[Kolos]',
	Hrv: '[Abbau]',
	ACS: '[AKS (VAngr + Halten)]',
	Des: '[Mond-Rips]',
	Def: '[Halten]',
	Ipm: '[IRAK]',
	returns: '[zurückgerufen]'
};
var LNG_OLD_LOGS_BUTTON = 'Old logs';
// misc+missions
var LNG_CONV_DF = /^Trümmerfeld/;
var LNG_CONV_MOON = /\(M\) \[/;
//Copy EXACTLY like it appears in admin tool
var LNG_FLEET_ARRIVES_TO_TARGET = 'Flotte auf Planet';
var LNG_DEPLOYMENT_ARRIVED = '*** Statio angekommen ***';
var LNG_SPACE_PLAYER_NAME = 'space';
var LNG_UNKNOWN_PLAYER_NAME = 'unknown';
var LNG_UNKNOWN_PLANET_NAME = 'unknown';
// Copy what's between CONV[' and '] = EXACTLY like it appears in admin tool
// res
CONV['Metall'] = 'M';
CONV['Kristall'] = 'K';
CONV['Deuterium'] = 'D';
// ships
CONV['Kleiner Transporter'] = 'KT';
CONV['Großer Transporter'] = 'GT';
CONV['Leichter Jäger'] = 'LJ';
CONV['Schwerer Jäger'] = 'SJ';
CONV['Kreuzer'] = 'Xer';
CONV['Spionagesonde'] = 'Spio';
CONV['Schlachtschiff'] = 'SS';
CONV['Bomber'] = 'Bomb';
CONV['Schlachtkreuzer'] = 'SXer';
CONV['Zerstörer'] = 'Zerri';
CONV['Todesstern'] = 'RIP';
CONV['Kolonieschiff'] = 'Kolo';
CONV['Recycler'] = 'Rec';
CONV['Solarsatellit'] = 'SolSat';
// END OF CONFIG
// *********************
// no changes below here
//chrome additions
if (Date.prototype.toLocaleFormat == null) {
	function pad(n) { return n < 10 ? '0' + n : n; }
	Date.prototype.toLocaleFormat = function() {
		return this.getFullYear() + '-' + pad(this.getMonth()+1) + '-' + pad(this.getDate()) + ' ' 
		+ pad(this.getHours()) + ':' + pad(this.getMinutes()) + ':' + pad(this.getSeconds()); };
}
//end chrome additions
getValue = function(name, defaultValue) {
	var value = localStorage.getItem(name);
	if (value === undefined || value == null) {
		return defaultValue;
	}
	return value;
}
var COMBINE_FLEETS_AND_RESOURCES = getValue('COMBINE_FLEETS_AND_RESOURCES', false);
var LNG_DATE_FORMAT = getValue('DATE_FORMAT','%d/%m %H:%M:%S');
var ORIG_DATE_FORMAT = getValue('ORIG_DATE_FORMAT','%Y-%m-%d %H:%M:%S');
var OPT_EXTERNAL_CSS = getValue('externalCSS',false);
var UNI_SPEED = getValue(window.location.hostname + '_UNI_SPEED',1);
if (isNaN(UNI_SPEED)) { UNI_SPEED = 1; }
// missions (CLS means CSS class for that mission log)
CLS[LNG_ATTACK] = 'Att ';
CLS[LNG_ACS_ATTACK] = 'Att ACS ';
CLS[LNG_TRANSPORT] = 'Tra ';
CLS[LNG_DEPLOYMENT] = 'Dep ';
CLS[LNG_ACS_DEFEND] = 'Def ACS ';
CLS[LNG_ESPIONAGE] = 'Esp ';
CLS[LNG_COLONIZATION] = 'Col ';
CLS[LNG_HARVEST] = 'Hrv ';
CLS[LNG_MOON_DESTRUCTION] = 'Des ';
CLS[LNG_IPM] = 'Ipm ';
CLS[LNG_EXPEDITION] = 'Exp ';
// use mission number to find short name. the 1 in "Attack 1" up to " 15"
var CONV_SHORT_MISSION = [0,
  LNG_ATTACK, LNG_ACS_ATTACK, LNG_TRANSPORT, LNG_DEPLOYMENT,
  LNG_ACS_DEFEND, LNG_ESPIONAGE, LNG_COLONIZATION, LNG_HARVEST,
  LNG_MOON_DESTRUCTION, LNG_IPM, 0, 0,
  0, 0, LNG_EXPEDITION];
// contains the CSS class names to put under the buttons
var missionButtons = [ 'Att', 'Esp', 'Own', 'Tra', 'Dep', 'Col', 'Hrv', 'ACS', 'Exp', 'Des', 'Def', 'Ipm', 'returns'];
var head = document.getElementsByTagName('head')[0];
// load external css
if (OPT_EXTERNAL_CSS) { createEl({n:'link',a:{rel:'stylesheet', '@type': 'text/css', href: OPT_EXTERNAL_CSS}}, head);
} else { createStyle('flb_extCSS','.Esp {background-color:#8F813D}.Att{background-color:#8F3D3D}.Att.ACS{background-color:#8F3D5A}.Des{background-color:#AF1B94}.Def.ACS{background-color:#8F553C}.Ipm{background-color:#8F6C3D}.Tra{background-color:#3C5A8F}.Tra.Own{background-color:#3E3C8F}.Dep{background-color:#623C8F}.Col{background-color:#418F3C}.Exp{background-color:#999}.Hrv{background-color:#3C8F6B}.returns{color:black}.arrived{color:white}.res .tp{color:#FFF;font-weight:bold;margin-right:.2em}.fleet .tp{color:#FF9;font-weight:bold;margin-right:.2em; font-size:.8em}.res.return .tp{color:#FFF}.fleet.return .tp{color:#BFB}.res .am,.fleet .am{color:#EEE;margin-right:1em}.score{font-size:70%;color:#9FF}.state{color:#FF4}td.player{cursor:pointer}#GM_menu_middle{position:absolute;top:140px;left:240px;padding:5px;border:1px solid orange;max-width:650px}#GM_menu_bar{position:fixed;top:0px;left:10px;padding:3px;border:1px solid orange;background-color:black;z-index:5}.DisplayButton.GM__HIDDEN,.FilterButton.GM__HIDDEN{color:#F33}.DisplayButton.GM__SHOW_ONLY,.FilterButton.GM__SHOW_ONLY{color:#3FF}.FilterButton{margin:3px;padding:1px;border:1px solid #666;display:inline-block;text-align:center;min-width:9em}.FilterButton .score{display:none}span.res,span.fleet{display:inline-block}body,table,td{font-size:10pt}#GM_fleetlog{position:absolute;top:500px;left:10px;padding-bottom:20px;z-index:2}#GM_fleetlog td{background-image:none}.DisplayButton{margin-right:1em}.GM__MINIMIZED div.fleet,.GM__MINIMIZED div.res {display:inline}tr.GM__MINIMIZED td{ font-size:1px;padding:0;margin:0;height:4px;}.st{text-decoration:line-through}.empty{font-size:.8em}#OGB_DISP_UNI_SPEED{width:1.8em;font-size:80%}td.p2{cursor:pointer}td.mission{cursor:row-resize}th.t1,th.t2,th.t3{width:6.2em}.GM_TextBox {z-index:3;min-width:700px}'); }
function createStyle(id, content) { //custom GM_addStyle to have id for later removal
 return createEl({n: 'style', a: {type:'text/css', '@id':id, textContent:content}}, head);
}

document.getElementById('GM_ActivateButton').parentNode.removeChild(document.getElementById('GM_ActivateButton'));
var PLAYERS = new Object();

function Player(td) {
	if (arguments.length > 1) {
		this.name = arguments[1];
		this.uid = arguments[2];
		this.score = 0;
		this.state = '';
		this.dom = createEl( // trg attribute is to know which uid to toggle when clicked
			{n: 'td', a: {'@class' : 'st player', '@trg': 'u' + this.uid, textContent: this.name}}
		, null);
		return;
	}
	this.uid = td.firstChild.href.replace( /^.+uid=(\d+).*$/, '$1');
	this.name = td.firstChild.firstChild.nodeValue;
	if (this.name == null) this.name = td.firstChild.firstChild.firstChild.nodeValue; // font tag around name
	if (this.name == LNG_UNKNOWN_PLAYER_NAME) {
		this.name = 'uid ' + this.uid;
		this.score = '?';
		this.state = '';
		this.dom = createEl(
			{n: 'td', a: {'@class' : 'st player', '@trg': 'u' + this.uid, textContent: this.name}}
		, null);
		return;
	}
	this.state = '';
	if (td.childNodes.length) {
		var i = td.childNodes.length - 1;
		while ((td.childNodes.item(i)) && (td.childNodes.item(i).nodeType != 3)) --i;
		this.score = ''+td.childNodes.item(i).nodeValue.match(/\d[\d+\.]*/);
		i = 2;
		while (td.childNodes.item(++i)) { 
			if (td.childNodes.item(i).tagName == 'FONT') this.state += td.childNodes.item(i).firstChild.nodeValue;
		}
	} else { this.score = 0; }
	if (this.state == '') {
		this.dom = createEl( // removed: '@class': 'u1', 
			// {n: 'td', a: {'@trg': 'u' + this.uid, textContent: this.name + ' (' + this.score + ')'}}
			{n: 'td', a: {'@class': 'player', '@trg': 'u' + this.uid },
				c: [ this.name, {n:'span', a: {'@class': 'score', textContent: ' ' + this.score}}  ]}
		, null);
	} else {
		this.dom = createEl( // removed: '@class': 'u1', 
			// {n: 'td', a: {'@trg': 'u' + this.uid, textContent: this.name + this.state + ' (' + this.score + ')'}}
			{n: 'td', a: {'@class': this.state + ' player', '@trg': 'u' + this.uid },
				c: [ this.name,
					{n:'span', a: {'@class': 'state ' + this.state, textContent: ' (' + this.state + ')'}},
				    {n:'span', a: {'@class': 'score', textContent: ' ' + this.score}}  ]}
		, null);
	}
}
Player.prototype.domElem = function() { return this.dom.cloneNode(true); }
PLAYERS['u0'] = new Player(null, '*'+LNG_UNKNOWN_PLAYER_NAME+'*', 0);
PLAYERS['u99999'] = new Player(null, LNG_SPACE_PLAYER_NAME, 99999);
function getPlayer(td) {
	if (td.firstChild.nodeName == 'A') {
		//find uid
		var uid = td.firstChild.href.replace( /^.+uid=(\d+).*$/, "$1");
		return PLAYERS['u'+uid] || (PLAYERS['u'+uid] = new Player(td));
	} else return PLAYERS['u0'];
}

// show or hide all elements of a certain class (for menu buttons)
function toggleDisplay(evt) {
	var cls = this.getAttribute('trg');
	var e = document.getElementById('GM__STYLE_' + cls);
	if (e) {
		e.parentNode.removeChild(e);
		this.className = this.className.replace(/\bGM__HIDDEN\b|\bGM__SHOW_ONLY\b/,'');
	} else { var s; // create style
		// specialcase the Old Logs button...
		if (cls == 'GM_TextBox') { this.className += ' GM__HIDDEN'; s = 'div.GM_TextBox {display:none;}';
		} else if (evt.ctrlKey) {
			s = 'table tr.'+cls+'{display:table-row;}tr.arrived,tr.returns{display:none;}';
			this.className += ' GM__SHOW_ONLY';
		} else {
			s = 'table#newTable tr.'+cls+'{display:none;}';
			this.className += ' GM__HIDDEN';
		}
		createStyle('GM__STYLE_' + cls, s);
	}
}

// show or hide all elements of a certain class (for players/planets, creates click box)
function toggleDisplay2(evt,td) {
	if (!td) td = this;
	var cls = td.getAttribute('trg');
	var e = document.getElementById('GM__STYLE_' + cls);
	if (e) {
		e.parentNode.removeChild(e);
		e = document.getElementById('GM__FILTER_' + cls);
		if (e) { e.parentNode.removeChild(e); }
	}
	else { var s; // create style
		e = createEl({n: 'span', a: { '@id': 'GM__FILTER_' + cls, '@class': 'FilterButton ',
				'@trg': cls, innerHTML: td.innerHTML }},menu_mid_div);
		e.addEventListener('click', toggleDisplay2, true);
		if (evt.ctrlKey) {
			s = 'tr.arrived.'+cls+',tr.returns.'+cls+'{display:table-row;}tr.arrived,tr.returns{display:none;}';
			e.className += ' GM__SHOW_ONLY';
		} else {
			s = 'table#newTable tr.'+cls+'{display:none;}';
			e.className += ' GM__HIDDEN';
		}
		createStyle('GM__STYLE_' + cls, s);
	}
}

// minimizes parent
function minimizeDisplay(td) {
	var p = td.parentNode;
	if (p.className.match(/\bGM__MINIMIZED\b/)) p.className = p.className.replace(/ ?\bGM__MINIMIZED\b/,'')
	else p.className += ' GM__MINIMIZED';
}

// add resources or fleet to a TD container. Create new container if needed
function stuffConvert(res, isfleet, isreturn, container) {
	var f;
	if (isfleet) f = 'fleet';
	else f = 'res';
	if (isreturn) f += ' return';
	var parts = res.match(/(?:[^\s:]+(?: [^\s:]+)*) : [.\d]+/g);
	//if (!container) container = createEl({n: 'td', a: {'@class': f}}, null);
	if (!container) container = createEl({n: 'td'}, null);
	if (parts == null) return container; 
	var p;
	for (var i = 0;i < parts.length; i++) {
		p = parts[i].match(/(.+)\s:\s([.\d]+)/);
		createEl({n: 'span', a: {'@class': f}, c: [
			{n: 'span', a: {'@class': 'tp', textContent: CONV[p[1]] || p[1]}},
			{n: 'span', a: {'@class': 'am', textContent: p[2]}}
		]},container);
	}
	return container;
}

// input: "2007-12-01 22:09:58" output: new Date(input)
function parseTime(time) {
	return new Date(time.replace(/-/g,'/') + ' GMT');
}
function Planet(pCell) {
	if (pCell == null) return;
	if (pCell.firstChild.nodeType == 3) { // unknown planet
		this.name = LNG_UNKNOWN_PLANET_NAME;
		this.id = 'p0';
		this.type = '';
		this.coords = LNG_NO_COORDS;
	} else { // planet exists
		this.name = pCell.firstChild.firstChild.nodeValue;
		this.id = pCell.firstChild.href.replace( /^.+planet=(\d+).*$/, "p$1" );
		this.coords = this.name.replace( /^.*\[([\d:]+)\].*$/, "$1");
		this.type = (this.name.match(LNG_CONV_DF) ? LNG_SHORT_DF : (this.name.match(LNG_CONV_MOON) ? LNG_SHORT_MOON : LNG_SHORT_PLANET));
		this.name = this.name.replace(/\s*[\(\[].+$/,'');
	}
}

// Get main content box
var textbox = document.evaluate('/html/body/div[@class="contbox"]/div[2]/div[1]', document, null, XPathResult.ELEMENT_NODE, null).iterateNext()
var fl_div = createEl({n: 'div', a: {'@id': 'GM_fleetlog', textContent:''}},document.body);
var menu_bar_div = createEl({n: 'div', a: {'@id': 'GM_menu_bar', textContent:''}},document.body);
var menu_mid_div = createEl({n: 'div', a: {'@id': 'GM_menu_middle', textContent:''}},document.body);
var newtable = createEl({n: 'table', a: {'@class': 'newTable', id: 'newTable'}});
function tableClick(event) {
	if (!event || !event.target) return;
	var t = event.target;
	if (!t.tagName || t.tagName == 'TABLE' || t.tagName == 'TH' || t.tagName == 'TR' ) return;
	if (t.tagName == 'DIV' || t.tagName == 'SPAN') t = t.parentNode;
	if (t.tagName != 'TD') { console.log("didn't find tag :(" + event.target); }
	// found correct TD, not check className to know which action to do
	if (t.className.match(/\bmission\b/)) { minimizeDisplay(t); }
	if (t.className.match(/\bplayer\b/)) { toggleDisplay2(event, t); }
	if (t.className.match(/\bp2\b/)) { toggleDisplay2(event, t); }
	
} 
newtable.addEventListener('click', tableClick, true);
//create menu items to show/hide stuff
for (var b in missionButtons) {
	var a = createEl({n: 'a', a: { '@id': 'OGB_DISP_'+missionButtons[b], '@class': 'DisplayButton',
		'@trg': missionButtons[b], textContent: mission[missionButtons[b]] }},menu_bar_div);
	a.addEventListener('click', toggleDisplay, true);
}
createEl({n: 'a', a: { '@id': 'OGB_DISP_GM_TextBox', '@class': 'DisplayButton GM__HIDDEN',
	'@trg': 'GM_TextBox', textContent: LNG_OLD_LOGS_BUTTON }},menu_bar_div)
	.addEventListener('click', toggleDisplay, true);

function updateSpeed() {
	var box = document.getElementById('OGB_DISP_UNI_SPEED');
	if (!box.value.match(/^\d+(\.\d+)?$/)) box.value = 1;
	localStorage.setItem(window.location.hostname + '_UNI_SPEED', box.value);

}
createEl({n: 'input', a: { '@id': 'OGB_DISP_UNI_SPEED',
	'@type': 'input', '@maxlength': '5', value: UNI_SPEED }},menu_bar_div)
	.addEventListener('blur', updateSpeed, true);
updateSpeed();
//log header:
createEl({n: 'tr', a: {'@class': 'header'}, c: [
	{n: 'th', a: {'@class': 'mission', textContent: LNG_HDR_MISSION}},
	{n: 'th', a: {'@class': 'u1', textContent: LNG_HDR_PLAYER1}},
	{n: 'th', a: {'@class': 'u2', textContent: LNG_HDR_PLAYER2}},
	{n: 'th', a: {'@class': 'p1', textContent: LNG_HDR_ORIGIN}},
	{n: 'th', a: {'@class': 'p2', textContent: LNG_HDR_DESTINATION}},
	{n: 'th', a: {'@class': 't1', textContent: LNG_HDR_LAUNCH}},
	{n: 'th', a: {'@class': 't2', textContent: LNG_HDR_ARRIVAL}},
	COMBINE_FLEETS_AND_RESOURCES ? null : {n: 'th', a: {'@class': 'res', textContent: LNG_HDR_RESOURCES}},
	{n: 'th', a: {'@class': 'fleet', textContent: LNG_HDR_FLEET}},
	{n: 'th', a: {'@class': 't3', textContent: LNG_HDR_RETURN_TIME}},
	COMBINE_FLEETS_AND_RESOURCES ? null : {n: 'th', a: {'@class': 'res return', textContent: LNG_HDR_RETURN_RES}},
	{n: 'th', a: {'@class': 'fleet return', textContent: LNG_HDR_RETURN_FLEET}},
]}, newtable);

// check all tables and br's to recompose logs
var currlog = 0;
var xpres = document.evaluate('table[@width="650"]|br', textbox, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i=0; i<xpres.snapshotLength; ++i) {
	var logitem = xpres.snapshotItem(i);
	if (logitem.nodeName == "TABLE") {
		// parse each td of the table, they should have fixed order and contents
		var cells = document.evaluate('.//td', logitem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (cells.snapshotLength != 12) {
			console.log('INCORRECT TABLE STRUCTURE, aborting:' + cells.snapshotLength + '; ' + cells.innerHTML);
			return;
		}
		var mission = cells.snapshotItem(0).textContent;
		var player1 = getPlayer(cells.snapshotItem(1));
		var player2 = getPlayer(cells.snapshotItem(2));
		var arrival = cells.snapshotItem(3).textContent == LNG_FLEET_ARRIVES_TO_TARGET;
		var planet1 = new Planet(cells.snapshotItem(5));
		var planet2 = new Planet(cells.snapshotItem(6));
		var fleet = cells.snapshotItem(8).textContent;
		var res = cells.snapshotItem(9).textContent;
		var time1 = cells.snapshotItem(10).textContent;
		var time2 = cells.snapshotItem(11).textContent;
		res = stuffConvert(res,0,0,null);
		fleet = stuffConvert(fleet,1,0,COMBINE_FLEETS_AND_RESOURCES ? res : null);
		var p1d = player1.domElem();
		var p2d = player2.domElem();

		var cls = '';
		mission = CONV_SHORT_MISSION[mission.match(/ \(?(\d*)\)?$/)[1]];
		cls += CLS[mission];
		cls += planet2.id;
		if (player1.uid == player2.uid) {
			if (mission == LNG_TRANSPORT) { cls += ' Own'; }
			cls += ' u' + player1.uid;
		} else { cls += ' u' + player1.uid + ' u' + player2.uid; }
		cls += (arrival ? ' arrived' : ' returns');
		
		var logitem = xpres.snapshotItem(++i);
		if ((logitem.nodeName == "BR") || (mission == LNG_DEPLOYMENT)) { // (deployments do not need return)
			if  (mission == LNG_IPM) { //IPMs
				if (time2.match(/^1970/)) {
					if ((planet1.coords == LNG_NO_COORDS) || (planet2.coords == LNG_NO_COORDS)) time2 = '??'
					else {
						time2 = new Date(parseTime(time1).getTime() + (
							30000 + // 30 seconds in-system + 60 seconds per SS
							60000 * Math.abs(planet2.coords.match(/:(\d+):/)[1] - planet1.coords.match(/:(\d+):/)[1] )) / UNI_SPEED
						);
						time2.setMinutes(time2.getMinutes() + time2.getTimezoneOffset());
						time2 = time2.toLocaleFormat(ORIG_DATE_FORMAT)
					}
				}
				cls = cls.replace(/ returns$/, ' arrived');
				createEl({n: 'tr', a: {'@class': cls}, c: [
					{n: 'td', a: {'@class': 'mission', textContent: mission}},
					p1d,
					p2d,
					{n: 'td', a: {'@class': 'p1', textContent: planet1.coords + planet1.type}},
					{n: 'td', a: {'@class': 'p2', '@trg': planet2.id, textContent: planet2.coords + planet2.type}},
					{n: 'td', a: {'@class': 't1', textContent: time1}},
					{n: 'td', a: {'@class': 't2', textContent: time2}},
					COMBINE_FLEETS_AND_RESOURCES?null:res, fleet,
					{n: 'td', a: {'@class': 'empty st', '@colspan': COMBINE_FLEETS_AND_RESOURCES?2:3, textContent: '' }}
					]}, newtable);
			} else {
				//NO RETURN FLEET - create log entry
				var time3 = new Date(2 * parseTime(time2).getTime() - parseTime(time1).getTime());
				time3.setMinutes(time3.getMinutes() + time3.getTimezoneOffset());
				createEl({n: 'tr', a: {'@class': cls}, c: [
					{n: 'td', a: {'@class': 'mission', textContent: mission}},
					p1d,
					p2d,
					{n: 'td', a: {'@class': 'p1', textContent: planet1.coords + planet1.type}},
					{n: 'td', a: {'@class': 'p2', '@trg': planet2.id, textContent: planet2.coords + planet2.type}},
					{n: 'td', a: {'@class': 't1', textContent: time1}},
					{n: 'td', a: {'@class': 't2', textContent: time2}},
					COMBINE_FLEETS_AND_RESOURCES?null:res,
					fleet,
					{n: 'td', a: {'@class': 'empty st', '@colspan': COMBINE_FLEETS_AND_RESOURCES?2:3,
						textContent: (mission == LNG_DEPLOYMENT ? '' :(arrival?'not returned? >':'recalled <') + time3.toLocaleFormat(ORIG_DATE_FORMAT))}}
					]}, newtable);
			}
		} else if(logitem.nodeName == "TABLE") {
			//PARSE RETURN FLEET
			// parse each td of the table, they should have fixed order and contents
			var cells = document.evaluate('.//td', logitem, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if (cells.snapshotLength != 12) {
				console.log('INCORRECT TABLE STRUCTURE for return, aborting:' + cells.snapshotLength + '; ' + cells.innerHTML);
				return;
			}
			var fleet2 = cells.snapshotItem(8).textContent;
			var res2 = cells.snapshotItem(9).textContent;
			var time3 = new Date(2 * parseTime(time2).getTime() - parseTime(time1).getTime());
			time3.setMinutes(time3.getMinutes() + time3.getTimezoneOffset());
			res2 = stuffConvert(res2,0,1);
			fleet2 = stuffConvert(fleet2,1,1,COMBINE_FLEETS_AND_RESOURCES?res2:null);
			
			//create log entry
			createEl({n: 'tr', a: {'@class': cls}, c: [
				{n: 'td', a: {'@class': 'mission', textContent: mission}},
				p1d,
				p2d,
				{n: 'td', a: {'@class': 'p1', textContent: planet1.coords + planet1.type}},
				{n: 'td', a: {'@class': 'p2', '@trg': planet2.id, textContent: planet2.coords + planet2.type}},
				{n: 'td', a: {'@class': 't1', textContent: time1}},
				{n: 'td', a: {'@class': 't2', textContent: time2}},
				COMBINE_FLEETS_AND_RESOURCES?null:res,
				fleet,
				{n: 'td', a: {'@class': 't3', textContent: time3.toLocaleFormat(ORIG_DATE_FORMAT)}},
				COMBINE_FLEETS_AND_RESOURCES?null:res2,
				fleet2
				]}, newtable);
			// END RETURN FLEET
		}
	}
}

fl_div.appendChild(newtable);
textbox.parentNode.parentNode.className += ' GM_TextBox';
createEl({n: 'style', a: {type:'text/css', '@id':'GM__STYLE_GM_TextBox', textContent:'div.GM_TextBox {display:none;}'}}, head);
} //end of DoModify

// create DOM nodes using hash syntax and add it to end of parent node (if != null)
function createEl(elObj, parent) {
	var el;
	if (elObj == null) return;
	if (typeof elObj == 'string') {
		el = document.createTextNode(elObj);
	} else if (elObj.nodeType) { // it's an Element node already
		el = elObj;
	} else if (elObj.n) { // it's the hash type thing
		el = document.createElement(elObj.n);
		if (elObj.a) {
			attributes = elObj.a;
			for (var key in attributes) {
				if (key.charAt(0) == '@')
					el.setAttribute(key.substring(1), attributes[key]);
				else 
					el[key] = attributes[key];
			}
		}
		if (elObj.evl) {
			el.addEventListener(elObj.evl.type, elObj.evl.f, elObj.evl.bubble);
		}
		if (elObj.c) {
			elObj.c.forEach(function (v, i, a) { createEl(v, el); });
		}
	} else {
		alert(elObj.toString());
		el = elObj;
	}
	if (parent)
		parent.appendChild(el);
	return el;
}
// Get main content box
var textbox = document.evaluate('/html/body/div[@class="contbox"]/div[2]/div[1]/h3[1]', document, null, XPathResult.ELEMENT_NODE, null).iterateNext();
//create activate button
createEl({n: 'style', a: {type:'text/css', textContent:'#GM_ActivateButton { margin-left:10px; }'}},document.getElementsByTagName('head')[0]);
var activateButton = createEl({n: 'button', a: {'@id':'GM_ActivateButton', name:'GM_ActivateButton', textContent:LNG_START_BUTTON }},textbox)
	.addEventListener('click',DoModify,true);
})();
