// ==UserScript==
// @name			LWMActivityTracker
// @author			Theatre Of Pain (http://www.lordswm.com/pl_info.php?id=4821925)
// @version			2.0.161216
// @description		This script tracks your daily activities by monitoring experience, guilds, and faction points
// @include			http://www.lordswm.com/home.php
// @grant       	GM_getValue
// @grant       	GM_setValue
// @grant       	GM_log
// @namespace https://greasyfork.org/users/86247
// @downloadURL https://update.greasyfork.org/scripts/25786/LWMActivityTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/25786/LWMActivityTracker.meta.js
// ==/UserScript==

var debug = false;	//turn to true to display debug messages in the error console

const COMPARTMENT_SIZE = 7;		// grouping per date
const MAX_COMPARTMENTS = 8;		// maximum number of groups
const GRAPH_RECORDS = COMPARTMENT_SIZE * MAX_COMPARTMENTS;	// number of tracker records
const GRAPH_COLOR = 'blue';
const INVERT_GRAPH_COLOR = 'orange';
const LIGHT_BG = '#FFFFFF';
const DARK_BG = '#DDD9CD';
const DATESTAMP_SIZE = 8;

const EXPERIENCE_RECORD = 26;
const DATESTAMP = 0;
const EXP = 1;
const FSP = 2;
const KNIGHT = 3;
const NECRO = 4;
const WIZARD = 5;
const ELF = 6;
const BARBARIAN = 7;
const DARK_ELF = 8;
const DEMON = 9;
const DWARF = 10;
const TRIBAL = 11;
const XX = 12;	// reserved for future expansion
const YY = 13;	// reserved for future expansion
const ZZ = 14;	// reserved for future expansion
const HG = 15;
const LG = 16;
const GG = 17;
const TG = 18;
const MG = 19;
const CG = 20;
const SG = 21;
const EG = 22;
const RG = 23;
const WG = 24;
const AG = 25;

// list labels
const EXP_L = 'Experience';
const FSP_L = 'Faction Skill Points';
const KNIGHT_L = 'Knight FSP';
const NECRO_L = 'Necromancer FSP';
const WIZARD_L = 'Wizard FSP';
const ELF_L = 'Elf FSP';
const BARBARIAN_L = 'Barbarian FSP';
const DARK_ELF_L = 'Dark Elf FSP';
const DEMON_L = 'Demon FSP';
const DWARF_L = 'Dwarf FSP';
const TRIBAL_L = 'Tribal FSP';
const XX_L = '- Reserved for future expansion -';
const YY_L = '- Reserved for future expansion -';
const ZZ_L = '- Reserved for future expansion -';
const HG_L = 'Hunters\' guild';
const LG_L = 'Laborers\' guild';
const GG_L = 'Gamblers\' guild';
const TG_L = 'Thieves\' guild';
const RG_L = 'Rangers\' guild';
const MG_L = 'Mercenaries\' guild';
const CG_L = 'Commanders\' guild';
const SG_L = 'Smiths\' guild';
const EG_L = 'Enchanters\' guild';
const WG_L = 'Watchers\' guild';
const AG_L = 'Adventurers\' guild';

// graph labels
var labels = new Array();
	labels[DATESTAMP] = 'Date';
	labels[EXP] = 'Experience';
	labels[FSP] = 'Total FSP';
	labels[KNIGHT] = 'Knight';
	labels[NECRO] = 'Necromancer';
	labels[WIZARD] = 'Wizard';
	labels[ELF] = 'Elf';
	labels[BARBARIAN] = 'Barbarian';
	labels[DARK_ELF] = 'Dark Elf';
	labels[DEMON] = 'Demon';
	labels[DWARF] = 'Dwarf';
	labels[TRIBAL] = 'Tribal';
	labels[XX] = 'RESERVED';
	labels[YY] = 'RESERVED';
	labels[ZZ] = 'RESERVED';
	labels[HG] = 'HG';
	labels[LG] = 'LG';
	labels[GG] = 'GG';
	labels[TG] = 'TG';
	labels[RG] = 'RG';
	labels[MG] = 'MG';
	labels[CG] = 'CG';
	labels[SG] = 'SG';
	labels[EG] = 'EG';
	labels[WG] = 'WG';
	labels[AG] = 'AG';

var experience = new Array();
var tracker = new Array();
var experience_record = new Array(EXPERIENCE_RECORD);
var graph_width = 100;
var empty_cell_size = 3;
var date_cell_width = 60;
var graph_div, backup_div, options_div;
var graph;
var select;
var player_name;
var server_name;

main();

function main() {
	getPlayerAndServer();
	getExperienceData();
	experience_record = getExperienceRecord();
	createExperienceRecord(experience_record);
	setExperienceData();
	buildTracker();
	tooltipStyle();
	displayTracker();
}

function getPlayerAndServer() {
	var all_params = document.getElementsByTagName('param');
	for (var i = 0; i < all_params.length; i++) {
		if (all_params[i].name == 'FlashVars') {
			player_name = all_params[i].value.split('|')[3];
			break;
		}
	}

	if (location.href.indexOf('.com') != -1) {
		server_name = '.com';
	} else {
		server_name = '.ru';
	}

	if (debug) {GM_log(
					'Server name = ' + server_name +
					'\nPlayer name = ' + player_name
				)}

}

function getExperienceData() {
	var temp_data;

	// migrate earlier version that didn't store experience by player name
	temp_data = GM_getValue('Experience', -1);
	if (temp_data != -1) {
		GM_setValue(player_name + server_name + ' Experience', temp_data);
		GM_deleteValue('Experience');
		document.cookie = 'ActivityTrackerBackup=0;expires=' + new Date('1999');
	}

	temp_data = GM_getValue(player_name + server_name + ' Experience', -1);
	if (temp_data != -1) {
		experience = temp_data.split(',');
		// migrate earlier version that didn't store watchers and adventurers data
		if (experience[0].split('#').length != EXPERIENCE_RECORD) {
			var experience_record = new Array(EXPERIENCE_RECORD);
			for (var x = 0; x < experience.length; x++) {
				experience[x] = experience[x] + '#0#0';
			}
			document.cookie = player_name + server_name + 'ActivityTrackerBackup=0'
							+ ';expires=' + new Date('1999');
		} else {
			var backup_data = getCookie(player_name + server_name + 'ActivityTrackerBackup');
			if (backup_data != 0) {
				var backup_array = backup_data.split(',');
				for (var z = 0; z < backup_array.length; z++) {
					var updated = false;
					for (var y = 0; y < experience.length; y++) {
						if (experience[y].substring(0,DATESTAMP_SIZE) == backup_array[z].substring(0,DATESTAMP_SIZE)) {
							experience[y] = backup_array[z];
							updated = true;
						}
					}
					if (!updated) {
						experience.push(backup_array[z]);
					}
				}
				experience.sort();
				experience.reverse();
			}
		}
	} else {
		experience = new Array();
	}
}

// this function returns the value of a stored cookie
function getCookie(cookie_key) {
	var i,x,y,ARRcookies=document.cookie.split(';');
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf('='));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf('=')+1);
		x=x.replace(/^\s+|\s+$/g,'');
		if (x==cookie_key) {
			return unescape(y);
		}
	}
	return 0;
}

function setExperienceData() {
	experience.sort();
	experience.reverse();
	GM_setValue(player_name + server_name + ' Experience', experience.toString());

	// keep last n days of data as cookie to recover from broswer crashes
	// n is determined by COMPARTMENT_SIZE
	var backup_data = new Array();
	var days_to_keep;
	(experience.length > COMPARTMENT_SIZE) ? (days_to_keep = COMPARTMENT_SIZE) : (days_to_keep = experience.length);
	var z = 0;
	while (z < days_to_keep) {
		backup_data.push(experience[z]);
		z++;
	}
	document.cookie = player_name + server_name + 'ActivityTrackerBackup=' + backup_data.toString()
					+ ';expires=' + new Date('2050');
}

function createExperienceRecord(passed_experience_record) {
	new_record = passed_experience_record.toString().replace(/,/g,'#');
	for (var z = 0; z < experience.length; z++) {
		if (experience[z].substring(0,DATESTAMP_SIZE) == new_record.substring(0,DATESTAMP_SIZE)) {
			if (experience[z] != new_record) {
				experience[z] = new_record;
			}
			return;
		}
	}
	if (experience.length == 0) {
		var first_record = (parseInt(new_record.substring(0,DATESTAMP_SIZE)) - 1) + new_record.substring(DATESTAMP_SIZE);
		experience.push(first_record);
	}
	experience.push(new_record);
}

// parse experience, faction, and guild points and return as an array
function getExperienceRecord() {
	var all_tables = document.getElementsByTagName('table');
	var main_table;
	var matched;
	var combat_level;
	var experience_td, faction_td;
	var faction_array = new Array();
	var temp_experience_record = new Array(EXPERIENCE_RECORD);
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('Combat level') != -1)
		&& (all_tables[i].innerHTML.indexOf('Necromancer') != -1)
		&& (all_tables[i].innerHTML.indexOf('Laborers') != -1)) {
			main_table = all_tables[i];
		}
	}

	var all_tds = main_table.getElementsByTagName('td');
	for (var i = 0; i < all_tds.length; i++) {
		if ((all_tds[i].innerHTML.indexOf('Necromancer') != -1)
			&& (all_tds[i].innerHTML.indexOf('Laborers') != -1)) {
			faction_td = all_tds[i];
		}
		if (all_tds[i].innerHTML.indexOf('Combat level') != -1) {
			experience_td = all_tds[i];
		}
	}

	matched = experience_td.innerHTML.replace(/,/g, '').match(/\((\d*)\)/);
	temp_experience_record[EXP] = RegExp.$1;

	faction_array = faction_td.innerHTML.split('&nbsp;&nbsp;');

 	for (var i = 0; i < faction_array.length; i++) {
		// faction points
		matched = faction_array[i].match(/Knight: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[KNIGHT] = RegExp.$1;
		}
		matched = faction_array[i].match(/Necromancer: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[NECRO] = RegExp.$1;
		}
		matched = faction_array[i].match(/Wizard: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[WIZARD] = RegExp.$1;
		}
		matched = faction_array[i].match(/Elf: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[ELF] = RegExp.$1;
		}
		matched = faction_array[i].match(/Barbarian: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[BARBARIAN] = RegExp.$1;
		}
		matched = faction_array[i].match(/Dark elf: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[DARK_ELF] = RegExp.$1;
		}
		matched = faction_array[i].match(/Demon: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[DEMON] = RegExp.$1;
		}
		matched = faction_array[i].match(/Dwarf: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[DWARF] = RegExp.$1;
		}
		matched = faction_array[i].match(/Tribal: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[TRIBAL] = RegExp.$1;
		}

		//guilds
		matched = faction_array[i].match(/Hunters' guild:/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[HG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Laborers' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[LG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Gamblers' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[GG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Thieves' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[TG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Rangers' Guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[RG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Mercenaries' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[MG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Commanders' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[CG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Smiths' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[SG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Watchers' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[WG] = RegExp.$1;
		}
		matched = faction_array[i].match(/Adventurers' guild: (\d*)/);
		if (matched != null) {
			matched = faction_array[i].match(/\((\d*.\d*)\)/);
			temp_experience_record[AG] = RegExp.$1;
		}
	}

	matched = document.getElementById('home_2').innerHTML.match(/\((\d*.\d*)\)/);
	temp_experience_record[EG] = RegExp.$1;

   	var localDate = new Date();
    var utcDate = localDate.getTime() + (localDate.getTimezoneOffset() * 60000); //in ms
    var serverDate = new Date(utcDate + (3600000*4)); //GMT+4

	var year = serverDate.getFullYear();
	var month = serverDate.getMonth() + 1;
	if (month.toString().length == 1) {
		month = '0' + month;
	}
	var day = serverDate.getDate();
	if (day.toString().length == 1) {
		day = '0' + day;
	}
	temp_experience_record[DATESTAMP] = '' + year + month + day;
	temp_experience_record[FSP] = roundNumber((parseFloat(temp_experience_record[KNIGHT])
								+ parseFloat(temp_experience_record[NECRO])
								+ parseFloat(temp_experience_record[WIZARD])
								+ parseFloat(temp_experience_record[ELF])
								+ parseFloat(temp_experience_record[BARBARIAN])
								+ parseFloat(temp_experience_record[DARK_ELF])
								+ parseFloat(temp_experience_record[DEMON])
								+ parseFloat(temp_experience_record[DWARF])
								+ parseFloat(temp_experience_record[TRIBAL])), 2);

	temp_experience_record[XX] = 0;
	temp_experience_record[YY] = 0;
	temp_experience_record[ZZ] = 0;

	if (debug) {GM_log(
					'\nServer timestamp = ' + serverDate +
					'\n\nKnight FSP = ' + temp_experience_record[KNIGHT] +
					'\nNecromancer FSP = ' + temp_experience_record[NECRO] +
					'\nWizard FSP = ' + temp_experience_record[WIZARD] +
					'\nElf FSP = ' + temp_experience_record[ELF] +
					'\nBarbarian FSP = ' + temp_experience_record[BARBARIAN] +
					'\nDark elf FSP = ' + temp_experience_record[DARK_ELF] +
					'\nDemon FSP = ' + temp_experience_record[DEMON] +
					'\nDwarf FSP = ' + temp_experience_record[DWARF] +
					'\nTribal FSP = ' + temp_experience_record[TRIBAL] +
					'\n\n\nHunters\' guild = ' + temp_experience_record[HG] +
					'\nLaborers\' guild = ' + temp_experience_record[LG] +
					'\nGamblers\' guild = ' + temp_experience_record[GG] +
					'\nThieves\' guild = ' + temp_experience_record[TG] +
					'\nRangers\' guild = ' + temp_experience_record[RG] +
					'\nMercenaries\' guild = ' + temp_experience_record[MG] +
					'\nCommanders\' guild = ' + temp_experience_record[CG] +
					'\nSmiths\' guild = ' + temp_experience_record[SG] +
					'\nWatchers\' guild = ' + temp_experience_record[WG] +
					'\nAdventurers\' guild = ' + temp_experience_record[AG]
				)}

	return temp_experience_record;
}

function buildTracker() {
	var record1, record2;
	for (var z = 0; z < experience.length - 1; z++) {
		var difference_record = new Array();
		record1 = experience[z].split('#');
		record2 = experience[z + 1].split('#');
		difference_record[DATESTAMP] = record1[DATESTAMP];
		for (var y = 1; y < record1.length; y++) {
			if (record1[y] != record2[y]) {
				difference_record[y] = record1[y] - record2[y];
			} else {
				difference_record[y] = '';
			}
		}
		tracker.push(difference_record);

		// no need to track historical data that will not be displayed on the graph
		if (tracker.length == GRAPH_RECORDS) {
			break;
		}
	}
}

function displayTracker() {
	var all_tables = document.getElementsByTagName('tbody');
	var main_table;
	var experience_td, faction_td;
	for (var i = 0; i < all_tables.length; i++) {
		if ((all_tables[i].innerHTML.indexOf('Combat level') != -1)
		&& (all_tables[i].innerHTML.indexOf('Necromancer') != -1)
		&& (all_tables[i].innerHTML.indexOf('Laborers') != -1)) {
			main_table = all_tables[i];
		}
	}
	faction_td = main_table.getElementsByTagName('td')[1];
	faction_td.rowSpan = 2;
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	graph_div = document.createElement('div');
	graph_div.id = 'graph_div';
	td.appendChild(graph_div);

	select = document.createElement('select');
	select.id = 'select';
	addOption(select, EXP, EXP_L);
	addOption(select, FSP, FSP_L);
	addOption(select, KNIGHT, KNIGHT_L);
	addOption(select, NECRO, NECRO_L);
	addOption(select, WIZARD, WIZARD_L);
	addOption(select, ELF, ELF_L);
	addOption(select, BARBARIAN, BARBARIAN_L);
	addOption(select, DARK_ELF, DARK_ELF_L);
	addOption(select, DEMON, DEMON_L);
	addOption(select, DWARF, DWARF_L);
	addOption(select, TRIBAL, TRIBAL_L);
	addOption(select, HG, HG_L);
	addOption(select, LG, LG_L);
	addOption(select, GG, GG_L);
	addOption(select, TG, TG_L);
	addOption(select, MG, MG_L);
	addOption(select, CG, CG_L);
	addOption(select, SG, SG_L);
	addOption(select, EG, EG_L);
	addOption(select, RG, RG_L);
	addOption(select, WG, WG_L);
	addOption(select, AG, AG_L);
	select.onchange = function() {
		if (document.getElementById('graph') != null) {
			document.getElementById('graph_div').removeChild(document.getElementById('graph'));
		}
		GM_setValue('default activity', parseInt(select.options[select.selectedIndex].value));
		if(debug) {GM_log('Display tracking for: ' + select.options[select.selectedIndex].text)}
		document.getElementById('graph_div').appendChild(getActivityGraph(parseInt(select.options[select.selectedIndex].value)));
	}

	td.insertBefore(document.createElement('br'), td.firstChild);
	td.insertBefore(document.createElement('br'), td.firstChild);
	td.insertBefore(select, td.firstChild);
	var temp_activity = GM_getValue('default activity', -1);
	if (temp_activity != -1) {
		graph_div.appendChild(getActivityGraph(temp_activity));
		for(var i=0; i < select.options.length; i++){
			if(select.options[i].value == temp_activity)
				select.selectedIndex = i;
		}
	} else {
		GM_setValue('default activity', EXP);
		graph_div.appendChild(getActivityGraph(EXP));
	}
	td.appendChild(createOptionsDiv());
	tr.appendChild(td);
	main_table.appendChild(tr);

	function addOption(optionList, value, text) {
		var option;
		option = document.createElement('option');
		option.value = value;
		option.text = text;
		optionList.appendChild(option);
	}
}

function createOptionsDiv(){
	options_div = document.createElement('div');
	var button_div = document.createElement('div');
	options_div.appendChild(button_div);
	var el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', backupActivityData, false);
	el.setAttribute('value', 'Backup');
	button_div.appendChild(el);
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', updateActivityData, false);
	el.setAttribute('value', 'Update');
	button_div.appendChild(el);
	el = document.createElement('input');
	el.type = 'button';
	el.addEventListener('click', restoreActivityData, false);
	el.setAttribute('value', 'Restore');
	button_div.appendChild(el);
	button_div.appendChild(document.createElement('br'));
	backup_div = document.createElement('div');
	backup_div.id = 'activityTrackerDataDiv';
	backup_div.style.display = 'none';
	options_div.appendChild(backup_div);
	backup_div.appendChild(document.createTextNode('Paste modified data below and click Update to update graph or Restore to restore last backup of data'));
	el = document.createElement('textarea');
	el.id = 'activityTrackerData';
	el.style.width = graph_width * empty_cell_size + date_cell_width;
	el.style.height = graph_width;
	el.style.resize = 'none';
	backup_div.appendChild(el);
	return options_div;
}

function getActivityGraph(activity_type) {
	var max_value = 0;
	var second_max_value = 0;
	var activity_value;
	var header_sections = 5;

	// find maximum value
	for (var z = 0; z < tracker.length; z++) {
		if (tracker[z][activity_type] > max_value) {
			second_max_value = max_value;
			max_value = tracker[z][activity_type];
		} else if (tracker[z][activity_type] > second_max_value) {
			second_max_value = tracker[z][activity_type];
		}
	}
	max_value = roundUp(max_value);
	second_max_value = roundUp(second_max_value);

	if (second_max_value != 0) {
		// prevent value spikes from distorting the look of the graph
		if (max_value/2 > second_max_value) {
			max_value = second_max_value;
		}
	}

	// graph values
	var tr, td;
	var bgcolor = DARK_BG;
	graph = document.createElement('table');
	graph.id = 'graph';
	graph.className='wblight';
	graph.align = 'center';
	graph.border = 0;
	graph.cellSpacing = 0;

	tr = document.createElement('tr');
	tr.className = 'wb';
	tr.bgColor = DARK_BG;
	td = document.createElement('td');
	td.width = date_cell_width;
	td.className = 'wb';
	td.style.fontSize = 8;
	td.innerHTML = labels[activity_type].bold();
	td.align = 'center';
	tr.appendChild(td);

	if (max_value != 0) {
		if (max_value <= 5) {
			max_value = 5;
		} else if (max_value <=10) {
			max_value = 10;
		}
		for (var z = 0; z < header_sections; z++) {
			td = document.createElement('td');
			td.className = 'wb';
			td.colSpan = graph_width / header_sections;
			td.align = 'right';
			td.style.fontSize = 8;
			td.innerHTML = roundNumber((max_value * (z + 1)) / header_sections , 2);
			tr.appendChild(td);
		}
	} else {
		td = document.createElement('td');
		td.className = 'wb';
		td.colSpan = graph_width;
		tr.appendChild(td);
	}

	graph.appendChild(tr);
	var line_counter = COMPARTMENT_SIZE;
	var class_name = 'wblight';
	for (var z = 0; z < lineCount(tracker.length); z++) {
		if (z == GRAPH_RECORDS) {
			break;
		}
		tr = document.createElement('tr');
		tr.bgColor = GRAPH_COLOR;
		tr.onmouseover = invertColor;
		tr.onmouseout = restoreColor;
		if (line_counter == COMPARTMENT_SIZE) {
			line_counter = 0;
			td = document.createElement('td');
			td.width = date_cell_width;
			td.align = 'center';
			td.style.fontSize = 8;
			if (z < tracker.length) {
				td.innerHTML = tracker[z][DATESTAMP].substr(0,4) + '-' + tracker[z][DATESTAMP].substr(4,2) + '-' + tracker[z][DATESTAMP].substr(6,2);
			}
			(bgcolor == LIGHT_BG) ? bgcolor = DARK_BG : bgcolor = LIGHT_BG;
			td.className = 'wb';
			td.bgColor = bgcolor;
			td.rowSpan = COMPARTMENT_SIZE;
			tr.appendChild(td);
			tr.style.borderTop = '1px solid black';
		}
		line_counter++;
		if (z < tracker.length) {
			activity_value = roundNumber(tracker[z][activity_type]*graph_width/max_value, 0);
			if (tracker[z][activity_type] > 0) {
				tr.id = tracker[z][DATESTAMP].substr(0,4) + '-' + tracker[z][DATESTAMP].substr(4,2) + '-' + tracker[z][DATESTAMP].substr(6,2) + ':\u00a0\u00a0\u00a0' + roundNumber(tracker[z][activity_type], 2);
			}
		} else {
			activity_value = 0;
		}
		for (var y = 0; y < graph_width; y++) {
			td = document.createElement('td');
			td.style.height = empty_cell_size;
			td.style.width = empty_cell_size;
			activity_value--;
			if (activity_value >= 0) {
				td.className = 'NormalColor';
			} else {
				td.bgColor = bgcolor;
			}
			tr.appendChild(td);
		}
		graph.appendChild(tr);
	}

	if (tracker.length > COMPARTMENT_SIZE) {
		var average_points = getAveragePoints(activity_type);
		if (average_points != -1) {
			var estimate = provideEstimate(average_points, activity_type);
			if (estimate != -1) {
				tr = document.createElement('tr');
				tr.className = 'wb';
				(bgcolor == LIGHT_BG) ? tr.bgColor = DARK_BG : tr.bgColor = LIGHT_BG;
				td = document.createElement('td');
				td.colSpan = graph_width + 1;
				td.className = 'wb';
				td.style.fontSize = 8;
				td.innerHTML = estimate;
				td.align = 'center';
				tr.appendChild(td);
				graph.appendChild(tr);
			}
		}
	}
	return graph;
}

function getAveragePoints(activity_type) {
	var points_total = 0;
	for (var z = 1; z < COMPARTMENT_SIZE + 1; z++) {
		if (tracker[z][activity_type] != '') {
			points_total += roundNumber(parseFloat(tracker[z][activity_type]), 2);
		}
	}
	if (points_total == 0) {
		return -1;
	} else {
		return roundNumber(points_total / COMPARTMENT_SIZE, 2); //daily average
	}
}

function provideEstimate(average_points, activity_type) {
    //define experience, faction, and guild levels
    var combat_lvl = [0,1500,4500,15000,32000,90000,190000,400000,860000,1650000,3000000,
    					5000000,8500000,14500000,25000000,43000000,70000000,108000000,
    					160000000,230000000,325000000];
    var faction_lvl = [20,50,90,160,280,500,900,1600,2900,5300,9600,17300];
    var hg_lvl = [16,60,180,400,700,1200,2000,3000,4300,6000,8000,10500];
    var lg_lvl = [90,180,360,720,1500,3000,5000,8000,12000,17000,23000,30000,38000,47000,57000];
    var gg_lvl = [10,30,60,100,150,210,280,360,450,550,660,800,1000,1300,2000];
    var tg_lvl = [50,120,240,400,600,840,1200,2000,3000,4300,6000,8000,10800,14000,17600,21600,26000];
    var rg_lvl = [100,240,480,800,1200,1680,2400,4000,6000,8600,12000];
    var mg_lvl = [50,120,300,600,1000,1500,2200,3000,4000,5500,7800,11000,14500,18200,22200];
	var cg_lvl = [150, 350, 750, 1400,2200,3200,4300,5600,7000,8500];
    var sg_lvl = [30,80,165,310,555,970,1680,2885,5770];
    var eg_lvl = [104,588,2200,7000,10000];
	var wg_lvl = [60,200,450,850,1500];
	var working_array = new Array();

	switch(activity_type) {
	case EXP:
		working_array = combat_lvl;
		break;
	case FSP:
		return -1;
	case KNIGHT:
	case NECRO:
	case WIZARD:
	case ELF:
	case BARBARIAN:
	case DARK_ELF:
	case DEMON:
	case DWARF:
	case TRIBAL:
		working_array = faction_lvl;
		break;
	case HG:
		working_array = hg_lvl;
		break;
	case LG:
		working_array = lg_lvl;
		break;
	case GG:
		working_array = gg_lvl;
		break;
	case TG:
		working_array = tg_lvl;
		break;
	case RG:
		working_array = rg_lvl;
		break;
	case MG:
		working_array = mg_lvl;
		break;
	case CG:
		working_array = cg_lvl;
		break;
	case SG:
		working_array = sg_lvl;
		break;
	case EG:
		working_array = eg_lvl;
		break;
	case WG:
		working_array = wg_lvl;
		break;
	default:
		return -1;
	}
	var current_points = experience[0].split('#')[activity_type];
	if (current_points >= working_array[working_array.length - 1]) { // player has reached the maximum already
		return -1;
	}
	var points_required;
	var next_level;
	if (current_points < working_array[0]) {
		points_required = working_array[0] - current_points;
	} else {
		for (var x = 0; x < working_array.length; x++) {
			if ((current_points >= working_array[x]) && (current_points < working_array[x + 1])) {
				points_required = working_array[x + 1] - current_points;
				next_level = x + 2;
				break;
			}
		}
	}

	var message = 'In the past ' + COMPARTMENT_SIZE + ' days you averaged ' + average_points + ' per day. ';
	message += 'If you maintain your daily average, you will reach ';
	message += 'level ' + next_level;
	if (roundNumber(points_required / average_points, 0) == 0){
		message += ' today.'
	} else if (roundNumber(points_required / average_points, 0) == 1){
		message += ' tomorrow.'
	} else {
		message += ' in ' + roundNumber(points_required / average_points, 0) + ' days.';
	}
	return message;
}

function backupActivityData() {
	var backup_value = GM_getValue(player_name + server_name + ' Experience Backup', -1);
	if (backup_value != -1) {
		var backup_value_date = GM_getValue(player_name + server_name + ' Experience Backup Date', -1);
		var response = confirm('The script has detected a backup dated:\n' + backup_value_date + '\nIf you proceed, the script will overwrite it.\nAre you sure you want to continue?');
		if (!response) {return;}
	}
	GM_setValue(player_name + server_name + ' Experience Backup', experience.toString());
	GM_setValue(player_name + server_name + ' Experience Backup Date', new Date().toString());
	backup_div.style.display = 'block';
	var header = '';
	for (var z = 0; z < labels.length; z++) {
		header += labels[z];
		if (z < labels.length - 1) {
			header += '\t';
		}
	}
	header += '\n';
	document.getElementById('activityTrackerData').value = header + experience.toString().replace(/#/g, '\t').replace(/,/g, '\n');
	document.getElementById('activityTrackerData').select();
}

function updateActivityData() {
	if (backup_div.style.display == 'none') {return;}
	var temp_data = document.getElementById('activityTrackerData').value.replace(/\t/g, '#').replace(/\n/g, ',');
	if (temp_data.substring(temp_data.length - 1) == ',') {temp_data = temp_data.substring(0, temp_data.length - 1);}
	var temp_array = new Array();
	temp_array = temp_data.split(',');
	for (var z = 1; z < temp_array.length; z++) {
		var temp_record = temp_array[z].split('#');
		for (var y = 0; y < temp_record.length; y++) {
			if (!isNumber(temp_record[y])) {
				alert('Encountered an invalid value: ' + temp_record[y] + '\nFound in Row: ' + z + ' Col: ' + (y + 1) + '\nPlease correct the value and try again.');
				return;
			}
		}
	}
	temp_array.splice(0, 1);	// remove column names
	experience = temp_array;
	setExperienceData();
	window.location.reload();
}

function restoreActivityData() {
	var backup_value = GM_getValue(player_name + server_name + ' Experience Backup', -1);
	if (backup_value != -1) {
		var backup_value_date = GM_getValue(player_name + server_name + ' Experience Backup Date', -1);
		var response = confirm('The script has detected a backup dated:\n' + backup_value_date + '\nIf you proceed, the script will replace current data with this backup.\nAre you sure you want to continue?');
		if (!response) {return;}
		experience = backup_value.split(',');
		setExperienceData();
		window.location.reload();
	} else {
		alert('The script didn\'t find any backup to restore.');
	}
}

function invertColor() {
	if (this.id) {
		this.bgColor = INVERT_GRAPH_COLOR;
		tooltip.show(this.id);
	}
}

function restoreColor() {
	if (this.id) {
		this.bgColor = GRAPH_COLOR;
		tooltip.hide();
	}
}

function roundNumber(unrounded_number, decimals) {
	var rounded_number = Math.round(unrounded_number*Math.pow(10,decimals))/Math.pow(10,decimals);
	return rounded_number;
}

function roundUp(unrounded_number){
	var float_number, int_number, rounded_number, without_round_up;
	if (parseInt(unrounded_number) != unrounded_number) {	//float
		if (roundNumber(unrounded_number, 0) != roundNumber(unrounded_number + 0.5, 0)) {	//need to prevent rounding down
			unrounded_number += 0.5;
		}
	}
	unrounded_number = roundNumber(unrounded_number, 0);
	rounded_number = (parseInt(unrounded_number.toString().substring(0,1)) + 1);
	without_round_up = parseInt(unrounded_number.toString().substring(0,1));
	for (var z = 1; z < unrounded_number.toString().length; z++) {
		rounded_number *= 10;
		without_round_up *= 10;
	}
	return (without_round_up == unrounded_number) ? without_round_up : rounded_number;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function lineCount(data_lines) {
	return (data_lines < COMPARTMENT_SIZE) ? COMPARTMENT_SIZE : Math.ceil(parseInt(data_lines)/COMPARTMENT_SIZE)*COMPARTMENT_SIZE;
}

function tooltipStyle() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML =  '#tt { position:absolute; display:block;}';
	style.innerHTML += '#ttcont { display:block; padding:2px 12px 3px 7px; margin-left:5px; background:#666; color:#fff; }';
	document.body.appendChild(style);
}

var tooltip = function(){
	var id = 'tt';
	var top = 3;
	var left = 3;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h;
	return{
		show:function(v,w){
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				tt.appendChild(c);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.pos;
			}
			tt.style.display = 'block';
			c.innerHTML = v;
			tt.style.width = v.length * 8;
			h = parseInt(tt.offsetHeight) + top;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		pos:function(e){
			var u = e.pageY;
			var l = e.pageX;
			tt.style.top = (u + 5) + 'px';
			tt.style.left = (l + left) + 'px';
		},
		fade:function(d){
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();

function supportsHTML5Storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		if (debug) GM_log('HTML5 Storage is not supported');
		return false;
	}
}
