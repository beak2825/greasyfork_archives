// ==UserScript==
// @name			Ikariam Xplorer
// @namespace		greasyfork.org
// @homepage		http://greasyfork.org/
// @description		Create a searchable map on all the islands/cities you have visited. 
// @version			0.1.1
// @include			http://s*.ikariam.*/*
// @exclude			http://support*.ikariam.*/*
// @license        	GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html), Copyright (c) 2012-2015, Viper
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/18074/Ikariam%20Xplorer.user.js
// @updateURL https://update.greasyfork.org/scripts/18074/Ikariam%20Xplorer.meta.js
// ==/UserScript==
// Version history:
/*
0.1.1/8.7.2015		First release.
					Feature: Autoscan worldmap view to get base island information (Worldscan)
					Feature: Autoscan defined area's island views (Scan)
					Feature: Collect city information from island view
					Feature: Display island/city information on a map interface
					Feature: Filter players, alliances, cities			
					Feature: Collect player score information from island view
					Feature: Collect information from world map
					
*/
/* 
ROADMAP
[HIGH]	Collect information from alliance member list view
[HIGH]	Display allied cities on the map
[HIGH]	Detect and highlight allied cities
[HIGH]	Collect information from high score views.
[HIGH]	Collect information from combat reports
[HIGH]	Display stationed troops and troop movements.
[MED]	Remove highlight colors from used alliance colors
[MED]	Show/highligh player cities on map when hoovering over player's info
[MED]	Grouping (and thus coloring) by other fields in addition to alliance
[LOW] 	"Travel Time" functionality with source and target island selection
[LOW]	Make grid ticks visible when zooming
[LOW]	Make containers "dockable" or at least their visibility selectable
[LOW]	Define and restrict minimum size of window to prevent misaligned/overlapping ui elements)
*/

const version = '0.1.1';
const scriptURL = 'http://userscripts.org/scripts/source/xxxxx.user.js'
const scriptMetaURL = 'http://userscripts.org/scripts/source/xxxxx.meta.js'
const scriptHomepage = 'http://userscripts.org/scripts/show/xxxxx';
const updateCheckInterval = 24*60*60*1000; //24 hours
const versionTag = '// @version';

const mapDBVersion = '001';
const mapDBKey = 'mapDB';

const syslogLogLevel = 4;  // Higher number results in finer logging, 1-4
const syslogJavaConsoleEnabled = false;
const syslogFirebugEnabled = true;
var consoleBackup = unsafeWindow.console;	// store the original console pointer since some pages overwrite/disable it

const defaultWindowWidth = 1024;
const defaultWindowHeight = 810;

const mapXOffset = 20;
const mapYOffset = 45;
const defaultMapScaleRatio = 55;
var mapScaleRatio = defaultMapScaleRatio;
var mapScale = 1;

const islandScale = 4;
const generalsScoreIslandScale = 100;
const totalScoreIslandScale = 5000;
const goldIslandScale = 100000;

const playerScale = 4;
const generalsScorePlayerScale = 100;
const totalScorePlayerScale = 5000;
const goldPlayerScale = 100000;

const IMAGES =
{
	xplorer:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAADAFBMVEUMCAjUiSCMkJT6xTnqzZicimzKzM7rxWjcpizYqlybXwv85Jb532TJsZf76cxQTlC4iEC8jV/Epkj821jEp4SwsbXmw4LgzbXow0zn6ezkhnydZhH04rvcwJTwtzGcglT202f3z1LcmSrClkHctnx8ZiykGxTt4Mz889LmuV/63oL03JTEm1/fuUTw2LTysSzUr3z31XzVtZR+eGz88LjMqJT87pzky6T5+PDc29zvzGjl5+TEwLTCnXzXwKfYMizm2cS2hjD80US0mnzeqEnkzlysdTCdoKPSqHC4h1HEjGzxyFzKmEzkemzsnoyygDL3xUSFiIn88Gf41nTjoSbu1YzUnozisEj87tTNqoyodBjQJBz89YbisjyAgIHIooFERkT046mwrqjjunAsKiy3W0/25MT01lH89ODFm3P03rvr0qvuzHS8jiTS09PgqDz26dT75lz1yE7quDzoulTQsIz42n3YupX89cT8/vzj4uP8yjrMqIS3uLrszXzh0rjv8PGkSjwcGhxgYF5EQDiPemGkjmzAwMTkhkSsWjTUdizUljycgmzYjizkVkykaiDu16a0qpz87qnMPDS8fmScknz86WScJhTHuqecYhW0gEMUEhT86IzVt4zZsVzAkEDQrnCRj4ftu0WVmJvAkkzClXHMokzdoT/EmjSsooyocyTClGPskoQ0NjSseTz883SQiHz03nS8HhzkqpTboTTqsVTbkSOlqKy8Ihz67tznwnTkwoz84ozcqlTU1tzqy4xEQkTcxrT81lzMgmzw0pTixpbmvlyEfnTdxqbcKiTESjy0fkzotpzNnn3fsnH46pzMtpX74lykbhT56rTkvoHMol/8/vS8jiysehz86qTkvnT8+uPMonQkIiRkZlzExsr03qzkykz8+sz89rf89pzy3sSsejT5ykT89mz06sTxvjz89qz30FzYljTiqTTMpmTbwJzs4dTUukzs2LzpsDTNroTy1ISEenTUppzizaze3uTMmlTcJiS0knShIxzcsGTflboUAAABAHRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ex4nOAAACN5JREFUeJzll39MG9cdwIOMBrWLGzdWbA3Hs2kWQ2iOcnVjj9WpCwSFkAlqoJyzsRPKYs5nJmzI42xxwtrSTtuqjCzd0pDWyYbi0oQ1CRtBvYQpS5ZUbK2JCURRRFcNEUoghLoyRrW6Nfu+MxAg0LWa+te+YB9+ft8P31/v+95b4/sfZc3XCajN1+trp2rh7dGvDOgaV+uyD42Oer2j3tHRQ7069fhXAYxs0V27uyCjt0dv3727Vbdl5EsCRqq6tt5eJnhga1e1+ksA8rp1P0hI17uP33y+tPT5m49ndc0N6brz/hugeovNduaM7cz2t9KlIG0g+Hn9re3isG3LzBcDUmttd2w225bdUmnr6eJgyGJxhoLB4tOtUuluQN+x3dme+gUAXaoH66uvS9tOB4O8HSES2clAGs9bFEfbpNdHgH3Hk7oqQDfjsR0+/OiPpW3vOemgJYCUyB5TImUMOP+mnYC4OQATPDOrALq0AwMDnpF0aVGQBhU6FuZMcVM8HufCgAmTfLAIjPB4PAPalQHN+fr82hlpWzGNAognNxAslih+IzhOiZnFbdIZfX5+fvNKgDJJmaQ5VdqmCILVyGXCmpqxMNvHajDGBYNhiyJdmtpcViYZfxjQ0KDX66ulbUGaViITwcbfd4DIOS6On8AgTAjRlmC6tApmlumXA3LbdTrdu+ltO3mSV7rYqGbsr6Aul8f9fvmEPIFwKWOcfWebtESXp2tfDmjUdTXl7pYqQD9MRFlQDv1JLnfL5wUjoq4wIu0K6e7criZd41JAXlZvb++b0qM0yQcgeNj46N/lcoqiHPCi5hAsEVBy/FHpm73ZvfvylgCme69dq0xvDcYQ8mN90JXvfZHKpNxWSqDcIgLbQCAUsLSmV8quyaYXA/KyjIfunkiHBID/LPadklMvvioXBIdfoIRMgaLcIoF12VFQ0bbrrvFQVt4iwHSN11uTXhRSKjlC/P9gPGP4/A8CY40yjIAJmaINUBFKni5qrRn1yuoXAQqh8dxvVUDxu1jNnD4l7H1Ozqj8DIhoAyUSXFBQitaPvV5v4QPA+Raj0VhaFEKojx1zTIA+aAjMM3/8JrMtypgBAFZgAnYigrhQUanReKglZQGQlX3rVsup93iSdgEAkgd++w0q/+fPGcL+YWaYsX5DnpkwYYwlIFPFp1pu3crOWgCk9PbK7p8KIsRFcQQh6JmM1e+37n3ne8+ohsEE/yUDGCESWGJDAHWeOiaTyRYsqJndvHnz8Y+CPDKJEYAAgANg+aeb/vYbl9k8LCTiAOnEUehDJP3RE6AyWzMHqJSVl5eXHg3SkENIAUUJAlYZFlSvvfOqijEb3OCFmAwIr4YllHzw6FpdebnsygJgamqqtJiO8XHRgsxMrG8eNst/sulf7zMqK/yZSIXcDRaYeBQqLs2bmnpjdg6QW97QoC6FZQBV7JhwYxNAnxk2mz/d9P1fcX7QHxYzAUGYgHIMcLyitGxcXz4PqNNLJNq1CjvJsZGoKg4hEAWqL/raL3++05525JLf4BZwEOTboNI5DinWaiUSfd0cIE8vadYWd/IIEf40TuWIqralKS0nLQXOgl80yc5yZDgtDL+RS1GHO+JnCSilzrWTAMibA6TkNzdPHu+E/suykT6H6AEjGKyXnk17+dvf2m/AnxJpoOQRlYblMKC9uXk8ZR4wLmmePNHJkyTBanAdi0EEx83utJde3/9bJhHE+UJgEWfvPCFZDCiTSCS7Op1KpSmRxkQWzGahz3xkzUsvxM24mAQmUcysSYksT+4ClbJ5F2YbcnJyPut00rwr0QoEHEYIvBUy+dJPP/wEntgJWJE4ja4Y7+zcBSoNlXOAg3UVFRWvPOkkYS2JlShawJgFSKT85TWPPZsIgTC3HvsQCt3YlVGRUXdwfi1U9iQlvXLDicRCENcCJVj9qk8gDO6fffijF4YNKivD4CzijkByyHnjXlJSz+aFxVTX0dNz4GMnTyqJhcVg8FvBcTNl+c7r+7/r9hsWGgKh5Owf3DjQ09Ox/sFqPAc+PLIjRKKI2NDcmYlU4mo6yTz99pFEChI5wP1gxyOgcO5BP/AVarU5+3Z8gMiYaa6jQQvCngtCGmP4x1loT4m+qmFNiEP076q0Wm3hwQeAe1CYkv4dFgvPsQkn5NDTRAsiDPPDv7jnHYAq4nl6Rz9M195b1BP3VExKJvdtpIMIFiS2AccRL2uGusRQ7rePiF1ZNCBmt9AbsySTkxV7Fu8LHdU5OTP9G0MBMhaHrpboq7iiKAIev3/aLXb1MXCARKGN/TMwu2PJxpJ1LqOiomroKZpEJBHViAS3aMYYNv4xR0KfIBHHx9ZX4RDuWbo3Zk339PT0X+B5DgXiOA6O+V0R237y13hvJFyQJp6/cD8Jcpi1dG/0DV1MAhkCAkJ4dxpzJBAqv7gvntVAAv002mCnL6w/ADMvrl8G8KWch+F7F6/STgvi+xIbLAgRFh9haANX4XxA88kX7iX1JJ0/71sO8LVUHejJ6EhO5kMkB/2ZIDTgiMbfB//bwUb7TAi8C/FXknHVFrYQDwOuztZnZGQUXjkYoO0caScRkTgk4SMSBA+REUSTV64UwqT62au+hwG+odnp7oru+sp/Jtt5KDfEo3DEFOkzXU1DsRjiSJ5Prqmsr+hOrZ8d8q0E8O3JrZrOma6vq6mJ8JYCS4QkyQA+a5JchC6g+UhNzfmZ6emcqtw9vpUBvv5ydfVMo3Zf9uBgHypQYmWLEnoqUtIoeXAwG387o67b6FsN4BtKKWlvbG9vLJEZjYOuDUipLMCHtg2uwQljtvjVZEnKBd/qAF/8nK6hTK1uUDc03TLCGcDonfB6M73GmqbtMFqmbtAdW6rw8H3hWMoUHBhH4LVd19Qrg8PQG106/ZxMlSzXX+nGUlWy7vK62nVLBT5fvlzyZ9NDs1e6Mz1VqL48sFQ8A+tq1VWBFSavfGujP6tvrx3weGy2w/DjGRjQl9XfQCtOXf3eWHy8o36msbFRWz3d/YRi1Wlf6831/wXwH5gC7KdtkjI7AAAAAElFTkSuQmCC'
};

var xplorerDB = null;

var windowResizeTimeOut = null;
var windowRef = null;

var mapContainer = null;
var statusContainer = null;
var legendContainer = null;
var previewContainer = null;
var searchContainer = null;
var ikaCoreAddContainer = null;
var mapCanvas = null;

var dragMouseDown = false;
var dragPrevX = 0;
var dragPrevY = 0;

var allianceInput = null;
var playerInput = null;
var cityInput = null;
var playerStatusSelect = null;
var distanceSelect = null;
var luxuryResourceSelect = null;
var townHallLevelLowSelect = null;
var townHallLevelHighSelect = null;
var militaryScoreLowInput = null;
var militaryScoreHighInput = null;

var reportSelect = null;
var highlightInactiveCheckbox = null;
var highlightVacationCheckbox = null;
var updateButton = null;

var scanCenterXInput = null;
var scanCenterYInput = null;
var scanRangeInput = null;
var scanDelayMinInput = null;
var scanDelayMaxInput = null;
var rescanWaitTimeInput = null;

var ownIslands = [];
var selectedOwnCity = null;
var cities = [];
var alliances = [];
var players = [];
var islands = [];

var filterIndex = 0;
var filtersApplied = false;

var searchStore = [];
var searchStoreSelect = null;

var worldMapViewOriginalHandleMapData;

const HTML_ELEMENT =
{
	br:			'br',
	div:		'div',
	tbody: 		'tbody',
	tr:			'tr',
	th:			'th',
	td:			'td',
	img:		'img',
	button:		'input',
	a:			'a',
	h1:			'h1',
	h2:			'h2',
	h3:			'h3',
	h4:			'h4',
	h5:			'h5'
};

const ALLIANCE_COLOR =
{
	0: 			'green',
	1: 			'red',
	2:			'blue',
	3:			'olive',
	4:			'grey',
	5:			'yellow',
	6:			'aqua',
	7:			'purple',
	8:			'fuchsia',
	9:			'orange',
	10:			'orchid',
	11:			'peru',
	12:			'rosybrown',
	13:			'salmon',
	14:			'skyblue'
}

const ALLIANCE_TEXT_COLOR =
{
	0: 			'white',
	1: 			'white',
	2:			'white',
	3:			'white',
	4:			'white',
	5:			'black',
	6:			'black',
	7:			'white',
	8:			'white',
	9:			'white',
	10:			'white',
	11:			'white',
	12:			'white',
	13:			'white',
	14:			'white'
}

const REPORT_TYPE = {
	rtIslands: 			'Islands',
	rtIslandsGenerals: 	'Islands - Generals',
	rtIslandsScore: 	'Islands - Score',
	rtIslandsGold:		'Islands - Gold',
	rtPlayers: 			'Players',
	rtPlayersGenerals: 	'Players - Generals',
	rtPlayersScore: 	'Players - Score',
	rtPlayersGold:		'Players - Gold'
};

const REPORT_TYPE_INDEX = [
	REPORT_TYPE.rtIslands,
	REPORT_TYPE.rtIslandsGenerals,
	REPORT_TYPE.rtIslandsScore,
	REPORT_TYPE.rtIslandsGold,
	REPORT_TYPE.rtPlayers,
	REPORT_TYPE.rtPlayersGenerals,
	REPORT_TYPE.rtPlayersScore,
	REPORT_TYPE.rtPlayersGold
];

const PLAYER_STATUS_SELECT = {
	psAny:		'Any',
	psActive:	'Active',
	psVacation:	'Vacation',
	psInactive: 'Inactive'
};

const PLAYER_STATUS_SELECT_INDEX = [
	PLAYER_STATUS_SELECT.psAny,
	PLAYER_STATUS_SELECT.psActive,
	PLAYER_STATUS_SELECT.psVacation,
	PLAYER_STATUS_SELECT.psInactive
];

const LUXURY_RESOURCE_SELECT = {
	lrAny:		'Any',
	lrWine:		'Wine',
	lrMarble:	'Marble',
	lrCrystal: 	'Crystal',
	lrSulfur:	'Sulfur'
};

const LUXURY_RESOURCE_SELECT_INDEX = [
	LUXURY_RESOURCE_SELECT.lrAny,
	LUXURY_RESOURCE_SELECT.lrWine,
	LUXURY_RESOURCE_SELECT.lrMarble,
	LUXURY_RESOURCE_SELECT.lrCrystal,
	LUXURY_RESOURCE_SELECT.lrSulfur
];

const ISLAND_LUXURY = ['wine','sulphur', 'marble', 'crystal'];

const PLAYER_STATUS = {
	0:			'active',
	1:			'vacation',
	2:			'inactive'
};

/*
const ISLAND_LUXURY =
{
	0: 			'unknown',
	1: 			'wine',
	2:			'marble',
	3:			'crystal',
	4:			'sulfur'
}
*/

// remove multiple, leading or trailing spaces
function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}

// Array.unique( strict ) - Remove duplicate values (have to sort array before using)
Array.prototype.unique = function() {
	var result = [];
	for(i=0; i < this.length; i++ ) {
		if(i==0) result.push(this[i]);
		if((i>0) && (this[i].toCSVString().localeCompare(this[i-1].toCSVString()) != 0)) {
			result.push(this[i]);
		}
	}
	return result;
};

Array.prototype.removeById = function(id) {
	for(i=0; i < this.length; i++ ) {
		if(this[i].id == id) {
			this.splice(i,1);
			break;
		}
	}
}


function removeElementsByClassname(root, className, parent) {
	var elems = root.getElementsByClassName(className);
	while(elems.length > 0) {
		parent.removeChild(elems[0]);
	}
}

function stringToBoolean(str){
	return (str == 'true');
}


function sumArray(array) {
	var result = 0;
	for (var i in array) {
		if(typeof(array[i] == 'number')){result += array[i];}
	}
	return result;
}

function getTimestamp() {
	var currentTime = new Date();
	var year = currentTime.getFullYear();
	var month = currentTime.getMonth();
	var day = currentTime.getDay();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();
	var ts = year + '-';
	if(month < 10){ts = ts + '0' + month + '-';}
	else{ts = ts + month + '-';}
	if(day < 10){ts = ts + '0' + day + ' ';}
	else{ts = ts + day + ' ';}
	if(hours < 10){ts = ts + '0' + hours + ':';}
	else{ts = ts + hours + ':';}
	if(minutes < 10){ts = ts + '0' + minutes + ':';}
	else{ts = ts + minutes + ':';}
	if(seconds < 10){ts = ts + '0' + seconds;}
	else{ts = ts + seconds;}
	
	return ts;	
}


// Firebug console log
 function consoleLog(object){
	console.log(object);
	//if(consoleBackup){
	//	consoleBackup.log(object);
	//}
}

// Firebug console dir
 function consoleDir(object){
	console.dir(object);
}

// Firebug console time
function consoleTime(name){
	if (syslogLogLevel > 2)  {
		console.time(name);
	}	
}

// Firebug console timeEnd
function consoleTimeEnd(name){
	if (syslogLogLevel > 2)  {
		console.timeEnd(name);
	}	
}

// Generic syslog targeting Java and/or Firebug console 
function syslog(logMessage, logLevel){
	if(logLevel == null){
		logLevel = 4;	
	}
	var syslogMessage = getTimestamp() + ' ' + arguments.callee.caller.name + ' ("' + logMessage + '")';
	// log only if loglevel lower than globally set log level
 	if(logLevel <= syslogLogLevel){
 		// Log into Java Console if enabled
		if(syslogJavaConsoleEnabled){
			GM_log(syslogMessage);	
		}
		// Log into Firebug if enabled
		if(syslogFirebugEnabled){
			consoleLog(syslogMessage);
		}
	}
}

function intToString(num){
	return num + '';
}


function removeAllChildElements(item) {
	while(item.hasChildNodes()) {
		item.removeChild(item.firstChild);
	}
}

function xplorerSearchDiv() {
	result = document.createElement('div');
	result.setAttribute('class', 'xplorer_searchDiv');
	return result;
}

function xplorerSearchInputDiv(parent, caption, width, value, onKeyUp) {
	var div = xplorerSearchDiv();
	div.appendChild(xplorerCaption(caption));
	var input = xplorerInput();
	input.style.width = width;
	input.value = value;
	if(onKeyUp != '') input.addEventListener('keyup', onKeyUp, false);
	div.appendChild(input);
	parent.appendChild(div);
	return input;
}

function xplorerSearchSelectDiv(parent, caption, values, onChange) {
	var div = xplorerSearchDiv();
	div.appendChild(xplorerCaption(caption));
	var select = xplorerSelect();
	if(onChange != '') select.addEventListener('change', onChange, false);
	for(i=0; i < values.length; i++ ) {
		select.appendChild(new Option(values[i],i));
	}	
	div.appendChild(select);
	parent.appendChild(div);
	return select;
}

function xplorerButtonsDiv(buttonDefs) {
	var div = htmlDiv();
	div.style.clear = 'both';
	for (var i = 0; i < buttonDefs.length; i++) {
		var button = xplorerButton(buttonDefs[i].name);
		button.addEventListener('click', buttonDefs[i].onClick, false);
		div.appendChild(button);
	}
	return div;
}

function xplorerHeading(text) {
	result = document.createElement('div');
	result.style.clear = 'both';
	result.setAttribute('class', 'xplorer_heading');
	result.innerHTML = text;
	return result;
}

function xplorerCaption(text) {
	result = document.createElement('div');
	result.setAttribute('class', 'xplorer_caption');
	result.innerHTML = text;
	return result;
}

function xplorerButton(text) {
	result = document.createElement('input');
	result.setAttribute('class', 'xplorer_button');
	result.setAttribute('type', 'button');
	result.setAttribute('name', text);
	result.setAttribute('value', text);
	return result;
}

function xplorerInput() {
	result = document.createElement('input');
	result.setAttribute('class', 'xplorer_input');
	return result;
}

function xplorerSelect() {
	result = document.createElement("select");
	result.setAttribute('class', 'xplorer_select');
	return result;
}

function xplorerCheckbox() {
	result = document.createElement("input");
	result.setAttribute('class', 'xplorer_checkbox');
	result.setAttribute('type', 'checkbox');
	return result;
}
function xplorerLabel(text) {
	result = document.createElement("label");
	result.setAttribute('class', 'xplorer_label');
	result.textContent = text;
	return result;
}


function htmlElement(element, childElement){
	result = document.createElement(element);
	result.setAttribute('class', 'xplorer_' + element);
	if(childElement) {
		if(typeof childElement == "string") {
			result.innerHTML = childElement;
		}
		else {	
			result.appendChild(childElement);
		}
	}
	return result;
}

function htmlBr(childElement){
	return htmlElement(HTML_ELEMENT.br, childElement);
}

function htmlDiv(childElement){
	return htmlElement(HTML_ELEMENT.div, childElement);
}

function htmlH3(childElement){
	return htmlElement(HTML_ELEMENT.h4, childElement);
}

function htmlH4(childElement){
	return htmlElement(HTML_ELEMENT.h4, childElement);
}

function htmlH5(childElement){
	return htmlElement(HTML_ELEMENT.h5, childElement);
}

function htmlTableBody(childElement){
	return htmlElement(HTML_ELEMENT.tbody, childElement);
}

function htmlTableRow(childElement){
	return htmlElement(HTML_ELEMENT.tr, childElement);
}

function htmlTableHeaderCell(childElement) {
	return htmlElement(HTML_ELEMENT.th, childElement);
}

function htmlTableCell(childElement) {
	return htmlElement(HTML_ELEMENT.td, childElement);
}

function htmlImg(image, title, width, height){
	result = htmlElement(HTML_ELEMENT.img);
	result.setAttribute('src', image);
	if(title) result.setAttribute('title', title);
	if(width) result.setAttribute('width', width);
	if(height) result.setAttribute('height', height);
	return result;
}

function htmlButton(title){
	result = htmlElement(HTML_ELEMENT.button);
	if(title) {
		result.setAttribute('type', 'button');
		result.setAttribute('name', title);
		result.setAttribute('value', title);
	}
	return result;
}

function htmlAHref(url, childElement){
	result = htmlElement(HTML_ELEMENT.a, childElement);
	result.setAttribute('href', url);
	return result;
}

function getDomain(){
	return document.domain;
}

function formatTime(time, compact) {
	if (!compact) {
		var d = Math.floor(time / (60*24))
		var h = Math.floor((time-d*60*24) / 60);
		var m = Math.floor(time - 60*h - 60*24*d);
		// minutes are always present, days and hours omitted if zero
		return (d > 0? d+"d ":"")+(h > 0? h+"h ":"")+m+"m";
	}
	else {
		// compact format
		// if under a day -> show hours
		if (time < (24*60)) {return Math.round(time/60)+'h';}
		// show days
		else {return Math.round(time/60/24)+'d';}
	}
}

function $(id){
	return document.getElementById(id);
}

function getHrefParam(href, param) {
  param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexStr = "[\\?&]"+param+"=([^&#]*)";
  var regex = new RegExp( regexStr );
  var results = regex.exec(href);
  if( results == null )
    return "";
  else
    return results[1];
}

function getRequestParam(param) {
  return getHrefParam(window.location.href, param);
}

function ikariamGetServer() {
	var domain = getDomain();
	return domain.substring(domain.indexOf('.') + 1, domain.length);
}

function ikariamGetWorld() {
	var domain = getDomain();
	return domain.substring(1, domain.indexOf('.'));
}

function ikariamGetCurrentView(){
	var result = getRequestParam('view');
	if(!result) {
		result = getRequestParam('action');
	}
	return result;
}

function ikariamIsCurrentView(name){	
	var result = name.localeCompare(ikariamGetCurrentView())
	return (result == 0);
}

function ikariamIsAllyListView() {
	return (ikariamIsCurrentView('diplomacyAdvisorAlly') && (getRequestParam('listAllyMembers') == 1));
}

function ikariamIsIslandView() {
	return ($('island') != null);
}

function ikariamIsMilitaryMovementsView() {
	return ($('fleetMovements') != null);
}

function ikariamIsWorldMapView() {
	return ($('worldmap_iso') != null);
}


function ikariamScoreToNum(score) {
	return parseInt(trim(score.replace (/,/g, "")));
}

function ikariamParseCoordinatesFromString(str, coords) {
	coords.x = parseInt(str.substring(str.indexOf('[')+1, str.indexOf(':')));
	coords.y = parseInt(str.substring(str.indexOf(':')+1, str.indexOf(']')));
}

ikariamCalculateDistance = function(coordsA, coordsB) {
	return Math.sqrt(Math.pow(coordsA.x-coordsB.x,2)+Math.pow(coordsA.y-coordsB.y,2));
}

// travel time for transport ships
ikariamCalculateTravelTime = function(coordsA, coordsB) {
	var result = (1200/60) * ikariamCalculateDistance(coordsA, coordsB);
	if (result == 0) return 10;
	else return result;
}

ikariamTravelTimeAsString = function(coordsA, coordsB, compact) {
	return formatTime(ikariamCalculateTravelTime(coordsA, coordsB), compact);
}


/*
 *   Returns an array containing a list of own cities
 *   Reads the information from the city selection drop down
 *   so can be called from any view
  */
function ikariamGetOwnCities(){
	var result = [];
	
	try {
		var cityElements = unsafeWindow.dataSetForView.relatedCityData;
	}
	catch(e) {
		syslog('Error retrieving own cities: "' + e.description + '"', 1);
		return result;
	}

	for (key in cityElements) {
		if ((key == 'additionalInfo') || (key == 'selectedCity')) continue;
		var city = new mdbCity();
		city.island = new mdbIsland();
		city.id = parseInt(cityElements[key].id);
		city.name = cityElements[key].name;
		city.luxuryResource = parseInt(cityElements[key].trafeGood);
		city.selected = (key == cityElements.selectedCity);
		ikariamParseCoordinatesFromString(cityElements[key].coords, city.island.coords);
		city.relationship = cityElements[key].relationship;
		result.push(city);
	}
	return result;
}

function ikariamAllyListViewGetAllianceId() {
	return parseInt(getHrefParam($('allyinfo').getElementsByClassName('icon_msg')[0].getAttribute('href'), 'allyId'));
}

function ikariamAllyListViewGetAllianceInfo(alliance) {
	alliance.name = $('allyinfo').getElementsByTagName('td')[0].title; 
	alliance.longName = $('allyinfo').getElementsByTagName('td')[1].title; 
	alliance.lastUpdate = new Date().getTime();
}

function ikariamAllyListViewGetPlayerInfos() {
	var memberList = $('memberList');
	var playerInfsTmp1 = Array.prototype.slice.call(memberList.getElementsByClassName('default'));
	var playerInfsTmp2 = Array.prototype.slice.call(memberList.getElementsByClassName('alt'));
	return playerInfsTmp1.concat(playerInfsTmp2);
}

function ikariamAllyListViewGetPlayerId(playerInfo) {
	var sendMessageAction = playerInfo.getElementsByClassName('message')[0];
	if(sendMessageAction) {
		return parseInt(getHrefParam(playerInfo.getElementsByClassName('message')[0].getAttribute('href'), 'receiverId'));
	}
	// own information stored under id = 0 since real id is not available in this view
	else { 
		return 0;
	}
}

function ikariamAllyListViewGetPlayerInfo(playerInfo, player) {
	// player name
	player.name = playerInfo.childNodes[3].textContent;
	// player total score
	player.score = ikariamScoreToNum(playerInfo.childNodes[9].textContent);
	// player rank
	player.rank = playerInfo.childNodes[7].textContent;
	// online status -> sets both player.status and player.onlineStatus
	var lastOnlineText = playerInfo.childNodes[1].getAttribute('title');
	player.lastOnline = lastOnlineText.substring(lastOnlineText.indexOf(':')+2, lastOnlineText.length);
	player.onlineStatus = playerInfo.childNodes[1].getAttribute('class');
	switch(player.onlineStatus)	{
		case 'online': case 'offline':
			player.status = 'active';
			break;
		case 'inactive':
			player.status = 'inactive';
			break;
		case 'vacation':
			player.status = 'vacation';
			break;
	}
}

function ikariamAllyListViewGetCityInfos(playerInfo) {
	return playerInfo.getElementsByClassName('city');
}

function ikariamAllyListViewGetCityId(cityInfo) {
	var href = cityInfo.getAttribute('href');
	return parseInt(getHrefParam(href, 'selectCity'));
}

function ikariamAllyListViewGetCityInfo(cityInfo, city) {
	var cityText = cityInfo.textContent;
	city.name = cityText.substring(0, cityText.indexOf('[')-1);
}

function ikariamAllyListViewGetIslandId(cityInfo) {
	var href = cityInfo.getAttribute('href');
	return parseInt(getHrefParam(href, 'id'));
}

function ikariamAllyListViewGetIslandInfo(cityInfo, island) {
	ikariamParseCoordinatesFromString(cityInfo.textContent, island.coords)
	island.lastUpdate = new Date().getTime();
	island.setProcessLevel(2);
}


function ikariamIslandViewGetIslandId() {
	return parseInt(unsafeWindow.ikariam.backgroundView.screen.data.id);
}

function ikariamIslandViewGetIslandInfo(island) {
	var data = unsafeWindow.ikariam.backgroundView.screen.data;
	island.name = data.name;
	island.coords.x = parseInt(data.xCoord);
	island.coords.y = parseInt(data.yCoord);
	island.sawmillLevel = parseInt(data.resourceLevel);
	island.luxury = parseInt(data.tradegood);
	island.luxuryLevel = parseInt(data.tradegoodLevel);
	island.wonder = parseInt(data.wonder);
	island.wonderLevel = parseInt(data.wonderLevel);
	island.lastUpdate = new Date().getTime();
	island.setProcessLevel(3);
}

function ikariamIslandViewGetCityInfos() {
	return unsafeWindow.ikariam.backgroundView.screen.data.cities;
}

function ikariamIslandViewGetCityId(cityInfo) {
	return parseInt(cityInfo.id);
}

function ikariamIslandViewGetCityInfo(cityInfo, city) {
	city.name = cityInfo.name;
	// city townhall size
	city.townHallSize = parseInt(cityInfo.level);
	city.lastUpdate = new Date().getTime();
}

function ikariamIslandViewGetAllianceId(cityInfo) {
	return parseInt(cityInfo.ownerAllyId);
}

function ikariamIslandViewGetAllianceInfo(cityInfo, alliance) {
	if(cityInfo.ownerAllyId == 0) alliance.name = '-'
	else alliance.name = cityInfo.ownerAllyTag;
	alliance.lastUpdate = new Date().getTime();
}

function ikariamIslandViewGetPlayerId(cityInfo) {
	return parseInt(cityInfo.ownerId);
}

function ikariamIslandViewGetPlayerInfo(cityInfo, avatarScores, player) {
	player.name = cityInfo.ownerName;
	player.status = cityInfo.state;
	player.buildersScore = ikariamScoreToNum(avatarScores[player.id].building_score_main)/100;
	player.scientistScore = ikariamScoreToNum(avatarScores[player.id].research_score_main)/100;
	player.generals = ikariamScoreToNum(avatarScores[player.id].army_score_main)/100;
	player.gold = ikariamScoreToNum(avatarScores[player.id].trader_score_secondary);
	// this is now missing the number of citizens, could not find it anywhere
	player.score = player.buildersScore + player.scientistScore + player.generals;
	player.lastUpdate = new Date().getTime();
}

function ikariamMilitaryMovementsViewGetMovementInfos() {
	return $('fleetMovements').getElementsByClassName('locationEvents')[0].getElementsByTagName('tr');
}

function ikariamMilitaryMovementsViewGetMovementId(movementInfo) {
	return parseInt(movementInfo.getElementsByTagName('td')[1].id.substring(8));
}


function ikariamAllyListViewGetPlayerInfos() {
	var memberList = $('memberList');
	var playerInfsTmp1 = Array.prototype.slice.call(memberList.getElementsByClassName('default'));
	var playerInfsTmp2 = Array.prototype.slice.call(memberList.getElementsByClassName('alt'));
	return playerInfsTmp1.concat(playerInfsTmp2);
}

function ikariamWorldMapViewGetIslandInfo(islandInfo, island) {
	island.name = islandInfo[1];
	island.luxury = parseInt(islandInfo[2]);
	island.wonder = parseInt(islandInfo[3]);
	island.islandType = parseInt(islandInfo[5]);
	island.cityCount = parseInt(islandInfo[7]);
	// change 5.7.2015, do not modify lastUpdate when in worldmapview
	// island.lastUpdate = new Date().getTime();
	island.setProcessLevel(1);
}

function getArrayItemByID(array, id) {
	for (var i = 0; i < array.length; i++) {
		if(array[i].id == id) return array[i];
	}
	return null;
}

function getArrayItemByName(array, name) {
	for (var i = 0; i < array.length; i++) {
		if(array[i].name == name) return array[i];
	}
	return null;
}

function getArrayItemByCoordinates(array, x, y) {
	for (var i = 0; i < array.length; i++) {
		if((array[i].coords.x == x) && (array[i].coords.y == y)) return array[i];
	}
	return null;
}

function xplorerStoreMemberCities(memberCities) {
	var key = getDomain() + '.xplorerMemberCities';
	GM_setValue(key, uneval(memberCities));
}

function xplorerLoadMemberCities() {
	var key = getDomain() + '.xplorerMemberCities';
	return (eval(GM_getValue(key, '')));
}



//testing data types accurately in JavaScript (opposed to "typeof")
//from http://bonsaiden.github.com/JavaScript-Garden/
function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

function compareById(a, b) {
	if(is("Number", a) && is("Number", b)) {
		return a - b;
	}
	else {
		if(is("Object", a) && is("Number", b)) {
			return a.id - b;
		}
		else {
			return a.id - b.id;
		}
	}
}

function compareByName(a, b) {
	if(is("String", a) && is("String", b)) {
		return a.localeCompare(b);
	}
	else {
		if(is("Object", a) && is("String", b)) {
			return a.name.localeCompare(b);
		}
		else {
			return a.name.localeCompare(b.name);
		}
	}
}

function stringCompare(a, b, index) {
	if(is("String", a) && is("String", b)) {
		return a.localeCompare(b);
	}
	else {
		if(is("Object", a) && is("String", b)) {
			return a[index].localeCompare(b);
		}
		else {
			return a[index].localeCompare(b[index]);
		}
	}
}


/**************************************************** 
					sortedList
****************************************************/
function sortedList(compareFunction, indexProperty) {
	this.list = [];
	this.compareFunction = compareFunction;
	this.indexProperty = indexProperty;
}

sortedList.prototype.add = function(item) {
	var position = this.indexOf(item[this.indexProperty], true);
	this.list.splice(position, 0, item);
}

sortedList.prototype.toJSON = function() {
	var result = [];
	for (var i = 0; i < this.list.length; i++) {
		result.push(this.list[i].toJSON());
	}
	return result;
}

sortedList.prototype.indexOf = function(value, findNearest, compareFunction) {
	var compFunc;
	if(compareFunction) { compFunc = compareFunction;}
	else compFunc = this.compareFunction;
	var low = 0;
	var high = this.list.length - 1;
	var i, comparison;
	while (low <= high) {
		i = Math.floor((low + high) / 2);
		comparison = compFunc(this.list[i], value, this.indexProperty);
		if (comparison < 0) {
			low = i + 1; 
			continue
		}
		if (comparison > 0) {
			high = i - 1;
			continue;
		}
		return i;
	}
	// return nearest item (used internally when adding) if requested
	if (findNearest) return low;
	// otherwise no match
	return -1;
}

sortedList.prototype.find = function(value, findNearest, compareFunction) {
	return this.list[this.indexOf(value, findNearest, compareFunction)];
}

sortedList.prototype.filterString = function(value, valueAttribute, filterMatchAttribute, filterIndex, caseSensitive, subString) {
	var compValue = '';
	if(!caseSensitive) compValue = value.toLowerCase();
	else compValue = value;
	var compValues = compValue.split(" ");
	// the items contained in the list must have an attribute named with the value of valueAttribute
	// and they must have an array attribute named with the value of filterMatchAttribute
	for (var i = 0; i < this.list.length; i++) {
		var found = false;
		var itemValue = this.list[i][valueAttribute];
		if(!caseSensitive) itemValue = itemValue.toLowerCase();
		for (var j = 0; j < compValues.length; j++) {
			if((j > 0) && (compValues[j] == '')) continue;
			if(!subString) found = (itemValue == compValues[j]);
			else found = (itemValue.indexOf(compValues[j]) != -1);
			if (found) break;
		}
		this.list[i][filterMatchAttribute][filterIndex] = found;
	}
}



/**************************************************** 
					mdbCoordinates
****************************************************/
function mdbCoordinates() {
	this.x = 0;
	this.y = 0;
}

mdbCoordinates.prototype.asString = function() {
	return '[' + this.x + ':' + this.y + ']';
}

mdbCoordinates.prototype.isInRange = function(centerX, centerY, range) {
	return ((this.x >= (centerX-range)) && (this.x <= (centerX+range)) && (this.y >= (centerY-range)) && (this.y <= (centerY+range)));
}



/**************************************************** 
					mdbIsland
****************************************************/
function mdbIsland() {
	this.id = '';
	this.name = '';
	this.luxury = 0;
	this.coords = new mdbCoordinates();
	this.lastUpdate = 0;
	this.wonder = 0;
	this.wonderLevel = 0;
	this.sawmillLevel = 0;
	this.luxuryLevel = 0;
	this.cityCount = 0;
	this.processLevel = 0; // 1=world map view, 2=ally list view, 3=island view
	this.cities = [];
	this.islandBox = null;
	this.filterMatch = [true];
}

mdbIsland.prototype.setProcessLevel = function(processLevel) {
	if((processLevel > this.processLevel) || isNaN(this.processLevel)) this.processLevel = processLevel;
}

mdbIsland.prototype.toJSON = function() {
	var result = [];
	result.push(this.id, this.name, this.luxury, this.coords.x, this.coords.y, this.lastUpdate, this.wonder, this.wonderLevel, this.sawmillLevel, this.luxuryLevel, this.cityCount, this.processLevel);
	return result;
}

mdbIsland.prototype.fromJSON = function(json) {
	this.id 		= parseInt(json[0]);
	this.name 		= json[1];
	this.luxury		= json[2];
	this.coords.x 	= parseInt(json[3]);
	this.coords.y 	= parseInt(json[4]);
	this.lastUpdate = parseInt(json[5]);
	this.wonder 	= parseInt(json[6]);
	this.wonderLevel = parseInt(json[7]);
	this.sawmillLevel = parseInt(json[8]);
	this.luxuryLevel = parseInt(json[9]);
	this.cityCount = parseInt(json[10]);
	this.processLevel = parseInt(json[11]);
}

mdbIsland.prototype.filterMatches = function() {
	for (var i = 0; i < this.filterMatch.length; i++) {
		if (this.filterMatch[i]) return true;
	}
	return false;
}

mdbIsland.prototype.clearFilterMatch = function() {
	this.filterMatch = [];
}

// "Island";X-coordinate;Y-coordinate;"Luxury"
mdbIsland.prototype.toCSVString = function() {
	var result = '"' + this.name + '";';
	result += this.coords.x + ';';
	result += this.coords.y + ';';
	result += '"' + this.luxury + '";';
	return result;
}

mdbIsland.prototype.containsSelectedCity = function() {
	var result = false;
	for (var i = 0; i < this.cities.length; i++) {
		if(this.cities[i].selected) {
			result = true;
			break;
		}
	}
	return result;
}

mdbIsland.prototype.daysSinceLastUpdate = function() {
	return Math.floor((new Date().getTime() - this.lastUpdate)/(1000*60*60*24));
}

mdbIsland.prototype.citiesAsString = function() {
	var result = '';
	for (var i = 0; i < this.cities.length; i++) {
		result += this.cities[i].name;
		if(i < this.cities.length - 1) result += ', ';
	}
	return result;
}

mdbIsland.prototype.getRelationship = function() {
	var result = [];
	for (var i = 0; i < this.cities.length; i++) {
		var relationship = this.cities[i].relationship;
		if((relationship != '') && (result.indexOf(relationship) == -1)) result.push(relationship);
	}
	result.sort();
	return result;
}

mdbIsland.prototype.filter = function() {
	if(this.islandBox == null) return;
	// check filtering for the whole island
	var islandMatches = !filtersApplied;
	for (var i = 0; i < this.cities.length; i++) {
		var city = this.cities[i];
		if(city.filterMatches() && city.player.filterMatches() && city.player.alliance.filterMatches()) {
			islandMatches = true;
			break;
		}
	}
	// hide or show islandBox
	if(islandMatches) this.islandBox.style.visibility = 'visible';
	else this.islandBox.style.visibility = 'hidden';
}


mdbIsland.prototype.draw = function(alliances, parent, reportType, highlightInactive, highlightVacation) {
	// do not draw empty islands at all
	if(this.cityCount == 0) return;
	var containsInactive = false;
	var containsVacation = false;
				
	var valueScale = islandScale;
	var size = valueScale * mapScale;
		
	// to put larger boxes on the bottom...
	var zindex = (5000 - size);
	var left = mapXOffset + (this.coords.x*mapScaleRatio*mapScale/10)-Math.round(size/2);
	var top = mapYOffset + (this.coords.y*mapScaleRatio*mapScale/10)-Math.round(size/2);
	if (left < 0) left = 0;
	if (top < 0) top = 0;
	// color by lastUpdate
	/*
	var daysSinceLastUpdate = this.daysSinceLastUpdate();
	var color = 'Gray';
	if (daysSinceLastUpdate < 7) color = 'Green';
	else if (daysSinceLastUpdate < 30) color = "Orange";
	else color = "Red";
	if(this.processLevel != 3) color = 'Gray';
	*/
	// color by relationship
	var color = 'background-color: gray';
	var relationships = this.getRelationship().join();
	if(relationships != '') syslog(relationships);
	switch (relationships) {
		case 'ownCity':
			color = 'background-color: blue';
			break;
		case 'deployedCities':
			color = 'background-color: green';
			break;
		case 'occupiedCities':
			color = 'background-color: red';
			break;
		case 'deployedCities,ownCity':
			color = 'background: linear-gradient(to right, blue 50%, green 50%)';
			break;
		case 'occupiedCities,ownCity':
			color = 'background: linear-gradient(to right, blue 50%, red 50%)';
			break;
		case 'deployedCities,occupiedCities,ownCity':
			color = 'background: linear-gradient(to right, blue 34%, green 33%, red 33%)';
			break;
		case 'deployedCities,occupiedCities':
			color = 'background: linear-gradient(to right, green 50%, red 50%)';
			break;
	}
	if(this.processLevel != 3) color = 'background-color: LightGray';
	
	this.islandBox = htmlDiv();
	this.islandBox.setAttribute('class', 'mdbIsland');
	this.islandBox.setAttribute('id', this.id);
	this.islandBox.setAttribute('x', this.coords.x);
	this.islandBox.setAttribute('y', this.coords.y);
	this.islandBox.setAttribute('title', this.name + ' ' + this.coords.asString());
	this.islandBox.setAttribute('style', 'z-index:'+zindex+';opacity:.60; left:' + left + 'px; top:' + top + 'px; height:' + size + 'px; width:' + size + 'px;' + color);
	// #### Gradient example
	//this.islandBox.setAttribute('style', 'z-index:'+zindex+';opacity:.60; left:' + left + 'px; top:' + top + 'px; height:' + size + 'px; width:' + size + 'px; background: linear-gradient(to right, red 50%, green 50%)');
	/*
	// highligh inactive 
	if ((highlightInactive && containsInactive) || (highlightVacation && containsVacation)) {
		this.islandBox.style.border = '2px solid yellow';
	}
	*/
	this.islandBox.addEventListener('mouseover', onmdbIslandMouseOver, false);
	this.islandBox.addEventListener('click', onmdbIslandClick, false);
	// http://s2.nn.ikariam.com/index.php?currentIslandId=908&view=island&xcoord=33&ycoord=43&submit.x=0&submit.y=0
	this.islandBox.setAttribute('href', '?currentIslandId=' + this.id + '&view=island&xcoord=' + this.coords.x + '&ycoord=' + this.coords.y + '&submit.x=0&submit.y=0');
	parent.appendChild(this.islandBox);
}

function onmdbIslandMouseOver() {
	consoleTime('xplorer.onmdbIslandMouseOver');
	updatePreview(islands.find(parseInt(this.getAttribute('id'))));
	consoleTimeEnd('xplorer.onmdbIslandMouseOver');
}

function onmdbIslandClick(e) {
	// navigate the main (calling) browser window to chosen city's island view
	window.location = this.getAttribute('href');	
}

mdbIsland.prototype.preview = function(parent) {
	// Table body
	var tblBody = htmlTableBody();
	// Header row
	var tblHeader = htmlTableRow();
	tblHeader.appendChild(htmlTableHeaderCell('Player'));
	tblHeader.appendChild(htmlTableHeaderCell('Status'));
	tblHeader.appendChild(htmlTableHeaderCell('Alliance'));
	tblHeader.appendChild(htmlTableHeaderCell('Generals'));
	tblHeader.appendChild(htmlTableHeaderCell('Score'));
	tblHeader.appendChild(htmlTableHeaderCell('Gold'));
	tblHeader.appendChild(htmlTableHeaderCell('City'));
	tblHeader.appendChild(htmlTableHeaderCell('TH'));
	tblHeader.appendChild(htmlTableHeaderCell('Luxury'));
	//tblHeader.appendChild(htmlTableHeaderCell('fCity'));
	//tblHeader.appendChild(htmlTableHeaderCell('fPlayer'));
	//tblHeader.appendChild(htmlTableHeaderCell('fAlliance'));
	tblBody.appendChild(tblHeader);
	for (var i = 0; i < this.cities.length; i++) {
		var tr = htmlTableRow();
		var city = this.cities[i];
		if(!city.filterMatches() || !city.player.filterMatches() || !city.player.alliance.filterMatches()) continue;
		tr.appendChild(htmlTableCell(city.player.name));
		tr.appendChild(htmlTableCell(city.player.status));
		tr.appendChild(htmlTableCell(city.player.alliance.name));
		tr.appendChild(htmlTableCell(intToString(city.player.generals)));
		tr.appendChild(htmlTableCell(intToString(city.player.score)));
		tr.appendChild(htmlTableCell(intToString(city.player.gold)));
		// eg. http://s1.nn.ikariam.com/index.php?view=island&cityId=90272
		var cityLink = htmlAHref('?view=island&cityId=' + city.id, this.cities[i].name);
		cityLink.addEventListener('click', onCityLinkClick, false);
		tr.appendChild(htmlTableCell(cityLink));
		tr.appendChild(htmlTableCell(intToString(city.townHallSize)));
		tr.appendChild(htmlTableCell(intToString(this.luxury)));
		/*
		tr.appendChild(htmlTableCell(city.filterMatches().toString()));
		tr.appendChild(htmlTableCell(city.player.filterMatches().toString()));
		tr.appendChild(htmlTableCell(city.player.alliance.filterMatches().toString()));
		*/
		tblBody.appendChild(tr);
	}
	parent.appendChild(tblBody);
}

function onCityLinkClick(e) {
	// navigate the main (calling) browser window to chosen city's island view
	window.location = this.href;
	// prevent loading the page to the map window
	e.preventDefault();
}

mdbIsland.prototype.getPreviewHeading = function() {
	return this.name + ' ' + this.coords.asString() + ' ' + ikariamTravelTimeAsString(this.coords, selectedOwnCity.island.coords, false) + ' (' + this.daysSinceLastUpdate() + ' days)';
}



/**************************************************** 
					mdbAlliance
****************************************************/
function mdbAlliance() {
	this.id = 0;
	this.name = '';
	this.longName ='';
	this.lastUpdate = 0;
	this.players = [];
	this.filterMatch = [true];
}

mdbAlliance.prototype.toJSON = function() {
	var result = [];
	result.push(this.id, this.name, this.longName, this.lastUpdate);
	return result;
}

mdbAlliance.prototype.fromJSON = function(json) {
	this.id 		= parseInt(json[0]);
	this.name 		= json[1];
	this.longName 	= json[2];
	this.lastUpdate = parseInt(json[3]);
}

mdbAlliance.prototype.filterMatches = function() {
	for (var i = 0; i < this.filterMatch.length; i++) {
		if (this.filterMatch[i]) return true;
	}
	return false;
}

mdbAlliance.prototype.clearFilterMatch = function() {
	this.filterMatch = [];
}



/**************************************************** 
					mdbPlayer
****************************************************/
function mdbPlayer() {
	this.id = 0;
	this.name = '';
	this.status ='';
	this.lastOnline ='';
	this.onlineStatus ='';
	this.allianceId = 0;
	this.alliance = null;
	this.score = 0;
	this.gold = 0;
	this.generals = 0;
	this.buildersScore = 0;
	this.scientistScore = 0;
	this.lastUpdate = 0;
	this.attackScore = 0;
	this.defenceScore = 0;
	this.cities = [];
	this.filterMatch = [true];
}

mdbPlayer.prototype.toJSON = function() {
	var result = [];
	result.push(this.id, this.name, this.status, this.lastOnline, this.onlineStatus, this.allianceId, this.score, this.gold, this.generals, this.buildersScore, this.scientistScore, this.lastUpdate, this.attackScore, this.defenceScore);
	return result;
}

mdbPlayer.prototype.fromJSON = function(json) {
	this.id = 				parseInt(json[0]);
	this.name = 			json[1];
	this.status = 			json[2];
	this.lastOnline = 		json[3];
	this.onlineStatus = 	json[4];
	this.allianceId = 		parseInt(json[5]);
	this.score = 			parseInt(json[6]);
	this.gold = 			parseInt(json[7]);
	this.generals = 		parseInt(json[8]);
	this.buildersScore =	parseInt(json[9]);
	this.scientistScore = 	parseInt(json[10]);
	this.lastUpdate =		parseInt(json[11]);
	this.attackScore = 		parseInt(json[12]);
	this.defenceScore = 	parseInt(json[13]);
}

mdbPlayer.prototype.filterMatches = function() {
	//if (this.filterMatch == []) return true;
	for (var i = 0; i < this.filterMatch.length; i++) {
		if (this.filterMatch[i]) return true;
	}
	return false;
}

mdbPlayer.prototype.clearFilterMatch = function() {
	this.filterMatch = [];
}

mdbPlayer.prototype.setAlliance = function(alliance) {
	this.alliance = alliance;
	this.allianceId = alliance.id;
}

// "Player";"Alliance";"Status";"Score";"Generals";"Gold";
mdbPlayer.prototype.toCSVString = function() {
	var result = '"' + this.name + '";';
	result += '"' + this.alliance + '";';
	result += '"' + this.status + '";';
	result += this.score + ';';
	result += this.generals + ';';
	result += this.gold + ';';
	return result;
}

mdbPlayer.prototype.getCenterOfCities = function() {
	var result = new mdbCoordinates();
	for (var i = 0; i < this.cities.length; i++) {
		result.x = result.x + parseInt(this.cities[i].island.coords.x);
		result.y = result.y + parseInt(this.cities[i].island.coords.y);
	}
	result.x = Math.round(result.x / this.cities.length);
	result.y = Math.round(result.y / this.cities.length);
	return result;
}

mdbPlayer.prototype.draw = function(alliances, parent, reportType, highlightInactive, highlightVacation) {
	var isInactive = false;
	var isOnVacation = false;
	var valueScale = 0;
	if(this.status == 'inactive') isInactive = true;
	if(this.status == 'vacation') isOnVacation = true;
	var playerValue = 0;
	switch (reportType)	{
		case REPORT_TYPE.rtPlayers:
		  playerValue = 1;
		  valueScale = playerScale;
		  break;
		case REPORT_TYPE.rtPlayersGenerals:
		  playerValue = this.generals;
		  valueScale = generalsScorePlayerScale;
		  break;
		case REPORT_TYPE.rtPlayersScore:
		  playerValue = this.score;
		  valueScale = totalScorePlayerScale;
		  break;
		case REPORT_TYPE.rtPlayersGold:
		  playerValue = this.gold;
		  valueScale = goldPlayerScale;
		  break;
		default:
		  syslog('mdbPlayer: Unknown report type ' + reportType);
		  return;
	}
	if(reportType == REPORT_TYPE.rtPlayers) var size = playerValue*valueScale*mapScale
	else var size = Math.round(Math.sqrt(playerValue/valueScale))*mapScale;
	// to put larger boxed on the bottom...
	var zindex = (5000 - size);
	// use the average of city mdbCoordinates as the reporting center
	var coords = this.getCenterOfCities();
	var left = mapXOffset + (coords.x*mapScaleRatio*mapScale/10)-Math.round(size/2);
	var top = mapYOffset + (coords.y*mapScaleRatio*mapScale/10)-Math.round(size/2);
	if (left < 0) left = 0;
	if (top < 0) top = 0;
	var color = ALLIANCE_COLOR[alliances.indexOf(this.alliance.id)];
	if(!color) color = 'Gray';
	var playerBox = htmlDiv();
	playerBox.setAttribute('class', 'mdbPlayer');
	playerBox.setAttribute('id', this.name);
	playerBox.setAttribute('title', this.name + ' ' + coords.asString());
	playerBox.setAttribute('style', 'z-index:'+zindex+';opacity:.60; left:' + left + 'px; top:' + top + 'px; height:' + size + 'px; width:' + size + 'px; background-color:' + color);
	// highligh inactive 
	if ((highlightInactive && isInactive) || (highlightVacation && isOnVacation)) {
		playerBox.style.border = '2px solid yellow';
	}
	playerBox.addEventListener('mouseover', onmdbPlayerMouseOver, false);
	parent.appendChild(playerBox);
}

function onmdbPlayerMouseOver() {
	updatePreview(players.find(this.getAttribute('id')));
}

mdbPlayer.prototype.preview = function(parent) {
	// Table body
	var tblBody = htmlTableBody();
	// Header row for player info
	var tblHeader = htmlTableRow();
	tblHeader.appendChild(htmlTableHeaderCell('Player'));
	tblHeader.appendChild(htmlTableHeaderCell('Status'));
	tblHeader.appendChild(htmlTableHeaderCell('Alliance'));
	tblHeader.appendChild(htmlTableHeaderCell('Generals'));
	tblHeader.appendChild(htmlTableHeaderCell('Score'));
	tblHeader.appendChild(htmlTableHeaderCell('Gold'));
	tblBody.appendChild(tblHeader);
	// Player info content
	var tr = htmlTableRow();
	tr.appendChild(htmlTableCell(this.name));
	tr.appendChild(htmlTableCell(this.status));
	tr.appendChild(htmlTableCell(this.alliance));
	tr.appendChild(htmlTableCell(intToString(this.generals)));
	tr.appendChild(htmlTableCell(intToString(this.score)));
	tr.appendChild(htmlTableCell(intToString(this.gold)));
	tblBody.appendChild(tr);
	// Header row for city information
	var tblHeader = htmlTableRow();
	tblHeader.appendChild(htmlTableHeaderCell('City'));
	tblHeader.appendChild(htmlTableHeaderCell('TH'));
	tblHeader.appendChild(htmlTableHeaderCell('Island'));
	tblHeader.appendChild(htmlTableHeaderCell('Travel'));
	tblBody.appendChild(tblHeader);
	// City info content
	for (var i = 0; i < this.cities.length; i++) {
		var city = this.cities[i];
		var tr = htmlTableRow();
		var cityLink = htmlAHref('?view=island&cityId=' + city.id, city.name);
		cityLink.addEventListener('click', onCityLinkClick, false);
		tr.appendChild(htmlTableCell(cityLink));
		tr.appendChild(htmlTableCell(intToString(city.townHallSize)));
		tr.appendChild(htmlTableCell(city.island.name + ' ' + city.island.coords.asString()));
		var travelTime = ikariamTravelTimeAsString(city.island.coords, selectedOwnCity.island.coords, false);
		tr.appendChild(htmlTableCell(travelTime));
		tblBody.appendChild(tr);
	}
	parent.appendChild(tblBody);
}

mdbPlayer.prototype.getPreviewHeading = function() {
	return this.name + ' ' + this.getCenterOfCities().asString() + ' ' + ikariamTravelTimeAsString(this.getCenterOfCities(), selectedOwnCity.island.coords, false);
}

// Compare function for player sorting
function mdbPlayerCompareByGenerals(a,b) {
	return (b.generals - a.generals);
}

// Compare function for city sorting (city name)
function mdbCityCompareByName(a,b) {
	return a.name.localeCompare(b);
}

// Compare function for city sorting (player name)
function mdbCityCompareByPlayerName(a,b) {
	return a.player.name.localeCompare(b.player.name);
}

// Compare function for city sorting (player generals)
function mdbCityCompareByPlayerGenerals(a,b) {
	return (b.player.generals - a.player.generals);
}



/**************************************************** 
					mdbCity
****************************************************/
function mdbCity() {
	this.id = '';
	this.name = '';
	this.townHallSize = 0;
	this.playerId = 0;
	this.player = null;
	this.islandId = 0;
	this.island = null;
	this.selected = false;
	this.lastUpdate = 0;
	this.wallLevel = 0;
	this.warehouseLevel = 0;
	this.relationship = '';
	this.filterMatch = [true];
}

mdbCity.prototype.toJSON = function() {
	var result = [];
	result.push(this.id, this.name, this.townHallSize, this.playerId, this.islandId, this.lastUpdate, this.wallLevel, this.warehouseLevel);
	return result;
}

mdbCity.prototype.fromJSON = function(json) {
	this.id 			= parseInt(json[0]);
	this.name 			= json[1];
	this.townHallSize 	= parseInt(json[2]);
	this.playerId		= parseInt(json[3]);
	this.islandId		= parseInt(json[4]);
	this.lastUpdate		= parseInt(json[5]);
	this.wallLevel		= parseInt(json[6]);
	this.warehouseLevel = parseInt(json[7]);
}

mdbCity.prototype.filterMatches = function() {
	for (var i = 0; i < this.filterMatch.length; i++) {
		if (this.filterMatch[i]) {
			return true;
		}
	}
	return false;
}

mdbCity.prototype.clearFilterMatch = function() {
	this.filterMatch = [];
}

mdbCity.prototype.setPlayer = function(player) {
	this.player = player;
	this.playerId = player.id;
}

mdbCity.prototype.setIsland = function(island) {
	this.island = island;
	this.islandId = island.id;
}

mdbCity.prototype.toThetaAtiensString = function() {
	// format is "// TARGET=alliance,player,city,x-coordinate,y-coordinate,enemy"
	var result = '// TARGET=';
	result = result + this.player.alliance.name + ',';
	result = result + this.player.name + ',';
	result = result + this.name + ',';
	result = result + this.island.coords.x + ',';
	result = result + this.island.coords.y + ',';
	result = result + 'enemy';
	return result;
}

// "Name";TownHallSize;IslandCSVString;PlayerCSVString;
mdbCity.prototype.toCSVString = function() {
	var result = '"' + this.name + '";';
	result += this.townHallSize + ';';
	result += this.island.toCSVString();
	result += this.player.toCSVString();
	return result;
}



/**************************************************** 
					mapDB
****************************************************/
function mapDB() {
	this.version = mapDBVersion;
	this.keyRoot = getDomain() + '.' + mapDBKey + '.' + this.version;
	this.alliances = new sortedList(compareById, 'id');
	this.players = new sortedList(compareById, 'id');
	this.islands = new sortedList(compareById, 'id');
	this.cities = new sortedList(compareById, 'id');
}

mapDB.prototype.save = function() {
	syslog('mapDB.save started', 3);
	GM_setValue(this.keyRoot + '.alliances', uneval(this.alliances.toJSON()));
	GM_setValue(this.keyRoot + '.players', uneval(this.players.toJSON()));
	GM_setValue(this.keyRoot + '.islands', uneval(this.islands.toJSON()));
	GM_setValue(this.keyRoot + '.cities', uneval(this.cities.toJSON()));
	syslog('mapDB.save finished', 3);
}

mapDB.prototype.load = function() {
	syslog('mapDB.load started', 3);
	this.alliances.list = [];
	this.players.list = [];
	this.islands.list = [];
	this.cities.list = [];
	var alliances = eval(GM_getValue(this.keyRoot + '.alliances', ''));
	if(alliances) {
		for (i = 0; i < alliances.length; i++ ) {
			var alliance = new mdbAlliance();
			alliance.fromJSON(alliances[i]);
			this.alliances.list.push(alliance); //
		}
	}
	var players = eval(GM_getValue(this.keyRoot + '.players', ''));
	if (players) {
		for (i = 0; i < players.length; i++ ) {
			var player = new mdbPlayer();
			player.fromJSON(players[i]);
			this.players.list.push(player);
			player.setAlliance(this.alliances.find(player.allianceId));
			player.alliance.players.push(player);
		}
	}
	var islands = eval(GM_getValue(this.keyRoot + '.islands', ''));
	if (islands) {
		for (i = 0; i < islands.length; i++ ) {
			var island = new mdbIsland();
			island.fromJSON(islands[i]);
			this.islands.list.push(island);
		}
	}
	var cities = eval(GM_getValue(this.keyRoot + '.cities', ''));
	if (cities) {
		for (i = 0; i < cities.length; i++ ) {
			var city = new mdbCity();
			city.fromJSON(cities[i]);
			this.cities.list.push(city);
			city.setPlayer(this.players.find(city.playerId));
			city.player.cities.push(city);
			city.setIsland(this.islands.find(city.islandId));
			city.island.cities.push(city);
		}
	}
	syslog('mapDB.load finished', 3);
}

mapDB.prototype.addAlliance = function(allianceId) {
	var alliance = new mdbAlliance();
	alliance.id = allianceId;
	this.alliances.add(alliance);
	return alliance;
}

mapDB.prototype.addPlayer = function(playerId, alliance) {
	var player = new mdbPlayer();
	player.id = playerId;
	player.setAlliance(alliance);
	this.players.add(player);
	alliance.players.push(player);
	return player;
}

mapDB.prototype.addIsland = function(islandId) {
	var island = new mdbIsland();
	island.id = islandId;
	this.islands.add(island);
	return island;
}

mapDB.prototype.addCity = function(cityId, player, island) {
	var city = new mdbCity();
	city.id = cityId;
	city.setPlayer(player);
	city.setIsland(island);
	this.cities.add(city);
	island.cities.push(city);
	player.cities.push(city);
	return city;
}

// Added 5.7.2015
mapDB.prototype.moveCity = function(city, newIsland) {
	syslog('moveCity started');
	// find the old island and remove city from it
	var oldIsland = this.islands.find(city.islandId);
	oldIsland.cities.removeById(city.id);
	city.setIsland(newIsland);
	newIsland.cities.push(city);
	syslog('moveCity finished');
	return true;
}

// Added 7.7.2015
mapDB.prototype.movePlayer = function(player, newAlliance) {
	syslog('movePayer started');
	// find the old alliance and remove player from it
	var oldAlliance = this.alliances.find(player.allianceId);
	oldAlliance.players.removeById(player.id);
	player.setAlliance(newAlliance);
	newAlliance.players.push(player);
	syslog('movePlayer finished');
	return true;
}


/**************************************************** 
					xplorer
****************************************************/
function xplorer() {
	this.db = new mapDB();
	xplorerDB = this.db;
}

xplorer.prototype.init = function() {
	consoleTime('xplorer.init');
	syslog('xplorer.init', 2);
	// add icon
	var button = htmlImg(IMAGES.xplorer, 64,64);
	button.setAttribute('style', 'position: absolute; top: 55px; left: 640px; cursor: pointer');
	button.setAttribute('title', 'Ikariam Xplorer');
	button.addEventListener('click', xplorerOnClickHandler, false);
	var header = document.getElementById('GF_toolbar');
	header.appendChild(button);
	syslog('xplorer.init finished', 2);
	consoleTimeEnd('xplorer.init');
}

xplorer.prototype.processViews = function() {
	consoleTime('xplorer.processViews');
	syslog('xplorer.processViews', 2);
	
	/*
	if (ikariamIsAllyListView()) {
		consoleTime('xplorer.ProcessAllyList');
		processAllyList();
		consoleTimeEnd('xplorer.ProcessAllyList');
	}
	*/

	if (ikariamIsIslandView()) {
		consoleTime('xplorer.processIslandView');
		setTimeout(function() {processIslandView();}, 0);
		consoleTimeEnd('xplorer.processIslandView');
	}

	/*
	if (ikariamIsMilitaryMovementsView()) {
		consoleTime('xplorer.processMilitaryMovementsView');
		processMilitaryMovementsView();
		consoleTimeEnd('xplorer.processMilitaryMovementsView');
	}
	*/
	
	if (ikariamIsWorldMapView()) {
		consoleTime('xplorer.processWorldMapView');
		initWorldMapView();
		setTimeout(function() {processWorldMapView();}, 0);
		consoleTimeEnd('xplorer.processWorldMapView');
	}
	
	syslog('xplorer.processViews finished', 2);
	consoleTimeEnd('xplorer.processViews');
}




function liveFilter() {
	consoleTime('xplorer.liveFilter');
	
	// check if any filter is applied 
	// #### add all the filter inputs/selects
	filtersApplied = ((allianceInput.value != '') || (playerInput.value != '') || (cityInput.value != ''));
	
	//filter map
	filterMap()
	
	// update legend
	updateLegend(alliances);
	
	// update status
	var searchStatus = 'Filtering finished at ' + getTimestamp();
	updateStatus(alliances, players, islands, cities, searchStatus);
	consoleTimeEnd('xplorer.liveFilter');
}

function filterMap() {
	for (var i = 0; i < islands.list.length; i++) { 
		islands.list[i].filter();
	}
}

function drawMap() {
	syslog('drawMap started', 3);

	// first clear the old elements from the map
	removeElementsByClassname(windowRef.document, 'mdbIsland', mapContainer);
	removeElementsByClassname(windowRef.document, 'mdbPlayer', mapContainer);
	removeElementsByClassname(windowRef.document, 'ownmdbIsland', mapContainer);
	
	// then draw all the islands
	for (var i = 0; i < islands.list.length; i++) { 
		islands.list[i].draw(alliances, mapContainer, null, highlightInactiveCheckbox.checked, highlightVacationCheckbox.checked);
	}
	
	// and finally apply any potential filters
	filterMap();
	
	/* all this is disabled for now
	
	// draw own islands
	drawOwnIslands(mapContainer);
	
	// draw the data to the map
	var reportType = REPORT_TYPE_INDEX[parseInt(reportSelect.options[reportSelect.selectedIndex].value)];
	switch (reportType) {
		case REPORT_TYPE.rtIslands: case REPORT_TYPE.rtIslandsGenerals: case REPORT_TYPE.rtIslandsScore: case REPORT_TYPE.rtIslandsGold: 
			for (var i = 0; i < islands.list.length; i++) { 
				islands.list[i].draw(alliances, mapContainer, reportType, highlightInactiveCheckbox.checked, highlightVacationCheckbox.checked);
			}
			break;
		// TODO player based views need to be updated
		case REPORT_TYPE.rtPlayers: case REPORT_TYPE.rtPlayersGenerals: case REPORT_TYPE.rtPlayersScore: case REPORT_TYPE.rtPlayersGold: 
			for (var i = 0; i < players.list.length; i++) { 
				players.list[i].draw(alliances, mapContainer, reportType, highlightInactiveCheckbox.checked, highlightVacationCheckbox.checked);
			}
			break;

		default: 
			syslog('drawMap: Unknown report type ' + reportType);
			break;
	}
	*/
	syslog('drawMap finished', 3);
}


// #### do we need this any more? Own islands should be highlighted when drawing normal islands
function drawOwnIslands(parent) {

	/*
	for (var i = 0; i < ownIslands.length; i++) {
		var island = ownIslands[i];
		var size = (islandScale-1)*mapScale
		// own islands on the bottom
		var zindex = 5000;
		// use the average of city mdbCoordinates as the reporting center
		var coords = island.coords;
		var left = mapXOffset + (coords.x*mapScaleRatio*mapScale/10)-Math.round(size/2);
		var top = mapYOffset + (coords.y*mapScaleRatio*mapScale/10)-Math.round(size/2);
		if (left < 0) left = 0;
		if (top < 0) top = 0;
		var color = 'black';
		var ownIslandBox = htmlDiv();
		ownIslandBox.setAttribute('class', 'ownmdbIsland');
		ownIslandBox.setAttribute('id', island.name);
		ownIslandBox.setAttribute('title', island.citiesAsString() + ' ' + island.coords.asString());
		ownIslandBox.setAttribute('style', 'z-index:'+zindex+';opacity:.60; left:' + left + 'px; top:' + top + 'px; height:' + size + 'px; width:' + size + 'px; background-color:' + color);
		// highligh selected one
		if (island.containsSelectedCity()) {
			ownIslandBox.style.border = '2px solid red';
		}
		parent.appendChild(ownIslandBox);
	}
	*/
}

xplorerOnClickHandler = function() {
	displayMapWindow();
}


function updatePreview(item) {
	removeAllChildElements(previewContainer);
	previewContainer.appendChild(xplorerHeading('Preview - ' + item.getPreviewHeading()));
	item.preview(previewContainer);
}

function updateLegend(alliances) {
	removeAllChildElements(legendContainer);
	var tblBody = htmlTableBody();
	var tblHeader = htmlTableRow();
	for (var i = 0; i < alliances.list.length; i++) {
		var th = htmlTableHeaderCell(alliances.list[i].name);
		th.setAttribute('style', 'opacity:0.8;background:none;background-color:'+ ALLIANCE_COLOR[i] + ';color:' +  ALLIANCE_TEXT_COLOR[i]);
		tblHeader.appendChild(th);
	}
	tblBody.appendChild(tblHeader);
	legendContainer.appendChild(tblBody);
}

function updateStatus(alliances, players, islands, cities, searchStatus) {
	removeAllChildElements(statusContainer);
	var tblBody = htmlTableBody();
	var tblHeader = htmlTableRow();
	tblHeader.appendChild(htmlTableHeaderCell('Server/world: ' + ikariamGetServer() + '/' + ikariamGetWorld()));
	tblHeader.appendChild(htmlTableHeaderCell('Alliances: ' + alliances.list.length));
	tblHeader.appendChild(htmlTableHeaderCell('Players: ' + players.list.length));
	tblHeader.appendChild(htmlTableHeaderCell('Islands: ' + islands.list.length));
	tblHeader.appendChild(htmlTableHeaderCell('Cities: ' + cities.list.length));
	tblHeader.appendChild(htmlTableHeaderCell('Zoom: ' + mapScale));
	tblHeader.appendChild(htmlTableHeaderCell('Status: ' + searchStatus));
	tblBody.appendChild(tblHeader);
	statusContainer.appendChild(tblBody);
}


function createSearchContainer(parent) {
	var result = htmlDiv();
	result.setAttribute('class', 'searchContainer');
	result.setAttribute('style', 'display:none');
	parent.appendChild(result);

	// Filter
	result.appendChild(xplorerHeading('Filter'));
	allianceInput = xplorerSearchInputDiv(result, 'Alliance', '90px', '', onAllianceInputKeyUp);
	playerInput = xplorerSearchInputDiv(result, 'Player', '90px', '', onPlayerInputKeyUp);
	cityInput = xplorerSearchInputDiv(result, 'City', '90px', '', onCityInputKeyUp);
	/*
	playerStatusSelect = xplorerSearchSelectDiv(result, 'Status',  PLAYER_STATUS_SELECT_INDEX, onSelectChange);
	var distanceValues = [];
	for(i=1; i < 100; i++ ) distanceValues.push(i);
	distanceSelect = xplorerSearchSelectDiv(result, 'Distance',  distanceValues, onSelectChange);
	luxuryResourceSelect = xplorerSearchSelectDiv(result, 'Luxury',  LUXURY_RESOURCE_SELECT_INDEX, onSelectChange);
	*/
	// Town hall size drop down (distanceSelect as global var)
	/*
	var townHallLevelDiv = xplorerSearchDiv();
	townHallLevelDiv.appendChild(xplorerCaption('Townhall size'));
	townHallLevelLowSelect = xplorerSelect();
	townHallLevelLowSelect.appendChild(new Option('Any',0));
	for(i=1; i < 41; i++ ) {
		townHallLevelLowSelect.appendChild(new Option(i,i));
	}
	townHallLevelDiv.appendChild(townHallLevelLowSelect);
	townHallLevelHighSelect = xplorerSelect();
	townHallLevelHighSelect.appendChild(new Option('Any',0));
	for(i=1; i < 41; i++ ) {
		townHallLevelHighSelect.appendChild(new Option(i,i));
	}
	townHallLevelDiv.appendChild(townHallLevelHighSelect);
	result.appendChild(townHallLevelDiv);
	
	
	// Military score input min-max (input fields are stored in a global variable)
	var militaryScoreDiv = xplorerSearchDiv();
	militaryScoreDiv.appendChild(xplorerCaption('Military score'));
	militaryScoreLowInput = xplorerInput();
	militaryScoreLowInput.style.width = '40px';
	militaryScoreDiv.appendChild(militaryScoreLowInput);
	militaryScoreHighInput = xplorerInput();
	militaryScoreHighInput.style.width = '40px';
	militaryScoreDiv.appendChild(militaryScoreHighInput);
	result.appendChild(militaryScoreDiv);
*/
	
	// #### buttons hidden for now (no use)
	/*
	var searchButtonDefs = [{name: 'Search', onClick: onSearchClick}, {name:'Clear map', onClick: onClearMapClick}, {name: 'Export', onClick: onExportClick}];
	result.appendChild(xplorerButtonsDiv(searchButtonDefs));
	*/
	
	// Map settings
	result.appendChild(xplorerHeading('Map settings'));
	// Zoom buttons
	result.appendChild(xplorerLabel('Zoom'));
	var zoomInButton = xplorerButton('+');
	zoomInButton.addEventListener('click', onZoomInClick, false);
	result.appendChild(zoomInButton);
	var zoomOutButton = xplorerButton('-');
	zoomOutButton.addEventListener('click', onZoomOutClick, false);
	result.appendChild(zoomOutButton);
	
	// #### hidden for now
	// Report drop down (stored as a global variable)
	/*
	reportSelect = xplorerSelect();
	for(i=0; i < REPORT_TYPE_INDEX.length; i++ ) {
		reportSelect.appendChild(new Option(REPORT_TYPE_INDEX[i],i));
	}
	reportSelect.addEventListener('change', onReportSelectChange, false);
	result.appendChild(reportSelect);
	result.appendChild(htmlBr());
	*/
	
	// Highlight inactive/vacation checkboxes
	result.appendChild(xplorerLabel('Highlight: Inactive'));
	highlightInactiveCheckbox = xplorerCheckbox();
	highlightInactiveCheckbox.checked = false;
	highlightInactiveCheckbox.addEventListener('change', onHighlightCheckboxChange, false);
	result.appendChild(highlightInactiveCheckbox);
	result.appendChild(xplorerLabel('Vacation'));
	highlightVacationCheckbox = xplorerCheckbox();
	highlightVacationCheckbox.checked = false;
	highlightVacationCheckbox.addEventListener('change', onHighlightCheckboxChange, false);
	result.appendChild(highlightVacationCheckbox);

	// Scan
	result.appendChild(xplorerHeading('Scan'));
	scanCenterXInput = xplorerSearchInputDiv(result, 'Center-x', '50px', '');
	scanCenterYInput = xplorerSearchInputDiv(result, 'Center-y', '50px', '');
	scanRangeInput = xplorerSearchInputDiv(result, 'Range', '45px', '5');
	scanDelayMinInput = xplorerSearchInputDiv(result, 'Delay-min', '60px', '5000');
	scanDelayMaxInput = xplorerSearchInputDiv(result, 'Delay-max', '60px', '8000');
	rescanWaitTimeInput = xplorerSearchInputDiv(result, 'Rescan wait (days)', '120px', '7');
	var scanButtonDefs = [{name: 'Scan', onClick: onScanClick}, {name:'WorldScan', onClick: onWorldScanClick}];
	result.appendChild(xplorerButtonsDiv(scanButtonDefs));

	return result;
}

function onNewClick() {
	syslog('onNewClick',1);
}

function onDeleteClick() {
	syslog('onDeleteClick',1);
}

// ?view=worldmap_iso&islandX=43&islandY=42
function onWorldScanClick() {
	if (!windowRef.confirm('This will view/scan world map view at four points. Continue?')) return;
	// four fixed points which cover the whole world map (8 second delay between)
	browseToWithDelay('?view=worldmap_iso&islandX=25&islandY=25', 0, '');
	browseToWithDelay('?view=worldmap_iso&islandX=75&islandY=25', 8000, '');
	browseToWithDelay('?view=worldmap_iso&islandX=25&islandY=75', 16000, '');
	browseToWithDelay('?view=worldmap_iso&islandX=75&islandY=75', 24000, '');
}

function onScanClick() {
	var scanCenterX = parseInt(scanCenterXInput.value);
	var scanCenterY = parseInt(scanCenterYInput.value);
	var scanRange = parseInt(scanRangeInput.value);
	var minDelay = parseInt(scanDelayMinInput.value);
	var maxDelay = parseInt(scanDelayMaxInput.value);
	var rescanWaitTime = parseInt(rescanWaitTimeInput.value);
	var baseDelay = 0;
	var delay = 0;
	var expIslands = [];
	
	// first go through all islands to find the ones which are in range
	// and have not been scanned for over 7 days
	for (var i = 0; i < islands.list.length; i++) {
		var island = islands.list[i];
		if (island.coords.isInRange(scanCenterX, scanCenterY, scanRange)) {
			syslog('Is in range, x=' + island.coords.x + ', y=' + island.coords.y + ', id=' + island.id + ', updated=' + island.daysSinceLastUpdate() + ', citycount=' + island.cityCount);
			// Must have cities and either over 7 days since last update or island view not visited at all
			if((island.cityCount > 0) && ((island.daysSinceLastUpdate() > rescanWaitTime) || (island.processLevel != 3))) {
				expIslands.push(island);
			}
		}
	}
	
	// ask confirmation before proceeding
	var duration = Math.round(((minDelay + maxDelay)/2/1000/60)*expIslands.length);
	syslog((minDelay + maxDelay)/2);
	if (!windowRef.confirm('Found ' + expIslands.length + ' islands to be scanned. Scanning will take ' + duration + ' minutes. Continue?')) return;
	
	// launch scanning
	for (var i = 0; i < expIslands.length; i++) {
		var island = expIslands[i];
		var islandLink = htmlAHref('?view=island&islandId=' + island.id, island.name);
		delay = Math.random() * (maxDelay - minDelay) + minDelay;
		syslog(islandLink.href + ", delay=" + baseDelay);
		var status = '';
		if (i == expIslands.length - 1) status = 'Scanning finished';
		else {
			status = 'Scanning progress ' + (i+1) + '/' + expIslands.length + ' (' + Math.round((expIslands.length-i)/expIslands.length*duration) + ' minutes left)'
		}
		browseToWithDelay(islandLink.href, baseDelay, status);
		baseDelay = baseDelay + delay;
	}
}


function onSearchClick() {
	/*
	syslog('Ikariam Xplorer - Search activated',1);
	updateStatus(alliances, players, islands, cities, 'Search in progress...');
	
	// TODO replace ikaCore with own data
	var searchParams = new ikaCoreSearchParams();
	searchParams.server = ikariamGetServer();
	searchParams.world = ikariamGetWorld();
	searchParams.alliance = allianceInput.value;
	searchParams.player = playerInput.value;
	searchParams.city = cityInput.value;
	if(playerStatusSelect.selectedIndex > 0) {
		searchParams.status = playerStatusSelect.selectedIndex - 1;
	}
	searchParams.distance = distanceSelect.selectedIndex;
	searchParams.luxuryResource = luxuryResourceSelect.selectedIndex;
	if(townHallLevelLowSelect.selectedIndex > 0) searchParams.townHallLevelLow = townHallLevelLowSelect.selectedIndex;
	if(townHallLevelHighSelect.selectedIndex > 0) searchParams.townHallLevelHigh = townHallLevelHighSelect.selectedIndex;
	var milLow = parseInt(militaryScoreLowInput.value);
	if(!isNaN(milLow)) searchParams.militaryScoreLow = milLow;
	var milHigh = parseInt(militaryScoreHighInput.value);
	if(!isNaN(milHigh)) searchParams.militaryScoreHigh = milHigh;

	searchIkaCore(searchParams, SearchResultHandler);
	syslog('Ikariam Xplorer - Search finished',1);
	*/
}

function onClearMapClick() {
	syslog('Ikariam War Room - Clear Map activated',1);
	
	/*
	cities = [];
	players = [];
	alliances = [];
	islands = [];
	drawMap();
	updateLegend(alliances);
	updateStatus(alliances, players, islands, cities, 'Map cleared');
	// TODO replace with filter clear
	*/
	syslog('Ikariam War Room - Clear Map finished',1);
}
function onExportClick() {
	syslog('Ikariam War Room - Export activated',1);
	explore();
	//displayExportWindow(cities, alliances, players);
	updateStatus(alliances, players, islands, cities, 'Export finished');
	syslog('Ikariam War Room - Export finished',1);
}

function onZoomInClick() {
	syslog('onZoomInClick');
	mapScale += 1;
	onZoomChange();
}

function onZoomOutClick() {
	syslog('onZoomOutClick');
	mapScale -= 1;
	if(mapScale < 1) mapScale = 1;
	onZoomChange();
}

function onZoomChange() {
	// calculate the current center position as factor
	var xFactor = (mapContainer.scrollLeft + mapContainer.clientWidth/2) / mapContainer.scrollWidth;
	var yFactor = (mapContainer.scrollTop + mapContainer.clientHeight/2) / mapContainer.scrollHeight;
	drawGrid();
	drawMap();
	// re-position the scrollbars to get a real zoom effect
	mapContainer.scrollLeft = xFactor * mapContainer.scrollWidth - mapContainer.clientWidth/2;
	mapContainer.scrollTop = yFactor * mapContainer.scrollHeight - mapContainer.clientHeight/2;
}

function onReportSelectChange() {
	drawMap();
}

function onHighlightCheckboxChange() {
	drawMap();
}

function createLegendContainer(parent) {
	var result = htmlDiv();
	result.setAttribute('class', 'legendContainer');
	result.setAttribute('style', 'display:none;overflow:auto');
	parent.appendChild(result);
	return result;
}

function createStatusContainer(parent) {
	var result = htmlDiv();
	result.setAttribute('class', 'statusContainer');
	result.setAttribute('style', 'display:none;overflow:auto');
	parent.appendChild(result);
	return result;
}

function createPreviewContainer(parent) {
	var result = htmlDiv();
	result.setAttribute('class', 'previewContainer');
	result.setAttribute('style', 'display:none;overflow:auto');
	parent.appendChild(result);
	result.appendChild(xplorerHeading('Preview'));
	return result;
}

function createMapContainer(parent) {
	var result = htmlDiv();
	result.setAttribute('class', 'mapContainer');
	result.setAttribute('style', 'display:none;overflow:auto');
	result.addEventListener('dragstart', onMapContainerDragStart, false);
	parent.appendChild(result);
	// Heading
	var heading = xplorerHeading('Ikariam Xplorer ' + version);
	
	// Update button
	updateButton = xplorerButton('Update');
	updateButton.setAttribute('class', 'xplorer_Update_button');
	updateButton.style.display = 'none';
	updateButton.addEventListener('click', onUpdateClick, false);
	heading.appendChild(updateButton);
	result.appendChild(heading);
	
	// Canvas
	mapCanvas = document.createElement('canvas');
	//canvas.setAttribute('width', 1000);
	//canvas.setAttribute('height', 1000);
	//canvas.setAttribute('z-index', 10000);
	result.appendChild(mapCanvas);
		
	return result;
}

function onUpdateClick(e) {
	syslog('War Room - version update activated', 1);
	// hides the update button next time the War Room is opened
	GM_deleteValue('xplorer.newVersion');
	// update check will be performed next time the War Room is opened
	// (in case user cancels the installation)
	GM_deleteValue('xplorer.lastUpdateCheck');
	location.href = scriptURL;
}


function onGridSurroundMouseDown(e) {
	if(!e) return;
	var currentX = mapContainer.scrollLeft + e.clientX;
	var currentY = mapContainer.scrollTop + e.clientY;
	dragPrevX = currentX;
	dragPrevY = currentY;
	return false;
}

function onGridSurroundMouseUp(e) {
	if(!e) return;
	var currentX = mapContainer.scrollLeft + e.clientX;
	var currentY = mapContainer.scrollTop + e.clientY;
	mapContainer.scrollLeft = mapContainer.scrollLeft + (dragPrevX-currentX);
	mapContainer.scrollTop = mapContainer.scrollTop + (dragPrevY-currentY);
	return false;
}

// Zoom with mousewheel (center on mouse cursor location)
function onGridSurroundMouseScroll(e) {
	var delta = 0;
	if (e.detail) { 
		delta = -e.detail/3;
	}
	// delta is positive on scroll up and vice versa
	if (delta > 0) mapScale += 1;
	else if (delta < 0) mapScale -= 1;
	if(mapScale < 1) mapScale = 1;
	
	// zoom on mouse cursor location (make it the new center)
	var xFactor = (mapContainer.scrollLeft + e.clientX) / mapContainer.scrollWidth;
	var yFactor = (mapContainer.scrollTop + e.clientY) / mapContainer.scrollHeight;
	drawGrid();
	drawMap();
	// re-position the scrollbars to get a real zoom effect
	mapContainer.scrollLeft = xFactor * mapContainer.scrollWidth - mapContainer.clientWidth/2;
	mapContainer.scrollTop = yFactor * mapContainer.scrollHeight - mapContainer.clientHeight/2;
	
	e.preventDefault();
	return false;
}

function onMapContainerDragStart(e) {
	e.preventDefault();
	return false;
}


function drawGrid () {
	// first remove previous grid elements
	removeElementsByClassname(windowRef.document, 'gridElem', mapContainer);
	removeElementsByClassname(windowRef.document, 'gridSurroundingBox', mapContainer);
	removeElementsByClassname(windowRef.document, 'hTick', mapContainer);
	removeElementsByClassname(windowRef.document, 'vTick', mapContainer);
	
	// vertical grid lines
	for (var i = 0; i < 5; i++) {
		var gridVert = htmlDiv();
		var top = mapYOffset;
		var left = mapXOffset + (i*mapScale*mapScaleRatio)*2;
		var width = mapScale*mapScaleRatio-1;
		var height = mapScale*mapScaleRatio*10-1;
		gridVert.setAttribute('class', 'gridElem');
		gridVert.setAttribute('style', 'z-index:5;width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px');
		//gridVert.addEventListener('selectstart', onMapContainerSelectStart, false);
		mapContainer.appendChild(gridVert);
	}
	
	// horizontal grid lines
	for (var i = 0; i < 5; i++) {
		var gridHoriz = htmlDiv();
		var top = mapYOffset + (i*mapScale*mapScaleRatio)*2;
		var left = mapXOffset;
		var width = mapScale*mapScaleRatio*10-1;
		var height = mapScale*mapScaleRatio-1;
		gridHoriz.setAttribute('class', 'gridElem');
		gridHoriz.setAttribute('style', 'z-index:5;width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px');
		//gridHoriz.addEventListener('selectstart', onMapContainerSelectStart, false);
		mapContainer.appendChild(gridHoriz);
	}
	
	// Surrounding box
	var gridSurr = htmlDiv();
	var top = mapYOffset;
	var left = mapXOffset;
	var width = mapScale*mapScaleRatio*10-2;
	var height = mapScale*mapScaleRatio*10-2;
	gridSurr.setAttribute('class', 'gridSurroundingBox');
	gridSurr.setAttribute('style', 'cursor:all-scroll;z-index:10;width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px');
	gridSurr.addEventListener('mousedown', onGridSurroundMouseDown, false);
	gridSurr.addEventListener('mouseup', onGridSurroundMouseUp, false);
	gridSurr.addEventListener('DOMMouseScroll', onGridSurroundMouseScroll, false);
	mapContainer.appendChild(gridSurr);	
	
	// h-ticks
	for (var i = 1; i < 11; i++) {
		var hTick = htmlDiv();
		var height = 15;
		var top = mapYOffset-height-3;
		var left = mapXOffset + i*mapScale*mapScaleRatio-(mapScale*mapScaleRatio/2);
		var width = mapScale*mapScaleRatio-1;
		hTick.setAttribute('class', 'hTick');
		hTick.textContent = i*10;
		hTick.setAttribute('style', 'z-index:5;width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px');
		//hTick.addEventListener('selectstart', onMapContainerSelectStart, false);
		mapContainer.appendChild(hTick);
	}
	
	// v-ticks
	for (var i = 1; i < 11; i++) {
		var vTick = htmlDiv();
		var height = 15;
		var top = mapYOffset + i*mapScale*mapScaleRatio-height/2;
		var left = mapXOffset + mapScale*mapScaleRatio*10+5;
		var width = 15;
		vTick.setAttribute('class', 'vTick');
		vTick.textContent = i*10;
		vTick.setAttribute('style', 'z-index:5;width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px');
		//vTick.addEventListener('selectstart', onMapContainerSelectStart, false);
		mapContainer.appendChild(vTick);
	}
}

function createIkaCoreAddContainer(parent) {
	var ikaCoreAddFrame = windowRef.document.createElement('iframe');
	ikaCoreAddFrame.setAttribute('id', 'ikaCoreAddContainer');
	ikaCoreAddFrame.setAttribute('scrolling', 'NO');
	//ikaCoreAddFrame.setAttribute('src', 'http://www.ika-core.org/ikariam.html?u=25');
	ikaCoreAddFrame.setAttribute('disabled', 'true');
	parent.appendChild(ikaCoreAddFrame);
	return ikaCoreAddFrame;
}

function refreshSizesAndPositions() {
	syslog('refreshSizesAndPositions started', 3);
	// calculate new map scale ratio
	xRatio = defaultMapScaleRatio * windowRef.outerWidth/defaultWindowWidth;
	yRatio = defaultMapScaleRatio * windowRef.outerHeight/defaultWindowHeight;
	mapScaleRatio = Math.min(xRatio, yRatio);
	// reposition and resize mapContainer
	mapContainer.style.top = 10 + 'px';
	mapContainer.style.left = 10 + 'px';
	mapContainer.style.width = mapScaleRatio*10 + mapXOffset*3 + 'px';
	mapContainer.style.height = mapContainer.style.width;
	mapContainer.style.display = 'block';
	// resize map canvas
	mapCanvas.style.position = 'absolute';
	mapCanvas.style.top = mapYOffset +'px';
	mapCanvas.style.left = mapXOffset + 'px';
	mapCanvas.width = mapScale*mapScaleRatio*10;
	mapCanvas.height = mapScale*mapScaleRatio*10;
	
	// #### testing
	var ctx = mapCanvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(0, 0);  
	ctx.lineTo(mapCanvas.width, 0);
	ctx.lineTo(mapCanvas.width, mapCanvas.height);
	ctx.lineTo(0, mapCanvas.height);
	ctx.lineTo(0, 0);
	ctx.stroke();
	
	// reposition and resize previewContainer
	previewContainer.style.top = mapContainer.offsetTop + 'px';
	previewContainer.style.height = mapContainer.offsetHeight*0.5 + 'px';
	previewContainer.style.left = mapContainer.offsetLeft + mapContainer.offsetWidth + 5 + 'px';
	previewContainer.style.width = windowRef.outerWidth - mapContainer.offsetLeft - mapContainer.offsetWidth - 35 + 'px';
	previewContainer.style.display = 'block';
	// reposition and resize searchContainer
	searchContainer.style.top = previewContainer.offsetTop + previewContainer.offsetHeight + 0 + 'px';
	searchContainer.style.height = mapContainer.offsetHeight*0.5 - 7 + 'px';
	searchContainer.style.left = previewContainer.offsetLeft + 'px';
	searchContainer.style.width = previewContainer.style.width;
	searchContainer.style.display = 'block';
	// reposition and resize legendContainer
	legendContainer.style.top = mapContainer.offsetTop + mapContainer.offsetHeight + 0 + 'px';
	//legendContainer.style.height = '20px';
	legendContainer.style.left = mapContainer.offsetLeft + 'px';
	legendContainer.style.width = mapContainer.offsetWidth + searchContainer.offsetWidth + 2 + 'px';
	legendContainer.style.display = 'block';
	// reposition and resize statusContainer
	statusContainer.style.top = legendContainer.offsetTop + legendContainer.offsetHeight + 0 + 'px';
	//statusContainer.style.height = '20px';
	statusContainer.style.left = mapContainer.offsetLeft + 'px';
	statusContainer.style.width = legendContainer.style.width;
	statusContainer.style.display = 'block';
	// reposition (and resize) ikaCoreAddContainer
	//ikaCoreAddContainer.style.top = statusContainer.offsetTop + statusContainer.offsetHeight + 5 + 'px';
	//ikaCoreAddContainer.style.display = 'block';
	// re-draw grid and map items
	drawGrid();
	drawMap();
	syslog('refreshSizesAndPositions finished', 3);
}

function onWindowResize() {
   if(windowResizeTimeOut != null) clearTimeout(windowResizeTimeOut);
   windowResizeTimeOut = setTimeout(refreshSizesAndPositions, 300);
}

function onWindowKeypress(e) {
	switch (e.keyCode)	{
		case 13:
		  onSearchClick();
		  break;
		default:
		  return;
	}
}

function onAllianceInputKeyUp(e) {
	consoleTime('xplorer.onAllianceInputKeyUp');
	if (allianceInput.value != allianceInput.lastValue) {
		alliances.filterString(allianceInput.value, 'name', 'filterMatch', filterIndex, false, true);
		allianceInput.lastValue = allianceInput.value;
		liveFilter();
	}
	consoleTimeEnd('xplorer.onAllianceInputKeyUp');	
}
function onPlayerInputKeyUp(e) {
	consoleTime('xplorer.onPlayerInputKeyUp');
	if (playerInput.value != playerInput.lastValue) {
		players.filterString(playerInput.value, 'name', 'filterMatch', filterIndex, false, true);
		playerInput.lastValue = playerInput.value;
		liveFilter();
	}
	consoleTimeEnd('xplorer.onPlayerInputKeyUp');
}

function onCityInputKeyUp(e) {
	consoleTime('xplorer.onCityInputKeyUp');
	if (cityInput.value != cityInput.lastValue) {
		cities.filterString(cityInput.value, 'name', 'filterMatch', filterIndex, false, true);
		cityInput.lastValue = cityInput.value;
		liveFilter();
	}
	consoleTimeEnd('xplorer.onCityInputKeyUp');
}

function onSelectChange(e) {
	// #### TODO this must be broken to several event handlers for each item to be performance optimised
	// also now supports only player status which seems to be broken too
	var playerStatus = PLAYER_STATUS_SELECT_INDEX[playerStatusSelect.selectedIndex]
	// case-sensitive since otherwise Active would match also Inactive
	if (playerStatus == 'Any') playerStatus = '';
	players.filterString(playerStatus, 'status', 'filterMatch', filterIndex, false, false);
	liveFilter();
}


function checkVersion() {
	// get the stored last update check time
	var lastUpdateCheck = GM_getValue('xplorer.lastUpdateCheck', 0);
	var now = parseInt(new Date().getTime());
	
	// calculate time elapsed since last update check 
	var performCheck = ((now - parseInt(lastUpdateCheck)) > updateCheckInterval);
	
	// perform update check if necessary
	if (performCheck) {
		syslog('War Room performing update check', 1);
		// get the script source
		try	{
			GM_xmlhttpRequest({
				method: "GET",
				url: scriptMetaURL,
				onload: function(xhr) { checkVersionResponseHandler(xhr.responseText); }
			});
			GM_setValue('xplorer.lastUpdateCheck', '' + now);
		}
		catch(err) {
			syslog('checkVersion, GM_xmlhttpRequest failed: ' + err.description, 1);
		}
	}
	else {
		// also check if an update was found earlier on
		var newVersion = GM_getValue('xplorer.newVersion', '');
		if(newVersion != '') {
			updateButton.value = 'Update to ' + newVersion;
			updateButton.style.display = 'inline-block';
		}
	}
}

function checkVersionResponseHandler(responseText) {
	var lines = responseText.split('\n');
	var latestVersion = null;
	for(i=0; i < lines.length; i++ ) {
		if(lines[i].indexOf(versionTag) != -1) {
			// extract the version info from line (excluding any whitespace)
			latestVersion = lines[i].substr(versionTag.length).replace(/^\s*|\s*$/g,'');
		}
	}
	if(!latestVersion) {
		syslog('War Room - version information not found in the latest script source', 1);
		return;
	}
	if (version != latestVersion) {
		syslog('War Room, new version available (current: ' + version + ' new: ' + latestVersion + ')', 1);
		updateButton.value = 'Update to ' + latestVersion;
		updateButton.style.display = 'inline-block';
		GM_setValue('xplorer.newVersion', latestVersion);
	}
}

function browseToWithDelay(href, delay, status) {
	windowRef.setTimeout(function() {
		syslog('href=' + href + ', delay=' + delay);
		window.location = href;
		updateStatus(alliances, players, islands, cities, status);
	}, delay);
}

function displayExportWindow (cities, alliances, players) {
	// TODO modify to expect a sortedList instead of an array of items
    var windowName  = 'War Room Export';
	var windowWidth = 900;
	var windowHeight = 800;
    var windowOptions  = 'width='+windowWidth+',height='+windowHeight+',status=no,toolbar=0,copyhistory=no,';
    windowOptions += 'location=no,scrollbars=yes,menubar=no,directories=no';
    var windowRef = window.open('', windowName, windowOptions);

	windowRef.document.write('<html><head><title>Ikariam War Room Export (by bt_viper)</title>');
	windowRef.document.write(xplorerCSS());
	windowRef.document.write('</head><body></body></html>');
	windowRef.document.close();
	
	// Theta Atiens text area
	var thetaCaption = windowRef.document.createElement('h3');
	thetaCaption.textContent = "Theta Atien's Alliance Map - Embassy Input format";
	var thetaTextArea = windowRef.document.createElement('textarea');
	thetaTextArea.setAttribute('rows','10');
	thetaTextArea.setAttribute('cols','100');
	var thetaText = '';
	for (var i = 0; i < cities.length; i++) {
		thetaText += cities[i].toThetaAtiensString();
		if(i < cities.length-1) thetaText += '\n';
	}
	thetaTextArea.textContent = thetaText;
	
	// Players in CSV format
	var playersCaption = windowRef.document.createElement('h3');
	playersCaption.textContent = "Player data in CSV format (ready for Excel import)";
	var playersTextArea = windowRef.document.createElement('textarea');
	playersTextArea.setAttribute('rows','10');
	playersTextArea.setAttribute('cols','100');
	var playersText = '"Player name";"Alliance";"Status";"Score";"Generals";"Gold";\n';
	for (var i = 0; i < players.length; i++) {
		playersText += players[i].toCSVString();
		if(i < players.length-1) playersText += '\n';
	}
	playersTextArea.textContent = playersText;
	
	// Cities in CSV format
	var citiesCaption = windowRef.document.createElement('h3');
	citiesCaption.textContent = "City data in CSV format (ready for Excel import)";
	var citiesTextArea = windowRef.document.createElement('textarea');
	citiesTextArea.setAttribute('rows','10');
	citiesTextArea.setAttribute('cols','100');
	var citiesText = '"City";"TownHallSize";"Island";"X-coordinate";"Y-coordinate";"Luxury";"Player";"Alliance";"Status";"Score";"Generals";"Gold";\n';
	for (var i = 0; i < cities.length; i++) {
		citiesText += cities[i].toCSVString();
		if(i < cities.length-1) {
			citiesText += '\n';
		}
	}
	citiesTextArea.textContent = citiesText;

	var body = windowRef.document.body;
	body.appendChild(thetaCaption);
	body.appendChild(thetaTextArea);
	body.appendChild(playersCaption);
	body.appendChild(playersTextArea);
	body.appendChild(citiesCaption);
	body.appendChild(citiesTextArea);
	
	windowRef.document.close();
}


// this is run is page script context
function fireNewMapWindow () {
    var windowName  = 'xplorer';
    var newWindow = window.open ('about:blank', '_blank', "height=800,width=1250");
    newWindow.addEventListener (
        "load",
        function () {
 			onDisplayMapWindow (newWindow)
        },
        false
    );
}

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

function displayMapWindow() {
	// first export onDisplayMapWindow function to the page script domain
	exportFunction(onDisplayMapWindow, unsafeWindow, {defineAs: "onDisplayMapWindow"});
	// then trigger the new window creation
	addJS_Node (null, null, fireNewMapWindow);
}

function onDisplayMapWindow (newWindow) {
	syslog('displayMapWindow started', 3);
	consoleTime('xplorer.displayMapWindow');
	windowRef = newWindow;
	doc = windowRef.document;
	doc.write('<html><head><title>Ikariam Xplorer</title>');
	doc.write(xplorerCSS());
	doc.write('</head><body></body></html>');
	doc.close();
		
	// create the containers
	searchContainer = createSearchContainer(windowRef.document.body);
	previewContainer = createPreviewContainer(windowRef.document.body);
	mapContainer = createMapContainer(windowRef.document.body);
	legendContainer = createLegendContainer(windowRef.document.body);
	statusContainer = createStatusContainer(windowRef.document.body);
		
	// add a listener for browser window resize
	windowRef.addEventListener('resize', onWindowResize, false);
	
	// add a listener for key presses
	windowRef.addEventListener('keypress', onWindowKeypress, false);
		
	// load the data
	xplorerDB.load();
	alliances = xplorerDB.alliances;
	players = xplorerDB.players;
	islands = xplorerDB.islands;
	cities = xplorerDB.cities;
	
	// get own cities and update city relationships
	var ownCities = ikariamGetOwnCities();
	for (var i = 0; i < ownCities.length; i++) {
		var ownCity = ownCities[i];
		var city = getArrayItemByID(cities.list, ownCity.id);
		if(city) {
			city.relationship = ownCity.relationship;
			if(ownCity.selected) {
					city.selected = true;
					selectedOwnCity = city;
			}
		}
	}

	// set the correct sizes and positions to the elements
	refreshSizesAndPositions();
	
	// update legend
	updateLegend(alliances);
	
	// update status
	updateStatus(alliances, players, islands, cities, '');
	
	// perform version update check
	// checkVersion();
	
	consoleTimeEnd('xplorer.displayMapWindow');
	
	syslog('displayMapWindow finished', 3);
}


function xplorerCSS() {
	var result = '														\
        <style type="text/css">											\
					table { border-collapse: collapse; }				\
																		\
					.xplorer_searchDiv {								\
						float: left;									\
						margin: 1px;									\
						//clear: right;									\
					}													\
																		\
					.xplorer_heading {									\
						color: #d9eef7;									\
						background: -moz-linear-gradient(top,  #00adee,  #0078a5);	\
						outline: none;									\
						text-align: center;								\
						text-decoration: none;							\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						font: 16px/100% Arial, Helvetica, sans-serif;	\
						font-weight:bold;								\
						height: 20px;									\
						padding: .3em .5em .3em;						\
						margin: 0px;									\
						-moz-border-radius: 7px 7px 0 0;				\
					}													\
																		\
					.xplorer_caption, .xplorer_label {					\
						color: black;									\
						background-color: white;						\
						text-align: left;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						font: 14px/100% Arial, Helvetica, sans-serif;	\
						padding: 3px;									\
						margin: 0px;									\
					}													\
																		\
					.xplorer_button {									\
						color: #e9e9e9;									\
						border: solid 1px #555;							\
						background: -moz-linear-gradient(top,  #888,  #575757);	\
						display: inline-block;							\
						outline: none;									\
						cursor: pointer;								\
						text-align: center;								\
						text-decoration: none;							\
						font: 14px/100% Arial, Helvetica, sans-serif;	\
						font-weight:bold;								\
						padding: .3em 1em .3em;							\
						margin: 5px;									\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						-moz-border-radius: .5em;						\
						-moz-box-shadow: 0 2px 4px rgba(0,0,0,.4);		\
					}													\
					.xplorer_button:hover {								\
						text-decoration: none;							\
						background: -moz-linear-gradient(top,  #757575,  #4b4b4b);\
					}													\
					.xplorer_button:active {							\
						color: #afafaf;									\
						background: -moz-linear-gradient(top,  #575757,  #888);	\
						position: relative;								\
						top: 1px;										\
					}													\
																		\
					.xplorer_Update_button {							\
						color: #e8f0de;									\
						border: solid 1px #538312;						\
						background: -moz-linear-gradient(top,  #7db72f,  #4e7d0e);	\
						display: inline-block;							\
						outline: none;									\
						cursor: pointer;								\
						vertical-align: middle;							\
						text-align: center;								\
						text-decoration: none;							\
						font: 12px/100% Arial, Helvetica, sans-serif;	\
						font-weight:bold;								\
						//padding: .3em 1em .3em;						\
						margin: 0px 0px 0px 20px;						\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						-moz-border-radius: .5em;						\
							-moz-box-shadow: 0 2px 4px rgba(0,0,0,.4);	\
					}													\
					.xplorer_Update_button:hover {						\
						text-decoration: none;							\
						background: -moz-linear-gradient(top,  #6b9d28,  #436b0c);	\
					}													\
					.xplorer_Update_button:active {						\
						color: #a9c08c;									\
						background: -moz-linear-gradient(top,  #4e7d0e,  #7db72f);	\
						position: relative;								\
						top: 1px;										\
					}													\
																		\
					.xplorer_input {									\
						background-color: white;						\
						color: black;									\
						padding: 2px;									\
						margin: 3px;									\
						font: 12px/100% Arial, Helvetica, sans-serif;	\
						//font: 12px/100% Cambria, Arial;				\
                        font-weight:normal;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						-moz-border-radius: 2px;						\
						-moz-box-shadow: 0 1px 2px rgba(0,0,0,.4);		\
					}													\
																		\
					.xplorer_select, .xplorer_checkbox {				\
						background-color: white;						\
						color: black;									\
						padding: 3px;									\
						margin: 5px;									\
						font: 12px/100% Arial, Helvetica, sans-serif;	\
                        font-weight:normal;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						-moz-border-radius: 4px;						\
						-moz-box-shadow: 0 2px 4px rgba(0,0,0,.4);		\
					}													\
																		\
					.xplorer_th {										\
						color: #e9e9e9;									\
						//background-color: lightgrey;					\
						background: -moz-linear-gradient(top,  #888,  #575757);	\
						//color: black;									\
						height: 15px;									\
						padding: 2px;									\
						margin: 1px;									\
						font: 12px/100% Arial, Helvetica, sans-serif;	\
						font-weight:normal;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
					}													\
					.xplorer_td {										\
						background-color: white;						\
						color: black;									\
						padding: 3px;									\
						margin: 1px;									\
						font: 12px/100% Arial, Helvetica, sans-serif;	\
						font-weight:normal;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
					}													\
																		\
					.mdbPlayer {										\
                        position: absolute;								\
                        width: 5px;										\
                        height: 5px;									\
                        border: 1px solid black;						\
                    }													\
					.mdbIsland, .ownmdbIsland {							\
                        position: absolute;								\
                        border: 1px solid LightGray;						\
                    }													\
					.searchContainer, .previewContainer {				\
                        position: absolute;								\
						padding: 0px;									\
						margin: 0px;									\
						border: 2px solid grey;							\
						-moz-border-radius: 6px;						\
						-moz-box-shadow: 0 2px 4px rgba(0,0,0,.4);		\
					}													\
					.statusContainer, .legendContainer {				\
						color: #e9e9e9;									\
						border: solid 1px #555;							\
						background: -moz-linear-gradient(top,  #888,  #575757);	\
						//background-color: lightgrey;					\
						font: 10px/100% Arial, Helvetica, sans-serif;	\
                        font-weight:normal;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
					    position: absolute;								\
						height: 15px;									\
						padding: 0px;									\
						margin: 0px;									\
						border: 1px solid grey;							\
						-moz-border-radius: 4px;						\
						-moz-box-shadow: 0 2px 4px rgba(0,0,0,.4);		\
					}													\
																		\
					.mapContainer {										\
                        position: absolute;								\
						padding: 0px;									\
						margin: 0px;									\
						border: 3px solid grey;							\
						-moz-border-radius: 10px;						\
						-moz-box-shadow: 0 2px 4px rgba(0,0,0,.4);		\
					}													\
																		\
					.gridSurroundingBox {								\
                        position: absolute;								\
						padding: 0px;									\
						margin: 0px;									\
						border: 2px solid grey;							\
					}													\
																		\
					.gridElem {											\
                        position: absolute;								\
						padding:0px;									\
						margin:0px;										\
						border: 1px dashed gray;						\
                    }													\
																		\
					.hTick {											\
                        position: absolute;								\
						padding:0px;									\
						margin:0px;										\
						font-size: 15px;								\
                        font-weight:bold;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						text-align: center;								\
						border: none;									\
                    }													\
					.vTick {											\
                        position: absolute;								\
						padding:0px;									\
						margin:0px;										\
						font-size: 15px;								\
                        font-weight:bold;								\
						text-shadow: 0 1px 1px rgba(0,0,0,.3);			\
						text-align: left;								\
						border: none;									\
                    }													\
	       </style>														\
    ';
	return result;
}


function processIslandView() {
	syslog('processIslandView started', 1);
	// load the existing content to the database
	xplorerDB.load();
		
	// get a reference to an existing island or create a new one
	var islandId = ikariamIslandViewGetIslandId();
	var island = xplorerDB.islands.find(islandId);
	if (!island) island = xplorerDB.addIsland(islandId);
	ikariamIslandViewGetIslandInfo(island);

	// get a reference to avatar(=player) scores
	var avatarScores = unsafeWindow.ikariam.backgroundView.screen.data.avatarScores;
	
	// get a list of city infos
	var cityInfs = ikariamIslandViewGetCityInfos();
	island.cityCount = 0;
	for (i = 0; i < cityInfs.length; i++ ) {
		var cityInfo = cityInfs[i];
		// city id (skip empty building places)
		var cityId  = ikariamIslandViewGetCityId(cityInfo);
		if (cityId == -1) continue;
		island.cityCount = island.cityCount + 1;
				
		// get a reference to an existing alliance or create a new one
		var allianceId = ikariamIslandViewGetAllianceId(cityInfo);
		var alliance = xplorerDB.alliances.find(allianceId);
		if (!alliance) alliance = xplorerDB.addAlliance(allianceId);
		ikariamIslandViewGetAllianceInfo(cityInfo, alliance);

		// get a reference to an existing player or create a new one
		var playerId = ikariamIslandViewGetPlayerId(cityInfo);
		var player = xplorerDB.players.find(playerId);
		if (!player) player = xplorerDB.addPlayer(playerId, alliance);
		ikariamIslandViewGetPlayerInfo(cityInfo, avatarScores, player);
		// Added 7.7.2015
		if(player.allianceId != alliance.id) xplorerDB.movePlayer(player, alliance);
		
		// get a reference to an existing city or create a new one
		var city = xplorerDB.cities.find(cityId);
		if (!city) city = xplorerDB.addCity(cityId, player, island);
		ikariamIslandViewGetCityInfo(cityInfo, city);
		// Added 5.7.2015
		// check if city has been moved from an island to another
		if(city.islandId != island.id) xplorerDB.moveCity(city, island);
	}
	
	// store permanently to GM cache
	xplorerDB.save();
	
	syslog('processIslandView finished', 1);
}


function processAllyList() {
	syslog('Process Ally list started', 1);
	// load the existing content to the database
	this.db.load();

	// get a reference to an existing alliance or create a new one
	var allianceId = ikariamAllyListViewGetAllianceId();
	var alliance = this.db.alliances.find(allianceId);
	if (!alliance) alliance = this.db.addAlliance(allianceId);
	ikariamAllyListViewGetAllianceInfo(alliance);
	
	// get the member entries (=players)
	var playerInfos = ikariamAllyListViewGetPlayerInfos();
	for (i = 0; i < playerInfos.length; i++ ) {
		var playerInfo = playerInfos[i];

		// get a reference to an existing player or create a new one
		var playerId = ikariamAllyListViewGetPlayerId(playerInfo);
		var player = this.db.players.find(playerId);
		if (!player) player = this.db.addPlayer(playerId, alliance);
		ikariamAllyListViewGetPlayerInfo(playerInfo, player);

		// player's city information
		var cityInfos = ikariamAllyListViewGetCityInfos(playerInfo);
		for(j=0; j < cityInfos.length; j++ ) {
			var cityInfo = cityInfos[j];

			// get a reference to an existing island or create a new one
			var islandId = ikariamAllyListViewGetIslandId(cityInfo);
			var island = this.db.islands.find(islandId);
			if (!island) island = this.db.addIsland(islandId);
			ikariamAllyListViewGetIslandInfo(cityInfo, island);

			// get a reference to an existing city or create a new one
			var cityId = ikariamAllyListViewGetCityId(cityInfo);
			var city = this.db.cities.find(cityId);
			if (!city) city = this.db.addCity(cityId, player, island);
			ikariamAllyListViewGetCityInfo(cityInfo, city);
		}
	}
	// store permanently to GM cache
	this.db.save();
	syslog('Process Ally list finished', 1);
}

function processMilitaryMovementsView() {
	// get the military movements
	var movementInfos = ikariamMilitaryMovementsViewGetMovementInfos();
	for (i = 1; i < movementInfos.length; i++ ) { 	// first item heading row
		var movementInfo = movementInfos[i];

		// ####
		consoleDir(movementInfo);
		
		// get a reference to an existing movement or create a new one
		var movementId = ikariamMilitaryMovementsViewGetMovementId(movementInfo);
		
		// ####
		syslog(movementId,1);
	}
}

function worldMapViewOnLoad(JSONResponse) {
	worldMapViewOriginalHandleMapData(JSONResponse);
	// GM prevents from directly calling GM_* function from unsafeWindow callbacks
	setTimeout(function() {processWorldMapView();}, 0);
}

function initWorldMapView() {
	syslog('InitWorldMapView started', 1);
	// hook into world map view's map data handler
	worldMapViewOriginalHandleMapData = unsafeWindow.worldmap.handleMapData;
	unsafeWindow.worldmap.handleMapData = worldMapViewOnLoad;
	syslog('InitWorldMapView finished', 1);
}

function processWorldMapView() {
	syslog('processWorldMapView started', 1);	
	xplorerDB.load();
	var islands = unsafeWindow.ikariam.backgroundView.screen.islands;
	var islandCount = 0;
	// #### DEBUG
	syslog('islands.length=' + islands.length);
	var minX=100;
	var minY=100;
	var maxX=0;
	var maxY=0;
	for (i = 1; i < islands.length; i++ ) { 
		if(!islands[i]) continue;
		for (j = 1; j < islands[i].length; j++ ) {
			if((!islands[i][j]) || (!islands[i][j][0]) || (islands[i][j] == 'ocean')) continue;
			var islandId = parseInt(islands[i][j][0]);
			var island = xplorerDB.islands.find(islandId);
			if (!island) island = xplorerDB.addIsland(islandId);
			ikariamWorldMapViewGetIslandInfo(islands[i][j], island);
			island.coords.x = i;
			island.coords.y = j;
			islandCount++;
			// #### DEBUG
			if(i<minX) minX=i;
			if(i>maxX) maxX=i;
			if(j<minY) minY=j;
			if(j>maxY) maxY=j;
		}
	}
	xplorerDB.save();
	
	syslog('coords=[' + minX + ':' + minY + '] -> [' + + maxX + ':' + maxY + ']');
	syslog('processWorldMapView finished (' + islandCount + ')', 1);
	
	/*
	
wonderText = new Array();
wonderText[1] = 'Hephaistoksen paja';
wonderText[2] = 'Hadesin pyhä lehto';
wonderText[3] = 'Demeterin puutarhat';
wonderText[4] = 'Athenen temppeli';
wonderText[5] = 'Hermeksen temppeli';
wonderText[6] = 'Aresin linnake';
wonderText[7] = 'Poseidonin temppeli';
wonderText[8] = 'Kolossus';
*/
	
}

/**************************************************** 
				Script initialisation
****************************************************/
// only init if GF_toolbar is present
if (document.getElementById('GF_toolbar')) {
	var xp = new xplorer();
	xp.init();
	xp.processViews();
}